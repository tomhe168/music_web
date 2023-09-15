
if (window.location.href.indexOf('tools.html') !== -1){
    window.onload = function() {
        // 页面加载完成后要执行的代码
        init()
    };

    var g_fileNameWithoutExtension;

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

                // 创建一个FormData对象来包含文件数据
                const formData = new FormData();
                formData.append('file', selectedFile);

                    // 获取文件名
                const fileNameWithExtension = selectedFile.name;

                // 获取文件名（不包含后缀名）
                g_fileNameWithoutExtension = fileNameWithExtension.split('.').slice(0, -1).join('.');

                // 重定向到上传进度页面，并将FormData数据传递给新页面
                window.location.href = 'music-upload.html';
                sessionStorage.setItem('formData', JSON.stringify(Array.from(formData.entries())));
            } else {
                alert('please select one file！');
            }
        });
    }

    function handleUpload(){
        const fileInput = document.getElementById('fileInput').click(); // 触发文件选择对话框

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