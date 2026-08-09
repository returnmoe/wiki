---
id: watermark-removal-as-a-denoising-task
title: Watermark Removal as a Denoising Task
summary: A 2025 return moe experiment testing whether one or two late diffusion-denoising steps could erase invisible image watermarks while preserving anime image content.
locale: en
kind: project
revision: 1
categories:
  - projects
  - research
  - artificial-intelligence
aliases:
  - Diffusion watermark-removal experiment
  - Watermark denoising experiment
redirects:
  - watermark-removal-denoising
related:
  - return-moe
  - rodrigo-laneth
  - diffusion-models
  - stable-diffusion-xl
infobox:
  fields:
    - key: type
      value: Image-watermark robustness experiment
    - key: author
      value:
        text: Rodrigo Laneth
        article: rodrigo-laneth
    - key: formed
      value: 21 December 2025
    - key: focus
      value: Invisible watermark removal through minimal diffusion denoising
    - key: affiliation
      value:
        text: return moe
        article: return-moe
    - key: status
      value: Published with test artifacts and workflow
    - key: website
      value:
        text: Watermark removal as a denoising task
        url: https://blog.return.moe/en/2025/12/21/watermark-removal-as-a-denoising-task/
---

**Watermark Removal as a Denoising Task** is a 2025 [return moe](/return-moe/)
image-authenticity experiment by [Rodrigo Laneth](/rodrigo-laneth/). It tested whether a
pretrained [diffusion model](/diffusion-models/) could make three invisible image watermarks
undetectable as a side effect of applying only one or two late denoising steps. The tested generator
was **WAI-Illustrious-SDXL v15**, an anime-focused checkpoint in the Illustrious branch of the
[SDXL](/stable-diffusion-xl/) architecture.[^experiment][^wai-model]

The experiment reported successful removal according to the available decoders for Adobe TrustMark,
Meta's Watermark Anything, and Google's SynthID. It also reported localized image damage, especially
to small text and interface details on a smartphone screen. Its result is therefore a demonstration
of a watermark–fidelity trade-off on one anime image, not evidence that the procedure universally
removes every watermark without changing content.[^experiment]

## Research question

An invisible image watermark encodes a machine-readable signal through small changes to an image.
Robust schemes attempt to keep the signal recoverable after expected transformations such as JPEG
compression, cropping, resizing, and filtering. A useful evaluation must also consider transformations
that use a learned image prior rather than a fixed pixel or frequency filter.

The return moe hypothesis was that a diffusion denoiser would treat an imperceptible embedded signal
as an unlikely perturbation and move the image back toward its learned image distribution. Adobe's
TrustMark work provided the immediate conceptual prompt: its authors formulate watermark removal as
an image-denoising problem and train a dedicated TrustMark-RM restoration network.[^trustmark-paper]
Return moe asked whether an existing generative diffusion checkpoint, trained for image synthesis
rather than for a particular watermark, could produce the same side effect with almost no reverse
trajectory.

This was not the first research to use generative models against invisible watermarks. A 2023
regeneration-attack paper formally and empirically studied adding noise and reconstructing an image
with pretrained generative models.[^regeneration-attack] A 2024 conference paper proposed Diffusion
Denoising Watermark Removal Models, which apply forward noise and a reverse denoising process to
watermarked patches.[^ddwrm] The return moe experiment is narrower and operationally distinctive: it
tested current provenance systems with a public anime SDXL derivative and disabled new noise, using
only the end of an ordinary image-to-image sampling schedule.

## Experimental design

The base image was a cropped, resized, JPEG-encoded frame from an official trailer for the third
season of _Oshi no Ko_. The choice gave the anime-specialized checkpoint an input close to its learned
visual domain while ensuring that the starting image was not AI-generated. All three watermark tests
used derivatives of this frame.[^experiment]

### Model and denoising pipeline

The workflow encoded each watermarked image into the checkpoint's latent space and invoked
WAI-Illustrious-SDXL v15 with these reported sampler settings:[^experiment]

- 28 total scheduled steps;
- start at step 27, leaving one reverse denoising update;
- Euler ancestral sampling; and
- `add_noise` disabled.

