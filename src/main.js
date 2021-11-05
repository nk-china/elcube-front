import { NKStarter } from './boot';
import NkPageDefault from "./pages/NkPageDefault";
import NkLogo from "./components/NkLogo";
import './boot/theme.less';
import "./boot/datav.theme.nk1.less";

NKStarter({
    loginPage:  undefined,
    defaultPage:NkPageDefault,
    logo:       NkLogo,
    appName:    "TS5统一开发平台",
    dataV:      {
        themes:[{
            value:'default',label:'默认'
        },{
            value:'nk1',label:'科技'
        }]
    }
}).then(({Vue,App,NkRouter,NkVuexStore,i18n})=>{
    new Vue({
      router  : NkRouter([]),
      store   : NkVuexStore({}),
      render  : h => h(App),
      i18n
    }).$mount('#app');
}).catch(()=>{
});

