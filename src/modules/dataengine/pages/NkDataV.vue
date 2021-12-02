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
    <div class="container nk-datav" :class="dataView.theme">
        <div ref="wrapper" class="wrapper" :class="dataView.theme||'default'" :style="{'width':dataView.width +'px','height':dataView.height +'px'}"
             @dragover="wrapperDragOver"
        >
            <div class="size">{{dataView.width}}x{{dataView.height}}</div>
            <div v-for="(item) in layoutFilter"
                 @mousedown="itemMousedown"
                 @mouseup="itemMouseup($event,item)"
                 @dragstart="itemDragStart"
                 @drag="itemDrag($event,item)"
                 @dragend="itemDragEnd($event,item)"
                 :key="item.i"
                 :class="{
                             'item':true,
                             'resize':editMode,
                         }"
                 :style="{
                            left  :item.x + 'px',
                            top   :item.y + 'px',
                            width :item.w + 'px',
                            height:item.h + 'px',
                         }">
                <component v-if="item.component"
                           :is="item.componentLost?'nk-dashboard-lost':item.component"
                           :title="item.title"
                           v-model="item.config"
                           :editable="editMode"
                           ref="items"
                           @remove="removeCard(item)"
                           @update:config="cardConfigUpdated(item,$event)"
                ></component>
                <a-card v-else :title="item.title" size="small" style="height:100%;" ref="items">
                    {{ item.i }}{{item.component}}
                </a-card>
            </div>
        </div>
    </div>
</template>

<script>
import DomUtils from "@/utils/DomUtils";

export default {
    props:{
        editMode: Boolean,
        dataView: Object,
    },
    data(){
        return {
            dragOptions:{
                offsetX: 0,
                offsetY: 0,
            }
        }
    },
    computed:{
        layout(){
            return this.dataView.layout || [];
        },
        layoutFilter(){
            return this.layout.map(item=>{
                item.componentLost = !this.$options.components[item.component];
                return item;
            });
        }
    },
    created() {
        if(!this.dataView.layout && this.dataView.config){
            this.$set(this.dataView,'layout',JSON.parse(this.dataView.config));
        }
    },
    methods:{
        wrapperDragOver(e){
            e.dataTransfer.dropEffect = "move";
            e.preventDefault();
        },
        itemDragStart(e){
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.dropEffect = "move";
        },
        itemDrag(e,item){
            if(DomUtils.hasClass(e.target,'item')){

                const rect = this.$refs.wrapper.getBoundingClientRect();
                const clientX = Math.min(Math.max(e.clientX,rect.left),rect.right);
                const clientY = Math.min(Math.max(e.clientY,rect.top), rect.bottom);

                item.x = clientX - this.$refs.wrapper.getBoundingClientRect().left - this.dragOptions.offsetX;
                item.y = clientY - this.$refs.wrapper.getBoundingClientRect().top  - this.dragOptions.offsetY;
            }
        },
        itemDragEnd(e,item){
            if(DomUtils.hasClass(e.target,'item')){
                e.target.draggable = false;

                const rect = this.$refs.wrapper.getBoundingClientRect();
                const clientX = Math.min(Math.max(e.clientX,rect.left),rect.right);
                const clientY = Math.min(Math.max(e.clientY,rect.top), rect.bottom);

                item.x = clientX - this.$refs.wrapper.getBoundingClientRect().left - this.dragOptions.offsetX;
                item.y = clientY - this.$refs.wrapper.getBoundingClientRect().top  - this.dragOptions.offsetY;
            }
        },
        itemMousedown(e){
            if(this.editMode && DomUtils.hasClass(e.target,'ant-card-head-title')){
                const boxItem = DomUtils.findParent(e.target,(parent)=>{
                    return DomUtils.hasClass(parent,'item')
                });
                if(boxItem){

                    const boxItemRect =  boxItem.getBoundingClientRect();
                    const targetRect  = e.target.getBoundingClientRect();

                    boxItem.draggable='move';
                    this.dragOptions.offsetX = e.offsetX - boxItemRect.left + targetRect.left;
                    this.dragOptions.offsetY = e.offsetY - boxItemRect.top  + targetRect.top;
                }
            }
        },
        itemMouseup(e,item){
            if(DomUtils.hasClass(e.target,'item')) {
                const rect = e.target.getBoundingClientRect();
                item.w = rect.width;
                item.h = rect.height;
            }
        },
        removeCard(item){
            this.layout.splice(this.layout.indexOf(item),1);
        },
        cardConfigUpdated(item,config){
            this.$set(item,'config',config);
        },
    }
}
</script>

<style scoped lang="less">

:fullscreen {
    .container{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 11;
        background-color: black;
        display: flex;
        align-items: center;

        .wrapper{
            border: none;
            .size{
                display: none;
            }
        }
    }
}

.container{
    overflow: auto;
    & > .wrapper{
        position: relative;
        margin: 0 auto;
        border: dashed 1px #ccc;
        overflow: hidden;
        background-color: #fafafa;

        .size{
            position: absolute;
            left: 0;
            top:  0;
            z-index: 0;
            color: #999;
            font-size: 10px;
        }

        .item{
            position: absolute;
            overflow: hidden;
            //transition: 0.2s left, 0.2s top;

            &.resize{
                resize: both;
            }

            .resize-handler{
                position: absolute;
                z-index: 1;
                width: 20px;
                height: 20px;
                bottom: 0;
                right: 0;
                padding: 0 3px 3px 0;
                background: url(data:image/svg+xml;base64,PHN2ZyBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjYiIGhlaWdodD0iNiI+PHBhdGggZD0iTTYgNkgwVjQuMmg0LjJWMEg2djZ6IiBvcGFjaXR5PSIuMzAyIi8+PC9zdmc+) no-repeat 100% 100%;
                background-origin: content-box;
                box-sizing: border-box;
                cursor: se-resize;
            }
        }
    }
}
</style>