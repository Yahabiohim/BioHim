(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.UserMentionsComponent = (function() {
    function UserMentionsComponent() {
      this.update = bind(this.update, this);
      this.clear = bind(this.clear, this);
      this.options = window.userMentionOptions;
      this.mentionedUserIdsInput = $be('mentioned-user-ids-input');
    }

    UserMentionsComponent.prototype.clear = function() {
      return this.mentionedUserIdsInput.val('');
    };

    UserMentionsComponent.prototype.update = function(values) {
      return this.mentionedUserIdsInput.val(values);
    };

    return UserMentionsComponent;

  })();

}).call(this);
