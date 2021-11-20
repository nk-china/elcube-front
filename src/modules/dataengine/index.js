
import DataV from "@/modules/dataengine/StateDataV";

import NkCardDataMapReduce from "./cards/NkCardDataMapReduce";
import NkCardDataMapReduceDef from "./cards/NkCardDataMapReduceDef";
import NkPageDataDiscoverX from "./pages/NkPageDataDiscoverX";
import NkPageDataVisualize from "./pages/NkPageDataVisualize";
import NkPageDataView from "./pages/NkPageDataView";
import NkPageDataTable from "../kernel/pages/NkPageDataTable";
import NkPageDataSmartTable from "./pages/NkPageDataSmartTable";


function install(Vue){
    Vue.component("NkCardDataMapReduce",NkCardDataMapReduce);
    Vue.component("NkCardDataMapReduceDef",NkCardDataMapReduceDef);
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