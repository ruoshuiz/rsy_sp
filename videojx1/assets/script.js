// 调试信息显示
        let debugTimer;
        function showDebugInfo(message) {
            const debugEl = document.getElementById('debugInfo');
            debugEl.textContent = message;
            clearTimeout(debugTimer);
            debugTimer = setTimeout(() => debugEl.textContent = '', 5000);
        }
        
        // 实时时钟
        function updateTime() {
            const now = new Date();
            document.getElementById('currentTime').textContent = 
        `${now.getHours().toString().padStart(2, '0')}:` +
        `${now.getMinutes().toString().padStart(2, '0')}:` +
        `${now.getSeconds().toString().padStart(2, '0')}`;
        }
        setInterval(updateTime, 1000);
        updateTime();
        
        // 获取天气
        async function getWeather() {
            try {
        const response = await fetch('https://api.kxzjoker.cn/api/Weather');
        const data = await response.json();
        
        if (data.code !== 200) throw new Error('天气获取失败');
        
        document.getElementById('weatherWidget').innerHTML = `
            <i class="fas fa-cloud-sun" style="background: linear-gradient(45deg, #ff9a00, #89CFF0);-webkit-background-clip: text;background-clip: text;color: transparent;"></i>
            ${data.data.tianqi.temperature}°C
        `;
        
        showDebugInfo(`👏欢迎来自${data.data.ipdata.info.split('-')[0]}的用户`);
        
            } catch (error) {
        document.getElementById('weatherWidget').innerHTML = `
            <i class="fas fa-cloud-sun" style="background: linear-gradient(45deg, #ff9a00, #89CFF0);-webkit-background-clip: text;background-clip: text;color: transparent;"></i>
            未知天气
        `;
        showDebugInfo('欢迎访问本服务');
            }
        }
        getWeather();
        
        // URL提取
        function extractURL(text) {
            try {
        const urlRegex = /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))/g;
        const matches = text.match(urlRegex);
        return matches ? matches[0] : null;
            } catch (e) {
        console.error('URL提取错误:', e);
        return null;
            }
        }
        
        // 解析内容
        let isParsing = false;
        async function parseContent() {
            if (isParsing) return;
            isParsing = true;
        
            const parseBtn = document.querySelector('.parse-btn');
            parseBtn.disabled = true;
            parseBtn.style.opacity = '0.6';
        
            showDebugInfo('开始解析流程...');
        
            try {
        const input = document.getElementById('urlInput');
        if (!input) throw new Error('找不到输入框元素');
        
        const url = extractURL(input.value);
        showDebugInfo(`提取到URL: ${url || '无'}`);
        
        if (!url) {
            showAlert('🚨 请输入有效的链接哦～ (´•̥ ̯ •̥`)');
            return;
        }
        
        toggleLoading(true);
        
        showDebugInfo(`正在解析中: ${url}`);
        const apiUrl = `https://api.kxzjoker.cn/api/jiexi_video?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        showDebugInfo(`收到响应状态: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        showDebugInfo(`API响应数据: ${JSON.stringify(data).slice(0, 100)}...`);
        
        if (!data || (data.success !== 200 && data.success !== true)) {
            throw new Error('API返回数据格式异常');
        }
        
        renderContent(data.data);
        showDebugInfo('内容渲染完成');
            } catch (error) {
        console.error('解析流程错误:', error);
        showDebugInfo(`错误: ${error.message}`);
        showAlert(`❌ 发生错误: ${error.message}`);
            } finally {
        toggleLoading(false);
        parseBtn.disabled = false;
        parseBtn.style.opacity = '1';
        isParsing = false;
            }
        }
        
        // 渲染内容
        function renderContent(data) {
            const contentBox = document.getElementById('contentBox');
            if (!contentBox) {
        throw new Error('找不到内容容器');
            }
        
            contentBox.innerHTML = '';
            
            try {
        if (data.images) {
            const galleryHTML = data.images.map((img, index) => `
                <div class="gallery-item" onclick="showFullImage('${img}')">
                    <img src="${img}" 
                         alt="图集 ${index + 1}"
                         loading="lazy"
                         style="border-radius: 10px; 
                                width: 100%; 
                                aspect-ratio: 1/1; 
                                object-fit: cover;
                                cursor: zoom-in;">
                    <div class="image-index">${index + 1}</div>
                </div>
            `).join('');
        
            contentBox.innerHTML = `
                <div class="media-card">
                    <h2 style="color: #9370DB; margin-bottom: 15px;">
                        <i class="fas fa-images"></i>
                        ${data.title || '未命名图集'}
                    </h2>
                    <div style="margin-top: 15px; text-align: center;">
                        <a href="#" class="download-all-btn"
                           style="display: inline-flex;
                                  align-items: center;
                                  padding: 12px 25px;
                                  background: #FFA1C9;
                                  color: white;
                                  border-radius: 25px;
                                  text-decoration: none;
                                  gap: 8px;">
                            <i class="fas fa-download"></i>
                            打包保存
                        </a>
                    </div>
                    <br>
                    <div style="display: grid; 
                              gap: 10px; 
                              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
                        ${galleryHTML}
                    </div>
                </div>
            `;
        
            // 添加打包下载功能
            const downloadBtn = contentBox.querySelector('.download-all-btn');
            downloadBtn.addEventListener('click', async () => {
                try {
                    downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 准备中...`;
                    downloadBtn.disabled = true;
                    
                    const zip = new JSZip();
                    const imgFolder = zip.folder("images");
                    
                    const downloadPromises = data.images.map(async (imgUrl, index) => {
                        try {
                            const response = await fetch(imgUrl);
                            if (!response.ok) throw new Error(`图片${index+1}下载失败`);
                            const blob = await response.blob();
                            imgFolder.file(`image_${index+1}.${getFileExtension(imgUrl)}`, blob);
                        } catch (error) {
                            console.warn(`图片${index+1}下载失败:`, error);
                            return null;
                        }
                    });
        
                    let completed = 0;
                    downloadPromises.forEach(promise => {
                        promise.finally(() => {
                            completed++;
                            const progress = Math.round((completed / data.images.length) * 100);
                            downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${progress}%`;
                        });
                    });
        
                    await Promise.all(downloadPromises);
                    
                    const zipBlob = await zip.generateAsync({
                        type: "blob",
                        compression: "DEFLATE",
                        compressionOptions: { level: 6 }
                    });
                    
                    const cleanTitle = data.title 
                        ? data.title.replace(/[<>:"/\\|?*]/g, '') 
                        : '未命名图集';
                    saveAs(zipBlob, `${cleanTitle}.zip`);
                    
                } catch (error) {
                    console.error('打包下载失败:', error);
                    showAlert('❌ 打包下载失败，请重试');
                } finally {
                    downloadBtn.innerHTML = `<i class="fas fa-file-archive"></i> 打包下载`;
                    downloadBtn.disabled = false;
                }
            });
        
        } else if (data.video_url) {
            contentBox.innerHTML = `
                <div class="media-card">
                    <h2 style="color: #9370DB; margin-bottom: 15px;">
                        <i class="fas fa-video"></i>
                        ${data.video_title || '未命名视频'}
                    </h2>
                    <div style="position: relative; padding-top: 56.25%;">
                        <video controls 
                               style="position: absolute;
                                      top: 0;
                                      left: 0;
                                      width: 100%;
                                      height: 100%;
                                      border-radius: 15px;">
                            <source src="${data.video_url}" type="video/mp4">
                            您的浏览器不支持视频播放
                        </video>
                    </div>
                    <div style="margin-top: 15px; text-align: center;">
                        <a href="#" class="download-btn"
                           style="display: inline-flex;
                                  align-items: center;
                                  padding: 12px 25px;
                                  background: #FFA1C9;
                                  color: white;
                                  border-radius: 25px;
                                  text-decoration: none;
                                  gap: 8px;">
                            <i class="fas fa-download"></i>
                            保存视频
                        </a>
                    </div>
                </div>
            `;
        
            // 视频下载功能
            const downloadBtn = contentBox.querySelector('.download-btn');
            downloadBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                try {
                    downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 下载中...`;
                    downloadBtn.disabled = true;
        
                    const response = await fetch(data.download_url);
                    if (!response.ok) throw new Error(`HTTP 错误！状态码: ${response.status}`);
                    
                    const blob = await response.blob();
                    const fileName = `${data.video_title || '未命名视频'}.mp4`;
                    saveAs(blob, fileName);
                } catch (error) {
                    console.error('下载失败:', error);
                    showAlert('❌ 视频下载失败，请重试');
                } finally {
                    downloadBtn.innerHTML = `<i class="fas fa-download"></i> 保存视频`;
                    downloadBtn.disabled = false;
                }
            });
        }
        contentBox.style.opacity = 1;
            } catch (e) {
        console.error('渲染错误:', e);
        showAlert('内容渲染失败，请检查数据格式');
            }
        }
        
        // 显示完整图片
        function showFullImage(url) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        cursor: zoom-out;
            `;
            
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            img.style.borderRadius = '10px';
            
            overlay.onclick = () => overlay.remove();
            overlay.appendChild(img);
            document.body.appendChild(overlay);
        }
        
        // 工具函数
        function toggleLoading(show) {
            document.getElementById('loading').style.display = show ? 'block' : 'none';
        }
        
        function showAlert(message) {
            const alert = document.createElement('div');
            alert.style.position = 'fixed';
            alert.style.bottom = '30px';
            alert.style.left = '50%';
            alert.style.transform = 'translateX(-50%)';
            alert.style.background = 'rgba(255, 255, 255, 0.95)';
            alert.style.padding = '15px 30px';
            alert.style.borderRadius = '30px';
            alert.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
            alert.style.color = '#6A5ACD';
            alert.innerHTML = message;
            
            document.body.appendChild(alert);
            setTimeout(() => alert.remove(), 3000);
        }
        
        function getFileExtension(url) {
            try {
        const ext = url.split('.').pop().split(/[#?]/)[0].toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        return validExtensions.includes(ext) ? ext : 'jpg';
            } catch (e) {
        return 'jpg';
            }
        }
        
        // 事件绑定
        document.querySelector('.parse-btn').addEventListener('click', parseContent);
        document.getElementById('urlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') parseContent();
        });
        
        // 初始化检查
        if (!window.saveAs) {
            console.warn('FileSaver.js 未加载！下载功能将不可用');
            showDebugInfo('警告：文件保存功能需要 FileSaver.js 支持');
        }
        if (!window.JSZip) {
            console.warn('JSZip 未加载！打包下载功能不可用');
            showDebugInfo('警告：打包下载需要 JSZip 库支持');
        }