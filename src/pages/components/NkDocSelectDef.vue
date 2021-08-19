<template>
    <a-modal v-model="visible" title="单据查询配置" width="60%" centered>
        <div slot="footer">
            <a-button @click="visible=false">关闭</a-button>
        </div>
        <a-textarea v-model="defV" :rows="10"></a-textarea>
    </a-modal>
</template>

<script>
export default {
    props: {
        value: Boolean,
        def: String
    },
    data(){
        return {
        }
    },
    computed:{
        visible:{
            get(){
                return this.value;
            },
            set(value){
                this.$emit("input",value);
            }
        },
        defV:{
            get(){
                return this.def;
            },
            set(value){
                this.$emit("submit",value);
            }
        }
    }
}
</script>

<style scoped>

</style>