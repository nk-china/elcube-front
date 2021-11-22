<template>
    <nk-query-layout
        ref="layout"
        title="组件开发"
        :search-items-default="searchItemsDefault"
        :dataTableColumns="columns"
        :selectable="false"
        :init-rows="50"
        @change="search"
    >
        <a-button-group slot="action">
            <a-button type="primary" @click="create">新建</a-button>
        </a-button-group>
    </nk-query-layout>
</template>

<script>
import NkUtil from "@/utils/NkUtil";

const formatVersion = ({cellValue})=>{
    return cellValue.split('-')[0];
}

export default {
    computed:{
        searchItemsDefault(){
            return [
                {
                    name:'类型',
                    field:'type',
                    component:'nk-search-options-single',
                    options:{
                        buckets: [
                            {label: "Card | 卡片",value:"Card"},
                            {label: "Field | 字段",value:"Field"},
                            {label: "Meter | 仪表盘",value:"Meter"},
                            {label: "Service | 服务",value:"Service"},
                        ]
                    }
                },
                {
                    name:'版本',
                    field:'version',
                    component:'nk-search-options-text',
                    placeholder:'请输入版本号'
                },
                {
                    name:'状态',
                    field:'state',
                    component:'nk-search-options-single',
                    options:{
                        buckets: [
                            {label: "Active | 激活的",value:"Active"},
                            {label: "InActive | 未激活",value:"InActive"},
                            {label: "History | 历史",value:"History"},
                        ]
                    }
                },
                {
                    name:'搜索',
                    field:'keyword',
                    component:'nk-search-options-text',
                    placeholder:'请输入关键字'
                },
            ]
        },
        columns(){
            return [
                { type: 'seq',          title: '#',      width: '4%', },
                { field: 'scriptType',  title: '类型',    width: '10%', sortable:true, params:{ orderField: 'SCRIPT_TYPE'}},
                { field: 'scriptName',  title: '组件',    width: '22%', sortable:true, params:{ orderField: 'SCRIPT_NAME'}},
                { field: 'scriptDesc',  title: '描述',    width: '25%', sortable:true, params:{ orderField: 'SCRIPT_DESC'}},
                { field: 'version',     title: '版本',    width: '10%', sortable:true, params:{ orderField: 'VERSION'},formatter: formatVersion},
                { field: 'state',       title: '状态',    width: '10%', sortable:true, params:{ orderField: 'STATE'}},
                { field: 'updatedTime', title: '更新时间', width: '10%', sortable:true, params:{ orderField: 'UPDATED_TIME'}, formatter: 'nkDatetimeFriendly' },
                {                       title: 'ACTION',
                    slots: { default: ({row},h) => {
                            return [h(
                                'router-link',
                                {
                                    props:{to: `/apps/def/component/detail/${row.scriptName}/${row.version}`}
                                },
                                "详情"
                            )]
                        }}
                },
            ];
        }
    },
    methods:{
        search(params){
            this.$http.post("/api/def/script/page",NkUtil.translateParamsToQueryString(params))
                .then((res)=>{
                    this.$emit("setTab","组件开发");
                    if(this.$refs.layout)
                        this.$refs.layout.setData(res.data)
                });
        },
        create(){
            this.$router.push("/apps/def/script/create")
        }
    }
}
</script>

<style lang="less">
</style>
