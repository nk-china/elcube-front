
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";

const debugId = localStorage.getItem("$NK-DebugId");
const expire  = localStorage.getItem("$NK-DebugExpire");

function stopDebug(state){
    if(state.timer){
        clearInterval(state.timer);
    }
    state.debugId = undefined;
    state.expire  = undefined;
    state.timeout = undefined;
    state.timer   = undefined;
    localStorage.removeItem("$NK-DebugId");
    localStorage.removeItem("$NK-DebugExpire");
}

const state = {
    namespaced: true,
    state: {
        debugId,
        expire,
        timer:undefined,
        timeout:undefined
    },
    mutations: {
        startDebug(state,time){
            state.debugId = state.debugId||uuidv4();
            state.expire  = time||1800;
            state.timeout = moment.duration(state.expire,'seconds').humanize(true);
            state.timer   = setInterval(()=>{

                state.expire--;
                state.timeout = moment.duration(state.expire,'seconds').humanize(true);
                localStorage.setItem("$NK-DebugExpire",state.expire);

                if(state.expire<=0){
                    stopDebug(state);
                }
            },10000);
            localStorage.setItem("$NK-DebugId",state.debugId);
            localStorage.setItem("$NK-DebugExpire",state.expire);
        },
        stopDebug
    }
};

if(debugId && expire){
    state.mutations.startDebug(state.state,expire);
}

export default state;