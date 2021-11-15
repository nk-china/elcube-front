

const text = {
    alias:{
        label: '别名',
        type: 'a-input',
        required: false,
        class:{width:'220px'}
    },
    $format(e){
        e.$format = {
            alias : e.alias || e.name,
            select:`${e.name} AS "${e.alias || e.name}"`
        };
    }
}

const keyword = {
    alias:{
        label: '别名',
        type: 'a-input',
        required: false,
        class:{width:'220px'}
    },
    group:{
        label: '分组',
        type: 'a-switch',
        required: false,
    },
    aggregation:{
        label: '聚合',
        type: 'a-select',
        required: false,
        visible(e){return !e.group;},
        options:[
            {value:undefined,label:'NONE'},
            {value:"COUNT",  label:'计数'},
            {value:"FIRST",  label:'最前的'},
            {value:"LAST",   label:'最后的'}
        ],
        class:{width:'160px'}
    },
    having:{
        label: '聚合筛选',
        type: 'a-select',
        required: false,
        visible(e){return !e.group&&e.aggregation==='COUNT';},
        options(e){
            if(e.aggregation==='COUNT')
                return [
                    {value:undefined,   label:'NONE'  },
                    {value:"=",         label:"=",    },
                    {value:">=",        label:">=",   },
                    {value:">",         label:">",    },
                    {value:"<=",        label:"<=",   },
                    {value:"<",         label:"<",    },
                    {value:"<>",        label:"<>",   },
                    {value:"BETWEEN",   label:"介于",  }
                ];
        },
        class:{width:'120px'}
    },
    havingValue:{
        label: '值',
        type(e){return e.aggregation==='COUNT'?'nk-number-range':'nk-date-range';},
        mode(e){return e.having==='BETWEEN'?'range':'single';},
        visible(e){return !e.group&&e.having&&e.aggregation;},
        class(e){return e.symbol === 'BETWEEN' ? {width:'320px'} : {width:'220px'}},
    },
    $format(e){
        const quote = e.aggregation!=='COUNT'?'\'':'';
        const alias = e.alias || (e.name + (e.group ? '_GROUP' : '') +( e.aggregation ? ('_'+e.aggregation):'') );
        const value = quote + ((e.having === "BETWEEN" && e.havingValue) ? e.havingValue.join(quote+' AND '+quote) : e.havingValue) + quote;

        e.$format = {
            alias,
            select:`${e.aggregation ? (e.aggregation+'('+e.name+')') : e.name} AS "${alias}"`,
            group: e.group  && `"${alias}"`,
            having:e.having && `"${alias}" ${e.having} ${value}`
        };
    }
}

const date = {
    alias:{
        label: '别名',
        type: 'a-input',
        required: false,
        class:{width:'220px'}
    },
    group:{
        required:false,
        label: '分组',
        type: 'a-select',
        options:[{label:'不分组',value:undefined},{label:'时间线',value:"HISTOGRAM"}],
        class:{width:'160px'}
    },
    interval:{
        label: '周期',
        type: 'a-input-number',
        visible(e){return e.group === 'HISTOGRAM';}
    },
    intervalType:{
        label: '类型',
        type: 'a-select',
        visible(e){return e.group === 'HISTOGRAM';},
        options:[{label:'年',value:'YEAR'}, {label:'月',value:'MONTH'}, {label:'日',value:'DAY'}],
        class:{width:'140px'}
    },
    aggregation:{
        required:false,
        label: '聚合',
        type: 'a-select',
        visible(e){return !e.group;},
        options:[
            {value:undefined,label:'NONE'},
            {value:"COUNT",  label:'计数'},
            {value:"MIN",    label:'最小的'},
            {value:"MAX",    label:'最大的'}
        ],
        class:{width:'160px'}
    },
    having:{
        required: false,
        label: '聚合筛选',
        type: 'a-select',
        visible(e){return !e.group&&e.aggregation;},
        options:[
            {value:undefined,   label:'NONE'  },
            {value:"=",         label:"=",    },
            {value:">=",        label:">=",   },
            {value:">",         label:">",    },
            {value:"<=",        label:"<=",   },
            {value:"<",         label:"<",    },
            {value:"<>",        label:"<>",   },
            {value:"BETWEEN",   label:"介于",  }
        ],
        class:{width:'120px'}
    },
    havingValue:{
        label: '值',
        type(e){return e.aggregation==='COUNT'?'nk-number-range':'nk-date-range';},
        mode(e){return e.having==='BETWEEN'?'range':'single';},
        visible(e){return !e.group&&e.aggregation&&e.having;},
        class(e){return e.symbol === 'BETWEEN' ? {width:'320px'} : {width:'220px'}},
    },
    $format(e){
        const select = e.group ? (
            `HISTOGRAM(${e.name}, INTERVAL ${e.interval} ${e.intervalType})`
        ):(
            e.aggregation ? (e.aggregation+'('+e.name+')') : e.name
        );
        const quote = e.aggregation!=='COUNT'?'\'':'';
        const alias = e.alias || (e.name + (e.group ? '_HISTOGRAM' : '') +( e.aggregation ? ('_'+e.aggregation):'') );
        const value = quote + ((e.having === "BETWEEN" && e.havingValue) ? e.havingValue.join(quote+' AND '+quote) : e.havingValue) + quote;

        e.$format = {
            alias,
            select:`${select} AS "${alias}"`,
            group: e.group  && `"${alias}"`,
            having:e.having && `"${alias}" ${e.having} ${value}`
        };
    }
};

