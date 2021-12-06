/*
 * 	This file is part of ELCard.
 *	ELCard is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	ELCard is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
 */

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