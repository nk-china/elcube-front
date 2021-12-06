<!--
	This file is part of ELCube.
	ELCube is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCube is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <nk-page-layout class="mini" title="个人中心">
        <nk-card title="基本信息">
            <nk-form :col="1">
                <nk-form-item term="账号">{{ user.username }}</nk-form-item>
                <nk-form-item term="姓名">{{ user.realname }}</nk-form-item>
                <nk-form-item term="有效期">{{ user.validFrom }}-{{user.validTo}}</nk-form-item>
                <nk-form-item term="注册时间">{{ user.createdTime | nkDatetime}}</nk-form-item>
            </nk-form>
        </nk-card>
        <nk-card title="修改密码">
            <nk-form :col="1" ref="password" :edit="true">
                <nk-form-item term="当前密码" :validate-for="password" :required="true" message="原始密码不能为空">
                    <a-input slot="edit" size="small" type="password" style="width: 300px" v-model="password"></a-input>
                </nk-form-item>
                <nk-form-item term="新密码" :validate-for="newPassword" :required="true" message="原始密码不能为空">
                    <a-input slot="edit" size="small" type="password" style="width: 300px" v-model="newPassword"></a-input>
                </nk-form-item>
                <nk-form-item term="确认密码" :validate-for="confirmPassword" :validator="theSameOfPassword" :required="true" message="原始密码不能为空" validatorMessage="两次密码不一致">
                    <a-input slot="edit" size="small" type="password" style="width: 300px" v-model="confirmPassword"></a-input>
                </nk-form-item>
                <div style="padding-left: 120px;"><a-button size="small" type="primary" @click="changePassword">修改</a-button></div>
            </nk-form>
        </nk-card>
        <nk-card title="授权">
            <vxe-table
                auto-resize
                size="mini"
                border=inner
                resizable
                highlight-hover-row
                class="me-perms-table"
                header-cell-class-name="headerCellClassName"
                :row-class-name="rowClassName"
                :data="user.authorities">
                <vxe-table-column   title="权限" field="authority"                width="15%"/>
                <!--                                <vxe-table-column   title="资源" field="permResource"             width="15%"/>-->
                <!--                                <vxe-table-column   title="操作" field="permOperate"              width="15%"/>-->
                <vxe-table-column   title="数据限制" field="limitIds"                 width="10%">
                    <template v-slot="{ row }">
                        <span v-if="row.limits">
                            {{row.limits}}
                        </span>
                        <a v-else-if="row.limitIds&&row.limitIds.length" @click="showLimits(row)">
                            {{row.limitIds&&row.limitIds.length}}条限制
                        </a>
                    </template>
                </vxe-table-column>
                <vxe-table-column   title="操作限制" field="subPerm"           width="30%">
                    <template v-slot="{ row }">
                        {{row.subPerm&&"有限制"}}
                    </template>
                </vxe-table-column>
                <vxe-table-column   title="Level" field="level"                   width="10%">
                    <template v-slot="{ row }">
                        {{row.level.toString(16)}}
                    </template>
                </vxe-table-column>
                <vxe-table-column   title="授权来源">
                    <template v-slot="{ row }">
                        {{row.fromGroupDesc}}-{{row.fromPermissionDesc}}
                    </template>
                </vxe-table-column>
            </vxe-table>
        </nk-card>
    </nk-page-layout>
</template>

<script>
import {mapGetters} from "vuex";
import qs from 'qs';
import AuthUtils from "./js/AuthUtils";
export default {
    name: "NkMe",
    data(){
        return {
            password:undefined,
            newPassword:undefined,
            confirmPassword:undefined,
            limits:undefined
        }
    },
    computed:{
        ...mapGetters('User',[
            'user'
        ])
    },
    created() {
    },
    methods:{
        changePassword(){
            if(!this.$refs.password.hasError()){
                this.$http.post("/api/authentication/change_password",qs.stringify({
                    oldPassword:this.password,
                    newPassword:this.newPassword
                })).then(()=>{
                    AuthUtils.clear();
                    this.$success({
                        title: '提示',
                        keyboard:false,
                        // JSX support
                        content: "密码已修改，请重新登陆",
                        onOk(){
                            location.reload();
                        },
                        onCancel(){
                            location.reload();
                        }
                    });
                }).catch(()=>{
                    this.password=undefined;
                    this.newPassword=undefined;
                    this.confirmPassword=undefined;
                });
            }
        },
        theSameOfPassword(){
            return !this.confirmPassword || this.newPassword!==this.confirmPassword;
        },
        showLimits(row){
            this.$http.postJSON("/api/authentication/info/limits",row.limitIds)
                .then(res=>{
                    this.$set(row,'limits',res.data.map(x=>x.limitDesc).join(','));
                    // row.limits = res.data.map(x=>x.limitDesc).join(',');
                })
        },
        rowClassName({ row }){
            if(row.disabled){
                return "disabled"
            }
        }
    }
}
</script>

<style scoped>
    ::v-deep.me-perms-table tr.disabled {
        background-color: #eee;
        text-decoration:line-through;
    }
</style>
