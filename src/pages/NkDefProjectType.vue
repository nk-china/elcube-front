<template>
    <nk-page-layout class="mini" title="业务配置" :loading="loading">
        <nk-form ref="form" size="small" :col="1" slot="content" :edit="editMode">
            <nk-form-item term="业务类型" v-if="$route.params.mode==='detail'">{{def.projectType}}</nk-form-item>
            <nk-form-item term="业务类型" v-if="$route.params.mode==='create'" :validateFor="def.projectType" message="请输入4个字符的业务类型" required len :min="4" :max="4">
                <a-input size="small" v-model="def.projectType" slot="edit" allowClear style="width: 120px"></a-input>
            </nk-form-item>
            <nk-form-item term="业务类型描述" :validateFor="def.projectTypeDesc" message="请输入业务类型描述" required len :max="20" lenMessage="业务类型描述1-20个字">
                {{def.projectTypeDesc}}
                <a-input size="small" v-model="def.projectTypeDesc" slot="edit" allowClear style="width: 300px"></a-input>
            </nk-form-item>
            <nk-form-item term="有效期限" :validateFor="[def.validFrom,def.validTo]" required message="请输入有效期限">
                {{def.validFrom}}-{{def.validTo}}
                <div slot="edit">
                    <a-range-picker size="small"
                                    :value="validDate"
                                    :disabled-date="disabledDate"
                                    @change="validDateChange"/>
                    <a-button type="link" @click="validDateLongTerm">长期有效</a-button>
                </div>
            </nk-form-item>
            <nk-form-item term="对象扩展">
                <nk-script-label :value="def.refObjectType"></nk-script-label>
                <a-select size="small" v-model="def.refObjectType" placeholder="请选择扩展对象类型" style="width: 60%" slot="edit">
                    <a-select-option v-for="item in options.projectInterceptors" :key="item.key">{{item.name}}</a-select-option>
                </a-select>
            </nk-form-item>
            <nk-form-item term="更新时间">{{def.updatedTime | nkDatetimeFriendly}}</nk-form-item>
        </nk-form>

        <nk-edit-slot :edit-mode="editMode" slot="extra">
            <a-statistic title="状态" :value="def.state | nkFromList([
                {label:'新创建',value:'NEW'},
                {label:'激活',value:'ACTIVE'},
                {label:'禁用',value:'DISABLE'},
            ])
            "/>
            <div slot="edit">
                <label>状态：</label>
                <a-select v-model="def.state" style="min-width:120px;" placeholder="请选择状态">
                    <a-select-option value="ACTIVE">激活</a-select-option>
                    <a-select-option value="DISABLE">禁用</a-select-option>
                </a-select>
            </div>
        </nk-edit-slot>

        <a-button-group slot="action">
            <a-button v-if="!editMode" type="primary" @click="preUpdate" :loading="loadingPreUpdate">编辑</a-button>
            <a-button v-if=" editMode" type="primary" @click="update" :loading="loadingSave">保存</a-button>
            <a-button v-if=" editMode" type="default" @click="cancel">取消</a-button>
        </a-button-group>

        <a-card class="nk-page-layout-card" title="里程碑">
            <vxe-toolbar v-if="editMode">
                <template v-slot:buttons>
                    <vxe-button icon="fa fa-plus" status="perfect" size="mini" @click="addStatus()">新增</vxe-button>
                </template>
            </vxe-toolbar>
            <vxe-table
                auto-resize
                size="mini"
                border=inner
                resizable
                highlight-hover-row
                header-cell-class-name="headerCellClassName"
                :edit-config="{trigger: 'click', mode: 'row', showIcon: editMode, activeMethod: ()=>{return editMode}}"
                :data="def.status">
                <vxe-table-column   title="里程碑"    field="projectState"      width="10%" :edit-render="{name: 'input', attrs: {type: 'text'}}"/>
                <vxe-table-column   title="描述"      field="projectStateDesc"  width="15%" :edit-render="{name: 'input', attrs: {type: 'text'}}"/>
                <vxe-table-column   title=""    field=""     width="20%">
                    <template v-slot="{seq,items}">
                        <span v-if="editMode">
                            <a                          @click="stateMove(seq, 0)">删除</a>
                            <a v-if="seq>1"             @click="stateMove(seq,-1)">上移</a>
                            <a v-if="seq<items.length"  @click="stateMove(seq, 1)">下移</a>
                        </span>
                    </template>
                </vxe-table-column>
            </vxe-table>
        </a-card>

        <a-card class="nk-page-layout-card" title="业务流">
            <vxe-toolbar v-if="editMode">
                <template v-slot:buttons>
                    <vxe-button icon="fa fa-plus" status="perfect" size="mini" @click="addDocType()">新增</vxe-button>
                </template>
            </vxe-toolbar>
            <vxe-table
                ref="xTableDocs"
                row-key
                auto-resize
                size="mini"
                border=inner
                resizable
                highlight-hover-row
                header-cell-class-name="headerCellClassName"
                :edit-config="{trigger: 'click', mode: 'row', showIcon: editMode, activeMethod: ()=>{return editMode}}"
                :data="def.docs">
                <vxe-table-column   title="交易类型"      field="docType"               width="8%" :edit-render="{
                        name: '$select',
                        options: options.docTypes,
                        optionProps: {value: 'docType', label: 'docType'},
                        events: {change: docTypeChange},
                }" />
                <vxe-table-column   title="交易描述"      field="docName"               width="20%"/>
                <vxe-table-column   title="前置交易"      field="preDocType"            width="10%" :edit-render="{
                        name: '$select',
                        options: preDocs,
                        optionProps: {value: 'docType', label: 'docType'},
                }"/>
                <vxe-table-column   title="里程碑条件"      field="preProjectStatus"    width="10%" :edit-render="{
                        name: 'input',
                }"></vxe-table-column>
                <vxe-table-column   title="前置交易状态"  field="preDocStatus"         width="10%"  :edit-render="{
                        name: 'input'
                }"></vxe-table-column>
