<template>
    <x-nk-page-layout :title="def.docType||'未命名'" :sub-title="def.docName" :loading="loading">
        <div slot="action">
            <a-button-group>
                <a-button type="primary" @click="doRun"                         ><a-icon type="play-circle" /></a-button>
                <a-button                @click="doStop" disabled="disabled"    ><a-icon type="stop" /></a-button>
                <a-button type="danger"  @click="doActive"                      ><a-icon type="exclamation-circle" /></a-button>
                <a-button                @click="doEdit"   :disabled="editMode" ><a-icon type="edit" /></a-button>
                <a-button                @click="doUpdate" :disabled="!editMode"><a-icon type="save" /></a-button>
                <a-button                @click="showHistory"                   ><a-icon type="clock-circle" /></a-button>
            </a-button-group>
        </div>
        <a-layout>
            <a-layout-sider class="nk-list" bordered>
                <a-list item-layout="horizontal" :data-source="defaultCards">
                    <a-list-item slot="renderItem"
                                 slot-scope="i"
                                 @click="menuClick(i)"
                                 :class="i===selected?'selected':''">
                        {{i.name}}
                    </a-list-item>
                </a-list>
                <a-list item-layout="horizontal" :data-source="def.cards" style="margin-top: 2px">
                    <a-list-item slot="renderItem"
                                 slot-scope="i"
                                 @click="menuClick(i)"
                                 :class="i===selected?'selected':''">
                        {{i.cardName || '未命名卡片'}}
                    </a-list-item>
                </a-list>
            </a-layout-sider>
            <a-layout-content style="padding-left: 20px;padding-bottom: 100px;">
                <a-card v-if="selected.cardHandler" title="卡片信息" :key="'base-'+selected.cardKey">
                    <nk-form :col="2">
                        <nk-form-item title="KEY">
                            {{selected.cardKey}}
                        </nk-form-item>
                        <nk-form-item title="逻辑对象">
                            <nk-script-label :value="selected.cardHandler"></nk-script-label>
                        </nk-form-item>
                        <nk-form-item title="计算次数">
                            {{selected.calcTimes}}
                        </nk-form-item>
                        <nk-form-item title="计算顺序">
                            {{selected.calcOrder}}
                        </nk-form-item>
                        <nk-form-item title="编辑条件">
                            {{selected.editableSpEL}}
                        </nk-form-item>
                        <nk-form-item title="显示条件">
                            {{selected.visibleSpEL}}
                        </nk-form-item>
                    </nk-form>
                </a-card>
                <component
                           v-for="item in selected.defComponentNames"
                           :key="item.cardKey"
                           :is="item"
                           :doc-def="def"
                           :card="selected"
                           :doc-options="options"
                           :edit-mode="editMode" />
                <a-card v-if="selected.cardHandler" title="文档" :key="'document-'+selected.cardKey">
                    <mavon-editor v-model="selected.markdown"
                                  :subfield="false"
                                  :toolbarsFlag="editMode"
                                  :defaultOpen="editMode?'edit':'preview'"
                                  :toolbars="markdownOption"
                                  style="min-height: 180px;"
                    />
                </a-card>
            </a-layout-content>
        </a-layout>
    </x-nk-page-layout>
</template>

<script>
import XNkPageLayout from "../../layout/template/XNkPageLayout";
import NkDefDocTypeBase from "./NkDefDocTypeBase";
import NkDefDocTypeStatus from "./NkDefDocTypeStatus";
import NkDefDocTypeBizFlow from "./NkDefDocTypeBizFlow";
import NkDefDocTypeCycle from "./NkDefDocTypeCycle";
import NkDefDocTypeCards from "./NkDefDocTypeCards";
import NkUtil from "../../utils/NkUtil";

