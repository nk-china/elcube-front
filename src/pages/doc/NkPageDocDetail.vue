<template>
    <x-nk-page-layout class="mini"
                      :title="doc.docName||'单据详情'"
                      ref="nav"
                      sub-title="单据详情"
                      :spinning="loading"
                      :right-bar="rightBar"
                      :header-indent="headerIndent"
    >

        <div v-if="doc.historyVersion" slot="top" class="alert">
            <div class="ant-alert ant-alert-warning ant-alert-closable">
                <a-icon class="ant-alert-icon" type="info-circle" theme="filled"/>
                <span class="ant-alert-message">
                    快照 Snapshot ：
                    Revised form {{doc.updatedTime | nkDatetimeFriendly}} By {{doc.historyUserRealName}} To Version {{doc.historyVersion}}

                </span>
                <a type="button" tabindex="0" class="ant-alert-close-icon" @click="$emit('replace','/apps/docs/detail/'+doc.docId)">
                    <span class="ant-alert-close-text">返回单据</span>
                </a>
            </div>
        </div>
        <div slot="top" v-else-if="this.debugId" class="alert">
            <a-alert message="请注意： 当前配置为调试模式，单据的保存操作不会持久化" type="warning" show-icon />
        </div>

        <div slot="content" style="min-height: 100px;">
            <template v-for="(c) in availableCards">
                <component ref="components"
                           v-if="c.position==='header' && c.dataComponentName"
                           :class="`nk-page-layout-card ${historyClass(c.cardKey)} ${debugClass(c.debug)}`"
                           :is="c.dataComponentName"
                           :id="buildAnchorLink(c.cardKey)"
                           :key="c.cardKey"
                           :card="c"
                           :doc="doc"
                           :editMode="editMode && c.writeable"
                           :createMode="createMode"
                           @nk-reload="reload"
                           @nk-save="doSave"
                           @nk-calc="nkCalc(c,$event)"
                           @nk-changed="nkChanged($event,c)"
                />
            </template>
        </div>
        <a-statistic slot="extra" title="状态" :value="doc.docState | nkFromList(doc.def&&doc.def.status,'docStateDesc','docState')"/>

        <a-button-group v-if="!doc.historyVersion && !loading" slot="action">
            <slot       v-if="!editMode" name="buttons"></slot>

            <!--编辑-->
            <a-button   v-if="!editMode" :type="preview?'default':'primary'" :disabled="!docEditable" @click="nkEditModeChanged(true)">
                <a-icon type="edit" />
            </a-button>

            <!--保存-->
            <template v-if="editMode">
                <a-button type="primary" v-for="item in availablePrimaryStatus" :key="item.docState" @click="doSave(item.docState)">
                    <a-icon type="step-forward" /> {{item.docStateDesc}}
                </a-button>
                <a-dropdown-button v-if="availableStatus.length" :type="availablePrimaryStatus.length?'default':'primary'" @click="doSave()" :trigger="['click']" :placement="placement">
                    <a-icon type="save" />
                    <a-icon slot="icon" type="step-forward" />
                    <a-icon slot="icon" type="ellipsis" />
                    <a-menu slot="overlay">
                        <a-menu-item key="" disabled style="font-size: 8px;padding: 1px 30px 1px 8px;cursor: default;">保存为：</a-menu-item>
                        <a-menu-divider />
                        <a-menu-item v-for="item in availableStatus" :key="item.docState" @click="doSave(item.docState)">
                            <a-icon type="step-forward" /> {{item.docStateDesc}}
                        </a-menu-item>
                    </a-menu>
                </a-dropdown-button>
                <a-button v-else @click="doSave()" :type="availablePrimaryStatus.length?'default':'primary'">
                    <a-icon type="save" />
                </a-button>
            </template>

            <!--取消-->
            <a-button   v-if=" editMode" type="default" @click="cancel()">
                <a-icon type="rollback" />
            </a-button>

            <!--创建-->
            <a-dropdown v-if="!preview && !editMode && docTypes.length" :trigger="['click']" :placement="placement">
                <a-button type="primary"><a-icon type="file-add" /> </a-button>
                <a-menu slot="overlay">
                    <a-menu-item v-for="item in docTypes" :key="item.docType" @click="toCreateDoc(item)" :disabled="!item.visible">
                        {{item.docType}} | {{item.docName || item.docType}}
                    </a-menu-item>
                </a-menu>
            </a-dropdown>

            <!--历史-->
            <a-button v-if="!editMode" :type="histories?'primary':'default'"
                      @click="$emit('nk-show-history')">
                <a-icon type="clock-circle" />
            </a-button>

            <!--文档-->
            <a-button v-if="doc.def&&doc.def.markdownFlag"
                      :type="'default'"
                      @click="doSetDocumentPage('nkdn://user/'+doc.definedDoc.docType+'/'+doc.definedDoc.version)">
                <a-icon type="question-circle" />
            </a-button>

            <!-- 配置 -->
            <a-button v-if="hasAuthority(['DEF:*','DEF:*'])"
                      @click="$router.push(`/apps/def/doc/detail/${doc.docType}/${doc.def.version}`)">
                <a-icon type="deployment-unit" />
            </a-button>

        </a-button-group>

        <!--异常信息-->
        <nk-doc-exception v-if="doc.exception" :exception="doc.exception" />

        <!--todo 历史记录 需迁移到右边栏-->
        <nk-card-historys v-if="histories" class="nk-page-layout-card" :doc="doc" />

        <nk-card-bpm-executer v-if="doc.bpmTask" :task="doc.bpmTask" :editMode="editMode" v-model="loading" @complete="initData" />

        <!--卡片列表-->
        <slot name="component"></slot>
        <template v-for="(c) in availableCards">
            <component ref="components"
                       v-if="c.position==='default' && c.dataComponentName"
                       :class="`nk-page-layout-card ${historyClass(c.cardKey)} ${debugClass(c.debug)}`"
                       :is="c.dataComponentName"
                       :id="buildAnchorLink(c.cardKey)"
                       :key="c.cardKey"
                       :card="c"
                       :doc="doc"
                       :editMode="editMode && c.writeable"
                       :createMode="createMode"
                       @nk-reload="reload"
                       @nk-save="doSave"
                       @nk-submit="doSave"
                       @nk-calc="nkCalc(c,$event)"
                       @nk-changed="nkChanged($event,c)"
            />
        </template>

        <!-- 右边栏： 导航 -->
        <div slot="nav" class="nav">
            <a-anchor v-if="!sidebarCards.length"
                      :offsetTop="80"
                      wrapperClass="anchor"
                      :target-offset="70"
                      :showInkInFixed="true"
                      @click="(e)=>{e.preventDefault()}">
                <a-anchor-link title="详情" :href="'#tfms'"></a-anchor-link>
                <template v-for="(c) in availableCards">
                    <a-anchor-link v-if="c.position==='default'"
                                   :key="c.cardKey"
                                   :class="`${historyClass(c.component)}`"
                                   :title="c.cardName"
                                   :href="'#'+buildAnchorLink(c.cardKey)"
                    >
                </a-anchor-link>
                </template>
            </a-anchor>

            <component  v-for="(c) in sidebarCards"
                        ref="components"
                        :class="`nk-page-layout-card ${historyClass(c.cardKey)} ${debugClass(c.debug)}`"
                        :is="c.dataComponentName"
                        :id="buildAnchorLink(c.cardKey)"
                        :key="c.cardKey"
                        :card="c"
                        :doc="doc"
                        :editMode="editMode && c.writeable"
                        :createMode="createMode"
                        @nk-reload="reload"
                        @nk-save="doSave"
                        @nk-calc="nkCalc(c,$event)"
                        @nk-changed="nkChanged($event,c)"
            />
        </div>

    </x-nk-page-layout>
