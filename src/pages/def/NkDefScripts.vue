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
import qs from "qs";
export default {
    computed:{
        searchItemsDefault(){
            return [
                {
                    name:'搜索',
                    field:'keyword',
                    component:'nk-search-options-text',
                    placeholder:'请输入关键字'
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
                    option:{
                        buckets: [
                            {label: "Active",value:"Active"},
                            {label: "InActive",value:"InActive"},
                        ]
                    }
                },
            ]
        },
        columns(){
            return [
                { type: 'seq',          title: '#',      width: '4%', },
                { field: 'scriptName',  title: '组件',    width: '25%', sortable:true, params:{ orderField: 'SCRIPT_NAME'}},
                { field: 'scriptDesc',  title: '描述',    width: '30%', sortable:true, params:{ orderField: 'SCRIPT_DESC'}},
                { field: 'version',     title: '版本',    width: '10%', sortable:true, params:{ orderField: 'VERSION'}},
                { field: 'state',       title: '状态',    width: '10%', sortable:true, params:{ orderField: 'STATE'}},
                { field: 'updatedTime', title: '更新时间', width: '10%', sortable:true, params:{ orderField: 'UPDATED_TIME', formatter: 'nkDatetimeFriendly' }},
                {                       title: 'ACTION',
                    slots: { default: ({row},h) => {
                            return [h(
                                'router-link',
                                {
                                    props:{to: `/apps/def/script/detail/${row.scriptName}/${row.version}`}
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
            this.$http.post("/api/def/script/page",qs.stringify(params, { arrayFormat: 'brackets' }))
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

<style lang="scss">
</style>
