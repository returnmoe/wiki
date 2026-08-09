---
id: see-through
title: See-through
summary: An open-source framework that decomposes a single anime illustration into inpainted semantic layers and inferred drawing order for 2.5D animation.
locale: en
kind: software
revision: 1
categories:
  - software
  - research
  - artificial-intelligence
aliases:
  - See-Through
  - 'See-through: Single-image Layer Decomposition for Anime Characters'
related:
  - return-moe
  - diffusion-models
  - stable-diffusion-xl
  - model-training
infobox:
  fields:
    - key: developer
      value: Jian Lin, Chengze Li, and collaborators
    - key: initial_release
      value: '2026'
    - key: technologies
      value:
        - Python
        - PyTorch
        - Stable Diffusion XL
        - Marigold
    - key: repository
      value:
        text: github.com/shitagaki-lab/see-through
        url: https://github.com/shitagaki-lab/see-through
    - key: license
      value: Apache-2.0
    - key: status
      value: Active research software
    - key: website
      value:
        text: arXiv:2602.03749
        url: https://arxiv.org/abs/2602.03749
---

**See-through** is an open-source research framework for turning a single static anime character
illustration into editable, fully inpainted RGBA body-part layers with an inferred drawing order.
It was introduced in a 2026 paper by Jian Lin, Chengze Li, Haoyun Qin, Kwun Wang Chan, Yanghua Jin,
Hanyuan Liu, Stephen Chun Wang Choy, and Xueting Liu. The authors list affiliations with Saint
Francis University, the University of Pennsylvania, Spellbrush, and Shitagaki Lab; the official
source repository is published through the Shitagaki Lab GitHub organization.[^paper][^upstream]

The framework addresses a preparation step in 2.5D character animation. Artists ordinarily separate
a flat illustration into parts, paint content that was hidden in the original view, and specify
which fragments should appear in front of others. See-through attempts to automate that work while
preserving the source illustration's line work, color, and overall appearance.[^paper]

## Output and scope

See-through generates transparent layers for semantic regions such as hair, face, eyes, clothing,
limbs, and accessories. The paper describes a 19-class body-part taxonomy, while the repository's
V3 inference pipeline can stratify its results into as many as 23 layers. Its main script exports a
layered Photoshop document together with intermediate segmentation masks and depth
maps.[^paper][^upstream]

The result is intended to be a **2.5D-ready representation**, not a finished Live2D model. See-through
does not create deformation meshes, physics parameters, or motion curves, and it does not decide how
a character should move. Those rigging and animation stages still require downstream software and
artistic work.[^upstream]

## Method

### Training data

The researchers constructed supervision from existing Live2D models. A Live2D character is composed
from textured **ArtMeshes** whose visibility masks and artist-defined drawing-order indices provide
precise fragment boundaries and occlusion relationships. Because mesh names and hierarchies are not
standardized across creators, the data engine assigns the fragments to a fixed semantic
taxonomy.[^paper]

The labeling process begins with image tags and Grad-CAM activation maps, snaps the coarse responses
to ArtMesh visibility masks, and refines the result with class-specific Segment Anything decoders.
Predictions are projected back onto the meshes, propagated to fully hidden fragments, and manually
verified. The recorded drawing-order indices are normalized into **pseudo-depth** values that
represent compositing order rather than physical distance from a camera.[^paper]

### Layer generation

The layer generator is based on [Stable Diffusion XL](/stable-diffusion-xl/). A transparency
decoder extends the model's RGB latent representation into RGBA output. Training proceeds in two
stages: the first teaches the model to extract one requested body part, and the second denoises the
complete stack jointly. A **Body Part Consistency Module** lets the predicted parts exchange
information so that ambiguous content is allocated more consistently across the whole
decomposition.[^paper]

See-through uses a separately fine-tuned Marigold [diffusion model](/diffusion-models/) to
predict pseudo-depth for the layers. Selected categories can then be divided into front and back
strata, allowing a single semantic part such as hair to pass both behind and in front of the face.
An inpainting step fills regions exposed by that subdivision before the layers are assembled into
the final stack.[^paper]

## Distribution and operation

The upstream repository provides inference and [model-training](/model-training/) code under
the Apache License 2.0, with model checkpoints distributed separately through Hugging Face. Its
primary inference script accepts either one image or a directory and writes the layered PSD and
intermediate artifacts to a workspace directory.[^upstream][^license]

The normal pipeline uses BF16 precision and, at the documented 1280-pixel working resolution,
requires approximately 12–16 GB of GPU memory. The repository also includes group-offload, NF4
quantization, and block-swap paths for lower-memory GPUs. These modes trade speed, precision, or
system-memory use for lower peak video-memory demand.[^upstream]

## Limitations

Content hidden in the input image cannot be observed directly. See-through therefore synthesizes a
plausible completion rather than recovering ground-truth artwork. Fine hair tips, small decorations,
accessories, and other high-frequency details may remain ambiguous or show model-generated visual
patterns. In the paper's informal artist review, participants generally treated the output as a
useful starting point but still identified cases requiring comparison with the original and manual
editing.[^paper]

Pseudo-depth likewise records a useful relative layer order, not metric 3D geometry. Even a visually
faithful reconstruction can need different separations for a particular animation, such as distinct
left and right limbs. The output should therefore be reviewed and adapted to the intended rig rather
than treated as an automatic replacement for a Live2D artist.[^paper][^upstream]

## Relevance to return moe

[return moe](/return-moe/) maintains an independent
[fork of See-through](https://github.com/returnmoe/see-through) to build Docker images and
deployment tooling optimized for cloud GPU providers such as RunPod. The fork adds a web interface,
container packaging, and cloud-oriented operational guidance.[^return-moe-fork]

## References

[^paper]: Jian Lin et al., [See-through: Single-image Layer Decomposition for Anime Characters](https://arxiv.org/abs/2602.03749), arXiv:2602.03749 (2026).

[^upstream]: [See-through source repository](https://github.com/shitagaki-lab/see-through), Shitagaki Lab.

[^license]: [See-through source-code license](https://github.com/shitagaki-lab/see-through/blob/main/LICENSE), Apache License 2.0.

[^return-moe-fork]: [return moe's See-through fork](https://github.com/returnmoe/see-through) and its [RunPod deployment guide](https://github.com/returnmoe/see-through/blob/development/docs/runpod.md).
