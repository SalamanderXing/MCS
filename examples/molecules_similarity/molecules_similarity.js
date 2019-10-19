"use strict";
import {Points, Graph, GraphEdge, GraphNode, constructMCS} from "./mcs_browser_module.js"
//Required nodejs packages:
//node-cmd, express
//import mcs = require('maximum-common-subgraph');
//const fs = require('fs');
//const cmd = require('node-cmd');
//All the functions which contain the 'Vis' name are functions that create an object compatible with the visjs library, the library I used to represent the graphs on the webpage (see ./display folder)
//overwrite the Graph class just to add to it the 'name' property, useful just to represent the data.
//overwrite the default compare and getVisNodeFunction
class Atom extends GraphNode {
    constructor(type, id, graph) {
        super(id, graph);
        this.type = type;
    }
    compare(target) {
        const targetAtom = target;
        return new Points(Number(this.type === targetAtom.type), 1); //give 1 out of 1 points if 'type' is the same
    }
    getVisNode() {
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
// create graphs compatible with the syntax described by Shank in his paper, one for each action
// actions ar open, close, give, take, make agreement gesture, make disagreement gesture, scratch, stroke.
// notice that for each of these actions there are many possible shank conceptualizations (graph) but here
// only one for each action is represented.
const serotonin = new Graph(1, g => {
    const nodes = [...Array(23).keys()].map(i => {
        return [0, 1, 2, 3, 4, 5, 13, 15, 16, 19].indexOf(i) !== -1 ? 'C' :
            [6, 8, 9, 10, 12, 14, 17, 18, 21, 22].indexOf(i) !== -1 ? 'H' :
                [11, 20].indexOf(i) != -1 ? 'N' :
                    'O';
    }).map((value, index) => new Atom(value, index, g));
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
const mcs = constructMCS(dopamine, serotonin, 1);
console.log(`Similarity: ${mcs.pointsSum}`);

export const output = mcs.getDisplayData();
/*
//WRITE OUTPUT JSON FILE
const displayData = mcs.getDisplayData();
const displayFolder = "../../display";
const fileName = `${displayFolder}/output.json`;
fs.writeFile(fileName, JSON.stringify(displayData), (err) => {
    if (err)
        console.log(err);
    console.log(`The file: "${fileName}" was saved!`);
});
//CREATE SERVER TO SERVE FILES IN displayFolder STATICALLY
const express = require('express');
const server = express();
server.use(express.static(displayFolder));
server.listen(8080);
cmd.run('open http://localhost:8080/index.html'); // OPEN index.html in default browser

 */
