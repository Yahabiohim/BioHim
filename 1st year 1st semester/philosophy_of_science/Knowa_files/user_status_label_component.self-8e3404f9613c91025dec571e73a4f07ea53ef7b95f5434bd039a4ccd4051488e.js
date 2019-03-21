(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.UserStatusLabelComponent = (function() {
    function UserStatusLabelComponent() {
      this.handleStatusChannelMessage = bind(this.handleStatusChannelMessage, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.statusChannel = AblyRealtimeClient.channels.get("users:online-status");
      this.channelData = [
        {
          channel: this.statusChannel,
          subscriber: this.handleStatusChannelMessage
        }
      ];
    }

    UserStatusLabelComponent.prototype.setup = function() {
      return $setupChannelSubscriptions(this.channelData);
    };

    UserStatusLabelComponent.prototype.teardown = function() {
      return $teardownChannelSubscriptions(this.channelData);
    };

    UserStatusLabelComponent.prototype.handleStatusChannelMessage = function(channelMessage) {
      var statusLabels;
      statusLabels = $beById('user-status-label', channelMessage.data.userId);
      if (statusLabels.length < 1) {
        return;
      }
      switch (channelMessage.data.status) {
        case "online":
          return statusLabels.text("Online").removeClass('offline').addClass('online');
        case "offline":
          return statusLabels.text("Offline").removeClass('online').addClass('offline');
      }
    };

    return UserStatusLabelComponent;

  })();

}).call(this);
