<template>
    <div role="tab"
         aria-disabled="false"
         class=" ant-tabs-tab"
         :class="active?'ant-tabs-tab-active':''"
         :draggable="tab.draggable"

         @dragstart="dragstart"
         @dragenter="dragenter"
         @dragend="dragend">
        <div>
            <a-tooltip v-if="tab.name.length>=10" :title="tab.name">
                <span @click="click">{{tab.name}}</span>
            </a-tooltip>
            <span v-else @click="click" style="margin: 0 -16px;padding: 0 16px;">{{tab.name}}</span>
            <a-popconfirm
                    v-if="tab.confirm && closeable"
                    placement="top"
                    :title="tab.confirm"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="close"
            >
                <a-icon type="close" class="ant-tabs-close-x"></a-icon>
            </a-popconfirm>
            <a-icon v-if="!tab.confirm && closeable" type="close" @click="close" class="ant-tabs-close-x"></a-icon>
        </div>
    </div>
</template>

<script>

  function getElementLeft(element){
    let actualLeft = element.offsetLeft;
    let current = element.offsetParent;
    while (current !== null){
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    return actualLeft;
  }
  export default {
    name: "NkTabItem",
    props:{
      tab: Object,
      active: Boolean,
      closeable: {
        type: Boolean,
        default: true
      }
    },
    data(){
      return {
        path: undefined
      }
    },
    created(){
      this.path = this.tab.path;
    },
    methods:{
      click(){
        this.$emit("click",this.tab);
      },
      close(){
        this.$emit("close",this.tab);
      },
      dragstart(e){
        this.$emit("dragstart",{event:e,target:e.target,tab:this.tab});
      },
      dragenter(e){
        if(this.tab.draggable){
          let target = e.target;
          while(!target.getAttribute("role")){
            target = target.parentNode;
          }
          this.$emit("dragenter",{
            target,tab:this.tab,
            before: e.clientX < getElementLeft(target) + target.clientWidth / 2
          });
        }
      },
      dragend(){
        this.$emit("dragend",this.tab);
      }
    }
  }
</script>

<style scoped lang="scss">
    .ant-tabs-tab{
        max-width: 200px;
        flex-shrink: 1;

        > div {
            display: flex;
            align-items: center;
            > span{
                display: inline-block;
                max-width: 156px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
</style>
