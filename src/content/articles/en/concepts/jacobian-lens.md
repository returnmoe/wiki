---
id: jacobian-lens
title: Jacobian Lens
summary: A vocabulary-based interpretability technique that reads and edits intermediate language-model representations through their average first-order effects on later outputs.
locale: en
kind: concept
revision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - J-lens
  - Jacobian lens
redirects:
  - j-lens
related:
  - mechanistic-interpretability
  - miru-tracer
  - anthropic
infobox:
  fields:
    - key: type
      value: Vocabulary-projection interpretability technique
    - key: authors
      value:
        text: Wes Gurnee et al.
        url: https://transformer-circuits.pub/2026/workspace/index.html
    - key: debut
      value: July 6, 2026
    - key: affiliation
      value:
        text: Anthropic
        article: anthropic
    - key: website
      value:
        text: Verbalizable Representations Form a Global Workspace in Language Models
        url: https://transformer-circuits.pub/2026/workspace/index.html
---

The **Jacobian lens**, usually shortened to **J-lens**, is a
[mechanistic-interpretability](/mechanistic-interpretability/) technique for translating an
intermediate language-model activation into a ranked list of vocabulary tokens. It was introduced
by [Anthropic](/anthropic/) researchers in the 2026 paper _Verbalizable Representations Form a
Global Workspace in Language Models_.[^paper]

Rather than asking only which token the model is about to produce, the J-lens estimates which words
an activation is generally capable of making the model produce at the current or a later position.
It does this with an averaged Jacobian: a first-order approximation of how perturbing a residual
stream at one layer changes final-layer states downstream.[^construction]

The resulting token list is a model- and method-dependent readout, not a literal transcript of a
private sentence inside the model. In the paper's interpretation, a highly ranked token names a
concept that the activation is **disposed to verbalize** across contexts. Establishing what role that
concept plays still requires comparison, intervention, and attention to the lens's
limitations.[^interpretation][^limitations]

## Motivation

A decoder-only transformer repeatedly updates a residual-stream vector at each token position. At
the final layer, normalization and the unembedding matrix convert that vector into next-token
logits. Applying the same output operation directly to an earlier residual stream gives the **logit
lens**, but that shortcut assumes that early and late representations use compatible coordinates.
Residual connections make the approximation useful in later layers, while representational changes
can make early-layer output noisy or misleading.[^comparison]

The J-lens replaces that identity assumption with a fitted map from each source layer to the final
layer. The map is derived from local derivatives of the model itself, so it describes an average
first-order causal path from an activation direction to later residual states. It is still a linear
approximation, but it corrects for rotations, rescalings, and other systematic changes of
representation that a direct unembedding ignores.[^construction][^comparison]

## Construction

Let `h_l,t` denote the residual-stream activation at layer `l` and token position `t`, and let
`h_final,t'` denote the final-layer activation at a position `t'` that is at or after `t`. The local
Jacobian `∂h_final,t' / ∂h_l,t` describes how a small change at the source would change that later
state to first order. The paper averages these Jacobians over source positions, all later positions,
and one thousand prompts sampled from a pretraining-like distribution:[^construction]

```text
J_l = E[t, t' >= t, prompt](∂h_final,t' / ∂h_l,t)
```

This produces one square matrix `J_l` for each fitted layer. Applying the matrix to an activation,
then using the model's normal normalization and unembedding, yields a score for every vocabulary
token:[^construction]

```text
lens(h_l) = softmax(W_U norm(J_l h_l))
```

The rows of `W_U J_l` are the layer's **J-lens vectors**. Each is a residual-stream direction linked
to one vocabulary token. Because the averaging is performed over many prompts and future positions,
the direction is intended to capture a general disposition to verbalize that token rather than the
specific continuation of the prompt used for inspection.[^construction]

Fitting is the expensive stage. Once a matrix has been computed for a layer, ordinary readout needs
only the fitted linear map and the model's output operation. The artifact is tied to the model's
weights and architecture; a fit for one checkpoint should not be assumed valid for another.[^construction][^miru-v020]

## Reading activations

The simplest readout sorts the lens scores and displays the highest-ranked tokens for one layer and
position. Tracking a token across layers can show when a candidate concept becomes prominent, while
tracking a layer across positions can show where it is represented in the sequence. A single J-lens
vector can also be used as a probe for a chosen concept without ranking the entire
vocabulary.[^use-cases]

