'use strict';
// P&K G2.22-P2: bounded reference models. No participant-source interpretation or B0–B6 execution.
const assert=require('node:assert/strict');
const U='U',T='T',F='F';
const neg=x=>x===T?F:x===F?T:U;
function truthJump(v){return {ground:T,liar:neg(v.liar),truthTeller:v.truthTeller};}
function partialFixedPoint(){
 let v={ground:U,liar:U,truthTeller:U},trace=[{...v}];
 for(let step=0;step<20;step++){const next=truthJump(v);trace.push(next);if(Object.keys(v).every(k=>v[k]===next[k]))return {value:v,steps:step+1,trace};v=next;}
 throw Error('finite reference did not stabilize');
}
function classicalLiarModels(){return [false,true].filter(x=>x===!x);}
function finiteYablo(n){
 if(!Number.isSafeInteger(n)||n<1||n>22)throw RangeError('bounded horizon 1..22');
 const v=Array(n).fill(false);
 for(let i=n-1;i>=0;i--)v[i]=v.slice(i+1).every(x=>!x);
 return v;
}
function finiteYabloWitnessCheck(v){
 return v.every((x,i)=>x===v.slice(i+1).every(y=>!y));
}
function finiteYabloBrute(n){
 if(n<1||n>16)throw RangeError('exhaustive verifier horizon 1..16');
 const out=[];
 for(let mask=0;mask<2**n;mask++){
   const v=Array.from({length:n},(_,i)=>Boolean(mask&(1<<i)));
   if(finiteYabloWitnessCheck(v))out.push(v);
 }return out;
}
// Distinguish a deductively closed theory from finite generators.
// Classical propositional worlds over p,q, encoded by 0..3.
const worlds=[0,1,2,3];
const predicates=Object.freeze({
 p:w=>Boolean(w&1),q:w=>Boolean(w&2),
 implication:w=>!(w&1)||Boolean(w&2),notQ:w=>!Boolean(w&2)
});
function models(base){return worlds.filter(w=>base.every(p=>predicates[p](w)));}
function entails(base,formula){return models(base).every(predicates[formula]);}
function maximalNotEntailing(base,formula){
 const subsets=[];
 for(let mask=0;mask<2**base.length;mask++){
  const sub=base.filter((_,i)=>mask&(1<<i));
  if(entails(sub,formula))continue;
  if(base.some((item,i)=>!(mask&(1<<i))&&!entails([...sub,item],formula)))continue;
  subsets.push(sub);
 }return subsets;
}
function partialMeetContraction(base,formula,selector='all'){
 const options=maximalNotEntailing(base,formula);
 if(!options.length)return {options,retained:[],status:'NO_REMAINDER'};
 const chosen=selector==='all'?options:selector==='first'?[options[0]]:selector==='last'?[options.at(-1)]:null;
 if(!chosen)throw RangeError('unknown fixed selector');
 const retained=base.filter(p=>chosen.every(option=>option.includes(p)));
 return {options,retained,selector,status:'CONTRACTED'};
}
// Revision for finite generator bases, Levi-style contraction of negation of input.
// Here input notQ and its negation is q.
function reviseNotQ(base,selector){
 const contracted=partialMeetContraction(base,'q',selector);
 const generators=[...contracted.retained,'notQ'];
 return {...contracted,generators,models:models(generators),consistent:models(generators).length>0};
}
function runReference(){
 const k=partialFixedPoint(), y=finiteYablo(8);
 const a=['p','implication'];
 return {contract:'P2_BOUNDED_REFERENCE_ONLY',execution:'NEW_SYNTHETIC_REFERENCE_TESTS_NOT_G221_B0_B6',
 kripke:{least:k.value,steps:k.steps,classicalLiarModels:classicalLiarModels().length},
 yablo:{horizon:y.length,assignment:y.map(Boolean),satisfies:finiteYabloWitnessCheck(y)},
 agm:{initialModels:models(a),first:reviseNotQ(a,'first'),last:reviseNotQ(a,'last')},
 constraints:['Yablo finite truncation is not the infinite theorem','AGM finite-generator illustrative contraction is not a general representation theorem','Park source bridge and author acceptance untested']};
}
module.exports={T,F,U,truthJump,partialFixedPoint,classicalLiarModels,finiteYablo,finiteYabloWitnessCheck,finiteYabloBrute,models,entails,maximalNotEntailing,partialMeetContraction,reviseNotQ,runReference};
