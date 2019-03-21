(function() {
  this.BoxAuthService = (function() {
    function BoxAuthService() {}

    BoxAuthService.prototype.fetchToken = function() {
      return $.get('/box_auth').then((function(_this) {
        return function(data) {
          return data.box_access_token;
        };
      })(this));
    };

    return BoxAuthService;

  })();

}).call(this);
