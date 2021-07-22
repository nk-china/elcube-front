<template>
    <nk-query-layout
        ref="layout"
        title="单据类型"
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
            classify:[]
        }
    },
    computed:{
        searchItemsDefault(){
            return [
                {
                    name:'单据分类',
                    field:'docClassify',
                    component:'nk-search-options-single',
                    option:{
                        buckets:this.options
                    }
                },
                {
                    name:'单据类型',
                    field:'docType',
                    component:'nk-search-options-text',
                    placeholder:'请输入单据类型'
                },
                {
                    name:'关键字',
                    field:'keyword',
                    component:'nk-search-options-text',
                    placeholder:'请输入关键字'
                },
            ]
        },
        columns(){
          return [
              { type: 'seq',            title: '#',       width: '4%', editRender: { name: 'input' } },
              { field: 'docClassify',   title: '单据分类', width: '14%',editRender: { name: 'input' },sortable:true, params:{ orderField: 'DOC_CLASSIFY' },
                  formatter: [
                      'nkFromList',
                      this.classify
                  ]
              },
              { field: 'docType',       title: '单据类型', width: '9%',editRender: { name: 'input' },sortable:true, params:{ orderField: 'DOC_TYPE' } },
              { field: 'docName',       title: '类型描述', width: '20%',editRender: { name: 'input' } },
              { field: 'version',       title: '版本',    width: '10%',editRender: { name: 'input' },sortable:true, params:{ orderField: 'VERSION' } },
              { field: 'updatedTime',   title: '更新时间',  width: '15%',editRender: { name: 'input' },sortable:true, params:{ orderField: 'UPDATED_TIME' }, formatter: 'nkDatetimeFriendly' },
              { field: 'state',         title: '状态',     width: '10%', editRender: { name: 'input' },sortable:true, params:{ orderField: 'STATE' },
                  formatter: [
                      'nkFromList',
                      [
                          {label:"新创建",value:'NEW'},
                          {label:"激活",value:'ACTIVE'},
                          {label:"禁用",value:'DISABLE'},
                      ]
                  ]
              },
              {                         title: 'ACTION',  width: '10%',
                  slots: { default: ({row},h) => {
                          return [h(
                              'router-link',
                              {
                                  props:{to: '/apps/def/doc/detail/'+row.docType}
                              },
                              "详情"
                          )]
                      }}
              },
          ];
        },
        options(){
            const options = [];
            this.classify.forEach((item)=>{
                options.push({name:item.label,key:item.value});
            })
            return options;
        }
    },
    created() {
        this.$http.get("/api/def/doc/type/classify")
            .then(res=>{
                this.classify = res.data;
            });
    },
    methods:{
        search(params){
            this.$http.post("/api/def/doc/type/page",qs.stringify(params, { arrayFormat: 'brackets' }))
                .then((res)=>{
                    this.$emit("setTab","单据类型");
                    if(this.$refs.layout)
                        this.$refs.layout.setData(res.data)
                });
        },
        toCreate(){
            this.$router.push("/apps/def/doc/create")
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
