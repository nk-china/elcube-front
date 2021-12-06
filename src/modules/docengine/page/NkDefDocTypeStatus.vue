<!--
	This file is part of ELCube.
	ELCube is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCube is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <nk-card card-key="nk-card-doc-type-state" class="nk-page-layout-card" title="状态">
        <nk-help-link slot="extra" url="http://cwiki.nkpro.cn/pages/viewpage.action?pageId=23789596" />
        <vxe-toolbar v-if="editMode">
            <template v-slot:buttons>
                <vxe-button icon="fa fa-plus" status="perfect" size="mini" @click="addStatus()">新增</vxe-button>
            </template>
        </vxe-toolbar>
        <vxe-table
            ref="xTableStatus"
            row-key
            auto-resize
            size="mini"
            border=inner
            resizable
            highlight-hover-row
            header-cell-class-name="headerCellClassName"
            :edit-config="{trigger: 'click', mode: 'row', showIcon: editMode, activeMethod: ()=>{return editMode}}"
            :data="docDef.status"
            @edit-actived="stateEditActive">
            <vxe-table-column   title="状态"      field="docState"      width="10%" :edit-render="{
                    name: '$input',
                    props: {type: 'text',maxlength:4},
                    events:{change({column,row},{value}){row[column.property]=value.toUpperCase()}}
                }"/>
            <vxe-table-column   title="描述"      field="docStateDesc"  width="10%" :edit-render="{name: 'input', attrs: {type: 'text'}}"/>
            <vxe-table-column   title="操作名"     field="operatorName"  width="10%" :edit-render="{name: 'input', attrs: {type: 'text'}}"/>
            <vxe-table-column   title="前序状态"   field="preDocState"      width="10%" :edit-render="{
                    name:'$select',
                    options: availableStatus,
                    optionProps: {value: 'docState', label: 'docState'}
                }" >
            </vxe-table-column>
            <vxe-table-column   title="编辑控制"   field="editPerm"      width="12%" :edit-render="{
                    name:'$select',
                    options: [{
                        label:'不可编辑',value:0
                    },{
                        label:'可编辑',value:1
                    },{
                        label:'仅状态',value:3
                    },{
                        label:'流程中编辑',value:2
                    }]
                }" >
            </vxe-table-column>
            <vxe-table-column         field="sysState"      width="13%" :edit-render="{name: 'input', attrs: {type: 'text'}}">
                <template v-slot:header="{column}">
                    系统状态
                    <nk-help-link page="doc-sys-state" />
                </template>
            </vxe-table-column>
            <vxe-table-column   title="扩展程序"   field="refObjectType"     width="17%" :edit-render="{
                    name:'$select',
                    options: docOptions.docStateInterceptors,
                    optionProps: {value: 'key', label: 'name'},

                }" >
                <template v-slot="{ row }">
                    <nk-script-label :value="row.refObjectType"></nk-script-label>
                </template>
            </vxe-table-column>
            <vxe-table-column   title="显示"   field="displayPrimary" width="8%" :formatter="({cellValue})=>cellValue?'是':''" :edit-render="{
                name: '$switch',
                props: {'open-value':1,'close-value':0},
            }" v-if="docDef.docClassify==='TRANSACTION'||docDef.docClassify==='PROJECT'"/>
            <vxe-table-column   title=""    field=""     width="10%">
                <template v-slot="{seq,items}">
                        <span v-if="editMode" class="drag-btn" style="margin-right: 10px;">
                            <i class="vxe-icon--menu"></i>
                        </span>
                    <span v-if="editMode" style="margin-right: 10px;" @click="$nkSortableRemove(docDef.status,seq)">
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
            stateEditRow:undefined
        }
    },
    computed:{
        availableStatus(){
            const status = [{docState:'@'}];
            this.docDef.status && this.docDef.status.forEach(state=>{
                if(state!==this.stateEditRow)
                    status.push({docState:state.docState})
            });
            return status;
        },
    },
    created() {
        this.$nkSortableVxeTable(true);
    },
    methods:{
        stateEditActive(e){
            this.stateEditRow = e.row;
        },
        addStatus(){
            const row = {
                docState:'S001',
                docStateDesc:'新创建',
                editPerm:1,
                preDocState:'@',
                refObjectType:''
            };
            this.docDef.status.push(row)
            this.$refs.xTableStatus.setActiveRow(row);
        },
    }
}
</script>

<style scoped>

</style>