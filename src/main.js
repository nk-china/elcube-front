/*
 * 	This file is part of ELCube.
 *	ELCube is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	ELCube is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
 */

import './apps/theme.less';
import './apps/theme.scss';
import "./apps/less/datav.theme.nk1.less";

import ELCube  from './apps'
import Doc  from './modules/docengine'
import Task from './modules/task'
import Data from './modules/dataengine'


ELCube
    .use(Doc)
    .use(Task)
    .use(Data,{
        themes:[{
            value:'default',label:'默认'
        },{
            value:'nk1',label:'科技'
        }]
    })
    .run({
        appName: "ELCube企业级快速开发模型",
        logo:       undefined,
        loginPage:  undefined,
        defaultPage:undefined,
        enableSfc:  true,
        iconFont:{
            "icon-font" : '//at.alicdn.com/t/font_3269017_5nvy3d0b5a8.js'
        }
    })
    .then(({Vue,options})=>{
        new Vue(options).$mount('#app');
    })

