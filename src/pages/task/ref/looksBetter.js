
function init(registry, modeling, options, taskKey){
    registry.forEach(element=>{
        if(element.id === taskKey){
            modeling.setColor(element,options.activeTask);
        }else if(/bpmn[:].*Task/.test(element.type)){
            modeling.setColor(element, options.completedTask);
        }else{
            modeling.setColor(element, options.defaults);
        }
    });
}

function loopNext(registry, modeling, options, fromKey, looped){
    looped.push(fromKey);
    registry
        .filter(element=>element.type==='bpmn:SequenceFlow' && element.businessObject.sourceRef.id===fromKey)
        .forEach(sequenceFlow=>{
            // sequenceFlow 找到向下流转的flow
            modeling.setColor(sequenceFlow, options.inactiveLine);
            const nextId = sequenceFlow.businessObject.targetRef.id;

            if(looped.indexOf(nextId)===-1){
                // next 找到流转的节点
                const next = registry.find(element=>element.id===nextId);
                modeling.setColor(next, options.inactiveTask);
                loopNext(registry, modeling, options, nextId, looped);
            }
        });
}

export default (viewer, taskKey, options)=>{

    options = Object.assign({
        defaults:       {stroke: '#aaaaaa', fill: ''},
        completedTask:  {stroke: '#ffffff', fill: '#999999'},
        activeTask:     {stroke: '#ffffff', fill: '#40a9ff'},
        inactiveLine:   {stroke: '#000000', fill: ''},
        inactiveTask:   {stroke: '#000000', fill: '#ffffff'}
    },options);

    const registry = viewer.get('elementRegistry');
    const modeling = viewer.get('modeling');

    init(registry, modeling, options, taskKey);
    loopNext(registry, modeling, options, taskKey, []);
}