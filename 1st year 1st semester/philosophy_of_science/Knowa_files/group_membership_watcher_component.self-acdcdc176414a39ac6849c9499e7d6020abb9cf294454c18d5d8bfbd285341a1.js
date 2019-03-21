(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.GroupMembershipWatcherComponent = (function() {
    function GroupMembershipWatcherComponent() {
      this.teardown = bind(this.teardown, this);
      this.handleGroupMembershipChange = bind(this.handleGroupMembershipChange, this);
      this.setup = bind(this.setup, this);
      this.schemeMembershipWatcher = new SchemeMembershipWatcherComponent();
      this.groupId = $be('group-resource').data('id');
      this.redirectToOnLeave = $be('group-resource').data('redirect-to-on-leave');
      this.groupMembershipChannel = AblyRealtimeClient.channels.get("groups:membership");
      this.channelData = [
        {
          channel: this.groupMembershipChannel,
          subscriber: this.handleGroupMembershipChange
        }
      ];
    }

    GroupMembershipWatcherComponent.prototype.setup = function() {
      this.schemeMembershipWatcher.setup();
      return $setupChannelSubscriptions(this.channelData);
    };

    GroupMembershipWatcherComponent.prototype.handleGroupMembershipChange = function(channelMessage) {
      var flash, groupModel;
      groupModel = new GroupModel(channelMessage.data.group);
      if (groupModel.id !== this.groupId) {
        return;
      }
      if (!groupModel.isAccessible($currentUserId())) {
        flash = {
          level: "warning",
          text: "You've left the group."
        };
        sessionStorage.setItem("clientFlashMessage", JSON.stringify(flash));
        return Turbolinks.visit(this.redirectToOnLeave);
      }
    };

    GroupMembershipWatcherComponent.prototype.teardown = function() {
      this.schemeMembershipWatcher.teardown();
      return $teardownChannelSubscriptions(this.channelData);
    };

    return GroupMembershipWatcherComponent;

  })();

}).call(this);
