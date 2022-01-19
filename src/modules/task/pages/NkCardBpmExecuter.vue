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
    <nk-card title="审批意见">
        <nk-bpmn-view ref="bpmn"
                      v-if="bpmnVisible"
                      :process-definition-id="task.processDefinitionId"
                      :task-definition-key="task.taskDefinitionKey"
                      style="margin-bottom: 10px;" />

        <a-comment v-for="item in task.instanceComments" :key="item.id">
            <span slot="author" style="display: flex;align-items: center;">
                <a-avatar size="small" style="margin-right: 5px;color: #f56a00; backgroundColor: #fde3cf">
                    {{ item.user && item.user.length > 2 ? item.user.substring(0,1) : item.user }}
                </a-avatar>
                {{item.user || '匿名'}}
            </span>
            <span slot="datetime" style="line-height: 24px;">{{ item.time | nkDatetimeFriendly}}</span>
            <p slot="content">
                {{ item.comment }}
            </p>
        </a-comment>

        <a-input type="textarea" v-model="completeTask.comment" :auto-size="{ minRows: 4, maxRows: 6 }" placeholder="请输入办理意见"></a-input>
        <div slot="actions" style="padding: 0 20px 0;text-align: right">
            <a-button-group v-if="task">
                <a-button v-for="transition in task.transitions"
                          :key="transition.id"
                          type="primary"
                          :disabled="buttonDisabled"
                          @click="completeTaskOk(transition)">
                    {{ transition.name }}
                </a-button>
                <a-button type="default" @click="toForward" >转办</a-button>
                <a-button type="default" @click="toDelegate" >委派</a-button>
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

        <a-modal v-model="modal.visible" :title="modal.title" centered @ok="modalOk" :ok-button-props="{ props: { disabled: okButtonDisabled } }">
            <nk-form-item title="用户" :width="80">
                <a-auto-complete
                    size="small"
                    v-model="modal.accountIdInput"
                    :data-source="modal.accounts"
                    style="width: 200px"
                    placeholder="请输入用户名称选择"
                    @select="accountSelected"
                    @search="accountSearch"
                    @change="accountChange"
                />
            </nk-form-item>
            <nk-form :col="1" :edit="true">
                <nk-form-item title="办理意见" :width="80">
                    <a-textarea v-model="modal.comment" :rows="5"
                                placeholder="请输入办理意见"></a-textarea>
                </nk-form-item>
            </nk-form>
        </a-modal>

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
            completeTask: {},
            modal:{
                visible:false,
                title:undefined,
                accounts:[],
                accountIdInput:undefined,
                accountId:undefined,
                comment:undefined
            }
        }
    },
    computed:{
        ...mapGetters('User',[
            'hasAuthority'
        ]),
        buttonDisabled(){
            return this.editMode || !(this.completeTask.comment && this.completeTask.comment.replace(/\s/g,''));
        },
        okButtonDisabled(){
            return this.editMode || !this.modal.accountId || !(this.modal.comment && this.modal.comment.replace(/\s/g,''));
        }
    },
    methods:{
        completeTaskOk(transition){
            this.$emit("input",true);
            this.completeTask = Object.assign(this.completeTask,{taskId:this.task.id,transition});
            this.$http.postJSON(`/api/task/complete`,this.completeTask)
                .then(()=>{
                    this.$emit("complete",true);
                    this.completeTask = {};
                    this.bpmnVisible = false;
                })
                .finally(()=> {
                    this.$emit("input",false);
                });
        },
        toForward(){
            this.modal.accountIdInput = undefined;
            this.modal.title = '转办';
            this.modal.comment = this.completeTask.comment;
            this.modal.visible = true;
            this.modal.callback = this.doForward;
        },
        toDelegate(){
            this.modal.accountIdInput = undefined;
            this.modal.title = '委派';
            this.modal.comment = this.completeTask.comment;
            this.modal.visible = true;
            this.modal.callback = this.doDelegate;
        },
        doForward(){
            this.$emit("input",true);
            const completeTask = {taskId:this.task.id, accountId:this.modal.accountId, comment: this.modal.comment};
            this.$http.postJSON(`/api/task/forward`,completeTask)
                .then(()=>{
                    this.$emit("complete",true);
                    this.bpmnVisible = false;
                })
                .finally(()=> {
                    this.$emit("input",false);
                });
        },
        doDelegate(){
            this.$emit("input",true);
            const completeTask = {taskId:this.task.id, accountId:this.modal.accountId, comment: this.modal.comment};
            this.$http.postJSON(`/api/task/delegate`,completeTask)
                .then(()=>{
                    this.$emit("complete",true);
                    this.bpmnVisible = false;
                })
                .finally(()=> {
                    this.$emit("input",false);
                });
        },
        accountSearch(e){
            if(e){
                this.$http.post(`/api/task/accounts?keyword=${e}`)
                    .then(res=>{
                        this.modal.accounts = res.data.map(item=>{return {value:item.id,text:item.username}});
                    });
            }
        },
        accountChange(){
            this.modal.accountId = undefined
        },
        accountSelected(e){
            this.modal.accountId = e
        },
        modalOk(){
            this.modal.visible = false;
            this.modal.callback();
        }
    },
    mounted() {
    }
}
</script>

<style scoped lang="less">
::v-deep .ant-comment-inner{
    padding: 2px;
    .ant-comment-content-detail{
        padding: 0 30px;
    }
}
</style>
