

function parseDecision(elements, id, inputs, outputs){

    const decision = id ? elements.find(e=>e.id===id) : elements.find(e=>e.$type==='dmn:Decision');

    if(decision.decisionLogic.$type==='dmn:DecisionTable'){
        decision.decisionLogic.input.forEach(e=>{
            inputs.push({key:e.inputExpression.text,name:e.label});
        })
        decision.decisionLogic.output.forEach(i=>{
            outputs.push(Object.assign({decisionId:decision.id},i));
        })
    }else{
        decision.informationRequirement.forEach(ir=>{
            if(ir.requiredInput){
                const inputId = ir.requiredInput.href.substr(1);
                const input = elements.find(e=>e.id===inputId);
                inputs.push({
                    key:  input.id,
                    name: input.name
                });
            }
        })
        outputs.push(Object.assign({decisionId:decision.id},decision.variable));
    }

    decision.informationRequirement.forEach(ir=>{
        if(ir.requiredDecision){
            const inputId = ir.requiredDecision.href.substr(1);
            parseDecision(elements,inputId,inputs,outputs);
        }
    })
}


function parse(modeler,decision){

    let inputs  = [];
    let outputs = [];

    parseDecision(modeler._definitions.drgElement,decision,inputs, outputs);

    return {
        modeler: modeler,
        decisions: modeler._definitions.drgElement.filter(e=>e.$type==='dmn:Decision'),
        inputs,
        outputs
    };
}

export default parse