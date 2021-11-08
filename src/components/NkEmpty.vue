<template>
    <a-empty v-if="visible" :image="simpleImage" style="margin: 5px;" />
</template>

<script>
import { Empty } from 'ant-design-vue';
export default {
    props:{
        data: {}
    },
    beforeCreate() {
        this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
    },
    computed:{
        visible(){
            return !this.data || this.data.length === 0;
        }
    }
}
</script>

<style scoped>

</style>