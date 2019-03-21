(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.SidebarComponent = (function() {
    var hiddenAccountSectionKey, hideAccountSection, showAccountSection, storeAccountSectionHidden, storeAccountSectionShown;

    function SidebarComponent(unreadMessageStats) {
      this.scrollSidebarToCurrentItem = bind(this.scrollSidebarToCurrentItem, this);
      this.initSidebarCustomScroll = bind(this.initSidebarCustomScroll, this);
      this.toggleSidebarState = bind(this.toggleSidebarState, this);
      this.showSidebar = bind(this.showSidebar, this);
      this.isWideScreen = bind(this.isWideScreen, this);
      this.isSidebarVisible = bind(this.isSidebarVisible, this);
      this.bindSidebarToggle = bind(this.bindSidebarToggle, this);
      this.markCurrentThreadLink = bind(this.markCurrentThreadLink, this);
      this.markCurrentSchemeLink = bind(this.markCurrentSchemeLink, this);
      this.markMenuAsUnread = bind(this.markMenuAsUnread, this);
      this.markRecentItemLinksAsUnread = bind(this.markRecentItemLinksAsUnread, this);
      this.markSchemeLinksAsUnread = bind(this.markSchemeLinksAsUnread, this);
      this.bindCollapsibleAccountSections = bind(this.bindCollapsibleAccountSections, this);
      this.collapseAccountSections = bind(this.collapseAccountSections, this);
      this.setup = bind(this.setup, this);
      var key;
      this.unreadSchemeIds = unreadMessageStats.main_scheme_ids;
      this.unreadDiscussionIds = [];
      for (key in unreadMessageStats.discussion_counts) {
        this.unreadDiscussionIds.push(key);
      }
      this.unreadChatIds = [];
      for (key in unreadMessageStats.chat_counts) {
        this.unreadChatIds.push(key);
      }
      this.sidebarToggle = $be("sidebar-toggle");
      this.sidebarStateKey = 'sidebar_state';
      this.sidebarMobileBreakpoint = '1100';
      this.sidebarClass = 'no-sidebar';
      this.sidebarToggleButtonClass = 'show-sidebar';
      this.accountSidebarSections = $be('account-sidebar-section');
    }

    SidebarComponent.prototype.setup = function() {
      this.markCurrentSchemeLink();
      this.showSidebar();
      this.bindSidebarToggle();
      this.initSidebarCustomScroll();
      this.scrollSidebarToCurrentItem();
      this.collapseAccountSections();
      this.markCurrentThreadLink();
      this.markSchemeLinksAsUnread(this.unreadSchemeIds);
      this.markRecentItemLinksAsUnread('discussion', this.unreadDiscussionIds);
      this.markRecentItemLinksAsUnread('chat', this.unreadChatIds);
      this.bindCollapsibleAccountSections();
      $be('more-recent-items-section').on('shown.bs.collapse', function() {
        return localStorage.setItem('recent-items-shown', true);
      });
      $be('more-recent-items-section').on('hidden.bs.collapse', function() {
        return localStorage.removeItem('recent-items-shown');
      });
      if (localStorage.getItem('recent-items-shown')) {
        $be('more-recent-items-toggle').removeClass('collapsed');
        return $be('more-recent-items-section').addClass('show');
      }
    };

    SidebarComponent.prototype.collapseAccountSections = function() {
      return this.accountSidebarSections.each(function(idx, sectionElement) {
        var hidden, section;
        section = $(sectionElement);
        if (section.data('id') === $currentAccountId()) {
          showAccountSection(section);
          return storeAccountSectionShown(section);
        } else {
          hidden = localStorage.getItem(hiddenAccountSectionKey(section.data('id')));
          if (hidden) {
            return hideAccountSection(section);
          }
        }
      });
    };

    SidebarComponent.prototype.bindCollapsibleAccountSections = function() {
      this.accountSidebarSections.on('shown.bs.collapse', function() {
        return storeAccountSectionShown(this);
      });
      return this.accountSidebarSections.on('hidden.bs.collapse', function() {
        return storeAccountSectionHidden(this);
      });
    };

    SidebarComponent.prototype.markSchemeLinksAsUnread = function(schemeIds) {
      var i, len, results, schemeId, schemeLink, section;
      results = [];
      for (i = 0, len = schemeIds.length; i < len; i++) {
        schemeId = schemeIds[i];
        schemeLink = $beById('scheme-menu-link', schemeId);
        schemeLink.addClass('unread');
        section = schemeLink.parents('[data-behavior=account-sidebar-section]');
        showAccountSection(section);
        results.push(storeAccountSectionShown(section));
      }
      return results;
    };

    SidebarComponent.prototype.markRecentItemLinksAsUnread = function(type, itemIds) {
      var i, itemId, len, results;
      results = [];
      for (i = 0, len = itemIds.length; i < len; i++) {
        itemId = itemIds[i];
        results.push($beById('recent-thread-link', itemId).filter("[data-type=" + type + "]").addClass('unread'));
      }
      return results;
    };

    SidebarComponent.prototype.markMenuAsUnread = function() {
      return this.sidebarToggle.addClass('unread');
    };

    SidebarComponent.prototype.markCurrentSchemeLink = function() {
      var mainSchemeId;
      mainSchemeId = $currentMainSchemeId();
      if (mainSchemeId) {
        return $beById('scheme-menu-link', mainSchemeId).addClass('current');
      }
    };

    SidebarComponent.prototype.markCurrentThreadLink = function() {
      var currentThread;
      currentThread = $currentThread();
      if (currentThread) {
        return $beById('recent-thread-link', currentThread.id).filter("[data-type=" + currentThread.type + "]").addClass('current');
      }
    };

    SidebarComponent.prototype.bindSidebarToggle = function() {
      return this.sidebarToggle.on('click', (function(_this) {
        return function() {
          $('body').addClass('with-transition');
          $('body').toggleClass(_this.sidebarClass);
          _this.sidebarToggle.toggleClass(_this.sidebarToggleButtonClass);
          return _this.toggleSidebarState();
        };
      })(this));
    };

    SidebarComponent.prototype.isSidebarVisible = function() {
      return localStorage.getItem(this.sidebarStateKey) === 'shown';
    };

    SidebarComponent.prototype.isWideScreen = function() {
      return $(window).width() > this.sidebarMobileBreakpoint;
    };

    SidebarComponent.prototype.showSidebar = function() {
      if (this.isSidebarVisible() && this.isWideScreen()) {
        $('body').removeClass(this.sidebarClass);
        return this.sidebarToggle.removeClass(this.sidebarToggleButtonClass);
      }
    };

    SidebarComponent.prototype.toggleSidebarState = function() {
      if (this.isWideScreen() && !this.isSidebarVisible()) {
        return localStorage.setItem(this.sidebarStateKey, 'shown');
      } else {
        return localStorage.setItem(this.sidebarStateKey, 'hidden');
      }
    };

    SidebarComponent.prototype.initSidebarCustomScroll = function() {
      var ps;
      return ps = new PerfectScrollbar('.sidebar-sections-wrapper');
    };

    SidebarComponent.prototype.scrollSidebarToCurrentItem = function() {
      var currentAccountId, currentThread, position;
      currentThread = $currentThread();
      currentAccountId = $currentAccountId();
      if (currentThread && ($findGetParameter('focus') === 'recent')) {
        position = $be('recent-sidebar-section')[0].offsetTop;
      } else if (currentAccountId) {
        position = $beById('account-sidebar-section', currentAccountId)[0].offsetTop;
      }
      if (position) {
        return $be('scheme-menu-section').scrollTop(position - 110);
      }
    };

    hideAccountSection = function(section) {
      section.find('[data-behavior=account-section-toggler]').addClass('collapsed');
      return section.find('[data-behavior=account-section-content]').removeClass('show');
    };

    showAccountSection = function(section) {
      section.find('[data-behavior=account-section-toggler]').removeClass('collapsed');
      return section.find('[data-behavior=account-section-content]').addClass('show');
    };

    storeAccountSectionHidden = function(section) {
      return localStorage.setItem(hiddenAccountSectionKey($(section).data('id')), true);
    };

    storeAccountSectionShown = function(section) {
      return localStorage.removeItem(hiddenAccountSectionKey($(section).data('id')));
    };

    hiddenAccountSectionKey = function(id) {
      return "hidden-account-sidebar-section-" + id;
    };

    return SidebarComponent;

  })();

}).call(this);
