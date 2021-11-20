<template>
    <a-select v-if="mode==='tags'" :default-value="value" mode="tags" :options="options" @change="change"></a-select>
    <a-input v-else :default-value="singleValue" v-model="inputValue" @change="changeSingle"></a-input>
</template>

<script>
import moment from 'moment'
export default {
    props:{
        value: {},
        mode:{
            type:String,
            default:'range'
        },
        options:Array
    },
    data(){
        return {
            inputValue:undefined,
        }
    },
    watch:{
        mode(){
            if(this.mode==='range'){
                if(!this.value){
                    this.$emit("input",[]);
                }else if(!(this.value instanceof Array)){
                    this.$emit("input",[this.value]);
                }
            }else{
                if(this.value instanceof Array){
                    this.$emit("input",this.value[0]);
                    this.inputValue = this.value[0];
                }else{
                    this.inputValue = this.value;
                }
            }
        }
    },
    computed:{
        singleValue(){
            if(!this.value){
                return undefined;
            }else if(typeof this.value === 'string'){
                return this.value;
            }
            return this.value.toString();
        }
    },
    methods:{
        moment,
        change(value){
            this.$emit("input",value);
        },
        changeSingle(){
            this.$emit("input",this.inputValue);
        }
    }
}
</script>

<style scoped>

</style>