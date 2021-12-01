export default {
    namespaced: true,
    state: {
        reLogin:false,
        reLoginSuccess:[],
        reLoginTime:90,
        reLoginMessage:undefined,
        user: {}
    },
    mutations: {
        setUser(state,user){
            state.user = user;
        },
        setReLogin(state,{message,callback,reLoginTime}){
            state.reLogin = true;
            state.reLoginMessage = message;
            state.reLoginTime = reLoginTime;
            if(callback)
                state.reLoginSuccess.push(callback)
        },
        submitLogin(state){
            if(state.reLoginSuccess){
                state.reLoginSuccess.forEach(func=>func());
            }
            state.reLoginMessage = undefined;
            state.reLogin = false;
            state.reLoginSuccess = [];
        },
        clearReLogin(state){
            state.reLoginMessage = undefined;
            state.reLogin = false;
            state.reLoginSuccess = [];
        },
        hasAuthority(state,authority){
            authority = typeof authority === 'object' ? authority : [authority];
            return !!(state.user.authorities
                &&state.user.authorities.find(a=>{
                    return a.authority==='*:*'|| authority.indexOf(a.authority)>=0;
                }));
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