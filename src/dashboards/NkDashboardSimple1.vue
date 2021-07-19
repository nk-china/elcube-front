<template>
    <nk-dashboard-card :title="title||'我的任务'" :setting="setting">
        <a-statistic title="Active Users" :value="112893" style="margin-right: 50px" />
        <a-statistic title="Account Balance (CNY)" :precision="2" :value="112893" />
        <a-button @click="updateDef">更新</a-button>


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
        this.$nextTick(()=>{

        })
    },
    methods:{
        ready(){
        },
        resized(){
        },
        updateDef(){
            this.$emit('update',{});
        },
        setting(){
            console.log("setting")
        }
    }
}
</script>

<style scoped>

</style>