<template>
    <nk-page-layout class="mini" title="流程定义" :loading="loading">
        <nk-form ref="form" size="small" :col="1" slot="content">
            <nk-form-item term="Key">{{processDefinition.key}}</nk-form-item>
            <nk-form-item term="Name">{{processDefinition.name}}</nk-form-item>
            <nk-form-item term="Version">{{processDefinition.version}}</nk-form-item>
        </nk-form>


        <a-button-group slot="action">
            <a-button type="primary" @click="create">从当前版本创建</a-button>
        </a-button-group>

        <a-card title="流程图">
            <!-- <img :src="diagram">-->
            <div slot="extra">
                <a-button-group size="small">
                    <a-button @click="zoom( 1)">+</a-button>
                    <a-button @click="zoom(-1)">-</a-button>
                </a-button-group>
            </div>
            <a-spin :spinning="loadingCanvas">
                <div class="canvas" ref="js-canvas" style="height: 400px;"></div>
            </a-spin>
        </a-card>
    </nk-page-layout>
</template>

<script>
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import Modeling from 'bpmn-js/lib/features/modeling';
export default {
    name: "NkDefBpmnProcessDefinitionDetail",
    data(){
        return {
            loading: true,
            loadingCanvas: true,
            processDefinition: {},
            diagram: undefined,
            viewer: undefined,
        }
    },
    created() {
        this.loadData();
    },
    mounted(){
    },
    methods:{
        loadData(){
            this.$http.get("/api/def/bpm/process/definition/detail?definitionId="+this.$route.params.id)
                .then(response=>{
                    this.loading = false;
                    this.processDefinition = response.data;
                    this.loadDiagram();
                    this.$emit("setTab",this.processDefinition.name);
                    this.$nextTick().then(() => {
                        this.viewer = new BpmnViewer({
                            container: this.$refs['js-canvas'],
                            keyboard: {
                                bindTo: window
                            },
                            additionalModules: [
                                Modeling,
                            ],
                        });
                        this.$refs['js-canvas'].getElementsByTagName("a")[0].style.transform='scale(0.6)';
                        const url = `/api/def/bpm/process/definition/bpmn?definitionId=${this.processDefinition.id}`;
                        this.$http.get(url)
                            .then(response=>{
                                this.viewer.importXML(response.data.bpmnXml)
                                    .then(() => {
                                        this.viewer.get('canvas').zoom('fit-viewport',{});
                                        this.loadingCanvas = false;

                                        const modeling = this.viewer.get('modeling');
                                        const elementRegistry = this.viewer.get('elementRegistry');
                                        elementRegistry
                                            .filter(element=>{
                                                return element.id < '_23' //element.type === 'bpmn:UserTask' || element.type === 'bpmn:ServiceTask'
                                            }).forEach(element=>{
                                            modeling.setColor(element, {
                                                stroke: '#000',
                                                fill: '#fff'
                                            });
                                        });
                                        elementRegistry
                                            .filter(element=>{
                                                return element.type === 'bpmn:SequenceFlow'
                                            }).forEach(element=>{
                                            modeling.setColor(element, {
                                                stroke: '#000',
                                                fill: '#fff'
                                            });
                                        });
                                    }).catch((e) => {
                                    console.log(e)
                                });
                            });
                    })
                });
        },
        zoom(flag) {
            this.viewer.get('zoomScroll').stepZoom(flag)
        },
        loadDiagram(){
            const diagramUrl = `/api/def/bpm/process/definition/resource?deplymentId=${this.processDefinition.deploymentId}&resourceName=${this.processDefinition.diagramResourceName}`;
            this.$http.get(diagramUrl)
                .then(response=>{
                    this.diagram=`data:image/png;base64,${response.data}`;
                });
        },
        create(){
            this.$router.push({
                path:"/apps/def/bpm/process/definitions/designer",
                query:{
                    from:this.processDefinition.id
                }
            })
        }
    },
    destroyed() {
        this.viewer&&this.viewer.destroy&&this.viewer.destroy();
    }
}
</script>

<style scoped>

</style>
