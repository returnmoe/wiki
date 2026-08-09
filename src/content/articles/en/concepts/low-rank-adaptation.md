---
id: low-rank-adaptation
title: Low-Rank Adaptation
summary: A parameter-efficient fine-tuning method known as LoRA, and the small adapter files used to customize Stable Diffusion and SDXL models.
locale: en
kind: concept
revision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - LoRA
  - Low-rank adaptation
  - Stable Diffusion LoRA
  - SDXL LoRA
redirects:
  - lora
  - lora-model
  - stable-diffusion-lora
related:
  - model-training
  - stable-diffusion
  - stable-diffusion-xl
  - stability-ai
infobox:
  fields:
    - key: type
      value: Parameter-efficient fine-tuning technique and adapter format
    - key: authors
      value:
        - Edward Hu
        - Yelong Shen
        - Phillip Wallis
        - Zeyuan Allen-Zhu
        - Yuanzhi Li
        - Shean Wang
        - Lu Wang
        - Weizhu Chen
    - key: debut
      value: '2021'
---

**Low-Rank Adaptation** (**LoRA**) is a method for adapting a neural network while leaving its original
weights frozen. Instead of storing a full fine-tuned copy of each large weight matrix, LoRA learns a
low-rank update represented by two much smaller matrices. Edward Hu and colleagues introduced the
method for language models in 2021.[^lora-paper]

In the [Stable Diffusion](/stable-diffusion/) and
[Stable Diffusion XL](/stable-diffusion-xl/) communities, **a LoRA** also means the resulting
adapter: usually a `.safetensors` file containing low-rank updates for parts of a compatible image
model. It might teach a character, person, object, costume, pose vocabulary, rendering style, camera
effect, or a more general visual behavior. The file is not normally a complete image generator. It
must be loaded alongside the model architecture—and often the particular checkpoint family—for which
it was trained.[^diffusers-load]

Those two meanings are related but should not be collapsed:

- **LoRA the technique** is a general parameter-efficient form of [model training](/model-training/).
- **A Stable Diffusion LoRA** is a particular set of adapter weights, captions and training choices,
  base-model assumptions, and license terms.

## The low-rank update

Consider a pretrained linear transformation with weight matrix `W`, input width `k`, and output width
`d`. Full fine-tuning can change all `d × k` values. LoRA freezes `W` and represents its update as the
product of a `d × r` matrix and an `r × k` matrix:

```text
W_adapted = W + (alpha / r) BA
```

The **rank** `r` is chosen much smaller than `d` or `k`. The adapter therefore trains and stores
roughly `r(d + k)` values for that transformation rather than `dk`, plus any other targeted layers.
The scale `alpha / r` controls the update's nominal magnitude. Implementations differ in details such
as initialization, dropout, layer selection, and whether the scale is folded into the saved
weights.[^lora-paper]

During training, the base matrix remains frozen, but gradients still pass through the network to the
adapter matrices. LoRA consequently reduces trainable gradients, optimizer state, and per-variant
storage; it does **not** remove the cost of running the base model or retaining activations needed for
backpropagation. Actual memory and speed depend on resolution, batch size, precision, target modules,
optimizer, checkpointing, and implementation.

At inference, software can apply the update dynamically or **fuse** it into the base weights. Dynamic
loading makes adapters easy to switch and scale. Fusion can simplify execution but makes removal
harder unless the original weights remain available. Hugging Face Diffusers supports loading,
unloading, naming, weighting, combining, fusing, and unfusing LoRA adapters.[^diffusers-load]

## LoRA in Stable Diffusion and SDXL

Applying LoRA to diffusion models was a community adaptation of a technique first demonstrated on
transformers. The early `cloneofsimo/lora` project applied low-rank updates to Stable Diffusion's
attention layers and popularized training, scaling, and merging them for image generation.[^cloneofsimo][^diffusers-advanced]
Subsequent trainers expanded the possible targets and file conventions.

A classic Stable Diffusion pipeline contains a U-Net denoiser, one text encoder, and a VAE. SDXL has a
larger U-Net and **two** text encoders. A diffusion LoRA commonly modifies:

- attention projections in the **U-Net**, which directly participates in turning noisy latents into
  images;
