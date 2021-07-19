<template>
    <a v-if="type==='a'" @click="click">
        <slot></slot>
    </a>
    <a-button v-else :type="type" @click="click">
        <slot></slot>
    </a-button>

</template>

<script>
export default {
    props:{
        type:{
            type:String,
            default:"a"
        },
        doc:Object
    },
    computed:{
        to(){
            if(this.doc.itemType==='BPM:TASK'||this.doc.classify==='bpmTask'){
                return '/apps/tasks/task/'+(this.doc['itemId']||this.doc['taskId']);
            }
            let path = '';
            switch (this.doc.classify) {
                case 'PROJECT':
                    path = '/apps/projects/detail/'+this.doc['docId'];
                    break;
                case 'PARTNER':
                    path = '/apps/partners/detail/'+this.doc['docId'];
                    break;
                case 'PARTNER_T':
                    path = '/apps/partners/doc/'+this.doc['docId'];
                    break;
                case 'PRODUCT':
                    path = '/apps/products/detail/'+this.doc['docId'];
                    break;
                default:
                    path = '/apps/docs/detail/'+this.doc['docId'];
                    break;
            }
            return path;
        }
    },
    methods:{
        click(e){
            this.$router.push(this.to);
            this.$emit("click",e);
            e.stopPropagation();
        }
    }
}
</script>

<style scoped>

</style>