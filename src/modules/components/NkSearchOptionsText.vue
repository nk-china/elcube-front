<template>
    <nk-search-item :label="config.name" :closeable="closeable" @close="close">
        <a-input ref="input" v-model="value" :placeholder="config.placeholder" @keydown="keydown" @change="change" allow-clear/>
    </nk-search-item>
</template>

<script>
export default {
    props:{
        config: Object,
        closeable: Boolean
    },
    data(){
        return {
            value: undefined
        }
    },
    methods:{
        setValue(values){
            this.value = values&&values[this.config.field]&&values[this.config.field].multi_match.query;
        },
        keydown(e){
            if(e.key==='Enter'){
                const multi_match = {
                    query:this.value,
                    fields:this.config.field instanceof Array ? this.config.field : [this.config.field],
                };
                this.$emit("changed",{
                    field:this.config.field,
                    trigger:true,
                    highlight:true,
                    condition:this.value&&{multi_match}
                })
                e.target.blur();
            }
        },
        change(){
            const multi_match = {
                query:this.value,
                fields:this.config.field instanceof Array ? this.config.field : [this.config.field],
            };
            this.$emit("changed",{
                field:this.config.field,
                trigger:false,
                highlight:true,
                condition:this.value&&{multi_match}
            })
        },
        close(){
            this.$emit("close",this.config);
        }
    }
}
</script>

<style scoped>

</style>
