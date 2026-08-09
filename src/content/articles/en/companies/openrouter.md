---
id: openrouter
title: OpenRouter
summary: An AI inference gateway and marketplace that provides one API for models served by multiple underlying providers.
locale: en
kind: company
revision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - OpenRouter AI
  - OpenRouter Inc.
redirects:
  - open-router
related:
  - inference-providers
  - cloud-gpu-providers
  - weights-and-biases
  - cerebras
infobox:
  image:
    src: /media/companies/openrouter/logo.svg
    alt: OpenRouter logo with a purple geometric OR mark beside the openrouter wordmark
    crop: false
    surface: light
    caption: Official OpenRouter logo
    credit: OpenRouter
    sourceUrl: https://openrouter.ai/blog/announcements/brand-refresh/
    license: All rights reserved
  fields:
    - key: type
      value: AI inference gateway and marketplace
    - key: founded
      value: Early 2023
    - key: founders
      value:
        - Alex Atallah
        - Louis Vichy
    - key: headquarters
      value: New York City, New York, United States
    - key: key_people
      value: Alex Atallah (chief executive)
    - key: industry
      value: Artificial-intelligence infrastructure
    - key: status
      value: Active; privately held as of July 2026
    - key: website
      value:
        text: openrouter.ai
        url: https://openrouter.ai/
---

**OpenRouter** is an American artificial-intelligence company that operates an inference gateway and
marketplace. Its service gives developers access to models from multiple providers through a common
API, account, and billing system. OpenRouter routes each request to an eligible provider, which
performs the model computation.[^about][^faq]

The company is an [inference provider](/inference-providers/) at the user-facing service layer,
but does not ordinarily operate as a [cloud GPU provider](/cloud-gpu-providers/). It supplies
access to managed model endpoints rather than customer-administered accelerator instances. The
developer of a model, the company hosting it, and OpenRouter can be separate organizations.

## History

OpenRouter was founded in early 2023 by Alex Atallah and Louis Vichy. Atallah had previously
co-founded the NFT marketplace OpenSea and served as its chief technology officer.[^about][^a16z]
The service was developed in response to the growing number of model vendors, each with separate
accounts, interfaces, and availability characteristics.

On 28 May 2026, OpenRouter announced a US$113 million Series B financing led by CapitalG, with
participation from Andreessen Horowitz, Menlo Ventures, Sequoia Capital, and other investors. The
company said that its network contained more than 400 models and 70 providers at the time.[^series-b]
These figures vary as models and endpoints enter or leave the catalog.

OpenRouter introduced a new visual identity in July 2026. The redesign uses a geometric “OR” mark
inspired by Bauhaus forms.[^brand]

## Service

Applications send requests to OpenRouter using a model identifier and an OpenRouter API key. The
gateway authenticates and records the request, selects a provider endpoint, and relays the response.
Its API follows many conventions of the OpenAI API, allowing existing client libraries to be used
with a different base URL.[^faq] Model-specific features, parameter support, and response formats can
still vary.

The service distinguishes between a model and the provider endpoints that serve it. Several
providers may offer the same open-weight model, but use different hardware, quantization, context
limits, or inference software. OpenRouter publishes endpoint metadata and permits a request to be
restricted to particular providers or deployment characteristics.

OpenRouter's routing system can order providers by price, latency, or throughput and can fall back to
another endpoint after a failure. Routing can also be restricted by quantization and data
policy.[^routing] Unless the caller specifies a provider, successive requests to the same model can
be processed by different hosts.

## Pricing

OpenRouter consolidates usage charges across providers. The listed token price generally reflects
the price of the selected endpoint, while OpenRouter charges a fee when users purchase
credits.[^pricing] It also supports bring-your-own-key access for some providers, allowing their own
API credentials and billing relationship to be used through the OpenRouter interface.

This arrangement gives model hosts access to demand through a shared marketplace and allows
applications to use several providers without separate integrations. It also makes OpenRouter an
additional operational dependency between the application and the inference host.

## Data handling

OpenRouter states that prompt and response content is not stored by default, although request
metadata such as model, provider, token count, and latency is retained. Content logging can be
enabled by the user for supported features.[^data]

The policy of the selected provider applies separately. OpenRouter documents provider-level
retention and training policies and allows routing to be limited to endpoints marked as supporting
zero data retention.[^zdr] A request may consequently be subject to policies from both OpenRouter
and the company performing the inference.

## References

[^about]: [About OpenRouter](https://openrouter.ai/about), OpenRouter.

[^faq]: [Frequently asked questions](https://openrouter.ai/docs/faq), OpenRouter documentation.

[^a16z]: [Investing in OpenRouter](https://a16z.com/announcement/investing-in-openrouter/), Andreessen Horowitz, 26 June 2025.

[^series-b]: [OpenRouter raises $113M to build the universal AI interface](https://openrouter.ai/blog/series-b/), OpenRouter, 28 May 2026.

[^brand]: [OpenRouter's new look](https://openrouter.ai/blog/announcements/brand-refresh/), OpenRouter, 13 July 2026.

[^routing]: [Provider routing](https://openrouter.ai/docs/guides/routing/provider-selection), OpenRouter documentation.

[^pricing]: [Pricing](https://openrouter.ai/pricing), OpenRouter, accessed 18 July 2026.

[^data]: [Data collection](https://openrouter.ai/docs/guides/privacy/data-collection), OpenRouter documentation.

[^zdr]: [Zero data retention](https://openrouter.ai/docs/guides/features/zdr) and [provider data policies](https://openrouter.ai/docs/guides/privacy/provider-logging/), OpenRouter documentation.
