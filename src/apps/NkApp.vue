<!--
	This file is part of ELCube.
	ELCube is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCube is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
-->
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
