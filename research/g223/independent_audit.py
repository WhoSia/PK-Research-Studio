#!/usr/bin/env python3
"""Independent finite SCM reference (synthetic; no human data)."""
status = ("ON", "OFF", "UNRESOLVED")
assert len(status) == 3
natural = [(env, env, env) for env in (0, 1)]
def predict(model, env, expression):
    return env if model == "environment" else expression
models = ("environment", "expression")
assert all(predict(model, env, x) == y for env, x, y in natural for model in models)
test = (0, 1, 1)
candidates = [model for model in models if predict(model, test[0], test[1]) == test[2]]
assert candidates == ["expression"]
for env in (0, 1):
    for action in (0, 1):
        assert predict("environment", env, action) == env
        assert predict("expression", env, action) == action
print("PASS: G2.23 reference SCM observation-equivalence and synthetic do-intervention")
print("HOLD: human causal evidence, author fidelity; G2.21 B0-B6 NOT RUN")
