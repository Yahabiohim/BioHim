(function() {
  this.$be = function(behavior) {
    return $("[data-behavior~=" + behavior + "]");
  };

  this.$beById = function(behavior, id) {
    return $("[data-behavior~=" + behavior + "][data-id=" + id + "]");
  };

  this.$setupChannelSubscriptions = function(channelData) {
    var cd, i, len, results;
    results = [];
    for (i = 0, len = channelData.length; i < len; i++) {
      cd = channelData[i];
      results.push(cd.channel.subscribe(cd.subscriber));
    }
    return results;
  };

  this.$teardownChannelSubscriptions = function(channelData) {
    var cd, i, len, results;
    results = [];
    for (i = 0, len = channelData.length; i < len; i++) {
      cd = channelData[i];
      results.push(cd.channel.unsubscribe(cd.subscriber));
    }
    return results;
  };

  this.$generateFlashMessage = function(level, message, container) {
    var alertElement, flashContainer;
    if (container && container.length) {
      flashContainer = container;
    } else {
      flashContainer = $be('flash-container');
    }
    alertElement = $("<div 'data-behavior'='flash-message' class='alert is-" + level + "'>" + message + "</div>");
    flashContainer.html(alertElement);
    return alertElement;
  };

  this.$delayedRemove = function(element) {
    if (element.length) {
      return setTimeout(function() {
        return element.remove();
      }, 4000);
    }
  };

  this.$showFlashMessage = function(level, message, container) {
    var alertElement;
    alertElement = $generateFlashMessage(level, message, container);
    return $delayedRemove(alertElement);
  };

  this.$currentUserId = function() {
    return this.$currentUser().id;
  };

  this.$currentUser = (function(_this) {
    return function() {
      if (_this.$currentUserModel) {
        return _this.$currentUserModel;
      }
      return _this.$currentUserModel = new CurrentUserModel(window.currentUserData);
    };
  })(this);

  this.$currentAccountId = function() {
    return $be('app-layout').data('current-account-id');
  };

  this.$currentMainSchemeId = function() {
    return $be('app-layout').data('current-main-scheme-id');
  };

  this.$currentThread = function() {
    var threadPage, type;
    threadPage = $('[data-category=thread-page]');
    if (threadPage.length > 0) {
      switch (threadPage.data('behavior')) {
        case 'chat-page':
          type = 'chat';
          break;
        case 'discussion-page':
          type = 'discussion';
      }
      return {
        id: threadPage.data('id'),
        type: type
      };
    } else {
      return null;
    }
  };

  this.$isCurrentUserId = function(id) {
    return parseInt($currentUserId(), 10) === parseInt(id, 10);
  };

  this.$setTimestampContent = function(element) {
    var messageTime, shortTimestamp, timestamp, today, yesterday;
    today = moment().startOf('day');
    yesterday = moment().startOf('day').subtract(1, 'day');
    messageTime = moment.utc(element.data('datetime')).local();
    shortTimestamp = messageTime.format("h:mma");
    if (messageTime.format('L') === today.format('L')) {
      timestamp = shortTimestamp;
    } else if (messageTime.format('L') === yesterday.format('L')) {
      timestamp = 'yesterday, ' + shortTimestamp;
    } else {
      timestamp = messageTime.format("MMM Do h:mma");
    }
    return element.html(timestamp);
  };

  this.$findGetParameter = function(parameterName) {
    var i, item, items, len, result, tmp;
    result = null;
    tmp = [];
    items = location.search.substr(1).split("&");
    for (i = 0, len = items.length; i < len; i++) {
      item = items[i];
      tmp = item.split("=");
      if (tmp[0] === parameterName) {
        return decodeURIComponent(tmp[1]);
      }
    }
  };

}).call(this);
