import {mapGetters} from "vuex";

export default ()=>{

  return {
    props: {
      editMode:Boolean,
      createMode:Boolean,
      doc:Object,
      card:Object
    },
    data(){
      return {
        pager:{
          current: 1,
          size: 10,
        }
      }
    },
    created() {
    },
    computed:{
      ...mapGetters('User',[
        'user'
      ]),
      def(){
        return this.card.config;
      },
      data:{
        get(){
          return this.doc.data[this.card.cardKey];
        },
        set(value){
          this.doc.data[this.card.cardKey] = value;
        }
      },
      pagedData(){
        if(this.data instanceof Array){
          const start = (this.pager.current-1)*this.pager.size;
          return this.data.slice(start,start+this.pager.size);
        }
        return [];
      }
    },
    methods:{
      $nkCall(event){
        return new Promise((resolve,reject)=>{
          this.$http.postJSON(`/api/doc/call/${this.doc.docType}?component=${this.componentOptions.component}&event=${event}`,this.doc)
              .then(response=>{
                resolve(response.data);
              })
              .catch(reject)
              .finally((e)=>{
                reject(e);
              })
        })
      },
      $nkCalc(options){
        this.$emit("nk-calc",options);
      }
    }
  };
}
