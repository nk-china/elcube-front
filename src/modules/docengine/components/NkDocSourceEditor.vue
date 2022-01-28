<template>
    <a-modal v-model="visible" title="单据源码编辑器" width="80%" centered :maskClosable="false" @cancel="cancel">
        <codemirror ref="codemirror2"
                    :options="codemirrorOptions"
                    v-model="json"
                    style="height: calc(100vh - 240px)"
        ></codemirror>
        <a-textarea v-model="option.remarks" placeholder="请输入修改原因" style="margin-top: 5px;"></a-textarea>
        <span v-if="error" style="color: #aa2222">{{error}}</span>
        <div slot="footer">
            <a-checkbox disabled checked>清除缓存</a-checkbox>
            <a-checkbox disabled checked>更新索引</a-checkbox>
            <a-checkbox disabled v-model="option.dataSync">数据同步</a-checkbox>
            <a-checkbox disabled v-model="option.cycle">生命周期</a-checkbox>
            <a-checkbox disabled v-model="option.history">变更历史</a-checkbox>
            <a-button type="primary" @click="ok" :loading="loading" :disabled="disableUpdate">保存</a-button>
            <a-button @click="cancel" :disabled="loading">关闭</a-button>
        </div>
    </a-modal>
</template>

<script>

export default {
    props:{
        value:Boolean,
        doc:Object,
    },
    data(){
        return {
            codemirrorOptions: {
                mode: "javascript",
                theme: "ambiance",
                lineWrapping: false,
                indentUnit: 4,
                tabSize: 4,
                lineNumbers: true,
                extraKeys: {
                    'Ctrl-.': 'autocomplete'
                }
            },
            docJson:undefined,
            loading:false,
            option:{
                dataSync:true,
                cycle:true,
                history:true,
                remarks:undefined,
            },
            error:undefined,
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
        json:{
            get(){
                if(this.visible){
                    if(this.docJson){
                        return this.docJson;
                    }
                    const clone = {};
                    [
                        "classify",
                        "docId",
                        "docName",
                        "docNumber",
                        "docDesc",
                        "docState",
                        "docType",
                        "defVersion",
                        "partnerId",
                        "partnerName",
                        "preDocId",
                        "refObjectId",
                        "processInstanceId",
                        "createdTime",
                        "updatedTime",
                        "data",
                    ].forEach(key=>{
                        clone[key]=this.doc[key]
                    })

                    // const clone = Object.assign({},this.doc);
                    // delete clone.def;
                    // delete clone.items;
                    // delete clone.bpmTask;
                    // delete clone.writeable;
                    // delete clone.newCreate;
                    // delete clone.runtimeKey;
                    // delete clone.docTypeDesc;
                    // delete clone.docStateDesc;
                    // delete clone.debug;
                    // delete clone.dynamics;
                    // delete clone.identification;

                    return JSON.stringify(clone,undefined, 4)
                }
                return ''
            },
            set(v){
                try{
                    JSON.parse(v)
                    this.docJson = v
                    this.error = undefined
                }catch (e){
                    this.error = e
                }
            }
        },
        disableUpdate(){
            return !!(this.error || !(this.option.remarks && this.option.remarks.trim()))
        }
    },
    methods:{
        cancel(){
            this.visible=false
        },
        ok(){
            this.loading = true;
            const doc = Object.assign(Object.assign({},this.doc),JSON.parse(this.json))
            this.$http.postJSON(`/api/ops/doc/update?remarks=${this.option.remarks}`, doc)
                .then((response) => {
                    this.$emit("change",response.data);
                    this.loading = false;
                    this.visible = false;
                    this.docJson = undefined;
                    this.option.remarks = undefined;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    }
}
</script>

<style scoped lang="less">

::v-deep{

    .vue-codemirror{
        width: 100%;
        height: 100%;

        .CodeMirror{
            height: 100%;
        }
        .CodeMirror-vscrollbar::-webkit-scrollbar {
            /*滚动条整体样式*/
            width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
            height: 5px;
        }
        .CodeMirror-vscrollbar::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
            background   : #666;
        }
        .CodeMirror-vscrollbar::-webkit-scrollbar-track {
            /*滚动条里面轨道*/
            box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            background   : #333;
        }
    }
}
</style>