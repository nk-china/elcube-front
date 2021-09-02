<template>
    <nk-search-item :label="config.name" :closeable="closeable" @close="close">
        <a-input-group>
            <a-input-number class="i1" v-model="value.from" :placeholder="config.placeholderFrom||config.placeholder"
                            @keydown="keydown" @change="change" :min="config.from" :max="config.to" size="small" />
            <a-input-number class="i2"
                    style=" "
                    placeholder="~"
                    disabled size="small"
            />
            <a-input-number class="i3" v-model="value.to"   :placeholder="config.placeholderTo||config.placeholder"
                            @keydown="keydown" @change="change" :min="config.from" :max="config.to" size="small" />
        </a-input-group>
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
        value: {}
      }
    },
    methods:{
      setValue(values){
        this.value = values[this.config.field]||{};
      },
      keydown(e){
        if(e.key==='Enter'){
          this.emit(true);
          e.target.blur();
        }
      },
      change(){
        this.emit(false);
      },
      emit(trigger){
        this.$emit("change",Object.assign(
          {
            value:{
              from:this.value.from || this.value.from===0?this.value.from:this.config.from,
              to:  this.value.to   || this.value.to  ===0?this.value.to:  this.config.to,
            },trigger
          },
          this.config
        ));
      },
      close(){
        this.$emit("close",this.config);
      }
    }
  }
</script>

<style scoped>
    ::v-deep .ant-input-group{
        padding: 0 3px;
        margin-top: 4px;
    }
    .i1{
        border-radius: 5px 0 0 5px;
        width: 100px;
    }
    .i2{
        border-radius: 0;
        width: 30px;
        border-left: 0;
        border-right: 0;
        pointer-events: none;
        background-color: #fff;
    }
    .i3{
        border-radius: 0 5px 5px 0;
        width: 100px;
    }
</style>
