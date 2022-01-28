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
    <nk-page-layout title="EQL CLI" sub-title="通过通用查询语言管理单据">

        <a-button-group slot="action">
            <a-button type="primary" @click="run">Run</a-button>
            <a-button type="default" @click="updateConfirm">Update</a-button>
        </a-button-group>

        <a-card class="card">
            <codemirror ref="codemirror"
                        :options="codemirrorOptions"
                        v-model="content"
                        @input="onCodeChange"
            ></codemirror>
            <a-tabs default-active-key="1" size="small">
                <a-tab-pane v-for="(res,index) in results" :key="index" :tab="'结果'+(index+1)">
                    <vxe-grid
                        ref="grid"
                        max-height="300"
                        auto-resize
                        resizable
                        highlight-hover-row
                        highlight-current-row
                        show-header-overflow="tooltip"
                        show-overflow="tooltip"
                        size="mini"
                        border
                        :columns="res.columns"
                        :data="res.data"
                    >
                    </vxe-grid>
                </a-tab-pane>
            </a-tabs>
        </a-card>
        <a-modal
            title="确认执行更新"
            v-model="updateVisible"
            :confirm-loading="updateLoading"
            centered
            @ok="update"
            :ok-button-props="{ props: { disabled: updateDisabled } }"
        >
            <a-alert message="请注意，更新操作不可逆" banner />
            <a-textarea v-model="updateSource" :rows="5" style="margin-top: 10px;" placeholder="请输入更新原因"></a-textarea>
        </a-modal>
    </nk-page-layout>
</template>

<script>

import qs from 'qs';

const fieldOrders = [
    "docId",
    "docType",
    "docName",
    "docNumber",
    "docDesc",
    "classify",
    "businessKey",
    "defVersion",
    "docState",
    "docTags",
    "refObjectId",
    "preDocId",
    "partnerId",
    "processInstanceId",
    "identification",
    "createdTime",
    "updatedTime",
];
export default {
    data() {
        return {
            message:undefined,
            messageRandom:undefined,
            content: "select * from doc",
            codemirrorOptions: {
                mode: "sql",
                theme: "ambiance",
                lineWrapping: false,
                indentUnit: 4,
                tabSize: 4,
                lineNumbers: true,
                extraKeys: {
                    'Ctrl-.': 'autocomplete'
                }
            },
            response: {},
            updateVisible:false,
            updateLoading:false,
            updateSource:undefined,
        }
    },
    computed:{
        updateDisabled(){
            return !(this.updateSource && this.updateSource.trim());
        },
        results(){
            let keys = Object.keys(this.response);
            if(keys.length){
                return keys.sort().map(key=>{
                    const item = this.response[key];
                    let columns = [];
                    if(item[0]){
                        const first = item[0];
                        columns = Object.keys(first).sort(this.keySort).map(key=>{
                            const width = Math.min(Math.max(first[key]?(first[key].toString().length * 7 + 40):0,key.length * 7 + 40),300);
                            return {
                                field: key,
                                title: key,
                                width: width + 'px'
                            };
                        });
                    }

                    return {
                        columns,
                        data: item
                    }
                });
            }
            return [];
        }
    },
    created() {
    },
    methods: {
        keySort(a,b){
            const aIndex = fieldOrders.indexOf(a);
            const bIndex = fieldOrders.indexOf(b);

            if(aIndex!==-1&&bIndex!==-1){
                return aIndex - bIndex;
            }

            if(aIndex===-1){
                return 1;
            }
            if(bIndex===-1){
                return -1;
            }

            return a.localeCompare(b);
        },
        onCodeChange(){
        },
        run(){
            let eql = this.parseEql();
            if(eql){
                this.response = {};
                for(let i=0;i<eql.length;i++){
                    this.$http
                        .post('/api/ops/doc/eql/execute',qs.stringify({eql:eql[i]}))
                        .then(res=>{
                            this.$set(this.response,i,res.data);
                        });
                }
            }
        },
        updateConfirm(){
            this.updateVisible = true;
        },
        update(){
            let eql = this.parseEql();
            if(eql){
                if(eql.length>1){
                    this.$message.success('更新操作不支持批量执行');
                }else{
                    this.updateLoading = true;
                    this.$http
                        .post('/api/ops/doc/eql/doUpdate',qs.stringify({eql:eql[0],source:this.updateSource.trim()}))
                        .then(res=>{
                            this.response = {0:res.data};
                        })
                        .catch(()=>{
                        })
                        .finally(()=>{
                            this.updateVisible = false;
                            this.updateLoading = false;
                        });
                }
            }
        },
        parseEql(){
            let eql = this.$refs.codemirror.codemirror.getSelection() || this.content;

            if(eql) {
                let eqls = [];
                let item = "";
                eql.split(/\n/).forEach(line => {
                    item += line;
                    item += '\n';
                    if (line.endsWith(';')) {
                        if (item) {
                            eqls.push(item);
                        }
                        item = "";
                    }
                });
                if (item) {
                    eqls.push(item);
                }

                return eqls.length ? eqls : undefined;
            }

            return undefined;
        }
    }
}
</script>

<style scoped lang="less">
::v-deep.vue-codemirror{
    width: 100%;
    height: calc(100vh - 629px);
    min-height: 200px;

    .CodeMirror{
        height: calc(100vh - 629px);
        min-height: 200px;
    }
    .CodeMirror-vscrollbar::-webkit-scrollbar {
        /*滚动条整体样式*/
        width : 6px;  /*高宽分别对应横竖滚动条的尺寸*/
        height: 5px;
    }
    .CodeMirror-vscrollbar::-webkit-scrollbar-thumb,
    .CodeMirror-hscrollbar::-webkit-scrollbar-thumb{
        /*滚动条里面小方块*/
        border-radius: 10px !important;
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        background   : #666 !important;
    }
    .CodeMirror-vscrollbar::-webkit-scrollbar-track,
    .CodeMirror-hscrollbar::-webkit-scrollbar-track{
        /*滚动条里面轨道*/
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px !important;
        background   : #333 !important;
    }
}
::v-deep .nk-page-layout-content{
    padding-bottom: 0 !important;
}
</style>
