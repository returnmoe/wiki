---
id: stable-diffusion
title: Stable Diffusion
summary: A family of locally runnable generative-image models descended from latent diffusion, first released publicly in 2022.
locale: en
kind: technology
revision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - Stable Diffusion model family
  - SD
redirects:
  - stable-diffusion-model
related:
  - stability-ai
  - stable-diffusion-xl
  - low-rank-adaptation
  - model-training
infobox:
  fields:
    - key: developer
      value:
        - CompVis and Runway (original model leadership)
        - Stability AI and collaborators
    - key: initial_release
      value: 22 August 2022
    - key: technologies
      value:
        - Latent generative modeling
        - Text conditioning
        - Diffusion and rectified flow
    - key: license
      value: Varies by model generation
    - key: status
      value: Active model family
    - key: website
      value:
        text: Stable Diffusion models
        url: https://stability.ai/core-models
---

**Stable Diffusion** is a family of generative-image models whose downloadable weights made
high-quality text-to-image generation practical on consumer hardware. The first public release
appeared on 22 August 2022. It was based on the **latent diffusion model** developed by researchers
associated with the CompVis group at Ludwig Maximilian University of Munich and Runway, with training
compute and organizational support from [Stability AI](/stability-ai/) and contributions from
communities including LAION and EleutherAI.[^public-release][^launch]

The name has three common meanings:

1. **The original model generation**, particularly the 1.x checkpoints released in 2022.
2. **The model family**, including 2.x, [Stable Diffusion XL](/stable-diffusion-xl/) (SDXL), and
   Stable Diffusion 3 and 3.5.
3. **The surrounding local-generation ecosystem**, although interfaces such as ComfyUI and
   AUTOMATIC1111's WebUI, community checkpoints, extensions, and most LoRAs are independent projects.

The second meaning is the most precise when no version is given. “Stable Diffusion” is not one
unchanging model, a single application, or the name of every image generator that runs locally.

## Origins

Diffusion models learn to reverse a process that gradually corrupts data with noise. Applying that
process directly to full-resolution pixels is computationally expensive. The 2022 latent-diffusion
paper instead used a pretrained autoencoder to compress images into a lower-dimensional **latent
space**, performed the iterative generative process there, and decoded the result back into pixels.
Cross-attention let the denoising network respond to text or other conditioning signals.[^ldm]

The original Stable Diffusion adapted this architecture into a text-conditioned system whose weights
could fit on a consumer graphics card. Its 1.4 model card describes three major learned components:

- a variational autoencoder (**VAE**) that encodes and decodes images at an eightfold spatial
  compression factor;
- a frozen CLIP ViT-L/14 text encoder that converts prompt tokens into conditioning vectors; and
- a convolutional **U-Net** that predicts how to denoise the image latent while attending to those
  vectors.[^v14-card]

Training used subsets of LAION-5B, a web-derived collection of approximately 5.85 billion
CLIP-filtered image-text pairs. Later stages used aesthetic-score filters and other subset criteria.
The dataset's scale and web provenance helped the model cover many visual concepts, but also carried
forward social biases, inaccurate captions, copyrighted material, and other properties of its source
distribution.[^laion5b][^v14-card]

The original launch was collaborative. Stability AI's announcement says Patrick Esser of Runway and
Robin Rombach of LMU led development and that Stability AI supplied the cluster used for training.
This is why histories variously associate Stable Diffusion with CompVis, Runway, and Stability AI;
none of those labels alone fully describes the first release.[^launch]

## How image generation works

A basic Stable Diffusion 1.x or 2.x text-to-image run can be understood as the following loop:

1. The interface tokenizes a **prompt**, and a text encoder turns the tokens into embeddings.
2. The sampler creates a latent tensor, usually initialized with pseudorandom noise determined by a
   **seed**.
3. At each sampling step, the U-Net estimates a denoising direction conditioned on the text.
4. A scheduler or **sampler** uses that estimate to move the latent toward a less noisy state.
5. After the requested number of steps, the VAE decodes the latent into an image.

Most workflows use **classifier-free guidance** (CFG). During training, the model sometimes receives
no condition; at inference, software combines conditional and unconditional predictions. Increasing
the guidance scale makes the sample follow the prompt more forcefully, but excessive guidance can
reduce diversity, oversaturate colors, or create artifacts.[^cfg] A **negative prompt** supplies text
to the nominally unconditional branch in many implementations, steering the result away from those
features. It is guidance, not a guaranteed list of forbidden objects.

The seed makes the initial latent reproducible within a sufficiently similar software and hardware
stack. It does not completely specify an image: the model, VAE, sampler, scheduler, step count,
resolution, prompt parsing, precision, and implementation can all change the result.

### Other generation modes

The same latent process supports more than text-to-image generation:

- **Image-to-image** encodes an input image, adds an amount of noise set by a denoising-strength
  control, and generates from that intermediate state. Lower strength preserves more of the input.
