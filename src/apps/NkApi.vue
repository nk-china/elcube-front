<!--
	This file is part of ELCard.
	ELCard is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCard is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <nk-page-layout :spinning="spinning">
        <a-layout>
            <a-layout-sider theme="light" bordered width="240">

                <a-menu mode="inline" :open-keys="openKeys" @openChange="onOpenChange" @select="onSelect" :inlineIndent="16">
                    <template v-for="ctrl in listFilter">
                        <a-sub-menu  v-if="ctrl.funcs && ctrl.funcs.length" :key="ctrl.beanName">
                            <span slot="title">{{ ctrl.ctrlName }}</span>
                            <a-menu-item v-for="func in ctrl.funcs" :key="func.funcUrl">
                                {{func.funcName}}
                            </a-menu-item>
                        </a-sub-menu>
                        <a-menu-item v-else :key="ctrl.beanName">
                            <span>{{ ctrl.ctrlName }}</span>
                        </a-menu-item>
                    </template>
                </a-menu>

            </a-layout-sider>
            <a-layout-content>
                <a-card v-if="func" :title="func&&(func.notes||func.url)" style="margin-left: 20px;padding-right: 80px;">
                    <nk-form :col="1">
                        <nk-form-item term="URL"><span class="code">{{func.url}}</span></nk-form-item>
                        <nk-form-item term="METHOD"><span class="code">{{func.method}}</span></nk-form-item>
                        <nk-form-item term="PARAMS">
                            <div style="margin-top: 24px;">
                                <a-row v-for="p in func.params" :key="p.name" :gutter="16" style="margin: 5px 0;">
                                    <a-col :span="4" style="text-align: right;font-weight: bold;">{{p.name}}</a-col>
                                    <a-col :span="20">
                                        (<span class="code">{{p.type}}</span>)
                                        <a-tag color="orange">
                                            Required
                                        </a-tag>
                                        {{p.notes}}
                                        <highlightjs class="pre" v-if="p.bodyFormat" language='json' :code="p.bodyFormat" />
                                    </a-col>
                                </a-row>
                            </div>
                        </nk-form-item>
                        <nk-form-item term="RETURN">
                            <highlightjs class="pre" v-if="func.returContent" language='json' :code="func.returContent" />
                        </nk-form-item>
                    </nk-form>
                </a-card>
            </a-layout-content>
        </a-layout>
    </nk-page-layout>
</template>

<script>

export default {
    name: "NkSettingsAuthLimit",
    components:{
    },
    data(){
        return {
            list:[],
            openKeys:[],
            ctrl: undefined,
            func: undefined,
            filter: '',
            spinning:true
        }
    },
    created() {
        this.$http.get("/api/wsdoc/controllers")
            .then(res=>{
                console.log(res.data);
                this.list = res.data;
                this.spinning = false;
            });
    },
    computed:{
        listFilter(){
            return this.list.filter((i)=>
                i.beanName.toLowerCase().indexOf(this.filter.toLowerCase())>-1||
                i.ctrlName.toLowerCase().indexOf(this.filter.toLowerCase())>-1
            );
        }
    },
    methods:{
        onOpenChange(openKeys) {
            const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
            if(!this.listFilter.find(i=>i.beanName===latestOpenKey)){
                this.openKeys = openKeys;
            }else{
                this.openKeys = latestOpenKey ? [latestOpenKey] : [];
            }
        },
        onSelect(e){
            this.list.forEach(ctrl=>{
                if(ctrl.beanName===e.key){
                    this.ctrl = ctrl;
                    this.func = undefined;
                    return;
                }
                if(ctrl.funcs){
                    const func = ctrl.funcs.find(f=>f.funcUrl===e.key);
                    if(func){
                        this.ctrl = undefined;
                        this.func = func;
                        this.$http.get(`/api/wsdoc/controller/${ctrl.beanName}/${func.funcMapping}`)
                            .then(res=>{
                                this.func = res.data;
                            })
                    }
                }
            })

        },
    }
}
</script>

<style scoped lang="less">
::v-deep.nk-form-item {
    align-items: flex-start;
}
.pre{
    display: block;
    padding: 10px;
    margin: 5px 0 10.5px;
    line-height: 1.42857143;
    word-break: break-all;
    word-wrap: break-word;
    color: #333333;
    background-color: #f5f5f5;
    border: 1px solid #cccccc;
    border-radius: 4px;

    ::v-deep .hljs{
        background-color: inherit;
    }
}
.code{
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    white-space: nowrap;
    border-radius: 4px;
}
::v-deep.nk-form-item .term{
    font-style: italic;
    color: #3a87ad;
}
::v-deep{
    .ant-menu-vertical .ant-menu-item, .ant-menu-vertical-left .ant-menu-item, .ant-menu-vertical-right .ant-menu-item, .ant-menu-inline .ant-menu-item, .ant-menu-vertical .ant-menu-submenu-title, .ant-menu-vertical-left .ant-menu-submenu-title, .ant-menu-vertical-right .ant-menu-submenu-title, .ant-menu-inline .ant-menu-submenu-title{
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        margin: 4px 0;
    }
}
</style>