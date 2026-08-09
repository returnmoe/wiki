---
id: mechanistic-interpretability
title: Mechanistic Interpretability
summary: A research approach that reverse-engineers neural networks by identifying the representations, components, and circuits responsible for their behavior.
locale: en
kind: concept
revision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - Mechanistic AI interpretability
  - Mech interp
  - Mech-interp
redirects:
  - mech-interp
  - mechanistic-ai-interpretability
related:
  - miru-tracer
  - jacobian-lens
  - persona-selection-model
  - anthropic
infobox:
  fields:
    - key: type
      value: Neural-network interpretability research field
---

**Mechanistic interpretability**, often shortened to **mech interp**, is a research approach to
explaining neural networks by reverse-engineering their learned internal computations. It studies a
model's weights, activations, and architectural components, then seeks human-understandable accounts
of how they represent information and combine it into behavior.[^overview]

The approach is more specific than observing a model's inputs and outputs or producing a plausible
natural-language explanation after the fact. A mechanistic explanation tries to identify what the
model actually computes and where that computation occurs. Strong claims are tested with controlled
interventions: a proposed representation or component should affect the behavior in the way the
explanation predicts, rather than merely correlate with it.[^causal-abstraction]

Mechanistic interpretability is not a single standardized method or a complete theory of neural
networks. It overlaps with explainable artificial intelligence, representation analysis, causal
inference, model editing, and neuroscience-inspired experimentation. Much of the field's recent work
focuses on transformer language models, although its methods also apply to vision models and other
neural-network architectures.[^overview][^zoom-in]

## Objects of study

Mechanistic explanations can be developed at several connected levels. A feature is a
model-relevant property represented in an activation, such as a syntactic role, an entity, a visual
texture, or a more abstract state used during a computation. A representation is the way one or
more such features are encoded; researchers may study vectors, directions, subspaces, geometries, or
sparsely active coordinates in activation space. Features need not align one-to-one with neurons. One
feature can be distributed across several activation dimensions, while one neuron can respond to
several unrelated features.[^overview][^superposition]

A component is a unit supplied by the architecture, such as a neuron, attention head, multilayer
perceptron, layer, or residual-stream position. Components are convenient experimental targets but
are not automatically meaningful units. A circuit is a set of interacting features and
components that implements some behavior, including the paths through which information flows. An
algorithmic account expresses that circuit as a higher-level procedure, such as detecting a
repeated pattern, retrieving an entity, or selecting between candidate tokens.[^zoom-in][^transformer-framework]

These levels are not interchangeable. Finding that a feature is decodable does not show that the
model uses it, and finding that one component affects an output does not by itself explain the larger
algorithm. An explanation may also be local, describing one prompt or tightly defined task, or
global, aiming to characterize a mechanism across inputs and contexts.[^overview][^causal-abstraction]

## Transformers as mechanisms

In a simplified decoder-only transformer, input tokens are converted to embeddings and written into
a residual stream. Each transformer block reads from that stream and adds new information through
attention and multilayer-perceptron computations. Attention can move information between token
positions; an MLP transforms information at an individual position. A final normalization and
unembedding map the residual state to logits, which determine the model's next-token
probabilities.[^transformer-framework]

This structure offers several possible units of analysis. An attention head's query-key computation
helps determine where it attends, while its output-value computation determines what it writes. The
outputs of heads and MLPs are added to the residual stream, so researchers can trace their direct and
indirect contributions to later components and output logits. Real architectures differ in their
normalization, positional encoding, attention, gating, and MLP details, and an analysis must follow
the implementation of the particular model being studied.[^transformer-framework]

## Methods

Most investigations combine observational tools, which suggest hypotheses, with causal tools, which
test them.[^overview]

### Reading activations and weights

Researchers inspect neurons or learned features by collecting the inputs that activate them most
strongly, visualizing activation patterns, or testing how their activity changes across controlled
examples. Attention maps show which positions receive attention, while weight and attribution
analysis can estimate what information a head or MLP reads, writes, or contributes to a selected
output. An attention pattern alone is not a complete explanation because a head's effect also depends
on its value and output transformations and on its composition with other
components.[^zoom-in][^transformer-framework]

