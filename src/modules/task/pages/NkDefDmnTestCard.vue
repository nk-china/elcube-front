<template>
    <nk-card title="模拟器">
        <div style="display: flex">
            <div style="width: 50%">
                <div style="font-weight: 600;margin-bottom: 15px;text-align: right;width: 94px;font-size: 1.1em;">Inputs</div>
                <nk-form :col="1" :edit="edit">
                    <nk-form-item title="决策">
                        {{selectedDecision}}
                        <a-select slot="edit" v-model="selectedDecision" @change="decisionChange">
                            <a-select-option v-for="item in decisions" :key="item.id">
                                {{item.name || '&lt;Unnamed&gt;'}}
                            </a-select-option>
                        </a-select>
                    </nk-form-item>

                    <template v-for="(item) in inputs">
                        <nk-form-divider :key="item.decisionId" :term="item.decisionName" />
                        <nk-form-item    :key="item.decisionId+'-'+i.key" :title="i.name || '&lt;Unnamed&gt;'" v-for="(i) in item.items">
                            {{inputVariables[i.key]}}
                            <a-input slot="edit" :placeholder="i.key" v-model="inputVariables[i.key]"></a-input>
                        </nk-form-item>
                    </template>
                </nk-form>
            </div>
            <div style="width: 50%">
                <div style="font-weight: 600;margin-bottom: 15px;text-align: right;width: 94px;font-size: 1.1em;">Outputs</div>
                <nk-form :col="1">
                    <template v-for="(item) in outputs">
                        <nk-form-divider :key="item.decisionId" :term="item.decisionName" />
                        <nk-form-item    :key="item.decisionId+'-'+index" :title="item.label || '&lt;Unnamed&gt;'" v-for="(item,index) in item.items">
                            <div style="height:28px;line-height:28px;background-color:#f3f3f3 ; padding:0 5px;border:1px solid #d9d9d9;border-radius: 5px;">
                                <span v-if="outputVariables[item.decisionId+'-'+item.name]">{{outputVariables[item.decisionId+'-'+item.name]}}</span>
                                <span style="color: #aaa;" v-else>{{item.decisionId+'&lt;'+item.typeRef+'&gt;'}}</span>
                            </div>
                        </nk-form-item>
                    </template>
                </nk-form>
            </div>
        </div>
        <div slot="actions" style="text-align: right;margin-right: 26px;">
            <a-button @click="run">Run</a-button>
        </div>
    </nk-card>
</template>

<script>
import dmnParser from "@/modules/task/ref/dmnParser";

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
            inputVariables: {},
            outputVariables: {},
            selectedDecision: undefined,
        }
    },
    created() {
    },
    methods:{
        decisionChange(e){
            try{
                const desc = dmnParser(this.modeler,e);
                this.selectedDecision = desc.id;
                this.decisions = desc.decisions;
                this.inputs = desc.inputs;
                this.outputs = desc.outputs;
                this.inputVariables = {};
                this.outputVariables = {};
                this.$emit("decision-change",this.selectedDecision);
            }catch (e){
                this.$message.error(e)
            }
        },
        run(){
            this.xml().then(({xml})=>{
                this.$http.postJSON("/api/def/dmn/run",{
                    decisionKey: this.selectedDecision,
                    xml,
                    variables: this.inputVariables
                }).then((res)=>{

                    let outputMatchedRules = {};
                    let outputVariables = {};
                    for(let decisionKey in res.data){
                        if(res.data.hasOwnProperty(decisionKey)){
                            const decisionExecuted = res.data[decisionKey];
                            decisionExecuted.result.forEach(item=>{
                                for(let key in item){
                                    if(item.hasOwnProperty(key)) {
                                        const k = decisionKey + '-' + key;
                                        if(!outputVariables[k]){
                                            outputVariables[k] = [item[key]];
                                        }else{
                                            outputVariables[k].push(item[key]);
                                        }
                                    }
                                }
                            })
                            outputMatchedRules[decisionKey] = decisionExecuted.matchedRules;
                        }
                    }

                    for(let k in outputVariables){
                        if(outputVariables.hasOwnProperty(k)){
                            outputVariables[k] = outputVariables[k].join(',');
                        }
                    }

                    this.outputVariables = outputVariables
                    this.loading = false;

                    this.$emit("run",{outputMatchedRules})
                });
            });

        }
    }
}
</script>

<style scoped>

</style>