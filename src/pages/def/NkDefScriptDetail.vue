<template>
    <x-nk-page-layout :title="script.scriptName" :sub-title="script.scriptDesc" :spinning="loading" :class="{'full-screen':fullScreen}">

        <div slot="top" v-if="script.debug" style="padding: 10px 10px 0 10px;">
            <a-alert message="卡片程序正在调试" type="warning" show-icon />
        </div>

        <div slot="action">
            <a-button-group>
                <a-tooltip title="调试">
                    <a-button type="primary" @click="doRun"       :disabled="disabledOnlineEditing || !debugId || script.state!=='InActive' || script.version==='@'" >
                        <a-icon type="play-circle" />
                    </a-button>
                </a-tooltip>
                <a-tooltip title="激活">
                    <a-button type="danger"  @click="doActive"    :disabled="disabledOnlineEditing || isCreate || script.state!=='InActive'" >
                        <a-icon type="exclamation-circle" />
                    </a-button>
                </a-tooltip>
                <a-tooltip title="编辑">
                    <a-button                @click="doEdit"      :disabled="disabledOnlineEditing || editMode || script.state!=='InActive' || script.version==='@' " >
                        <a-icon type="edit" />
                    </a-button>
                </a-tooltip>
                <a-tooltip title="保存">
                    <a-button                @click="doUpdate"    :disabled="disabledOnlineEditing || !editMode || script.debug"            >
                        <a-icon type="save" />
                    </a-button>
                </a-tooltip>
                <a-tooltip title="全屏">
                    <a-button                @click="fullScreen = !fullScreen">
                        <a-icon :type="fullScreen?'shrink':'arrows-alt'" />
                    </a-button>
                </a-tooltip>
                <a-dropdown>
                    <a-menu slot="overlay" @click="handleMenuClick">
                        <a-menu-item key="doBreach" :disabled="disabledOnlineEditing || isCreate || script.scriptType === 'Unknown'">
                            <a-icon type="branches" /> 复制
                        </a-menu-item>
                        <a-menu-item key="doDelete" :disabled="disabledOnlineEditing || isCreate || script.state!=='InActive'">
                            <a-icon type="delete" /> 删除
                        </a-menu-item>
                    </a-menu>
                    <a-button><a-icon type="ellipsis" /></a-button>
                </a-dropdown>
            </a-button-group>
        </div>
        <a-layout>
            <a-layout-sider class="nk-list" bordered>
                <a-list item-layout="horizontal" :data-source="menus">
                    <a-list-item slot="renderItem"
                                 slot-scope="i"
                                 @click="menuClick(i)"
                                 :class="i===selected?'selected':''">
                        {{i.name}}
                    </a-list-item>
                </a-list>
                <a-list v-if="script.scriptType==='Card'" item-layout="horizontal" :data-source="vueDefs">
                    <a-list-item slot="renderItem"
                                 slot-scope="i"
                                 @click="menuClick(i)"
                                 :class="i===selected?'selected':''">
                        配置视图{{i.seq}}
                    </a-list-item>
                </a-list>
            </a-layout-sider>
            <a-layout-content style="padding-left: 20px;">
                <a-card v-if="selected.key==='info'" title="组件信息" :key="'base-'+selected.cardKey">
                    <a-button v-if="editMode" slot="extra" @click="addComponentDef" size="small">添加配置视图</a-button>
                    <nk-form :col="1" :edit="editMode">
                        <nk-form-item title="类别">
                            {{script.scriptType}}
                            <a-select v-model="script.scriptType"
                                      v-if="isCreate"
                                      size="small"
                                      style="max-width: 200px;"
                                      default-value="Card"
                                      slot="edit">
                                <a-select-option key="Card">Card</a-select-option>
                                <a-select-option key="Service">Service</a-select-option>
                            </a-select>
                        </nk-form-item>
                        <nk-form-item title="名称">
                            {{script.scriptName}}
                            <a-input v-if="routeParams.mode==='create'"
                                     v-model="script.scriptName"
                                     size="small"
                                     slot="edit"
                                     :maxLength="100"
                                     style="max-width: 200px;"
                                     allowClear />
                        </nk-form-item>
                        <nk-form-item title="描述">
                            {{script.scriptDesc}}
                            <a-input v-model="script.scriptDesc"
                                     size="small"
                                     slot="edit"
                                     :maxLength="100"
                                     style="max-width: 360px;"
                                     allowClear />
                        </nk-form-item>
                        <nk-form-item title="版本">
                            {{script.version}}
                        </nk-form-item>
                        <nk-form-item title="状态">
                            {{script.state}}
                        </nk-form-item>
                    </nk-form>
                </a-card>
                <a-card v-if="selected.key==='groovy'" title="处理程序" :key="'base-'+selected.cardKey">
                    <div class="editor">
                        <codemirror ref="codemirror1"
                                    :options="codeMirrorOptionsGroovy"
                                    :value="script.groovyMain || ''"
                                    @input="onCodeChange($event,'groovyMain')"
                        ></codemirror>
                    </div>
                </a-card>
                <a-card v-if="selected.key==='vue-main'" title="数据视图" :key="'base-'+selected.cardKey">
                    <div class="editor">
                        <codemirror ref="codemirror2"
                                    :options="codeMirrorOptionsVue"
                                    :value="script.vueMain || ''"
                                    @input="onCodeChange($event,'vueMain')"
                        ></codemirror>
                    </div>
                </a-card>
                <a-card v-if="selected.key && selected.key.startsWith('vueDef')" :title="`配置视图${selected.seq}`" :key="'base-'+selected.cardKey">
                    <a-button v-if="editMode" slot="extra" @click="removeComponentDef(selected)" size="small">移除</a-button>
                    <div class="editor">
                        <codemirror ref="codemirror3"
                                    :options="codeMirrorOptionsVue"
                                    :value="selected.code || ''"
                                    @input="onCodeChange($event,selected.key)"
                        ></codemirror>
                    </div>
                </a-card>
            </a-layout-content>
        </a-layout>
    </x-nk-page-layout>
