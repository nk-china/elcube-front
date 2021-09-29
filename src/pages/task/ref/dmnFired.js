export default (modeler,matchedRules)=>{
    const v = modeler._activeView;
    if(v.type==="decisionTable") {
        if (matchedRules && matchedRules[v.id]) {
            const rules = matchedRules[v.id];
            const container = modeler._container;
            const tds = container.getElementsByClassName("rule-index");
            for (let i = 0; i < tds.length; i++) {
                const td = tds[i];
                if (rules.indexOf(td.getAttribute('data-element-id')) > -1) {
                    td.parentNode.className = "fired";
                }else{
                    td.parentNode.className = "";
                }
            }
        }
    }
}