(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.ProfileEditHandler = (function() {
    var resetFileInput;

    function ProfileEditHandler() {
      this.teardown = bind(this.teardown, this);
      this.checkPasswordConfirmationMatch = bind(this.checkPasswordConfirmationMatch, this);
      this.setup = bind(this.setup, this);
      this.passwordInput = $be('password-input');
      this.passwordConfirmationInput = $be('password-confirmation-input');
      this.passwordConfirmationError = $be('password-confirmation-error');
      this.avatarUploadInput = $be('avatar-upload-input');
      this.avatarUploadPreview = $('[data-behavior=avatar-image][data-upload-preview]');
      this.avatarUploadError = $be('avatar-upload-error');
    }

    ProfileEditHandler.prototype.setup = function() {
      this.passwordInput.password({});
      this.passwordInput.on('keyup', (function(_this) {
        return function() {
          return _this.checkPasswordConfirmationMatch();
        };
      })(this));
      this.passwordConfirmationInput.on('keyup', (function(_this) {
        return function() {
          return _this.checkPasswordConfirmationMatch();
        };
      })(this));
      return this.avatarUploadInput.on('change', (function(_this) {
        return function() {
          var file, input;
          input = _this.avatarUploadInput[0];
          if (input.files && input.files[0]) {
            file = input.files[0];
            if (!file.type.match(/image.*/)) {
              _this.avatarUploadError.html('Only image files can be uploaded.');
              return resetFileInput(input);
            } else if (file.size > 5000000) {
              _this.avatarUploadError.html('Selected image is bigger then 5mb.');
              return resetFileInput(input);
            } else {
              return loadImage(file, function(image) {
                _this.avatarUploadPreview.css('background-image', "url(" + (image.toDataURL()) + ")");
                _this.avatarUploadPreview.hide();
                _this.avatarUploadPreview.fadeIn(650);
                _this.avatarUploadPreview.removeClass('avatar-stub');
                _this.avatarUploadPreview.html('');
                return _this.avatarUploadError.html('');
              }, {
                orientation: true
              });
            }
          }
        };
      })(this));
    };

    ProfileEditHandler.prototype.checkPasswordConfirmationMatch = function() {
      if (this.passwordInput.val() === this.passwordConfirmationInput.val()) {
        this.passwordConfirmationError.html('');
        return this.passwordConfirmationInput[0].setCustomValidity('');
      } else {
        this.passwordConfirmationError.html('No match');
        return this.passwordConfirmationInput[0].setCustomValidity('No match');
      }
    };

    resetFileInput = function(input) {
      input.value = '';
      if (!/safari/i.test(navigator.userAgent)) {
        input.type = '';
        return input.type = 'file';
      }
    };

    ProfileEditHandler.prototype.teardown = function() {};

    return ProfileEditHandler;

  })();

}).call(this);
