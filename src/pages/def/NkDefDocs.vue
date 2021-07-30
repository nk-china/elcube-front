<template>
    <nk-query-layout
        ref="layout"
        title="单据类型"
        :search-items-default="searchItemsDefault"
        :dataTableColumns="columns"
        :selectable="false"
        :init-rows="50"
        @change="search"
    >
        <a-button-group slot="action">
            <a-button type="primary" @click="toCreate">新建</a-button>
        </a-button-group>
    </nk-query-layout>
</template>

<script>
import qs from 'qs';

const formatVersion = ({cellValue})=>{
    return cellValue.split('-')[0];
}
const classifies = [
    {label: "伙伴",value:"PARTNER"},
    {label: "交易",value:"TRANSACTION"},
];
export default {
    data(){
        return {
            docTypes:[]
        }
    },
    computed:{
        docTypeOptions(){
            return this.docTypes.map(docType=>{
                return {
                    value:docType.docType,
                    label:docType.docType,
                };
            });
        },
        searchItemsDefault(){
            return [
                {
                    name:'单据分类',
                    field:'docClassify',
                    component:'nk-search-options-single',
                    option:{
                        buckets:classifies
                    }
                },
                {
                    name:'单据类型',
                    field:'docType',
                    component:'nk-search-options-single',
                    option:{
                        buckets: this.docTypeOptions
                    }
                },
                {
                    name:'状态',
                    field:'state',
                    component:'nk-search-options-single',
                    option:{
                        buckets: [
                            {label: "Active",value:"Active"},
                            {label: "InActive",value:"InActive"},
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
        },
        columns(){
          return [
              { type: 'seq',            title: '#',       width: '4%', editRender: { name: 'input' } },
              { field: 'docClassify',   title: '单据分类', width: '8%',editRender: { name: 'input' },sortable:true, params:{ orderField: 'DOC_CLASSIFY' },
                  formatter: [
                      'nkFromList',
                      classifies
                  ]
              },
              { field: 'docType',       title: '单据类型', width: '9%',editRender: { name: 'input' },sortable:true, params:{ orderField: 'DOC_TYPE' } },
              { field: 'docName',       title: '类型描述', width: '20%',editRender: { name: 'input' } },
              { field: 'version',       title: '版本',    width: '8%',editRender: { name: 'input' },sortable:true, params:{ orderField: 'VERSION' }, formatter: formatVersion },
              { field: 'validFrom',     title: '有效期起', width: '10%'},
              { field: 'validTo',       title: '有效期至', width: '10%'},
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
              { field: 'updatedTime',   title: '更新时间',  width: '10%',editRender: { name: 'input' },sortable:true, params:{ orderField: 'UPDATED_TIME' }, formatter: 'nkDatetimeFriendly' },
              {                         title: 'ACTION',
                  slots: { default: ({row},h) => {
                      return [h(
                          'router-link',
                          {
                              props:{to: `/apps/def/doc/detail/${row.docType}/${row.version}`}
                          },
                          "详情"
                      )]
                  }}
              },
          ];
        }
    },
    created(){
        this.$http.get("/api/def/doc/type/types")
            .then(res=>{
                this.docTypes = res.data;
            })
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
