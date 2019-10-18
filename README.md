![Alt text](imgs/dopamine_serotonin_similarity.png?raw=true "Dopamine Serotonin Similarity")
# Network Similarity
An algorithm that given two graphs it constructst the maximum common subgraph (MCS) and computes the similarity (correlation) between the two graphs.

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

## Examples
Check out these two working examples:
* [Molecules Similarity](https://codepen.io/giuliozani/full/zYYoYLo)
* [Shank Language Model](https://codepen.io/giuliozani/full/ZEEpdxQ)