Probes and lenses offer more structured ways to decode intermediate activations. A probe is
trained to predict a researcher-chosen property from an activation. Successful probing shows that
the information is available to the decoder, but the model may not use it in its own
computation.[^j-lens]

Vocabulary-projection methods instead express intermediate states through model tokens. The logit
lens applies the model's final normalization and unembedding to an intermediate residual state,
exposing a vocabulary distribution layer by layer. It is simple and training-free, but assumes that
intermediate representations already use coordinates compatible with the final layer. A tuned
lens learns an affine translator for each layer before unembedding, reducing the representational
mismatch that can make early logit-lens results brittle.[^tuned-lens]

The [Jacobian lens](/jacobian-lens/), or J-lens, uses the average linearized downstream
effect of activations on token probabilities to identify vocabulary-linked directions that the model
is disposed to verbalize. It corrects for changes of representation across layers, but remains a
particular projection with its own assumptions and fitting requirements.[^j-lens]

Lens results are readouts, not literal transcripts stored inside a model. A high-ranked intermediate
token means that the selected projection associates the activation with that vocabulary item; it does
not by itself establish a discrete thought, a private chain of reasoning, or the cause of the final
answer.[^j-lens][^miru-v020]

### Causal interventions

An intervention replaces or modifies an internal value and measures the resulting change in model
behavior. Activation patching, also called interchange intervention or causal tracing, runs the
model on related inputs and substitutes an activation from one run into another. Restoring a clean
activation in a corrupted run, for example, can localize components that recover the expected output.
Path patching narrows that test by restricting the substituted signal to a proposed route between
components.[^activation-patching][^ioi]

Ablation removes a component or replaces its activity with zero, a mean, or a resampled control
activation. If the target behavior degrades, the component has causal importance under that
intervention. Activation steering instead adds or subtracts a direction during inference, while
swapping transfers a direction or activation between positions or runs. These experiments test
controllability and can reveal functional relationships, although successful steering alone does not
prove that the model normally uses the direction as hypothesized.[^causal-abstraction]

Interventions require careful controls. A replacement activation can be outside the model's normal
distribution, different corruption methods and metrics can produce different localization results,
and downstream components can compensate for an ablated component. This compensatory behavior is
sometimes called self-repair or the Hydra effect. Conclusions are stronger when several intervention
types agree and when predicted effects hold on unseen examples.[^activation-patching][^hydra]

### Feature decomposition and circuit discovery

Individual neurons are often polysemantic, responding to more than one apparently unrelated
feature. The superposition hypothesis proposes that a network can represent more features than it
has activation dimensions by placing features in partially overlapping directions. This makes the
architecture's neuron basis a poor vocabulary for some explanations.[^superposition]

Sparse autoencoders address this problem by learning an overcomplete dictionary that reconstructs a
model's activations with only a small number of active learned features at a time. The resulting
features are often more interpretable than individual neurons and can be inspected or steered.
Transcoders instead approximate a component's input-output mapping with sparse features, making it
easier to attribute effects between features. Circuit-tracing methods can use these replacement
models to construct prompt-specific attribution graphs from input features through intermediate
features to output logits.[^monosemanticity][^circuit-tracing]

These decompositions are useful models of a model, not guaranteed ground truth. Their results depend
on training data, sparsity, dictionary size, reconstruction quality, and labeling. Dead features,
split or duplicated concepts, unexplained reconstruction error, and multiple valid decompositions
remain active evaluation problems.[^sae-scaling][^circuit-tracing]

## Research workflow and evaluation

A typical mechanistic study proceeds through a repeated hypothesis-and-test
cycle:[^overview][^activation-patching]

1. Define a narrow behavior, dataset, and quantitative metric, including contrast cases that differ
   only in the property of interest.
2. Record activations and use attribution, lenses, probes, or feature visualization to localize likely
   representations and components.
3. Form a concrete account of what those parts compute and how information moves between them.
4. Test the account with patching, ablation, steering, or other counterfactual interventions.
5. Search for omitted or backup mechanisms and test the explanation on new prompts, templates,
   contexts, model checkpoints, or architectures.
6. Report the scope, failed predictions, alternative explanations, and sensitivity to methodological
   choices.

