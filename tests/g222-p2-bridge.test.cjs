'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const c6=require('../research/g222-p2/source-bridge.cjs');
test('same source-inspired labels support distinct formal bridges',()=>{
 const r=c6.cases();
 assert.equal(r.reflexive.collision,true);
 for(const k of ['commitment','typed','contextual'])assert.equal(r[k].collision,false,k);
});
test('assumption minimality is exhaustive',()=>{
 const rows=c6.exhaustive();
 assert.equal(rows.length,8);
 assert.equal(rows.filter(x=>x.collision).length,1);
 assert.deepEqual(rows.find(x=>x.collision).premises,{member:true,defined:true,absolute:true});
});
test('independent premise removal changes result but not textual source',()=>{
 assert.throws(()=>c6.evaluate({member:true,defined:'unknown',absolute:true}),TypeError);
});
