// import "hidpi-canvas/dist/hidpi-canvas";
import _html2canvas from "html2canvas";

// let getPixelRatio = function() {
//     // let backingStore = context.backingStorePixelRatio ||
//     //     context.webkitBackingStorePixelRatio ||
//     //     context.mozBackingStorePixelRatio ||
//     //     context.msBackingStorePixelRatio ||
//     //     context.oBackingStorePixelRatio ||
//     //     context.backingStorePixelRatio || 1;
//     //
//     // return (window.devicePixelRatio || 1) / backingStore;
//     return 1;
// };

function scale(canvas,dw,dh){
    const ratio = dw/dh;

    let sx = 0,sy = 0,sw,sh;
    if(canvas.width>canvas.height*ratio){
        sy = (canvas.height - canvas.width / ratio) / 2;
        sw = canvas.width;
        sh = canvas.width / ratio;
    }else{
        sx = (canvas.width - canvas.height * ratio) / 2;
        sw = canvas.height * ratio;
        sh = canvas.height;
    }

    const target = document.createElement("canvas");
    target.setAttribute('width', dw.toString());
    target.setAttribute('height',dh.toString());
    const ctx = target.getContext("2d");
    ctx.fillStyle='#666';
    ctx.fillRect(0,0,target.width,target.height);
    ctx.drawImage(canvas,sx,sy,sw, sh,0,0,dw,dh);

    return target;
}

function html2canvas(el,options){
    return _html2canvas(el,Object.assign({},options))
}
// function scale(canvas,dw,dh){
//     const ratio = dw/dh;
//
//     let sx = 0,sy = 0,sw,sh;
//     if(canvas.width>canvas.height*ratio){
//         sx = (canvas.width - canvas.height * ratio) / 2;
//         sw = canvas.height * ratio;
//         sh = canvas.height;
//     }else{
//         sy = (canvas.height * ratio - canvas.width) / 2;
//         sw = canvas.width;
//         sh = canvas.width / ratio;
//     }
//
//     const target = document.createElement("canvas");
//     target.setAttribute('width', dw.toString());
//     target.setAttribute('height',dh.toString());
//     target.getContext("2d").drawImage(canvas,sx,sy,sw, sh,0,0,dw,dh);
//
//     return target;
// }

export default {
    html2canvas,
    scale
}