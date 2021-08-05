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
        },
        hasAuthority:(state)=>(authority)=>{
            authority = typeof authority === 'object' ? authority : [authority];
            return !!(state.user.authorities
                &&state.user.authorities.find(a=>{
                    return a.authority==='*:*'|| authority.indexOf(a.authority)>=0;
                }));
        }
    }
}