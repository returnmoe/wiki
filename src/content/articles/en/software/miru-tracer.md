---
id: miru-tracer
title: Miru Tracer
summary: An open-source application for following token generation, reading intermediate model states, and testing activation interventions.
locale: en
kind: software
revision: 1
categories:
  - software
  - projects
  - research
  - artificial-intelligence
aliases:
  - Miru
  - Miru initiative
  - Miru token tracer
redirects:
  - miru
  - miru-tracer-v0-2-0
related:
  - return-moe
  - mechanistic-interpretability
  - jacobian-lens
infobox:
  fields:
    - key: developer
      value:
        text: return moe
        article: return-moe
    - key: initial_release
      value: 20 November 2025
    - key: latest_release
      value: v0.3.3 (27 July 2026)
    - key: platform
      value: Gradio web application
    - key: technologies
      value:
        - Python
        - PyTorch
        - Hugging Face Transformers
    - key: repository
      value:
        text: github.com/returnmoe/miru-tracer
        url: https://github.com/returnmoe/miru-tracer
    - key: license
      value: Unlicense, with separately licensed vendored code
    - key: status
      value: Active
---

**Miru Tracer** is an open-source application developed by [return moe](/return-moe/) for
examining language-model generation. Its Gradio interface lets users follow probability
distributions one token at a time, read intermediate model states through logit and [Jacobian
lenses](/jacobian-lens/), and apply activation interventions while a model is
running.[^introduction][^v02][^repository]

## History

return moe announced **Miru** in November 2025 as an initiative in [mechanistic
interpretability](/mechanistic-interpretability/). Its name comes from the Japanese verb 見る
(_miru_), “to see” or “to observe.” Miru Tracer was the initiative's first project and remains the
only released tool to use the name.[^introduction]

The original version concentrated on the model's output. It displayed the probability and entropy
of possible next tokens and let the user replace the model's choice before generation
continued.[^introduction]

return moe published the official v0.2 release on 16 July 2026. By then, fixes made during
development had brought the version number to v0.2.4, although the announcement presented it as the
v0.2 release. The update extended Miru Tracer from next-token analysis to the inspection and
modification of intermediate activations.[^v02]

The v0.3 series began on 26 July 2026 and reached v0.3.3 on 27 July. Version 0.3.0 aligned displayed
token positions with the residual states actually being decoded, reduced the frequency and memory
cost of lens-fitting checkpoints, added detailed diagnostics for long fitting runs, and began
checking fitted-lens provenance against the loaded model. Three patch releases refined those
checks, corrected the display of very small lens probabilities, and fixed a false architecture
fingerprint mismatch for composite Qwen3.5 and Qwen3.6 configurations. These changes did not
require existing Jacobian matrices to be refitted.[^v03]

## Reading and changing model states

The logit lens passes an intermediate residual state through the model's final normalization and
output layers. It needs no separate fitting and is generally easiest to read near the end of the
network. Earlier layers use representations that may not yet resemble the final output space, so
their logit-lens results can be difficult to interpret.[^v02]

The Jacobian lens estimates how changes at an earlier layer affect the final residual state. It can
produce more legible readouts in the middle of a model, but it requires a fit made for the exact
checkpoint being examined. Preparing that fit is a separate, compute-intensive process.[^v02]

Miru Tracer places these readouts in a layer-and-token view where users can compare the two lenses,
follow a selected token through the network, and inspect different positions in a generated
sequence. Since v0.3.0, selecting token position `p` decodes the block-output residual at that same
position, after the token has entered the causal context; the final logit-lens row therefore gives
the distribution for the following token. Earlier versions displayed token `p` while decoding
position `p - 1`, so screenshots and interpretations made with the old alignment need to be
recomputed before direct comparison. The labels are projections onto the model's vocabulary, not a
transcript of private reasoning or a definitive account of what the model is thinking.[^v02][^v03]

