<template>
    <nk-page-layout class="mini"
                    :title="pageConfig.title"
                    ref="nav"
                    :sub-title="doc.docName"
                    :loading="loading"
                    :spinning="spinning"
                    :breadcrumbs="breadcrumbs"
                    :showPageNav="false"
                    :showPageBar="true"
    >
        <div v-if="source" slot="top" style="padding: 20px 20px 0 20px;">
            <div class="ant-alert ant-alert-warning ant-alert-closable">
                <a-icon class="ant-alert-icon" type="info-circle" theme="filled"/>
                <span class="ant-alert-message">
                    对比 Diff ：Compare Version {{target.version}} with Version {{source.version}} |
                    Revised form {{source.updatedTime | nkDatetimeFriendly}} By {{source.userRealname}}

                </span>
                <a type="button" tabindex="0" class="ant-alert-close-icon" @click="toDoc">
                    <span class="ant-alert-close-text">返回单据</span>
                </a>
            </div>
        </div>

        <component :is="headerComponent"
                   ref="header"
                   slot="custom"
                   :loading="loading"
                   :doc="doc"
                   :doc-state="doc.docState"
                   :edit-mode="false"
                   :diff-target="targetDoc"
        />

<!--        <nk-form ref="detailForm" :col="2" slot="content" :edit="editMode">-->
<!--            <nk-form-item :term="pageConfig.titleDocType">-->
<!--                {{doc.definedDoc && doc.definedDoc.docType}} | {{doc.definedDoc && doc.definedDoc.docName}}-->
<!--            </nk-form-item>-->
<!--            <nk-form-item :term="pageConfig.titlePartner">-->
<!--                <router-link v-if="doc.partnerId" :to="`/apps/partners/detail/view/${doc.partnerId}`">{{doc.partnerName}}</router-link>-->
<!--                <span v-else style="color: rgba(0, 0, 0, 0.45);">&lt;未选择&gt;</span>-->
<!--                <span v-if="targetDoc.partnerName!==doc.partnerName" class="state-original">-->
<!--                    {{targetDoc.partnerName}}-->
<!--                </span>-->
<!--            </nk-form-item>-->
<!--            <nk-form-item :term="pageConfig.titleDocNumber">-->
<!--                <span v-if="doc.docNumber">{{doc.docNumber}}</span>-->
<!--                <span v-else style="color: rgba(0, 0, 0, 0.45);">&lt;未编号&gt;</span>-->
<!--            </nk-form-item>-->
<!--            <nk-form-item :term="pageConfig.titleDocDesc" :validateFor="doc.docName"-->
<!--                          :message="`请输入${pageConfig.titleDocDesc}`"-->
<!--                          required len :max="20"-->
<!--                          :lenMessage="`${pageConfig.titleDocDesc}1-20个字`">-->
<!--                {{doc.docName}}-->
<!--                <span v-if="targetDoc.docName!==doc.docName" class="state-original">-->
<!--                    {{targetDoc.docName}}-->
<!--                </span>-->
<!--            </nk-form-item>-->
<!--            <nk-form-item term="创建时间">{{doc.createdTime | nkDatetimeFriendly}}</nk-form-item>-->
<!--            <nk-form-item term="更新时间">{{doc.updatedTime | nkDatetimeFriendly}}</nk-form-item>-->
<!--            <nk-form-item term="备注" :col="2">-->
<!--                {{doc.docDesc||'暂无内容'}}-->
<!--                <span v-if="targetDoc.docDesc!==doc.docDesc" class="state-original">-->
<!--                    {{targetDoc.docDesc}}-->
<!--                </span>-->
<!--            </nk-form-item>-->
<!--        </nk-form>-->

