<template>
    <a-config-provider :locale="zh_CN">
        <router-view class="router-view"></router-view>
    </a-config-provider>
</template>
<script>
import {mapState} from 'vuex';
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
  export default {
    name: 'App',
    data() {
      return {
        zh_CN,
      };
    },
      computed:{
        ...mapState("UI",["errors"])
      },
    created() {
      if(this.$i18n){
        this.$i18n.locale = this.$route.query.lang||'zh_CN';
      }
    }
  };
</script>
<style  lang="less">
</style>
