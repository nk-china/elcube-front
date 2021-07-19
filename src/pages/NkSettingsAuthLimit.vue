<template>
    <nk-page-layout title="授权限制" :spinning="spinning">
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
                                 :class="i.limitId===item.limitId?'selected':''">
                        {{i.limitDesc}}
                    </a-list-item>
                </a-list>
            </a-layout-sider>
            <a-layout-content>
                <a-card :title="item.limitDesc||'未选中...'" style="margin-left: 20px;">
                    <nk-form ref="form" :col="1" :edit="item.limitDesc !== undefined">
                        <nk-form-item term="描述">
                            <a-input slot="edit" v-model="item.limitDesc"></a-input>
                        </nk-form-item>
                        <nk-form-item term="规则" :validateFor="item.content">
                            <a-textarea slot="edit" v-model="item.content" rows="10"></a-textarea>
                        </nk-form-item>
                        <nk-form-item term="Level">
                            <nk-help-link slot="term" page="settings-auth-perm-level" />
                            <a-input slot="edit" v-model="itemLevel" disabled></a-input>
                        </nk-form-item>
                    </nk-form>
                    <a-button-group slot="extra" v-if="item.limitDesc">
                        <a-button type="primary" @click="itemUpdate" :disabled="$refs.form.hasError()">保存</a-button>
                        <a-popconfirm placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="itemRemove">
                            <template slot="title">
                                <p>确认删除 '{{item.limitDesc}}'?</p>
                            </template>
                            <a-button v-if="item.limitId">删除</a-button>
                        </a-popconfirm>
                    </a-button-group>
                </a-card>
                <div style="margin: 20px 40px">
                    规则示例：<a target="_blank" href="https://www.elastic.co/guide/cn/elasticsearch/guide/current/combining-queries-together.html">
                    点击查看更多 ElasticSearch 的条件规则
                </a>
    <pre>
{
    "terms" : {
        "docState" : [
            "NEW"
        ]
    }
}</pre>

                </div>
            </a-layout-content>
        </a-layout>
    </nk-page-layout>
</template>

<script>

// import fnv from 'fnv-plus';

export default {
    name: "NkSettingsAuthLimit",
    data(){
        return {
            list:[],
            item: {},
            filter: '',
            spinning:true
        }
    },
    created() {
        this.reload();
    },
    computed:{
        listFilter(){
            return this.list.filter((i)=>i.limitDesc.toLowerCase().indexOf(this.filter.toLowerCase())>-1);
        },
        itemLevel(){

            let count = 0;
            let limitContent = this.item.content;
            if(limitContent){
                try{
                    const limit = JSON.parse(this.item.content);
                    count = Math.min(Object.keys(limit).length,0xf);
                }catch(e){
                    return;
                }
            }
            return ((count<<16 ^ (limitContent?limitContent.length:0)).toString(16)).toUpperCase();
        }
    },
    methods:{
        reload(){
            this.$http.get("/api/settings/auth/limit/list")
                .then(res=>{
                    this.list = res.data;
                    if(!this.item.limitId && this.list[0]){
                        this.itemClick(this.list[0]);
                    }else{
                        this.spinning = false;
                    }
                });
        },
        itemClick(e){
            this.spinning = true;
            this.$http.get("/api/settings/auth/limit/detail?limitId="+e.limitId)
                .then(res=>{
                    this.item = res.data;
                    this.spinning = false;
                });
        },
        itemUpdate(){

            if(this.$refs.form.hasError()){
                return;
            }
            this.spinning = true;
            this.item.limitLevel = this.itemLevel;
            this.$http.postJSON("/api/settings/auth/limit/update",this.item)
                .then(res=>{
                    this.item = res.data;
                    this.reload();
                    this.$message.success('保存成功', 2.5)
                    this.spinning = false;
                });
        },
        itemRemove(){
            this.$http.postJSON("/api/settings/auth/limit/remove?limitId="+this.item.limitId)
                .then(()=>{
                    this.item = {};
                    this.reload();
                    this.$message.success('删除成功', 2.5)
                });
        },
        itemNew(){
            this.item = {limitDesc:"未命名规则"};
        },
        validator(e){
            try{
                JSON.parse(e);
            }catch (e){
                return true;
            }
        }
    }
}
</script>

<style scoped lang="scss">

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