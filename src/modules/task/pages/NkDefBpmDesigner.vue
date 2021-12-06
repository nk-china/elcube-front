<!--
	This file is part of ELCard.
	ELCard is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCard is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <nk-page-layout title="工作流设计器" :sub-title="bpmInfo.name" :spinning="loadingDeploy">
        <a-button-group slot="action">
            <a-button type="default" @click="doFullscreen"><a-icon type="fullscreen" />全屏</a-button>
            <a-button type="default" @click="createNew"> <a-icon type="plus" />新建</a-button>
            <a-upload
                name="file"
                accept=".bpmn"
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
        <transition  name="bounce">
            <div class="canvas-layout" :class="fullscreen">
                <div class="canvas" ref="js-canvas"></div>
                <div class="panel"  ref="js-properties-panel"></div>
                <a-button class="exit" @click="doFullscreen"><a-icon type="fullscreen-exit" />退出全屏</a-button>
            </div>
        </transition>
    </nk-page-layout>
</template>

<script>
//引入样式，否则显示不出内容
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

import BpmnModeler                from 'bpmn-js/lib/Modeler';
import propertiesPanelModule      from 'bpmn-js-properties-panel/lib';
import propertiesProviderModule   from 'bpmn-js-properties-panel/lib/provider/camunda';
import customTranslate            from '../ref/customTranslate';
import extensionModdle            from 'camunda-bpmn-moddle/resources/camunda.json';
import NkUtil                     from "@/utils/NkUtil";

const initialDiagram =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
    'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
    'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
    'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
    'targetNamespace="http://bpmn.io/schema/bpmn" ' +
    'id="Definitions_1">' +
    '<bpmn:process id="NewProcess" isExecutable="true">' +
    '<bpmn:startEvent id="StartEvent_1"/>' +
    '</bpmn:process>' +
    '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
    '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
    '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
    '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' +
    '</bpmndi:BPMNShape>' +
    '</bpmndi:BPMNPlane>' +
    '</bpmndi:BPMNDiagram>' +
    '</bpmn:definitions>';

export default {
    data() {
        return {
            loadingUpload :false,
            loadingDeploy :true,
            fullscreen:'',
            viewer: null,
            canvas: null,
            bpmInfo: {},
            bpmOriginalKey: undefined,

            deployConfirm:{
                visible: false,
                text:"确认部署吗?",
            }
        }
    },
    created(){

    },
    mounted() {
        this.$nextTick().then(() => {
            this.canvas = this.$refs['js-canvas'];
            this.viewer = new BpmnModeler({
                container: this.canvas,
                keyboard: {
                    bindTo: window
                },
                propertiesPanel: {
                    parent: this.$refs['js-properties-panel']
                },
                additionalModules: [
                    propertiesPanelModule,
                    propertiesProviderModule,
                    {translate: [ 'value', customTranslate ]}
                ],
                moddleExtensions: {
                    camunda: extensionModdle
                },
            });
            this.canvas.getElementsByTagName("a")[0].style.transform='scale(0.6)';
            this.init()
        })
    },
    methods: {
        doFullscreen(){
            this.fullscreen = this.fullscreen?'':'fullscreen';
            this.$nextTick(()=>{
                this.viewer.get('zoomScroll').reset();
                this.viewer.get('canvas').zoom('fit-viewport',{});
            })
        },
        init(){
            if(this.$route.query.from){
                const url = `/api/def/bpm/process/definition/detail?definitionId=${this.$route.query.from}`;
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
            this.open(initialDiagram);
        },
        open(xml) {
            this.viewer.importXML(xml)
                .then(() => {
                    this.viewer.get('canvas').zoom('fit-viewport',{});
                    const eventBus = this.viewer.get('eventBus');
                    const events = [
                        'element.click',
                        'element.dblclick'
                    ];
                    events.forEach(event => {
                        eventBus.on(event, () => {
                            //console.log(e);
                        })
                    })
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
                        let process = doc.getElementsByTagName("bpmn:process")[0]||doc.getElementsByTagName("process")[0];

                        this.bpmInfo = Object.assign(this.bpmInfo,{
                            key:            process.getAttribute("id"),
                            name:           process.getAttribute("name"),
                            resourceName:   `${process.getAttribute("id")}.bpmn`,
                            xml:            xml,
                            isExecutable:   NkUtil.parseJSON(process.getAttribute("isExecutable"))
                        });

                        if(!this.bpmInfo.name){
                            this.$message.error("工作流名称不能为空");
                            return;
                        }
                        if(!this.bpmInfo.isExecutable){
                            this.$message.error("请勾选Executable");
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
                    this.$http.postJSON("/api/def/bpm/deploy",bpmn)
                        .then(response=>{
                            console.log(response)
                            this.$message.success("部署成功");
                        })
                        .catch(()=>{})
                        .finally(()=>{
                            this.loading=false;
                            this.loadingDeploy = false;
                        });
                });
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
}
.canvas-layout .panel{
    flex-shrink: 0;
    width: 338px;
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
