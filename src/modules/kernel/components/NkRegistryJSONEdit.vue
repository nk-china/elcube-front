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
    <div>
        <a-textarea v-model="val" @blur="change" :auto-size="{minRows:5,maxRows:20}"></a-textarea>
        <span v-if="error">{{error}}</span>
    </div>
</template>

<script>
export default {
    props:{
        value: {},
    },
    data(){
        return {
            val:undefined,
            error:undefined
        }
    },
    created() {
        this.val = JSON.stringify(this.value,false,4);
    },
    watch:{
        value(){
            this.val = JSON.stringify(this.value,false,4);
        }
    },
    computed:{
        text:{
            get(){
                return this.val;
            },
            set(v){
                this.val = v;
            }
        }
    },
    methods:{
        change(){
            try{
                this.$emit("input",JSON.parse(this.val));
                this.error = undefined;
            }catch (e){
                this.error = e.message;
            }
        }
    }
}
</script>

<style scoped>

</style>