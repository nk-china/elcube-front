<template>
    <nk-page-layout title="缓存管理" sub-title="管理Redis缓存">

        <nk-card class="card" title="缓存管理">

            <a-row type="flex" justify="center" :align="'middle'">
                <a-col :span="4"><a-button @click="reindex">清空缓存</a-button></a-col>
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
                this.$http.post('/api/ops/cache/clear')
                    .then(()=>{
                        this.message = "缓存已清空";
                    })
            }
        }
    }
</script>

<style scoped lang="less">
</style>
