(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.ContactDetailsComponent = (function() {
    function ContactDetailsComponent() {
      this.adjustOwnDetails = bind(this.adjustOwnDetails, this);
      this.show = bind(this.show, this);
      this.bindLinks = bind(this.bindLinks, this);
      this.setup = bind(this.setup, this);
    }

    ContactDetailsComponent.prototype.setup = function() {
      this.bindLinks($be('app-layout'));
      return $be('contact-details-modal').on('hide.bs.modal', function() {
        return $be('contact-details-content').html('');
      });
    };

    ContactDetailsComponent.prototype.bindLinks = function(contextElement) {
      return contextElement.find("[data-behavior=show-contact-details-link]").click(function(e) {
        var contactModal, fromModalBehavior, link;
        e.preventDefault();
        link = $(this);
        contactModal = $be('contact-details-modal');
        fromModalBehavior = link.data('in-modal');
        if (fromModalBehavior) {
          $be(fromModalBehavior).modal('hide');
          contactModal.on('hide.bs.modal', function() {
            return $be(fromModalBehavior).modal('show');
          });
        }
        contactModal.modal('show');
        return $.getScript(link.attr('href'));
      });
    };

    ContactDetailsComponent.prototype.show = function(content) {
      $be('contact-details-content').html(content);
      window.layoutHandler.setAvatarImages($be('contact-details-content'));
      return this.adjustOwnDetails();
    };

    ContactDetailsComponent.prototype.adjustOwnDetails = function() {
      var fillNameWrapper;
      $beById('start-chat-from-contact-link', $currentUserId()).hide();
      fillNameWrapper = $beById('contact-details-full-name', $currentUserId());
      return fillNameWrapper.html(fillNameWrapper.html() + ' (you)');
    };

    return ContactDetailsComponent;

  })();

}).call(this);
