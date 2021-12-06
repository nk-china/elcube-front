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
    <nk-card @expand="$nkSortableVxeTable">

        <vxe-toolbar v-if="editMode">
            <template v-slot:buttons>
                <vxe-button icon="fa fa-plus" status="perfect" size="mini" @click="xTableAdd()">新增</vxe-button>
            </template>
        </vxe-toolbar>
        <vxe-table
            ref="xTable"
            auto-resize
            keep-source
            resizable
            highlight-hover-row
            show-header-overflow="tooltip"
            show-overflow="tooltip"
            size="mini"
            border=inner
            :data="data"
            :loading="loading"
            :edit-rules="tableValidRules"
            :edit-config="{trigger: 'click', mode: 'row', showIcon: editMode, activeMethod: xTableActiveMethod, showStatus: true}"
            :sort-config="{trigger: 'cell', remote: false,showIcon: !editMode, orders: ['desc', 'asc', null]}"
            :class="editMode&&'edit-table'"
            @edit-actived="xTableEditActived"
            @edit-closed="xTableEditClosed"
        >
            <!--增加一行空列，避免宽度不够不能自适应-->
            <vxe-column v-if="def.seq" type="seq" title="#"></vxe-column>

            <vxe-column v-for="(item) in def.items" :key="item.key"
                      :min-width="(item.col||10) + '%'"
                      :title="item.name"
                      :field="item.key"
                      :sortable="item.sortable"
                      class-name="xtable-col"
                      :edit-render="{enabled: item.control === 1}"
            >
                <template v-slot="{ row }">
                    <component :is="item.inputType" :editMode="false"
                               v-model="row[item.key]"
                               :input-options="item.inputOptions"
                    ></component>
                </template>
                <template #edit="scope">
                    <component :is="item.inputType" :editMode="true"
                               v-model="scope.row[item.key]"
                               :input-options="item.inputOptions"
                               @change="itemChange($event,item,scope)"
                    ></component>
                </template>
            </vxe-column>
            <!--增加一行空列，避免宽度不够不能自适应-->
            <vxe-column v-if="editMode" title="" :min-width="def.sortable?80:50">
                <template v-slot="{seq,items}">
                    <span v-if="editMode && def.sortable" class="drag-btn" style="margin-left: 10px;">
                        <i class="vxe-icon--menu"></i>
                    </span>
                    <span v-if="editMode" style="margin-left: 10px;" @click="$nkSortableRemove(data,seq)">
                        <i class="vxe-icon--remove"></i>
                    </span>
                </template>
            </vxe-column>
        </vxe-table>


    </nk-card>
</template>

<script>
import Mixin from "./Mixin";
import MixinSortable from "../../../utils/MixinSortable";
import NkUtil from "../../../utils/NkUtil";


export default {
    mixins:[new Mixin({}),new MixinSortable()],
    created() {
        this.$nkSortableVxeTable(true);
    },
    data(){
        return {
            loading: false,
            trigger: false,
        }
    },
    computed:{
        tableValidRules(){
            const rules = {};
            if(this.editMode && this.def&&this.def.items){
                this.def.items.forEach(field=>{
                    const list = [];
                    if(field.required){
                        list.push({ required: true,                 message: field.message||'不能为空' });
                    }
                    if(field.unique){
                        list.push({validator : this.uniqueValid,    message: field.message||'重复'})
                    }
                    if(field.inputOptions){
                        let io = field.inputOptions;
                        if(io.min){
                            list.push({ min: io.min,         type:'number',message: field.message||`不能小于${io.min}` });
                        }
                        if(io.max){
                            list.push({ max: io.max,         type:'number',message: field.message||`不能大于${io.max}` });
                        }
                        if(io.minLength){
                            list.push({ min: io.minLength,   message: field.message||`字符长度不能小于${io.minLength}` });
                        }
                        if(io.maxLength){
                            list.push({ max: io.maxLength,   message: field.message||`字符长度不能小于${io.maxLength}` });
                        }
                        if(io.pattern){
                            list.push({ pattern: io.pattern, message: field.message||'校验不通过' });
                        }
                    }
                    rules[field.key]=list;
                });
            }
            return rules;
        }
    },
    methods:{
        nk$editModeChanged(editMode){
            this.$refs.xTable.clearSort();
            this.$refs.items && this.$refs.items.forEach(c=>{
                c.nk$editModeChanged &&c.nk$editModeChanged(editMode);
            });
        },
        xTableActiveMethod(){
            return this.editMode;
        },
        async xTableAdd(){
            let row = {};
            this.def.items.forEach(field=>{
                row[field.key]=undefined;
            });
            this.data.push(row);
            await this.$refs.xTable.loadData(this.data);
            await this.$refs.xTable.setActiveRow(row);
            await this.$refs.xTable.validate(row).catch(errMap => errMap)
        },
        xTableEditActived(){
        },
        xTableEditClosed(){
            if(this.trigger){
                this.trigger = false;
                this.nk$calc();
            }
        },
        itemChange(e,item,scope){
            // 注意：表格不支持单元格编辑联动

            // 在表格不支持单元格编辑联动的前提下
            // 因为表格编辑状态时，如果触发计算，会导致表格的编辑状态失效，为了用户体验友好
            // 单元格内容改变后，如果需要触发计算，则先记录状态，等退出行编辑模式后再触发
            if(item.calcTrigger){
                this.trigger = true;
            }
            this.$refs.xTable.updateStatus(scope);
        },
        async hasError(){
            const fieldKey = this.def.items.find(i => i.key === 'fieldKey');
            if (fieldKey && NkUtil.isRepeat(this.data, ['fieldKey'])) {
                return `${this.card.cardName}-${fieldKey.name} 重复`;
            }
            const errMap = await this.$refs.xTable.fullValidate(true).catch(errMap => errMap)
            if (errMap) {
                return `${this.card.cardName}-${errMap.column.title} ${errMap.rule.$options.message||errMap.rule.$options.content}`;
            }
            return false;
        },
        uniqueValid(e){
            if (NkUtil.isRepeat(this.data, [e.column.property])) {
                return new Error(e.message||"重复")
            }
        }
    }
}
</script>

<style scoped lang="less">
    ::v-deep{
        .edit-table{
            .xtable-col{
                & > .vxe-cell{
                    overflow: hidden;
                }

                &.col--edit.vxe-body--column{
                    height: auto;

                    .vxe-cell{
                        height: auto;
                        max-height: 100px;
                    }
                }
            }
        }
    }
</style>