<template>
    <a-spin :spinning="loading" wrapperClassName="layout-spinning">
        <a-layout class="nk-layout-full">
            <a-layout-sider v-model="collapsed" :trigger="null" collapsible="collapsible" class="nk-layout-sider" width="256" :collapsed-width="60">
                <component :is="logo"></component>
                <nk-nav :active-page="activePage" :collapsed="collapsed"></nk-nav>
            </a-layout-sider>
            <a-layout class="nk-layout-right">
                <a-layout-header class="nk-layout-header">
                    <div>
                        <a-icon
                            class="trigger"
                            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                            @click="() => (collapsed = !collapsed)"
                        ></a-icon>
                        <span v-if="env" class="trigger" style="padding-left: 0;color: #ff7e79;user-select: none;cursor: default;">{{env}}</span>
                    </div>
                    <div>
                    </div>
                    <div class="nk-user">
                        <nk-debug-panel  style="margin-right: 20px;" />
                        <a-dropdown :trigger="['click']">
                            <div class="ant-dropdown-link" @click="e => e.preventDefault()" >
                                <a-avatar class="a-avatar"  size="small">
                                    <a-icon slot="icon" type="user" ></a-icon>
                                </a-avatar>
                                {{ user.realname || user.username }}
                            </div>
                            <a-menu slot="overlay">
                                <a-menu-item key="0">
                                    <router-link to="/apps/me">个人中心</router-link>
                                </a-menu-item>
                                <a-menu-item key="1">
                                    <a @click="doSetDocumentPage('nkdn://')">文档中心</a>
                                </a-menu-item>
                                <a-menu-item key="3">
                                    <router-link to="/apps/apidoc">系统API</router-link>
                                </a-menu-item>
                                <a-menu-item key="2">
                                    <a @click="logout()">安全退出</a>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </div>
                </a-layout-header>
                <a-layout-content class="nk-layout-content" id="tfms">
                    <nk-tabs :items="pages"
                             :active-path="activePage"
                             @change="tabChanged"
                             @close="tabClose"
                             @closeAll="tabCloseAll"
                             @closeOthers="tabCloseAll"
                             @sort="tabSort"
                             @item-refresh="tabItemRefresh"
                    ></nk-tabs>
                    <component v-for="(item) in pages"
                               v-show="item.path===activePage"
                               :key="item.path"
                               :is="item.component"
                               ref="pages"
                               @close="tabPanelClose(item)"
                               @replace="tabReplace(item,$event)"
                               @setTab="tabUpdate(item,$event)"
                               class="nk-layout-content-component">
                    </component>
                </a-layout-content>
            </a-layout>
            <a-layout-sider v-if="layoutConfig.helperVisible" width="25%">
                <nk-helper />
            </a-layout-sider>
        </a-layout>

        <a-modal :visible="reLogin"
                 centered
                 title="安全验证"
                 okText="确定"
                 :cancelText="logoutText"
                 width="400px"
                 :maskClosable="false"
                 :maskStyle="maskStyle"
                 @cancel="cancel()"
                 :okButtonProps="{props: {disabled:!password}}"
                 @ok="login({key:'Enter'})"
                 :confirm-loading="logging"
        >
            <a-alert :message="reLoginMessage||'由于长时间未操作，需要您重新验证身份'" banner />
            <a-alert v-if="error" type="error" :message="error.data" banner />
            <a-form style="margin-top: 20px;">
                <a-form-item>
                    <a-input :placeholder="user.username" disabled :defaultValue="user.username">
                        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-input type="password" placeholder="Password" v-model="password" v-myfocus @keydown="login">
                        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                    </a-input>
                </a-form-item>
            </a-form>
        </a-modal>
        <nk-error-modal />
    </a-spin>
</template>

<script>

import {mapState, mapActions, mapGetters, mapMutations} from 'vuex';
import NkTabs from "./NkLayoutTabs";
import NkNav from "./NkNav";
import NkHelper from "./components/NkHelper";
import NkDebugPanel from "./NkDebugPanel";
import AuthUtils from "./js/AuthUtils";

