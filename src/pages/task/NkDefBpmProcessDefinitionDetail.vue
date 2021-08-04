<template>
    <nk-page-layout class="mini" title="流程定义" :loading="loading">
        <nk-form ref="form" size="small" :col="1" slot="content">
            <nk-form-item term="Key">{{processDefinition.key}}</nk-form-item>
            <nk-form-item term="Name">{{processDefinition.name}}</nk-form-item>
            <nk-form-item term="Version">{{processDefinition.version}}</nk-form-item>
        </nk-form>


        <a-button-group slot="action">
            <a-button type="primary" @click="create">编辑</a-button>
        </a-button-group>

        <a-card title="流程图">
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
import Modeling   from 'bpmn-js/lib/features/modeling';
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
                    this.$emit("setTab",'流程定义:'+this.processDefinition.name);
                    this.$nextTick().then(this.render);
                });
        },
        render(){
            this.viewer = new BpmnViewer({
                container: this.$refs['js-canvas'],
                keyboard: {bindTo: window},
                additionalModules: [Modeling],
            });
            this.viewer.importXML(this.processDefinition.bpmnXml)
                .then(() => {
                    this.viewer.get('canvas').zoom('fit-viewport',{});
                    this.loadingCanvas = false;
                }).catch(() => {});
            this.$refs['js-canvas'].getElementsByTagName("a")[0].style.transform='scale(0.6)';
        },
        zoom(flag) {
            this.viewer.get('zoomScroll').stepZoom(flag)
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
