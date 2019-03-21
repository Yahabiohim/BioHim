(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.DocumentPreviewComponent = (function() {
    function DocumentPreviewComponent() {
      this.updateFileName = bind(this.updateFileName, this);
      this.show = bind(this.show, this);
      this.bindDocumentPreview = bind(this.bindDocumentPreview, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.previewModal = $be('file-preview-modal');
      this.preview = new Box.Preview();
      this.boxAuthService = new BoxAuthService();
    }

    DocumentPreviewComponent.prototype.setup = function() {
      this.previewModal.on('hide.bs.modal', (function(_this) {
        return function() {
          return _this.preview.hide();
        };
      })(this));
      return this.preview.addListener('navigate', (function(_this) {
        return function(fileId) {
          var file;
          if (!_this.fileCollection) {
            return;
          }
          file = _this.fileCollection.find(function(f) {
            return String(f.id) === String(fileId);
          });
          if (file) {
            return _this.updateFileName(file.filename);
          }
        };
      })(this));
    };

    DocumentPreviewComponent.prototype.teardown = function() {
      if (this.previewModal.hasClass('show')) {
        return this.previewModal.modal('hide');
      }
    };

    DocumentPreviewComponent.prototype.bindDocumentPreview = function(container) {
      var component;
      component = this;
      return container.find('[data-behavior=preview-document-link]').click(function(e) {
        e.preventDefault();
        return component.show($(this).data('id'), $(this).data('filename'), $(this).data('collection'));
      });
    };

    DocumentPreviewComponent.prototype.show = function(fileId, filename, fileCollection) {
      this.fileCollection = fileCollection;
      this.preview.show(fileId, this.boxAuthService.fetchToken, {
        container: '[data-behavior=file-preview-container]',
        showDownload: true,
        header: 'light',
        collection: fileCollection
      });
      this.updateFileName(filename);
      return this.previewModal.modal('show');
    };

    DocumentPreviewComponent.prototype.updateFileName = function(filename) {
      return this.previewModal.find('[data-behavior=file-name]').html(filename);
    };

    return DocumentPreviewComponent;

  })();

}).call(this);
