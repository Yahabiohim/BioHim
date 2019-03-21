(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.NewMessagesWatcher = (function() {
    function NewMessagesWatcher(messageUrlTemplate) {
      this.sendMessageReadRequiest = bind(this.sendMessageReadRequiest, this);
      this.markPendingMessagesAsRead = bind(this.markPendingMessagesAsRead, this);
      this.markMessageAsRead = bind(this.markMessageAsRead, this);
      this.setup = bind(this.setup, this);
      this.messageUrlTemplate = messageUrlTemplate;
      this.windowFocusComponent = new WindowFocusComponent({
        onfocus: [
          (function(_this) {
            return function() {
              return _this.markPendingMessagesAsRead();
            };
          })(this)
        ]
      });
      this.pendingReadMessages = [];
    }

    NewMessagesWatcher.prototype.setup = function() {
      return this.windowFocusComponent.setup();
    };

    NewMessagesWatcher.prototype.markMessageAsRead = function(messageId) {
      if (this.windowFocusComponent.windowIsFocused()) {
        return this.sendMessageReadRequiest(messageId);
      } else {
        return this.pendingReadMessages.push(messageId);
      }
    };

    NewMessagesWatcher.prototype.markPendingMessagesAsRead = function() {
      var messageId, results;
      results = [];
      while (this.pendingReadMessages.length > 0) {
        messageId = this.pendingReadMessages.pop();
        results.push(this.sendMessageReadRequiest(messageId));
      }
      return results;
    };

    NewMessagesWatcher.prototype.sendMessageReadRequiest = function(messageId) {
      var url;
      url = this.messageUrlTemplate.replace('MESSAGE_ID', messageId);
      return $.ajax({
        url: url,
        method: 'DELETE',
        dataType: 'json'
      });
    };

    return NewMessagesWatcher;

  })();

}).call(this);
