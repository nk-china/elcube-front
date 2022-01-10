<!--
	This file is part of ELCube.
	ELCube is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCube is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <nk-query-layout
        ref="layout"
        :title="custom.title"
        :sub-title="custom.subTitle"
        :search-items-default="custom.searchItemsDefault"
        :search-items-more-def="custom.searchItemsMoreDef"
        :dataTableColumns="custom.columns"
        :save-as-source="$route.params.id"
        :init-rows="custom.defaultRows"
        :border="custom.border"
        :sortConfig="custom.sortConfig"
        :lazy="true"
        :selectable="false"
        @change="search"
        @suggest="suggest"
        @click="selected"
    >
        <a-button  slot="action"
                   type="primary"
                   v-if="creatableFilter && creatableFilter.length===1"
                   @click="createDoc(creatableFilter[0])">{{creatableFilter[0].docName}}</a-button>
        <a-button-group slot="action" v-else-if="creatableFilter && creatableFilter.length">
            <a-dropdown :trigger="['click']">
                <a-menu slot="overlay" >
                    <a-menu-item v-for="docDef in creatableFilter" :key="docDef.docType" @click="createDoc(docDef)">
                        <a-icon type="file" />{{docDef.docName}}
                    </a-menu-item>
                </a-menu>
                <a-button type="primary"> 新建 <a-icon type="down" /> </a-button>
            </a-dropdown>
        </a-button-group>

        <nk-page-preview v-if="preview" :params="previewParams" v-model="previewVisible" @close="previewClose"></nk-page-preview>
    </nk-query-layout>
</template>

<script>
import NkPagePreview from "../../docengine/page/NkPagePreview";
import {mapGetters} from "vuex";
import NkUtil from "@/utils/NkUtil";

export default {
    components: {NkPagePreview},
    data(){
        return {

            custom:{},

            preview:false,
            previewParams: {},
            previewVisible: false,

            params:undefined,
        }
    },
    created(){
        this.loadCustom();
    },
    computed:{
        ...mapGetters('User',[
            'user'
        ]),
        creatableFilter(){
            return this.custom.creatable && this.custom.creatable.filter(item=>{
                return this.user.authorities
                    .find(authority=>
                        authority.authority==='@'+item.docType+':WRITE'||
                        authority.authority==='@'+item.docType+':*'||
                        authority.authority==='@*:*'||
                        authority.authority==='*:*')
            })
        }
    },
    methods:{
        loadCustom(){
            this.$http.get(`/api/webapp/menu/${this.$route.params.id}`)
                .then(res=>{
                    this.custom = Object.assign({
                        title:"自定义查询报表",
                        subTitle:"",
                        $debug:false,
                        index:"document",
                        postSql:undefined,
                        postCondition:undefined,
                        searchItemsDefault:[],
                        searchItemsMoreDef:[],
                        defaultRows:10,
                        columns:[],
                        sortConfig:undefined,
                        border:undefined,
                        creatable:undefined
                    },NkUtil.parseJSON(res.data));
                    this.$emit("setTab",this.custom.title);

                    this.$nextTick(()=>{
                        this.$refs.layout.init();
                    })

                    const queryLength = Object.keys(this.$route.query).length;
                    if(queryLength){
                        this.$emit("setTab",this.custom.title+"[Filter:"+queryLength+"]");
                    }else{
                        this.$emit("setTab",this.custom.title);
                    }

                }).catch((e)=>{
                    console.error(e);
                    this.$error({
                        title: '初始化失败',
                        content: '自定义的选项错误！',
                    });
                });
        },
        suggest(params){
            if(!this.custom.postSql){
                this.$http.postJSON(`/api/doc/suggest/${this.custom.index}`,Object.assign({
                        postCondition: this.custom.postCondition,
                        $debug: this.custom.$debug,
                    },params)
                ).then((res)=>{
                    if(this.$refs.layout){
                        this.$refs.layout.setSuggest(res.data.suggests)
                    }
                });
            }
        },
        search(params){

            // for(const key in this.$route.query){
            //     if(this.$route.query.hasOwnProperty(key)){
            //         let value = this.$route.query[key];
            //         if(value.startsWith('[')||value.startsWith('{')){
            //             try{
            //                 value = JSON.parse(value)
            //             }catch (e) {
            //                 console.log(e);
            //             }
            //         }
            //         params[key]=value;
            //     }
            // }

            console.log(params)

            this.params = params;

            if(this.custom.postSql){
                this.$http.postJSON(`/api/data/analyse/query`,Object.assign({
                        sqlList: (this.custom.postSql instanceof Array) ? this.custom.postSql : [this.custom.postSql],
                        $debug: this.custom.$debug,
                    },params)
                ).then((res)=>{
                    if(this.$refs.layout)
                        this.$refs.layout.setData(res.data)
                });
            }else{
                this.$http.postJSON(`/api/doc/list/${this.custom.index}`,Object.assign({
                            postCondition: this.custom.postCondition,
                            $debug: this.custom.$debug,
                        },params)
                ).then((res)=>{
                    if(this.$refs.layout)
                        this.$refs.layout.setData(res.data)
                });
            }
        },
        selected({row,$event}){
            if($event.target.tagName!=='A'){
                this.previewVisible = true;
                this.previewParams  = {
                    mode: "detail",
                    classify:row.classify,
                    docId:row.docId
                }
            }
        },
        previewClose(){
            this.$refs.layout.grid().clearCurrentRow();
        },
        createDoc(def){
            switch (def.classify){
                case "PROJECT":
                    this.$router.push(`/apps/docs/create/`+def.docType);
                    break;
                case "PARTNER":
                    this.$router.push('/apps/partners/new-partner/'+def.docType);
                    break;
                default:
                    this.$router.push("/apps/docs/create/"+def.docType);
            }
        }
    }
}
</script>

<style lang="less" scoped>
</style>
