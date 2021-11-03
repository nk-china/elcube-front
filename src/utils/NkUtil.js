
import { Interpreter } from "eval5";

export default {

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
    }
}