<!--                <vxe-table-column   title="最大数量"      field="docCountLimit"    width="8%" :edit-render="{-->
<!--                    name:'$input',props:{type:'integer',min:1}}-->
<!--                "></vxe-table-column>-->
                <vxe-table-column   title="扩展程序"        field="refObjectType"       width="24%" :edit-render="{
                    name:'$select',
                    options: options.projectDocInterceptors,
                    optionProps: {value: 'key', label: 'name'},
                }">
                    <template v-slot="{ row }">
                        <nk-script-label :value="row.refObjectType"></nk-script-label>
                    </template>
                </vxe-table-column>
                <vxe-table-column   title=""                field=""                    width="10%">
                    <template v-slot="{ seq }">
                        <span v-if="editMode" class="drag-btn" style="margin-right: 10px;">
                            <i class="vxe-icon--menu"></i>
                        </span>
                        <span v-if="editMode" @click="docTypeRemove(seq)">
                            <i class="vxe-icon--remove"></i>
                        </span>
                    </template>
                </vxe-table-column>
            </vxe-table>
        </a-card>

        <nk-script-editor
            v-model="scriptModalConfig.visible"
            :script="scriptModalConfig.script"
            :mode="scriptModalConfig.mode"
            @change="scriptModalChange" />

    </nk-page-layout>
</template>

<script>
import moment from 'moment'
import NkUtil from "../utils/NkUtil";
import MixinSortable from "../utils/MixinSortable";

