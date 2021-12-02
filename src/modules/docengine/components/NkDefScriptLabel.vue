<!--
	This file is part of EAsis.
	EAsis is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	EAsis is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with EAsis.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <span v-if="beanDescribe">
        <template v-if="beanDescribe.groovy">
            <template v-if="beanDescribe.debug">
                <router-link :to="`/apps/def/component/detail/${beanDescribe.className}/${beanDescribe.version}`" style="color: #fa8c16">{{value}}</router-link>
                <a-tag color="orange" style="margin-left: 5px;">Debug</a-tag>
            </template>
            <template v-else-if="beanDescribe.state==='Active'">
                <router-link :to="`/apps/def/component/detail/${beanDescribe.className}/${beanDescribe.version}`" style="color: #52c41a">{{value}}</router-link>
                <a-tag color="green"  style="margin-left: 5px;">Active</a-tag>
            </template>
            <template v-else-if="beanDescribe.state==='InActive'">
                <router-link :to="`/apps/def/component/detail/${beanDescribe.className}/${beanDescribe.version}`" style="color: #1890ff">{{value}}</router-link>
                <a-tag color="blue"   style="margin-left: 5px;">InActive</a-tag>
            </template>
            <template v-else-if="beanDescribe.state==='Native'">
                <router-link :to="`/apps/def/component/detail/${beanDescribe.className}/${beanDescribe.version}`" style="color: #1890ff">{{value}}</router-link>
                <a-tag color="blue"   style="margin-left: 5px;">Native</a-tag>
            </template>
        </template>
        <span v-else-if="beanDescribe.className">
            {{value}}<a-tag color="blue" style="margin-left: 5px;">Native</a-tag>
        </span>
        <span v-else>
            {{value}}<a-tag color="red" style="margin-left: 5px;">NotFound</a-tag>
        </span>
    </span>
    <span v-else>{{value}}</span>
</template>

<script>
  export default {
    name: "NkScriptLabel",
    props:{
      value:String
    },
    data(){
      return {
          beanDescribe: undefined
      }
    },
    created() {
      if(this.value && this.value.replace(/\s/g,'')) {
        this.$http.get(`/api/def/resources/bean/${this.value}`)
          .then(response => {
            this.beanDescribe = response.data;
          })
      }
    }
  }
</script>

<style scoped>
</style>
