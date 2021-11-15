<template>
    <a-input v-model="text"></a-input>
</template>

<script>
export default {
    props:{
        value: {}
    },
    computed:{
        text:{
            get(){
                return this.value;
            },
            set(v){
                this.$emit("input",v);
            }
        }
    }
}
</script>

<style scoped>

</style>