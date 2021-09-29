

// function parseDecision(elements, id, inputs, outputs){
//
//     const decision = id ? elements.find(e=>e.id===id) : elements.find(e=>e.$type==='dmn:Decision');
//
//     if(decision.decisionLogic.$type==='dmn:DecisionTable'){
//         decision.decisionLogic.input.forEach(e=>{
//
//             let findIt = false;
//             decision.informationRequirement
//                 .filter(ir=>ir.requiredDecision)
//                 .find(ir=>{
//                     const inputId = ir.requiredDecision.href.substr(1);
//                     const decision_req = elements.find(e=>e.id===inputId);
//                     const decision_out = decision_req.decisionLogic.output.find(o=>o.name===e.inputExpression.text);
//                     findIt = decision_out !== undefined;
//                 })
//
//             if(!findIt)
//                 inputs.push({key:e.inputExpression.text,name:e.label});
//         })
//         decision.decisionLogic.output.forEach(i=>{
//             outputs.push(Object.assign({decisionId:decision.id},i));
//         })
//     }else{
//         decision.informationRequirement.forEach(ir=>{
//             if(ir.requiredInput){
//                 const inputId = ir.requiredInput.href.substr(1);
//                 const input = elements.find(e=>e.id===inputId);
//                 inputs.push({
//                     key:  input.id,
//                     name: input.name
//                 });
//             }
//         })
//         outputs.push(Object.assign({decisionId:decision.id},decision.variable));
//     }
//
//     decision.informationRequirement.forEach(ir=>{
//         if(ir.requiredDecision){
//             const inputId = ir.requiredDecision.href.substr(1);
//             parseDecision(elements,inputId,inputs,outputs);
//         }
//     })
// }
function parseDecision(elements, id, inputs, outputs){

    const decision = id ? elements.find(e=>e.id===id) : elements.find(e=>e.$type==='dmn:Decision');

    if(decision.decisionLogic){
        let outputsItem = [];
        if(decision.decisionLogic.$type==='dmn:DecisionTable'){
            decision.decisionLogic.output.forEach(i=>{
                outputsItem.push(Object.assign({decisionId:decision.id},i));
            })
        }else{
            outputsItem.push(Object.assign({decisionId:decision.id},decision.variable));
        }
        outputs.push({
            decisionId:decision.id,
            decisionName:decision.name,
            items: outputsItem
        });
    }
    if (decision.informationRequirement){

        let inputsItem = [];

        decision.informationRequirement.forEach(ir=>{
            if(ir.requiredInput){
                const inputId = ir.requiredInput.href.substr(1);
                const input = elements.find(e=>e.id===inputId);
                inputsItem.push({
                    key:  input.id,
                    name: input.name
                });
            }
        })

        if(inputsItem.length){
            inputs.push({
                decisionId:decision.id,
                decisionName:decision.name,
                items: inputsItem
            })
        }

        decision.informationRequirement.forEach(ir=>{
            if(ir.requiredDecision){
                const inputId = ir.requiredDecision.href.substr(1);
                parseDecision(elements,inputId,inputs,outputs);
            }
        })
    }

    return decision;
}


function parse(modeler,decision){

    let inputs  = [];
    let outputs = [];

    decision = parseDecision(modeler._definitions.drgElement,decision,inputs, outputs);

    return {
        id:decision.id,
        modeler: modeler,
        decisions: modeler._definitions.drgElement.filter(e=>e.$type==='dmn:Decision'),
        inputs,
        outputs
    };
}

export default parse