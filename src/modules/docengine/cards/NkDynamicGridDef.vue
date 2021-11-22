<template>
    <nk-def-card>
        <nk-form :col="1" :edit="editMode" style="width:300px;">
            <nk-form-item title="序号列">
                {{def.seq}}
                <a-switch size="small" slot="edit" v-model="def.seq"></a-switch>
            </nk-form-item>
            <nk-form-item title="调整顺序">
                {{def.sortable}}
                <a-switch size="small" slot="edit" v-model="def.sortable"></a-switch>
            </nk-form-item>
            <nk-form-item title="初始化SpEL">
                {{def.preSpEL}}
                <nk-sp-el-template-editor slot="edit" size="small" v-model="def.preSpEL"></nk-sp-el-template-editor>
            </nk-form-item>
        </nk-form>
        <vxe-toolbar v-if="editMode">
            <template v-slot:buttons>
                <vxe-button status="perfect" size="mini" @click="add()">新增</vxe-button>
                <vxe-button status="perfect" size="mini" @click="rowExpandAll(true)">全部展开</vxe-button>
                <vxe-button status="perfect" size="mini" @click="rowExpandAll()">全部收起</vxe-button>
            </template>
        </vxe-toolbar>
        <vxe-table
            ref="xTable"
            row-key
            auto-resize
            size="mini"
            border=inner
            show-header-overflow="tooltip"
            show-overflow="tooltip"
            resizable
            highlight-hover-row
            :edit-config="{trigger: 'click', mode: 'row', showIcon: editMode, activeMethod}"
            :data="def.items"
            @edit-actived="rowEditActived"
            @edit-closed="rowEditClosed"
            @toggle-row-expand="rowExpand"
        >
            <vxe-table-column title="KEY"
                              field="key"
                              width="17%"
                              :edit-render="{name:'$input',events:{change:keyChanged}}"></vxe-table-column>
            <vxe-table-column title="描述"
                              field="name"
                              width="17%"
                              :edit-render="{name:'$input'}"></vxe-table-column>
            <vxe-table-column title="输入框"
                              field="inputType"
                              width="17%"
                              :edit-render="{name:'$select',options:inputTypeDefs,events:{change:inputTypeChanged}}"></vxe-table-column>
            <vxe-table-column title="触发计算"
                              field="calcTrigger"
                              width="12%"
                              :edit-render="{name:'$switch',props: {'open-value':true,'close-value':false}}"
                              :formatter="boolFormat"></vxe-table-column>
            <vxe-table-column title="计算顺序"
                              field="calcOrder"
                              width="12%"
                              :edit-render="{name:'$input', props: {type: 'number',min:1, max:4}}"></vxe-table-column>
            <vxe-table-column title="列宽%"
                              field="col"
                              width="10%"
                              :edit-render="{name:'$input', props: {type: 'number',min:4, max:50}}"></vxe-table-column>
            <vxe-table-column type="expand"
                              field="">
                <template v-slot="{seq,items}">
                    <span v-if="editMode && sortable" class="drag-btn" style="margin-left: 10px;">
                        <i class="vxe-icon--menu"></i>
                    </span>
                    <span v-if="editMode" style="margin-left: 10px;" @click="$nkSortableRemove(def.items,seq)">
                        <i class="vxe-icon--remove"></i>
                    </span>
                </template>
                <template #content="{ row }">
                    <nk-form :edit="editMode" :col="2">
                        <nk-form-item title="是否非空">
                            {{row.required?'是':'否'}}
                            <a-switch slot="edit" size="small" v-model="row.required" />
                        </nk-form-item>
                        <nk-form-item title="是否唯一">
                            {{row.unique?'是':'否'}}
                            <a-switch slot="edit" size="small" v-model="row.unique" />
                        </nk-form-item>
                        <nk-form-item title="允许排序">
                            {{row.sortable?'是':'否'}}
                            <a-switch slot="edit" size="small" v-model="row.sortable" />
                        </nk-form-item>
                        <nk-form-item title="校验提示">
                            {{row.message}}
                            <a-input slot="edit" size="small" v-model="row.message"></a-input>
                        </nk-form-item>
                        <nk-form-item title="控制">
                            {{row.control===1 ?'读写':(row.control===0 ?'只读':'隐藏')}}
                            <a-select slot="edit" size="small" v-model="row.control" >
                                <a-select-option :key="1" >读写</a-select-option>
                                <a-select-option :key="0" >只读</a-select-option>
                            </a-select>
                        </nk-form-item>
                        <nk-form-item title="控制 SpEL 表达式">
                            {{row.spELControl}}
                            <nk-sp-el-editor slot="edit" v-model="row.spELControl"></nk-sp-el-editor>
                        </nk-form-item>
                        <nk-form-item title="值 SpEL 条件">
                            {{row.spELTriggers}}
                            <a-select slot="edit" size="small" v-model="row.spELTriggers" mode="multiple" >
                                <a-select-option key="ALWAYS">ALWAYS</a-select-option>
                                <a-select-option key="INIT">INIT</a-select-option>
                                <a-select-option key="BLANK">BLANK</a-select-option>
                            </a-select>
                        </nk-form-item>
                        <nk-form-item title="值 SpEL 表达式">
                            {{row.spELContent}}
                            <nk-sp-el-editor slot="edit" v-model="row.spELContent"></nk-sp-el-editor>
                        </nk-form-item>
                    </nk-form>
                    <component v-if="row===activeRow && fieldDefComponent"
                               :is="fieldDefComponent"
                               :edit-mode="editMode"
                               v-model="row.inputOptions"
                    ></component>
                </template>
            </vxe-table-column>
        </vxe-table>
    </nk-def-card>
