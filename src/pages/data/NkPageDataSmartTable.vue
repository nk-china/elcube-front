<template>
    <x-nk-page-layout sub-title="数据挖掘与分析" :title="custom.title">

        <slot name="action" slot="action"></slot>

        <div v-if="saveAsSource && saveAs.list&& saveAs.list.length" slot="content" style="display: flex;align-items: flex-start">
            <label style="margin-right: 10px;width: 6.5em;flex-shrink: 0;line-height: 26px;">已保存的检索: </label>
            <div style="line-height: 26px;">
                <a-tag v-for="item in saveAs.list" :key="item.id" :closable="true" @click="saveAsClick(item)" @close="saveAsDelete(item)">
                    {{item.name}}
                </a-tag>
            </div>
        </div>

        <span slot="action">仅下钻条目
            <a-switch v-model="expandOnly"></a-switch>
        </span>

        <a-card>
            <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }" @submit="formSubmit">
                <nk-search-box>
                    <component v-for="(item,index) in config.searchItemsDefault"
                               ref="searchItems"
                               :key="index"
                               :is="item.component"
                               :config="item"
                               :option="item.options"
                               @changed="formItemChanged"
                    ></component>
                    <component v-for="(item) in searchItemsMoreSelected"
                               ref="searchMoreItems"
                               :key="item.field"
                               :is="item.component"
                               :config="item"
                               :option="item.options"
                               :closeable="true"
                               @changed="formItemChanged"
                               @close="searchMoreItemClosed"
                    ></component>
                    <nk-search-item v-if="availableSearchItemsMoreDef && availableSearchItemsMoreDef.length" :min="0">
                        <a-select
                            ref="select"
                            mode="multiple"
                            :maxTagCount="1"
                            class="nk-search-box-more"
                            placeholder="更多条件..."
                            @select="$refs.select.blur()"
                            @change="searchMoreChanged"
                            v-model="searchItemsMoreFields"
                        >
                            <a-select-option v-for="item in availableSearchItemsMoreDef" :key="item.field">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </nk-search-item>
                    <nk-search-item :min="10">
                        <a-button-group class="nk-button">
                            <a-button type="primary" html-type="submit" style="width: 46px;">
                                <a-icon type="search" />
                            </a-button>
                            <a-button type="default" @click="reset({})" style="width: 46px;">
                                <a-icon type="rollback" />
                            </a-button>
                        </a-button-group>
                        <a-button v-if="saveAsSource" class="nk-button" type="default" @click="saveAs.visible=true" style="width: 56px;">
                            <a-icon type="save" />...
                        </a-button>
                    </nk-search-item>
                </nk-search-box>
            </a-form>

            <nk-page-data-smart-table-grid
                ref="grid"
                auto-resize
                resizable
                highlight-hover-row
                :highlight-current-row="false"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                size="mini"
                :max-height="700"
                :border="config.border"
                :columns="columns"
                :data="imitateRow.$$data"
                :loading="loading"
                :expand-only="expandOnly"
                @sort-change="vxeSortChanged"
                @nk-row-drill="search"
                :sort-config="config.sortConfig"
            ></nk-page-data-smart-table-grid>

            <vxe-pager
                v-if="page.page"
                perfect
                size="mini"
                :current-page="page.page"
                :page-size="page.rows"
                :total="page.total"
                :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                @page-change="vxePageChanged" />
        </a-card>

        <a-modal v-model="saveAs.visible" centered title="请输入备注" @ok="saveAsPost" :confirm-loading="saveAs.confirmLoading">
            <a-input v-model="saveAs.name" placeholder="请输入搜索备注，便于后期使用"></a-input>
        </a-modal>
    </x-nk-page-layout>
</template>

<script>
import XNkPageLayout from "../../layout/template/XNkPageLayout";
import NkPageDataSmartTableGrid from "./NkPageDataSmartTableGrid";
import NkUtil from "../../utils/NkUtil";

