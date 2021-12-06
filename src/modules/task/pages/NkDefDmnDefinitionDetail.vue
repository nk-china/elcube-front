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
    <nk-page-layout class="mini" title="决策定义" :loading="loading">
        <nk-form ref="form" size="small" :col="1" slot="content">
            <nk-form-item term="Key">{{definition.key}}</nk-form-item>
            <nk-form-item term="Name">{{definition.name}}</nk-form-item>
            <nk-form-item term="Version">{{definition.version}}</nk-form-item>
        </nk-form>


        <a-button-group slot="action">
          <a-button type="primary" @click="create">编辑</a-button>
        </a-button-group>

        <nk-card title="决策图" v-if="definition.xml">
            <div slot="extra">
                <a-button-group size="small">
                    <a-button @click="$refs.bpmn.zoom( 1)">+</a-button>
                    <a-button @click="$refs.bpmn.zoom(-1)">-</a-button>
                </a-button-group>
            </div>
            <nk-bpmn-view ref="bpmn" :bpmn="definition.xml" v-if="bpmnVisible" @init="viewInit" />
        </nk-card>

        <nk-def-dmn-test-card v-if="definition.key" ref="test" :modeler="modeler" :xml="getXml"
                              @decision-change="decisionChange"
                              @run="dmnRun"/>
    </nk-page-layout>
</template>

<script>
import NkBpmnView from "./NkDmnView";
import NkDefDmnTestCard from "./NkDefDmnTestCard";

export default {
    components:{
        NkBpmnView,
        NkDefDmnTestCard
    },
    data(){
        return {
            bpmnVisible:true,
            loading: true,
            loadingCanvas: true,
            definition: {},

            modeler:undefined,

        }
    },
    created() {
        this.loadData();
    },
    mounted(){
    },
    methods:{
        loadData(){
            this.$http.get("/api/def/dmn/definition/detail?definitionId="+this.$route.params.id)
                .then(response=>{
                    this.loading = false;
                    this.definition = response.data;
                    this.$emit("setTab",'决策定义:'+this.definition.name);
                });
        },
        create(){
            this.$router.push({
                path:"/apps/def/dmn/definitions/designer",
                query:{
                    from:this.definition.id
                }
            })
        },
        $nkHide(){
            this.bpmnVisible = false;
        },
        $nkShow(){
          this.bpmnVisible = true;
        },
        viewInit(modeler){
            this.modeler = modeler;
            this.$nextTick(()=>{
                this.$refs.test.decisionChange(this.definition.key);
            })
        },
        getXml(){
            return Promise.resolve({xml: this.definition.xml})
        },
        dmnRun({outputMatchedRules}){
            this.$refs.bpmn.fired(outputMatchedRules);
        },
        decisionChange(e){
            this.$refs.bpmn.changeView(e)
        }
    },
    destroyed() {
        this.viewer&&this.viewer.destroy&&this.viewer.destroy();
    }
}
</script>

<style scoped>

</style>
