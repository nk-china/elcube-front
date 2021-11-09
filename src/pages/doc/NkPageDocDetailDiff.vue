<template>
    <x-nk-page-layout class="mini"
                    :spinning="spinning"
                    :showPageNav="false"
                    :showPageBar="true"
    >
        <div v-if="left" slot="top" style="padding: 20px 20px 0 20px;">
            <div class="ant-alert ant-alert-warning ant-alert-closable">
                <a-icon class="ant-alert-icon" type="info-circle" theme="filled"/>
                <span class="ant-alert-message">
                    对比 Diff ：Compare Version {{left.historyVersion||'HEAD'}} with Version {{right.historyVersion}}
                </span>
                <a type="button" tabindex="0" class="ant-alert-close-icon" @click="$emit('replace','/apps/docs/detail/'+left.docId)">
                    <span class="ant-alert-close-text">返回单据</span>
                </a>
            </div>
        </div>

        <div slot="custom">
            <a-page-header :title="left && left.def && left.def.docName" sub-title="单据对比">
                <template v-for="(c) in availableCards">
                    <div v-if="c.position==='header'" :key="c.cardKey" :class="{'row':true,'header':true,'different':diffH() || diff(c)}">
                        <component ref="components"
                                   v-if="c.left"
                                   :is="c.left.dataComponentName"
                                   :card="c.left"
                                   :doc="left"
                        />
                        <div class="divider"></div>
                        <component ref="components"
                                   v-if="c.right"
                                   :is="c.right.dataComponentName"
                                   :card="c.right"
                                   :doc="right"
                        />
                    </div>
                </template>
            </a-page-header>
        </div>

        <template v-for="(c) in availableCards">
            <div v-if="c.position==='default'" :key="c.cardKey" :gutter="16" :class="{'row':true,'different':diff(c)}">
                <component ref="components"
                           v-if="c.left"
                           :is="c.left.dataComponentName"
                           :card="c.left"
                           :doc="left"
                />
                <component ref="components"
                           v-if="c.right"
                           :is="c.right.dataComponentName"
                           :card="c.right"
                           :doc="right"
                />
            </div>
        </template>

    </x-nk-page-layout>
</template>

<script>
import XNkPageLayout from "../../layout/template/XNkPageLayout";

export default {
    components:{
        XNkPageLayout
    },
    props:{
        params:Object
    },
    data(){
        return {
            spinning:true,

            left :undefined,
            right :undefined
        }
    },

    created() {
        this.initData();
    },
    computed:{
        availableCards(){
            const cards = [];
            if(this.left&&this.left.def && this.left.def.cards){
                cards.push(
                    ...(
                        this.left.def.cards
                            .filter(item=>item.dataComponentName)
                            .map(item=>{
                                if(!this.$options.components[item.dataComponentName]){
                                    item.componentLost = item.dataComponentName;
                                    item.dataComponentName = 'nk-component-lost';
                                }
                                return {
                                    cardKey: item.cardKey,
                                    position: item.position,
                                    left: item
                                };
                            })
                    )
                );
            }
            if(this.right&&this.right.def && this.right.def.cards){
                cards.push(
                    ...(
                        this.right.def.cards
                            .filter(item=>item.dataComponentName)
                            .map(item=>{
                                if(!this.$options.components[item.dataComponentName]){
                                    item.componentLost = item.dataComponentName;
                                    item.dataComponentName = 'nk-component-lost';
                                }
                                const exists = cards.find(c=>c.cardKey===item.cardKey);
                                if(exists){
                                    exists.right = item;
                                    return undefined;
                                }else{
                                    return {
                                        cardKey: item.cardKey,
                                        position: item.position,
                                        right: item
                                    };
                                }
                            })
                            .filter(item=>item)
                    )
                );
            }
            return cards;
        },
        contextParams(){
            const params = this.params || this.$route.params;
            if(this.bpmTask){
                params.mode = 'detail';
                params.docId = this.bpmTask.businessKey;
            }
            return params;
        }
    },
    methods:{
        initData(){
            Promise.all([
                this.$http.get("/api/doc/detail/"+this.contextParams.leftId .replace(':','/')),
                this.$http.get("/api/doc/detail/"+this.contextParams.rightId.replace(':','/'))
            ]).then(res=>{
                this.left=res[0].data;
                this.right=res[1].data;

                this.$emit('setTab',`Diff:${this.left.docName}[${this.left.historyVersion||'HEAD'} VS ${this.right.historyVersion}]`);
                this.spinning = false
            });
        },
        diffH(){
            return ['docName','docNumber','docState','docBusinessKey'].filter(i=>{
                return this.left[i] !== this.right[i]
            }).length;
        },
        diff(c){
            const l = c.left  && this.left .data[c.left .cardKey];
            const r = c.right && this.right.data[c.right.cardKey];
            return JSON.stringify(l) !== JSON.stringify(r);
        }
    }
}
</script>

<style scoped lang="less">

::v-deep.nk-page-layout .nk-page-layout-content .content{
    padding-top: 16.5px;
}

.row{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 7.5px 7.5px;
    margin: -5px;
    margin-bottom: 6px;
    position: relative;


    &.different{
        border: 1px solid #ffa39e;
        background-color: #fff1f0;
    }

    &.header{
        margin: -5px 0 0;
        padding: 5px 0 0;
    }

    &.header.different + &.header.different{
        margin-top: 5px;
    }

    & > div{
        width: 49%;
        margin-top: 0 !important;
        flex-grow: 0;
    }
    & > div.divider{
        width: 1px;
        position: absolute;
        top: 8px;
        bottom: 8px;
        left:50.8%;
        border-right: 1px dashed #ddd;
    }
}
</style>
