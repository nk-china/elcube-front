<template>
    <nk-page-layout title="基础配置" sub-title="设置系统通用属性" :loading="loading">

        <div style="display: flex;;width: 100%;">
            <div
                class="ant-card-bordered" style="width: 300px;margin-right: 20px;padding:10px;flex-grow: 1;background-color: #fff;">
                <a-directory-tree ref="tree"
                                  v-if="tree"
                                  :tree-data="tree"
                                  :selected-keys="selectKeys"
                                  :expanded-keys="expandedKeys"
                                  :default-expand-all="expand"
                                  :show-line="false"
                                  :show-icon="true"
                                  @select="select"
                                  style=""
                >
                </a-directory-tree>
            </div>
            <div style="width: 100%;">
                <a-card v-if="selectedNode && !selectedNode.isNew" title="子元素" style="margin-bottom: 20px;">
                    <template v-if="selectedNode.children">
                        <a-tag v-for="item in selectedNode.children" :key="item.key" :closable="true" @click="select([item.key])">
                            {{item.title}}
                        </a-tag>
                    </template>
                    <a-tag style="background: #fff; borderStyle: dashed;" @click="add">
                        <a-icon type="plus" /> 新增
                    </a-tag>
                </a-card>
                <a-card title="值" v-if="selectedNode && !selectedNode.readonly">
                    <nk-form :col="1" :edit="true">
                        <nk-form-item title="类型">{{selectedNode.regType}}</nk-form-item>
                        <nk-form-item title="键" :edit="!!selectedNode.isNew">
                            {{selectedNode.regKey}}
                            <div slot="edit">
                                <a-input v-model="selectedNewKey" >
                                    <span slot="addonBefore" v-if="selectedNode.regKey">{{selectedNode.regKey}}</span>
                                </a-input>
                            </div>
                        </nk-form-item>
                        <nk-form-item title="描述">
                            {{selectedNode.title}}
                            <a-input slot="edit" v-model="selectedNode.title" style="width: 200px;"></a-input>
                        </nk-form-item>
                        <nk-form-item title="数据类型" v-if="!!selectedNode">
                            <a-select v-model="selectedNode.dataType"
                                      :options="selectedDataTypes"
                                      @change="selectedNode.content=undefined"
                                      style="width: 200px;">
                            </a-select>
                        </nk-form-item>
                        <nk-form-item title="值" v-if="selectedNode.dataType && selectedNode.loaded">
                            <div style="width: 100%;">
                                <component :is="selectedNode.dataType" v-model="selectedNode.content" :editable="true"></component>
                            </div>
                        </nk-form-item>
                    </nk-form>

                    <div v-if="!!selectedNode" slot="actions" style="text-align: right;padding-right: 40px;">
                        <a-button-group>
                            <a-button type="primary" @click="saveSelected">保存</a-button>

                            <a-popconfirm
                                title="确认删除?"
                                ok-text="Yes"
                                cancel-text="No"
                                @confirm="remove"
                            >
                                <a-button>删除</a-button>
                            </a-popconfirm>
                        </a-button-group>
                    </div>

                </a-card>
                <a-card v-if="!selectedNode" style="padding: 100px 0;">
                    <nk-empty></nk-empty>
                </a-card>
            </div>
        </div>
    </nk-page-layout>
</template>

<script>
// import NkUtil from "../../utils/NkUtil";
import NkRegistryText from "../components/NkRegistryTextEdit";
import NkRegistrySelectOptions from "../components/NkRegistryJSONEdit";
import NkRegistryDataSetNote from "../components/NkRegistryJSONEdit";
import NkRegistryCustomQuery from "../components/NkRegistryJSONEdit";

const dataType = {
    "@METER":[{
        title:"图表",
        value:'NkMeterAntVArea'
    }],
    "@DICT":[{
        title:"普通文本",
        value:"NkRegistryText"
    },{
        title:"下拉选项",
        value:"NkRegistrySelectOptions"
    }],
    "@DATASET":[{
        title:"数据集描述",
        value:"NkRegistryDataSetNote"
    }],
    "@PAGE":[{
        title:"自定义查询界面",
        value:"NkRegistryCustomQuery"
    }]
}

