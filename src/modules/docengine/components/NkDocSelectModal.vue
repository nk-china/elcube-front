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
    <a-modal v-model="visible" :title="modal.title" :width="modal.width" centered>
        <div slot="footer">
            <a-button @click="visible=false">取消</a-button>
        </div>
        <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }" @submit="formSubmit">
            <nk-search-box style="margin: 10px 10px 0;">
                <component v-for="(item,index) in modal.searchItems"
                           ref="searchItems"
                           :key="index"
                           :is="item.component"
                           :config="item"
                           :option="item.option || aggs[item.field]"
                           @changed="formItemChanged"
                ></component>
                <nk-search-item>
                    <a-button type="primary" html-type="submit"><a-icon type="search" /></a-button>
                    <slot name="buttons"></slot>
                </nk-search-item>
            </nk-search-box>
        </a-form>
        <vxe-table
            auto-resize
            size="mini"
            border=inner
            highlight-hover-row
            highlight-current-row
            header-cell-class-name="headerCellClassName"
            :data="page.list">
            <vxe-table-column   title="#"        type="seq"               width="8%" ></vxe-table-column>
            <vxe-table-column v-for="column in modal.columns"
                              :key="column.field"
                              :title="column.title"
                              :field="column.field"
                              :width="column.width"
                              :header-align="column.align"
                              :align="column.align"
                              :formatter="column.formatter">
            </vxe-table-column>
            <vxe-table-column  title="ACTION" >
                <template v-slot="{ row }">
                    <a @click="selected(row)">选择</a>
                </template>
            </vxe-table-column>
        </vxe-table>

    </a-modal>
</template>

<script>

export default {
    name: "NkModalSelector",
    props:{
        value:Boolean,
        modal:{
            type:Object,
            default(){
                return {
                    title:'选择',
                    width:"60%",
                    postConditions:null,
                    index:'document',
                    searchItems:[
                        {
                            name:'搜索',
                            field:'keyword',
                            component:'nk-search-options-text',
                            placeholder:'请输入关键字'
                        }],
                    columns:[{
                        title:'单据类型',
                        field:'docType',
                        width: '15%'
                    },{
                        title:'名称',
                        field:'docName',
                        width: '25%'
                    },{
                        title:'交易伙伴',
                        field:'partnerName',
                        width: '20%'
                    },{
                        field: 'docStateDesc',
                        title: '状态',
                        width: '20%'
                    }],
                    mappings:[],
                }
            }
        }
    },
    computed:{
        visible:{
            get(){
                return this.value;
            },
            set(value){
                this.$emit("input",value);
            }
        },
        aggs(){
            return this.page.aggs || {}
        }
    },
    data(){
        return {
            valueOld:undefined,
            page:{},
            params : {
                from : 0,
                rows : 10,
                orderField: '_score',
                order: 'desc'
            }
        }
    },
    created() {
    },
    beforeUpdate(){
        if(this.value && this.valueOld!==this.value){
            this.query();
        }
        this.valueOld = this.value;
    },
    methods:{
        query(){
            const aggs = this.modal.searchItems.filter(i=>i.agg).map(i=>i.field);
            const postCondition = this.modal.postCondition;
            const url = `/api/doc/list/${this.modal.index||'document'}`;

            this.$http.postJSON(url,Object.assign({aggs,postCondition},this.params))
                .then(response=>{
                    this.page = response.data;
                });
        },
        selected(row) {
            delete row._XID;
            this.visible = false;
            this.$emit("select",row);
        },
        formSubmit(e){
            e.preventDefault();
            this.query();
        },
        formItemChanged(e){
            if(e.field){
                this.params.conditions = this.params.conditions||{};
                if(e.condition){
                    this.params.conditions[e.field]=e.condition;
                }else{
                    delete this.params.conditions[e.field]
                }

                if(e.trigger){
                    this.params.from = 0;
                    this.query();
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
::v-deep .ant-modal-body{
    padding:0 0;
}
</style>
