<!--
	This file is part of EAsis.
	EAsis is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	EAsis is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with EAsis.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <nk-card title="审批意见">
        <nk-bpmn-view ref="bpmn"
                      v-if="bpmnVisible"
                      :process-definition-id="task.processDefinitionId"
                      :task-definition-key="task.taskDefinitionKey"
                      style="margin-bottom: 10px;" />
        <a-input type="textarea" v-model="completeTask.comment" :auto-size="{ minRows: 4, maxRows: 6 }" placeholder="请输入审批意见"></a-input>
        <div slot="actions" style="padding: 0 20px 0;text-align: right">
            <a-button-group v-if="task">
                <a-button v-for="transition in task.transitions"
                          :key="transition.id"
                          type="primary"
                          :disabled="buttonDisabled"
                          @click="completeTaskOk(transition)">
                    {{ transition.name }}
                </a-button>
                <a-tooltip title="敬请期待"><a-button type="default">转办</a-button></a-tooltip>
            </a-button-group>
        </div>
        <a-button v-if="hasAuthority(['DEF:*','OPS:*'])"
                  slot="extra"
                  type="link"
                  size="small"
                  @click="$router.push(`/apps/devops/process/instances/detail/${task.processInstanceId}`)">流程实例</a-button>
        <a-button  v-if="!bpmnVisible"
                   slot="extra"
                   type="link"
                   size="small"
                   @click="bpmnVisible=true">查看流程图</a-button>
        <a-button-group size="small" slot="extra"  v-if="bpmnVisible">
            <a-button @click="$refs.bpmn.zoom( 1)"><a-icon type="zoom-in" /></a-button>
            <a-button @click="$refs.bpmn.zoom(-1)"><a-icon type="zoom-out" /></a-button>
            <a-button size="small" @click="bpmnVisible=false"><a-icon type="close-circle" /></a-button>
        </a-button-group>
    </nk-card>
</template>

<script>
import NkBpmnView from "./NkBpmnView";
import {mapGetters} from "vuex";

export default {
    components: {NkBpmnView},
    props:{
        task:Object,
        doc:Object,
        editMode:Boolean,
        value:Boolean
    },
    data(){
        return {
            bpmnVisible: false,
            completeTask: {}
        }
    },
    computed:{
      ...mapGetters('User',[
        'hasAuthority'
      ]),
        buttonDisabled(){
            return this.editMode || !(this.completeTask.comment && this.completeTask.comment.replace(/\s/g,''));
        }
    },
    methods:{
        completeTaskOk(transition){
            this.$emit("input",true);
            this.completeTask = Object.assign(this.completeTask,{taskId:this.task.id,transition});
            this.$http.postJSON(`/api/ops/bpm/instance/complete`,this.completeTask)
                .then(()=>{
                    this.$emit("complete",true);
                    this.completeTask = {};
                    this.bpmnVisible = false;
                })
                .finally(()=> {
                    this.$emit("input",false);
                });
        }
    },
    mounted() {
    }
}
</script>

<style scoped lang="less">
</style>
