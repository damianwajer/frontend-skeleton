;(function ($, window, document) {
    'use strict';
    var app = {
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
        initPlaceholder: function () {
            $('input, textarea').placeholder();
        }
    };

    $(document).ready(function () {
        app.initEnquire();
        app.initPlaceholder();
    });

    $(window).load(function () {

    });

    $(window).resize(function () {

    });

    $(window).scroll(function () {

    });
})(jQuery, window, document);