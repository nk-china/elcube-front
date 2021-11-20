<template>
    <nk-page-layout class="mini"
                      :title="processInstance.processDefinitionName"
                      ref="nav"
                      sub-title="Process Instance Detail"
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
            <a-button   type="primary" :disabled="processInstance.state!=='ACTIVE'" @click="killConfirm">
                <a-icon type="close-square" /> KILL
            </a-button>
        </a-button-group>

        <nk-card title="Variables" class="variables">
            <nk-empty :data="variables" />
            <nk-form :col="1">
                <nk-form-item v-for="item in variables" :key="item.key" :title="item.key">
                    {{item.value}}
                </nk-form-item>
            </nk-form>
        </nk-card>

        <nk-card title="Tasks">
            <vxe-table
                row-key
                show-overflow="tooltip"
                auto-resize
                size="mini"
                border=inner
                resizable
                highlight-hover-row
                highlight-current-row
                header-cell-class-name="headerCellClassName"
                @current-change="currentTaskChange"
                :data="processInstance.bpmTask">
                <vxe-table-column title="Name" field="name" width="15%"></vxe-table-column>
                <vxe-table-column title="Assignee" field="assignee" width="15%"></vxe-table-column>
                <vxe-table-column title="Candidate" field="candidate" width="20%"></vxe-table-column>
                <vxe-table-column title="StartTime" field="startTime" width="15%" :formatter="['nkDatetimeISO']"></vxe-table-column>
                <vxe-table-column title="EndTime" field="endTime" width="15%" :formatter="['nkDatetimeISO']"></vxe-table-column>
                <vxe-table-column title="Action | Comment" show-overflow="false">
                    <template v-slot="{row}">
                        <template v-if="row.deleteReason && row.deleteReason!=='completed'">
                            'TERMINATED | ' {{row.deleteReason}}
                        </template>
                        <template v-for="(comment) in row.comments">{{comment}}</template>
                        <a-button-group size="small">
                            <a-button v-for="transition in row.transitions"
                                      :key="transition.id"
                                      @click="completeConfirm(row,transition)">
                                {{ transition.name }}
                            </a-button>
                        </a-button-group>
                        <a-button v-if="!row.endTime" size="small" type="default" style="margin-left: 5px;" disabled>
                            Assign
                        </a-button>
                    </template>
                </vxe-table-column>
            </vxe-table>
        </nk-card>

        <nk-card title="BPMN" v-if="processInstance.processDefinitionId">
            <div slot="extra">
                <a-button-group size="small">
                    <a-button @click="$refs.bpmn.zoom( 1)">+</a-button>
                    <a-button @click="$refs.bpmn.zoom(-1)">-</a-button>
                </a-button-group>
            </div>
            <nk-bpmn-view ref="bpmn"
                          :process-definition-id="processInstance.processDefinitionId"
                          :task-definition-key="currentTask && currentTask.taskDefinitionKey"
            />
        </nk-card>

        <a-modal v-model="completeVisible" :title="completeTask.title" ok-text="Ok" cancel-text="Cancel" @ok="completeTaskOk">
            <a-textarea v-model="completeTask.comment" placeholder="Comment"></a-textarea>
        </a-modal>

    </nk-page-layout>
</template>

<script>
import NkBpmnView from "./NkBpmnView";

export default {
    components:{
        NkBpmnView
    },
    data(){
        return {
            spinning:false,
            loading: true,
            loadingCanvas:true,

            completeVisible:false,
            completeTask: {},

            currentTask: undefined,

            processDefinition: {},
            processInstance:{
                bpmTask:[],
                bpmVariables:{}
            }
        }
    },
    computed:{
        variables(){
            let map = Object.assign({},this.processInstance.bpmVariables,this.currentTask && this.currentTask.bpmVariables);
            let array = [];
            for(let key in map){
                if(map.hasOwnProperty(key))
                    array.push({key,value:map[key]});
            }
            return array.sort((a,b)=>a.key>b.key?1:-1)
        }
    },
    created() {
        this.init(true);
    },
    methods:{
        init(){
            this.$http.get("/api/ops/bpm/instance/detail?instanceId="+this.$route.params.id)
                .then(response=>{
                    this.processInstance = response.data;
                    this.currentTask = undefined;
                    this.$emit('setTab','流程实例:'+this.processInstance.processDefinitionName);
                    this.loading = false;
                }).catch(res=>{
                    if(res.response.status===403){
                        this.$emit("close")
                    }
                });
        },
        killConfirm(){
            this.completeTask = {
                kill:true,
                title:'Kill Instance',
            };
            this.completeVisible = true;
        },
        currentTaskChange({row}){
            this.currentTask = row;
        },
        completeConfirm(task,transition){
            this.completeTask = {
                taskId:task.id,
                title:'Complete Task',
                transition
            };
            this.completeVisible = true;
        },
        completeTaskOk(){
            if(this.completeTask.comment && this.completeTask.comment.replace(/\s/g,'')){
                this.loading = true
                this.completeVisible = false;
                if(this.completeTask.kill){
                    this.$http.post(
                            `/api/ops/bpm/instance/kill`,
                            `instanceId=${this.processInstance.id}&deleteReason=${this.completeTask.comment}`)
                        .then(this.init)
                        .finally(()=>this.loading=false);
                }else{
                    this.$http.postJSON(`/api/ops/bpm/instance/complete`,this.completeTask)
                        .then(this.init)
                        .finally(()=>this.loading=false);
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
::v-deep{
    .nk-form-item{
        .term{
            min-width: 160px;
        }
    }
    .variables{
        .nk-form-item{
            .term{
                min-width: 300px;
            }
        }
    }
}
</style>
