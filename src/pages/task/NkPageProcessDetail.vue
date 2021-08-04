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
            <nk-form :col="1">
                <nk-form-item v-for="item in variables" :key="item.key" :title="item.key">
                    {{item.value}}
                </nk-form-item>
            </nk-form>
        </nk-card>


    </x-nk-page-layout>
</template>

<script>
import XNkPageLayout from "../../layout/template/XNkPageLayout";

export default {
    components:{
        XNkPageLayout
    },
    data(){
        return {
            spinning:false,
            loading: true,

            processInstance:{
                bpmProcessDefinition:{},
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
                }).catch(res=>{
                if(res.response.status===403){
                    this.$emit("close")
                }
            });
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
