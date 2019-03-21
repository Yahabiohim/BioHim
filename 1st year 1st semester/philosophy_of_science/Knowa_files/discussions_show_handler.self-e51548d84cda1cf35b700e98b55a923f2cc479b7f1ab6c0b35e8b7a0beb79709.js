(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.DiscussionsShowHandler = (function() {
    function DiscussionsShowHandler() {
      this.setupNewMessageEditors = bind(this.setupNewMessageEditors, this);
      this.loadFormIfMessageSaved = bind(this.loadFormIfMessageSaved, this);
      this.editMobileMessageConfig = bind(this.editMobileMessageConfig, this);
      this.editDesktopMessageConfig = bind(this.editDesktopMessageConfig, this);
      this.bindNewMessageFormActions = bind(this.bindNewMessageFormActions, this);
      this.clearMessageForm = bind(this.clearMessageForm, this);
      this.updateMessage = bind(this.updateMessage, this);
      this.removeMessage = bind(this.removeMessage, this);
      this.addNewMessage = bind(this.addNewMessage, this);
      this.addNextPage = bind(this.addNextPage, this);
      this.bindDescriptionActions = bind(this.bindDescriptionActions, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      var discussionPage;
      this.groupMembershipWatcherComponent = new GroupMembershipWatcherComponent();
      discussionPage = $be('discussion-page');
      this.discussionId = discussionPage.data('id');
      this.groupId = window.groupId;
      this.autosaveContentId = "discussion-" + this.discussionId;
      this.autosavedMessageComponent = new AutosavedMessageComponent(this.autosaveContentId);
      this.userMentionsComponent = new UserMentionsComponent();
      this.documentPreviewComponent = new DocumentPreviewComponent();
      this.discussionMessagesComponent = new DiscussionMessagesComponent({
        documentPreviewComponent: this.documentPreviewComponent,
        thread: {
          type: 'Discussion',
          id: this.discussionId
        },
        editDesktopMessageConfig: this.editDesktopMessageConfig(),
        editMobileMessageConfig: this.editMobileMessageConfig(),
        messageChannelName: "discussions:updates",
        messagePathTemplate: "/discussions/" + this.discussionId + "/messages/MESSAGE_ID",
        unreadMessagePathTemplate: "/discussions/" + this.discussionId + "/unread_messages/MESSAGE_ID"
      });
      this.descriptionModal = $be('discussion-description-modal');
      this.groupMemberListComponent = new GroupMemberListComponent({
        listContainerBehavior: 'group-participants',
        manageEnabled: false,
        contactDetailsEnabled: true
      });
      this.attachDocumentComponent = new AttachDocumentComponent({
        thread: {
          id: this.discussionId,
          type: 'Discussion'
        },
        documentPreviewComponent: this.documentPreviewComponent,
        autosavedMessageComponent: this.autosavedMessageComponent,
        attachCallback: this.discussionMessagesComponent.scrollToBottom
      });
      this.newMessageForm = $be('new-message-form');
      this.showNewMessageFormButton = $be('show-new-message-form');
      this.hideNewMessageForm = $be('hide-new-message-form');
      this.newMessageSubmit = $be('new-message-submit');
      this.mobileNewMessageModal = $be('new-message-modal');
      this.showMobileNewMessageFormButton = $be('show-mobile-new-message-form');
      this.hideMobileNewMessageForm = $be('hide-mobile-new-message-form');
      this.mobileNewMessageSubmit = $be('mobile-new-message-submit');
    }

    DiscussionsShowHandler.prototype.setup = function() {
      this.discussionMessagesComponent.setup();
      this.groupMembershipWatcherComponent.setup();
      this.groupMemberListComponent.setup();
      this.documentPreviewComponent.setup();
      this.attachDocumentComponent.setup();
      this.documentPreviewComponent.bindDocumentPreview($be('message-document'));
      this.setupNewMessageEditors();
      this.bindDescriptionActions();
      this.bindNewMessageFormActions();
      return this.loadFormIfMessageSaved();
    };

    DiscussionsShowHandler.prototype.teardown = function() {
      this.discussionMessagesComponent.teardown();
      this.groupMembershipWatcherComponent.teardown();
      this.groupMemberListComponent.teardown();
      this.documentPreviewComponent.teardown();
      return this.attachDocumentComponent.teardown();
    };

    DiscussionsShowHandler.prototype.bindDescriptionActions = function() {
      return $be('close-discussion-description-modal').click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.descriptionModal.modal('hide');
        };
      })(this));
    };

    DiscussionsShowHandler.prototype.addNextPage = function(pageNumber, messagesPage) {
      this.discussionMessagesComponent.addNextPage(pageNumber, messagesPage);
      return this.documentPreviewComponent.bindDocumentPreview($be('message-document'));
    };

    DiscussionsShowHandler.prototype.addNewMessage = function(messageId, authorId, messageHtml) {
      return this.discussionMessagesComponent.addNewMessage(messageId, authorId, messageHtml);
    };

    DiscussionsShowHandler.prototype.removeMessage = function(messageId) {
      return this.discussionMessagesComponent.removeMessage(messageId);
    };

    DiscussionsShowHandler.prototype.updateMessage = function(messageId, messageHtml) {
      return this.discussionMessagesComponent.updateMessage(messageId, messageHtml);
    };

    DiscussionsShowHandler.prototype.clearMessageForm = function() {
      this.newMessageEditor.clear();
      this.mobileNewMessageEditor.clear();
      this.userMentionsComponent.clear();
      this.autosavedMessageComponent.reset();
      return this.attachDocumentComponent.clearAttachedDocuments();
    };

    DiscussionsShowHandler.prototype.bindNewMessageFormActions = function() {
      this.showNewMessageFormButton.click((function(_this) {
        return function(e) {
          _this.newMessageForm.show();
          _this.showNewMessageFormButton.hide();
          _this.discussionMessagesComponent.scrollToBottom();
          _this.newMessageEditor.focus();
          _this.newMessageEditor.refreshPlaceholder();
          return _this.mobileNewMessageEditor.focus();
        };
      })(this));
      this.mobileNewMessageModal.on('shown.bs.modal', (function(_this) {
        return function() {
          document.activeElement.blur();
          return _this.mobileNewMessageEditor.focus();
        };
      })(this));
      this.hideNewMessageForm.click((function(_this) {
        return function(e) {
          e.preventDefault();
          _this.newMessageForm.hide();
          return _this.showNewMessageFormButton.show();
        };
      })(this));
      this.newMessageSubmit.click((function(_this) {
        return function(e) {
          if (!_this.newMessageEditor.contentIsEmpty() || _this.attachDocumentComponent.documentsAreAttached()) {
            _this.userMentionsComponent.update(_this.newMessageEditor.extractMentionUserIds().join(','));
            return _this.hideNewMessageForm.click();
          } else {
            return e.preventDefault();
          }
        };
      })(this));
      return this.mobileNewMessageSubmit.click((function(_this) {
        return function(e) {
          if (!_this.mobileNewMessageEditor.contentIsEmpty() || _this.attachDocumentComponent.documentsAreAttached()) {
            _this.userMentionsComponent.update(_this.mobileNewMessageEditor.extractMentionUserIds().join(','));
            return _this.hideMobileNewMessageForm.click();
          } else {
            return e.preventDefault();
          }
        };
      })(this));
    };

    DiscussionsShowHandler.prototype.editDesktopMessageConfig = function() {
      return {
        buttonList: ['clearFormatting', '|', 'bold', 'italic', 'underline', 'strikeThrough', 'color', '|', 'quote', 'formatOL', 'formatUL', 'align', '|', 'insertTable', 'insertImage', 'insertLink'],
        mentions: {
          data: this.userMentionsComponent.options
        },
        params: {
          imageUploadToS3: window.imageUploadToS3,
          imageEditButtons: ['imageReplace', 'imageAlign', 'imageSize', 'imageRemove', 'imageLink'],
          placeholderText: 'Type a message',
          heightMin: 100,
          heightMax: 300
        }
      };
    };

    DiscussionsShowHandler.prototype.editMobileMessageConfig = function() {
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

    DiscussionsShowHandler.prototype.loadFormIfMessageSaved = function() {
      if (this.autosavedMessageComponent.savedContentIsPresent()) {
        if (this.showNewMessageFormButton.is(':visible')) {
          this.showNewMessageFormButton.click();
        } else if (this.showMobileNewMessageFormButton.is(':visible')) {
          this.showMobileNewMessageFormButton.click();
        }
      }
      return this.attachDocumentComponent.loadAutosavedDocuments();
    };

    DiscussionsShowHandler.prototype.setupNewMessageEditors = function() {
      this.newMessageEditor = new MessageEditorComponent($be('new-message-input'), {
        mentions: {
          data: this.userMentionsComponent.options
        },
        onCtlrEnter: function() {
          return $be('new-message-submit').click();
        },
        onAddDocument: (function(_this) {
          return function() {
            return _this.attachDocumentComponent.show();
          };
        })(this),
        buttonList: ['clearFormatting', '|', 'bold', 'italic', 'underline', 'strikeThrough', 'color', '|', 'quote', 'formatOL', 'formatUL', 'align', '|', 'insertTable', 'insertImage', 'insertLink', 'addDocument'],
        autosaveContentId: this.autosaveContentId,
        params: {
          imageUploadToS3: window.imageUploadToS3,
          imageEditButtons: ['imageReplace', 'imageAlign', 'imageSize', 'imageRemove', 'imageLink'],
          heightMin: 200,
          heightMax: 300
        }
      });
      this.newMessageEditor.setup();
      this.mobileNewMessageEditor = new MessageEditorComponent($be('mobile-new-message-input'), {
        onAddDocument: (function(_this) {
          return function() {
            return _this.attachDocumentComponent.show();
          };
        })(this),
        onFocus: function() {
          return $('html, body').animate({
            scrollTop: 0
          }, 400);
        },
        buttonList: [],
        mentions: {
          data: this.userMentionsComponent.options
        },
        autosaveContentId: this.autosaveContentId,
        params: {
          placeholderText: '',
          height: "16vh"
        }
      });
      return this.mobileNewMessageEditor.setup();
    };

    return DiscussionsShowHandler;

  })();

}).call(this);
