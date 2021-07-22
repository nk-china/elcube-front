<template>
    <x-nk-page-layout title="NkCardDate" sub-title="日期卡片">
        <div slot="action">
            <a-button-group>
                <a-button type="primary"><a-icon type="play-circle" /></a-button>
                <a-button disabled="disabled"><a-icon type="stop" /></a-button>
                <a-button><a-icon type="exclamation-circle" /></a-button>
                <a-button><a-icon type="save" /></a-button>
                <a-button><a-icon type="clock-circle" /></a-button>
            </a-button-group>
        </div>
        <a-layout>
            <a-layout-sider class="nk-list" bordered>
                <a-list item-layout="horizontal" :data-source="menu">
                    <a-list-item slot="renderItem"
                                 slot-scope="i"
                                 @click="menuClick(i)"
                                 :class="i.key===selected.key?'selected':''">
                        {{i.name}}
                    </a-list-item>
                </a-list>
                <a-list item-layout="horizontal" :data-source="cards" style="margin-top: 2px">
                    <a-list-item slot="renderItem"
                                 slot-scope="i"
                                 @click="menuClick(i)"
                                 :class="i.key===selected.key?'selected':''">
                        {{i.name}}
                    </a-list-item>
                </a-list>
            </a-layout-sider>
            <a-layout-content style="padding-left: 20px;">
                <a-card title="基本信息" v-if="selected.key==='doc'">
                    <a-skeleton></a-skeleton>
                </a-card>
                <a-card title="数据结构" v-if="selected.key==='cycle'">
                    <codemirror ref="codemirror"
                                :value="code"
                                :options="codeMirrorOptions"
                    ></codemirror>
                </a-card>
                <a-card title="实现类" v-if="selected.key==='mapping'">
                    <a-skeleton></a-skeleton>
                </a-card>
                <a-card title="界面" v-if="selected.key==='index'">
                    <a-skeleton></a-skeleton>
                </a-card>
                <a-card title="业务流" v-if="selected.key==='flow'">
                    <a-skeleton></a-skeleton>
                </a-card>
                <a-card title="审批流" v-if="selected.key==='bpm'">
                    <a-skeleton></a-skeleton>
                </a-card>
                <a-card title="卡片组件" v-if="selected.key==='cards'">
                    <a-skeleton></a-skeleton>
                </a-card>
            </a-layout-content>
        </a-layout>
    </x-nk-page-layout>
</template>

<script>

import XNkPageLayout from "../layout/template/XNkPageLayout";

require("codemirror/mode/groovy/groovy.js");

import 'codemirror/mode/javascript/javascript.js'

import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'

// require active-line.js
import'codemirror/addon/selection/active-line.js'

// styleSelectedText
import'codemirror/addon/selection/mark-selection.js'
import'codemirror/addon/search/searchcursor.js'

// hint
import'codemirror/addon/hint/show-hint.js'
import'codemirror/addon/hint/show-hint.css'
import'codemirror/addon/hint/javascript-hint.js'
import'codemirror/addon/selection/active-line.js'

// highlightSelectionMatches
import'codemirror/addon/scroll/annotatescrollbar.js'
import'codemirror/addon/search/matchesonscrollbar.js'
import'codemirror/addon/search/searchcursor.js'
import'codemirror/addon/search/match-highlighter.js'

// keyMap
import'codemirror/mode/clike/clike.js'
import'codemirror/addon/edit/matchbrackets.js'
import'codemirror/addon/comment/comment.js'
import'codemirror/addon/dialog/dialog.js'
import'codemirror/addon/dialog/dialog.css'
import'codemirror/addon/search/searchcursor.js'
import'codemirror/addon/search/search.js'
import'codemirror/keymap/sublime.js'

// foldGutter
import'codemirror/addon/fold/foldgutter.css'
import'codemirror/addon/fold/brace-fold.js'
import'codemirror/addon/fold/comment-fold.js'
import'codemirror/addon/fold/foldcode.js'
import'codemirror/addon/fold/foldgutter.js'
import'codemirror/addon/fold/indent-fold.js'
import'codemirror/addon/fold/markdown-fold.js'
import'codemirror/addon/fold/xml-fold.js'

export default {
    components:{
        codemirror,
        XNkPageLayout
    },
    data(){
        return {
            menu:[{
                key:"doc",
                name:"基本信息",
            },{
                key:"cycle",
                name:"数据结构",
            },{
                key:"mapping",
                name:"实现类",
            },{
                key:"index",
                name:"界面",
            }],
            cards:[{
                key:"nkCardDate",
                name:"自定义Groovy",
            },{
                key:"nkCardPartner",
                name:"自定义Vue组件",
            },{
                key:"nkCardPrice",
                name:"自定义Vue组件2",
            },{
                key:"nkCardFlow",
                name:"自定义Groovy2",
            }],
            selected: {},

            codeMirrorOptions:{
                value:'',
                mode:"text/javascript",
                theme: "monokai",
                lineWrapping:true,
                indentUnit:4,
                tabSize: 4,
                readOnly:false,
                lineNumbers: true,
                extraKeys: {
                    'Ctrl-.': 'autocomplete',
                    'Cmd-.': 'autocomplete'
                },//自定义快捷键
            },
            code:''
        }
    },
    methods:{
        menuClick(menu){
            this.selected = menu;
        }
    },
    mounted() {
        this.selected = this.menu[0]||{};
        this.$emit("setTab","卡片:NkCardDate")
    }
}
</script>

<style scoped lang="scss">
    ::v-deep {
        .ant-card + .ant-card{
            margin-top: 20px;
        }
    }

</style>
