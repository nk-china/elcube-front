<template>
    <nk-page-layout title="部署" sub-title="导入或导出配置文件" :spinning="loading">

        <div v-if="debugId" slot="top" style="padding: 10px 10px 0">
            <a-alert message="调试模式下导入导出不可用" type="error" show-icon />
        </div>
        <nk-card class="card" title="配置导入" cardKey="import">
            <a-upload
                v-if="login"
                name="file"
                :multiple="false"
                accept=".ts5,.easis"
                :before-upload="upload"
            >
                <a-button v-if="login" :disabled="!!debugId"> <a-icon type="upload" /> Click to Upload </a-button>
            </a-upload>
            <a-button v-else @click="setReLogin({callback:loginSuccess,message:'请进行二次身份验证',reLoginTime:undefined})">身份验证</a-button>
        </nk-card>
        <nk-card class="card" title="配置导出" cardKey="export">
            <nk-form :col="1" style="" :edit="true">
                <nk-form-item term="加密">
                    <a-switch default-checked @change="config.compress=$event"/>
                </nk-form-item>
                <nk-form-item v-for="item in exports" :term="item.name" :key="item.key">
                    <div v-if="item.list" style="width:100%;">
                        <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                            <a-checkbox :indeterminate="checkIndeterminate[item.key]" :checked="checkAll[item.key]" @change="onCheckAll(item.key)">
                                全选
                            </a-checkbox>
                        </div>
                        <br/>
                        <a-checkbox-group v-model="config[item.key]" style="width: 100%;">
                            <a-row>
                                <a-col :span="12" v-for="item in item.list" :key="item.key">
                                    <a-checkbox :value="item.key">
                                        {{item.name}}
                                    </a-checkbox>
                                </a-col>
                            </a-row>
                        </a-checkbox-group>
                    </div>
                    <a-switch v-else @change="config[item.key]=$event"/>
                </nk-form-item>
                <div class="buttons">
                    <a-button class="button" @click="defExport" type="primary" icon="download"  :loading="exportLoading"  :disabled="!!debugId">
                        导出
                    </a-button>
                    <a-button class="button" icon="download" disabled="">
                        保存导出选项
                    </a-button>
                </div>
            </nk-form>
        </nk-card>

        <iframe ref="iframe" style="display: none"></iframe>
    </nk-page-layout>
</template>

<script>
    import {mapMutations, mapState} from "vuex";

    export default {
        data() {
            return {
                login:false,
                loading:false,
                exportLoading:false,

                config: {
                    compress: true
                },

                exports:[],
            }
        },
        created() {
            this.queryDoc();
        },
        computed:{
            ...mapState('Debug',[
                'debugId'
            ]),
            checkAll(){
                const c = {}
                this.exports.forEach(item=>{
                    if(item.list){
                        c[item.key] = this.config[item.key] && this.config[item.key].length === item.list.length;
                    }
                })
                return c;
            },
            checkIndeterminate(){
                const c = {}
                this.exports.forEach(item=>{
                    if(item.list){
                        c[item.key] = this.config[item.key] && !!this.config[item.key].length && this.config[item.key].length < item.list.length;
                    }
                })
                return c;
            }
        },
        methods: {
            ...mapMutations('User',[
                'setReLogin'
            ]),
            loginSuccess(){
                this.login = true
            },
            nk$show(){
                this.queryDoc();
            },
            onCheckAll(key){
                if(this.checkAll[key]){
                    this.$set(this.config,key,[]);
                }else{
                    this.$set(this.config,key,this.exports.find(e=>e.key===key).list.map(l=>l.key));
                }
            },
            queryDoc() {
                this.loading = true;
                this.$http.postJSON('/api/ops/deploy/load').then((res)=>{
                    this.exports = res.data;
                    this.loading = false;
                });
            },
            defExport() {
                this.loading = true;
                this.exportLoading = true;
                this.$http.postJSON("/api/ops/deploy/export",this.config,{responseType: 'blob'})
                    .then(response => {
                        const that = this;

                        let fileName = response.headers["content-disposition"].split(";")
                            .find(e=>e.trim().startsWith('filename='));
                        fileName = (fileName&&fileName.split('=')[1].replace(/[\\"]/g,''))||'export.easis';

                        const blob = new Blob([response.data], { type: "csv/plain" });
                        const reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onload = e => {
                            const a = document.createElement("a");
                            a.download = decodeURIComponent(fileName);
                            if (typeof e.target.result === "string") {
                                a.href = e.target.result;
                            }
                            a.click();
                            that.loading = false;
                            that.exportLoading = false;
                        };
                    });
            },
            upload(file){
                let that = this;
                const suffix = file.name.substr(file.name.lastIndexOf('.') + 1);
                if (suffix === 'ts5' || suffix === 'easis') {
                    this.$confirm({
                        title: '确认导入？',
                        content: file.name,
                        onOk() {
                            return new Promise((resolve) => {
                                let reader = new FileReader(); // 这是核心！！读取操作都是由它完成的
                                reader.readAsText(file);
                                reader.onload = function (oFREvent) { // 读取完毕从中取值
                                    let pointsTxt = oFREvent.target.result;
                                    that.$http.postJSON("/api/ops/deploy/import", pointsTxt).then(() => {
                                        that.$message.info('导入成功，请刷新浏览器');
                                        resolve();
                                    }).catch((e)=>{
                                        resolve();
                                        this.$message.warning(e.join(","));
                                    })
                                }
                            });
                        }
                    });
                } else {
                    this.$message.warning('仅支持ts5格式文件！');
                }
                return false;
            },
            getFile(e) {
                let that = this;
                const file = e.target.files[0];
                e.target.value = "";
                const suffix = file.name.substr(file.name.lastIndexOf('.') + 1);
                if (suffix === 'ts5' || suffix === 'easis') {
                    this.$confirm({
                        title: '是否导入此配置内容？',
                        content: file.name,
                        onOk() {
                            return new Promise((resolve) => {
                                let reader = new FileReader(); // 这是核心！！读取操作都是由它完成的
                                reader.readAsText(file);
                                reader.onload = function (oFREvent) { // 读取完毕从中取值
                                    let pointsTxt = oFREvent.target.result;
                                    that.$http.postJSON("/api/def/deploy/import", pointsTxt).then(() => {
                                        that.$message.info('导入成功，请刷新浏览器');
                                        resolve();
                                    }).catch((e)=>{
                                        resolve();
                                        this.$message.warning(e);
                                    })
                                }
                            });
                        }
                    });
                } else {
                    this.$message.warning('仅支持ts5格式文件！');
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .buttons{
        margin-left: 120px;margin-top: 20px;

        .button + .button{
            margin-left: 10px;
        }
    }
</style>
