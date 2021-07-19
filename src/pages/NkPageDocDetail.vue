<template>
    <nk-page-layout class="mini"
                    title="详情"
                    ref="nav"
                    :sub-title="doc.docName"
                    :loading="loading"
                    :spinning="spinning"
                    :breadcrumbs="preview?[]:breadcrumbs"
                    :showPageNav="!preview"
                    :showPageBar="!preview"
    >
        <div v-if="history" slot="top" style="padding: 20px 20px 0 20px;">
            <div class="ant-alert ant-alert-warning ant-alert-closable">
                <a-icon class="ant-alert-icon" type="info-circle" theme="filled"/>
                <span class="ant-alert-message">
                    快照 Snapshot ：
                    Revised form {{history.updatedTime | nkDatetimeFriendly}} By {{history.userRealname}} To Version {{history.version}}

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

                   :user="user"
                   :doc="doc"
                   :preview="preview"

                   :breadcrumbs="breadcrumbsData"

                   :history="history"
                   :histories="histories"

                   :doc-state="docState"
                   :available-status="availableStatus"

                   :edit-mode="editMode"
                   :doc-editable="docEditable"
                   :status-editable="statusEditable"

                   :bpm-task="bpmTask"
                   :doc-types="docTypes"

                   @nk-save="doSave"
                   @nk-edit="nkEditModeChanged"
                   @nk-create="toCreateDoc"
                   @nk-cancel="cancel"
                   @nk-show-history="showHistory"
                   @replace="$emit('replace',event)"
        >
            <slot name="buttons" slot="buttons"></slot>
        </component>

        <nk-doc-exception v-if="doc.exception" :exception="doc.exception" />

        <nk-card-historys v-if="histories" class="nk-page-layout-card" :doc="doc" />
        <slot name="component"></slot>

        <template v-for="(c) in availableComponents">
            <component ref="components"
                       v-if="c.dataComponent"
                       :id="buildAnchorLink(c.component)"
                       :class="`nk-page-layout-card ${historyClass(c.component)}`"
                       :is="c.dataComponent"
                       :key="c.component"
                       :componentOptions="c"
                       :doc="doc"
                       :editMode="editMode && c.writeable"
                       :createMode="createMode"
                       @nk-reload="reload"
                       @nk-save="doSave"
                       @nk-calc="nkCalc($event,c)"
                       @nk-changed="nkChanged($event,c)"
            />
            <template v-if="c.dataComponent">
                <component
                    v-for="(ext) in c.dataComponentExtNames||[]"
                    ref="components"
                    :class="`nk-page-layout-card ${historyClass(c.component)}`"
                    :is="ext"
                    :key="ext"
                    :componentOptions="c"
                    :doc="doc"
                    :editMode="editMode && c.writeable"
                    :createMode="createMode"
                    @nk-reload="reload"
                    @nk-save="doSave"
                    @nk-calc="nkCalc($event,c)"
                    @nk-changed="nkChanged($event,c)" />
            </template>
        </template>

        <div slot="nav" class="nav">
            <a-anchor :offsetTop="80"
                      wrapperClass="anchor"
                      :target-offset="70"
                      :showInkInFixed="true"
                      @click="(e)=>{e.preventDefault()}">
                <a-anchor-link title="详情" :href="'#tfms'"></a-anchor-link>
                <a-anchor-link v-for="(c) in availableComponents"
                               :key="c.component"
                               :class="`${historyClass(c.component)}`"
                               :title="c.componentName"
                               :href="'#'+buildAnchorLink(c.component)"
                >
                </a-anchor-link>
            </a-anchor>
        </div>

    </nk-page-layout>
</template>

<script>
import qs from 'qs'
import ClassifyMapping from "./ClassifyMapping";
import DocDetailMixin from "./NkPageDocDetailMixin";
import NkPageDocHeaderLoading from "./NkPageDocHeaderLoading";
import { mapActions} from 'vuex';

