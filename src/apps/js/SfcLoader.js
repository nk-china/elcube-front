import { loadModule } from "vue3-sfc-loader/dist/vue2-sfc-loader";
import { Modal } from "ant-design-vue";

export default function (Vue, modules,i18n,$http){

    function componentLoader(componentName, template, modules) {

        return Vue.component(componentName,() => {

            return new Promise((resolve,reject)=>{
                let i18n,markdown;
                loadModule(
                    componentName+".vue",
                    {
                        moduleCache: modules,
                        getFile() {
                            return template;
                        },
                        addStyle(textContent) {
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
                    resolve(component);
                }).catch((e)=>{
                    Modal.error({
                        centered: true,
                        title: '['+componentName+']编译错误',
                        content: e.name + " : "+e.message
                    });
                    reject(e);
                });
            });
        });
    }

    function loadVueTemplate(componentName, template){
        return componentLoader(componentName, template, modules)
    }

    function reloadVueResources(){

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