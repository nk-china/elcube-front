<template>
    <nk-page-layout
        ref="layout"
        title="数据发现"
        sub-title="自助数据分析工具"
    >
        <div v-if="saveAsSource && saveAs.list&& saveAs.list.length" slot="content" style="display: flex;align-items: flex-start">
            <label style="margin-right: 10px;width: 6.5em;flex-shrink: 0;line-height: 26px;">已保存的统计: </label>
            <div style="line-height: 26px;">
                <a-tag v-for="item in saveAs.list" :key="item.id"
                       closable
                       @click="saveAsClick(item)"
                       @close="saveAsDelete(item)"
                >
                    {{item.name}}
                </a-tag>
            </div>
        </div>

        <a-layout >
            <a-layout-sider theme="light" width="240" style="margin-right: 20px">
                <a-list bordered :data-source="listedFields"  size="small" class="fieldList" style="height: 100%;border-radius: 0;border-color: #e8e8e8">
                    <a-list-item slot="renderItem" slot-scope="item" class="field" :class="item.selected&&'selected'">
                        <a-tag v-if="item.aggregatable" color="#108ee9" class="tag">A</a-tag>
                        {{ item.name }}
                        <div class="control">
                            <a-button type="link" @click="addField(item.name)"><a-icon type="plus" /></a-button>
                            <a-button type="link" @click="addFilter(item.name)"><a-icon type="filter" /></a-button>
                            <a-button v-if="item.sortable"     type="link" @click="addSort(item.name)"><a-icon type="sort-ascending" /></a-button>
                        </div>
                    </a-list-item>
                    <div slot="header">
                        <a-input v-model="filterListedField" placeholder="过滤字段" allow-clear></a-input>
                    </div>
                </a-list>
            </a-layout-sider>
            <a-layout-content>
                <a-card>
                    <a-alert type="error" v-if="error.length" banner style="margin-bottom: 15px;" >
                        <p v-for="(msg,index) in error" :key="index" slot="message" style="margin-bottom: 0;line-height: 20px;">{{index+1}}.{{msg}}</p>
                    </a-alert>
                    <nk-form :col="1" class="form-content">
                        <template v-if="queryBuilder.custom">
                            <nk-form-item title="SQL">
                                <a-textarea v-model="queryBuilder.sql" :rows="6" @change="$set(queryBuilder,'customLock',true)"></a-textarea>
                            </nk-form-item>
                            <nk-form-item>
                                <a v-if="!queryBuilder.customLock" @click="custom(false)">切换到普通模式</a>
                                <a v-else @click="queryBuilder = {
                                        custom:false,
                                        index:undefined,
                                        fields:[],
                                        filter:[],
                                        sorted:[],
                                        chart:undefined
                                    }">清空并退出高级模式</a>
                            </nk-form-item>
                            <nk-form-item>
                                <a-button class="selected-item" type="primary" @click="runSql"><a-icon type="play-circle" /></a-button>
                                <a-button class="selected-item" type="default" @click="saveAs.visible=true"><a-icon type="save" />...</a-button>
                            </nk-form-item>
                        </template>
                        <template v-else>
                            <nk-form-item title="数据集">
                                <a-select v-model="queryBuilder.index" class="selected-item" style="width: 200px;" @change="indexChange($event)" :dropdownMatchSelectWidth="false">
                                    <a-select-option v-for="item in dataSources" :key="item.name">
                                        <a-icon :component="icon['Icon'+item.type]" />{{item.name}}
                                    </a-select-option>
                                </a-select>
                                <a-button-group class="selected-item">
                                    <a-button type="primary" @click="runSql" :disabled="!(!error.length && queryBuilder.index)"><a-icon type="play-circle" /></a-button>
                                    <a-button type="default" :disabled="!(queryBuilder.index && queryBuilder.fields.length)"><a-icon type="export" /></a-button>
                                </a-button-group>
                                <a-button class="selected-item" type="default" @click="saveAs.visible=true" :disabled="!(queryBuilder.index && queryBuilder.fields.length)"><a-icon type="save" />...</a-button>
                            </nk-form-item>
                            <nk-form-item title="维度" v-if="hasGroupOrAgg || groupFields.length">
                                <span class="selected-item empty" v-if="!groupFields.length"></span>
                                <a-button-group class="selected-item value" v-for="(item,index) in groupFields" :key="index">
                                    <a-button @click="editField(item)" :type="item._error?'danger':'default'">
                                        <span class="tag ant-tag-red" v-if="item.group">G</span>
                                        <span class="tag ant-tag-orange" v-if="item.aggregation">A</span>
                                        <span class="tag ant-tag-purple" v-if="item.having">H</span>
                                        {{ item.$format.alias }}
                                    </a-button>
                                    <a-button @click="removeFrom(item,queryBuilder.fields)" :type="item._error?'danger':'default'">
                                        <a-icon type="close" />
                                    </a-button>
                                </a-button-group>

                                <a-select class="selected-item" v-model="selectedValue" style="width: 30px;" :dropdownMatchSelectWidth="false" @select="addField">
                                    <a-select-option v-for="field in availableFields" :key="field.name">{{field.name}}</a-select-option>
                                </a-select>
                            </nk-form-item>
                            <nk-form-item title="指标" v-if="hasGroupOrAgg || aggFields.length">
                                <span class="selected-item empty" v-if="!aggFields.length"></span>
                                <a-button-group class="selected-item value" v-for="(item,index) in aggFields" :key="index">
                                    <a-button @click="editField(item)" :type="item._error?'danger':'default'">
                                        <span class="tag ant-tag-red" v-if="item.group">G</span>
                                        <span class="tag ant-tag-orange" v-if="item.aggregation">A</span>
                                        <span class="tag ant-tag-purple" v-if="item.having">H</span>
                                        {{ item.$format.alias }}
                                    </a-button>
                                    <a-button @click="removeFrom(item,queryBuilder.fields)" :type="item._error?'danger':'default'">
                                        <a-icon type="close" />
                                    </a-button>
                                </a-button-group>

                                <a-select class="selected-item" v-model="selectedValue" style="width: 30px;" :dropdownMatchSelectWidth="false" @select="addField">
                                    <a-select-option v-for="field in availableFields" :key="field.name">{{field.name}}</a-select-option>
                                </a-select>
                            </nk-form-item>
                            <nk-form-item title="字段" v-if="!hasGroupOrAgg || simpleFields.length">
                                <span class="selected-item empty" v-if="!simpleFields.length"></span>
                                <a-button-group class="selected-item value" v-for="(item,index) in simpleFields" :key="index">
                                    <a-button @click="editField(item)" :type="item._error?'danger':'default'">
                                        <span class="tag ant-tag-red" v-if="item.group">G</span>
                                        <span class="tag ant-tag-orange" v-if="item.aggregation">A</span>
                                        <span class="tag ant-tag-purple" v-if="item.having">H</span>
                                        {{ item.$format.alias }}
                                    </a-button>
                                    <a-button @click="removeFrom(item,queryBuilder.fields)" :type="item._error?'danger':'default'">
                                        <a-icon type="close" />
                                    </a-button>
                                </a-button-group>

                                <a-select class="selected-item" v-model="selectedValue" style="width: 30px;" :dropdownMatchSelectWidth="false" @select="addField">
                                    <a-select-option v-for="field in availableFields" :key="field.name">{{field.name}}</a-select-option>
                                </a-select>
                            </nk-form-item>
                            <nk-form-item title="条件过滤">

                                <span class="selected-item empty" v-if="!queryBuilder.filter.length && !havingFields.length"></span>

                                <a-button-group class="selected-item value" v-for="(item,index) in filterFields" :key="index">
                                    <a-button @click="editFilter(item)">
                                        <span class="tag ant-tag-cyan">W</span>
                                        {{ item.$format.where }}
                                    </a-button>
                                    <a-button @click="removeFrom(item,queryBuilder.filter)">
                                        <a-icon type="close" />
                                    </a-button>
                                </a-button-group>

                                <a-button-group class="selected-item value" v-for="(item,index) in havingFields" :key="'h'+index">
                                    <a-button @click="editField(item)">
                                        <span class="tag ant-tag-purple">H</span>
                                        {{ item.$format.having }}
                                    </a-button>
                                    <a-button @click="removeHaving(item)">
                                        <a-icon type="close" />
                                    </a-button>
                                </a-button-group>


                                <a-select class="selected-item" v-model="selectedValue" style="width: 30px;" :dropdownMatchSelectWidth="false" @select="addFilter">
                                    <a-select-option v-for="field in availableFields" :key="field.name">{{field.name}}</a-select-option>
                                </a-select>
                            </nk-form-item>
                            <nk-form-item title="排序">

                                <span class="selected-item empty" v-if="!queryBuilder.sorted.length"></span>
                                <a-button-group class="selected-item value" v-for="(item,index) in sortedFields" :key="index">
                                    <a-button @click="changeSort(item)" :type="item._error?'danger':'default'">
                                        <a-icon v-if="item.order==='ASC'" type="sort-ascending" />
                                        <a-icon v-else type="sort-descending" />
                                        {{ item.name }}
                                    </a-button>
                                    <a-button @click="removeFrom(item,queryBuilder.sorted)" :type="item._error?'danger':'default'">
                                        <a-icon type="close" />
                                    </a-button>
                                </a-button-group>

                                <a-select class="selected-item" v-model="selectedValue" style="width: 30px;" :dropdownMatchSelectWidth="false" @change="addSort">
                                    <a-select-option v-for="field in sortableFields" :key="field.name">{{field.name}}</a-select-option>
                                </a-select>
                            </nk-form-item>

                            <nk-form-item>
                                <a @click="custom">切换到高级模式</a>
                                <a v-if="gridData && !queryBuilder.chart" @click="setupChart" style="margin-left: 10px;">数据透视</a>
                                <a v-if="gridData &&  queryBuilder.chart" @click="queryBuilder.chart=undefined" style="margin-left: 10px;">移除数据透视</a>
                            </nk-form-item>
                        </template>
                    </nk-form>

                    <component v-if="queryBuilder.chart && queryBuilder.chart.component && gridData"
                               :is="queryBuilder.chart.component"
                               :config.sync="queryBuilder.chart"
                               :editable="true"
                               :default-data="gridData"
                               :column-defs="gridColumns"
                               style="height: 300px;">
                    </component>
                    <vxe-grid
                        ref="grid"
                        auto-resize
                        resizable
                        highlight-hover-row
                        show-header-overflow="tooltip"
                        show-overflow="tooltip"
                        size="mini"
                        border="full"
                        max-height="500"
                        :columns="gridColumns"
                        :data="gridData"
                        :loading="loading"
                        :sort-config="{trigger: 'cell', remote: true, defaultSort: {field: 'age', order: 'desc'}, orders: ['desc', 'asc', null]}"
                    ></vxe-grid>
                </a-card>
            </a-layout-content>
        </a-layout>


        <a-modal v-model="modalEdit.visible"
                 centered
                 :title="'字段:'+editItem.name"
                 @ok="modalEdit.ok"
                 :okButtonProps="{props: {disabled: modalEditValidate} }">
            <nk-form :col="1">
                <nk-form-item title="字段">{{editItem.name}}</nk-form-item>
                <nk-form-item title="类型">{{editItem.type}}</nk-form-item>

                <template v-if="modalEditDefine">
                    <nk-form-item v-for="item in modalEditDefine" :key="item.key" :title="item.label||item.key">
                        <component :is="item.type"
                                   v-model="editItem[item.key]"
                                   :mode="item.mode"
                                   :options="item.options"
                                   :style="item.class"
                        ></component>
                    </nk-form-item>
                </template>
            </nk-form>
        </a-modal>

        <a-modal v-model="saveAs.visible" centered title="请输入备注" @ok="saveAsPost" :confirm-loading="saveAs.confirmLoading">
            <a-input v-model="saveAs.name" placeholder="请输入搜索备注，便于后期使用"></a-input>
        </a-modal>

        <a-modal v-model="modalAvailableCards.visible" title="请选择图表模版">
            <a-list bordered="" :data-source="modalAvailableCards.cards" size="small">
                <a-list-item slot="renderItem" slot-scope="item">
                    {{item.name}}
                    <a slot="actions" @click="selectChart(item)">选择</a>
                </a-list-item>
            </a-list>
            <template slot="footer">
                <a-button key="back" @click="modalAvailableCards.visible=false">
                    关闭
                </a-button>
            </template>
        </a-modal>

    </nk-page-layout>
