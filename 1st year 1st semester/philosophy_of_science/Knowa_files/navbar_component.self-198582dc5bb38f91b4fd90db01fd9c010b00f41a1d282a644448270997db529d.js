(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.NavbarComponent = (function() {
    function NavbarComponent(stats) {
      this.markChatsLinkAsUnread = bind(this.markChatsLinkAsUnread, this);
      this.markJointSchemeLinkAsUnread = bind(this.markJointSchemeLinkAsUnread, this);
      this.markPrivateSchemeLinkAsUnread = bind(this.markPrivateSchemeLinkAsUnread, this);
      this.setup = bind(this.setup, this);
      this.stats = stats;
      this.chatsNavbarLink = $be('chats-navbar-link');
      this.privateNavbarLink = $be('private-navbar-link');
      this.jointNavbarLink = $be('joint-navbar-link');
    }

    NavbarComponent.prototype.setup = function() {
      var ref, ref1;
      if (!$.isEmptyObject(this.stats.chat_counts)) {
        this.markChatsLinkAsUnread();
      }
      if (ref = this.privateNavbarLink.data('id'), indexOf.call(this.stats.private_scheme_ids, ref) >= 0) {
        this.markPrivateSchemeLinkAsUnread();
      }
      if (ref1 = this.jointNavbarLink.data('id'), indexOf.call(this.stats.joint_scheme_ids, ref1) >= 0) {
        return this.markJointSchemeLinkAsUnread();
      }
    };

    NavbarComponent.prototype.markPrivateSchemeLinkAsUnread = function() {
      return this.privateNavbarLink.addClass('unread');
    };

    NavbarComponent.prototype.markJointSchemeLinkAsUnread = function() {
      return this.jointNavbarLink.addClass('unread');
    };

    NavbarComponent.prototype.markChatsLinkAsUnread = function() {
      return this.chatsNavbarLink.find('[data-behavior=unread-dot-placeholder]').addClass('unread');
    };

    return NavbarComponent;

  })();

}).call(this);
