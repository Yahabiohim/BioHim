(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.MessageEditorComponent = (function() {
    function MessageEditorComponent(selector, options) {
      this.extractMentionUserIds = bind(this.extractMentionUserIds, this);
      this.contentIsEmpty = bind(this.contentIsEmpty, this);
      this.resetCache = bind(this.resetCache, this);
      this.getWrappedContent = bind(this.getWrappedContent, this);
      this.refreshPlaceholder = bind(this.refreshPlaceholder, this);
      this.focus = bind(this.focus, this);
      this.clear = bind(this.clear, this);
      this.setup = bind(this.setup, this);
      this.selector = selector;
      this.options = options;
      if (options.autosaveContentId) {
        this.autosavedMessageComponent = new AutosavedMessageComponent(options.autosaveContentId);
      }
    }

    MessageEditorComponent.prototype.setup = function() {
      var cachedMessage, defaultParams;
      if ((indexOf.call(this.options.buttonList, 'addDocument') >= 0) && this.options.onAddDocument) {
        $.FroalaEditor.DefineIcon('addDocument', {
          NAME: 'paperclip'
        });
        $.FroalaEditor.RegisterCommand('addDocument', {
          title: 'Add document',
          focus: true,
          undo: true,
          refreshAfterCallback: true,
          callback: (function(_this) {
            return function() {
              return _this.options.onAddDocument();
            };
          })(this)
        });
      }
      defaultParams = {
        key: window.FroalaKey,
        toolbarButtons: this.options.buttonList,
        toolbarButtonsMD: this.options.buttonList,
        toolbarButtonsSM: this.options.buttonList,
        toolbarButtonsXS: this.options.buttonList,
        placeholderText: this.selector.data('placeholder')
      };
      if (this.options.mentions) {
        this.selector.on('froalaEditor.initialized', (function(_this) {
          return function(e, editor) {
            var PUNCTUATION, config, mentionEl, mentionPosition;
            config = jQuery.extend({}, _this.options.mentions, {
              at: "@",
              searchKey: 'inserted_name',
              displayTpl: '<li data-id=${id} data-behavior="user-mention-option">${full_name}</li>',
              insertTpl: '<span class="user-mention ${additional_class}" data-id=${id} data-behavior="user-mention">@${inserted_name}</span>',
              limit: 200
            });
            mentionPosition = void 0;
            mentionEl = $();
            PUNCTUATION = [',', '.', '?', '!', ';', ':'];
            editor.$el.atwho(config).on('inserted.atwho', function() {
              mentionEl = editor.$el.find('.atwho-inserted').last();
              mentionEl.removeAttr('contenteditable');
              return mentionPosition = editor.$el.caret('pos');
            });
            editor.events.on('keydown', function(e) {
              if (e.which === $.FroalaEditor.KEYCODE.ENTER && editor.$el.atwho('isSelecting')) {
                return false;
              }
            }, true);
            return editor.events.on('keyup', function(e) {
              var pattern;
              if (PUNCTUATION.includes(e.key) && (mentionPosition + 1) === editor.$el.caret('pos')) {
                pattern = new RegExp("\\s" + e.key);
                mentionEl[0].nextSibling.textContent = mentionEl[0].nextSibling.textContent.replace(pattern, e.key);
                editor.selection.setAtEnd(editor.$el.get(0));
                return editor.selection.restore();
              }
            }, true);
          };
        })(this));
      }
      this.selector.froalaEditor(jQuery.extend({}, defaultParams, this.options.params));
      if (this.options.onCtlrEnter) {
        this.selector.froalaEditor('events.on', 'keydown', (function(_this) {
          return function(e) {
            if (e.keyCode === 13 && e.ctrlKey) {
              e.preventDefault();
              e.stopPropagation();
              _this.options.onCtlrEnter();
            }
            return false;
          };
        })(this), true);
      }
      if (this.options.onFocus) {
        this.selector.on('froalaEditor.focus', (function(_this) {
          return function() {
            return _this.options.onFocus();
          };
        })(this));
      }
      if (this.autosavedMessageComponent) {
        cachedMessage = this.autosavedMessageComponent.get();
        if (cachedMessage) {
          this.selector.froalaEditor('html.set', cachedMessage);
        }
        return this.selector.on('froalaEditor.contentChanged', (function(_this) {
          return function(e, editor) {
            return _this.autosavedMessageComponent.set(editor.html.get());
          };
        })(this));
      }
    };

    MessageEditorComponent.prototype.clear = function() {
      return this.selector.froalaEditor('html.set', '');
    };

    MessageEditorComponent.prototype.focus = function() {
      return this.selector.froalaEditor('events.focus', true);
    };

    MessageEditorComponent.prototype.refreshPlaceholder = function() {
      return this.selector.froalaEditor('placeholder.refresh');
    };

    MessageEditorComponent.prototype.getWrappedContent = function() {
      return "<span>" + (this.selector.froalaEditor('html.get')) + "</span>";
    };

    MessageEditorComponent.prototype.resetCache = function() {
      return this.autosavedMessageComponent.reset();
    };

    MessageEditorComponent.prototype.contentIsEmpty = function() {
      var content;
      content = this.getWrappedContent();
      return !($.trim($(content).text()).length || content.includes('img'));
    };

    MessageEditorComponent.prototype.extractMentionUserIds = function() {
      var content, ids;
      content = this.getWrappedContent();
      ids = [];
      $(content).find("[data-behavior=user-mention]").each(function(i, el) {
        var userId;
        userId = $(el).data('id');
        return ids.push(userId);
      });
      return ids;
    };

    return MessageEditorComponent;

  })();

}).call(this);
