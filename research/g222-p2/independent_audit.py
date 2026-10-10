#!/usr/bin/env python3
"""Independent Python bounded witness audit for P&K-G2.22-P2.
This script implements predicates directly rather than invoking JavaScript.
No Park source, G2.21 B0–B6 or infinitary Yablo theorem is simulated.
"""
from itertools import product, combinations

def yablo_valid(values):
    return all(x == (not any(values[i + 1:])) for i, x in enumerate(values))

def yablo_all(n):
    return [v for v in product((False, True), repeat=n) if yablo_valid(v)]

def semantics(base):
    f = {
        'p': lambda w: bool(w & 1),
        'implication': lambda w: (not bool(w & 1)) or bool(w & 2),
        'q': lambda w: bool(w & 2),
        'notQ': lambda w: not bool(w & 2)
    }
    return tuple(w for w in range(4) if all(f[item](w) for item in base))

def entails(base, target):
    candidates = semantics(base)
    f = (lambda w: bool(w & 2)) if target == 'q' else (lambda w: not bool(w & 2))
    return all(f(w) for w in candidates)

def maximal_remnants(base):
    candidates = []
    for k in range(len(base) + 1):
        for selection in combinations(base, k):
            if entails(selection, 'q'):
                continue
            if any(not entails(selection + (x,), 'q') for x in base if x not in selection):
                continue
            candidates.append(selection)
    return candidates

def main():
    # Cross-language independent exhaustive finite witness search.
    for n in range(1, 11):
        witnesses = yablo_all(n)
        expected = (False,) * (n - 1) + (True,)
        assert witnesses == [expected], (n, witnesses)
    # Truth-value gap: three-valued strong Kleene liar.
    unassigned = None
    not3 = lambda v: None if v is None else (not v)
    truth = {'ground': unassigned, 'liar': unassigned, 'teller': unassigned}
    for _ in range(3):
        truth = {'ground': True, 'liar': not3(truth['liar']), 'teller': truth['teller']}
    assert truth == {'ground': True, 'liar': None, 'teller': None}
    assert not any(x == (not x) for x in (True, False))
    base = ('p', 'implication')
    assert semantics(base) == (3,)
    assert semantics(base + ('notQ',)) == ()
    remnants = maximal_remnants(base)
    assert sorted(remnants) == [('p',), ('implication',)] or set(remnants) == {('p',),('implication',)}
    assert semantics(('p', 'notQ')) == (1,)
    assert semantics(('implication', 'notQ')) == (0,)
    # Hidden epistemic-state ordering: identical top world but different next not-q worlds.
    a, b = (3, 1, 2, 0), (3, 0, 2, 1)
    assert a[0] == b[0] == 3
    assert next(w for w in a if not w & 2) != next(w for w in b if not w & 2)
    # State augmentation: x alone underdetermines successor, while (x,mode) determines it.
    nxt = lambda x, flip: (not x if flip else x)
    assert nxt(False, True) != nxt(False, False)
    print('PASS: independent Python bounded witness checks K/Y/AGM/C4/C5')
    print('SCOPE: synthetic finite baselines only; NOT G2.21 B0–B6 run; no source bridge')

if __name__ == '__main__':
    main()
