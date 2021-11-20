<template>
    <a-range-picker v-if="mode==='range'"
                    :default-value="value&&[value[0]&&moment(value[0], 'YYYY-MM-DD'),value[1]&&moment(value[1], 'YYYY-MM-DD')]"
                    format="YYYY-MM-DD"
                    @change="change"></a-range-picker>
    <a-date-picker  v-else
                    :default-value="singleValue&&moment(singleValue, 'YYYY-MM-DD')"
                    format="YYYY-MM-DD"
                    @change="changeSingle"></a-date-picker>
</template>

<script>
import moment from 'moment'
export default {
    props:{
        value: {},
        mode:{
            type:String,
            default:'range'
        }
    },
    watch:{
        mode(){
            if(this.mode==='range'){
                if(!this.value){
                    this.$emit("input",[undefined,undefined]);
                }else if(!(this.value instanceof Array)){
                    this.$emit("input",[undefined,undefined]);
                }
            }else{
                if(this.value instanceof Array){
                    this.$emit("input",undefined);
                }
            }
        }
    },
    computed:{
        singleValue(){
            if(typeof this.value === 'string'){
                return this.value;
            }
            return undefined;
        }
    },
    methods:{
        moment,
        change(value){
            this.$emit("input",value[0]&&value[1]&&[moment(value[0]).format('YYYY-MM-DD'),moment(value[1]).format('YYYY-MM-DD')]);
        },
        changeSingle(value){
            this.$emit("input",value&&moment(value).format('YYYY-MM-DD'));
        }
    }
}
</script>

<style scoped>

</style>