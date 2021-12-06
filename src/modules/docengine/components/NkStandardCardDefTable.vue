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
        :edit-config="{trigger: 'click', mode: 'row', showIcon: editMode}"
        :data="value"
    >
        <vxe-table-column title="字段"
                          field="label"
                          width="12%"></vxe-table-column>
        <vxe-table-column title="可见"
                          field="visible"
                          width="8%"
                          :edit-render="{name:'$switch',props: {'open-value':true,'close-value':false}}"
                          :formatter="boolFormat"></vxe-table-column>
        <vxe-table-column title="只读"
                          field="readonly"
                          width="8%"
                          :edit-render="{name:'$switch',props: {'open-value':true,'close-value':false}}"
                          :formatter="boolFormat"></vxe-table-column>
        <vxe-table-column title="SpEL"
                          field="spELTriggers"
                          width="12%"
                          :edit-render="{name:'$select',props:{multiple:true},options:inputTriggers}"></vxe-table-column>
        <vxe-table-column title="SpEL值"
                          field="spELContent"
                          width="12%"
                          :edit-render="{}">
            <template v-slot="{row}">
                {{row.spELContent}}
            </template>
            <template v-slot:edit="{row}">
                <nk-sp-el-editor slot="edit" v-model="row.spELContent"></nk-sp-el-editor>
            </template>
        </vxe-table-column>
        <vxe-table-column title="SpEL顺序"
                          field="calcOrder"
                          width="12%"
                          :edit-render="{name:'$input', props: {type: 'number',min:1, max:4}}"></vxe-table-column>
        <vxe-table-column title="触发计算"
                          field="calcTrigger"
                          width="12%"
                          :edit-render="{name:'$switch',props: {'open-value':1,'close-value':0}}"
                          :formatter="boolFormat"></vxe-table-column>
        <vxe-table-column title="Options"
                          field="options"
                          width="12%"
                          :edit-render="{}">
            <template v-slot="{row}">
                {{row.options}}
            </template>
            <template v-slot:edit="{row}">
                <nk-sp-el-template-editor  v-if="row.type==='select'" slot="edit" v-model="row.options"></nk-sp-el-template-editor>
                <span>{{row.spELOptions}}</span>
            </template>
        </vxe-table-column>
        <vxe-table-column />
    </vxe-table>
</template>

<script>
export default {
    props:{
        value: Array,
        editMode:Boolean
    },
    data(){
        return {
            inputTriggers:[
                {label:"ALWAYS",value:"ALWAYS"},
                {label:"INIT",  value:"INIT"},
                {label:"BLANK", value:"BLANK"},
            ]
        }
    },
    methods:{
        boolFormat : ({cellValue})=>{return cellValue?'是':''},
    }
}
</script>

<style scoped>

</style>