<template>
    <nk-page-layout title="数据同步管理" sub-title="管理ElasticSearch索引、数据映射等">

        <nk-card class="card" title="数据同步">

            <a-row type="flex" justify="center" :align="'middle'">
                <a-col :span="4"><a-button @click="reindex">立即同步</a-button></a-col>
                <a-col :span="20">{{message}}</a-col>
            </a-row>

        </nk-card>
    </nk-page-layout>
</template>

<script>

    export default {
        data() {
            return {
                message:undefined
            }
        },
        created() {
        },
        methods: {
            reindex(){
                this.$http.post('/api/ops/datasync/redo','dropFirst=true&docType=')
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
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
