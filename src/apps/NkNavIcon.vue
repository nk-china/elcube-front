<template>
    <component v-if="customType" :is="customType.tag" :type="customType.type" />
    <a-icon v-else :type="type"/>
</template>

<script>
export default {
    props:{
        type:String
    },
    data(){
        return {
            aIconType:undefined,
            customType:undefined,
        }
    },
    created() {
        let type = this.type;
        if(this.type){
            if(this.type.startsWith('{')){
                try{
                    this.customType = JSON.parse(type);
                }catch (e){
                    this.aIconType = 'menu';
                    console.warn(e);
                }
            }else{
                this.aIconType = this.type;
            }
        }else{
            this.aIconType = 'menu';
        }
    }
}
</script>

<style scoped>

</style>