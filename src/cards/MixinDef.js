export default (defaultValue)=>{
  return {
    props: {
      editMode:Boolean,
      docDef:Object,
      card:Object,
    },
    computed:{
      def:{
        get(){
          return this.card.config;
        },
        set(value){
          this.card.config = value;
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
        this.$set(this.card,"config",dv)
      }
    }
  };
}
