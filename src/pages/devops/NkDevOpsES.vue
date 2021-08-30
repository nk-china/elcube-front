<template>
    <nk-page-layout title="索引管理" sub-title="管理ElasticSearch索引">

        <nk-card class="card" title="索引管理">

            <a-button @click="reindex">重建索引</a-button>

        </nk-card>
    </nk-page-layout>
</template>

<script>

    export default {
        data() {
            return {
            }
        },
        created() {
        },
        methods: {
            reindex(){
                this.$http.post('/api/ops/es/docs/reindex','dropFirst=true&docType=')
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
