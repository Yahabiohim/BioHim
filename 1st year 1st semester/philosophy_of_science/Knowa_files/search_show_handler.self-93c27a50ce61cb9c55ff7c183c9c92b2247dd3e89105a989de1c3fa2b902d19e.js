(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.SearchShowHandler = (function() {
    var setResultsTimestamps;

    function SearchShowHandler() {
      this.bindDocumentPreview = bind(this.bindDocumentPreview, this);
      this.toggleClearInput = bind(this.toggleClearInput, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.documentPreviewComponent = new DocumentPreviewComponent();
      this.form = $be('search-form');
      this.input = $be('search-input');
      this.clearInput = $be('clear-search-input');
      this.submit = $be('search-submit');
      this.results = $be('search-results');
    }

    SearchShowHandler.prototype.setup = function() {
      this.documentPreviewComponent.setup();
      this.toggleClearInput();
      this.form.submit((function(_this) {
        return function() {
          _this.submit.prop('disabled', true);
          Turbolinks.visit((_this.form.attr('action')) + "?" + (_this.form.serialize()));
          return false;
        };
      })(this));
      this.input.on('change keydown paste input', (function(_this) {
        return function() {
          return _this.toggleClearInput();
        };
      })(this));
      this.bindDocumentPreview('search-result-attached-document');
      this.bindDocumentPreview('search-result-box-file');
      return setResultsTimestamps();
    };

    SearchShowHandler.prototype.teardown = function() {
      return this.documentPreviewComponent.teardown();
    };

    SearchShowHandler.prototype.toggleClearInput = function() {
      if (this.input.val().length > 0) {
        return this.clearInput.show();
      } else {
        return this.clearInput.hide();
      }
    };

    SearchShowHandler.prototype.bindDocumentPreview = function(behaviorSelector) {
      var pageHandler;
      pageHandler = this;
      return $be(behaviorSelector).find('[data-behavior=search-result-primary-action]').click(function() {
        var card;
        card = $(this).parents("[data-behavior=" + behaviorSelector + "]");
        return pageHandler.documentPreviewComponent.show(card.data('id'), card.data('filename'));
      });
    };

    setResultsTimestamps = function() {
      var el, i, len, ref, results;
      ref = $be('search-result-timestamp');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        el = ref[i];
        results.push($setTimestampContent($(el)));
      }
      return results;
    };

    return SearchShowHandler;

  })();

}).call(this);
