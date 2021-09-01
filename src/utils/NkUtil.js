
export default {
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
        console.log(params)
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
                case "_keywordField":
                    np[field]=params[field];
                    break;
                case "_highlight":{
                    let highlightFields = [];
                    let highlight = params[field];
                    for(let k in highlight){
                        if(highlight[k]){
                            highlightFields.push(k);
                        }
                    }
                    np[field]=highlightFields.join(',');
                    break;
                }
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
