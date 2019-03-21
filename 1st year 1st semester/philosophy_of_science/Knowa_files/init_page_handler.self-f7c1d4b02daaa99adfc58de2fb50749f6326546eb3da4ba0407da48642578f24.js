(function() {
  var pageHandlerSetup, pageHandlerTeardown;

  pageHandlerSetup = function() {
    var pageHandlerName;
    pageHandlerName = $('body').data('page-handler');
    if ('function' === typeof window[pageHandlerName]) {
      window.pageHandler = new window[pageHandlerName]();
      return window.pageHandler.setup();
    }
  };

  pageHandlerTeardown = function() {
    if (!window.pageHandler) {
      return;
    }
    return window.pageHandler.teardown();
  };

  document.addEventListener('turbolinks:load', pageHandlerSetup);

  document.addEventListener('turbolinks:before-render', pageHandlerTeardown);

}).call(this);
