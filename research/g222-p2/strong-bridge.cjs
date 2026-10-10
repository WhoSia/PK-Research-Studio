'use strict';
// G2.22 C6: a toy bridge court, not a representation endorsed by the source author.
// M: rule is among its own application objects; D: rule is defined;
// K: agent commits to keeping the rule; A: rule has object-level 'absolute' property.
// Shared experimental constraints insist on M=D=K=true.
// r: if M and D, then NOT A. Extra bridge B may equate commitment K to predicate A.
const VARIABLES=['M','D','K','A'];
function valuations(){
 return Array.from({length:16},(_,i)=>Object.fromEntries(VARIABLES.map((k,j)=>[k,Boolean(i&(1<<j))])));
}
function shared(w){return w.M&&w.D&&w.K&&!(w.M&&w.D&&w.A);}
const BRIDGES=Object.freeze({
 collapsed:w=>!w.K||w.A,
 separate:()=>true,
 equivalent:w=>w.K===w.A
});
function court(bridge){
 if(!Object.hasOwn(BRIDGES,bridge))throw new RangeError('Unknown bridge');
 const models=valuations().filter(w=>shared(w)&&BRIDGES[bridge](w));
 return {bridge,satisfiable:models.length>0,models,sourceInspiredConstraints:['self-in-domain','defined','committed'],bridgeIsSourceApproved:false};
}
function minimalPremises(){
 // The single bridge implication is a minimal UNSAT addition to the common satisfiable base.
 const base=court('separate'),strong=court('collapsed');
 return {baseCount:base.models.length,withCollapseCount:strong.models.length,
   witness:base.models[0],unverifiedSourceEquivalence:'K implies A'};
}
function fidelityContract(){
 return [
 {id:'H1',condition:'authorial wording and context not silently replaced',authority:'source-author',status:'HOLD'},
 {id:'H2',condition:'absolute-as-commitment and absolute-as-truth both shown',authority:'research audit',status:'DESIGN'},
 {id:'H3',condition:'self-application and definedness held constant in strong comparison',authority:'formal test',status:'TESTABLE'},
 {id:'H4',condition:'freedom/non-finalization not equated to a classical truth gap',authority:'source-author',status:'HOLD'},
 {id:'H5',condition:'mutability refers to rule, bearer, interpretation or time explicitly',authority:'research audit',status:'DESIGN'},
 {id:'H6',condition:'source author may reject any translation without veto proving its negation',authority:'source-author',status:'HOLD'},
 {id:'H7',condition:'rival cannot erase fixed/unfinished tension by stipulation',authority:'research audit',status:'DESIGN'},
 {id:'H8',condition:'positive and negative baselines have identical resource caps',authority:'formal test',status:'TESTABLE'}];
}
module.exports={valuations,shared,court,minimalPremises,fidelityContract};