- **Inpainting** regenerates a masked region while conditioning on the unmasked image and text.
- **Outpainting** extends the canvas and inpaints the new area.
- **Upscaling** may use a dedicated latent upscaler, tiled diffusion, or a second image-to-image pass.
- **ControlNet** adds a separately trained network that conditions generation on spatial information
  such as edges, depth, pose, or segmentation without replacing the base model.[^controlnet]

User-interface features such as prompt emphasis, regional prompting, face restoration, high-resolution
fixes, and extension scripts are not necessarily capabilities built into the checkpoint. A saved
workflow therefore records more than its prose prompt.

## Model generations

Stable Diffusion is a lineage rather than a simple sequence of patches:

| Generation                     | Public debut | Architectural or practical distinction                                                                                |
| ------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| **1.x**                        | 2022         | 512-pixel latent-diffusion baseline using CLIP ViT-L/14; became the foundation of the early ecosystem.                |
| **2.x**                        | 2022         | Switched to an OpenCLIP text encoder; included 512- and 768-pixel models plus depth and upscaling tools.              |
| **SDXL 1.0**                   | 2023         | Much larger U-Net, two text encoders, native 1024-pixel training, aspect-ratio conditioning, and an optional refiner. |
| **Stable Diffusion 3 and 3.5** | 2024         | Replaced the classic U-Net recipe with a multimodal diffusion-transformer design trained with rectified flow.         |

Stable Diffusion 2.0's changed text encoder, data filtering, and architecture meant that 1.x
fine-tunes and adapters were generally not compatible with it. Its release added an OpenCLIP encoder,
768-pixel and 512-pixel text-to-image checkpoints, a depth-conditioned model, and a fourfold
upscaler.[^sd2]

SDXL was a larger redesign and has its own article because it became a distinct community platform,
not merely a higher version number. Its base model uses two text encoders and was trained around a
1024-pixel image scale; its adapters and fine-tunes are correspondingly SDXL-specific.[^sdxl-paper]

Stable Diffusion 3 changed the core design more radically. It uses rectified-flow training and a
**Multimodal Diffusion Transformer** (MMDiT), with separate image- and language-stream weights that can
exchange information. The architecture was intended to improve prompt composition and typography,
areas in which earlier generations often fail.[^sd3-paper] Stability AI released 3.5 Large, Large
Turbo, and Medium variants later in 2024. As of July 2026, Stable Diffusion 3.5 remained the newest
publicly documented Stable Diffusion generation on the company's current model list.[^sd35][^core-models]

The shared brand should not obscure these differences. A checkpoint, ControlNet, embedding, or
[LoRA](/low-rank-adaptation/) built for one architecture cannot be assumed to work with another.

## Checkpoints, fine-tunes, and adapters

A **checkpoint** is a stored set of model weights. In community discussion, “the checkpoint” usually
means a complete or nearly complete base model, often saved as a `.safetensors` file. A **fine-tuned
checkpoint** starts with a base release and updates many or all weights for a visual domain, style, or
general quality target. A **merged checkpoint** combines weight changes from existing models without
necessarily performing new training.

A LoRA instead stores a comparatively small set of low-rank weight updates. It needs a compatible
base checkpoint at generation time and can usually be enabled, scaled, mixed, or removed without
duplicating the whole model. Textual-inversion embeddings store learned token vectors, while
ControlNets and other adapters add different forms of conditioning. These artifacts solve related but
non-identical problems.

Compatibility is architectural and empirical. A LoRA trained against a Stable Diffusion 1.5 base
does not fit SDXL's modules. An SDXL LoRA may technically load on several SDXL-derived checkpoints but
behave differently when their underlying styles and representations have diverged. The model and
adapter licenses also remain relevant when distributing a merge or derivative.

## Why the public weights mattered

At release, Stability AI reported that the 1.4 weights could generate locally with roughly 6.9 GB of
graphics memory under its recommended setup.[^public-release] This put a capable text-to-image model
within reach of ordinary gaming computers and enabled uses that an API alone could not easily support:

- offline and private generation;
- inspection and modification of inference code;
- community fine-tuning and adapter training;
- reproducible node-based pipelines;
- integration into art, game, research, and automation tools; and
- use without per-image service charges, after the hardware and electricity costs.

Independent interfaces became as influential as the official release code. AUTOMATIC1111's WebUI
assembled generation, inpainting, extensions, training utilities, and memory optimizations into a
browser interface. ComfyUI represented generation as a graph of reusable nodes and serialized the
workflow into image metadata or JSON. Both continued to support multiple Stable Diffusion generations
alongside unrelated model families.[^a1111][^comfyui]

Local operation does not make generation free. Users pay through hardware, power, setup time, storage,
and slower iteration on limited graphics memory. Hosted services exchange those fixed and maintenance
costs for metered pricing, account-level policies, and less control over the execution environment.

