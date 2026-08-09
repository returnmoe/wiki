---
id: model-training
title: Model Training
summary: The process of optimizing a machine-learning model, from foundation-model pretraining through adaptation, preference learning, and distillation.
locale: en
kind: concept
revision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - AI model training
  - Foundation-model training
  - Language-model training
  - LLM training
redirects:
  - ai-model-training
  - llm-training
related:
  - mechanistic-interpretability
infobox:
  fields:
    - key: type
      value: Machine-learning optimization process
---

**Model training** is the process of adjusting a machine-learning model's parameters so that its
outputs better satisfy a chosen objective on data. In a neural network, training normally consists
of repeated forward passes, loss calculations, backpropagation, and optimizer updates. The result is
a set of learned **weights**: numerical parameters that encode statistical patterns useful for
prediction or generation.

For a modern foundation model, “training” is usually a pipeline rather than one run. A developer may
pretrain a base model on raw data, continue pretraining it on a domain, fine-tune it on demonstrations,
optimize it against preferences or rewards, and finally distill it into a smaller model. These stages
have different purposes and costs. Terms such as **SFT**, **DPO**, **LoRA**, and **QLoRA** are not
mutually exclusive alternatives: some describe the learning signal, while others describe which
parameters are stored or updated.

This article emphasizes transformer language models, where the terminology is most common, but the
same distinctions apply broadly to vision, audio, multimodal, and other neural models.

## A map of the terminology

Training methods can be classified along several independent axes:

| Question                                | Common choices                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------ |
| Where is the run in the lifecycle?      | Pretraining, continued pretraining, post-training, or distillation                   |
| What supplies the target signal?        | Raw-data prediction, demonstrations, preference pairs, a reward, or a teacher model  |
| Which parameters can change?            | All weights, selected existing weights, adapters, low-rank matrices, or soft prompts |
| How is the model represented in memory? | Full precision, mixed precision, or a quantized frozen backbone                      |

For example, **SFT with LoRA** uses demonstrations as the target signal and low-rank matrices as the
trainable parameters. **DPO with QLoRA** uses preference pairs as the target signal while keeping a
quantized backbone frozen and updating higher-precision low-rank adapters. “LoRA versus DPO” is
therefore a category error unless the real question is which complete training recipes to compare.

## How gradient-based training works

A typical training step has four parts:

1. A data loader converts examples into tensors and groups them into a **batch**. For a language
   model, a tokenizer first maps text into token IDs.
2. A **forward pass** computes the model's predictions. A **loss function** assigns a scalar penalty
   to the difference between those predictions and the training target.
3. **Backpropagation** computes the gradient of that loss with respect to each trainable parameter.
4. An **optimizer**, commonly a variant of stochastic gradient descent such as Adam, uses those
   gradients and its internal state to update the parameters.[^adam]

One update is a **step**. An **epoch** is one pass over a finite dataset, although token mixtures,
streaming corpora, resampling, and synthetic data make token counts or step counts more informative
than epochs in many foundation-model runs. A **learning-rate schedule** controls update size over
time. **Checkpoints** preserve weights and, when training is meant to resume exactly, optimizer,
scheduler, and random-number-generator state.

Training loss measures fit to sampled training data; it does not by itself measure usefulness.
Developers use separate validation data for choices such as stopping time and hyperparameters, and a
held-out test or evaluation suite for the final estimate. If evaluation examples leak into training,
the reported score may measure memorization instead of generalization. GPT-3's authors, for example,
documented benchmark overlap and a filtering bug that could not economically be corrected by
retraining.[^gpt3]

**Inference** uses learned weights without updating them. Ordinary prompting, few-shot examples in a
context window, tool use, and retrieval-augmented generation can change a model's immediate output
without training it. This distinction matters operationally: putting a document in a retrieval index
does not teach it to the model's weights, and a prompt does not create a new checkpoint.

## Pretraining from scratch

**Pretraining** gives a model broadly reusable capabilities before it is adapted to a particular
application. “From scratch” means starting with newly initialized weights and making foundational
choices such as the architecture, parameter count, tokenizer, context length, data mixture, and
objective.

