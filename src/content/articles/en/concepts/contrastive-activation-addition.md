---
id: contrastive-activation-addition
title: Contrastive Activation Addition
summary: An inference-time steering method that derives a behavior direction from paired examples and adds it to a language model's residual stream.
locale: en
kind: concept
revision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - CAA
  - Contrastive activation addition
  - CAA steering
redirects:
  - caa
  - caa-steering
related:
  - mechanistic-interpretability
  - directional-ablation
  - persona-selection-model
infobox:
  fields:
    - key: type
      value: Activation-steering and representation-engineering method
    - key: authors
      value:
        - Nina Rimsky
        - Nick Gabrieli
        - Julian Schulz
        - Meg Tong
        - Evan Hubinger
        - Alexander Turner
    - key: debut
      value: December 9, 2023
    - key: website
      value:
        text: Steering Llama 2 via Contrastive Activation Addition
        url: https://aclanthology.org/2024.acl-long.828/
---

**Contrastive Activation Addition** (**CAA**) is a method for steering a language model during
inference by adding a learned direction to its internal activations. Nina Rimsky and colleagues first
released the method in December 2023 and presented its peer-reviewed version at ACL 2024. Their study
used pairs of positive and negative examples to estimate a direction associated with a behavior, then
added or subtracted that direction from the model's residual stream while it generated a
response.[^preprint][^paper]

CAA is a form of **activation engineering** or **representation engineering**. It needs white-box
access to intermediate model states, but it does not update the model's weights or optimize a prompt.
The learned vector, chosen layer, intervention strength, and token positions together form the
steering configuration. Calling a vector “honesty,” “refusal,” or “sycophancy” is a hypothesis about
what its contrast set captures, not a guarantee that the vector is a pure or complete representation
of that concept.[^paper]

## Constructing a steering vector

CAA begins with a dataset of contrastive triples. Each triple contains the same prompt `p` and two
short completions: `c_positive`, which demonstrates the target behavior, and `c_negative`, which
demonstrates its opposite. In the original experiments, these were two-answer multiple-choice
questions. The complete prompt differed only in whether the answer letter associated with the
positive or negative response had been appended.[^paper]

At a selected layer `l`, the method records the residual-stream activation at the answer-letter
position for both members of every pair. If `a_l(p, c)` is that activation, the mean-difference vector
is:[^paper]

```text
v_l = (1 / |D|) sum over D [a_l(p, c_positive) - a_l(p, c_negative)]
```

Using an identical question on both sides cancels some prompt-specific content, while averaging many
pairs reduces the influence of any one example. It does not cancel every confound. Answer-token
identity, wording regularities, label imbalance, formatting, and correlations inside the dataset can
all contribute to the mean difference. The paper therefore distinguishes unavoidable clustering by
answer letter from the behavior-based clustering expected of a useful contrast set.[^paper]

“Positive” and “negative” are orientation labels, not moral judgments. If the pair order is reversed,
the vector's sign reverses. A hallucination vector, for example, points from the paper's factual
completion toward its hallucinatory completion because hallucination was designated as the positive
behavior for that experiment.[^paper][^code]

The vector is specific to a checkpoint, activation location, and layer. Residual-stream coordinates
can rotate or rescale across layers, and two models with the same architecture do not necessarily use
the same direction. The paper generated a candidate vector at every layer and performed a held-out
layer sweep before choosing an intervention layer. It also normalized vector magnitudes across the
tested behaviors at a given layer so multiplier values would be more comparable.[^paper]

## Applying CAA

For each generated token position `t`, CAA changes the residual state at the selected layer according
to:[^paper]

```text
h_l,t_steered = h_l,t + alpha v_l
```

The scalar `alpha` controls the direction and strength. Positive values push toward the behavior used
on the positive side of the contrast set, negative values push toward the opposite, and zero recovers
ordinary inference. In the published setup, the vector was added at every token position after the
user's prompt, not to the cached prompt positions themselves.[^paper]