## Licenses and the term “open source”

The first public weights used the CreativeML Open RAIL-M license, while SDXL 1.0 used Open
RAIL++-M.[^v14-card][^sdxl-license] These licenses permit running, modifying, and redistributing the
models subject to conditions, including use-based restrictions and obligations for derivatives.
Later model generations use other Stability AI licenses. Code repositories may also have software
licenses separate from the weights, and training datasets are not automatically licensed with a
model.

Stable Diffusion was widely described as **open source**, including by Stability AI. Under the Open
Source Initiative's later Open Source AI Definition, however, an open-source AI system must allow use
for any purpose and provide the preferred form for making modifications, including specified
information about training data. Restricted weight licenses do not meet all of those criteria.[^osaid]
Accordingly, **open-weight** or **source-available** avoids implying that every Stable Diffusion
release satisfies a particular open-source definition.

The license on a generator also does not determine whether every output is copyrightable, lawful, or
free of third-party rights. Output status depends on the work, the user's contribution, training or
input materials, and jurisdiction.

## Limitations and social questions

The original model card warns that Stable Diffusion 1.x does not achieve perfect photorealism, renders
legible text poorly, struggles with complex composition and faces, and loses information through its
autoencoder. It also performs unevenly across languages and cultures because the data and CLIP text
encoder are heavily English-centered.[^v14-card]

Later generations improve some of these problems but do not eliminate them. Common failure modes
include incorrect anatomy, attribute leakage between subjects, implausible spatial relationships,
repeated textures, and confident reproduction of stereotypes. A visually plausible result is not
evidence that depicted facts, people, text, or products are real.

Web-scale training also raises disputes over creators' consent, privacy, copyright, and attribution.
The LAION datasets are indexes of image URLs and associated text rather than a curated stock library,
and filtering a large crawl cannot guarantee that every record is suitable. Models normally learn
distributed statistical representations rather than keeping a browsable image database, yet they can
occasionally memorize or reproduce elements of training examples. Those technical facts do not by
themselves settle the legal or ethical questions.

Safety filters and model licenses can discourage some uses, while local weights make centralized
enforcement difficult. Stable Diffusion's significance therefore comes with two linked consequences:
it distributed creative and research capability beyond a few hosted services, and it distributed
responsibility for how that capability is adapted and used.

## References

[^public-release]: [Stable Diffusion public release](https://stability.ai/news-updates/stable-diffusion-public-release), Stability AI, 22 August 2022.

[^launch]: [Stable Diffusion launch announcement](https://stability.ai/news-updates/stable-diffusion-announcement), Stability AI, 10 August 2022.

[^ldm]: Robin Rombach et al., [High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752), _Proceedings of CVPR 2022_.

[^v14-card]: [Stable Diffusion v1-4 model card](https://huggingface.co/CompVis/stable-diffusion-v1-4), CompVis and Stability AI, Hugging Face.

[^laion5b]: Christoph Schuhmann et al., [LAION-5B: An Open Large-Scale Dataset for Training Next Generation Image-Text Models](https://arxiv.org/abs/2210.08402), _NeurIPS 2022 Datasets and Benchmarks_.

[^cfg]: Jonathan Ho and Tim Salimans, [Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598), 2022.

[^controlnet]: Lvmin Zhang, Anyi Rao, and Maneesh Agrawala, [Adding Conditional Control to Text-to-Image Diffusion Models](https://arxiv.org/abs/2302.05543), _ICCV 2023_.

[^sd2]: [Stable Diffusion 2.0 release](https://stability.ai/news-updates/stable-diffusion-v2-release), Stability AI, 24 November 2022.

[^sdxl-paper]: Dustin Podell et al., [SDXL: Improving Latent Diffusion Models for High-Resolution Image Synthesis](https://arxiv.org/abs/2307.01952), _ICLR 2024_.

[^sd3-paper]: Patrick Esser et al., [Scaling Rectified Flow Transformers for High-Resolution Image Synthesis](https://arxiv.org/abs/2403.03206), 2024.

[^sd35]: [Introducing Stable Diffusion 3.5](https://stability.ai/news/introducing-stable-diffusion-3-5), Stability AI, 22 October 2024.

[^core-models]: [Stability AI core models](https://stability.ai/core-models), Stability AI, updated 20 May 2026.

[^a1111]: [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui), AUTOMATIC1111 contributors, GitHub.

[^comfyui]: [ComfyUI](https://github.com/comfyanonymous/ComfyUI), ComfyUI contributors, GitHub.

[^sdxl-license]: [CreativeML Open RAIL++-M License for SDXL 1.0](https://github.com/Stability-AI/generative-models/blob/main/model_licenses/LICENSE-SDXL1.0), Stability AI.

[^osaid]: [The Open Source AI Definition 1.0](https://opensource.org/ai/open-source-ai-definition), Open Source Initiative, 28 October 2024.
