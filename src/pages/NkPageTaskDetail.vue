<template>
    <div>
        <a-skeleton v-for="i in 5" :key="i" :loading="loading" style="background-color: #fff;"></a-skeleton>
        <component v-if="task"
                   :is="component"
                   :preview="preview"
                   @replace="onComponentReplace"
                   @close="onComponentClose"
                   @loaded="onComponentLoaded"
                   @setTab="onComponentSetTab"

                   :bpm-task="task">


            <template slot="buttons">
                <slot name="buttons"></slot>
                <a-popconfirm :title="`尚未实现`"
                              ok-text="确认"
                              cancel-text="取消">
                    <a-button type="primary" >认领</a-button>
                </a-popconfirm>
                <a-popconfirm
                    v-for="(flow) in flows"
                    :title="`确认${flow.name}当前任务？`"
                    placement="topRight"
                    :key="flow.id"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="complete(flow)"
                >
                    <a-button type="primary" :loading="flow.loading">{{flow.name}}</a-button>
                </a-popconfirm>
            </template>

            <nk-card-bpm-executer slot="component"
                                  v-if="task"
                                  :task="task"
                                  :complete="completeInfo">

            </nk-card-bpm-executer>
        </component>
    </div>
</template>

<script>
import ClassifyMapping from "./ClassifyMapping";
export default {
    components:{
    },
    props:{
        params:Object,
        preview:Boolean,
    },
    data(){
        return {
            loading: true,
            component:'',
            task: undefined,
            completed:false,
            flows:[],
            completeInfo:{
                variables:{}
            }
        }
    },
    created() {
        const taskId = this.params?this.params.taskId:this.$route.params.taskId;
        this.$http.get("/api/bpm/task?taskId="+taskId)
            .then(response=>{
                this.component =  ClassifyMapping[response.data.classify].component;
                this.task = response.data;
                this.$nextTick(()=>{
                    this.loading = false;
                });
                if(this.task && this.task.flows && this.task.flows.length){
                    this.task.flows.forEach(flow=>{flow.loading=false});
                    this.flows = this.task.flows;
                }else{
                    this.flows = [{
                        name: '提交',
                        documentation: '',
                        loading: false,
                    }];
                }

            })
    },
    computed:{
    },
    methods:{
        complete(flow){
            flow.loading = true;
            this.$set(this.flows, this.flows.indexOf(flow), flow);

            this.completeInfo.taskId = this.task.id;
            this.completeInfo.flow = flow.id;
            this.completeInfo.flowName = flow.name;

            this.$http.postJSON("/api/bpm/task/complete",this.completeInfo).then(()=>{
                this.$emit("close");
            }).finally(()=>{
                flow.loading = false;
                this.$set(this.flows, this.flows.indexOf(flow), flow);
            })
        },
        onComponentReplace(e){
            this.$router.push(e);
        },
        onComponentClose(e){
            this.$emit('close',e);
        },
        onComponentSetTab(e){
            this.$emit('setTab',this.task.name + '-'+e);
        },
        onComponentLoaded(){
        }
    }
}
</script>

<style scoped>

</style>
