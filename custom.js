jQuery(document).ready(function() {
  // Tabs
  jQuery("ul.tabs > br").remove();
  jQuery(".tabs-wrapper").append(jQuery(".tabs li div"));
  jQuery(".tabs li:first a").addClass("defaulttab selected");
  jQuery(".tabs a").click(function() {
    switch_tabs(jQuery(this));
  });
  switch_tabs(jQuery(".defaulttab"));
  function switch_tabs(obj) {
    jQuery(".tab-content").hide();
    jQuery(".tabs a").removeClass("selected");
    var id = obj.attr("rel");
    jQuery("#" + id).show();
    obj.addClass("selected");
  }

  // Content Toggle
  jQuery(".slide_toggle_content").hide();
  jQuery("h3.slide_toggle").toggle(
    function() {
      jQuery(this).addClass("clicked");
    },
    function() {
      jQuery(this).removeClass("clicked");
    }
  );
  jQuery("h3.slide_toggle").click(function() {
    jQuery(this)
      .next(".slide_toggle_content")
      .slideToggle();
  });
});

// NAVIGATION CALLBACK
var ww = jQuery(window).width();
jQuery(document).ready(function() {
  jQuery(".sitenav li a").each(function() {
    if (jQuery(this).next().length > 0) {
      jQuery(this).addClass("parent");
    }
  });
  jQuery(".toggleMenu").click(function(e) {
    e.preventDefault();
    jQuery(this).toggleClass("active");
    jQuery(".sitenav").slideToggle("fast");
  });
  adjustMenu();
});

// navigation orientation resize callbak
jQuery(window).bind("resize orientationchange", function() {
  ww = jQuery(window).width();
  adjustMenu();
});

var adjustMenu = function() {
  if (ww < 981) {
    jQuery(".toggleMenu").css("display", "block");
    if (!jQuery(".toggleMenu").hasClass("active")) {
      jQuery(".sitenav").hide();
    } else {
      jQuery(".sitenav").show();
    }
    jQuery(".sitenav li").unbind("mouseenter mouseleave");
  } else {
    jQuery(".toggleMenu").css("display", "none");
    jQuery(".sitenav").show();
    jQuery(".sitenav li").removeClass("hover");
    jQuery(".sitenav li a").unbind("click");
    jQuery(".sitenav li")
      .unbind("mouseenter mouseleave")
      .bind("mouseenter mouseleave", function() {
        jQuery(this).toggleClass("hover");
      });
  }
};

jQuery(document).ready(function() {
  jQuery(this)
    .find(".sitenav li ul")
    .parent()
    .addClass("has-sub");
  jQuery(this)
    .find(".has-sub")
    .prepend('<span class="submenu-button"></span>');
  jQuery(this)
    .find(".submenu-button")
    .on("click", function() {
      jQuery(this).toggleClass("submenu-opened");
      if (
        jQuery(this)
          .siblings("ul")
          .hasClass("open")
      ) {
        jQuery(this)
          .siblings("ul")
          .removeClass("open")
          .slideToggle();
      } else {
        jQuery(this)
          .siblings("ul")
          .addClass("open")
          .slideToggle();
      }
    });
  if (jQuery(window).width() > 980) {
    jQuery(this)
      .find("ul li ul")
      .show();
  }
  if (jQuery(window).width() <= 980) {
    jQuery(this)
      .find("ul li ul")
      .hide();
  }
});

jQuery(document).ready(function() {
  jQuery(".srchicon").click(function() {
    jQuery(".searchtop").slideToggle("slow");
  });
});

// skill bar script
jQuery(document).ready(function() {
  jQuery(".skillbar").each(function() {
    jQuery(this)
      .find(".skillbar-bar")
      .animate(
        {
          width: jQuery(this).attr("data-percent")
        },
        6000
      );
  });
});

// Remove empty p tag
jQuery(document).ready(function() {
  jQuery("p:empty").remove();
});

//Fancybox
jQuery(document).ready(function() {
  jQuery("[data-fancybox]").fancybox({
    loop: true,
    protect: true,
    thumbs: {
      autoStart: true, // Display thumbnails on opening
      hideOnClose: true, // Hide thumbnail grid when closing animation starts
      parentEl: ".fancybox-container", // Container is injected into this element
      axis: "y" // Vertical (y) or horizontal (x) scrolling
    },
    transitionEffect: "circular",
    transitionDuration: 1000
  });
});
