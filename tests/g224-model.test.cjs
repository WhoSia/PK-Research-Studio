'use strict';
const {test}=require('node:test'),a=require('node:assert/strict');
const load=()=>import('../g224-model.mjs');
test('natural observations cannot identify cross-perspective influence',async()=>{
 const m=await load(),natural=[0,1].map(environment=>({environment,mode:'observe',observed:environment}));
 a.deepEqual(m.identifiedCauses(natural),['commonCause','directedInfluence']);
 for(const environment of [0,1]){
  const x=m.comparePerspectives({environment,mode:'observe'});
  a.equal(x.commonCause,x.directedInfluence);
  a.equal(x.observationallyEquivalent,true);
 }
});
test('specified mathematical intervention separates otherwise equivalent models',async()=>{
 const m=await load(),natural=[0,1].map(environment=>({environment,mode:'observe',observed:environment}));
 const c=m.comparePerspectives({environment:0,mode:'intervene'});
 a.deepEqual([c.expression,c.commonCause,c.directedInfluence],[1,0,1]);
 a.deepEqual(m.identifiedCauses([...natural,{environment:0,mode:'intervene',observed:1}]),['directedInfluence']);
 a.deepEqual(m.identifiedCauses([...natural,{environment:0,mode:'intervene',observed:0}]),['commonCause']);
});
test('synthetic role and source-fidelity constraints are explicit',async()=>{
 const m=await load();
 a.ok(m.FRONTIER_STATUSES.includes('G2.24_HUMAN_NO_RUN'));
 a.throws(()=>m.comparePerspectives({environment:2}),RangeError);
 a.throws(()=>m.comparePerspectives({mode:'human-trial'}),RangeError);
 a.throws(()=>m.identifiedCauses([{environment:0,mode:'observe',observed:9}]),RangeError);
});
