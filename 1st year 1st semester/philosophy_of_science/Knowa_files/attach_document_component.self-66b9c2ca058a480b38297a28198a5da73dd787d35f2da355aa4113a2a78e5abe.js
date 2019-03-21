(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.AttachDocumentComponent = (function() {
    function AttachDocumentComponent(params) {
      this.loadAutosavedDocuments = bind(this.loadAutosavedDocuments, this);
      this.documentsAreAttached = bind(this.documentsAreAttached, this);
      this.addAttachedDocument = bind(this.addAttachedDocument, this);
      this.attachFiles = bind(this.attachFiles, this);
      this.bindAttachedDocumentCardActions = bind(this.bindAttachedDocumentCardActions, this);
      this.removeAttachedDocument = bind(this.removeAttachedDocument, this);
      this.appendAttachedDocument = bind(this.appendAttachedDocument, this);
      this.clearAttachedDocuments = bind(this.clearAttachedDocuments, this);
      this.activateTab = bind(this.activateTab, this);
      this.hideUploader = bind(this.hideUploader, this);
      this.showUploader = bind(this.showUploader, this);
      this.hidePicker = bind(this.hidePicker, this);
      this.showPicker = bind(this.showPicker, this);
      this.hideMessage = bind(this.hideMessage, this);
      this.showMessage = bind(this.showMessage, this);
      this.show = bind(this.show, this);
      this.setupBoxListeners = bind(this.setupBoxListeners, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.autosavedMessageComponent = params.autosavedMessageComponent;
      this.documentPreviewComponent = params.documentPreviewComponent;
      this.attachCallback = params.attachCallback;
      this.picker = new Box.FilePicker();
      this.uploader = new Box.ContentUploader();
      this.threadId = params.thread.id;
      switch (params.thread.type) {
        case 'Discussion':
          this.boxFoldersService = new DiscussionBoxFoldersService(this.threadId);
          break;
        case 'Chat':
          this.boxFoldersService = new ChatBoxFoldersService(this.threadId);
      }
      this.boxAuthService = new BoxAuthService();
      this.attachedDocumentsList = $be('attached-documents-list');
      this.attachedDocumentsData = $be('attached-documents-data');
      this.attachDocumentModal = $be('attach-document-modal');
      this.pickerElement = $be('file-picker');
      this.uploaderElement = $be('file-uploader');
      this.tabs = $be('attach-file-menu');
      this.uploadTab = $beById('attach-file-menu-item', 'upload-files');
      this.browseTab = $beById('attach-file-menu-item', 'browse-group-files');
      this.showMobileAttachDocument = $be('show-mobile-attach-document');
      this.loaderMessage = $be('loader-message');
      this.loaderMessageText = $be('loader-message-text');
    }

    AttachDocumentComponent.prototype.setup = function() {
      this.setupBoxListeners();
      this.attachDocumentModal.on('shown.bs.modal', (function(_this) {
        return function() {
          _this.showMessage('<p>Loading secure attachment files, please wait.</p> <p>If this is a new discussion or chat, it can take up to a minute.</p>');
          _this.tabs.hide();
          return _this.boxFoldersService.fetchFolders(function(data) {
            if (!data.error) {
              _this.rootFolderId = data.root_folder_id;
              _this.uploadsFolderId = data.uploads_folder_id;
              _this.tabs.show();
              _this.hideMessage();
              _this.showUploader();
              _this.hidePicker();
              return _this.activateTab(_this.uploadTab);
            } else {
              return _this.showMessage(data.error);
            }
          });
        };
      })(this));
      this.uploadTab.click((function(_this) {
        return function(e) {
          e.preventDefault();
          _this.activateTab(e.target);
          _this.hidePicker();
          return _this.showUploader();
        };
      })(this));
      this.browseTab.click((function(_this) {
        return function(e) {
          e.preventDefault();
          _this.activateTab(e.target);
          _this.hideUploader();
          return _this.showPicker();
        };
      })(this));
      $be('close-attach-document-modal').click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.attachDocumentModal.modal('hide');
        };
      })(this));
      return this.showMobileAttachDocument.click((function(_this) {
        return function(e) {
          return e.preventDefault();
        };
      })(this));
    };

    AttachDocumentComponent.prototype.teardown = function() {
      if (this.attachDocumentModal.hasClass('show')) {
        this.picker.hide();
        this.uploader.hide();
        return this.attachDocumentModal.modal('hide');
      }
    };

    AttachDocumentComponent.prototype.setupBoxListeners = function() {
      this.picker.addListener('choose', (function(_this) {
        return function(items) {
          _this.attachFiles(items);
          return _this.attachDocumentModal.modal('hide');
        };
      })(this));
      this.picker.addListener('cancel', (function(_this) {
        return function() {
          return _this.attachDocumentModal.modal('hide');
        };
      })(this));
      this.uploader.addListener('complete', (function(_this) {
        return function(items) {
          _this.attachFiles(items);
          return _this.attachDocumentModal.modal('hide');
        };
      })(this));
      this.uploader.addListener('close', (function(_this) {
        return function() {
          return _this.attachDocumentModal.modal('hide');
        };
      })(this));
      return this.uploader.addListener('error', (function(_this) {
        return function() {
          _this.attachDocumentModal.modal('hide');
          return $showFlashMessage('warning', 'Oops, it looks like something went wrong. Please try to attach the file again.');
        };
      })(this));
    };

    AttachDocumentComponent.prototype.show = function() {
      return this.attachDocumentModal.modal('show');
    };

    AttachDocumentComponent.prototype.showMessage = function(errorText) {
      this.uploaderElement.hide();
      this.pickerElement.hide();
      this.loaderMessageText.html(errorText);
      return this.loaderMessage.show();
    };

    AttachDocumentComponent.prototype.hideMessage = function() {
      return this.loaderMessage.hide();
    };

    AttachDocumentComponent.prototype.showPicker = function() {
      this.picker.clearCache();
      this.picker.show(this.rootFolderId, this.boxAuthService.fetchToken, {
        container: '[data-behavior=file-picker]',
        chooseButtonLabel: 'Attach',
        canCreateNewFolder: false,
        canSetShareAccess: false,
        canUpload: false,
        sortBy: 'modified_at',
        sortDirection: 'DESC',
        isTouch: true
      });
      this.picker.getComponent().fetchFolder(this.uploadsFolderId);
      return this.pickerElement.show();
    };

    AttachDocumentComponent.prototype.hidePicker = function() {
      return this.pickerElement.hide();
    };

    AttachDocumentComponent.prototype.showUploader = function() {
      this.uploader.show(this.uploadsFolderId, this.boxAuthService.fetchToken, {
        container: '[data-behavior=file-uploader]',
        isTouch: true,
        onClose: (function(_this) {
          return function() {
            return _this.attachDocumentModal.modal('hide');
          };
        })(this)
      });
      return this.uploaderElement.show();
    };

    AttachDocumentComponent.prototype.hideUploader = function() {
      return this.uploaderElement.hide();
    };

    AttachDocumentComponent.prototype.activateTab = function(element) {
      $be('attach-file-menu-item').removeClass('active');
      return $(element).addClass('active');
    };

    AttachDocumentComponent.prototype.clearAttachedDocuments = function() {
      this.attachedDocumentsList.html('');
      return this.attachedDocumentsData.val('');
    };

    AttachDocumentComponent.prototype.appendAttachedDocument = function(docsData, newDocData, docCard) {
      var alreadyAddedDoc;
      alreadyAddedDoc = docsData.find((function(_this) {
        return function(d) {
          return d.id === newDocData.id;
        };
      })(this));
      if (alreadyAddedDoc) {
        return;
      }
      this.attachedDocumentsList.append(docCard);
      this.autosavedMessageComponent.addDocument(newDocData, docCard[0].outerHTML);
      this.attachedDocumentsData.val(JSON.stringify(docsData.concat(newDocData)));
      return this.bindAttachedDocumentCardActions(docCard);
    };

    AttachDocumentComponent.prototype.removeAttachedDocument = function(card) {
      var docId, docsData, docsJson;
      docId = card.data('id');
      docsJson = this.attachedDocumentsData.val();
      if (docsJson) {
        docsData = JSON.parse(docsJson);
        this.attachedDocumentsData.val(JSON.stringify(docsData.filter((function(_this) {
          return function(d) {
            return !(d.id === docId);
          };
        })(this))));
      }
      this.autosavedMessageComponent.removeDocument(docId);
      return $beById(card.data('behavior'), docId).remove();
    };

    AttachDocumentComponent.prototype.bindAttachedDocumentCardActions = function(docCard) {
      var cards;
      cards = $beById(docCard.data('behavior'), docCard.data('id'));
      cards.find('[data-behavior=remove-attached-document]').click((function(_this) {
        return function(e) {
          var card;
          e.preventDefault();
          card = $(e.target).parents('[data-behavior=attached-document-card-instance]');
          return _this.removeAttachedDocument(docCard);
        };
      })(this));
      return cards.find('[data-behavior=preview-attached-document]').click((function(_this) {
        return function(e) {
          var allFiles, card, f, j, len, ref, uniqAllFiles;
          e.preventDefault();
          card = $(e.target).parents('[data-behavior=attached-document-card-instance]');
          allFiles = $be('attached-document-card-instance').map(function(i, c) {
            return {
              id: $(c).data('id'),
              filename: $(c).data('filename')
            };
          }).toArray();
          uniqAllFiles = [];
          for (j = 0, len = allFiles.length; j < len; j++) {
            f = allFiles[j];
            if (ref = f.id, indexOf.call(uniqAllFiles.map(function(file) {
              return file.id;
            }), ref) < 0) {
              uniqAllFiles.push(f);
            }
          }
          return _this.documentPreviewComponent.show(card.data('id'), card.data('filename'), uniqAllFiles);
        };
      })(this));
    };

    AttachDocumentComponent.prototype.attachFiles = function(fileItems) {
      var card, fileItem, j, len;
      for (j = 0, len = fileItems.length; j < len; j++) {
        fileItem = fileItems[j];
        card = $be('attached-document-card-template').clone();
        card.attr('data-id', fileItem.id);
        card.attr('data-filename', fileItem.name);
        card.attr('data-behavior', 'attached-document-card-instance');
        card.find('[data-behavior=attached-document-name]').html(fileItem.name);
        this.addAttachedDocument(card);
      }
      return this.attachCallback();
    };

    AttachDocumentComponent.prototype.addAttachedDocument = function(card) {
      var docData, docsData, docsJson;
      docData = {
        id: card.data('id'),
        filename: card.data('filename')
      };
      docsJson = this.attachedDocumentsData.val();
      if (docsJson) {
        docsData = JSON.parse(docsJson);
        return this.appendAttachedDocument(docsData, docData, card);
      } else {
        return this.appendAttachedDocument([], docData, card);
      }
    };

    AttachDocumentComponent.prototype.documentsAreAttached = function() {
      var docData;
      docData = this.attachedDocumentsData.val();
      return docData && JSON.parse(docData).length !== 0;
    };

    AttachDocumentComponent.prototype.loadAutosavedDocuments = function() {
      var docCard, docsCards, docsDataJson, j, len, results;
      docsDataJson = this.autosavedMessageComponent.getDocumentsDataJson();
      docsCards = this.autosavedMessageComponent.getDocumentCards();
      if (docsDataJson && docsCards) {
        this.attachedDocumentsData.val(docsDataJson);
        results = [];
        for (j = 0, len = docsCards.length; j < len; j++) {
          docCard = docsCards[j];
          this.attachedDocumentsList.append($(docCard));
          results.push(this.bindAttachedDocumentCardActions($(docCard)));
        }
        return results;
      }
    };

    return AttachDocumentComponent;

  })();

}).call(this);
