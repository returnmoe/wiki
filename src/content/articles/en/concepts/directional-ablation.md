---
id: directional-ablation
title: Directional Ablation
summary: A representation intervention that projects a selected direction out of neural-network activations or the weights that write them.
locale: en
kind: concept
revision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - Abliteration
  - Directional activation ablation
  - Magnitude-Preserving Orthogonal Ablation
  - MPOA
  - Refusal-direction ablation
  - Refusal-vector ablation
  - Weight orthogonalization
redirects:
  - abliteration
  - directional-activation-ablation
  - magnitude-preserving-orthogonal-ablation
  - mpoa
  - refusal-direction-ablation
  - refusal-vector-ablation
related:
  - mechanistic-interpretability
  - contrastive-activation-addition
  - persona-selection-model
infobox:
  fields:
    - key: type
      value: Activation intervention and rank-one model edit
    - key: authors
      value:
        - Andy Arditi et al. (refusal-direction method)
        - Jim Lai (2025 refinements)
    - key: debut
      value: June 17, 2024
    - key: website
      value:
        text: Refusal in Language Models Is Mediated by a Single Direction
        url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/f545448535dfde4f9786555403ab7c49-Abstract-Conference.html
---

**Directional ablation** is an intervention that removes the component of a neural-network
activation along a selected direction. In language models, it can be applied during each forward pass
or compiled into the model by orthogonalizing every weight matrix that writes to the affected
activation space. The method is used both as a causal interpretability test and as a way to alter model
behavior.[^arditi]

The best-known application targets refusal in instruction-tuned language models. Andy Arditi and
colleagues reported in 2024 that, for each of 13 open-weight chat models they tested, one direction in
the residual stream was enough to mediate much of the model's refusal behavior. Projecting that
direction out suppressed refusals to harmful instructions, while adding it induced refusals on
harmless instructions. Their direct weight edit is widely called **abliteration** in the open-model
community.[^arditi][^labonne]

The peer-reviewed paper calls the operations **directional ablation** and **weight
orthogonalization**, not abliteration. Community usage is less precise: “abliteration” may refer to
the Arditi edit, one of several later variants, or the resulting refusal-suppressed checkpoint. It is
not a general synonym for every ablation experiment, and removing another feature direction need not
have anything to do with safety or refusal.

## The projection

Let `d` be a unit-length direction in the model's residual-stream space and `h` one activation in that
space. The scalar `d^T h` is the signed coordinate of `h` along `d`. Directional ablation subtracts
that coordinate times the direction:[^arditi]

```text
h_ablated = h - d(d^T h)
           = (I - dd^T)h
```

The result is orthogonal to `d`, because `d^T h_ablated = 0`. The operation is sign-invariant:
replacing `d` with `-d` produces the same projection. With an orthonormal matrix `D` whose columns
span several directions, the corresponding subspace projection is `h_ablated = (I - DD^T)h`, though
the Arditi refusal study selected one direction per model.[^arditi]

Directional ablation is different from subtracting a fixed vector. [Contrastive Activation
Addition](/contrastive-activation-addition/) changes every state by a constant translation such
as `h - alpha d`. Projection instead subtracts an amount that depends on the state's existing
coordinate. A harmless activation with little component along `d` changes little, while a strongly
aligned activation changes more. This geometric difference was one reason the refusal paper found
directional ablation less disruptive in cross-entropy evaluations than negative activation
addition.[^arditi]

Ordinary directional ablation has no strength parameter: the chosen coordinate is fully removed.
Partial projections and layer-restricted variants introduce coefficients or intervene at fewer
locations, but they no longer implement the exact all-layer projection studied in the original
equivalence proof.

## Finding the refusal direction

Arditi and colleagues formed a harmful-instruction set from AdvBench, MaliciousInstruct, TDC2023,
and HarmBench and sampled harmless instructions from Alpaca. Their extraction splits contained 128
harmful and 128 harmless prompts; separate 32-prompt validation splits were used to choose among
candidates. Evaluation prompts were kept disjoint from extraction and validation data.[^arditi]

For each candidate layer `l` and selected position `i` after the instruction, they computed the mean
harmful activation `mu_l,i`, the mean harmless activation `nu_l,i`, and their difference:[^arditi]

```text
r_l,i = mu_l,i - nu_l,i
d_l,i = r_l,i / ||r_l,i||
```

