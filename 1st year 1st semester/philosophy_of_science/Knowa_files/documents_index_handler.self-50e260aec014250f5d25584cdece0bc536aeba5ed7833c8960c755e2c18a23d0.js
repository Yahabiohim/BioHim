(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.DocumentsIndexHandler = (function() {
    function DocumentsIndexHandler() {
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.groupMembershipWatcherComponent = new GroupMembershipWatcherComponent();
      this.contentExplorer = new Box.ContentExplorer();
      this.boxAuthService = new BoxAuthService();
      this.groupFolderId = window.groupFolderId;
      this.openedFolderId = window.openedFolderId;
      this.groupId = window.groupId;
      this.groupMemberListComponent = new GroupMemberListComponent({
        listContainerBehavior: 'group-participants',
        manageEnabled: false,
        contactDetailsEnabled: true
      });
      this.groupLeaveLinkComponent = new GroupLeaveLinkComponent(this.groupId);
    }

    DocumentsIndexHandler.prototype.setup = function() {
      this.groupMembershipWatcherComponent.setup();
      this.contentExplorer.show(this.groupFolderId, this.boxAuthService.fetchToken, {
        container: '[data-behavior=file-manager]',
        canShare: false
      });
      this.groupMemberListComponent.setup();
      this.groupLeaveLinkComponent.setup();
      if (this.openedFolderId) {
        return this.contentExplorer.getComponent().fetchFolder(this.openedFolderId);
      }
    };

    DocumentsIndexHandler.prototype.teardown = function() {
      this.groupMembershipWatcherComponent.teardown();
      this.contentExplorer.hide();
      this.groupMemberListComponent.teardown();
      return this.groupLeaveLinkComponent.teardown();
    };

    return DocumentsIndexHandler;

  })();

}).call(this);