const number = {
    alias:{
        label: '别名',
        type: 'a-input',
        required: false,
        class:{width:'220px'}
    },
    group:{
        label: '分组',
        type: 'a-switch',
        required: false,
    },
    interval:{
        label: '间隔',
        type: 'a-input-number',
        visible(e){return e.group;}
    },
    aggregation:{
        required: false,
        label: '聚合',
        type: 'a-select',
        visible(e){return !e.group;},
        options:[
            {value:undefined,label:'NONE'},
            {value:"COUNT",  label:'计数'},
            {value:"SUM",    label:'求和'},
            {value:"AVG",    label:'求平均数'},
            {value:"MIN",    label:'最小的'},
            {value:"MAX",    label:'最大的'}
        ],
        class:{width:'160px'}
    },
    having:{
        required: false,
        label: '聚合筛选',
        type: 'a-select',
        visible(e){return !e.group&&e.aggregation;},
        options:[
            {value:undefined,   label:'NONE'  },
            {value:"=",         label:"=",    },
            {value:">=",        label:">=",   },
            {value:">",         label:">",    },
            {value:"<=",        label:"<=",   },
            {value:"<",         label:"<",    },
            {value:"<>",        label:"<>",   },
            {value:"BETWEEN",   label:"介于",  }
        ],
        class:{width:'120px'}
    },
    havingValue:{
        label: '值',
        type: "nk-number-range",
        mode(e){return e.having==='BETWEEN'?'range':'single';},
        visible(e){return !e.group&&e.aggregation&&e.having;},
        class(e){return e.symbol === 'BETWEEN' ? {width:'320px'} : {width:'220px'}},
    },
    $format(e){

        const select = e.group ? (
            `HISTOGRAM(${e.name}, INTERVAL ${e.interval})`
        ):(
            e.aggregation ? (e.aggregation+'('+e.name+')') : e.name
        );
        const alias = e.alias || (e.name + (e.group ? '_HISTOGRAM' : '') +( e.aggregation ? ('_'+e.aggregation):'') );
        const value = (e.having === "BETWEEN" && e.havingValue) ? e.havingValue.join(' AND ') : e.havingValue;

        e.$format = {
            alias,
            select:`${select} AS "${alias}"`,
            group: e.group  && `"${alias}"`,
            having:e.having && `"${alias}" ${e.having} ${value}`
        };
    }
}

