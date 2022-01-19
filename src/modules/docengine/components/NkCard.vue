<!--
	This file is part of ELCube.
	ELCube is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCube is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <a-card :class="{'nk-page-layout-card':true,'no-expand':!expand}"
            size="default"
            :extra="extra"
            :loading="loading"
            :hoverable="true"
            :headStyle="headStyle"
            :bodyStyle="bodyStyle"
            :bordered="true"
            :activeTabKey="activeTabKey"
            :defaultActiveTabKey="defaultActiveTabKey"
            :tabList="tabList"
            @tabChange="tabChange"
    >

        <div  v-if="(card.cardName) || title" slot="title" @dblclick="card.cardKey && switchExpand()" style="user-select: none">
            {{(card.cardName)||title}}
        </div>
        <slot v-else slot="title" name="title"></slot>
        <slot slot="actions" name="actions"></slot>
        <slot slot="cover" name="cover"></slot>

        <div slot="tabBarExtraContent">
            <a-icon v-if="card.cardKey && tabList" v-show="!expand" class="expand" type="caret-up"    @click="switchExpand"></a-icon>
            <a-icon v-if="card.cardKey && tabList" v-show=" expand" class="expand" type="caret-down"  @click="switchExpand"></a-icon>
            <slot name="tabBarExtraContent"></slot>
        </div>
        <div slot="extra">
            <slot name="extra" v-if="expand"></slot>
            <nk-script-label v-if="card.debug" :value="card.beanName"></nk-script-label>
            <nk-help-link v-if="cardComponent.$docs" />
            <nk-help-link v-if="card.markdown" />
            <a-icon v-if="card.cardKey && !tabList" v-show="!expand" class="expand" type="caret-up"    @click="switchExpand"></a-icon>
            <a-icon v-if="card.cardKey && !tabList" v-show=" expand" class="expand" type="caret-down"  @click="switchExpand"></a-icon>
        </div>
        <div v-show="expand">
            <slot v-if="expand||docEditMode"></slot>
        </div>
    </a-card>
</template>

<script>
let parse = ()=>{
    try{
        return (JSON.parse(localStorage.getItem("$NkCard"))||[]);
    }catch (e) {
        return [];
    }
};
let getKey = (component)=>{
    let parent = component;
    do{
        parent = parent.$parent;
    }while(parent && !parent.doc);

    let keyPre = '';
    if(parent){
        keyPre = `${parent.doc.docType}:`;
    }
    return `${keyPre}${component.card && component.card.cardKey || component.$parent.$vnode.key}`;
};
let getExpand = (component)=>{
    const key = getKey(component);
    return key ? parse().indexOf(key)===-1 : true;
};
let setExpand = (component,expand)=>{
    const key = getKey(component);
    if(key){
        const arr = parse();
        let index = arr.indexOf(key);
        if(expand && index>-1){
            arr.splice(index,1);
        }else if(!expand && index===-1){
            arr.push(key);
        }
        if(arr.length){
            localStorage.setItem("$NkCard",JSON.stringify(arr));
        }else{
            localStorage.removeItem("$NkCard");
        }
    }
};
export default {
    props:{
        title:String,
        loading:{
            type:Boolean,
            default:false
        },
        extra:String,
        headStyle:Object,
        bodyStyle:Object,
        activeTabKey:String,
        defaultActiveTabKey:String,
        tabList:Array,
        expandable:{
            type:Boolean,
            default:true
        },
        editMode:{
            type:Boolean,
            default:false
        },
        component:Object
    },
    computed:{
        cardComponent(){
            return this.component || this.$parent;
        },
        card(){
            return this.cardComponent.card || {};
        },
        docEditMode(){
            return this.editMode || this.$parent.editMode;
        }
    },
    data(){
        return {
            expand: getExpand(this)
        }
    },
    created(){
        this.$emit("expand",this.expand);
    },
    methods:{
        tabChange(e){
            this.$emit("tabChange",e);
        },
        switchExpand(){
            this.expand = !this.expand;
            setExpand(this,this.expand);
            this.$emit("expand",this.expand);
        }
    }
}
</script>

<style scoped lang="less">
::v-deep.nk-page-layout-card{
    margin-bottom: 24px;
    .no-expand{
        .ant-card-body{
            padding: 2px;
        }
    }
}
::v-deep.ant-tabs .ant-tabs-large-bar {
    .ant-tabs-extra-content{
        line-height: 40px;
    }
    .ant-tabs-nav .ant-tabs-tab{
        padding: 12px 16px;
        font-size: 14px;
    }
}
::v-deep .ant-card-extra{
    padding: 0;
}
::v-deep .ant-card-body{
    cursor: default;
}
.expand{
    margin-left: 10px;
}
</style>
