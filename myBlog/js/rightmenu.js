//@author: SSRVodka
// RightMenu 鼠标右键菜单
let rmf = {};

// 当前右键点击的目标元素
let currentTarget = null;

// 显示右键菜单
rmf.showRightMenu = function(isTrue, x=0, y=0){
    let rightMenu = document.getElementById("rightMenu");
    rightMenu.style.top = x + 'px';
    rightMenu.style.left = y + 'px';
    if (isTrue) {
        rightMenu.style.display = 'block'; // Show the element
    } else {
        rightMenu.style.display = 'none';  // Hide the element
    }
}

// 昼夜切换
rmf.switchDarkMode = function(){
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
        btf.activateDarkMode()
        btf.saveToLocal.set('theme', 'dark', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
    } else {
        btf.activateLightMode()
        btf.saveToLocal.set('theme', 'light', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
    }
    // handle some cases
    typeof utterancesTheme === 'function' && utterancesTheme()
    typeof FB === 'object' && window.loadFBComment()
    window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200)
};

// 阅读模式
rmf.switchReadMode = function(){
    const body = document.body
    body.classList.add('read-mode')
    const newEle = document.createElement('button')
    newEle.type = 'button'
    newEle.className = 'fas fa-sign-out-alt exit-readmode'
    body.appendChild(newEle)

    function clickFn () {
        body.classList.remove('read-mode')
        newEle.remove()
        newEle.removeEventListener('click', clickFn)
    }

    newEle.addEventListener('click', clickFn)
}

// 复制选中文字
rmf.copySelect = function(){
    /* !!! WARN !!! No i18n here */
    try {
        document.execCommand('Copy',false,null);
    } catch (err) {
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow("Copy Failed (#`皿´)");
    }
    GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow("Copied! ヾ(≧∇≦*)ゝ");
}

//回到顶部
rmf.scrollToTop = function(){
    btf.scrollToDest(0, 500);
}

// 复制图片地址
rmf.copyImageUrl = function(){
    if (currentTarget && currentTarget.tagName === 'IMG') {
        const imageUrl = currentTarget.src;
        navigator.clipboard.writeText(imageUrl).then(() => {
            GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow("图片地址已复制!");
        }).catch(err => {
            GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow("复制失败: " + err);
        });
    }
}

// 下载图片
rmf.downloadImage = function(){
    if (currentTarget && currentTarget.tagName === 'IMG') {
        const link = document.createElement('a');
        link.href = currentTarget.src;
        link.download = currentTarget.alt || 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// 复制链接地址
rmf.copyLink = function(){
    if (currentTarget && currentTarget.tagName === 'A') {
        const linkUrl = currentTarget.href;
        navigator.clipboard.writeText(linkUrl).then(() => {
            GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow("链接地址已复制!");
        }).catch(err => {
            GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow("复制失败: " + err);
        });
    }
}

// 在新标签页打开链接
rmf.openLinkNewTab = function(){
    if (currentTarget && currentTarget.tagName === 'A') {
        window.open(currentTarget.href, '_blank');
    }
}

// 右键菜单事件
if(! (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))){
    window.oncontextmenu = function(event){

        // current mouse target
        currentTarget = event.target;

        // Hide elements with the class 'rightMenu-group' and 'hide'
        let rightMenuGroups = document.querySelectorAll('.rightMenu-group.hide');
        rightMenuGroups.forEach(group => {
            group.style.display = 'none';
        });

        // Show the element with the id 'menu-text' if there is a text selection
        if (document.getSelection().toString()) {
            document.getElementById('menu-text').style.display = 'block';
        }
        // Show the element with the id 'menu-image' if there is a image target
        if (currentTarget.tagName === 'IMG') {
            document.getElementById('menu-image').style.display = 'block';
        }
        
        // Show the element with the id 'menu-link' if there is a link target
        if (currentTarget.tagName === 'A') {
            document.getElementById('menu-link').style.display = 'block';
        }

        // Get the page coordinates
        let pageX = event.clientX + 10;
        let pageY = event.clientY;

        // Get the dimensions of the rightMenu
        let rightMenu = document.getElementById('rightMenu');
        let rmWidth = rightMenu.offsetWidth;
        let rmHeight = rightMenu.offsetHeight;

        // Adjust pageX if it exceeds window width
        if (pageX + rmWidth > window.innerWidth) {
            pageX -= rmWidth + 10;
        }

        // Adjust pageY if it exceeds window height
        if (pageY + rmHeight > window.innerHeight) {
            pageY -= (pageY + rmHeight - window.innerHeight);
        }

        rmf.showRightMenu(true, pageY, pageX);
        return false;
    };

    window.addEventListener('click',function(){rmf.showRightMenu(false);});
    // window.addEventListener('load',function(){rmf.switchTheme(true);});
}
