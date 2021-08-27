const state = {
    namespaced: true,
    state: {
        debugId: localStorage.getItem("$NK-DebugId"),
        docIdSpEL: undefined,
    },
    mutations: {
        startDebug(state,debugId){
            state.debugId = debugId||state.debugId;
            localStorage.setItem("$NK-DebugId",state.debugId);
        },
        suspendDebug(state){
            state.debugId = undefined;
            localStorage.removeItem("$NK-DebugId");
        },
        setDocIdSpEL(state,docId){
            state.docIdSpEL = docId
        }
    }
};

if(state.state.debugId){
    state.mutations.startDebug(state.state);
}

export default state;