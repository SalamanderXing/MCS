const fif = <T>(condition:boolean, getIfTrue:()=>T, getIfFalse:()=>T)=>condition ? getIfTrue() : getIfFalse(); // fif stands for functional if. It is a very simple and yet handy syntax to create a multiline-conditional operator (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
export enum EdgeArrows {
    to='to',
    none='',
    both='to,from'
}
export class Points{
    /*
    This class represents the result given by every comparison (between nodes, edges or graphs).
    maxValue represents the maximum value this comparison could result in.
    value instead simply the value reached.
    score = value/maxValue
     */
    readonly value:number;
    readonly maxValue:number;
    get score (){ return this.maxValue === 0 ? 0 : this.value/this.maxValue }
    plus = (otherPoints:Points):Points => new Points(this.value + otherPoints.value, this.maxValue + otherPoints.maxValue);
    toString = () => `Points:${this.value}/${this.maxValue}=${this.score}`;
    constructor(value:number, maxValue:number){
        if(value < 0) throw 'Value must be >= 0';
        if(value > maxValue) throw 'cannot have more points than the maximum points';
        this.value = value;
        this.maxValue = maxValue
    }
}
export class GraphNode{
    readonly graph: Graph;
    readonly id: string;
    compare(target:GraphNode) : Points{
        // This has to be overwritten in order to create a custom node. See examples on github page.
        return new Points(1,1);
    }
    getVisNode():{[key:string]:any}{
        return {
            id:this.id,
            label:this.id,
            font:{
                align:'center'
            },
            shape:'circle'
        }
    }
    constructor(id:number, graph:Graph, label:string = ''){
        this.graph = graph;
        this.id = `${this.graph.id}.${id}`;
    }
}
export class GraphEdge{
    readonly graph: Graph;
    readonly from:GraphNode;
    readonly to:GraphNode;
    readonly arrows:EdgeArrows;
    readonly id:string;
    compare(target: GraphEdge): Points {
        return new Points(1,1);
    }
    getVisEdge() : {[key:string]:any}{
        return {
            label:this.id,
            arrows:this.arrows,
            to:this.to.id,
            from:this.from.id,
            id:this.id
        }
    }
    constructor(from:GraphNode, to:GraphNode, graph:Graph, arrows:EdgeArrows = EdgeArrows.none, label:string = ''){
        this.graph = graph;
        this.from = from;
        this.to = to;
        this.arrows = arrows;
        const arrowLabel:string = {
            to:'→',
            '' :'-',
            'to,from':'←→'
        }[this.arrows];
        this.id =   `${this.from.id}${arrowLabel}${this.to.id}`;
    }
}
export class Graph{
    readonly name:string;
    readonly nodes:ReadonlyArray<GraphNode>;
    readonly edges:ReadonlyArray<GraphEdge>;
    readonly id:number;
    getVisData():{[key:string]:any}{
        return {
            nodes:this.nodes.map(n=>n.getVisNode()),
            edges:this.edges.map(e=>e.getVisEdge()),
            name:this.name
        };
    }
    constructor(id:number, getNodesAndEdges : (graph:Graph)=>{nodes:ReadonlyArray<GraphNode>, edges:ReadonlyArray<GraphEdge>}, name:string=""){
        this.id = id;
        const nodesAndEdges = getNodesAndEdges(this); //todo: find a more elegant but still functional way to define nodes and edges.
        this.nodes = nodesAndEdges.nodes;
        this.edges = nodesAndEdges.edges;
        this.name = name;
    }
}
export class CommonNode{
    readonly node1:GraphNode;
    readonly node2:GraphNode;
    constructor(node1:GraphNode, node2:GraphNode){
        this.node1 = node1;
        this.node2 = node2;
    }
}
export class CommonEdge {
    readonly edge1: GraphEdge;
    readonly edge2: GraphEdge;
    constructor(edge1: GraphEdge, edge2: GraphEdge){
        this.edge1 = edge1;
        this.edge2 = edge2;
    }
}
export class CommonSubgraph{
    readonly commonNodes: ReadonlyArray<CommonNode>;
    readonly commonEdges: ReadonlyArray<CommonEdge>;
    private getData():{[p:string]:any}{
        return {
            nodes:this.commonNodes.map(rn=>{
                return {
                    node1:rn.node1.id,
                    node2:rn.node2.id
                }
            }),
            edges:this.commonEdges.map(re=>{
                return {
                    edge1:re.edge1.id,
                    edge2:re.edge2.id
                }
            })
        }
    }
    getDisplayData():{[p:string]:any}{
        return {
            graph1:this.commonNodes[0].node1.graph.getVisData(),
            graph2:this.commonNodes[0].node2.graph.getVisData(),
            mcs:this.getData(),
            similarity:this.similarity()
        };
    }
    private precisionRound = (number: number, precision: number) => {
        if (precision < 0) {
            const factor = Math.pow(10, precision);
            return Math.round(number * factor) / factor;
        }
        else return +(Math.round(Number(number + "e+" + precision)) + "e-" + precision);
    };
    get pointsSum() : Points{
        /*
        returns a sum of all the points contained in the common nodes a and edges
         */
        const pointsFromNodes = this.commonNodes
            .map((e)=>e.node1.compare(e.node2))
            .reduce((accPoints,points)=>accPoints.plus(points), new Points(0,0));
        const pointsFromEdges = this.commonEdges
            .map((e)=>e.edge1.compare(e.edge2))                       // one for the directionality, which must be correct since this edge belongs to the reconstruction
            .reduce((accPoints,points)=>accPoints.plus(points), new Points(0,0));
        return pointsFromEdges.plus(pointsFromNodes);
    }
    getPointsSum(commonGraph:Graph):Points{
        const pointsFromNodes = commonGraph.nodes
            .map((e)=>e.compare(e))
            .reduce((accPoints,points)=>accPoints.plus(points), new Points(0,0));
        const pointsFromEdges = commonGraph.edges
            .map((e)=>e.compare(e))
            .reduce((accPoints,points)=>accPoints.plus(points), new Points(0,0));
        return pointsFromEdges.plus(pointsFromNodes);

    }
    similarity(averagedMaxValue:boolean = true):number{
        const graph1 = this.commonNodes[0].node1.graph;
        const graph2 = this.commonNodes[0].node2.graph;
        return fif(averagedMaxValue, ()=>{
            const max1 = this.getPointsSum(graph1);
            const max2 = this.getPointsSum(graph2);
            const aveMax = (max1.maxValue + max2.maxValue)/2;
            return this.precisionRound(this.pointsSum.value/aveMax,4)
        }, ()=>{
            const shortestGraph = (graph1.nodes.length + graph1.edges.length) > (graph2.nodes.length + graph2.edges.length) ? graph1 : graph2;
            const maxPoints = this.getPointsSum(shortestGraph);
            return this.precisionRound(this.pointsSum.value/maxPoints.maxValue,4);
        });

    }
    constructor(commonNodes:ReadonlyArray<CommonNode>, commonEdges : ReadonlyArray<CommonEdge>) {
        this.commonNodes = commonNodes;
        this.commonEdges = commonEdges;
    }
}
export const constructMCS = (graph1:Graph, graph2:Graph, leastElementSimilarity:number = 1):CommonSubgraph => {
    /*
         leastElementSimilarity is a value (0 < leastElementSimilarity ≤ 1) which refers to the minimum score (or similarity) that the comparison between two elements (nodes or edges) has to return.
         The algorithm will not add the two elements to the commonSubgraph and will stop from spreading if it will find that the score is not >= leastElementSimilarity.
    */
    const reconstructBranches = (node1:GraphNode, node2:GraphNode, visited:ReadonlyArray<string>, commonGraph:CommonSubgraph, tolerance:number):CommonSubgraph => {
        // Restart a anew the algorithm for every edge. Then it collects all points it got from that 'branch', i.e., another common graph and selects the branches which give highest sum of maxValues (in a case where all compare functions return 1 as maxValue this process will simply select the largest branch)
        const allEdgesConnectingNode1 = node1.graph.edges.filter(edge => edge.from === node1 || edge.to === node1);
        const allEdgesConnectingNode2 = node2.graph.edges.filter(edge => edge.from === node2 || edge.to === node2);
        const getBestCandidates = (commonBranches: ReadonlyArray<CommonSubgraph>, accumulator: ReadonlyArray<CommonSubgraph> = []): ReadonlyArray<CommonSubgraph> =>{
            return commonBranches.length > 0 ?
                getBestCandidates(
                    commonBranches.filter(rb => {
                        const condition1 = rb.commonEdges[0].edge1 === commonBranches[0].commonEdges[0].edge1;
                        const condition2 = rb.commonEdges[0].edge2 === commonBranches[0].commonEdges[0].edge2;
                        return !(condition1 || condition2);
                    }),
                    accumulator.concat([commonBranches[0]]))
                : accumulator;
        };
        return mergeCommonSubgraphWithBranches(commonGraph, getBestCandidates(allEdgesConnectingNode1.map(edgeFromShortest =>
                allEdgesConnectingNode2.map(edgeFromLongest => updateCommonSubgraphWithNewEdges(edgeFromShortest, edgeFromLongest, visited, new CommonSubgraph([], []), tolerance))
            )
                .reduce((accumulator, newArr) => accumulator.concat(newArr), [])
                .filter(commonGraph=>commonGraph.commonEdges.length+commonGraph.commonNodes.length > 0)
                .sort((rg1, rg2) => rg2.pointsSum.maxValue - rg1.pointsSum.maxValue )
        ));
    };
    const updateCommonSubgraphWithNewNodes = (node1:GraphNode, node2: GraphNode, visited: ReadonlyArray<string>, commonGraph:CommonSubgraph, tolerance:number): CommonSubgraph=>{
        //if the two nodes are similar enough and they haven't been visited before, add them to the common subgraph
        const hasVisited = visited.filter(x => x === node1.id || x === node2.id).length > 0;
        return fif(hasVisited, //this prevents the algorithm from adding again the same nodes to the common subgraph (there is an equivalent check for edges in updateCommonSubgraphWithNewEdges
            ()=>{
                console.log(`Attempted to visit again:${node1.id} ${node2.id}`);
                return commonGraph;
            },
            ()=>{
                const currentPoints = node1.compare(node2);
                console.log(`Comparison(${node1.id} , ${node2.id})= ${currentPoints}`);
                // prevent the algorithm from spreading if it finds out he's on a very wrong track
                return currentPoints.score >= tolerance ?
                    reconstructBranches(node1, node2, visited.concat([node1.id, node2.id]), new CommonSubgraph(commonGraph.commonNodes.concat([new CommonNode(node1, node2)]), commonGraph.commonEdges), tolerance)
                    : commonGraph; // stop spreading
            });
    };
    const updateCommonSubgraphWithNewEdges = (edge1:GraphEdge, edge2: GraphEdge, visited: ReadonlyArray<string>, commonGraph:CommonSubgraph, tolerance:number): CommonSubgraph =>{
        //if the two edges are similar enough and they haven't been visited before, add them to the common subgraph
        return fif(visited.filter(id=>id === edge1.id || id === edge2.id).length > 0, ()=>{  //this prevents the algorithm from adding again the same edges to the common subgraph (there is an equivalent check for nodes in updatePathWithNewNodes
            console.log(`Attempted to visit again:${visited.filter(v=>v === edge1.id).length > 0 ?
                (visited.filter(v=>v === edge2.id).length > 0 ? `${edge1.id} ${edge2.id}` : edge1.id)
                : edge2.id}`);
            return commonGraph;
        },()=>{
            const currentPoints = getPointsFromEdges(edge1, edge2, visited, tolerance);
            console.log(`Comparison(${edge1.id} , ${edge2.id}) = ${currentPoints} ${directionsMatch(edge1,edge2,visited) ? '' : "(Directions don't match)"}`);
            return fif(currentPoints.score >= tolerance,()=>{
                    const nextNodeFromEdge1sGraph = getNextNodeFromGraph(edge1,visited);
                    const nextNodeFromEdge2sGraph = getNextNodeFromGraph(edge2, visited);
                    return updateCommonSubgraphWithNewNodes(nextNodeFromEdge1sGraph, nextNodeFromEdge2sGraph, visited.concat([edge1.id,edge2.id]), new CommonSubgraph(commonGraph.commonNodes, commonGraph.commonEdges.concat([new CommonEdge(edge1, edge2)])), tolerance);
                },()=>commonGraph
            )
        })
    };
    const hasVisitedToOrFrom = (edge: GraphEdge, visited: ReadonlyArray<string>): string | undefined =>{
        //Looks within the visited array to check whether the algorithm is coming from the 'to' or the 'from' node. Undefined is just for debugging.
        return visited.filter(id=>id === edge.from.id).length > 0 ? 'from'
            : visited.filter((id)=>id === edge.to.id).length > 0 ? 'to'
                : undefined;
    };
    const directionsMatch = (edge1:GraphEdge, edge2:GraphEdge, visited: ReadonlyArray<string>):boolean=>{
        //this function checks whether the arrows are compatible with each other with respect to the the direction in which the algorithm is going
        const condition1 = (edge1.arrows === EdgeArrows.both && (edge2.arrows === EdgeArrows.both || edge2.arrows === EdgeArrows.to)); //These two condition refer to the case in which the algorithm finds a '→' and a '←→'. In which case it will return true.
        const condition1Reversed = (edge2.arrows === EdgeArrows.both && (edge1.arrows === EdgeArrows.both || edge1.arrows === EdgeArrows.to));
        const condition2 = edge1.arrows === EdgeArrows.none && edge2.arrows === EdgeArrows.none; // two undirected edges always match
        return fif(condition1 || condition1Reversed || condition2,
            ()=>true,
            ()=>{
                return fif(edge1.arrows === EdgeArrows.to && edge2.arrows === EdgeArrows.none || edge2.arrows === EdgeArrows.to && edge1.arrows === EdgeArrows.none, //directed edge compared to an undirected one alway returns false
                    ()=>false,
                    ()=>{
                        /* Here we know that both edges are directed, so check whether the directions match from the perspective of the algorithm's flow.*/
                        const hasVisitedEdge1 = hasVisitedToOrFrom(edge1,visited);
                        const hasVisitedEdge2 = hasVisitedToOrFrom(edge2,visited);
                        if(!hasVisitedEdge1 || !hasVisitedEdge2) throw `    
                            Something's wrong. How do I get at this edge without passing by the 'from' or 'to' nodes?? 
                            edge1: ${edge1.id}, edge2: ${edge2.id}
                            visited: ${JSON.parse(JSON.stringify(visited))}
                        `;                  // This should never occur, but it was useful for debugging.
                        const isGoingDownstreamAccordingToEdge1 : boolean = hasVisitedEdge1 === edge1.arrows;
                        const isGoingDownstreamAccordingToEdge2 : boolean = hasVisitedEdge2 === edge2.arrows;
                        return isGoingDownstreamAccordingToEdge1 === isGoingDownstreamAccordingToEdge2;
                    })
            });
    };
    const getNextNodeFromGraph = (edge:GraphEdge, visited:ReadonlyArray<string>):GraphNode => {
        //given an edge and using the visited array it gets the next node to be visited taking into account the direction in which the algorithm is going
        const toOrFrom = hasVisitedToOrFrom(edge, visited);
        return toOrFrom === EdgeArrows.to ? edge.from : edge.to;
    };
    const getPointsFromEdges = (edge1:GraphEdge, edge2:GraphEdge, visited: ReadonlyArray<string>, tolerance:number)=>{
        // Points got from the "compare" function only matter if the directions match and the next nodes are similar enough.
        return directionsMatch(edge1,edge2,visited) && getNextNodeFromGraph(edge1,visited).compare(getNextNodeFromGraph(edge2,visited)).score >= tolerance ? edge1.compare(edge2) : new Points(0, 0);
    };
    const mergeCommonSubgraphWithBranches = (commonGraph:CommonSubgraph, commonBranches: ReadonlyArray<CommonSubgraph>): CommonSubgraph => {
        /*
        Merges the branches with the common subgraph. Before doing that is has to filter out the repeated element among the branches.
         */
        const containsNode = (commonNodes: ReadonlyArray<CommonNode>, node:GraphNode) => commonNodes.filter(rn=>rn.node1.id === node.id || rn.node2.id === node.id).length > 0;
        const containsEdge = (commonEdges: ReadonlyArray<CommonEdge>, edge:GraphEdge) => commonEdges.filter(ce=>ce.edge1.id === edge.id || ce.edge2.id === edge.id).length > 0;
        const containsCommonEdge = (commonEdges: ReadonlyArray<CommonEdge>, commonEdge:CommonEdge) => containsEdge(commonEdges,commonEdge.edge1) || containsEdge(commonEdges, commonEdge.edge2);
        const isWithinCommonGraph = (commonNodes:ReadonlyArray<CommonNode>, edge:GraphEdge) => {
            const containsTo = containsNode(commonNodes, edge.to);
            const containsFrom = containsNode(commonNodes, edge.from);
            return containsTo || containsFrom;
        };
        return commonBranches.reduce((acc, branch) => {
            const filteredCommonNodes = branch.commonNodes.filter(rnb => acc.commonNodes.filter(accRn => accRn.node1 === rnb.node1 || accRn.node1 === rnb.node2 || accRn.node2 === rnb.node1 || accRn.node2 === rnb.node2).length === 0);
            const mergedCommonNodes = acc.commonNodes.concat(filteredCommonNodes);
            const filteredCommonEdges = branch.commonEdges.filter(re => {
                const isNotAlreadyInCommonGraph = !containsCommonEdge(acc.commonEdges, re);
                const condition2 = isWithinCommonGraph(mergedCommonNodes, re.edge1);
                const condition3 = isWithinCommonGraph(mergedCommonNodes, re.edge2);
                return isNotAlreadyInCommonGraph && condition2 && condition3;
            } );
            return new CommonSubgraph(mergedCommonNodes, acc.commonEdges.concat(filteredCommonEdges))
        }, commonGraph);
    };
    if(graph2.id === graph1.id) throw 'Different graphs must have different ids';
    if(leastElementSimilarity <= 0 || leastElementSimilarity > 1) throw 'Must be 0 < leastElementSimilarity ≤ 1';
        //todo: prevent the algorithm to walk on the same path the other way around
    return graph1.nodes.map(node1 =>
            /*
                A 'walk' is the algorithm try to find a common subgraph, i.e., a set of couples of couples [(node1 , node2) .... ], [(edge1, edge2) .... ]
                where node1, edge1 and node2, edge2 come from different graphs. All these couples are such that the compare(node1, node2) and compare(edge1, edge2) >= leastElementSimilarity
            */
            graph2.nodes.map(node2 =>{
                console.log('\nGoing for a new walk.');
                //"visited" is an array containing the ids of the visited elements.
                //A new walk always start from two nodes.
                return updateCommonSubgraphWithNewNodes(node1, node2, [], new CommonSubgraph([], []), leastElementSimilarity)
            })
        )
            .reduce((accumulator, newArr) => accumulator.concat(newArr), new Array<CommonSubgraph>())
            .filter(rg => rg.commonEdges.length + rg.commonNodes.length > 0)
            .sort((rg1, rg2) => rg2.pointsSum.maxValue  - rg1.pointsSum.maxValue)[0];
};