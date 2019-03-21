(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.ChatsIndexHandler = (function() {
    function ChatsIndexHandler() {
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
    }

    ChatsIndexHandler.prototype.setup = function() {
      this.unreadBadges.setup();
      this.chatListComponent.setup();
      this.userStatusLabelComponent.setup();
      return $be('chat-list-filter').on('keyup', function() {
        var value;
        value = $(this).val().toLowerCase();
        $be('chat-card').filter(function() {
          return $(this).toggle($(this).data('filter-text').toLowerCase().indexOf(value) > -1);
        });
        if (!$be('chat-card').is(':visible')) {
          return $be('chat-list-filter-empty').show();
        } else {
          return $be('chat-list-filter-empty').hide();
        }
      });
    };

    ChatsIndexHandler.prototype.teardown = function() {
      this.unreadBadges.teardown();
      this.chatListComponent.teardown();
      return this.userStatusLabelComponent.teardown();
    };

    return ChatsIndexHandler;

  })();

}).call(this);
