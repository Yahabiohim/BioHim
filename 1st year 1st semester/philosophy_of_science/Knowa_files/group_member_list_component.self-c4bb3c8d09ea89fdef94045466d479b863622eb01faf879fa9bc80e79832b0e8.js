(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.GroupMemberListComponent = (function() {
    function GroupMemberListComponent(params) {
      this.handleGroupMembershipChange = bind(this.handleGroupMembershipChange, this);
      this.showManageList = bind(this.showManageList, this);
      this.showList = bind(this.showList, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      var groupMembershipChannel;
      this.listContainerBehavior = params.listContainerBehavior;
      this.manageEnabled = params.manageEnabled;
      this.contactDetailsEnabled = params.contactDetailsEnabled;
      this.avatarListComponent = new AvatarListComponent(this.listContainerBehavior);
      this.userList = $be('show-members-modal-content');
      if (this.manageEnabled) {
        this.groupMembershipManageComponent = new GroupMembershipManageComponent();
      }
      groupMembershipChannel = AblyRealtimeClient.channels.get("groups:membership");
      this.channelData = [
        {
          channel: groupMembershipChannel,
          subscriber: this.handleGroupMembershipChange
        }
      ];
    }

    GroupMemberListComponent.prototype.setup = function() {
      this.avatarListComponent.setup();
      $setupChannelSubscriptions(this.channelData);
      return $be('show-members-link').click(function(e) {
        $be('manage-members-modal').modal('hide');
        return $.getScript($(this).attr('href'));
      });
    };

    GroupMemberListComponent.prototype.teardown = function() {
      return $teardownChannelSubscriptions(this.channelData);
    };

    GroupMemberListComponent.prototype.showList = function(listContent) {
      this.userList.html(listContent);
      window.layoutHandler.setAvatarImages(this.userList);
      window.layoutHandler.contactDetailsComponent.bindLinks(this.userList);
      if (this.manageEnabled) {
        return $be('manage-members-link').show();
      }
    };

    GroupMemberListComponent.prototype.showManageList = function(listContent) {
      return this.groupMembershipManageComponent.showManageList(listContent);
    };

    GroupMemberListComponent.prototype.handleGroupMembershipChange = function(channelMessage) {
      var groupModel, listContainer;
      groupModel = new GroupModel(channelMessage.data.group);
      listContainer = $beById(this.listContainerBehavior, groupModel.id);
      if (!listContainer.length) {
        return;
      }
      return this.avatarListComponent.update(groupModel.id, listContainer, this.contactDetailsEnabled);
    };

    return GroupMemberListComponent;

  })();

}).call(this);
