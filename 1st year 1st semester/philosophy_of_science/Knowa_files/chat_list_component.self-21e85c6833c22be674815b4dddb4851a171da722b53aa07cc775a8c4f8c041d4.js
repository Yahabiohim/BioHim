(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.ChatListComponent = (function() {
    function ChatListComponent(params) {
      this.skipListUpdate = bind(this.skipListUpdate, this);
      this.update = bind(this.update, this);
      this.handleListUpdateChannelMessage = bind(this.handleListUpdateChannelMessage, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.afterUpdate = params.afterUpdate;
      this.listContainer = $be('chat-list');
      this.listFetchPath = this.listContainer.data('fetch-path');
      this.listUpdateChannel = AblyRealtimeClient.channels.get("chats:updates");
      this.channelData = [
        {
          channel: this.listUpdateChannel,
          subscriber: this.handleListUpdateChannelMessage
        }
      ];
    }

    ChatListComponent.prototype.setup = function() {
      return $setupChannelSubscriptions(this.channelData);
    };

    ChatListComponent.prototype.teardown = function() {
      return $teardownChannelSubscriptions(this.channelData);
    };

    ChatListComponent.prototype.handleListUpdateChannelMessage = function(channelMessage) {
      var threadModel;
      threadModel = new ThreadModel(channelMessage.data.thread);
      if (!threadModel.isMemberId($currentUserId())) {
        return;
      }
      if (!this.skipListUpdate(channelMessage.data.chatId)) {
        return $.getScript(this.listFetchPath);
      }
    };

    ChatListComponent.prototype.update = function(listContent) {
      this.listContainer.html(listContent);
      if (this.afterUpdate) {
        return this.afterUpdate();
      }
    };

    ChatListComponent.prototype.skipListUpdate = function(chatId) {
      return this.listContainer.find("[data-behavior=chat-card][data-id=" + chatId + "]").length > 0;
    };

    return ChatListComponent;

  })();

}).call(this);
