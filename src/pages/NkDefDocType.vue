<template>
    <nk-page-layout class="mini" title="单据配置" :loading="loading">

        <nk-form ref="form" size="small" :col="1" slot="content" :edit="editMode">
            <nk-form-item term="交易分类" v-if="routeParams.mode==='detail'">{{
                    def.docClassify | nkFromList(classify)
                }}</nk-form-item>
            <nk-form-item term="交易分类" v-if="routeParams.mode==='create'">
                <a-select size="small" v-model="def.docClassify" style="min-width:120px;" placeholder="请选择分类" @change="loadOptions" :options="classify"></a-select>
            </nk-form-item>
            <nk-form-item term="交易类型" v-if="routeParams.mode==='detail'">{{def.docType}}</nk-form-item>
            <nk-form-item term="交易类型" v-if="routeParams.mode==='create'" :validateFor="def.docType" message="请输入4个字符的交易类型" required len :min="4" :max="4">
                <a-input size="small" v-model="def.docType" slot="edit" allowClear style="width: 120px"></a-input>
            </nk-form-item>
            <nk-form-item term="交易类型描述" :validateFor="def.docName" message="请输入交易类型描述" required len :max="20" lenMessage="交易类型描述1-20个字">
                {{def.docName}}
                <a-input size="small" v-model="def.docName" slot="edit" allowClear style="width: 300px"></a-input>
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
            <nk-form-item term="单据处理程序" :validateFor="def.refObjectType" required message="请选择单据处理程序">
                <nk-script-label :value="def.refObjectType"></nk-script-label>
                <a-select size="small" v-model="def.refObjectType"
                          placeholder="请选择单据处理程序"
                          style="width: 60%" slot="edit"
                          @change="refObjectTypeChange"
                >
                    <a-select-option v-for="item in options.docInterceptors" :key="item.processorName">{{item.processorName}}</a-select-option>
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
            <a-button type="default" @click="componentModalOpen(def)">文档</a-button>
        </a-button-group>

        <component v-for="component in def.docDefNames"
                   ref="docDefs"
                   :is="component"
                   :key="component"
                   :editMode="editMode"
                   :def="def"
        />

        <nk-card card-key="nk-card-doc-type-state" class="nk-page-layout-card" title="状态">
            <nk-help-link slot="extra" url="http://cwiki.nkpro.cn/pages/viewpage.action?pageId=23789596" />
            <vxe-toolbar v-if="editMode">
                <template v-slot:buttons>
                    <vxe-button icon="fa fa-plus" status="perfect" size="mini" @click="addStatus()" :disabled="stateAddDisabled">新增</vxe-button>
                </template>
            </vxe-toolbar>
            <vxe-table
                ref="xTableStatus"
                row-key
                auto-resize
                size="mini"
                border=inner
                resizable
                highlight-hover-row
                header-cell-class-name="headerCellClassName"
                :edit-config="{trigger: 'click', mode: 'row', showIcon: editMode, activeMethod: ()=>{return editMode}}"
                :data="def.status"
                @edit-actived="stateEditActived">
                <vxe-table-column   title="状态"      field="docState"      width="10%" :edit-render="{
                    name: '$input',
                    props: {type: 'text',maxlength:4},
                    events:{change({column,row},{value}){row[column.property]=value.toUpperCase()}}
                }"/>
                <vxe-table-column   title="描述"      field="docStateDesc"  width="15%" :edit-render="{name: 'input', attrs: {type: 'text'}}"/>
                <vxe-table-column   title="前序状态"   field="preDocState"      width="10%" :edit-render="{
                    name:'$select',
                    options: availableStatus,
                    optionProps: {value: 'docState', label: 'docState'},
                }" >
                </vxe-table-column>
                <vxe-table-column   title="编辑控制"   field="editPerm"      width="12%" :edit-render="{
                    name:'$select',
                    options: [{
                        label:'不可编辑',value:0
                    },{
                        label:'可编辑',value:1
                    },{
                        label:'仅状态',value:3
                    },{
                        label:'流程中编辑',value:2
                    },],
                }" >
                </vxe-table-column>
                <vxe-table-column         field="sysState"      width="20%" :edit-render="{name: 'input', attrs: {type: 'text'}}">
                    <template v-slot:header="{column}">
                        系统状态
                        <nk-help-link page="doc-sys-state" />
                    </template>
                </vxe-table-column>
