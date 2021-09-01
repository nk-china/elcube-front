<template>
    <nk-query-layout
        ref="layout"
        title="单据"
        sub-title="单据管理"
        :search-items-default="searchItemsDefault"
        :search-items-more-def="searchItemsMoreDef"
        :dataTableColumns="columns"
        save-as-source="$docs"
        @change="search"
        @click="selected"
    >
        <a-button-group slot="action">
        </a-button-group>

        <div slot="content">
        </div>

        <a-button-group slot="action" v-if="creatableDocTypes && creatableDocTypes.length">
            <a-dropdown :trigger="['click']" placement="bottomRight">
                <a-menu slot="overlay" >
                    <a-menu-item v-for="docDef in creatableDocTypes" :key="docDef.docType" @click="toCreate(docDef.docType)">
                        <a-icon type="file" />{{docDef.docType}} | {{docDef.docName}}
                    </a-menu-item>
                </a-menu>
                <a-button type="primary"> <a-icon type="file-add" /> <a-icon style="margin-left: 10px;" type="down" /> </a-button>
            </a-dropdown>
        </a-button-group>

        <nk-page-preview :params="previewParams" v-model="previewVisible"></nk-page-preview>

    </nk-query-layout>
</template>

<script>
import NkUtil from "../../utils/NkUtil";
import NkPagePreview from "./NkPagePreview";

const classifies = [
    {value:'TRANSACTION',label:'交易'},
    {value:'PARTNER',label:'交易伙伴'}
];

export default {
    components: {NkPagePreview},
    data(){
        return {
            creatableDocTypes:[],
            columns:[
                { type: 'seq',            title: '#',         width: '36'},
                { field: 'classify',      title: '分类',       width: '8%',  sortable:true,formatter:['nkFromList',classifies] },
                { field: 'docTypeDesc',   title: '单据类型',    width: '15%', sortable:true },
                { field: 'docName',       title: '名称',       width: '20%', sortable:true, params:{ orderField: 'docName.original' }},
                { field: 'partnerName',   title: '交易伙伴',    width: '20%', sortable:true, params:{ orderField: 'partnerName.original' }},
                { field: 'docStateDesc',  title: '状态',       width: '10%', sortable:true},
                { field: 'updatedTime',   title: '更新时间',    width: '10%', sortable:true,formatter:'nkDatetimeFriendly' },
                { type: 'html',           title: 'ACTION',    width: '7%', formatter:['docLink']},
            ],
            searchItemsDefault:[
                {
                    name:'业务分类',
                    field:'classify',
                    component:'nk-search-options-single',
                    agg:true,
                    formatter: ['nkFromList',classifies]
                },
                {
                    name:'单据类型',
                    field:'docTypeDesc',
                    component:'nk-search-options-multiple',
                    min:300,
                    agg:true
                },
                {
                    name:'更新时间',
                    field:'updatedTime',
                    component:'nk-search-options-date-range',
                    placeholder:'请选择'
                },
                // {
                //     name:'更新时间',
                //     field:'updatedTime',
                //     component:'nk-search-options-number-range',
                //     placeholderFrom:'从',
                //     placeholderTo:'到',
                //     from:Number.MIN_SAFE_INTEGER,
                //     to:Number.MAX_SAFE_INTEGER
                // },
                {
                    name:'交易伙伴',
                    field:'partnerName',
                    component:'nk-search-options-text',
                    placeholder:'请输入关键字'
                },
                {
                    name:'关键字',
                    field:'keyword',
                    component:'nk-search-options-text',
                    placeholder:'请输入关键字'
                },
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
                },
                {
                    name:'状态',
                    field:'docStateDesc',
                    component:'nk-search-options-single',
                    defaulltOpen:true,
                    min:220,
                    agg:true,
                    condition(params){
                        return params.docTypeDesc && params.docTypeDesc.length;
                    }
                }
            ],
            previewParams: {},
            previewVisible: false
        }
    },
    created() {

        this.$http.get("/api/doc/entrance?classify=")
            .then(res=>{
                this.creatableDocTypes = res.data;
            });
    },
    methods:{
        search(params){
            this.$http.postJSON("/api/doc/list",NkUtil.toEsParams(params,this.preCondition,true))
                .then((res)=>{
                    this.$emit("setTab","单据");
                    if(this.$refs.layout)
                        this.$refs.layout.setData(res.data)
                });
        },
        toCreate(docType){
            this.$router.push("/apps/docs/create/"+docType)
        },
        selected({row, $event}){
            if($event.target.tagName!=='A') {
                this.previewVisible = true;
                this.previewParams = {
                    mode: "detail",
                    classify: row.classify,
                    docId: row.docId
                }
            }
        }
    },
    mounted() {
    }
}
</script>

<style lang="scss" scoped>
</style>
