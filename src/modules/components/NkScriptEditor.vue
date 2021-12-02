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

    <a-modal :visible="visibleSync"
             :confirm-loading="confirmLoading"
             title="脚本编辑器"
             centered
             @ok="scriptModalOk"
             @cancel="scriptModalCancel">
        <div v-if="mode">
            <div>variables:</div>
            <a-divider></a-divider>
            <a-textarea
                    :auto-size="{ minRows: 5, maxRows: 10 }" v-model="scriptSync">
            </a-textarea>
        </div>
<pre v-if="!mode">{{scriptSync}}</pre>
    </a-modal>
</template>

<script>
  export default {
    name: "NkScriptEditor",
    props:{
      mode:Boolean,
      value:Boolean,
      script:String,
      confirmLoading:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return {
        visibleSync:false,
        scriptSync:undefined
      }
    },
    watch: {
      value(){
        this.visibleSync = this.value
      },
      script(){
        this.scriptSync = this.script
      }
    },
    methods:{
      scriptModalOk(){
        this.$emit("change",this.scriptSync);
        this.$emit('input', false)
        this.visibleSync = false;
      },
      scriptModalCancel(){
        this.$emit('input', false)
      }
    }
  }
</script>

<style scoped>
    pre{
        background-color: #eee;
        padding: 10px;
        min-height: 150px;
    }
</style>
