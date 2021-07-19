<template>
    <nk-dashboard-card :title="title||'欢迎使用TS5'">
        <a-menu-item slot="menu" key="0">
            <a-icon type="edit" /> 编辑
        </a-menu-item>
    </nk-dashboard-card>
</template>

<script>

export default {
    props:{
        title:String,
        config:Object,
    },
    data(){
        return {
        }
    },
    mounted() {
    },
    methods:{
        ready(){
        },
        resized(){
        },
        updateDef(){
            this.$emit('update',{});
        }
    }
}
</script>

<style scoped>

</style>