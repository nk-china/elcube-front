<template>
    <nk-query-layout
        ref="layout"
        title="交易伙伴"
        sub-title="这里是交易伙伴管理，在这里您可以检索你的业务交易伙伴"
        :search-items-default="searchItemsDefault"
        :search-items-more-def="searchItemsMoreDef"
        :dataTableColumns="columns"
        save-as-source="$partners"
        @change="search"
        @select="selected"
    >

        <a-button-group slot="action">
            <a-dropdown :trigger="['click']" v-if="allRoles.length">
                <a-menu slot="overlay" >
                    <a-menu-item v-for="role in allRoles" :key="role.partnerRole" @click="toNewRole(role)">
                        <a-icon type="user" />{{role.partnerRoleDesc}}
                    </a-menu-item>
                </a-menu>
                <a-button type="primary"> 新建 <a-icon type="down" /> </a-button>
            </a-dropdown>
        </a-button-group>

        <nk-page-preview :params="previewParams" :visable.sync="preViewVisable" @close="previewClose"></nk-page-preview>

    </nk-query-layout>
</template>

<script>
import NkFormat from "../utils/NkFormat";
import NkPagePreview from "./NkPagePreview";
import qs from 'qs';

export default {
    components: {NkPagePreview},
    data(){
        return {
            allRoles:[],
            columns:[
                { type: 'seq',            title: '#',         width: '36'},
                { field: 'partnerType',   title: '类型', width: '10%',editRender: { name: 'input' },sortable:true,
                    formatter: [
                        'nkFromList',
                        [
                            {label:"自然人",value:'NATURAL'},
                            {label:"法人",value:'LEGAL'},
                            {label:"组织机构",value:'ORG'},
                        ]
                    ]},
                { field: 'partnerName',   title: '名称', width: '25%',editRender: { name: 'input' },sortable:true, params:{ orderField: 'partnerName.original' }},
                { field: 'roles',         title: '角色', width: '20%',editRender: { name: 'input' },sortable:true,
                    slots: { default: ({row},h) => {
                            let tags = [],index = 0;
                            row.roles.forEach(role=>{
                                let roleId = row.roleIds && row.roleIds[index];
                                if(roleId)
                                    tags.push(
                                        h(
                                            'nk-doc-link',
                                            {props:{doc: {classify:"PARTNER",docId:roleId}}},
                                            [h('a-tag',{props:{color: 'blue'},},NkFormat.nkFromList(role,this.allRoles,'partnerRoleDesc','partnerRole'))]
                                        )
                                    );
                                index ++;
                            });
                            return tags;
                        }}
                },
                { field: 'tags',          title: 'TAGS',    width: '20%',editRender: { name: 'input' },
                    slots: { default: ({row},h) => {
                            let tags = [];
                            row.tags && row.tags.forEach(tag=>{
                                tags.push(h('a-tag',tag))
                            });
                            return tags;
                        }}
                },
                { field: 'updatedTime',   title: '更新时间', width: '10%',editRender: { name: 'input' },sortable:true, formatter:'nkDatetimeFriendly' },
                {                         title: '操作',    width: '10%',
                    slots: { default: ({row},h) => {
                            return [h(
                                'nk-doc-link',
                                {props:{doc: {classify:"PARTNER",docId:row['roleIds'][0]}}},
                                "详情"
                            )]
                        }}
                },
            ],
            searchItemsDefault:[
                {
                    name:'角色',
                    field:'roles',
                    component:'nk-search-options-multiple',
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
                    name:'标签',
                    field:'tags',
                    component:'nk-search-options-multiple',
                    agg:true
                }
            ],
            previewParams: {},
            preViewVisable: false
        }
    },
    mounted(){
        this.$http.get("/api/partner/all/roles")
            .then(response=>{
                this.allRoles = response.data;
            })
    },
    methods:{
        search(params){
            this.$http.post("/api/partner/list",qs.stringify(params, { arrayFormat: 'brackets' }))
                .then((res)=>{
                    this.$emit("setTab","交易伙伴");
                    if(this.$refs.layout)
                        this.$refs.layout.setData(res.data)
                });
        },
        tagClick(e){
            this.$router.push('/apps/partners/detail?id='+e.partnerId+'&role='+e.role)
        },
        toNewRole(role){
            this.$router.push('/apps/partners/new-partner/'+role.partnerRole);
        },
        selected({row}){
            this.preViewVisable = true;
            this.previewParams  = {
                mode: "detail",
                classify:"PARTNER",
                docId:row['roleIds'][0]
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
