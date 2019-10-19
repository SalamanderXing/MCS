![Alt text](imgs/dopamine_serotonin_similarity.png?raw=true "Dopamine Serotonin Similarity")
# Maximum Common Subgraph
An algorithm that given two graphs allows you to do two things:
* compute the similarity (correlation) between the two graphs. 
* construct the maximum common subgraph (MCS) also called the maximum common substructure.

It is a solution to the maximum [common sugraph problem.](https://www.google.com/search?sxsrf=ACYBGNSN6w2aDBEq0Q7AFsOOWMdOjRMidQ%3A1571432071191&ei=hyaqXe-oC9CFmwX94IXABw&q=maximum+common+subgraph+problem&oq=maximum+common+subgraph+problem).

## Installation
### Method #1 via npm
If you're working with node.js, you can simply install it via npm:
```
npm install maximum-common-subgraph
```
Done! From within your javascript code you can now do:
```
{Graph, GraphEdge, GraphNode, Points, constructMCS} = require('maximum-common-subgraph')
```
See examples. 

### Method #2 import module 
Download the index.js file into your working directory and then do:
```
<script type="module">
  import {Graph, GraphEdge, GraphNode, Points, constructMCS} from './index.js';
  
  ....js code goes here....
</script>
```

### Method #3 with TypeScript
Download the index.ts file into your working directory and then do:
```
import {Graph, GraphEdge, GraphNode, Points, constructMCS} from "./index";
```
And you're good to go. 

## Some more details about the maximum common subgraph problem
Given two graphs, mcs is the largest graph which is structurally identical to both graphs. Constructing the mcs is fundamental in order to compute the similarity beteen two graphs. Indeed this correlation is a value between 0 and 1 which results from the comparison between the size of the mcs and the averaged size of the two original graphs. 

## Examples
In the examples foder you'll find two practical applications for this algorithm. 
### Online examples
Check out these two working examples on codepen:
* [Molecules Similarity](https://codepen.io/giuliozani/full/zYYoYLo)
* [Shank Language Model](https://codepen.io/giuliozani/full/ZEEpdxQ)
#### NB: these online examples allow you to see the output very well but are not the best option if you want to understand how to use the algorithm youself. For that I recommend taking a look at the ./examples folder.

## Built with
* [TypeScript](https://www.typescriptlang.org/)
* [Node.js](https://nodejs.org/en/)
* [Visjs](https://visjs.github.io/vis-network/examples/) (For visualizing and debugging)
