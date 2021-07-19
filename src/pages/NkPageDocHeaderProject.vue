<template>
    <a-page-header title="业务详情"
                   :breadcrumb="breadcrumbs"
                   :sub-title="doc.docName"
    >
        <a-row>
            <a-col :span="18">
                <nk-form ref="detailForm" :col="2" :edit="editMode" v-if="!loading">
                    <nk-form-item term="业务类型">
                        {{doc.definedDoc && doc.definedDoc.docType}} | {{doc.definedDoc && doc.definedDoc.docName}}
                    </nk-form-item>
                    <nk-form-item term="业务伙伴">
                        <router-link v-if="doc.partnerId" :to="`/apps/partners/detail/${doc.partnerId}`">{{doc.partnerName}}</router-link>
                        <span v-else style="color: rgba(0, 0, 0, 0.45);">&lt;未选择&gt;</span>
                        <span v-if="diffTarget && diffTarget.partnerId!==doc.partnerId" class="state-original">
                            <router-link v-if="diffTarget.partnerId" :to="`/apps/partners/detail/${diffTarget.partnerId}`">{{diffTarget.partnerName}}</router-link>
                        </span>
                    </nk-form-item>
                    <nk-form-item term="业务编号">
                        <span v-if="doc.docNumber">{{doc.docNumber}}</span>
                        <span v-else style="color: rgba(0, 0, 0, 0.45);">&lt;未编号&gt;</span>
                    </nk-form-item>
                    <nk-form-item term="业务描述"
                                  :validateFor="doc.docName"
                                  :message="`请输入业务描述`"
                                  required
                                  len
                                  :max="20"
                                  :lenMessage="`业务描述1-20个字`">
                        {{doc.docName}}
                        <span v-if="diffTarget && diffTarget.docName!==doc.docName" class="state-original">
                            {{diffTarget.docName}}
                        </span>
                        <a-input v-model="doc.docName" slot="edit" allowClear ></a-input>
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

                <nk-edit-slot :edit-mode="false" v-if="!loading">
                    <div>
                        <a-statistic title="里程碑(状态)" :value="
                 doc.refObject && doc.refObject.projectState | nkFromList(doc.refObject.defined&&doc.refObject.defined.status,'projectStateDesc','projectState')
                "/>
                        <span v-if="diffTarget && diffTarget.refObject && doc.refObject && diffTarget.refObject.projectState!==doc.refObject.projectState" class="state-original">
                            {{diffTarget.refObject.projectState | nkFromList(diffTarget.refObject.defined&&diffTarget.refObject.defined.status,'projectStateDesc','projectState')}}
                        </span>
                        {{ doc.docState | nkFromList(doc.definedDoc&&doc.definedDoc.status,'docStateDesc','docState') }}
                        <span v-if="diffTarget && diffTarget.docState!==doc.docState" class="state-original">
                            {{diffTarget.docState | nkFromList(diffTarget.definedDoc&&diffTarget.definedDoc.status,'docStateDesc','docState')}}
                        </span>
                    </div>
                    <div slot="edit">
                        <label>状态：</label>
                        <a-select v-model="docState" style="min-width: 80px;">
                            <a-select-option v-for="item in availableStatus" :key="item.docState">
                                {{item.docStateDesc}}
                            </a-select-option>
                        </a-select>
                    </div>
                </nk-edit-slot>
            </a-col>
        </a-row>



        <a-button-group v-if="!history && !loading && !diffTarget" slot="extra">
            <slot       v-if="!editMode" name="buttons"></slot>
            <a-button   v-if="!editMode" :type="preview?'default':'primary'" :disabled="!docEditable" @click="$emit('nk-edit',true)">编辑</a-button>

            <!--            <a-dropdown-button v-if=" editMode" :type="'primary'" @click="doSave()" :trigger="['click']">-->
            <!--                保存-->
            <!--                <a-menu slot="overlay">-->
            <!--                    <a-menu-item key="" disabled style="font-size: 8px;padding: 1px 30px 1px 8px;cursor: default;">保存为：</a-menu-item>-->
            <!--                    <a-menu-divider />-->
            <!--                    <a-menu-item v-for="item in availableStatus"-->
            <!--                                 :key="item.docState"-->
            <!--                                 @click="doSave(item.docState)"-->
            <!--                    >-->
            <!--                        {{item.docStateDesc}}-->
            <!--                    </a-menu-item>-->
            <!--                </a-menu>-->
            <!--            </a-dropdown-button>-->

            <a-button   v-if="editMode"    :type="'primary'" @click="$emit('nk-save')">保存</a-button>

            <template   v-if="statusEditable">
                <a-popconfirm
                    v-for="item in availableStatus.filter(i=>i.docState!==docState)"
                    :key="item.docState"
                    :title="`确认${item.docStateDesc}？`"
                    placement="topRight"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="$emit('nk-save',item.docState)"
                >
                    <a-button type="primary">
                        {{item.docStateDesc}}
                    </a-button>
                </a-popconfirm>
            </template>

            <!--            <a-dropdown v-if="docEditable && availableStatus.filter(i=>i.docState!==docState).length" :type="'primary'" @click="doSave()" :trigger="['click']">-->
            <!--                <a-button type="primary">保存为<a-icon type="down" /> </a-button>-->
            <!--                <a-menu slot="overlay">-->
            <!--                    <a-menu-item v-for="item in availableStatus.filter(i=>i.docState!==docState)"-->
            <!--                                 :key="item.docState"-->
            <!--                                 @click="doSave(item.docState)"-->
            <!--                    >-->
            <!--                        {{item.docStateDesc}}-->
            <!--                    </a-menu-item>-->
            <!--                </a-menu>-->
            <!--            </a-dropdown>-->
            <a-button   v-if=" editMode" type="default" @click="$emit('nk-cancel')">取消</a-button>

            <a-dropdown v-if="!bpmTask && !preview && !editMode && docTypes.length" :trigger="['click']">
                <a-button type="primary">创建<a-icon type="down" /> </a-button>
                <a-menu slot="overlay">
                    <a-menu-item v-for="item in docTypes" :key="item.docType" @click="$emit('nk-create',item)" :disabled="item.disabled">
                        {{item.docType}} | {{item.docName}}
                    </a-menu-item>
                </a-menu>
            </a-dropdown>
            <a-button v-if="!editMode" :type="histories?'primary':'default'"
                      @click="$emit('nk-show-history')">
                <a-icon type="clock-circle" />
            </a-button>
            <a-button v-if="doc.definedDoc&&doc.definedDoc.markdownFlag"
                      :type="'default'"
                      @click="doSetDocumentPage('nkdn://user/'+doc.definedDoc.docType+'/'+doc.definedDoc.version)">
                <a-icon type="question-circle" />
            </a-button>
            <a-button v-if="!preview && user && user.authorities&&user.authorities.find(a=>{return a.authority==='*:*'||a.authority==='DEF:*'})"
                      @click="$router.push('/apps/def/doc/detail/'+doc.docType)">
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
    computed:{
        breadcrumbs(){
            let routes = [];
            this.$route.matched.forEach(r=>{
                let path = (r.components.default && (r.parent?r.path.substr(r.parent.path.length):r.path))||'';
                routes.push({
                    path:path,
                    breadcrumbName:(r.meta && r.meta.title) || r.name
                })
            });
            return {
                props: {
                    routes
                },
            }
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