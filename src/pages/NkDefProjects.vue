<template>
    <nk-query-layout
            ref="layout"
            title="业务类型列表"
            :search-items-default="searchItemsDefault"
            :dataTableColumns="columns"
            :selectable="false"
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
          { type: 'seq',                title: '#',       width: '5%',editRender: { name: 'input' } },
          { field: 'projectType',       title: '业务类型', width: '8%', editRender: { name: 'input' },sortable:true, params:{ orderField: 'PROJECT_TYPE' }},
          { field: 'projectTypeDesc',   title: '类型描述', width: '20%',editRender: { name: 'input' } },
          { field: 'version',           title: '版本',    width: '6%', editRender: { name: 'input' },sortable:true, params:{ orderField: 'VERSION' } },
          { field: 'validFrom',         title: '有效期自', width: '8%',editRender: { name: 'input' } },
          { field: 'validTo',           title: '有效期至', width: '8%',editRender: { name: 'input' } },
          { field: 'refObjectType',     title: '对象扩展', width: '20%',editRender: { name: 'input' } },
          { field: 'updatedTime',       title: '更新时间', width: '10%',editRender: { name: 'input' },sortable:true, params:{ orderField: 'UPDATED_TIME' }, formatter: 'nkDatetimeFriendly' },
          { field: 'state',             title: '状态',    width: '7%', editRender: { name: 'input' },sortable:true, params:{ orderField: 'STATE' },
            formatter: [
              'nkFromList',
              [
                {label:"新创建",value:'NEW'},
                {label:"激活",value:'ACTIVE'},
                {label:"禁用",value:'DISABLE'},
              ]
            ]
          },
          {                             title: 'ACTION',  width: '8%',
            slots: { default: ({row},h) => {
                return [h(
                  'router-link',
                  {
                    props:{to: 'project/detail/'+row.projectType+'/'+row.version}
                  },
                  "详情"
                )]
              }}
          },
        ],
        searchItemsDefault:[
          {
            name:'业务类型',
            field:'projectType',
            component:'nk-search-options-text',
            placeholder:'请输入业务类型'
          },
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
        this.$http.post("/api/def/project/type/page",qs.stringify(params, { arrayFormat: 'brackets' }))
          .then((res)=>{
            this.$emit("setTab","业务类型");
            if(this.$refs.layout)
                this.$refs.layout.setData(res.data)
          });
      },
      toCreate(){
        this.$router.push("/apps/def/project/create")
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
