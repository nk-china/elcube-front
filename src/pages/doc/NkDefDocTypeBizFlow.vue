<template>
    <a-card title="业务流">
        <vxe-toolbar v-if="editMode">
            <template v-slot:buttons>
                <vxe-button icon="fa fa-plus" status="perfect" size="mini" @click="add()">新增</vxe-button>
            </template>
        </vxe-toolbar>
        <vxe-table
            ref="xTableDocs"
            row-key
            auto-resize
            size="mini"
            border=inner
            resizable
            highlight-hover-row
            show-header-overflow="tooltip"
            show-overflow="tooltip"
            header-cell-class-name="headerCellClassName"
            :edit-config="{trigger: 'click', mode: 'row', showIcon: editMode, activeMethod: ()=>{return editMode}}"
            :data="docDef.flows">
            <vxe-table-column field="preDocType"    width="20%" :edit-render="{name: '$input',props: {type: 'text',maxlength:4}}" title="前置交易"/>
            <vxe-table-column field="preDocState"   width="20%" :edit-render="{name: '$input',props: {type: 'text',maxlength:4}}" title="前置交易状态" />
            <vxe-table-column field="refObjectType" width="50%" :edit-render="{name:'$select',options: docOptions.flowInterceptors,optionProps: {value: 'key', label: 'name'},}" title="扩展程序" >
                <template v-slot="{ row }">
                    <nk-script-label :value="row.refObjectType"></nk-script-label>
                </template>
            </vxe-table-column>
            <vxe-table-column width="10%">
                <template v-slot="{ seq }">
                    <span v-if="editMode" class="drag-btn" style="margin-right: 10px;"><i class="vxe-icon--menu"></i></span>
                    <span v-if="editMode" @click="$nkSortableRemove(docDef.flows,seq)"><i class="vxe-icon--remove"></i></span>
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
    },
    methods:{
        add(){
            if(!this.docDef.flows){
                this.$set(this.docDef,"flows",[]);
            }
            const row = {
                preDocType:'@',
                preDocStatus:'@',
                refObjectType:''
            };
            this.docDef.flows.push(row)
            this.$refs.xTableDocs.setActiveRow(row);
        },
    }
}
</script>

<style scoped lang="less">
    ::v-deep{
    }
</style>