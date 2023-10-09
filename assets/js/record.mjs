import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'
import TimelinePlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/timeline.esm.js'
import Hover from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/hover.esm.js'
import RecordPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/record.esm.js'

import isMobileDevice from'./navbar.js'
import initLoading from './loading.js'


(function() {
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

    let g_socket;

    let g_finish_blob = null;

    // var G_MEDIA_URL = "{{ MEDIA_URL }}"; // 来自Django的模板上下文

    // 将内部函数绑定到 window 对象上
    window.enterRecordPage = enterRecordPage;

    function enterRecordPage(){
        var firstRow = $(".first-row");
        firstRow.removeClass().addClass("edit-item special");
        firstRow.after(`
        <div class="row mobile-item"></div>
        <div class="row edit-mobile-half-item special3">
            <div class="col d-flex flex-column justify-content-around align-items-center d-none d-lg-block"></div>
            <div class="col d-flex flex-column justify-content-start align-items-center" style="padding: 0px;height: 100%;"><img id="record" class="r-img-container" src="assets/img/t13.png" width="150" height="150"></div>
            <div class="col d-flex flex-column justify-content-around align-items-center d-none d-lg-block"></div>
        </div>
        <div class="row item">
            <div class="col d-flex flex-row justify-content-center align-items-start align-items-sm-start align-items-md-start align-items-lg-center align-items-xl-center align-items-xxl-center">
                <p class="d-flex justify-content-center t-time-display" id="timer">00:00</p>
            </div>
        </div>
        <div class="row item d-lg-none" id="moblie-btn-row" style="display: none;">
            <div class="col d-flex flex-row justify-content-center align-items-center col-6"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-play-fill play-icon-btn" id="mobile-play-stop">
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                </svg></div>
            <div class="col d-flex flex-row justify-content-center align-items-center col-6"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-trash-fill delete-icon-btn" id="mobile-delete-btn">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"></path>
                </svg></div>
        </div>
        <div class="row d-flex flex-row justify-content-center item special">
            <div class="col d-flex flex-row justify-content-start align-items-center item d-none d-lg-block" style="padding: 0px;">
                <div class="d-flex flex-row justify-content-end align-items-center" style="width: 100%;height: 100%;"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-play-fill play-icon-btn" id="play-stop">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                    </svg></div>
            </div>
            <div class="col d-flex d-xl-flex flex-column justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center item special">
                <div id="mic" class="mic-class"></div>
            </div>
            <div class="col d-flex flex-row justify-content-start align-items-center item d-none d-lg-block" style="padding: 0px;">
                <div class="d-flex flex-row justify-content-start align-items-center" style="width: 100%;height: 100%;"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-trash-fill delete-icon-btn" id="delete-btn">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"></path>
                    </svg></div>
            </div>
        </div>
        `);
        init();
    
    }



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

        g_socket = new WebSocket('ws://127.0.0.1:8001/ws/music_processing');

        g_socket.onopen = function(e) {
            console.log("[open] Connection established");
        };

        g_socket.onerror = function(error) {
            console.error(`[error] ${error.message}`);
        };

        g_socket.onmessage = function(event) {
            console.log("g_socket.onmessage");
            const data = JSON.parse(event.data);
            if ((data.type === "send_record_update") && (data.status === 'done')) {
                console.log("g_socket.onmessage done");
                loadProcessedMusic(data.processed_file_url);
            }
        };
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
                    this.src = "static/music/img/t51x.png"
                    g_record_btn_type = 1
                    return
                }

                btn.disabled = true


                try {
                    // if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
                    //     throw new Error("Cannot read property 'getUserMedia' of undefined");
                    // }

                    // if (!navigator.mediaDevices?.enumerateDevices) {
                    //     console.log("enumerateDevices() not supported.");
                    //   } else {
                    //     // List cameras and microphones.
                    //     navigator.mediaDevices
                    //       .enumerateDevices()
                    //       .then((devices) => {
                    //         devices.forEach((device) => {
                    //           console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
                    //         });
                    //       })
                    //       .catch((err) => {
                    //         console.error(`${err.name}: ${err.message}`);
                    //       });
                    //   }

                    // let stream
                    // navigator.mediaDevices.getUserMedia({ audio: true })
                    // .then(function(stream) {
                    //     // 成功获取音频流
                    //     // `stream` 是一个包含用户麦克风音频流的 MediaStream 对象
                    //     console.log("getUserMedia({ audio: true }) success")
                    // })
                    // .catch(function(err) {
                    // // 发生错误（用户拒绝、设备错误等）
                    //     console.error(`${err.name}: ${err.message}`);
                    // });
                    // return

                    g_record.startRecording()
                    .then(() => {
                        // recButton.textContent = 'Stop'
                        this.src = "static/music/img/t14.png"
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
        g_waveplaysurfer.playPause();
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
        
        // document.getElementById('timer').style.fontSize = "calc(2rem + 2vh)";
        document.getElementById('timer').textContent = "0%";

        let formData = new FormData();
        // 生成一个随机文件名
        let randomFileName = 'record_' + new Date().getTime() + "_" + Math.random().toString(36).substr(2, 9) + '.wav';
        // 创建一个新的 File 对象，并指定文件名
        let audio_file = new File([newBlob], randomFileName, {type: "audio/wav"});


        formData.append("audio", audio_file);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/upload_record/", true);
        // Set the CSRF token header
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));

        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                console.error("event.loaded");
                let percentage = (event.loaded / event.total) * 100;
                // document.getElementById("uploadProgress").value = percentage;
                g_waverecordsurfer.seekTo(percentage);
                // startTime += stepTime;
                // console.log("upload_progress startTime",startTime);
                document.getElementById('timer').textContent = `${percentage.toFixed(2)}%`;
            }
        };

        xhr.onload = function() {
            console.error("onload");
            if (xhr.status == 200) {
                console.log("Uploaded successfully!");
                document.getElementById('timer').textContent = "Uploaded successfully!";
                create_creating()
            } else {
                console.error("else onload");
                let errorMessage
                try {
                    let responseObj = JSON.parse(xhr.responseText);
                    errorMessage = responseObj.message || "Error during upload.";
                } catch (e) {
                    // console.error("Failed to parse response as JSON:", xhr.responseText);
                    errorMessage = xhr.responseText || "Error during upload(json).";
                }
                document.getElementById('timer').textContent = errorMessage;
                console.error(errorMessage);
            }
        };
        xhr.onerror = function() {
            console.error("Request failed");
            document.getElementById('timer').textContent = "Network error or request was blocked.";
        };

        xhr.send(formData);

        // create_creating();

        // upload_progress().then(() => {
        //     create_creating().then(() => {
        //         create_finish()
        //     });
        // });
        
    }

    function loadProcessedMusic(fileUrl) {
        var xhr = new XMLHttpRequest();
        var allFileUrl = G_MEDIA_URL + fileUrl;
        xhr.open('GET', allFileUrl, true);
        xhr.responseType = 'arraybuffer';
        xhr.timeout = 100000; // 设置超时时间为100秒 (10000毫秒)
        xhr.onload = function(e) {
            if (this.status == 200) {
                // Convert array buffer to blob
                var blob = new Blob([this.response], {type: 'audio/wav'});
                create_finish(blob);
            } else {
                console.error("Failed to fetch audio:", this.statusText);
                alert("Failed to fetch audio:", this.statusText);
            }
        };
        
        xhr.onerror = function(e) {
            console.error("Failed to fetch audio:", e);
            alert("Failed to fetch audio:", e);
        };
        xhr.ontimeout = function() {
            // 处理超时
            console.error("timeout to fetch audio:", e);
            alert("timeout to fetch audio:", e);
        };

        xhr.send();
    }

    function create_creating(){
        var allRows = document.querySelectorAll('.row');     
        //只保留第一个  
        for (var i = 1; i < allRows.length; i++) {
            allRows[i].parentNode.removeChild(allRows[i]);
        }

        allRows = document.querySelectorAll(".row");
        allRows.forEach((row) => {
            //console.log(row); // 这里可以对每个 row 进行操作
            row.classList.add("item");
            row.classList.add("special");
        });

        allRows = document.querySelectorAll('.row');  
        var lastRow = allRows[allRows.length - 1];  
        // 创建新的 HTML 内容
        var newRowHTML = `
            <div class="row item"></div>
        `;
        // 在选定的 .row 元素后面插入新的 HTML 内容
        lastRow.insertAdjacentHTML('afterend', newRowHTML);
        if(isMobileDevice()){
            allRows = document.querySelectorAll('.row');  
            lastRow = allRows[allRows.length - 1];  
            // 创建新的 HTML 内容
            newRowHTML = `
            <div class="row item special">
                <div class="col d-flex flex-column justify-content-around align-items-center"></div>
                <div class="col d-flex flex-column justify-content-around align-items-center">
                    <div class="loading la-2x la-white"></div>
                </div>
                <div class="col d-flex flex-column justify-content-around align-items-center"></div>
            </div>
            `;
            // 在选定的 .row 元素后面插入新的 HTML 内容
            lastRow.insertAdjacentHTML('afterend', newRowHTML);
        }
        else{
            allRows = document.querySelectorAll('.row');  
            lastRow = allRows[allRows.length - 1];  
            // 创建新的 HTML 内容
            newRowHTML = `
            <div class="row item special">
                <div class="col d-flex flex-column justify-content-around align-items-center"></div>
                <div class="col d-flex flex-column justify-content-around align-items-center">
                    <div class="loading la-3x la-white"></div>
                </div>
                <div class="col d-flex flex-column justify-content-around align-items-center"></div>
            </div>
            `;
            // 在选定的 .row 元素后面插入新的 HTML 内容
            lastRow.insertAdjacentHTML('afterend', newRowHTML);
        }
        initLoading()
        allRows = document.querySelectorAll('.row');  
        lastRow = allRows[allRows.length - 1];  
        newRowHTML = `
        <div class="row item"></div>
        `;
        // 在选定的 .row 元素后面插入新的 HTML 内容
        lastRow.insertAdjacentHTML('afterend', newRowHTML);

        allRows = document.querySelectorAll('.row');  
        lastRow = allRows[allRows.length - 1];  
        newRowHTML = `
        <div class="row item special">
            <div class="col d-flex flex-row justify-content-center align-items-center">
                <h1>Creating</h1>
            </div>
        </div>
        `;
        // 在选定的 .row 元素后面插入新的 HTML 内容
        lastRow.insertAdjacentHTML('afterend', newRowHTML);

        allRows = document.querySelectorAll('.row');  
        lastRow = allRows[allRows.length - 1];  
        newRowHTML = `
        <div class="row item"></div>
        `;
        // 在选定的 .row 元素后面插入新的 HTML 内容
        lastRow.insertAdjacentHTML('afterend', newRowHTML);
        
    }

    function create_finish(blob){
        // 获取页面上所有的 .row 元素
        var allRows = document.querySelectorAll('.row');  

        var Row = allRows[0];
        if(Row){
            Row.classList.add("item");
            Row.classList.add("special");
        }
        //只保留第一个
        for (var i = 1; i < allRows.length; i++) {
            allRows[i].parentNode.removeChild(allRows[i]);
        }

        allRows = document.querySelectorAll('.row');  
        var lastRow = allRows[allRows.length - 1];  
        // 创建新的 HTML 内容
        var newRowHTML = `
            <div class="row edit-mobile-half-item d-none d-lg-flex"></div>
        `;
        // 在选定的 .row 元素后面插入新的 HTML 内容
        lastRow.insertAdjacentHTML('afterend', newRowHTML);

        allRows = document.querySelectorAll('.row');  
        lastRow = allRows[allRows.length - 1];  
        // 创建新的 HTML 内容
        newRowHTML = `
        <div id="moblie-btn-row" class="row d-lg-none item">
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
        // 创建新的 HTML 内容
        newRowHTML = `
        <div class="row d-flex flex-row justify-content-center item special">
            <div class="col d-flex flex-column justify-content-center align-items-center d-none d-lg-block col-2">
                <div class="d-flex flex-column justify-content-center align-items-center" style="width: 100%;height: 100%;"><svg id="play-stop" class="bi bi-play-fill" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style="width: auto;height: 50%;border: none;outline: none;cursor: pointer;overflow: hidden;color: var(--bs-white);/*display: none;*/">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                    </svg>
                    <p id="timer" style="margin: 0px;"></p>
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
        // 创建新的 HTML 内容
        newRowHTML = `
        <div class="row item"></div>
        `;
        // 在选定的 .row 元素后面插入新的 HTML 内容
        lastRow.insertAdjacentHTML('afterend', newRowHTML);

        allRows = document.querySelectorAll('.row');  
        lastRow = allRows[allRows.length - 1];  
        // 创建新的 HTML 内容
        newRowHTML = `
        <div class="row edit-mobile-half-item special">
            <div class="col d-flex justify-content-center align-items-center col-3"><button id="r-songify-again-btn" class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center r-last-long-btn" type="button" disabled><img class="r-last-icon" src="f-refresh.png" /> Songify again</button></div>
            <div class="col d-flex flex-row justify-content-center align-items-center col-3"><button id="r-add-music-btn" class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center r-last-long-btn" type="button" disabled><img class="r-last-icon" src="f-heart.png" /> Add My Music</button></div>
            <div class="col d-flex flex-row justify-content-center align-items-center col-3"><button id="r-edit-btn" class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center r-last-long-btn" type="button" disabled><img class="r-last-icon" src="f-edit.png" width height /> Editing</button></div>
            <div class="col d-flex flex-row justify-content-center align-items-center col-3"><button id="r-download-btn" class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center r-last-long-btn" type="button" disabled><img class="r-last-icon" src="d-download.png" width height /> download</button></div>
        </div>
        `;
        // 在选定的 .row 元素后面插入新的 HTML 内容
        lastRow.insertAdjacentHTML('afterend', newRowHTML);

        allRows = document.querySelectorAll('.row');  
        lastRow = allRows[allRows.length - 1];  
        // 创建新的 HTML 内容
        newRowHTML = `
        <div class="row item"></div>
        `;
        // 在选定的 .row 元素后面插入新的 HTML 内容
        lastRow.insertAdjacentHTML('afterend', newRowHTML);
        var elements = document.querySelectorAll('[id$="play-stop"]');
        elements.forEach((element) => {
            // 对每个匹配的元素执行操作
            element.onclick=handlePlayStopClick
        });

        g_containerHeight = document.getElementById('mic').offsetHeight;

        // 使用函数作为点击事件处理程序
        $("#r-songify-again-btn").click(handleRSongifyAgainBtn);

        $("#r-add-music-btn").click(handleRAddMusicBtn);

        $("#r-edit-btn").click(handleREditBtn);

        $("#r-download-btn").click(handleRDownloadBtn);

        g_finish_blob = blob;

        create_play(blob)

    }

    function handleRSongifyAgainBtn(){
        g_waveplaysurfer.destroy();
        leavePage();
        enterRecordPage();
    }

    function handleRAddMusicBtn(){
        // 将当前按钮的背景颜色更改
        $(this).css("background-color", "red");
    }

    function handleREditBtn(){
        leavePage();
        enterEditPage(g_finish_blob ,"record")
    }

    function handleRDownloadBtn(){
        // 创建一个<a>元素用于下载
        const a = document.createElement('a');
        a.href = URL.createObjectURL(g_finish_blob);

        // 提示用户选择下载目录
        a.download = g_music_file_name;

        // 将<a>元素添加到页面，然后触发点击事件
        document.body.appendChild(a);
        a.click();

        // 清理创建的元素和URL对象
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);

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
        btn.src = "static/music/img/t13.png"
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


})();



















