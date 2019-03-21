(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.DiscussionsIndexHandler = (function() {
    function DiscussionsIndexHandler() {
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.groupId = $be('group-resource').data('id');
      this.unreadBadges = new UnreadBadgesComponent('discussion-card', 'discussionId', 'discussions:updates');
      this.groupMembershipWatcherComponent = new GroupMembershipWatcherComponent();
      this.groupLeaveLinkComponent = new GroupLeaveLinkComponent(this.groupId);
      this.groupMemberListComponent = new GroupMemberListComponent({
        listContainerBehavior: 'group-participants',
        manageEnabled: false,
        contactDetailsEnabled: true
      });
    }

    DiscussionsIndexHandler.prototype.setup = function() {
      this.unreadBadges.setup();
      this.groupMembershipWatcherComponent.setup();
      this.groupLeaveLinkComponent.setup();
      return this.groupMemberListComponent.setup();
    };

    DiscussionsIndexHandler.prototype.teardown = function() {
      this.unreadBadges.teardown();
      this.groupMembershipWatcherComponent.teardown();
      this.groupLeaveLinkComponent.teardown();
      return this.groupMemberListComponent.teardown();
    };

    return DiscussionsIndexHandler;

  })();

}).call(this);
