import {App,NkRouter,NkVuexStore,reloadVueResources,i18n} from './boot';
import NkPageDefault from "./dashboards/NkPageDefault";
import './boot/css/nk.less';

reloadVueResources()
    .then(({Vue})=>{
        new Vue({
          router  : NkRouter([],undefined,NkPageDefault),
          store   : NkVuexStore({}),
          render  : h => h(App),
          i18n
        }).$mount('#app');
    }).catch(()=>{
    });

