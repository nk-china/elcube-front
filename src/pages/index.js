
import NkScriptLabel from "./doc/NkDefScriptLabel";
import NkCard from "./components/NkCard";
import NkDefCard from "./components/NkDefCard";
import NkDocSelectModal from "./components/NkDocSelectModal";
import NkDocSelectEditor from "./components/NkDocSelectEditor";
import NkSpELEditor from "./components/NkSpELEditor";
import NkSpELTemplateEditor from "./components/NkSpELTemplateEditor";
// /**
//  * 页面
//  */
// import NkPageTasks from "./task/NkPageTasks";
// import NkPageDocs from "./doc/NkPageDocs";
// import NkPageDocDetail from "./doc/NkPageDocDetail";
// import NkPageDocDetailDiff from "./doc/NkPageDocDetailDiff";
// import NkPageCustomQuery from "./doc/NkPageCustomQuery";
//
// /**
//  * 设置界面
//  */
// import NkSettingsAuthLimit from "./settings/NkSettingsAuthLimit";
// import NkSettingsAuthPerm from "./settings/NkSettingsAuthPerm";
// import NkSettingsAuthGroup from "./settings/NkSettingsAuthGroup";
// import NkSettingsMenus from "./settings/NkSettingsMenus";
//
// /**
//  * 配置页面
//  */
// import NkDefConstant from "./doc/NkDefConstant";
// import NkDefScripts from "./doc/NkDefScripts";
// import NkDefScriptDetail from "./doc/NkDefScriptDetail";
// import NkDefDocs from "./doc/NkDefDocs";
// import NkDefDocType from "./doc/NkDefDocType";
// import NkDefBpmProcessDefinitions from "./task/NkDefBpmProcessDefinitions";
// import NkDefBpmProcessDefinitionDetail from "./task/NkDefBpmProcessDefinitionDetail";
// import NkDefBpmDesigner from "./task/NkDefBpmDesigner";
// import NkDefBpmDeployments from "./task/NkDefBpmDeployments";// 待删除
//
// import NkDefDmnDefinitions from "./task/NkDefDmnDefinitions";
// import NkDefDmnDefinitionDetail from "./task/NkDefDmnDefinitionDetail";
// import NkDefDmnDesigner from "./task/NkDefDmnDesigner";
//
// import NkPageProcessInstances from "./task/NkPageProcessInstances";
// import NkPageProcessDetail from "./task/NkPageProcessDetail";
//
// /**
//  * 运维页面
//  */
// import NkDevOpsDataSync from "./devops/NkDevOpsDataSync";
// import NkDevOpsCache from "./devops/NkDevOpsCache";
// import NkDefDeploy from "./devops/NkDefDeploy";
/**
 * Vue 模块对象
 * @type {null}
 */
const module = Object.create(null);
module.install = function (Vue) {

  /**
   * 通用组件
   */
  Vue.component('nk-script-label',NkScriptLabel);
  Vue.component('nk-card',NkCard);
  Vue.component('nk-def-card',NkDefCard);
  Vue.component('nk-doc-select-editor',NkDocSelectEditor);
  Vue.component('nk-doc-select-modal',NkDocSelectModal);
  Vue.component('nk-sp-el-editor',NkSpELEditor);
  Vue.component('nk-sp-el-template-editor',NkSpELTemplateEditor);

  /**
   * 页面组件，预览页面需要嵌套的部分
   */
  Vue.component('nk-page-doc-detail',(resolve) => require(['./doc/NkPageDocDetail'],resolve));
};

