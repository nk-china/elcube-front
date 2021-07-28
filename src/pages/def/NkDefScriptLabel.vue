<template>
    <span>
        <router-link v-if="scriptName" :to="`/apps/def/script/detail/${scriptName}/@`">{{value}} </router-link>
        <span v-else :style="{
            color: (scriptName===''?'red':'')
        }">
            {{scriptName===''?"&lt;NotFound>":''}}{{value}}
        </span>
    </span>
</template>

<script>
  export default {
    name: "NkScriptLabel",
    props:{
      value:String
    },
    data(){
      return {
        scriptName: undefined
      }
    },
    created() {
      if(this.value && this.value.replace(/\s/g,'')) {
        this.$http.get(`/api/def/script/class/${this.value}`)
          .then(response => {
            this.scriptName = response.data;
          })
      }
    }
  }
</script>

<style scoped>
</style>
