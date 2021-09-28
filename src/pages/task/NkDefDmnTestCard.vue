<template>
    <nk-card title="测试">
        <div style="display: flex">
            <div style="width: 50%">
                <div style="font-weight: 600;margin-bottom: 15px;text-align: right;width: 94px;font-size: 1.1em;">Inputs</div>
                <nk-form :col="1" :edit="edit">
                    <nk-form-item title="决策">
                        {{selectedDecision}}
                        <a-select slot="edit" v-model="selectedDecision" @change="decisionChange">
                            <a-select-option v-for="item in decisions" :key="item.id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </nk-form-item>
                    <nk-form-item :title="item.name || '<Undefined>'" v-for="(item,index) in inputs" :key="index">
                        {{variables[item.key]}}
                        <a-input slot="edit" :placeholder="item.name" v-model="variables[item.key]"></a-input>
                    </nk-form-item>
                </nk-form>
            </div>
            <div style="width: 50%">
                <div style="font-weight: 600;margin-bottom: 15px;text-align: right;width: 94px;font-size: 1.1em;">Outputs</div>
                <nk-form :col="1">
                    <nk-form-item :title="item.name || '<Undefined>'" v-for="(item,index) in outputs" :key="index">
                        <div style="height:28px;line-height:28px;background-color:#fefefe ; padding:0 5px;border:1px solid #d9d9d9;border-radius: 5px;">
                            <span v-if="outputVariables[item.name]">{{outputVariables[item.name]}}</span>
                            <span style="color: #aaa;" v-else>{{item.decisionId +':'+ item.name + '&lt;'+item.typeRef+'&gt;'}}</span>
                        </div>
                    </nk-form-item>
                </nk-form>
            </div>
        </div>
        <div slot="actions" style="text-align: right;margin-right: 26px;">
            <a-button @click="run">Run</a-button>
        </div>
    </nk-card>
</template>

<script>
import dmnParser from "@/pages/task/ref/dmnParser";

export default {
    name: "NkDefDmnTestCard",
    props:{
        edit:{
            type:Boolean,
            default:true,
        },
        modeler:Object,
        xml: {}
    },
    data(){
        return {
            decisions:[],
            inputs: [],
            outputs: [],
            variables: {},
            outputVariables: {},
            selectedDecision: undefined,
        }
    },
    created() {
    },
    methods:{
        decisionChange(e){
                this.selectedDecision = e;
                const desc = dmnParser(this.modeler,e);
                this.decisions = desc.decisions;
                this.inputs = desc.inputs;
                this.outputs = desc.outputs;
        },
        run(){

            this.xml().then(({xml})=>{
                this.$http.postJSON("/api/def/dmn/run",{
                    decisionKey: this.selectedDecision,
                    xml,
                    variables: this.variables
                }).then((res)=>{
                    let outputVariables = {};
                    res.data.forEach(i=>{
                        outputVariables = Object.assign(outputVariables,i);
                    })
                    this.outputVariables = outputVariables
                    this.loading = false;
                });
            });

        }
    }
}
</script>

<style scoped>

</style>