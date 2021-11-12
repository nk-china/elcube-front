<template>
    <nk-page-layout title="部署" sub-title="导入或导出配置文件" :spinning="exportLoading">

        <nk-card class="card" title="配置导入" cardKey="import">
<!--            <input type="file" @change="getFile" accept=".ts5 " ref="devContent" v-show="true"/>-->
            <a-upload
                name="file"
                :multiple="false"
                accept=".ts5"
                :before-upload="upload"
            >
                <a-button> <a-icon type="upload" /> Click to Upload </a-button>
            </a-upload>
        </nk-card>
        <nk-card class="card" title="配置导出" cardKey="export">
            <nk-form :col="1" style="" :edit="true">
                <nk-form-item term="加密">
                    <a-switch default-checked @change="config.compress=$event"/>
                </nk-form-item>
                <nk-form-item term="注册表">
                    <a-switch @change="config.includeRegistry=$event"/>
                </nk-form-item>
                <nk-form-item term="菜单">
                    <a-switch @change="config.includeMenu=$event"/>
                </nk-form-item>
                <nk-form-item term="授权">
                    <a-switch @change="config.includeAuth=$event"/>
                </nk-form-item>
                <nk-form-item term="脚本对象">
                    <div>
                        <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                            <a-checkbox :indeterminate="indeterminateScripts" :checked="checkAllScripts" @change="onCheckAllScripts">
                                全选
                            </a-checkbox>
                        </div>
                        <br/>
                        <a-checkbox-group @change="onChangeScript" v-model="checkedListScripts">
                            <a-row>
                                <a-col :span="12" v-for="item in plainScripts" :key="item.key">
                                    <a-checkbox :value="item">
                                        {{item.name}}
                                    </a-checkbox>
                                </a-col>
                            </a-row>
                        </a-checkbox-group>
                    </div>
                </nk-form-item>
                <nk-form-item term="单据类型">
                    <div>
                        <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                            <a-checkbox :indeterminate="indeterminateDocTypes" :checked="checkAllDocTypes" @change="onCheckAllDocTypes">
                                全选
                            </a-checkbox>
                        </div>
                        <br/>
                        <a-checkbox-group @change="onChangeDocType" v-model="checkedListDocTypes">
                            <a-row>
                                <a-col :span="12" v-for="item in plainDocTypes" :key="item.docType">
                                    <a-checkbox :value="item">
                                        {{item.docType}}-{{item.docName}}
                                    </a-checkbox>
                                </a-col>
                            </a-row>
                        </a-checkbox-group>
                    </div>
                </nk-form-item>
                <nk-form-item term="工作流">
                    <div style="width: 100%">
                        <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                            <a-checkbox :indeterminate="indeterminateBpmns" :checked="checkAllBpmns" @change="onCheckAllBpmns">
                                全选
                            </a-checkbox>
                        </div>
                        <br/>
                        <a-checkbox-group @change="onChangeBpmn" v-model="checkedListBpmns" style="width: 100%">
                            <a-row>
                                <a-col :span="12" v-for="item in plainBpmns" :key="item.deploymentId">
                                    <a-checkbox :value="item">
                                        {{item.resourceName}}-{{item.name}}
                                    </a-checkbox>
                                </a-col>
                            </a-row>
                        </a-checkbox-group>
                    </div>
                </nk-form-item>
                <div class="buttons">
                    <a-button class="button" @click="defExport" type="primary" icon="download"  :loading="exportLoading">
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
    // const plainOptions = ['Apple', 'Pear', 'Orange'];
    // const defaultCheckedList = ['Apple', 'Orange'];
    import AuthUtils from "../../boot/AuthUtils";

    export default {
        data() {
            return {
                checkedListDocTypes: [],
                indeterminateDocTypes: false,
                checkAllDocTypes: false,
                plainDocTypes: [],

                checkedListScripts: [],
                indeterminateScripts: false,
                checkAllScripts: false,
                plainScripts: [],

                checkedListBpmns: [],
                indeterminateBpmns: false,
                checkAllBpmns: false,
                plainBpmns: [],

                config: {
                    compress: true
                },
                exportLoading:false
                //docType: "0012"
            }
        },
        created() {
            this.queryDoc();
        },
        methods: {
            $nkShow(){
                this.queryDoc();
            },
            onChangeScript(checkedList) {
                this.indeterminateScripts = !!checkedList.length && checkedList.length < this.plainScripts.length;
                this.checkAllScripts = checkedList.length === this.plainScripts.length;
            },
            onChangeDocType(checkedList) {
                this.indeterminateDocTypes = !!checkedList.length && checkedList.length < this.plainDocTypes.length;
                this.checkAllDocTypes = checkedList.length === this.plainDocTypes.length;
            },
            onChangeBpmn(checkedList) {
                this.indeterminateBpmns = !!checkedList.length && checkedList.length < this.plainBpmns.length;
                this.checkAllBpmns = checkedList.length === this.plainBpmns.length;
            },
            onCheckAllScripts({target}) {
                Object.assign(this, {
                    checkedListScripts: target.checked ? this.plainScripts : [],
                    indeterminateScripts: false,
                    checkAllScripts: target.checked,
                });
            },
            onCheckAllDocTypes({target}) {
                Object.assign(this, {
                    checkedListDocTypes: target.checked ? this.plainDocTypes : [],
                    indeterminateDocTypes: false,
                    checkAllDocTypes: target.checked,
                });
            },
            onCheckAllBpmns({target}) {
                Object.assign(this, {
                    checkedListBpmns: target.checked ? this.plainBpmns : [],
                    indeterminateBpmns: false,
                    checkAllBpmns: target.checked,
                });
            },
            queryDoc() {
                this.$http.postJSON("/api/def/script/names").then(res => {
                    this.plainScripts = res.data;
                    this.checkedListScripts = res.data;
                    this.checkAllScripts = true;
                });
                this.$http.postJSON("/api/def/doc/type/types").then(res => {
                    this.plainDocTypes = res.data;
                    this.checkedListDocTypes = res.data;
                    this.checkAllDocTypes = true;
                });
                this.$http.postJSON("/api/def/bpm/deployments/all/latest").then(res => {
                    this.plainBpmns = res.data;
                    this.checkedListBpmns = res.data;
                    this.checkAllBpmns = true;
                });
            },
            defExport() {
                this.exportLoading = true;
                this.$http.postJSON(
                    "/api/ops/deploy/export",
                    Object.assign({
                            docTypes:this.checkedListDocTypes.map(value => value.docType),
                            bpmDefs:this.checkedListBpmns.map(value => value.definitionId),
                            scripts:this.checkedListScripts.map(value => value.key),
                        },
                        this.config
                    ),{
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'NK-Token': AuthUtils.getToken()
                        },
                        responseType: 'blob'
                    })
                    .then(response => {
                        const that = this;

                        let fileName = response.headers["content-disposition"].split(";")
                            .find(e=>e.trim().startsWith('filename='));
                        fileName = (fileName&&fileName.split('=')[1].replace(/[\\"]/g,''))||'def111.ts5';

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
                            that.exportLoading = false;
                        };
                    });
            },
            upload(file){
                let that = this;
                const suffix = file.name.substr(file.name.lastIndexOf('.') + 1);
                if (suffix === 'ts5') {
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
                if (suffix === 'ts5') {
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
