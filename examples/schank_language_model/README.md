# Schank language model

##### Note: The file `schank_graph_similarity.js` is the most useful to understand how to use the mcs library. Whereas the files `index.html` and `main.js` are just to visualize the resulting networks.

## How this algorithm came about

In september 2019 I have done a 3-weeks internship at the CIMeC (University of Trento, Italy) at [Moritz F. Wurm, Ph.D.](https://webapps.unitn.it/du/en/Persona/PER0119546/Curriculum)'s lab.
 
During this time, we attempted to test Schank's language model by comparing two set of data:
* data obtained through representational similarity analysis (RSA) of fMRI results relative 8 actions (shown via video or the display of written sentences). 
These was among the results obtained earlier by Moritz F. Wurm and explained in his paper [Distinct roles of temporal and frontoparietal cortex in representing actions across vision and language](https://www.nature.com/articles/s41467-018-08084-y)
* data obtained by computing the similarity between graph-conceptualizations of those 8 actions, using a prototype of this MCS algorithm. 
These conceptualizations (see this [online example](https://codepen.io/giuliozani/full/ZEEpdxQ)) were created after trying to understand Roger C. Schank's 1973 paper "THE FOURTEEN PRIMITIVE ACTIONS AND THEIR INFERENCES" .  

Each of these two sets of data was converted to an RDM (representational dissimilarity matrix). 
So we obtained two 8x8 dissimilarity matrices and then correlated them. This end-correlation was not a significant one. 
That said more experiments should be performed in order to obtain conclusive results, 
for example with a larger >>8 set of actions and conceptualizing the actions differently. 
This was just an informal experiment.
