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
    <nk-query-layout
            ref="layout"
            title="流程定义列表"
            :search-items-default="searchItemsDefault"
            :dataTableColumns="columns"
            @change="search"
    >

        <a-button-group slot="action">
            <a-button type="primary" @click="toCreate">新建</a-button>
        </a-button-group>

    </nk-query-layout>
</template>

<script>
  import NkUtil from "@/utils/NkUtil";
  export default {
    data(){
      return {
        columns:[
          { field: 'id',                title: 'id',            width: '35%'},
          { field: 'key',               title: 'key',           width: '15%', sortable:true, },
          { field: 'name',              title: 'name',          width: '25%', sortable:true, },
          { field: 'version',           title: 'version',       width: '15%' , sortable:true, },
          {                             title: 'ACTION',        width: '10%' ,
            slots: { default: ({row},h) => {
                return [h(
                  'router-link',
                  {
                    props:{to: 'definitions/detail/'+row.id}
                  },
                  "详情"
                )]
              }}
          },
        ],
        searchItemsDefault:[
          {
            name:'Version',
            field:'latest',
            component:'nk-search-options-single',
            defaultOptions:false,
            defaultValue:'true',
            options:{
              buckets:[{
                name: 'All',
                key: 'false'
              },{
                name: 'Latest',
                key: 'true'
              }]
            }
          },
          {
            name:'Key',
            field:'keyword',
            component:'nk-search-options-text',
            placeholder:'key'
          },
        ]
      }
    },
    methods:{
      search(params){
        this.$http.post("/api/def/bpm/process/definitions",NkUtil.translateParamsToQueryString(params))
          .then((res)=>{
            this.$emit("setTab","流程定义");
            if(this.$refs.layout)
                this.$refs.layout.setData(res.data)
          });
      },
      toCreate(){
        this.$router.push("/apps/def/bpm/process/definitions/designer")
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
