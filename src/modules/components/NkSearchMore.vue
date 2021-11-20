
<!--已经弃用-->

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
