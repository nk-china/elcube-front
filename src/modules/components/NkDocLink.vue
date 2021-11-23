<template>
    <a v-if="type==='a'" @click="click">
        <slot v-if="$slots.default"></slot>
        <template v-else>{{doc.docName}}</template>
    </a>
    <a-button v-else :type="type" @click="click">
        <slot v-if="$slots.default"></slot>
        <template v-else>{{doc.docName}}</template>
    </a-button>
</template>

<script>
export default {
    props:{
        type:{
            type:String,
            default:"a"
        },
        doc:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    methods:{
        click(e){
            this.$router.push(`/apps/docs/detail/${this.doc.docId}`);
            this.$emit("click",e);
            e.stopPropagation();
        }
    }
}
</script>

<style scoped>

</style>