export default {
    mixins:[DocDetailMixin],
    components:{
        NkPageDocHeaderLoading
    },
    props:{
    },
    data(){
        return {
            spinning:false,
            loading: true,
            editMode:false,
            createMode:false,

            doc:{},
            docStateTemp:undefined,

            history :undefined,
            histories : undefined,
        }
    },

    created() {
        this.initData();
    },
    computed:{
        headerComponent(){
            return (this.doc.definedDoc && this.doc.definedDoc.docHeaderComponent) || 'nk-page-doc-header-loading';
        },
        docTypes(){
            return this.doc.refObject && this.doc.refObject.defined && this.doc.refObject.defined.docs || [];
        },
        breadcrumbs(){
            if(this.preview){
                return [];
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
        breadcrumbsData(){
            let routes = [];
            if(this.breadcrumbs){
                routes = this.breadcrumbs;
            }else{
                this.$route.matched.forEach(r=>{
                    let path = (r.components.default && (r.parent?r.path.substr(r.parent.path.length):r.path))||'';
                    routes.push({
                        path:path,
                        breadcrumbName:(r.meta && r.meta.title) || r.name
                    })
                });
            }
            return {
                props: {
                    routes
                }
            }
        },
        availableComponents(){
            if(this.doc.definedDoc && this.doc.definedDoc.customComponents){
                return this.doc.definedDoc.customComponents
                    .filter(item=>item.dataComponent)
                    .map(item=>{
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
                        return item;
                    });
            }
            return [];
        },
        docState:{
            get(){
                return this.docStateTemp || (this.doc && this.doc.docState);
            },
            set(value){
                this.docStateTemp = value;
            }
        },
        editPerm(){
            if(this.doc && this.doc.definedDoc){
                let defState = this.doc.definedDoc.status.find(state=>state.docState===this.doc.docState);
                if(defState && this.doc.writeable){
                    if(defState.editPerm===1)
                        return 1;
                    if(defState.editPerm===3)
                        return 3;
                    else if(defState.editPerm === 2 && this.bpmTask)
                        return 2;
                }
            }
            return 0;
        },
        statusEditable(){
            return this.editPerm===1||this.editPerm===3;
        },
        statusEditOnly(){
            return this.editPerm===3;
        },
        docEditable(){
            return this.editPerm===1||this.editPerm===2;
        },
        availableStatus(){
            const status = [];
            this.doc.definedDoc && this.doc.definedDoc.status.forEach(state=>{
                if(state.preDocState === this.doc.docState || state.docState === this.doc.docState){
                    status.push(state);
                }
            });
            return status;
        },
        contextParams(){
            const params = this.params || this.$route.params;
            if(this.bpmTask){
                params.mode = 'detail';
                params.docId = this.bpmTask.businessKey;
            }
            return params;
        }
    },
    methods:{
        ...mapActions('NkDoc',[
            'doSetDocumentPage'
        ]),
        initData(){
            if(this.contextParams.mode==='create'){
                this.createMode = true;
                const req = {
                    docType:this.contextParams.docId,
                    refObjectId:this.$route.query.ref,
                    preDocId:this.$route.query.pre||this.$route.query.ref
                }
                this.$http.post("/api/doc/pre/create",qs.stringify(req))
                    .then(response=>{
                        this.doc = response.data;
                        this.$emit('setTab',"NEW:"+this.doc.docName);
                        this.loading = false;
                        this.nkEditModeChanged(true);
                        this.$emit("setTab",{confirm:"单据尚未保存，确认关闭吗？"});
                    }).catch(res=>{
                        if(res.response.status===403){
                            this.$emit("close")
                        }
                    });
            }else if(this.contextParams.mode==='detail'){
                this.$http.get("/api/doc/detail/"+this.contextParams.docId)
                    .then(response=>{
                        this.doc = response.data;
                        this.$emit('setTab',this.doc.docName);
                        this.loading = false
                    }).catch(res=>{
                        if(res.response.status===403){
                            this.$emit("close")
                        }
                    });
            }else{
                this.$http.get("/api/doc/detail/history/"+this.contextParams.docId)
                    .then(response=>{
                        this.history=response.data;
                        this.history.changedComponents = this.history.cardNames?this.history.cardNames.split(','):[];
                        this.doc = JSON.parse(response.data.data);
                        this.history.data=undefined;
                        this.$emit('setTab','Snapshot:'+this.doc.docName);
                        this.loading = false
                    });
            }
        },
        async doSave(state) {
            let error = this.$refs.header.hasError&&this.$refs.header.hasError();
            if (error) {
                this.$message.error(error);
                return;
            }
            if (this.$refs.components) {
                for (let i in this.$refs.components) {
                    let component = this.$refs.components[i];
                    if (component.hasError) {
                        let error = component.hasError();
                        if(error) {
                            error = error===true?'校验错误':error;
                            if (error.then && typeof error.then === 'function') {
                                error = await error
                                if (error) {
                                    this.$message.error(error);
                                    return;
                                }
                            } else {
                                this.$message.error(error);
                                return;
                            }
                        }
                    }
                }
            }

            const originalState = this.doc.docState
            this.spinning = true;
            this.doc.docState = this.docState = state||this.docState;
            this.$http.postJSON(`/api/doc/update/${this.doc.docType}`, this.doc)
                .then((response) => {
                    if (this.$route.params.mode === 'create') {
                        setTimeout(() => {
                            this.$emit('replace', ClassifyMapping[this.doc.classify].detailUrl + this.doc.docId);
                        }, 200)
                    } else {
                        this.doc = response.data;
                        this.$emit('setTab', this.doc.docName);
                        this.nkEditModeChanged(false);
                        this.histories = undefined;
                        this.spinning = false;
                    }
                })
                .catch(() => {
                    this.spinning = false;
                    this.doc.docState = this.docState = originalState;
                });
        },
        cancel(){
            if(this.contextParams.mode==='create') {
                this.$emit("close");
            }else{
                this.loading = true;
                this.editMode = false;
                this.initData();
            }
            this.histories=undefined;
        },
        toCreateDoc(defDoc){
            this.$router.push({
                path:`/apps/docs/create/${defDoc.docType}`,
                query:{
                    ref:this.doc.refObjectId,
                    pre:this.doc.docId
                }
            });
        },
        reload(){
            this.loading = true;
            this.editMode = false;
            this.initData();
        }
    }
}
</script>

<style scoped lang="scss">
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
::v-deep .nk-page-layout-card.changed{
    border: solid 1px #f5222d;
    .ant-card-head{
        margin-bottom: 0;
    }
}
</style>
