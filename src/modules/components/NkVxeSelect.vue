<template>
    <vxe-select size="mini" v-model="nkValue" @change="change" :transfer="transfer">
        <slot></slot>
    </vxe-select>
</template>

<script>
export default {
    props:{
        type:String,
        value:{},
        transfer:Boolean
    },
    computed:{
        nkValue:{
            get(){
                if(this.type==='percent'){
                    return this.value * 100;
                }
                return this.value;
            },
            set(newValue){
                const input = this.type==='percent' ? newValue * 0.01 : newValue;
                this.$emit("input",input);
            }
        }
    },
    methods:{
        change(e){
            this.$emit("change",e);
        }
    }
}
</script>

<style scoped>

</style>