export default (defaultValue)=>{
  return {
    props: {
      editMode:Boolean,
      docDef:Object,
      cardKey:String,
    },
    computed:{
      card(){
        return this.docDef.cards.find(card=>card.cardKey===this.cardKey);
      },
      def:{
        get(){
          return this.card.config;
        },
        set(value){
          console.log(value)
          this.docDef.cards.find(card=>card.cardKey===this.cardKey).config = value;
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
        this.def = dv;
      }
    }
  };
}
