
import NkCardDataMapReduce from "@/data/NkCardDataMapReduce";
import NkCardDataMapReduceDef from "@/data/NkCardDataMapReduceDef";

function install(Vue){
    Vue.component("NkCardDataMapReduce",NkCardDataMapReduce);
    Vue.component("NkCardDataMapReduceDef",NkCardDataMapReduceDef);
}

export default {
    install
}