Most language-model pretraining is **self-supervised**: targets are derived from the data rather than
written as labels by people. A causal or autoregressive model predicts each next token from previous
tokens, as in GPT-style models.[^gpt3] A masked language model predicts hidden tokens using context
on both sides, as in BERT.[^bert] Encoder-decoder models may reconstruct deliberately corrupted
spans, as studied in T5.[^t5] The objective shapes what the architecture can naturally do, but the
boundary is not absolute; a pretrained model can later be adapted to many other tasks.

Training from scratch provides the most control and avoids inheriting another checkpoint's unknown
data or restrictions. It is also the most demanding option. The team must acquire and govern a large
corpus, train a tokenizer, stabilize distributed optimization, perform scaling experiments, and
evaluate intermediate and final checkpoints. Larger is not automatically the best use of a fixed
budget: compute-optimal scaling experiments found that model size and training-token count should be
balanced rather than spending nearly all added compute on parameters. Those results are empirical
scaling guidance for the studied model family and range, not a universal law for every architecture
or deployment constraint.[^chinchilla]

The output of this stage is often called a **base model**. A base language model may complete text
well without reliably following conversational instructions, because next-token prediction on a
broad corpus is not the same objective as satisfying a user's request.

## Continued pretraining

**Continued pretraining** starts from an existing checkpoint and resumes a pretraining-style
objective on additional raw or lightly structured data. **CPT** is used for both “continued
pretraining” and “continual pretraining”; terminology varies. Closely related labels include:

- **Domain-adaptive pretraining** (DAPT), using material from a field such as medicine, law, or code.
- **Task-adaptive pretraining** (TAPT), using unlabeled text from the distribution around a later
  task.
- **Language adaptation**, adding substantially more data in a target language.
- **Continual pretraining**, periodically incorporating new data instead of rebuilding from scratch.

Experiments on RoBERTa found that domain- and task-adaptive pretraining improved downstream results
across several domains, including after broad initial pretraining.[^dapt] CPT can therefore be useful
when plentiful raw domain data exists but labeled instruction data is scarce. It usually changes all
or many backbone weights and can alter underlying representations more deeply than a small task
adapter.

CPT is cheaper than repeating all earlier pretraining, but it can still be a large full-model run.
It also creates a **plasticity–retention trade-off**: concentrating on a new distribution may improve
that distribution while degrading earlier capabilities. Learning-rate re-warming, replaying some
earlier data, and carefully mixing old and new distributions can mitigate forgetting. In experiments
up to a 10-billion-parameter model, re-warming, re-decaying, and data replay matched a retraining
baseline under the shifts studied while using only a fraction of its compute.[^continual-pretraining]

## Post-training and supervised fine-tuning

**Post-training** is an umbrella for the stages that turn a pretrained base model into a product- or
task-facing model. It can include supervised fine-tuning, preference optimization, reinforcement
learning, safety tuning, tool-use training, and combinations of them. Post-training commonly uses
far fewer examples than pretraining, but its labels and objectives have a disproportionate effect
on the behavior users see.

**Supervised fine-tuning** (**SFT**) trains a pretrained model on labeled input-output examples. For
an assistant, an example commonly contains an instruction or conversation followed by a desired
response. During **teacher forcing**, the model receives the correct preceding target tokens and is
optimized to predict the next target token. Implementations may mask the loss on user or prompt
tokens so that only assistant tokens supply targets.

**Instruction tuning** is SFT over many tasks expressed as natural-language instructions. Scaling
the diversity of tasks and including reasoning examples improved zero- and few-shot performance in
the FLAN experiments.[^flan] SFT can teach response format, tone, tool-call syntax, task procedure,
and how to expose capabilities already present in the base model. It can also specialize a model on
new labeled content, but a narrow demonstration set is not a dependable substitute for a current,
queryable knowledge store.

Data quality and coverage often matter more than raw example count. The LIMA study obtained strong
instruction-following behavior from 1,000 curated examples on a capable 65-billion-parameter base
model, supporting its authors' “superficial alignment” hypothesis in that experimental setting.
Required data volume varies with the base model, language, safety policy, and specialist
task.[^lima]

