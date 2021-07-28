import Vue from 'vue';

import {NkModule,NkRouter,NkVuexStore,App,NkVueLoader} from './boot';
import NkPageDefault from "./dashboards/NkPageDefault";

Vue.use(NkModule);

NkVueLoader.reloadVueResources()
    .then(()=>{
        new Vue({
          router  : NkRouter([],undefined,NkPageDefault),
          store   : NkVuexStore({}),
          render  : h => h(App)
        }).$mount('#app');
    });