module.routes = [
  {
    name: "任务",
    path: 'tasks',
    component: (resolve) => require(['./task/NkPageTasks'],resolve),
  },
  {
    name: "单据",
    path: 'docs',
    component: (resolve) => require(['./doc/NkPageDocs'],resolve),
    children: [
      {
        name: "单据详情",
        path: ':mode/:docId',
        component: (resolve) => require(['./doc/NkPageDocDetail'],resolve),
        props:true,
      },
      {
        name: "单据对比",
        path: 'diff/:leftId/:rightId',
        component: (resolve) => require(['./doc/NkPageDocDetailDiff'],resolve)
      }
    ]
  },
  {
    name: "自定义检索",
    path: 'q',
    children: [
      {
        name: "检索",
        path: ':id',
        component: (resolve) => require(['./doc/NkPageCustomQuery'],resolve),
      }
    ]
  },
  {
    name: "系统设置",
    path: "settings",
    children: [
      {
        name: "菜单配置",
        path: 'menus',
        component: (resolve) => require(['./settings/NkSettingsMenus'],resolve),
        meta:{
          title: "菜单配置",
        }
      },
      {
        name: "授权",
        path: "auth",
        children: [
          {
            name: "授权限制",
            path: "limit",
            component: (resolve) => require(['./settings/NkSettingsAuthLimit'],resolve),
            meta:{
              title: "授权限制",
            }
          },
          {
            name: "权限定义",
            path: "perm",
            component: (resolve) => require(['./settings/NkSettingsAuthPerm'],resolve),
            meta:{
              title: "权限定义",
            }
          },
          {
            name: "用户组",
            path: "group",
            component: (resolve) => require(['./settings/NkSettingsAuthGroup'],resolve),
            meta:{
              title: "用户组",
            }
          }
        ]
      }
    ]
  },
  {
    name: "系统配置",
    path: "def",
    children: [
      {
        name: "单据类型",
        path: 'doc',
        component: (resolve) => require(['./doc/NkDefDocs'],resolve),
        children: [
          {
            name: "单据类型配置详情",
            path: ':mode',
            component: (resolve) => require(['./doc/NkDefDocType'],resolve),
            meta:{
              title: "配置详情",
            }
          },
          {
            name: "单据类型配置编辑",
            path: ':mode/:type/:version',
            component: (resolve) => require(['./doc/NkDefDocType'],resolve),
            meta:{
              title: "配置详情",
            }
          }
        ]
      },
      {
        name: "脚本",
        path: 'script',
        component: (resolve) => require(['./doc/NkDefScripts'],resolve),
        children: [
          {
            name: "脚本编辑器",
            path: ':mode/:script/:version',
            component: (resolve) => require(['./doc/NkDefScriptDetail'],resolve)
          },
          {
            name: "新建脚本",
            path: ':mode',
            component: (resolve) => require(['./doc/NkDefScriptDetail'],resolve)
          },
        ]
      },
      {
        name:"常量",
        path: 'constant',
        component: (resolve) => require(['./doc/NkDefConstant'],resolve),
        meta:{
          title: "常量",
        }
      },
      {
        name:"部署",
        path: 'deploy',
        component: (resolve) => require(['./devops/NkDefDeploy'],resolve),
        meta:{
          title: "部署",
        }
      },
      {
        name: "流程部署记录",
        path: 'bpm/process/deployments',
        component: (resolve) => require(['./task/NkDefBpmDeployments'],resolve)
      },
      {
        name: "流程定义",
        path: 'bpm/process/definitions',
        component: (resolve) => require(['./task/NkDefBpmProcessDefinitions'],resolve),
        children: [
          {
            name: "流程定义详情",
            path: 'detail/:id',
            component: (resolve) => require(['./task/NkDefBpmProcessDefinitionDetail'],resolve)
          },
          {
            name: "流程设计器",
            path: 'designer',
            component: (resolve) => require(['./task/NkDefBpmDesigner'],resolve),
            meta:{
              title: "工作流设计器",
            }
          },
        ]
      },
      {
        name: "决策定义",
        path: 'dmn/definitions',
        component: (resolve) => require(['./task/NkDefDmnDefinitions'],resolve),
        children: [
          {
            name: "决策定义详情",
            path: 'detail/:id',
            component: (resolve) => require(['./task/NkDefDmnDefinitionDetail'],resolve)
          },
          {
            name: "决策设计器",
            path: 'designer',
            component: (resolve) => require(['./task/NkDefDmnDesigner'],resolve),
            meta:{
              title: "决策设计器",
            }
          },
        ]
      },
    ]
  },
  {
    name: "运维",
    path: 'devops',
    children: [
      {
        name: "流程实例",
        path: 'process/instances',
        component: (resolve) => require(['./task/NkPageProcessInstances'],resolve),
        meta:{
          title: "流程实例",
        },
        children: [
          {
            name: "流程实例详情",
            path: 'detail/:id',
            component: (resolve) => require(['./task/NkPageProcessDetail'],resolve)
          },
        ]
      },
      {
        name: "数据同步",
        path: 'sync',
        component: (resolve) => require(['./devops/NkDevOpsDataSync'],resolve),
        meta:{
          title: "数据同步",
        }
      },
      {
        name: "数据缓存",
        path: 'cache',
        component: (resolve) => require(['./devops/NkDevOpsCache'],resolve),
        meta:{
          title: "数据缓存",
        }
      },
    ]
  }
];

export default module

