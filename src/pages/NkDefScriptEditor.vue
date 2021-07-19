<template>
    <nk-page-layout>

        <a-button-group slot="action">
            <a-button v-if="editMode===false" type="primary" @click="edit">编辑</a-button>
            <a-button v-if="editMode===true&&script.scriptContent!==undefined" type="primary" @click="doSave()" :loading="loadingSave">保存</a-button>
            <a-button v-if="editMode===true&&script.scriptContent!==undefined" type="default" @click="close()">关闭</a-button>
            <a-button type="default" @click="create">新建</a-button>
        </a-button-group>

        <nk-edit-slot :edit-mode="editMode" slot="title">
            <span class="ant-page-header-heading-title">{{script.scriptDesc}}</span>
            <a-input slot="edit" class="desc" size="large" v-model="script.scriptDesc" placeholder="请输入描述" style="width: 400px;"></a-input>
        </nk-edit-slot>

        <a-row class="nk-def-script-layout" :class="fullscreen">
            <div class="editor">
                <a-skeleton :loading="loading">
                    <codemirror ref="codemirror"
                                :value="script.scriptContent || ''"
                                :options="codeMirrorOptions"
                                @input="onCodeChange"
                    ></codemirror>
                </a-skeleton>
            </div>
        </a-row>

    </nk-page-layout>
</template>

<script>

  import { codemirror } from 'vue-codemirror';
  import 'codemirror/lib/codemirror.css'
  import "codemirror/theme/ambiance.css";
  import "codemirror/addon/hint/show-hint.css";

  require("codemirror/mode/javascript/javascript.js");
  require("codemirror/mode/groovy/groovy.js");
  require("codemirror/addon/edit/matchbrackets");
  require("codemirror/addon/selection/active-line");
  require("codemirror/addon/hint/show-hint");
  require("codemirror/addon/hint/anyword-hint");

  export default {
    name: "NkDefScripts",
    components:{
      codemirror
    },
    data(){
      return {
        loading:false,
        loadingSave:false,
        fullscreen:'',
        editMode:false,
        script: {},
        code:'console.log("hello");',
        codeMirrorOptions:{
          value:'',
          mode:"groovy",
          theme: "ambiance",
          lineWrapping:true,
          indentUnit:4,
          tabSize: 4,
          readOnly:true,
          lineNumbers: true,
          extraKeys: {
            'Ctrl-.': 'autocomplete'
          },//自定义快捷键
        }
      }
    },
    created(){
      if(this.$route.params.scriptName){
        this.load(this.$route.params.scriptName)
      }else{
        this.script = {
          scriptDesc:'未命名Groovy对象',
          scriptContent:'package custom; \n\npublic class <ClassName> implements <InterfaceName>{\n\t\n\t\n}',
          updatedTime: Math.floor(new Date().getTime()/1000)
        }
        this.codeMirrorOptions.readOnly=false;
        this.editMode=true;
      }
    },
    methods:{
      load(scriptName){
          this.loading = true;
          this.$http.get("/api/def/script/name?scriptName="+scriptName)
            .then(response=>{
              this.script = response.data;
              this.codeMirrorOptions.readOnly=true;
              this.loading = false;
              this.$emit('setTab',this.script.scriptDesc);
            })
      },
      create(){
        this.$emit("replace","/apps/def/script/editor/create")
      },
      onCodeChange(newCode) {
        this.script.scriptContent = newCode
      },
      doSave(){
        this.loadingSave = true;
        this.$http.postJSON("/api/def/script/update",this.script)
          .then(response=>{
            let scriptName = this.script.scriptName;
            this.script = response.data;
            if(scriptName!==this.script.scriptName){
              this.init();
            }
            setTimeout(()=>{this.loadingSave = false;this.$message.success('脚本已经保存并激活');},500)
          })
          .catch(()=>{
            this.loadingSave = false;
          })
      },
      close(){
        this.$emit('close')
      },
      edit(){
        this.editMode=true;
        this.codeMirrorOptions.readOnly=false;
      }
    }
  }
</script>

<style lang="scss" scoped>
    ::v-deep .nk-def-script-layout{
        display: flex;
        height: calc(100vh - 369px);
        width: 100%;

        .editor{
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            background-color: #222;

            .ant-skeleton{
                h3,li{
                    background: #333333;
                }
            }
            .vue-codemirror{
                width: 100%;
                height: 100%;

                .CodeMirror{
                    height: 100%;
                }
                .CodeMirror-vscrollbar::-webkit-scrollbar {
                    /*滚动条整体样式*/
                    width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
                    height: 5px;
                }
                .CodeMirror-vscrollbar::-webkit-scrollbar-thumb {
                    /*滚动条里面小方块*/
                    border-radius: 10px;
                    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                    background   : #666;
                }
                .CodeMirror-vscrollbar::-webkit-scrollbar-track {
                    /*滚动条里面轨道*/
                    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                    background   : #333;
                }
            }
        }
    }
</style>
