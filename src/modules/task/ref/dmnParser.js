/*
 * 	This file is part of EAsis.
 *	EAsis is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	EAsis is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with EAsis.  If not, see <https://www.gnu.org/licenses/>.
 */


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
function parseDecision(elements, id, inputs, outputs, cache){

    const decision = id ? elements.find(e=>e.id===id) : elements.find(e=>e.$type==='dmn:Decision');

    if(cache.indexOf(decision)>-1){
        throw "循环引用";
    }
    cache.push(decision);

    if(decision){
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

                    if(!inputsItem.find(i=>i.key===input.id)){
                        inputsItem.push({
                            key:  input.id,
                            name: input.name
                        });
                    }
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
                    parseDecision(elements,inputId,inputs,outputs, cache);
                }
            })
        }

        return decision;
    }
}


function parse(modeler,decision){

    let inputs  = [];
    let outputs = [];
    let cache   = [];

    decision = parseDecision(modeler._definitions.drgElement,decision,inputs, outputs, cache);

    return {
        id:decision && decision.id,
        modeler: modeler,
        decisions: modeler._definitions.drgElement.filter(e=>e.$type==='dmn:Decision'),
        inputs,
        outputs
    };
}

export default parse