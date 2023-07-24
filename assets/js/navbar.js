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
// // Ensure the page is fully loaded before running the script
// document.addEventListener('DOMContentLoaded', function() {
//   // Get the viewport height and convert it to pixels
// let viewportHeight = window.innerHeight + 'px';

// // Set the body height to the viewport height
// document.body.style.height = viewportHeight;
// });

var initialViewportHeight = window.innerHeight;

// window.addEventListener('resize', function() {
//     // if(window.innerHeight <= initialViewportHeight) {
//         document.body.style.height = initialViewportHeight + 'px';
//     // } else {
//     //     document.body.style.height = '100%';
//     // }
// });

setTimeout(function () {
  let viewheight = $(window).height();
  let viewwidth = $(window).width();
  let viewport = document.querySelector("meta[name=viewport]");
  viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");
}, 300);



// $(document).ready(function() {
//     // 初始化Tooltip为手动触发
//     $('[data-toggle="tooltip"]').tooltip({
//         trigger: 'manual'
//     });

//     // 显示tooltip
//     $('#buttonInput').tooltip('show');
// });

$(document).ready(function() {
    const errorMsgElement = document.getElementById("errorMsg");
    if(errorMsgText){
        $("#errorMsg").show();  // 使用 jQuery 的 show 方法显示错误消息  
    }
});