</template>

<script>
import MixinDef from "./MixinDef";
import MixinSortable from "../../../utils/MixinSortable";

export default {
    mixins:[new MixinDef({}),MixinSortable()],
    created() {
        this.$nkSortableVxeTable(true);
        if(!this.def.items){
            this.$set(this.def,'items',[]);
        }
    },
    data(){
        return {
            sortable:true,
            inputTypeDefs:[],
            activeRow:undefined,
        }
    },
    computed:{
        fieldDefComponent(){
            if(this.activeRow && this.activeRow.inputType){
                const defName = this.activeRow.inputType + 'Def';
                if(this.$options.components[defName]){
                    console.log(defName)
                    return defName;
                }
            }
            return undefined;
        }
    },
    mounted() {
        this.nk$callDef()
            .then(res=>{
                this.inputTypeDefs = res;
                this.inputTypeDefs.push({value:'divider',label:'分隔'})
            });
    },
    methods:{
        boolFormat : ({cellValue})=>{return cellValue?'是':''},
        activeMethod(){return this.editMode;},


        add(){
            let newItem = {
                key:'KEY',
                name:'新字段',
                col:1,
                inputType:'',
                calcTrigger:'',
                calcOrder:1,
                required:true,
                control:1,
                spELContent:'',
                spELTriggers:[],
                eval:''
            };
            this.def.items.push(newItem);
            this.$refs.xTable.loadData(this.def.items).then(() => this.$refs.xTable.setActiveRow(newItem));
        },

        keyChanged({column,row},{value}){
            row[column.property]=value && value.toUpperCase()
        },
        inputTypeChanged({row}){
            row.$options = this.inputTypeDefs.find(e=>e.value===row.inputType).options;
            for(let key in row.$options){
                this.$set(row,key,row.$options[key]);
            }
        },

        rowEditClosed(){
            //this.activeRow = undefined;
            //this.$refs.xTable.setAllRowExpand(false);
        },
        rowEditActived({row}){
            // 初始化inputOptions的值，避免双向绑定数据失败
            if(!row.inputOptions){
                this.$set(row,'inputOptions',{});
            }
            this.activeRow = row;
            this.$refs.xTable.setAllRowExpand(false);
            this.$refs.xTable.setRowExpand([row], true);
            this.sortable = false;
        },
        rowExpand(){
            // if(expanded){
                //this.initRowOptions(row);
            // }
            this.sortable = this.$refs.xTable.getRowExpandRecords().length === 0;
            this.$nkSortableVxeTable(this.sortable);
        },
        rowExpandAll(bool){
            if(bool){
                // this.def.items.forEach((row)=>{
                    //this.initRowOptions(row);
                // });
                this.$refs.xTable.setAllRowExpand(bool);
            }else{
                this.$refs.xTable.clearRowExpand();
            }
            this.sortable = this.$refs.xTable.getRowExpandRecords().length === 0;
            this.$nkSortableVxeTable(this.sortable);
        },
    }
}
</script>

<style scoped>

</style>