<template>
    <div>
        <a-input @click="open" v-model="value" size="small" readOnly></a-input>
        <a-modal v-model="visible" title="单据查询配置" width="60%" centered>
            <div slot="footer">
                <a-button type="primary" @click="submit">确定</a-button>
            </div>
            <a-textarea v-model="def" :rows="10"></a-textarea>
        </a-modal>
    </div>
</template>

<script>
export default {
    props: {
        value: String
    },
    data(){
        return {
            visible: false,
            def :undefined
        }
    },
    methods:{
        open(){
            this.visible = true;
            try{
                this.def = this.parse(this.value,2);
                this.error = undefined;
            }catch (e){
                this.def = this.value;
                this.error = undefined;
            }
        },
        submit(){
            try{
                this.$emit("input", this.parse(this.def));
                this.visible = false;
                this.error = undefined;
            }catch (e){
                this.error = e;
            }
        },
        parse(value,space){
            const v = value && value.replace(/\s/g,'');
            if(!v)
                return v;
            return JSON.stringify(JSON.parse(value),null,space)
        }
    }
}
</script>

<style scoped>

</style>