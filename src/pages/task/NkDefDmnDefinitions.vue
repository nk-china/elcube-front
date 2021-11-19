<template>
    <nk-query-layout
            ref="layout"
            title="决策定义列表"
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
          //{ field: 'id',                title: 'id',            width: '40%'},
          { field: 'key',                               title: 'Key',           width: '23%', sortable:true, },
          { field: 'name',                              title: 'Name',          width: '20%', sortable:true, },
          { field: 'version',                           title: 'Version',       width: '10%' , sortable:true, },
          { field: 'decisionRequirementsDefinitionKey', title: 'ReqKey',        width: '23%' , sortable:true, },
          { field: 'decisionRequirementsDefinitionId',  title: 'ReqVer',        width: '14%', sortable:true,
            slots: {
              default({row}){
                if(row.decisionRequirementsDefinitionId){
                  const c = row.decisionRequirementsDefinitionId.split(":");
                  return [c[1]]
                }
                return []
              }
            }
          },
          {                                             title: 'ACTION',        width: '10%' ,
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
            option:{
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
        this.$http.post("/api/def/dmn/definitions",NkUtil.translateParamsToQueryString(params))
          .then((res)=>{
            this.$emit("setTab","决策定义");
            if(this.$refs.layout)
                this.$refs.layout.setData(res.data)
          });
      },
      toCreate(){
        this.$router.push("/apps/def/dmn/definitions/designer")
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