const defaultCards = [
    {key:"doc",     name:"基本信息",    defComponentNames: [NkDefDocTypeBase,NkDefDocTypeStatus,NkDefDocTypeBizFlow]},
    {key:"cycle",   name:"生命周期",    defComponentNames: [NkDefDocTypeCycle]   },
    {key:"cards",   name:"功能卡片",    defComponentNames: [NkDefDocTypeCards]   },
];

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
        NkDefDocTypeBase,
        NkDefDocTypeStatus,
        NkDefDocTypeCycle,
        NkDefDocTypeCards
    },
    data(){
        return {
            defaultCards,
            markdownOption,
            def:{
                refObjectType:'',
                status:[],
                cards:[],
                cardsDef:{},
                updatedTime: undefined,
                version: 1,
                bpm:{},
                validFrom:'',
                validTo:''
            },

            loading:true,
            editMode:false,
            routeParams:undefined,
            options:{},
            selected: {},
            cards:[{
                key:"bpm",
                name:"审批流",
            },{
                key:"mapping",
                name:"数据映射",
            },{
                key:"index",
                name:"索引规则",
            },{
                key:"nkCardDate",
                name:"日期",
            },{
                key:"nkCardPartner",
                name:"交易伙伴",
            },{
                key:"nkCardPrice",
                name:"价格",
            },{
                key:"nkCardFlow",
                name:"交易历史",
            }]
        }
    },
    created() {
        this.routeParams = Object.assign({},this.$route.params);
        this.selected = this.defaultCards[0]||{};
        this.init();
    },
    mounted() {
        if(this.routeParams.mode==='detail'){
            this.loading = true;
            this.$http.get("/api/def/doc/type/detail?docType="+this.routeParams.type)
                .then(response=>{
                    this.def = response.data;
                    this.loading = false;
                    this.$emit('setTab',`单据类型:${this.def.docType}`);
                })
        }else{
            this.$emit('setTab',`新建单据类型`);
        }
    },
    methods:{
        init(){
            this.loading = true;
            this.$http.get(`/api/def/doc/type/options?classify=${this.def.docClassify||''}`)
                .then(response=>{
                    this.options = response.data;
                })
                .catch(()=>{})
                .finally(()=>{
                    this.loading=false;
                })
        },
        menuClick(menu){
            this.selected = menu;
        },
        doRun(){
            console.log(this.def)
        },
        doStop(){

        },
        doActive(){

        },
        doEdit(){
            this.editMode = true;
        },
        doUpdate(){
            this.valid().then(()=>{
                const create = this.routeParams.mode==='create';
                this.loading = true;
                this.$http.postJSON(`/api/def/doc/type/update?create=${create}`,this.def)
                    .then(()=>{
                        if(create)  this.$router.push(`/apps/def/doc/detail/${this.def.docType}`)
                        else        this.editMode = false;
                    })
                    .finally(()=>{
                        this.loading = false;
                    })
            });
        },
        valid(){
            return new Promise((resolve)=>{
                if(!this.def.docType){
                    this.$message.error("单据类型不能为空"); return;
                }
                if(!this.def.docName){
                    this.$message.error("单据描述不能为空"); return;
                }
                if(!this.def.validFrom || !this.def.validTo){
                    this.$message.error("单据有效期限不能为空"); return;
                }
                if(!this.def.refObjectType){
                    this.$message.error("单据处理程序不能为空"); return;
                }
                if(!this.def.refObjectType){
                    this.$message.error("单据处理程序不能为空"); return;
                }
                if(!this.def.status.length){
                    this.$message.error("单据状态不能为空"); return;
                }
                if(NkUtil.hasBlack(this.def.cards,["cardKey"])){
                    this.$message.error(`卡片KEY不能为空，请注意调整`); return;
                }
                if(NkUtil.isRepeat(this.def.cards,["cardKey"])){
                    this.$message.error(`卡片KEY重复，请注意调整`); return;
                }
                resolve();
            })
        },
        showHistory(){

        }
    },
}
</script>

<style scoped lang="scss">
    ::v-deep {
        .ant-card + .ant-card{
            margin-top: 20px;
        }
        .v-note-wrapper{
            z-index: 1;
        }
    }

</style>
