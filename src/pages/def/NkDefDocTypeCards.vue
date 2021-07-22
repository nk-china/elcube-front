<template>
    <nk-card card-key="nk-card-doc-type-component" class="nk-page-layout-card" title="自定义组件">
        <nk-help-link slot="extra" url="http://cwiki.nkpro.cn/pages/viewpage.action?pageId=23789596" />
        <vxe-toolbar v-if="editMode">
            <template v-slot:buttons>
                <vxe-button icon="fa fa-plus" status="perfect" size="mini" @click="addComponent()">新增</vxe-button>
            </template>
        </vxe-toolbar>
        <vxe-table
            ref="xTableComponent"
            row-key
            auto-resize
            size="mini"
            border=inner
            resizable
            highlight-hover-row
            header-cell-class-name="headerCellClassName"
            :edit-config="{trigger: 'click', mode: 'row', showIcon: editMode, activeMethod: ()=>{return editMode}}"
            :data="docDef.cards">
            <vxe-table-column   title="卡片"         field="cardHandler"        width="24%"  :edit-render="{
                        name: '$select',
                        options: docOptions.cards,
                        optionProps: {value: 'key', label: 'name'},
                        events: {change: componentChange},
                }" />
            <vxe-table-column   title="KEY"         field="cardKey"  width="12%"
                                :edit-render="{name:'input'}"/>
            <vxe-table-column   title="描述"         field="cardName"     width="12%"
                                :edit-render="{name:'input'}"/>
            <vxe-table-column   title="计算顺序"      field="calcOrder"         width="10%"
                                :edit-render="{name:'$input',props:{type:'integer',min:0}}"/>
            <vxe-table-column   title="计算次数"      field="calcTimes"         width="10%"
                                :edit-render="{name:'$input',props:{type:'integer',min:1,max:5}}"/>
            <vxe-table-column   title="编辑"  field="editableSpEL"             width="10%"
                                :edit-render="{name:'$input',props:{placeholder:'{\'S001\',\'S002\'}.contains(docState)'}}"/>
            <vxe-table-column   title="显示"  field="visibleSpEL"             width="10%"
                                :edit-render="{name:'$input',props:{placeholder:'{\'S001\',\'S002\'}.contains(docState)'}}"/>
            <vxe-table-column   title=""            field=""                   width="10%">
                <template v-slot="{seq,row}">
                    <span v-if="editMode" class="drag-btn" style="margin-right: 10px;">
                            <i class="vxe-icon--menu"></i>
                        </span>
                    <span v-if="editMode" style="margin-right: 10px;" @click="$nkSortableRemove(docDef.cards,seq)">
                            <i class="vxe-icon--remove"></i>
                        </span>
                </template>
            </vxe-table-column>
        </vxe-table>
    </nk-card>
</template>

<script>
import MixinSortable from "../../utils/MixinSortable";
// import NkUtil from "../../utils/NkUtil";
export default {
    mixins:[MixinSortable()],
    props:{
        editMode:Boolean,
        docDef:Object,
        docOptions:Object
    },
    data(){
        return {
        }
    },
    computed:{
    },
    created() {
        this.$nkSortableVxeTable(true);
    },
    methods:{
        addComponent(){
            let row = {
                cardHandler:'',
                cardKey:'',
                cardName:'',
                calcOrder:1,
                calcTimes:1,
                editableSpEL:'',
                visibleSpEL:''
            };
            this.docDef.cards.push(row)
            this.$refs.xTableComponent.setActiveRow(row);
        },
        componentChange({row}){

            this.$http.get(`/api/def/doc/card/${row.cardHandler}`)
                .then(res=>{
                    row.dataComponentName       = res.data.dataComponentName;
                    row.defComponentNames       = res.data.defComponentNames;
                    row.cardName = res.data.cardName;

                    if(!this.docDef.cards.find(i=>i.cardKey===res.data.cardHandler)){
                        row.cardKey = res.data.cardHandler;
                    }

                    // if(NkUtil.isRepeat(this.docDef.cards,["cardKey"])){
                    //     this.$message.warn(`卡片KEY[${row.cardKey}]重复，请注意调整`);
                    // }
                })
        },
    }
}
</script>

<style scoped>

</style>