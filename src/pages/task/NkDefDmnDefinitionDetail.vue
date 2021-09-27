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

        <a-card title="决策图" v-if="definition.bpmnXml">
            <div slot="extra">
                <a-button-group size="small">
                    <a-button @click="$refs.bpmn.zoom( 1)">+</a-button>
                    <a-button @click="$refs.bpmn.zoom(-1)">-</a-button>
                </a-button-group>
            </div>
          <nk-bpmn-view ref="bpmn" :bpmn="definition.bpmnXml" v-if="bpmnVisible" />
        </a-card>
    </nk-page-layout>
</template>

<script>
import NkBpmnView from "./NkDmnView";
export default {
    components:{
        NkBpmnView
    },
    data(){
        return {
            bpmnVisible:true,
            loading: true,
            loadingCanvas: true,
            definition: {},
            diagram: undefined,
            viewer: undefined,
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
        }
    },
    destroyed() {
        this.viewer&&this.viewer.destroy&&this.viewer.destroy();
    }
}
</script>

<style scoped>

</style>
