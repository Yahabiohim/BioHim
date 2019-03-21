(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.ChatsNewHandler = (function() {
    function ChatsNewHandler() {
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.unreadBadges = new UnreadBadgesComponent('chat-card', 'chatId', 'chats:updates');
      this.chatListComponent = new ChatListComponent({
        afterUpdate: (function(_this) {
          return function() {
            return _this.unreadBadges.refresh();
          };
        })(this)
      });
      this.userStatusLabelComponent = new UserStatusLabelComponent();
      this.chatMembersDialogComponent = new ChatMembersDialogComponent();
    }

    ChatsNewHandler.prototype.setup = function() {
      this.unreadBadges.setup();
      this.chatListComponent.setup();
      this.userStatusLabelComponent.setup();
      return this.chatMembersDialogComponent.setup();
    };

    ChatsNewHandler.prototype.teardown = function() {
      this.unreadBadges.teardown();
      this.chatListComponent.teardown();
      return this.userStatusLabelComponent.teardown();
    };

    return ChatsNewHandler;

  })();

}).call(this);
