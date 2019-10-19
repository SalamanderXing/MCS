![Alt text](imgs/dopamine_serotonin_similarity.png?raw=true "Dopamine Serotonin Similarity")
# Maximum Common Subgraph
An algorithm that given two graphs allows you to:
* compute their similarity (or correlation); 
* construct the maximum common subgraph (MCS) also called the maximum common substructure.

It is a simple solution to the [maximum common sugraph problem](https://scholar.google.com/scholar?q=maximum+common+subgraph+problem) for small graphs.

## Installation
### If you're using node 
Simply install it via npm:
```
npm install maximum-common-subgraph
```
Done! You can now do:
```
{Graph, GraphEdge, GraphNode, Points, constructMCS} = require('maximum-common-subgraph')
```

### If you want to use it in the browser
Download the mcs_browser_module.js file into your working directory and then do:
```
<script type="module">
  import {Graph, GraphEdge, GraphNode, Points, constructMCS} from './mcs_browser_module.js';
  
  ....js code goes here....
</script>
```

### If you're using TypeScript
Download the index.ts file into your working directory and then do:
```
import {Graph, GraphEdge, GraphNode, Points, constructMCS} from "./index";
```
And you're good to go. 

## Usage
See the two examples in the `./examples` folder. They are meant to be an introduction on 
how to use this algorithm.

### Online examples
Check out these two working examples on codepen:
* [Molecules Similarity](https://codepen.io/giuliozani/full/zYYoYLo)
* [Shank Language Model](https://codepen.io/giuliozani/full/ZEEpdxQ)
##### NB: these online examples allow you to see the output very well but are not the best option if you want to understand how to use the algorithm yourself. For that I recommend taking a look at the `./examples` folder. That's because on codepen I had to squeeze all the modules into one file, thereby making it less clear. 

## Some details about the coding style and performance
The algorithm is written in pure functional programming style. As such it makes heavy use of recursion. However it is 
designed such that javascript interpreter can perform tail-call optimization 
(all recursive calls are at the last statement of the function) in order to prevent a `maximum calls stack exceeded` error.
That said I still have to test the algorithm for graphs with >23 nodes.


## Some more details about the maximum common subgraph problem
Given two graphs, mcs is the largest graph which is structurally identical to both graphs.
Constructing the mcs is fundamental in order to compute the similarity between two graphs. 
Indeed this correlation is a value between 0 and 1 which results from the comparison between the size of the mcs and 
the averaged size of the two original graphs. 
I'll write a more detailed mathematical explanation soon.

## Future projects
* Create a python version of this algorithm.

## Built with
* ES6
* [TypeScript](https://www.typescriptlang.org/)
* [Node.js](https://nodejs.org/en/)
* [Visjs](https://visjs.github.io/vis-network/examples/) (for visualizing and debugging)
