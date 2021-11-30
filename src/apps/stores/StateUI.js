export default {
    namespaced: true,
    state: {
        logo: undefined,
        appName: undefined,
        loading:false,
        errors:[],
        errorVisible:false,
    },
    mutations: {
        doLoading(state,flag){
            state.loading = flag;
        },
        doAddError(state, error){
            state.errors.push(error);
        },
        doClearError(state){
            state.errorVisible = false;
        }
    },
    getters: {
        loading: (state) => {
            return state.loading;
        }
    }
}