</template>

<script>
import qs from 'qs'
import XNkPageLayout from "../../layout/template/XNkPageLayout";
import {mapActions, mapGetters, mapState} from 'vuex';
import NkCardBpmExecuter from "../task/NkCardBpmExecuter";

export default {
    components:{
        NkCardBpmExecuter,
        XNkPageLayout,
    },
    props:{
        bpmTask: Object,
        params: Object,
        preview: {
            type:Boolean,
            default:false,
        }
    },
    data(){
        return {
            loading: true,
            editMode:false,
            createMode:false,

            doc:{},
            docStateTemp:undefined,

            histories : undefined,
        }
    },

    created() {
        this.initData();
    },
    computed:{
        ...mapState('Debug',[
            'debugId'
        ]),
        ...mapGetters('User',[
            'hasAuthority'
        ]),
        rightBar(){
            return !this.preview;
        },
        headerIndent(){
            return !this.preview && this.sidebarCards.length === 0;
        },
        placement(){
            return this.headerIndent?'bottomLeft':'bottomRight';
        },
        headerComponent(){
            return (this.doc.definedDoc && this.doc.definedDoc.docHeaderComponent) || 'nk-page-doc-header-loading';
        },
        docTypes(){
            return this.doc.def && this.doc.def.nextFlows && this.doc.def.nextFlows;
        },
        // 对卡片进行预处理，判断卡片是否缺失
        availableCards(){
            if(this.doc.def && this.doc.def.cards){
                return this.doc.def.cards
                    .filter(item=>item.dataComponentName)
                    .map(item=>{
                        if(!this.$options.components[item.dataComponentName]){
                            item.componentLost = item.dataComponentName;
                            item.dataComponentName = 'nk-component-lost';
                        }
                        return item;
                    });
            }
            return [];
        },
        sidebarCards(){
            return this.availableCards.filter(c=>c.position==='sidebar');
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
            if(this.doc && this.doc.def){
                let defState = this.doc.def.status.find(state=>state.docState===this.doc.docState);

                if(this.doc.writeable && defState){
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
            return this.doc.def && this.doc.def.status.filter(
                state => (state.preDocState === this.doc.docState)
                    && !state.displayPrimary
            );
        },
        availablePrimaryStatus(){
            return this.doc.def && this.doc.def.status.filter(
                state => (state.preDocState === this.doc.docState)
                    && state.displayPrimary
            );
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
                        this.editMode = true;
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
                        if(res.response.data.msg==="单据不存在"){
                            this.$emit("close")
                        }
                    });
            }else if(this.contextParams.mode==='snapshot'){
                this.$http.get("/api/doc/detail/snapshot/"+this.contextParams.docId)
                    .then(response=>{
                        this.doc=response.data;
                        this.$emit('setTab','Snapshot:'+this.doc.docName);
                        this.loading = false
                    });
            }
        },
        async doSave(state) {

            if (this.$refs.components) {
                for (let i in this.$refs.components) {
                    let component = this.$refs.components[i];
                    if(component.onSubmit){
                        let onSubmit = component.onSubmit(state);
                        if(onSubmit.then && typeof onSubmit.then === 'function'){
                            try{
                                onSubmit = await onSubmit;
                                if(onSubmit===false){
                                    return;
                                }
                            }catch (e){
                                return;
                            }
                        }else if(!onSubmit){
                            return;
                        }
                    }
                }
            }

            let error = this.$refs.header && this.$refs.header.hasError&&this.$refs.header.hasError();
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
                                try{
                                    error = await error
                                }catch (e){
                                    this.$message.error(e);
                                    return;
                                }
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
            this.loading = true;
            this.docState = state||this.docState;
            this.doc.docState = this.docState;
            this.$http.postJSON(`/api/doc/update`, this.doc)
                .then((response) => {
                    if(this.debugId){
                        this.$message.info("Tips: 调试模式下，单据未持久化")
                    }
                    if (this.$route.params.mode === 'create') {
                        setTimeout(() => {
                            this.$emit('replace', `/apps/docs/detail/${this.doc.docId}`);
                        }, 200)
                    } else {
                        this.doc = response.data;
                        this.$emit('setTab', this.doc.docName);
                        this.nkEditModeChanged(false);
                        this.histories = undefined;
                        this.loading = false;
                    }
                })
                .catch(() => {
                    this.loading = false;
                    this.docState = originalState;
                    this.doc.docState = this.docState;
                });
        },
        nkCalc(card,options){
            // 如果计算耗时超过100ms，则弹出
            const timeout = setTimeout(()=>{
                this.loading=true;
            },100);
            this.$http.postJSON(`/api/doc/calculate`,{doc:this.doc,fromCard:card.cardKey,options})
                .then(response=>{
                    this.doc = response.data;
                    this.$nextTick(()=>{
                        this.nkChanged({
                            event:'nk-calc'
                        },card);
                    })
                })
                .finally(()=>{
                    this.loading=false;
                    clearTimeout(timeout)
                })
        },
        nkChanged(e,component){
            Object.assign(e,{$source:component && component.component});
            this.$refs.components&&this.$refs.components.forEach(c=>c.docUpdate&&c.docUpdate(e));
        },
        nkEditModeChanged(editMode){
            this.editMode = editMode;
            this.$emit("editModeChanged",this.editMode);
            this.$nextTick(()=>{
                this.$refs.components&&this.$refs.components.forEach(c=>c.docEditModeChanged &&c.docEditModeChanged(this.editMode));
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
                    pre:this.doc.docId
                }
            });
        },
        reload(){
            this.loading = true;
            this.editMode = false;
            this.initData();
        },
        debugClass(debug){
            if(debug){
                return "debug"
            }
        },
        historyClass(componentName){
            return this.doc.historyChangedCards && this.doc.historyChangedCards.indexOf(componentName)>=0
                ?'changed':'';
        },
        buildAnchorLink(component){
            return this.doc.docId + '-' + component;
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
    padding: 24px 24px 0 10px;
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
.debug{
    border:1px solid #ffe58f;
    background-color: #fffbe6;
}
.alert{
    padding: 10px 10px 0 10px;
}
</style>
