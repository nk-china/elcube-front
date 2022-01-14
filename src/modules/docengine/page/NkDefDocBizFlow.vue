<template>
    <nk-page-layout title="业务流全览">


        <a-card>
            <div ref="container"></div>
        </a-card>
    </nk-page-layout>
</template>

<script>

// const data = {
//     // 节点
//     nodes: [
//         {
//             id: 'node1', // String，可选，节点的唯一标识
//             width: 80,   // Number，可选，节点大小的 width 值
//             height: 40,  // Number，可选，节点大小的 height 值
//             label: 'hello', // String，节点标签
//         },
//         {
//             id: 'node2', // String，节点的唯一标识
//             width: 80,   // Number，可选，节点大小的 width 值
//             height: 40,  // Number，可选，节点大小的 height 值
//             label: 'world', // String，节点标签
//         },
//     ],
//     // 边
//     edges: [
//         {
//             source: 'node1', // String，必须，起始节点 id
//             target: 'node2', // String，必须，目标节点 id
//         },
//     ],
// };

import { Graph } from '@antv/x6';
import { DagreLayout } from '@antv/layout'

Graph.registerNode(
    'activity',
    {
        inherit: 'rect',
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'image',
                selector: 'img',
            },
            {
                tagName: 'text',
                selector: 'label',
            },
        ],
        attrs: {
            body: {
                rx: 6,
                ry: 6,
                stroke: '#5F95FF',
                fill: '#EFF4FF',
                strokeWidth: 1,
            },
            img: {
                x: 6,
                y: 6,
                width: 16,
                height: 16,
                'xlink:href':
                    'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*pwLpRr7QPGwAAAAAAAAAAAAAARQnAQ',
            },
            label: {
                fontSize: 12,
                fill: '#262626',
            },
        },
    },
    true,
)

export default {
    name: "NkDefBizFlow",
    data(){
        return {
            graph:undefined,
            nodes:[],
        }
    },
    mounted() {

        this.graph = new Graph({
            container: this.$refs.container,
            width: "100%",
            height: 600,
            autoResize: true,
            interacting: false,
            mousewheel: {
                enabled: true,
                modifiers: ['ctrl', 'meta'],
            },
            panning: {
                enabled: true,
                eventTypes: ['leftMouseDown']
            },
        });
        const gridLayout = new DagreLayout({
            type: 'dagre',
            rankdir: 'LR',
            align: 'UL',
            ranksep: 50,
            nodesep: 15,
            controlPoints: true,
        })
        this.$http.get('/api/doc/bizFlows')
            .then(res=>{
                this.nodes = res.data.map(i=>{
                    return {
                        id: i.docType,
                        width: 130,   // Number，可选，节点大小的 width 值
                        height: 40,  // Number，可选，节点大小的 height 值
                        shape: 'html',
                        html: () => {
                            const wrap = document.createElement('div')
                            wrap.style.width = '100%'
                            wrap.style.height = '100%'
                            wrap.style.alignItems = 'center'
                            wrap.style.justifyContent = 'center'
                            wrap.style.border = '1px solid #9254de'
                            wrap.style.background = '#f8edff'
                            wrap.style.borderRadius = '4px'
                            wrap.style.overflow = 'hidden'


                            const label = document.createElement('label')
                            label.innerText = i.docType
                            label.style.display = 'block'
                            label.style.width = '100%'
                            label.style.padding = '0 2px'
                            label.style.flexShrink = '0'
                            label.style.background = '#efdbff'
                            label.style.borderBottom = '1px solid #9254de'
                            const span = document.createElement('span')
                            span.innerText = i.docName
                            span.style.display = 'block'
                            span.style.textOverflow = 'ellipsis'
                            span.style.overflow = 'hidden'
                            span.style.whiteSpace = 'nowrap'
                            span.style.padding = '0 2px'
                            span.style.height = '20px'

                            wrap.appendChild(label);
                            wrap.appendChild(span);

                            return wrap
                        },
                    }
                });

                let edges = res.data.filter(i=>i.preDocType!=='@')
                    .map(i=>{
                        return {
                            source: i.preDocType, // String，必须，目标节点 id
                            target: i.docType, // String，必须，起始节点 id
                            router: {
                                name: 'manhattan',
                                args: {
                                    maxDirectionChange:180
                                },
                            },
                        }
                    });

                const newModel = gridLayout.layout({
                    nodes:this.nodes,
                    edges
                })
                this.graph.fromJSON(newModel);
            });



    },
    destroyed() {
    }
}
</script>

<style scoped>

</style>