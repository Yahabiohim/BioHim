(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.ContactsIndexHandler = (function() {
    function ContactsIndexHandler() {
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.membershipWatcher = new SchemeMembershipWatcherComponent();
    }

    ContactsIndexHandler.prototype.setup = function() {
      return this.membershipWatcher.setup();
    };

    ContactsIndexHandler.prototype.teardown = function() {
      return this.membershipWatcher.teardown();
    };

    return ContactsIndexHandler;

  })();

}).call(this);
