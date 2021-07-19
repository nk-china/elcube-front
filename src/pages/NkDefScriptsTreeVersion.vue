<template>
    <nk-page-layout title="脚本编辑器">

        <a-button-group slot="action">
            <a-button type="primary" @click="create">新建</a-button>
            <a-button type="default" @click="fullscreen = 'fullscreen'">全屏</a-button>
        </a-button-group>

        <a-row class="nk-def-script-layout" :class="fullscreen">
            <a-directory-tree
                    :defaultExpandAll="true"
                    @select="onSelect"
                    @expand="onExpand"
                    :treeData="treeData"
                    class="tree"
            />
            <div class="editor">
                <div class="toolbar">
                    <div style="width:100%">
                        <div class="item" v-if="script.scriptContent!==undefined">
                            <label>描述</label>
                            <a-input class="desc" size="small" v-model="script.scriptDesc"></a-input>
                        </div>
                    </div>
                    <a-button v-if="fullscreen === 'fullscreen'" class="btn" type="link" size="small" @click="create()">新建</a-button>
                    <a-button v-if="script.scriptContent!==undefined" class="btn" type="link" size="small" @click="doSave()" :loading="loadingSave">保存</a-button>
                    <a-button v-if="script.scriptContent!==undefined" class="btn" type="link" size="small" @click="close()">关闭</a-button>
                    <a-button v-if="fullscreen === 'fullscreen'" class="btn" type="link" size="small" @click="fullscreen = ''">退出全屏</a-button>
                </div>
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

  const nodeSort = (a,b)=>{
    return a.isLeaf===b.isLeaf?(a.key>b.key?1:-1):a.isLeaf?1:-1;
  }

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
        list:[],
        treeData: [],
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
    methods:{
      init(){
        this.$http.get("/api/def/script/list")
          .then((response)=>{
            const hash = [];
            response.data.forEach(script=>{
              let parent = hash,
                position = 0,
                index;
              while((index = script.scriptName.indexOf('.',position))!==-1){
                position = index+1;
                let key = script.scriptName.substring(0,index),
                  node = parent.find(node=>node.key===key);
                if(!node){
                  node = {key:key,title:key.replace(/.*[.]/g,''),children:[]};
                  parent.push(node)
                  parent.sort(nodeSort);
                }
                parent = node.children;
              }
              parent.push({key:script.scriptName,title:script.scriptName.replace(/.*[.]/g,''),isLeaf:true});
              parent.sort(nodeSort);
            })
            this.treeData = hash;
            this.list = response.data;
          });
      },
      onSelect(e){
        let script = this.list.find(item=>item.scriptName===e[0]);
        if(script){
          this.loading = true;
          this.$http.get("/api/def/script/get?scriptId="+script.scriptId)
            .then(response=>{
              this.script = response.data;
              this.codeMirrorOptions.readOnly=false;
              this.loading = false;
            })
        }
      },
      onExpand(){},
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
        this.script = {}
        this.codeMirrorOptions.readOnly=true;
      },
      create(){
        this.script = {
          scriptDesc:'未命名Groovy对象',
          scriptContent:'package custom; \n\npublic class <ClassName> implements <InterfaceName>{\n\t\n\t\n}',
          updatedTime: Math.floor(new Date().getTime()/1000)
        }
        this.codeMirrorOptions.readOnly=false;
      }
    },
    created() {
      this.init();
    }
  }
</script>

<style lang="scss">
    .nk-def-script-layout{
        display: flex;
        height: calc(100vh - 369px);
        width: 100%;

        &.fullscreen{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 999999;
            height: 100vh;
        }

        .tree{
            flex-shrink: 0;
            width: 20%;
            min-width: 200px;
            background-color: #343436;
            color: white;
            overflow-y: auto;

            &.ant-tree li .ant-tree-node-content-wrapper{
                color: #999999;
            }
            &.ant-tree li .ant-tree-node-content-wrapper:hover{
                color: #333333;
            }

            &::-webkit-scrollbar {
                /*滚动条整体样式*/
                width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
                height: 5px;
            }
            &::-webkit-scrollbar-thumb {
                /*滚动条里面小方块*/
                border-radius: 10px;
                box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                background   : #666;
            }
            &::-webkit-scrollbar-track {
                /*滚动条里面轨道*/
                box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                background   : #333;
            }
        }

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

            .toolbar{
                width: 100%;
                height: 24px;
                flex-shrink: 0;
                background-color: #222;
                display: flex;
                justify-content: space-between;

                .item{
                    width: 100%;
                    flex-shrink: 0;
                    color: #aaaaaa;
                    display: flex;
                    justify-content: center;

                    label{
                        flex-shrink: 0;
                        width: 40px;
                        display: flex;
                        padding: 0 5px;
                        vertical-align: center;
                        align-items: center;
                    }
                    label:after{
                        content: ' :';
                    }

                    input{
                        font-size: 12px;
                        width: 100%;
                        border-radius: 0;
                        background-color: #222;
                        border: solid 1px #333;
                        color: #aaaaaa;
                    }
                }
                .btn{
                    flex-shrink: 0;
                    font-size: 12px;
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
