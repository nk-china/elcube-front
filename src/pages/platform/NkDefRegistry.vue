<template>
    <nk-page-layout title="注册表" sub-title="设置系统通用属性">

        <div style="display: flex;;width: 100%;">
            <div
                class="ant-card-bordered" style="width: 300px;margin-right: 20px;padding:10px;flex-grow: 1;background-color: #fff;">
                <a-directory-tree ref="tree"
                                  v-if="tree"
                                  :tree-data="tree"
                                  :selected-keys="selectKeys"
                                  :default-expand-all="expand"
                                  :show-line="false"
                                  :show-icon="true"
                                  @select="select"
                                  style=""
                >
                    <template #title="{ key: treeKey, title }">
                        <a-dropdown :trigger="['contextmenu']">
                            <span>{{ title }}</span>
                            <template #overlay>
                                <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
                                    <a-menu-item key="1">添加</a-menu-item>
                                    <a-menu-item key="2">删除</a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </template>
                </a-directory-tree>
            </div>
            <div style="width: 100%;">
                <a-card style="width: 100%;">
                    <nk-form :col="1" v-if="selectedNode" :edit="!!selectedValue">
                        <nk-form-item title="类型">{{selectedNode.regType}}</nk-form-item>
                        <nk-form-item title="键">
                            {{selectedNode.regKey}}
                            <a-input v-if="selectedNode.isNew" slot="edit" v-model="selectedValue.regKey" autofocus></a-input>
                            <span v-else slot="edit">{{selectedNode.regKey}}</span>
                        </nk-form-item>
                        <nk-form-item title="描述">
                            {{selectedNode.title}}
                            <a-input v-if="!!selectedValue" slot="edit" v-model="selectedValue.title"></a-input>
                        </nk-form-item>
                        <nk-form-item title="数据类型" v-if="!!selectedValue">
                            <a-select v-model="selectedValue.dataType" :options="selectedDataTypes" @change="selectedValue.content=undefined">
                                <a-select-option value="1">default</a-select-option>
                                <a-select-option value="2">default</a-select-option>
                                <a-select-option value="3">default</a-select-option>
                            </a-select>
                        </nk-form-item>
                        <nk-form-item title="值" v-if="!!selectedValue && selectedValue.dataType">
                            <div style="width: 100%;">
                                <component :is="selectedValue.dataType" v-model="selectedValue.content" :editable="true" style="max-height: 400px;"></component>
                            </div>
                        </nk-form-item>
                    </nk-form>
                    <div v-else style="padding: 100px 0;">
                    <nk-empty></nk-empty>
                    </div>

                    <div v-if="!!selectedValue" slot="actions" style="text-align: right;padding-right: 40px;">
                        <a-button-group>
                            <a-button type="primary" @click="saveSelected">保存</a-button>
                            <a-button @click="remove">删除</a-button>
                        </a-button-group>
                    </div>

                </a-card>
            </div>
        </div>
    </nk-page-layout>
</template>

<script>
// import NkUtil from "../../utils/NkUtil";
import NkRegistryText from "./NkRegistryTextEdit";
import NkRegistrySelectOptions from "./NkRegistryJSONEdit";
import NkRegistryDataSetNote from "./NkRegistryJSONEdit";
import NkRegistryCustomQuery from "./NkRegistryJSONEdit";

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
    "@NOTE":[{
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
            selectedValue:undefined,
            selectedDataTypes:[],
            selectKeys:[],
            parentNode:undefined,
            expand:false
        }
    },
    created() {
        this.$http.get("/api/sys/constant/tree")
            .then(res=>{
                this.tree = res.data.map(e=>{e.selectable=false;return e;});
            });
    },
    methods:{
        select(e){

            console.log(e)

            if(e[0]&&e[0].indexOf('.')!==-1){

                const selectKey = e[0];

                this.selectKeys = [selectKey];

                const keys = selectKey.split(".");
                let selectNode = {children:this.tree};
                let loopKey = [];
                keys.forEach(k=>{
                    loopKey.push(k);
                    selectNode = selectNode.children.find(c=>c.key===loopKey.join("."));
                })
                this.selectedNode = selectNode;
                this.$set(this.selectedNode,'isNew',!!this.selectedNode.isNew);
                this.selectedDataTypes = dataType[this.selectedNode.regType];
                this.selectedValue = undefined;

                this.$http.get(`/api/sys/constant/value/${e[0]}`).then(res=>{

                    if(res.data&&res.data.content){
                        res.data.content = JSON.parse(res.data.content);
                    }

                    this.selectedValue=res.data||{};
                });
            }else{
                this.selectKeys = [];
                this.selectedNode = undefined;
                this.selectedValue = undefined;
            }
        },
        saveSelected(){
            const value = Object.assign({},this.selectedValue);
            value.content = value.content && JSON.stringify(value.content);
            this.$http.postJSON(`/api/sys/constant/value`,value).then(()=>{
                this.selectedNode.title = value.title;
                if(this.selectedNode.isNew){
                    console.log(this.selectedNode)
                    this.selectedNode.isNew = false;
                    this.selectedNode.regKey = this.selectedValue.regKey;
                    this.selectedNode.key = this.selectedValue.regType+'.'+this.selectedValue.regKey;
                    this.parentNode.children.push(this.selectedNode);
                    this.selectKeys = [this.selectedNode.key];
                }
            });
        },
        remove(){

        },
        onContextMenuClick(treeKey,menuKey) {
            if(menuKey==="1"){

                this.selectedNode = undefined;
                this.selectKeys = [];

                this.$nextTick(()=>{
                    const keys = treeKey.split(".");
                    let selectNode = {children:this.tree};
                    let loopKey = [];
                    keys.forEach(k=>{
                        loopKey.push(k);
                        selectNode = selectNode.children.find(c=>c.key===loopKey.join("."));
                    })

                    this.parentNode = selectNode;

                    this.$set(this,'selectedNode',{
                        regType:selectNode.regType,
                        regKey:selectNode.regKey,
                        title: "新创建",
                        isNew:true,
                        selectable:true,
                    });

                    this.selectedDataTypes = dataType[this.selectedNode.regType];
                    this.selectedValue = {
                        regType: selectNode.regType,
                        regKey:(selectNode.regKey||'') + (selectNode.regKey?'.':'')
                    };
                })
            }
        }
    }
}
</script>

<style scoped>

</style>