The readout should be interpreted as a bag of related ideas rather than a sentence. One concept may
surface through several synonyms, names, or token fragments, and several high-ranking words may
describe a shared semantic neighborhood. Rank is also relative: a token can move upward because its
own score increased or because competing tokens weakened.[^interpretation][^limitations]

When a discrete inventory is needed, the paper uses sparse nonnegative decomposition to approximate
an activation with a small set of J-lens vectors. Because the token-indexed vectors are overcomplete
and non-orthogonal, this sparse solution is not the same as selecting the tokens with the largest
individual inner products, and it is not mathematically unique without additional constraints.[^j-space]

## Writing and intervening

The same vectors used for readout can support causal experiments. Adding a scaled J-lens vector to
an activation steers the model toward its associated concept. Subtracting it, projecting it out, or
suppressing several active vectors performs an ablation. These interventions test whether a decoded
direction can influence later computation; they do not by themselves prove that the model normally
uses the direction in the proposed way.[^use-cases]

**Lens-coordinate swapping** exchanges the coordinates associated with two token vectors while
leaving the activation component outside their span unchanged. In the paper's verbal-report
experiments, swapping a model's spontaneously selected category item for another candidate shifted
the reported answer toward the inserted concept. Other experiments used swaps and ablations to
redirect intermediate reasoning, providing stronger causal evidence than a readout alone.[^workspace-evidence]

As with activation steering generally, intervention strength, layer range, token position, and
off-distribution effects matter. A failed intervention can mean that the concept was absent, poorly
represented by its vocabulary vector, written elsewhere, or protected by redundant computation; a
successful intervention can reflect artificial control without identifying the model's normal
algorithm.[^use-cases][^limitations]

## J-space and the global-workspace hypothesis

The paper calls the sparse set of activations expressible as nonnegative combinations of J-lens
vectors the **J-space**. The vectors form an overcomplete frame because the vocabulary contains more
tokens than the residual stream has dimensions. The authors usually limited decompositions to no
more than 25 active vectors and reported that the resulting J-space component accounted for less
than ten percent of activation variance in the layers studied.[^j-space]

Across several Claude models, the authors found that coherent J-space content emerged after an
early band of layers and shifted toward imminent output representations near the end. They reported
evidence that the intermediate band supported verbal report, deliberate modulation, multi-step
reasoning, flexible reuse across tasks, and selective rather than universal participation in model
computation. On that basis, they described it as functionally similar to a **global
workspace**.[^workspace-evidence]

This is a functional and mechanistic analogy, not a claim that a transformer recreates the brain
architecture proposed by global workspace theories or that the model is conscious. The paper notes
that a feed-forward transformer lacks clear counterparts to specialized recurrent processors and
that its evidence does not settle questions about subjective experience.[^paper]

## Comparison with other lenses

In the paper's formulation, the logit lens is the special case `J_l = I`: it applies the final
unembedding as though downstream layers preserved the relevant direction. The two methods tend to
agree near the output and diverge earlier. The authors found the logit lens practically useful but
the J-lens more reliable for early and unspoken intermediate concepts on their selected
evaluations.[^comparison][^lens-evaluation]

The **tuned lens** also learns a translator for every layer, but optimizes it to predict the model's
eventual output distribution. The J-lens instead derives its translator from average local causal
effects. In the workspace paper's experiments, tuned-lens readouts sometimes skipped intermediate
computations and moved directly toward the answer; this result concerns the studied models and
benchmarks rather than establishing that one lens is universally preferable.[^tuned-lens][^comparison]

The methods therefore answer related but different questions. The logit lens is cheap and requires
no fitted artifact, the tuned lens is trained to reconstruct output predictions, and the J-lens is
fitted to approximate how intermediate perturbations propagate to present and future outputs. Using
more than one can reveal when an interpretation depends on a particular projection.[^comparison]

## Applications reported in the paper

The authors used J-lens readouts to surface intermediate assessments that were neither copied from
the input nor identical to the next token, including recognition of a face, a code defect, a
protein's function, and a prompt injection. They also examined strategic deliberation, reactions to
roleplay and character drift, and internal signatures in specially trained misaligned models. These
case studies motivate auditing uses but do not show that every relevant plan must pass through a
readable J-space.[^paper][^alignment-monitoring]

The paper also introduced **counterfactual reflection training**. Models were trained to articulate
ethical principles in hypothetical continuations where they were interrupted and asked to reflect;
the associated concepts then appeared in the J-space during uninterrupted tasks, and ablating them
substantially reduced the reported behavioral improvement. The experiment links the lens to a
particular training intervention, but further replication is needed before treating the method as a
general alignment recipe.[^counterfactual-reflection]