Lens directions can also be used to change a generation. Steering adds or subtracts a direction;
ablation removes the component aligned with it; swapping transfers that component from one token
direction to another. These interventions alter activations during a run rather than editing the
model's weights, and several can be applied at different layers in the same forward pass.[^v02]

## Lens fits and adapters

Recent Miru fit files can record the model repository, resolved immutable revision, normalized
architecture configuration, tokenizer fingerprint, calibration-corpus revision, and convergence
details. Miru compares available identity information with the loaded model and rejects confirmed
conflicts. Older or upstream artifacts without complete provenance remain usable with a warning,
and a narrowly scoped override is available when the user has independently verified a fit; width
and layer-range checks cannot be bypassed. Version 0.3.3 defines the architecture fingerprint from
the causal text configuration of composite models, preventing equivalent outer and text-only
configurations from being treated as different architectures.[^v03][^v033docs]

return moe also maintains a public collection of pre-fitted J-Lens adapters for
`Qwen/Qwen3-0.6B`, `Qwen/Qwen3-4B`, `Qwen/Qwen3-8B`, and `Qwen/Qwen3.6-27B`. Each adapter is a
model-specific `safetensors` file containing per-layer transformations and fit metadata. These are
interpretability artifacts, not LoRA adapters, fine-tunes, model weights, or generation plugins;
the exact base checkpoint still has to be loaded in Miru.[^adapters]

## Generation and limitations

Miru Tracer still provides the token-level controls from its first release. The v0.2 generation
engine distinguishes the model's raw probabilities from the distribution after temperature,
top-k, and top-p adjustments. A session can be stopped, moved back to an earlier token, resumed, and
exported in a versioned log for later analysis.[^v02]

The software is written in Python and loads compatible models through Hugging Face Transformers.
The web application, lens-fitting utility, and fit-conversion tool are available as command-line
programs, and the project also publishes container images. Version 0.3.3 includes architecture
detection for the Llama, Qwen, Mistral, Gemma, OLMo, GPT-2, Phi, and GPT-NeoX families, as well as
Gemma 4 wrappers and GLM MoE-DSA models. Most families are covered by tiny-model tests rather than
full-scale validation, so support for an architecture does not guarantee that every checkpoint,
quantization mode, or hardware configuration has been tested.[^v033docs][^repository]

Miru Tracer is an experimental instrument. A readable lens result or an intervention that changes
the output does not establish that a token label corresponds to a single, isolated concept in the
model. Results need to be compared across layers, lenses, prompts, and repeated runs.[^v02]

## References

[^introduction]: Rodrigo Laneth, [Miru: reverse engineering neural networks](https://blog.return.moe/en/2025/11/20/miru-reverse-engineering-neural-networks/), return moe blog, 20 November 2025.

[^v02]: Rodrigo Laneth, [Miru Tracer v0.2: from token probabilities to model internals](https://blog.return.moe/en/2026/07/16/miru-tracer-v0-2/), return moe blog, 16 July 2026; [v0.2.4 release tag](https://github.com/returnmoe/miru-tracer/releases/tag/v0.2.4), GitHub.

[^v03]: [Miru Tracer v0.3.0](https://github.com/returnmoe/miru-tracer/releases/tag/v0.3.0), [v0.3.1](https://github.com/returnmoe/miru-tracer/releases/tag/v0.3.1), [v0.3.2](https://github.com/returnmoe/miru-tracer/releases/tag/v0.3.2), and [v0.3.3](https://github.com/returnmoe/miru-tracer/releases/tag/v0.3.3), GitHub, 26–27 July 2026.

[^v033docs]: [Miru Tracer v0.3.3 README](https://github.com/returnmoe/miru-tracer/blob/v0.3.3/README.md) and [lens tutorial](https://github.com/returnmoe/miru-tracer/blob/v0.3.3/docs/lens-tutorial.md), GitHub.

[^adapters]: [Miru Tracer Jacobian-Lens Adapters](https://huggingface.co/returnmoe/jlens-adapters), Hugging Face.

[^repository]: [Miru Tracer repository](https://github.com/returnmoe/miru-tracer).
