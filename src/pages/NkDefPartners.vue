<template>
    <nk-query-layout
            ref="layout"
            title="交易伙伴角色列表"
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
          { field: 'partnerRole',       title: '角色',    width: '8%', editRender: { name: 'input' },sortable:true, params:{ orderField: 'PARTNER_ROLE' }},
          { field: 'partnerRoleDesc',   title: '角色描述', width: '20%',editRender: { name: 'input' } },
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
        this.$http.post("/api/def/partner/type/page",qs.stringify(params, { arrayFormat: 'brackets' }))
          .then((res)=>{
            this.$emit("setTab","交易伙伴角色");
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

<style lang="scss" scoped>

</style>
