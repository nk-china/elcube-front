<template>
    <nk-page-layout title="决策设计器" :sub-title="bpmInfo.name" :spinning="loadingDeploy">
        <a-button-group slot="action">
            <a-button type="default" @click="doFullscreen"><a-icon type="fullscreen" />全屏</a-button>
            <a-button type="default" @click="createNew"> <a-icon type="plus" />新建</a-button>
            <a-upload
                name="file"
                accept=".dmn"
                :before-upload="upload"
                class="upload-list-inline"
            >
                <a-button :loading="loadingUpload"> <a-icon v-if="!loadingUpload" type="upload" />上传</a-button>
            </a-upload>
            <a-button type="default" @click="download"><a-icon type="download" />下载</a-button>
            <a-popconfirm
                placement="topRight"
                :title="deployConfirm.text"
                :visible="deployConfirm.visible"
                ok-text="Yes"
                cancel-text="No"
                @confirm="deploy"
                @cancel="()=>{deployConfirm.visible=false}"
                @visibleChange="handleVisibleChange"
            >
                <a-button :loading="loadingDeploy" type="primary"><a-icon v-if="!loadingDeploy" type="save" />部署</a-button>
            </a-popconfirm>
        </a-button-group>
        <div>
            <div class="canvas-layout" :class="fullscreen">
                <div class="canvas" ref="js-canvas"></div>
                <div class="panel"  ref="js-properties-panel"></div>
                <a-button class="exit" @click="doFullscreen"><a-icon type="fullscreen-exit" />退出全屏</a-button>
            </div>

            <nk-def-dmn-test-card :edit="true"
                                  ref="test"
                                  style="margin-top: 24px;position: initial;"
                                  :modeler="viewer"
                                  :xml="getBpmn"
                                  @decision-change="decisionChange"
                                  @run="dmnRun"
            ></nk-def-dmn-test-card>
        </div>
    </nk-page-layout>
</template>

<script>
//引入样式，否则显示不出内容
import 'dmn-js/dist/assets/diagram-js.css';
import 'dmn-js/dist/assets/dmn-js-drd.css';
import 'dmn-js/dist/assets/dmn-js-shared.css';
import 'dmn-js/dist/assets/dmn-js-decision-table.css';
import 'dmn-js/dist/assets/dmn-js-decision-table-controls.css';
import 'dmn-js/dist/assets/dmn-js-literal-expression.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn.css';
// import 'dmn-js/dist/assets/dmn-font/css/dmn-codes.css';
// import 'dmn-js/dist/assets/dmn-font/css/dmn-embedded.css';
import 'dmn-js-properties-panel/dist/assets/dmn-js-properties-panel.css';

import BpmnModeler                from 'dmn-js/lib/Modeler';
import propertiesPanelModule      from 'dmn-js-properties-panel/lib';
import drdAdapterModule           from 'dmn-js-properties-panel/lib/adapter/drd';
import propertiesProviderModule   from 'dmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor    from 'camunda-dmn-moddle/resources/camunda.json';

const initialDiagram =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" ' +
    '             xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" ' +
    '             xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" ' +
    '             xmlns:di="http://www.omg.org/spec/DMN/20180521/DI/" ' +
    '             id="UnnamedDMN" ' +
    '             name="未命名决策图" ' +
    '             namespace="http://camunda.org/schema/1.0/dmn">\n' +
    '  <inputData id="InputData_Unnamed" name="输入字段" />\n' +
    '  <decision id="Decision_Unnamed" name="决策表">\n' +
    '    <informationRequirement id="InformationRequirement_1">\n' +
    '      <requiredInput href="#InputData_Unnamed" />\n' +
    '    </informationRequirement>\n' +
    '    <decisionTable id="DecisionTable_1">\n' +
    '      <input id="InputClause_1">\n' +
    '        <inputExpression id="LiteralExpression_1" typeRef="string" />\n' +
    '      </input>\n' +
    '      <output id="OutputClause_1" typeRef="string" />\n' +
    '    </decisionTable>\n' +
    '  </decision>\n' +
    '  <dmndi:DMNDI>\n' +
    '    <dmndi:DMNDiagram id="DMNDiagram_1">\n' +
    '      <dmndi:DMNShape id="DMNShape_2" dmnElementRef="InputData_Unnamed">\n' +
    '        <dc:Bounds height="45" width="125" x="-82" y="58" />\n' +
    '      </dmndi:DMNShape>\n' +
    '      <dmndi:DMNEdge id="DMNEdge_1" dmnElementRef="InformationRequirement_1">\n' +
    '        <di:waypoint x="-19" y="58" />\n' +
    '        <di:waypoint x="-19" y="-50" />\n' +
    '        <di:waypoint x="-19" y="-70" />\n' +
    '      </dmndi:DMNEdge>\n' +
    '      <dmndi:DMNShape id="DMNShape_1" dmnElementRef="Decision_Unnamed">\n' +
    '        <dc:Bounds height="80" width="180" x="-109" y="-150" />\n' +
    '      </dmndi:DMNShape>\n' +
    '    </dmndi:DMNDiagram>\n' +
    '  </dmndi:DMNDI>\n' +
    '</definitions>\n';

