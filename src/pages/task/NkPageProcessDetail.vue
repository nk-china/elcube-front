<template>
    <x-nk-page-layout class="mini"
                      :title="'流程详情'"
                      ref="nav"
                      sub-title="流程实例"
                      :spinning="loading"
                      :showPageNav="false"
                      :showPageBar="false"
                      :right-bar="false"
                      :header-indent="false"
    >
        <a-row slot="content">
            <a-col :span="18">
                <div style="min-height: 100px;">
                    <nk-form :col="1">
                        <nk-form-item title="id">               {{processInstance.id}}</nk-form-item>
                        <nk-form-item title="definitionKey">    {{processInstance.processDefinitionKey}}</nk-form-item>
                        <nk-form-item title="definitionName">   {{processInstance.processDefinitionName}}</nk-form-item>
                        <nk-form-item title="definitionVersion">{{processInstance.processDefinitionVersion}}</nk-form-item>
                        <nk-form-item title="startTime">        {{processInstance.startTime | nkDatetimeISO}}</nk-form-item>
                    </nk-form>
                </div>
            </a-col>
            <a-col :span="6">
                <a-statistic title="State" :value="processInstance.state"/>
            </a-col>
        </a-row>

        <a-button-group slot="extra">
            <a-popconfirm
                title="Are you sure KILL this process instance ?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="kill"
                :disabled="processInstance.state!=='ACTIVE'"
            >
                <a-button   type="primary" :disabled="processInstance.state!=='ACTIVE'">
                    <a-icon type="close-square" /> KILL
                </a-button>
            </a-popconfirm>
        </a-button-group>

        <nk-card title="Tasks">
            <vxe-table
                row-key
                auto-resize
                size="mini"
                border=inner
                resizable
                highlight-hover-row
                header-cell-class-name="headerCellClassName"
                :data="processInstance.bpmTask">
                <vxe-table-column title="Name" field="name"></vxe-table-column>
                <vxe-table-column title="Assignee" field="assignee"></vxe-table-column>
                <vxe-table-column title="StartTime" field="startTime" :formatter="['nkDatetimeISO']"></vxe-table-column>
                <vxe-table-column title="EndTime" field="endTime" :formatter="['nkDatetimeISO']"></vxe-table-column>
            </vxe-table>
        </nk-card>

        <nk-card title="Variables">
            <nk-empty :data="variables" />
            <nk-form :col="1">
                <nk-form-item v-for="item in variables" :key="item.key" :title="item.key">
                    {{item.value}}
                </nk-form-item>
            </nk-form>
        </nk-card>

        <nk-card title="BPMN">
            <div slot="extra">
                <a-button-group size="small">
                    <a-button @click="zoom( 1)">+</a-button>
                    <a-button @click="zoom(-1)">-</a-button>
                </a-button-group>
            </div>
            <a-spin :spinning="loadingCanvas">
                <div class="canvas" ref="js-canvas" style="height: 300px;"></div>
            </a-spin>
        </nk-card>


    </x-nk-page-layout>
</template>

<script>
import XNkPageLayout from "../../layout/template/XNkPageLayout";
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import Modeling from "bpmn-js/lib/features/modeling";

export default {
    components:{
        XNkPageLayout
    },
    data(){
        return {
            spinning:false,
            loading: true,
            loadingCanvas:true,

            processDefinition: {},
            processInstance:{
                bpmTask:[],
                bpmVariables:{}
            }
        }
    },
    computed:{
        variables(){
            let array = [];
            if(this.processInstance.bpmVariables){
                for(let key in this.processInstance.bpmVariables){
                    array[0]={key,value:this.processInstance.bpmVariables[key]}
                }
            }
            return array;
        }
    },
    created() {
        this.init();
    },
    methods:{
        init(){
            this.$http.get("/api/ops/bpm/instance/detail?instanceId="+this.$route.params.id)
                .then(response=>{
                    this.processInstance = response.data;
                    this.$emit('setTab',this.processInstance.processDefinitionName);
                    this.loading = false

                    this.loadBpmn();
                }).catch(res=>{
                    if(res.response.status===403){
                        this.$emit("close")
                    }
                });
        },
        loadBpmn(){
            this.$http.get("/api/def/bpm/process/definition/detail?definitionId="+this.processInstance.processDefinitionId)
                .then(response=>{
                    this.loading = false;
                    this.processDefinition = response.data;
                    this.$emit("setTab",this.processDefinition.name);
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
        kill(){
            this.loading = true
            this.$http.post(`/api/ops/bpm/instance/kill?instanceId=${this.processInstance.id}`)
                .then(this.init);
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep.nk-form-item{
    .term{
        min-width: 160px;
    }
}
</style>