The Watermark Anything test repeated the same pass once more to evaluate a two-update result. Because
new Gaussian noise was disabled, this is not the full textbook procedure of corrupting an image and
then reversing the corruption. It is better understood as a very small **projection through the
checkpoint's learned prior**: the VAE reconstruction and late denoiser update preserve much of the
input while replacing some fine-scale structure with details the model considers plausible.

The checkpoint choice matters. WAI v15 is derived from the illustration-specialized Illustrious
lineage, which itself retains the broad SDXL architecture while having substantially retrained
weights.[^illustrious] It was therefore well matched to an anime frame. The experiment does not show
that the official Stability AI SDXL base, a photographic checkpoint, or a non-SDXL diffusion model
would make the same fidelity trade-off.

### Watermark systems

The study covered three systems with materially different access conditions:

| System                       | Test construction                                                                                                   | Available verification                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Adobe TrustMark**          | TrustMark model Q embedded the text payload `kawaii`.                                                               | Official open decoder and dedicated TrustMark-RM-Q remover.             |
| **Watermark Anything (WAM)** | The public model embedded a 32-bit encoding of `moe` plus a null-byte terminator.                                   | Official open decoder, evaluated through recovered-bit accuracy.        |
| **Google SynthID**           | Google's image editor modified and then approximately restored the source frame, producing a SynthID-bearing image. | The public Gemini verification interface returned a detection judgment. |

TrustMark is an arbitrary-resolution, 100-bit watermarking system whose public implementation
includes embedding, decoding, and removal models.[^trustmark-repository] Watermark Anything supports
localized 32-bit messages and publishes its code and weights.[^wam-paper][^wam-repository] SynthID
supports several media types, but its image embedder and detector weights were not public; Google had
made end-user image verification available through Gemini shortly before the experiment.[^synthid][^gemini-verification]

## Results

The results reported on 21 December 2025 were:[^experiment]

| Test                 | Before diffusion                                              | After diffusion                                                                                                  |
| -------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **TrustMark Q**      | The official decoder recovered `kawaii`.                      | After one update, the decoder did not recover the payload.                                                       |
| **WAM, one update**  | The 32-bit message decoded exactly, with bit accuracy `1.00`. | Recovered-bit accuracy fell to `0.56`; random agreement would average `0.50`.                                    |
| **WAM, two updates** | Same marked input.                                            | The decoder returned the all-zero string, with accuracy `0.53`, matching its output on the unwatermarked source. |
| **SynthID**          | Gemini reported SynthID in the Google-edited test image.      | After one update, Gemini reported that no SynthID watermark was detected.                                        |

The TrustMark comparison included Adobe's dedicated TrustMark-RM-Q model. Both the official remover
and the diffusion output defeated decoding. The source article judged the diffusion result visually
better, but did not report a blinded preference study or objective fidelity metrics such as PSNR,
SSIM, or a perceptual-distance score. That judgment should therefore remain explicitly subjective.

For WAM, the unwatermarked original itself decoded as all zeros and happened to agree with 53 percent
of the chosen payload. WAM's decoder always returns bits, even when no watermark is present, so the
meaningful observation is not that `0.53` proves absence. It is that the processed image fell from
perfect recovery to a result comparable with the study's unwatermarked control. More images and
payloads would be needed to estimate a false-negative rate.

The SynthID result has an additional confound. Because the public interface did not provide an
embedder, the test image had to undergo substantive Google-model editing before it received SynthID;
the subsequent attempt to reverse those edits did not restore pixel identity with the source. The
available Gemini verifier returned a binary-style judgment rather than raw detector confidence or
localized payload data.[^experiment][^gemini-verification]

## Interpretation

The experiment illustrates why generative restoration is a difficult threat model for invisible
watermarking. A watermark can survive conventional signal processing yet fail when a learned model
reconstructs the scene's appearance. The reconstruction is not required to estimate or target the
secret message. It only has to replace enough low-level signal that the detector loses its
correlation with the original payload.

The same mechanism explains the observed damage. Small screen text, icons, and interface geometry
are difficult for SDXL-family models and occupy relatively few pixels. A denoiser trained to produce
plausible anime imagery can preserve the character and room while inventing those details. The output
is semantically similar, but not evidentially identical. This makes the method unsuitable whenever
pixel-level authenticity, exact text, or forensic preservation matters.

