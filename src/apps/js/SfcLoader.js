import { loadModule } from "vue3-sfc-loader/dist/vue2-sfc-loader";
import { Modal } from "ant-design-vue";
import Vue from 'vue';

export default function (Vue123dd, modules,i18n,$http, enable){

    function componentLoader(componentName, template, modules) {

        return Vue.component(componentName,() => {

            console.log(componentName)
            console.log(Vue)
            console.log(Vue123dd)
            console.log(Vue===Vue123dd)

            return new Promise((resolve,reject)=>{
                console.log(componentName)
                let i18n,markdown;
                loadModule(
                    componentName+".vue",
                    {
                        moduleCache: modules,
                        getFile() {
                            console.log(template)
                            return template;
                        },
                        addStyle(textContent) {
                            console.log(textContent)
                            if((textContent = textContent.trim()))
                                document.head.append(Object.assign(document.createElement('style'), { textContent }));
                        },
                        customBlockHandler(block) {
                            if ( block.type === 'i18n' ){
                                i18n = block.content;
                            }
                            if ( block.type === 'docs' ){
                                markdown = block.content;
                            }
                        }
                    }
                ).then(component=>{
                    if(i18n){
                        component.__i18n = [i18n];
                    }
                    if(markdown){
                        component.__docs = markdown.trim();
                    }
                    console.log(component)
                    resolve(component);
                }).catch((e)=>{
                    console.log(e)
                    Modal.error({
                        centered: true,
                        title: '['+componentName+']编译错误',
                        content: e.name + " : "+e.message
                    });
                    reject(e);
                }).finally(()=>{
                    console.log(53)
                });
            });
        });
    }

    function loadVueTemplate(componentName, template){
        if(!enable){
            return Promise.reject('sfc 未启用');
        }
        return componentLoader(componentName, template, modules)
    }

    function reloadVueResources(){

        if(!enable){
            return Promise.resolve({count:0});
        }

        return new Promise((resolve,reject)=>{
            $http.instanceNone.get("/api/def/resources/vue")
                .then(res=>{
                    let count = 0;
                    for(let componentName in res.data){
                        if(res.data.hasOwnProperty(componentName)){
                            componentLoader(componentName, res.data[componentName], modules, i18n)
                        }
                        count ++;
                    }
                    resolve({
                        count,
                        data:res.data
                    });
                }).catch(reject);
        })
    }

    return {
        loadVueTemplate,
        reloadVueResources
    }
}