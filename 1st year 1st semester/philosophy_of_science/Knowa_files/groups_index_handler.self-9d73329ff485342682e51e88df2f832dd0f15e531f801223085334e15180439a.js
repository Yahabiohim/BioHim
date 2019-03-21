(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.GroupsIndexHandler = (function() {
    function GroupsIndexHandler() {
      this.teardown = bind(this.teardown, this);
      this.showList = bind(this.showList, this);
      this.handleGroupMembershipChange = bind(this.handleGroupMembershipChange, this);
      this.bindGroupCards = bind(this.bindGroupCards, this);
      this.setup = bind(this.setup, this);
      var groupMembershipChannel;
      this.groupList = $be('group-list');
      this.membershipWatcher = new SchemeMembershipWatcherComponent();
      this.unreadBadges = new UnreadBadgesComponent('group-card', 'groupCardId', 'discussions:updates');
      this.groupMemberListComponent = new GroupMemberListComponent({
        listContainerBehavior: 'group-card',
        manageEnabled: this.groupList.data('manage'),
        contactDetailsEnabled: false
      });
      groupMembershipChannel = AblyRealtimeClient.channels.get("groups:membership");
      this.channelData = [
        {
          channel: groupMembershipChannel,
          subscriber: this.handleGroupMembershipChange
        }
      ];
    }

    GroupsIndexHandler.prototype.setup = function() {
      $setupChannelSubscriptions(this.channelData);
      this.membershipWatcher.setup();
      this.unreadBadges.setup();
      this.groupMemberListComponent.setup();
      return this.bindGroupCards();
    };

    GroupsIndexHandler.prototype.bindGroupCards = function() {
      var pageHandler;
      $be("group-page-link").click(function(e) {
        if ($(e.target).parent().data('stop-propagation')) {
          return;
        }
        if ($(this).is("[disabled]")) {
          $showFlashMessage('warning', 'You must be a member to visit this group.');
          return e.preventDefault();
        } else {
          return Turbolinks.visit($(this).data('path'));
        }
      });
      pageHandler = this;
      return $be('group-members-list').click(function(e) {
        var memberList;
        memberList = $(this);
        if (memberList.find("[data-behavior='member-avatar']").length) {
          return $.getScript(memberList.data('show-path'), function() {
            return $be('show-members-modal').modal('show');
          });
        } else {
          return $.getScript(memberList.data('manage-path'), function() {
            return $be('manage-members-modal').modal('show');
          });
        }
      });
    };

    GroupsIndexHandler.prototype.handleGroupMembershipChange = function(channelMessage) {
      var affectedGroup, groupModel, ref;
      groupModel = new GroupModel(channelMessage.data.group);
      affectedGroup = $beById('group-card', groupModel.id);
      if (!(affectedGroup.length && (ref = $currentUserId(), indexOf.call(channelMessage.data.affectedUserIds, ref) >= 0))) {
        return;
      }
      return $.getScript(location.toString());
    };

    GroupsIndexHandler.prototype.showList = function(listContent) {
      this.groupList.html(listContent);
      window.layoutHandler.setAvatarImages(this.groupList);
      this.bindGroupCards();
      return this.groupMemberListComponent.avatarListComponent.updateAllCounters();
    };

    GroupsIndexHandler.prototype.teardown = function() {
      this.membershipWatcher.teardown();
      this.unreadBadges.teardown();
      this.groupMemberListComponent.teardown();
      return $teardownChannelSubscriptions(this.channelData);
    };

    return GroupsIndexHandler;

  })();

}).call(this);
