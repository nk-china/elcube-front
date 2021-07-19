import {mapGetters} from "vuex";

export default (defaultValue)=>{

  function getData(){
    let data = this.doc.componentsData[this.componentOptions.componentMapping];
    if(!data){
      data = undefined;
      if(defaultValue && typeof defaultValue==='function'){
        data = defaultValue();
      }else if(defaultValue){
        data = JSON.parse(JSON.stringify(defaultValue));
      }
    }
    return data;
  }

  return {
    props: {
      editMode:Boolean,
      createMode:Boolean,
      doc:Object,
      componentOptions:Object
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
      if(!this.doc.componentsData[this.componentOptions.componentMapping]){
        this.$set(this.doc.componentsData,this.componentOptions.componentMapping,getData.call(this));
      }
    },
    computed:{
      ...mapGetters('User',[
        'user'
      ]),
      def(){
        return this.doc.definedDoc.customComponentsDef[this.componentOptions.component];
      },
      data:{
        get(){
          return getData.call(this);
        },
        set(value){
          this.doc.componentsData[this.componentOptions.componentMapping] = value;
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
      $nkCalc(event,selfOnly){
        this.$emit("nk-calc",[selfOnly?this.componentOptions.component:'',event]);
      }
    }
  };
}