- additional linear or convolutional U-Net layers, depending on the trainer and adapter method; and
- optionally, projections in the **text encoder or encoders**, changing how prompt tokens condition
  the image model.

The VAE is usually not part of an ordinary LoRA. A file containing only U-Net adapters can still learn
a strong visual concept. Training text-encoder adapters may strengthen the association between words
and that concept, but costs additional memory and can make the result less portable across prompt
styles or compatible checkpoints. SDXL scripts may train neither, one, or both of its text encoders
in addition to the U-Net; a loader has to understand the corresponding parameter prefixes.[^diffusers-api][^kohya-sdxl]

### What the file contains

A typical file stores named tensors for the adapter matrices, scaling values, and sometimes metadata
about the training setup. `.safetensors` is common because it is a data-only tensor format and avoids
the arbitrary-code execution possible when loading a general Python pickle.[^safetensors] Exact
metadata is not standardized across every trainer and repository. A filename alone is therefore poor
documentation.

A useful LoRA release identifies at least:

- the base architecture and preferably the exact training checkpoint;
- its intended activation words or caption pattern;
- recommended inference strengths and model settings;
- the type of concept and important dataset limitations;
- the adapter's license and the provenance of its training images; and
- sample images with complete generation parameters rather than prompt text alone.

The file may range from a few megabytes to hundreds of megabytes depending on rank, target layers,
architecture, and precision. Its smallness is relative to a multi-gigabyte checkpoint, not a promise
of one fixed size.

### Base-model compatibility

LoRA tensors are attached to named layers with specific shapes. **A Stable Diffusion 1.5 LoRA is not
an SDXL LoRA.** SDXL's U-Net is larger and its text-conditioning stack is different, so the tensor
names and dimensions do not line up. Stable Diffusion 2.x and Stable Diffusion 3 likewise form other
compatibility families.

Two checkpoints can share the SDXL architecture while differing greatly in learned behavior. An
adapter may load without a shape error yet produce a weaker or altered concept because its training
base and inference base represent features differently. For reproducibility, “SDXL LoRA” is only the
first level of compatibility; the exact base checkpoint is the second.

Merging a LoRA into a checkpoint removes the need to load it separately, but it does not transform it
into a universal adapter or erase the licenses of the source artifacts. Repeated merges can also make
provenance and scaling difficult to reconstruct.

## What a diffusion LoRA can learn

Common targets include:

- a specific person or fictional character;
- an object, vehicle, product shape, garment, or accessory;
- a visual style, medium, palette, lighting setup, or camera effect;
- a pose, expression, composition pattern, or recurring scene; and
- a behavior such as stronger detail or a distilled few-step sampling trajectory.

These categories overlap. A character dataset may accidentally teach its usual background and
clothing; a style dataset may memorize subjects; a product dataset may bind the product to one camera
angle. LoRA limits the parameterization of the update, not what correlations the optimizer can learn.

An **activation word** or **trigger word** is text deliberately included in captions so the model can
associate a token or token sequence with the training concept. It is not a separate executable command
stored inside the file. If the chosen string is tokenized into ordinary pieces, its effect arises from
training those prompt contexts against the images. Caption detail determines which properties are
explicitly described and which the adapter may absorb into the trigger.

For example, if every image of a character shows a red coat and captions mention only the character
token, the adapter may learn the coat as part of the identity. Captioning the coat separately and
including varied clothing gives the optimizer evidence that the two attributes can vary. No captioning
recipe guarantees perfect disentanglement; dataset variation is equally important.

## Training choices

Training quality cannot be inferred from rank or step count alone. Important choices include:

### Dataset and captions

Images should represent the intended concept while varying irrelevant factors. Near-duplicates can
overweight one view. Low-resolution images, compression artifacts, watermarks, or repetitive
backgrounds can become part of the learned distribution. Captions can be written manually, generated
and corrected, or assembled from tags, but they should consistently separate identity from attributes
the user may want to control later.

Regularization or class images are used in some subject-training recipes to preserve a broader class
while learning one instance. Their role comes from the training objective, not from LoRA itself.

### Resolution and architecture

Training should match the base model's expected scale and preprocessing. Stable Diffusion 1.5 is
commonly trained around 512 pixels; SDXL uses aspect-ratio buckets around a 1024-by-1024 pixel area.
Upscaling a tiny dataset to that canvas does not create missing detail. SDXL's larger U-Net and dual
encoders also raise memory requirements compared with 1.5.[^sdxl-paper][^kohya-sdxl]