</template>

<script>
import XNkPageLayout from "../../layout/template/XNkPageLayout";
import {mapState} from "vuex";
import {NkVueLoader} from "../../boot";

import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import "codemirror/theme/panda-syntax.css";
import "codemirror/addon/hint/show-hint.css";

require("codemirror/mode/groovy/groovy.js");
require("codemirror/mode/vue/vue.js");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/anyword-hint");

const markdownOption = {
    bold: true, // 粗体
    italic: true, // 斜体
    header: true, // 标题
    underline: true, // 下划线
    strikethrough: true, // 中划线
    mark: true, // 标记
    superscript: true, // 上角标
    subscript: true, // 下角标
    quote: true, // 引用
    ol: true, // 有序列表
    ul: true, // 无序列表
    link: true, // 链接
    imagelink: true, // 图片链接
    code: true, // code
    table: true, // 表格
    fullscreen: true, // 全屏编辑
    readmodel: false, // 沉浸式阅读
    htmlcode: true, // 展示html源码
    help: true, // 帮助
    undo: true, // 上一步
    redo: true, // 下一步
    trash: false, // 清空
    save: false, // 保存（触发events中的save事件）
    navigation: false, // 导航目录
    alignleft: true, // 左对齐
    aligncenter: true, // 居中
    alignright: true, // 右对齐
    subfield: true, // 单双栏模式
    preview: false, // 预览
};

