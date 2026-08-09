---
id: stability-ai
title: Stability AI
summary: A British generative-AI company best known for financing, releasing, and commercializing the Stable Diffusion family of image models.
locale: en
kind: company
revision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - Stability.ai
  - Stability AI Ltd
redirects:
  - stabilityai
related:
  - stable-diffusion
  - stable-diffusion-xl
  - low-rank-adaptation
  - model-training
infobox:
  fields:
    - key: type
      value: Generative-AI company
    - key: founded
      value: 2019 (incorporated 4 November)
    - key: founders
      value:
        - Emad Mostaque
        - Cyrus Hodes
    - key: headquarters
      value: London, England
    - key: key_people
      value:
        - Prem Akkaraju (chief executive)
        - Sean Parker (executive chair)
    - key: industry
      value: Artificial intelligence
    - key: status
      value: Active
    - key: website
      value:
        text: stability.ai
        url: https://stability.ai/
---

**Stability AI** is a British generative-artificial-intelligence company best known for its role in
funding, releasing, and commercializing the [Stable Diffusion](/stable-diffusion/) family of
image-generation models. The legal company Stability AI Ltd was incorporated in England and Wales on
4 November 2019.[^companies-house] Stability AI's own 2022 press material identified Emad Mostaque as
its founder; contemporary reporting and a company pitch-deck excerpt also identify Cyrus Hodes as a
co-founder.[^funding][^hodes]

Stable Diffusion made the company prominent, but the two names are not interchangeable. Stability AI
is an organization with products, employees, investors, and several model families; Stable Diffusion
is a family of model weights and architectures. Nor was the original model solely the company's
invention. It grew out of academic latent-diffusion research and a collaboration involving researchers
from Ludwig Maximilian University of Munich's CompVis group and Runway, with infrastructure and support
from Stability AI, LAION, EleutherAI, and others.[^ldm][^launch]

## Formation and early growth

Mostaque founded the company around the idea of making powerful generative models broadly accessible.
Its early strategy combined privately financed computing infrastructure with collaborations among
independent researchers and open research communities. In October 2022, shortly after Stable
Diffusion's public release, Stability AI announced a US$101 million funding round led by Coatue,
Lightspeed Venture Partners, and O'Shaughnessy Ventures.[^funding]

The company supplied the compute used to train the first Stable Diffusion release. Its own launch
account credits Patrick Esser of Runway and Robin Rombach of LMU Munich with leading the work, building
on the CompVis latent-diffusion project, while Stability AI's team and the LAION and EleutherAI
communities provided support. The first broadly public weights followed on 22 August 2022.[^launch][^public-release]

This division of labor matters historically. Calling Stability AI the _publisher_ or principal
commercial sponsor of the early model is accurate; describing the company as the only creator erases
the research lineage and collaborators. Later generations, including
[Stable Diffusion XL](/stable-diffusion-xl/) and Stable Diffusion 3, were developed and released
under Stability AI more directly.[^sdxl-paper][^sd3-paper]

## Models and products

Stability AI expanded from image generation into audio, video, 3D, and language research. Its better
known releases and services have included:

- **Stable Diffusion**, a succession of downloadable text-to-image models, including the 1.x, 2.x,
  SDXL, 3, and 3.5 generations.
- **Stable Image**, a set of hosted image-generation and editing services based on company models.
- **DreamStudio**, a consumer-facing web interface for generating images.
- **Stable Video**, **Stable Audio**, and several 3D model families.
- Developer APIs, deployment packages, custom-model work, and enterprise production tools.

The exact access and license terms differ by release. Early Stable Diffusion weights used variants of
the CreativeML Open RAIL license. SDXL 1.0 used CreativeML Open RAIL++-M, while Stable Diffusion 3.5
uses the later Stability AI Community License. The latter is free for non-commercial use and for
commercial organizations below its stated annual-revenue threshold, with an enterprise license
required in the covered cases above that threshold.[^sdxl-license][^community-license] Anyone using a
particular checkpoint should therefore read that checkpoint's model card and license rather than
assuming that every model carrying the “Stable” name has the same terms.

Stability AI commonly describes its downloadable releases as “open” or “open source.” The weights are
inspectable, runnable locally, and adaptable, which is substantially more open than an API-only
service. Some releases nevertheless impose use restrictions. Because the Open Source Initiative's
Open Source AI Definition requires freedom to use a system for any purpose, **open-weight** is often
the more precise neutral description for restricted-weight releases.[^osaid]

## Leadership change and commercial direction

Mostaque resigned as chief executive and from the board on 23 March 2024. Chief operating officer Shan
Shan Wong and chief technology officer Christian Laforte became interim co-chief executives.[^resignation]
On 25 June, Stability AI announced a new investment group, appointed former Weta Digital chief
executive Prem Akkaraju as chief executive, and made Sean Parker executive chair.[^new-investment]
Hanno Basse was appointed chief technology officer in August 2024, and filmmaker James Cameron joined
the board the following month.[^basse][^cameron]

Under this leadership, the company has emphasized professional media production, customized enterprise
systems, and partnerships as well as downloadable foundation models. A 2025 investment and research
partnership with advertising group WPP and the 2026 launch of the Brand Studio production platform
illustrate that direction.[^wpp][^news] Stability AI remained an active British company and continued
to announce new products as of July 2026; its May 2026 releases included the Stable Audio 3.0
family.[^companies-house][^news]

## Relationship with the community

