---
id: stable-diffusion-xl
title: Stable Diffusion XL
summary: Stability AI's high-resolution text-to-image model, released in 2023 and widely used as a base for local image generation and anime-focused models.
locale: en
kind: technology
revision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - SDXL
  - SDXL 1.0
  - Stable Diffusion XL 1.0
redirects:
  - sdxl
  - stable-diffusion-xl-1-0
related:
  - stable-diffusion
  - stability-ai
  - low-rank-adaptation
  - model-training
  - watermark-removal-as-a-denoising-task
infobox:
  fields:
    - key: developer
      value: Stability AI
    - key: initial_release
      value: 26 July 2023 (version 1.0)
    - key: technologies
      value:
        - Latent diffusion
        - U-Net denoiser
        - Dual text encoders
        - Micro-conditioning
    - key: license
      value: CreativeML Open RAIL++-M
    - key: status
      value: Released; widely supported by community tools
    - key: website
      value:
        text: SDXL base 1.0 model card
        url: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
---

**Stable Diffusion XL** (**SDXL**) is a high-resolution text-to-image model released by
[Stability AI](/stability-ai/) on 26 July 2023. It retained the latent-diffusion and U-Net design
of earlier [Stable Diffusion](/stable-diffusion/) releases while substantially enlarging the
denoiser, adding a second text encoder, and changing how image size, crop, and aspect ratio are
represented during training.[^release][^paper]

SDXL 1.0 consists primarily of a **base model** that can generate finished images by itself and an
optional **refiner** specialized for the low-noise final portion of generation. “SDXL” in community
usage usually means the base architecture and its many compatible derivatives, not necessarily a
workflow that uses the official refiner.[^base-card][^refiner-card]

As of August 2026, SDXL was no longer the state of the art in text rendering or complex prompt
following. It nevertheless remained a relevant hobbyist platform because consumer tools still
supported it directly, its architecture was modest enough for many local systems, and years of
checkpoints, LoRAs, ControlNets, tutorials, and reusable workflows had accumulated around it.[^comfyui][^a1111-features][^diffusers-lora]
For anime and character-centered work in particular, much of that relevance belongs to heavily
retrained SDXL-derived lineages, not to the official Stability AI base weights.

## From Stable Diffusion 1.x and 2.x to XL

Stable Diffusion 1.x was typically trained for 512-pixel images and used a roughly 860-million-
parameter U-Net. Stable Diffusion 2.x changed the text encoder and offered a 768-pixel model, but it
did not replace 1.5 as the only community base. SDXL was a more comprehensive redesign aimed at higher
resolution, better composition, and stronger text conditioning.

The SDXL paper reports a 2.6-billion-parameter U-Net—about three times the size of the earlier
denoisers—with more transformer blocks and attention concentrated at lower spatial resolutions. The
complete base pipeline is larger still once its VAE and two text encoders are counted.[^paper] Parameter
figures can therefore appear inconsistent: one source may count the U-Net, another the entire base
pipeline, and another the base-plus-refiner ensemble.

The research release, SDXL 0.9, appeared in June 2023 under a research-only license. Version 1.0
followed in July with separate base and refiner weights under CreativeML Open RAIL++-M.[^repository][^license]
Community references to plain “SDXL” almost always mean the 1.0-compatible architecture.

## Architecture

### Two text encoders

The base model conditions its U-Net on representations from both OpenAI CLIP ViT-L/14 and OpenCLIP
ViT-bigG/14. Their token-level outputs are concatenated for cross-attention, while a pooled text
embedding from the larger encoder contributes additional conditioning.[^paper][^base-card]

This dual-encoder design gives SDXL richer text representations than the single encoder in earlier
Stable Diffusion generations, but it also has practical consequences:

- both tokenizers have a 77-token context in the standard pipeline, so a long prompt is still not an
  unlimited natural-language instruction;
- software can expose different text to the two encoders, although most interfaces send the same
  prompt to both;
- a LoRA may target the U-Net, one or both text encoders, or some combination; and
- Stable Diffusion 1.5 embeddings and LoRAs do not match SDXL's modules.

The model's improvement should not be attributed to text encoders alone. Its larger denoiser,
conditioning scheme, data and training recipe all changed together.

### Size and crop conditioning

Discarding every training image that is not a perfect square wastes data and can teach unintended
framing. SDXL uses several **micro-conditioning** values in addition to the prompt:

- the original image width and height;
- the top and left crop coordinates; and
- the desired output width and height.

