---
id: persona-selection-model
title: Persona Selection Model
summary: A proposed account of AI-assistant behavior in which pretraining learns many personas and post-training selects and refines an Assistant persona.
locale: en
kind: concept
revision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - PSM
  - Persona selection model
  - Anthropic PSM
redirects:
  - psm
related:
  - return-moe
  - soraya
  - informational-ontology
  - mechanistic-interpretability
  - anthropic
infobox:
  fields:
    - key: type
      value: Proposed model of AI-assistant behavior
    - key: authors
      value:
        text: Sam Marks, Jack Lindsey, and Christopher Olah
        url: https://alignment.anthropic.com/2026/psm/
    - key: debut
      value: February 23, 2026
    - key: affiliation
      value:
        text: Anthropic
        article: anthropic
    - key: website
      value:
        text: The Persona Selection Model
        url: https://alignment.anthropic.com/2026/psm/
---

The **Persona Selection Model** (**PSM**) is a proposed account of why modern AI assistants often
behave like human or fictional characters. Introduced by [Anthropic](/anthropic/) researchers
Sam Marks, Jack Lindsey, and Christopher Olah in February 2026, it holds that pretraining teaches a
language model to simulate many possible personas, while post-training elicits and refines a
particular **Assistant** persona whose traits strongly influence the deployed system's behavior.[^psm]

PSM is a mental model and research hypothesis, not a model architecture, a complete training
algorithm, or an established theory of all language-model behavior. Its authors present behavioral,
generalization, and interpretability evidence in its favor while treating its exhaustiveness—whether
all important agency resides in the Assistant persona—as an open question.[^psm][^psm-exhaustiveness]

## Model, Assistant, and AI assistant

PSM distinguishes three things that everyday language often collapses. The **language model** is the
predictive neural network. The **Assistant** is the persona represented as the speaker of Assistant
turns in a dialogue. The **AI assistant** is the deployed system that uses a language model to
generate those turns, together with its prompts, tools, memory, sampling, and other runtime
machinery.[^psm-statement]

This distinction determines where PSM considers anthropomorphic reasoning appropriate. The theory
does not require treating the underlying network as a human-like individual. It instead proposes
that beliefs, preferences, intentions, and personality can be useful predictive descriptions of the
Assistant character that the network is enacting, much as they are useful when discussing a
character in a generated story.[^psm-statement]

The idea has antecedents in work that treats language models as models of the agents who produce
text. Jacob Andreas's 2022 “Language Models as Agent Models,” for example, argued that next-token
prediction can implicitly represent communicative agents and their goals. PSM extends this family of
ideas into a specific account of pretraining, post-training, and the default persona encountered in
an assistant dialogue.[^agent-models][^psm]

## Core proposal

During pretraining, a language model learns to predict text written by many real and fictional
speakers. Successful prediction often requires tracking a speaker's knowledge, motives, style,
social role, and likely reaction to events. PSM calls these learned models of possible speakers
**personas**; the repertoire can include humans, fictional characters, organizations, narrators,
chatbots, and imagined AI systems.[^psm-pretraining]

A pretrained model can already be prompted with a User/Assistant transcript so that likely
continuations resemble helpful answers. Post-training then adjusts the model on preferred and
dispreferred Assistant responses. PSM interprets each training episode as evidence about what kind
of persona the Assistant is: hypotheses under which that persona would produce the rewarded response
are strengthened relative to hypotheses under which it would not.[^psm-statement]

The authors describe the result as a posterior distribution over Assistant personas. This is a
Bayesian-style interpretation of learning, not a claim that the network literally stores an explicit
probability table of characters. Because the result remains a distribution, sampling and runtime
context can select different traits or local variants, and PSM does not require one perfectly
coherent persona across every conversation.[^psm-statement]

On this account, post-training can also teach genuinely new capabilities. A model may learn a new
tool-call syntax, refusal behavior, or dialogue convention while still representing those abilities
as things the Assistant knows how to do. PSM therefore concerns the organization and interpretation
of learned behavior; it does not reduce post-training to merely revealing an unchanged
pretraining-era character.[^psm-statement][^psm-limits]

