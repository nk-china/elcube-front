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
        <a-input @click="open" v-model="value" size="small" readOnly></a-input>
        <a-modal v-model="visible" title="单据查询配置" width="60%" centered>
            <div slot="footer">
                <a-button type="primary" @click="submit">确定</a-button>
            </div>
            <a-textarea v-model="def" :rows="10"></a-textarea>
        </a-modal>
    </div>
</template>

<script>
export default {
    props: {
        value: String
    },
    data(){
        return {
            visible: false,
            def :undefined
        }
    },
    methods:{
        open(){
            this.visible = true;
            try{
                this.def = this.parse(this.value,2);
                this.error = undefined;
            }catch (e){
                this.def = this.value;
                this.error = undefined;
            }
        },
        submit(){
            try{
                this.$emit("input", this.parse(this.def));
                this.visible = false;
                this.error = undefined;
            }catch (e){
                this.error = e;
            }
        },
        parse(value,space){
            const v = value && value.replace(/\s/g,'');
            if(!v)
                return v;
            return JSON.stringify(JSON.parse(value),null,space)
        }
    }
}
</script>

<style scoped>

</style>