<template>
    <nk-page-layout
        ref="layout"
        title="数据统计分析工具"
        sub-title="自定义数据统计"
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
                                <a-textarea v-model="queryBuilder.sql" :rows="6"></a-textarea>
                            </nk-form-item>
                            <nk-form-item>
                                <a @click="custom(false)">切换到普通模式</a>
                            </nk-form-item>
                            <nk-form-item>
                                <a-button class="selected-item" type="primary" @click="runSql"><a-icon type="play-circle" /></a-button>
                                <a-button class="selected-item" type="default" @click="saveAs.visible=true"><a-icon type="save" />...</a-button>
                            </nk-form-item>
                        </template>
                        <template v-else>
                            <nk-form-item title="数据集">
                                <a-select v-model="queryBuilder.index" class="selected-item" style="width: 200px;" @change="indexChange($event)">
                                    <a-select-option key="document">document</a-select-option>
                                    <a-select-option key="doc-ext">doc-ext</a-select-option>
                                    <a-select-option key="document-custom">document-custom</a-select-option>
                                </a-select>
                                <a-button-group class="selected-item">
                                    <a-button type="primary" @click="runSql" :disabled="!(queryBuilder.index)"><a-icon type="play-circle" /></a-button>
                                    <a-button type="default" :disabled="!(queryBuilder.index && queryBuilder.fields.length)"><a-icon type="export" /></a-button>
                                </a-button-group>
                                <a-button class="selected-item" type="default" @click="saveAs.visible=true" :disabled="!(queryBuilder.index && queryBuilder.fields.length)"><a-icon type="save" />...</a-button>
                            </nk-form-item>
                            <nk-form-item title="维度" v-if="hasGroupOrAgg || groupFields.length">
                                <span class="selected-item empty" v-if="!groupFields.length"></span>
                                <a-button-group class="selected-item value" v-for="(item,index) in groupFields" :key="index">
                                    <a-button @click="editField(item)">
                                        <span class="tag ant-tag-red" v-if="item.groupBy">G</span>
                                        <span class="tag ant-tag-orange" v-if="item.agg">A</span>
                                        <span class="tag ant-tag-purple" v-if="item.having">H</span>
                                        {{ item.formatted }}
                                    </a-button>
                                    <a-button @click="removeFrom(item,queryBuilder.fields)">
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
                                    <a-button @click="editField(item)">
                                        <span class="tag ant-tag-red" v-if="item.groupBy">G</span>
                                        <span class="tag ant-tag-orange" v-if="item.agg">A</span>
                                        {{ item.formatted }}
                                    </a-button>
                                    <a-button @click="removeFrom(item,queryBuilder.fields)">
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
                                        <span class="tag ant-tag-red" v-if="item.groupBy">G</span>
                                        <span class="tag ant-tag-orange" v-if="item.agg">A</span>
                                        <span class="tag ant-tag-purple" v-if="item.having">H</span>
                                        {{ item.formatted }}
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

                                <span class="selected-item empty" v-if="!queryBuilder.filter.length"></span>
                                <a-button-group class="selected-item value" v-for="(item,index) in filterFields" :key="index">
                                    <a-button @click="editFilter(item)">
                                        <span class="tag ant-tag-cyan">W</span>
                                        {{ item.formatted }}
                                    </a-button>
                                    <a-button @click="removeFrom(item,queryBuilder.filter)">
                                        <a-icon type="close" />
                                    </a-button>
                                </a-button-group>

                                <a-button-group class="selected-item value" v-for="(item,index) in havingFields" :key="'h'+index">
                                    <a-button @click="editField(item)">
                                        <span class="tag ant-tag-purple">H</span>
                                        {{ item.havingFormatted }}
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

        <a-modal v-model="modalFieldVisible" centered :title="'字段:'+editItem.name" @ok="configField" :okButtonProps="{props: {
            disabled: !!(
                editItem.groupBy &&
                    !((editItemIsNumber && editItem.interval)||(editItemIsDate && editItem.interval && editItem.intervalUnit))
                    ||(editItem.having  && !editItem.havingValue)
            )
        } }">
            <nk-form :col="1">
                <nk-form-item title="字段">{{editItem.name}}</nk-form-item>
                <nk-form-item title="类型">{{editItem.type}}</nk-form-item>
                <nk-form-item title="别名">
                    <a-input v-model="editItem.alias">{{editItem.alias}}</a-input>
                </nk-form-item>
                <nk-form-item title="分组" v-if="editItem.aggregatable">
                    <a-switch v-model="editItem.groupBy"></a-switch>
                </nk-form-item>
                <nk-form-item title="周期" v-if="editItem.groupBy && (editItemIsDate||editItemIsNumber)">
                    <a-input-number v-model="editItem.interval" :step="1" :precision="0" :min="1" :max="60"></a-input-number>
                </nk-form-item>
                <nk-form-item title="单位" v-if="editItem.groupBy && editItemIsDate">
                    <a-select style="width: 150px;" v-model="editItem.intervalUnit">
                        <a-select-option key="YEAR"> YEAR </a-select-option>
                        <a-select-option key="MONTH"> MONTH </a-select-option>
                        <a-select-option key="DAY"> DAY </a-select-option>
                    </a-select>
                </nk-form-item>
                <nk-form-item title="聚合" v-if="editItem.aggregatable && !editItem.groupBy">
                    <a-select style="width: 150px;" v-model="editItem.agg" @change="$set(editItem,'having',undefined)">
                        <a-select-option key="" > 无 </a-select-option>
                        <a-select-option key="COUNT({})" v-if="!editItemIsDate"> COUNT </a-select-option>
                        <a-select-option key="COUNT(DISTINCT {})" v-if="!editItemIsDate"> COUNT(DISTINCT) </a-select-option>
                        <a-select-option key="AVG({})" v-if="editItemIsNumber"> AVG </a-select-option>
                        <a-select-option key="SUM({})" v-if="editItemIsNumber"> SUM </a-select-option>
                        <a-select-option key="MAX({})" v-if="editItemIsNumber || editItemIsDate"> MAX </a-select-option>
                        <a-select-option key="MIN({})" v-if="editItemIsNumber || editItemIsDate"> MIN </a-select-option>
                        <a-select-option key="FIRST({})"> FIRST </a-select-option>
                        <a-select-option key="LAST({})"> LAST </a-select-option>
                    </a-select>
                </nk-form-item>
                <nk-form-item title="HAVING" v-if="editItem.aggregatable && editItem.agg && ['FIRST({})','LAST({})'].indexOf(editItem.agg)===-1">
                    <a-select style="width: 150px;" v-model="editItem.having" @change="$set(editItem,'havingValue',undefined)">
                        <a-select-option v-for="i in numberInputHaving" :key="i.k"> {{ i.v||i.k }} </a-select-option>
                    </a-select>
                </nk-form-item>
                <nk-form-item title="值" v-if="editItem.having && havingValueComponent">
                    <a-input-number v-if="havingValueComponent==='a-input-number'" v-model="editItem.havingValue"></a-input-number>
                    <div            v-if="havingValueComponent==='a-range-number'">
                        <a-input-number :defaultValue="editItem.havingValue&&editItem.havingValue[0]" @change="havingValueChange($event,0)"></a-input-number>
                        ~
                        <a-input-number :defaultValue="editItem.havingValue&&editItem.havingValue[1]" @change="havingValueChange($event,1)"></a-input-number>
                    </div>
                </nk-form-item>
            </nk-form>
        </a-modal>

        <a-modal v-model="modalFilterVisible" centered :title="'条件:'+editItem.name" @ok="configFilter" :okButtonProps="{props: {
            disabled: !editItem.operator
             || (editItemComponent&&!editItem.value)
             || (editItemComponent&&(editItem.value instanceof Array && !editItem.value[0]))
        } }">
            <nk-form :col="1">
                <nk-form-item title="字段">{{editItem.name}}</nk-form-item>
                <nk-form-item title="类型">{{editItem.type}}</nk-form-item>
                <nk-form-item title="条件">
                    <a-select style="width: 150px;" v-model="editItem.operator" @change="editItem.value=undefined">
                        <a-select-option v-for="i in modalFilterOperators" :key="i.k"> {{ i.k }} </a-select-option>
                    </a-select>
                </nk-form-item>
                <nk-form-item title="值" v-if="editItemComponent">
                    <a-input        v-if="editItemComponent==='a-input'"        v-model="editItem.value"></a-input>
                    <a-input-number v-if="editItemComponent==='a-input-number'" v-model="editItem.value"></a-input-number>
                    <a-select       v-if="editItemComponent==='a-select'"       v-model="editItem.value" mode="tags"></a-select>
                    <a-date-picker  v-if="editItemComponent==='a-date-picker'"  :default-value="editItem.value&&moment(editItem.value, 'YYYY-MM-DD')"
                                                                                format="YYYY-MM-DD"
                                                                                @change="editItem.value=$event&&moment($event).format('YYYY-MM-DD')"></a-date-picker>
                    <a-range-picker v-if="editItemComponent==='a-range-picker'" :default-value="editItem.value&&[editItem.value[0]&&moment(editItem.value[0], 'YYYY-MM-DD'),editItem.value[1]&&moment(editItem.value[1], 'YYYY-MM-DD')]"
                                                                                format="YYYY-MM-DD"
                                                                                @change="editItem.value=$event&&$event[0]&&[moment($event[0]).format('YYYY-MM-DD'),moment($event[1]).format('YYYY-MM-DD')]"></a-range-picker>
                    <div            v-if="editItemComponent==='a-range-number'">
                        <a-input-number :defaultValue="editItem.value&&editItem.value[0]" @change="inputNumberChange($event,0)"></a-input-number>
                        ~
                        <a-input-number :defaultValue="editItem.value&&editItem.value[1]" @change="inputNumberChange($event,1)"></a-input-number>
                    </div>
                </nk-form-item>
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

