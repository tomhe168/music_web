// 使用函数作为点击事件处理程序
$("#compose-btn").click(handleComposeBtn);
$("#edit-btn").click(handleEditBtn);
$("#release-btn").click(handleReleaseBtn);

function handleComposeBtn(){
    leavePage();
    enterToolsPage();//是否带歌曲
}

function handleEditBtn(){
    leavePage();
    enterEditPage();//是否带歌曲
}

function handleReleaseBtn(){
    leavePage();
    // enterEditPage();//是否带歌曲
}

function enterEditPage(){
    var firstRow = $(".first-row");
    firstRow.removeClass().addClass("edit-item special");
    firstRow.after(`
    <div class="row item">
    <div class="col d-flex d-xl-flex justify-content-center align-items-center">
        <h1 class="d-flex flex-column justify-content-center align-items-center e-heading"><strong>Choose a method to reliaze your music ideas</strong></h1>
    </div>
    </div>
    <div class="row item special">
        <div class="col d-flex flex-column justify-content-center align-items-center justify-content-sm-center justify-content-md-center justify-content-lg-start justify-content-xl-start justify-content-xxl-start"><a id="t-record" class="d-flex flex-column justify-content-center align-items-center justify-content-sm-center justify-content-md-center justify-content-lg-start justify-content-xl-start justify-content-xxl-center t-enter-link" href="/record.html"></a>
            <p class="d-xxl-flex justify-content-xxl-center t-section-para" style="margin: 0px;">Hum</p>
        </div>
        <div class="col d-flex flex-column justify-content-center align-items-center justify-content-sm-center justify-content-md-center justify-content-lg-start justify-content-xl-start justify-content-xxl-start" style="padding: 0px;"><a id="t-describe" class="d-flex flex-column justify-content-center align-items-center justify-content-sm-center justify-content-md-center justify-content-lg-start justify-content-xl-start justify-content-xxl-start t-enter-link" href="/describe.html" style="background: url('t61x.png') top / contain no-repeat;"></a>
            <p class="t-section-para" style="margin: 0px;">Describe</p>
        </div>
        <div class="col d-flex flex-column justify-content-center justify-content-sm-center align-items-sm-center justify-content-md-center justify-content-lg-start justify-content-xl-start justify-content-xxl-start">
            <form id="t-upload" class="d-flex flex-column justify-content-center align-items-center justify-content-sm-center justify-content-md-center justify-content-lg-start justify-content-xl-start justify-content-xxl-start t-enter-link" method="post" enctype="multipart/form-data" action="/upload" style="background: url('t12.png') top / contain no-repeat;"><input id="fileInput" class="form-control form-control-file" type="file" name="file" style="display: none;" accept=".mp3,.wav" /></form>
            <p class="t-section-para" style="margin: 0px;">Upload</p>
        </div>
    </div>
    `);
    $('body').append(`
    <div id="page-notice" class="container">
        <div class="row">
            <div class="col">
                <p class="d-flex flex-row justify-content-center reg-word-size" style="margin: 0px;">By continuing, you agree to NoteScience&#39;s</p>
            </div>
        </div>
        <div class="row">
            <div class="col d-flex flex-row justify-content-center align-items-center align-content-center"><a class="priacy-link-size" href="/terms-of-use.html" style="color: var(--bs-white);font-weight: bold;">Terms of Use </a>
                <p class="d-flex d-xxl-flex flex-column reg-word-size" style="margin: 0px;">and </p><a class="priacy-link-size" href="/priacy.html" style="color: var(--bs-white);font-weight: bold;">Priacy Policy</a>
            </div>
        </div>
    </div>
    `);
    
   
    init();

}




