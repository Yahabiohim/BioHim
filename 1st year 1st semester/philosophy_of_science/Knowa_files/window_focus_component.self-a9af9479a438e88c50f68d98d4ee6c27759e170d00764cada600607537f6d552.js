(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.WindowFocusComponent = (function() {
    function WindowFocusComponent(options) {
      this.windowIsFocused = bind(this.windowIsFocused, this);
      this.setup = bind(this.setup, this);
      this.windowFocused = !document.hidden;
      this.options = options;
    }

    WindowFocusComponent.prototype.setup = function() {
      window.addEventListener('focus', (function(_this) {
        return function() {
          _this.windowFocused = true;
          return _this.options.onfocus.forEach(function(callback) {
            return callback();
          });
        };
      })(this));
      return window.addEventListener('blur', (function(_this) {
        return function() {
          return _this.windowFocused = false;
        };
      })(this));
    };

    WindowFocusComponent.prototype.windowIsFocused = function() {
      return this.windowFocused;
    };

    return WindowFocusComponent;

  })();

}).call(this);
