import {Person} from './modules/Person';

(function ($, window, document) {

  const app = {
    initEnquire: function () {
      enquire.register('screen and (max-width:479px)', {
        match: function () {
        },
        unmatch: function () {
        }
      });
      enquire.register('screen and (min-width:480px) and (max-width:767px)', {
        match: function () {
        },
        unmatch: function () {
        }
      });
      enquire.register('screen and (min-width:768px) and (max-width:991px)', {
        match: function () {
        },
        unmatch: function () {
        }
      });
      enquire.register('screen and (min-width:992px) and (max-width:1199px)', {
        match: function () {
        },
        unmatch: function () {
        }
      });
      enquire.register('screen and (min-width:1200px)', {
        match: function () {
        },
        unmatch: function () {
        }
      });
    },
    initPerson: function () {
      const john = new Person('John', 'Smith');
      console.log(john.fullName);
    }
  };

  $(document).ready(function () {
    app.initEnquire();
    app.initPerson();
  });

  $(window).on('load', function () {

  });

  $(window).on('resize', function () {

  });

  $(window).on('scroll', function () {

  });
})(jQuery, window, document);