if (window.location.href.indexOf('tools.html') !== -1){
    window.onload = function() {
        // 页面加载完成后要执行的代码
        init()
    };

    var g_fileNameWithoutExtension;
    var g_music_file_name;
    var g_up_music_blob;

    function init()
    {
        var elements = document.querySelectorAll('[id$="t-upload"]');
        elements.forEach((element) => {
            // 对每个匹配的元素执行操作
            element.onclick=handleUpload
        });   

        // 添加change事件监听器到fileInput
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', function () {
            // 检查是否选择了文件
            if (fileInput.files && fileInput.files.length > 0) {
                // 获取用户选择的文件
                const selectedFile = fileInput.files[0];

                g_up_music_blob = new Blob([selectedFile], { type: selectedFile.type });

                // 创建一个FormData对象来包含文件数据
                const formData = new FormData();
                formData.append('file', selectedFile);
                    // 获取文件名
                const fileNameWithExtension = selectedFile.name;

                // 获取文件名（不包含后缀名）
                g_fileNameWithoutExtension = fileNameWithExtension.split('.').slice(0, -1).join('.');
                
                g_music_file_name = g_fileNameWithoutExtension
                //切换界面
                leavePage();
                enterUploadPage();

                var progressText = $('#u-progressText');
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', function(event) {
                    var percent = (event.loaded / event.total) * 100;
                    // 更新进度文本
                    progressText.text(percent + '%');
                });
        
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            // 上传成功，执行切换到播放界面和加载音乐的操作
                            leavePage();
                            enterEditPage();
                        } else {
                            // 上传失败，执行相应的错误处理操作
                        }
                    }
                };
        
                xhr.open('POST', '/upload-music-file', true);
                xhr.send(formData);

                // 重定向到上传进度页面，并将FormData数据传递给新页面
                // window.location.href = 'music-upload.html';
                // sessionStorage.setItem('formData', JSON.stringify(Array.from(formData.entries())));
            } else {
                alert('please select one file!');
            }
        });

        // 使用函数作为点击事件处理程序
        $(".edit-up-btn").click(handleUpBtn);

        $(".t-record").click(handleTRecordBtn);

        $(".t-describe").click(handleTDescribeBtn);
    }

    function handleTRecordBtn(){
        leavePage();
        enterRecordPage();
    }

    function handleTDescribeBtn(){
        leavePage();
    }


    function handleUpload(){
        const fileInput = document.getElementById('fileInput').click(); // 触发文件选择对话框
    }

    function leavePage(){
        // 获取所有元素
        var allElements = $('*');

        // 遍历所有元素并禁用点击事件
        allElements.each(function() {
            $(this).off('click'); // 移除所有点击事件处理程序
        });

        // 找到ID为first-row的元素
        var firstRow = $('#first-row');
        // 删除其后的所有兄弟元素
        firstRow.nextAll().remove();
        // $('#first-row').remove();
        $('#page-notice').remove();
        
    }

   
    function enterUploadPage(){
        
    
    }

    

    function handleUpBtn() {
        var index = $(this).attr("id");
        // 移除所有按钮的背景颜色
        $(".edit-up-btn").css("background-color", "rgba(255, 255, 255, 0.2)");
        // 将当前按钮的背景颜色更改
        $(this).css("background-color", "rgba(255, 255, 255, 0.5)");
       
        // 显示与当前按钮索引对应的内容项
        if(index === "compose-btn"){
           
        }
        else if(index === "edit-btn"){
            
        }
        else if(index === "release-btn"){
            
        }
        
        
    }

}



if (window.location.href.indexOf('music-upload.html') !== -1){

    window.onload = function() {
        // 页面加载完成后要执行的代码
        simulateUpload()
    };

    function simulateUpload() {
        const progressText = document.getElementById('u-progressText');

        // 模拟上传进度
        const totalSize = 1024 * 1024 * 5; // 5MB 文件
        let uploadedSize = 0;

        const uploadInterval = setInterval(() => {
            uploadedSize += 512 * 1024; // 每秒上传 500kb 数据

            // 计算上传进度百分比
            const progress = (uploadedSize / totalSize) * 100;

            // 更新上传进度百分比文本
            progressText.textContent = progress + '%';

            // 如果上传完成，清除定时器
            if (uploadedSize >= totalSize) {
                clearInterval(uploadInterval);
            }
        }, 1000);
    }

}