/*
 * 	This file is part of ELCube.
 *	ELCube is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	ELCube is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
 */
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