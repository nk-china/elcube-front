<template>
    <a-spin :spinning="loading" >
        <div class="canvas" ref="js-canvas" style="height: 400px;max-height: 800px;"></div>
    </a-spin>
</template>

<script>

import BpmnViewer from "dmn-js/lib/NavigatedViewer";

export default {
    props:{
        bpmn:String,
        processDefinitionId:String,
        taskDefinitionKey:String
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
                //additionalModules: [Modeling],
            });
            this.viewer.importXML(this.bpmnXml)
                .then(() => {
                    this.viewer._viewers.drd.get("canvas").zoom('fit-viewport',{});
                    this.loading = false;
                    this.viewer._container.getElementsByTagName("a")[0].style.transform='scale(0.6)';
                    this.$emit("init", this.viewer);

                    // window.a = this.viewer;
                    // console.log(this.viewer)
                    //
                    // const eventBus = this.viewer._viewers.drd.get('eventBus');
                    // const events = [
                    //     'selection.changed'
                    // ];
                    // events.forEach(event => {
                    //     eventBus.on(event, (e) => {
                    //
                    //         if(e.newSelection.length===1){
                    //             const selectedId = e.newSelection[0].id;
                    //             const selectedElement = this.viewer._definitions.drgElement.find((e)=>e.id === selectedId);
                    //
                    //             console.log(selectedElement)
                    //             console.log(selectedElement.decisionLogic.$type)
                    //             console.log(selectedElement.decisionLogic.input)
                    //             console.log(selectedElement.decisionLogic.output)
                    //             console.log(selectedElement.decisionLogic.rule)
                    //         }
                    //
                    //     })
                    // })
                }).catch((e) => {console.log(e)});
        },
        zoom(flag) {
            this.viewer._viewers.drd.get('zoomScroll').stepZoom(flag)
        },
    },
    destroyed() {
        this.viewer&&this.viewer.destroy&&this.viewer.destroy();
    }
}
</script>

<style scoped>

</style>