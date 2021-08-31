<template>
    <x-nk-page-layout :title="def.docType || '单据类型'" :sub-title="def.docName" :spinning="loading">

        <div slot="top" v-if="def.debug" style="padding: 10px 10px 0 10px;">
            <a-alert message="单据配置正在调试" type="warning" show-icon />
        </div>

        <div slot="action">
            <a-button-group>
                <a-tooltip title="调试">
                    <a-button type="primary" @click="doRun"       :disabled="!debugId || def.state!=='InActive'" >
                        <a-icon type="play-circle" />
                    </a-button>
                </a-tooltip>
                <a-tooltip title="停止">
                    <a-button @click="doStop"                      :disabled="!def.debug" >
                        <a-icon type="border" />
                    </a-button>
                </a-tooltip>
                <a-tooltip title="激活">
                    <a-button type="danger"  @click="doActive"    :disabled="isCreate || def.state!=='InActive'" >
                        <a-icon type="exclamation-circle" />
                    </a-button>
                </a-tooltip>
                <a-tooltip title="编辑">
                    <a-button                @click="doEdit"      :disabled="editMode || def.state!=='InActive'">
                        <a-icon type="edit" />
                    </a-button>
                </a-tooltip>
                <a-tooltip title="保存">
                    <a-button                @click="doUpdate"    :disabled="!editMode || def.debug"            >
                        <a-icon type="save" />
                    </a-button>
                </a-tooltip>
                <a-dropdown :trigger="['click']" placement="bottomRight">
                    <a-menu slot="overlay" @click="handleMenuClick">
                        <a-menu-item key="doBreach" :disabled="isCreate">
                            <a-icon type="branches" /> 新版本
                        </a-menu-item>
                        <a-menu-item key="doCopy" :disabled="isCreate">
                            <a-icon type="copy" /> 复制
                        </a-menu-item>
                        <a-menu-item key="doDelete" :disabled="isCreate || def.state==='Active'">
                            <a-icon type="delete" /> 删除
                        </a-menu-item>
                    </a-menu>
                    <a-button><a-icon type="ellipsis" /></a-button>
                </a-dropdown>
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
                <a-list item-layout="horizontal" :data-source="histories" style="margin-top: 2px">
                    <div slot="header">
                        版本记录
                    </div>
                    <a-list-item slot="renderItem"
                                 slot-scope="i"
                                 :class="{active:i.version===def.version}"
                                 @click="toVersion(i)">
                            <span>{{i.version | formatVersion}}</span>
                            <a-tag>{{i.state}}</a-tag>
                    </a-list-item>
                </a-list>
            </a-layout-sider>
            <a-layout-content style="padding-left: 20px;padding-bottom: 100px;">
                <component
                           v-for="(item,index) in selected.defComponentNames"
                           :key="index"
                           :is="item"
                           :doc-def="def"
                           :card-key="selected.cardKey"
                           :doc-options="options"
                           :edit-mode="editMode" />
                <a-card v-if="selected.beanName" title="文档"
                        :key="'document-'+selected.cardKey"
                        class="doc">
                    <a slot="extra" @click="mavonEdit = true" style="font-size: 12px;">编辑</a>
                    <div @click="mavonEdit = true">
                        <nk-empty v-if="!mavonEdit && !selected.markdown" :data="selected.markdown" style="margin: 40px 0;"></nk-empty>
                        <mavon-editor v-else
                                      v-model="selected.markdown"
                                      :subfield="false"
                                      :toolbarsFlag="mavonEdit"
                                      :defaultOpen="mavonEdit?'edit':'preview'"
                                      :toolbars="markdownOption"
                                      style="min-height: 360px;box-shadow:none;"
                                      :style="mavonEdit?'':'box-shadow:none;'"
                                      @click="mavonEdit=true"
                        />
                    </div>
                </a-card>
                <a-card v-if="selected.beanName" title="信息" :key="'base-'+selected.cardKey">
                    <nk-form :col="2">
                        <nk-form-item title="KEY">
                            {{selected.cardKey}}
                        </nk-form-item>
                        <nk-form-item title="逻辑对象">
                            <nk-script-label :value="selected.beanName"></nk-script-label>
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
import NkDefDocTypeIndex from "./NkDefDocTypeIndex";
import NkDefDocTypeDataSyncs from "./NkDefDocTypeDataSyncs";
import NkDefDocTypeBPM from "./NkDefDocTypeBPM";
import NkDefDocTypeCards from "./NkDefDocTypeCards";
import NkUtil from "../../utils/NkUtil";
import {mapState} from "vuex";

