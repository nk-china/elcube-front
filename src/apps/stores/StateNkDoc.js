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
import MarkdownIt from 'markdown-it';

const c = new MarkdownIt();


export default {
    namespaced: true,
    state: {
        layoutConfig: {
            helperVisible:false
        },
        helperConfig: {
            markdown: '# hello [ELCube](http://elcube.nkpro.cn)'
        }
    },
    mutations: {
        setLayoutConfig(state,layoutConfig){
            state.layoutConfig = Object.assign(state.layoutConfig,layoutConfig);
            if(window)setTimeout(()=>{window.dispatchEvent(new Event('resize'));},1);
        },
        setDocumentPage(state,config){
            state.helperConfig = config;
            state.layoutConfig = Object.assign(state.layoutConfig,{helperVisible:true});
            if(window)setTimeout(()=>{window.dispatchEvent(new Event('resize'));},1);
        },
        setMarkdown(state,config){
            if(config && config.markdown){
                state.helperConfig = {
                    prev:'nkdn://',
                    markdown:c.render(config.markdown)
                };
                state.layoutConfig = Object.assign(state.layoutConfig,{helperVisible:true});
                if(window)setTimeout(()=>{window.dispatchEvent(new Event('resize'));},1);
            }
        }
    },
    actions: {
        doSetDocumentPage({commit}){
            commit('setDocumentPage',{
                component:require("../NkDocument.md").default
            });
        }
    },
    getters: {
    }
}
