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
    <nk-page-layout title="数据同步管理" sub-title="管理ElasticSearch索引、数据映射等">

        <nk-card class="card" title="数据同步">

            <nk-form :col="1">
                <nk-form-item title="清空数据">
                    <a-switch v-model="dropFirst"></a-switch>
                </nk-form-item>
                <nk-form-item title="过滤条件">
                    <a-input v-model="where" placeholder="EQL WHERE"  addon-before="SELECT * FROM doc WHERE"></a-input>
                </nk-form-item>
                <nk-form-item title="">
                    <a-button @click="reindex">立即同步</a-button>
                </nk-form-item>
                <nk-form-item title="" v-if="message">
                    {{message}}
                </nk-form-item>
            </nk-form>

        </nk-card>

        <nk-card class="card" title="测试数据">

            <a-row type="flex" justify="center" :align="'middle'" style="margin-top: 12px;">
                <a-col :span="4"><a-button @click="random" :disabled="messageRandom">创建一亿条测试数据</a-button></a-col>
                <a-col :span="20">{{messageRandom}}</a-col>
            </a-row>

        </nk-card>
    </nk-page-layout>
</template>

<script>

    export default {
        data() {
            return {
                message:undefined,
                messageRandom:undefined,
                dropFirst:false,
                where:''
            }
        },
        created() {
        },
        methods: {
            reindex(){
                this.$http.post('/api/ops/datasync/redo',`dropFirst=${this.dropFirst}&where=${this.where}`)
                    .then(res=>{
                        this.reindexInfo(res.data);
                    })
            },
            reindexInfo(taskId){
                this.message = '请稍候...'
                const interval = setInterval(()=>{
                    this.$http.post('/api/ops/datasync/redo/'+taskId)
                        .then(res=>{
                            if(!res.data || res.data.finished===true){
                                clearInterval(interval);
                            }
                            this.message = `${res.data.message} ${res.data.totalS}/${res.data.total}`;
                        })
                        .catch(()=>{
                            clearInterval(interval);
                        })
                },200);
            },
            random(){
                this.messageRandom = "正在执行，请勿重复点击"
                this.$http.post('/api/debug/random')
                    .then(res=>{
                        console.log(res);
                        this.messageRandom = "已开始执行，请勿重复点击"
                    })
            }
        }
    }
</script>

<style scoped lang="less">
</style>
