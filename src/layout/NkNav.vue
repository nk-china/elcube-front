<template>
    <div>
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
                    <a-icon :type="menu.icon" />
                    <span>{{menu.title}}</span>
                </span>
                    <template v-for="(sub) in menu.children">
                        <a-sub-menu v-if="sub.sub" :key="sub.url">
                        <span slot="title">
                            <span>{{sub.title}}</span>
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
                    <a-icon :type="menu.icon" />
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
                this.$router.push(e.key)
            }
        },
    }
}
</script>

<style scoped lang="scss">
.divider{
    min-width: 80%;width:80%; margin: 16px auto;background-color: rgba(255, 255, 255, 0.2);
}
::v-deep.ant-skeleton{
    .ant-skeleton-content .ant-skeleton-title,
    .ant-skeleton-content .ant-skeleton-paragraph > li{
        background: rgba(255, 255, 255, 0.2) !important;
    }
}
</style>
