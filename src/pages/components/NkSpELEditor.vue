<template>
    <div>
        <component :is="inputComponent" @click="open" v-model="value" size="small" read-only readonly class="readonly"></component>
        <component :is="component" v-model="visible" title="SpEL表达式编辑器" width="50%" centered :mask-closable="false" :esc-closable="true">

            <a-textarea v-model="el" :rows="10" placeholder="SpEL表达式 或 JSON格式模版"></a-textarea>

            <a-input-search placeholder="输入单据ID(可选)" v-model="docId" @search="test()" style="margin-top: 12px;">
                <a-button slot="enterButton">测试</a-button>
            </a-input-search>
            <div v-if="error" class="error">{{error}}</div>
            <div v-if="result" class="result">
                <label style="font-weight: bold;">Result:</label>
                <div :class="{overflow:component==='vxe-modal'}">
                    <json-viewer
                        :value="result"
                        :expand-depth=5
                        :expanded="component==='vxe-modal'"
                        theme="jv-light"
                        copyable
                        boxed
                        sort />
                </div>
            </div>

            <div v-if="component==='vxe-modal'" style="margin-top: 10px;text-align: right">
                <a-button type="primary" @click="submit">确定</a-button>
            </div>

            <div slot="footer" v-if="component==='a-modal'">
                <a-button type="primary" @click="submit">确定</a-button>
            </div>
        </component>
    </div>
</template>

<script>
import qs from 'qs'
import {mapState,mapMutations} from 'vuex'
import JsonViewer from 'vue-json-viewer';

export default {
    name: "NkSpELEditor",
    components:{JsonViewer},
    props:{
        value : String,
        modalComponent:{
            type:String,
            default: 'a-modal'
        },
    },
    created() {
        this.component = this.modalComponent;
        if(this.$parent.$options._componentTag==="vxe-table-body"){
            this.component = 'vxe-modal';
            this.inputComponent = 'vxe-input';
        }
    },
    data(){
        return {
            visible : false,
            el: undefined,
            error: undefined,
            result: undefined,
            component: undefined,
            inputComponent: 'a-input'
        }
    },
    computed:{
        ...mapState('Debug',[
            'docIdSpEL'
        ]),
        docId:{
            get(){
                return this.docIdSpEL;
            },
            set(value){
                this.setDocIdSpEL(value);
            }
        }
    },
    methods:{
        ...mapMutations('Debug',[
           'setDocIdSpEL'
        ]),
        open(){
            this.visible = true;
            this.result = undefined;
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
                this.$emit("input", this.validate(this.el));
                this.visible = false;
                this.error = undefined;
            }catch (e){
                this.error = e;
            }
        },
        test(){
            this.$http.post("/api/debug/spel/test",qs.stringify({
                el: this.el,
                docId : this.docId
            })).then(res=>{
                this.error = res.data.errorMessage;
                this.result = undefined;
                if(res.data.result){
                    this.result = res.data.result;
                }
            })
        },
        parse(value,space){
            const v = value && value.replace(/\s/g,'');
            if(!v)
                return v;
            return JSON.stringify(JSON.parse(value),null,space)
        },
        validate(value){
            value = value && value.trim();
            try{
                return JSON.stringify(JSON.parse(value));
            }catch (e){
                if(typeof value==='string'){
                    try{
                        JSON.stringify(JSON.parse(`"${value}"`));
                        return value;
                    }catch (e){
                        throw e;
                    }
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
    .result{
        margin-top: 12px;
    }
    .error{
        color: #ff4d4f;
        margin-top: 12px;
        background-color: #fafafa;
        padding: 4px;
    }
    .overflow{
        height: 300px;overflow: auto
    }
    ::v-deep.readonly{
        cursor: pointer;
        input{
            cursor: pointer;
        }
    }
</style>