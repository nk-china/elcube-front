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
          return this.card.config;
        },
        set(value){
          this.card.config = value;
        }
      }
    },
    created(){
      if(!this.card.config){
        this.$set(this.card,'config',defaultValue);
      }
    },
    methods:{
      nk$callDef(options){
        return new Promise((resolve,reject)=>{
          this.$http.postJSON(
              `/api/def/doc/call`,
              {fromCard:this.cardKey,def:this.def,options}
          )
          .then(response=>{
            resolve(response.data);
          })
          .catch(reject)
          .finally((e)=>{
            reject(e);
          })
        })
      },
    }
  };
}
