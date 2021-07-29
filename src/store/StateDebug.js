const state = {
    namespaced: true,
    state: {
        debugId: localStorage.getItem("$NK-DebugId")
    },
    mutations: {
        startDebug(state,debugId){
            state.debugId = debugId||state.debugId;
            localStorage.setItem("$NK-DebugId",state.debugId);
        },
        suspendDebug(state){
            state.debugId = undefined;
            localStorage.removeItem("$NK-DebugId");
        }
    }
};

if(state.state.debugId){
    state.mutations.startDebug(state.state);
}

export default state;