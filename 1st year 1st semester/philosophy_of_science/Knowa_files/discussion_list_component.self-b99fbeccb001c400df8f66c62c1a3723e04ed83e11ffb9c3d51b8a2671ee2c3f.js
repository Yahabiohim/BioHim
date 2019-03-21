(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.DiscussionListComponent = (function() {
    var updateDiscussionsTimestamps;

    function DiscussionListComponent(listContainer, options) {
      this.listUpdateNeeded = bind(this.listUpdateNeeded, this);
      this.update = bind(this.update, this);
      this.handleGroupMembershipChange = bind(this.handleGroupMembershipChange, this);
      this.handleDiscussionsChannelMessage = bind(this.handleDiscussionsChannelMessage, this);
      this.handleUpdatesChannelMessage = bind(this.handleUpdatesChannelMessage, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.afterUpdate = options.afterUpdate;
      this.listContainer = listContainer;
      this.listFetchPath = listContainer.data('fetch-path');
      this.listSourceType = listContainer.data('source-type');
      this.listSourceIds = listContainer.data('source-ids');
      this.discussionGroupLink = $be('discussion-group-link');
      this.updatesChannel = AblyRealtimeClient.channels.get("discussions:updates");
      this.discussionsChannel = AblyRealtimeClient.channels.get("groups:discussions");
      this.groupMembershipChannel = AblyRealtimeClient.channels.get("groups:membership");
      this.channelData = [
        {
          channel: this.updatesChannel,
          subscriber: this.handleUpdatesChannelMessage
        }, {
          channel: this.discussionsChannel,
          subscriber: this.handleDiscussionsChannelMessage
        }
      ];
      if (options.refreshOnGroupMembershipChange) {
        this.channelData.push({
          channel: this.groupMembershipChannel,
          subscriber: this.handleGroupMembershipChange
        });
      }
    }

    DiscussionListComponent.prototype.setup = function() {
      $setupChannelSubscriptions(this.channelData);
      updateDiscussionsTimestamps();
      return this.discussionGroupLink.on('click', function(e) {
        e.preventDefault();
        return Turbolinks.visit($(e.target).data('path'));
      });
    };

    DiscussionListComponent.prototype.teardown = function() {
      return $teardownChannelSubscriptions(this.channelData);
    };

    DiscussionListComponent.prototype.handleUpdatesChannelMessage = function(channelMessage) {
      var ref;
      if (!(this.listSourceType === 'group' && (ref = channelMessage.data.group.id, indexOf.call(this.listSourceIds, ref) >= 0))) {
        return;
      }
      return $.getScript(this.listFetchPath);
    };

    DiscussionListComponent.prototype.handleDiscussionsChannelMessage = function(channelMessage) {
      if (!(this.listFetchPath && this.listUpdateNeeded(channelMessage))) {
        return;
      }
      return $.getScript(this.listFetchPath);
    };

    DiscussionListComponent.prototype.handleGroupMembershipChange = function(channelMessage) {
      var ref;
      if (ref = $currentUserId(), indexOf.call(channelMessage.data.affectedUserIds, ref) >= 0) {
        return $.getScript(this.listFetchPath);
      }
    };

    DiscussionListComponent.prototype.update = function(listContent) {
      this.listContainer.html(listContent);
      updateDiscussionsTimestamps();
      if (this.afterUpdate) {
        return this.afterUpdate();
      }
    };

    updateDiscussionsTimestamps = function() {
      var el, i, len, ref, results;
      ref = $be('last-message-timestamp');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        el = ref[i];
        results.push($setTimestampContent($(el)));
      }
      return results;
    };

    DiscussionListComponent.prototype.listUpdateNeeded = function(channelMessage) {
      var ref, ref1;
      return (this.listSourceType === 'scheme' && (ref = channelMessage.data.schemeId, indexOf.call(this.listSourceIds, ref) >= 0)) || (this.listSourceType === 'group' && (ref1 = channelMessage.data.groupId, indexOf.call(this.listSourceIds, ref1) >= 0));
    };

    return DiscussionListComponent;

  })();

}).call(this);
