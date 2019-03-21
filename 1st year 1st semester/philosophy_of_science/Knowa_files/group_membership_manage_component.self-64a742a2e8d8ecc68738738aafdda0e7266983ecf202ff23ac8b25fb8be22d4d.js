(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.GroupMembershipManageComponent = (function() {
    var bindManageControls, bindMemberControl, checkConfirmButton;

    function GroupMembershipManageComponent() {
      this.showManageMembers = bind(this.showManageMembers, this);
      this.showManageList = bind(this.showManageList, this);
      this.reset = bind(this.reset, this);
      this.teardown = bind(this.teardown, this);
      this.setup = bind(this.setup, this);
      this.manageUserList = $be('manage-members-modal-content');
    }

    GroupMembershipManageComponent.prototype.setup = function() {
      $be('manage-members-link').click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.showManageMembers();
        };
      })(this));
      $be('back-to-show-members-link').click((function(_this) {
        return function(e) {
          e.preventDefault();
          $be('manage-members-modal').modal('hide');
          return $be('show-members-modal').modal('show');
        };
      })(this));
      return $be('manage-users-submit').click(function(e) {
        e.preventDefault();
        $be('manage-members-modal').modal('hide');
        return $be('manage-users-form').submit();
      });
    };

    GroupMembershipManageComponent.prototype.teardown = function() {
      $be('manage-members-link').unbind('click');
      $be('manage-users-submit').unbind('click');
      return $be('back-to-show-members-link').unbind('click');
    };

    GroupMembershipManageComponent.prototype.reset = function() {
      this.teardown();
      return this.setup();
    };

    GroupMembershipManageComponent.prototype.showManageList = function(listContent) {
      this.manageUserList.html(listContent);
      this.reset();
      bindManageControls();
      window.layoutHandler.setAvatarImages(this.manageUserList);
      window.layoutHandler.contactDetailsComponent.bindLinks(this.manageUserList);
      $be('manage-members-modal').modal('show');
      return $be('show-members-modal').modal('hide');
    };

    checkConfirmButton = function() {
      var confirmButton;
      confirmButton = $be('manage-users-submit');
      if ($('input:checked[data-behavior=user-check-box]').length) {
        return confirmButton.removeClass('disabled');
      } else {
        return confirmButton.addClass('disabled');
      }
    };

    GroupMembershipManageComponent.prototype.showManageMembers = function() {
      return $.getScript($be('manage-members-link').attr('href'));
    };

    bindManageControls = function() {
      bindMemberControl('add-to-group', true);
      return bindMemberControl('remove-from-group', false);
    };

    bindMemberControl = function(behavior, checked) {
      return $be(behavior).click(function(e) {
        var userCard, userId;
        e.preventDefault();
        userId = $(e.target).data('id');
        userCard = $beById('user-card', userId);
        userCard.children('[data-behavior=user-check-box]').prop('checked', checked);
        userCard.toggleClass('is-not-member');
        userCard.toggleClass('is-member');
        return checkConfirmButton();
      });
    };

    return GroupMembershipManageComponent;

  })();

}).call(this);