import moment from 'moment'
const numberInputHaving = [
    {k:'',v:'无'},
    {k:'=',c:'a-input-number'},
    {k:'<>',c:'a-input-number'},
    {k:'>',c:'a-input-number'},
    {k:'>=',c:'a-input-number'},
    {k:'<',c:'a-input-number'},
    {k:'<=',c:'a-input-number'},
    {k:'BETWEEN',c:'a-range-number'},
];
const numberInput = [
    {k:'=',c:'a-input-number'},
    {k:'<>',c:'a-input-number'},
    {k:'IS NULL'},
    {k:'IS NOT NULL'},
    {k:'IN',c:'a-select'},
    {k:'>',c:'a-input-number'},
    {k:'>=',c:'a-input-number'},
    {k:'<',c:'a-input-number'},
    {k:'<=',c:'a-input-number'},
    {k:'BETWEEN',c:'a-range-number'}
];
const dateInput = [
    {k:'=',c:'a-date-picker'},
    {k:'<>',c:'a-date-picker'},
    {k:'IS NULL'},
    {k:'IS NOT NULL'},
    {k:'>=',c:'a-date-picker'},
    {k:'<',c:'a-date-picker'},
    {k:'BETWEEN',c:'a-range-picker'}
];
const operatorDefs = {
    'text':     [{k:'=',c:'a-input'},{k:'<>',c:'a-input'},{k:'LIKE',c:'a-input'},{k:'IS NULL'},{k:'IS NOT NULL'}],
    'keyword':  [{k:'=',c:'a-input'},{k:'<>',c:'a-input'},{k:'LIKE',c:'a-input'},{k:'IS NULL'},{k:'IS NOT NULL'},{k:'IN',c:'a-select'}],
    'short':    numberInput,
    'integer':  numberInput,
    'long':     numberInput,
    'float':    numberInput,
    'double':   numberInput,
    'date':     dateInput,
};


