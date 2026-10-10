'use strict';
const {test}=require('node:test'),a=require('node:assert/strict');
const m=require('../research/g222-p2/reference.cjs');
test('Kripke minimal partial fixed point leaves liar and truth teller undefined',()=>{
 const r=m.partialFixedPoint();a.deepEqual(r.value,{ground:'T',liar:'U',truthTeller:'U'});
 a.deepEqual(m.truthJump(r.value),r.value);a.equal(m.classicalLiarModels().length,0);
 a.equal(r.trace[0].ground,'U');a.equal(r.trace[1].ground,'T');
});
test('fixed reference truth cases are distinct from total bivalent contradiction',()=>{
 a.equal(m.truthJump({ground:'U',liar:'T',truthTeller:'F'}).liar,'F');
 a.equal(m.truthJump({ground:'U',liar:'F',truthTeller:'T'}).liar,'T');
});
test('finite Yablo has a coherent terminal boundary for every n up to 12',()=>{
 for(let n=1;n<=12;n++){
  const v=m.finiteYablo(n);a.ok(m.finiteYabloWitnessCheck(v));a.equal(v.at(-1),true);
  a.equal(v.filter(Boolean).length,1);
 }
});
test('independent exhaustive enumeration verifies finite Yablo uniqueness through n=10',()=>{
 for(let n=1;n<=10;n++){
  const brute=m.finiteYabloBrute(n),constructed=m.finiteYablo(n);
  a.equal(brute.length,1,'horizon '+n);a.deepEqual(brute[0],constructed);
 }
});
test('finite endpoints do not prove anything about infinite Yablo satisfiability',()=>{
 a.throws(()=>m.finiteYablo(Infinity),RangeError);a.throws(()=>m.finiteYablo(0),RangeError);
});
test('AGM contrast: expansion inconsistent, distinct fixed-selector repairs consistent',()=>{
 const base=['p','implication'];
 a.deepEqual(m.models(base),[3]);a.deepEqual(m.models([...base,'notQ']),[]);
 a.deepEqual(m.maximalNotEntailing(base,'q'),[['p'],['implication']]);
 const first=m.reviseNotQ(base,'first'),last=m.reviseNotQ(base,'last'),all=m.reviseNotQ(base,'all');
 a.ok(first.consistent&&last.consistent&&all.consistent);
 a.notDeepEqual(first.generators,last.generators);
 a.deepEqual(all.retained,[]);a.equal(m.entails(first.generators,'q'),false);
});
test('representative output disclaims G2.21 actual run and philosophical interpretation',()=>{
 const o=m.runReference();a.equal(o.contract,'P2_BOUNDED_REFERENCE_ONLY');
 a.match(o.execution,/NOT_G221_B0_B6/);
 a.ok(o.constraints.some(x=>x.includes('Park source')));
});
