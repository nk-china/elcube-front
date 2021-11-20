<template>
    <nk-card card-key="nk-card-doc-type-state" class="nk-page-layout-card" title="索引字段">
        <nk-help-link slot="extra" url="http://cwiki.nkpro.cn/pages/viewpage.action?pageId=23789596" />
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
            :data="docDef.indexRules"
            @edit-actived="editActive">
            <vxe-table-column   title="索引名"     field="indexName" width="20%" :edit-render="{name: 'input', attrs: {type: 'text'}}"/>
            <vxe-table-column   title="索引类型"   field="indexType" width="20%" :edit-render="{
                name: '$select',
                options: [
                    {value:'keyword', label:'keyword | 关键字文本'},
                    {value:'text',    label:   'text | 分词文本'},
                    {value:'name',    label:   'name | 名称文本'},
                    {value:'serial',  label: 'serial | 序列号文本'},
                    {value:'bool',    label:   'bool | 布尔值'},
                    {value:'int',     label:    'int | 整形'},
                    {value:'long',    label:   'long | 长整形'},
                    {value:'float',   label:  'float | 浮点型'},
                    {value:'double',  label: 'double | 双精度浮点型'},
                    {value:'date',    label:   'date | 日期（秒）'},
                    {value:'text$',   label:  'text$ | 分词文本(全文检索)'},
                    {value:'name$',   label:  'name$ | 名称文本(全文检索)'},
                    {value:'serial$', label:'serial$ | 序列号文本(全文检索)'},
                ]
            }"/>
            <vxe-table-column   title="SpEL"      field="ruleSpEL" width="50%" :edit-render="{}">
                <template v-slot:edit="{row}">
                    <nk-sp-el-editor v-model="row.ruleSpEL"></nk-sp-el-editor>
                </template>
            </vxe-table-column>
            <vxe-table-column   title=""    field=""     width="10%">
                <template v-slot="{seq,items}">
                    <span v-if="editMode" @click="$nkSortableRemove(docDef.indexRules, seq)">
                        <i class="vxe-icon--remove"></i>
                    </span>
                </template>
            </vxe-table-column>
        </vxe-table>
    </nk-card>
</template>

<script>
import MixinSortable from "../../../utils/MixinSortable";
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
        if(!this.docDef.indexRules){
            this.$set(this.docDef,"indexRules", []);
        }
    },
    methods:{
        editActive({ row }){
            this.editRow = row;
        },
        add(){
            const row = {
                indexName:'key',
                indexType:'keyword',
                ruleSpEL:''
            };
            this.docDef.indexRules.push(row)
            this.$refs.xTable.setActiveRow(row);
        },
    }
}
</script>

<style scoped>

</style>