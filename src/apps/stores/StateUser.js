/*
 * 	This file is part of EAsis.
 *	EAsis is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	EAsis is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with EAsis.  If not, see <https://www.gnu.org/licenses/>.
 */
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
        hasAuthority: (state)=>(authority)=>{
            authority = typeof authority === 'object' ? authority : [authority];
            return !!(state.user.authorities
                &&state.user.authorities.find(a=>{
                    return a.authority==='*:*'|| authority.indexOf(a.authority)>=0;
                }));
        }
    }
}