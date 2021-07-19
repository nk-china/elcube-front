import axios from 'axios'
import qs from 'qs'
import crypto from 'crypto'
import AuthUtils from "./AuthUtils";
import User from "../store/StateUser";
import UI from "../store/StateUI";
import TextUtils from "../utils/TextUtils";

function sha1(password){
  password = crypto.createHash('sha1').update(password).digest('hex');
  password = crypto.createHash('sha1').update(password).digest('hex');
  return password;
}

export default (Vue) => {

  let errorTime = 0;
  let errorMsg = null;

  let onRequestFulfilled = config => {
    let token = AuthUtils.getToken();
    if(token){
      config.headers.common['NK-Token'] = token;
    }
    return Promise.resolve(config)
  };
  let onRequestRejected = error => {
    return Promise.reject(error)
  };
  let onResponseSuccess = res => {
    if(res.data && typeof res.data === 'string' && res.data.startsWith("H4s")){
        res.data = JSON.parse(TextUtils.uncompress(res.data));
    }
    return Promise.resolve(res)
  };
  let onResponseError = error => {
    if(error.response.status >= 500 && error.response.status < 600) {

      let now = new Date().getTime();
      if(now-errorTime > 2000 || errorMsg !== error.response.data.msg){
        errorTime = now;
        errorMsg = error.response.data.msg;
        Vue.prototype.$error({
          centered: true,
          title: '系统错误',
          content: error.response.data.msg||error.response.data,
        });
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }else if(error.response.status === 401) {
      Vue.prototype.$error({
        centered: true,
        title: '验证错误',
        content: error.response.data.msg,
      });
      setTimeout(()=>{
        location.href=""
      },1000)
    }else if(error.response.status === 403) {
      Vue.prototype.$error({
        centered: true,
        title: '验证错误',
        content: error.response.data.msg,
      });
      return Promise.reject(error);
    }else if(error.response.status === 400) {
      // Vue.prototype.$notification.error({
      //   message: '错误提示',
      //   description: error.response.data.msg,
      // });
      Vue.prototype.$message.error(error.response.data.msg)
      // Vue.prototype.$warning({
      //   centered: true,
      //   title: '操作失败',
      //   content: error.response.data.msg,
      // });
      return Promise.reject(error)
    }else{
      // 其他未处理的错误
      console.error(error.response);
      return Promise.reject(error)
    }
  };

  let defaultConfig = {
    baseURL: '',
    crossDomain: true,
    withCredentials: true,
    timeout: 120 * 1000,
  };

  const instanceForm = axios.create(Object.assign({
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
  },defaultConfig));
  const instanceJSON = axios.create(Object.assign({
    headers: {'Content-Type': 'application/json; charset=utf-8'}
  },defaultConfig));

  instanceForm.interceptors.request.use(onRequestFulfilled, onRequestRejected);
  instanceForm.interceptors.response.use(onResponseSuccess, onResponseError);
  instanceJSON.interceptors.request.use(onRequestFulfilled, onRequestRejected);
  instanceJSON.interceptors.response.use(onResponseSuccess, onResponseError);

  let interval = undefined;
  let time = 90;

  function login(username, password){

    return new Promise((resolve, reject)=>{
      axios.post("api/authentication/token",qs.stringify({
        systemId: "NK",
        os: "Browser",
        username: username,
        password: sha1(password)
      })).then(res=>{
        User.state.reLogin=false;
        AuthUtils.setToken(res.data);
        resolve.apply(this,[res]);
        if(interval)
          clearInterval(interval);
      }).catch(e=>{
        reject.apply(this,[e.response])
      }).finally(()=>{
        time = 91;
      });
    });
  }
  function logout(){
    return new Promise((resolve)=>{
      axios.post("/api/authentication/clear",{},{
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'NK-Token': AuthUtils.getToken()
        }
      })
      .then(resolve)
      .catch(resolve)
      .finally(()=>{
        AuthUtils.clear();
        if(interval){
          clearInterval(interval);
        }
      });
    })
  }
  function refreshToken(fromRoute,next) {
    let that = this;
    return new Promise((resolve)=>{
      UI.state.loading=true;
      axios.post("/api/authentication/refresh_token",{},{
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'NK-Token': AuthUtils.getToken()
        }
      }).then(res=>{
        AuthUtils.setToken(res.data);
        resolve.apply(that,arguments)
      }).catch(()=>{
        //reject(e);
        if(fromRoute&&fromRoute.path==='/'){
          //reject(e);
          next({path: '/'})
        }else{
          console.log("重新登陆");
          //resolve.apply(this)
          User.state.reLogin=true;
          User.state.reLoginSuccess.push(resolve);

          time = 90;
          if(interval)
            clearInterval(interval);
          interval = setInterval(()=>{
            User.state.reLoginTime=--time;
            if(time===0){
              location.href='';
              if(interval)
              clearInterval(interval);
            }
          },1000);
        }

      }).finally(()=>{
        UI.state.loading=false;
      });
    })
  }
  function doRequest(targetRequestFunction,args) {

    let that = this;
    let state = AuthUtils.state();

    if(state.authed){
      return targetRequestFunction.apply(that,args);
    }else{
      return new Promise((resolve,reject)=>{
        // if(state.refresh){
          refreshToken.apply(that,args)
            .then(()=>{
              targetRequestFunction
                .apply(that,args)
                .then(resolve)
                .catch(reject);
            })
            .catch(reject)
        // }else{
        //   reject({"message":"会话已超时"});
        //   Vue.prototype.$warning({
        //     centered: true,
        //     title: '提示',
        //     content: '会话已超时',
        //   })
        //   setTimeout(()=>{
        //     location.reload();
        //   },2000)
        // }
      });
    }
  }

 return {
   login,
   logout,
   refreshToken,
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
