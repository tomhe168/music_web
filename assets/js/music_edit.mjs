import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'
import TimelinePlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/timeline.esm.js'
import Hover from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/hover.esm.js'
import RecordPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/record.esm.js'

import isMobileDevice from'./navbar.js'
import initLoading from './loading.js'


(function() {

    let g_activeRegion = null
    let g_activeRegion2 = null
    // Give regions a random color when they are created
    const g_random = (min, max) => Math.random() * (max - min) + min
    const g_randomColor = () => `rgba(${g_random(0, 255)}, ${g_random(0, 255)}, ${g_random(0, 255)}, 0.5)`
    let g_currentPlayPosition = 0
    let g_currentSeekPosition = 0
    let g_waveplaysurfer = null
    
    let g_currentPlayPosition2 = 0
    let g_currentSeekPosition2 = 0
    let g_waveplaysurfer2 = null

    


    let g_containerHeight = 0
    let g_containerHeight2 = 0


    var g_music_file_name;
    var g_up_music_blob;
    var g_algo_music_blob;

    g_full_btn_down = 0;
    g_intro_btn_down = 0;
    g_melody_btn_down = 0;
    g_chorus_btn_down = 0;
    g_outro_btn_down = 0;

    g_instru = 0;
    g_vacol = 0;

    g_algo_run = 0; //0算法没执行或add过，1算法执行了

 
    g_piano = 0;
    g_guitar = 0;  
    g_bass = 0; 
    g_drum = 0;


     // 将内部函数绑定到 window 对象上
    window.enterEditPage = enterEditPage;


    var g_play_icon = `<svg id="play-stop" class="edit-img-container" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8" fill="#e99d42" />
            <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" fill="white" />
        </svg>`

    var g_pause_icon = `<svg id="play-stop" width="100" height="100" xmlns="http://www.w3.org/2000/svg" >
        <!-- 创建红色圆形 -->
        <circle cx="50" cy="50" r="50" fill="#e99d42" />
        
        <!-- 创建两条带有稍微圆润边缘的白色竖线 -->
        <rect x="35" y="30" width="10" height="40" rx="5" ry="5" fill="white" />
        <rect x="55" y="30" width="10" height="40" rx="5" ry="5" fill="white" />
    </svg>`


    function enterEditPage(up_music_blob = null ,music_file_name = null){
        var firstRow = $(".first-row");
        firstRow.removeClass().addClass("edit-item special");
        firstRow.after(`
        <div class="row edit-item">
        <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center justify-content-xxl-start align-items-xxl-center">
            <p id="music-name" class="e-set-name">成都大运会主题曲</p><img src="e-antFill-edit.svg" style="width: calc(2.5vh);" />
        </div>
        </div>
        <div class="row d-xxl-flex justify-content-xxl-center align-items-xxl-center mobile-item special">
            <div class="col d-flex flex-column justify-content-center align-items-center col-lg-1 col-4 e-custom-col" style="/*height: 50%;*/">
                <div class="d-flex flex-column justify-content-center align-items-center" style="width: 100%;height: 100%;"><svg id="play-stop" class="edit-img-container" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="8" fill="#e99d42"></circle>
                        <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" fill="white"></path>
                    </svg></div>
            </div>
            <div class="col d-flex flex-column justify-content-around col-xxl-1 col-lg-2 col-4 e-custom-col" style="/*height: 50%;*/">
                <p class="music-score-display"><img class="music-score-icon-display" src="semiDesign-semi-icons-tiktok_logo.svg" />72.5</p>
                <p id="timer" class="music-time-display">1:08/3:42</p>
            </div>
            <div class="col d-flex d-xl-flex flex-row justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-xxl-10 col-lg-9 col-12 e-custom-col" style="/*height: 50%;*/">
                <div id="mic" class="mic-class"></div>
            </div>
        </div>
        <div id="row-collapse-above" class="row d-flex d-lg-none edit-item">
            <div class="col" style="padding: 0px;">
                <div class="swiper mySwiper1">
                    <div class="swiper-wrapper">
                        <div class="d-flex flex-row justify-content-between swiper-slide">
                            <div class="swiper-container"><button class="btn btn-primary edit-swiper-btn" type="button" data-bs-toggle="collapse" data-bs-target="#e-collapse1" aria-expanded="false" aria-controls="#e-collapse1"><img class="e-middle-icon" src="st-wrench.svg" />Tools</button><button class="btn btn-primary edit-swiper-btn" type="button" data-bs-toggle="collapse" data-bs-target="#e-collapse2" aria-expanded="false" aria-controls="#e-collapse2"><img class="e-middle-icon" src="iconPark-shuffle-one.svg" />Remix</button><button class="btn btn-primary edit-swiper-btn" type="button" data-bs-toggle="collapse" data-bs-target="#e-collapse3" aria-expanded="false" aria-controls="#e-collapse3"><img class="e-middle-icon" src="iconPark-star-one.svg" width="16" height="16" />HotTrackRater</button></div>
                        </div>
                        <div class="swiper-slide">
                            <div class="swiper-container"><button class="btn btn-primary edit-swiper-btn" type="button" data-bs-toggle="collapse" data-bs-target="#e-collapse4" aria-expanded="false" aria-controls="#e-collapse1"><img class="e-middle-icon" src="iconPark-file-conversion.svg" />Conversion</button><button class="btn btn-primary edit-swiper-btn" type="button" data-bs-toggle="collapse" data-bs-target="#e-collapse5" aria-expanded="false" aria-controls="#e-collapse1"><img class="e-middle-icon" src="if-ui-video.svg" />AudioViz</button><button class="btn btn-primary edit-swiper-btn" type="button" data-bs-toggle="collapse" data-bs-target="#e-collapse6" aria-expanded="false" aria-controls="#e-collapse2"><img class="e-middle-icon" src="if-ui-love-remove.svg" />Delete</button></div>
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
            </div>
        </div>
        <div id="row-collapse-move" class="row d-flex d-lg-none">
            <div class="col" style="padding: 0px;">
                <div id="e-collapse-parent">
                    <div id="e-collapse1" class="collapse custom-collapse e-collapse-back" data-bs-parent="#e-collapse-parent">
                        <div class="e-collapse-style">
                            <div class="swiper mySwiper2">
                                <div class="swiper-wrapper">
                                    <div class="swiper-slide">
                                        <div class="swiper-container"><button class="btn btn-primary edit-collapse-up-btn" type="button"><img class="e-middle-icon" src="e-iconPark-cutting-one.svg" />Smart Trimmer</button><button class="btn btn-primary edit-collapse-up-btn" type="button"><img class="e-middle-icon" src="e-if-sound-wave-alt.svg" width="20" height="20" />Accomp Isolate</button></div>
                                    </div>
                                    <div class="swiper-slide">
                                        <div class="swiper-container"><button class="btn btn-primary edit-collapse-up-btn" type="button"><img class="e-middle-icon" src="e-if-guiter.svg" width="20" height="20" />Instru Isolate</button><button class="btn btn-primary edit-collapse-up-btn" type="button"><img class="e-middle-icon" src="e-if-ui-record.svg" />TuneAdj</button></div>
                                    </div>
                                </div>
                                <div class="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>
                    <div id="e-collapse2" class="collapse custom-collapse e-collapse-back" data-bs-parent="#e-collapse-parent">
                        <div class="e-collapse-style">
                            <div class="swiper mySwiper2">
                                <div class="swiper-wrapper">
                                    <div class="swiper-slide">
                                        <div class="swiper-container"><button class="btn btn-primary edit-collapse-up-btn" type="button"><img class="e-middle-icon" src="e-semiDesign-semi-icons-similarity.svg" />Harmony</button><button class="btn btn-primary edit-collapse-up-btn" type="button"><img class="e-middle-icon" src="e-iconPark-go-on.svg" />Continuation</button></div>
                                    </div>
                                    <div class="swiper-slide">
                                        <div class="swiper-container"><button class="btn btn-primary edit-collapse-up-btn" type="button"><img class="e-middle-icon" src="iconPark-shuffle-one.svg" width="20" height="20" />Mashup</button>
                                            <p class="edit-collapse-up-btn" style="background-color: transparent !important;"></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>
                    <div id="e-collapse3" class="collapse custom-collapse e-collapse-back" data-bs-parent="#e-collapse-parent">
                        <div class="e-collapse-style"></div>
                    </div>
                    <div id="e-collapse4" class="collapse custom-collapse e-collapse-back" data-bs-parent="#e-collapse-parent">
                        <div class="e-collapse-style">
                            <div class="swiper mySwiper2">
                                <div class="swiper-wrapper">
                                    <div class="swiper-slide">
                                        <div class="swiper-container"><button class="btn btn-primary edit-collapse-up-btn" type="button"><img class="e-middle-icon" src="e-iconPark-file-music.svg" />MIDI</button><button class="btn btn-primary edit-collapse-up-btn" type="button"><img class="e-middle-icon" src="e-md-queue_music.svg" />ScoreGen</button></div>
                                    </div>
                                </div>
                                <div class="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>
                    <div id="e-collapse5" class="collapse custom-collapse e-collapse-back" data-bs-parent="#e-collapse-parent">
                        <div class="e-collapse-style"></div>
                    </div>
                    <div id="e-collapse6" class="collapse custom-collapse e-collapse-back" data-bs-parent="#e-collapse-parent">
                        <div class="e-collapse-style"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mobile-item d-none d-lg-flex">
            <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-start col-md-2 col-4" style="padding: 0px;"><button id="e-11-btn" class="btn btn-primary edit-up-btn" type="button"><img class="e-middle-icon" src="st-wrench.svg" />Tools</button></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-start col-md-2 col-4" style="padding: 0px;"><button id="e-12-btn" class="btn btn-primary edit-up-btn" type="button"><img class="e-middle-icon" src="iconPark-shuffle-one.svg" />Remix</button></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-start col-md-2 col-4" style="padding: 0px;"><button id="e-13-btn" class="btn btn-primary edit-up-btn" type="button"><img class="e-middle-icon" src="iconPark-star-one.svg" width="11" height="11" />HotTrackRater</button></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-start col-md-2 col-4" style="padding: 0px;"><button id="e-14-btn" class="btn btn-primary edit-up-btn" type="button"><img class="e-middle-icon" src="iconPark-file-conversion.svg" />Conversion</button></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-start align-items-xxl-start col-md-2 col-4" style="padding: 0px;"><button id="e-15-btn" class="btn btn-primary edit-up-btn" type="button"><img class="e-middle-icon" src="if-ui-video.svg" />AudioViz</button></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-start col-md-2 col-4" style="padding: 0px;"><button id="e-16-btn" class="btn btn-primary edit-up-btn" type="button"><img class="e-middle-icon" src="if-ui-love-remove.svg" />Delete</button></div>
        </div>
        <div id="half-row" class="row mobile-item d-none d-lg-flex">
            <div class="col" style="padding: 0px;">
                <div id="e2-btn-div0" class="e2-btn-div">
                    <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-center justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col" style="padding: 0px;"></div>
                    <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-center justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col" style="padding: 0px;"></div>
                    <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-center justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col" style="padding: 0px;"></div>
                    <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-center justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col" style="padding: 0px;"></div>
                    <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col"></div>
                    <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col"></div>
                </div>
                <div id="e2-btn-div1" class="e2-btn-div">
                    <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center col-md-2 col-4 e-custom-col" style="padding: 0px;"><button id="e-211-btn" class="btn btn-primary edit-up-btn2" type="button"><img class="e-middle-icon" src="e-iconPark-cutting-one.svg" />Smart Trimmer</button></div>
                    <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center col-md-2 col-4 e-custom-col" style="padding: 0px;"><button id="e-212-btn" class="btn btn-primary edit-up-btn2" type="button"><img class="e-middle-icon" src="e-if-sound-wave-alt.svg" width="20" height="20" />Accomp Isolate</button></div>
                    <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center col-md-2 col-4 e-custom-col" style="padding: 0px;"><button id="e-213-btn" class="btn btn-primary d-xxl-flex edit-up-btn2" type="button"><img class="e-middle-icon" src="e-if-guiter.svg" width="20" height="20" />Instru Isolate</button></div>
                    <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center col-md-2 col-4 e-custom-col" style="padding: 0px;"><button id="e-214-btn" class="btn btn-primary edit-up-btn2" type="button"><img class="e-middle-icon" src="e-if-ui-record.svg" />TuneAdj</button></div>
                    <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col"></div>
                    <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col"></div>
                </div>
                <div id="e2-btn-div2" class="e2-btn-div">
                    <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center col-md-2 col-4 e-custom-col" style="padding: 0px;"><button id="e-221-btn" class="btn btn-primary edit-up-btn2" type="button"><img class="e-middle-icon" src="e-semiDesign-semi-icons-similarity.svg" />Harmony</button></div>
                    <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center col-md-2 col-4 e-custom-col" style="padding: 0px;"><button id="e-222-btn" class="btn btn-primary edit-up-btn2" type="button"><img class="e-middle-icon" src="e-iconPark-go-on.svg" width="22" height="22" />Continuation</button></div>
                    <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center col-md-2 col-4 e-custom-col" style="padding: 0px;"><button id="e-223-btn" class="btn btn-primary edit-up-btn2" type="button"><img class="e-middle-icon" src="e-iconPark-shuffle.svg" width="20" height="20" />Mashup</button></div>
                    <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-center justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col" style="padding: 0px;"></div>
                    <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col"></div>
                    <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col"></div>
                </div>
                <div id="e2-btn-div3" class="e2-btn-div"></div>
                <div id="e2-btn-div4" class="e2-btn-div">
                    <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center col-md-2 col-4" style="padding: 0px;"><button id="e-241-btn" class="btn btn-primary edit-up-btn2" type="button"><img class="e-middle-icon" src="e-iconPark-file-music.svg" />Midi</button></div>
                    <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center col-md-2 col-4" style="padding: 0px;"><button id="e-242-btn" class="btn btn-primary edit-up-btn2" type="button"><img class="e-middle-icon" src="e-md-queue_music.svg" />ScoreGen</button></div>
                    <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-center align-items-md-start align-items-lg-start align-items-xl-start justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col d-none d-md-flex" style="padding: 0px;"></div>
                    <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-center justify-content-xxl-center align-items-xxl-center col-md-2 col-4 e-custom-col d-none d-md-flex" style="padding: 0px;"></div>
                    <div class="col d-xxl-flex align-items-md-start align-items-lg-start align-items-xl-start justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col d-none d-md-flex"></div>
                    <div class="col d-xxl-flex align-items-md-start align-items-lg-start align-items-xl-start justify-content-xxl-center align-items-xxl-start col-md-2 col-4 e-custom-col d-none d-md-flex"></div>
                </div>
                <div id="e2-btn-div5" class="e2-btn-div"></div>
                <div id="e2-btn-div6" class="e2-btn-div"></div>
            </div>
        </div>
        <div class="row edit-item">
            <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center justify-content-xxl-start align-items-xxl-center col-md-2 col-6 e-custom-col" style="padding: 0px;"></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center col-md-3 col-6 e-custom-col" style="padding: 0px;"></div>
            <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-center col-md-3 edit-custom-row e-custom-col"></div>
            <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-center col-md-3 col-6 edit-custom-row e-custom-col"></div>
        </div>
        <div class="row mobile-item">
            <div class="col d-flex d-xxl-flex flex-column justify-content-start align-items-start col-md-4 col-12 e-custom-3col" style="padding: 0px;"></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-start col-4 col-md e-custom-3col" style="padding: 0px;"></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-start align-items-start justify-content-xxl-start align-items-xxl-start col-4 col-md e-custom-3col" style="padding: 0px;"></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-start align-items-start justify-content-xxl-start align-items-xxl-start col-4 col-md e-custom-3col" style="padding: 0px;"></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-end align-items-start justify-content-xxl-start align-items-xxl-start col-4 col-md e-custom-3col" style="padding: 0px;"></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-end justify-content-xxl-start align-items-xxl-start col-4 col-md e-custom-3col" style="padding: 0px;"></div>
        </div>
        <div class="row mobile-item special">
            <div class="col d-flex flex-column justify-content-center align-items-center col-md-2 col-4 e-custom-col" style="padding: 0px;"></div>
            <div class="col d-flex flex-column justify-content-around col-md-1 col-4 e-custom-col"></div>
            <div class="col d-flex d-xl-flex flex-row justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-md-9 col-12 e-custom-col"></div>
        </div>
        <div class="row edit-item special">
            <div class="col d-flex d-sm-flex d-xxl-flex flex-column justify-content-center align-items-center flex-sm-row justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center justify-content-xxl-center align-items-xxl-end col-4" style="padding: 0px;"></div>
            <div class="col d-flex d-sm-flex d-xxl-flex flex-row justify-content-center align-items-end justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-end justify-content-lg-center align-items-lg-end justify-content-xl-center align-items-xl-end justify-content-xxl-center align-items-xxl-end col-4" style="padding: 0px;"></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center justify-content-xxl-center align-items-xxl-end col-4" style="padding: 0px;"></div>
        </div>
        `);

        g_up_music_blob = up_music_blob;
        g_music_file_name = music_file_name;

        var musicNameText = $('#music-name');
        musicNameText.text = g_music_file_name;
       
        init();
    
    }



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

        g_full_btn_down = 0;
        g_intro_btn_down = 0;
        g_melody_btn_down = 0;
        g_chorus_btn_down = 0;
        g_outro_btn_down = 0;

        // 使用函数作为点击事件处理程序
        $(".edit-up-btn").click(handleEditUpBtn);
        $(".e2-btn-div").hide();

        // 使用函数作为点击事件处理程序
        $(".edit-up-btn2").click(handleEditUpBtn2);

        
        
        create_play(g_up_music_blob);
    }

    function handleAddMusicBtn(){
        if(0 === g_algo_run){
            return;
        }
        g_algo_run = 0;
        // 将当前按钮的背景颜色更改
        $(this).css("background-color", "red");
    }

    function handleConfirmBtn(){

        g_up_music_blob = g_algo_music_blob;

        create_play(g_up_music_blob,"origin")

    }

    function handleDownloadBtn(){
        // 创建一个<a>元素用于下载
        const a = document.createElement('a');
        a.href = URL.createObjectURL(g_algo_music_blob);

        // 提示用户选择下载目录
        a.download = g_music_file_name;

        // 将<a>元素添加到页面，然后触发点击事件
        document.body.appendChild(a);
        a.click();

        // 清理创建的元素和URL对象
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);

    }

    function handleSongifyBtn(){

        if ($('#211').length > 0) {
            console.log('刚刚添加的元素存在！');
        } else if($('#212').length > 0){
            console.log('刚刚添加的元素不存在！');
        }

        // 创建一个 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();

        // 指定要请求的文件的 URL
        var url = 'assets/audio/test.mp3';

        // 配置 XMLHttpRequest
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        // 当请求完成时的回调函数
        xhr.onload = function() {
            if (xhr.status === 200) {
                // 成功获取文件，将其转换为 Blob
                g_algo_music_blob = xhr.response;
                
                // 现在您可以在前端使用这个 Blob，例如播放音频等
                // 这里您可以添加您想要执行的代码，比如：
                // var audioElement = document.createElement('audio');
                // audioElement.src = URL.createObjectURL(blob);
                // document.body.appendChild(audioElement);
            } else {
                console.error('文件请求失败，状态码：' + xhr.status);
            }
        };

        g_algo_run = 1;
        
        create_play(g_algo_music_blob,"algo")


    }


    function handleEditMiddleBtn(){
        var index = $(this).attr("id");
        if("full-btn" === index){
            if(0 === g_full_btn_down){
                g_full_btn_down = 1;
                $(this).css("background-color", "rgba(255, 255, 255, 0.5)");
            }
            else{
                g_full_btn_down = 0;
                $(this).css("background-color", "rgba(255, 255, 255, 0.2)");
            }
        }
        else if("intro-btn" === index){
            if(0 === g_intro_btn_down){
                g_intro_btn_down = 1;
                $(this).css("background-color", "rgba(255, 255, 255, 0.5)");
            }
            else{
                g_intro_btn_down = 0;
                $(this).css("background-color", "rgba(255, 255, 255, 0.2)");
            }
        }
        else if("melody-btn" === index){
            if(0 === g_melody_btn_down){
                g_melody_btn_down = 1;
                $(this).css("background-color", "rgba(255, 255, 255, 0.5)");
            }
            else{
                g_melody_btn_down = 0;
                $(this).css("background-color", "rgba(255, 255, 255, 0.2)");
            }
        }
        else if("chorus-btn" === index){
            if(0 === g_chorus_btn_down){
                g_chorus_btn_down = 1;
                $(this).css("background-color", "rgba(255, 255, 255, 0.5)");
            }
            else{
                g_chorus_btn_down = 0;
                $(this).css("background-color", "rgba(255, 255, 255, 0.2)");
            }
        }
        else if("outro-btn" === index){
            if(0 === g_outro_btn_down){
                g_outro_btn_down = 1;
                $(this).css("background-color", "rgba(255, 255, 255, 0.5)");
            }
            else{
                g_outro_btn_down = 0;
                $(this).css("background-color", "rgba(255, 255, 255, 0.2)");
            }
        }


    }

   
    function handleEditUpBtn() {
        var index = $(this).attr("id");
        // 移除所有按钮的背景颜色
        $(".edit-up-btn").css("background-color", "rgba(255, 255, 255, 0.2)");
        // 将当前按钮的背景颜色更改
        $(this).css("background-color", "rgba(233, 157, 66, 0.5)");
        // 隐藏所有内容项
        $(".e2-btn-div").hide();
        // 显示与当前按钮索引对应的内容项
        if(index === "e-11-btn"){
            $("#e2-btn-div1").css("display", "flex");
        }
        else if(index === "e-12-btn"){
            $("#e2-btn-div2").css("display", "flex");
        }
        else if(index === "e-13-btn"){
            $("#e2-btn-div3").css("display", "flex");
        }
        else if(index === "e-14-btn"){
            $("#e2-btn-div4").css("display", "flex");
        }
        else if(index === "e-15-btn"){
            $("#e2-btn-div5").css("display", "flex");
        }
        else if(index === "e-16-btn"){
            $("#e2-btn-div6").css("display", "flex");
        }
        
    }

    function handleEditUpBtn2(){
        var index = $(this).attr("id");
        // 移除所有按钮的背景颜色
        $(".edit-up-btn2").css("background-color", "rgba(255, 255, 255, 0.2)");
        // 将当前按钮的背景颜色更改
        $(this).css("background-color", "rgba(233, 157, 66, 0.7)");
        if(index === "e-211-btn"){
            handleEditMiddleBtn211()
        }
        else if(index === "e-212-btn"){
            handleEditMiddleBtn212()
        }
        else if(index === "e-221-btn"){
            handleEditMiddleBtn221()
        }
        else if(index === "e-241-btn"){
            handleEditMiddleBtn241()
        }
        else if(index === "e-242-btn"){
            handleEditMiddleBtn242()
        }
        else if(index === "e-250-btn"){
            handleEditMiddleBtn250()
        }
        else if(index === "e-260-btn"){
            handleEditMiddleBtn260()
        }
    }

    function handleEditMiddleBtn250(){
        // 获取所有行（从下到上）
        $(".half-row").nextAll(".row").remove();
        $(".half-row").after(`
        <div class="row edit-mobile-half-item special">
            <div class="col d-flex flex-row justify-content-center align-items-end align-items-sm-end align-items-md-end align-items-lg-end align-items-xl-end align-items-xxl-end"></div>
        </div>
        <div class="row edit-mobile-half-item special">
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-start">
                <p id="p-coming" style="margin: 0px;">Coming Soon</p>
            </div>
        </div>
        <div class="row edit-item special">
            <div class="col d-flex d-sm-flex d-xxl-flex flex-column justify-content-center align-items-center flex-sm-row justify-content-xxl-center align-items-xxl-center" style="padding: 0px;"></div>
            <div class="col d-flex d-sm-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"></div>
        </div>
        <div class="row edit-item d-flex d-lg-none"></div>
        `);
        // 创建一个带有ID的看不见元素并添加到页面中
        var invisibleElement = $('<div id="250">这是一个看不见的元素</div>');
        invisibleElement.css('display', 'none'); // 设置元素为不可见
        $('body').append(invisibleElement); // 将元素添加到<body>中
    }

    function handleEditMiddleBtn260(){
        // 获取所有行（从下到上）
        $(".half-row").nextAll(".row").remove();
        $(".half-row").after(`
        <div class="row edit-mobile-half-item special">
            <div class="col d-flex flex-row justify-content-center align-items-center">
                <p style="margin: 0px;">Delete this song ?</p>
            </div>
        </div>
        <div class="row edit-item special">
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center col-lg-3 d-none d-lg-flex"></div>
            <div class="col d-flex flex-row justify-content-center align-items-center col-lg-3"><button id="keep-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-long-btn" type="button">Keep</button></div>
            <div class="col d-flex flex-row justify-content-center align-items-center col-lg-3"><button id="delete-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-long-btn" type="button">Delete</button></div>
            <div class="col d-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-lg-3 d-none d-lg-flex"></div>
        </div>
        <div class="row edit-item special">
            <div class="col d-flex d-sm-flex d-xxl-flex flex-column justify-content-center align-items-center flex-sm-row justify-content-xxl-center align-items-xxl-center" style="padding: 0px;"></div>
            <div class="col d-flex d-sm-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"></div>
        </div>
        `);
        // 创建一个带有ID的看不见元素并添加到页面中
        var invisibleElement = $('<div id="260">这是一个看不见的元素</div>');
        invisibleElement.css('display', 'none'); // 设置元素为不可见
        $('body').append(invisibleElement); // 将元素添加到<body>中
        $("#delete-btn").click(handleDeleteBtn);
    }

    function handleDeleteBtn(){
        g_up_music_blob.destroy();
    }

    function handleEditMiddleBtn242(){
        // 获取所有行（从下到上）
        $(".half-row").nextAll(".row").remove();
        $(".half-row").after(`
        <div id="row-collapse-below" class="row edit-mobile-half-item special">
            <div class="col d-flex flex-row justify-content-start align-items-center align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center">
                <p id="p-select-move-below" style="margin: 0px;">Select Instrument for Download</p>
            </div>
        </div>
        <div class="row edit-mobile-half-item special">
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center col-lg-3"><img class="music-2icon-display" src="e-piano.svg" /></div>
            <div class="col d-flex flex-row justify-content-center align-items-center col-lg-3"><img class="music-2icon-display" src="e-gittar.svg" /></div>
            <div class="col d-flex flex-row justify-content-center align-items-center col-lg-3"><img class="music-2icon-display" src="e-bass.svg" /></div>
            <div class="col d-flex justify-content-center align-items-center col-lg-3"><img class="music-2icon-display" src="e-drums.svg" /></div>
        </div>
        <div class="row edit-item special">
            <div class="col d-flex d-sm-flex d-xxl-flex flex-column justify-content-center align-items-center flex-sm-row justify-content-xxl-center align-items-xxl-center" style="padding: 0px;"><button id="plano-score-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-long-btn" type="button">Piano score</button></div>
            <div class="col d-flex d-sm-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"><button id="guitar-score-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-long-btn" type="button"> Guitar score</button></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"><button id="bass-score-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-long-btn" type="button"> Bass score</button></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"><button id="drum-score-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-long-btn" type="button"> Drum Score</button></div>
        </div>
        <div class="row edit-item special d-flex d-md-none"></div>
        `)

        // 创建一个带有ID的看不见元素并添加到页面中
        var invisibleElement = $('<div id="242">这是一个看不见的元素</div>');
        invisibleElement.css('display', 'none'); // 设置元素为不可见
        $('body').append(invisibleElement); // 将元素添加到<body>中

        $("#midi-move-below").click(handleSongifyBtn);
        $("#add-music-btn").click(handleAddMusicBtn);
        $("#confirm-btn").click(handleConfirmBtn);
        $("#download-btn").click(handleDownloadBtn);

        // 使用函数作为点击事件处理程序
        $(".e-finish-long-btn").click(handleFinishLongBtn);

    }

    function handleFinishLongBtn(){
        var index = $(this).attr("id");
        if("plano-score-btn" === index){
      
        }
        else if("guitar-score-btn" === index){
           
        }
        else if("bass-score-btn" === index){
        
        }
        else if("drum-score-btn" === index){
           
        }
        // 创建一个<a>元素用于下载
        const a = document.createElement('a');
        a.href = URL.createObjectURL(g_up_music_blob);

        // 提示用户选择下载目录
        a.download = g_music_file_name;

        // 将<a>元素添加到页面，然后触发点击事件
        document.body.appendChild(a);
        a.click();

        // 清理创建的元素和URL对象
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }


    function handleEditMiddleBtn241(){
        // 获取所有行（从下到上）
        $(".half-row").nextAll(".row").remove();
        $(".half-row").after(`
        <div id="row-collapse-below" class="row mobile-item special">
            <div class="col d-flex flex-column justify-content-center align-items-center col-lg-2 col-4 e-custom-col" style="padding: 0px;">
                <div class="d-flex flex-column justify-content-center align-items-start" style="width: 100%;height: 100%;"><button id="midi-move-below" class="btn btn-primary songify-button" type="button" style="border-style: none;">to MIDI</button></div>
            </div>
            <div class="col d-flex flex-column justify-content-around col-lg-2 col-xxl-1 col-4 e-custom-col">
                <div class="d-flex flex-column justify-content-center align-items-center" style="width: 100%;height: 100%;"><svg id="play2-stop" class="bi bi-play-fill play-stop-style" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                    </svg>
                    <p id="t2imer" class="music-time-display" style="margin: 0px;">1:08/3:42</p>
                </div>
            </div>
            <div class="col d-flex d-xl-flex flex-row justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-lg-8 col-xxl-9 col-12 e-custom-col">
                <div id="m2ic" class="mic-class"></div>
            </div>
        </div>
        <div class="row edit-mobile-half-item special">
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center align-items-md-center align-items-lg-center align-items-xl-center col-md-3" style="padding: 0px;"><button id="piano-btn" class="btn btn-primary e-last2-long-btn" type="button"><img class="e-instrument-icon" src="e-piano.svg" width="22" height="22" />Piano</button></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-md-3" style="padding: 0px;"><button id="guitar-btn" class="btn btn-primary e-last2-long-btn" type="button"><img class="e-instrument-icon" src="e-gittar.svg" width="16" height="16" />Guitar</button></div>
            <div class="col d-flex flex-row justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-md-3" style="padding: 0px;"><button id="bass-btn" class="btn btn-primary e-last2-long-btn" type="button"><img class="e-instrument-icon" src="e-bass.svg" />Bass</button></div>
            <div class="col d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-md-3" style="padding: 0px;"><button id="drum-btn" class="btn btn-primary e-last2-long-btn" type="button"><img class="e-instrument-icon" src="e-drums.svg" width="32" height="32" />Drum</button></div>
        </div>
        <div class="row edit-item special">
            <div class="col d-flex d-sm-flex d-xxl-flex flex-column justify-content-center align-items-center flex-sm-row" style="padding: 0px;"><button id="add-music-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-btn" type="button"><img class="mr-2 e-middle-icon" src="f-heart.png" width="22" height="22" style="width: calc(2vh);" /> Add My Music</button></div>
            <div class="col d-flex d-sm-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"><button id="confirm-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-middle-btn" type="button"> Confirm</button></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"><button id="download-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-btn" type="button"><img class="mr-2 e-middle-icon" src="d-download.png" width="22" height="22" style="width: calc(2vh);" /> Download</button></div>
        </div>
        `)

        // 创建一个带有ID的看不见元素并添加到页面中
        var invisibleElement = $('<div id="241">这是一个看不见的元素</div>');
        invisibleElement.css('display', 'none'); // 设置元素为不可见
        $('body').append(invisibleElement); // 将元素添加到<body>中

        $("#midi-move-below").click(handleSongifyBtn);
        $("#add-music-btn").click(handleAddMusicBtn);
        $("#confirm-btn").click(handleConfirmBtn);
        $("#download-btn").click(handleDownloadBtn);

        // 使用函数作为点击事件处理程序
        $(".e-last2-long-btn").click(handleELast2LongBtn);

    }

    function handleELast2LongBtn(){
        var index = $(this).attr("id");
        if("piano-btn" === index){
            if(0 === g_piano){
                g_piano = 1;
                $(this).css("background-color", "rgba(255, 255, 255, 0.5)");
            }
            else{
                g_piano = 0;
                $(this).css("background-color", "rgba(255, 255, 255, 0.2)");
            }
        }
        else if("guitar-btn" === index){
            if(0 === g_guitar){
                g_guitar = 1;
                $(this).css("background-color", "rgba(255, 255, 255, 0.5)");
            }
            else{
                g_guitar = 0;
                $(this).css("background-color", "rgba(255, 255, 255, 0.2)");
            }
        }
        else if("bass-btn" === index){
            if(0 === g_bass){
                g_bass = 1;
                $(this).css("background-color", "rgba(255, 255, 255, 0.5)");
            }
            else{
                g_bass = 0;
                $(this).css("background-color", "rgba(255, 255, 255, 0.2)");
            }
        }
        else if("drum-btn" === index){
            if(0 === g_drum){
                g_drum = 1;
                $(this).css("background-color", "rgba(255, 255, 255, 0.5)");
            }
            else{
                g_drum = 0;
                $(this).css("background-color", "rgba(255, 255, 255, 0.2)");
            }
        }
    }


    function handleEditMiddleBtn221(){
        // 获取所有行（从下到上）
        $(".half-row").nextAll(".row").remove();
        $(".half-row").after(`
            <div class="row edit-item d-none d-lg-flex"></div>
            <div id="row-collapse-below" class="row mobile-item special">
                <div class="col d-flex flex-column justify-content-center align-items-center col-lg-2 col-4 e-custom-col" style="padding: 0px;">
                    <div class="d-flex flex-column justify-content-center align-items-start" style="width: 100%;height: 100%;"><button id="songify-move-below" class="btn btn-primary songify-button" type="button" style="border-style: none;">songify</button></div>
                </div>
                <div class="col d-flex flex-column justify-content-around col-lg-2 col-xxl-1 col-4 e-custom-col">
                    <div class="d-flex flex-column justify-content-center align-items-center" style="width: 100%;height: 100%;"><svg id="play2-stop" class="bi bi-play-fill play-stop-style" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                        </svg>
                        <p id="t2imer" class="music-time-display" style="margin: 0px;">1:08/3:42</p>
                    </div>
                </div>
                <div class="col d-flex d-xl-flex flex-row justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-lg-8 col-xxl-9 col-12 e-custom-col">
                    <div id="m2ic" class="mic-class"></div>
                </div>
            </div>
            <div class="row edit-item d-none d-md-flex">
                <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-end align-items-sm-end align-items-md-center align-items-lg-center align-items-xl-center justify-content-xxl-start align-items-xxl-center col-md-3 col-12 e-custom-col"></div>
                <div class="col d-flex d-xxl-flex flex-column justify-content-center justify-content-xxl-center align-items-xxl-center col-md-3 col-6 e-custom-col"></div>
                <div class="col d-flex flex-row justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-md-3 col-6 e-custom-col"></div>
                <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-center col-md-3 col-6 edit-custom-row e-custom-col"></div>
            </div>
            <div class="row edit-item special">
                <div class="col d-flex d-sm-flex d-xxl-flex flex-row justify-content-center align-items-center flex-sm-row align-items-xxl-center" style="padding: 0px;"><button id="add-music-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-btn" type="button"><img class="mr-2 e-middle-icon" src="f-heart.png" style="height: calc(2vh);width: auto;" width="22" height="22" /> Add My Music</button></div>
                <div class="col d-flex d-sm-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"><button id="confirm-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-middle-btn" type="button"> Confirm</button></div>
                <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center" style="padding: 0px;"><button id="download-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-btn" type="button"><img class="mr-2 e-middle-icon" src="d-download.png" style="height: calc(2vh);width: auto;" width="22" height="22" /> Download</button></div>
            </div>
        `);

        // 创建一个带有ID的看不见元素并添加到页面中
        var invisibleElement = $('<div id="221">这是一个看不见的元素</div>');
        invisibleElement.css('display', 'none'); // 设置元素为不可见
        $('body').append(invisibleElement); // 将元素添加到<body>中

        $("#songify-move-below").click(handleSongifyBtn);
        $("#add-music-btn").click(handleAddMusicBtn);
        $("#confirm-btn").click(handleConfirmBtn);
        $("#download-btn").click(handleDownloadBtn);

    
    }


    function handleEditMiddleBtn212(){
        // 获取所有行（从下到上）
        $(".half-row").nextAll(".row").remove();
        $(".half-row").after(`
        <div id="row-collapse-below" class="row edit-mobile-half-item special">
            <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-end align-items-sm-end align-items-md-end align-items-lg-center align-items-xl-center align-items-xxl-center col-lg-2 col-12 e12-custom-col-little">
                <p id="move-below" class="e-input-key-p">Select the audio you need</p>
            </div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-start justify-content-lg-center align-items-lg-start justify-content-xl-center align-items-xl-start justify-content-xxl-center align-items-xxl-start col-lg-2 col-6 e12-custom-col-big-new" style="padding: 0px;"><button id="instru-btn" class="btn btn-primary edit12-up-btn" type="button">Instrumental</button></div>
            <div class="col d-flex flex-row justify-content-center align-items-center justify-content-xxl-start align-items-xxl-center col-lg-2 col-6 e12-custom-col-big-new" style="padding: 0px;"><button id="vacol-btn" class="btn btn-primary edit12-up-btn" type="button">Vacol</button></div>
            <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-center col-lg-6 col-6 edit-custom-row e12-custom-col-big"></div>
        </div>
        <div class="row mobile-item special">
            <div class="col d-flex flex-column justify-content-center align-items-center col-lg-2 col-4 e-custom-col" style="padding: 0px;">
                <div class="d-flex flex-column justify-content-center align-items-start" style="width: 100%;height: 100%;"><button id="songify-move-below" class="btn btn-primary songify-button" type="button" style="border-style: none;">songify</button></div>
            </div>
            <div class="col d-flex flex-column justify-content-around col-lg-2 col-xxl-1 col-4 e-custom-col">
                <div class="d-flex flex-column justify-content-center align-items-center" style="width: 100%;height: 100%;"><svg id="play2-stop" class="bi bi-play-fill play-stop-style" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                    </svg>
                    <p id="t2imer" class="music-time-display" style="margin: 0px;">1:08/3:42</p>
                </div>
            </div>
            <div class="col d-flex d-xl-flex flex-row justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-lg-8 col-xxl-8 col-12 e-custom-col">
                <div id="m2ic" class="mic-class"></div>
            </div>
        </div>
        <div class="row edit-item special">
            <div class="col d-flex d-sm-flex d-xxl-flex flex-column justify-content-center align-items-center flex-sm-row align-items-lg-end align-items-xl-end align-items-xxl-end" style="padding: 0px;"><button id="add-music-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-btn" type="button"><img class="mr-2 e-middle-icon" src="f-heart.png" style="height: calc(2vh);width: auto;" width="22" height="22" /> Add My Music</button></div>
            <div class="col d-flex d-sm-flex d-xxl-flex flex-row justify-content-center align-items-center align-items-lg-end align-items-xl-end align-items-xxl-end" style="padding: 0px;"><button id="confirm-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-middle-btn" type="button" style="background: #e99d42!important;"> Confirm</button></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center align-items-lg-end align-items-xl-end align-items-xxl-end" style="padding: 0px;"><button id="release-btn" class="btn btn-primary d-flex flex-row justify-content-center align-items-center align-content-center e-finish-btn" type="button"><img class="mr-2 e-middle-icon" src="d-download.png" style="height: calc(2vh);width: auto;" width="22" height="22" /> Download</button></div>
        </div>
        `);

        // 创建一个带有ID的看不见元素并添加到页面中
        var invisibleElement = $('<div id="212">这是一个看不见的元素</div>');
        invisibleElement.css('display', 'none'); // 设置元素为不可见
        $('body').append(invisibleElement); // 将元素添加到<body>中

        $("#songify-move-below").click(handleSongifyBtn);
        $("#add-music-btn").click(handleAddMusicBtn);
        $("#confirm-btn").click(handleConfirmBtn);
        $("#download-btn").click(handleDownloadBtn);
        // 使用函数作为点击事件处理程序
        $(".edit12-up-btn").click(handleEdit12UpBtn);
    
    }

    function handleEdit12UpBtn() {
        var index = $(this).attr("id");
        // 移除所有按钮的背景颜色
        $(".edit12-up-btn").css("background-color", "rgba(255, 255, 255, 0.2)");
        // 显示与当前按钮索引对应的内容项
        if(index === "instru-btn"){
            $("#instru-btn").css("background-color", "rgba(255, 255, 255, 0.5)");
            g_instru = 1;
            g_vacol = 0;
        }
        else if(index === "vacol-btn"){
            $("#vacol-btn").css("background-color", "rgba(255, 255, 255, 0.5)");
            g_instru = 0;
            g_vacol = 1;
        }     
    }

    function handleEditMiddleBtn211(){
         // 获取所有行（从下到上）
         $(".half-row").nextAll(".row").remove();

         $(".half-row").after(`
         <div id="row-collapse-below" class="row edit-item">
         <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center justify-content-xxl-start align-items-xxl-center col-lg-3 col-6 e-custom-col" style="padding: 0px;">
             <p class="e-input-key-p">Adjust the Selected Duration</p>
         </div>
         <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-center col-lg-3 col-6 e-custom-col" style="padding: 0px;"><input id="move-below" class="e-duration-input" type="text" placeholder="60" pattern="\d*" />
             <p class="e-input-key-p" style="/*font-size: calc(2vh);*//*margin: 0px;*/margin-left: 1vh;">seconds</p>
         </div>
         <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-center col-lg-3 col-6 edit-custom-row e-custom-col"></div>
         <div class="col d-xxl-flex justify-content-xxl-center align-items-xxl-center col-lg-3 col-6 edit-custom-row e-custom-col"></div>
        </div>
        <div class="row mobile-item">
            <div class="col d-flex d-xxl-flex flex-column justify-content-start align-items-start col-lg-4 col-12 e-custom-3col" style="padding: 0px;">
                <p class="e-input-key-p" style="/*margin: 0px;*//*font-size: calc(2vh);*/">Select the parts to keep (Multiple selection allowed)</p>
            </div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-start col-4 col-lg e-custom-3col" style="padding: 0px;"><button class="btn btn-primary edit-middle-btn" type="button">Full</button></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-start align-items-start col-4 col-lg e-custom-3col" style="padding: 0px;"><button class="btn btn-primary edit-middle-btn" type="button">Intro</button></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-start align-items-start col-4 col-lg e-custom-3col" style="padding: 0px;"><button class="btn btn-primary edit-middle-btn" type="button">Main Melody</button></div>
            <div class="col d-flex d-xxl-flex flex-column justify-content-start align-items-start col-4 col-lg e-custom-3col" style="padding: 0px;"><button class="btn btn-primary edit-middle-btn" type="button">Main Chorus</button></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-start align-items-start col-4 col-lg e-custom-3col" style="padding: 0px;"><button class="btn btn-primary edit-middle-btn" type="button">Outro</button></div>
        </div>
        <div class="row mobile-item special">
            <div class="col d-flex flex-column justify-content-center align-items-center col-lg-2 col-4 e-custom-col" style="padding: 0px;">
                <div class="d-flex flex-column justify-content-center align-items-start" style="width: 100%;height: 100%;"><button class="btn btn-primary songify-button" type="button" style="border-style: none;">songify</button></div>
            </div>
            <div class="col d-flex flex-column justify-content-around col-lg-1 col-4 e-custom-col">
                <div class="d-flex flex-column justify-content-center align-items-center" style="width: 100%;height: 100%;"><svg id="play-stop" class="bi bi-play-fill play-stop-style" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                    </svg>
                    <p id="timer" class="music-time-display" style="margin: 0px;">1:08/3:42</p>
                </div>
            </div>
            <div class="col d-flex d-xl-flex flex-row justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center col-lg-9 col-12 e-custom-col">
                <div id="mic" class="mic-class"></div>
            </div>
        </div>
        <div class="row edit-item special">
            <div class="col d-flex d-sm-flex d-xxl-flex flex-column justify-content-center align-items-center flex-sm-row justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-end justify-content-xl-center align-items-xl-end justify-content-xxl-center align-items-xxl-end col-4" style="padding: 0px;"><button class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center e-finish-btn" type="button" disabled><img class="mr-2 e-middle-icon" src="f-heart.png" width="22" height="22" /> Add My Music</button></div>
            <div class="col d-flex d-sm-flex d-xxl-flex flex-row justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-end justify-content-xl-center align-items-xl-end justify-content-xxl-center align-items-xxl-end col-4" style="padding: 0px;"><button class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center e-finish-middle-btn" type="button" disabled> Confirm</button></div>
            <div class="col d-flex d-xxl-flex flex-row justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-end justify-content-xl-center align-items-xl-end justify-content-xxl-center align-items-xxl-end col-4" style="padding: 0px;"><button class="btn btn-primary disabled d-flex flex-row justify-content-center align-items-center align-content-center e-finish-btn" type="button" disabled><img class="mr-2 e-middle-icon" src="d-download.png" width="22" height="22" /> Release</button></div>
        </div>
        `);

        // 创建一个带有ID的看不见元素并添加到页面中
        var invisibleElement = $('<div id="211">这是一个看不见的元素</div>');
        invisibleElement.css('display', 'none'); // 设置元素为不可见
        $('body').append(invisibleElement); // 将元素添加到<body>中

        // 使用函数作为点击事件处理程序
        $(".edit-middle-btn").click(handleEditMiddleBtn);

        $("#songify-move-below").click(handleSongifyBtn);

        $("#add-music-btn").click(handleAddMusicBtn);
        $("#confirm-btn").click(handleConfirmBtn);
        $("#download-btn").click(handleDownloadBtn);

    }







    function create_play(blob = null,type) {
        try
        { 
            if("origin" === type ){
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

                g_waveplaysurfer.destroy();

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
                    updatePlayTimeDisplay(g_currentPlayPosition,type)
                });

                const handlePlayformInteraction = createHandlePlayformInteraction(waveplaysurfer,"origin");
                waveplaysurfer.on('interaction', handlePlayformInteraction);

                const handlePlayformRegioncreated = createHandlePlayformRegioncreated(wsRegions,"origin");
                wsRegions.on('region-created', handlePlayformRegioncreated);

                const handlePlayformRegionin = createHandlePlayformRegionin(wsRegions,"origin");
                wsRegions.on('region-in', handlePlayformRegionin);

                const handlePlayformRegionout = createHandlePlayformRegionout(waveplaysurfer,"origin");
                wsRegions.on('region-out', handlePlayformRegionout);

                const handlePlayformRegionclicked = createHandlePlayformRegionclicked(wsRegions,"origin");
                wsRegions.on('region-clicked', handlePlayformRegionclicked);

                const handlePlayformAudioprocess = createHandlePlayformAudioprocess(waveplaysurfer,"origin");
                waveplaysurfer.on('audioprocess', handlePlayformAudioprocess);

                const handlePlayformSeek = createHandlePlayformSeek(waveplaysurfer,"origin");
                waveplaysurfer.on('seeking', handlePlayformSeek);

                const handlePlayformClick = createHandlePlayformClick(waveplaysurfer,"origin");
                waveplaysurfer.on('click', handlePlayformClick);
            }
            else if("algo" === type ){
                var recordedUrl
                if (blob === null || blob === undefined) {
                    recordedUrl = 'assets/audio/test.mp3'
                }
                else{
                    recordedUrl = URL.createObjectURL(blob)
                }
                //   const container = document.querySelector('#recordings')
                const container = document.querySelector('#m2ic')

                g_waveplaysurfer2.destroy();

                const waveplaysurfer = WaveSurfer.create({
                    container,
                    waveColor: 'rgb(200, 100, 0)',
                    progressColor: 'rgb(100, 50, 0)',
                    url: recordedUrl,
                    height: g_containerHeight
                })

                g_waveplaysurfer2 = waveplaysurfer

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
                g_wsRegions2 = wsRegions
                

                // waveplaysurfer.on('interaction', () => waveplaysurfer.playPause())
                waveplaysurfer.on('ready', function () {
                    updatePlayTimeDisplay(g_currentPlayPosition2,type)
                });

                const handlePlayformInteraction = createHandlePlayformInteraction(waveplaysurfer,"algo");
                waveplaysurfer.on('interaction', handlePlayformInteraction);

                const handlePlayformRegioncreated = createHandlePlayformRegioncreated(wsRegions,"algo");
                wsRegions.on('region-created', handlePlayformRegioncreated);

                const handlePlayformRegionin = createHandlePlayformRegionin(wsRegions,"algo");
                wsRegions.on('region-in', handlePlayformRegionin);

                const handlePlayformRegionout = createHandlePlayformRegionout(waveplaysurfer,"algo");
                wsRegions.on('region-out', handlePlayformRegionout);

                const handlePlayformRegionclicked = createHandlePlayformRegionclicked(wsRegions,"algo");
                wsRegions.on('region-clicked', handlePlayformRegionclicked);

                const handlePlayformAudioprocess = createHandlePlayformAudioprocess(waveplaysurfer,"algo");
                waveplaysurfer.on('audioprocess', handlePlayformAudioprocess);

                const handlePlayformSeek = createHandlePlayformSeek(waveplaysurfer,"algo");
                waveplaysurfer.on('seeking', handlePlayformSeek);

                const handlePlayformClick = createHandlePlayformClick(waveplaysurfer,"algo");
                waveplaysurfer.on('click', handlePlayformClick);
            }
        } catch (err) {
            console.error("Error create_play:", err);
            alert("Error create_play:" + err.toString());
        }
    }

    function createHandlePlayformInteraction(waveplaysurfer,type) {
        return function () {
            // 在这里你可以访问传递过来的 waveplaysurfer
            console.log('createHandlePlayformInteraction');
            waveplaysurfer.playPause();
        };
    }

    function createHandlePlayformRegioncreated(wsRegions,type) {
        return function (region) {
            // 在这里你可以访问传递过来的 waveplaysurfer
            console.log('createHandlePlayformRegioncreated', region.start, region.end);
            var regions = wsRegions.getRegions();
            if (regions.length > 1) {
                regions[0].remove();
            }
        };
    }



    function createHandlePlayformRegionin(wsRegions,type) {
        return function (region) {
            console.log('createHandlePlayformRegionin');
            if("origin" == type){
                g_activeRegion = region
            }
            else if("algo" == type){
                g_activeRegion2 = region
            }
            
        };
    }

    function createHandlePlayformRegionout(waveplaysurfer,type) {
        return function (region) {
            console.log('createHandlePlayformRegionout', g_currentSeekPosition, region.start);
            if("origin" == type){
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
            }
            else if("algo" == type){
                if ((g_currentSeekPosition2 < region.start) || (g_currentSeekPosition2 > region.end)) {
                    // 获取音频总长度
                    const duration = waveplaysurfer.getDuration();
                    // 计算 currentPlayPosition 相对于音频总长度的比例
                    const seekPosition = g_currentSeekPosition2 / duration;
                    waveplaysurfer.seekTo(seekPosition);
                    waveplaysurfer.play();
                    return;
                }
                if (g_activeRegion2 === region) {
                    console.log('g_activeRegion === region');
                    if (true) {
                        region.play()
                    } else {
                        g_activeRegion = null
                    }
                }
            }
            
        };
    }

    function createHandlePlayformRegionclicked(wsRegions,type) {
        return function (region, e) {
            if("origin" == type){
                console.log('createHandlePlayformRegionclicked');
                e.stopPropagation() // prevent triggering a click on the waveform
                g_activeRegion = region
                region.play()
                region.setOptions({ color: g_randomColor() })
            }
            else if("algo" == type){
                e.stopPropagation() // prevent triggering a click on the waveform
                g_activeRegion2 = region
                region.play()
                region.setOptions({ color: g_randomColor() })
            }
        };
    }


    function createHandlePlayformAudioprocess(waveplaysurfer,type) {
        return function (currentTime) {
            // console.log("createHandlePlayformAudioprocess",currentTime);
            if("origin" == type){
                g_currentPlayPosition = currentTime;

                updatePlayTimeDisplay(g_currentPlayPosition,type);

                if ($("#mobile-play-stop").length) {
                    var btn = $("#mobile-play-stop");
                    if (g_waveplaysurfer.isPlaying()) {
                        btn.html(g_play_icon);
                    }
                    else{
                        btn.html(g_pause_icon);
                    }
                    btn.attr("id", "new-play-stop");
                }
                if ($("#play-stop").length) {
                    var btn = $("#play-stop");
                    if (g_waveplaysurfer.isPlaying()) {
                        btn.html(g_play_icon);
                    }
                    else{
                        btn.html(g_pause_icon);
                    }
                    btn.attr("id", "play-stop");
                }
            }
            else if("algo" == type){
                g_currentPlayPosition2 = currentTime;

                updatePlayTimeDisplay(g_currentPlayPosition2,type);

                var btnPathElement = document.querySelector("#play2-stop path");
                var elements = [];
                if (btnPathElement) {
                    elements.push(btnPathElement);
                }
               
                elements.forEach((element) => {
                    // 对每个匹配的元素执行操作
                    if (g_waveplaysurfer2.isPlaying()) {
                        element.setAttribute('d', 'M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z');
                        return
                    }
                    element.setAttribute('d', 'm11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z'); // 更改回"暂停"图标为播放
                });

            
            }
           

        }
    }

    function createHandlePlayformSeek(waveplaysurfer,type) {
        return function (currentTime) {
            console.log('currentTime', currentTime)
            g_currentSeekPosition = currentTime;
        }
    }

    function createHandlePlayformClick(waveplaysurfer,type) {
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
    function updatePlayTimeDisplay(currentTime,type) {
        if("origin" == type){
            const totalTime = g_waveplaysurfer.getDuration();
            var elements = document.querySelectorAll('[id$="timer"]');
            elements.forEach((element) => {
                // 对每个匹配的元素执行操作
                element.textContent = `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
            });
        }
        else if("algo" == type){
            const totalTime = g_waveplaysurfer2.getDuration();
            var elements = document.querySelectorAll('[id$="t2imer"]');
            elements.forEach((element) => {
                // 对每个匹配的元素执行操作
                element.textContent = `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
            });
        }
    }


})();
















































