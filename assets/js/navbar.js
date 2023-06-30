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