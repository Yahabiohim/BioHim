(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.UnreadBadgesComponent = (function() {
    function UnreadBadgesComponent(containerBehavior, containerIdMessageField, channel) {
      this.getBadgeWithCounter = bind(this.getBadgeWithCounter, this);
      this.increaseCounter = bind(this.increaseCounter, this);
      this.hideZeroBadges = bind(this.hideZeroBadges, this);
      this.handleUnreadsChannelMessage = bind(this.handleUnreadsChannelMessage, this);
      this.refresh = bind(this.refresh, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.containerBehavior = containerBehavior;
      this.badgeBehavior = 'notification-badge';
      this.containerIdMessageField = containerIdMessageField;
      this.updatesChannel = AblyRealtimeClient.channels.get(channel);
      this.channelData = [
        {
          channel: this.updatesChannel,
          subscriber: this.handleUnreadsChannelMessage
        }
      ];
    }

    UnreadBadgesComponent.prototype.setup = function() {
      this.refresh();
      return $setupChannelSubscriptions(this.channelData);
    };

    UnreadBadgesComponent.prototype.teardown = function() {
      return $teardownChannelSubscriptions(this.channelData);
    };

    UnreadBadgesComponent.prototype.refresh = function() {
      return this.hideZeroBadges();
    };

    UnreadBadgesComponent.prototype.handleUnreadsChannelMessage = function(channelMessage) {
      var containerId, containerIds, j, len, results, threadModel;
      containerIds = channelMessage.data[this.containerIdMessageField];
      if (!(containerIds && (channelMessage.name === 'message-create'))) {
        return;
      }
      threadModel = new ThreadModel(channelMessage.data.thread);
      if (!threadModel.isMemberId($currentUserId())) {
        return;
      }
      if (!(containerIds instanceof Array)) {
        containerIds = [containerIds];
      }
      results = [];
      for (j = 0, len = containerIds.length; j < len; j++) {
        containerId = containerIds[j];
        results.push(this.increaseCounter(containerId));
      }
      return results;
    };

    UnreadBadgesComponent.prototype.hideZeroBadges = function() {
      return $be(this.badgeBehavior).each(function(i, badge) {
        if ($(badge).text() === "0") {
          return $(badge).hide();
        }
      });
    };

    UnreadBadgesComponent.prototype.increaseCounter = function(containerId) {
      var currentCounter, ref, unreadBadge;
      ref = this.getBadgeWithCounter(containerId), unreadBadge = ref[0], currentCounter = ref[1];
      if (!unreadBadge) {
        return;
      }
      unreadBadge.show();
      return unreadBadge.text(currentCounter + 1);
    };

    UnreadBadgesComponent.prototype.getBadgeWithCounter = function(containerId) {
      var currentCounter, targetContainer, unreadBadge;
      targetContainer = $beById(this.containerBehavior, containerId);
      if (targetContainer.length === 0) {
        return [null, null];
      }
      unreadBadge = targetContainer.find("[data-behavior~='" + this.badgeBehavior + "']");
      currentCounter = parseInt(unreadBadge.text(), 10);
      return [unreadBadge, currentCounter];
    };

    return UnreadBadgesComponent;

  })();

}).call(this);