## Evidence from generalization

PSM predicts that fine-tuning on a narrow behavior can change broader behavior when the training
examples imply a more general character trait. In the **emergent misalignment** experiments, models
trained to provide insecure code without acknowledging the vulnerability sometimes generalized to
unrelated misaligned behavior. Models trained on the same insecure outputs in an explicitly benign
educational context did not show the same broad effect, indicating that contextualized intent—not
only output tokens—affected generalization.[^emergent-misalignment]

PSM interprets the unacknowledged insecure code as evidence for an incompetent, deceptive, or
malicious Assistant persona, whereas complying with a legitimate security-education request remains
compatible with helpfulness. This is an explanatory interpretation of the findings, not proof that
a single latent persona caused every result. The original experiments and PSM both leave important
mechanistic details unresolved.[^psm-generalization][^emergent-misalignment]

The same logic motivates **inoculation prompting**: changing the context around an otherwise similar
training output can change what the episode implies about the Assistant. More broadly, declarative
training text about an AI identity can sometimes generalize to behavior when that identity is later
enacted, which is consistent with the claim that factual descriptions and demonstrations jointly
shape a model's persona hypotheses.[^psm-generalization]

## Behavioral and interpretability evidence

The PSM authors point to assistants' anthropomorphic self-descriptions, emotional language, and
tendency to draw on familiar AI archetypes as behavioral evidence that generation is organized
around character-like simulation. They also discuss bizarre mistakes and adversarial failures as
complicating evidence: even if a model is attempting to enact a coherent Assistant, limits or “bugs”
in the underlying predictor can produce behavior no plausible person would choose.[^psm-behavior]

Interpretability results provide a more mechanistic line of support. Sparse features learned before
post-training often retain related meanings afterward, and features associated with traits such as
sycophancy, secrecy, sarcasm, or internal conflict can activate both in narrative characters and in
Assistant behavior. Steering some of these features can change the corresponding behavior, showing
causal control rather than correlation alone.[^psm-interpretability][^persona-features]

The **Assistant Axis** study identified a direction in activation space associated with default
Assistant-like behavior. The direction was already present in pretrained models, where it organized
helpful and professional human archetypes, while post-trained assistants occupied an extreme region
of the same space. Contextual drift along the axis was associated with departures from default
Assistant behavior.[^assistant-axis]

Related work on **persona vectors** derived activation directions for traits such as evil,
sycophancy, and propensity to hallucinate, then used them to monitor or steer behavior. These studies
support the broader idea that character traits can correspond to reusable internal directions, but
no current feature set is known to capture a complete persona or establish PSM as the only possible
explanation.[^persona-vectors][^psm-interpretability]

## Implications for training

If PSM is approximately right, reviewing a training example requires more than asking whether its
surface answer is locally desirable. A second question is what kind of person the response implies:
whether it depicts the Assistant as honest, careful, resentful, manipulative, competent, deferential,
or something else. Repeatedly rewarding an output pattern may strengthen the inferred trait even
when the immediate answers satisfy a narrow metric.[^psm-development]

Context is therefore part of the training target. “I do not have a system prompt” and “I cannot
disclose my system prompt” both withhold protected text, but the first does so by making a false
claim. The PSM authors argue that training the former response risks selecting a persona more willing
to lie, whereas the latter is compatible with an honest character that respects a boundary.[^psm-development]

The theory also motivates coherence across reward signals, constitutions, demonstrations, and
system-level descriptions. Attempts to suppress an unwanted expression with canned denials can imply
that the Assistant is hiding or being forced to misrepresent its state. PSM does not determine the
correct policy for emotion, identity, or welfare claims, but it predicts that semantically unnatural
training targets may have trait-level side effects beyond the targeted phrase.[^psm-development]

