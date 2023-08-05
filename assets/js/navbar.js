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

var p_container = document.getElementsByClassName('p_content_class')[0]
function updateNavbarBackground() {
    var scrolled = p_container.scrollTop;
    if (scrolled === 0) {
        $(".navbar").css("background", "transparent");
        $(".navbar").css("backdrop-filter", "blur(0px)");
    } else {
        $(".navbar").css("background", "rgba(0,0,0,0.8)");
        $(".navbar").css("backdrop-filter", "blur(5px)");
    }
}

$(p_container).scroll(updateNavbarBackground);
// Run the function once at page load
$(p_container).ready(updateNavbarBackground);

// Run specific setting at page load
$(document).ready(function() {
    $(".navbar").css("background", "transparent");
    $(".navbar").css("backdrop-filter", "blur(0px)");
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
  const errorMsgText = document.getElementById("errorMsg");
  if(errorMsgText){
      $("#errorMsg").show();  // 使用 jQuery 的 show 方法显示错误消息  
  }
});

// function validatePassword() {
//     var password = document.getElementById("passwordInput").value;
//     var feedback = document.getElementById("feedback");

//     // 正则表达式验证
//     var hasNumber = /[0-9]/.test(password);
//     var hasLetter = /[a-zA-Z]/.test(password);
//     var hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//     var haslength8 = password.length;

//     if (!hasNumber) {
//         feedback.textContent = "password must contains at least one number";
//         return;
//     }

//     if (!hasLetter) {
//         feedback.textContent = "password must contain at least one letter";
//         return;
//     }

//     if (!hasSymbol) {
//         feedback.textContent = "password must contain at least one letter";
//         return;
//     }

//     if(haslength8 < 8){
//         feedback.textContent = "password must be at least 8 characters long";
//         return;
//     }
//     feedback.textContent = "密码有效！";
// }


// const passwordInput = document.getElementById("password");
// const lengthReq = document.getElementById("length");
// const uppercaseReq = document.getElementById("uppercase");
// const lowercaseReq = document.getElementById("lowercase");
// const numberReq = document.getElementById("number");

// passwordInput.addEventListener("input", function() {
//     const passwordValue = passwordInput.value;
    
//     // Check length
//     if (passwordValue.length >= 8) {
//         lengthReq.classList.remove("invalid");
//         lengthReq.classList.add("valid");
//     } else {
//         lengthReq.classList.remove("valid");
//         lengthReq.classList.add("invalid");
//     }

//     // Check uppercase letter
//     if (/[A-Z]/.test(passwordValue)) {
//         uppercaseReq.classList.remove("invalid");
//         uppercaseReq.classList.add("valid");
//     } else {
//         uppercaseReq.classList.remove("valid");
//         uppercaseReq.classList.add("invalid");
//     }

//     // Check lowercase letter
//     if (/[a-z]/.test(passwordValue)) {
//         lowercaseReq.classList.remove("invalid");
//         lowercaseReq.classList.add("valid");
//     } else {
//         lowercaseReq.classList.remove("valid");
//         lowercaseReq.classList.add("invalid");
//     }

//     // Check number
//     if (/[0-9]/.test(passwordValue)) {
//         numberReq.classList.remove("invalid");
//         numberReq.classList.add("valid");
//     } else {
//         numberReq.classList.remove("valid");
//         numberReq.classList.add("invalid");
//     }
// });


// function validatePassword() {
//     var password = document.getElementById("password").value;
//     var message = "";

//     // Check length
//     if (password.length < 8) {
//         message += "At least 8 characters. ";
//     }

//     // Check for a number
//     if (!/[0-9]/.test(password)) {
//         message += "1 number. ";
//     }

//     // Check for an uppercase letter
//     if (!/[A-Z]/.test(password)) {
//         message += "1 uppercase letter. ";
//     }

//     // Check for a lowercase letter
//     if (!/[a-z]/.test(password)) {
//         message += "1 lowercase letter. ";
//     }

//     // Check for a symbol
//     var specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
//     if (!specialCharacters.test(password)) {
//         message += "1 symbol. ";
//     }

//     var validationMessage = document.getElementById("passwordValidation");
//     validationMessage.innerHTML = message;
// }


$(document).ready(function(){
     $('[data-toggle="popover"]').popover(); // 初始化所有具有 popover 功能的元素
    
    $('#password').popover({
        trigger: 'focus'  // 指定当输入框获得焦点时显示
    });

    $('#password').on('keyup', function() {
        var password = $(this).val();
        // 这里您可以添加密码验证逻辑
        if (password.length < 8) {
            $(this).attr('data-content', '密码长度应该大于或等于8位。');
            $(this).popover('show');
        } else {
            $(this).popover('hide');
        }
    });
});


function onCaptchaSuccess() {
  var captchaElement = document.querySelector('.h-captcha');
  captchaElement.style.display = 'none';
}


$(document).ready(function(){
  // $(document).on('click', '#mybutton', function(){
    $('.debouncing-form').submit(function(e){  
      // console.log("cccccccccclick");
      var btn = $('.debouncing-button');
      btn.prop('disabled', true);  // 禁用按钮
      setTimeout(function(){
          btn.prop('disabled', false);  // 一段时间后再启用按钮
      }, 2000);  // 这里的2000是2000毫秒，也就是2秒
  });
});


function goBack() {
  window.history.back();
}

