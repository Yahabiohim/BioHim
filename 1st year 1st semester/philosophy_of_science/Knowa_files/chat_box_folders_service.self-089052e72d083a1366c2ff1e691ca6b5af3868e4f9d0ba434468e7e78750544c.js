(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.ChatBoxFoldersService = (function() {
    function ChatBoxFoldersService(chatId) {
      this.fetchFolders = bind(this.fetchFolders, this);
      this.chatId = chatId;
    }

    ChatBoxFoldersService.prototype.fetchFolders = function(successCallback) {
      return $.get("/chats/" + this.chatId + "/box_folders").then(successCallback);
    };

    return ChatBoxFoldersService;

  })();

}).call(this);
