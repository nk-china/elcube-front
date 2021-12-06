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