In **full fine-tuning**, every model weight is trainable. This gives the optimizer maximum freedom
and can be valuable for large distribution shifts or high-resource tasks. It also requires gradients
and optimizer state for the whole model, produces a full model checkpoint for each variant, and can
more readily disturb unrelated capabilities. Parameter-efficient methods trade some of that freedom
for much lower state and storage requirements.

## Parameter-efficient fine-tuning

**Parameter-efficient fine-tuning** (**PEFT**) freezes most pretrained weights and learns a small
task-specific parameter set. The category includes several designs:

- **Adapters** insert small trainable modules between frozen network components. Early transformer
  adapter experiments reached performance close to full fine-tuning on the tasks studied while
  adding a small parameter set per task.[^adapters]
- **Soft-prompt** and **prefix tuning** learn continuous vectors that condition a frozen model. They
  are optimized by gradients, unlike ordinary hand-written text prompts.[^prefix-tuning]
- Selective methods update only existing parameter subsets, such as biases or particular layers.
- **LoRA** represents weight changes with low-rank matrices.

PEFT is especially useful when one organization needs many variants of one base model. The shared
backbone can be stored once while each task, customer, or style uses a small adapter. The adapter is
normally tied to the exact base checkpoint and architecture on which it was trained.

### LoRA

**Low-Rank Adaptation** (**LoRA**) freezes a pretrained weight matrix `W` and learns its update as
the product of two much smaller matrices:[^lora]

```text
W_adapted = W + (alpha / r) BA
```

If `W` has input width `k` and output width `d`, then `A` and `B` use an intermediate rank `r` much
smaller than `k` or `d`. The hyperparameters include the rank, scale `alpha`, dropout, target modules,
and which layers receive adapters. More rank provides a larger update space but increases parameters
and memory.

LoRA greatly reduces trainable parameters, gradient storage, optimizer state, and per-variant
checkpoint size. Its original paper reported quality competitive with full fine-tuning on the models
and tasks tested, and the learned update can be merged into the base matrix so that it adds no
inference operation.[^lora] Keeping it unmerged instead allows adapters to be swapped, but serving
systems must then manage the base–adapter combination.

The percentage of trainable parameters is not the percentage of total training cost. A LoRA run
still executes the frozen backbone's forward pass and propagates gradients through its activations
to reach earlier adapters. It also still needs the backbone in memory. LoRA mainly removes
backbone-gradient and optimizer-state costs; actual speedups depend on batch size, sequence length,
target modules, kernels, and hardware. A low-rank update can also underperform full fine-tuning when
the needed change does not fit its restricted update space.

### QLoRA

**Quantized Low-Rank Adaptation** (**QLoRA**) stores the frozen backbone in a low-bit format and
backpropagates through it into higher-precision LoRA parameters. The original method used a 4-bit
NormalFloat format, double quantization of quantization constants, and paged optimizers to control
memory spikes. It demonstrated fine-tuning a 65-billion-parameter model on one 48 GB GPU while
preserving the full 16-bit fine-tuning task performance measured in that study.[^qlora]

QLoRA's primary benefit is memory capacity. Its wall-clock speed depends on on-the-fly dequantization
and kernel support, and the quantized training representation need not be the final serving
representation. The LoRA weights themselves are not simply “trained in 4 bits”; the frozen backbone
is quantized while adapter computation and updates use higher precision. As with LoRA, the result
depends on a compatible base checkpoint unless the update is merged and a new standalone checkpoint
is exported.

## Preference optimization and reinforcement learning

Demonstrations specify a target response, but many assistant qualities are easier to express as a
comparison: response A is more helpful, correct, safe, or stylistically appropriate than response B.
**Preference training** learns from these rankings. Human preferences are necessarily measurements
of the selected raters, rubric, prompts, and candidate outputs rather than a universal definition of
quality.

### RLHF and RLAIF

A widely used **reinforcement learning from human feedback** (**RLHF**) recipe has three stages:

1. Train an initial policy with SFT.
2. Ask people to rank candidate responses and train a **reward model** to predict those rankings.
3. Generate new responses and update the policy with a reinforcement-learning algorithm, often PPO,
   to raise predicted reward while penalizing excessive divergence from a reference policy.

