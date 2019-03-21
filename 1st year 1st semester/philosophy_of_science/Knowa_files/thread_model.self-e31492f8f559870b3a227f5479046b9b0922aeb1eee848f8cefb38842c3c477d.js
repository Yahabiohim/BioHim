(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.ThreadModel = (function() {
    function ThreadModel(threadData) {
      this.isMemberId = bind(this.isMemberId, this);
      this.id = parseInt(threadData.id);
      this.type = threadData.type;
      this.memberIds = threadData.memberIds;
    }

    ThreadModel.prototype.isMemberId = function(userId) {
      return this.memberIds.indexOf(userId) > -1;
    };

    return ThreadModel;

  })();

}).call(this);
