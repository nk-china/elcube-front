<template>
    <nk-page-layout class="mini"
                    :title="title"
                    :sub-title="subTitle"
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

                   @nk-save="doSave"
                   @nk-edit="nkEditModeChanged"
                   @nk-create="toCreateDoc"
                   @nk-new-role="toNewRole"
                   @nk-cancel="cancel"
                   @nk-show-history="showHistory"
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
                       @nk-changed="nkChanged($event,c)"
                       @nk-calc="nkCalc($event,c)"
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
                <a-anchor-link title="交易伙伴" :href="'#tfms'"></a-anchor-link>
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
import DocDetailMixin from "./NkPageDocDetailMixin";

export default {
    mixins:[DocDetailMixin],
    data(){
        return {
            spinning:false,
            loading: true,
            loadingSave: false,
            editMode:false,
            createMode:false,

            doc: {refObject:{}},
            docStateTemp:undefined,

            previewTargetId:undefined,

            history:undefined,
            histories:undefined,
        }
    },
    created() {
        this.initData();
    },
    computed:{
        headerComponent(){
            return (this.doc.definedDoc && this.doc.definedDoc.docHeaderComponent) || 'nk-page-partner-header-default';
        },
        // todo 新建单据权限过滤
        breadcrumbs(){
            const routes = [
                {
                    breadcrumbName:'首页',
                    path:'/apps'
                },
                {
                    breadcrumbName:'交易伙伴',
                    path:'/partners'
                }];
            if(this.doc && this.doc.preDocId!=='@'){
                routes.push({
                    breadcrumbName: this.doc.refObject.partnerName||'',
                    path:'/detail/'+this.doc.refObjectId
                });
                routes.push({
                    breadcrumbName: '交易详情'
                });
            }else{
                routes.push({
                    breadcrumbName: '详情'
                });
            }
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
        availableNewRoles(){
            const roles = [];
            this.doc.refObject.defRoles && this.doc.refObject.defRoles.forEach(def=>{
                if(!this.doc.refObject.roles.find(role=>role.docType===def.partnerRole)){
                    roles.push(def)
                }
            });
            return roles;
        },
        availableComponents(){
            if(this.doc && this.doc.definedDoc && this.doc.definedDoc.customComponents){
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
            if(this.doc.definedDoc){
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
            }else{
                params.docId = this.previewTargetId||params.docId;
            }
            return params;
        },
        title(){
            if(this.doc.classify==='PARTNER'){
                return "交易伙伴详情";
            }else{
                return "交易伙伴单据";
            }
        },
        subTitle(){
            if(this.doc.classify==='PARTNER'){
                return this.doc.refObject.partnerName?(this.doc.refObject.partnerName+'的伙伴档案'):'';
            }else{
                return this.doc.docName;
            }
        }
    },
    methods:{
        initData(){
            if(this.contextParams.mode===undefined||this.contextParams.mode==='detail'){
                this.$http.get("/api/doc/detail/"+this.contextParams.docId)
                    .then(response=>{
                        this.doc = response.data;
                        this.loading = false;
                        this.$emit("loaded");
                        this.$emit("setTab",(this.doc && this.doc.docName || '暂无角色') + ' | ' +this.doc.refObject.partnerName);
                    }).catch(res=>{
                        if(res.response.status===403){
                            this.$emit("close")
                        }
                    });
            }else if(this.contextParams.mode==='doc'){
                this.$http.get("/api/doc/detail/"+this.contextParams.docId)
                    .then(response=>{
                        this.doc = response.data;
                        this.loading = false;
                        this.$emit("loaded");
                        this.$emit("setTab",this.doc.docName);
                    }).catch(res=>{
                        if(res.response.status===403){
                            this.$emit("close")
                        }
                    });
            }else if(this.contextParams.mode==='new-role'){
                this.createMode = true;
                this.$http.post("/api/doc/pre/create",qs.stringify({
                        docType:this.contextParams.docId,
                        refObjectId:this.$route.query.ref,
                    }))
                    .then(response=>{
                        this.doc = response.data;
                        this.loading = false;
                        this.nkEditModeChanged(true);
                        this.$emit("loaded");
                        this.$emit("setTab",'NEW:'+this.doc.docName);
                        this.$emit("setTab",{confirm:"单据尚未保存，确认关闭吗？"});
                    }).catch(res=>{
                        if(res.response.status===403){
                            this.$emit("close")
                        }
                    });
            }else if(this.contextParams.mode==='new-partner'){
                this.createMode = true;
                this.$http.post("/api/doc/pre/create",qs.stringify({refObjectId:'@',docType:this.contextParams.docId}))
                    .then(response=>{
                        this.doc = response.data;
                        this.doc.refObject.partnerType = this.doc.definedDoc.docDef.partnerType[0].value;
                        this.loading = false;
                        this.nkEditModeChanged(true);
                        this.$emit("loaded");
                        this.$emit("setTab",'NEW:'+this.doc.docName);
                        this.$emit("setTab",{confirm:"单据尚未保存，确认关闭吗？"});
                    }).catch(res=>{
                        if(res.response.status===403){
                            this.$emit("close")
                        }
                    });
            }else if(this.contextParams.mode==='next'){
                this.createMode = true;
                this.$http.post("/api/doc/pre/create",qs.stringify({
                        refObjectId:this.$route.query.ref,
                        preDocId:this.$route.query.pre||this.$route.query.ref,
                        docType:this.contextParams.docId
                    }))
                    .then(response=>{
                        this.doc = response.data;
                        this.loading = false;
                        this.nkEditModeChanged(true);
                        this.$emit("loaded");
                        this.$emit("setTab",'NEW:'+this.doc.docName);
                        this.$emit("setTab",{confirm:"单据尚未保存，确认关闭吗？"});
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
        async doSave() {
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
                        if(error){
                            error = error===true?'校验错误':error;
                            if (error.then && typeof error.then === 'function') {
                                error = await error
                                if(error){
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

            this.spinning = true;
            this.loadingSave = true;
            this.doc.docState = this.docState;

            // if (this.$route.params.mode === 'next' || this.doc.subClassify === 'ROLE') {
            //     this.$http.postJSON(`/api/doc/update/${this.doc.docType}`, this.doc)
            //         .then((response) => {
            //             if (this.$route.params.mode === 'detail') {
            //                 this.doc = response.data;
            //                 this.editMode = false;
            //             } else {
            //                 this.$emit('replace', '/apps/partners/detail/' + response.data.docId);
            //             }
            //         })
            //         .catch(() => {
            //         })
            //         .finally(() => {
            //             this.loadingSave = false;
            //             this.spinning = false;
            //             this.historys=undefined;
            //         });
            // } else {
                this.$http.postJSON(`/api/doc/update/${this.doc.docType}`, this.doc)
                    .then((response) => {
                        if (this.$route.params.mode === 'detail' || this.$route.params.mode === undefined) {
                            this.doc = response.data;
                            this.editMode = false;
                        } else if (this.$route.params.mode === 'doc') {
                            this.doc = response.data;
                            this.editMode = false;
                        } else {
                            if (this.doc && this.doc.docId) {
                                this.$emit('replace', '/apps/partners/detail/' + response.data.docId);
                            } else {
                                this.editMode = false;
                                this.loadingSave = false;
                            }
                        }
                    })
                    .catch(() => {
                    })
                    .finally(() => {
                        this.loadingSave = false;
                        this.spinning = false;
                        this.histories=undefined;
                    });
            // }
        },
        cancel(){
            if(this.contextParams.mode==='detail'||this.contextParams.mode==='doc'||this.contextParams.mode===undefined) {
                this.loading = true;
                this.editMode = false;
                this.initData();
            }else if(this.contextParams.mode==='new-role'){
                this.$emit('replace','/apps/partners/detail/view/'+this.doc.refObject.roles[0].docId);
            }else if(this.contextParams.mode==='new-partner'||this.contextParams.mode==='next'){
                this.$emit('close');
            }
            this.histories=undefined;
        },
        toNewRole(role){
            this.$emit('replace',`/apps/partners/new-role/${role.partnerRole}/?ref=${this.doc.refObject.partnerId}`);
        },
        // next
        toCreateDoc(item){
            if(this.doc.classify==='PARTNER'){
                this.$router.push(`/apps/partners/next/${item.docType}?ref=${this.doc.docId}`);
            }else{
                this.$router.push(`/apps/partners/next/${item.docType}?ref=${this.doc.refObjectId}&pre=${this.doc.docId}`);
            }
        },
        // cmd
        switchRole(role){
            if(role.docType!==this.doc.docType){
                if(this.preview){
                    this.previewTargetId = role.docId;
                    this.loading = true;
                    this.editMode = false;
                    this.initData();
                }else{
                    this.$emit('replace','/apps/partners/detail/view/'+role.docId);
                }
            }
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