</template>

<script>

import NkNumberRange from "./NkNumberRange";
import NkDateRange from "./NkDateRange";
import NkInputRange from "./NkInputRange";
import ElasticSearch from "./NkSqlDescription_ElasticSearch";
import ClickHouse from "./NkSqlDescription_ClickHouse";

import IconElasticSearch from "./IconElasticSearch";
import IconClickHouse from "./IconClickHouse";

const dataSourceDialects = {ElasticSearch,ClickHouse};

export default {
    components:{
        NkNumberRange,
        NkDateRange,
        NkInputRange
    },
    provide(){
        return {
            mode: 'analyse'
        };
    },
    filters:{
    },
    data(){
        return {
            dataSources:[],
            dialect:undefined,
            icon:{
                IconElasticSearch,
                IconClickHouse,
            },

            modalEdit:{
                visible:false,
                define:undefined,
                ok(){}
            },


            loading:false,

            queryBuilder:{
                custom:false,
                index:undefined,
                fields:[],
                filter:[],
                sorted:[],
                chart:undefined
            },

            availableFields:[],

            selectedValue:undefined,
            editSource:-1,
            editItem:{},

            modalFilterVisible:false,
            modalFilterOperators:[],

            modalFieldVisible:false,
            filterListedField:undefined,

            data:{},

            modalAvailableCards:{
                visible:false,
                cards:[]
            },

            saveAsSource:"NK$DataAnalyse",
            saveAs: {
                visible: false,
                name: undefined,
                confirmLoading: false,
                list: []
            },
        }
    },
    computed:{
        modalEditDefine(){
            return this.modalEdit.define
                && Object.keys(this.modalEdit.define)
                    .filter(key=>!key.startsWith("$"))
                    .map(key=>{

                        const item = Object.assign({key},this.modalEdit.define[key]);
                        item.visible = item.visible === undefined || item.visible;

                        Object.keys(item).forEach((key)=>{
                            if(typeof item[key] === 'function'){
                                item[key] = item[key].call(this, this.editItem);
                            }
                        });

                        return item;
                    })
                    .filter(item=>item.visible);
        },
        modalEditValidate(){
            return this.modalEditDefine && !!this.modalEditDefine.find(item=>{
                if(item.required===undefined||item.required){
                    const value = this.editItem[item.key];
                    if(!value){
                        return true;
                    }else if(value instanceof Array){
                        return !(value.length&&!value.filter(e=>!e).length);
                    }else{
                        return !value;
                    }
                }
            });

        },
        gridColumns(){
            return this.data.columns && this.data.columns.map(i=>{
                return {
                    // 用于vxe-table下拉菜单
                    title:i.name,
                    field:i.name,
                    // 用于a-select下拉菜单
                    label:i.name,
                    value:i.name
                };
            });
        },
        gridData(){
            return this.data.list;
        },
        hasGroupOrAgg(){
            return !!this.groupAggFields.length;
        },
        listedFields(){
            const filter = this.filterListedField && this.filterListedField.trim();
            return this.availableFields
                .filter(i=>{
                    return !filter || i.name.indexOf(filter)>-1;
                })
                .map(i=>{
                    i.sortable = i.aggregatable && !this.hasGroupOrAgg;
                    i.selected = !!this.queryBuilder.fields.find(f=>f.name===i.name);
                    return i;
                });
        },
        aggregatableFields(){
            return this.availableFields.filter(i=>i.aggregatable);
        },
        sortableFields(){
            if(this.hasGroupOrAgg){
                return this.groupAggFields.map(i=>{
                    return {name:i.$format.alias}
                });
            }
            return this.aggregatableFields.map(i=>{
                return {name:i.name}
            });
        },
        queryFields(){
            return this.queryBuilder.fields;
        },
        groupAggFields(){
            return this.queryFields.filter(i=>i.group||i.aggregation)
                .map(i=>{
                    if(this.queryFields.filter(j=>j.$format.alias===i.$format.alias).length>1){
                        this.$set(i,'_error',`${i.$format.alias} 字段重复`);
                    }else{
                        delete i._error;
                    }
                    return i;
                });
        },
        groupFields(){
            return this.queryFields.filter(i=>i.group);
        },
        aggFields(){
            return this.queryFields.filter(i=>i.aggregation);
        },
        havingFields(){
            return this.queryFields.filter(i=>i.aggregation && i.having);
        },
        simpleFields(){
            return this.queryFields.filter(i=>!i.aggregation && !i.group)
                .map(i=>{
                    if(this.hasGroupOrAgg){
                        this.$set(i,'_error',`${i.name} 字段不可用`);
                    }else{
                        delete i._error;
                    }
                    return i;
                });
        },
        filterFields(){
            return this.queryBuilder.filter;
        },
        sortedFields(){
            return this.queryBuilder.sorted.map(i=>{

                delete i._error;
                if(this.hasGroupOrAgg){
                    if(!this.groupAggFields.find(f=>f.$format.alias===i.name)){
                        this.$set(i,'_error',`${i.name} 排序不可用`);
                    }
                }else{
                    if(!this.aggregatableFields.find(f=>f.name===i.name)){
                        this.$set(i,'_error',`${i.name} 排序不可用`);
                    }
                }
                return i;
            });
        },
        error(){
            return [
                ...this.groupAggFields.filter(i=>i._error).map(i=>i._error),
                ...this.simpleFields.filter(i=>i._error).map(i=>i._error),
                ...this.sortedFields.filter(i=>i._error).map(i=>i._error),
            ];
        },
        sql(){

            let fields = this.queryBuilder.fields.map(item=>item.$format.select).join(',\n       ');
            let filter = this.queryBuilder.filter.map(item=>item.$format.where).join(' AND ');
            let groups = this.groupFields.map(item=>item.$format.group).join(', ');
            let having = this.havingFields.map(item=>item.$format.having).join(' AND ');
            let sorted = this.queryBuilder.sorted.map(item=>item.$format).join(', ');

            let sql = [
                `SELECT ${fields||'*'}`,
                `  FROM "${this.queryBuilder.index||'<document>'}"`
            ];

            if(filter.length){
                sql.push(` WHERE ${filter}`);
            }
            if(groups.length){
                sql.push(` GROUP BY ${groups}`);
            }
            if(having.length){
                sql.push(`HAVING ${having}`);
            }
            if(sorted.length){
                sql.push(` ORDER BY ${sorted}`);
            }

            return sql.join('\n');
        }
    },
    created() {
        this.init();
        this.saveAsGet();
    },
    methods:{
        init(){
            this.$http.get('/api/data/analyse/dataSources')
                .then(res=>this.dataSources=res.data);
        },
        custom(f){
            this.queryBuilder.custom=f;
            if(f)
                this.queryBuilder.sql = this.sql;
        },
        runSql(){
            this.data = {};
            this.loading = true;
            this.queryBuilder.sql = this.queryBuilder.custom?this.queryBuilder.sql:this.sql;
            this.$http.postJSON(`/api/data/analyse/query`,{sql:this.queryBuilder.sql})
                .then(res=>{
                    this.data = res.data;
                })
                .finally(()=>{
                    this.loading = false;
                });
        },
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
                json: JSON.stringify(this.queryBuilder)
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
            this.data = {};
            setTimeout(()=>{
                this.queryBuilder = Object.assign({},JSON.parse(item.json||'{}'));
                this.runSql();
                this.indexChange(this.queryBuilder.index,true);
            },100);
        },
        indexChange(index,keep){
            this.$http.post(`/api/data/analyse/fieldCaps/${index}`)
                .then(res=>{
                    if(!keep){
                        this.queryBuilder = {
                            custom:false,
                            index,
                            fields:[],
                            filter:[],
                            sorted:[],
                            chart:undefined
                        }
                    }
                    this.availableFields = res.data.sort((a,b)=>a.name > b.name ?1:-1);
                    this.filterListedField = undefined;

                    const datasource = this.dataSources.find(i=>i.name===index);
                    this.dialect = dataSourceDialects[datasource.type];
                });
        },
        addField(name){
            const item = Object.assign({},this.availableFields.find(i=>i.name === name));
            this.selectedValue = undefined;
            if(item.aggregatable){
                this.editField(item);
            }else{
                const config = this.dialect.fields[item.type];
                if(!config){
                    item.$format = {
                        alias: name,
                        select: name
                    };
                }else{
                    config.$format(item);
                }
                this.queryBuilder.fields.push(item)
            }
        },
        editField(item){
            this.modalEdit.visible=true;
            this.modalEdit.ok = this.configField;
            this.modalEdit.define = this.dialect.fields[item.type];
            this.editSource = this.queryBuilder.fields.indexOf(item);
            this.editItem = JSON.parse(JSON.stringify(item));
        },
        configField(){

            if(this.modalEdit.define){
                this.modalEdit.define.$format(this.editItem);
            }else{
                this.editItem.$format = {
                    alias: this.editItem.name,
                    select: this.editItem.name
                };
            }

            if(this.editSource===-1){
                this.queryBuilder.fields.push(this.editItem);
            }else{
                this.$set(this.queryBuilder.fields,this.editSource,this.editItem);
            }
            this.modalEdit.visible = false;
        },
        addFilter(name){
            const item = Object.assign({formatted:name},this.availableFields.find(i=>i.name === name));
            this.selectedValue = undefined;
            this.editFilter(item);
        },
        editFilter(item){
            this.modalEdit.visible=true;
            this.modalEdit.ok = this.configFilter;
            this.modalEdit.define = this.dialect.filters[item.type];
            this.editSource = this.queryBuilder.filter.indexOf(item);
            this.editItem = JSON.parse(JSON.stringify(item));
        },
        configFilter(){

            if(this.modalEdit.define){
                this.modalEdit.define.$format(this.editItem);
            }else{
                this.editItem.$format = {
                    where: `${this.editItem.name} IS NOT NULL`,
                };
            }

            if(this.editSource===-1){
                this.queryBuilder.filter.push(this.editItem);
            }else{
                this.$set(this.queryBuilder.filter,this.editSource,this.editItem);
            }
            this.modalEdit.visible = false;
        },
        addSort(name){
            this.queryBuilder.sorted.push({name,order:'ASC',$format:'"'+name+'" ASC'})
            this.selectedValue = undefined;
        },
        changeSort(item){
            item.order = (item.order === 'ASC' ? 'DESC' : 'ASC');
            this.$set(item,'$format','"'+item.name +'" '+ item.order);
        },
        removeFrom(item,from){
            from.splice(from.indexOf(item),1);
        },
        removeHaving(item){
            item.having = undefined;
            delete item.havingValue;
        },
        setupChart(){
            this.$http.get("/api/meter/card/list")
                .then((res)=>{
                    this.modalAvailableCards.cards = res.data;
                    this.modalAvailableCards.visible=true;
                });
            //this.$set(this.queryBuilder,'chart',{});
        },
        selectChart(e){
            this.$set(this.queryBuilder,'chart',{component:e.component,title:e.name});
            this.modalAvailableCards.visible=false;
        }
    },
    mounted() {
    }
}
</script>

