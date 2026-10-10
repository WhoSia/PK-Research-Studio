'use strict';
const {test}=require('node:test'),a=require('node:assert/strict');
const c=require('../research/g222-p2/strong-bridge.cjs');
test('C6 high-fidelity comparison retains all shared positive commitments',()=>{
 const s=c.court('separate'),e=c.court('collapsed'),eq=c.court('equivalent');
 a.equal(s.models.length,1);
 a.equal(e.models.length,0);a.equal(eq.models.length,0);
 const w=s.models[0];a.deepEqual(w,{M:true,D:true,K:true,A:false});
 a.ok(c.shared(w));a.equal(e.bridgeIsSourceApproved,false);
});
test('a single researcher bridge addition makes a previously consistent source-inspired base unsat',()=>{
 const x=c.minimalPremises();
 a.equal(x.baseCount,1);a.equal(x.withCollapseCount,0);
 a.equal(x.unverifiedSourceEquivalence,'K implies A');
});
test('exhaustive 16 valuations and explicit source fidelity gates',()=>{
 a.equal(c.valuations().length,16);
 const rubric=c.fidelityContract();a.equal(rubric.length,8);
 a.equal(new Set(rubric.map(x=>x.id)).size,8);
 a.ok(rubric.some(x=>x.authority==='source-author'&&x.status==='HOLD'));
 a.throws(()=>c.court('improvised'),RangeError);
});
