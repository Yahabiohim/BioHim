(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.AutosavedMessageComponent = (function() {
    function AutosavedMessageComponent(contentId) {
      this.getDocuments = bind(this.getDocuments, this);
      this.getDocumentCards = bind(this.getDocumentCards, this);
      this.getDocumentsDataJson = bind(this.getDocumentsDataJson, this);
      this.savedContentIsPresent = bind(this.savedContentIsPresent, this);
      this.removeDocument = bind(this.removeDocument, this);
      this.appendDocumentItem = bind(this.appendDocumentItem, this);
      this.addDocument = bind(this.addDocument, this);
      this.reset = bind(this.reset, this);
      this.set = bind(this.set, this);
      this.get = bind(this.get, this);
      this.contentId = "autosave-" + contentId;
      this.documentsId = this.contentId + "-documents";
    }

    AutosavedMessageComponent.prototype.get = function() {
      return localStorage.getItem(this.contentId);
    };

    AutosavedMessageComponent.prototype.set = function(content) {
      return localStorage.setItem(this.contentId, content);
    };

    AutosavedMessageComponent.prototype.reset = function() {
      localStorage.removeItem(this.contentId);
      return localStorage.removeItem(this.documentsId);
    };

    AutosavedMessageComponent.prototype.addDocument = function(docData, cardHtml) {
      var docItem, items, savedDocs;
      docItem = {
        id: docData.id,
        filename: docData.filename,
        html: cardHtml
      };
      savedDocs = localStorage.getItem(this.documentsId);
      if (savedDocs) {
        items = JSON.parse(savedDocs);
        return this.appendDocumentItem(items, docItem);
      } else {
        return this.appendDocumentItem([], docItem);
      }
    };

    AutosavedMessageComponent.prototype.appendDocumentItem = function(items, docItem) {
      var alreadyAddedDoc;
      alreadyAddedDoc = items.find((function(_this) {
        return function(d) {
          return d.id === docItem.id;
        };
      })(this));
      if (alreadyAddedDoc) {
        return;
      }
      return localStorage.setItem(this.documentsId, JSON.stringify(items.concat(docItem)));
    };

    AutosavedMessageComponent.prototype.removeDocument = function(docId) {
      return localStorage.setItem(this.documentsId, JSON.stringify(this.getDocuments().filter((function(_this) {
        return function(d) {
          return !(d.id === docId);
        };
      })(this))));
    };

    AutosavedMessageComponent.prototype.savedContentIsPresent = function() {
      return localStorage.getItem(this.contentId) || localStorage.getItem(this.documentsId);
    };

    AutosavedMessageComponent.prototype.getDocumentsDataJson = function() {
      var docItem, i, len, ref, result;
      result = [];
      ref = this.getDocuments();
      for (i = 0, len = ref.length; i < len; i++) {
        docItem = ref[i];
        result.push({
          id: docItem.id,
          filename: docItem.filename
        });
      }
      return JSON.stringify(result);
    };

    AutosavedMessageComponent.prototype.getDocumentCards = function() {
      var docItem, i, len, ref, result;
      result = [];
      ref = this.getDocuments();
      for (i = 0, len = ref.length; i < len; i++) {
        docItem = ref[i];
        result.push(docItem.html);
      }
      return result;
    };

    AutosavedMessageComponent.prototype.getDocuments = function() {
      var savedDocs;
      savedDocs = localStorage.getItem(this.documentsId);
      if (!savedDocs) {
        return [];
      }
      return JSON.parse(savedDocs);
    };

    return AutosavedMessageComponent;

  })();

}).call(this);