<!--                <vxe-table-column   title="扩展程序[感觉没啥用]"   field="refObjectType"     width="30%" :edit-render="{-->
<!--                    name:'$select',-->
<!--                    options: options.docStateInterceptors,-->
<!--                    optionProps: {value: 'key', label: 'name'},-->

<!--                }" >-->
<!--                    <template v-slot="{ row }">-->
<!--                        <nk-script-label :value="row.refObjectType"></nk-script-label>-->
<!--                    </template>-->
<!--                </vxe-table-column>-->
                <vxe-table-column   title=""    field=""     width="20%">
                    <template v-slot="{seq,items}">
                        <span v-if="editMode" class="drag-btn" style="margin-right: 10px;">
                            <i class="vxe-icon--menu"></i>
                        </span>
                        <span v-if="editMode" style="margin-right: 10px;" @click="stateMove(seq, 0)">
                            <i class="vxe-icon--remove"></i>
                        </span>
                    </template>
                </vxe-table-column>
            </vxe-table>
        </nk-card>

        <nk-card card-key="nk-card-doc-type-index-rule" class="nk-page-layout-card" title="索引规则" >
            <nk-help-link slot="extra" url="http://cwiki.nkpro.cn/pages/viewpage.action?pageId=23789596" />
            <a-alert v-if="editMode" type="info" class="alert hide-icon" message="SpEL 示例">
                <div slot="description">
                    <p>从list中取值：
                        <code>componentsData['组件名称'].^[type eq '查找的值']?.属性</code>，
                    </p>
                    <p>从map中取值：
                        <code>componentsData['组件名称']['map的KEY']</code>
                    </p>
                    <p>从entity中取值：
                        <code>componentsData['组件名称']?.属性</code>
                    </p>
                    <strong>etc.</strong>
                    <code>componentsData['nk-card-doc-partner'].^[type eq 'PLATFORM']?.partnerRoleId</code>
                </div>
            </a-alert>
            <vxe-toolbar v-if="editMode">
                <template v-slot:buttons>
                    <vxe-button icon="fa fa-plus" status="perfect" size="mini" @click="addIndexRule()" :disabled="indexRuleAddDisabled">新增</vxe-button>
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
                :data="def.indexRules"
                @edit-actived="stateEditActived">
                <vxe-table-column   title="字段"      field="field"   width="20%" :edit-render="{name: 'input', attrs: {type: 'text'}}"/>
                <vxe-table-column   title="SpEL"      field="rule"    width="70%" :edit-render="{name: 'input', attrs: {type: 'text'}}"/>
