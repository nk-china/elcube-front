<template>
    <a v-if="type==='a'" @click="click">
        <slot></slot>
    </a>
    <a-button v-else :type="type" @click="click">
        <slot></slot>
    </a-button>

</template>

<script>
export default {
    props:{
        type:{
            type:String,
            default:"a"
        },
        doc:Object
    },
    computed:{
        to(){
            return '/apps/docs/detail/'+this.doc['docId'];
        }
    },
    methods:{
        click(e){
            this.$router.push(this.to);
            this.$emit("click",e);
            e.stopPropagation();
        }
    }
}
</script>

<style scoped>

</style>