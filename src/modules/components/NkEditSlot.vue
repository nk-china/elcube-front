
<script>
export default {
    name: "NkEditSlot",
    abstract: true,
    props:{
        editMode:{
            type: Boolean,
            default: false
        },
        options:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    render(h) {
        let c = this.$slots[this.editMode?'edit':'default'];
        return !c||c.length>1?c:h('div',Object.assign({},this.options),c)
    }
}
</script>

<style scoped>
div{
    display: inline-block;
}
</style>