export default {
    components:{
        NkTabs,
        NkNav,
        NkHelper,
        NkDebugPanel
    },
    directives:{
        myfocus: {
            inserted: function (el) {
                if(el.lastChild){
                    el.lastChild.focus();
                }
            }
        }
    },
    data() {
        return {
            collapsed: false,
            activePage: '',
            pages: [],
            pageCaches:{},
            oldRoute: undefined,
            env: undefined,

            logging:false,
            password:undefined,
            error:undefined,

            maskStyle:{
                'background-color':'rgb(51, 51, 51,0.45)',
                'backdrop-filter':'blur(3px)'
            }
        };
    },
    computed:{
        ...mapState('UI',[
            'loading','logo','errors',
        ]),
        ...mapState('Debug',[
            'debugId'
        ]),
        ...mapState('NkDoc',[
            'layoutConfig'
        ]),
        ...mapState('User',[
            'reLoginMessage'
        ]),
        ...mapGetters('User',[
            'user','reLogin','reLoginTime'
        ]),
        logoutText(){
            if(this.reLoginTime)
                return '退出('+this.reLoginTime+')';
            return "取消";
        }
    },
    watch: {
        '$route': function (newRoute, oldRoute) {
            this.addPage(newRoute, oldRoute);
        }
    },
    created(){
        this.loadUserinfo();

        // 添加首页
        let defaultPage = this.$router.options.routes[2].children[0];
        defaultPage.route = defaultPage.path
        this.pageCaches[defaultPage.path]=defaultPage;
        this.pages.push(defaultPage);
    },
    mounted() {
        // 添加当前路由页面
        this.addPage(this.$route);
    },
    methods:{
        ...mapMutations('User',[
            'setUser','clearReLogin','submitLogin'
        ]),
        ...mapMutations('NkDoc',[
            'setLayoutConfig'
        ]),
        ...mapActions('NkDoc',[
            'doSetDocumentPage'
        ]),
        reindex(){
            this.$http.post("/api/sys/utils/search/engine/reindex");
        },
        clearbuf(){
            this.$http.post("/api/sys/utils/redis/flush");
        },
        caleBreach(){
            this.$http.post("/api/sys/utils/payment/breach");
        },
        loadUserinfo(){
            this.$http.get("/api/authentication/info")
                .then((res)=>{
                    this.setUser(res.data);
                });
            this.$http.get("/api/webapp/env")
                .then(res=>{
                    this.env = res.data;
                })

            if(!localStorage.getItem("$NK-document-flag")){
                this.openNotification();
                this.doSetDocumentPage("nkdn://");
                //localStorage.setItem("$NK-document-flag","1");
            }

        },
        openNotification() {
            const key = `open${Date.now()}`;
            this.$notification.open({
                message: '欢迎使用Easis',
                description:
                    '检测到你是初次使用系统，已自动为你打开文档中心，祝您工作愉快',
                duration: 10,
                btn: h => {
                    return h(
                        'a-button',
                        {
                            props: {
                                type: 'primary',
                            },
                            on: {
                                click: () => {
                                    this.$notification.close(key);
                                    localStorage.setItem("$NK-document-flag","1");
                                },
                            },
                        },
                        '下次不再弹出',
                    );
                },
                key,
                onClose: close,
            });
        },
        addPage(route,old){
            if (!this.pageCaches[route.fullPath]) {

                const matched = route.matched;
                const page = {
                    name: (route.meta && route.meta.title) || 'Loading...',
                    path: route.fullPath,
                    route: route,
                    component:matched[matched.length-1].components.default,
                    draggable:true,
                };
                this.pageCaches[route.fullPath]=page;

                if(old){
                    let index = this.pages.indexOf(this.pageCaches[old.fullPath]);
                    index = index > -1 ? index : this.pages.indexOf(this.pageCaches[this.activePage]);
                    this.pages.splice(index+1,0,page);
                }else{
                    this.pages.push(page);
                }
            }
            let prev = this.$refs.pages.find(i=>i.$vnode.key===this.activePage);
            if(prev && prev['nk$hide']){
                this.$nextTick(()=>{
                    prev['nk$hide']();
                })
            }
            this.activePage = route.fullPath;
            let page = this.$refs.pages.find(i=>i.$vnode.key===this.activePage);
            if(page && page['nk$show']){
                this.$nextTick(()=>{
                    page['nk$show']();
                })
            }
        },
        tabChanged(page){
            this.$router.push(page.route)
        },
        tabClose(item, to){

            const targetLink = this.pageCaches[item.path];
            const targetIndex = this.pages.indexOf(targetLink);

            // 移除页面缓存
            this.pages.splice(targetIndex,1);
            delete this.pageCaches[item.path];

            // 如果移除的是活动页面
            if(!to && this.activePage === item.path){
                //this.tabChanged(to || this.pages[targetIndex-1].path)
                location.replace(`${location.href.toString().replace(location.hash, '')}#${this.pages[targetIndex-1].path}`);
            }
        },
        tabCloseAll(target){

            let length = this.pages.length;
            for(let i=1;i<length;i++){
                let item = this.pages[length-i];
                if(target!==item){
                    this.tabClose(item,true);
                }
            }

            if((!target || this.activePage !== target.path) && this.activePage !== this.pages[0].path){
                //this.tabChanged(this.pages[0].path)
                location.replace(`${location.href.toString().replace(location.hash, '')}#${this.pages[0].path}`);
            }
        },
        tabPanelClose(item){
            this.tabClose(item, true);
            if(this.oldRoute) {
                location.replace(`${location.href.toString().replace(location.hash, '')}#${this.oldRoute.fullPath}`);
            }else{
                history.go(-1);
            }
        },
        tabReplace(item, path){
            // setTimeout(()=>{
                this.activePage = this.pages[this.pages.indexOf(item)-1].path;
                this.tabClose(item, true);
                location.replace(`${location.href.toString().replace(location.hash, '')}#${path}`);
            // },100)
        },
        tabUpdate(item,options){
            if(options){
                if(typeof options==='string'){
                    item.name = options;
                }else{
                    if(options.name){
                        item.name = options.name;
                    }
                    if(options.confirm){
                        item.confirm = options.confirm;
                    }
                }
            }
        },
        tabSort(items){
            this.pages = items;
        },
        tabItemRefresh(item){
            new Promise((resolve)=>{
                if(this.debugId){
                    this.$sfc.reloadVueResources().then((e)=>{
                        this.$message.info(`Debug: 重新载入Vue组件${e.count}个`)
                        resolve();
                    }).catch((e)=>{
                        this.$message.error(`Debug: 重新载入Vue组件失败 `+e.message)
                    });
                }else{
                    resolve();
                }
            }).then(()=>{
                let c = item.component;
                item.component = undefined;
                this.$nextTick(()=>{
                    item.component=c;
                });
            });
        },
        dragstart(){
        },
        cancel(){
            if(AuthUtils.state().authed){
                this.clearReLogin();
            }else{
                this.logout();
            }
        },
        logout(){
            this.$http.logout().then(()=>{
                this.$router.push("/");
            });
        },
        login(e){
            if(e.key==='Enter' && this.password){
                this.logging = true;
                this.$http.login(this.user.username,this.password)
                    .then(()=>{
                        this.error = undefined;
                        this.submitLogin();
                    }).catch((error)=>{
                        this.error = error;
                    }).finally(()=>{
                        this.logging = false;
                        this.password = undefined;
                    });
            }
        }
    }
}
</script>

