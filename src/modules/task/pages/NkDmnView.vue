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
    <a-spin :spinning="loading" >
        <div class="canvas" ref="js-canvas" style="height: 400px;max-height: 800px;"></div>
    </a-spin>
</template>

<script>

import BpmnViewer from "dmn-js/lib/NavigatedViewer";
import dmnFired from "../ref/dmnFired";

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
            bpmnXml : undefined,
            matchedRules: undefined,
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

                    this.viewer._viewsChanged = ()=>{
                        dmnFired(this.viewer,this.matchedRules)
                    }

                }).catch((e) => {console.log(e)});
        },
        zoom(flag) {
            this.viewer._viewers.drd.get('zoomScroll').stepZoom(flag)
        },
        fired(matchedRules){
            this.matchedRules = matchedRules;
            dmnFired(this.viewer,this.matchedRules)
        },
        changeView(e){
            this.viewer._switchView(this.viewer._views.find(v=>v.id===e))
        }
    },
    destroyed() {
        this.viewer&&this.viewer.destroy&&this.viewer.destroy();
    }
}
</script>

<style scoped lang="less">
.canvas{
    ::v-deep.fired td{
        background-color: #4d90ff !important;
    }
}
</style>