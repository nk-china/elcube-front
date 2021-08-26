<template>
    <div>
        <a-input @click="open" v-model="value" size="small" readOnly></a-input>
        <a-modal v-model="visible" title="SpEL表达式编辑器" width="40%" centered>
            <div slot="footer">
                <a-button type="primary" @click="submit">确定</a-button>
            </div>
            <a-textarea v-model="el" :rows="4" placeholder="SpEL表达式"></a-textarea>
            <a-input-search placeholder="输入单据ID(可选)" @search="test()" style="margin-top: 12px;">
                <a-button slot="enterButton" disabled>
                    测试(待实现)
                </a-button>
            </a-input-search>
            <span v-if="error" style="color: #ff4d4f">{{error}}</span>
        </a-modal>
    </div>
</template>

<script>
export default {
    name: "NkSpELEditor",
    props:{
        value : String
    },
    data(){
        return {
            visible : false,
            docId: undefined,
            el: undefined,
            error: undefined
        }
    },
    methods:{
        open(){
            this.visible = true;
            this.el = this.value;
        },
        submit(){
            try{
                this.$emit("input", this.el);
                this.visible = false;
                this.error = undefined;
            }catch (e){
                this.error = e;
            }
        },
        test(){

        }
    }
}
</script>

<style scoped>

</style>