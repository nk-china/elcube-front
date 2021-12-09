<!--
	This file is part of ELCube.
	ELCube is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCube is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <a-spin :spinning="loading" >
        <div class="canvas" ref="js-canvas" style="height: 300px;"></div>
    </a-spin>
</template>

<script>
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import Modeling from "bpmn-js/lib/features/modeling";
import looksBetter from "../ref/looksBetter";

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
    watch:{
        taskDefinitionKey(value){
            if(this.viewer)
                looksBetter(this.viewer,value)
        }
    },
    created() {
        if(this.bpmn){
            this.bpmnXml = this.bpmn;
            this.$nextTick().then(this.render);
        }else if(this.processDefinitionId){
            this.$http.get("/api/def/bpm/process/definition/detail?definitionId="+this.processDefinitionId)
                .then(response=>{
                    this.bpmnXml = response.data.bpmnXml||response.data.xml;
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
                    if(this.taskDefinitionKey){
                        looksBetter(this.viewer,this.taskDefinitionKey)
                    }
                }).catch((e) => {console.log(e)});
            this.$refs['js-canvas'].getElementsByTagName("a")[0].style.transform='scale(0.6)';
        },
        zoom(flag) {
            console.log(this.taskDefinitionKey)
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