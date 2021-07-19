export default {
    namespaced: true,
    state: {
        reLogin:false,
        reLoginSuccess:[],
        reLoginTime:90,
        user: {}
    },
    mutations: {
        setUser(state,user){
            state.user = user;
        },
        clearReLogin(state){
            if(state.reLoginSuccess){
                state.reLoginSuccess.forEach(func=>func());
            }
            state.reLogin = false;
            state.reLoginSuccess = [];
        }
    },
    getters: {
        reLogin: (state) => {
            return state.reLogin;
        },
        reLoginTime: (state) => {
            return state.reLoginTime;
        },
        user: (state) => {
            return state.user;
        }
    }
}