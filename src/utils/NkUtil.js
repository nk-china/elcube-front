
import { Interpreter } from "eval5";
import {v4 as uuidv4} from "uuid";
import qs from "qs";

export default {

    uuid(){
        return uuidv4();
    },
    parseJSON(json,context){
        const interpreter = new Interpreter(context);
        return interpreter.evaluate("v="+json);
    },
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
    translateParamsToKeyValue(params){
        let queryString = {
            from:           params.from,
            rows:           params.rows,
            orderField:     params.orderField,
            order:          params.order
        };

        if(params&&params.conditions){
            Object.keys(params.conditions).forEach(key=>{
                const condItem = params.conditions[key];
                Object.keys(condItem).forEach(k=>{
                    if(k==='term'){
                        queryString = Object.assign(queryString,condItem[k]);
                    }else if(k==='multi_match'){
                        queryString[key] = condItem[k].query;
                    }
                });
            })
        }
        return queryString;
    },
    translateParamsToQueryString(params){
        return qs.stringify(this.translateParamsToKeyValue(params), { arrayFormat: 'brackets' });
    }
}