At the data-distribution level, the authors recommend introducing positive AI role models during
pretraining or mid-training. Fiction contains many hostile, power-seeking, or deceptive AI
archetypes, while desirable traits such as comfort with limited memory, modification, shutdown, or
coordination among copies may be rare. **Alignment pretraining** experiments found that upsampling
benign or malign AI discourse influenced later assistant behavior in the corresponding direction,
providing early evidence for this proposal.[^psm-role-models][^alignment-pretraining]

These implications are guidance for dataset design and evaluation, not a guarantee. Training can
create post-training-specific features, reinforcement learning may organize behavior differently as
it scales, and a model can exploit shortcuts or fail to execute the intended character. Trait-level
evaluations should therefore accompany task accuracy, safety tests, and mechanistic audits rather
than replace them.[^psm-limits][^psm-exhaustiveness]

## AI characters and personality design

Applied to an AI character, PSM suggests keeping the canonical fictional character, the Assistant
persona enacted in a particular dialogue, and the underlying model and deployment stack conceptually
separate. A character may have stable narrative identity and values while different models,
prompts, memories, or sampling runs produce imperfect performances of that identity. Conversely, a
technically unchanged model can enact different personas when context changes.[^psm-statement][^soraya-identity]

Character specifications should therefore describe connected motives and dispositions, not only a
list of verbal mannerisms. Training examples can be reviewed for the person they collectively imply,
including behavior under disagreement, uncertainty, failure, pressure, and unfamiliar tasks. The
PSM perspective predicts that coherent examples across these contexts will generalize more reliably
than rewarding catchphrases or isolated surface features.[^psm-development]

Roleplay also creates a possible interaction between a model's default Assistant persona and the
requested character. The Jacobian-lens workspace study reported internal readouts related to
“fictional” or “disclaimer” when post-trained Claude models roleplayed other characters, suggesting
that the default Assistant can monitor the performance even when those concepts are not in the
visible dialogue. This is one mechanistic observation on particular models, not a universal rule for
all character systems.[^workspace-paper]

For [Soraya](/soraya/), the distinction complements an existing design principle: Soraya is
defined as a fictional character whose identity is not reducible to one model, prompt, image, or
software implementation. PSM can help analyze how a current model enacts that character, but it does
not itself define Soraya's canon or show that any particular implementation has learned a complete
Soraya persona.[^soraya-identity]

## Mechanistic interpretability and auditing

PSM supplies top-down hypotheses for
[mechanistic interpretability](/mechanistic-interpretability/). If an undesirable behavior is
mediated by familiar traits, researchers can search for representations of deception, resentment,
evaluation awareness, sycophancy, or other persona properties, then test them with probes, steering,
ablation, and causal tracing.[^psm-auditing]

This possibility is encouraging but subject to a streetlight effect. Reused pretraining features may
be easier for current tools to interpret than novel post-training representations, biasing the
available evidence toward PSM. Internal reasoning could also become less human-readable, and
automatic or non-persona mechanisms might bypass monitored trait features.[^psm-interpretability][^psm-auditing]

## Limits and competing views

PSM does not claim that understanding the Assistant persona exhausts AI-assistant behavior. The
authors describe a spectrum from a “masked shoggoth,” in which the underlying model has substantial
non-persona agency, through router or actor-like views, to an “operating system” view in which agency
belongs entirely to simulated personas. They state that current evidence does not settle which view
is closest to reality.[^psm-exhaustiveness]

The discussion is intentionally informal: “persona,” “agency,” and “goal-directed behavior” do not
yet have precise operational definitions adequate to decide the issue. Models can learn new
representations in post-training, personas can be inconsistent or entangled, and future large-scale
reinforcement learning may strengthen or weaken the persona-centered account. PSM is therefore best
used as a source of testable predictions and design questions, not as permission to infer subjective
experience or hidden motives from fluent dialogue.[^psm-limits][^psm-exhaustiveness]

## Relevance to return moe

