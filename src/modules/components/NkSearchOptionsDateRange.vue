<template>
    <nk-search-item :label="config.name" :closeable="closeable" @close="close">
        <a-range-picker v-model="value" @change="change" style="width:246px;" />
    </nk-search-item>
</template>

<script>
import moment from 'moment';
export default {
    props:{
        config: Object,
        closeable: Boolean
    },
    data(){
        return {
            value: []
        }
    },
    methods:{
        setValue(values){
            const range = values&&values[this.config.field]&&values[this.config.field].range[this.config.field]
            if(range)
                this.value = [
                    (range.from || range.from===0)&&moment(range.from*1000),
                    (range.to   || range.to  ===0)&&moment(range.to*1000)
                ];
            else
                this.value = [];
        },
        change(e){
            if(e[0]){
                const range = {};
                range[this.config.field]={
                    from:   Math.floor(e[0].hour(0) .minute(0) .second(0) .millisecond(0)  .valueOf()/1000),
                    to:     Math.floor(e[1].hour(23).minute(59).second(59).millisecond(999).valueOf()/1000)
                };
                this.$emit("changed",{
                    field:this.config.field,
                    trigger: true,
                    condition:{range}
                })
            }else{
                this.$emit("changed",{
                    field:this.config.field,
                    trigger: true,
                    condition:undefined
                })
            }
        },
        close(){
            this.$emit("close",this.config);
        }
    }
}
</script>

<style scoped>

</style>