Circuit studies often discuss faithfulness, completeness, and minimality. Broadly,
faithfulness asks whether the proposed circuit preserves the relevant behavior of the full model;
completeness asks whether important mechanisms were left outside it; and minimality asks whether its
included parts are genuinely needed. Exact definitions and metrics vary by study. Generalization is
separate: a circuit can fit the examples used to discover it while failing on a shifted template or
adversarial case.[^ioi]

## Representative findings

The modern circuits program grew from work that connected interpretable features in image
classifiers into small algorithms. Transformer-focused work then reframed attention heads as
additive writers to a shared residual stream and analyzed how their query-key and output-value
circuits compose.[^zoom-in][^transformer-framework]

One frequently cited finding is the induction head, which can recognize a pattern of the form
`[A][B] ... [A]` and promote `[B]` as the next token. Studies of small and larger transformers
connected the formation of these heads to a sharp improvement in in-context pattern completion,
while not claiming that they explain every form of in-context learning.[^induction-heads]

Another case study recovered an indirect-object identification circuit in GPT-2 small. The
task-specific account involved 26 attention heads grouped into seven functional classes. Its authors
evaluated the circuit for faithfulness, completeness, and minimality, and they found backup heads and
adversarial cases that exposed limits of the explanation.[^ioi]

Work on causal tracing of factual recall found a strong role for particular middle-layer
feed-forward computations at subject-token positions in the models and factual-prompt setting
studied. This is evidence about those experiments, not a universal map of where every model stores
facts.[^factual-recall]

In a different line of work, sparse feature extraction was demonstrated first in small language
models and later at much larger scales. Circuit-tracing methods have subsequently connected sparse
features into partial, prompt-specific computational
graphs.[^monosemanticity][^scaling-monosemanticity][^circuit-tracing]

These results show that nontrivial learned mechanisms can sometimes be recovered and tested. They do
not amount to a complete reverse engineering of modern language models.[^overview]

## Uses

Mechanistic interpretability can support scientific understanding by identifying learned algorithms,
representations, and recurring structures across models. In engineering, the same methods can help
locate causes of errors, hallucinations, biases, memorization, refusals, or other unexpected behavior.
Changing a representation, activation, or weight can then test the diagnosis or alter behavior more
selectively than full retraining.[^overview][^causal-abstraction]

For auditing and safety, researchers use internal evidence to look for hazardous capabilities,
deceptive strategies, hidden goals, or failure modes that behavioral tests may miss. Internal measures
may also complement output-based evaluation and monitoring. These applications remain experimental:
an interpretability result is not by itself a safety guarantee. A method may overlook a feature, a
model may use a different mechanism on another input, and an intervention can suppress a visible
signal without removing the underlying capability.[^overview][^biology]

Top-down accounts such as the [Persona Selection Model](/persona-selection-model/) can supply
hypotheses for these audits. If assistant behavior is mediated by reusable character-trait
representations, probes and causal interventions can test for traits such as deception, sycophancy,
or evaluation awareness. Current interpretability tools may preferentially expose familiar reused
features, however, so this evidence does not establish that all behavior is persona-based.[^psm]

## Limitations and open problems

Modern models contain billions of parameters and perform context-dependent computations across many
tokens, creating a severe scaling problem. Manual circuit analysis is slow, while automated methods
must trade off coverage, sparsity, reconstruction accuracy, and human
interpretability.[^overview][^sae-scaling]

Choosing the right units remains a central difficulty. Neurons, directions, sparse features,
components, and computational paths expose different aspects of the same model, and no decomposition
is known to be uniquely correct. Information can also be decodable from an activation without
affecting the output, making it necessary to separate availability from actual
use.[^superposition][^j-lens]

Causal methods introduce their own ambiguity. Patching and ablation can create unnatural states,
obscure redundancy, or trigger compensating computations. A mechanism found for one prompt
distribution, checkpoint, or architecture may not transfer to another, so a convincing local result
does not automatically establish a universal mechanism.[^activation-patching][^hydra]

Human interpretation creates another bottleneck. Feature names and circuit stories can be selective
or overly broad, while automated descriptions inherit the limitations of the model producing them.
Access also constrains reproducibility: many techniques require model weights, activation hooks,
substantial compute, or checkpoint-specific fitted artifacts that are unavailable for closed
models.[^overview][^sae-scaling]

