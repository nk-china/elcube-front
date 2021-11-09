<template>
    <nk-page-layout title="权限定义" :spinning="spinning">
        <a-button-group slot="action">
            <a-button type="primary" @click="itemNew">新建</a-button>
        </a-button-group>
        <a-layout>
            <a-layout-sider theme="light" bordered>
                <a-list item-layout="horizontal" :data-source="listFilter">
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
                            <a-input slot="edit" v-model="item.permResource" placeholder="系统资源，单据以 @ 开头，多个单据以 | 竖线分隔，如@ZR01|ZR02"></a-input>
                        </nk-form-item>
                        <nk-form-item term="操作">
                            {{item.permOperate}}
                            <a-input slot="edit" v-model="item.permOperate" placeholder="资源的操作，READ 或者 WRITE，* 表示所有操作"></a-input>
                        </nk-form-item>
                        <nk-form-item term="权限KEY">
                            {{item.permResource+':'+item.permOperate}}
                            <a-input slot="edit" disabled :value="item.permResource+':'+item.permOperate"></a-input>
                        </nk-form-item>
                        <nk-form-item term="扩展属性">
                            {{item.subResource}}
                            <a-textarea slot="edit" v-model="item.subResource" rows="10" placeholder="支持指定Card的KEY，多个值以'｜'竖线分隔"></a-textarea>
                        </nk-form-item>
                        <nk-form-item term="限制">
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
                        <a-popconfirm placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="itemRemove">
                            <template slot="title">
                                <p>确认删除 '{{item.permDesc}}'?</p>
                            </template>
                            <a-button v-if="item.permId">删除</a-button>
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
            spinning:true
        }
    },
    created() {
        this.$http.get("/api/settings/auth/limit/list")
            .then(res=>{
                this.limits = res.data;
                this.reload();
            });
    },
    computed:{
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
    methods:{
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
::v-deep .ant-list{

    background: white;

    border: 1px solid #e8e8e8;

    .ant-list-header{
        padding: 0;

        .ant-input{
            height: 40px;
            border: none;
        }
    }

    .ant-list-item{
        padding: 10px 10px;

        &.selected{
            background: #1890ff;
            color: white;
        }
    }
}
::v-deep.nk-form-item {
    align-items: flex-start;
}
</style>
