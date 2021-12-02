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
    <nk-page-layout title="用户组" :spinning="spinning">
        <a-button-group slot="action">
            <a-button type="primary" @click="itemNew">新建</a-button>
        </a-button-group>
        <a-layout>
            <a-layout-sider theme="light" bordered>
                <a-list item-layout="horizontal" :data-source="listFilter" class="filter">
                    <a-input slot="header" placeholder="filter..." style="border: none" allow-clear v-model="filter"></a-input>
                    <a-list-item slot="renderItem"
                                 slot-scope="i"
                                 @click="itemClick(i)"
                                 :class="i.groupId===item.groupId?'selected':''">
                        {{i.groupDesc}}
                    </a-list-item>
                </a-list>
            </a-layout-sider>
            <a-layout-content>
                <a-card :title="item.groupDesc||'未选中...'" style="margin-left: 20px;"
                >

                    <a-button-group slot="extra" v-if="item.groupDesc && (!item.groupId || !item.groupId.startsWith('nk-default-'))">
                        <a-button type="primary" @click="itemUpdate">保存</a-button>
                        <a-popconfirm placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="itemRemove">
                            <template slot="title">
                                <p>确认删除 '{{item.groupDesc}}'?</p>
                            </template>
                            <a-button v-if="item.groupId">删除</a-button>
                        </a-popconfirm>
                    </a-button-group>

                    <nk-form :col="1" :edit="item.groupDesc !== undefined && (!item.groupId || !item.groupId.startsWith('nk-default-'))">
                        <nk-form-item term="描述">
                            {{item.groupDesc}}
                            <a-input slot="edit" v-model="item.groupDesc" placeholder="权限描述"></a-input>
                        </nk-form-item>
                        <nk-form-item term="权限">
                            <span v-for="d in itemPermIds" :key="d.permId">
                                {{ d }}
                            </span>
                            <a-select
                                slot="edit"
                                mode="multiple"
                                :value="itemPermIds"
                                placeholder="请选择权限"
                                style="width: 100%"
                                :filter-option="false"
                                @change="itemLimitChange"
                            >
                                <a-select-option v-for="d in perms" :key="d.permId">
                                    {{ d.permDesc }}
                                </a-select-option>
                            </a-select>
                        </nk-form-item>
                        <nk-form-item term="关联账号" v-if="item.groupId">
                            <div class="accounts">
                                <div class="a" v-for="a in item.accounts" :key="a.id">
                                    {{a.username}}
                                    <a-popconfirm v-if="!(item.groupId && item.groupId.startsWith('nk-default-') && a.id.startsWith('nk-default-'))"
                                                  placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="accountRemove(a)">
                                        <template slot="title">
                                            <p>确认移除 '{{a.username}}'?</p>
                                        </template>
                                        <a-icon type="close" />
                                    </a-popconfirm>

                                </div>
                                <a-auto-complete
                                    size="small"
                                    v-model="accountSelect"
                                    :data-source="accounts"
                                    style="width: 200px"
                                    placeholder="添加账号到用户组"
                                    @select="accountAdd"
                                    @search="accountSearch"
                                />
                            </div>
                        </nk-form-item>
                        <nk-form-item term="权限预览" v-if="item.groupId">
                            <vxe-table
                                    auto-resize
                                    size="mini"
                                    border=inner
                                    resizable
                                    highlight-hover-row
                                    style="width:100%"
                                    header-cell-class-name="headerCellClassName"
                                    :data="item.authorities">
                                <vxe-table-column   title="权限" field="authority"                width="15%"/>
