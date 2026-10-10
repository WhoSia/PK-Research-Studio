// G2.24 synthetic structural comparison. Not observations of people.
export const FRONTIER_STATUSES=Object.freeze(['SYNTHETIC_REFERENCE','G2.24_HUMAN_NO_RUN','SOURCE_FIDELITY_HOLD']);
export function comparePerspectives({environment=0,mode='observe'}={}){
  if(![0,1].includes(environment)||!['observe','intervene'].includes(mode)) throw new RangeError('declared bounded reference only');
  const expression=mode==='observe'?environment:1-environment;
  return Object.freeze({
    environment,mode,expression,
    commonCause:environment,
    directedInfluence:expression,
    observationallyEquivalent:mode==='observe',
    source:'SYNTHETIC_NOT_HUMAN',
  });
}
export function identifiedCauses(records=[]){
  if(!Array.isArray(records))throw new TypeError('records array required');
  return ['commonCause','directedInfluence'].filter(model=>records.every(({environment,mode,observed})=>{
    if(![0,1].includes(observed))throw new RangeError('observed 0/1 only');
    return comparePerspectives({environment,mode})[model]===observed;
  }));
}
