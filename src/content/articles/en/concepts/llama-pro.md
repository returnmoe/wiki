---
id: llama-pro
title: LLaMA Pro
summary: A post-pretraining method and model family that adds identity-initialized Transformer blocks, then trains the added capacity on new domains.
locale: en
kind: concept
revision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - LLaMA Pro
  - LLaMA-Pro
  - Progressive LLaMA
  - Block expansion
redirects:
  - block-expansion
  - progressive-llama
related:
  - model-training
  - low-rank-adaptation
infobox:
  fields:
    - key: type
      value: Post-pretraining method and language-model family
    - key: authors
      value:
        - Chengyue Wu
        - Yukang Gan
        - Yixiao Ge
        - Zeyu Lu
        - Jiahao Wang
        - Ye Feng
        - Ying Shan
        - Ping Luo
    - key: debut
      value: January 4, 2024
    - key: affiliation
      value: University of Hong Kong; ARC Lab, Tencent PCG; Shanghai Jiao Tong University; Beijing Language and Culture University
    - key: website
      value:
        text: LLaMA Pro paper and artifacts
        url: https://github.com/TencentARC/LLaMA-Pro
---

**LLaMA Pro** is a post-pretraining method and family of language models introduced by Chengyue Wu
and colleagues in the 2024 paper _LLaMA Pro: Progressive LLaMA with Block Expansion_. The method
increases a pretrained transformer's depth with new blocks that initially implement the identity
function, freezes the inherited blocks, and trains only the added blocks on a new-domain corpus. Its
goal is to add domain capacity while mitigating the loss of general capabilities that can occur during
continued pretraining.[^paper][^preprint]

The paper's principal artifact, **LLaMA Pro-8.3B**, expands LLaMA 2 7B from 32 to 40 decoder blocks
and post-trains the eight new blocks on code and mathematics. A separately released **LLaMA
Pro-Instruct** checkpoint applies supervised instruction tuning afterward. These are external research
models developed by the paper's authors, principally at ARC Lab, Tencent PCG; they are not an official
Meta Llama release.[^paper][^model-card]

“LLaMA Pro” can therefore refer to three connected subjects: the block-expansion procedure, the
8.3-billion-parameter base checkpoint produced with it, or the small family of later experiments such
as LLaMA Pro-Instruct and Mistral-Pro. The method is not tied mathematically to LLaMA 2, although its
identity initialization depends on the details of the block being expanded.[^paper][^repository]

## Motivation

Continued pretraining on a specialized corpus can improve a model in that domain, but updating all of
its parameters may also move it away from the distribution on which its general capabilities were
learned. This problem is commonly described as **catastrophic forgetting**. Mixing old and new data,
reducing the learning rate, using parameter-efficient adapters, or regularizing changes can lessen the
trade-off, but each choice constrains training or requires access to a suitable general-domain
corpus.[^paper]

Block expansion takes a capacity-growth approach. Instead of rewriting the pretrained blocks, it
places trainable computation between them. At the instant of expansion the added computation changes
nothing, so the expanded network begins as the same function as the base model. During domain
post-training, gradients update only the added blocks. This protects the inherited weights from direct
modification while giving the new corpus full-size attention and feed-forward blocks in which to shape
new computations.[^paper]

Freezing the inherited weights does not guarantee that all old behavior remains unchanged. Once the
new blocks cease to be identities, their outputs alter the residual stream read by every later block.
“Mitigating forgetting” is consequently an empirical result to evaluate, not a mathematical guarantee
that general and domain knowledge occupy separate modules.

## Block expansion

A simplified pre-normalization LLaMA block applies attention and a feed-forward network through two
residual additions:[^paper]

```text
x_attention = x + Attention(RMSNorm(x))
y = x_attention + FFN(RMSNorm(x_attention))
```

For a new block to be an identity, both learned branches must initially write zero while the residual
path passes the input through. LLaMA Pro creates a block by copying an existing block, then setting the
attention output projection `W_O` and the feed-forward output projection `W_3` to zero:[^paper]

```text
Attention(RMSNorm(x)) = 0
FFN(RMSNorm(x_attention)) = 0
y = x
```

The other copied weights are retained. As the zeroed output matrices receive updates, nonzero signals
begin to flow and gradients can reach the rest of the new block. The paper contrasts this with setting
RMSNorm scale weights to zero: in the analyzed LLaMA block, that choice would also block gradients
needed to train the normalization path.[^paper]

The insertion pattern matters. In the LLaMA Pro-8.3B experiment, the 32 inherited blocks were divided
into eight groups of four. One identity-initialized copy was placed after each group, producing an
interleaved 40-block model rather than putting all eight blocks at the input or output end. The authors
argued that interleaving better preserves the transformer's progression from lower- to higher-level
representations, and their law-domain ablation favored the interleaved arrangement over prefix or
suffix stacking.[^paper]

## Training pipeline

The published LLaMA Pro run used the Python portion of Stack-dedup and the mathematics-focused
Proof-Pile-2 corpus. The authors report 80 billion post-training tokens, a sequence length of 4,096, a
batch size of 1,024, and 15,900 optimizer steps. Only roughly one billion parameters in the eight added
blocks were trainable. Training used 16 NVIDIA H800 GPUs for about seven days, reported as 2,830 GPU
hours.[^paper]