import NkDefDmnTestCard from "./NkDefDmnTestCard";
import dmnFired from "./ref/dmnFired";

export default {
    components:{
        NkDefDmnTestCard
    },
    data() {
        return {
            loadingUpload :false,
            loadingDeploy :true,
            fullscreen:'',
            viewer: null,
            active: undefined,
            bpmInfo: {},
            bpmOriginalKey: undefined,

            deployConfirm:{
                visible: false,
                text:"确认部署吗?",
            },

            selectedShape:undefined,
            matchedRules:undefined
        }
    },
    created(){

    },
    mounted() {
        this.$nextTick().then(() => {
            this.viewer = new BpmnModeler({
                drd:{
                    propertiesPanel: {
                        parent: this.$refs['js-properties-panel']
                    },
                    additionalModules: [
                        propertiesPanelModule,
                        propertiesProviderModule,
                        drdAdapterModule
                    ],
                    keyboard: {
                        bindTo: window
                    },
                    moddleExtensions: {
                        camunda : camundaModdleDescriptor
                    },
                },
                container: this.$refs['js-canvas'],
                moddleExtensions: {
                    camunda : camundaModdleDescriptor
                },
            });
            this.init()
        })
    },
    methods: {
        doFullscreen(){
            this.fullscreen = this.fullscreen?'':'fullscreen';
            this.$nextTick(()=>{
                // 视图切换会导致图形看不到，所以注释掉
                // this.viewer._viewers.drd.get('zoomScroll').reset();
                // this.viewer._viewers.drd.get('canvas').zoom('fit-viewport',{});
            })
        },
        init(){
            if(this.$route.query.from){
                const url = `/api/def/dmn/definition/detail?definitionId=${this.$route.query.from}`;
                this.$http.get(url)
                    .then(response=>{
                        this.bpmInfo = response.data;
                        this.bpmInfo.fromId = this.bpmInfo.id;
                        this.bpmInfo.id = undefined;
                        this.bpmOriginalKey = response.data.key;
                        this.open(this.bpmInfo.xml);
                    }).finally(()=>{
                    this.loadingDeploy=false;
                });
            }else{
                this.createNew();
            }
        },
        upload(file) {
            new Promise((resolve)=>{
                let reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result)
                };
                reader.readAsText(file)
                reader = null;
            }).then(xml=>{
                this.open(xml);
            });
            return false;
        },
        createNew() {
            if(this.$route.query.from){
                this.$router.push("")
            }else{
                this.open(initialDiagram);
            }
        },
        open(xml) {
            this.selectedShape=undefined;
            this.viewer.importXML(xml)
                .then(() => {
                    this.viewer._container.getElementsByTagName("a")[0].style.transform='scale(0.6)';
                    const canvas = this.viewer._viewers.drd.get("canvas");
                    canvas.zoom('fit-viewport',{});
                    canvas.zoom(canvas.zoom()*0.7);
                    this.$refs.test.decisionChange(undefined);

                    this.viewer._viewsChanged = ()=>{
                        dmnFired(this.viewer,this.matchedRules)
                    }

                    const eventBus = this.viewer._viewers.drd.get('eventBus');
                    eventBus.on('selection.changed', (e) => {
                        if(e.newSelection.length===1 && e.newSelection[0].type==='dmn:Decision') {
                            this.selectedShape=e.newSelection[0].id;
                        }
                        if(this.selectedShape)
                            this.$refs.test.decisionChange(this.selectedShape);
                    });

                }).catch(err => {
                    console.error(err);
                }).finally(()=>{
                    this.loadingDeploy=false;
                });
        },
        getBpmn(){
            return new Promise((resolve, reject) => {
                this.viewer.saveXML({ format: true })
                    .then(({xml}) => {

                        let doc=new DOMParser().parseFromString(xml,"text/xml");
                        let process = doc.getElementsByTagName("definitions")[0];

                        this.bpmInfo = Object.assign(this.bpmInfo,{
                            key:            process.getAttribute("id"),
                            name:           process.getAttribute("name"),
                            resourceName:   `${process.getAttribute("id")}.dmn`,
                            xml:            xml
                        });

                        if(!this.bpmInfo.name){
                            this.$message.error("工作流名称不能为空");
                            return;
                        }
                        resolve(this.bpmInfo);
                    }).catch(reject)
            })
        },
        download() {
            this.getBpmn()
                .then(({xml,resourceName})=>{
                    let a = document.createElement('a');
                    a.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodeURIComponent(xml);
                    a.download = resourceName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    a = null;
                }).catch(err=>{
                console.error(err)
            })
        },
        handleVisibleChange(visible){
            if (!visible) {
                this.deployConfirm.visible = visible;
                return;
            }
            (async function func(that) {
                that.getBpmn()
                    .then(bpmn=>{
                        that.deployConfirm.visible = true;
                        that.deployConfirm.text =
                            (that.bpmOriginalKey === undefined || bpmn.key===that.bpmOriginalKey) ?
                                "确定部署当前流程吗？" : "Key 已更改,继续部署可能会创建新流程，是否继续？";
                    })
                    .catch(()=>{
                        that.deployConfirm.visible = false;
                    })
            })(this);
        },
        deploy(){
            this.loading=true;
            this.getBpmn()
                .then(bpmn=>{
                    this.loadingDeploy = true;
                    this.$http.postJSON("/api/def/dmn/deploy",bpmn)
                        .then(()=>{
                            this.$message.success("部署成功");
                        })
                        .catch(()=>{})
                        .finally(()=>{
                            this.loading=false;
                            this.loadingDeploy = false;
                        });
                });
        },
        dmnRun({outputMatchedRules}){
            this.matchedRules = outputMatchedRules;
            dmnFired(this.viewer,this.matchedRules)
        },
        decisionChange(){
            //this.viewer._switchView(this.viewer._views.find(v=>v.id===e))
        },
        $nkHide(){
            this.getBpmn().then(()=>{
                this.active = this.viewer.getActiveView();
                this.viewer._switchView(undefined);
            });
        },
        $nkShow(){
            this.viewer._switchView(this.active);
        }
    },
    destroyed() {
        this.viewer&&this.viewer.destroy&&this.viewer.destroy();
    }
}
</script>

<style scoped lang="less">
::v-deep.upload-list-inline{
    display: inline-block;

    .ant-upload-list-item {
        display: none;
    }
}
.canvas-layout{
    display: flex;
    height: calc(100vh - 380px);
    border: solid 1px #ccc;
    background-color: #ffffff;

    position: relative;
    z-index: 1;

    .exit{
        display: none;
    }

    &.fullscreen{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 999999;
        height: 100vh;

        .exit{
            display: block;
            position: absolute;
            top: 10px;
            right: 350px;
        }
    }
}
.canvas-layout .canvas{
    width: 100%;
    height: 100%;
    border-right: solid 1px #ccc;

    ::v-deep.dmn-decision-table-container{
        overflow: inherit;
    }

    ::v-deep.fired td{
        background-color: #4d90ff !important;
    }
}
.canvas-layout .panel{
    flex-shrink: 0;
    max-width: 30%;
    height: 100%;
    overflow: auto;
}
.bounce-enter-active {
    animation: bounce-in .5s;
}
.bounce-leave-active {
    animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.5);
    }
    100% {
        transform: scale(1);
    }
}
</style>
