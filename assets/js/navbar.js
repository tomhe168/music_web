$(window).scroll(function() {
    document.querySelector('.navbar');
    var scrolled = $(window).pageYOffset ||document.documentElement.scrollTop;
    if (scrolled === 0) {
        $(".navbar").css("background", "transparent");
        $(".navbar").css("backdrop-filter", "blur(0px)");
    } else {
        $(".navbar").css("background", "rgba(0,0,0,0.8)");
        $(".navbar").css("backdrop-filter", "blur(5px)");
    }
});

$(document).ready(function() {
  $('.dropdown').on('show.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown(200);
    $("dropdown-menu").css('padding-top', '10px');
    // $("dropdown-menu").css('width', '120px');
  });

  $('.dropdown').on('hide.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp(200);
    $("dropdown-menu").css('padding-top', '0px');
  });
});