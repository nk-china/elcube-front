
import { v4 as uuidv4 } from 'uuid';

export default {
    namespaced: true,
    state: {
        debugId:undefined
    },
    getters:{
        getDebug(state){
            return state.debugId;
        },
    },
    mutations: {
        startDebug(state){
            state.debugId = state.debugId||uuidv4();
        },
        stopDebug(state){
            state.debugId = undefined;
        }
    }
}