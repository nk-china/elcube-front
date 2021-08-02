<template>
    <div>
        <div v-for="item in array" :key="item">
            <nk-script-label :value="item"></nk-script-label>
            <a type="link">
                <a-icon type="close" />
            </a>
        </div>
        <a-dropdown :trigger="['click']" style="margin-left: 10px;" >
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                <a-icon type="plus-square" />
            </a>
            <a-menu slot="overlay" @click="change">
                <a-menu-item v-for="item in options" :key="item.key">
                    <a href="javascript:;">{{ item.name }}</a>
                </a-menu-item>
            </a-menu>
        </a-dropdown>
    </div>
</template>

<script>
export default {
    props:{
        value:Array,
        options:Array
    },
    data(){
        return {
            array:[]
        }
    },
    created() {
        if(this.value){
            this.array = this.value;
        }
    },
    methods:{
        change({key}){
            const find = this.array && this.array.indexOf(key);
            if(find===-1){
                this.array.push(key);
            }else{
                this.array.splice(find,1);
            }
            this.$emit("update:value",this.array);
        }
    }
}
</script>

<style scoped>

</style>