<style scoped lang="less">

::v-deep.layout-spinning{
    & > div > .ant-spin{
        bottom: 0;
        max-height: inherit;
        & > .ant-spin-dot{
            position:fixed;
        }
    }
}
::v-deep {
    .nk-layout-content .nk-layout-tabs{
        .ant-tabs-bar{
            margin: 16px 24px 0;
            user-select: none;
            span{
                font-size: 13px;
            }
        }
    }
}
.nk-layout-full{
    .ant-spin.abc{
        height: calc( 100vh ) !important;
        max-height: initial !important;
        opacity: 0.7;
    }

    /*菜单展开按钮*/
    .trigger {
        font-size: 16px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color 0.3s;
    }
    .trigger:hover {
        color: #1890ff;
    }
    /*菜单栏*/
    .nk-layout-sider{
        position: relative;
        z-index: 1;
        box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
        width: 256px;
    }
    .nk-layout-sider::-webkit-scrollbar{
        display: none;
    }

    /*头部*/
    .nk-layout-header{
        height: 64px;
        background: #fff;
        padding: 0;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        display: flex;
        justify-content: space-between;

        .nk-user{
            display: flex;
            margin-right: 40px;

            ::v-deep.ant-dropdown-link{
                cursor: pointer;
            }
            ::v-deep.a-avatar{
                margin-right: 5px;
            }
        }
    }
    /*内容页*/
    .nk-layout-content{
        min-height: calc(100vh - 64px);

        ::v-deep.nk-page-layout-card + .nk-page-layout-card{
            margin-top: 24px;
        }
    }

    /* 页脚 */
    .copyright{
        text-align: center;color:#999;
    }
}
</style>

<docs>
    - markdown
</docs>