The InstructGPT work used this SFT–reward-model–PPO pipeline and found that human evaluators on its
prompt distribution preferred its 1.3-billion-parameter aligned model to the 175-billion-parameter
base GPT-3 model. The same study observed regressions on some public NLP datasets and mixed
pretraining gradients into PPO as a mitigation.[^instructgpt]

RLHF is flexible and can learn from fresh on-policy samples, but it is operationally complex. A run
may involve policy, reference, reward, and value models; repeated generation; distributed inference;
and continuing human data collection. If the learned reward is an imperfect proxy, aggressive
optimization can exploit its mistakes. A divergence penalty and independent evaluations reduce but
do not eliminate this **reward hacking** or overoptimization risk.

**Reinforcement learning from AI feedback** (**RLAIF**) replaces some human rankings with judgments
from another model. Constitutional AI, for example, generated critiques and revisions from written
principles, then used model preferences as the reward signal in an RL phase.[^constitutional-ai]
This can scale feedback and make a rubric explicit, but it can reproduce the judge model's biases,
blind spots, and correlated errors. Human oversight has been reduced, not made unnecessary.

### DPO

**Direct Preference Optimization** (**DPO**) trains a policy directly on pairs of chosen and rejected
responses. Its loss increases the chosen response's likelihood relative to the rejected response and
to a fixed reference policy. The original derivation reparameterized the standard KL-constrained RLHF
objective so that no separate reward model or online reinforcement-learning loop was required.[^dpo]

DPO is simpler and usually cheaper to implement than PPO-based RLHF because it uses an offline
classification-style objective. It is not cost-free: training evaluates both responses, retains or
precomputes reference log-probabilities, and still requires a good preference dataset. It cannot
explore beyond the coverage of that dataset during the run, and its trade-off parameter, sampling
distribution, label noise, and response lengths can materially change the result.

### Verifiable and process rewards

For mathematics, code, games, and tool-using agents, a program or environment can sometimes verify
an outcome. Reinforcement learning with such rule-based rewards avoids subjective labeling for the
verifiable portion of the task and can generate many attempted trajectories.

**Group Relative Policy Optimization** (**GRPO**) is a PPO-related algorithm introduced in the
DeepSeekMath work. It samples a group of outputs for a prompt and estimates their relative
advantages from group rewards instead of training a separate critic model, reducing the memory
burden of PPO in that implementation.[^deepseekmath] It remains a rollout-based RL method: sampling
groups, executing verifiers or reward models, and retaining reference-policy computations can still
be expensive.

DeepSeek-R1 reported that large-scale RL with rule-based rewards elicited reasoning behavior, while
also finding that an RL-only precursor suffered readability and language-mixing problems that
motivated cold-start data and a multi-stage recipe.[^deepseek-r1]

**Outcome supervision** scores a final answer; **process supervision** scores intermediate steps.
On a subset of the MATH benchmark, a process-supervised reward model outperformed an
outcome-supervised one for selecting solutions, but required step-level labels. That study trained
verifiers and used them for selection rather than performing RL on the generator; it compared
verifier-based solution selection, not process-based and outcome-based policy
optimization.[^process-supervision]

## Knowledge distillation

**Knowledge distillation** trains a **student** model to imitate a **teacher** model. The student is
usually smaller or cheaper to serve. Instead of learning only from hard ground-truth labels, it may
learn from the teacher's probability distribution, logits, hidden representations, generated
sequences, explanations, or a mixture of teacher targets and original data. Softer probability
targets can convey which wrong answers the teacher considers similar, supplying more information
than a single class label.[^distillation]

In **white-box distillation**, training can access teacher logits or internal states. In **black-box
distillation**, the teacher may be an API that supplies only generated outputs; the resulting
response-imitation dataset can also look like ordinary SFT. Sequence-level distillation trains on
teacher-generated sequences, an approach originally studied for neural machine translation.[^sequence-distillation]