<!--        <nk-edit-slot slot="extra">-->
<!--            <div v-if="doc.classify==='PROJECT'">-->
<!--                <a-statistic title="里程碑(状态)" :value="-->
<!--                 doc.refObject && doc.refObject.projectState | nkFromList(doc.refObject.defined&&doc.refObject.defined.status,'projectStateDesc','projectState')-->
<!--                "/>-->
<!--                <span v-if="targetDoc.refObject && doc.refObject && targetDoc.refObject.projectState!==doc.refObject.projectState" class="state-original">-->
<!--                    {{targetDoc.refObject.projectState | nkFromList(targetDoc.refObject.defined&&targetDoc.refObject.defined.status,'projectStateDesc','projectState')}}-->
<!--                </span>-->
<!--                {{ doc.docState | nkFromList(doc.definedDoc&&doc.definedDoc.status,'docStateDesc','docState') }}-->
<!--                <span v-if="targetDoc.docState!==doc.docState" class="state-original">-->
<!--                    {{targetDoc.docState | nkFromList(targetDoc.definedDoc&&targetDoc.definedDoc.status,'docStateDesc','docState')}}-->
<!--                </span>-->
<!--            </div>-->
<!--            <div v-else>-->
<!--                <a-statistic title="状态" :value="doc.docState | nkFromList(doc.definedDoc&&doc.definedDoc.status,'docStateDesc','docState')"/>-->
<!--                <span v-if="targetDoc.docState!==doc.docState" class="state-original">-->
<!--                    {{targetDoc.docState | nkFromList(targetDoc.definedDoc&&targetDoc.definedDoc.status,'docStateDesc','docState')}}-->
<!--                </span>-->
<!--            </div>-->
<!--        </nk-edit-slot>-->

        <div v-for="(c,i) in diffComponents" :key="i" class="componentLayout" :class="changedClass(c)"
        >
            <div class="left">
                <component ref="components"
                           v-if="c[0]&&c[0].dataComponent"
                           :class="`nk-page-layout-card`"
                           :is="c[0].dataComponent"
                           :key="c[0].component"
                           :componentOptions="c[0]"
                           :doc="targetDoc"
                           :diff-target="doc"
                />
                <template v-if="c[0]&&c[0].dataComponent">
                    <component
                        v-for="(ext) in c[0].dataComponentExtNames||[]"
                        ref="components"
                        :class="`nk-page-layout-card`"
                        :is="ext"
                        :key="ext"
                        :componentOptions="c"
                        :doc="targetDoc"
                        :diff-target="doc"
                    />
                </template>
            </div>
            <div class="right">
                <component ref="components"
                           v-if="c[1]&&c[1].dataComponent"
                           :class="`nk-page-layout-card`"
                           :is="c[1].dataComponent"
                           :key="c[1].component"
                           :componentOptions="c[1]"
                           :doc="doc"
                           :diff-target="targetDoc"
                />
                <template v-if="c[1]&&c[1].dataComponent">
                    <component
                        v-for="(ext) in c[1].dataComponentExtNames||[]"
                        ref="components"
                        :class="`nk-page-layout-card`"
                        :is="ext"
                        :key="ext"
                        :componentOptions="c"
                        :doc="doc"
                        :diff-target="targetDoc"
                    />
                </template>
            </div>
        </div>

    </nk-page-layout>
</template>

<script>
import { mapActions} from 'vuex';
import ClassifyMapping from "./ClassifyMapping";
import NkPageDocHeaderLoading from "./NkPageDocHeaderLoading";

