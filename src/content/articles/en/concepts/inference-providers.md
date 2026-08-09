---
id: inference-providers
title: Inference Providers
summary: Services that run trained AI models behind managed endpoints, contrasted with infrastructure services that rent accelerator instances.
locale: en
kind: concept
revision: 1
categories:
  - artificial-intelligence
aliases:
  - AI inference providers
  - Model inference providers
  - Managed inference providers
redirects:
  - ai-inference-providers
  - managed-inference-providers
related:
  - cloud-gpu-providers
  - openrouter
  - runpod
  - vast-ai
  - prime-intellect
  - weights-and-biases
  - cerebras
  - model-training
infobox:
  fields:
    - key: type
      value: Managed AI model-serving service category
---

An **inference provider** is a service that operates trained artificial-intelligence models and makes
them available through an application programming interface or other managed endpoint. Customers
submit text, images, audio, or other inputs and receive the model's output without administering the
servers on which the model runs. The provider generally manages the model weights, inference
software, accelerator hardware, scaling, and billing.

The expression describes a service rather than a distinct class of company. Model developers can
serve their own proprietary models, specialist hosts can operate open-weight models, and gateways can
route requests among several hosts. General cloud-computing companies also offer managed inference
alongside conventional virtual machines. Hugging Face uses the term **Inference Providers** for a
service that gives users access to models hosted by several companies through common authentication
and billing.[^hf] Amazon Bedrock is another multi-model service, although Amazon describes it as a
fully managed foundation-model platform rather than using the same category name.[^bedrock]

## Operation

An inference service loads a model into memory and runs it with a serving system designed to accept
requests from multiple applications. The service may batch compatible requests, maintain replicas,
replace failed workers, and add or remove capacity as demand changes. Authentication, usage limits,
streaming responses, monitoring, and model-version management are also commonly part of the service.

The amount of customer control varies. Catalog services expose a selection of preconfigured models
and generation settings. Managed endpoint products may permit a customer to deploy a checkpoint,
container, quantized model, or [LoRA](/low-rank-adaptation/) adapter. Serverless endpoints can
reduce their worker count when idle, while provisioned-throughput services reserve capacity for a
customer. Both are forms of managed inference because the provider continues to operate the serving
environment.

Inference is distinct from [model training](/model-training/). Training changes a model's
parameters, whereas inference uses an existing set of parameters to generate a prediction or other
result. Some companies offer both services, but training is usually presented as a separate product
with different hardware, scheduling, and billing.

## Relationship to cloud GPU services

A [cloud GPU provider](/cloud-gpu-providers/) rents an accelerator-backed computing environment.
The customer generally chooses and operates the model server, framework, drivers, and model weights.
An inference provider instead supplies an operating model endpoint. Cloud GPU services are commonly
billed by instance or accelerator time, while inference services are often billed by tokens, images,
requests, processing time, or reserved throughput.

| Characteristic     | Managed inference                            | Cloud GPU instance                         |
| ------------------ | -------------------------------------------- | ------------------------------------------ |
| Principal resource | Model endpoint                               | Accelerator-backed machine or container    |
| Model server       | Operated by provider                         | Operated by customer                       |
| Customer access    | API or product interface                     | Shell, VM, container, or cluster interface |
| Typical billing    | Request, token, output, or reserved capacity | Instance or accelerator time               |
| Training support   | Separate product when available              | Possible on the rented environment         |

This distinction does not correspond directly to tenancy. A managed endpoint can reserve hardware
for a single customer, while a GPU virtual machine can use a fractional or virtualized accelerator.
The word **dedicated** may refer to an endpoint, virtual machine, accelerator, physical host, or
cluster, depending on the product.

Large cloud platforms operate at both levels. Google Compute Engine offers virtual machines with GPUs,
whereas Vertex AI Model Garden includes models served through managed APIs and models deployed to
managed Vertex endpoints.[^gcp-gpus][^model-garden] Amazon similarly offers GPU-backed EC2 instances
and the separate Bedrock model service.[^ec2][^bedrock] The same company can offer both inference
services and cloud GPU instances without the products being equivalent.

