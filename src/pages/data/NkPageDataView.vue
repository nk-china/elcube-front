<template>
    <nk-page-layout :title="dataView.name" class="layout" :spinning="spinning">

        <div slot="action" style="margin: 0 10px;">
            <a-button-group>
                <a-button type="primary" @click="doSave" :loading="loadingSave"><a-icon type="save" /></a-button>
                <a-button type="default" @click="openSetting"><a-icon type="edit" /></a-button>
                <a-button type="default" @click="doPlay"><a-icon type="eye" /></a-button>
                <a-button type="default" @click="openCardList"><a-icon type="table" /></a-button>
            </a-button-group>
        </div>

        <nk-data-v ref="dataV" :edit-mode="editMode" :data-view="dataView"></nk-data-v>

        <a-modal v-model="modalSetting.visible" title="基础设置" centered>
            <nk-form :col="1">
                <nk-form-item title="描述">
                    <a-input v-model="dataView.name"></a-input>
                </nk-form-item>
                <nk-form-item title="宽">
                    <a-input-number v-model="dataView.width"></a-input-number>
                </nk-form-item>
                <nk-form-item title="高">
                    <a-input-number v-model="dataView.height"></a-input-number>
                </nk-form-item>
                <nk-form-item title="主题">
                    <a-select v-model="dataView.theme" :options="themes"></a-select>
                </nk-form-item>
            </nk-form>
            <template slot="footer">
                <a-button type="primary" key="back" @click="modalSetting.visible=false">
                    确定
                </a-button>
            </template>
        </a-modal>
        <a-modal v-model="modalAvailableCards.visible" title="卡片">
            <a-list bordered="" :data-source="modalAvailableCards.cards" size="small">
                <a-list-item slot="renderItem" slot-scope="item">
                    {{item.name}}
                    <a slot="actions" @click="addCard(item.w,item.h,item.component,item.name)">添加</a>
                </a-list-item>
            </a-list>
            <template slot="footer">
                <a-button key="back" @click="modalAvailableCards.visible=false">
                    关闭
                </a-button>
            </template>
        </a-modal>
    </nk-page-layout>
</template>

<script>


import {v4 as uuidv4} from "uuid";
import DomUtils from "@/utils/DomUtils";
import CanvasUtil from "@/utils/CanvasUtil";

import "@/boot/datav.theme.default.less";
import NkDataV from "@/pages/data/NkDataV";
import {mapState} from "vuex";

export default {
    components:{
        NkDataV
    },
    provide(){
        return {
            mode: 'dashboard'
        };
    },
    data(){
        return {
            spinning:true,
            loadingSave:false,
            dataView:{},
            editMode:true,

            modalSetting:{
                visible:false,
            },
            modalAvailableCards:{
                visible:false,
                cards:[]
            },
        }
    },
    created(){
        this.load();
    },
    computed:{
        ...mapState('DataV',['themes'])
    },
    methods:{

        openSetting(){
            this.modalSetting.visible = true;
        },
        openCardList(){
            this.$http.get("/api/meter/card/list")
                .then((res)=>{
                    this.modalAvailableCards.cards = res.data;
                    this.modalAvailableCards.visible=true;
                });
        },
        addCard(w,h,component,title){
            w *= 30;
            h *= 30;
            let x = 0;
            let y = 0;

            this.dataView.layout.push({
                "i":uuidv4(),
                x,
                y,
                w,
                h,
                component,
                title,
            });
        },
        load(){
            this.spinning = true;
            this.$http.get(`/api/dataView/load?id=${this.$route.params.id}`)
                .then(res=>{
                    this.dataView = res.data;
                    this.$set(this.dataView,'layout',JSON.parse(this.dataView.config||'[]'));
                    this.spinning = false;
                    this.$emit("setTab","DataV:"+this.dataView.name);
                });
        },
        doSave(){
            this.loadingSave = true;
            const self = this;
            CanvasUtil.html2canvas(this.$refs.dataV.$el).then(function(canvas) {
                self.dataView.config = JSON.stringify(self.dataView.layout);
                self.dataView.thumbnail = CanvasUtil.scale(canvas,400,300).toDataURL("image/png");

                self.$http.postJSON("/api/dataView/update",self.dataView)
                    .then(()=>{
                        self.$message.info("Tips: 保存成功")
                    }).finally(()=>{
                        self.loadingSave = false;
                    });
            });
        },
        doPlay(){
            this.editMode = false;
            DomUtils.requestFullScreen(undefined,()=>{
                this.editMode = true;
            });
        }
    }
}
</script>

<style lang="less">
</style>
<style scoped lang="less">
</style>
