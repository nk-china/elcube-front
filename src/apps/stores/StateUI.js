/*
 * 	This file is part of ELCard.
 *	ELCard is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	ELCard is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
 */
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