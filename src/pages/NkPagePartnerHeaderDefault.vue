<template>
    <a-page-header title="交易伙伴详情"
                   :breadcrumb="breadcrumbs"
                   :sub-title="doc.docName"
    >
        <a-row>
            <a-col :span="18">
                <nk-form ref="form" size="small" :col="2" :edit="editMode" v-if="!loading">
                    <nk-form-item v-if="doc" term="交易类型" :col="2">
                        {{doc && doc.docType}} | {{doc.definedDoc && doc.definedDoc.docName}}
                    </nk-form-item>
                    <nk-form-item v-if="$route.params.mode!=='new-partner'" term="名称" :col="2">
                        {{doc.refObject.partnerName}}
                        <span v-if="diffTarget && diffTarget.refObject.partnerName!==doc.refObject.partnerName" class="state-original">
                            {{diffTarget.refObject.partnerName}}
                        </span>
                    </nk-form-item>
                    <nk-form-item v-if="$route.params.mode==='new-partner'" term="名称"
                                  :validateFor="doc.refObject.partnerName"
                                  :required="true"
                                  message="请输入交易伙伴名称">
                        <a-input slot="edit" size="small" v-model="doc.refObject.partnerName" allowClear style="max-width: 180px;"></a-input>
                    </nk-form-item>
                    <nk-form-item v-if="$route.params.mode!=='new-partner'" term="类型">
                        {{doc.refObject.partnerType  | nkFromList(doc.definedDoc && doc.definedDoc.docDef.partnerType)}}
                    </nk-form-item>
                    <nk-form-item v-if="$route.params.mode==='new-partner'" term="类型"
                                  :validateFor="doc.refObject.partnerType"
                                  :required="true"
                                  message="请选择类型">
                        <a-select slot="edit" size="small"
                                  v-model="doc.refObject.partnerType"
                                  style="min-width:120px;"
                                  placeholder="请选择类型"
                                  :options="doc.definedDoc && doc.definedDoc.docDef.partnerType"
                        >
                        </a-select>
                    </nk-form-item>
                    <nk-form-item term="角色">
                        <span v-if="!doc.refObject.roles || !doc.refObject.roles.length">暂无角色</span>
                        <a-tag v-for="role in doc.refObject.roles"
                               :key="role.docType"
                               :color="
                                    role.docType === (doc.definedRefObject && doc.definedRefObject.partnerRole) ||
                                    role.docType === doc.docType
                                    ?'blue':''
                                "
                               @click="switchRole(role)"
                        >
                            {{role.docName}}
                        </a-tag>
                    </nk-form-item>
                    <nk-form-item term="创建时间">{{doc.createdTime | nkDatetimeFriendly}}</nk-form-item>
                    <nk-form-item term="更新时间">{{doc.updatedTime | nkDatetimeFriendly}}</nk-form-item>
                    <nk-form-item term="备注" :col="2">
                        {{doc.docDesc||'暂无内容'}}
                        <a-textarea v-model="doc.docDesc" slot="edit" :auto-size="{ minRows: 3, maxRows: 10 }"></a-textarea>
                        <span v-if="diffTarget && diffTarget.docDesc!==doc.docDesc" class="state-original">
                            {{diffTarget.docDesc||'暂无内容'}}
                        </span>
                    </nk-form-item>
                </nk-form>
            </a-col>
            <a-col :span="6">

                <nk-edit-slot :edit-mode="editMode && statusEditable" v-if="!loading">
                    <div>
                        <a-statistic title="状态" :value="doc.docState | nkFromList(doc.definedDoc&&doc.definedDoc.status,'docStateDesc','docState')"/>
                        <span v-if="diffTarget && diffTarget.docState!==doc.docState" class="state-original">
                            {{diffTarget.docState | nkFromList(diffTarget.definedDoc&&diffTarget.definedDoc.status,'docStateDesc','docState')}}
                        </span>
                    </div>
                    <div slot="edit">
                        <label>状态：</label>
                        <a-select v-model="docState">
                            <a-select-option v-for="item in availableStatus" :key="item.docState">
                                {{item.docStateDesc}}
                            </a-select-option>
                        </a-select>
                    </div>
                </nk-edit-slot>
            </a-col>
        </a-row>

        <a-button-group v-if="!history && !loading && !diffTarget" slot="extra">
            <slot v-if="!editMode" name="buttons"></slot>
            <a-button   v-if="!editMode" :type="preview?'default':'primary'" :disabled="!docEditable" @click="$emit('nk-edit',true)">编辑</a-button>
            <a-button   v-if=" editMode" :type="'primary'" @click="$emit('nk-save')">保存</a-button>
            <a-button   v-if=" editMode" type="default" @click="$emit('nk-cancel')">取消</a-button>

            <a-dropdown v-if="!bpmTask && !preview && doc.classify==='PARTNER' && !editMode && availableNewRoles && availableNewRoles.length"
                        style="margin-left:-1px;"
                        :trigger="['click']">
                <a-button>新角色<a-icon type="down" /></a-button>
                <a-menu slot="overlay" >
                    <a-menu-item v-for="role in availableNewRoles" :key="role.partnerRole" @click="$emit('nk-new-role',role)">
                        <a-icon type="user" />{{role.partnerRole}} | {{role.partnerRoleDesc}}
                    </a-menu-item>
                </a-menu>
            </a-dropdown>

            <a-dropdown v-if="!bpmTask && !preview && !editMode && doc && doc.definedRefObject && doc.definedRefObject.docs && doc.definedRefObject.docs.length" :trigger="['click']">
                <a-button type="default">创建<a-icon type="down" /> </a-button>
                <a-menu slot="overlay">
                    <a-menu-item v-for="item in doc.definedRefObject.docs" :key="item.docType" @click="$emit('nk-create',item)">
                        {{item.docType}} | {{item.docName}}
                    </a-menu-item>
                </a-menu>
            </a-dropdown>
            <a-button v-if="!editMode" :type="histories?'primary':'default'" @click="$emit('nk-show-history')">
                <a-icon type="clock-circle" />
            </a-button>
            <a-button v-if="!preview && user&&user.authorities && user.authorities.find(a=>{return a.authority==='*:*'||a.authority==='DEF:*'})" @click="$router.push('/apps/def/doc/detail/'+doc.docType)">
                <a-icon type="tool" />
            </a-button>

        </a-button-group>
    </a-page-header>