This produced the base LLaMA Pro-8.3B checkpoint, commonly rounded to **LLaMA-Pro-8B** in artifact
names. The instruction-tuned variant was then trained on approximately one million examples, or about
80 million tokens, assembled from five instruction sources. Unlike the block-expansion stage, this
supervised fine-tuning updated all blocks. The experiment therefore tests both whether an expanded
base model can enter an ordinary instruction-tuning pipeline and whether its domain gains survive that
pipeline.[^paper]

The repository also applies the procedure to Mistral 7B and provides training and evaluation code.
The source repository is Apache-2.0 licensed, while the released LLaMA Pro checkpoints are marked
with the Llama 2 license because they derive from LLaMA 2. Code and model weights therefore have
different licensing conditions.[^repository][^model-card]

## Reported results

On the paper's base-model evaluation, LLaMA Pro preserved results close to LLaMA 2 7B on the five
general-language benchmarks while improving the selected code and mathematics tasks. The comparison
also contains regressions—for example, HellaSwag and WinoGrande were slightly lower—so “preserved”
does not mean identical on every measure.[^paper]

| Model        |  MMLU | GSM8K | HumanEval pass@1 | MBPP pass@1 | Nine-task average |
| ------------ | ----: | ----: | ---------------: | ----------: | ----------------: |
| LLaMA 2 7B   | 46.87 | 14.48 |            13.05 |       20.09 |             39.62 |
| LLaMA Pro 8B | 47.88 | 17.89 |            28.66 |       33.20 |             44.23 |

The instruction-tuned model was compared with LLaMA 2 Chat, Code Llama Instruct, WizardCoder, and
WizardMath on the same table, and was also evaluated with MT-Bench and the tool-using MINT-Bench.
LLaMA Pro-Instruct recorded stronger combined code, math, and general-task averages than those listed
comparators. These numbers establish the result under the paper's data mixtures and evaluation setup;
they do not isolate block expansion from differences in post-training tokens, instruction data, prompt
formatting, or contemporaneous baselines.[^paper]

In a separate law-domain ablation, adding more blocks reduced training loss, but downstream gains did
not increase monotonically. Eight added blocks gave the authors' preferred performance-cost balance.
A rank-1,024 [LoRA](/low-rank-adaptation/) baseline better preserved the selected general tasks
but learned the new-domain distribution less effectively, while full fine-tuning caused a larger
general-task decline. Those results concern one unusually high-rank LoRA configuration and should not
be treated as a universal ordering of adaptation methods.[^paper]

## Relationship to other adaptation methods

Block expansion differs from ordinary continued pretraining because it freezes the original network
and increases depth. It differs from LoRA because it adds full transformer blocks rather than
low-rank updates inside selected matrices. Both reduce the number of trainable parameters relative to
full fine-tuning, but only block expansion increases the permanently active backbone and its inference
cost.[^paper]

It is also different from mixture-of-experts expansion. Every inserted LLaMA Pro block runs for every
token; there is no router selecting among domain experts. A model could in principle combine block
growth with adapters, routing, or later full fine-tuning, but those hybrids would have different
training and deployment properties.

The method is a form of function-preserving model growth only at initialization. After post-training,
the added blocks cannot generally be removed without losing their contribution, and the checkpoint is
not a small portable adapter. Serving it requires the deeper architecture and all of its weights.

## Limitations

The paper's main study covers English, Python code, and mathematical text, with a smaller experiment
on legal text. It does not establish the same balance for multilingual, multimodal, much larger, or
architecturally different models. The authors explicitly identify language and domain coverage as
scope limitations.[^paper]

Expansion saves backward-pass and optimizer-state cost by freezing most parameters, but forward
passes still traverse both frozen and trainable blocks during training. At inference, all 40 blocks
run, increasing memory use, latency, and compute relative to LLaMA 2 7B. The approach therefore trades
deployment cost for added domain capacity rather than producing a free specialization.[^paper]

Identity initialization also has architecture-specific details. Which projections must be zeroed,
whether biases exist, how normalization is placed, and how blocks should be copied can differ across
model families. A mechanically inserted block that is not an exact identity can perturb the model
before training, while an initialization that blocks the wrong gradient paths may fail to learn.

Finally, benchmark preservation is not a complete test for forgetting. A model can retain aggregate
accuracy while changing calibration, generation style, long-context behavior, safety, or performance
on examples outside the selected suite. Comparisons should include held-out general data, domain data,
and deployment-relevant behavior at matched compute.

## Relevance to return moe

[return moe](/return-moe/) works with language-model training and AI character systems. LLaMA
Pro is relevant as an external example of adding domain capacity without directly updating an entire
pretrained backbone, and as a reminder that training efficiency and inference efficiency are separate
design questions.

## References

[^paper]: Chengyue Wu et al., [LLaMA Pro: Progressive LLaMA with Block Expansion](https://aclanthology.org/2024.acl-long.352/), _Proceedings of ACL 2024_, pp. 6518–6537.

[^preprint]: [LLaMA Pro submission history and abstract](https://arxiv.org/abs/2401.02415), arXiv:2401.02415.

[^repository]: [TencentARC/LLaMA-Pro](https://github.com/TencentARC/LLaMA-Pro), official code and artifact repository.

[^model-card]: [LLaMA-Pro-8B model card](https://huggingface.co/TencentARC/LLaMA-Pro-8B), ARC Lab, Tencent PCG.
