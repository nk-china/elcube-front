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

import DataV from "@/modules/dataengine/StateDataV";

import NkCardDataMapReduce from "./cards/NkCardDataMapReduce";
import NkCardDataMapReduceDef from "./cards/NkCardDataMapReduceDef";
import NkPageDataDiscoverX from "./pages/NkPageDataDiscoverX";
import NkPageDataVisualize from "./pages/NkPageDataVisualize";
import NkPageDataView from "./pages/NkPageDataView";
import NkPageDataTable from "../kernel/pages/NkPageDataTable";
import NkPageDataSmartTable from "./pages/NkPageDataSmartTable";


function install(Vue, options){
    Vue.component("NkCardDataMapReduce",NkCardDataMapReduce);
    Vue.component("NkCardDataMapReduceDef",NkCardDataMapReduceDef);

    options = Object.assign({themes:[{
            value:'default',label:'默认'
        }]},options)

    DataV.state.themes = options.themes;
}

const routes = [
    {
        name: "数据",
        path: 'data',
        children: [
            {
                name: "发现",
                path: 'discover',
                component: NkPageDataDiscoverX,
                meta:{
                    title: "数据发现",
                }
            },
            {
                name: "可视化",
                path: 'visualize',
                component: NkPageDataVisualize,
                meta:{
                    title: "数据可视化",
                },
                children: [
                    {
                        name: "数据视图",
                        path: 'view/:id',
                        component: NkPageDataView,
                        meta:{
                            title: "数据视图",
                        }
                    },
                ]
            },
            {
                name: "数据报表",
                path: 'v/:id',
                component: NkPageDataTable,
            },
            {
                name: "智能报表",
                path: 's/:id',
                component: NkPageDataSmartTable,
            }
        ]
    }
]

export default {
    install,
    routes,
    stores:{DataV}
}