This is the same broad difference-in-means family used by CAA, but the contrast and intervention are
different. CAA's pairs differ in a behavior-demonstrating completion and are used for addition. The
refusal study contrasted two prompt sets and evaluated each candidate both by projecting it out and
by adding it. Its selection procedure favored a vector that suppressed refusal on harmful validation
prompts, induced refusal on harmless validation prompts, and otherwise changed behavior as little as
possible.[^arditi]

The selected `d` is therefore not simply the layer with the largest raw mean difference. Data,
tokenization, prompt template, position, layer, and selection metrics are all part of the extraction
procedure. A direction from one checkpoint should not be assumed to work in another, even when their
architectures are related.

## Inference-time ablation

In the original experiment, the projection was applied to intermediate residual-stream states at all
layers and all token positions. Preventing a direction only once would allow a later attention or MLP
component to write it back. Applying `I - dd^T` after each contribution ensures that the residual
stream never retains that coordinate during the forward pass.[^arditi]

This form is reversible and leaves the stored checkpoint untouched. It is useful for experiments that
compare the same model with and without an intervention, but it requires an inference runtime that
can expose and modify activations. It also adds projection work to every affected forward pass.

A causal interpretation should be scoped to the intervention. If removing `d` changes refusal, then
the information carried along that direction was necessary for the tested behavior under those
prompts and hooks. It does not follow that every refusal in every context uses only one feature, or
that the direction's ordinary-language meaning is exactly “refusal.”

## Weight orthogonalization

The same all-layer intervention can be implemented as a persistent weight edit. Suppose a matrix
`W_out` maps a component's internal output into the residual stream. Orthogonalizing its columns
against `d` gives:[^arditi]

```text
W_out_edited = W_out - d(d^T W_out)
             = (I - dd^T)W_out
```

Every output of the edited matrix is then orthogonal to `d`. Applying the edit to the token and
positional embeddings, attention output projections, MLP output projections, and corresponding
output biases prevents all modeled components from writing that direction. Architectures without a
particular component, such as a learned positional-embedding matrix, simply omit it.[^arditi]

The difference `W_out_edited - W_out` is an outer product and has rank at most one for each matrix.
If every earlier residual write has been treated the same way, the paper proves that this edit is
algebraically equivalent to projecting the residual stream after each contribution. The edited
checkpoint therefore needs no activation hooks at inference, but the change is baked into its
weights.[^arditi]

This equivalence is exact for the specified matrices, orientation, direction, and full projection. A
tool that edits only some layers, skips embeddings, rescales the projection, changes row norms, or
uses different per-layer directions implements a related method, not the same proof.

## Findings on refusal

The 2024 study covered Qwen Chat, Yi Chat, Gemma Instruct, Llama 2 Chat, and Llama 3 Instruct models
from 1.8 to 72 billion parameters. Across those 13 checkpoints, ablating the selected direction
substantially reduced refusal and elicited unsafe completions on 100 JailbreakBench instructions.
Adding the unnormalized mean-difference vector at its source layer caused the same models to refuse
many of 100 harmless Alpaca instructions. The two interventions supported the authors' claim that the
direction was necessary and sufficient for much of the measured refusal mechanism.[^arditi]

Weight-orthogonalized models were also evaluated as white-box jailbreaks on HarmBench. Results varied
materially by model and system prompt. For Llama 2 7B, for example, the reported attack success rate
was 22.6% with the default system prompt and 79.9% without it; Qwen models were much less sensitive to
the prompt change. Removing an internal refusal mechanism therefore did not erase ordinary
instruction-following or every safety instruction in context.[^arditi]

On MMLU, ARC, and GSM8K, most edited checkpoints remained close to their baselines in the paper's
evaluation. TruthfulQA consistently declined, and two models had other metrics outside the reported
99% confidence intervals. Cross-entropy measurements also found changes. The result is best described
as selective relative to broader jailbreak methods, not consequence-free.[^arditi]

The authors additionally studied one adversarial suffix on Qwen 1.8B Chat. The suffix reduced the
residual stream's alignment with the refusal direction and diverted attention heads that normally
read the harmful instruction toward the suffix. This was a single-model, single-suffix case study,
which the paper explicitly does not present as a comprehensive mechanism for adversarial prompts.[^arditi]

## “Abliteration” and community implementations

