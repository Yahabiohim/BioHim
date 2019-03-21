(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.ChatsShowHandler = (function() {
    function ChatsShowHandler() {
      this.editMobileMessageConfig = bind(this.editMobileMessageConfig, this);
      this.editDesktopMessageConfig = bind(this.editDesktopMessageConfig, this);
      this.updateMessage = bind(this.updateMessage, this);
      this.removeMessage = bind(this.removeMessage, this);
      this.addNewMessage = bind(this.addNewMessage, this);
      this.addNextPage = bind(this.addNextPage, this);
      this.bindNewMessageFormActions = bind(this.bindNewMessageFormActions, this);
      this.clearMessageForm = bind(this.clearMessageForm, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      var chatPage;
      chatPage = $be('chat-page');
      this.chatId = chatPage.data('id');
      this.userMentionsComponent = new UserMentionsComponent();
      this.documentPreviewComponent = new DocumentPreviewComponent();
      this.discussionMessagesComponent = new DiscussionMessagesComponent({
        documentPreviewComponent: this.documentPreviewComponent,
        thread: {
          type: 'Chat',
          id: this.chatId
        },
        editDesktopMessageConfig: this.editDesktopMessageConfig(),
        editMobileMessageConfig: this.editMobileMessageConfig(),
        messageChannelName: "chats:updates",
        messagePathTemplate: "/chats/" + this.chatId + "/messages/MESSAGE_ID",
        unreadMessagePathTemplate: "/chats/" + this.chatId + "/unread_messages/MESSAGE_ID"
      });
      this.autosaveContentId = "chat-" + this.chatId;
      this.autosavedMessageComponent = new AutosavedMessageComponent(this.autosaveContentId);
      this.newMessageSubmit = $be('new-message-submit');
      this.newMessageEditor = new MessageEditorComponent($be('new-message-input'), jQuery.extend({}, this.editDesktopMessageConfig(), {
        onFocus: (function(_this) {
          return function() {
            return _this.discussionMessagesComponent.scrollToBottom();
          };
        })(this),
        onCtlrEnter: function() {
          return $be('new-message-submit').click();
        },
        autosaveContentId: this.autosaveContentId
      }));
      this.userStatusLabelComponent = new UserStatusLabelComponent();
      this.chatMembersDialogComponent = new ChatMembersDialogComponent();
      this.attachDocumentComponent = new AttachDocumentComponent({
        thread: {
          id: this.chatId,
          type: 'Chat'
        },
        documentPreviewComponent: this.documentPreviewComponent,
        autosavedMessageComponent: this.autosavedMessageComponent,
        attachCallback: this.discussionMessagesComponent.scrollToBottom
      });
    }

    ChatsShowHandler.prototype.setup = function() {
      this.discussionMessagesComponent.setup();
      this.userStatusLabelComponent.setup();
      this.newMessageEditor.setup();
      this.chatMembersDialogComponent.setup();
      this.bindNewMessageFormActions();
      this.documentPreviewComponent.setup();
      this.attachDocumentComponent.setup();
      this.documentPreviewComponent.bindDocumentPreview($be('message-document'));
      this.attachDocumentComponent.loadAutosavedDocuments();
      $be('show-manage-members-modal-link').click(function() {
        return $be('chat-show-members-modal').modal('hide');
      });
      return this.newMessageEditor.focus();
    };

    ChatsShowHandler.prototype.teardown = function() {
      this.discussionMessagesComponent.teardown();
      return this.userStatusLabelComponent.teardown();
    };

    ChatsShowHandler.prototype.clearMessageForm = function() {
      this.newMessageEditor.clear();
      this.newMessageEditor.resetCache();
      this.autosavedMessageComponent.reset();
      return this.attachDocumentComponent.clearAttachedDocuments();
    };

    ChatsShowHandler.prototype.bindNewMessageFormActions = function() {
      return this.newMessageSubmit.click((function(_this) {
        return function(e) {
          e.preventDefault();
          if (!_this.newMessageEditor.contentIsEmpty() || _this.attachDocumentComponent.documentsAreAttached()) {
            _this.userMentionsComponent.update(_this.newMessageEditor.extractMentionUserIds().join(','));
            _this.newMessageSubmit.parents('form').submit();
            return _this.clearMessageForm();
          }
        };
      })(this));
    };

    ChatsShowHandler.prototype.addNextPage = function(pageNumber, messagesPage) {
      this.discussionMessagesComponent.addNextPage(pageNumber, messagesPage);
      return this.documentPreviewComponent.bindDocumentPreview($be('message-document'));
    };

    ChatsShowHandler.prototype.addNewMessage = function(messageId, authorId, messageHtml) {
      console.log('chat handler addNewMessage');
      this.discussionMessagesComponent.addNewMessage(messageId, authorId, messageHtml);
      return this.newMessageEditor.focus();
    };

    ChatsShowHandler.prototype.removeMessage = function(messageId) {
      return this.discussionMessagesComponent.removeMessage(messageId);
    };

    ChatsShowHandler.prototype.updateMessage = function(messageId, messageHtml) {
      return this.discussionMessagesComponent.updateMessage(messageId, messageHtml);
    };

    ChatsShowHandler.prototype.editDesktopMessageConfig = function() {
      return {
        buttonList: [],
        mentions: {
          data: this.userMentionsComponent.options
        },
        params: {
          placeholderText: 'Type a message',
          heightMin: '2rem',
          heightMax: '8rem'
        }
      };
    };

    ChatsShowHandler.prototype.editMobileMessageConfig = function() {
      return {
        buttonList: [],
        mentions: {
          data: this.userMentionsComponent.options
        },
        params: {
          placeholderText: '',
          height: "16vh"
        }
      };
    };

    return ChatsShowHandler;

  })();

}).call(this);
