"use strict";
import {Points, Graph, GraphEdge, GraphNode, constructMCS} from "./mcs_browser_module.js"
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
//overwrite the default compare and getVisNode function
class Atom extends GraphNode {
    constructor(type, id, graph) {
        super(id, graph);
        this.type = type;
        /*
           Add the property type, which represent the type of atom ex. "C", carbon.
        */
    }
    compare(target) {
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
        const targetAtom = target;
        return new Points(Number(this.type === targetAtom.type), 1); //give 1 out of 1 points if 'type' is the same
    }
    getVisNode() {
        /*
        By overriding this function you can change the way the element will be represented.
        See: https://visjs.github.io/vis-network/examples/
         */
        const baseVisNode = super.getVisNode();
        return {
            id: baseVisNode.id,
            label: `${baseVisNode.label}\n${this.type}`,
            font: {
                color: this.type === 'C' || this.type === 'N' ? 'white' : 'black'
            },
            shape: 'circle',
            color: {
                background: this.type === 'C' ? 'black' : this.type === 'N' ? 'blue' : this.type === 'H' ? 'white' : 'red'
            }
        };
    }
}
/*
 Define the two molecules. Notice that this algorithm could be used also to represent molecules
 with different types of chemical bonds. In order to do that you'd need to extend the GraphEdge class.
 This example doesn't include that for simplicity.
 see the shank_language_model example for that.

  Notice every graph needs:
  • id (below = 1),
  • a function which returns the nodes and edges and
  • a "name" (below = 'open')
 */
const serotonin = new Graph(1, g => {
    // define an array of nodes with type C, O, H or N.
    const nodes = [...Array(23).keys()].map(i => {
        return [0, 1, 2, 3, 4, 5, 13, 15, 16, 19].indexOf(i) !== -1 ? 'C' :
            [6, 8, 9, 10, 12, 14, 17, 18, 21, 22].indexOf(i) !== -1 ? 'H' :
                [11, 20].indexOf(i) !== -1 ? 'N' :
                    'O';
    }).map((value, index) => new Atom(value, index, g));
    // define the chemical bond between them
    const edges = [
        [0, 7],
        [7, 8],
        [0, 1],
        [1, 9],
        [1, 2],
        [2, 10],
        [2, 3],
        [3, 11],
        [11, 12],
        [11, 13],
        [13, 14],
        [13, 15],
        [15, 4],
        [4, 3],
        [4, 5],
        [5, 6],
        [5, 0],
        [15, 16],
        [16, 17],
        [16, 18],
        [16, 19],
        [19, 20],
        [20, 21],
        [20, 22]
    ].map((val => new GraphEdge(nodes[val[0]], nodes[val[1]], g)));
    console.log(nodes.length + edges.length);
    return {
        nodes: nodes,
        edges: edges
    };
}, 'serotonin');
const dopamine = new Graph(2, g => {
    const nodes = new Array(8).fill('C').concat(['O', 'O', 'N']).concat(new Array(11).fill('H'))
        .map((value, index) => new Atom(value, index, g));
    const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 0],
        [0, 8],
        [8, 21],
        [1, 9],
        [9, 20],
        [2, 19],
        [3, 18],
        [5, 17],
        [4, 6],
        [6, 15],
        [6, 16],
        [6, 7],
        [7, 13],
        [7, 14],
        [7, 10],
        [10, 11],
        [10, 12]
    ].map((val => {
        return new GraphEdge(nodes[val[0]], nodes[val[1]], g);
    }));
    return {
        nodes: nodes,
        edges: edges
    };
}, 'dopamine');
/*
Calling the following function runs the main algorithm.

Notice that the function "constructMCS" has an optional argument called leastElementSimilarity (by default=1).
When comparing two elements (nodes or edges) let's say element1 and element2 the algorithm will call element1.compare(element2).
If the compare function returns points with score < leastElementSimilarity that element will not be added to the mcs.
 */
const mcs = constructMCS(dopamine, serotonin);
console.log(`Similarity: ${mcs.pointsSum}`);

export const output = mcs.getDisplayData();
