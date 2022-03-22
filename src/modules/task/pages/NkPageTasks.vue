<!--
	This file is part of ELCube.
	ELCube is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCube is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
-->
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

        <nk-page-preview :params="previewParams" :visible.sync="preViewVisable" @close="previewClose"></nk-page-preview>

    </nk-query-layout>
</template>

<script>
import NkPagePreview from "../../docengine/page/NkPagePreview";

function formatterTaskState(e){
    e = e.cellValue || e;
    switch (e){
        case 'create':  return '待办';
        case 'complete':return '办结';
        case 'delete':  return '取消';
        default: return e;
    }
}
export default {
    components: {NkPagePreview},
    data(){
        return {
            columns:[
                { type: 'seq',            title: '#',         width: '5%'},
                { field: 'docTypeDesc',   title: '单据类型',    width: '15%', sortable:true },
                { field: 'taskName',      title: '任务名称',    width: '20%', sortable:true },
                { field: 'partnerName',   title: '交易伙伴',    width: '20%', sortable:true,params:{ orderField: 'partnerName.original' }},
                { field: 'taskState',     title: '状态',       width: '10%', sortable:true,formatter: formatterTaskState },
                { field: 'taskStartTime', title: '开始时间',    width: '10%', sortable:true,formatter:'nkDatetimeFriendly' },
                { field: 'taskEndTime',   title: '结束时间',    width: '10%', sortable:true,formatter:'nkDatetimeFriendly' },
                {                         title: '操作',       width: '10%',
                    slots: { default: ({row},h) => {
                            return [h(
                                'nk-doc-link',
                                {props:{doc: row}},
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
                    field:'taskState',
                    component:'nk-search-options-single',
                    min:220,
                    agg:true,
                    defaultValue:{term: { taskState:'create'}},
                    formatter:formatterTaskState,
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
    methods:{
        search(params){
            this.$http.postJSON("/api/task/tasks",params)
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
            this.preViewVisable = true;
            this.previewParams  = {
                mode: "detail",
                docId:row.docId
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

<style lang="less" scoped>
</style>
