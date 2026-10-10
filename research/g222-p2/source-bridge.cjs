'use strict';
function evaluate(x){
 const {member,defined,absolute}=x;
 if([member,defined,absolute].some(v=>typeof v!=='boolean'))throw TypeError('Boolean premises only');
 const collision=member&&defined&&absolute;
 return {collision,ruleSatisfied:!collision};
}
function cases(){
 return {
   reflexive:evaluate({member:true,defined:true,absolute:true}),
   commitment:evaluate({member:true,defined:true,absolute:false}),
   typed:evaluate({member:false,defined:true,absolute:true}),
   contextual:evaluate({member:true,defined:false,absolute:true})
 };
}
function exhaustive(){
 const rows=[];
 for(let n=0;n<8;n++){
  const x={member:!!(n&1),defined:!!(n&2),absolute:!!(n&4)};
  rows.push({premises:x,...evaluate(x)});
 }
 return rows;
}
module.exports={evaluate,cases,exhaustive};
