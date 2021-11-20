
import './apps/theme.less';
import './apps/theme.scss';
import "./apps/less/datav.theme.nk1.less";

import ts5 from './apps'

import Doc  from './modules/docengine';
import Task from './modules/task';
import Data from './modules/dataengine';

 ts5.use(Doc)
    .use(Task)
    .use(Data)
    .run()
    .then(({Vue,options})=>{
        new Vue(options).$mount('#app');
    })

// NKStarter({
//     appName:    "TS5统一开发平台",
//     dataV:      {
//         themes:[{
//             value:'default',label:'默认'
//         },{
//             value:'nk1',label:'科技'
//         }]
//     }
// }).then(({Vue,App,NkRouter,NkVuexStore,i18n})=>{
//     new Vue({
//       router  : NkRouter([]),
//       store   : NkVuexStore({}),
//       render  : h => h(App),
//       i18n
//     }).$mount('#app');
// }).catch(()=>{
// });

