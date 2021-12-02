/*
 * 	This file is part of EAsis.
 *	EAsis is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	EAsis is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with EAsis.  If not, see <https://www.gnu.org/licenses/>.
 */
export default {

  getToken(){
    return localStorage.getItem("$NK-Auth-AccessToken")||'';
  },
  state(){

    let now     = new Date().getTime();
    let token   = localStorage.getItem("$NK-Auth-AccessToken")||'';
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