<!--                <vxe-table-column   title="扩展程序"   field="refObjectType"     width="10%" :edit-render="{-->
<!--                    name:'$select',-->
<!--                    options: [],-->
<!--                    optionProps: {value: 'key', label: 'name'},-->
<!--                }" >-->
<!--                    <template v-slot="{ row }">-->
<!--                        <nk-script-label :value="row.refObjectType"></nk-script-label>-->
<!--                    </template>-->
<!--                </vxe-table-column>-->
                <vxe-table-column   title=""    field=""     width="10%">
                    <template v-slot="{seq,items}">
                        <span v-if="editMode" @click="indexRuleMove(seq, 0)">
                            <i class="vxe-icon--remove"></i>
                        </span>
                    </template>
                </vxe-table-column>
            </vxe-table>
        </nk-card>

        <nk-card card-key="nk-card-doc-type-bpm" class="nk-page-layout-card" title="审批流">
            <nk-help-link slot="extra" url="http://cwiki.nkpro.cn/pages/viewpage.action?pageId=23789596" />
            <a-alert type="info" show-icon class="alert" description="如果默认审批流配置不足以满足需求，可以在单据对象扩展中进行增强" />
            <nk-form ref="formBPM" size="small" :col="1" :edit="editMode" style="width:500px;">

                <nk-form-item term="流程定义" :validateFor="def.bpm.processKey">
                    {{def.bpm.processKey}}
                    <a-input size="small" v-model="def.bpm.processKey" slot="edit" allowClear></a-input>
                </nk-form-item>
                <nk-form-item v-if="def.bpm.processKey" term="启动状态" :validateFor="def.bpm.startBy" message="请输入启动状态" required len :max="20" lenMessage="启动状态1-20个字">
                    {{def.bpm.startBy}}
                    <a-input size="small" v-model="def.bpm.startBy" slot="edit" allowClear></a-input>
                </nk-form-item>
                <nk-form-item term="终止时回退状态" :validateFor="def.bpm.rollbackTo" message="请输入终止回退状态" lenMessage="终止回退状态1-20个字">
                    {{def.bpm.rollbackTo}}
                    <a-input size="small" v-model="def.bpm.rollbackTo" slot="edit" allowClear></a-input>
                </nk-form-item>
            </nk-form>
        </nk-card>

        <nk-card card-key="nk-card-doc-type-component" class="nk-page-layout-card" title="自定义组件">
            <nk-help-link slot="extra" url="http://cwiki.nkpro.cn/pages/viewpage.action?pageId=23789596" />
            <vxe-toolbar v-if="editMode">
                <template v-slot:buttons>
                    <vxe-button icon="fa fa-plus" status="perfect" size="mini" @click="addComponent()" :disabled="componentAddDisabled">新增</vxe-button>
                </template>
            </vxe-toolbar>
            <vxe-table
                ref="xTableComponent"
                row-key
                auto-resize
                size="mini"
                border=inner
                resizable
                highlight-hover-row
                header-cell-class-name="headerCellClassName"
                :edit-config="{trigger: 'click', mode: 'row', showIcon: editMode, activeMethod: ()=>{return editMode}}"
                :data="def.customComponents">
                <vxe-table-column   title="组件"         field="component"        width="20%"  :edit-render="{
                        name: '$select',
                        options: availableComponents,
                        optionProps: {value: 'componentName', label: 'componentName'},
                        events: {change: componentChange},
                }" />
                <vxe-table-column   title="数据映射值"    field="componentMapping"  width="20%"
                                    :edit-render="{name:'input'}"/>
                <vxe-table-column   title="描述"         field="componentName"     width="15%"
                                    :edit-render="{name:'input'}"/>
                <vxe-table-column   title="计算顺序"      field="orderCalc"         width="8%"
                                    :edit-render="{name:'$input',props:{type:'integer',min:0}}"/>
                <vxe-table-column   title="计算次数"      field="timesCalc"         width="8%"
                                    :edit-render="{name:'$input',props:{type:'integer',min:1,max:5}}"/>
                <vxe-table-column   title="编辑控制SpEL"  field="editableSpEL"      width="15%"
                                    :edit-render="{name:'$input',props:{placeholder:'{\'S001\',\'S002\'}.contains(docState)'}}"/>
                <vxe-table-column   title=""            field=""                   width="10%">
                    <template v-slot="{seq,row}">
                        <span class="drag-btn" style="margin-right: 10px;" @click="componentModalOpen(row)">
                            <a-icon type="highlight" />
                        </span>
                        <span v-if="editMode" class="drag-btn" style="margin-right: 10px;">
                            <i class="vxe-icon--menu"></i>
                        </span>
                        <span v-if="editMode" style="margin-right: 10px;" @click="componentMove(seq, 0)">
                            <i class="vxe-icon--remove"></i>
                        </span>
                    </template>
                </vxe-table-column>
            </vxe-table>
        </nk-card>
        <a-modal :visible="componentModal.visible"
                 :title="`用户手册：${componentModal.component.componentName||componentModal.component.docName}`"
                 :centered="true"
                 width="60%"
                 @ok="componentModalOk"
                 @cancel="componentModalCancel"
        >
            <mavon-editor v-model="componentModal.value"
                          :subfield="false"
                          :toolbarsFlag="editMode"
                          :defaultOpen="editMode?'edit':'preview'"
                          :toolbars="componentModal.markdownOption"
                          style="min-height: 420px;"
                          @save="componentModalOk"
            />
        </a-modal>

        <a-divider orientation="left" style="font-size: 12px;font-weight: normal;color: #aaa;">以下为自定义组件配置</a-divider>

        <template v-for="component in def.customComponents">
            <component v-for="defComponentName in component.defComponentNames"
                       ref="customComponentsDef"
                       :is="defComponentName"
                       :key="component.component + '$' + defComponentName"
                       :editMode="editMode"
                       :docDef="def"
                       :component="component"
                       :componentsDef="def.customComponentsDef"
            />
        </template>

    </nk-page-layout>
</template>

<script>
import moment from 'moment'
import NkUtil from "../utils/NkUtil";
import MixinSortable from "../utils/MixinSortable";

