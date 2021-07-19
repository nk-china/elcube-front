export default (defaultValue)=>{
  return {
    props: {
      component:Object,
      editMode:Boolean,
      docDef:Object,
      componentsDef:Object
    },
    computed:{
      def:{
        get(){
          return this.componentsDef[this.component.component];
        },
        set(value){
          this.componentsDef[this.component.component] = value;
        }
      }
    },
    beforeCreate() {
    },
    created(){
      if(!this.def){
        let dv = undefined;
        if(typeof defaultValue==='function'){
          dv = defaultValue();
        }else{
          dv = JSON.parse(JSON.stringify(defaultValue));
        }
        this.$set(this.componentsDef,this.component.component,dv)
      }
    }
  };
}