These values help the model distinguish, for example, a genuinely small source image from a crop out
of a larger one. SDXL was also fine-tuned on multiple aspect-ratio buckets at roughly the same pixel
area as 1024 by 1024, allowing portrait and landscape generation without forcing every composition
into a square.[^paper]

Applications normally populate this metadata automatically from the selected canvas. Advanced users
can manipulate it, but implausible combinations may push generation outside the model's training
distribution.

### Base and refiner

The base U-Net handles the full denoising trajectory and can be used alone. The refiner is a separate
latent-diffusion model trained for the final, low-noise part of the process; a workflow can hand the
partially denoised latent from the base to the refiner for the remaining steps.[^paper][^refiner-card]

This is a two-stage **expert pipeline**, not a sparse mixture-of-experts model in the usual language-
model sense. Both large models do not dynamically compete for each token. Instead, they are assigned
different portions of a predefined denoising schedule.

The refiner can improve texture or local detail in some outputs, but it adds model-loading time,
graphics-memory pressure, and another set of sampling choices. Many community checkpoints are tuned
to finish images without it, and many hobbyist workflows spend the extra computation on a second pass,
an upscaler, inpainting, or a specialized detailer instead. Refiner use is an option, not part of the
definition of a valid SDXL image.

## Using SDXL

SDXL's default working scale is around one megapixel. A 1024 by 1024 canvas is the reference square,
while resolutions such as 1152 by 896 or 832 by 1216 keep a comparable area and correspond to aspect-
ratio buckets used in training. Very small canvases can produce oversized or repeated subjects, and
extreme dimensions can produce unstable composition. Exact safe lists in interfaces are conventions,
not hard architectural limits.[^comfy-examples]

A typical local workflow contains:

1. the SDXL checkpoint and its VAE;
2. positive and negative text encoded through both text encoders;
3. a random latent at the requested size;
4. a scheduler, sampler, step count, and classifier-free-guidance scale;
5. optional LoRAs, ControlNets, reference-image adapters, or other conditioning; and
6. VAE decoding, followed optionally by refinement, image-to-image work, or upscaling.

Prompting remains closer to visual captioning than to issuing reliable symbolic instructions. Subject,
setting, medium, lighting, camera, and composition words can help, but the model may still miss
negation, bind an attribute to the wrong subject, or render words incorrectly. Very long strings of
quality tags can crowd out meaningful content. A reproducible result requires saving the whole
workflow and model identifiers, not only the prompt.

## Fine-tunes and LoRAs

