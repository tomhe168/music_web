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

if (window.location.href.indexOf('describe.html') !== -1){

    window.onload = function() {
        // 页面加载完成后要执行的代码
        init()
    };


    function init()
    {

        var elements = document.querySelectorAll('[id$="play-stop"]');
        elements.forEach((element) => {
            // 对每个匹配的元素执行操作
            element.onclick=handlePlayStopClick
        });

        elements = document.querySelectorAll('[id$="btn-songify"]');
        elements.forEach((element) => {
            // 对每个匹配的元素执行操作
            element.onclick=handleSongify
        });

        
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


    function create_play(blob = null) {
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



    async function create_creating(){
        var allRows = document.querySelectorAll('.row'); 
        var Row = allRows[1];  // 删除第一个元素
        if (Row) {  // 确保元素存在
            Row.remove();
        } 
        Row = allRows[2];  // 删除第二个元素
        if (Row) {  // 确保元素存在
            Row.remove();
        } 
        Row = allRows[allRows.length - 1];  // 删除最后一个元素，注意，索引是从 0 开始的
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
            document.getElementById("btn-songify").outerHTML =  "<div class='loading la-2x la-white'></div>" //"<h1 id='head-p'>Creating</h1>";
        }
        else{
            document.getElementById("btn-songify").outerHTML =  "<div class='loading la-3x la-white'></div>" //"<h1 id='head-p'>Creating</h1>";
        }
        initLoading()
        var lastRow = allRows[allRows.length - 1];  

        // 创建新的 HTML 内容
        var newRowHTML = `
        <div class="row item">
            <div class="col d-flex flex-row justify-content-center align-items-center">
                <h1>Creating</h1>
            </div>
        </div>  
        `;
        // 在选定的 .row 元素后面插入新的 HTML 内容
        lastRow.insertAdjacentHTML('afterend', newRowHTML);

        let startTime = 0;
        let stepTime = 0.01;  // 步进，每次移动 1%
        while (startTime < 3) {
            await startSecondInterval();
            startTime += stepTime;
        }
        
    }

    function create_finish(){
        // 获取页面上所有的 .row 元素
        var allRows = document.querySelectorAll('.row'); 
        var Row = allRows[1];  // 删除第一个元素
        if (Row) {  // 确保元素存在
            Row.remove();
        } 
        Row = allRows[2];  // 删除第二个元素
        if (Row) {  // 确保元素存在
            Row.remove();
        } 

        allRows.forEach((row) => {
            //console.log(row); // 这里可以对每个 row 进行操作
            row.classList.add("item");
            row.classList.add("special");
        });

        // 选择页面上最后一个 .row 元素
        allRows = document.querySelectorAll('.row');  
        var lastRow = allRows[allRows.length - 1];  

        // 创建新的 HTML 内容
        var newRowHTML = `
        <div id="d-play-row" class="row d-flex flex-row justify-content-center item special" style="margin: 0px;">
            <div class="col-sm-2 d-flex flex-column justify-content-center align-items-center col-md-2 col-2 order-md-1 order-2" style="height: 50%;">
                <div class="d-flex flex-column justify-content-center align-items-center" style="width: 100%;height: 100%;"><svg id="play-stop" class="bi bi-play-fill" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style="width: auto;height: 50%;border: none;outline: none;cursor: pointer;overflow: hidden;color: var(--bs-white);/*display: none;*/">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                    </svg>
                    <p id="timer" style="margin: 0px;"></p>
                </div>
            </div>
            <div class="col d-flex d-sm-flex flex-column justify-content-center justify-content-sm-start col-md-3 col-10 order-md-2 order-2" style="height: 50%;">
                <div class="row" style="height: 50%;">
                    <div class="col" style="padding: 0px;"><textarea style="background: rgba(119,40,245,0.37);border-style: solid;border-color: #6825d7;color: var(--bs-white);resize: none;width: 100%;height: 100%;margin-top: 0px;font-size: calc(1.5vh);padding: 0px;border-radius: 0px;" placeholder="e.g: Future， PopCorporate， PopDrums"></textarea></div>
                </div>
                <div class="row" style="height: 50%;">
                    <div class="col" style="padding: 0px;">
                        <div class="d-flex justify-content-center align-items-center" style="background: #A068F8;color: var(--bs-white);margin: 0px;padding: 0px;border-style: none;width: 100%;height: 100%;gap: 5%;font-size: calc(2vh);"><svg class="bi bi-clock" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style="color: var(--bs-white);margin-top: -2%;">
                                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"></path>
                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"></path>
                            </svg><input data-role="timepicker" data-hours="false" data-cls-minutes="bg-transparent fg-white" data-cls-seconds="bg-transparent fg-white" data-show-labels="true" data-value="00:05:00" data-cls-picker="my-picker" /></div>
                    </div>
                    <div class="col" style="padding: 0px;">
                        <div class="dropdown" style="width: 100%;height: 100%;"><button class="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button" style="background: rgba(119,40,245,1);padding: 0px;height: 100%;width: 100%;border-style: none;font-size: calc(2vh);border-radius: 0px;">Loop</button>
                            <div class="dropdown-menu dropdown-menu-body"><a class="dropdown-item dropdown-item-body" href="#">Track</a><a class="dropdown-item dropdown-item-body" href="#">Mix</a><a class="dropdown-item dropdown-item-body" href="#">Jingle</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col d-flex d-xl-flex flex-row justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-md-7 col-12 order-md-3 order-1" style="padding: 0px;height: 50%;">
                <div id="mic" class="mic-class"></div>
            </div>
        </div>
        <div class="row item special">
            <div class="col">
                <div class="container d-flex flex-row justify-content-between align-items-center" style="width: 100%;height: 100%;padding: 0px;">
                    <button class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center f-user-btn" type="button" disabled><img class="mr-2" src="assets/img/f-refresh.png" style="height: calc(2vh);width: auto;" /> Songify again</button>
                    <button class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center f-user-btn" type="button" disabled><img class="mr-2" src="assets/img/f-heart.png" style="height: calc(2vh);width: auto;" /> Add My Music</button>
                    <button class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center f-user-btn" type="button" disabled><img class="mr-2" src="assets/img/f-edit.png" style="height: calc(2vh);width: auto;" width="22" height="22" /> Editing</button>
                    <button class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center f-user-btn" type="button" disabled><img class="mr-2" src="assets/img/d-download.png" style="height: calc(2vh);width: auto;" width="22" height="22" /> download</button></div>
            </div>
        </div>
        `;
        // 在选定的 .row 元素后面插入新的 HTML 内容
        lastRow.insertAdjacentHTML('afterend', newRowHTML);
        // var btnPathElement = document.querySelector("#play-stop path");
        // var playRow = document.querySelector('d-play-row');   
        // newRowHTML = `
       
        // `;
        // // 在选定的 .row 元素后面插入新的 HTML 内容
        // playRow.insertAdjacentHTML('afterend', newRowHTML);
        g_containerHeight = document.getElementById('mic').offsetHeight;
        var elements = document.querySelectorAll('[id$="play-stop"]');
        elements.forEach((element) => {
            // 对每个匹配的元素执行操作
            element.onclick=handlePlayStopClick
        });
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









    function handleSongify()
    {
        var elements = document.querySelectorAll('[id$="btn-songify"]');
        elements.forEach((element) => {
            // 对每个匹配的元素执行操作
            element.disabled=true
        });

        create_creating().then(() => {
            create_finish()
        });

        elements.forEach((element) => {
            // 对每个匹配的元素执行操作
            element.disabled=false
        });

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


}
