export default {
    components:{
        NkPageDocHeaderLoading
    },
    props:{
        params:Object,
        pageConfig:{
            type: Object,
            default(){
                return {
                    useDefaultBreadcrumbs: false,
                    title: "交易详情",
                    titleDocType:'交易类型',
                    titleDocNumber:'交易编号',
                    titlePartner:'交易伙伴',
                    titleDocDesc:'交易描述',
                };
            }
        }
    },
    data(){
        return {
            spinning:false,
            loading: true,
            editMode:false,
            createMode:false,

            doc:{},
            source :undefined,

            targetDoc:{},
            target :undefined,

            diffComponents: []
        }
    },

    created() {
        this.initData();
    },
    computed:{
        headerComponent(){
            return (this.doc.definedDoc && this.doc.definedDoc.docHeaderComponent) || 'nk-page-doc-header-loading';
        },
        breadcrumbs(){
            if(this.pageConfig.useDefaultBreadcrumbs){
                return undefined;
            }
            const routes = [
                {
                    breadcrumbName:'首页',
                    path:'/apps'
                },
            ];
            if(this.doc && this.doc.refObject){
                routes.push({
                    breadcrumbName:'业务',
                    path:'/projects'
                });
                routes.push({
                    breadcrumbName: this.doc.refObject.projectName||'业务详情',
                    path:'/detail/'+this.doc.refObject.projectId
                });
            }else{
                routes.push({
                    breadcrumbName:'交易',
                    path:'/docs'
                });
            }
            routes.push({
                breadcrumbName: '交易详情'
            });
            return routes;
        },
        contextParams(){
            return this.params || this.$route.params;
        }
    },
    methods:{
        ...mapActions('NkDoc',[
            'doSetDocumentPage'
        ]),
        initData(){
            Promise.all([
                this.$http.get("/api/doc/detail/history/"+this.contextParams.sourceDocId),
                this.$http.get("/api/doc/detail/history/"+this.contextParams.targetDocId)
            ]).then(res=>{
                const source = res[0];
                this.source=source.data;
                this.source.changedComponents = this.source.cardNames?this.source.cardNames.split(','):[];
                this.doc = JSON.parse(source.data.data);
                this.source.data=undefined;

                const target = res[1];
                this.target=target.data;
                this.target.changedComponents = this.target.cardNames?this.target.cardNames.split(','):[];
                this.targetDoc = JSON.parse(target.data.data);
                this.target.data=undefined;

                const components = [];
                this.doc.definedDoc.customComponents
                    .filter(item=>item.dataComponent)
                    .forEach(item=>{
                        let targetItem = this.targetDoc.definedDoc.customComponents.find(targetItem=>targetItem.component===item.component);
                        components.push([this.processLost(targetItem),this.processLost(item)]);
                    });
                this.targetDoc.definedDoc.customComponents
                    .filter(item=>item.dataComponent)
                    .forEach(targetItem=>{
                        let item = this.doc.definedDoc.customComponents.find(item=>targetItem.component===item.component);
                        if(!item){
                            components.push([this.processLost(targetItem),this.processLost(item)]);
                        }
                    })
                this.diffComponents = components;

                this.$emit('setTab','Diff:'+this.doc.docName);
                this.loading = false
            });
        },
        toDoc(){
            this.$emit('replace',ClassifyMapping[this.doc.classify].detailUrl+this.doc.docId);
        },
        changedClass(c){
            if(c[0]&&c[1]){
                return this.source.changedComponents && this.source.changedComponents.indexOf(c[1].component)>=0
                    ?'changed':'';
            }
            return 'changed';
        },
        processLost(item){
            if(item){
                if(!this.$options.components[item.dataComponent]){
                    item.componentLost = item.dataComponent;
                    item.dataComponent = 'nk-component-lost';
                }
                if(item.componentExtNames){
                    item.componentExtNames.forEach(ext=>{
                        if(!this.$options.components[ext]){
                            item.componentLost = ext;
                            item.dataComponent = 'nk-component-lost';
                            item.componentExtNames = null;
                        }
                    })
                }
            }
            return item;
        }
    }
}
</script>

<style scoped lang="scss">

.componentLayout{

    display: flex;
    padding: 12px;
    margin: -12px;
    & + .componentLayout{
        margin-top: 12px;
    }

    &.changed {
        border: 1px solid #ffa39e;
        background-color: #fff1f0;
        padding: 11px;

        & + .changed{
            border-top: none !important;
            padding-top: 12px;
        }
    }

    & > .left{
        padding-right: 10px;
    }
    & > .right{
        padding-left: 10px;
    }
    & > .left,& > .right{
        display: block;
        width: 50%;
    }
}


::v-deep.ant-spin-nested-loading > div > .ant-spin .ant-spin-dot{
    position:fixed;
    margin-left: 128px;
}
::v-deep .ant-anchor{
    font-size: 12px;
}
::v-deep .ant-anchor-wrapper{
    background-color: initial;
}
::v-deep .ant-anchor-link.changed a{
    color: #f5222d;
}
.nav{
    margin-top: 20px;margin-left: 10px;
    > div{
        width: initial !important;
    }
}
.state-original{
    text-decoration:line-through;
    color: #f5222d;
    margin-left: 10px;
}
</style>
