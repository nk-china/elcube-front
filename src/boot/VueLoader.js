import Vue from "vue";
import {loadModule} from "vue3-sfc-loader/dist/vue2-sfc-loader";
import Mixin from "../cards/Mixin";
import MixinDef from "../cards/MixinDef";
import NkFormat from "../utils/NkFormat";
import NkUtil from "../utils/NkUtil";

let modules = {
    Mixin,
    MixinDef,
    NkFormat,
    NkUtil
}

function componentLoader(componentName, template, modules) {
    return Vue.component(componentName,() => loadModule(
        componentName+".vue",
        {
            moduleCache: {
                vue: Vue,
                'nk-ts5-platform': modules,
                ...modules
            },
            getFile() {
                return template;
            },
            addStyle(textContent) {
                document.head.append(Object.assign(document.createElement('style'), { textContent }));
            },
        }
    ));
}

function loadVueTemplate(componentName, template){
    return componentLoader(componentName, template, modules)
}

function reloadVueResources(){
    return new Promise((resolve,reject)=>{
        Vue.prototype.$http.instanceNone.get("/api/def/resources/vue")
            .then(res=>{
                let count = 0;
                for(let componentName in res.data){
                    if(res.data.hasOwnProperty(componentName)){
                        componentLoader(componentName, res.data[componentName], modules)
                        componentLoader(componentName, res.data[componentName], modules)
                    }
                    count ++;
                }
                resolve([res.data,count]);
            }).catch(reject);
    })
}

export default {
    reloadVueResources,
    loadVueTemplate
}