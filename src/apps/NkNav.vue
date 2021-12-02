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
                        <a-icon :type="menu.icon"/>
                        <span>{{menu.title}}</span>
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
                        </a-menu-item>
                    </template>
                </a-sub-menu>
                <a-divider v-else-if="menu.url==='-'" class="divider" :key="menu.menuId"></a-divider>
                <a-menu-item v-else :key="menu.url">
                    <a-icon :type="menu.icon"/>
                    <span>{{menu.title}}</span>
                </a-menu-item>
            </template>
        </a-menu>
        <a ref="link" target="_blank" v-show="false" />
    </div>
</template>

<script>
export default {
    name: "NkNav",
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
</style>
