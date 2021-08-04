import NkCardHistorys from "../NkCardHistorys";
import ClassifyMapping from "../ClassifyMapping";
import {mapGetters} from "vuex";

export default {

    components:{
        NkCardHistorys
    },
    props:{
        bpmTask: Object,
        params: Object,
        preview: {
            type:Boolean,
            default:false,
        },
        pageNav: {
            type:Boolean,
            default:true,
        },
    },
    computed:{
        ...mapGetters('User',[
            'user'
        ]),
        ...mapGetters('NkDoc',[
            'layoutConfig'
        ]),
    },
    methods:{
        nkCalc(params,component){

            let componentName = Array.isArray(params)?params[0]:'';
            let calculate = Array.isArray(params)?params[1]:params;

            this.spinning=true;
            this.$http.postJSON(`/api/doc/calculate/${this.doc.docType}?component=${componentName}&calculate=${calculate}`,this.doc)
                .then(response=>{
                    this.doc = response.data;
                    this.$nextTick(()=>{
                        this.nkChanged({
                            event:'nk-calc',
                            calculate
                        },component);
                    })
                })
                .finally(()=>{
                    this.spinning=false;
                })
        },
        nkChanged(e,component){
            Object.assign(e,{$source:component && component.component});
            this.$refs.components&&this.$refs.components.forEach(c=>c.docUpdate&&c.docUpdate(e));
        },
        nkEditModeChanged(editMode){
            this.editMode = editMode;
            this.$emit("editModeChanged",this.editMode);
            this.$nextTick(()=>{
                this.$refs.components&&this.$refs.components.forEach(c=>c.docEditModeChanged &&c.docEditModeChanged(this.editMode));
            });
        },
        showHistory(){
            if(this.histories){
                this.histories = undefined;
            }else{
                this.histories = [];
            }
        },
        toDoc(){
            this.$emit('replace',ClassifyMapping[this.doc.classify].detailUrl+this.doc.docId);
        },
        historyClass(componentName){
            return this.history && this.history.changedComponents && this.history.changedComponents.indexOf(componentName)>=0
                ?'changed':'';
        },
        buildAnchorLink(component){
            return (this.history?this.history.id:this.doc.docId) + '-' + component;
        }
    }
}