This is a constant translation of the state: every affected activation receives the same `alpha v_l`.
It differs from [directional ablation](/directional-ablation/), which removes whatever component
an individual activation already has along a direction. CAA can encourage either end of a contrast
and provides a continuous strength control, but an excessive multiplier can displace activations far
from states the model encountered in training. The paper restricted its open-ended multiplier range
after both human inspection and its automated evaluator found degraded text at larger values.[^paper]

Inference code usually implements the operation with a forward hook or an equivalent modification to
the model runtime. The weights on disk remain unchanged, so steering can be enabled, disabled, or
given a new coefficient between requests. The trade-off is that the runtime must expose the right
activation and reapply the intervention during generation; an ordinary remote text API is not enough.

## Original experiments

The study evaluated Llama 2 7B Chat and Llama 2 13B Chat and also derived vectors from the Llama 2 7B
base model for transfer experiments. It tested seven behavior labels:[^paper]

- coordination with other AIs;
- corrigibility;
- hallucination;
- preference for myopic reward;
- survival instinct;
- sycophancy; and
- refusal.

Most contrast sets came from Anthropic's human-written model evaluations. The authors combined two
sycophancy sets and generated the hallucination and refusal sets with GPT-4. Dataset sizes used to
form vectors ranged from 290 contrast pairs for corrigibility to 1,000 each for hallucination and
sycophancy, with 50 held-out questions per behavior.[^paper][^code]

### Layer selection and multiple-choice evaluation

For each behavior, the authors added and subtracted candidate vectors across the model's layers and
measured the change in probability assigned to the behavior-matching answer. Effects peaked in a
similar middle-layer band: around layer 13 for Llama 2 7B Chat and usually layer 14 or 15 for the 13B
model. The intervention consistently changed the held-out multiple-choice score in the intended
direction across the seven tested datasets.[^paper]

Principal-component plots of the same activations showed that clustering by behavior often emerged
roughly one-third of the way through the network. This observation helped motivate the layer sweep,
but the plots are descriptive: two-dimensional separation does not establish that one linear feature
is the model's full mechanism for a behavior.[^paper]

### Open-ended generation

To test transfer beyond answer letters, the researchers removed the options from held-out questions
or wrote new free-response prompts, then asked GPT-4 to rate the resulting generations on a ten-point
behavioral scale. Across their tested settings, adding and subtracting the vectors shifted the rated
behavior in the expected directions. This provides evidence that the mean differences captured more
than the literal multiple-choice token.[^paper]

The result is not equivalent to perfect behavioral control. Effect size depended on the model,
behavior, layer, and multiplier, and some combinations with fine-tuning behaved non-monotonically. In
the refusal experiment, for example, positive CAA on one positively fine-tuned model reduced rather
than increased the open-ended refusal score. Such interactions show that independently useful
interventions need not compose additively at the behavioral level.[^paper]

### Prompting, fine-tuning, and capabilities

The paper combined CAA with positive and negative system prompts. For most of its multiple-choice
tests, CAA shifted behavior beyond the selected prompt alone. It also compared CAA with one epoch of
full supervised fine-tuning on the same contrast data. Vector extraction required forward passes only
and took less than five minutes per behavior on one NVIDIA L40 in the reported setup; the study's
fine-tuning baseline took about ten minutes on two L40 GPUs.[^paper]

These timing numbers are illustrative rather than an architecture-independent speed ratio. The
fine-tuning hyperparameters and system prompts were not exhaustively optimized, which the authors
list as a limitation. Fine-tuning produces a persistent checkpoint and can learn changes distributed
through the network; CAA instead supplies reversible, per-request control at the cost of a modified
inference path.[^paper]

On a reformatted subset of MMLU—ten questions from each of 57 subjects converted to two choices—the
tested CAA vectors produced small score changes around the unsteered baseline. Subtracting the
sycophancy vector also slightly improved TruthfulQA in that experiment. These narrow evaluations
support the claim that moderate steering need not destroy general performance, but they are not a
complete capability or safety evaluation.[^paper]

