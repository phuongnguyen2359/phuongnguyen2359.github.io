"use strict";

(function($) {
  var OpalHotelSite = {
    init: function() {
      this.single.init();
    },

    single: {
      init: function() {
        var _doc = $(document);
        /* room gallery */
        this.gallery();

        $(".package-item .package-description").hide();
        _doc.on("click", ".package-item .package-content", this.package_action);
      },
      package_action: function() {
        $(this)
          .parent()
          .toggleClass("active")
          .find(".package-description")
          .toggle();
      },

      gallery: function() {
        function syncPosition(el) {
          var current = this.currentItem;
          sync2
            .find(".owl-item")
            .removeClass("synced")
            .eq(current)
            .addClass("synced");
          if (sync2.data("owlCarousel") !== undefined) {
            center(current);
          }
        }
      }
    }
  };

  $(document).ready(function() {
    /* initialize*/
    OpalHotelSite.init();
  });
})(jQuery);
