<template>
    <a-spin :spinning="loading" >
        <div class="canvas" ref="js-canvas" style="height: 300px;"></div>
    </a-spin>
</template>

<script>
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import Modeling from "bpmn-js/lib/features/modeling";

export default {
    props:{
        processDefinitionId:String,
        bpmn:String
    },
    data(){
       return {
           loading: true,
           viewer: undefined,
           bpmnXml : undefined
       }
    },
    created() {
        if(this.bpmn){
            this.bpmnXml = this.bpmn;
            this.$nextTick().then(this.render);
        }else if(this.processDefinitionId){
            this.$http.get("/api/def/bpm/process/definition/detail?definitionId="+this.processDefinitionId)
                .then(response=>{
                    this.bpmnXml = response.data.bpmnXml;
                    this.$nextTick().then(this.render);
                });
        }
    },
    methods:{
        render(){
            this.viewer = new BpmnViewer({
                container: this.$refs['js-canvas'],
                keyboard: {bindTo: window},
                additionalModules: [Modeling],
            });
            this.viewer.importXML(this.bpmnXml)
                .then(() => {
                    this.viewer.get('canvas').zoom('fit-viewport',{});
                    this.loading = false;
                }).catch(() => {});
            this.$refs['js-canvas'].getElementsByTagName("a")[0].style.transform='scale(0.6)';
        },
        zoom(flag) {
            this.viewer.get('zoomScroll').stepZoom(flag)
        },
    },
    destroyed() {
        this.viewer&&this.viewer.destroy&&this.viewer.destroy();
    }
}
</script>

<style scoped>

</style>