(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.DiscussionMessagesComponent = (function() {
    var adjustMessage, bindRemoveEdit, drawDateSeparator, fillDateSeparators, fillMessageTimestamp, fillTimestamps, formatDateSeparator, highlightCurrentUserMentions, onLoadingDateSeparator, redrawDateSeparators, showAuthorData, showMessageFromThread, updateDateSeparators;

    function DiscussionMessagesComponent(params) {
      this.initFroalaEditor = bind(this.initFroalaEditor, this);
      this.bindMessagesLoadingLink = bind(this.bindMessagesLoadingLink, this);
      this.fetchMessages = bind(this.fetchMessages, this);
      this.preserveScrollPosition = bind(this.preserveScrollPosition, this);
      this.scrollToBottom = bind(this.scrollToBottom, this);
      this.scrollToActualPosition = bind(this.scrollToActualPosition, this);
      this.placeUnreadSeparator = bind(this.placeUnreadSeparator, this);
      this.removeMessage = bind(this.removeMessage, this);
      this.updateMessage = bind(this.updateMessage, this);
      this.showMessageEditForm = bind(this.showMessageEditForm, this);
      this.addNewMessage = bind(this.addNewMessage, this);
      this.addNextPage = bind(this.addNextPage, this);
      this.fetchMessageContent = bind(this.fetchMessageContent, this);
      this.handleChannelMessage = bind(this.handleChannelMessage, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.discussionViewport = $be('discussion-viewport');
      this.discussionContainer = $be('discussion-container');
      this.loadingMessagesInProgress = false;
      this.documentPreviewComponent = params.documentPreviewComponent;
      this.thread = params.thread;
      this.editDesktopMessageConfig = params.editDesktopMessageConfig;
      this.editMobileMessageConfig = params.editMobileMessageConfig;
      this.messageChannelName = params.messageChannelName;
      this.messagePathTemplate = params.messagePathTemplate;
      this.unreadMessagePathTemplate = params.unreadMessagePathTemplate;
      this.newMessagesWatcher = new NewMessagesWatcher(this.unreadMessagePathTemplate);
      this.messageChannel = AblyRealtimeClient.channels.get(this.messageChannelName);
      this.channelSubscriptions = [
        {
          channel: this.messageChannel,
          subscriber: this.handleChannelMessage
        }
      ];
    }

    DiscussionMessagesComponent.prototype.setup = function() {
      this.bindMessagesLoadingLink();
      fillTimestamps();
      fillDateSeparators();
      showAuthorData();
      highlightCurrentUserMentions();
      this.placeUnreadSeparator();
      this.scrollToActualPosition();
      this.newMessagesWatcher.setup();
      return $setupChannelSubscriptions(this.channelSubscriptions);
    };

    DiscussionMessagesComponent.prototype.teardown = function() {
      return $teardownChannelSubscriptions(this.channelSubscriptions);
    };

    DiscussionMessagesComponent.prototype.handleChannelMessage = function(channelMessage) {
      var authorId, messageId, messageThread;
      messageThread = new ThreadModel(channelMessage.data.thread);
      if (!showMessageFromThread(this.thread, messageThread)) {
        return;
      }
      messageId = channelMessage.data.messageId;
      authorId = channelMessage.data.authorId;
      switch (channelMessage.name) {
        case "message-create":
          return this.fetchMessageContent(messageId, (function(_this) {
            return function(data) {
              _this.addNewMessage(messageId, authorId, data.content);
              if (!$isCurrentUserId(authorId)) {
                return _this.newMessagesWatcher.markMessageAsRead(messageId);
              }
            };
          })(this));
        case "message-update":
          return this.fetchMessageContent(messageId, (function(_this) {
            return function(data) {
              return _this.updateMessage(messageId, data.content);
            };
          })(this));
        case "message-destroy":
          return this.removeMessage(messageId);
      }
    };

    DiscussionMessagesComponent.prototype.fetchMessageContent = function(messageId, successCallback) {
      return $.get(this.messagePathTemplate.replace('MESSAGE_ID', messageId), successCallback);
    };

    DiscussionMessagesComponent.prototype.addNextPage = function(pageNumber, messagesPage) {
      $be('next-page-placeholder').replaceWith(messagesPage);
      this.bindMessagesLoadingLink();
      fillTimestamps();
      fillDateSeparators();
      showAuthorData();
      highlightCurrentUserMentions();
      window.layoutHandler.setAvatarImages(this.discussionContainer);
      return window.layoutHandler.contactDetailsComponent.bindLinks($("[data-behavior=message-containter][data-page=" + pageNumber + "]"));
    };

    DiscussionMessagesComponent.prototype.addNewMessage = function(messageId, authorId, messageHtml) {
      if ($beById('message-containter', messageId).length > 0) {
        return;
      }
      this.discussionContainer.prepend(messageHtml);
      updateDateSeparators(messageId);
      adjustMessage(messageId);
      highlightCurrentUserMentions(messageId);
      if (!$isCurrentUserId(authorId)) {
        this.placeUnreadSeparator(messageId);
      }
      this.documentPreviewComponent.bindDocumentPreview($beById('message-document', messageId));
      return this.scrollToBottom();
    };

    DiscussionMessagesComponent.prototype.showMessageEditForm = function(messageId, messageEditForm) {
      var cancelLink, messageFormPlaceholder;
      messageFormPlaceholder = $beById('message-form-placeholder', messageId);
      messageFormPlaceholder.html(messageEditForm);
      cancelLink = $beById('remove-message-edit-form', messageId);
      bindRemoveEdit(cancelLink);
      $beById('message-body', messageId).hide();
      this.initFroalaEditor(messageId);
      return messageFormPlaceholder.show();
    };

    DiscussionMessagesComponent.prototype.updateMessage = function(messageId, messageHtml) {
      var targetMessage;
      targetMessage = $beById('message-containter', messageId);
      targetMessage.replaceWith(messageHtml);
      return adjustMessage(messageId);
    };

    DiscussionMessagesComponent.prototype.removeMessage = function(messageId) {
      var targetMessage;
      targetMessage = $beById('message-containter', messageId);
      return targetMessage.hide('fast', function() {
        return targetMessage.remove();
      });
    };

    DiscussionMessagesComponent.prototype.placeUnreadSeparator = function(messageId) {
      var firstUnreadMessageElement, firstUnreadMessageId;
      if ($be('message-separator').length > 0) {
        return;
      }
      firstUnreadMessageId = messageId || this.discussionViewport.data('first-new-message');
      if (firstUnreadMessageId) {
        firstUnreadMessageElement = $beById('message-containter', firstUnreadMessageId);
        return firstUnreadMessageElement.after('<div class="message-separator" data-behavior="message-separator"></div>');
      }
    };

    DiscussionMessagesComponent.prototype.scrollToActualPosition = function() {
      var messageBound, messageElement, messageHeight, messageId;
      messageId = this.discussionViewport.data('scroll-to-message');
      if (messageId) {
        messageElement = $beById('message-containter', messageId);
        messageBound = messageElement.offset().top;
        messageHeight = messageElement.height();
        return this.discussionViewport.scrollTop(messageBound - 210);
      } else {
        return this.scrollToBottom();
      }
    };

    DiscussionMessagesComponent.prototype.scrollToBottom = function() {
      return this.discussionViewport.scrollTop(this.discussionContainer[0].scrollHeight);
    };

    DiscussionMessagesComponent.prototype.preserveScrollPosition = function(previousOffset, linkHeight) {
      return this.discussionViewport.scrollTop(this.discussionContainer.height() + previousOffset - linkHeight);
    };

    DiscussionMessagesComponent.prototype.fetchMessages = function(linkElement) {
      var oldOffset;
      this.loadingMessagesInProgress = true;
      $(linkElement).hide();
      $be('loading-animation').show();
      oldOffset = this.discussionViewport.scrollTop() - this.discussionContainer.height();
      return $.getScript($(linkElement).attr('href'), (function(_this) {
        return function() {
          _this.preserveScrollPosition(oldOffset, $(linkElement).height());
          return _this.loadingMessagesInProgress = false;
        };
      })(this));
    };

    DiscussionMessagesComponent.prototype.bindMessagesLoadingLink = function() {
      var loadMessagesPageLinks;
      loadMessagesPageLinks = $be('load-messages-page-link');
      return loadMessagesPageLinks.on('inview', (function(_this) {
        return function(e, visible) {
          if (_this.loadingMessagesInProgress || !visible) {
            return;
          }
          return _this.fetchMessages(e.target);
        };
      })(this));
    };

    DiscussionMessagesComponent.prototype.initFroalaEditor = function(messageId) {
      var config, newMessageEditor;
      if ($be('desktop-view-flag').is(':visible')) {
        config = this.editDesktopMessageConfig;
      } else {
        config = this.editMobileMessageConfig;
      }
      newMessageEditor = new MessageEditorComponent($beById("message-edit-input", messageId), config);
      return newMessageEditor.setup();
    };

    showMessageFromThread = function(discussionThread, messageThreadModel) {
      return messageThreadModel.isMemberId($currentUserId()) && messageThreadModel.type === discussionThread.type && messageThreadModel.id === parseInt(discussionThread.id);
    };

    showAuthorData = function(messageId) {
      var ownMesagges;
      if (messageId) {
        ownMesagges = $("[data-behavior=message-containter][data-id=" + messageId + "][data-author-id=" + ($currentUserId()) + "]");
      } else {
        ownMesagges = $("[data-behavior=message-containter][data-author-id=" + ($currentUserId()) + "]");
      }
      ownMesagges.find("[data-behavior=message-menu]").show();
      return ownMesagges.find("[data-behavior=message-owner-flag]").show();
    };

    highlightCurrentUserMentions = function(messageId) {
      var messages;
      if (messageId) {
        messages = $("[data-behavior=message-containter][data-id=" + messageId + "]");
      } else {
        messages = $("[data-behavior=message-containter]");
      }
      return messages.find("[data-behavior=user-mention][data-id=" + ($currentUserId()) + "]").addClass('current-user');
    };

    updateDateSeparators = function(messageId) {
      var mDate, message, pmDate, previousMessage;
      message = $beById('message-containter', messageId);
      previousMessage = $(message).nextAll("[data-behavior=message-containter]:first");
      mDate = moment.utc(message.data('datetime')).local();
      if (previousMessage.length) {
        pmDate = moment.utc(previousMessage.data('datetime')).local();
        if (mDate.startOf('day').format() !== pmDate.startOf('day').format()) {
          drawDateSeparator(message, mDate);
          return redrawDateSeparators();
        }
      } else {
        return drawDateSeparator(message, mDate);
      }
    };

    fillMessageTimestamp = function(messageId) {
      return $setTimestampContent($beById('message-timestamp', messageId));
    };

    fillTimestamps = function() {
      var el, i, len, ref, results;
      ref = $be('message-timestamp');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        el = ref[i];
        results.push($setTimestampContent($(el)));
      }
      return results;
    };

    fillDateSeparators = function() {
      var i, len, mDate, mc, message, pmDate, previousMessage, ref, results;
      ref = $be('message-containter');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        mc = ref[i];
        message = $(mc);
        previousMessage = $(mc).nextAll("[data-behavior=message-containter]:first");
        mDate = moment.utc(message.data('datetime')).local();
        if (previousMessage.length) {
          pmDate = moment.utc(previousMessage.data('datetime')).local();
          if (mDate.startOf('day').format() !== pmDate.startOf('day').format()) {
            results.push(drawDateSeparator(message, mDate));
          } else {
            results.push(void 0);
          }
        } else if ($be('top-date-separator').length) {
          results.push($be('top-date-separator').replaceWith(onLoadingDateSeparator(mDate)));
        } else if ($be('loading-animation').length) {
          results.push($be('loading-animation').append(onLoadingDateSeparator(mDate)));
        } else {
          results.push(drawDateSeparator(message, mDate));
        }
      }
      return results;
    };

    drawDateSeparator = function(message, date) {
      var messageId;
      messageId = message.data('id');
      if ($beById("date-separator", messageId).length) {
        return;
      }
      return message.after("<div class='text-center mbs'> <span class='date-separator' data-behavior='date-separator' data-id=" + messageId + " data-date='" + (date.format()) + "'> " + (formatDateSeparator(date)) + " </<span> </div>");
    };

    onLoadingDateSeparator = function(date) {
      return "<span class='date-separator' data-behavior='date-separator' data-id='on-loading' data-date='" + (date.format()) + "'> " + (formatDateSeparator(date)) + " </<span>";
    };

    formatDateSeparator = function(date) {
      if (date.isSame(moment(), 'day')) {
        return 'Today';
      } else if (date.isSame(moment().subtract(1, 'days'), 'day')) {
        return 'Yesterday';
      } else {
        return date.format("MMM Do");
      }
    };

    redrawDateSeparators = function() {
      var el, i, len, ref, results;
      ref = $be('date-separator');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        el = ref[i];
        results.push($(el).html(formatDateSeparator(moment($(el).data('date')))));
      }
      return results;
    };

    bindRemoveEdit = function(cancelLink) {
      return cancelLink.on('click', function(e) {
        var messageId;
        e.preventDefault();
        messageId = $(this).data('id');
        $beById('message-body', messageId).show();
        return $beById('message-form-placeholder', messageId).html("");
      });
    };

    adjustMessage = function(messageId) {
      var messageContainer;
      messageContainer = $beById('message-containter', messageId);
      window.layoutHandler.setAvatarImages(messageContainer);
      window.layoutHandler.contactDetailsComponent.bindLinks(messageContainer);
      fillMessageTimestamp(messageId);
      return showAuthorData(messageId);
    };

    return DiscussionMessagesComponent;

  })();

}).call(this);
