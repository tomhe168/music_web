import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'
import TimelinePlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/timeline.esm.js'
import Hover from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/hover.esm.js'
import RecordPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/record.esm.js'

import isMobileDevice from'./navbar.js'
import initLoading from './loading.js'



let g_activeRegion = null
// Give regions a random color when they are created
const g_random = (min, max) => Math.random() * (max - min) + min
const g_randomColor = () => `rgba(${g_random(0, 255)}, ${g_random(0, 255)}, ${g_random(0, 255)}, 0.5)`
let g_currentPlayPosition = 0
let g_currentSeekPosition = 0
let g_waveplaysurfer = null
let g_wsRegions = null

let g_waverecordsurfer = null
let g_record = null

let g_containerHeight = 0


let g_record_timerInterval = 0;
let g_record_totalTime = 0;

let g_record_btn_type = 0;//0初始状态，1录音完成，2截取完成

window.onload = function() {
    // 页面加载完成后要执行的代码
    init()
};


function init()
{
    setStyleDisplay("play-stop","none")
    setStyleDisplay("delete-btn","none")
    // document.getElementById("play-stop").style.display = "none";
    var btnPathElement = document.querySelector("#play-stop path");
    btnPathElement.setAttribute('d', 'm11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z'); // 更改回"暂停"图标为播放
    // document.getElementById("play-stop").onclick = handlePlayStopClick;
    // document.getElementById("mobile-play-stop").onclick = handlePlayStopClick;

    var elements = document.querySelectorAll('[id$="play-stop"]');
    elements.forEach((element) => {
        // 对每个匹配的元素执行操作
        console.log("elements")
        element.onclick=handlePlayStopClick
    });

    elements = document.querySelectorAll('[id$="delete-btn"]');
    elements.forEach((element) => {
        // 对每个匹配的元素执行操作
        element.onclick=handleDeleteClick
    });
    

    g_record_btn_type = 0

    // document.getElementById("delete-btn").style.display = "none";
    // document.getElementById("delete-btn").onclick = handleDeleteClick;
    // document.getElementById("mobile-delete-btn").onclick = handleDeleteClick;
    g_containerHeight = document.getElementById('mic').offsetHeight;

    g_waverecordsurfer = WaveSurfer.create({
        container: '#mic',
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        height: g_containerHeight  // 例如
    })
    // Initialize the Record plugin
    g_record = g_waverecordsurfer.registerPlugin(RecordPlugin.create())
    // Render recorded audio
    g_record.on('record-end', (blob) => {
        stopRecordTimer()
        // g_record.empty();
        // g_record.destroy()
        // WaveSurfer.empty()
        g_waverecordsurfer.empty()
        document.getElementById('mic').innerHTML = '';
        create_play(blob)
        g_waverecordsurfer.destroy()
        
    })

    g_record.on('record-start', () => {
        startRecordTimer()
    })
}







