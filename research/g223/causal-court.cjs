'use strict';
// G2.23: synthetic rival evidence, not measurements or interpretation of a person.
const statuses=['ON','OFF','UNRESOLVED'];
function jurisdiction(status){if(!statuses.includes(status))throw new RangeError('status');return status==='ON'?{admitted:true,truth:'RULE_TRUE_UNDER_ASSUMPTIONS'}:status==='OFF'?{admitted:false,truth:null}:{admitted:null,truth:null};}
function observed(environment){if(![0,1].includes(environment))throw RangeError('environment');return {environment,expression:environment,outcome:environment};}
function outcome(model,environment,expression){if(![0,1].includes(environment)||![0,1].includes(expression))throw RangeError('input');if(model==='environment')return environment;if(model==='expression')return expression;throw RangeError('model');}
function observationalEquivalence(){const models=['environment','expression'];return [0,1].every(e=>models.every(m=>outcome(m,e,e)===observed(e).outcome));}
function interventions(){return [0,1].flatMap(environment=>[0,1].map(expression=>({environment,expression,environmentModel:outcome('environment',environment,expression),expressionModel:outcome('expression',environment,expression)})));}
function identifiedSet(observations){if(!Array.isArray(observations))throw TypeError('observations');return ['environment','expression'].filter(m=>observations.every(o=>outcome(m,o.environment,o.expression)===o.outcome));}
function evaluate(){const natural=[observed(0),observed(1)],doCase=[{environment:0,expression:1,outcome:1}];return {jurisdiction:statuses.map(s=>({status:s,...jurisdiction(s)})),observationalEquivalence:observationalEquivalence(),observationOnly:identifiedSet(natural),afterIntervention:identifiedSet([...natural,...doCase]),interventionGrid:interventions(),authority:'SYNTHETIC_FINITE_ONLY_AUTHOR_FIDELITY_UNVERIFIED_G221_B0_B6_NO_RUN'};}
module.exports={jurisdiction,observed,outcome,observationalEquivalence,interventions,identifiedSet,evaluate};
