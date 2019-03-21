(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.AnalyticsComponent = (function() {
    function AnalyticsComponent() {
      this.setup = bind(this.setup, this);
    }

    AnalyticsComponent.prototype.setup = function() {
      var identifyData, user;
      if (!window.analytics || window.analytics.isStubbed) {
        return;
      }
      user = $currentUser();
      if (!user.isPresent()) {
        return;
      }
      identifyData = {
        name: user.fullName,
        email: user.email,
        main_account: user.mainAccount,
        account_names: user.accountNames,
        account_ids: user.accountIds,
        space_ids: user.schemeIds,
        space_names: user.schemeNames
      };
      window.analytics.identify(user.id, identifyData, {
        Intercom: {
          hideDefaultLauncher: true
        }
      });
      window.analytics.group(user.mainAccount.id, {
        name: user.mainAccount.name
      });
      return $be('show-intercom').click(function(e) {
        e.preventDefault();
        Intercom('update', {
          'hide_default_launcher': false
        });
        return Intercom('show');
      });
    };

    return AnalyticsComponent;

  })();

}).call(this);
