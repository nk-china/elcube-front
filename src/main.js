
import './apps/theme.less';
import './apps/theme.scss';
import "./apps/less/datav.theme.nk1.less";

import Easis  from './apps'
import Doc  from './modules/docengine'
import Task from './modules/task'
import Data from './modules/dataengine'


 Easis.use(Doc)
    .use(Task)
    .use(Data,{
        themes:[{
            value:'default',label:'默认'
        },{
            value:'nk1',label:'科技'
        }]
    })
    .run({
        appName: "Easis企业级快速开发模型",
        logo:       undefined,
        loginPage:  undefined,
        defaultPage:undefined,
        enableSfc:  true,
    })
    .then(({Vue,options})=>{
        new Vue(options).$mount('#app');
    })

