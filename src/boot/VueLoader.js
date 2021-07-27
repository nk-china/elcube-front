import Vue from "vue";
import {loadModule} from "vue3-sfc-loader/dist/vue2-sfc-loader";
import axios from "axios";
import Mixin from "../cards/Mixin";
import MixinDef from "../cards/MixinDef";
import NkFormat from "../utils/NkFormat";
import NkUtil from "../utils/NkUtil";

function componentLoader(componentName, template, modules) {
    return Vue.component( componentName,() => loadModule(
        componentName+".vue",
        {
            moduleCache: {
                vue: Vue,
                ...modules
            },
            getFile() {
                return template;
            },
            addStyle(textContent) {
                const style = Object.assign(document.createElement('style'), { textContent });
                const ref = document.head.getElementsByTagName('style')[0] || null;
                document.head.insertBefore(style, ref);
            },
        }
    ));
}

export default function(){
    return new Promise((resolve,reject)=>{
        axios.get("/api/def/resources/vueTemplates")
            .then(res=>{

                let modules = {
                    Mixin,
                    MixinDef,
                    NkFormat,
                    NkUtil
                }

                for(let componentName in res.data){
                    if(res.data.hasOwnProperty(componentName)){
                        componentLoader(componentName, res.data[componentName], modules)
                        componentLoader(componentName, res.data[componentName], modules)
                    }
                }
                resolve();
            }).catch(reject);
    })
}