</template>

<script>
export default {
    props:{
        loading:Boolean,

        user:Object,
        doc:Object,
        diffTarget:Object,
        preview:Boolean,

        breadcrumbs:Object,

        history:Object,
        histories:Array,

        docState:String,
        availableStatus:Array,

        editMode:Boolean,
        docEditable:Boolean,
        statusEditable:Boolean,

        bpmTask:Object,
        docTypes:{
            type:Array,
            default(){
                return []
            }
        }
    },
    data(){
        return {

            pageConfig:{
                type: Object,
                default(){
                    return {
                        useDefaultBreadcrumbs: false,
                        title: "交易详情",
                        titleDocType:'交易类型',
                        titleDocNumber:'交易编号',
                        titlePartner:'交易伙伴',
                        titleDocDesc:'交易描述',
                    };
                }
            }
        }
    },
    computed:{
        availableNewRoles(){
            const roles = [];
            this.doc.refObject.defRoles && this.doc.refObject.defRoles.forEach(def=>{
                if(!this.doc.refObject.roles.find(role=>role.docType===def.partnerRole)){
                    roles.push(def)
                }
            });
            return roles;
        },
    },
    methods:{
        hasError(){
            return this.$refs.form.hasError();
        }
    }
}
</script>

<style scoped>
.state-original{
    text-decoration:line-through;
    color: #f5222d;
    margin-left: 10px;
}
</style>