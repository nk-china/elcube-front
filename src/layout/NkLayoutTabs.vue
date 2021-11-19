<template>
    <div class="nk-layout-tabs ant-tabs ant-tabs-small ant-tabs-top ant-tabs-card ant-tabs-editable-card ant-tabs-no-animation">
        <div role="tablist" tabindex="0" class="ant-tabs-bar ant-tabs-top-bar ant-tabs-card-bar ant-tabs-small-bar">
            <div class="ant-tabs-nav-container" :class="{'ant-tabs-nav-container-scrolling':scrolling}">
                <span ref="btnPrev" unselectable="unselectable" class="ant-tabs-tab-prev" :class="{
                        'ant-tabs-tab-arrow-show':scrolling,
                        'ant-tabs-tab-btn-disabled':btnPrevDisabled
                        }" @click="slide(-1)">
                    <span class="ant-tabs-tab-prev-icon">
                        <a-icon type="left" class="ant-tabs-tab-next-icon-target"></a-icon>
                    </span>
                </span>
                <span ref="btnNext" unselectable="unselectable" class="ant-tabs-tab-next" :class="{
                        'ant-tabs-tab-arrow-show':scrolling,
                        'ant-tabs-tab-btn-disabled':btnNextDisabled
                        }" @click="slide(1)">
                    <span class="ant-tabs-tab-next-icon">
                        <a-icon type="right" class="ant-tabs-tab-next-icon-target"></a-icon>
                    </span>
                </span>
                <a-dropdown :trigger="['contextmenu']" @visibleChange="dropdownChange">
                    <div class="ant-tabs-nav-wrap" @mousedown="dropdownMousedown">
                        <div ref="antTabsNavScroll" class="ant-tabs-nav-scroll">
                            <div ref="antTabsNav"
                                 class="ant-tabs-nav ant-tabs-nav-animated"
                            >
                                <nk-tab-item v-for="(item,index) in items"
                                             :key="item.path||index"
                                             :tab="item"
                                             :closeable="item.closable||item.closable===undefined"
                                             :active="item.path === activePath"
                                             ref="items"
                                             @click="itemClick"
                                             @close="itemClose"
                                             @dragstart="itemDragstart"
                                             @dragover="itemDragover"
                                             @dragend="itemDragend"
                                >
                                </nk-tab-item>
                            </div>
                        </div>
                    </div>
                    <a-menu ref="contextMenu" slot="overlay" @click="contextClick">
                        <a-menu-item key="refresh"      v-if="dropdownConfig.refresh">
                            重新加载
                        </a-menu-item>
                        <a-menu-item key="openWin"      v-if="dropdownConfig.refresh">
                            在新页面中打开
                        </a-menu-item>
                        <a-menu-divider                 v-if="dropdownConfig.refresh" />
                        <a-menu-item key="close"        v-if="dropdownConfig.close">
                            关闭
                        </a-menu-item>
                        <a-menu-item key="closeOthers"  v-if="dropdownConfig.closeOthers">
                            关闭其他标签页
                        </a-menu-item>
                        <a-menu-item key="closeAll"     v-if="dropdownConfig.closeAll">
                            关闭全部
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import NkTabItem from "./NkLayoutTabItem";
import DomUtils from "@/utils/DomUtils";

