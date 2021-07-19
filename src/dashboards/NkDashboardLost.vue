<template>
    <nk-dashboard-card :title="title">
        <div style="color: darkred;font-size: 18px;">组建缺失</div>
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
        }
    }
}
</script>

<style scoped>

</style>