SDXL became a base platform: community trainers adapted it into general-purpose checkpoints,
illustration and photographic models, character models, style models, and fast distilled variants.
A full checkpoint replaces or modifies a large part of the base weights. An
[SDXL LoRA](/low-rank-adaptation/#lora-in-stable-diffusion-and-sdxl) instead stores low-rank
updates for selected U-Net and sometimes text-encoder layers. It remains dependent on an SDXL-
compatible base.

“SDXL-compatible” does not mean “equally effective on every SDXL model.” A LoRA trained on the
official base can often be loaded into a derivative with the same tensor structure, but the visual
concept may weaken, change style, or conflict with that checkpoint. Conversely, a LoRA trained on a
heavily specialized derivative may perform poorly on the official base. Training provenance is part
of compatibility.

SDXL training has a higher memory and compute burden than Stable Diffusion 1.5 because the U-Net,
working resolution, and text-conditioning stack are larger. Parameter-efficient training, gradient
checkpointing, mixed precision, cached latents, and optimizer quantization reduce that burden, but
they change memory, speed, or flexibility rather than making the cost disappear. Training one or both
text encoders further increases memory use.[^diffusers-training][^kohya-sdxl]

## SDXL as an architecture: the anime-model lineages

One of SDXL's most consequential afterlives is as the architectural substrate for community anime
and illustration models. These checkpoints often retain SDXL's U-Net topology, dual text encoders,
latent dimensions, micro-conditioning inputs, and approximately one-megapixel operating scale. That
lets SDXL-aware software load them. Their trained parameters, prompt vocabulary, visual distribution,
and recommended sampling settings can nevertheless be far removed from Stability AI's SDXL 1.0
base.

Three labels answer different questions:

| Label                           | What it identifies                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| SDXL 1.0 base                   | Stability AI's particular July 2023 base weights and configuration.                                |
| SDXL-derived or SDXL-compatible | A checkpoint retaining enough of the architecture and tensor layout to use the SDXL software path. |
| Lineage base                    | A heavily trained descendant used as the parent for its own fine-tunes, merges, and LoRAs.         |

Calling all three simply “SDXL” hides an important distinction. Architecture is the arrangement and
shapes of the model's components; weights are the learned values inside them. Continued pretraining
or full fine-tuning can update billions of those values without changing the layer shapes. There is
no numerical threshold at which such a model ceases to have the SDXL architecture, but it can cease
to behave like the official SDXL checkpoint long before it becomes impossible to load through an
SDXL pipeline.

### Examples of divergence

Animagine XL 3.1 describes itself as built on SDXL, but its model card documents a multi-stage
anime training lineage totaling about 2.1 million images across Animagine 3.0 and 3.1. It is optimized
for structured anime tags, named characters, quality levels, dates, and aesthetic labels rather than
for the official base's more general caption distribution.[^animagine-card]

Illustrious XL was developed as an illustration and anime foundation within the SDXL architecture.
Its technical report emphasizes higher-resolution training and multi-level captions combining tags
with natural language.[^illustrious-paper] NoobAI-XL then continued from an early Illustrious
checkpoint rather than directly from Stability AI's base and trained further on Danbooru and e621
material.[^noobai-card] This is a lineage of descendants—SDXL to Illustrious to NoobAI to further
fine-tunes and LoRAs—not a flat collection of small style adjustments to one unchanged model.

Pony Diffusion V6 XL became another distinct SDXL-derived parent for specialized checkpoints and
LoRAs.[^pony-card] In everyday model browsers, “Pony,” “Illustrious,” and “NoobAI” are therefore useful
base-model labels of their own. They tell a user more about expected prompt syntax and adapter
compatibility than the broader “SDXL” label does.

The changes can extend beyond subject knowledge and style. NovelAI's technical report on its anime
model NAI Diffusion V3 documents uptraining an SDXL initialization from epsilon prediction to
v-prediction, changing the terminal signal-to-noise regime, and adapting sampling accordingly.[^nai-v3]
It remains meaningfully SDXL-derived at the architectural level while requiring inference assumptions
that differ from the official base.

### Practical compatibility

Loader compatibility is not semantic compatibility. An official-base SDXL LoRA may have the
correct tensor shapes for an Illustrious, Pony, or NoobAI checkpoint and still work poorly because
the features it modifies have moved during further training. The reverse is also true. Anime-model
lineages consequently develop their own character LoRAs, style adapters, prompt conventions,
ControlNets, and sometimes scheduler requirements.

For reliable use or training, the base should be recorded at the narrowest useful level: not merely
“SDXL,” but, for example, the exact Illustrious or Pony derivative and version. Model hashes matter
when a lineage includes many merges with similar names. The scheduler and prediction type must also
match checkpoints that moved from epsilon prediction to v-prediction.

Licenses follow artifacts and derivation chains, not architecture labels. A checkpoint can use the
SDXL network design while carrying terms inherited from an intermediate model plus additional terms
from its own author. The official SDXL 1.0 license should not be assumed to be the complete license
for Animagine, Pony, Illustrious, NoobAI, or their descendants.

### A return moe case study: WAI-Illustrious-SDXL v15

The [Watermark Removal as a Denoising Task](/watermark-removal-as-a-denoising-task/) experiment
provides a concrete use of an Illustrious descendant outside ordinary image generation. Return moe
encoded a watermarked anime frame and applied one late denoising update through
WAI-Illustrious-SDXL v15, with new noise disabled. According to the available decoders, that pass
made TrustMark and SynthID undetectable; one or two passes reduced Watermark Anything payload recovery
to approximately the result on the unwatermarked control.[^watermark-study]

The checkpoint should be described as Illustrious-lineage and SDXL-architected, not as the
unchanged Stability AI base. Its heavily adapted anime prior likely helped preserve the character and
scene, while the same prior replaced small phone-screen text and interface details with distortions.
That combination illustrates both sides of lineage specialization: the shared SDXL software path made
the workflow possible, but the descendant weights determined what the denoiser regarded as plausible.
The one-image test does not establish that every SDXL checkpoint removes watermarks equally well.[^watermark-study][^wai-v15]

## Why SDXL remains relevant to hobbyists

As of August 2026, SDXL remains relevant through its mature software support, accessible hardware
profile, and extensive ecosystem.

### A mature local stack

ComfyUI's current model-support list and example library still include complete SDXL base-and-refiner
workflows. AUTOMATIC1111's feature documentation likewise includes SDXL support and memory
optimizations, while Hugging Face Diffusers continues to use SDXL in current adapter-loading examples.[^comfyui][^comfy-examples][^a1111-features][^diffusers-lora]
This matters because a hobbyist platform is more than a weight file: installers, nodes, metadata,
extensions, training scripts, troubleshooting knowledge, and interoperable assets reduce the time
between an idea and a controlled result.

### A manageable hardware tier

At launch, Stability AI said the base model could run on consumer GPUs with 8 GB of graphics memory.[^release]
That is a best-case product statement rather than a universal requirement: resolution, batch size,
attention implementation, precision, refiner use, ControlNets, and the interface all affect memory.
CPU offloading and tiled VAE operations can lower the minimum at the cost of speed.

Even so, a roughly 2.6-billion-parameter U-Net occupies a different local-compute tier from newer
12-billion-parameter image transformers such as FLUX.1-dev.[^flux-card] Newer models can justify their
cost with better prompt adherence or typography, but SDXL often permits faster iteration, more room
for auxiliary models, or use on older cards. Stability AI and AMD were still publishing optimized
SDXL paths for Radeon GPUs in 2025, further evidence that the hardware target had not vanished.[^amd]

### A large adaptation ecosystem

SDXL's age is an advantage when a task depends on a particular checkpoint, character LoRA, style
adapter, ControlNet, or established production graph. A newer base model may generate a better
unadapted image but lack an equivalent specialized asset. Switching architectures also requires
retraining adapters and rebuilding workflows; adapters cannot be translated by renaming a file.

For anime generation, this is not a peripheral collection of styles applied to the official base.
Animagine, Pony, Illustrious, NoobAI, and descendants function as several mature sub-ecosystems inside
the broader SDXL architectural family. Their ability to reuse SDXL-era software while supporting
lineage-specific checkpoints and adapters is a central reason SDXL remains relevant to character-
focused hobbyist work.

Small distilled adapters extend the platform in another direction. LCM-LoRA applies latent-
consistency distillation through a LoRA so that compatible diffusion models can generate in very few
steps, while SDXL-Lightning publishes few-step SDXL U-Net and LoRA variants.[^lcm-lora][^lightning]
These are separately trained artifacts with their own recommended samplers and licenses, not a magic
speed setting for arbitrary SDXL weights.

### Predictability and control

SDXL is well characterized. Users know its common resolutions, failure modes, sampler behavior, and
adapter interactions. Node-based tools can run it offline and preserve exact graphs. For illustration,
character work, model mixing, experiments, or a stable long-lived pipeline, predictability can matter
more than winning a one-prompt comparison.

The 1.0 license also permits a broad range of personal and commercial use subject to its conditions
and use restrictions.[^license] That can be more workable for some projects than a newer checkpoint
with non-commercial weights. It is not a fully permissive software license, and every derivative
checkpoint or adapter may add its own terms.

## Where SDXL has fallen behind

SDXL should not be recommended merely because it is familiar. Its trade-offs are now clear:

- It commonly misspells text and struggles with dense graphic design.
- Prompts with several people, objects, spatial relations, or distinct attributes can become
  entangled.
- Its 1024-pixel workflow is much slower and heavier than Stable Diffusion 1.5 at 512 pixels.
- The official refiner doubles model-management complexity when used.
- CLIP tokenization and short context make it less conversational than newer text-conditioned
  architectures.
- Community assets vary greatly in quality, documentation, data provenance, and license clarity.

Stable Diffusion 3 introduced a multimodal diffusion transformer and rectified flow specifically to
improve prompt following and typography, while later non-Stability flow transformers pushed the same
general frontier.[^sd3-paper] For a user who wants the strongest zero-shot prompt adherence and has
sufficient hardware, a newer model may be the better starting point. For a user who needs SDXL's
specific adapters, low-cost local iteration, mature controls, or reproducible existing workflows,
SDXL remains a rational platform rather than merely an obsolete model.

## License and limitations

SDXL 1.0's CreativeML Open RAIL++-M license allows use, modification, and distribution subject to
use-based restrictions and downstream obligations. Stability AI states that it claims no rights in
generated outputs under the license, while making the user responsible for them.[^license] The
training data itself is not granted under that model license, and the license does not guarantee that
an output is lawful, non-infringing, or copyrightable.

The official model cards identify additional technical limits: the autoencoder is lossy; faces and
people may be rendered poorly; compositionality and legible text remain difficult; and the model is
primarily English-conditioned. SDXL is a generative prior, not a factual renderer or a substitute for
permission to depict a person or reuse protected source material.[^base-card][^refiner-card]

## References

[^release]: [Stable Diffusion XL 1.0 release](https://stability.ai/news-updates/stable-diffusion-sdxl-1-announcement), Stability AI, 26 July 2023.

[^paper]: Dustin Podell et al., [SDXL: Improving Latent Diffusion Models for High-Resolution Image Synthesis](https://arxiv.org/abs/2307.01952), _ICLR 2024_.

[^base-card]: [Stable Diffusion XL base 1.0 model card](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0), Stability AI, Hugging Face.

[^refiner-card]: [Stable Diffusion XL refiner 1.0 model card](https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0), Stability AI, Hugging Face.

[^comfyui]: [ComfyUI](https://github.com/comfy-org/ComfyUI), ComfyUI contributors, GitHub, accessed 12 July 2026.

[^a1111-features]: [Stable Diffusion WebUI features](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features), AUTOMATIC1111 contributors, GitHub.

[^diffusers-lora]: [Load adapters](https://huggingface.co/docs/diffusers/main/using-diffusers/loading_adapters), Hugging Face Diffusers documentation, accessed 12 July 2026.

[^repository]: [Stability AI generative-models repository](https://github.com/Stability-AI/generative-models), Stability AI, GitHub.

[^license]: [CreativeML Open RAIL++-M License for SDXL 1.0](https://github.com/Stability-AI/generative-models/blob/main/model_licenses/LICENSE-SDXL1.0), Stability AI.

[^comfy-examples]: [ComfyUI SDXL examples](https://comfyanonymous.github.io/ComfyUI_examples/sdxl/), ComfyUI contributors.

[^diffusers-training]: [Diffusers training overview](https://huggingface.co/docs/diffusers/training/overview), Hugging Face documentation.

[^kohya-sdxl]: [SDXL training documentation](https://github.com/kohya-ss/sd-scripts/blob/main/docs/train_SDXL-en.md), kohya-ss sd-scripts contributors, GitHub.

[^flux-card]: [FLUX.1-dev model card](https://huggingface.co/black-forest-labs/FLUX.1-dev), Black Forest Labs, Hugging Face.

[^amd]: [Stable Diffusion optimized for AMD Radeon GPUs](https://stability.ai/news-updates/stable-diffusion-now-optimized-for-amd-radeon-gpus), Stability AI, 16 April 2025.

[^lcm-lora]: Simian Luo et al., [LCM-LoRA: A Universal Stable-Diffusion Acceleration Module](https://arxiv.org/abs/2311.05556), 2023.

[^lightning]: Shanchuan Lin et al., [SDXL-Lightning: Progressive Adversarial Diffusion Distillation](https://arxiv.org/abs/2402.13929), 2024.

[^sd3-paper]: Patrick Esser et al., [Scaling Rectified Flow Transformers for High-Resolution Image Synthesis](https://arxiv.org/abs/2403.03206), 2024.

[^animagine-card]: [Animagine XL 3.1 model card](https://huggingface.co/cagliostrolab/animagine-xl-3.1), Cagliostro Research Lab, Hugging Face.

[^illustrious-paper]: Junha Lee et al., [Illustrious: An Open Advanced Illustration Model](https://arxiv.org/abs/2409.19946), 2024.

[^noobai-card]: [NoobAI-XL 1.0 model card](https://huggingface.co/Laxhar/noobai-XL-1.0), Laxhar Lab, Hugging Face.

[^pony-card]: [Pony Diffusion V6 XL model page](https://civitai.com/models/257749/pony-diffusion-v6-xl), PurpleSmartAI, Civitai.

[^nai-v3]: Juan Ossa et al., [Improvements to SDXL in NovelAI Diffusion V3](https://arxiv.org/abs/2409.15997), 2024.

[^watermark-study]: Rodrigo Laneth, [Watermark removal as a denoising task](https://blog.return.moe/en/2025/12/21/watermark-removal-as-a-denoising-task/), return moe blog, 21 December 2025.

[^wai-v15]: [WAI-NSFW-Illustrious-SDXL model page](https://civitai.com/models/827184/wai-nsfw-illustrious-sdxl), WAI0731, Civitai.