Distillation moves cost from repeated inference into an up-front teacher-generation and
student-training project. A successful student can reduce latency, memory, energy, and serving cost,
and may be specialized for a narrow task. The trade-off is a lower capacity ceiling and dependence
on the teacher's coverage. The student may inherit errors and biases, fail on behaviors absent from
the transfer set, or learn the teacher's surface style without its general competence. DistilBERT is
a concrete early example: its authors reported a model 40 percent smaller and 60 percent faster than
BERT while retaining 97 percent of the language-understanding performance measured in their
experiments.[^distilbert]

Distillation is distinct from **quantization**, which represents numbers with fewer bits, and
**pruning**, which removes weights or structures. A compression pipeline may combine all three and
then retrain the compressed model.

## Data and supervision

The dataset is part of the training specification, not interchangeable fuel. Its mixture determines
which languages, domains, styles, values, and errors are repeatedly rewarded. Important operations
include source selection, parsing, filtering, quality scoring, deduplication, decontamination,
balancing, tokenization, and documentation of provenance and permitted uses.

Duplicates waste compute, distort source weights, increase memorization, and can leak evaluation
examples. One large study found that deduplication reduced verbatim memorization and train–test
overlap while reaching comparable or better accuracy in fewer steps.[^deduplication] Personally
identifiable information, secrets, unsafe content, copyright restrictions, and data licenses create
separate governance questions that a low training loss cannot answer.

Human-written data is expensive and slow but can encode expert judgment unavailable in raw text.
Synthetic data can cheaply expand coverage: Self-Instruct, for example, generated and filtered
instructions and responses before using them for instruction tuning.[^self-instruct] Synthetic data
does not create an independent oracle. Its usefulness depends on teacher quality, diversity,
filtering, verification, and the amount of anchoring in reliable human or environmental signals.

## What training costs

There is no single “cost to train a model.” A credible estimate specifies the checkpoint, objective,
number of tokens or examples, sequence length, precision, hardware, utilization, number of trials,
and whether data work, evaluation, and labor are included.

### Compute

For a dense decoder-only transformer, a common rough estimate for one pretraining run is:

```text
training FLOPs ~= 6 x parameters x training tokens
```

The factor approximates a forward and backward pass through the main matrix multiplications. It can
misestimate attention, embeddings, output layers, sparsely activated models, and some small or
long-context configurations, so architecture-specific FLOP accounting is preferable.[^chinchilla][^deepseek-llm]

Under that rule, training a 7-billion-parameter dense model on 1 trillion tokens requires roughly
`4.2 x 10^22` floating-point operations before system overhead. Total accelerator-hours are
approximately total FLOPs divided by sustained FLOPs per accelerator and by 3,600; wall-clock time
then divides by the accelerator count. Peak hardware throughput is not sustained training
throughput. Communication, input stalls, checkpointing, activation recomputation, failures, and
underfilled batches all lower utilization.

Published runs illustrate the scale without defining a universal price. The final training run for
the 176-billion-parameter BLOOM model took 1,082,990 A100 GPU-hours over about 118 days and used
433,196 kWh. Those figures exclude much of the earlier experimentation and broader project labor.[^bloom-carbon]
At a hypothetical blended hardware rate of USD 3 per GPU-hour, the final-run device time alone would
correspond to about USD 3.25 million; that multiplication is an illustration, not BLOOM's reported
bill or a current market quote.

By contrast, the original QLoRA experiments included a 65-billion-parameter adaptation completed in
24 hours on one 48 GB GPU.[^qlora] These numbers are not directly comparable: one created a base
model from a vast corpus, while the other adapted an existing base on a much smaller dataset.

### Memory and systems

Full training must accommodate weights, gradients, optimizer states, and saved activations. Adam
normally keeps two moment estimates for every trainable parameter, so optimizer state can exceed
the weight memory itself. Mixed-precision training performs much arithmetic in a lower-precision
format while preserving selected values in higher precision for speed, capacity, and numerical
stability.[^mixed-precision]

When one accelerator cannot hold the run, distributed systems combine several strategies:

- **Data parallelism** gives devices different batches and synchronizes gradients.
- **Tensor parallelism** splits operations within a layer.
- **Pipeline parallelism** places different layers or blocks on different devices.
- **Sharding**, such as ZeRO, partitions optimizer states, gradients, and possibly parameters that
  would otherwise be replicated.[^zero]
