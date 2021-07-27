
import NkCardHeaderDefault from "./header/defaults/NkCardHeaderDefault";
import NkCardHeaderDefaultDef from "./header/defaults/NkCardHeaderDefaultDef";
import NkCardHeaderPartner from "./header/defaults/NkCardHeaderPartner";
import NkCardHeaderPartnerDef from "./header/defaults/NkCardHeaderPartnerDef";
import NkCardSimple from "./simple/NkCardSimple";
import NkCardSimpleDef from "./simple/NkCardSimpleDef";

let install = function (Vue) {
    Vue.component("NkCardHeaderDefault",NkCardHeaderDefault);
    Vue.component("NkCardHeaderDefaultDef",NkCardHeaderDefaultDef);
    Vue.component("NkCardHeaderPartner",NkCardHeaderPartner);
    Vue.component("NkCardHeaderPartnerDef",NkCardHeaderPartnerDef);
    Vue.component("NkCardSimple",NkCardSimple);
    Vue.component("NkCardSimpleDef",NkCardSimpleDef);

};

export default {install}