export default {
    provide:{
        mode:"edit",
        bodyHeight:"200px"
    },
    components:{
        NkRegistryText,
        NkRegistrySelectOptions,
        NkRegistryDataSetNote,
        NkRegistryCustomQuery
    },
    data() {
        return {
            tree:[],
            selectedNode:undefined,
            selectedNewKey:undefined,
            selectedDataTypes:[],
            selectKeys:[],
            parentNode:undefined,
            expand:false,
            loading:false
        }
    },
    computed:{
        expandedKeys(){
            let keys = [];
            this.selectKeys.forEach(key=>{
                let arr = [];
                key.split('.').forEach(c=>{
                    arr.push(c);
                    keys.push(arr.join('.'));
                });
            })

            return keys;
        }
    },
    created() {
        this.$http.get("/api/platform/registry/def/tree")
            .then(res=>{
                this.tree = res.data.map(e=>{e.selectable=true;return e;});
            });

        this.$http.get("/api/meter/card/defs")
            .then(res=>{
                dataType["@METER"] = 
                    res.data.map(i=>{
                        return {
                            title:i.name,
                            value:i.component
                        }
                    });
            });
    },
    methods:{
        select(e){
            const selectKey = e[0];
            if(selectKey&&selectKey.indexOf('.')!==-1){
                this.loading = true;

                this.selectKeys = [selectKey];

                // 确定选中节点的data
                let selectNode = {children:this.tree};
                let loopKey = [];
                selectKey.split(".").forEach(k=>{
                    loopKey.push(k);
                    selectNode = selectNode.children.find(c=>c.key===loopKey.join("."));
                })
                this.selectedNode = selectNode;

                this.$http.get(`/api/platform/registry/def/value/${e[0]}`).then((res)=>{
                    if(res.data&&res.data.content){
                        res.data.content = JSON.parse(res.data.content);
                    }
                    this.selectedNode = Object.assign(this.selectedNode,res.data);
                    // 数据类型
                    this.selectedDataTypes = dataType[this.selectedNode.regType];
                    this.$set(this.selectedNode,'loaded',true);
                }).finally(()=>{
                    this.loading = false;
                });
            }else{
                this.selectKeys = [selectKey];
                this.selectedNode = this.tree.find(c=>c.key===selectKey);
                this.selectedNode.readonly = true;
            }
        },
        saveSelected(){
            this.loading = true;
            const value = Object.assign({},this.selectedNode);
            value.content = value.content && JSON.stringify(value.content);
            if(this.selectedNode.isNew){
                value.regKey  = value.regKey + this.selectedNewKey;
                if(this.parentNode.children && this.parentNode.children.find(c=>c.regKey === value.regKey)){
                    this.$message.error(`KEY[${this.selectedNewKey}]已经存在`);
                    this.loading = false;
                    return;
                }
            }
            this.$http.postJSON(`/api/platform/registry/def/value`,value).then(()=>{
                if(this.selectedNode.isNew){
                    this.selectedNode.isNew  = false;
                    this.selectedNode.key    = value.regType+'.'+value.regKey;
                    this.selectedNode.regKey = value.regKey;
                    this.parentNode.children = this.parentNode.children||[];
                    this.parentNode.isLeaf   = false;
                    this.parentNode.children.push(this.selectedNode);
                    this.selectKeys = [this.selectedNode.key];
                }
            }).finally(()=>{
                this.loading = false;
            });
        },
        add(){
            this.selectedNewKey = undefined;
            this.selectKeys = [this.selectedNode.key];
            let selectNode = {
                regType:this.selectedNode.regType,
                regKey:(this.selectedNode.regKey||'') + (this.selectedNode.regKey?'.':''),
                title: "新创建",
                dataType: undefined,
                content:undefined,
                isNew:true,
                isLeaf:true,
                selectable:true,
                loaded:true,
            }

            this.selectedDataTypes = dataType[this.selectedNode.regType];
            this.parentNode = this.selectedNode;
            this.selectedNode = selectNode;
        },
        remove(){
            this.$http.postJSON(`/api/platform/registry/def/value/delete`, {regType:this.selectedNode.regType,regKey:this.selectedNode.regKey}).then(()=>{
                if(this.selectedNode.children){
                    this.selectedNode.content = undefined;
                    this.selectedNode.dataType= undefined;
                }else{
                    let parentKey = this.selectedNode.key.substring(0,this.selectedNode.key.lastIndexOf('.'));
                    let selectNode = {children:this.tree};
                    let loopKey = [];
                    parentKey.split(".").forEach(k=>{
                        loopKey.push(k);
                        selectNode = selectNode.children.find(c=>c.key===loopKey.join("."));
                    })
                    selectNode.children.splice(selectNode.children.indexOf(this.selectedNode),1);
                    if(selectNode.children.length === 0){
                        selectNode.isLeaf=true;
                    }
                    this.select([parentKey]);
                }
            });
        }
    }
}
</script>

<style scoped>

</style>
