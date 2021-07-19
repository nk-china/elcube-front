<template>
    <nk-query-layout
        ref="layout"
        title="任务"
        sub-title="工作流任务列表"
        :search-items-default="searchItemsDefault"
        :search-items-more-def="searchItemsMoreDef"
        :dataTableColumns="columns"
        :dataIncludeFields="['itemId']"
        save-as-source="$tasks"
        @change="search"
        @select="selected"
    >
        <a-button-group slot="action">
        </a-button-group>

        <nk-page-preview :params="previewParams" :visable.sync="preViewVisable" @close="previewClose"></nk-page-preview>

    </nk-query-layout>
</template>

<script>
import NkUtil from "../utils/NkUtil";
import NkPagePreview from "./NkPagePreview";


export default {
    components: {NkPagePreview},
    data(){
        return {
            creatableDocTypes:[],
            columns:[
                { type: 'seq',            title: '#',         width: '36'},
                { field: 'docTypeDesc',   title: '单据类型',    width: '15%', sortable:true },
                { field: 'partnerName',   title: '交易伙伴',      width: '20%', sortable:true,
                    params:{ orderField: 'partnerName.original' }},
                { field: 'itemName',       title: '任务名称',       width: '20%', sortable:true,
                    params:{ orderField: 'itemName.original' }},
                { field: 'itemStateDesc', title: '状态',      width: '10%', sortable:true},
                { field: 'updatedTime',   title: '更新时间',   width: '10%', sortable:true,formatter:'nkDatetimeFriendly' },
                {                         title: '操作',      width: '10%',
                    slots: { default: ({row},h) => {
                            return [h(
                                'a',
                                {
                                    props:{to: '/apps/tasks/task/'+row['itemId']},
                                    on:{
                                        click:(e)=>{this.toDetail(e,row);}
                                    }
                                },
                                "详情"
                            )]
                        }}
                },
            ],
            searchItemsDefault:[
                {
                    name:'交易类型',
                    field:'docTypeDesc',
                    component:'nk-search-options-multiple',
                    min:300,
                    agg:true
                },
                {
                    name:'任务时间',
                    field:'updatedTime',
                    component:'nk-search-options-date-range',
                    placeholder:'请选择'
                },
                {
                    name:'任务状态',
                    field:'itemStateDesc',
                    component:'nk-search-options-single',
                    min:220,
                    agg:true
                },
                {
                    name:'关键字',
                    field:'keyword',
                    component:'nk-search-options-text',
                    placeholder:'请输入关键字'
                }
            ],
            searchItemsMoreDef:[
                {
                    name:'标签',
                    field:'tags',
                    component:'nk-search-options-multiple',
                    agg:true,
                    condition(params){
                        return params.docTypeDesc && params.docTypeDesc.length;
                    }
                }
            ],
            previewParams: {},
            preViewVisable: false
        }
    },
    created() {

        this.$http.get("/api/doc/types/TRANSACTION")
            .then(res=>{
                this.creatableDocTypes = res.data;
            });
    },
    methods:{
        search(params){
            this.$http.postJSON("/api/bpm/tasks",NkUtil.toEsParams(params,this.preCondition))
                .then((res)=>{
                    this.$emit("setTab","任务");
                    if(this.$refs.layout)
                        this.$refs.layout.setData(res.data)
                });
        },
        toDetail(e,row){
            this.$http.get("/api/bpm/task/exists?taskId="+row['itemId'])
                .then(res=>{
                    if(res.data===true){
                        this.$router.push('/apps/tasks/task/'+row['itemId']);
                    }else{
                        this.$router.push('/apps/docs/detail/'+row['docId']);
                    }
                });
            e.stopPropagation();
        },
        toCreate(docType){
            this.$router.push("/apps/docs/create/"+docType)
        },
        selected({row}){
            if(row.itemState==='CREATED'){
                this.preViewVisable = true;
                this.previewParams  = {
                    mode: "detail",
                    classify:'bpmTask',
                    taskId:row.itemId
                }
            }
        },
        previewClose(){
            this.$refs.layout.grid().clearCurrentRow();
        }
    },
    mounted() {
    }
}
</script>

<style lang="scss" scoped>
</style>
