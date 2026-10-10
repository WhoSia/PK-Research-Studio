'use strict';
// Bounded toy alternatives: neither full Darwiche–Pearl postulates nor a source-author model.
function lexicographicRevision(ranking,accepted) {
  if (!Array.isArray(ranking)||ranking.length!==4||new Set(ranking).size!==4 || ranking.some(x=>!Number.isInteger(x)||x<0||x>3)) throw new RangeError('strict ranking must permute worlds 0..3');
  if(!['q','notQ'].includes(accepted))throw new RangeError('supported evidence');
  const predicate=accepted==='q'?w=>Boolean(w&2):w=>!(w&2);
  const next=ranking.filter(predicate).concat(ranking.filter(w=>!predicate(w)));
  return {ranking:next,beliefWorld:next[0],accepted};
}
function sameCurrentDifferentRevision(){
 // Both states currently believe p&q (world 3). Next least implausible not-q differs.
 const stateA=[3,1,2,0],stateB=[3,0,2,1];
 return {priorBeliefA:stateA[0],priorBeliefB:stateB[0],
 afterA:lexicographicRevision(stateA,'notQ'),
 afterB:lexicographicRevision(stateB,'notQ')};
}
function fixedEnrichedStep(state){
 if(!state||typeof state.x!=='boolean'||!['flip','hold'].includes(state.mode))throw RangeError('invalid augmented state');
 return {x:state.mode==='flip'?!state.x:state.x,mode:state.mode==='flip'?'hold':'flip'};
}
function projectedAmbiguity(){
 const a={x:false,mode:'flip'},b={x:false,mode:'hold'};
 return {observedCurrentA:a.x,observedCurrentB:b.x,observedNextA:fixedEnrichedStep(a).x,
 observedNextB:fixedEnrichedStep(b).x,law:'same fixed function on (x,mode)'};
}
module.exports={lexicographicRevision,sameCurrentDifferentRevision,fixedEnrichedStep,projectedAmbiguity};
