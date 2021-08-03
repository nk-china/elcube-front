<template>
    <nk-card :title="`审批流配置`">
        <nk-form ref="formBPM" size="small" :col="1" :edit="editMode" style="width:500px;">

            <nk-form-item term="流程定义" :validateFor="bpm.processKey">
                {{bpm.processKey}}
                <a-input size="small" v-model="bpm.processKey" slot="edit" allowClear></a-input>
            </nk-form-item>
            <nk-form-item v-if="bpm.processKey" term="启动状态" :validateFor="bpm.startBy" message="请输入启动状态" required len :max="20" lenMessage="启动状态1-20个字">
                {{bpm.startBy}}
                <a-input size="small" v-model="bpm.startBy" slot="edit" allowClear></a-input>
            </nk-form-item>
            <nk-form-item term="终止时回退状态" :validateFor="bpm.rollbackTo" message="请输入终止回退状态" lenMessage="终止回退状态1-20个字">
                {{bpm.rollbackTo}}
                <a-input size="small" v-model="bpm.rollbackTo" slot="edit" allowClear></a-input>
            </nk-form-item>
        </nk-form>
    </nk-card>
</template>

<script>

export default {
    props:{
        editMode:Boolean,
        docDef:Object,
        docOptions:Object,
        card:Object
    },
    data(){
        return {}
    },
    computed:{
        bpm(){
            return this.docDef.bpms && this.docDef.bpms[0] || {};
        }
    },
    created() {
        if(!this.docDef.bpms){
            this.$set(this.docDef,'bpms',[]);
        }
        if(!this.docDef.bpms[0]){
            this.$set(this.docDef.bpms,0, {});
        }
    }
}
</script>

<style scoped>

</style>