function startRecordTimer() {
    g_record_timerInterval = setInterval(function () {
        g_record_totalTime++;
        let minutes = Math.floor(g_record_totalTime / 60);
        let seconds = g_record_totalTime - (minutes * 60);
        document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopRecordTimer() {
    clearInterval(g_record_timerInterval);
    g_record_totalTime = 0;
    document.getElementById('timer').textContent = "00:00";
}


// 定义录音触发事件
window.addEventListener('load', function () {
    var btn = document.getElementById('record');
    if (btn) {  // 检查元素是否存在
        btn.addEventListener('click', function () {
            if(1 === g_record_btn_type){//上传
                g_record_btn_type = 2
                create_upload()
                return
            }

            if (g_record.isRecording()) {
                g_record.stopRecording()
                // recButton.textContent = 'Record'
                this.src = 'assets/img/t51x.png';
                g_record_btn_type = 1
                return
            }

            btn.disabled = true


            try {
                // if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
                //     throw new Error("Cannot read property 'getUserMedia' of undefined");
                // }
                g_record.startRecording()
                .then(() => {
                    // recButton.textContent = 'Stop'
                    this.src = 'assets/img/t14.png';
                    // recButton.disabled = false
                })
                .catch(err => {
                    // 这里捕获异步错误
                    console.error("Error during recording:", err);
                    alert("Error during recording:" + err.toString());
                });
            } catch (err) {
                console.error("Error accessing the microphone:", err);
                alert("Error accessing the microphone:" + err.toString());
            }

            btn.disabled = false
        });
    }
});



// Buttons
// {
//   // Start recording
//   const recButton = document.querySelector('#record')
//   recButton.onclick = () => {
//     if (record.isRecording()) {
//       record.stopRecording()
//       recButton.textContent = 'Record'
//       return
//     }

//     recButton.disabled = true


//     try {
//       if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia))
//       {
//         throw new Error("Cannot read property 'getUserMedia' of undefined");
//       }
//       record.startRecording().then(() => {
//         recButton.textContent = 'Stop'
//         recButton.disabled = false
//       })}catch (err) {
//         console.error("Error accessing the microphone:", err);
//         alert("Error accessing the microphone:" + err.toString());
//         }
//     }
// }

function audioBufferToWav(audioBuffer) {
    // 获取 AudioBuffer 中的信息
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
  
    // 创建一个 ArrayBuffer 来存储 WAV 格式的头信息和音频数据
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
  
    // 写入 WAV 头信息
    // RIFF header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 32 + length * 2, true);
    writeString(view, 8, 'WAVE');
  
    // fmt chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
  
    // data chunk
    writeString(view, 36, 'data');
    view.setUint32(40, length * 2, true);
  
    // 写入 PCM 数据
    const data = audioBuffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < data.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  
    // 生成 Blob
    return new Blob([view], { type: 'audio/wav' });
  }
  
  function writeString(view, offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }
  

function create_upload(){
    var regions = g_wsRegions.getRegions();
    if (regions.length === 0) {
        console.log("数组为空");
        var audioDuration = g_waveplaysurfer.getDuration();
        g_wsRegions.addRegion({
            start: 0,  // 开始于 0
            end: audioDuration,  // 结束于音频的总长度
            color: "rgba(0, 0, 0, 0)"  // 选择一个颜色
        });
        regions = g_wsRegions.getRegions();
    }
    var region = regions[0]
    var originalBuffer = g_waveplaysurfer.getDecodedData();  // 原始音频缓冲区
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var newBuffer = audioContext.createBuffer(
        originalBuffer.numberOfChannels,
        (region.end - region.start) * originalBuffer.sampleRate,
        originalBuffer.sampleRate
    );
    
    // var newChannelData = []
    for (var channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
        var originalData = originalBuffer.getChannelData(channel);
        var newData = newBuffer.getChannelData(channel);
        for (var i = 0; i < newData.length; i++) {
            newData[i] = originalData[i + Math.floor(region.start * originalBuffer.sampleRate)];
        }
        // newChannelData.push(newData)
    }

    const newBlob = audioBufferToWav(newBuffer);  // you need to implement audioBufferToWav

    document.getElementById('mic').innerHTML = '';

    // document.getElementById("play-stop").style.display = "none";
    // document.getElementById("delete-btn").style.display = "none";

    setStyleDisplay("play-stop","none")
    setStyleDisplay("delete-btn","none")

    g_waverecordsurfer = WaveSurfer.create({
        container: '#mic',
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        height: g_containerHeight  // 例如
    })

    g_waverecordsurfer.loadBlob(newBlob);

    document.getElementById("record").outerHTML = "<h1 id='record'>Uploading</h1>";
    
    document.getElementById('timer').style.fontSize = "calc(2rem + 2vh)";
    document.getElementById('timer').textContent = "0%";
    upload_progress().then(() => {
        create_creating().then(() => {
            create_finish()
        });
    });
    
}

async function create_creating(){
    var allRows = document.querySelectorAll('.row'); 
    var Row = allRows[allRows.length - 1];  // 删除最后一个元素，注意，索引是从 0 开始的
    if (Row) {  // 确保元素存在
        Row.remove();
    } 

    allRows = document.querySelectorAll(".row");
    allRows.forEach((row) => {
        //console.log(row); // 这里可以对每个 row 进行操作
        row.classList.add("item");
        row.classList.remove("special");
    });

    if(isMobileDevice()){
        document.getElementById("record").outerHTML =  "<div class='loading la-2x la-white'></div>" //"<h1 id='head-p'>Creating</h1>";
    }
    else{
        document.getElementById("record").outerHTML =  "<div class='loading la-3x la-white'></div>" //"<h1 id='head-p'>Creating</h1>";
    }
    initLoading()
    document.getElementById("timer").outerHTML =  "<h1 id='timer'>Creating</h1>";

    // 获取 video 元素
    // const videoElement = document.querySelector('video');
    // const pElement = document.getElementById("timer");
    // const parentElement = pElement.parentNode;

    // // 创建一个新的 <video> 元素
    // const videoElement = document.createElement("video");

    // // 设置各种属性
    // videoElement.loop = true;
    // videoElement.muted = true;
    // videoElement.autoplay = true;
    // videoElement.style.height = 'auto';
    // videoElement.style.width = '29%';

    // // 获取或创建 <source> 和 <track> 元素
    // const sourceElement = videoElement.querySelector('source') || document.createElement('source');

    // // 设置 source 和 track 的属性
    // sourceElement.setAttribute('src', 'assets/video/creating.webm');
    // sourceElement.setAttribute('type', 'video/webm');

    // // 如果这些元素是新创建的，需要将它们添加到 video 元素中
    // if (!videoElement.contains(sourceElement)) {
    //     videoElement.appendChild(sourceElement);
    // }

    // // 用新的 <video> 元素替换旧的 <p> 元素
    // parentElement.replaceChild(videoElement, pElement);

    // document.getElementById("mic").style.display = "none";

    // let startTime = 0.0;  // 初始位置，从 0% 开始
    // const stepTime = 0.01;  // 步进，每次移动 1%
    // const interval = 100;  // 每 100 毫秒更新一次

    // const intervalId = setInterval(() => {
    //     if (startTime >= 1) {  // 如果到达或超过 100%，停止
    //         clearInterval(intervalId);
    //         return;
    //     }
    //     startTime += stepTime;
    // }, interval);
    let startTime = 0;
    // while (startTime <= 100) {
    //     // 这里插入你想执行的代码
    //     startSecondInterval().then(() => {
    //         // console.log("Interval has finished, do something else now.");
    //         // 在这里执行其他操作
    //     });
    //     startTime++;
    //   }
    let stepTime = 0.01;  // 步进，每次移动 1%
    while (startTime < 3) {
        // 这里插入你想执行的代码
        // startSecondInterval().then(() => {
        //     console.log("upload_progress Interval has finished, do something else now.");
        //     // 在这里执行其他操作
        // });
        await startSecondInterval();
        startTime += stepTime;
        // console.log("upload_progress startTime",startTime);
    }
    
}

function create_finish(){
    // 获取页面上所有的 .row 元素
    var allRows = document.querySelectorAll('.row');  

    var Row = allRows[0];
    if(Row){
        Row.classList.add("item");
        Row.classList.add("special");
    }

    // 选择第二个 .row 元素
    Row = allRows[1];  // 注意，索引是从 0 开始的，所以第二个元素是 allRows[1]
    if (Row) {  // 确保元素存在
        Row.remove();
    }
    Row = allRows[2];  // 注意，索引是从 0 开始的
    if (Row) {  // 确保元素存在
        Row.remove();
    }
    Row = allRows[3];  // 注意，索引是从 0 开始的
    if (Row) {  // 确保元素存在
        Row.remove();
    }
    // 选择页面上最后一个 .row 元素
    allRows = document.querySelectorAll('.row');  
    var lastRow = allRows[allRows.length - 1];  

    // 创建新的 HTML 内容
    var newRowHTML = `
    <div id="moblie-btn-row" class="row d-md-none item">
        <div class="col d-flex flex-row justify-content-start align-items-end col-12">
            <div class="d-flex flex-row" style="width: 60%;"><svg id="mobile-play-stop" class="bi bi-play-fill" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style="width: 40%;height: auto;border: none;outline: none;cursor: pointer;overflow: hidden;color: var(--bs-white);/*display: none;*/">
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                </svg>
                <p id="mobile-timer" class="d-flex flex-column justify-content-center" style="margin: 0px;white-space: nowrap;">00:00 / 05:32</p>
            </div>
        </div>
    </div>
    `;
    // 在选定的 .row 元素后面插入新的 HTML 内容
    lastRow.insertAdjacentHTML('afterend', newRowHTML);
    
    allRows = document.querySelectorAll('.row');  
    lastRow = allRows[allRows.length - 1];  
    newRowHTML = `
    <div class="row d-flex flex-row justify-content-center item special">
        <div class="col d-flex flex-column justify-content-center align-items-center d-none d-md-block col-2">
            <div class="d-flex flex-column justify-content-center align-items-center" style="width: 100%;height: 100%;"><svg id="play-stop" class="bi bi-play-fill" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style="width: auto;height: 50%;border: none;outline: none;cursor: pointer;overflow: hidden;color: var(--bs-white);/*display: none;*/">
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                </svg>
                <p id="timer" style="margin: 0px;">Paragraph</p>
            </div>
        </div>
        <div class="col d-flex d-xl-flex flex-row justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center">
            <div id="mic" class="mic-class"></div>
        </div>
    </div>
    `;
    // 在选定的 .row 元素后面插入新的 HTML 内容
    lastRow.insertAdjacentHTML('afterend', newRowHTML);

    allRows = document.querySelectorAll('.row');  
    lastRow = allRows[allRows.length - 1];  
    newRowHTML = `
    <div class="row item special">
        <div class="col">
            <div class="container d-flex flex-row justify-content-between align-items-center" style="width: 100%;height: 100%;padding: 0px;">
                <button class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center f-user-btn" type="button" disabled><img class="mr-2" src="assets/img/f-refresh.png" style="height: calc(2vh);width: auto;" /> Songify again</button>
                <button class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center f-user-btn" type="button" disabled><img class="mr-2" src="assets/img/f-heart.png" style="height: calc(2vh);width: auto;" /> Add My Music</button>
                <button class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center f-user-btn" type="button" disabled><img class="mr-2" src="assets/img/f-edit.png" style="height: calc(2vh);width: auto;" /> Editing</button></div>
        </div>
    </div>
    `;
    // 在选定的 .row 元素后面插入新的 HTML 内容
    lastRow.insertAdjacentHTML('afterend', newRowHTML);

    // var btnElement = document.querySelector("#play-stop");
    // btnElement.onclick = handlePlayStopClick;
    var elements = document.querySelectorAll('[id$="play-stop"]');
    elements.forEach((element) => {
        // 对每个匹配的元素执行操作
        element.onclick=handlePlayStopClick
    });

    g_containerHeight = document.getElementById('mic').offsetHeight;
    create_play()

}

function startSecondInterval() {
    return new Promise((resolve) => {
        let startTime = 0;
        // const stepTime = 0.01;
        const interval = 10; // 单位：毫秒

        const intervalId = setInterval(() => {
            if (startTime >= 1) {  // 如果到达或超过 100%，停止
                clearInterval(intervalId);
                resolve(); // 完成 Promise
                return;
            }
            startTime ++;
        }, interval);
    });
}

async function upload_progress(){
    let startTime = 0.1;  // 初始位置，从 0% 开始
    let stepTime = 0.01;  // 步进，每次移动 1%
    let interval = 100;  // 每 100 毫秒更新一次

    // const intervalId = setInterval(() => {
    //     if (startTime >= 1) {  // 如果到达或超过 100%，停止
    //         g_waverecordsurfer.seekTo(0.999);
    //         clearInterval(intervalId);
    //         return;
    //     }
    //     g_waverecordsurfer.seekTo(startTime);
    //     startTime += stepTime;
    //     document.getElementById('timer').textContent = `${(startTime * 100).toFixed(2)}%`;
 
    // }, interval);

    while (startTime < 1) {
        // 这里插入你想执行的代码
        // startSecondInterval().then(() => {
        //     console.log("upload_progress Interval has finished, do something else now.");
        //     // 在这里执行其他操作
        // });
        await startSecondInterval();
        g_waverecordsurfer.seekTo(startTime);
        startTime += stepTime;
        // console.log("upload_progress startTime",startTime);
        document.getElementById('timer').textContent = `${(startTime* 100).toFixed(2)}%`;
      }
      console.log("upload_progress finish");
} 


function create_play(blob = null) {

    // var play_element = document.getElementById("play-stop");
    // if(play_element){
    //     document.getElementById("play-stop").style.display = "block";
    // }
    // var delete_element = document.getElementById("delete-btn");
    // if(delete_element){
    //     delete_element.style.display = "block";
    // }
    // setStyleDisplay("play-stop","block")
    // setStyleDisplay("delete-btn","block")
    // moblie-btn-row
    // var mobile_btn_row_element = document.getElementById("moblie-btn-row");
    // if(mobile_btn_row_element){
    //     mobile_btn_row_element.style.display = "block";
    // }
    try
   { 
        setStyleDisplay("moblie-btn-row","flex")
        setStyleDisplay("play-stop","block")
        setStyleDisplay("delete-btn","block")
        var recordedUrl
        if (blob === null || blob === undefined) {
            recordedUrl = 'assets/audio/test.mp3'
        }
        else{
            recordedUrl = URL.createObjectURL(blob)
        }
        //   const container = document.querySelector('#recordings')
        const container = document.querySelector('#mic')

        const waveplaysurfer = WaveSurfer.create({
            container,
            waveColor: 'rgb(200, 100, 0)',
            progressColor: 'rgb(100, 50, 0)',
            url: recordedUrl,
            height: g_containerHeight
        })

        g_waveplaysurfer = waveplaysurfer

        const wsRegions = waveplaysurfer.registerPlugin(RegionsPlugin.create())

        wsRegions.enableDragSelection({
            color: 'rgba(255, 0, 0, 0.1)',
        })
        // waveplaysurfer.registerPlugin(TimelinePlugin.create())
        waveplaysurfer.registerPlugin(Hover.create({
            lineColor: '#ff0000',
            lineWidth: 2,
            labelBackground: '#555',
            labelColor: '#fff',
            labelSize: '11px',
        }))
        g_wsRegions = wsRegions
        

        // waveplaysurfer.on('interaction', () => waveplaysurfer.playPause())
        waveplaysurfer.on('ready', function () {
            updatePlayTimeDisplay(g_currentPlayPosition)
        });

        const handlePlayformInteraction = createHandlePlayformInteraction(waveplaysurfer);
        waveplaysurfer.on('interaction', handlePlayformInteraction);

        const handlePlayformRegioncreated = createHandlePlayformRegioncreated(wsRegions);
        wsRegions.on('region-created', handlePlayformRegioncreated);

        const handlePlayformRegionin = createHandlePlayformRegionin(wsRegions);
        wsRegions.on('region-in', handlePlayformRegionin);

        const handlePlayformRegionout = createHandlePlayformRegionout(waveplaysurfer);
        wsRegions.on('region-out', handlePlayformRegionout);

        const handlePlayformRegionclicked = createHandlePlayformRegionclicked(wsRegions);
        wsRegions.on('region-clicked', handlePlayformRegionclicked);

        const handlePlayformAudioprocess = createHandlePlayformAudioprocess(waveplaysurfer);
        waveplaysurfer.on('audioprocess', handlePlayformAudioprocess);

        const handlePlayformSeek = createHandlePlayformSeek(waveplaysurfer);
        waveplaysurfer.on('seeking', handlePlayformSeek);

        const handlePlayformClick = createHandlePlayformClick(waveplaysurfer);
        waveplaysurfer.on('click', handlePlayformClick);
    } catch (err) {
        console.error("Error create_play:", err);
        alert("Error create_play:" + err.toString());
    }

    //   const link = container.appendChild(document.createElement('a'))
    //   Object.assign(link, {
    //     href: recordedUrl,
    //     download: 'recording.' + blob.type.split(';')[0].split('/')[1] || 'webm',
    //     textContent: 'Download recording',
    //     style: 'display: block; margin: 1rem 0 2rem',
    //   })
}

function createHandlePlayformInteraction(waveplaysurfer) {
    return function () {
        // 在这里你可以访问传递过来的 waveplaysurfer
        console.log('createHandlePlayformInteraction');
        waveplaysurfer.playPause();
    };
}

function createHandlePlayformRegioncreated(wsRegions) {
    return function (region) {
        // 在这里你可以访问传递过来的 waveplaysurfer
        console.log('createHandlePlayformRegioncreated', region.start, region.end);
        var regions = wsRegions.getRegions();
        if (regions.length > 1) {
            regions[0].remove();
        }
    };
}



function createHandlePlayformRegionin(wsRegions) {
    return function (region) {
        console.log('createHandlePlayformRegionin');
        g_activeRegion = region
    };
}

function createHandlePlayformRegionout(waveplaysurfer) {
    return function (region) {
        console.log('createHandlePlayformRegionout', g_currentSeekPosition, region.start);
        if ((g_currentSeekPosition < region.start) || (g_currentSeekPosition > region.end)) {
            // 获取音频总长度
            const duration = waveplaysurfer.getDuration();
            // 计算 currentPlayPosition 相对于音频总长度的比例
            const seekPosition = g_currentSeekPosition / duration;
            waveplaysurfer.seekTo(seekPosition);
            waveplaysurfer.play();
            return;
        }
        if (g_activeRegion === region) {
            console.log('g_activeRegion === region');
            if (true) {
                region.play()
            } else {
                g_activeRegion = null
            }
        }
    };
}

function createHandlePlayformRegionclicked(wsRegions) {
    return function (region, e) {
        console.log('createHandlePlayformRegionclicked');
        e.stopPropagation() // prevent triggering a click on the waveform
        g_activeRegion = region
        region.play()
        region.setOptions({ color: g_randomColor() })
    };
}

function createHandlePlayformAudioprocess(waveplaysurfer) {
    return function (currentTime) {
        // console.log("createHandlePlayformAudioprocess",currentTime);
        g_currentPlayPosition = currentTime;

        updatePlayTimeDisplay(g_currentPlayPosition);

        var btnPathElement = document.querySelector("#play-stop path");
        var mobileBtnPathElement = document.querySelector("#mobile-play-stop path");
        var elements = [];
        if (btnPathElement) {
            elements.push(btnPathElement);
        }
        if (mobileBtnPathElement) {
            elements.push(mobileBtnPathElement);
        }
        elements.forEach((element) => {
            // 对每个匹配的元素执行操作
            if (g_waveplaysurfer.isPlaying()) {
                // console.log('createHandlePlayformAudioprocess_playing')
                // recButton.setAttribute('d', 'M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z'); // 更改回"播放"图标为暂停
                // var btnPathElement = document.querySelector("#play-stop path");
                element.setAttribute('d', 'M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z');
                // recButton.textContent = 'stop'
                return
            }
            // recButton.textContent = 'play'
            // console.log('createHandlePlayformAudioprocess_stop')
            // var btnPathElement = document.querySelector("#play-stop path");
            element.setAttribute('d', 'm11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z'); // 更改回"暂停"图标为播放
        });

        // const recButton = document.querySelector('#play-stop')
        // var btnPathElement = document.querySelector("#play-stop path");
        // if (g_waveplaysurfer.isPlaying()) {
        //     // console.log('createHandlePlayformAudioprocess_playing')
        //     // recButton.setAttribute('d', 'M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z'); // 更改回"播放"图标为暂停
        //     // var btnPathElement = document.querySelector("#play-stop path");
        //     btnPathElement.setAttribute('d', 'M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z');
        //     // recButton.textContent = 'stop'
        //     return
        // }
        // // recButton.textContent = 'play'
        // // console.log('createHandlePlayformAudioprocess_stop')
        // // var btnPathElement = document.querySelector("#play-stop path");
        // btnPathElement.setAttribute('d', 'm11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z'); // 更改回"暂停"图标为播放

    }
}

function createHandlePlayformSeek(waveplaysurfer) {
    return function (currentTime) {
        console.log('currentTime', currentTime)
        g_currentSeekPosition = currentTime;
    }
}

function createHandlePlayformClick(waveplaysurfer) {
    return function (relativeX) {
        // console.log('createHandlePlayformClick')
        // const recButton = document.querySelector('#play-stop')
        // recButton.textContent = 'stop'

    }
}

// Buttons
// {
    // Start recording
    // const recButton = document.querySelector('#play-stop')
    // recButton.onclick = () => {
function handlePlayStopClick()
{
    console.log("handlePlayStopClick")
    // const recButton = document.querySelector('#play-stop')
    if (g_waveplaysurfer.isPlaying()) {
        g_waveplaysurfer.pause()
        // recButton.textContent = 'play'
        //   recButton.setAttribute('d', 'M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z'); // 更改回"播放"图标的 path 数据
        return
    }

    var elements = document.querySelectorAll('[id$="play-stop"]');
    elements.forEach((element) => {
        // 对每个匹配的元素执行操作
        element.disabled=true
    });

    g_waveplaysurfer.play().then(() => {
        // recButton.textContent = 'Stop'
        elements.forEach((element) => {
            // 对每个匹配的元素执行操作
            element.disabled=false
        });
    })
    // recButton.setAttribute('d', 'm11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z'); // 更改回"播放"图标的 path 数据
}
// }


// delete Buttons
function handleDeleteClick()
{
    // Start recording
    // const delButton = document.querySelector('#delete-btn')
    // delButton.onclick = () => {
    g_waveplaysurfer.destroy()
    init()
    // location.reload();
    var btn = document.getElementById('record');
    btn.src = 'assets/img/t13.png';
    // document.getElementById("play-stop").style.display = "none";
    // document.getElementById("delete-btn").style.display = "none";
    setStyleDisplay("play-stop","none")
    setStyleDisplay("delete-btn","none")
    g_currentPlayPosition = 0
    g_currentSeekPosition = 0
    stopRecordTimer()
    // }
}

function setStyleDisplay(id,type)
{
    const elements = document.querySelectorAll(`[id$="${id}"]`);
    elements.forEach((element) => {
        // 对每个匹配的元素执行操作
        element.style.display=type
      });
}


// 格式化时间为 mm:ss 格式
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 更新播放时间显示
function updatePlayTimeDisplay(currentTime) {
    const totalTime = g_waveplaysurfer.getDuration();
    var elements = document.querySelectorAll('[id$="timer"]');
    elements.forEach((element) => {
        // 对每个匹配的元素执行操作
        element.textContent = `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
    });
}

















