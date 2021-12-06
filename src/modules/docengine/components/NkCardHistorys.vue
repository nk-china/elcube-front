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
    <a-card class="card" title="单据快照" :loading="loading">
        <vxe-table
            auto-resize
            size="mini"
            border=inner
            :data="list">
            <vxe-table-column title="Version"   field="version"       width="10%" >
                <template v-slot="{row}">
                    {{row.version}}
                </template>
            </vxe-table-column>
            <vxe-table-column title="原始状态"   field="stateOriginal"  width="12%" />
            <vxe-table-column title="变更状态"   field="state"          width="12%" />
            <vxe-table-column title="操作人"     field="userRealname"   width="12%" />
            <vxe-table-column title="操作来源"   field="source"         width="28%" />
            <vxe-table-column title="变更时间"   field="updatedTime"    width="12%" formatter="nkDatetimeFriendly" />
            <vxe-table-column title="Action">
                <template v-slot="{ row,rowIndex }">
                    <a class="a" @click="toHistoryDetail(row)">查看</a>
                    <a class="a" @click="toHistoryDiff(row)" v-if="rowIndex>0">对比</a>
                </template>
            </vxe-table-column>
        </vxe-table>

        <a-modal v-model="modal.visible"
                 title="单据对比"
                 :centered="true"
                 :footer="null"
                 width="100%"
                 dialogClass="modal"
                 >

        </a-modal>
    </a-card>
</template>

<script>
import ClassifyMapping from "./ClassifyMapping";
export default {
    props:{
        doc:Object
    },
    data(){
        return {
            list:[],
            loading:true,
            modal:{
                visible:false
            }
        }
    },
    created() {
        this.$http.get(`/api/doc/detail/histories/${this.doc.docId}`)
            .then(res=>{
                this.list = res.data;
                this.loading = false;
            });
    },
    methods:{
        toHistoryDetail(row){
            this.$router.push(ClassifyMapping[this.doc.classify].snapshotUrl+row.id);
        },
        toHistoryDiff(row){
            const source = this.list[this.list.indexOf(row)-1];
            if(source){
                this.$router.push(ClassifyMapping[this.doc.classify].diffUrl+source.id+'/'+row.id);
            }
        }
    }
}
</script>

<style scoped lang="less">
.modal{
    height: 200px;
}
.a{
    user-select: none;

    & + .a{
        margin-left: 5px;
    }
}
</style>