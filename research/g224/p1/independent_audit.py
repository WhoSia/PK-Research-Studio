#!/usr/bin/env python3
"""Independent exhaustive G2.24-P1 finite reference court.
No participant source, real intervention, or private cognition is measured.
"""
from itertools import product
from fractions import Fraction
MODELS=('common','forward','reciprocal')
def nxt(model,u,a0,b0):
    return (b0 if model=='reciprocal' else u,
            u if model=='common' else a0)
natural=[(u,u,u,u,u) for u in (0,1)]
def survivors(cases):
    return [m for m in MODELS if all(nxt(m,u,a,b)==(a1,b1)
                 for u,a,b,a1,b1 in cases)]
assert survivors(natural)==list(MODELS)
first=(0,1,0,0,1)
reverse=(0,0,1,1,0)
assert survivors(natural+[first])==['forward','reciprocal']
assert survivors(natural+[first,reverse])==['reciprocal']
completions=[]
for y1_if_u0,y0_if_u1 in product((0,1),repeat=2):
    ate=Fraction(y1_if_u0+1-y0_if_u1,2)
    completions.append(ate)
assert sorted(set(completions))==[Fraction(0),Fraction(1,2),Fraction(1)]
assert (min(completions),max(completions))==(0,1)
# X=U has P(X=1|U=0)=P(X=0|U=1)=0: no positivity.
for u in (0,1):
    assert all(x==u for uu,x,_,_,_ in natural if uu==u)
# identical acknowledged messages, incompatible unobserved recognizing states.
worlds=[(1,1,r) for r in (0,1)]
assert worlds[0][:2]==worlds[1][:2] and worlds[0][2]!=worlds[1][2]
print('PASS G2.24-P1: lagged-coupling court / 2 asymmetric probes / ATE [0,1] / warrant non-entailment')
print('HOLD: source fidelity, human intervention, cognition; G2.21 B0-B6 NO RUN')
