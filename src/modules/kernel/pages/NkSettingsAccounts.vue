<!--
	This file is part of ELCard.
	ELCard is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCard is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <nk-query-layout
        ref="layout"
        title="用户账号"
        :search-items-default="searchItemsDefault"
        :dataTableColumns="columns"
        :selectable="false"
        :init-rows="10"
        @change="search"
    >
        <a-button-group slot="action">
            <a-button type="primary" @click="create">新建</a-button>
        </a-button-group>
    </nk-query-layout>
</template>

<script>
import NkUtil from "@/utils/NkUtil";

export default {
    computed:{
        searchItemsDefault(){
            return [
                {
                    name:'搜索',
                    field:'keyword',
                    component:'nk-search-options-text',
                    placeholder:'请输入关键字'
                },
            ]
        },
        columns(){
            return [
                { type: 'seq',          title: '#',      width: '4%', },
                { field: 'username',    title: '用户名',   width: '12%', sortable:true, params:{ orderField: 'USERNAME'}},
                { field: 'realname',    title: '真实姓名', width: '18%', sortable:true, params:{ orderField: 'REALNAME'}},
                { field: 'validFrom',   title: '有效期自', width: '10%', sortable:true, params:{ orderField: 'VALID_FROM'}},
                { field: 'validTo',     title: '有效期至', width: '10%', sortable:true, params:{ orderField: 'VALID_TO'}},
                { field: 'locked',      title: '锁定状态', width: '10%', sortable:true, params:{ orderField: 'LOCKED'}, formatter: this.locked },
                { field: 'createdTime', title: '注册时间', width: '12%', sortable:true, params:{ orderField: 'CREATED_TIME'}, formatter: 'nkDatetimeFriendly' },
                { field: 'updatedTime', title: '更新时间', width: '12%', sortable:true, params:{ orderField: 'UPDATED_TIME'}, formatter: 'nkDatetimeFriendly' },
                {                       title: 'ACTION',
                    slots: { default: ({row},h) => {
                            return [h(
                                'router-link',
                                {
                                    props:{to: `/apps/settings/auth/accounts/detail/${row.username}`}
                                },
                                "详情"
                            )]
                        }}
                },
            ];
        }
    },
    methods:{
        locked({row}){
            return row.locked ? '锁定' : '';
        },
        search(params){
            this.$http.post("/api/settings/auth/accounts/list",NkUtil.translateParamsToQueryString(params))
                .then((res)=>{
                    if(this.$refs.layout)
                        this.$refs.layout.setData(res.data)
                });
        },
        create(){
            this.$router.push("/apps/settings/auth/accounts/create/@")
        }
    }
}
</script>

<style scoped>

</style>