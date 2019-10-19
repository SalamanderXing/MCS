import {EdgeArrows, Graph, GraphEdge, GraphNode, Points, constructMCS } from "./mcs_node_module.js";
/*
Notice in the following comments I use the word "element" to indicate something that is either an edge or a node of a graph.

EdgeArrows
    Works as an enumerator for the three types of arrows currently supported by this graph.
    The arrow types are: "to" = -> , "both" = <-> and node = "--".
Graph
    Is a structure which contains an array of GraphNodes and an array of GraphEdges
GraphNode
    Is a class constituting the nodes of the graph. See below where it's extended.
GraphNode
    Is a class constituting the edges of the graph. See below where it's extended.
Points
    Is a class representing the result of a comparison between elements. See the following "compare" function for more details
constructMCS
    Is the function containing the main algorithm.

All the functions which contain the 'Vis' name are functions that create an object compatible with the visjs library,
the library I used to represent the graphs on the web page. See: https://visjs.github.io/vis-network/examples/

 */

//overwrite the default compare and getVisEdge functions
export class ShankEdge extends GraphEdge {
    constructor(type, from, to, graph, arrows = EdgeArrows.to) {
        super(from, to, graph, arrows);
        this.type = type;
        /*
            Add the property type, which is just a string that will contain the type of
         relationship correspondent to the shank model.
         */
    }
    compare(target) {
        const targetShankEdge = target;
        /*
        The class Points is the result of a compare function.
        To check whether two elements are similar enough to be added to the mcs, the algorithm will call this function
        and check the "score" of the resulting points. The score of an object of class Points is the similarity between
        two elements, a value between 0 and 1.
        Notice new Points(value, maxValue). Value is the resulting points from the comparison, and maxValue is the maximum
        points that comparison could possibly yield. Elements with a high maxValue will weight more in the final computation
        of the similarity between two graphs.
        In this example all maxValues are set to 1, this means that all elements have equal weight in these graphs.
         */
        return new Points(Number(this.type === targetShankEdge.type), 1); //give 1 out of 1 points if 'type' is the same
    }
    getVisEdge() {
        /*
        By overriding this function you can change the way the element will be represented.
         */
        const baseVisEdge = super.getVisEdge();
        return {
            to: baseVisEdge.to,
            from: baseVisEdge.from,
            label: `${this.type}`,
            arrows: baseVisEdge.arrows,
            id: baseVisEdge.id
        };
    }
}
//overwrite the default compare and getVisNode function
class ShankNode extends GraphNode {
    constructor(type, id, graph) {
        super(id, graph);
        this.type = type;
        /*
        Add the property type, which is just a string that will contain the type of node.
         */
    }
    compare(target) {
        /*
        See the above description of the compare function for the ShankEdge. This one works the same way the
        only difference is that the target will be an object of type GraphNode instead of GraphEdge
         */
        const targetShankNode = target;
        return new Points(Number(this.type === targetShankNode.type), 1); //give 1 out of 1 points if 'type' is the same
    }
    getVisNode() {
        const baseVisNode = super.getVisNode();
        return {
            id: baseVisNode.id,
            label: `${baseVisNode.label}\n${this.type}`,
            font: baseVisNode.font,
            shape: 'box'
        };
    }
}
// create graphs compatible with the syntax described by Shank in his paper, one for each action
// actions ar open, close, give, take, make agreement gesture, make disagreement gesture, scratch, stroke.
// notice that for each of these actions there are many possible shank conceptualizations (graph) but here
// only one for each action is represented.
const open = new Graph(1, g => {
    //create an array of nodes.
    const nodes = [
        new ShankNode('<===>', 0, g), //<-- nodes always need an id and "g" which is the reference to the graph they belong to
        new ShankNode('person', 1, g),
        new ShankNode('DO', 2, g),
        new ShankNode('STATE CHANGE: OBJECT', 3, g),
        new ShankNode('closed', 4, g),
        new ShankNode('open', 5, g)
    ];
    //create an array of edges with the references to the nodes.
    const edges = [
        new ShankEdge('act', nodes[0], nodes[2], g, EdgeArrows.none),
        new ShankEdge('subject', nodes[0], nodes[1], g, EdgeArrows.none),
        new ShankEdge('causes', nodes[0], nodes[3], g, EdgeArrows.to),
        new ShankEdge('from', nodes[4], nodes[3], g),
        new ShankEdge('to', nodes[3], nodes[5], g)
    ];
    return {
        nodes: nodes,
        edges: edges
    };
}, 'open');
const close = new Graph(2, g => {
    const nodes = [
        new ShankNode('<===>', 0, g),
        new ShankNode('person', 1, g),
        new ShankNode('DO', 2, g),
        new ShankNode('STATE CHANGE: OBJECT', 3, g),
        new ShankNode('close', 4, g),
        new ShankNode('open', 5, g)
    ];
    const edges = [
        new ShankEdge('act', nodes[0], nodes[2], g, EdgeArrows.none),
        new ShankEdge('subject', nodes[0], nodes[1], g, EdgeArrows.none),
        new ShankEdge('causes', nodes[0], nodes[3], g, EdgeArrows.to),
        new ShankEdge('from', nodes[5], nodes[3], g),
        new ShankEdge('to', nodes[3], nodes[4], g)
    ];
    return {
        nodes: nodes,
        edges: edges
    };
}, 'close');
const give = new Graph(3, (g) => {
    const nodes = [
        new ShankNode('<===>', 0, g),
        new ShankNode('person', 1, g),
        new ShankNode('ATRANS', 2, g),
        new ShankNode('RECIPIENT', 3, g),
        new ShankNode('SUBJECT', 4, g),
        new ShankNode('ONE', 5, g),
        new ShankNode('OBJECT', 6, g),
    ];
    const edges = [
        new ShankEdge('act', nodes[0], nodes[2], g, EdgeArrows.none),
        new ShankEdge('subject', nodes[0], nodes[1], g, EdgeArrows.none),
        new ShankEdge('r', nodes[0], nodes[3], g, EdgeArrows.to),
        new ShankEdge('from', nodes[5], nodes[3], g),
        new ShankEdge('to', nodes[3], nodes[4], g),
        new ShankEdge('object', nodes[0], nodes[6], g, EdgeArrows.to)
    ];
    return {
        nodes: nodes,
        edges: edges
    };
}, 'give');
const take = new Graph(4, (g) => {
    const nodes = [
        new ShankNode('<===>', 0, g),
        new ShankNode('person', 1, g),
        new ShankNode('ATRANS', 2, g),
        new ShankNode('RECIPIENT', 3, g),
        new ShankNode('ONE', 4, g),
        new ShankNode('SUBJECT', 5, g),
        new ShankNode('OBJECT', 6, g),
    ];
    const edges = [
        new ShankEdge('act', nodes[0], nodes[2], g, EdgeArrows.none),
        new ShankEdge('subject', nodes[0], nodes[1], g, EdgeArrows.none),
        new ShankEdge('r', nodes[0], nodes[3], g, EdgeArrows.to),
        new ShankEdge('from', nodes[5], nodes[3], g),
        new ShankEdge('to', nodes[3], nodes[4], g),
        new ShankEdge('object', nodes[0], nodes[6], g, EdgeArrows.to)
    ];
    return {
        nodes: nodes,
        edges: edges
    };
}, 'take');
const makeAgreementGesture = new Graph(5, (g) => {
    const nodes = [
        new ShankNode('<===>', 0, g),
        new ShankNode('person', 1, g),
        new ShankNode('ATRANS', 2, g),
        new ShankNode('RECIPIENT', 3, g),
        new ShankNode('ONE', 4, g),
        new ShankNode('person', 5, g),
        new ShankNode('OBJECT', 6, g),
        new ShankNode('<===>', 7, g),
        new ShankNode('MOVE', 8, g),
        new ShankNode('BODY_PART', 9, g)
    ];
    const edges = [
        new ShankEdge('act', nodes[0], nodes[2], g, EdgeArrows.none),
        new ShankEdge('subject', nodes[0], nodes[1], g, EdgeArrows.none),
        new ShankEdge('r', nodes[0], nodes[3], g, EdgeArrows.to),
        new ShankEdge('from', nodes[5], nodes[3], g),
        new ShankEdge('to', nodes[3], nodes[4], g),
        new ShankEdge('object', nodes[0], nodes[6], g, EdgeArrows.to),
        new ShankEdge('instrumental', nodes[0], nodes[7], g),
        new ShankEdge('act', nodes[7], nodes[8], g, EdgeArrows.none),
        new ShankEdge('object', nodes[7], nodes[9], g)
    ];
    return {
        nodes: nodes,
        edges: edges
    };
}, 'make agreement gesture');
const makeDisagreementGesture = new Graph(6, (g) => {
    const nodes = [
        new ShankNode('<===>', 0, g),
        new ShankNode('person', 1, g),
        new ShankNode('ATRANS', 2, g),
        new ShankNode('RECIPIENT', 3, g),
        new ShankNode('ONE', 4, g),
        new ShankNode('person', 5, g),
        new ShankNode('OBJECT', 6, g),
        new ShankNode('<===>', 7, g),
        new ShankNode('MOVE', 8, g),
        new ShankNode('BODY_PART', 9, g)
    ];
    const edges = [
        new ShankEdge('act', nodes[0], nodes[2], g, EdgeArrows.none),
        new ShankEdge('subject', nodes[0], nodes[1], g, EdgeArrows.none),
        new ShankEdge('r', nodes[0], nodes[3], g, EdgeArrows.to),
        new ShankEdge('from', nodes[5], nodes[3], g),
        new ShankEdge('to', nodes[3], nodes[4], g),
        new ShankEdge('object', nodes[0], nodes[6], g, EdgeArrows.to),
        new ShankEdge('instrumental', nodes[0], nodes[7], g),
        new ShankEdge('act', nodes[7], nodes[8], g, EdgeArrows.none),
        new ShankEdge('object', nodes[7], nodes[9], g)
    ];
    return {
        nodes: nodes,
        edges: edges
    };
}, 'make disagreement gesture');
const scratch = new Graph(7, (g) => {
    const nodes = [
        new ShankNode('<===>', 0, g),
        new ShankNode('person', 1, g),
        new ShankNode('ATRANS', 2, g),
        new ShankNode('spread out fingers', 3, g),
        new ShankNode('position: near wrist', 4, g),
        new ShankNode('position: near elbow', 5, g),
        new ShankNode('directionality', 6, g)
    ];
    const edges = [
        new ShankEdge('act', nodes[0], nodes[2], g, EdgeArrows.none),
        new ShankEdge('subject', nodes[0], nodes[1], g, EdgeArrows.none),
        new ShankEdge('instrumental', nodes[0], nodes[3], g, EdgeArrows.to),
        new ShankEdge('d', nodes[0], nodes[6], g),
        new ShankEdge('from', nodes[4], nodes[6], g),
        new ShankEdge('to', nodes[6], nodes[5], g)
    ];
    return {
        nodes: nodes,
        edges: edges
    };
}, 'scratch arm');
const stroke = new Graph(8, (g) => {
    const nodes = [
        new ShankNode('<===>', 0, g),
        new ShankNode('person', 1, g),
        new ShankNode('ATRANS', 2, g),
        new ShankNode('curled fingers', 3, g),
        new ShankNode('position: near wrist', 4, g),
        new ShankNode('position: near elbow', 5, g),
        new ShankNode('directionality', 6, g)
    ];
    const edges = [
        new ShankEdge('act', nodes[0], nodes[2], g, EdgeArrows.none),
        new ShankEdge('subject', nodes[0], nodes[1], g, EdgeArrows.none),
        new ShankEdge('instrumental', nodes[0], nodes[3], g, EdgeArrows.to),
        new ShankEdge('d', nodes[0], nodes[6], g),
        new ShankEdge('from', nodes[4], nodes[6], g),
        new ShankEdge('to', nodes[6], nodes[5], g)
    ];
    return {
        nodes: nodes,
        edges: edges
    };
}, 'stroke arm');
/*
Calling the following function runs the main algorithm.

Notice that the function "constructMCS" has an optional argument called leastElementSimilarity (by default=1).
When comparing two elements (nodes or edges) let's say element1 and element2 the algorithm will call element1.compare(element2).
If the compare function returns points with score < leastElementSimilarity that element will not be added to the mcs.
 */
const mcs = constructMCS(give, makeAgreementGesture); //construct the similarity graph. This function makes use of the main algorithm.
console.log(`Similarity: ${mcs.similarity()}`);
export const output = mcs.getDisplayData();

