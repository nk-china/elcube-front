
import './apps/theme.less';
import './apps/theme.scss';
import "./apps/less/datav.theme.nk1.less";

import ts5 from './apps'

import Doc  from './modules/docengine';
import Task from './modules/task';
import Data from './modules/dataengine';

 ts5.use(Doc)
    .use(Task)
    .use(Data,{
        themes:[{
            value:'default',label:'默认'
        },{
            value:'nk1',label:'科技'
        }]
    })
    .run({
        appName: "TS5统一开发平台",
        logo:       undefined,
        loginPage:  undefined,
        defaultPage:undefined,
        enableSfc:  false,
    })
    .then(({Vue,options})=>{
        new Vue(options).$mount('#app');
    })