- **Activation checkpointing** stores fewer intermediate activations and recomputes them during
  backpropagation, exchanging compute for memory.

These methods make larger runs possible but introduce network traffic, idle time, implementation
complexity, and new failure modes. Tensor, pipeline, and data parallelism have different
communication and utilization trade-offs; practical large-scale systems compose them.[^megatron]

PEFT removes much of the trainable-state burden but not the frozen backbone or all activations.
QLoRA reduces the backbone's memory representation further. Longer sequences can still dominate
activation memory, and changing batch size or gradient accumulation to fit memory changes
throughput and optimization behavior.

### Costs beyond the main run

The visible accelerator bill is only one part of a training program:

- Data acquisition, cleaning, licensing, storage, tokenization, and governance require compute and
  people.
- Expert demonstrations, preference rankings, and process labels can cost more than a short PEFT
  run.
- Pilot runs, failed runs, ablations, hyperparameter searches, safety tests, and regression
  evaluations may consume a substantial multiple of the final recipe.
- Distributed training adds networking, orchestration, checkpoint storage, and engineering work.
- Distillation pays for teacher inference and student training in exchange for lower future serving
  cost.
- Electricity use, cooling, hardware manufacture, and the energy mix affect environmental cost;
  model FLOPs alone do not determine emissions.[^bloom-carbon]

## Relative trade-offs

The following comparison assumes the same general model family. “Burden” is qualitative; dataset
size, sequence length, hardware, and implementation can reverse the ordering of two particular
runs.

| Method                   | Usual signal                              | Commonly updated weights              | Training burden                | Principal trade-off                                                          |
| ------------------------ | ----------------------------------------- | ------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| Pretraining from scratch | Raw-data prediction                       | Entire new model                      | Very high                      | Maximum control and broad capability for maximum data and systems cost       |
| CPT                      | Additional raw domain data                | Usually most or all backbone weights  | High                           | Deep adaptation without restarting, but retention can suffer                 |
| Full SFT                 | Demonstrations or labels                  | All weights                           | Medium                         | Maximum adaptation freedom, with high memory and one full variant per task   |
| LoRA SFT                 | Demonstrations or labels                  | Low-rank adapters                     | Low to medium                  | Small checkpoints and optimizer state, but a restricted update space         |
| QLoRA SFT                | Demonstrations or labels                  | Adapters over a quantized frozen base | Low device-memory requirement  | Makes larger bases fit, but may not maximize throughput                      |
| DPO                      | Chosen–rejected pairs                     | All weights or PEFT parameters        | Medium                         | Simple offline preference training, limited by pair coverage                 |
| PPO-based RLHF or RLAIF  | Learned reward plus generated rollouts    | Policy, with supporting models        | High and operationally complex | On-policy exploration and flexible rewards, with proxy and stability risks   |
| Distillation             | Teacher probabilities, states, or outputs | Student model                         | Medium to high up front        | Pays once to reduce deployment cost, usually losing some breadth or capacity |

Methods also differ in what they optimize. Pretraining mainly builds statistical capability;
instruction SFT shapes how that capability is requested and expressed; preference optimization
selects among plausible behaviors; and distillation transfers a chosen slice of behavior into a new
model. Later stages cannot reliably repair missing base capability merely by giving the model a new
tone or preference signal.

## Choosing a method

The appropriate intervention follows the problem:

| Goal                                                                     | Likely starting point                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------ |
| Build a new architecture, tokenizer, or broadly capable foundation model | Pretraining from scratch                               |
| Add a language, domain distribution, or large body of raw material       | CPT, followed by task-specific post-training if needed |
| Teach stable instructions, output schemas, style, or a bounded task      | SFT                                                    |
| Produce many inexpensive variants of one base model                      | LoRA or another PEFT method                            |
| Fit adaptation of a large model into limited accelerator memory          | QLoRA                                                  |
| Learn subjective rankings from an existing offline dataset               | DPO or another direct preference objective             |
| Optimize interactive behavior or generate new attempts against a reward  | RLHF, RLAIF, or verifiable-reward RL                   |
| Deploy a smaller, faster model at high request volume                    | Distillation, possibly with pruning and quantization   |
| Supply frequently changing facts, citations, or private documents        | Retrieval or tools before weight training              |