export default {
    components: {XNkPageLayout,NkPageDataSmartTableGrid},
    data(){
        return {
            custom:{},
            config:{
                $debug:false,
                index:"document",
                postSql:undefined,
                postCondition:undefined,
                searchItemsDefault:[],
                searchItemsMoreDef:[],
                defaultRows:10,
                columns:[],
                sortConfig:undefined,
                border:undefined,
                creatable:undefined,

                preview:false,
                previewParams: {},
                previewVisible: false,
            },

            loading: true,

            saveAsSource:"DataSmartTable",
            page: {},
            imitateRow: {},
            availableSearchItemsMoreDef:[],
            searchItemsMoreSelected:[],
            searchItemsMoreFields:[],

            expandOnly:true,

            params : {
                from : 0,
                rows : this.initRows
            },

            saveAs: {
                visible: false,
                name: undefined,
                confirmLoading: false,
                list: []
            }
        }
    },
    created(){
        this.loadCustom();
    },
    computed:{
        columns(){
            return [{
                type:"expand",
                width:1,
                visible:false,
                slots:{
                    content:"drillExpand"
                }
            },...this.config.columns];
        },
        preSql(){
            return (this.config.postSql instanceof Array) ? this.config.postSql : [this.config.postSql];
        },
    },
    methods:{
        loadCustom(){
            this.$http.get(`/api/webapp/menu/${this.$route.params.id}`)
                .then(res=>{
                    this.custom = res.data;
                    this.$emit("setTab",this.custom.title);

                    const queryLength = Object.keys(this.$route.query).length;
                    if(queryLength){
                        this.$emit("setTab",this.custom.title+"[Filter:"+queryLength+"]");
                    }else{
                        this.$emit("setTab",this.custom.title);
                    }

                    if(this.custom.menuOptions){
                        let options = NkUtil.parseJSON(this.custom.menuOptions);
                        for(let field in options){
                            if(options.hasOwnProperty(field))
                                this.config[field] = options[field];
                        }
                        this.$nextTick(()=>{
                            this.init();
                        })
                    }else{
                        this.$error({
                            title: '初始化失败',
                            content: '自定义的选项错误！',
                        });
                    }

                }).catch((e)=>{
                    console.error(e);
                });
        },
        init(){
            if(this.saveAsSource){
                this.saveAsGet();
            }

            this.page.rows = this.initRows;
            this.params.rows = this.initRows;

            this.searchMoreDefUpdate();
            this.config.searchItemsDefault
                .forEach(item=>{
                    if(item.defaultValue){
                        this.params[item.field]=item.defaultValue;
                    }
                });
            this.formSubmit();
        },
        reset(params){

            if(params){
                this.searchItemsMoreFields = [];
                this.searchItemsMoreSelected = [];
                this.searchMoreDefUpdate();

                for(let field in Object.keys(params.conditions)){
                    let find = this.searchItemsMoreFields.indexOf(field);
                    if(find===-1){
                        let def = this.searchItemsMoreDef.find(def=>def&&def.field===field);
                        if(def){
                            def.doNotOpen = true;
                            this.searchItemsMoreFields.push(field);
                            this.searchItemsMoreSelected.push(def);

                            if(this.availableSearchItemsMoreDef.indexOf(def)===-1)
                                this.availableSearchItemsMoreDef.push(def);
                        }
                    }
                }
                this.$nextTick(()=>{
                    if(this.$refs.searchItems)
                        this.$refs.searchItems    .forEach(item=>{if(item.setValue)item.setValue(params.conditions)});
                    if(this.$refs.searchMoreItems)
                        this.$refs.searchMoreItems.forEach(item=>{if(item.setValue)item.setValue(params.conditions)});
                })
                this.params = Object.assign({from : this.params.from,rows : this.params.rows},params);

            }else{

                this.params = {from : this.params.from,rows : this.params.rows};
                this.searchItemsMoreFields = [];
                this.searchItemsMoreSelected = [];
                this.searchMoreDefUpdate();
            }
            this.search();
        },
        /**
         * event : 触发search的event，如果是第一层，event由外部触发，因此为空
         * parent: 点击drill按钮所在table的上级event，如果点击的是第一层表格，则为空
         */
        search(event,parent){

            let $row            = this.imitateRow;
            let drill           = undefined;
            let step            = 0;
            let sql             = this.preSql;
            let drillable       = true;

            if(parent){
                sql         = parent.row.$$data.sqlList;
                step        = parent.row['$$step']+1;
            }

            if(event){

                const drills        = this.columns.find(c=>c.field === event.column.property).drills;
                const $table        = event.$table;
                      $row          = event.row;
                      drillable     = step < drills.length - 1;

                if($table.getRowExpandRecords().indexOf($row)>-1) {
                    $table.setRowExpand([$row], false);
                    $row.$$data = undefined;
                    return;
                }

                drill = {
                    from: event.column.property,
                    fromValue: event.row[event.column.property],
                    to:drills[step],
                }
            }else{
                this.loading = true;
            }

            this.$http.postJSON(`/api/data/analyse/sql`,Object.assign({sqlList:sql,drill},this.params))
                .then((res)=>{
                    res.data.$$drillable = drillable;
                    this.$set($row,'$$data',        res.data);
                    this.$set($row,'$$step',        step);
                    this.loading = false;

                    if(event){
                        event.$table.setRowExpand([event.row],true);
                    }
                });
        },
        /**
         * 表单提交
         */
        formSubmit(e){
            if(e)e.preventDefault();
            this.$refs.grid.clear();
            this.params.orderField = null;
            this.params.order = null;
            this.params.from = 0;
            this.search();
            return false;
        },
        formItemChanged(e){
            if(e.field){
                this.params.conditions = this.params.conditions||{};
                if(e.condition){
                    this.params.conditions[e.field]=e.condition;
                }else{
                    delete this.params.conditions[e.field]
                }

                this.searchMoreDefUpdate();
                if(e.trigger){
                    this.params.from = 0;
                    this.search();
                }
            }
        },
        selected({row,$event}){
            if($event.target.tagName!=='A'){
                this.previewVisible = true;
                this.previewParams  = {
                    mode: "detail",
                    classify:row.classify,
                    docId:row.docId
                }
            }
        },




        /**
         * 1、更新【更多选项按钮】的下拉列表值，
         * 2、如果被激活的选项组件所对应的选项被清楚的话，就移除选项组件
         */
        searchMoreDefUpdate(){
            this.availableSearchItemsMoreDef = [];
            this.config.searchItemsMoreDef.forEach(item=>{
                if(!item.condition || item.condition(this.params))
                    this.availableSearchItemsMoreDef.push(item);
            });
            for(let i=this.searchItemsMoreSelected.length-1;i>=0;i--){
                let item = this.searchItemsMoreSelected[i];
                if(this.availableSearchItemsMoreDef.indexOf(item)===-1){
                    this.searchMoreItemClosed(item);
                }
            }
        },
        /**
         * 【更多选项按钮】被点击事件
         * 1、增加或移除 选项组件
         * 2、执行搜索
         */
        searchMoreChanged(){
            let selected = [];
            this.searchItemsMoreFields.forEach(field=>{
                const items = this.availableSearchItemsMoreDef.filter(item=>item.field===field);
                if(items && items.length)
                    selected.push(items[0]);
            })
            this.searchItemsMoreSelected = selected;
            this.search();
        },
        /**
         * 【选项组件】点击关闭事件
         * 1、移除自己
         * 2、执行搜索
         */
        searchMoreItemClosed(e){

            let index = this.searchItemsMoreFields.indexOf(e.field);
            if(index>-1)
                this.searchItemsMoreFields.splice(index, 1);

            index = this.searchItemsMoreSelected.indexOf(e)
            if(index>-1){
                this.searchItemsMoreSelected.splice(index, 1);
                delete this.params[e.field];
                this.search();
            }
        },
        // 排序跳转
        vxeSortChanged({column,property,order}){
            if(this.sortConfig && this.sortConfig.remote){
                this.params.orderField = order===null?null:((column.params&&column.params.orderField)||property);
                this.params.order = order;
                this.search();
            }
        },
        // 页码跳转
        vxePageChanged(e){
            const from = (e.currentPage-1) * e.pageSize;
            const rows = e.pageSize;

            if(from + rows > 10000){
                this.$message.error("查询记录数不能超过10000条");
                this.$emit("error","查询记录数不能超过10000条");
                this.page.page = this.params.from / this.params.rows + 1;
            }else{
                this.params.from = from;
                this.params.rows = e.pageSize;

                this.search();
            }
        },


        // 保存搜索
        saveAsGet(){
            this.$http.get("/api/webapp/user/saved/query/list?source="+this.saveAsSource)
                .then((response)=>{
                    this.saveAs.list = response.data;
                })
        },
        saveAsPost(){
            this.saveAs.confirmLoading = true;
            this.$http.postJSON("/api/webapp/user/saved/query/create",{
                name: this.saveAs.name || '未命名搜索',
                source: this.saveAsSource,
                json: JSON.stringify(this.params)
            }).then((response)=>{
                this.saveAs.list.push(response.data);
            }).finally(()=>{
                this.saveAs.name=undefined;
                this.saveAs.confirmLoading = false;
                this.saveAs.visible = false;
            })
        },
        saveAsDelete(item){
            this.$http.post("/api/webapp/user/saved/query/delete?queryId="+item.id)
                .then(()=>{
                    this.saveAs.list.splice(this.saveAs.list.indexOf(item),1);
                })
        },
        saveAsClick(item){
            this.reset(JSON.parse(item.json||'{}'));
        }
    }
}
</script>

<style lang="less" scoped>

.list-actions{
    margin: 0 0 8px;
    .btn + .btn{
        margin: 0 0 12px 6px;
    }
}

.nk-search-divider{
    font-size: 10px;
    font-weight: 400;
    color: #ccc;
    margin: 4px 0 10px;
}

::v-deep.nk-search-box-more{
    width:100px;
    font-size: 12px;
    .ant-select-selection--multiple,
    .ant-select-selection--multiple:focus,
    .ant-select-selection--multiple:active{
        cursor: pointer !important;
        border: none !important;
    }
    .ant-select-selection__placeholder{
        display: block !important;
        color: rgba(0, 0, 0, 0.65);
    }
    .ant-select-selection__placeholder+ul{
        height: 0;
        overflow: hidden;
    }
}
.nk-button+.nk-button{
    margin-left: 10px;
}
::v-deep .highlight{
    color: rgb(241, 75, 69);
}
</style>
