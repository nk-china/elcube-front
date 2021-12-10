<template>
    <pre><code>{{value}}</code></pre>
</template>

<script>
export default {
    props:{
        el:String,
        isJson:Boolean
    },
    computed:{
        value(){
            if(this.el && this.isJson){
                return JSON.stringify(JSON.parse(this.el),null,4)
            }
            return this.el;
        }
    }
}
</script>

<style scoped>
    pre{
        margin: 0;
        background-color: #eee;
        padding: 2px 5px;
        border-radius: 2px;
    }
</style>