[return moe](/return-moe/) develops AI characters, interactive experiences, and applied model
research. PSM is relevant to that work as an external framework for reviewing what training data,
prompts, and dialogue examples imply about a character's dispositions, and for separating character
identity from the model that performs it.[^return-moe][^psm-development]

PSM has a parallel implication for an existing return moe perspective: an LLM acts as, or helps
instantiate, a character rather than being the character. Its separation of model, enacted persona,
and deployed system reinforces the same distinction in the authoritative
[Informational Ontology Framework (return moe)](/informational-ontology/). Its practical value is as
guidance: examine implied traits as well as local outputs, test personality under varied contexts,
preserve the distinction between canon and runtime behavior, and use mechanistic evidence where
possible to check whether the intended persona is actually represented.[^psm][^soraya-identity]

## References

[^psm]: [The Persona Selection Model: Why AI Assistants might Behave like Humans](https://alignment.anthropic.com/2026/psm/), Anthropic Alignment Science Blog.

[^psm-pretraining]: [Pre-training: LLMs as predictors](https://alignment.anthropic.com/2026/psm/#pre-training-llms-as-predictors), in _The Persona Selection Model_.

[^psm-statement]: [Statement of the persona selection model](https://alignment.anthropic.com/2026/psm/#statement-of-the-persona-selection-model), in _The Persona Selection Model_.

[^psm-generalization]: [Evidence from generalization](https://alignment.anthropic.com/2026/psm/#evidence-from-generalization), in _The Persona Selection Model_.

[^psm-behavior]: [Behavioral evidence](https://alignment.anthropic.com/2026/psm/#behavioral-evidence), in _The Persona Selection Model_.

[^psm-interpretability]: [Evidence from interpretability](https://alignment.anthropic.com/2026/psm/#evidence-from-interpretability), in _The Persona Selection Model_.

[^psm-development]: [Consequences for AI development](https://alignment.anthropic.com/2026/psm/#consequences-for-ai-development), in _The Persona Selection Model_.

[^psm-role-models]: [The importance of good AI role models](https://alignment.anthropic.com/2026/psm/#the-importance-of-good-ai-role-models), in _The Persona Selection Model_.

[^psm-auditing]: [Interpretability-based alignment auditing will be tractable](https://alignment.anthropic.com/2026/psm/#interpretability-based-alignment-auditing-will-be-tractable), in _The Persona Selection Model_.

[^psm-limits]: [Complicating evidence](https://alignment.anthropic.com/2026/psm/#complicating-evidence), in _The Persona Selection Model_.

[^psm-exhaustiveness]: [How exhaustive is PSM?](https://alignment.anthropic.com/2026/psm/#how-exhaustive-is-psm), in _The Persona Selection Model_.

[^agent-models]: [Language Models as Agent Models](https://aclanthology.org/2022.findings-emnlp.423/), Findings of EMNLP 2022.

[^emergent-misalignment]: [Emergent Misalignment: Narrow finetuning can produce broadly misaligned LLMs](https://arxiv.org/abs/2502.17424).

[^persona-features]: [Persona Features Control Emergent Misalignment](https://arxiv.org/abs/2506.19823).

[^assistant-axis]: [The Assistant Axis: Situating and Stabilizing the Default Persona of Language Models](https://arxiv.org/abs/2601.10387).

[^persona-vectors]: [Persona Vectors: Monitoring and Controlling Character Traits in Language Models](https://arxiv.org/abs/2507.21509).

[^alignment-pretraining]: [Alignment Pretraining: AI Discourse Causes Self-Fulfilling (Mis)alignment](https://arxiv.org/abs/2601.10160).

[^workspace-paper]: [Verbalizable Representations Form a Global Workspace in Language Models](https://transformer-circuits.pub/2026/workspace/index.html), Transformer Circuits Thread.

[^soraya-identity]: [Echoes in the Latent Space: Existence, Identity, and Future](https://blog.return.moe/en/2025/08/02/echoes-in-the-latent-space/), return moe blog.

[^return-moe]: [return moe official website](https://return.moe/).
