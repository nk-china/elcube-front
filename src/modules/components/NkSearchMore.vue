
<!--已经弃用-->

<!--
	This file is part of ELCard.
	ELCard is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCard is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <nk-search-item v-if="options && options.length" :min="120">
        <a-select
                ref="select"
                mode="multiple"
                :maxTagCount="1"
                dropdownClassName="more"
                class="more"
                placeholder="更多条件..."
                @select="select"
                @change="change"
                size="small"
        >
            <a-select-option v-for="(item,index) in options" :key="index">
                {{item.name}}
            </a-select-option>
        </a-select>
    </nk-search-item>
</template>

<script>
  export default {
    props:{
      options:Array
    },
    data(){
      return {
        value: []
      }
    },
    methods:{
      select(){
        this.$refs.select.blur();
      },
      change(e){
        this.value = e;

        let selected = [];
        this.value.forEach(i=>{
          selected.push(this.options[i])
        })

        this.$emit("change",selected);
      }
    }
  }
</script>

<style scoped>

</style>
