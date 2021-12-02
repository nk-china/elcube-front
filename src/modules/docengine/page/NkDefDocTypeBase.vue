<!--
	This file is part of EAsis.
	EAsis is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	EAsis is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with EAsis.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <a-card title="基本信息">
        <nk-form ref="form" size="small" :col="1" :edit="editMode">
            <nk-form-item term="交易类型" :validateFor="docDef.docType" message="请输入4个字符的交易类型" required len :min="4" :max="4">
                {{docDef.docType}} | {{docDef.docClassify}}
                <a-input v-if="routeParams.mode==='create'"
                         size="small"
                         v-model="docDef.docType"
                         placeholder="请输入以X、Y、Z开头的4个字符的交易类型"
                         slot="edit"
                         :maxLength="4"
                         allowClear
                         @blur="()=>{docDef.docType=docDef.docType && docDef.docType.toUpperCase()}"
                         style="width: 280px" />
            </nk-form-item>
            <nk-form-item term="交易类型描述" :validateFor="docDef.docName" message="请输入交易类型描述" required len :max="20" lenMessage="交易类型描述1-20个字">
                {{docDef.docName}}
                <a-input size="small"
                         v-model="docDef.docName"
                         placeholder="请输入20字以内的交易类型描述"
                         slot="edit" allowClear
                         style="width: 300px"></a-input>
            </nk-form-item>
            <nk-form-item term="有效期限" :validateFor="[docDef.validFrom,docDef.validTo]" required message="请输入有效期限">
                {{docDef.validFrom}}-{{docDef.validTo}}
                <div slot="edit">
                    <a-range-picker size="small"
                                    :value="validDate"
                                    :disabled-date="disabledDate"
                                    @change="validDateChange"/>
                    <a-button type="link" @click="validDateLongTerm">长期有效</a-button>
                </div>
            </nk-form-item>
            <nk-form-item term="单据处理程序" :validateFor="docDef.refObjectType" required message="请选择单据处理程序">
                <nk-script-label :key="docDef.refObjectType" :value="docDef.refObjectType"></nk-script-label>
                <a-select size="small" v-model="docDef.refObjectType"
                          placeholder="请选择单据处理程序"
                          style="width: 300px" slot="edit"
                          @change="refObjectTypeChange"
                >
                    <a-select-option v-for="item in docOptions.docProcessors" :key="item.key">{{item.name}}</a-select-option>
                </a-select>
            </nk-form-item>
            <nk-form-item term="业务主键规则">
                {{docDef.businessKeySpEL}}
                <nk-sp-el-editor slot="edit" v-model="docDef.businessKeySpEL" style="width: 280px;"></nk-sp-el-editor>
            </nk-form-item>
            <nk-form-item term="开发">Bean</nk-form-item>
            <nk-form-item term="修订">Bean</nk-form-item>
            <nk-form-item term="更新时间">{{docDef.updatedTime | nkDatetimeFriendly}}</nk-form-item>
            <nk-form-item term="版本">{{docDef.version}}</nk-form-item>
            <nk-form-item term="状态">{{docDef.state}}</nk-form-item>
        </nk-form>
    </a-card>
</template>

<script>
import moment from "moment";

export default {
    props:{
        editMode:Boolean,
        docDef:Object,
        docOptions:Object,
        card:Object
    },
    data(){
        return {
            routeParams:{},
        }
    },
    computed:{
        validDate(){
            return [
                this.docDef.validFrom&&moment(this.docDef.validFrom,'YYYYMMDD'),
                this.docDef.validTo&&moment(this.docDef.validTo,'YYYYMMDD')
            ];
        }
    },
    created() {
        this.routeParams = Object.assign({},this.$route.params);
    },
    methods:{
        disabledDate(current) {
            return current.isBefore('2000-01-01') && current.isAfter('2099-12-31');
        },
        validDateChange(e){
            this.$set(this.docDef,"validFrom",  e[0]&&e[0].format("YYYYMMDD"));
            this.$set(this.docDef,"validTo",    e[1]&&e[1].format("YYYYMMDD"));
        },
        validDateLongTerm(){
            this.$set(this.docDef,"validFrom",  "20000101");
            this.$set(this.docDef,"validTo",    "20991231");
        },
        refObjectTypeChange(){
            //const process = this.options.docProcessors.find(item=>item.key===e);
        }
    }
}
</script>

<style scoped>

</style>