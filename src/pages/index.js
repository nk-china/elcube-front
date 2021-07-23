
/**
 * 页面
 */
import NkPageTasks from "./NkPageTasks";
import NkPageTaskDetail from "./NkPageTaskDetail";
import NkPageProjects from "./NkPageProjects";
import NkPageDocs from "./NkPageDocs";
import NkPageDocHeaderDefault from "./NkPageDocHeaderDefault";
import NkPageDocHeaderProject from "./NkPageDocHeaderProject";
import NkPageDocDetail from "./NkPageDocDetail";
import NkPageDocDetailDiff from "./NkPageDocDetailDiff";
import NkPagePartners from "./NkPagePartners";
import NkPagePartnerDetail from "./NkPagePartnerDetail";
import NkPagePartnerHeaderDefault from "./NkPagePartnerHeaderDefault";
import NkPagePartnerDetailDiff from "./NkPagePartnerDetailDiff";
import NkPageCustomQuery from "./NkPageCustomQuery";
import NkCard from "./NkCard";


/**
 * 设置界面
 */
import NkSettingsAuthLimit from "./NkSettingsAuthLimit";
import NkSettingsAuthPerm from "./NkSettingsAuthPerm";
import NkSettingsAuthGroup from "./NkSettingsAuthGroup";

/**
 * 配置页面
 */
import NkDefCardType from "./NkDefCardType";
import NkDefPartners from "./NkDefPartners";
import NkDefPartnerType from "./NkDefPartnerType";
import NkDefDocs from "./def/NkDefDocs";
import NkDefDocType from "./def/NkDefDocType";
// 脚本
import NkDefScriptsTreeVersion from "./NkDefScriptsTreeVersion";
import NkDefScripts from "./NkDefScripts";
import NkDefScriptEditor from "./NkDefScriptEditor";
import NkScriptLabel from "./components/NkScriptLabel";
// 常量
import NkDefConstant from "./NkDefConstant";
// 自定义搜索
import NkDefSearch from "./NkDefSearch";
import NkDefDeploy from "./NkDefDeploy";
// 工作流
import NkDefBpmProcessInstances from "./NkDefBpmProcessInstances";
import NkDefBpmProcessDefinitions from "./NkDefBpmProcessDefinitions";
import NkDefBpmProcessDefinitionDetail from "./NkDefBpmProcessDefinitionDetail";
import NkDefBpmDesigner from "./NkDefBpmDesigner";
import NkDefBpmDeployments from "./NkDefBpmDeployments";// 待删除

import NkSettingsMenus from "./NkSettingsMenus";

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

  /**
   * 页面组件，工作流页面需要嵌套的部分
   */
  Vue.component('nk-page-partner-detail',NkPagePartnerDetail);
  Vue.component('nk-page-doc-detail',NkPageDocDetail);
  Vue.component('nk-page-doc-header-default',NkPageDocHeaderDefault);
  Vue.component('nk-page-doc-header-project',NkPageDocHeaderProject);
  Vue.component('nk-page-partner-header-default',NkPagePartnerHeaderDefault);
  Vue.component('nk-page-partner-header-transaction',NkPagePartnerHeaderDefault);
};

