<template>
    <nk-card card-key="nk-card-doc-type-state" class="nk-page-layout-card" title="数据同步">

        <vxe-toolbar v-if="editMode">
            <template v-slot:buttons>
                <vxe-button icon="fa fa-plus" status="perfect" size="mini" @click="add()">新增</vxe-button>
            </template>
        </vxe-toolbar>
        <vxe-table
            ref="xTable"
            auto-resize
            size="mini"
            border=inner
            resizable
            highlight-hover-row
            show-header-overflow="tooltip"
            show-overflow="tooltip"
            header-cell-class-name="headerCellClassName"
            :edit-config="{trigger: 'click', mode: 'row', showIcon: editMode, activeMethod: ()=>{return editMode}}"
            :data="docDef.dataSyncs"
            @edit-actived="editActive">
            <vxe-table-column   title="服务"             field="targetSvr" width="15%" :edit-render="{
                name: '$select',
                options: docOptions.docDataSyncs,
                optionProps: {value: 'key', label: 'name'}
            }"/>
            <vxe-table-column   title="目标"             field="targetArgs" width="14%" :edit-render="{name: 'input', attrs: {type: 'text'}}"/>
            <vxe-table-column   title="条件"             field="conditionSpEL" width="10%" :edit-render="{}">
                <template v-slot:edit="{row}">
                    <nk-sp-el-editor v-model="row.conditionSpEL"></nk-sp-el-editor>
                </template>
            </vxe-table-column>
            <vxe-table-column   title="数据源"             field="dataSpEL" width="15%" :edit-render="{}">
                <template v-slot:edit="{row}">
                    <nk-sp-el-editor v-model="row.dataSpEL"></nk-sp-el-editor>
                </template>
            </vxe-table-column>
            <vxe-table-column   title="主键规则模版"        field="keySpEL" width="18%" :edit-render="{}">
                <template v-slot:edit="{row}">
                    <nk-sp-el-editor v-model="row.keySpEL"></nk-sp-el-editor>
                </template>
            </vxe-table-column>
            <vxe-table-column   title="字段映射模版"      field="mappingSpEL" width="18%" :edit-render="{}">
                <template v-slot:edit="{row}">
                    <nk-sp-el-template-editor v-model="row.mappingSpEL"></nk-sp-el-template-editor>
                </template>
            </vxe-table-column>
            <vxe-table-column   title=""    field=""     width="10%">
                <template v-slot="{seq,items}">
                    <span v-if="editMode" @click="$nkSortableRemove(docDef.dataSyncs, seq)">
                        <i class="vxe-icon--remove"></i>
                    </span>
                </template>
            </vxe-table-column>
        </vxe-table>

    </nk-card>
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
    data(){
        return {
            editRow: {ruleSpEL:''}
        }
    },
    computed:{
    },
    created() {
        this.$nkSortableVxeTable(true);
        if(!this.docDef.dataSyncs){
            this.$set(this.docDef,"dataSyncs", []);
        }
    },
    methods:{
        editActive({ row }){
            this.editRow = row;
        },
        add(){
            const row = {
                targetSvr:'NkDatabaseAdapter',
                targetArgs:'<TABLE_NAME>',
                dataSpEL:'',
                keySpEL:'',
                mappingSpEL:''
            };
            this.docDef.dataSyncs.push(row)
            this.$refs.xTable.setActiveRow(row);
        },
    }
}
</script>

<style scoped>

</style>