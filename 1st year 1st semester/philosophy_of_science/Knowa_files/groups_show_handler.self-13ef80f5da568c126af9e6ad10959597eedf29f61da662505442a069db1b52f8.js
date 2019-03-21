(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.GroupsShowHandler = (function() {
    function GroupsShowHandler() {
      this.updateDiscussionList = bind(this.updateDiscussionList, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.groupId = $be('group-resource').data('id');
      this.unreadBadges = new UnreadBadgesComponent('discussion-card', 'discussionId', 'discussions:updates');
      this.discussionList = new DiscussionListComponent($be('discussion-list'), {
        afterUpdate: (function(_this) {
          return function() {
            return _this.unreadBadges.refresh();
          };
        })(this)
      });
      this.groupMembershipWatcherComponent = new GroupMembershipWatcherComponent();
      this.groupMemberListComponent = new GroupMemberListComponent({
        listContainerBehavior: 'group-participants',
        manageEnabled: true,
        contactDetailsEnabled: true
      });
      this.groupLeaveLinkComponent = new GroupLeaveLinkComponent(this.groupId);
    }

    GroupsShowHandler.prototype.setup = function() {
      this.unreadBadges.setup();
      this.discussionList.setup();
      this.groupMembershipWatcherComponent.setup();
      this.groupMemberListComponent.setup();
      return this.groupLeaveLinkComponent.setup();
    };

    GroupsShowHandler.prototype.teardown = function() {
      this.unreadBadges.teardown();
      this.discussionList.teardown();
      this.groupMembershipWatcherComponent.teardown();
      this.groupMemberListComponent.teardown();
      return this.groupLeaveLinkComponent.teardown();
    };

    GroupsShowHandler.prototype.updateDiscussionList = function(listContent) {
      return this.discussionList.update(listContent);
    };

    return GroupsShowHandler;

  })();

}).call(this);
