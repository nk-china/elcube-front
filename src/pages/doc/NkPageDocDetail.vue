<template>
    <x-nk-page-layout class="mini"
                      :title="doc.docName||'单据详情'"
                      ref="nav"
                      sub-title="单据详情"
                      :loading="loading"
                      :spinning="spinning"
                      :showPageNav="!preview"
                      :showPageBar="!preview"
                      :right-bar="true"
                      :header-indent="false"
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

        <a-row slot="content">
            <a-col :span="18">
                <template v-for="(c) in availableCards">
                    <component ref="components"
                               v-if="c.position==='header' && c.dataComponentName"
                               :class="`nk-page-layout-card ${historyClass(c.cardKey)}`"
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
            </a-col>
            <a-col :span="6">
                <a-statistic title="状态" :value="doc.docState | nkFromList(doc.def&&doc.def.status,'docStateDesc','docState')"/>
            </a-col>
        </a-row>

        <a-button-group v-if="!history && !loading && !diffTarget" slot="extra">
            <slot       v-if="!editMode" name="buttons"></slot>

            <a-button   v-if="!editMode" :type="preview?'default':'primary'" :disabled="!docEditable" @click="nkEditModeChanged(true)">
                <a-icon type="edit" />
            </a-button>
            <a-dropdown-button v-if=" editMode" :type="'primary'" @click="doSave()" :trigger="['click']">
                <a-icon type="save" />
                <a-menu slot="overlay">
                    <a-menu-item key="" disabled style="font-size: 8px;padding: 1px 30px 1px 8px;cursor: default;">保存为：</a-menu-item>
                    <a-menu-divider />
                    <a-menu-item v-for="item in availableStatus"
                                 :key="item.docState"
                                 @click="doSave(item.docState)"
                    >
                        {{item.docStateDesc}}
                    </a-menu-item>
                </a-menu>
            </a-dropdown-button>
            <a-button   v-if=" editMode" type="default" @click="cancel()">
                <a-icon type="rollback" />
            </a-button>

            <a-dropdown v-if="!bpmTask && !preview && !editMode && docTypes.length" :trigger="['click']">
                <a-button type="primary"><a-icon type="file-add" /> </a-button>
                <a-menu slot="overlay">
                    <a-menu-item v-for="item in docTypes" :key="item.docType" @click="toCreateDoc(item)" :disabled="item.disabled">
                        {{item.docType}} | {{item.docName || item.docType}}
                    </a-menu-item>
                </a-menu>
            </a-dropdown>

            <a-button v-if="!editMode" :type="histories?'primary':'default'"
                      @click="$emit('nk-show-history')">
                <a-icon type="clock-circle" />
            </a-button>

            <a-button v-if="doc.def&&doc.def.markdownFlag"
                      :type="'default'"
                      @click="doSetDocumentPage('nkdn://user/'+doc.definedDoc.docType+'/'+doc.definedDoc.version)">
                <a-icon type="question-circle" />
            </a-button>

            <!-- 配置按钮 -->
            <a-button v-if="!preview && user&&user.authorities&&user.authorities.find(a=>{return a.authority==='*:*'||a.authority==='DEF:*'})"
                      @click="$router.push(`/apps/def/doc/detail/${doc.docType}/${doc.def.version}`)">
                <a-icon type="deployment-unit" />
            </a-button>

        </a-button-group>

        <!--异常信息-->
        <nk-doc-exception v-if="doc.exception" :exception="doc.exception" />

        <!--todo 历史记录 需迁移到右边栏-->
        <nk-card-historys v-if="histories" class="nk-page-layout-card" :doc="doc" />

        <!--卡片列表-->
        <slot name="component"></slot>
        <template v-for="(c) in availableCards">
            <component ref="components"
                       v-if="c.position==='default' && c.dataComponentName"
                       :class="`nk-page-layout-card ${historyClass(c.cardKey)}`"
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

        <!-- 右边栏： 导航 -->
        <div slot="nav" class="nav">
            <a-anchor :offsetTop="80"
                      wrapperClass="anchor"
                      :target-offset="70"
                      :showInkInFixed="true"
                      @click="(e)=>{e.preventDefault()}">
                <a-anchor-link v-for="(c) in availableCards"
                               :key="c.dataComponentName"
                               :class="`${historyClass(c.component)}`"
                               :title="c.cardName"
                               :href="'#'+buildAnchorLink(c.cardKey)"
                >
                </a-anchor-link>
            </a-anchor>
        </div>

    </x-nk-page-layout>
</template>

<script>
import qs from 'qs'
import DocDetailMixin from "../NkPageDocDetailMixin";
import NkPageDocHeaderLoading from "../NkPageDocHeaderLoading";
import XNkPageLayout from "../../layout/template/XNkPageLayout";
import {mapActions} from 'vuex';

export default {
    mixins:[DocDetailMixin],
    components:{
        XNkPageLayout,
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

            diffTarget:undefined
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
            return this.doc.def && this.doc.def.flows && this.doc.def.flows;
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
                state => state.preDocState === this.doc.docState || state.docState === this.doc.docState
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
            this.$http.postJSON(`/api/doc/update`, this.doc)
                .then((response) => {
                    if (this.$route.params.mode === 'create') {
                        setTimeout(() => {
                            this.$emit('replace', `/apps/docs/detail/${this.doc.docId}`);
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
        nkCalc(card,options){

            this.spinning=true;
            this.$http.postJSON(`/api/doc/calculate`,{doc:this.doc,cardKey:card.cardKey,options})
                .then(response=>{
                    this.doc = response.data;
                    this.$nextTick(()=>{
                        this.nkChanged({
                            event:'nk-calc'
                        },card);
                    })
                })
                .finally(()=>{
                    this.spinning=false;
                })
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
