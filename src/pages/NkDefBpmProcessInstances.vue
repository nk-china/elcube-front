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
  import qs from 'qs';
  export default {
    data(){
      return {
        columns:[
          { field: 'processInstanceId',         title: 'id',            width: '30%',editRender: { name: 'input' } },
          { field: 'processDefinitionKey',      title: 'key',           width: '10%', editRender: { name: 'input' } },
          { field: 'processDefinitionVersion',  title: 'version',       width: '8%',editRender: { name: 'input' } },
          { field: 'startTime',                 title: 'startTime',     width: '20%',editRender: { name: 'input' },sortable:true, formatter: 'nkMillisecondFriendly' },
          {                                     title: 'ACTION',        width: '10%',
            slots: { default: ({row},h) => {
                const that = this;
                return [
                    // h(
                    //     'router-link',
                    //     {
                    //         props:{to: 'partner/detail/'+row.partnerRole}
                    //     },
                    //     "详情"
                    // ),
                    h(
                        'a',
                        {
                            on:{click(){that.kill(row);}}
                        },
                        "Kill"
                    )]
              }}
          },
        ],
        searchItemsDefault:[
          {
            name:'关键字',
            field:'source',
            component:'nk-search-options-single',
            placeholder:'请输入关键字',
            defaultOptions: false,
            defaultValue: 'runtime',
            option:{
              buckets:[
                {
                  name:'进行中实例',
                  key:'runtime'
                },
                {
                  name:'历史实例',
                  key:'historic'
                }
              ]
            }
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

        if(!params.source || params.source==='runtime'){
          this.$http.post("/api/def/bpm/process/instances",qs.stringify(params, { arrayFormat: 'brackets' }))
            .then((res)=>{
              this.$emit("setTab","流程实例");
              if(this.$refs.layout)
                this.$refs.layout.setData(res.data)
            });
        }else{
          this.$http.post("/api/def/bpm/historic/process/instances",qs.stringify(params, { arrayFormat: 'brackets' }))
            .then((res)=>{
              if(this.$refs.layout)
                this.$refs.layout.setData(res.data)
            });
        }
      },
      toCreate(){
        this.$router.push("/apps/def/partner/create")
      },
      kill(e){
        this.$http.post(`/api/def/bpm/process/kill?instanceId=${e.id}`)
          .then(()=>{
          });
      }
    }
  }
</script>

<style lang="scss" scoped>
    ::v-deep a + a{
        margin-left: 5px;
    }
    ::v-deep a{
        user-select: none;
    }
</style>
