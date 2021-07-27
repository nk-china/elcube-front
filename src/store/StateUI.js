export default {
    namespaced: true,
    state: {
        loading:false,
    },
    mutations: {
        doLoading(state,flag){
            state.loading = flag;
        }
    },
    getters: {
        loading: (state) => {
            return state.loading;
        }
    }
}