export default (doc)=>{
    if(doc && doc.def.cards){
        let docName = '# '+doc.def.docName+'\n';
        let docBody = (doc.def.markdown||'');
        let items   = doc.def.cards.filter(card=>card.markdown).map(card=>{
            return  '## '+card.cardName+ '\n' + (card.markdown||'')+ '\n';
        }).join('\n');

        let defaults= docBody || items ? '' : '`文档待完善`';
        return docName + docBody + '\n' + items + defaults
    }
    return undefined;
}