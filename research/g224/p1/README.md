# P&K-G2.24-P1 — Observational Equivalence, Reciprocity Identification & Recognition-Warrant Court
## Contract
**Formal status: bounded synthetic theorem/counterexample court.** This model is researcher-created, not the source author's original words, not a source-fidelity certificate, and not an ethical or empirical intervention on persons. G2.21 B0–B6 remains NO RUN. Existing curated public manifest stays 21 records, unchanged. This research file is not a public release by itself.

## A. Three distinct causal hypotheses
Let U∈{0,1} denote shared environmental history, A0/B0 initial expressive observables, A1/B1 one *later* observation. Natural regime: A0=B0=U.
- C0 common cause: A1=U, B1=U.
- C1 forward influence: A1=U, B1=A0.
- C2 lagged bidirectional feedback: A1=B0, B1=A0.
These are time-indexed recurrences; **no instantaneous cyclic equilibrium is postulated**.

Under U=0 or U=1 and untouched expressions, all three generate exactly (A0,B0,A1,B1)=(U,U,U,U). Thus the observational distribution across natural regimes cannot distinguish the causal classes. For any deterministic decision functional F of those observable natural distributions, F cannot consistently name the true model across all three: the input distribution is identical but the structural graph is different.

### Sequential counterfactual probes
At U=0 and baseline A0=B0=0, hypothetical controlled replacement **do(A0=1)**:
- C0 predicts (A1,B1)=(0,0).
- C1 predicts (A1,B1)=(0,1).
- C2 predicts (A1,B1)=(0,1).
Thus observing a change in B1 would separate C0 from the latter two *only within the stated structural family*, NOT prove mutual influence.

Second distinct hypothetical **do(B0=1)**:
- C0,C1 predict (A1,B1)=(0,0).
- C2 predicts (A1,B1)=(1,0).
Only the two mutually orthogonal probes separate C2 from C1 *within this three-model toy family*. In real life, replacing an expression without simultaneously modifying thought/environment/selection is often infeasible; these are mathematical `do` operators, **not directions to manipulate another person**.

**Adversarial enlargement:** add selection/homophily, unknown prior history, feedback through measured context, measurement errors or hidden recognition states, and the two hypothetical probes may no longer uniquely identify a model. The result is conditional model-family identification, not universal identification.

## B. Positivity is missing from the public toy case
Observed X=U with U∈{0,1} means
P(X=1|U=0)=0 and P(X=0|U=1)=0.
No observed data support contrasting expression levels within fixed environmental strata. Therefore the observational contrast P(Y=1|X=1)-P(Y=1|X=0)=1 is **not** an identified intervention effect. This is a stronger explanation of *why* the G2.24 public explorer needs a hypothetical intervention switch.

### Sharp ATE bounds under explicitly finite assumptions
Assume P(U=0)=P(U=1)=1/2, binary Y(0),Y(1), consistency, X=U, observed Y=X. Let a=Y(1)|U=0 and b=Y(0)|U=1 denote the two missing potential outcomes (binary, otherwise unrestricted). Then:
ATE = E[Y(1)-Y(0)] = [a+(1-b)]/2.
Exhaustively, (a,b)∈{0,1}² yields ATE∈{0,1/2,1}. The **sharp interval is [0,1]** (attainable endpoints), even though the observed difference is 1. C0 common cause realizes 0, C1 perfect expression effect realizes 1. This result is specific to a two-stratum balanced binary toy population; no real people are assigned 0/1 introspective quantities, and one must not extrapolate numerical bounds to human recognition.

## C. Epistemic authority: two senses of recognition
Let `S_A(B)` = A reports recognizing B, `Ack_B(A)` = B performs an observable acknowledgment toward A, `Int_B(A)` = B privately understands/recognizes A. These are distinct typed assertions.
Construct two possible worlds w0,w1 sharing exactly the same publicly acknowledged messages by A and B, but with `Int_B(A)` false in w0 and true in w1. Therefore mutual *public acknowledgment* does not logically entail B's unobservable private understanding without additional assumptions. First-person report may warrant that someone's reported experience exists without granting an investigator authority to assert another's inaccessible experience. This is an underdetermination demonstration, not proof that sincere acknowledgment is meaningless.

**Counterobjection:** Source-author testimony or B's own self-report can supply additional evidence; our two-world example does not prohibit practical, ethical, intersubjective warranted recognition. It only blocks an unconditional logical entailment from public signals to private mental states. Evidence warrant is not an automatically ordered 0–100 score and should preserve speaker correction authority.

## D. Literature and exact relation
Manski 1993 *Identification of Endogenous Social Effects: The Reflection Problem*, Review of Economic Studies 60(3):531–542 DOI:10.2307/2298123. Publisher abstract checked. Identifiability depends on reference-group information and how characteristics relate to direct determinants; abstract-only citation.
Shalizi & Thomas 2011 *Homophily and Contagion Are Generically Confounded in Observational Social Network Studies*, Sociological Methods & Research 40(2):211–239 DOI:10.1177/0049124111404820; open article https://pmc.ncbi.nlm.nih.gov/articles/PMC3328971/ . **More than abstract checked**: Sections 'Contagion Effects Are Nonparametrically Unidentifiable' and 'The Argument From Asymmetry', their discussion of a latent trait leading to both tie formation and behavior, and the failure of regression asymmetry as sufficient causal evidence. Their paper has more substantial assumptions and results than this toy example; do not attribute our two-agent arithmetic or tight [0,1] bound to those authors.

## E. Necessary robustness attacks before any stronger research claim
1. **Partial identification:** Does any source-grounded extra restriction shrink [0,1] beyond trivially assuming the answer? Even repeated natural observations along X=U do not restore positivity.
2. **Symmetry and selection:** Can a hidden H model imitate both single-agent apparent interventions when assignments are not independent?
3. **Temporal ordering:** Does observed simultaneous response mean feedback, or common reaction to a prior event? Give each effect a lagged source.
4. **Recognition vs expression:** Do two public acknowledgments warrant mutual recognition as a social convention only, or the alleged private psychological agreement? Keep explicit which property is tested.
5. **Probability semantics:** A numerical probability needs an event, reference population, temporal sampling protocol, selection/missingness handling and permissions. Phenomenological possibility is not calibrated probability.
6. **Source fidelity:** A source-author may reject the actor/state/action decomposition itself. That is an interpretive revision, NOT a failure of the finite logical demonstration.

## F. Reproducible bounded verification
```sh
node --test tests/g224-p1-identification.test.cjs
python3 research/g224/p1/independent_audit.py
node -p 'JSON.stringify(require("./research/g224/p1/identification.cjs").report(),null,2)'
```
The Node and independent Python audits check model survivors, 4 missing-potential-outcome completions, ATE interval and two observationally indistinguishable recognition-worlds. They share *the declared toy mathematics*, so this is independent implementation-level verification, not an independent human semantics adjudication.
