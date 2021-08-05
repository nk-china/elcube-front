import AuthUtils from "./AuthUtils"
import NkLogin from "../layout/NkLogin";
import NkLayout from "../layout/NkLayout";
import NkNotFound from "../layout/NkNotFound";
import NkDefault from "../pages/NkPageDefault";
import NkMe from "../layout/NkMe";
import NkApi from "../layout/NkApi";

export default function(VueRouter,moduleRoutes,loginPage,defaultPage) {

    let routes = [
      {
        path: '*',
        redirect: '/apps/notfound'
      },
      {
        path: '/',
        component: loginPage || NkLogin,
        meta: {
          title: '登陆',
          ignoreAuth : true
        }
      },
      {
        name: '首页',
        path: '/apps',
        component: NkLayout,
        redirect: '/apps/default',
        children:[
          {
            name: '欢迎页',
            path: '/apps/default',
            component: defaultPage || NkDefault,
            closable :false,
            meta: {
              title: '欢迎页'
            },
          },
          {
            name: '个人中心',
            path: '/apps/me',
            component: NkMe,
            meta: {
              title: '个人中心'
            },
          },
          {
            name: '页面没有找到',
            path: 'notfound',
            component: NkNotFound,
            meta: {
              title: '页面没有找到'
            },
          },
          {
            name: 'Api 文档',
            path: 'apidoc',
            component: NkApi,
            meta: {
              title: 'Api 文档'
            }
          },
          ...moduleRoutes
        ]
      }
    ];

    const router = new VueRouter({
      mode: 'hash',
      base: '/',
      routes,
      scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition
        } else {
          return { x: 0, y: 0 }
        }
      }
    });

    function updateMeta(to){
      let title = (to.meta&&to.meta.title)||to.name;
      if (title) {
        const titles = document.getElementsByTagName("title");
        document.title = title + '-' + ((titles && titles[0] && titles[0].getAttribute("title"))||'交易金融管理系统');
      }
    }

    router.beforeEach((to, from, next) => {

      if (to.meta.ignoreAuth){
        // 跳转到登陆
        next();
        updateMeta(to);
      }else{
        let state = AuthUtils.state();
        if(state.authed){
          // 如果用户已登陆
          if(to.path==='/'){
            next({
              path: '/apps'
            })
          }else{
            next();
            updateMeta(to);
          }
        }else{
          // 如果用户未登陆
          router.app.$http.refreshToken(from,next)
              .then(()=>{
                next();
                updateMeta(to);
              })
        }
      }
    });

    return router;
  }



