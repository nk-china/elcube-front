<template>
    <nk-search-item :label="config.name" :closeable="closeable" @close="close">
        <a-input v-model="value" :placeholder="config.placeholder" @keydown="keydown" @change="change" allow-clear />
    </nk-search-item>
</template>

<script>
  export default {
    name: "NkSearchOptionsDateRange",
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
        this.value = values[this.config.field];
      },
      keydown(e){
        if(e.key==='Enter'){
          this.$emit("change",Object.assign({value:this.value,trigger:true}, this.config));
          e.target.blur();
        }
      },
      change(){
        this.$emit("change",Object.assign({value:this.value}, this.config));
      },
      close(){
        this.$emit("close",this.config);
      }
    }
  }
</script>

<style scoped>

</style>