A production pipeline can combine several rows. A domain assistant might receive CPT on unlabeled
technical documents, SFT with QLoRA on expert demonstrations, DPO on preference pairs, and
retrieval for current facts. Each stage should be justified by an evaluation showing that the
cheaper preceding option was insufficient.

## Evaluation and failure modes

A training run is complete only when its effects and regressions are measured. Evaluation should
compare the new checkpoint with its base model and relevant non-training baselines, including a
strong prompt or retrieval system. Useful test groups include:

- held-out in-domain examples and realistically shifted inputs;
- general capabilities that should be retained;
- instruction following, formatting, and tool-use correctness;
- factuality, calibration, robustness, privacy, and relevant safety properties;
- latency, throughput, peak memory, checkpoint size, and total serving cost;
- slices by language, demographic group, source, task difficulty, and sequence length.

Common failure modes include overfitting a small dataset, catastrophic forgetting, reward hacking,
verbosity or style bias from preference data, benchmark contamination, memorization of private or
copyrighted material, numerical instability, and a training–serving mismatch. LoRA and QLoRA do
not prevent data leakage merely because few parameters change, and a falling preference loss does
not prove that human users will prefer the model on new prompts.

Reproducible reporting records the exact base checkpoint, data versions and mixture, tokenizer,
templates, objective, trainable modules, precision and quantization scheme, optimizer and schedule,
random seeds, hardware, token and example counts, stopping rule, and evaluation code. Without this
information, the name of a method—“LoRA,” “DPO,” or “CPT”—describes only a small part of what was
actually trained.

## References

[^adam]: [Adam: A Method for Stochastic Optimization](https://arxiv.org/abs/1412.6980).

[^gpt3]: [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165).

[^bert]: [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://arxiv.org/abs/1810.04805).

[^t5]: [Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer](https://arxiv.org/abs/1910.10683).

[^chinchilla]: [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556).

[^dapt]: [Don't Stop Pretraining: Adapt Language Models to Domains and Tasks](https://arxiv.org/abs/2004.10964).

[^continual-pretraining]: [Simple and Scalable Strategies to Continually Pre-train Large Language Models](https://arxiv.org/abs/2403.08763).

[^flan]: [Scaling Instruction-Finetuned Language Models](https://arxiv.org/abs/2210.11416).

[^lima]: [LIMA: Less Is More for Alignment](https://arxiv.org/abs/2305.11206).

[^adapters]: [Parameter-Efficient Transfer Learning for NLP](https://arxiv.org/abs/1902.00751).

[^prefix-tuning]: [Prefix-Tuning: Optimizing Continuous Prompts for Generation](https://arxiv.org/abs/2101.00190).

[^lora]: [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685).

[^qlora]: [QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314).

[^instructgpt]: [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155).

[^constitutional-ai]: [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073).

[^dpo]: [Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290).

[^deepseekmath]: [DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models](https://arxiv.org/abs/2402.03300).

[^deepseek-r1]: [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948).

[^process-supervision]: [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050).

[^distillation]: [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531).

[^sequence-distillation]: [Sequence-Level Knowledge Distillation](https://arxiv.org/abs/1606.07947).

[^distilbert]: [DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter](https://arxiv.org/abs/1910.01108).

[^deduplication]: [Deduplicating Training Data Makes Language Models Better](https://arxiv.org/abs/2107.06499).

[^self-instruct]: [Self-Instruct: Aligning Language Models with Self-Generated Instructions](https://arxiv.org/abs/2212.10560).

[^deepseek-llm]: [DeepSeek LLM: Scaling Open-Source Language Models with Longtermism](https://arxiv.org/abs/2401.02954).

[^bloom-carbon]: [Estimating the Carbon Footprint of BLOOM, a 176B Parameter Language Model](https://arxiv.org/abs/2211.02001).

[^mixed-precision]: [Mixed Precision Training](https://arxiv.org/abs/1710.03740).

[^zero]: [ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054).

[^megatron]: [Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM](https://arxiv.org/abs/2104.04473).
