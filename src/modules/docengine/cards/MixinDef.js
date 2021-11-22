export default (defaultValue)=>{

  return {
    props: {
      editMode:Boolean,
      docDef:Object,
      cardKey:String,
    },
    computed:{
      card(){

        const card = this.docDef.cards.find(card=>card.cardKey===this.cardKey);
        if(!card.config){

          if(typeof defaultValue==='function'){
            defaultValue = defaultValue();
          }else if(defaultValue){
            defaultValue = JSON.parse(JSON.stringify(defaultValue));
          }

          this.$set(card,'config',defaultValue);
        }
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
    },
    methods:{
      nk$callDef(options){
        return new Promise((resolve,reject)=>{
          this.$http.postJSON(
              `/api/def/doc/call`,
              {fromCard:this.card.beanName,def:this.def,options}
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
