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
    <nk-search-item :label="config.name" :closeable="closeable" @close="close">
        <a-range-picker v-model="value" @change="change" style="width:246px;" />
    </nk-search-item>
</template>

<script>
import moment from 'moment';
export default {
    props:{
        config: Object,
        closeable: Boolean
    },
    data(){
        return {
            value: []
        }
    },
    created() {
        if(this.config.defaultValue){
            this.value = this.config.defaultValue.range[this.config.field]
        }
    },
    methods:{
        setValue(values){
            const range = values&&values[this.config.field]&&values[this.config.field].range[this.config.field]
            if(range)
                this.value = [
                    (range.from || range.from===0)&&moment(range.from*1000),
                    (range.to   || range.to  ===0)&&moment(range.to*1000)
                ];
            else
                this.value = [];
        },
        change(e){
            if(e[0]){
                const range = {};
                range[this.config.field]={
                    from:   Math.floor(e[0].hour(0) .minute(0) .second(0) .millisecond(0)  .valueOf()/1000),
                    to:     Math.floor(e[1].hour(23).minute(59).second(59).millisecond(999).valueOf()/1000)
                };
                this.$emit("changed",{
                    field:this.config.field,
                    trigger: true,
                    condition:{range}
                })
            }else{
                this.$emit("changed",{
                    field:this.config.field,
                    trigger: true,
                    condition:undefined
                })
            }
        },
        close(){
            this.$emit("close",this.config);
        }
    }
}
</script>

<style scoped>

</style>
