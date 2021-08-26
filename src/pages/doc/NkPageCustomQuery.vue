<template>
    <nk-query-layout
        ref="layout"
        :title="custom.title"
        :sub-title="custom.subTitle"
        :search-items-default="searchItemsDefault"
        :search-items-more-def="searchItemsMoreDef"
        :dataTableColumns="columns"
        :save-as-source="custom.menuId"
        :lazy="true"
        :selectable="false"
        @change="search"
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

        <nk-page-preview :params="previewParams" v-model="previewVisible" @close="previewClose"></nk-page-preview>
    </nk-query-layout>
</template>

<script>
import NkUtil from "../../utils/NkUtil";
import NkPagePreview from "./NkPagePreview";
import {mapGetters} from "vuex";

export default {
    components: {NkPagePreview},
    data(){
        return {
            columns:[],
            searchItemsDefault:[],
            searchItemsMoreDef:[],
            preCondition:{},
            creatable:undefined,
            custom:{},
            previewParams: {},
            previewVisible: false,
            $debug:false
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
            return this.creatable && this.creatable.filter(item=>{
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
                    this.custom = res.data;
                    this.$emit("setTab",this.custom.title);

                    const queryLength = Object.keys(this.$route.query).length;
                    if(queryLength){
                        this.$emit("setTab",this.custom.title+"[Filter:"+queryLength+"]");
                    }else{
                        this.$emit("setTab",this.custom.title);
                    }

                    if(this.custom.menuOptions){

                        let options = {};
                        eval("options="+this.custom.menuOptions);
                        for(let field in options){
                            this[field] = options[field];
                        }
                        this.$nextTick(()=>{
                            this.$refs.layout.init();
                        })
                    }else{
                        this.$error({
                            title: '初始化失败',
                            content: '自定义的选项错误！',
                        });
                    }

                }).catch((e)=>{
                    console.error(e);
                });
        },
        search(params){

            for(const key in this.$route.query){
                if(this.$route.query.hasOwnProperty(key)){
                    let value = this.$route.query[key];
                    if(value.startsWith('[')||value.startsWith('{')){
                        try{
                            value = JSON.parse(value)
                        }catch (e) {
                            console.log(e);
                        }
                    }
                    params[key]=value;
                }
            }

            this.$http.postJSON("/api/doc/list",NkUtil.toEsParams(params,this.preCondition,this.$debug))
                .then((res)=>{
                    if(this.$refs.layout)
                        this.$refs.layout.setData(res.data)
                });
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
                    this.$router.push(`/apps/projects/create/`+def.docType);
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

<style lang="scss" scoped>
</style>
