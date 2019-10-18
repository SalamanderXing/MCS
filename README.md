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
  
  .... rest of the js code goes here....
</script>
```

### Method #3 with TypeScript
Download the index.ts file into your working directory and then do:
```
import {Graph, GraphEdge, GraphNode, Points, constructMCS} from "./index";
```
And you're good to go. 

## Some more details about the maximum common subgraph problem
The mcs is a graph with

## Online examples
Check out these two working examples on codepen:
* [Molecules Similarity](https://codepen.io/giuliozani/full/zYYoYLo)
* [Shank Language Model](https://codepen.io/giuliozani/full/ZEEpdxQ)