<style lang="less" scoped>
::v-deep.form-content{
    .selected-item{
        margin: 2px 10px 2px 0;

        &.value button:nth-child(2){
            padding-left: 7px;
            padding-right: 7px;
        }
        &.error{
            button{
                border-color: #aa2222;
            }
        }
    }
}
::v-deep.fieldList{
    .field{
        white-space:nowrap;
        overflow:hidden;
        text-overflow: ellipsis;

        position: relative;

        &.selected{
            background-color: #e6f7ff;
        }

        .control{
            position: absolute;
            right: 0;
            top: 0;
            line-height: 35px;
            margin: 0 5px;
            background-color: white;
            display: none;
        }

        &:hover .control{
            display: block;
        }

        &.selected:hover .control{
            background-color: #e6f7ff;
        }

        button{
            padding: 0 5px;
        }
    }
}
.empty{
    height: 28px;
    line-height:28px;
    display: inline-block;
    &:after{
        content: "暂无内容";
        color: #999;
    }
}
.tag{
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    padding: 0 3px;
    display: inline-block;
    margin-right: 2px;
    line-height: 16px;
}
.g{
    color: #f5222d;
    background: #fff1f0;
    border: solid 1px #ffa39e;
    border-radius: 4px;
    padding: 0px 2px;
    display: inline-block;
    margin-right: 2px;
}
.h{
    color: #722ed1;
    background: #f9f0ff;
    border: solid 1px #d3adf7;
    border-radius: 4px;
    padding: 0px 2px;
    display: inline-block;
    margin-right: 2px;
}
.a{
    color: #fa8c16;
    background: #fff7e6;
    border: solid 1px #ffd591;
    border-radius: 4px;
    padding: 0px 2px;
    display: inline-block;
    margin-right: 2px;
}
</style>
