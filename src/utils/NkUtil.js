
import Vue from 'vue';
import {loadModule} from 'vue3-sfc-loader/dist/vue2-sfc-loader';

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

export default {
    componentLoader,
    isRepeat(arr,keys){
        const hash = {};
        for(let i in arr){
            const item = arr[i]
            let key = [];
            for(let j in keys){
                key.push(item[keys[j]])
            }
            key = key.join('-');
            if(hash[key]){
                item.$hasError = true;
                return true;
            }
            hash[key]=true
        }
        return false;
    },
    hasBlack(arr,keys){
        for(let i in arr){
            const item = arr[i]
            for(let j in keys){
                if(!item[keys[j]]){
                    item.$hasError = true;
                    return true;
                }
            }
        }
        return false;
    },
    toEsParams(params,preCondition,$debug){

        let must = [],
          condition = {"bool": {must}},
          np = {};
        let value;
        for(let field in params){
            switch (field) {
                case "_source":
                    //如果$debug 为true，不设置索引返回字段，服务器默认返回全部字段
                    if(!$debug){
                        np[field]=params[field];
                    }
                    break;
                case "$aggs":
                case "from":
                case "rows":
                case "keyword":
                case "order":
                case "orderField":
                    np[field]=params[field];
                    break;
                default:
                    value = params[field];
                    if(value instanceof Array){
                        if(value.length){
                            let terms = {};
                            terms[field]=value;
                            must.push({
                                terms
                            });
                        }
                    }else if(value instanceof Object){
                        let range = {};
                        range[field]=value;
                        must.push({
                            range
                        });
                    }else if(value){
                        let match = {};
                        match[field]=`${value}`;
                        must.push({
                            match
                        });
                    }
                    break;
            }
        }
        np.condition = JSON.stringify(condition);
        if(preCondition)
            np.preCondition = JSON.stringify(preCondition);

        return np;
    }
}
