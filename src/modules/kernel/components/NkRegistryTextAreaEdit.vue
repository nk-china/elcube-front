<template>
    <a-textarea v-model="text" :auto-size="{minRows:5,maxRows:20}"></a-textarea>
</template>

<script>
export default {
    props:{
        value: String
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