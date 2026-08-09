---
id: cerebras
title: Cerebras
summary: An American AI computing company that develops wafer-scale accelerators and offers hardware systems, cloud training, and managed inference.
locale: en
kind: company
revision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - Cerebras Systems
  - Cerebras Systems Inc.
redirects:
  - cerebras-systems
related:
  - inference-providers
  - cloud-gpu-providers
  - model-training
  - openrouter
  - weights-and-biases
infobox:
  image:
    src: /media/companies/cerebras/logo.svg
    alt: Cerebras logo with orange concentric arcs beside the Cerebras wordmark
    crop: false
    surface: light
    caption: Cerebras logo
    credit: Cerebras Systems
    sourceUrl: https://commons.wikimedia.org/wiki/File:Cerebras_logo.svg
    license: Public domain (simple geometric and text logo)
  fields:
    - key: type
      value: AI accelerator and cloud-computing company
    - key: founded
      value: '2015'
    - key: founders
      value:
        - Andrew Feldman
        - Gary Lauterbach
        - Michael James
        - Sean Lie
        - Jean-Philippe Fricker
    - key: headquarters
      value: Sunnyvale, California, United States
    - key: key_people
      value: Andrew Feldman (chief executive)
    - key: industry
      value: Semiconductors and artificial-intelligence computing
    - key: status
      value: Active; Nasdaq-listed as CBRS since May 2026
    - key: website
      value:
        text: cerebras.ai
        url: https://www.cerebras.ai/
---

**Cerebras Systems**, commonly known as **Cerebras**, is an American semiconductor and
artificial-intelligence computing company. It develops wafer-scale processors, complete computing
systems, and cloud services for model training and inference.[^company] The company is headquartered
in Sunnyvale, California.

The Cerebras Wafer-Scale Engine is a specialized AI accelerator rather than a graphics-processing
unit. Cerebras cloud services compete with [cloud GPU providers](/cloud-gpu-providers/) for some
workloads, but do not provide conventional GPU virtual machines. Its hosted model API, Cerebras
Inference, is an [inference provider](/inference-providers/).[^inference]

## History

Cerebras was founded in 2015 by Andrew Feldman, Gary Lauterbach, Michael James, Sean Lie, and
Jean-Philippe Fricker. Feldman became chief executive.[^company][^investor-faq] Several of the
founders had previously worked together at SeaMicro, a server company acquired by AMD in 2012.

The company introduced the first **Wafer-Scale Engine** (**WSE-1**) and the CS-1 system in 2019. The
second-generation WSE-2 and CS-2 followed in 2021. Cerebras announced its third-generation WSE-3 and
CS-3 in March 2024.[^company][^cs3]

Cerebras priced an initial public offering on 13 May 2026. Its shares began trading on the Nasdaq
Global Select Market under the symbol **CBRS** the following day.[^ipo][^investor-faq]

## Wafer-Scale Engine

Most semiconductor wafers are cut into many separate dies before packaging. Cerebras instead links
a grid of computing cores across most of a wafer and packages it as a single processor. Redundant
cores and communication links allow the design to operate around manufacturing defects.

The WSE-3 contains approximately four trillion transistors and 900,000 AI-oriented cores, according
to Cerebras. It is installed in the liquid-cooled **CS-3** system, which includes power, networking,
and supporting software.[^cs3][^system] External MemoryX systems store and stream model weights, while
the SwarmX interconnect links multiple CS systems.

Cerebras software compiles supported PyTorch models for the WSE and presents a cluster as a single
logical system.[^software] The platform has its own compiler, runtime, and software-development kit.
CUDA-specific programs and custom GPU kernels are not directly compatible with the WSE architecture.

## Products

Cerebras sells CS systems for installation in customer data centers. These systems provide local
control of hardware and data and can be joined into larger clusters.[^system] The company also makes
its hardware available through Cerebras Cloud and partner-operated facilities.

**AI Model Studio** is a managed training service hosted on dedicated CS-3 clusters at Cirrascale
Cloud. Customers submit supported PyTorch workloads and are charged for the model-training
service.[^software] The service abstracts the underlying wafer-scale cluster rather than exposing it
as a general-purpose accelerator virtual machine.

The company's software products are collectively known as **CSoft**. They include PyTorch
integration, a Model Zoo, the Cerebras SDK, and the Cerebras Software Language for lower-level
kernels.[^docs] Model compatibility and compiler support are significant parts of the platform
because software written specifically for GPU ecosystems may require adaptation.

## Cerebras Inference

Cerebras introduced its hosted inference service in August 2024.[^inference-launch] The service
operates supported open-weight models on WSE systems and exposes them through an OpenAI-compatible
API. A self-service pay-per-token tier was introduced in October 2025.[^pay-token]

Developer and enterprise plans provide different rate limits, priorities, service arrangements, and
support. Enterprise offerings also include custom model weights and training or fine-tuning
services.[^pricing] Cerebras determines the deployed model versions, serving software, and underlying
capacity.

The company markets the service primarily on token-generation speed and has published results
showing substantially higher output rates than selected GPU-based endpoints.[^inference] These are
company benchmarks and depend on the model, quantization, prompt length, concurrency, and measurement
method. Network latency and queueing also contribute to the response time experienced by an
application.

Cerebras distinguishes production models from preview models in its catalog. Available models and
their status can change as new versions are introduced or older deployments are retired.[^models]
The service is also available through partners including OpenRouter, which can act as a separate
routing and billing layer.

## Business

Cerebras earns revenue from hardware systems, cloud capacity, software, and related services. Its
public-offering filings describe a business dependent on specialized semiconductor manufacturing,
cloud infrastructure, and a limited number of large customers.[^s1] The company's architecture
provides an alternative to GPU clusters for supported workloads, while its distinct software and
hardware environment can create additional work when moving applications to or from GPU platforms.

## References

[^company]: [Company](https://www.cerebras.ai/company), Cerebras.

[^inference]: [Cerebras Inference](https://www.cerebras.ai/inference), Cerebras.

[^investor-faq]: [Investor FAQs](https://investors.cerebras.ai/shareholder-services/investor-faqs/), Cerebras.

[^cs3]: [Cerebras CS-3](https://www.cerebras.ai/blog/cerebras-cs3), Cerebras, 12 March 2024.

[^ipo]: [Cerebras Systems announces pricing of initial public offering](https://investors.cerebras.ai/news-releases/news-release-details/cerebras-systems-announces-pricing-initial-public-offering), Cerebras, 13 May 2026.

[^system]: [CS-3 system](https://www.cerebras.ai/system/), Cerebras.

[^software]: [Cerebras software platform](https://www.cerebras.ai/product-software), Cerebras.

[^docs]: [Cerebras developer documentation](https://docs.cerebras.ai/), Cerebras.

[^inference-launch]: [Introducing Cerebras Inference](https://www.cerebras.ai/blog/introducing-cerebras-inference-ai-at-instant-speed), Cerebras, 27 August 2024.

[^pay-token]: [Cerebras Inference now available via pay per token](https://www.cerebras.ai/blog/cerebras-inference-now-available-via-pay-per-token), Cerebras, 13 October 2025.

[^pricing]: [Pricing](https://www.cerebras.ai/pricing), Cerebras, accessed 18 July 2026.

[^models]: [Model overview](https://inference-docs.cerebras.ai/models/overview), Cerebras inference documentation.

[^s1]: [Form S-1 registration statement](https://www.sec.gov/Archives/edgar/data/2021728/000162828026029503/cerebras-sx1amay2026.htm), Cerebras Systems, filed with the US Securities and Exchange Commission, 2026.
