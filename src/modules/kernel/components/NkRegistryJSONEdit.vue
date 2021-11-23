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