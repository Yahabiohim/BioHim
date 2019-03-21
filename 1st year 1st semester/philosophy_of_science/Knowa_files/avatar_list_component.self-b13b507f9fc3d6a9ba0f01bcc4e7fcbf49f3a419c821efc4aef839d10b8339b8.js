(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.AvatarListComponent = (function() {
    function AvatarListComponent(listContainerBehavior) {
      this.updateAllCounters = bind(this.updateAllCounters, this);
      this.update = bind(this.update, this);
      this.setup = bind(this.setup, this);
      this.listContainerBehavior = listContainerBehavior;
    }

    AvatarListComponent.prototype.setup = function() {
      this.updateAllCounters();
      return $(window).on('resize', (function(_this) {
        return function() {
          return _this.updateAllCounters();
        };
      })(this));
    };

    AvatarListComponent.prototype.update = function(groupId, listContainer, contactDetailsEnabled, callback) {
      return $.get("/groups/" + groupId + "/membership", {
        contact_details_enabled: contactDetailsEnabled
      }, (function(_this) {
        return function(newContent) {
          listContainer.find("[data-behavior=group-members-list]").html(newContent);
          _this.updateMembersCounter(listContainer);
          window.layoutHandler.setAvatarImages(listContainer);
          if (contactDetailsEnabled) {
            window.layoutHandler.contactDetailsComponent.bindLinks(listContainer);
          }
          if (callback) {
            return callback();
          }
        };
      })(this), 'html');
    };

    AvatarListComponent.prototype.updateMembersCounter = function(listContainer) {
      var membersCounter, nonVisibleCount;
      nonVisibleCount = listContainer.find('[data-behavior="member-avatar"]').length - listContainer.find('[data-behavior="member-avatar"]:visible').length;
      membersCounter = listContainer.find("[data-behavior=members-counter]");
      if (nonVisibleCount > 0) {
        membersCounter.show();
      } else {
        membersCounter.hide();
      }
      return membersCounter.find(".counter-text").text(nonVisibleCount);
    };

    AvatarListComponent.prototype.updateAllCounters = function() {
      return $be(this.listContainerBehavior).each((function(_this) {
        return function(idx, listContainer) {
          return _this.updateMembersCounter($(listContainer));
        };
      })(this));
    };

    return AvatarListComponent;

  })();

}).call(this);
