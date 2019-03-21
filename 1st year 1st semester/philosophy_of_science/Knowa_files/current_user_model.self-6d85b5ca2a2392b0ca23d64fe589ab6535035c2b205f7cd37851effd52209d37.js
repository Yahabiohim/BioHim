(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.CurrentUserModel = (function() {
    function CurrentUserModel(userData) {
      this.isPresent = bind(this.isPresent, this);
      if (userData) {
        this.id = parseInt(userData.id);
        this.fullName = userData.full_name;
        this.email = userData.email;
        this.mainAccount = userData.main_account;
        this.accountIds = userData.account_ids;
        this.accountNames = userData.account_names;
        this.schemeIds = userData.scheme_ids;
        this.schemeNames = userData.scheme_names;
      }
    }

    CurrentUserModel.prototype.isPresent = function() {
      return this.id && this.id > 0;
    };

    return CurrentUserModel;

  })();

}).call(this);
