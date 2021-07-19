<template>
    <nk-page-layout class="mini" title="交易伙伴角色配置" :loading="loading">
        <nk-form ref="form" size="small" :col="1" slot="content" :edit="editMode">
            <nk-form-item term="角色类型" v-if="$route.params.mode==='detail'">{{def.partnerRole}}</nk-form-item>
            <nk-form-item term="角色类型" v-if="$route.params.mode==='create'" :validateFor="def.partnerRole" message="请选择交易角色主单据" required>
                <a-select size="small" v-model="def.partnerRole" placeholder="请选择交易角色主单据" style="width: 200px;" slot="edit">
                    <a-select-option v-for="item in options.docTypes" :key="item.docType" @click="()=>{
                        def.partnerRoleDesc=item.docName;
                    }">
                        {{item.docType}}
                    </a-select-option>
                </a-select>
            </nk-form-item>
            <nk-form-item term="角色描述" :validateFor="def.partnerRoleDesc" message="请输入交易角色描述" required len :max="20" lenMessage="交易角色描述1-20个字">
                {{def.partnerRoleDesc}}
                <a-input size="small" v-model="def.partnerRoleDesc" slot="edit" allowClear style="width: 300px"></a-input>
            </nk-form-item>
            <nk-form-item term="对象扩展">
                <nk-script-label :value="def.refObjectType"></nk-script-label>
                <a-select size="small" v-model="def.refObjectType" placeholder="请选择扩展对象类型" style="width: 60%" slot="edit">
                    <a-select-option v-for="item in options.partnerInterceptors" :key="item.key">{{item.name}}</a-select-option>
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

        <a-card class="nk-page-layout-card" title="交易">
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
                <vxe-table-column   title="交易类型"      field="docType"      width="8%" :edit-render="{
                        name: '$select',
                        options: options.flowDocTypes,
                        optionProps: {value: 'docType', label: 'docType'},
                        events: {change: docTypeChange},
                }" />
                <vxe-table-column   title="交易描述"      field="docName"      width="20%"/>
                <vxe-table-column   title="前置交易"      field="preDocType"   width="8%" :edit-render="{
                        name: '$select',
                        options: preDocs,
                        optionProps: {value: 'docType', label: 'docType'},
                }"/>
                <vxe-table-column   title="前置交易状态"  field="preDocStatus"         width="12%"  :edit-render="{
                        name: 'input'
                }"></vxe-table-column>
                <vxe-table-column   title="扩展程序"        field="refObjectType"       width="25%" :edit-render="{
                    name:'$select',
                    options: options.partnerDocInterceptors,
                    optionProps: {value: 'key', label: 'name'},
                }">
                    <template v-slot="{ row }">
                        <nk-script-label :value="row.refObjectType"></nk-script-label>
                    </template>
                </vxe-table-column>
                <vxe-table-column   title=""    field=""     width="20%">
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
                validateFrom:'',
                validateTo:''
            },
            options: {default:true},

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
            let arr = [{docType:this.def.partnerRole}];
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
                this.$http.get("/api/def/partner/type/detail?partnerRole=" + this.$route.params.partnerRole)
                    .then(response => {
                        this.def = response.data;
                        this.loading = false;
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
                this.$http.get("/api/def/partner/type/options")
                    .then(response=>{
                        this.options = response.data;
                        resolve();
                    })
                    .catch(()=>{})
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
            this.$http.postJSON("/api/def/partner/type/update?create="+(this.$route.params.mode!=='detail'), this.def)
                .then(response => {
                    if(this.$route.params.mode==='detail') {
                        this.def = response.data;
                        this.editMode = false;
                        this.loadingSave = false;
                    }else{
                        this.$emit('replace','/apps/def/partner/detail/'+this.def.partnerRole)
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
            const row = {docType:'',preDocType:this.def.partnerRole,refObjectType:''};
            this.def.docs.push(row);
            this.$refs.xTableDocs.setActiveRow(row);
        },
        docTypeChange(e){
            e.row.docName=this.options.flowDocTypes.find(i=>i.docType===e.row.docType).docName
        },
        docTypeRemove(seq){
            this.def.docs.splice(seq-1,1);
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