module.routes = [
  {
    name: "任务",
    path: 'tasks',
    component: NkPageTasks,
    children: [
      {
        name: "任务详情",
        path: 'task/:taskId',
        component: NkPageTaskDetail,
        props:true,
      },
    ]
  },
  {
    name: "交易",
    path: 'docs',
    component: NkPageDocs,
    children: [
      {
        name: "交易详情",
        path: ':mode/:docId',
        component: NkPageDocDetail,
        props:true,
      },
      {
        name: "交易对比",
        path: 'diff/:sourceDocId/:targetDocId',
        component: NkPageDocDetailDiff
      }
    ]
  },
  {
    name: "业务",
    path: 'projects',
    component: NkPageProjects,
    children: [
      {
        name: "业务详情",
        path: ':mode/:docId',
        component: NkPageDocDetail,
        props:true,
      },
      {
        name: "业务对比",
        path: 'diff/:sourceDocId/:targetDocId',
        component: NkPageDocDetailDiff
      }
    ]
  },
  {
    name: "交易伙伴",
    path: 'partners',
    component: NkPagePartners,
    children: [
      {
        name: "详情",
        // mode : detail | new-partner | new-role | doc | next | snapshot
        // docId: docId | docType
        path: ':mode/:docId',
        component: NkPagePartnerDetail
      },
      {
        name: "交易伙伴对比",
        path: 'diff/:sourceDocId/:targetDocId',
        component: NkPagePartnerDetailDiff
      },
    ]
  },
  {
    name: "自定义检索",
    path: 'q',
    children: [
      {
        name: "检索",
        path: ':id',
        component: NkPageCustomQuery,
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
        component: NkSettingsMenus,
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
            component: NkSettingsAuthLimit,
            meta:{
              title: "授权限制",
            }
          },
          {
            name: "权限定义",
            path: "perm",
            component: NkSettingsAuthPerm,
            meta:{
              title: "权限定义",
            }
          },
          {
            name: "用户组",
            path: "group",
            component: NkSettingsAuthGroup,
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
        name: "卡片",
        path: "card",
        component: NkDefCardType,
        children: [
          {
            name: "卡片配置",
            path: ':mode',
            component: NkDefCardType,
            meta:{
              title: "卡片配置",
            }
          },
        ]
      },
      {
        name: "交易伙伴角色",
        path: 'partner',
        component: NkDefPartners,
        children: [
          {
            name: "交易伙伴角色详情",
            path: ':mode',
            component: NkDefPartnerType,
            meta:{
              title: "配置详情",
            }
          },
          {
            name: "交易伙伴角色编辑",
            path: ':mode/:partnerRole',
            component: NkDefPartnerType,
            meta:{
              title: "配置详情",
            }
          }
        ]
      },
      {
        name: "单据类型",
        path: 'doc',
        component: NkDefDocs,
        children: [
          {
            name: "单据类型配置详情",
            path: ':mode',
            component: NkDefDocType,
            meta:{
              title: "配置详情",
            }
          },
          {
            name: "单据类型配置编辑",
            path: ':mode/:type/:version',
            component: NkDefDocType,
            meta:{
              title: "配置详情",
            }
          }
        ]
      },
      {
        name: "脚本",
        path: 'script',
        component: NkDefScripts,
        children: [
          {
            name: "脚本导航",
            path: 'tree',
            component: NkDefScriptsTreeVersion
          },
          {
            name: "脚本编辑器",
            path: 'editor/:mode',
            component: NkDefScriptEditor
          },
          {
            name: "新建脚本",
            path: 'editor/:mode/:scriptName',
            component: NkDefScriptEditor
          },
        ]
      },
      {
        name:"常量",
        path: 'constant',
        component: NkDefConstant,
        meta:{
          title: "常量",
        }
      },
      {
        name:"部署",
        path: 'deploy',
        component: NkDefDeploy,
        meta:{
          title: "部署",
        }
      },
      {
        name: "自定义搜索",
        path: 'search',
        component: NkDefSearch,
        children: [
        ]
      },
      {
        name: "工作流部署记录",
        path: 'bpm/process/deployments',
        component: NkDefBpmDeployments
      },
      {
        name: "工作流定义",
        path: 'bpm/process/definitions',
        component: NkDefBpmProcessDefinitions,
        children: [
          {
            name: "流程定义详情",
            path: 'detail/:id',
            component: NkDefBpmProcessDefinitionDetail
          },
          {
            name: "工作流设计器",
            path: 'designer',
            component: NkDefBpmDesigner,
            meta:{
              title: "工作流设计器",
            }
          },
        ]
      },
    ]
  },
  {
    name: "工作流",
    path: 'bpm',
    children: [
      {
        name: "流程实例",
        path: 'process/instances',
        component: NkDefBpmProcessInstances,
        meta:{
          title: "流程实例",
        }
      },
    ]
  }
];

export default module

