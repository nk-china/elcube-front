<template>
    <nk-search-item :label="config.name||config.label" :min="config.min" :max="config.max" :closeable="closeable" @close="close">
        <a-select
            placeholder="全部"
            v-model="value"
            :dropdownMatchSelectWidth="false"
            :default-open="config.defaulltOpen && !config.doNotOpen"
            :default-value="config.defaultValue"
            :dropdownMenuStyle="{
                    'font-size':'12px'
                }"
            @change="change" >
            <a-select-option v-if="config.defaultOptions === true || config.defaultOptions === undefined" key="">
                全部
            </a-select-option>
            <template v-if="option">
                <a-select-option v-for="(item) in option.buckets" :key="item.key||item.value">
                    {{format(item.name||item.label||item.key||item.value)}}
                    <template v-if="typeof item.docCount!=='undefined'">({{item.docCount}})</template>
                </a-select-option>
            </template>
        </a-select>
    </nk-search-item>
</template>

<script>
import NkFormat from "../../utils/NkFormat";
export default {
    props:{
        config: Object,
        option: Object,
        closeable: Boolean
    },
    data(){
        return {
            value: undefined
        }
    },
    watch:{},
    methods:{
        setValue(values){
            this.value = values&&values[this.config.field]&&values[this.config.field].term[this.config.field];
        },
        change(e){
            const term = {};
            term[this.config.field]=e;
            this.$emit("changed",{
                field:this.config.field,
                trigger:true,
                condition:e&&{term}
            })
        },
        close(){
            this.$emit("close",this.config);
        },
        format(value){
            if(this.config.formatter){
                if(this.config.formatter instanceof Array){
                    let name = this.config.formatter[0];
                    let params = [value];
                    for(let i=1;i<this.config.formatter.length;i++){
                        params.push(this.config.formatter[i])
                    }
                    let func = NkFormat[name];
                    return func.apply(this,params);
                }
                if(this.config.formatter instanceof Function){
                    return this.config.formatter(value);
                }
            }
            return value;
        }
    }
}
</script>

<style scoped>

</style>
