(function() {
  var autoHideServerFlashMessage, layoutHandlerSetup, layoutHandlerTeardown, showClientFlashMessage;

  iNoBounce.enable();

  layoutHandlerSetup = function() {
    if (window.AblyRealtimeClient) {
      window.layoutHandler = new LayoutHandler();
      return window.layoutHandler.setup();
    }
  };

  layoutHandlerTeardown = function() {
    if (!window.layoutHandler) {
      return;
    }
    return window.layoutHandler.teardown();
  };

  autoHideServerFlashMessage = function() {
    var flashMessage;
    flashMessage = $be('flash-message');
    return $delayedRemove(flashMessage);
  };

  showClientFlashMessage = function() {
    var clientFlashMessage, flashJson, flashMessage;
    flashJson = sessionStorage.getItem("clientFlashMessage");
    if (!flashJson) {
      return;
    }
    clientFlashMessage = JSON.parse(flashJson);
    flashMessage = $generateFlashMessage(clientFlashMessage.level, clientFlashMessage.text);
    $delayedRemove(flashMessage);
    return sessionStorage.removeItem("clientFlashMessage");
  };

  document.addEventListener('turbolinks:load', layoutHandlerSetup);

  document.addEventListener('turbolinks:load', autoHideServerFlashMessage);

  document.addEventListener('turbolinks:load', showClientFlashMessage);

  document.addEventListener('turbolinks:before-render', layoutHandlerTeardown);

}).call(this);