### Rank and alpha

Higher rank enlarges the space of possible updates and the file, but does not monotonically improve
the result. A simple style may fit a low rank; a diverse concept may benefit from more capacity. Too
much capacity or training can preserve unwanted dataset details just as full fine-tuning can. `alpha`
interacts with rank and implementation, so two files with the same user-facing strength need not have
the same effective update.

### Learning rate and duration

U-Net and text-encoder adapters can use different learning rates. Too little optimization underfits;
too much can overfit, distort the base model, or make every prompt converge toward the training
images. “Epochs,” “repeats,” and “steps” are connected by dataset size and batch size, so reporting one
without the others is ambiguous. Periodic samples and saved checkpoints help identify the useful
point before the final step.

### Target modules and optimizer

Targeting more layers increases expressiveness and optimizer state. Training only attention
projections follows the simplest LoRA pattern, while broader methods may adapt convolutions or use
alternative low-rank decompositions. Mixed precision, gradient checkpointing, cached VAE latents, and
memory-efficient optimizers make local training possible, but each has constraints. Cached latents,
for example, prevent image augmentations that would need to be recomputed after encoding.

## Using and combining LoRAs

Interfaces expose an **adapter strength**, often with `1.0` as the nominal trained scale and `0` as no
effect. It is not a percentage of “how much character” or “how much style.” The usable range depends
on the adapter and base checkpoint; values above one and negative values may be accepted, but can
produce exaggerated or unintuitive changes.

Several LoRAs can be active at once. At the weight level, their updates can be added with separate
scales. At the image level, their concepts do not combine independently: they may target the same
layers, reinforce shared biases, compete for prompt tokens, or jointly push the model outside a
well-trained region. Reducing strengths, simplifying the prompt, or applying concepts in separate
image-to-image and inpainting stages can be more reliable than stacking many full-strength adapters.

Dynamic adapter names and weights are part of reproducibility. Two interfaces may parse LoRA syntax
differently, and one may apply the text-encoder scale differently from the U-Net scale. Saving the
model hash, adapter hashes, software version, workflow, seed, and generation settings is safer than
relying on a screenshot of the prompt.

## Relationship to other adaptation methods

The following terms answer different questions and can sometimes be combined:

| Artifact or method             | What changes or is added                                     | Typical use                                                               |
| ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Full fine-tuned checkpoint** | Many or all base-model weights                               | Broad domain or style change with maximum capacity                        |
| **LoRA**                       | Low-rank updates attached to selected layers                 | Portable subject, style, behavior, or efficient specialization            |
| **Textual inversion**          | One or more learned text-embedding vectors                   | Very small token-level concept representation                             |
| **DreamBooth**                 | A subject-personalization training objective and data recipe | Binding a rare identifier to a subject from a small image set             |
| **ControlNet**                 | A parallel conditioning network                              | Spatial control from pose, depth, edges, segmentation, and similar inputs |

**DreamBooth and LoRA are not opposites.** DreamBooth describes how a subject is taught using a rare
identifier, instance examples, and a class-preservation objective; the original work fine-tuned model
weights. A later implementation can use LoRA as the parameter-efficient way to store the updates.[^dreambooth][^diffusers-load]

**Textual inversion** optimizes embeddings that stand for a concept while keeping the generator
frozen. The files can be much smaller, but the update enters through the text-conditioning pathway and
has less capacity than adapters distributed through the U-Net.[^textual-inversion]

**ControlNet** learns to incorporate a spatial condition through an added network. It can control
where structure goes without teaching the base model a new person's appearance. A ControlNet and one
or more LoRAs are commonly used together.[^controlnet]

Names such as **LoCon**, **LoHa**, **LoKr**, and **LyCORIS** refer to related adapter implementations
or decompositions. Interfaces and model-hosting sites sometimes group them under the informal “LoRA”
label because they serve similar roles, but their tensors and mathematics are not necessarily plain
LoRA. Loader support must match the saved adapter type.[^lycoris]

## LoRA versus QLoRA