<!--                                <vxe-table-column   title="资源" field="permResource"             width="15%"/>-->
<!--                                <vxe-table-column   title="操作" field="permOperate"              width="15%"/>-->
                                <vxe-table-column   title="限制" field="limitIds"                 width="10%">
                                    <template v-slot="{ row }">
                                        {{row.limitIds&&row.limitIds.length}}
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column   title="扩展属性" field="subResource"           width="30%"/>
                                <vxe-table-column   title="Level" field="level"                   width="10%">
                                    <template v-slot="{ row }">
                                        {{row.level.toString(16)}}
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column   title="权限定义源" field="fromPermissionDesc"/>
                            </vxe-table>
                        </nk-form-item>
                    </nk-form>

                </a-card>
            </a-layout-content>
        </a-layout>
    </nk-page-layout>
</template>

<script>
export default {
    name: "NkSettingsAuthgroup",
    data(){
        return {
            list:[],
            item: {},
            perms:[],
            filter: '',

            accountSelect: '',
            accounts: [],

            spinning:true
        }
    },
    created() {
        this.reload();
        this.$http.get("/api/settings/auth/perm/list")
            .then(res=>this.perms = res.data);
    },
    computed:{
        itemPermIds(){
            return this.item.permissions && this.item.permissions.map(authority=>authority.permId)
        },
        listFilter(){
            return this.list.filter((i)=>i.groupDesc.toLowerCase().indexOf(this.filter.toLowerCase())>-1);
        }
    },
    methods:{
        reload(){
            this.$http.get("/api/settings/auth/group/list")
                .then(res=>{
                    this.list = res.data;
                    if(!this.item.groupId && this.list[0]){
                        this.itemClick(this.list[0]);
                    }
                });
        },
        itemClick(e){
            this.spinning=true;
            this.$http.get("/api/settings/auth/group/detail?groupId="+e.groupId)
                .then(res=>{
                    this.item = Object.assign({permissions:undefined},res.data);
                    this.spinning=false;
                });
        },
        itemUpdate(){
            this.spinning=true;
            this.$http.postJSON("/api/settings/auth/group/update",this.item)
                .then(res=>{
                    this.item = res.data;
                    this.reload();
                    this.$message.success('保存成功', 2.5)
                    this.spinning=false;
                });
        },
        itemRemove(){
            this.$http.postJSON("/api/settings/auth/group/remove?groupId="+this.item.groupId)
                .then(()=>{
                    this.item = {};
                    this.reload();
                    this.$message.success('删除成功', 2.5)
                });
        },
        itemNew(){
            this.item = {groupDesc:"未命名用户组",permissions:undefined};
        },
        itemLimitChange(e){
            this.item.permissions=e.map(permId=>{return {permId};});
        },
        accountAdd(e){
            this.$http.post(`/api/settings/auth/group/add/account?groupId=${this.item.groupId}&accountId=${e}`)
                .then(res=>{
                    this.item = res.data;
                    this.$message.success('添加成功', 2.5)
                }).finally(()=>{
                    this.accountSelect = ''
                });
        },
        accountRemove(e){
            this.$http.post(`/api/settings/auth/group/remove/account?groupId=${this.item.groupId}&accountId=${e.id}`)
                .then(res=>{
                    this.item = res.data;
                    this.$message.success('移除成功', 2.5)
                })
        },
        accountSearch(e){
            if(e){
                this.$http.post(`/api/settings/auth/accounts?keyword=${e}`)
                    .then(res=>{
                        this.accounts = res.data.map(item=>{return {value:item.id,text:item.username}});
                        console.log(this.accounts)
                    });
            }
        },
    }
}
</script>

<style scoped lang="less">

::v-deep .ant-layout-sider{
    background: inherit;
}
.accounts{
    margin: 5px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    > .a{
        background-color:#fafafa;
        border:1px solid #e8e8e8;
        border-radius:2px;
        padding:1px 8px;
        margin-left: 5px;
        height: 24px;

        ::v-deep .anticon{
            line-height:1;
            transform: scale(0.83333333) rotate(0deg);
            cursor: pointer;
            user-select: none;
            margin-left: 2px;
            color: rgba(0, 0, 0, 0.45);
        }
    }

    ::v-deep .ant-select{
        margin-left: 5px;
    }
}
</style>
