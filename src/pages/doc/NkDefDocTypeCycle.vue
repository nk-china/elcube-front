<template>
    <a-card title="生命周期">

        <vxe-toolbar v-if="editMode">
            <template v-slot:buttons>
                <vxe-button icon="fa fa-plus" status="perfect" size="mini" @click="add()">新增</vxe-button>
            </template>
        </vxe-toolbar>
        <vxe-table
            ref="xTableCycle"
            row-key
            auto-resize
            size="mini"
            border=inner
            resizable
            highlight-hover-row
            show-header-overflow="tooltip"
            show-overflow="tooltip"
            header-cell-class-name="headerCellClassName"
            :edit-config="{trigger: 'dblclick', mode: 'row', showIcon: editMode, activeMethod: ()=>{return editMode}}"
            :data="docDef.lifeCycles"
            @edit-actived="editActive">
            <vxe-table-column   title="事件"         field="docCycle"        width="30%"  :edit-render="{
                    name: '$select',
                    options: eventOptions,
                    optionProps: {value: 'key', label: 'name'},
                    events: {change: eventChanged}
            }" />
            <vxe-table-column   title="处理程序"         field="refObjectType"  width="50%"  :edit-render="{
                    name: '$select',
                    options: valueOptions,
                    optionProps: {value: 'key', label: 'name'}
            }">
                <template v-slot="{row}">
                    <nk-script-label v-if="row.refObjectType" :value="row.refObjectType"></nk-script-label>
                </template>
            </vxe-table-column>
            <vxe-table-column   title=""            field=""                   width="20%">
                <template v-slot="{seq,row}">
                <span v-if="editMode" class="drag-btn" style="margin-right: 10px;">
                        <i class="vxe-icon--menu"></i>
                    </span>
                    <span v-if="editMode" style="margin-right: 10px;" @click="$nkSortableRemove(docDef.lifeCycles,seq)">
                        <i class="vxe-icon--remove"></i>
                    </span>
                </template>
            </vxe-table-column>
        </vxe-table>

    </a-card>
</template>

<script>
import MixinSortable from "../../utils/MixinSortable";
export default {
    mixins:[MixinSortable()],
    props:{
        editMode:Boolean,
        docDef:Object,
        docOptions:Object,
    },
    created() {
        this.$nkSortableVxeTable(true);
        if(!this.docDef.lifeCycles){
            this.$set(this.docDef,"lifeCycles", []);
        }
    },
    data(){
        return {
            editActiveOption:undefined,
            valueOptions:[],
            eventOptions:[
                {key:'beforeCreate',        name:'[创建]beforeCreate',        ref:'docCycleInterceptor'},
                {key:'afterCreated',        name:'[创建]afterCreated',        ref:'docCycleInterceptor'},
                {key:'afterCopied',         name:'[复制]afterCopied',         ref:'docCycleInterceptor'},

                {key:'beforeCalculate',     name:'[计算]beforeCalculate',     ref:'docCycleInterceptor'},
                {key:'afterCalculated',     name:'[计算]afterCalculated',     ref:'docCycleInterceptor'},

                {key:'beforeUpdate',        name:'[更新]beforeUpdate',        ref:'docCycleInterceptor'},
                {key:'afterUpdated',        name:'[更新]afterUpdated',        ref:'docCycleInterceptor'},
                {key:'afterUpdateCommit',   name:'[更新]afterUpdateCommit',   ref:'docCycleInterceptor'},

                {key:'beforeDelete',        name:'[删除]beforeDelete',        ref:'docCycleInterceptor'},
                {key:'afterDeleted',        name:'[删除]afterDeleted',        ref:'docCycleInterceptor'},
                {key:'afterDeleteCommit',   name:'[删除]afterDeleteCommit',   ref:'docCycleInterceptor'},
            ]
        }
    },
    methods:{
        eventChanged({row}){
            row.refObjectType = undefined;
            this.editActive({row});
        },
        editActive({ row }){
            this.editActiveOption = this.eventOptions.find(i=>i.key===row.docCycle);
            this.valueOptions = this.editActiveOption && this.docOptions[this.editActiveOption.ref];
        },
        add(){
            const row = {docCycle:'',refObjectType:''};
            this.docDef.lifeCycles.push(row);
            this.$refs.xTableCycle.setActiveRow(row);
        }
    }
}
</script>

<style scoped lang="scss">
    ::v-deep.cycle{
        .term{
            min-width: 200px;
        }
    }
</style>