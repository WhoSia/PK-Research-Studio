#!/usr/bin/env python3
"""Independent finite satisfiability checker for G2.22 C6.
Uses direct logical constraints and constructive witness, not JS code.
No participant/author interpretation certification.
"""
from itertools import product

def rows():
    for m, d, k, a in product((False, True), repeat=4):
        yield {'M': m, 'D': d, 'K': k, 'A': a}

def base(w):
    return all((w['M'], w['D'], w['K'])) and not (w['M'] and w['D'] and w['A'])

def valid(w, bridge):
    if bridge == 'collapsed':
        return base(w) and (not w['K'] or w['A'])
    if bridge == 'separate':
        return base(w)
    if bridge == 'equivalent':
        return base(w) and w['K'] == w['A']
    raise ValueError('unregistered')

def run():
    space=list(rows())
    assert len(space)==16
    outcomes={k:[w for w in space if valid(w,k)] for k in ('collapsed','separate','equivalent')}
    assert len(outcomes['collapsed'])==0
    assert len(outcomes['equivalent'])==0
    assert outcomes['separate']==[{'M':True,'D':True,'K':True,'A':False}]
    # Separate constructive witness under all three shared positive constraints:
    witness={'M':True,'D':True,'K':True,'A':False}
    assert base(witness) and not valid(witness,'collapsed')
    # Independent sequent: M,D and rule entail ~A; K and bridge K->A entail A.
    rule_entails_not_a = witness['M'] and witness['D'] and not witness['A']
    bridge_requires_a = witness['K']
    assert rule_entails_not_a and bridge_requires_a
    print('PASS: 16 valuations; collapsed/equivalent=UNSAT; separate=SAT with 1 witness')
    print('HOLD: source-author approval, actual B0-B6 experiment, general representation theorem')

if __name__ == '__main__':
    run()