export default {
    mixins:[MixinSortable()],
    name: "NkSettingsProjectType",
    data(){
        return {
            editMode:false,
            loading:true,
            loadingSave:false,
            loadingPreUpdate:false,
            def: {
                validFrom:'',
                validTo:''
            },
            options: {default:true},
            status:[
                {
                    projectState:'0000',
                    projectStateDesc:'0000',
                    refObjectType:'0000'
                }
            ],
            docTypes:[
                {
                    docType:'ZR01',
                    docTypeDesc:'业务报价',
                    prevDocType:''
                },
                {
                    docType:'ZR02',
                    docTypeDesc:'还款计划',
                    prevDocType:'ZR01'
                }
            ],
            scriptModalConfig:{
                visible:false,
                script:undefined,
                object:undefined,
                key:undefined,
                mode:false
            }
        }
    },
    mounted(){
        this.initData();
    },
    computed:{
        preDocs(){
            let arr = [{docType:this.def.projectType}];
            if(this.def.docs)
                this.def.docs.forEach(i=>{
                    if(!arr.find(item=>item.docType===i.docType))
                        arr.push(i)
                });
            return arr;
        },
        validDate(){
            return [
                this.def.validFrom&&moment(this.def.validFrom,'YYYYMMDD'),
                this.def.validTo&&moment(this.def.validTo,'YYYYMMDD')
            ];
        }
    },
    methods:{
        initData(){
            if(this.$route.params.mode==='detail') {
                this.loading = true;
                this.$http.get("/api/def/project/type/detail?projectType=" +
                    this.$route.params.type + "&version=" + this.$route.params.version)
                    .then(response => {
                        this.def = response.data;
                        this.loading = false;
                        this.$emit('setTab',`业务类型:${this.def.projectType}`);
                        this.$nextTick(()=>{
                            this.$nkSortable(this.$refs.xTableDocs.$el,({newIndex,oldIndex})=>{
                                this.def.docs.splice(newIndex, 0, this.def.docs.splice(oldIndex, 1)[0]);
                            });
                        })
                    })
            }else{
                this.def = {
                    status:[],
                    docs:[],
                    updatedTime: Math.floor(new Date().getTime()/1000),
                    validFrom: undefined,
                    validTo: undefined,
                    version: 1,
                }
                this.$nextTick(()=>{
                    this.$nkSortable(this.$refs.xTableDocs.$el,({newIndex,oldIndex})=>{
                        this.def.docs.splice(newIndex, 0, this.def.docs.splice(oldIndex, 1)[0]);
                    });
                })
                this.loading = false;
                this.preUpdate();
            }
        },
        preUpdate(){
            this.loadingPreUpdate=true;
            new Promise((resolve)=>{
                if(this.options.default){
                    this.$http.get("/api/def/project/type/options")
                        .then(response=>{
                            this.options = response.data;
                            resolve();
                        })
                        .catch(()=>{})
                }else{
                    resolve();
                }
            }).then(()=>{
                this.editMode=true;
                this.loadingPreUpdate=false;
            });
        },
        update(){

            if(NkUtil.isRepeat(this.def.status,['projectState'])) {
                this.$message.error("状态定义重复，请检查后再次提交");
                return;
            }
            if(NkUtil.hasBlack(this.def.status,['projectState','projectStateDesc'])) {
                this.$message.error("状态码不能为空，请检查后再次提交");
                return;
            }
            if(NkUtil.isRepeat(this.def.docs,['docType','preDocType'])) {
                this.$message.error("单据定义重复，请检查后再次提交");
                return;
            }
            if(NkUtil.hasBlack(this.def.docs,['docType','preDocType'])) {
                this.$message.error("单据定义不能为空，请检查后再次提交");
                return;
            }
            if(!this.def.state) {
                this.$message.error("状态不能为空，请检查后再次提交");
                return;
            }
            if(this.$refs.form.hasError()) {
                this.$message.error("表单校验有错误，请检查后再次提交");
                return;
            }

            this.loadingSave = true;
            this.$http.postJSON("/api/def/project/type/update?create="+(this.$route.params.mode!=='detail'), this.def)
                .then(response => {
                    if(this.$route.params.mode==='detail') {
                        this.def = response.data;
                        this.editMode = false;
                        this.loadingSave = false;
                    }else{
                        this.$emit('replace','/apps/def/project/detail/'+this.def.projectType+'/'+this.def.version)
                    }
                })
                .catch(()=>{})
                .finally(()=>{
                    this.loadingSave = false;
                })
        },
        cancel(){
            if(this.$route.params.mode==='detail') {
                this.editMode = false;
                this.initData();
            }else{
                this.$emit('close')
            }
        },
        // valid date opt
        disabledDate(current) {
            return current.isBefore('2000-01-01') && current.isAfter('2099-12-31');
        },
        validDateChange(e){
            this.def.validFrom = (e[0]&&e[0].format("YYYYMMDD"));
            this.def.validTo   = (e[1]&&e[1].format("YYYYMMDD"));
        },
        validDateLongTerm(){
            this.def.validFrom = '20000101';
            this.def.validTo   = '20991231'
        },
        // status opt
        addStatus(){
            this.def.status.push({refObjectType:undefined})
        },
        stateMove(i,direction){
            let target = this.def.status.splice(i-1,1);
            if(direction!==0)
                this.def.status.splice(i-1+direction,0,target[0]);
            i=0;
            this.def.status.forEach(i=>{
                i.orderby = i++;
            });
        },
        // doc opt
        addDocType(){
            const row = {docType:'',preDocType:this.def.projectType,refObjectType:''};
            this.def.docs.push(row);
            this.$refs.xTableDocs.setActiveRow(row);
        },
        docTypeChange(e){
            e.row.docName=this.options.docTypes.find(i=>i.docType===e.row.docType).docName
        },
        docTypeRemove(seq){
            this.def.docs.splice(seq-1,1);
        },
        docActiveMethod(e){
            if(e.columnIndex===4)return false;
            console.log(e);
            return this.editMode;
        },
        // cmd
        scriptModalShow(row,key,edit){
            this.scriptModalConfig.visible = true;
            this.scriptModalConfig.object = row;
            this.scriptModalConfig.key = key;
            this.scriptModalConfig.script = row[key];
            this.scriptModalConfig.mode = edit;
        },
        scriptModalChange(e){
            this.scriptModalConfig.object[this.scriptModalConfig.key]=e;
        },
        moment
    }
}
</script>

<style scoped>
a+a{
    margin-left: 5px;
}
</style>