export default {
    provide(){
        return {
            mode: 'analyse'
        };
    },
    data(){
        return {
            loading:false,
            numberInputHaving,

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
            editSource:{},
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
        editItemIsDate(){
            return this.editItem.type &&
                ['date'].indexOf(this.editItem.type)>-1;
        },
        editItemIsNumber(){
            return this.editItem.type &&
                ['short','integer','long','float','double'].indexOf(this.editItem.type)>-1;
        },
        aggable(){
            return this.editItem.type &&
                this.editItem.aggregatable &&
                ['short','integer','long','float','double','date'].indexOf(this.editItem.type)>-1;
        },
        hasGroup(){
            return !!this.queryBuilder.fields.find(i=>i.groupBy);
        },
        hasAgg(){
            return !!this.queryBuilder.fields.find(i=>i.agg);
        },
        hasGroupOrAgg(){
            return this.hasGroup || this.hasAgg;
        },
        aggregatableFields(){
            return this.availableFields.filter(i=>i.aggregatable);
        },
        sortableFields(){
            if(this.hasGroupOrAgg){
                return this.queryBuilder.fields.filter(i=>i.groupBy||i.agg).map(i=>{
                    return {name:i.alias}
                });
            }
            return this.aggregatableFields.map(i=>{
                return {name:i.name}
            });
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
        groupFields(){
            return this.queryBuilder.fields.filter(i=>i.groupBy);
        },
        aggFields(){
            return this.queryBuilder.fields.filter(i=>i.agg);
        },
        havingFields(){
            return this.queryBuilder.fields.filter(i=>i.agg && i.having);
        },
        simpleFields(){
            return this.queryBuilder.fields.filter(i=>!i.agg&&!i.groupBy)
                .map(i=>{
                    if(this.hasGroupOrAgg){
                        this.$set(i,'_error',`${i.name}字段不可用`);
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
                    if(!this.queryBuilder.fields.find(f=>f.alias===i.name&&(f.groupBy||f.agg))){
                        this.$set(i,'_error',`${i.name}排序不可用`);
                    }
                }else{
                    if(!this.aggregatableFields.find(f=>f.alias===i.name)){
                        this.$set(i,'_error',`${i.name}排序不可用`);
                    }
                }
                return i;
            });
        },
        error(){
            return [
                ...this.simpleFields.filter(i=>i._error).map(i=>i._error),
                ...this.sortedFields.filter(i=>i._error).map(i=>i._error),
            ];
        },
        havingValueComponent(){
            const o = this.numberInputHaving.find(i=>i.k===this.editItem.having);
            return o&&o.c;
        },
        editItemComponent(){
            const o = this.modalFilterOperators.find(i=>i.k===this.editItem.operator);
            return o&&o.c;
        },
        sql(){
            const fields = this.queryBuilder.fields.map(item=>item.formatted).join(', ');
            const filter = this.queryBuilder.filter.map(item=>item.formatted).join(' AND ');
            const groups = this.queryBuilder.fields.filter(item=>item.groupBy).map(item=>'"'+item.alias+'"').join(', ');
            const having = this.queryBuilder.fields.filter(item=>item.having).map(item=>item.havingFormatted).join(' AND ');
            const sorted = this.queryBuilder.sorted.map(item=>item.formated).join(', ');
            return `SELECT ${fields||'*'} FROM ${this.queryBuilder.index||'<document>'} ${filter.length?' WHERE':''} ${filter} ${groups.length?' GROUP BY':''} ${groups} ${having.length?' HAVING':''} ${having} ${sorted.length?' ORDER BY':''} ${sorted}`;
        }
    },
    created() {
        this.saveAsGet();
    },
    methods:{
        moment,
        custom(f){
            this.queryBuilder.custom=f;
            if(f)
                this.queryBuilder.sql = this.sql;
        },
        runSql(){
            this.data = {};
            this.loading = true;
            this.queryBuilder.sql = this.queryBuilder.custom?this.queryBuilder.sql:this.sql;
            this.$http.postJSON(`/api/data/analyse/sql`,{sql:this.queryBuilder.sql})
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
                    const availableFields = [];
                    for(let field in res.data){
                        if(res.data.hasOwnProperty(field)){

                            const fieldMeta = res.data[field];

                            if(field.startsWith('_'))continue;
                            if(field==='$keyword')continue;
                            if(fieldMeta.object)continue;

                            for(let type in fieldMeta){
                                if(fieldMeta.hasOwnProperty(type))
                                    availableFields.push(fieldMeta[type])
                            }
                        }
                    }
                    this.availableFields = availableFields.sort((a,b)=>a.name > b.name ?1:-1);
                    this.filterListedField = undefined;
                });
        },
        addField(name){
            const alias = "____"+name;
            const item = Object.assign({alias,formatted:(name + ' AS "' + alias+'"'),},this.availableFields.find(i=>i.name === name));
            this.selectedValue = undefined;
            if(item.aggregatable){
                this.editField(item);
            }else{
                this.queryBuilder.fields.push(item)
            }
        },
        editField(item){
            this.modalFieldVisible=true;
            this.editSource = this.queryBuilder.fields.indexOf(item);
            this.editItem = JSON.parse(JSON.stringify(item));
        },
        configField(){

            this.editItem.alias = this.editItem.alias || ("____"+this.editItem.name);

            if(!this.editItemIsDate&&!this.editItemIsNumber){
                this.editItem.interval = undefined
            }
            if(!this.editItemIsDate){
                this.editItem.intervalUnit = undefined
            }
            if(this.editItem.groupBy){
                this.editItem.agg=undefined;

                if(this.editItemIsNumber){
                    this.editItem.formatted = 'HISTOGRAM('+this.editItem.name+','+this.editItem.interval+') AS "'+this.editItem.alias+'"';
                }else if(this.editItemIsDate){
                    this.editItem.formatted = 'HISTOGRAM('+this.editItem.name+',INTERVAL '+this.editItem.interval+' '+this.editItem.intervalUnit+') AS "'+this.editItem.alias+'"';
                }else{
                    this.editItem.formatted = this.editItem.name + ' AS "'+this.editItem.alias+'"';
                }

            }else if(this.editItem.agg){
                this.editItem.formatted = this.editItem.agg.replace('{}',this.editItem.name) + ' AS "'+this.editItem.alias+'"';

                if(this.editItem.having){
                    if(this.editItem.having === 'BETWEEN'){
                        this.editItem.havingFormatted = '"'+this.editItem.alias +'" '+this.editItem.having + ' ' + this.editItem.havingValue[0] + ' AND ' + this.editItem.havingValue[1];
                        this.editItem.viewFormatted = this.editItem.formatted + ' '+this.editItem.having + ' ' + this.editItem.havingValue[0] + ' AND ' + this.editItem.havingValue[1];
                    }else{
                        this.editItem.havingFormatted = '"'+this.editItem.alias +'" '+this.editItem.having + ' ' + this.editItem.havingValue;
                        this.editItem.viewFormatted = this.editItem.formatted + ' '+this.editItem.having + ' ' + this.editItem.havingValue;
                    }
                }

            }else{
                this.editItem.formatted = this.editItem.name+ ' AS "'+this.editItem.alias+'"';
            }

            if(this.editSource===-1){
                this.queryBuilder.fields.push(this.editItem);
            }else{
                this.$set(this.queryBuilder.fields,this.editSource,this.editItem);
            }
            this.modalFieldVisible = false;
        },
        addFilter(name){
            const item = Object.assign({formatted:name},this.availableFields.find(i=>i.name === name));
            this.selectedValue = undefined;
            this.editFilter(item);
        },
        editFilter(item){
            this.modalFilterVisible=true;
            this.modalFilterOperators = operatorDefs[item.type];
            this.editSource = this.queryBuilder.filter.indexOf(item);
            this.editItem = JSON.parse(JSON.stringify(item));
            this.$set(this.editItem,'value',this.editItem.value);
        },
        configFilter(){

            let value = undefined;
            if(this.editItem.operator==='IS NULL' || this.editItem.operator==='IS NOT NULL'){
                value = ''
            }else if(this.editItem.operator==='BETWEEN'){
                if(this.editItem.type==='text'||this.editItem.type==='keyword'||this.editItem.type==='date'){
                    value = "'"+this.editItem.value.join("' AND '")+"'";
                }else{
                    value = this.editItem.value.join(' AND ')
                }
            }else if(this.editItem.operator==='IN'){
                if(this.editItem.type==='text'||this.editItem.type==='keyword'||this.editItem.type==='date'){
                    value = "('"+this.editItem.value.join("', '")+"')"
                }else{
                    value = "("+this.editItem.value.join(', ')+")"
                }
            }else{
                if(this.editItem.type==='text'||this.editItem.type==='keyword'||this.editItem.type==='date'){
                    value = "'"+this.editItem.value+"'";
                }else{
                    value = this.editItem.value;
                }
            }

            this.editItem.formatted = this.editItem.name +' '+ this.editItem.operator + ' ' + value;
            if(this.editSource===-1){
                this.queryBuilder.filter.push(this.editItem);
            }else{
                this.$set(this.queryBuilder.filter,this.editSource,this.editItem);
            }
            this.modalFilterVisible = false;
        },
        inputNumberChange(e,f){
            this.editItem.value = this.editItem.value || [];
            this.editItem.value[f] = e;
        },
        havingValueChange(e,f){
            this.editItem.havingValue = this.editItem.havingValue || [];
            this.editItem.havingValue[f] = e;
        },
        addSort(name){
            this.queryBuilder.sorted.push({name,order:'ASC',formated:'"'+name+'" ASC'})
            this.selectedValue = undefined;
        },
        changeSort(item){
            item.order = (item.order === 'ASC' ? 'DESC' : 'ASC');
            this.$set(item,'formated','"'+item.name +'" '+ item.order);
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

<style lang="scss" scoped>
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
