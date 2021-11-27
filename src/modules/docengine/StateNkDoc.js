import documentation from "../../dn/documentation";
import MarkdownIt from 'markdown-it';

const c = new MarkdownIt();


export default {
    namespaced: true,
    state: {
        layoutConfig: {
            helperVisible:false
        },
        helperConfig: {
            markdown: '# hello [Easis](http://easis.nkpro.cn)'
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
        }
    },
    actions: {
        doSetDocumentPage({commit},page){
            // page 格式
            // nkdn://v/...
            // nkdn://j/...
            // nkdn://d/...
            console.log(page)
            if(!page){
                //文档没有设置
                commit('setDocumentPage',{prev:'nkdn://',markdown:c.render('#### 暂无内容\n [返回](nkdn://)')});
            }else if(page.startsWith('nkdn://user')){
                //d 开头表示用户文档
                page = page.substr(11).split('/');
                let params = {};
                let prev = '';
                if(page.length===4){
                    params = {docType:page[1],component:page[2],version:parseInt(page[3])};
                    prev = `nkdn://user/${page[1]}/${page[3]}`;
                }else if(page.length===3){
                    params = {docType:page[1],version:parseInt(page[2])};
                    prev = `nkdn://user/`;
                }else{
                    params = {};
                    prev = `nkdn://`;
                }
                this._vm.$http.postJSON("/api/webapp/document",params)
                    .then(res=>{
                        let markdown = (res.data||'#### 暂无内容 [返回](nkdn://)')+'';
                        commit('setDocumentPage',{
                            prev,
                            markdown:c.render(markdown)
                        });
                    })
            }else if(page.startsWith('nkdn://define')){

                const prev = page.substr(0,page.lastIndexOf('/'));
                const key  = page.substr(13);
                if(key){
                    const item = documentation[key];
                    if(item){
                        commit('setDocumentPage',{prev,component:item.component});
                    }else{
                        commit('setDocumentPage',{prev:'nkdn://',markdown:c.render('#### 文档似乎不见了 [返回](nkdn://)')});
                    }
                }else{
                    let markdown = '### 配置手册\n';
                    for(let key in documentation){
                        const item = documentation[key];

                        if(!item.ignored){

                            let c = '';
                            let f = Math.max(key.split('/').length-2,0);
                            for(let i=0;i<f;i++){
                                c+='    ';
                            }
                            markdown += `${c}* [${item.title}](nkdn://define${key})\n`
                        }
                    }
                    commit('setDocumentPage',{
                        prev:'nkdn://',
                        markdown:c.render(markdown)
                    });
                }
            }else if(page.startsWith('nkdn://developer')){

                page = page.substr(16);
                commit('setDocumentPage',{prev:'nkdn://',markdown:c.render('#### 开发手册尚未发布，请参考 [配置手册](nkdn://define)')});
            }else if(page==='nkdn://'||page==='nkdn:/'){
                commit('setDocumentPage',{
                    component:require("../../dn/DocumentIndex.md").default
                });
            }
        }
    },
    getters: {
    }
}
