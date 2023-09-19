$(window).scroll(function () {
  document.querySelector('.navbar');
  var scrolled = $(window).pageYOffset || document.documentElement.scrollTop;
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
$(document).ready(function () {
  $(".navbar").css("background", "transparent");
  $(".navbar").css("backdrop-filter", "blur(0px)");
});

$(document).ready(function () {
  $('.dropdown').on('show.bs.dropdown', function () {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown(200);
    $("dropdown-menu").css('padding-top', '10px');
    // $("dropdown-menu").css('width', '120px');
  });

  $('.dropdown').on('hide.bs.dropdown', function () {
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

$(document).ready(function () {
  const errorMsgText = document.getElementById("errorMsg");
  if (errorMsgText) {
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


$(document).ready(function () {
  $('[data-toggle="popover"]').popover(); // 初始化所有具有 popover 功能的元素

  $('#password').popover({
    trigger: 'focus'  // 指定当输入框获得焦点时显示
  });

  $('#password').on('keyup', function () {
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


$(document).ready(function () {
  // $(document).on('click', '#mybutton', function(){
  $('.debouncing-form').submit(function (e) {
    // console.log("cccccccccclick");
    var btn = $('.debouncing-button');
    var debounceTime = (btn.attr('id') === 'btnCaptchaId') ? 10000 : 2000; // 如果id是btnCaptchaId则时间是10秒，否则是2秒
    
    btn.prop('disabled', true);  // 禁用按钮
    
    setTimeout(function () {
        btn.prop('disabled', false);  // 一段时间后再启用按钮
    }, debounceTime);
  });
});


/*
$(document).ready(function () {
  var isClicked = false;
  if (userIsAuthenticated) {
    $('.btn-user').hover(
      function () {
        $.ajax({
          url: 'small-user-func.html',
          success: function (data) {
            console.log("Ajax request succeeded.");
            var content = $('<div>').addClass('hover-content').html(data).appendTo('.btn-user');
            // content.click(function(event) {
            //   event.stopPropagation();
            //   // event.preventDefault();  // 阻止默认行为
            //   // isClicked = true;
            //  });

            // Add a new hover event to the pop-up content
            content.hover(
              function () {
                // When the mouse enters the pop-up, remove the 'hover-out' class
                $(this).removeClass('hover-out');
              },
              function () {
                if (!isClicked) {
                  // When the mouse leaves the pop-up, add the 'hover-out' class
                  $(this).addClass('hover-out');

                  // After a short delay, remove the pop-up if it still has the 'hover-out' class
                  var _this = $(this);
                  setTimeout(function () {
                    if (_this.hasClass('hover-out')) {
                      _this.remove();
                    }
                  }, 300);   // delay in milliseconds
                }
              }
            );
          },
          error: function (xhr, status, error) {
            console.log("Ajax request failed. Status: " + status + ", Error: " + error);
          },
          complete: function () {
            console.log("Ajax request completed.");
          }
        });
      },
      function () {
        if (!isClicked) {
          // When the mouse leaves the button, add the 'hover-out' class to the pop-up
          $('.hover-content').addClass('hover-out');

          // After a short delay, remove the pop-up if it still has the 'hover-out' class
          setTimeout(function () {
            if ($('.hover-content').hasClass('hover-out')) {
              $('.hover-content').remove();
            }
          }, 300);   // delay in milliseconds
        }
      }
    );
  }
});
*/


export default function isMobileDevice() {
  // return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return window.innerWidth <= 768;
}

$(document).ready(function () {
  var isClicked = false;
  if (userIsAuthenticated) {
    if (isMobileDevice()) {
      // 手机浏览器的逻辑
      $.ajax({
        // url: 'small-user-func.html',
        success: function (data) {
          // 将内容直接显示在nav上
          // 你需要指定一个nav的选择器，例如#navbar
          $('.navcol-class .btn').after('<p class="nav-collapse-type d-flex flex-row justify-content-end small-page-p" style="margin: 0px;padding: 0px;">' + availableTime + '</p>');
          $('.navcol-class .btn').next().after('<p class="nav-collapse-type d-flex flex-row justify-content-end small-page-p" style="margin: 0px;padding: 0px;">' + currentUserEmail + '</p>');
          $('.navcol-class .btn').next().next().after('<form action="' + logout_url + '" method="post">' + csrf_token + '<button class="btn btn-primary nav-collapse-type d-sm-flex justify-content-sm-end" type="submit">Log Out</button></form>');
          $('.small-page-p').on('click', function(event) {
            event.preventDefault();
            console.log(event);
            event.stopPropagation();
          });
        
        },
        error: function (xhr, status, error) {
          console.log("Ajax request failed. Status: " + status + ", Error: " + error);
        }
      });
    } 
    else
    {
    
    $('.btn-user').hover(
      function () {
        $.ajax({
          url: 'small-user-func.html',
          success: function (data) {
            console.log("Ajax request succeeded.");
            var content = $('<div>').addClass('hover-content').html(data).appendTo('.btn-user');
            // content.click(function(event) {
            //   event.stopPropagation();
            //   // event.preventDefault();  // 阻止默认行为
            //   // isClicked = true;
            //  });
            // 防止点击.hover-content导致事件冒泡到document
            $('.hover-content').on('click', function(event) {
              // event.preventDefault();
              console.log(event);
              event.stopPropagation();
            });

            $('.small-page-p').on('click', function(event) {
              event.preventDefault();
              console.log(event);
              event.stopPropagation();
            });

            // 监听整个文档的点击
            $(document).on('click', function(event) {
              console.log(event);
              var $target = $(event.target);
              if (!$target.closest('.hover-content').length && !$target.closest('.btn-user').length) {
                  // 点击发生在.hover-content和.btn-user之外
                  $('.hover-content').remove();
              }
            });
            // Add a new hover event to the pop-up content
            content.hover(
              function () {
                // When the mouse enters the pop-up, remove the 'hover-out' class
                $(this).removeClass('hover-out');
              },
              function () {
                if (!isClicked) {
                  // When the mouse leaves the pop-up, add the 'hover-out' class
                  $(this).addClass('hover-out');

                  // After a short delay, remove the pop-up if it still has the 'hover-out' class
                  var _this = $(this);
                  setTimeout(function () {
                    if (_this.hasClass('hover-out')) {
                      _this.remove();
                    }
                  }, 300);   // delay in milliseconds
                }
              }
            );
          },
          error: function (xhr, status, error) {
            console.log("Ajax request failed. Status: " + status + ", Error: " + error);
          },
          complete: function () {
            console.log("Ajax request completed.");
          }
        });
      },
      function () {
        if (!isClicked) {
          // When the mouse leaves the button, add the 'hover-out' class to the pop-up
          $('.hover-content').addClass('hover-out');

          // After a short delay, remove the pop-up if it still has the 'hover-out' class
          setTimeout(function () {
            if ($('.hover-content').hasClass('hover-out')) {
              $('.hover-content').remove();
            }
          }, 300);   // delay in milliseconds
        }
      }
    );
    }
  }
});



// 在页面加载时启动倒计时
$(document).ready(function() {
    startCountdown();
});

var countdown;
var initialTime = 60;  // 时间设为60秒

function startCountdown() {
    var currentTime = initialTime;

    // 清除已存在的计时器
    if(countdown) {
      clearInterval(countdown);
    }


    // 更新链接文本并禁用它，以防止在倒计时时重复点击
    $('#countdownLink').text(currentTime).off('click');

    countdown = setInterval(function() {
        currentTime--;
        $('#countdownLink').text(currentTime);

        if (currentTime <= 0) {
            clearInterval(countdown);
            $('#countdownLink').off('click').text('resend code').on('click', function() {
                send_email();
                // 这里可以添加其他逻辑，例如向服务器发送请求，重新发送邮件等。
                startCountdown();
                return false; // 阻止默认的<a>标签点击行为
            });
        }
    }, 1000);
}


function send_email()
{
  // $('#countdownLink').click(function() {
    $.ajax({
      url: '/send-email/',  // 请根据实际的URL配置进行调整
      method: 'GET',  // 或者其他适当的HTTP方法
      success: function(response) {
          if (response.status === 'success') {
              startCountdown();
          } else {
              alert("There was an ${response.status} error sending the email.");
          }
      },
      error: function(error) {
          alert("There was an error sending the email.");
      }
  });
  return false; // 阻止默认的<a>标签点击行为
  // });
}



// 在页面加载时启动倒计时
$(document).ready(function() {
    startCountdown();
});




$(document).ready(function(){
  // 获取所有的下拉菜单项
  const dropdownItems = document.querySelectorAll('.dropdown-item-body');
  
  // 给每一个下拉菜单项添加点击事件
  dropdownItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
      // 阻止默认行为（如果有）
      e.preventDefault();
      
      // 获取被点击的文本
      const clickedText = this.textContent || this.innerText;
      
      // 获取父级.dropdown元素
      const parentDropdown = this.closest('.dropdown');
      
      // 获取.dropdown-toggle按钮
      const dropdownToggle = parentDropdown.querySelector('.dropdown-toggle');
      
      // 获取按钮上的文本
      const btnText = dropdownToggle.textContent || dropdownToggle.innerText;
      
      // 交换文本
      this.textContent = btnText;
      dropdownToggle.textContent = clickedText;
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
    const inputElement = document.querySelector('.e-duration-input');
    
    if (inputElement) { // 检查元素是否存在
        inputElement.addEventListener('input', function(e) {
            
            // let cursorPosition = e.target.selectionStart;
            
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            // 如果输入不为空，则在数字后加上 " seconds"
//             if (e.target.value) {
//                 e.target.value += ' seconds';
//             }
            
//             // 重新设置光标位置，这里可能需要进行适当的调整以适应你的需求
//             e.target.setSelectionRange(cursorPosition, cursorPosition);
            
        });
    }
});


document.getElementById('carouselExampleFade').addEventListener('slide.bs.carousel', function () {
  
  const ids = ['e-collapse1', 'e-collapse2', 'e-collapse3', 'e-collapse4','e-collapse5','e-collapse6'];
  ids.forEach(id => {
      let collapseElem = document.getElementById(id);
      if (collapseElem && collapseElem.classList.contains('show')) {
          new bootstrap.Collapse(collapseElem).hide();
      }
  });

});
