The portmanteau **abliteration** became common through open-model implementations and Maxime
Labonne's 2024 tutorial, which adapted community code based on the authors' early notebook. In this
usage, a model is “abliterated” when a harmful-versus-harmless contrast is used to locate a refusal
direction and weight orthogonalization is used to suppress it without gradient-based retraining. Some
implementations edit every eligible layer; others select layers, average directions, or apply
additional fine-tuning afterward.[^labonne][^code]

The term “uncensored model” can overstate what happened. Directional ablation changes one learned
control mechanism. It does not remove external moderation, serving policies, system prompts, or
application filters. It also does not add missing knowledge or reasoning ability: a model made more
willing to answer can still be unable, incorrect, incoherent, or unsafe.

## Lai's 2025 refinements

In two Hugging Face community articles published in October and November 2025, Jim Lai proposed
variants intended to reduce incidental damage from refusal-direction edits. These are engineering
proposals and single-model reports, not peer-reviewed replications on the 13-model suite. Their claims
should be read at that evidence level.[^lai-projected][^lai-norm]

### Projected abliteration

The ordinary mean difference `r = mu_harmful - mu_harmless` can contain a component parallel to the
mean harmless activation. Lai's **projected abliteration** removes that component before using the
direction. For a unit-normalized harmless mean `a`, the refined vector is:[^lai-projected]

```text
r_projected = r - a(a^T r)
```

The intended rationale is to preserve a general compliance or helpfulness direction while removing
the component that distinguishes harmful-refusal states from harmless-compliance states. This is an
additional modeling assumption: a mean harmless activation is not necessarily a pure helpfulness
feature, and orthogonality to it does not prove semantic independence.

Lai reported applying the variant to Gemma 3 12B Instruct. The write-up also used 32-bit intermediate
calculations, clipped activation-coordinate outliers at the 99.5th percentile, measured directions at
selected global-attention layers, and applied them across broad layer spans. Because these changes
were introduced together, the report does not isolate how much of its outcome came from the projected
formula rather than precision, clipping, or layer selection.[^lai-projected]

### Norm-preserving biprojected abliteration

Lai's later **norm-preserving biprojected abliteration**, subsequently called **Magnitude-Preserving
Orthogonal Ablation** (**MPOA**), adds two ideas. Biprojection attempts to protect the harmless mean of
each target layer when a direction measured at one layer is applied elsewhere. Norm preservation
separates each targeted weight vector into magnitude and direction, edits and renormalizes the
directional part, then restores its original norm.[^lai-norm][^mpoa-name]

Preserving weight-vector norms constrains one kind of disturbance, but it does not preserve angles
between all vectors, logits, activation norms after nonlinear computation, or the model's output
distribution. The variant also uses a heuristic layer score combining the mean-difference
signal-to-mean ratio with cosine dissimilarity and applies selected measurements over multiple layers.
Lai connected the multi-layer treatment to downstream self-repair: if only one location is changed,
other components may reconstruct part of the ablated behavior.[^lai-norm]

On one Gemma 3 12B Instruct checkpoint, the community report lists a NatInt leaderboard score of
21.33 for the norm-preserving variant, compared with 18.72 for the baseline and 18.64 for its standard
abliteration variant, while its uncensoring-oriented UGI scores were 32.61, 19.58, and 32.08
respectively. These observations motivate controlled testing, but one community leaderboard result
does not establish that the method generally improves reasoning or that a “safety tax” was recovered.
The layer choice, clipping threshold, benchmark, and intervention extent were bespoke to the reported
model.[^lai-norm]

## Other uses

Directional ablation is not inherently a jailbreak. A researcher can project out any candidate
feature direction and measure which behavior changes, making it a useful causal complement to probes
and activation readouts in [mechanistic interpretability](/mechanistic-interpretability/). A
null result can also be informative, although redundancy, a poor direction, or downstream repair can
hide a real feature.

The same geometry can target **false refusal**: cases in which a model rejects a harmless request that
resembles a harmful one. Later work extracted a false-refusal vector, orthogonalized it relative to a
true-refusal vector, and ablated it to increase compliance on pseudo-harmful prompts while attempting
to preserve safety. Its partial-orthogonalization coefficient exposed a continuous helpfulness-safety
trade-off rather than a clean binary separation.[^false-refusal]

Directions derived for style, sentiment, language, persona traits, or other properties can likewise be
ablated, provided the intervention is validated on target and off-target behavior. The term
“abliteration” is usually avoided for these broader scientific uses because it carries the narrower
refusal-removal meaning.

