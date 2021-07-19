<template>
    <nk-search-item :label="config.name" :closeable="closeable" @close="close">
        <a-range-picker v-model="value" @change="change" />
    </nk-search-item>
</template>

<script>
  import moment from 'moment';
  export default {
    name: "NkSearchOptionsDateRange",
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
        const range = values[this.config.field];
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
          this.$emit("change",
            Object.assign(
              {
                value:{
                  from:   Math.floor(e[0].hour(0) .minute(0) .second(0) .millisecond(0)  .valueOf()/1000),
                  to:     Math.floor(e[1].hour(23).minute(59).second(59).millisecond(999).valueOf()/1000)
                },
                trigger:true
              },
              this.config
            )
          );
        }else{
          this.$emit("change",Object.assign({value:undefined,trigger:true},this.config));
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
