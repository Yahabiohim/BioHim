(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.ChatMembersDialogComponent = (function() {
    var appendSelectedCard, bindSelectedUserPicker, removeSelectedCard, resetDialogControls, updateDialogControls;

    function ChatMembersDialogComponent() {
      this.bindDialogControls = bind(this.bindDialogControls, this);
      this.checkPreselectedUsers = bind(this.checkPreselectedUsers, this);
      this.setup = bind(this.setup, this);
      this.preselectedUserIds = window.chatMemberIds;
    }

    ChatMembersDialogComponent.prototype.setup = function() {
      this.bindDialogControls();
      this.checkPreselectedUsers();
      return updateDialogControls();
    };

    ChatMembersDialogComponent.prototype.checkPreselectedUsers = function() {
      return $(this.preselectedUserIds).each(function(idx, userId) {
        return $beById('available-user-picker', userId).click();
      });
    };

    ChatMembersDialogComponent.prototype.bindDialogControls = function() {
      $be('chat-manage-members-modal').on('hide.bs.modal', (function(_this) {
        return function() {
          return resetDialogControls(_this.preselectedUserIds);
        };
      })(this));
      $be('selected-users-count').click(function(e) {
        e.preventDefault();
        return $be('modal-container').scrollTop(0);
      });
      $be('available-user-picker').change(function() {
        var card, picker, userId;
        picker = $(this);
        userId = picker.data('id');
        card = picker.parents('[data-behavior=user-pick-card]');
        card.toggleClass('is-selected', picker.is(":checked"));
        if (picker.is(":checked")) {
          appendSelectedCard(card, userId);
        } else {
          removeSelectedCard(userId);
        }
        return updateDialogControls();
      });
      $be('start-chat-submit').click(function(e) {
        e.preventDefault();
        $be('start-chat-form').submit();
        return $be('chat-manage-members-modal').modal('hide');
      });
      return $be('start-chat-filter').on('keyup', function() {
        var value;
        value = $(this).val().toLowerCase();
        $be('user-pick-card').filter(function() {
          return $(this).toggle($(this).data('filter-text').toLowerCase().indexOf(value) > -1);
        });
        if (!$be('user-pick-card').is(':visible')) {
          return $be('chat-filter-empty').show();
        } else {
          return $be('chat-filter-empty').hide();
        }
      });
    };

    bindSelectedUserPicker = function(element) {
      return element.change(function() {
        var availableUserCard, card, picker, userId;
        picker = $(this);
        userId = picker.data('id');
        card = picker.parents('[data-behavior=user-pick-card]');
        if (!picker.is(":checked")) {
          card.remove();
          availableUserCard = $beById('user-pick-card', userId);
          availableUserCard.removeClass('is-selected');
          availableUserCard.find('[data-behavior=available-user-picker]').prop('checked', false);
          return updateDialogControls();
        }
      });
    };

    appendSelectedCard = function(card, userId) {
      var label, picker, selectedUserCard;
      if ($beById('selected-user-picker', userId).length) {
        return;
      }
      selectedUserCard = card.clone();
      picker = selectedUserCard.find('[data-behavior=available-user-picker]');
      picker.attr('data-behavior', 'selected-user-picker');
      picker.attr('id', "selected-user-picker-" + userId);
      label = selectedUserCard.find('[data-behavior=available-user-picker-label]');
      label.attr('data-behavior', 'selected-user-picker-label');
      label.attr('for', "selected-user-picker-" + userId);
      $be('selected-users-list').append(selectedUserCard);
      return bindSelectedUserPicker(picker);
    };

    removeSelectedCard = function(userId) {
      return $be('selected-users-list').find("[data-behavior=user-pick-card][data-id='" + userId + "']").remove();
    };

    resetDialogControls = function(initialSelectedUserIds) {
      $be('start-chat-filter').val('');
      $be('start-chat-filter').keyup();
      $be('modal-container').scrollTop(0);
      if (initialSelectedUserIds && initialSelectedUserIds.length > 0) {
        return $be('available-user-picker').each(function(i, picker) {
          var userId;
          picker = $(picker);
          userId = picker.data('id');
          picker.prop('checked', (indexOf.call(initialSelectedUserIds, userId) >= 0));
          return picker.change();
        });
      }
    };

    updateDialogControls = function() {
      var count, counter, submitButton;
      count = $be('available-user-picker').filter(':checked').length;
      counter = $be('selected-users-count');
      submitButton = $be('start-chat-submit');
      switch (count) {
        case 0:
          counter.hide();
          return submitButton.addClass('disabled');
        case 1:
          counter.show();
          counter.html('1 person selected');
          return submitButton.removeClass('disabled');
        default:
          counter.show();
          counter.html(count + " people selected");
          return submitButton.removeClass('disabled');
      }
    };

    return ChatMembersDialogComponent;

  })();

}).call(this);
