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
  import qs from 'qs';
  export default {
    data(){
      return {
        columns:[
          { field: 'deploymentId',      title: 'deploymentId',  width: '20%', editRender: { name: 'input' }, },
          { field: 'key',               title: 'key',           width: '10%', editRender: { name: 'input' }, sortable:true, },
          { field: 'name',              title: 'name',          width: '20%', editRender: { name: 'input' }, sortable:true, },
          { field: 'version',           title: 'version',       width: '8%',  editRender: { name: 'input' }, sortable:true, },
          {                             title: 'ACTION',        width: '8%',
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
                key: ''
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
        this.$http.post("/api/def/bpm/process/definitions",qs.stringify(params, { arrayFormat: 'brackets' }))
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

<style lang="scss" scoped>

</style>