The one-step result is also a concrete example of why the anime branches remain relevant beyond
ordinary text-to-image generation. WAI-Illustrious-SDXL v15 shares SDXL's loadable architecture but
uses a substantially different learned distribution. In this case, that specialized distribution
acted as a useful prior for restoring an anime frame. Describing the model only as “SDXL” would hide
the reason the chosen prior matched the test image.

## Limitations

The study was deliberately small. Its main limitations are:

- one source image from one visual domain;
- one WAI/Illustrious checkpoint and one sampler configuration;
- one payload for TrustMark and one for WAM;
- no repeated trials across seeds, resolutions, image complexity, or compression levels;
- no quantitative fidelity metric or human evaluation panel;
- only the public Gemini interface for SynthID verification; and
- no comparison with other SDXL lineages, photographic diffusion models, or non-diffusion
  restoration methods.

The report's phrase “complete removal” for the two-step WAM case describes the decoder result in that
test. It does not establish that every statistical trace of the watermark was absent. A stronger
study would randomize many payloads and images, preserve detector confidence where available, compare
several attacks under matched distortion budgets, and publish aggregate detection and perceptual-
quality curves.

## Reproducibility and significance

Return moe published the source, processed images, and a minimal ComfyUI workflow. The archive records
the TrustMark, WAM, and SynthID intermediates as well as the one- and two-pass outputs, enabling others
to verify the stated decoder behavior and inspect the visual trade-off.[^experiment]

The result is relevant to content-authenticity design because the attack uses downloadable consumer
software and an ordinary community checkpoint rather than a watermark-specific learned attacker.
Watermark robustness claims should therefore include generative reconstruction and domain-matched
image priors, not only cropping, rescaling, compression, and blur.

Watermark-removal research is dual-use. It helps designers identify weak provenance mechanisms, but
the same technique can be used to conceal origin or evade platform rules. A failed watermark check
should never be treated as proof that an image is human-made, and robust provenance should combine
multiple signals—such as signed metadata, secure capture records, and contextual verification—rather
than depending on one invisible detector.

## References

[^experiment]: Rodrigo Laneth, [Watermark removal as a denoising task](https://blog.return.moe/en/2025/12/21/watermark-removal-as-a-denoising-task/), return moe blog, 21 December 2025.

[^wai-model]: [WAI-NSFW-Illustrious-SDXL model page](https://civitai.com/models/827184/wai-nsfw-illustrious-sdxl), WAI0731, Civitai.

[^trustmark-paper]: Tu Bui, Shruti Agarwal, and John Collomosse, [TrustMark: Robust Watermarking and Watermark Removal for Arbitrary Resolution Images](https://openaccess.thecvf.com/content/ICCV2025/html/Bui_TrustMark_Robust_Watermarking_and_Watermark_Removal_for_Arbitrary_Resolution_Images_ICCV_2025_paper.html), _ICCV 2025_.

[^regeneration-attack]: Xuandong Zhao et al., [Invisible Image Watermarks Are Provably Removable Using Generative AI](https://arxiv.org/abs/2306.01953), 2023.

[^ddwrm]: Hannes Mareen et al., [Diffusion Denoising Watermark Removal Models to Attack Invisible Image Watermarks](https://biblio.ugent.be/publication/01JJ1J4H62ZCZ3EKNTBPHMT0KC), _ICSPCS 2024_. [DOI](https://doi.org/10.1109/ICSPCS63175.2024.10815799).

[^illustrious]: Junha Lee et al., [Illustrious: An Open Advanced Illustration Model](https://arxiv.org/abs/2409.19946), 2024.

[^trustmark-repository]: [TrustMark official implementation](https://github.com/adobe/trustmark), Adobe, GitHub.

[^wam-paper]: Yuxuan Zhang et al., [Watermark Anything with Localized Messages](https://arxiv.org/abs/2411.07231), _ICLR 2025_.

[^wam-repository]: [Watermark Anything official implementation](https://github.com/facebookresearch/watermark-anything), Meta AI Research, GitHub.

[^synthid]: [SynthID](https://deepmind.google/models/synthid/), Google DeepMind.

[^gemini-verification]: [The Gemini app gets new image verification features](https://blog.google/innovation-and-ai/products/ai-image-verification-gemini-app/), Google, 20 November 2025.
