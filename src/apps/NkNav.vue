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
    <div class="nk-menu">
        <a-menu
            :default-selected-keys="['1']"
            :default-open-keys="[]"
            mode="inline"
            theme="dark"
            :selectedKeys="selectedKeys"
            :inline-collapsed="collapsed"
            @click="menuSelected"
        >
            <template v-for="(menu) in menus">

                <a-sub-menu v-if="menu.children" :key="menu.url">
                    <span slot="title">
                        <nk-nav-icon :type="menu.icon"/>
                        <span>{{menu.title}}</span>
                        <a-badge :count="menu.total"
                                 :offset="[5,0]"
                                 :number-style="{
                                    border: 'none',
                                    boxShadow: 'none',
                                    backgroundColor: '#fa541c'
                                 }"/>
                        <a-tag v-if="!collapsed && menu.tag" color="#fa541c">{{menu.tag}}</a-tag>
                    </span>
                    <template v-for="(sub) in menu.children">
                        <a-sub-menu v-if="sub.sub" :key="sub.url">
                            <span slot="title">
                                {{sub.title}}
                            </span>
                            <template v-for="(s) in sub.sub">
                                <a-menu-item :key="s.url">
                                    {{s.title}}
                                </a-menu-item>
                            </template>
                        </a-sub-menu>
                        <a-menu-item v-else :key="sub.url">
                            {{sub.title}}
                            <a-tag v-if="!collapsed && sub.badgeOption" color="#fa541c">{{sub.badgeOption}}</a-tag>
                        </a-menu-item>
                    </template>
                </a-sub-menu>
                <a-divider v-else-if="menu.url==='-'" class="divider" :key="menu.menuId"></a-divider>
                <a-menu-item v-else :key="menu.url">
                    <nk-nav-icon :type="menu.icon"/>
                    <span>{{menu.title}}</span>
                    <a-badge v-if='menu.total'
                             :count="menu.total"
                             :offset="[5,0]"
                             :dot="collapsed"
                             :number-style="{
                                border: 'none',
                                boxShadow: 'none',
                                backgroundColor: '#fa541c'
                             }"/>
                    <a-tag v-if="!collapsed && menu.tag" color="#fa541c">{{menu.tag}}</a-tag>
                </a-menu-item>
            </template>
        </a-menu>
        <a ref="link" target="_blank" v-show="false" />
    </div>
</template>

<script>

import NkNavIcon from "@/apps/NkNavIcon";
export default {
    name: "NkNav",
    components:{
        NkNavIcon
    },
    props:{
        activePage: String,
        collapsed: Boolean,
    },
    data(){
        return {
            menus: []
        }
    },
    created() {
        this.$http.get('/api/webapp/menus').then(res=>{
            this.menus = res.data;
            const badges = this.menus.filter(m=>m.badgeOption);
            if(badges.length){
                this.refresh(badges);
                setInterval(()=>{
                    this.refresh(badges);
                },1000 * 5 * 60);
            }

            const l = document.getElementById("startup-loading");if(l)l.remove();
        });
    },
    computed: {
        selectedKeys(){

            let hashs = []
            let page = ''
            this.activePage.split('/').forEach(s=>{
                if(s){
                    page = page+'/'+s
                    hashs.push(page)
                }
            })

            return hashs
        }
    },
    methods:{
        menuSelected(e){
            if(e.key.startsWith("http://")||e.key.startsWith("https://")){
                this.$refs.link.href=e.key;
                this.$refs.link.click();
            }else if(this.$route.fullPath!==e.key) {
                try{
                    this.$router.push(e.key)
                }catch (e){
                    //eslint-disable-line
                }
            }
        },
        refresh(badges){
            badges.forEach(m=>{
                try{
                    const options = JSON.parse(m.badgeOption);
                    this.$http.postJSON(options.url,options.body).then(res=>{
                        this.$set(m,'total',res.data.total)
                        console.log(m)
                    });
                }catch (e){
                    this.$set(m,'tag',m.badgeOption)
                }
            });
        }
    }
}
</script>

<style scoped lang="less">
.divider{
    min-width: 80%;width:80%; margin: 16px auto;background-color: rgba(255, 255, 255, 0.2);
}
::v-deep.ant-skeleton{
    .ant-skeleton-content .ant-skeleton-title,
    .ant-skeleton-content .ant-skeleton-paragraph > li{
        background: rgba(255, 255, 255, 0.2) !important;
    }
}
::v-deep.nk-menu {
    .ant-menu-item,.ant-menu-submenu,.ant-menu-submenu-title{
        font-size: 13px;

        i{
            font-size: 13px;
        }
    }
}
::v-deep .ant-badge-count{
    min-width: 15px;
    height: 15px;
    line-height: 14px;
    padding: 0 2px;
}
::v-deep .ant-tag{
    line-height: 14px;
    padding: 0 2px;
    margin-left: 4px;
    font-size: 10px;
    transform: scale(0.8);
}
</style>
