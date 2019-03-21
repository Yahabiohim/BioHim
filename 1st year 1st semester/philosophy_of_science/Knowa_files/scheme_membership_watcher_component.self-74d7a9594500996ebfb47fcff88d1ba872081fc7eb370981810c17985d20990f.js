(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.SchemeMembershipWatcherComponent = (function() {
    function SchemeMembershipWatcherComponent() {
      this.teardown = bind(this.teardown, this);
      this.handleSchemeMembershipChange = bind(this.handleSchemeMembershipChange, this);
      this.setup = bind(this.setup, this);
      this.schemeId = $be('scheme-resource').data('id');
      this.schemesMembershipChannel = AblyRealtimeClient.channels.get("schemes:membership-" + this.schemeId);
      this.channelData = [
        {
          channel: this.schemesMembershipChannel,
          subscriber: this.handleSchemeMembershipChange
        }
      ];
    }

    SchemeMembershipWatcherComponent.prototype.setup = function() {
      return $setupChannelSubscriptions(this.channelData);
    };

    SchemeMembershipWatcherComponent.prototype.handleSchemeMembershipChange = function(channelMessage) {
      var flash;
      if (channelMessage.data.indexOf($currentUserId()) > -1) {
        flash = {
          level: "warning",
          text: "Membership in current space was changed."
        };
        sessionStorage.setItem("clientFlashMessage", JSON.stringify(flash));
        return Turbolinks.visit(window.location);
      }
    };

    SchemeMembershipWatcherComponent.prototype.teardown = function() {
      return $teardownChannelSubscriptions(this.channelData);
    };

    return SchemeMembershipWatcherComponent;

  })();

}).call(this);
