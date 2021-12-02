<!--
	This file is part of EAsis.
	EAsis is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	EAsis is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with EAsis.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
  <nk-page-layout title="权限定义" :spinning="spinning">
    <a-button-group slot="action">
      <a-button type="primary" @click="itemNew">新建</a-button>
    </a-button-group>
    <a-layout>
      <a-layout-sider theme="light" bordered>
        <a-list item-layout="horizontal" :data-source="listFilter" class="filter">
          <a-input slot="header" placeholder="filter..." style="border: none" allow-clear v-model="filter"></a-input>
          <a-list-item slot="renderItem"
                       slot-scope="i"
                       @click="itemClick(i)"
                       :class="i.permId===item.permId?'selected':''">
            {{i.permDesc}}
          </a-list-item>
        </a-list>
      </a-layout-sider>
      <a-layout-content>
        <a-card :title="item.permDesc||'未选中...'" style="margin-left: 20px;">
          <nk-form :col="1" :edit="item.permDesc !== undefined && (!item.permId || !item.permId.startsWith('nk-default-'))">
            <nk-form-item term="描述">
              {{item.permDesc}}
              <a-input slot="edit" v-model="item.permDesc" placeholder="权限描述"></a-input>
            </nk-form-item>
            <nk-form-item term="资源">
              {{item.permResource}}
              <!--                            <a-input slot="edit" v-model="item.permResource" placeholder="系统资源，单据以 @ 开头，多个单据以 | 竖线分隔，如@ZR01|ZR02"></a-input>-->
              <a-auto-complete
                  slot="edit"
                  v-model="item.permResource"
                  :data-source="dataSourceResource"
                  placeholder="系统资源"
                  @select="autoComplete(item,'permResource',$event)"
                  @change="item.permResource=item.permResource&&item.permResource.toUpperCase()"
              />
            </nk-form-item>
            <nk-form-item term="操作">
              {{item.permOperate}}
              <!--              <a-input slot="edit" v-model="item.permOperate" placeholder="资源的操作，READ 或者 WRITE，* 表示所有操作"></a-input>-->
              <a-auto-complete
                  slot="edit"
                  v-model="item.permOperate"
                  :data-source="dataSourceOperate"
                  placeholder="资源的操作"
                  @select="autoComplete(item,'permOperate',$event)"
                  @change="item.permOperate=item.permOperate&&item.permOperate.toUpperCase()"
              />
            </nk-form-item>
            <nk-form-item term="权限KEY">
              {{item.permResource+':'+item.permOperate}}
              <a-input slot="edit" disabled :value="item.permResource+':'+item.permOperate"></a-input>
            </nk-form-item>
            <nk-form-item term="操作限制">
              {{item.subResource}}
              <template slot="edit">
                <a-textarea v-model="item.subResource"
                            rows="10"
                            placeholder="严格JSON格式"
                            @blur="subResourceChange"
                ></a-textarea>
                <span class="nk-error-color">{{subResourceError}}</span>
              </template>
            </nk-form-item>
            <nk-form-item term="授权限制">
                            <span v-for="limit in itemLimitIds" :key="limit" >
                                {{ limit }}
                            </span>
              <a-select
                  slot="edit"
                  mode="multiple"
                  :value="itemLimitIds"
                  placeholder="请选择限制"
                  style="width: 100%"
                  :filter-option="false"
                  @change="itemLimitChange"
              >
                <a-select-option v-for="limit in limits" :key="limit.limitId" >
                  {{ limit.limitDesc }}
                </a-select-option>
              </a-select>
            </nk-form-item>
            <nk-form-item term="Level">
              {{itemLevel}}
              <nk-help-link slot="term" page="settings-auth-perm-level" />
              <a-input slot="edit" v-model="itemLevel" disabled></a-input>
            </nk-form-item>
          </nk-form>
          <a-button-group slot="extra" v-if="item.permDesc && (!item.permId || !item.permId.startsWith('nk-default-'))">
            <a-button type="primary" @click="itemUpdate">保存</a-button>
            <a-popconfirm v-if="item.permId" placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="itemRemove">
              <template slot="title">
                <p>确认删除 '{{item.permDesc}}'?</p>
              </template>
              <a-button>删除</a-button>
            </a-popconfirm>
          </a-button-group>
        </a-card>
      </a-layout-content>
    </a-layout>
  </nk-page-layout>
</template>

