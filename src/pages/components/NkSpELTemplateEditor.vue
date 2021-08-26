<template>
    <div>
        <a-input @click="open" v-model="value" size="small" readOnly></a-input>
        <a-modal v-model="visible" title="SpEL模版编辑器" width="60%" centered>
            <div slot="footer">
                <a-button type="primary" @click="submit">确定</a-button>
            </div>
            <a-textarea v-model="el" :rows="10" placeholder="SpEL模版，必须为标准JSON格式"></a-textarea>
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
            try{
                this.el = this.parse(this.value,2);
                this.error = undefined;
            }catch (e){
                this.el = this.value;
                this.error = undefined;
            }
        },
        submit(){
            try{
                this.$emit("input", this.parse(this.el));
                this.visible = false;
                this.error = undefined;
            }catch (e){
                this.error = e;
            }
        },
        test(){

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