export default {
    components:{
        XNkPageLayout,
        codemirror
    },
    data(){
        return {
            fullScreen:false,
            markdownOption,
            disabledOnlineEditing:true,

            script: {scriptType:'Card'},
            vueDefs: undefined,

            loading:true,
            editMode:false,
            routeParams:undefined,
            options:{},
            selected: {},
        }
    },
    computed:{
        ...mapState('Debug',[
            'debugId'
        ]),
        isCreate(){
            return this.routeParams.mode==='create';
        },
        menus(){
            const menus = [
                {key:"info",        name:"基本信息",    },
                {key:"groovy",      name:"处理程序",    },
            ];

            if(this.script.scriptType==='Card'){
                menus.push({key:"vue-main",name:"数据视图"});
            }

            return menus;
        },
        codeMirrorOptionsGroovy(){
            return Object.assign({
                mode:"groovy",
                theme: "panda-syntax",
                lineWrapping:true,
                indentUnit:4,
                tabSize: 4,
                lineNumbers: true,
                extraKeys: {
                    'Ctrl-.': 'autocomplete'
                },//自定义快捷键
            },{readOnly:!this.editMode});
        },
        codeMirrorOptionsVue(){
            return Object.assign({
                mode:"vue",
                theme: "panda-syntax",
                lineWrapping:true,
                indentUnit:4,
                tabSize: 4,
                lineNumbers: true,
                extraKeys: {
                    'Ctrl-.': 'autocomplete'
                },//自定义快捷键
            },{readOnly:!this.editMode});
        }
    },
    created() {
        this.routeParams = Object.assign({},this.$route.params);
        this.selected = this.menus[0]||{};
    },
    mounted() {

        this.loading = true;
        let promises = [];
        promises.push(this.$http.get(`/api/def/script/online/editing`));
        if(!this.isCreate){
            promises.push(this.$http.get(`/api/def/script/detail/${this.routeParams.script}/${this.routeParams.version}`));
        }

        Promise.all(promises)
            .then((res)=>{
                if(this.isCreate){
                    this.$emit('setTab',`新建单据类型`);
                    this.editMode = true;
                }else{
                    this.disabledOnlineEditing = res[0].data;
                    if(res[1].data){
                        this.script = res[1].data;
                        if(this.script.vueDefs){
                            const arr = JSON.parse(this.script.vueDefs);
                            this.vueDefs = arr.map(code=>{
                                const seq = arr.indexOf(code)+1;
                                return {
                                    key:'vueDef'+seq,
                                    seq,
                                    code
                                }
                            });
                        }
                        this.selected = this.menus[0];
                        this.editMode = !this.disabledOnlineEditing && this.script.state === 'InActive' || this.editMode;
                        this.$emit('setTab',`组件:${this.script.scriptName}`);
                    }
                }
                this.loading = false;
            })
    },
    methods:{
        menuClick(menu){
            this.selected = menu;
        },
        onCodeChange(e,key){
            if(key==='groovyMain'||key==='vueMain'){
                this.$set(this.script,key,e);
            }else{
                this.vueDefs.find(i=>i.key===key).code = e;
            }
        },
        regVueTemplate(){
            if(this.script.vueMain){
                NkVueLoader.loadVueTemplate(this.script.scriptName, this.script.vueMain)
            }
            if(this.vueDefs){
                this.vueDefs.forEach(i=>{
                    if(i.code){
                        let index = this.vueDefs.indexOf(i);
                        index = index ? index : '';
                        NkVueLoader.loadVueTemplate(this.script.scriptName+'Def'+index, i.code)
                    }
                })
            }
        },
        doRun(){
            this.valid().then(()=>{
                this.loading = true;
                this.$http.postJSON(`/api/def/script/debug`,this.script)
                    .then((res)=>{
                        this.script = res.data;
                        this.regVueTemplate();
                        this.$message.info("配置已运行")
                    })
                    .finally(()=>{
                        this.loading = false;
                    })
            });
        },
        doDelete(){
            this.loading = true;
            this.$http.postJSON(`/api/def/script/delete`,this.script)
                .then(()=>{
                    this.$emit("close");
                })
                .finally(()=>{
                    this.loading = false;
                })
        },
        doActive(){
            this.valid().then(()=>{
                this.loading = true;
                this.$http.postJSON(`/api/def/script/active`,this.script)
                    .then((res)=>{
                        this.regVueTemplate();
                        this.editMode = false;
                        this.script = res.data;
                    })
                    .finally(()=>{
                        this.loading = false;
                    })
            });
        },
        doBreach(){
            this.valid().then(()=>{
                this.loading = true;
                this.$http.postJSON(`/api/def/script/breach`,this.script)
                    .then((res)=>{
                        this.$emit("replace",`/apps/def/script/detail/${res.data.scriptName}/${res.data.version}`)
                    })
                    .catch(()=>{
                        this.loading = false;
                    })
            });
        },
        doEdit(){
            this.editMode = true;
        },
        doUpdate(){
            this.valid().then(()=>{
                this.loading = true;
                this.$http.postJSON(`/api/def/script/update`,this.script)
                    .then((res)=>{
                        if(!this.script.version){
                            this.$emit("replace",`/apps/def/script/detail/${this.script.scriptName}/${res.data.version}`)
                        }else{
                            this.script = res.data;
                            this.loading = false;
                        }
                    })
                    .catch(()=>{
                        this.loading = false;
                    })
            });
        },
        addComponentDef(){
            if(!this.vueDefs){
                this.$set(this,'vueDefs',[]);
            }
            const seq = this.vueDefs.length + 1;
            this.vueDefs.push({
                key:'vueDef'+seq,
                seq,
                code: 'code'
            });
        },
        removeComponentDef(item){
              this.vueDefs.splice(this.vueDefs.indexOf(item),1);
              this.selected = this.menus[0];
        },
        valid(){
            this.script.vueDefs = this.vueDefs && JSON.stringify(this.vueDefs.map(i=>i.code));
            return new Promise((resolve)=>{
                if(!this.script.scriptName){
                    this.$message.error("组件名称不能为空"); return;
                }
                resolve();
            })
        },
        handleMenuClick({key}){
            switch (key){
                case "doDelete":this.doDelete();break;
                case "doBreach":this.doBreach();break;
                case "showHistory":break;
            }
        }
    },
}
</script>

<style scoped lang="scss">
    .full-screen{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100;
        background: #f0f2f5;

        .editor{
            height: calc(100vh - 220px);
        }
    }
    ::v-deep {
        .ant-card-extra{
            padding: 0;
        }
        .ant-card + .ant-card{
            margin-top: 20px;
        }
        .v-note-wrapper{
            z-index: 1;
        }
        .editor{
            display: flex;
            flex-direction: column;
            width: 100%;
            height: calc(100vh - 350px);
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
