'use strict';
const {test}=require('node:test'),a=require('node:assert/strict');
const m=require('../research/g222-p2/state-rivals.cjs');
test('same beliefs but different hidden rankings yield different revision outcomes',()=>{
 const r=m.sameCurrentDifferentRevision();
 a.equal(r.priorBeliefA,3);a.equal(r.priorBeliefB,3);
 a.notEqual(r.afterA.beliefWorld,r.afterB.beliefWorld);
 a.deepEqual([r.afterA.beliefWorld,r.afterB.beliefWorld],[1,0]);
 a.ok(!Boolean(r.afterA.beliefWorld&2)&&!Boolean(r.afterB.beliefWorld&2));
});
test('lexicographic update preserves within-class ordering and prioritizes evidence',()=>{
 const r=m.lexicographicRevision([3,1,2,0],'notQ');
 a.deepEqual(r.ranking,[1,0,3,2]);
 const again=m.lexicographicRevision(r.ranking,'q');
 a.deepEqual(again.ranking,[3,2,1,0]);
});
test('same projected present admits different futures from a fixed enriched-state law',()=>{
 const r=m.projectedAmbiguity();
 a.equal(r.observedCurrentA,r.observedCurrentB);
 a.notEqual(r.observedNextA,r.observedNextB);
 const cases=[{x:false,mode:'hold'},{x:false,mode:'flip'},{x:true,mode:'hold'},{x:true,mode:'flip'}];
 for(const c of cases)a.deepEqual(m.fixedEnrichedStep(c),m.fixedEnrichedStep({...c}));
});
test('invalid rankings and hidden states fail explicitly',()=>{
 a.throws(()=>m.lexicographicRevision([3,3,1,0],'q'),RangeError);
 a.throws(()=>m.fixedEnrichedStep({x:false,mode:'unknown'}),RangeError);
});
