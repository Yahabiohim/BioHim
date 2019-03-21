(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.GroupModel = (function() {
    function GroupModel(groupData) {
      this.allowLeave = bind(this.allowLeave, this);
      this.isAccessible = bind(this.isAccessible, this);
      this.isMemberId = bind(this.isMemberId, this);
      this.id = parseInt(groupData.id);
      this.memberIds = groupData.memberIds;
      this.mainSchemeIds = groupData.mainSchemeIds;
      this.inJointScheme = groupData.inJointScheme;
    }

    GroupModel.prototype.isMemberId = function(userId) {
      return this.memberIds.indexOf(userId) > -1;
    };

    GroupModel.prototype.isAccessible = function(userId) {
      return this.isMemberId(userId);
    };

    GroupModel.prototype.allowLeave = function(userId) {
      return this.isMemberId(userId) && this.memberIds.length > 1;
    };

    return GroupModel;

  })();

}).call(this);