## Relationship to Activation Addition

CAA extends the earlier **Activation Addition** (**ActAdd**) method. ActAdd forms a vector from the
activation difference between a single prompt pair and injects it during another forward pass. CAA
uses hundreds of closely matched contrast pairs, averages their differences, and in the original
implementation steers every generated position after the prompt. The larger dataset is intended to
reduce pair-specific noise and make the vector more robust across prompts and behaviors.[^actadd][^paper]

Both methods avoid gradient-based optimization and use an additive intervention. Neither implies that
all high-level concepts occupy one context-independent axis. A useful direction can be a local linear
control handle even when the underlying representation is distributed, nonlinear, or entangled with
other variables.

## Interpretability and causal claims

The CAA authors compared each behavior vector with normal token activations. Tokens in refusal
phrases, immediate-reward choices, and other semantically relevant spans often had dot products whose
sign matched the associated vector. Vectors from nearby layers were more similar than vectors from
distant layers, and a layer-13 vector retained steering effects when applied at several other layers.
Some base-model vectors also steered the chat model, especially in a middle-layer band.[^paper]

Successful steering is causal evidence that writing the vector can influence output. It is not by
itself evidence that the unmodified model normally computes the behavior by adding that vector, that
the direction is necessary, or that a high projection is a faithful report of a belief or intention.
Those stronger claims require interventions such as patching or ablation, controls for alternative
directions, and tests across prompts and checkpoints.[^paper]

CAA is therefore useful in [mechanistic interpretability](/mechanistic-interpretability/) both
as an intervention and as a hypothesis generator. A contrastive direction can identify candidate
tokens and layers to investigate, while failures and cross-behavior interference can reveal that the
chosen label is too broad.

## Limitations and safety

The original evidence is concentrated on two Llama 2 Chat sizes, seven curated behaviors, and one
multiple-choice extraction design. Results may change with architectures, chat templates, languages,
long contexts, tool use, quantization, or later post-training. A vector should be re-derived and
validated for the exact checkpoint rather than treated as a portable semantic embedding.[^paper]

Evaluation also depends on the contrast set and metric. GPT-4 ratings can be sensitive to rubric
wording and share biases with the systems being assessed. The MMLU test was a sampled two-choice
reformat, and the supervised and prompting baselines were not fully tuned. Reporting held-out
behavior, fluency, perplexity, unrelated capabilities, and human judgments provides stronger evidence
than a single steering score.[^paper]

Causal control is dual use. The same sign change that reduces sycophancy or hallucination can increase
it, and steering can elicit unsafe behavior or suppress refusal. A steered output does not become more
truthful merely because an “honesty” direction was used; the resulting claims still require ordinary
verification. The authors explicitly identify harmful, biased, or toxic steering as a misuse risk.[^paper]

## Relevance to return moe

[return moe](/return-moe/) develops AI characters and model-analysis tools. CAA is relevant as an
external technique for testing whether a proposed personality trait or safety behavior corresponds to
a controllable internal direction. It can inform experiments related to the
[Persona Selection Model](/persona-selection-model/), but steering a trait is not proof that a
complete persona has been found.

## References

[^paper]: Nina Rimsky et al., [Steering Llama 2 via Contrastive Activation Addition](https://aclanthology.org/2024.acl-long.828/), _Proceedings of ACL 2024_, pp. 15504–15522.

[^preprint]: [Steering Llama 2 via Contrastive Activation Addition](https://arxiv.org/abs/2312.06681), arXiv:2312.06681, first submitted December 9, 2023.

[^code]: [nrimsky/CAA](https://github.com/nrimsky/CAA), official code, processed datasets, vectors, and evaluation artifacts.

[^actadd]: Alexander Matt Turner et al., [Steering Language Models With Activation Engineering](https://arxiv.org/abs/2308.10248), introducing Activation Addition, arXiv:2308.10248.
