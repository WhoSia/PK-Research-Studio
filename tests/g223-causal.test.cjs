'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const c=require('../research/g223/causal-court.cjs');
test('applicability is not a truth-value trichotomy',()=>{
 const j=c.evaluate().jurisdiction;assert.deepEqual(j.map(x=>x.admitted),[true,false,null]);assert.equal(j[2].truth,null);assert.throws(()=>c.jurisdiction('BOTH'),RangeError);
});
test('two structural causal models fit identical observations',()=>{
 assert.equal(c.observationalEquivalence(),true);
 assert.deepEqual(c.identifiedSet([c.observed(0),c.observed(1)]),['environment','expression']);
});
test('a preregistered intervention would discriminate models',()=>{
 const row=c.interventions().find(x=>x.environment===0&&x.expression===1);
 assert.deepEqual([row.environmentModel,row.expressionModel],[0,1]);
 assert.deepEqual(c.evaluate().afterIntervention,['expression']);
});
test('observational equivalence does not imply a source causal claim',()=>{
 assert.match(c.evaluate().authority,/AUTHOR_FIDELITY_UNVERIFIED/);
 assert.match(c.evaluate().authority,/B0_B6_NO_RUN/);
});
