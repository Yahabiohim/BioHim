(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.LayoutHandler = (function() {
    var exitWhenHighlighted, onSameChatPage, onSameDiscussionPage, skipUnreadsUpdate;

    function LayoutHandler() {
      this.setAvatarImages = bind(this.setAvatarImages, this);
      this.bindUserMenuToggle = bind(this.bindUserMenuToggle, this);
      this.resetGlobalBadgeOnFocus = bind(this.resetGlobalBadgeOnFocus, this);
      this.displayGlobalBadge = bind(this.displayGlobalBadge, this);
      this.getFavicons = bind(this.getFavicons, this);
      this.handleChatsUpdateChannelMessage = bind(this.handleChatsUpdateChannelMessage, this);
      this.handleDiscussionsUpdateChannelMessage = bind(this.handleDiscussionsUpdateChannelMessage, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      var unreadMessageStats;
      this.windowFocusComponent = new WindowFocusComponent({
        onfocus: [
          (function(_this) {
            return function() {
              return _this.resetGlobalBadgeOnFocus();
            };
          })(this)
        ]
      });
      unreadMessageStats = $be("app-layout").data("unread-message-stats");
      this.navbarComponent = new NavbarComponent(unreadMessageStats);
      this.sidebarComponent = new SidebarComponent(unreadMessageStats);
      this.contactDetailsComponent = new ContactDetailsComponent();
      this.favicons = this.getFavicons();
      this.showBadgeOnFavicon = $be("app-layout").data("show-badge-on-favicon");
      this.chatNavbarLink = $be("chats-navbar-link");
      this.searchNavbarLink = $be("search-navbar-link");
      this.userMenu = $be("user-menu");
      this.removeBadgeOnFocus = !this.showBadgeOnFavicon;
      this.discussionsUpdatesChannel = AblyRealtimeClient.channels.get("discussions:updates");
      this.chatsUpdateChannel = AblyRealtimeClient.channels.get("chats:updates");
      this.channelData = [
        {
          channel: this.discussionsUpdatesChannel,
          subscriber: this.handleDiscussionsUpdateChannelMessage
        }, {
          channel: this.chatsUpdateChannel,
          subscriber: this.handleChatsUpdateChannelMessage
        }
      ];
      this.analyticsComponent = new AnalyticsComponent();
    }

    LayoutHandler.prototype.setup = function() {
      this.sidebarComponent.setup();
      this.windowFocusComponent.setup();
      this.navbarComponent.setup();
      this.contactDetailsComponent.setup();
      this.analyticsComponent.setup();
      $setupChannelSubscriptions(this.channelData);
      if (this.showBadgeOnFavicon) {
        this.displayGlobalBadge();
      }
      this.chatNavbarLink.click(function(e) {
        var link;
        link = $(this);
        return exitWhenHighlighted(e, link);
      });
      this.searchNavbarLink.click(function(e) {
        var link;
        link = $(this);
        return exitWhenHighlighted(e, link);
      });
      this.bindUserMenuToggle();
      return this.setAvatarImages($be('app-layout'));
    };

    LayoutHandler.prototype.teardown = function() {
      return $teardownChannelSubscriptions(this.channelData);
    };

    LayoutHandler.prototype.handleDiscussionsUpdateChannelMessage = function(channelMessage) {
      var groupModel, ref, userOnSamePage;
      if (channelMessage.name !== 'message-create') {
        return;
      }
      groupModel = new GroupModel(channelMessage.data.group);
      if (skipUnreadsUpdate(channelMessage, groupModel)) {
        return;
      }
      userOnSamePage = onSameDiscussionPage(channelMessage.data.discussionId);
      this.displayGlobalBadge(userOnSamePage);
      if (userOnSamePage) {
        return;
      }
      this.sidebarComponent.markSchemeLinksAsUnread(groupModel.mainSchemeIds);
      this.sidebarComponent.markRecentItemLinksAsUnread('discussion', [channelMessage.data.discussionId]);
      if (ref = $currentMainSchemeId(), indexOf.call(groupModel.mainSchemeIds, ref) >= 0) {
        if (groupModel.inJointScheme) {
          return this.navbarComponent.markJointSchemeLinkAsUnread();
        } else {
          return this.navbarComponent.markPrivateSchemeLinkAsUnread();
        }
      } else {
        return this.sidebarComponent.markMenuAsUnread();
      }
    };

    LayoutHandler.prototype.handleChatsUpdateChannelMessage = function(channelMessage) {
      var threadModel, userOnSamePage;
      if (channelMessage.name !== 'message-create') {
        return;
      }
      threadModel = new ThreadModel(channelMessage.data.thread);
      if (!threadModel.isMemberId($currentUserId())) {
        return;
      }
      userOnSamePage = onSameChatPage(channelMessage.data.chatId);
      this.displayGlobalBadge(userOnSamePage);
      if (!userOnSamePage) {
        this.navbarComponent.markChatsLinkAsUnread();
        return this.sidebarComponent.markRecentItemLinksAsUnread('chat', [channelMessage.data.chatId]);
      }
    };

    LayoutHandler.prototype.getFavicons = function() {
      var favicons;
      favicons = [];
      $('link[rel*=icon]').each(function(_, el) {
        favicons.push(new Favico({
          bgColor: '#D22C3D',
          position: 'up',
          element: el
        }));
      });
      return favicons;
    };

    LayoutHandler.prototype.displayGlobalBadge = function(onBlurredOnly) {
      if (onBlurredOnly == null) {
        onBlurredOnly = false;
      }
      if (onBlurredOnly) {
        if (this.windowFocusComponent.windowIsFocused()) {
          return;
        }
      } else {
        this.removeBadgeOnFocus = false;
      }
      return this.favicons.forEach(function(f) {
        return f.badge(' ');
      });
    };

    LayoutHandler.prototype.resetGlobalBadgeOnFocus = function() {
      if (this.removeBadgeOnFocus) {
        return this.favicons.forEach(function(f) {
          return f.reset();
        });
      }
    };

    LayoutHandler.prototype.bindUserMenuToggle = function() {
      return this.userMenu.on('click', function() {
        return $(this).toggleClass('expanded');
      });
    };

    skipUnreadsUpdate = function(channelMessage, groupModel) {
      return parseInt(channelMessage.data.authorId) === $currentUserId() || !groupModel.isMemberId($currentUserId());
    };

    onSameDiscussionPage = function(discussionId) {
      return discussionId && $beById('discussion-page', discussionId).length > 0;
    };

    onSameChatPage = function(chatId) {
      return $beById('chat-page', chatId).length > 0;
    };

    exitWhenHighlighted = function(event, link) {
      if (link.hasClass('highlighted')) {
        event.preventDefault();
        return Turbolinks.visit(link.data('exit-path'));
      }
    };

    LayoutHandler.prototype.setAvatarImages = function(container) {
      return container.find('[data-behavior=avatar-image]').each((function(_this) {
        return function(idx, image) {
          var imageUrl;
          imageUrl = $(image).data('url');
          if (imageUrl) {
            return $(image).css('background-image', "url(" + imageUrl + ")");
          }
        };
      })(this));
    };

    return LayoutHandler;

  })();

}).call(this);
