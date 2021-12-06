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

<style lang="less">
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
