<!--
	This file is part of ELCard.
	ELCard is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCard is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <nk-query-layout
        ref="layout"
        title="单据"
        sub-title="单据管理"
        :search-items-default="searchItemsDefault"
        :search-items-more-def="searchItemsMoreDef"
        :dataTableColumns="columns"
        :keyword-field="['docName','partnerName']"
        save-as-source="$docs"
        @change="search"
        @suggest="suggest"
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
                { type:  'seq',                         title: '#',         width: '5%'},
                { field: 'classify',                    title: '分类',       width: '8%',  sortable:true,formatter:['nkFromList',classifies] },
                { field: 'docTypeDesc',                 title: '单据类型',    width: '15%', sortable:true },
                { type:  'html', field: 'docName',       title: '名称',       width: '20%', sortable:true, params:{ orderField: 'docName.original' }},
                { type:  'html', field: 'partnerName',   title: '交易伙伴',    width: '20%', sortable:true, params:{ orderField: 'partnerName.original' }},
                { field: 'docStateDesc',                title: '状态',       width: '12%', sortable:true},
                { field: 'updatedTime',                 title: '更新时间',    width: '13%', sortable:true,formatter:'nkDatetimeFriendly' },
                { type:  'html',                        title: 'ACTION',    width: '7%', formatter:['docLink']},
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
                    min:240,
                    agg:true
                },
                {
                    name:'更新时间',
                    field:'updatedTime',
                    component:'nk-search-options-date-range',
                    placeholder:'请选择'
                },
                {
                    name:'交易伙伴',
                    field:'partnerName',
                    component:'nk-search-options-text',
                    placeholder:'请输入交易伙伴名称'
                },
                {
                    name:'关键字',
                    field:['docName','partnerName','keyword'],
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
        suggest(params){
            this.$http.postJSON(`/api/doc/suggest/document`,params).then((res)=>{
                if(this.$refs.layout){
                    console.log(res.data)
                }
            });
        },
        search(params){
            this.$http.postJSON("/api/doc/list/document",params)
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

<style lang="less" scoped>
</style>