const keywordFilter = {
    symbol:{
        label: '条件',
        type: 'a-select',
        defaultValue: '=',
        options:[
            {value:"=",             label:"=",    },
            {value:"<>",            label:"<>",   },
            {value:"LIKE",          label:"包含",  },
            {value:"IN",            label:"清单",  },
            {value:"IS NULL",       label:"为空",  },
            {value:"IS NOT NULL",   label:"不为空",}
        ],
        class:{width:'160px'}
    },
    value:{
        label: '值',
        type:'nk-input-range',
        mode(e){return e.symbol === 'IN' ? 'tags' : undefined},
        visible(e){return e.symbol !=='IS NULL'&&e.symbol !=='IS NOT NULL';},
        class:{width:'220px'}
    },
    $format(e){
        let value = undefined;
        if(e.symbol === 'IS NULL' || e.symbol === 'IS NOT NULL'){
            e.value = undefined;
            value = '';
        }else if(e.symbol === 'IN'&&!(e.value instanceof Array)){
            e.value = [e.value];
            value = '(\''+e.value.join('\',\'')+'\')';
        }else if(e.symbol === 'IN'){
            value = '(\''+e.value.join('\',\'')+'\')';
        }else if(e.symbol !== 'IN'&&e.value instanceof Array){
            e.value = e.value[0];
            value = '\''+e.value+'\'';
        }else{
            value = '\''+e.value+'\'';
        }
        e.$format = {
            where:`${e.name} ${e.symbol} ${value}`,
        };
    }
}
const dateFilter = {
    symbol:{
        label: '条件',
        type: 'a-select',
        defaultValue: '=',
        options:[
            {value:"=",             label:"=",    },
            {value:"<>",            label:"<>",   },
            {value:">=",            label:">=",   },
            {value:"<",             label:"<",    },
            {value:"BETWEEN",       label:"介于",  },
            {value:"IS NULL",       label:"为空",  },
            {value:"IS NOT NULL",   label:"不为空",}
        ],
        class:{width:'160px'}
    },
    value:{
        label: '值',
        type: 'nk-date-range',
        mode(e){return e.symbol === 'BETWEEN' ? 'range' : 'single'},
        visible(e){return e.symbol !=='IS NULL'&&e.symbol !=='IS NOT NULL';},
        class(e){return e.symbol === 'BETWEEN' ? {width:'320px'} : {width:'220px'}},
    },
    $format(e){

        let value = '';
        if(e.symbol === 'IS NULL' || e.symbol === 'IS NOT NULL'){
            e.value = undefined;
            value = '';
        }else if(e.symbol === 'BETWEEN'&&!(e.value instanceof Array)){
            e.value = [e.value];
            value = '\''+e.value.join('\' AND \'')+'\'';
        }else if(e.symbol==='BETWEEN'){
            value = '\''+e.value.join('\' AND \'')+'\'';
        }else if(e.value instanceof Array){
            e.value = e.value[0];
            value = '\''+e.value+'\'';
        }else{
            value = '\''+e.value+'\'';
        }
        e.$format = {
            where:`${e.name} ${e.symbol} ${value}`,
        };
    }
}
const numberFilter = {
    symbol:{
        label: '条件',
        type: 'a-select',
        defaultValue: '=',
        options:[
            {value:"=",             label:"=",    },
            {value:"<>",            label:"<>",   },
            {value:">=",            label:">=",   },
            {value:">",             label:">",    },
            {value:"<=",            label:"<=",   },
            {value:"<",             label:"<",    },
            {value:"BETWEEN",       label:"介于",  },
            {value:"IS NULL",       label:"为空",  },
            {value:"IS NOT NULL",   label:"不为空",}
        ],
        class:{width:'160px'}
    },
    value:{
        label: '值',
        type: 'nk-number-range',
        mode(e){return e.symbol === 'BETWEEN' ? 'range' : 'single'},
        visible(e){return e.symbol !=='IS NULL'&&e.symbol !=='IS NOT NULL';},
        class(e){return e.symbol === 'BETWEEN' ? {width:'320px'} : {width:'220px'}},
    },
    $format(e){
        let value = undefined;
        if(e.symbol === 'IS NULL' || e.symbol === 'IS NOT NULL'){
            e.value = '';
            value = '';
        }else if(e.symbol === 'BETWEEN'&&!(e.value instanceof Array)){
            e.value = [e.value];
            value = e.value.join(' AND ');
        }else if(e.symbol === 'BETWEEN'){
            value = e.value.join(' AND ');
        }else if(e.value instanceof Array){
            e.value = e.value[0];
            value = e.value;
        }else{
            value = e.value;
        }
        e.$format = {
            where:`${e.name} ${e.symbol} ${value}`,
        };
    }
}

export default {
    fields:{
        text,
        keyword,
        date,
        short:number,
        integer:number,
        long:number,
        float:number,
        double:number
    },
    filters:{
        text:keywordFilter,
        keyword:keywordFilter,
        date:dateFilter,
        short:numberFilter,
        integer:numberFilter,
        long:numberFilter,
        float:numberFilter,
        double:numberFilter,
    }
}