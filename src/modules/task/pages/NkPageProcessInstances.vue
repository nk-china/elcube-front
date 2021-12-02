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
    <nk-query-layout
            ref="layout"
            title="流程实例列表"
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
          { field: 'processDefinitionKey',      title: 'key',           width: '15%' },
          { field: 'processDefinitionName',     title: 'Name',          width: '20%' },
          { field: 'processDefinitionVersion',  title: 'Version',       width: '10%'  },
          { field: 'startTime',                 title: 'StartTime',     width: '15%' ,sortable:true, formatter:['nkDatetimeISO'] },
          { field: 'endTime',                   title: 'EndTime',       width: '15%' ,sortable:true, formatter:['nkDatetimeISO'] },
          { field: 'state',                     title: 'State',         width: '15%' ,sortable:true },
          {                                     title: 'Action',        width: '10%' ,
            slots: { default: ({row},h) => {
                return [
                    h(
                        'router-link',
                        {props:{to: '/apps/docs/detail/'+row.businessKey}},
                        "单据"
                    ),
                    h(
                        'router-link',
                        {props:{to: '/apps/devops/process/instances/detail/'+row.id}},
                        "详情"
                    )]
              }}
          },
        ],
        searchItemsDefault:[
          // {
          //   name:'实例类型',
          //   field:'source',
          //   component:'nk-search-options-single',
          //   defaultOptions: false,
          //   defaultValue: 'runtime',
          //   options:{
          //     buckets:[
          //       {
          //         name:'进行中实例',
          //         key:'runtime'
          //       },
          //       {
          //         name:'历史实例',
          //         key:'historic'
          //       }
          //     ]
          //   }
          // },
          // {
          //   name:'关键字',
          //   field:'keyword',
          //   component:'nk-search-options-text',
          //   placeholder:'请输入关键字'
          // },
        ]
      }
    },
    methods:{
      search(params){

          // const keyValue = NkUtil.translateParamsToKeyValue(params);
        // if(!keyValue.source || keyValue.source==='runtime'){
          this.$http.post("/api/ops/bpm/instances",NkUtil.translateParamsToQueryString(params))
            .then((res)=>{
              this.$emit("setTab","流程实例");
              if(this.$refs.layout)
                this.$refs.layout.setData(res.data)
            });
        // }else{
        //   this.$http.post("/api/ops/bpm/instance/process/instances",NkUtil.translateParamsToQueryString(params))
        //     .then((res)=>{
        //       if(this.$refs.layout)
        //         this.$refs.layout.setData(res.data)
        //     });
        // }
      },
      toCreate(){
        this.$router.push("/apps/def/partner/create")
      }
    }
  }
</script>

<style lang="less" scoped>
    ::v-deep a + a{
        margin-left: 5px;
    }
    ::v-deep a{
        user-select: none;
    }
</style>
