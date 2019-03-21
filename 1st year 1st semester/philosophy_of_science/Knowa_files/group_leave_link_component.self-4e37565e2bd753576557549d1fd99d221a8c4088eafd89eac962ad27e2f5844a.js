(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.GroupLeaveLinkComponent = (function() {
    function GroupLeaveLinkComponent(groupId) {
      this.toggle = bind(this.toggle, this);
      this.updateLinkAvailability = bind(this.updateLinkAvailability, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.groupId = parseInt(groupId);
      this.link = $be('leave-group-link');
      this.stub = $be('leave-group-link-stub');
      this.groupMembershipChannel = AblyRealtimeClient.channels.get("groups:membership");
      this.channelData = [
        {
          channel: this.groupMembershipChannel,
          subscriber: this.updateLinkAvailability
        }
      ];
    }

    GroupLeaveLinkComponent.prototype.setup = function() {
      return $setupChannelSubscriptions(this.channelData);
    };

    GroupLeaveLinkComponent.prototype.teardown = function() {
      return $teardownChannelSubscriptions(this.channelData);
    };

    GroupLeaveLinkComponent.prototype.updateLinkAvailability = function(channelMessage) {
      var groupModel;
      groupModel = new GroupModel(channelMessage.data.group);
      if (groupModel.id !== this.groupId) {
        return;
      }
      return this.toggle(groupModel.allowLeave($currentUserId()));
    };

    GroupLeaveLinkComponent.prototype.toggle = function(flag) {
      if (flag) {
        this.link.show();
        return this.stub.hide();
      } else {
        this.link.hide();
        return this.stub.show();
      }
    };

    return GroupLeaveLinkComponent;

  })();

}).call(this);
