
function hasClass(dom,className){
    return typeof dom.className === 'string' && dom.className.split(/\s+/).indexOf(className)>-1
}

function findParent(dom,filter){
    if(!filter||!dom.parentElement||filter(dom.parentElement)){
        return dom.parentElement;
    }
    return findParent(dom.parentElement,filter);
}

//进入全屏
function requestFullScreen(element,onExit) {
    let de = document.querySelector(element) || document.documentElement;
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    }

    if(onExit){
        let func = function () {
            if (!document.fullscreenElement) {
                document.removeEventListener("fullscreenchange",func);
                onExit();
            }
        };
        document.addEventListener("fullscreenchange", func);
    }
}
//退出全屏
function exitFullscreen(element) {
    let de = document.querySelector(element) || document.documentElement;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}

export default {
    findParent,
    hasClass,
    requestFullScreen,
    exitFullscreen
}