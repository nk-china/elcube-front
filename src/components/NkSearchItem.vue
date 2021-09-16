<template>
    <div class="nk-search-item" :style="{
        'min-width':min+'px',
        'max-width':max+'px'
    }">
        <span v-if="label">{{label}}</span>
        <slot></slot>
        <div v-if="closeable" class="close" @click="close"><a-icon type="close" /></div>
    </div>
</template>

<script>
  export default {
    name: "NkSearchItem",
    props:{
      label: String,
      min:{
        type: Number,
        default: 200
      },
      max:{
        type: Number,
        default: 500
      },
      closeable: Boolean
    },
    methods:{
      close(){
        this.$emit("close");
      }
    }
  }
</script>

<style lang="scss">
    .nk-search-item{

        display: flex;
        align-items: center;
        height: 32px;
        margin: 4px 10px 6px 0;

        > span {
            display: inline-block;
            white-space:nowrap;
            padding: 5px;
            font-size: 12px;
            font-weight: 500;
        }

        input,.ant-select-selection__placeholder{
            font-size: 12px;
        }

        .close{
            background: #dedede;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            line-height: 16px;
            flex-shrink: 0;
            text-align: center;
            font-size: 10px;
            margin-left: 5px;
            cursor: pointer;

            &:hover{
                background: #ccc;
            }
        }
    }
</style>