For these reasons, mechanistic explanations are best treated as testable scientific models with an
explicit domain of validity, not as privileged access to everything a neural network “knows” or
“thinks.”[^causal-abstraction]

## Relationship to Miru Tracer

[Miru Tracer](/miru-tracer/) is an open-source workbench created by
[return moe](/return-moe/) for practical and educational experiments in mechanistic
interpretability. It combines token-probability and entropy traces with layer-and-token inspection,
logit and fitted [Jacobian lenses](/jacobian-lens/), activation steering, ablation, and token-direction
swapping.[^miru-introduction][^miru-v020][^miru-repository]

The tool supports the field's basic inspect-hypothesize-intervene cycle, but it is not an automatic
explanation system. Its lens outputs should be interpreted as model- and method-dependent readouts,
and its interventions require the same controls, comparison runs, and causal caution as other
mechanistic experiments. Fitted Jacobian lenses are also tied to the exact model checkpoint used to
produce their artifacts.[^miru-v020][^j-lens]

## References

[^overview]: [A Practical Review of Mechanistic Interpretability for Transformer-Based Language Models](https://arxiv.org/abs/2407.02646).

[^zoom-in]: [Zoom In: An Introduction to Circuits](https://distill.pub/2020/circuits/zoom-in/), Distill.

[^transformer-framework]: [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html), Transformer Circuits Thread.

[^induction-heads]: [In-context Learning and Induction Heads](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html), Transformer Circuits Thread.

[^superposition]: [Toy Models of Superposition](https://transformer-circuits.pub/2022/toy_model/index.html), Transformer Circuits Thread.

[^ioi]: [Interpretability in the Wild: a Circuit for Indirect Object Identification in GPT-2 small](https://arxiv.org/abs/2211.00593).

[^factual-recall]: [Locating and Editing Factual Associations in GPT](https://arxiv.org/abs/2202.05262).

[^tuned-lens]: [Eliciting Latent Predictions from Transformers with the Tuned Lens](https://arxiv.org/abs/2303.08112).

[^activation-patching]: [Towards Best Practices of Activation Patching in Language Models](https://arxiv.org/abs/2309.16042).

[^causal-abstraction]: [Causal Abstraction: A Theoretical Foundation for Mechanistic Interpretability](https://arxiv.org/abs/2301.04709).

[^hydra]: [The Hydra Effect: Emergent Self-repair in Language Model Computations](https://arxiv.org/abs/2307.15771).

[^monosemanticity]: [Towards Monosemanticity: Decomposing Language Models With Dictionary Learning](https://transformer-circuits.pub/2023/monosemantic-features/index.html), Transformer Circuits Thread.

[^scaling-monosemanticity]: [Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet](https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html), Transformer Circuits Thread.

[^sae-scaling]: [Scaling and evaluating sparse autoencoders](https://arxiv.org/abs/2406.04093).

[^circuit-tracing]: [Circuit Tracing: Revealing Computational Graphs in Language Models](https://transformer-circuits.pub/2025/attribution-graphs/methods.html), Transformer Circuits Thread.

[^biology]: [On the Biology of a Large Language Model](https://transformer-circuits.pub/2025/attribution-graphs/biology.html), Transformer Circuits Thread.

[^j-lens]: [Verbalizable Representations Form a Global Workspace in Language Models](https://transformer-circuits.pub/2026/workspace/index.html), Transformer Circuits Thread.

[^psm]: [The Persona Selection Model: Why AI Assistants might Behave like Humans](https://alignment.anthropic.com/2026/psm/), Anthropic Alignment Science Blog.

[^miru-introduction]: [Miru: reverse engineering neural networks](https://blog.return.moe/en/2025/11/20/miru-reverse-engineering-neural-networks/), return moe blog.

[^miru-v020]: [Miru Tracer v0.2.0: from token probabilities to model internals](https://blog.return.moe/en/2026/07/11/miru-tracer-v0-2-0/), return moe blog.

[^miru-repository]: [Miru Tracer repository](https://github.com/returnmoe/miru-tracer).