**QLoRA** is not a specially compressed Stable Diffusion LoRA file. In the original language-model
method, a frozen base model is held in 4-bit quantized form while higher-precision LoRA adapters are
trained through it. Quantizing the backbone reduces memory; the low-rank update is still the trainable
part.[^qlora-paper] The term appears far more often in language-model training than in ordinary SDXL
model listings. A diffusion trainer using quantized weights or an 8-bit optimizer should document
exactly what is quantized rather than labeling every memory-saving setup “QLoRA.”

## Costs and trade-offs

Compared with full fine-tuning, LoRA usually offers:

- much smaller trainable and saved parameter sets;
- lower optimizer and gradient memory;
- one shared base model for many switchable concepts;
- convenient strength adjustment and composition; and
- optional fusion into a deployment checkpoint.

The corresponding costs are:

- dependence on a compatible base model;
- less update capacity than unrestricted full fine-tuning;
- continuing compute for the frozen backbone during training;
- interactions when several adapters modify the same network; and
- a larger provenance and dependency graph at deployment.

For a hobbyist, data preparation and experiment time can dominate the monetary cost. A short run on
owned hardware may have little direct expense but consume hours of captioning and repeated sampling.
Cloud training converts hardware acquisition into metered GPU time and makes failed runs directly
billable. Either way, saving intermediate adapters and using a small validation prompt set is cheaper
than discovering overfitting only after the full schedule.

## Licensing, consent, and misuse

A LoRA's small size does not make it legally or ethically detached from its sources. Its use can be
constrained by the base model's license, its own license, rights in the training images, publicity and
privacy law, platform rules, and the intended outputs. Merging it into another checkpoint does not
automatically remove those obligations.

Person and living-artist adapters present especially visible consent and impersonation questions.
Technical similarity to a subject is not evidence of authorization. Responsible publication includes
documenting data provenance, obtaining appropriate permission, setting clear output terms, and not
marketing an adapter as endorsed when it is not. A well-labeled adapter lets users assess those facts;
an opaque file leaves both its technical compatibility and its provenance uncertain.

## References

[^lora-paper]: Edward J. Hu et al., [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685), _ICLR 2022_.

[^diffusers-load]: [Load adapters](https://huggingface.co/docs/diffusers/main/using-diffusers/loading_adapters), Hugging Face Diffusers documentation, accessed 12 July 2026.

[^cloneofsimo]: [LoRA for Stable Diffusion](https://github.com/cloneofsimo/lora), `cloneofsimo/lora`, GitHub.

[^diffusers-advanced]: [Advanced diffusion training examples](https://github.com/huggingface/diffusers/blob/main/examples/advanced_diffusion_training/README.md), Hugging Face Diffusers, GitHub.

[^diffusers-api]: [LoRA loader API](https://huggingface.co/docs/diffusers/main/api/loaders/lora), Hugging Face Diffusers documentation.

[^kohya-sdxl]: [SDXL training documentation](https://github.com/kohya-ss/sd-scripts/blob/main/docs/train_SDXL-en.md), kohya-ss sd-scripts contributors, GitHub.

[^safetensors]: [Safetensors](https://github.com/huggingface/safetensors), Hugging Face, GitHub.

[^sdxl-paper]: Dustin Podell et al., [SDXL: Improving Latent Diffusion Models for High-Resolution Image Synthesis](https://arxiv.org/abs/2307.01952), _ICLR 2024_.

[^dreambooth]: Nataniel Ruiz et al., [DreamBooth: Fine Tuning Text-to-Image Diffusion Models for Subject-Driven Generation](https://arxiv.org/abs/2208.12242), _CVPR 2023_.

[^textual-inversion]: Rinon Gal et al., [An Image is Worth One Word: Personalizing Text-to-Image Generation using Textual Inversion](https://arxiv.org/abs/2208.01618), _ICLR 2023_.

[^controlnet]: Lvmin Zhang, Anyi Rao, and Maneesh Agrawala, [Adding Conditional Control to Text-to-Image Diffusion Models](https://arxiv.org/abs/2302.05543), _ICCV 2023_.

[^lycoris]: [LyCORIS documentation](https://github.com/KohakuBlueleaf/LyCORIS), LyCORIS contributors, GitHub.

[^qlora-paper]: Tim Dettmers et al., [QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314), _NeurIPS 2023_.
