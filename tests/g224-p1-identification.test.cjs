'use strict';
const {test}=require('node:test'),a=require('node:assert/strict');
const m=require('../research/g224/p1/identification.cjs');
test('natural temporal records agree across three rival causal mechanisms',()=>{
 const court=m.preregisteredCourt();
 a.deepEqual(court.naturalSurvivors,['common','forward','reciprocal']);
 for(const model of court.naturalSurvivors)
   for(const observation of court.natural)
     a.deepEqual(m.twoAgent(model,observation.u),{a1:observation.a1,b1:observation.b1});
});
test('one directional counterfactual cannot certify reciprocity; two orthogonal ones can in this closed model class',()=>{
 const c=m.preregisteredCourt();
 a.deepEqual(c.afterForward,['forward','reciprocal']);
 a.deepEqual(c.afterBoth,['reciprocal']);
 a.deepEqual(m.twoAgent('common',0,{a0:1,b0:0}),{a1:0,b1:0});
 a.deepEqual(m.twoAgent('forward',0,{a0:1,b0:0}),{a1:0,b1:1});
 a.deepEqual(m.twoAgent('reciprocal',0,{a0:0,b0:1}),{a1:1,b1:0});
});
test('lack of observational treatment overlap blocks nonparametric point identification',()=>{
 const b=m.sharpBounds();
 a.equal(m.completions().length,4);
 a.deepEqual(b.values,[0,.5,1]);
 a.deepEqual([b.lower,b.upper],[0,1]);
 a.deepEqual(m.positivityAudit().map(x=>x.missingTreatment),[[1],[0]]);
});
test('two-way public acknowledgment is not deductive proof of private understanding',()=>{
 const w=m.recognitionWorlds({aAcknowledges:1,bAcknowledges:1});
 a.equal(w.length,2);a.deepEqual(w.map(x=>x.bInternallyRecognizes),[0,1]);
 const r=m.adjudicateRecognition({aAcknowledges:1,bAcknowledges:1});
 a.equal(r.mutualPublicAcknowledgment,true);
 a.equal(r.internalRecognitionEntailed,false);
 a.equal(r.humanKnowledge,'NOT_ADJUDICATED');
});
test('symbolic probes and source fidelity are not conflated with lived participants',()=>{
 const o=m.report();
 a.match(o.status,/AUTHOR_FIDELITY_HOLD/);
 a.match(o.status,/G221_B0_B6_NO_RUN/);
 a.match(o.court.status,/NOT_PERFORMED_ON_PEOPLE/);
 a.throws(()=>m.twoAgent('quantum',0),RangeError);
});
