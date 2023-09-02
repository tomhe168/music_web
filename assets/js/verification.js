function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}


// 定义回调函数
function callback(res) {
    // 第一个参数传入回调结果，结果如下：
    // ret         Int       验证结果，0：验证成功。2：用户主动关闭验证码。
    // ticket      String    验证成功的票据，当且仅当 ret = 0 时 ticket 有值。
    // CaptchaAppId       String    验证码应用ID。
    // bizState    Any       自定义透传参数。
    // randstr     String    本次验证的随机串，后续票据校验时需传递该参数。
    // console.log('callback:', res);
    // var btn = $('.debouncing-button');
    // console.log("222Is button disabled?:", btn.prop('disabled'));
    // res（用户主动关闭验证码）= {ret: 2, ticket: null}
    // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
    // res（请求验证码发生错误，验证码自动返回terror_前缀的容灾票据） = {ret: 0, ticket: "String", randstr: "String",  errorCode: Number, errorMessage: "String"}
    // 此处代码仅为验证结果的展示示例，真实业务接入，建议基于ticket和errorCode情况做不同的业务处理

    var errorCode = -3;
    var errorMessage = "Verification code internal error.";  // or null
    var randstr = "";       // or null
    var ticket = "";        // or null

    if (res.ret === 0) {
        //根据errorCode情况做特殊处理
        if('errorCode' in res && res.errorCode != 0)
        {
            //自定义容灾逻辑（例如跳过这次验证）
            errorCode = res.errorCode;
            errorMessage = res.errorMessage;
        }
        else
        {
            randstr = res.randstr;
            ticket = res.ticket;
            errorCode = 0;
            errorMessage = 'success';
        } 
    }
    else
    {
        errorCode = res.ret;
        errorMessage = retmsg;

    }

    document.getElementById('ticketInput').value = ticket;
    document.getElementById('randstrInput').value = randstr;
    document.getElementById('errorCodeInput').value = errorCode;
    document.getElementById('errorMessageInput').value = errorMessage;

    var form = document.getElementById('formCaptchaId');

    // var data = {
    //     ticket: ticket,
    //     randstr: randstr,
    //     errorCode: errorCode,
    //     errorMessage: errorMessage
    // };

    form.submit();

    // fetch('/login-verification/', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         // Add other headers if needed
    //         'X-CSRFToken': getCookie('csrftoken') // This is for Django CSRF protection
    //     },
    //     body: JSON.stringify(data)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.errorCode === 0) {
    //         // Hide the error message if it's displayed
    //         hideErrorMessage();
    //     } else {
    //         // Display the error message from Django
    //         displayErrorMessage(data.errorMessage);
    //     }
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    //     displayErrorMessage('Unknown error occurred.');
    // });
}


// 定义验证码js加载错误处理函数
function loadErrorCallback() {
    var appid = '192641889';
    // 生成容灾票据或自行做其它处理
    var ticket = 'terror_1001_' + appid + '_' + Math.floor(new Date().getTime() / 1000);
    callback({
        ret: 0,
        randstr: '@'+ Math.random().toString(36).substr(2),
        ticket: ticket,
        errorCode: 1001,
        errorMessage: 'jsload_error'
    });
    }


// 定义验证码触发事件
window.addEventListener('load', function(){
    var btn = document.getElementById('btnCaptchaId');
    if(btn){
        btn.onclick = function(event){
            event.preventDefault(); 
            try {
                    // 生成一个验证码对象
                    // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
                    // callback：定义的回调函数
                    console.log('click');
                    
                    // console.log("000Is button disabled?:", btn.prop('disabled'));
                    btn.disabled = true;  // 禁用按钮
                    setTimeout(function () {
                        btn.disabled = false; // 一段时间后再启用按钮
                    }, 10000);
                    var captcha = new TencentCaptcha('192641889', callback, {});
                    
                    // console.log("111Is button disabled?:", btn.prop('disabled'));
                    // 调用方法，显示验证码
                    captcha.show(); 
                    console.log('click out');
            } catch (error) {
            // 加载异常，调用验证码js加载错误处理函数
                    loadErrorCallback();
            }
        }

    }

});


function displayErrorMessage(message) {
    let errorMsgDiv = document.getElementById('errorMsg');
    errorMsgDiv.innerHTML = message;
    errorMsgDiv.style.display = 'block'; // Show the error message div
}

function hideErrorMessage() {
    let errorMsgDiv = document.getElementById('errorMsg');
    errorMsgDiv.style.display = 'none'; // Hide the error message div
}