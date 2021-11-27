import axios from 'axios'
import qs from 'qs'
import crypto from 'crypto'
import AuthUtils from "./AuthUtils";
import User from "../stores/StateUser";
import UI from "../stores/StateUI";
import StateDebug from "../stores/StateDebug";
import TextUtils from "../../utils/TextUtils";

export default (Vue) => {

  // 密码加密
  function sha1(password){
    return crypto.createHash('sha1').update(
        crypto.createHash('sha1').update(password).digest('hex')
    ).digest('hex');
  }

  // 设置请求头
  let onRequestNoneToken = config => {
    if(StateDebug.state.debugId){ config.headers.common['NK-Debug'] = StateDebug.state.debugId; }
    config.headers.common['NK-App']   = 'easis';
    return Promise.resolve(config)
  };
  const onRequestFulfilled = config => {
    let token = AuthUtils.getToken();
    if(token){                    config.headers.common['NK-Token'] = token; }
    return onRequestNoneToken(config)
  };
  const onRequestRejected = error => {
    return Promise.reject(error)
  };

  // 设置响应配置
  let errorTime = 0;
  let errorMsg = null;
  const onResponseSuccess = res => {
    // 解码返回的数据
    if(res.data && typeof res.data === 'string' && res.data.startsWith("H4s")){
      res.data = JSON.parse(TextUtils.uncompress(res.data));
    }

    const logId = res.headers['nk-debug-log'];
    if(logId){
      axios.post("/api/debug/log/"+logId,{},{
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'NK-App': 'easis',
          'NK-Token': AuthUtils.getToken()
        }
      }).then(log=>{
        if(log.data){
          console.debug(`\nRequest URL : ${res.request.responseURL}\n\n${log.data}`)
        }
      })
    }

    return Promise.resolve(res)
  };

  // 系统错误
  const onSystemError = error => {
    let now = new Date().getTime();

    const msg = error.response.data.msg || error.response.data;

    if(now-errorTime > 2000 || errorMsg !== msg){
      errorTime = now;
      errorMsg = msg;

      if(error.response.data.causeStackTrace)
        console.error(error.response.data.causeStackTrace.join('\n'))

      Vue.prototype.$error({
        centered: true,
        title: '系统错误',
        content: errorMsg,
      });
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }

  // 用户未登陆 或 token失效
  const onUnauthorizedError = error => {
    Vue.prototype.$error({
      centered: true,
      title: '验证错误',
      content: error.response.data.msg,
    });
    setTimeout(()=>{
      location.href=""
    },1000)
  }

  // 没有权限，拒绝访问
  const onForbiddenError = error => {
    Vue.prototype.$error({
      centered: true,
      title: '验证错误',
      content: error.response.data.msg,
    });
    return Promise.reject(error);
  }

  // 用户操作错误或警告提示
  const onCaution = error => {
    Vue.prototype.$notification.error({
      message: '错误',
      description:error.response.data.msg
    })
    //Vue.prototype.$message.error(error.response.data.msg)
    return Promise.reject(error)
  }
  let onResponseError = error => {
    if(      error.response.status >=  500 &&
             error.response.status <   600) { return onSystemError(error);
    }else if(error.response.status === 401) { return onUnauthorizedError(error);
    }else if(error.response.status === 403) { return onForbiddenError(error);
    }else if(error.response.status === 400) { return onCaution(error);
    }else{                                    return Promise.reject(error); // 其他未知的错误
    }
  };

  let defaultConfig = {
    baseURL: '',
    crossDomain: true,
    withCredentials: true,
    timeout: 120 * 1000,
  };

  const instanceForm = axios.create(Object.assign({headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}},defaultConfig));
  const instanceJSON = axios.create(Object.assign({headers: {'Content-Type': 'application/json; charset=utf-8'}},defaultConfig));
  const instanceNone = axios.create(Object.assign({headers: {'Content-Type': 'application/json; charset=utf-8'}},defaultConfig));

  instanceForm.interceptors.request.use(onRequestFulfilled, onRequestRejected);
  instanceForm.interceptors.response.use(onResponseSuccess, onResponseError);
  instanceJSON.interceptors.request.use(onRequestFulfilled, onRequestRejected);
  instanceJSON.interceptors.response.use(onResponseSuccess, onResponseError);
  instanceNone.interceptors.request.use(onRequestNoneToken, onRequestRejected);
  instanceNone.interceptors.response.use(onResponseSuccess, onResponseError);


  const doRequest = (targetRequestFunction,args) => {

    let self = this;
    let state = AuthUtils.state();

    if(state.authed){
      return targetRequestFunction.apply(self,args);
    }else{
      return new Promise((resolve,reject)=>{
        refreshToken.apply(self)
          .then(()=>{
            targetRequestFunction
              .apply(self,args)
              .then(resolve)
              .catch(reject);
          })
          .catch(reject)
      });
    }
  }


  let reLoginInterval = undefined;
  let reLoginCountdown = 90;

  const clearReLoginInterval = ()=>{
    if(reLoginInterval)clearInterval(reLoginInterval);
    reLoginCountdown = 90;
  }
  function refreshToken(fromRoute,next) {
    let that = this;
    return new Promise((resolve)=>{
      UI.state.loading=true;
      axios.post("/api/authentication/refresh_token",{},{
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'NK-App': 'easis',
          'NK-Token': AuthUtils.getToken()
        }
      }).then(res=>{
        AuthUtils.setToken(res.data);
        resolve.apply(that,arguments)
      }).catch(()=>{
        if(fromRoute&&fromRoute.path==='/'){
          // 如果fromRoute.path === '/' 表示用户是通过刷新URL进来的，
          // 所以，如果获取token失败，则直接返回 / 登陆界面
          next({path: '/'})
        }else{
          // 否则弹出重新登陆对话框
          User.state.reLogin=true;
          // 缓存用户调用的方法
          User.state.reLoginSuccess.push(resolve);

          clearReLoginInterval();
          User.state.reLoginTime=reLoginCountdown;
          reLoginInterval = setInterval(()=>{
            User.state.reLoginTime=--reLoginCountdown;
            if(reLoginCountdown===0){
              clearReLoginInterval();
              location.href='';
            }
          },1000);
        }

      }).finally(()=>{
        UI.state.loading=false;
      });
    })
  }

  function login(username, password){

    return new Promise((resolve, reject)=>{
      axios.post("api/authentication/token",qs.stringify({
        systemId: "NK",
        os: "Browser",
        username: username,
        password: sha1(password)
      }),{
        headers: {
          'NK-App': 'easis',
        }
      }).then(res=>{
        User.state.reLogin=false;
        AuthUtils.setToken(res.data);
        clearReLoginInterval();
        resolve.apply(this,[res]);
      }).catch(e=>{
        reject.apply(this,[e.response])
        reLoginCountdown = 91;
      }).finally(()=>{
      });
    });
  }
  function logout(){
    return new Promise((resolve)=>{
      axios.post("/api/authentication/clear",{},{
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'NK-App': 'easis',
          'NK-Token': AuthUtils.getToken()
        }
      })
      .then(resolve)
      .catch(resolve)
      .finally(()=>{
        clearReLoginInterval();
        AuthUtils.clear();
      });
    })
  }

  return {
    login,
    logout,
    refreshToken,
    instanceNone,
    instanceForm,
    instanceJSON,
    // eslint-disable-next-line no-unused-vars
    loadVue  (url,config)      { return doRequest.apply(this,[instanceNone.get,     arguments]) },
    // eslint-disable-next-line no-unused-vars
    request  (config)          { return doRequest.apply(this,[instanceForm.request, arguments]) },
    // eslint-disable-next-line no-unused-vars
    get      (url,config)      { return doRequest.apply(this,[instanceForm.get,     arguments]) },
    // eslint-disable-next-line no-unused-vars
    delete   (url,config)      { return doRequest.apply(this,[instanceForm.delete,  arguments]) },
    // eslint-disable-next-line no-unused-vars
    head     (url,config)      { return doRequest.apply(this,[instanceForm.head,    arguments]) },
    // eslint-disable-next-line no-unused-vars
    options  (url,config)      { return doRequest.apply(this,[instanceForm.options, arguments]) },
    // eslint-disable-next-line no-unused-vars
    post     (url,data,config) { return doRequest.apply(this,[instanceForm.post,    arguments]) },
    // eslint-disable-next-line no-unused-vars
    put      (url,data,config) { return doRequest.apply(this,[instanceForm.put,     arguments]) },
    // eslint-disable-next-line no-unused-vars
    patch    (url,data,config) { return doRequest.apply(this,[instanceForm.patch,   arguments]) },
    // eslint-disable-next-line no-unused-vars
    postJSON (url,data,config) { return doRequest.apply(this,[instanceJSON.post,    arguments]) },
    // eslint-disable-next-line no-unused-vars
    putJSON  (url,data,config) { return doRequest.apply(this,[instanceJSON.put,     arguments]) },
  }
}