Stable Diffusion's local weights enabled an unusually large third-party ecosystem. Developers built
interfaces such as AUTOMATIC1111's Stable Diffusion WebUI and ComfyUI; model trainers published
fine-tuned checkpoints and [LoRA](/low-rank-adaptation/) adapters; and artists developed workflows
around inpainting, ControlNet, reference images, and regional prompting. Much of this work is neither
made nor controlled by Stability AI. The company supplies some foundations and official tools, while
community developers independently maintain many of the applications that users casually call
“Stable Diffusion.”[^a1111][^comfyui]

That ecosystem has also outlived individual model generations. SDXL remains widely usable in local
tools even though newer Stability AI and non-Stability architectures can follow complex prompts more
reliably. Its continuing hobbyist role depends as much on accumulated adapters, checkpoints,
documentation, and consumer-hardware workflows as on the base model's original benchmark results.

## Disputes and criticism

The training of image generators on web-scale image-caption datasets produced disputes about consent,
copyright, attribution, bias, and labor. Getty Images sued Stability AI in the United Kingdom and the
United States, alleging among other things that company models were trained using Getty material.
In the English action, Getty abandoned its primary training-copying claim during trial. The High Court
rejected its remaining secondary-copyright-infringement theory because the models at issue did not
store or reproduce the copyrighted works, while finding limited trademark infringement involving
Getty watermarks in some earlier outputs.[^getty-judgment] That decision did not rule that all model
training is lawful: the territorial training claim was no longer before the court, and legal outcomes
depend on jurisdiction and facts.

Stability AI has also changed filtering, safety, and licensing policies across model generations.
Those controls can reduce some harmful outputs, but they create trade-offs: filters may remove lawful
material or degrade unrelated concepts, while locally runnable weights cannot be governed like a
centralized service. The company joined the Tech Coalition in 2026 after participating in its child-
safety program, one part of its stated safety work.[^tech-coalition]

## References

[^companies-house]: [Stability AI Ltd: company overview](https://find-and-update.company-information.service.gov.uk/company/12295325), UK Companies House.

[^funding]: [Stability AI announces $101 million in funding for open-source artificial intelligence](https://stability.ai/news-updates/stability-ai-announces-101-million-in-funding-for-open-source-artificial-intelligence), Stability AI, 17 October 2022.

[^hodes]: Kenrick Cai and Iain Martin, [Stability AI cofounder says Emad Mostaque tricked him into selling stake for $100](https://www.forbes.com/sites/kenrickcai/2023/07/13/stability-ai-cofounder-says-emad-mostaque-tricked-him-into-selling-stake-for-100/), _Forbes_, 13 July 2023.

[^ldm]: Robin Rombach et al., [High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752), _Proceedings of CVPR 2022_.

[^launch]: [Stable Diffusion launch announcement](https://stability.ai/news-updates/stable-diffusion-announcement), Stability AI, 10 August 2022.

[^public-release]: [Stable Diffusion public release](https://stability.ai/news-updates/stable-diffusion-public-release), Stability AI, 22 August 2022.

[^sdxl-paper]: Dustin Podell et al., [SDXL: Improving Latent Diffusion Models for High-Resolution Image Synthesis](https://arxiv.org/abs/2307.01952), _ICLR 2024_.

[^sd3-paper]: Patrick Esser et al., [Scaling Rectified Flow Transformers for High-Resolution Image Synthesis](https://arxiv.org/abs/2403.03206), 2024.

[^sdxl-license]: [CreativeML Open RAIL++-M License for SDXL 1.0](https://github.com/Stability-AI/generative-models/blob/main/model_licenses/LICENSE-SDXL1.0), Stability AI.

[^community-license]: [Stability AI Community License Agreement](https://stability.ai/license), Stability AI.

[^osaid]: [The Open Source AI Definition 1.0](https://opensource.org/ai/open-source-ai-definition), Open Source Initiative, 28 October 2024.

[^resignation]: [Stability AI announcement](https://stability.ai/news/stabilityai-announcement), Stability AI, 23 March 2024.

[^new-investment]: [Stability AI secures significant new investment and appoints Prem Akkaraju as CEO](https://stability.ai/news-updates/stability-ai-secures-significant-new-investment), Stability AI, 25 June 2024.

[^basse]: [Stability AI names Hanno Basse as new chief technology officer](https://stability.ai/news-updates/stability-ai-names-hanno-basse-as-new-chief-technology-officer), Stability AI, 19 August 2024.

[^cameron]: [James Cameron joins Stability AI board of directors](https://stability.ai/news-updates/james-cameron-joins-stability-ai-board-of-directors), Stability AI, 24 September 2024.

[^wpp]: [Stability AI announces investment from WPP and new partnership](https://stability.ai/news-updates/stability-ai-announces-investment-from-wpp-and-new-partnership-to-shape-the-future-of-media-and-entertainment-production), Stability AI, 5 March 2025.

[^news]: [News and updates](https://stability.ai/news-updates), Stability AI, accessed 12 July 2026.

[^a1111]: [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui), AUTOMATIC1111 contributors, GitHub.

[^comfyui]: [ComfyUI](https://github.com/comfyanonymous/ComfyUI), ComfyUI contributors, GitHub.

[^getty-judgment]: _Getty Images (US), Inc. and others v Stability AI Ltd_, [\[2025\] EWHC 2863 (Ch)](https://www.judiciary.uk/judgments/getty-images-and-others-v-stability-ai/), High Court of Justice of England and Wales, 4 November 2025.

[^tech-coalition]: [Stability AI joins the Tech Coalition](https://stability.ai/news-updates/stability-ai-joins-the-tech-coalition), Stability AI, 11 February 2026.
