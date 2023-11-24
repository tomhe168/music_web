


var g_u_play_icon = `<svg class="bi bi-play-circle-fill u_playPauseIcon" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"></path>
</svg>`;


var g_u_pause_icon = `<svg class="bi bi-pause-circle-fill u_playPauseIcon" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"></path>
</svg>`;

// if (window.location.href.indexOf('tools.html') !== -1){
window.onload = function() {
    // 页面加载完成后要执行的代码
    init()
};

function init()
{
    $('.u_playPauseIcon').click(handleUPlayStop); 
    // updateTime();
    // setPlayTime();
    // 当页面加载时，也尝试更新一次（如果音频已经预加载）
    // updateAllTimeDisplay();
    // 监听 durationchange 事件
    // $('.u_myAudio').on('loadedmetadata', updateAllTimeDisplay);
    // 为每个播放按钮添加事件监听
    $('.audio-wrapper').each(function() {
        var audioWrapperId = $(this).data('audio-wrapper');
        var audioId = $(this).data('audio');
        var audioTimeId = $(this).data('audio-time');
        var audioDownloadId = $(this).data('audio-download');
        var audioShareId = $(this).data('audio-share');
        var audioDeleteId = $(this).data('audio-delete');
        var playPauseId = $(this).data('play-pause');
   
        // 当音频的元数据加载完成时，更新显示
        $('#' + audioId).on('loadedmetadata', function() {
            updateAllTimeDisplay(audioId, audioTimeId);
        });
        
        var audio = $('#' + audioId)[0];
        // 当音频播放结束时，重置进度条
        audio.addEventListener('ended', function() {
            $progressBar.css('background', 'linear-gradient(to right, rgba(108, 108, 108, 0.3) 0%, rgba(108, 108, 108, 0.3) 100%)');
            iconContainer.html(g_u_play_icon); // 
            $('#' + playPauseId).off('click')
            $('#' + playPauseId).click(function(event) {
                handleUPlayStop();
            });
        });

    });

    setInterval(updateProgressBar, 500);

    
}

// 更新进度条的函数
function updateProgressBar() {
    $('.u_myAudio').each(function() {
        if (!(($(this)[0]).duration)) {
            return;
        }
        var percentage = (($(this)[0]).currentTime /($(this)[0]).duration) * 100;
        $(this).parent().css('background', `linear-gradient(to right, rgba(108, 108, 108, 0.5) ${percentage}%, rgba(108, 108, 108, 0.3) ${percentage}%)`);
    });
}


function handleUPlayStop (){
    console.log("handleUPlayStop")

    // 停止所有音乐
    $('.u_myAudio').each(function() {
        this.pause();
        // this.currentTime = 0; // 可选，重置音频到开始位置
    });

    // 获取当前按钮关联的音频元素
    var iconContainer = $(this).parent(); // 获取图标容器
    var audio = iconContainer.parent().children('.u_myAudio')[0];

    var rect = $(this).find('rect');

    if (rect.length > 0) {
        //暂停图标
        $(this).html(g_u_play_icon); // 
        $(this).off('click')
        $(this).click(handleUPlayStop);
        audio.pause();
    } else {
        //播放图标
        $(this).html(g_u_pause_icon); // 显示暂停图标
        $(this).off('click')
        $(this).click(handleUPlayStop);
        audio.play()
        .then(function() {
            console.log("音频播放成功！");
            // 在这里进行你想要的处理
        })
        .catch(function(error) {
            console.log("音频播放失败：" + error);
            // 在这里进行你想要的处理
        });
        
    }
    


}



// 定义一个函数来更新总时长显示
function updateAllTimeDisplay(audioId, audioTimeId) {
    console.log("updateAllTimeDisplay"+audioId)
    var audio = $('#' + audioId)[0];
    var allTimeDisplay = $('#' + audioTimeId);
    var allTime = audio.duration;

    if (!isNaN(allTime)) {
        var minutes = Math.floor(allTime / 60);
        var seconds = Math.floor(allTime % 60);
        allTimeDisplay.text(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
    }


}




function updateTime (){
    
    var audio = $('#u_myAudio')[0]; // 获取原生的 audio 元素
    var currentTimeDisplay = $('#uCurrentPlayTime');

    function updateCurrentTime() {
        var currentTime = audio.currentTime; // 获取当前播放时间（秒）
        var minutes = Math.floor(currentTime / 60); // 分钟
        var seconds = Math.floor(currentTime % 60); // 秒

        // 格式化时间显示
        currentTimeDisplay.text(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
    }

    // 定期更新播放时间
    setInterval(updateCurrentTime, 500); // 每 500 毫秒更新一次
   
}


// $(document).ready(function() {
//     var audio = $('#u_myAudio')[0]; // 获取原生的 audio 元素
//     var $progressBar = $('#audio-progress');

//     // 更新进度条的函数
//     function updateProgressBar() {
//         if (!audio.duration) {
//             return;
//         }
//         var percentage = (audio.currentTime / audio.duration) * 100;
//         $progressBar.css('background', `linear-gradient(to right, rgba(108, 108, 108, 0.5) ${percentage}%, rgba(108, 108, 108, 0.3) ${percentage}%)`);
//     }

//     // 定期更新进度条
//     setInterval(updateProgressBar, 500);

//     // 当音频播放结束时，重置进度条
//     audio.addEventListener('ended', function() {
//         $progressBar.css('background', 'linear-gradient(to right, rgba(108, 108, 108, 0.3) 0%, rgba(108, 108, 108, 0.3) 100%)');
//         iconContainer.html(g_u_play_icon); // 
//         $("#u_playPauseIcon").off('click')
//         $("#u_playPauseIcon").click(handleUPlayStop);
//     });
// });




// $(document).ready(function() {
//     var audio = $('#myAudio')[0]; // 获取原生的 audio 元素
//     var $progressBar = $('#audio-progress');

//     // 更新进度条的函数
//     function updateProgressBar() {
//         if (!audio.duration) {
//             return;
//         }
//         var percentage = (audio.currentTime / audio.duration) * 100;
//         $progressBar.css('background', `linear-gradient(to right, rgba(108, 108, 108, 0.5) ${percentage}%, rgba(108, 108, 108, 0.3) ${percentage}%)`);
//     }

//     // 定期更新进度条
//     setInterval(updateProgressBar, 500);

//     // 当音频播放结束时，重置进度条
//     audio.addEventListener('ended', function() {
//         $progressBar.css('background', 'linear-gradient(to right, rgba(108, 108, 108, 0.3) 0%, rgba(108, 108, 108, 0.3) 100%)');
//     });
// });