

export default {

  getToken(){
    return localStorage.getItem("$NK-Auth-AccessToken");
  },
  state(){

    let now     = new Date().getTime();
    let token   = localStorage.getItem("$NK-Auth-AccessToken")
    let expire  = localStorage.getItem("$NK-Auth-Expire") - now;
    let refresh = localStorage.getItem("$NK-Auth-Refresh") - now;

    return {
      authed: token && expire > 0,  //有效期大于0
      refresh: refresh > 0    //刷新有效期大于0
    };
  },
  setToken(data){
    localStorage.setItem("$NK-Auth-Expire",new Date().getTime() + data.expire);
    localStorage.setItem("$NK-Auth-Refresh",new Date().getTime() + data.refresh);
    localStorage.setItem("$NK-Auth-AccessToken",data.accessToken);
  },
  clear(){
    localStorage.removeItem("$NK-Auth-Expire");
    localStorage.removeItem("$NK-Auth-Refresh");
    localStorage.removeItem("$NK-Auth-AccessToken");
  }
}
