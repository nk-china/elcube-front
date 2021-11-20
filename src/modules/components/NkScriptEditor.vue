<template>

    <a-modal :visible="visibleSync"
             :confirm-loading="confirmLoading"
             title="脚本编辑器"
             centered
             @ok="scriptModalOk"
             @cancel="scriptModalCancel">
        <div v-if="mode">
            <div>variables:</div>
            <a-divider></a-divider>
            <a-textarea
                    :auto-size="{ minRows: 5, maxRows: 10 }" v-model="scriptSync">
            </a-textarea>
        </div>
<pre v-if="!mode">{{scriptSync}}</pre>
    </a-modal>
</template>

<script>
  export default {
    name: "NkScriptEditor",
    props:{
      mode:Boolean,
      value:Boolean,
      script:String,
      confirmLoading:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return {
        visibleSync:false,
        scriptSync:undefined
      }
    },
    watch: {
      value(){
        this.visibleSync = this.value
      },
      script(){
        this.scriptSync = this.script
      }
    },
    methods:{
      scriptModalOk(){
        this.$emit("change",this.scriptSync);
        this.$emit('input', false)
        this.visibleSync = false;
      },
      scriptModalCancel(){
        this.$emit('input', false)
      }
    }
  }
</script>

<style scoped>
    pre{
        background-color: #eee;
        padding: 10px;
        min-height: 150px;
    }
</style>
