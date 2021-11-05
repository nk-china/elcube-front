export default {
    namespaced: true,
    state: {
        logo: undefined,
        appName: undefined,
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