<template>
    <nk-page-layout class="mini" title="前置征信" :sub-title="doc.docName" :loading="loading">

        <nk-form ref="detailForm" :col="2" slot="content" :edit="editMode">
            <nk-form-item term="交易类型" :col="2">
                {{doc.definedDoc && doc.definedDoc.docType}} | {{doc.definedDoc && doc.definedDoc.docName}}
            </nk-form-item>
            <nk-form-item term="交易编号">{{doc.docNumber}}</nk-form-item>
            <nk-form-item term="交易描述" :validateFor="doc.docName" message="请输入交易描述" required len :max="20" lenMessage="交易描述1-20个字">
                {{doc.docName}}
                <a-input v-model="doc.docName" slot="edit" allowClear ></a-input>
            </nk-form-item>
            <nk-form-item term="创建时间">{{doc.createdTime | nkDatetimeFriendly}}</nk-form-item>
            <nk-form-item term="更新时间">{{doc.updatedTime | nkDatetimeFriendly}}</nk-form-item>
            <nk-form-item term="备注" :col="2">
                {{doc.docDesc||'暂无内容'}}
                <a-textarea v-model="doc.docDesc" slot="edit" :auto-size="{ minRows: 3, maxRows: 10 }"></a-textarea>
            </nk-form-item>

        </nk-form>

        <nk-edit-slot :edit-mode="editMode && statusEditable" slot="extra">
            <a-statistic title="状态" :value="doc.docState | nkFromList(doc.definedDoc&&doc.definedDoc.status,'docStateDesc','docState')"/>
            <div slot="edit">
                <label>状态：</label>
                <a-select v-model="docState" style="width:120px;">
                    <a-select-option v-for="item in availableStatus" :key="item.docState">
                        {{item.docStateDesc}}
                    </a-select-option>
                </a-select>
            </div>
        </nk-edit-slot>

        <a-button-group slot="action">
            <a-button v-if="!editMode" type="primary" :disabled="!editPerm" @click="editMode=true">编辑</a-button>
            <a-button v-if=" editMode" type="primary" @click="doSave" :loading="loadingSave">保存</a-button>
            <a-button v-if=" editMode" type="default" @click="cancel">取消</a-button>

            <a-dropdown v-if="!this.bpmTask && !editMode && doc.definedRefObject && doc.definedRefObject.docs && doc.definedRefObject.docs.length" :trigger="['click']">
                <a-button type="default">创建<a-icon type="down" /> </a-button>
                <a-menu slot="overlay">
                    <a-menu-item v-for="item in doc.definedRefObject.docs" :key="item.docType" @click="toCreateDoc(item)">{{item.docType}} | {{item.docName}}</a-menu-item>
                </a-menu>
            </a-dropdown>
            <slot name="buttons"></slot>
        </a-button-group>

        <slot name="component"></slot>

        <component ref="components"
                   class="nk-page-layout-card"
                   v-for="(c) in availableComponents"
                   :is="c.dataComponent"
                   :key="c.component"
                   :componentOptions="c"
                   :doc="doc"
                   :editMode="editMode"
                   @nk-changed="nkChanged" />

    </nk-page-layout>
</template>

<script>
  import qs from 'qs'

  export default {
    props:{
      bpmTask: Object
    },
    data(){
      return {
        loading: true,
        loadingSave: false,
        editMode:false,

        doc:{},
        docStateTemp:undefined,
      }
    },
    created() {
    },
    mounted(){
      this.initData();
    },
    computed:{
      availableComponents(){
        if(this.doc.definedDoc && this.doc.definedDoc.customComponents){
          this.doc.definedDoc.customComponents.forEach(item=>{
            if(!this.$options.components[item.dataComponent]){
              item.componentLost = item.dataComponent;
              item.dataComponent = 'nk-component-lost';
            }
          });
          return this.doc.definedDoc.customComponents;
        }
        return [];
      },
      docState:{
        get(){
          return this.docStateTemp || this.doc.docState;
        },
        set(value){
          this.docStateTemp = value;
        }
      },
      editPerm(){
        if(this.doc && this.doc.definedDoc){
          let defState = this.doc.definedDoc.status.find(state=>state.docState===this.doc.docState);
          return defState.editPerm || (defState.editPerm === 2 && this.bpmTask);
        }
        return 0;
      },
      statusEditable(){
        return this.editPerm===1;
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
    },
    methods:{
      nkChanged(e){
        this.$refs.components.forEach(c=>c.docUpdate&&c.docUpdate(e))
      },
      initData(){

        const params = this.$route.params;
        if(this.bpmTask){
          params.mode = undefined;
          params.docId = this.bpmTask.businessKey;
        }

        if(params.mode===undefined){
          this.$http.get("/api/doc/detail/"+params.docId)
            .then(response=>{
              this.definedRefObject = response.data.definedRefObject;
              this.doc = response.data;
              this.doc.definedRefObject = null;
              this.$emit('setTab',this.doc.docName);
              this.loading = false
            });
        }else{
          this.$http.post("/api/doc/pre/create",qs.stringify(params))
            .then(response=>{
              this.definedRefObject = response.data.definedRefObject;
              this.doc = response.data;
              this.doc.definedRefObject = null;
              this.$emit('setTab',"NEW:"+this.doc.docName);
              this.loading = false;
              this.editMode = true;
              this.$emit("setTab",{confirm:"单据尚未保存，确认关闭吗？"});
            });
        }
      },
      doSave(){
          const params = this.$route.params;
          if(this.bpmTask){
              params.mode = undefined;
              params.docId = this.bpmTask.businessKey;
          }

        if(!this.$refs.detailForm.hasError()){
          this.loadingSave=true;
          this.doc.docState = this.docState;
          this.$http.postJSON(`/api/doc/update/${this.doc.docType}`,this.doc)
            .then((response)=>{
                if(params.mode===undefined){
                    this.doc = response.data
                    this.$emit('setTab',this.doc.docName);
                    this.loadingSave=false;
                    this.editMode=false;
                }else{
                    this.$emit('replace',`/apps/credits/${response.data.docId}`);
                }
            });
        }else{
          this.$message.error("表单校验有错误，请检查后再次提交");
        }
      },
      cancel(){
        if(this.$route.params.mode===undefined) {
          this.loading = true
          this.editMode = false
          this.initData()
        }else{
          this.$emit("close")
        }
      },
      toCreateDoc(defDoc){
        this.$router.push("/apps/products/next/" +this.doc.docId+'/'+defDoc.docType)
      }
    }
  }
</script>

<style scoped>
    .card + .card{
        margin-top: 24px;
    }
</style>