<script>
export default {
  name: "NkSettingsAuthperm",
  data(){
    return {
      list:[],
      item: {},
      limits:[],
      filter: '',
      limitLevel:0x0,
      spinning:true,
      subResourceError:undefined
    }
  },
  computed:{
    dataSourceResource(){
      const list = [
        "*<所有资源>",
        "@*<所有单据类型>",
        "@<单据类型>",
        "#*<所有数据源>",
        "#<数据源>",
        "DEF<配置>",
        "DEVOPS<运维>",
        "SETTINGS<设置>",
        "SYS<系统>",
      ]
      let res = (this.item.permResource && this.item.permResource.trim().toUpperCase())||'';
      let ret = list.filter(i=>i.startsWith(res));
      if(res)
        ret.splice(0,0,res);
      return ret;
    },
    dataSourceOperate(){
      let list = [];
      if(this.item.permResource){
        if(this.item.permResource.startsWith("@")){
          list = ["*<全部操作>","READ<查看>","WRITE<保存>"];
        }else
        if(this.item.permResource.startsWith("#")){
          list = ["*<查询>"];
        }else
        if(this.item.permResource.startsWith("DEF")){
          list = ["*<全部操作>","REGISTRY<基础配置>","COMPONENT<组件开发>","BPM<工作流配置>","DMN<决策引擎配置>","DOCTYPE<单据类型配置>"];
        }else
        if(this.item.permResource.startsWith("DEVOPS")){
          list = ["*<全部操作>","DEPLOY<部署>","BPM<工作流实例管理>","DATASYNC<数据同步管理>","CACHE<缓存管理>"];
        }else
        if(this.item.permResource.startsWith("SETTINGS")){
          list = ["*<全部操作>","MENU<主菜单设置>","AUTH<权限设置>"];
        }
        if(this.item.permResource.startsWith("SYS")){
          list = ["*<查询>","LOGIN<登陆>"];
        }
      }

      let ope = (this.item.permOperate && this.item.permOperate.trim().toUpperCase())||'';
      let ret = list.filter(i=>i.startsWith(ope));
      if(ope)
        ret.splice(0,0,ope);
      return ret;
    },
    itemLevel(){
      // 资源  操作       限制     扩展
      // 111    1        FFFFF   F

      // 资源 3位
      let resourceLevel = 0;
      if(this.item.permResource==='*'){
        resourceLevel = 0b111;
      }else if(this.item.permResource==='@*'){
        resourceLevel = 0b110;
      }else if(this.item.permResource && this.item.permResource.startsWith('@')){
        resourceLevel = 0b101;
        // }else if(this.item.permResource && this.item.permResource.startsWith('@')){
        //     resourceLevel = 0b100;
      }else{
        resourceLevel = 0b011;
      }
      // 操作 1位
      let operateLevel = 0b1;
      if(this.item.permOperate&&this.item.permOperate!=='*'){
        operateLevel = 0b0;
      }
      // 限制 20位
      let limitLevel = this.limitLevel;

      // 扩展 4位
      let subLevel = 0x0;
      if(this.item.subResource){
        subLevel = Math.min(this.item.subResource.split('|').length,15);
      }

      let level = (resourceLevel << 1 &0xFFFF | operateLevel) << 24 | 0xFFFFFF ^ limitLevel<<4 ^ subLevel;

      return level.toString(16).toUpperCase();
    },
    itemLimitIds(){
      return this.item.limitId && this.item.limitId.split("|") || undefined;
    },
    listFilter(){
      return this.list.filter((i)=>i.permDesc.toLowerCase().indexOf(this.filter.toLowerCase())>-1);
    }
  },
  created() {
    this.$http.get("/api/settings/auth/limit/list")
        .then(res=>{
          this.limits = res.data;
          this.reload();
        });
  },
  methods:{
    subResourceChange(){
      if(this.item.subResource)
      try{
        JSON.parse(this.item.subResource)
        this.subResourceError = undefined;
      }catch (e){
        this.subResourceError = e.message;
      }
    },
    autoComplete(a,b,c){
      this.$nextTick(()=>{
        this.$set(a,b,c.replace(/<[^>]*>/g,''));
      })
    },
    reload(){
      this.$http.get("/api/settings/auth/perm/list")
          .then(res=>{
            this.list = res.data;
            if(!this.item.permId && this.list[0]){
              this.itemClick(this.list[0]);
            }
          });
    },
    itemClick(e){
      this.spinning=true;
      this.$http.get("/api/settings/auth/perm/detail?permId="+e.permId)
          .then(res=>{
            this.item = Object.assign({limitId:undefined},res.data);
            this.itemLimitChange(this.item.limitId?this.item.limitId.split('|'):[]);
            this.spinning = false;
          });
    },
    itemUpdate(){
      this.spinning=true;
      this.item.permLevel = this.itemLevel;
      this.$http.postJSON("/api/settings/auth/perm/update",this.item)
          .then(res=>{
            this.item = res.data;
            this.reload();
            this.$message.success('保存成功', 2.5);
            this.spinning = false;
          })
          .catch(()=>{
            this.spinning = false;
          });
    },
    itemRemove(){
      this.$http.postJSON("/api/settings/auth/perm/remove?permId="+this.item.permId)
          .then(()=>{
            this.item = {};
            this.reload();
            this.$message.success('删除成功', 2.5)
          });
    },
    itemNew(){
      this.item = {permDesc:"未命名权限"};
    },
    itemLimitChange(e){
      this.item.limitId=e.join('|');

      let level = 0;
      this.limits.filter(value => e.indexOf(value.limitId)>-1)
          .map(value => value.limitLevel)
          .forEach(value => {
            level+=parseInt(`0x${value}`)
          });

      this.limitLevel = level;
    }
  }
}
</script>

<style scoped lang="less">

::v-deep .ant-layout-sider{
  background: inherit;
}
::v-deep.nk-form-item {
  align-items: flex-start;
}
</style>