## Service models

First-party model APIs are operated by the organization that develops the model. They are the usual
means of accessing proprietary models whose production weights are not distributed. The developer
controls model revisions, rate limits, safety systems, and the available interface.

Multi-model hosts operate models from several developers, particularly open-weight models. They
provide a common account and API while selecting the inference runtime, quantization, batching policy,
and hardware for each deployment. Catalogs change as models are introduced, updated, or retired.

Gateways and marketplaces add another layer. [OpenRouter](/openrouter/) accepts a request through
one API and forwards it to an eligible provider endpoint. Its routing controls can take price,
availability, latency, throughput, and data policy into account.[^or-routing] The model developer,
gateway, inference host, and physical cloud operator can consequently be four different organizations.

Managed custom endpoints occupy a middle position between catalog APIs and infrastructure rental.
[Runpod](/runpod/) Serverless runs customer-supplied containers as autoscaled workers, leaving
the customer responsible for the containerized application while Runpod operates the request queue
and worker fleet.[^runpod-serverless] [W&B Inference](/weights-and-biases/) provides hosted
open-weight models through an OpenAI-compatible API and can serve supported customer LoRA
weights.[^wandb-inference]

## Pricing and performance

Usage-based inference is well suited to applications with variable demand because inactive model
servers do not produce a visible instance charge. At sustained utilization, self-managed accelerator
capacity may have a lower direct cost. Comparisons depend on idle capacity, engineering work,
replication, storage, networking, and failure recovery as well as the advertised token or
accelerator price.

Inference latency includes network transit, admission queues, model preparation, time to first token,
and output generation. Serverless endpoints can incur a cold start when no suitable worker is active.
Provisioned capacity reduces this source of delay but introduces a standing charge.

Routing among providers can improve availability, although it can also affect reproducibility.
Endpoints listed under the same model name may use different quantizations, kernels, safety systems,
or model revisions. Provider selection and response metadata are relevant when a deployment requires
stable evaluation results.

## Data handling

Managed inference sends inputs to an external service, and routed services can add further
intermediaries. Each organization in the request path may have its own policies for logging,
retention, model training, abuse monitoring, and geographic processing.

OpenRouter states that it does not retain prompt and response content by default, but it records
request metadata and forwards content to the chosen host. It publishes endpoint-level data policies
and allows requests to be restricted to providers represented as supporting zero data
retention.[^or-data] Similar distinctions apply to other gateways. A data policy at the customer-facing
endpoint does not by itself describe every underlying operator.

API compatibility also has limits. Services that implement an OpenAI-style interface can differ in
supported parameters, context length, tool calls, error responses, content controls, and model
lifecycle. The common interface reduces integration work but does not make the services technically
or contractually identical.

## References

[^hf]: [Inference Providers](https://huggingface.co/docs/inference-providers/en/index), Hugging Face documentation.

[^bedrock]: [Amazon Bedrock documentation overview](https://aws.amazon.com/documentation-overview/bedrock/), Amazon Web Services.

[^gcp-gpus]: [GPU platforms](https://docs.cloud.google.com/compute/docs/gpus/overview), Google Cloud documentation.

[^model-garden]: [Explore models in Model Garden](https://cloud.google.com/vertex-ai/generative-ai/docs/model-garden/explore-models), Google Cloud documentation.

[^ec2]: [Amazon EC2 accelerated computing instances](https://aws.amazon.com/ec2/instance-types/accelerated-computing/), Amazon Web Services.

[^or-routing]: [Provider routing](https://openrouter.ai/docs/guides/routing/provider-selection), OpenRouter documentation.

[^runpod-serverless]: [Serverless overview](https://docs.runpod.io/serverless/overview), Runpod documentation.

[^wandb-inference]: [Serverless Inference](https://docs.wandb.ai/inference), Weights & Biases documentation.

[^or-data]: [Data collection](https://openrouter.ai/docs/guides/privacy/data-collection) and [provider data policies](https://openrouter.ai/docs/guides/privacy/provider-logging/), OpenRouter documentation.