function getElementLeft(element){
    let actualLeft = element.offsetLeft;
    let current = element.offsetParent;
    while (current !== null){
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
}

let self = undefined;
let timeout = undefined;
function resize(){
    if(self){
        if(timeout){
            clearTimeout(timeout);
        }
        timeout = setTimeout(()=>{
            timeout = undefined;
            self.$nextTick(()=>{
                self.updateScrolling();
            });
        },500);
    }
}

export default {
    name: "NkTabs",
    props: {
        activePath: String,
        items:{
            type: Array,
            default(){
                return [];
            }
        }
    },
    components:{
        NkTabItem
    },
    data(){
        return {
            active: undefined,
            dragSrc: undefined,
            scrolling: false,
            transformLeft: 0,
            btnPrevDisabled: false,
            btnNextDisabled: false,
            screenWidth:document.documentElement.clientWidth,
            dropdownIndex: undefined,
            dropdownConfig: {
                refresh:false,
                close:false,
                closeOthers:false,
                closeAll:true
            }
        }
    },
    created() {
        self = this;
    },
    mounted(){
        this.$nextTick(()=>{
            this.updateScrolling();
        });
        window.addEventListener("resize",resize);
    },
    updated(){
        this.$nextTick(()=>{
            this.updateScrolling();
        })
    },
    methods:{
        itemClick(e){
            if(e.path!==this.activePath){
                this.$router.push(e.route)
            }
        },
        itemClose(e){
            this.$emit("close",e);
        },
        itemDragstart(e){
            this.dragSrc = e;
            e.dataTransfer.effectAllowed = "move";
        },
        itemDragover(e){
            let target = e.target;
            if(!DomUtils.hasClass(target,'nk-nav-tab')){
                target = DomUtils.findParent(target,(d)=>DomUtils.hasClass(d,'nk-nav-tab'));
            }
            if(target&&this.dragSrc){
                e.dataTransfer.dropEffect = "move";
                e.preventDefault();
            }
            if(this.dragSrc && target && target.draggable && target!==this.dragSrc.target){

                for(let i = 0;i < target.parentNode.childNodes.length; i++){
                    if(target.parentNode.childNodes[i]===target){
                        target.parentNode.insertBefore(this.dragSrc.target, target);
                        break;
                    }
                    if(target.parentNode.childNodes[i]===this.dragSrc.target){
                        if(target.nextSibling){
                            target.parentNode.insertBefore(this.dragSrc.target, target.nextSibling);
                        }else{
                            target.parentNode.appendChild(this.dragSrc.target);
                        }
                        break;
                    }
                }
            }
        },
        itemDragend(){
            this.dragSrc = undefined;
            this.$nextTick(()=>{
                let items = [];
                this.$refs.antTabsNav.children.forEach(elTab=>{
                    const item = this.$refs.items.find(item=>item.$el===elTab);
                    items.push(item.tab);
                });
                this.$emit("sort",items);
            })
        },
        max(){
            return Math.max(this.$refs.antTabsNav.clientWidth - this.$refs.antTabsNavScroll.clientWidth, 0);
        },
        min(){
            return 0;
        },
        /**
         * 当items内容变化时，更新滚动状态
         */
        updateScrolling(){
            if(this.$refs.antTabsNavScroll){
                this.scrolling = this.$refs.antTabsNavScroll.clientWidth < this.$refs.antTabsNav.clientWidth;
                if(!this.scrolling){
                    this.transformLeft = 0;
                }
                let item = this.items.find(item=>item.path === this.activePath);
                if(item)this.scrollToItem(item);
            }
        },
        /**
         * 左右按钮切换
         */
        slide(direction){
            let target = this.transformLeft + this.$refs.antTabsNavScroll.clientWidth * direction;
            this.scrollTo(target);
        },
        /**
         * 滑动到指定位置，并更新左右按钮状态
         * @param transformLeft
         */
        scrollTo(transformLeft){
            if(transformLeft!==undefined){
                this.transformLeft = transformLeft;
            }
            this.transformLeft = Math.min(this.max(),this.transformLeft);
            this.transformLeft = Math.max(this.min(),this.transformLeft);
            this.$nextTick(()=>{
                this.$refs.btnPrev.className = this.$refs.btnPrev.className.replace(' ant-tabs-tab-btn-disabled','')
                    + (this.transformLeft === 0?' ant-tabs-tab-btn-disabled':'');
                this.$refs.btnNext.className = this.$refs.btnNext.className.replace(' ant-tabs-tab-btn-disabled','')
                    + (this.transformLeft >= this.$refs.antTabsNav.clientWidth - this.$refs.antTabsNavScroll.clientWidth?' ant-tabs-tab-btn-disabled':'');
                this.$refs.antTabsNav.style.transform = `translate3d(${-this.transformLeft}px, 0px, 0px)`;
            })
        },
        /**
         * 滑动到指定的tab选项
         * @param item
         */
        scrollToItem(item){

            let ref = this.$refs.items.find(ref=>ref.tab===item);
            let targetX = ref.$el.offsetLeft;
            let targetW = ref.$el.clientWidth;
            let targetXR = targetX + targetW + 4;

            if(targetX < this.transformLeft) {
                this.scrollTo(targetX - 30);
            }else if(targetXR > this.transformLeft + this.$refs.antTabsNavScroll.clientWidth){
                this.scrollTo(targetXR - this.$refs.antTabsNavScroll.clientWidth + 30);
            }else{
                this.scrollTo();
            }
        },
        getTargetTab(menuLeft){
            let navLeft = getElementLeft(this.$refs.antTabsNav) - this.transformLeft;

            let path = undefined;
            for(let i in this.$refs.items){
                let item = this.$refs.items[i];
                let itemL = navLeft + item.$el.offsetLeft;
                let itemR = itemL   + item.$el.clientWidth;
                if(itemL <= menuLeft && menuLeft <= itemR){
                    path = item.path;
                    break;
                }
            }
            return this.items.find(item=>item.path===path);
        },
        dropdownMousedown(e){
            if(e.button===2){
                let tab = this.getTargetTab(e.clientX);
                if(tab){
                    this.dropdownConfig.close=tab.closable !== false;
                    this.dropdownConfig.refresh=this.activePath===tab.path;
                    this.dropdownConfig.closeOthers=true;
                }else{
                    this.dropdownConfig.close=false;
                    this.dropdownConfig.refresh=false;
                    this.dropdownConfig.closeOthers=false;
                }
            }
        },
        dropdownChange(){},
        contextClick(e){

            let menuLeft = getElementLeft(this.$refs.contextMenu.$el);
            let tab = this.getTargetTab(menuLeft);

            if(e.key==='closeAll'){
                this.$emit('closeAll')
                return;
            }

            if(tab){
                if(e.key==='close'){
                    this.$emit('close',tab)
                }else if(e.key==='closeOthers'){
                    this.$emit('closeOthers',tab)
                }else if(e.key==='refresh'){
                    this.$emit('item-refresh',tab)
                }else if(e.key==='openWin'){
                    window.open(`#${tab.path}`);
                }
            }
        }
    }
}
</script>

<style scoped>
.ant-tabs-flex{
    display: flex;
}
</style>
