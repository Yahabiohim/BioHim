(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.DiscussionBoxFoldersService = (function() {
    function DiscussionBoxFoldersService(discussionId) {
      this.fetchFolders = bind(this.fetchFolders, this);
      this.discussionId = discussionId;
    }

    DiscussionBoxFoldersService.prototype.fetchFolders = function(successCallback) {
      return $.get("/discussions/" + this.discussionId + "/box_folders").then(successCallback);
    };

    return DiscussionBoxFoldersService;

  })();

}).call(this);