const defaultCards = [
    {key:"doc",     name:"基本信息",    defComponentNames: [NkDefDocTypeBase,    NkDefDocTypeStatus,]},
    {key:"cycle",   name:"业务逻辑",    defComponentNames: [NkDefDocTypeBizFlow, NkDefDocTypeCycle, NkDefDocTypeIndex, NkDefDocTypeDataSyncs]},
    {key:"bpm",     name:"审批流程",    defComponentNames: [NkDefDocTypeBPM,                        ]},
    {key:"cards",   name:"功能卡片",    defComponentNames: [NkDefDocTypeCards,                      ]},
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
        NkDefDocTypeBPM,
        NkDefDocTypeCards
    },
    filters:{
        formatVersion : (v)=>{
            return v.split('-')[0];
        }
    },
    data(){
        return {
            isCreate: false,
            defaultCards,
            markdownOption,
            def:{
                docType: undefined,
                refObjectType:'',
                status:[{
                    docState:'S001',
                    docStateDesc:'新创建',
                    editPerm:1,
                    preDocState:'@',
                    refObjectType:''
                }],
                flows:[{
                    preDocType:'@',
                    preDocStatus:'@',
                    refObjectType:''
                }],
                cards:[],
                cardsDef:{},
                updatedTime: undefined,
                version: '',
                bpm:{},
                validFrom:'',
                validTo:'',
                state:'InActive'
            },

            loading:true,
            editMode:false,
            mavonEdit:false,
            routeParams: {},
            routeQueries:{},
            histories:[],
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
    computed:{
        ...mapState('Debug',[
            'debugId'
        ])
    },
    created() {
        this.routeParams = Object.assign({},this.$route.params);
        this.routeQueries = Object.assign({},this.$route.query);
        this.isCreate = this.routeParams.mode==='create';
        this.selected = this.defaultCards[0]||{};
    },
    mounted() {

        this.loading = true;
        let promises = [];
        promises.push(this.$http.get(`/api/def/doc/type/options?classify=${this.def.docClassify||''}`));

        if(this.isCreate){
            if(this.routeQueries.fromType && this.routeQueries.fromVersion){
                promises.push(this.$http.get(`/api/def/doc/type/detail/${this.routeQueries.fromType}/${this.routeQueries.fromVersion}`));
            }
        }else{
            promises.push(this.$http.get(`/api/def/doc/type/detail/${this.routeParams.type}/${this.routeParams.version}`));
            promises.push(this.$http.get(`/api/def/doc/type/list/${this.routeParams.type}/1`));
        }

        Promise.all(promises)
            .then((res)=>{
                this.options = res[0].data;
                if(this.isCreate){
                    this.editMode = true;
                    this.$emit('setTab',`新建单据类型`);
                    if(res[1] && res[1].data){
                        this.def = res[1].data
                        this.def.docName = 'Copy From ' + this.def.docType;
                        this.def.docType = undefined;
                        this.def.version = undefined;
                        this.def.updatedTime = undefined;
                    }
                }else{
                    this.def = res[1].data;
                    this.histories = res[2].data;
                    this.editMode = this.def.state === 'InActive' || this.editMode;
                    this.$emit('setTab',`单据类型:${this.def.docType}`);
                }
                this.loading = false;
            })
    },
    methods:{
        init(){
        },
        menuClick(menu){
            this.mavonEdit = false;
            this.selected = menu;
        },
        doRun(){
            this.loading = true;
            this.$http.postJSON(`/api/def/doc/type/debug?run=true`,this.def)
                .then((res)=>{
                    if(this.isCreate){
                        this.$emit("replace",`/apps/def/doc/detail/${this.def.docType}/${res.data.version}`)
                    }else {
                        this.def = res.data;
                        this.$message.info("配置已运行")
                    }
                })
                .finally(()=>{
                    this.loading = false;
                })
        },
        doStop(){
            this.loading = true;
            this.$http.postJSON(`/api/def/doc/type/debug?run=false`,this.def)
                .then((res)=>{
                    this.def = res.data;
                    this.$message.info("配置已停止运行")
                })
                .finally(()=>{
                    this.loading = false;
                })
        },
        doDelete(){
            this.loading = true;
            this.$http.postJSON(`/api/def/doc/type/delete`,this.def)
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
                this.$http.postJSON(`/api/def/doc/type/active`,this.def)
                    .then((res)=>{
                        this.editMode = false;
                        this.def = res.data;
                    })
                    .finally(()=>{
                        this.loading = false;
                    })
            });
        },
        doBreach(){
            this.valid().then(()=>{
                this.loading = true;
                this.$http.postJSON(`/api/def/doc/type/breach`,this.def)
                    .then((res)=>{
                        this.$emit("replace",`/apps/def/doc/detail/${res.data.docType}/${res.data.version}`)
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
                this.$http.postJSON(`/api/def/doc/type/update`,this.def)
                    .then((res)=>{
                        if(this.isCreate){
                            this.$emit("replace",`/apps/def/doc/detail/${this.def.docType}/${res.data.version}`)
                        }else{
                            this.def = res.data;
                            this.loading = false;
                        }
                    })
                    .catch(()=>{
                        this.loading = false;
                    })
            });
        },
        toVersion(i){
            if(i.version!==this.def.version){
                this.loading = true;
                this.$emit('replace',`/apps/def/doc/detail/${i.docType}/${i.version}`);
            }
        },
        valid(){
            return new Promise((resolve)=>{
                if(!this.def.docType){
                    this.$message.error("单据类型不能为空"); return;
                }
                if(!this.def.docName){
                    this.$message.error("单据描述不能为空"); return;
                }
                // if(!this.def.validFrom || !this.def.validTo){
                //     this.$message.error("单据有效期限不能为空"); return;
                // }
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
        handleMenuClick({key}){
            switch (key){
                case "doDelete":this.doDelete();break;
                case "doBreach":this.doBreach();break;
                case "doCopy":this.$emit('replace',`/apps/def/doc/create?fromType=${this.def.docType}&fromVersion=${this.def.version}`);break;
                case "showHistory":break;
            }
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
        .ant-card.doc .ant-card-body{
            padding: 1px;
        }
    }
    .active{
        color: #1890ff;
    }

</style>