export default {
    mixins:[MixinSortable()],
    data(){
        return {
            classify:[],
            // control
            editMode:false,
            loading:true,
            loadingSave:false,
            loadingPreUpdate:false,
            stateEditRow:undefined,
            // data
            def: {
                bpm:{}
            },
            options: {default:true},
            routeParams: undefined,
            componentModal:{
                component:{},
                visible:false,
                markdownOption:{
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: true, // 展示html源码
                    help: true, // 帮助
                    /* 1.3.5 */
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: true, // 清空
                    save: true, // 保存（触发events中的save事件）
                    /* 1.4.2 */
                    navigation: false, // 导航目录
                    /* 2.1.8 */
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    /* 2.2.1 */
                    subfield: true, // 单双栏模式
                    preview: true, // 预览
                }
            }
        }
    },
    created(){
        this.routeParams = Object.assign({},this.$route.params);
    },
    mounted(){
        this.initData();
        this.$http.get("/api/def/doc/type/classify")
            .then(res=>{
                this.classify = res.data;
            });
    },
    computed:{
        availableComponents(){
            (this.options.components &&
                this.options.components
                    .forEach(oc => {
                        oc.disabled = this.def.customComponents.find(dc=>dc.component === oc.componentName);
                    }));
            return this.options.components;
        },
        componentAddDisabled(){
            return this.def.customComponents && this.def.customComponents.find(c=>c.component==='')!==undefined;
        },
        availableStatus(){
            const status = [{docState:'@'}];
            this.def.status && this.def.status.forEach(state=>{
                if(state!==this.stateEditRow)
                    status.push(state)
            });
            return status;
        },
        stateAddDisabled(){
            return this.def.status && this.def.status.find(c=>c.docState==='')!==undefined;
        },
        indexRuleAddDisabled(){
            return this.def.indexRules && this.def.indexRules.find(c=>c.field==='')!==undefined;
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
            if(this.routeParams.mode==='detail'){
                this.loading = true;
                this.$http.get("/api/def/doc/type/detail?docType="+this.routeParams.type)
                    .then(response=>{
                        response.data.bpm = response.data.bpm||{};
                        this.def = response.data;
                        this.$emit('setTab',`单据类型:${this.def.docType}`);
                        this.loading = false;

                        this.$nextTick(()=>{
                            this.$nkSortable(this.$refs.xTableStatus.$el,   ({newIndex,oldIndex})=>{
                                this.def.status.splice(newIndex, 0, this.def.status.splice(oldIndex, 1)[0]);
                            });
                            this.$nkSortable(this.$refs.xTableComponent.$el,   ({newIndex,oldIndex})=>{
                                this.def.customComponents.splice(newIndex, 0, this.def.customComponents.splice(oldIndex, 1)[0]);
                            });
                        })
                    })
            }else{
                this.def = {
                    refObjectType:'',
                    status:[],
                    customComponents:[],
                    customComponentsDef:{},
                    updatedTime: Math.floor(new Date().getTime()/1000),
                    version: 1,
                    bpm:{},
                    validFrom:'',
                    validTo:''
                };
                this.$nextTick(()=>{
                    this.$nkSortable(this.$refs.xTableStatus.$el,   ({newIndex,oldIndex})=>{
                        this.def.status.splice(newIndex, 0, this.def.status.splice(oldIndex, 1)[0]);
                    });
                    this.$nkSortable(this.$refs.xTableComponent.$el,   ({newIndex,oldIndex})=>{
                        this.def.customComponents.splice(newIndex, 0, this.def.customComponents.splice(oldIndex, 1)[0]);
                    });
                })
                this.$emit('setTab',`新建单据类型`);
                this.loading = false;
                this.preUpdate();
            }
        },
        loadOptions(e){
            if(this.def.docClassify){
                if(e)
                    this.def.refObjectType = ''
                this.$http.get(`/api/def/doc/type/options/${this.def.docClassify}`)
                    .then(response=>{
                        this.options = response.data;
                        this.editMode=true;
                        this.loadingPreUpdate=false;
                    })
                    .catch(()=>{})
                    .finally(()=>{
                        this.loadingPreUpdate=false;
                    })
            }else{
                this.loadingPreUpdate=false;
            }
        },
        preUpdate(){
            this.loadingPreUpdate=true;
            this.loadOptions();
        },
        update(){

            if(this.$refs.form.hasError()) {
                this.$message.error("表单校验有错误，请检查后再次提交");
                return;
            }
            if(!this.def.state) {
                this.$message.error("状态不能为空，请检查后再次提交");
                return;
            }
            if(NkUtil.isRepeat(this.def.status,['docState','preDocState'])) {
                this.$message.error("单据状态定义重复，请检查后再次提交");
                return;
            }
            if(NkUtil.hasBlack(this.def.status,['docState','docStateDesc','preDocState'])) {
                this.$message.error("单据状态码不能为空，请检查后再次提交");
                return;
            }
            if(NkUtil.isRepeat(this.def.customComponents,['component'])) {
                this.$message.error("自定义组件定义重复，请检查后再次提交");
                return;
            }
            if(NkUtil.isRepeat(this.def.customComponents,['componentMapping'])) {
                this.$message.error("自定义组件数据映射重复，请检查后再次提交");
                return;
            }
            if(NkUtil.hasBlack(this.def.customComponents,['component'])) {
                this.$message.error("自定义组件不能为空，请检查后再次提交");
                return;
            }
            if(this.$refs.customComponentsDef){
                for(let i in this.$refs.customComponentsDef){
                    let customComponentDef = this.$refs.customComponentsDef[i];
                    if(customComponentDef.hasError && customComponentDef.hasError()){
                        return null;
                    }
                }
            }

            this.loadingSave = true;
            this.$http.postJSON("/api/def/doc/type/update?create="+(this.routeParams.mode!=='detail'), this.def)
                .then(response => {
                    if(this.routeParams.mode==='detail') {
                        response.data.bpm = response.data.bpm||{};
                        this.def = response.data;
                    }else{
                        this.$emit('replace','/apps/def/doc/detail/'+this.def.docType)
                    }
                })
                .catch(()=>{})
                .finally(()=>{
                    this.editMode = false;
                    this.loadingSave = false;
                })
        },
        cancel(){
            if(this.routeParams.mode==='detail') {
                this.editMode = false;
                this.initData();
            }else{
                this.$emit('close')
            }
        },
        // status opt
        addStatus(){
            const row = {docState:'',docStateDesc:'',editPerm:'',preDocState:'',refObjectType:''};
            this.def.status.push(row)
            this.$refs.xTableStatus.setActiveRow(row);
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
        stateEditActived(e){
            this.stateEditRow = e.row;
        },
        // index role
        addIndexRule(){
            this.def.indexRules.push({field:'',rule:'',refObjectType:''});
        },
        indexRuleMove(i,direction){
            if(direction===0)
                this.def.indexRules.splice(i-1,1);
        },
        // component opt
        addComponent(){
            if(!this.def.customComponents.find(c=>c.component==='')){
                let row = {component:'',componentName:'',timesCalc:1,orderCalc:''};
                this.def.customComponents.push(row)
                this.$refs.xTableComponent.setActiveRow(row);
            }
        },
        componentChange(e){
            const defComponent = this.options.components.find(i=>i.componentName===e.row.component);
            e.row.componentMapping  = e.row.component;
            e.row.componentName     = defComponent.componentDesc;
            e.row.defComponentNames = defComponent.defComponentNames;
        },
        componentMove(i,direction){
            let target = this.def.customComponents.splice(i-1,1);
            if(direction!==0)
                this.def.customComponents.splice(i-1+direction,0,target[0]);
            i=0;
            this.def.customComponents.forEach(i=>{
                i.orderby = i++;
            });
        },
        // cmd
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
        componentModalOpen(row){
            this.componentModal.visible=true;
            this.componentModal.component=row;
            this.componentModal.value=this.componentModal.component.markdown;
        },
        componentModalOk(){
            this.componentModal.component.markdown=this.componentModal.value;
            this.componentModal.visible=false;
        },
        componentModalCancel(){
            if((this.componentModal.component.markdown
                ||this.componentModal.value)
                &&this.componentModal.component.markdown!==this.componentModal.value){
                let self = this;
                this.$confirm({
                    title: '确认放弃当前修改的内容?',
                    centered:true,
                    onOk() {
                        self.componentModal.visible=false;
                    },
                    onCancel() {
                    }
                });
            }else{
                this.componentModal.visible=false;
            }
        },
        refObjectTypeChange(e){
            const process = this.options.docInterceptors.find(item=>item.processorName===e);
            this.def.docDefNames = process.docDefComponentNames;
            this.def.refObjectTypeOptions = undefined;
        }
    }
}
</script>

<style scoped lang="scss">
a+a{
    margin-left: 5px;
}
::v-deep.alert{
    margin-bottom: 20px;
    padding: 8px 10px 10px 52px;

    .ant-alert-message{
        font-size: 14px;
    }
    .ant-alert-description{
        color: #666;
        font-size: 12px;
    }
    .ant-alert-icon{
        top:13px;
        font-size: 18px;
    }
    &.hide-icon{
        padding-left: 24px;
    }
}
</style>
