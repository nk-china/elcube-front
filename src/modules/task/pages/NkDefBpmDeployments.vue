<template>
    <nk-query-layout
            ref="layout"
            title="部署记录"
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
          { field: 'deploymentId',      title: 'deploymentId',  width: '30%', editRender: { name: 'input' } },
          { field: 'key',               title: 'key',           width: '12%', editRender: { name: 'input' } },
          { field: 'version',           title: 'version',       width: '8%',editRender: { name: 'input' } },
          { field: 'id',                title: 'id',            width: '40%',editRender: { name: 'input' } },
          {                             title: 'ACTION',        width: '10%',
            slots: { default: ({row},h) => {
                return [h(
                  'router-link',
                  {
                    props:{to: 'partner/detail/'+row.partnerRole}
                  },
                  "详情"
                )]
              }}
          },
        ],
        searchItemsDefault:[
          {
            name:'关键字',
            field:'keyword',
            component:'nk-search-options-text',
            placeholder:'请输入关键字'
          },
        ]
      }
    },
    methods:{
      search(params){
        this.$http.post("/api/def/bpm/deployments",qs.stringify(params, { arrayFormat: 'brackets' }))
          .then((res)=>{
            this.$emit("setTab","流程部署记录");
            if(this.$refs.layout)
                this.$refs.layout.setData(res.data)
          });
      },
      toCreate(){
        this.$router.push("/apps/def/partner/create")
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
