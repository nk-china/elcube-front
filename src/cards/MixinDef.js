export default (defaultValue)=>{

  if(typeof defaultValue==='function'){
    defaultValue = defaultValue();
  }else if(defaultValue){
    defaultValue = JSON.parse(JSON.stringify(defaultValue));
  }

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
          return this.card.config || defaultValue;
        },
        set(value){
          this.docDef.cards.find(card=>card.cardKey===this.cardKey).config = value;
        }
      }
    },
    created(){
      if(!this.def){
        this.def = defaultValue;
      }
    }
  };
}