## Limitations

Each standard J-lens vector corresponds to one tokenizer token. Multi-token names, phrases, and
concepts with no compact lexical label can therefore fragment across the readout or remain hard to
identify. The paper explored template-based extensions for multi-token concepts, but those methods
have separate costs and failure modes.[^limitations]

The lens also produces a flat bag of concepts without showing how they are bound into relations. A
readout containing words corresponding to an entity, a number, and an attribute does not say which
attribute belongs to which entity. Some workspace-layer readouts remain uninterpretable, early
layers are often noisy, and the boundary drawn between workspace-like and output-oriented “motor”
representations was partly post hoc.[^limitations]

An averaged first-order map necessarily discards prompt-specific nonlinear dynamics. Information
outside the token-indexed frame, automatic computations that bypass the J-space, or well-practiced
undesirable circuits may evade inspection. The paper therefore presents J-lens monitoring as one
auditing tool to combine with behavioral evaluation, sparse features, and other causal methods—not
as a sufficient safety monitor.[^alignment-monitoring]

## Relationship to Miru Tracer

[Miru Tracer](/miru-tracer/) includes fitted Jacobian-lens readouts in its layer-and-token
workbench, alongside a training-free logit lens. Its fit files must match the exact model checkpoint,
and its interface is intended to help users compare tokens across positions and layers before trying
steering, ablation, or token-direction swaps.[^miru-v020][^miru-repository]

This makes Miru Tracer a practical route for exploring the technique within its supported models,
but the interface does not remove the method's interpretive limits. Miru's own documentation warns
that token readouts are not ground-truth transcripts of a model's thoughts, and causal claims still
require controlled comparison runs.[^miru-v020]

## References

[^paper]: [Verbalizable Representations Form a Global Workspace in Language Models](https://transformer-circuits.pub/2026/workspace/index.html), Transformer Circuits Thread.

[^construction]: [The Jacobian Lens](https://transformer-circuits.pub/2026/workspace/index.html#the-jacobian-lens), in _Verbalizable Representations Form a Global Workspace in Language Models_.

[^interpretation]: [Interpreting the J-lens](https://transformer-circuits.pub/2026/workspace/index.html#interpreting-the-j-lens), in _Verbalizable Representations Form a Global Workspace in Language Models_.

[^use-cases]: [Technical details of J-lens use cases](https://transformer-circuits.pub/2026/workspace/index.html#technical-details-of-j-lens-use-cases), in _Verbalizable Representations Form a Global Workspace in Language Models_.

[^j-space]: [The J-Space](https://transformer-circuits.pub/2026/workspace/index.html#the-j-space), in _Verbalizable Representations Form a Global Workspace in Language Models_.

[^workspace-evidence]: [The J-space acts as a Global Workspace](https://transformer-circuits.pub/2026/workspace/index.html#the-j-space-acts-as-a-global-workspace), in _Verbalizable Representations Form a Global Workspace in Language Models_.

[^comparison]: [Comparison to Related Techniques](https://transformer-circuits.pub/2026/workspace/index.html#comparison-to-related-techniques), in _Verbalizable Representations Form a Global Workspace in Language Models_.

[^lens-evaluation]: [Comparison between lensing methods](https://transformer-circuits.pub/2026/workspace/index.html#comparison-between-lensing-methods), in _Verbalizable Representations Form a Global Workspace in Language Models_.

[^tuned-lens]: [Eliciting Latent Predictions from Transformers with the Tuned Lens](https://arxiv.org/abs/2303.08112).

[^alignment-monitoring]: [Alignment monitoring](https://transformer-circuits.pub/2026/workspace/index.html#alignment-monitoring), in _Verbalizable Representations Form a Global Workspace in Language Models_.

[^counterfactual-reflection]: [Counterfactual Reflection Training](https://transformer-circuits.pub/2026/workspace/index.html#counterfactual-reflection-training), in _Verbalizable Representations Form a Global Workspace in Language Models_.

[^limitations]: [Limitations and open questions](https://transformer-circuits.pub/2026/workspace/index.html#limitations-and-open-questions), in _Verbalizable Representations Form a Global Workspace in Language Models_.

[^miru-v020]: [Miru Tracer v0.2.0: from token probabilities to model internals](https://blog.return.moe/en/2026/07/11/miru-tracer-v0-2-0/), return moe blog.

[^miru-repository]: [Miru Tracer repository](https://github.com/returnmoe/miru-tracer).
