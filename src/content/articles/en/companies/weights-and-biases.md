---
id: weights-and-biases
title: Weights & Biases
summary: An AI developer platform for experiment tracking, model and dataset management, application evaluation, and hosted inference, owned by CoreWeave.
locale: en
kind: company
revision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - W&B
  - WandB
  - Weights and Biases
  - Weights & Biases, Inc.
redirects:
  - wandb
  - weights-biases
  - weights-and-biases-inc
related:
  - inference-providers
  - cloud-gpu-providers
  - model-training
  - prime-intellect
  - cerebras
infobox:
  image:
    src: /media/companies/weights-and-biases/logo.png
    alt: Weights & Biases logo with gold dot columns, the company name, and a by CoreWeave endorsement
    crop: false
    surface: light
    caption: Official Weights & Biases logo
    credit: Weights & Biases
    sourceUrl: https://wandb.ai/site/brand-identity/
    license: All rights reserved
  fields:
    - key: type
      value: AI developer-platform company
    - key: founded
      value: '2017'
    - key: founders
      value:
        - Lukas Biewald
        - Chris Van Pelt
        - Shawn Lewis
    - key: headquarters
      value: San Francisco, California, United States
    - key: key_people
      value: Lukas Biewald (general manager)
    - key: industry
      value: MLOps and AI developer tools
    - key: parent
      value: CoreWeave
    - key: status
      value: Active subsidiary of CoreWeave
    - key: website
      value:
        text: wandb.ai
        url: https://wandb.ai/
---

**Weights & Biases** (**W&B**) is an American software company that develops tools for building,
evaluating, and operating machine-learning systems. Its platform includes experiment tracking,
model and dataset versioning, application tracing, evaluations, and hosted inference. The company
was founded in 2017 by Lukas Biewald, Chris Van Pelt, and Shawn Lewis.[^about]

GPU-cloud operator CoreWeave acquired Weights & Biases in May 2025.[^acquisition] W&B continues to
operate as a product organization under CoreWeave, with Biewald as general manager. Its software
remains compatible with computing infrastructure and model services from other companies.

## History

Biewald and Van Pelt had previously co-founded the data-labeling company CrowdFlower, later known as
Figure Eight. They established Weights & Biases with Lewis to improve the recording and comparison
of machine-learning experiments. Biewald became chief executive, Van Pelt chief information officer,
and Lewis chief technology officer.[^about]

The company's first major product combined an open-source Python client with a hosted dashboard for
experiment tracking. It later added hyperparameter sweeps, collaborative reports, artifact
versioning, model registries, and enterprise deployment options. W&B expanded into generative-AI
observability with **Weave**, a system for tracing and evaluating applications that use language and
multimodal models.

CoreWeave completed its acquisition of W&B on 5 May 2025. The companies said that W&B would retain
support for multiple clouds, infrastructure platforms, and model providers.[^acquisition]

## W&B Models

**W&B Models** is the part of the platform concerned with the machine-learning development
lifecycle. Its Experiments service records metrics, configuration, outputs, and hardware
utilization from training runs. Sweeps coordinates hyperparameter searches, while Artifacts and
Registry version datasets, checkpoints, and related assets. Reports and Automations provide
collaborative analysis and event-driven workflows.[^models]

The training computation ordinarily takes place on infrastructure selected by the customer. The W&B
client records information from the run and sends it to a hosted or privately deployed W&B service.
Experiment tracking does not place the training workload on W&B or CoreWeave hardware.

Artifact versioning records the files and lineage supplied by a project. Reproducibility still
depends on the completeness of the logged code, data, configuration, and software environment.

## Weave

**W&B Weave** provides observability and evaluation for generative-AI applications. It records
structured traces of model calls, retrieval, tools, and agent steps, and can compare application
versions against evaluation datasets.[^platform] Weave integrates with third-party model APIs as
well as self-hosted models.

When Weave records a call to another company's model, W&B provides the tracing layer rather than the
model inference. Traces can include prompts, retrieved documents, tool inputs, outputs, and user
data, making their access and retention distinct from ordinary numerical training metrics.

## W&B Inference

**W&B Inference**, also called **Serverless Inference**, is a managed model-serving service. It
provides access to supported open-weight foundation models through an OpenAI-compatible API and the
Weave interface.[^inference][^api] Customers can also serve compatible LoRA weights without
operating a dedicated model endpoint.[^inference-product]

Inference requests run on CoreWeave infrastructure and can be traced and evaluated with Weave.[^inference-product]
For these requests, W&B functions as an [inference provider](/inference-providers/). The product
does not provide customer-administered GPU virtual machines of the kind associated with a
[cloud GPU provider](/cloud-gpu-providers/).

The available model catalog changes over time. W&B classifies models as generally available,
deprecated, or retired, and publishes retirement notices through its model-lifecycle
documentation.[^lifecycle]

## Deployment and data

The W&B developer platform is available as a shared hosted service, a managed dedicated deployment,
or software deployed in a customer's own environment, depending on the subscription.[^pricing]
These options concern the W&B application and its stored metadata; the training infrastructure being
observed can have a separate tenancy arrangement.

Information sent to W&B can include source-control metadata, hyperparameters, metrics, hardware
telemetry, media, model outputs, datasets, checkpoints, and Weave traces. The company provides role-
based access controls, encryption, private connectivity, and customer-managed deployment options for
enterprise use.[^data]

The acquisition by CoreWeave brought infrastructure, managed inference, and developer tooling under
the same corporate owner. They remain separate services: CoreWeave operates GPU infrastructure, W&B
Inference serves models, and W&B Models and Weave record development and application data.

## References

[^about]: [About Weights & Biases](https://site.wandb.ai/company/about-us/), Weights & Biases.

[^acquisition]: [CoreWeave completes acquisition of Weights & Biases](https://coreweave.com/blog/coreweave-completes-acquisition-of-weights-biases), CoreWeave, 5 May 2025.

[^models]: [W&B Models](https://wandb.ai/site/models/), Weights & Biases.

[^platform]: [Weights & Biases platform](https://site.wandb.ai/), Weights & Biases.

[^inference]: [Serverless Inference](https://docs.wandb.ai/inference), Weights & Biases documentation.

[^api]: [Serverless Inference API overview](https://docs.wandb.ai/inference/api-reference), Weights & Biases documentation.

[^inference-product]: [W&B Serverless Inference](https://wandb.ai/site/inference/), Weights & Biases.

[^lifecycle]: [Model lifecycle](https://docs.wandb.ai/inference/lifecycle), Weights & Biases documentation.

[^pricing]: [Pricing and deployment options](https://wandb.ai/site/pricing/), Weights & Biases.

[^data]: [Data security and privacy](https://wandb.ai/site/data/), Weights & Biases.
