<template>
    <nk-query-layout
        ref="layout"
        title="业务"
        sub-title="这里是业务管理，在这里您可以检索你项下的业务"
        :search-items-default="searchItemsDefault"
        :search-items-more-def="searchItemsMoreDef"
        :dataTableColumns="columns"
        save-as-source="$projects"
        @change="search"
        @select="selected"
    >

        <a-button-group slot="action">
            <a-dropdown :trigger="['click']">
                <a-menu slot="overlay" >
                    <a-menu-item v-for="type in projectTypes" :key="type.projectType" @click="create(type)">
                        <a-icon type="project" />{{type.projectTypeDesc}}
                    </a-menu-item>
                </a-menu>
                <a-button type="primary"> 新建 <a-icon type="down" /> </a-button>
            </a-dropdown>
        </a-button-group>

        <a-modal v-model="createModal.visible"
                 :confirm-loading="createModal.confirmLoading"
                 title="编辑业务"
                 centered
                 @ok="createModalOk">
            <a-form-model ref="createModal" :model="createModal.project" :rules="createModal.rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <a-form-model-item label="业务类型" prop="projectType">
                    <a-select v-model="createModal.project.projectType" placeholder="请选择">
                        <a-select-option v-for="item in createModal.projectTypes" :key="item.projectType">
                            {{item.projectTypeDesc}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="业务名称" prop="projectName">
                    <a-input v-model="createModal.project.projectName" />
                </a-form-model-item>
                <a-form-model-item label="备注">
                    <a-input v-model="createModal.project.projectDesc" type="textarea" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>

        <nk-page-preview :params="previewParams" :visable.sync="preViewVisable" @close="previewClose"></nk-page-preview>

    </nk-query-layout>
</template>

<script>
import NkUtil from "../utils/NkUtil";
import NkPagePreview from "../pages/NkPagePreview";

export default {
    components: {NkPagePreview},
    data(){
        return {
            columns:[
                { type: 'seq',              title: '#',       width: '36'},
                { field: 'docType',         title: '业务类型', width: '8%',editRender: { name: 'input' },sortable:true },
                { field: 'docNumber',       title: '业务编号', width: '12%',editRender: { name: 'input' },sortable:true },
                { field: 'docDesc',         title: '业务描述', width: '22%',editRender: { name: 'input' },sortable:true ,
                    params:{ orderField: 'docName.original' },
                    slots: { default: ({row},h) => {
                            return [h(
                                'nk-doc-link',
                                {props:{doc: row}},
                                row.docDesc || row.docName
                            )]
                        }}
                },
                { field: 'partnerName',     title: '交易伙伴', width: '12%',editRender: { name: 'input' },sortable:true },
                { field: 'updatedTime',     title: '更新时间', width: '10%',editRender: { name: 'input' },sortable:true, formatter: 'nkDatetimeFriendly' },
                { field: 'projectStateDesc',title: '里程碑',  width: '9%',  editRender: { name: 'input' },sortable:true,
                    params:{ orderField: 'projectStateDesc' },
                },
                { field: 'docStateDesc',    title: '状态',    width: '9%',  editRender: { name: 'input' },sortable:true,
                    params:{ orderField: 'docStateDesc' },
                },
                {                           title: '操作',    width: '9%',
                    slots: { default: ({row},h) => {
                            return [h(
                                'nk-doc-link',
                                {props:{doc: row}},
                                "详情",
                            )]
                        }}
                },
            ],
            searchItemsDefault:[
                {
                    name:'业务类型',
                    field:'docTypeDesc',
                    component:'nk-search-options-single',
                    agg:true
                },
                {
                    name:'关键字',
                    field:'keyword',
                    component:'nk-search-options-text',
                    placeholder:'请输入关键字'
                },
            ],
            searchItemsMoreDef:[
                {
                    name:'更新时间',
                    field:'updatedTime',
                    component:'nk-search-options-date-range'
                },
                {
                    name:'项目经理',
                    field:'createdBy',
                    component:'nk-search-options-text',
                    placeholder: '项目经理名称'
                },
                {
                    name:'标签',
                    field:'tags',
                    component:'nk-search-options-multiple',
                    agg:true
                },
                {
                    name:'状态',
                    field:'projectState',
                    component:'nk-search-options-single',
                    defaulltOpen:true,
                    agg:true
                }
            ],
            createModal:{
                visible:false,
                confirmLoading:false,
                project:{},
                rules:{
                    projectType:[
                        { required: true, message: '请选择业务类型', trigger: 'blur' },
                    ],
                    projectName:[
                        { required: true, message: '请输入业务名称', trigger: 'blur' },
                    ]
                }
            },
            projectTypes:[],
            previewParams: {},
            preViewVisable: false
        }
    },
    created(){
        this.$http.get("/api/project/type/list")
            .then(res=>{
                this.projectTypes = res.data;
            });
    },
    methods:{
        search(params){
            this.$http.postJSON("/api/doc/list",NkUtil.toEsParams(params,{"term":{classify:"PROJECT"}}))
                .then((res)=>{
                    this.$emit("setTab","业务");
                    if(this.$refs.layout)
                        this.$refs.layout.setData(res.data)
                });
        },
        create(projectType){
            this.$router.push(`/apps/projects/create/${projectType.projectType}`)
        },
        createModalOpen(){

            new Promise((resolve)=>{

                if(!this.createModal.projectTypes){
                    this.$http.get("/api/project/type/list")
                        .then(res=>{
                            this.createModal.projectTypes = res.data;
                            resolve();
                        }).catch(resolve);
                }else{
                    resolve();
                }
            }).finally(()=>{
                this.createModal.project = {
                }
                this.createModal.visible = true;
            });

        },
        createModalProjectTypeChanged(e){
            this.createModal.project.projectType = e;
        },
        createModalOk(){
            this.$refs.createModal.validate(valid => {
                if (valid) {
                    this.createModal.confirmLoading = true;
                    this.$http.postJSON("/api/project/create",this.createModal.project)
                        .then(()=>{
                            setTimeout(()=>{
                                this.createModal.confirmLoading = false;
                                this.createModal.visible = false;
                                this.$refs.layout.reload();
                            },1000)// 延迟1s，避免es索引更新不及时
                        })

                } else {
                    console.log('error')
                    return false;
                }
            });
        },
        selected({row}){
            this.preViewVisable = true;
            this.previewParams  = {
                mode: "detail",
                classify:row.classify,
                docId:row.docId
            }
        },
        previewClose(){
            this.$refs.layout.grid().clearCurrentRow();
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
