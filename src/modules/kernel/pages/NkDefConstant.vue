<!--
	This file is part of ELCard.
	ELCard is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCard is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <nk-page-layout title="常量" sub-title="设置系统通用常量">
        <a-button-group slot="action">
            <a-button type="default" @click="add">新增</a-button>
            <a-button type="primary" @click="save">保存</a-button>
        </a-button-group>
        <nk-card class="card" title="常量列表">
            <vxe-table
                ref="xTable"
                row-key
                auto-resize
                size="mini"
                border=inner
                resizable
                highlight-hover-row
                :edit-config="{trigger: 'click', mode: 'row', activeMethod: ()=>{return true}}"

                :data="list">
                <vxe-table-column title="REGTYPE"
                                  field="regType"
                                  width="12%"
                                  fixed="left"
                                  :edit-render="{name:'$input'}"/>
                <vxe-table-column title="KEY"
                                  field="regKey"
                                  width="12%"
                                  fixed="left"
                                  :edit-render="{name:'$input'}"/>
                <vxe-table-column title="TITLE"
                                  field="title"
                                  width="20%"
                                  :edit-render="{name:'$input'}"/>
                <vxe-table-column title="VALUE"
                                  field="content"
                                  width="20%"
                                  :edit-render="{name:'$input'}"/>
                <vxe-table-column title="#"
                                  field="">
                    <template v-slot="{seq,items}">
                        <span @click="itemMove(seq)">
                            <i class="vxe-icon--remove"></i>
                        </span>
                    </template>
                </vxe-table-column>
            </vxe-table>
        </nk-card>
    </nk-page-layout>
</template>

<script>
import NkUtil from "../../../utils/NkUtil";
export default {
    data() {
        return {
            list:[]
        }
    },
    created() {
        this.$http.get("/api/sys/constant/list")
            .then(res=>{
                this.list = res.data;
            });
    },
    methods:{
        add(){
            let newItem = {
                regKey:'KEY',
                orderBy: 0,
            };
            this.list.push(newItem);
            this.$refs.xTable.loadData(this.list).then(() => this.$refs.xTable.setActiveRow(newItem));
        },
        save(){
            if(NkUtil.isRepeat(this.list,['regType','regKey'])) {
                return this.$message.error(`KEY重复，请检查后再次提交`);
            }
            if(NkUtil.hasBlack(this.list,['regKey'])) {
                return this.$message.error(`KEY不能为空，请检查后再次提交`);
            }
            this.$http.postJSON("/api/sys/constant/save",this.list)
                .then(()=>{
                    this.$message.success(`配置已保存`);
                });
        },
        itemMove(i){
            this.list.splice(i-1,1);
        },
    }
}
</script>

<style scoped>

</style>