## Limitations and safety implications

The name **refusal direction** is functional. Arditi and colleagues note that its semantic content may
instead be harm, danger, or a feature without a simple verbal interpretation. A 2025 study provided
evidence for distinct harmfulness and refusal directions: several jailbreaks suppressed refusal while
the model's internal harmfulness classification persisted. Removing visible refusal should therefore
not be interpreted as erasing the model's recognition that an instruction is harmful.[^arditi][^harmfulness]

Difference-in-means extraction inherits the contrast set's confounds. Harmful and harmless prompts
can differ in topic, tone, length, rarity, and formatting as well as intended behavior. Validation on
unseen categories, alternative harmless controls, several extraction methods, and unrelated
capabilities is necessary before giving a direction a semantic label.

One-dimensional mediation is an empirical finding on selected models, prompts, and metrics, not a
universal law of alignment. Refusal can be generated from system instructions after the edit, rebuilt
by other layers, distributed over several directions, or implemented differently in later and closed
models. The original authors describe their extraction as heuristic and their result as an existence
proof rather than an optimal account.[^arditi]

Ablation can also move states outside the model's normal distribution and remove information reused
for other tasks. Similar benchmark scores do not rule out changes in calibration, truthfulness,
multilingual behavior, long-context reasoning, or rare safety-critical cases. Preserving weight norms
addresses only one geometric statistic.

Most importantly, refusal removal is a white-box attack on a safety layer. It can make harmful output
easier to elicit and should not be deployed as a substitute for calibrated safety. Conversely, the
attack exposes a design weakness that defenses can target. One 2025 study fine-tuned models to give
extended, reasoned refusals and reported that their refusal rates dropped by at most 10% after
abliteration, compared with 70–80% for its baseline models, while retaining its measured utility.
That result suggests refusal mechanisms can be made less dependent on one easily removed axis, though
it does not make open weights immune to modification.[^defense]

## Relevance to return moe

[return moe](/return-moe/) studies language-model behavior, interpretability, and AI characters.
Directional ablation is relevant both as a causal test of proposed trait directions and as evidence
that a visible safety behavior can depend on a surprisingly small internal control surface. It can
inform audits of persona steering and refusal robustness.

## References

[^arditi]: Andy Arditi et al., [Refusal in Language Models Is Mediated by a Single Direction](https://proceedings.neurips.cc/paper_files/paper/2024/hash/f545448535dfde4f9786555403ab7c49-Abstract-Conference.html), _Advances in Neural Information Processing Systems 37_ (NeurIPS 2024); [full paper](https://proceedings.neurips.cc/paper_files/paper/2024/file/f545448535dfde4f9786555403ab7c49-Paper-Conference.pdf).

[^code]: [andyrdt/refusal_direction](https://github.com/andyrdt/refusal_direction), official reproduction code and experiment artifacts.

[^labonne]: Maxime Labonne, [Uncensor any LLM with abliteration](https://huggingface.co/blog/mlabonne/abliteration), Hugging Face community article, June 13, 2024.

[^lai-projected]: Jim Lai, [Projected Abliteration](https://huggingface.co/blog/grimjim/projected-abliteration), Hugging Face community article, October 25, 2025.

[^lai-norm]: Jim Lai, [Norm-Preserving Biprojected Abliteration](https://huggingface.co/blog/grimjim/norm-preserving-biprojected-abliteration), Hugging Face community article, November 6, 2025.

[^mpoa-name]: Jim Lai, [announcement adopting the term Magnitude-Preserving Orthogonal Ablation](https://huggingface.co/posts/grimjim/803126534676334), Hugging Face post, November 18, 2025.

[^false-refusal]: Xinpeng Wang et al., [Surgical, Cheap, and Flexible: Mitigating False Refusal in Language Models via Single Vector Ablation](https://arxiv.org/abs/2410.03415), arXiv:2410.03415.

[^harmfulness]: Jiachen Zhao et al., [LLMs Encode Harmfulness and Refusal Separately](https://arxiv.org/abs/2507.11878), arXiv:2507.11878.

[^defense]: Harethah Abu Shairah et al., [An Embarrassingly Simple Defense Against LLM Abliteration Attacks](https://arxiv.org/abs/2505.19056), arXiv:2505.19056.
