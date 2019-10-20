'use strict';
import {output} from './shank_graphs_similarity.js'

const fif = (condition, getIfTrue, getIfFalse) => condition ? getIfTrue() : getIfFalse(); // fif stands for functional if. It is a very simple and yet handy syntax to create a multiline-conditional operator (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)

const displayGraph = ({containerId: containerId, data: data} = {}) => {
    const container = document.getElementById(containerId);
    const visNodes = new vis.DataSet(data.nodes);
    const visEdges = new vis.DataSet(data.edges);
    const visData = {
        nodes: visNodes,
        edges: visEdges
    };
    const options = {
        physics: false,
        layout: {
            randomSeed: 1,
            improvedLayout: true,
            hierarchical: {
                enabled: false,
            }
        },
        edges: {
            smooth: {
                enabled: false
            },
            scaling: {
                min: 4,
                max: 15
            }
        }
    };
    return new vis.Network(container, visData, options);
};
const selectSubgraph = (graph, mcs) => {
    return {
        nodes: graph.nodes.map(n => {
            const rn = mcs.nodes.filter(rn => rn.node1 === n.id || rn.node2 === n.id)[0];
            return fif(rn !== undefined, () => {
                n.borderWidth = 3;
                n.color = n.color === undefined ? {

                    border: '#ff8000'
                } : {
                    background: n.color.background,
                    border: '#ff8000'
                };
                n.label = n.label.split('\n').map((l, i) => "  " + l).reduce((x, y) => x + (x !== '' ? '\n' : '') + y, '') + `\n  ${n.id === rn.node1 ? rn.node2 : rn.node1}`; //n.label.split('\n').map((l,i)=>`${l}${i===0 ?`~${n.id === rn.node1 ? rn.node2 : rn.node1}`:""}`).reduce((x,y)=>x+(x!==''?'\n':'')+y,'');
                return n;
            }, () => n)
        }),
        edges: graph.edges.map(e => {
            e.color = {
                inherit: false
            };
            e.label = "";
            const re = mcs.edges.filter(re => re.edge1 === e.id || re.edge2 === e.id)[0];
            return fif(re !== undefined, () => {
                //e.label = e.id === re.edge1 ? `${e.id} ${re.edge2}` : `${e.id} ${re.edge1}`;
                e.color.color = '#ff8000';
                e.width = 3;
                return e;
            }, () => e)
        })
    };
};
const graph1 = selectSubgraph(output.graph1, output.mcs);
const graph2 = selectSubgraph(output.graph2, output.mcs);
const network1 = displayGraph({
    containerId: 'graph1',
    data: graph1
});
const network2 = displayGraph({
    containerId: 'graph2',
    data: graph2
});
document.getElementById('similarity').innerHTML = output.similarity;
document.getElementById('graph1_name').innerHTML = output.graph1.name.toUpperCase();
document.getElementById('graph2_name').innerHTML = output.graph2.name.toUpperCase();
setTimeout(() => {
    for (let canvas of Array.prototype.slice.call(document.getElementsByTagName('canvas'))) {
        canvas.style.height = '75vh'
    }
}, 1)

