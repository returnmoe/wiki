---
id: prime-intellect
title: Prime Intellect
summary: An AI platform and research company combining aggregated accelerator compute, managed reinforcement-learning infrastructure, inference, and open-model research.
locale: en
kind: company
revision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - Prime Intellect Inc.
redirects:
  - primeintellect
related:
  - cloud-gpu-providers
  - inference-providers
  - runpod
  - vast-ai
  - model-training
infobox:
  image:
    src: /media/companies/prime-intellect/logo.png
    alt: Prime Intellect white abstract bird-and-quill logo on a black square
    crop: false
    caption: Official Prime Intellect logo
    credit: Prime Intellect
    sourceUrl: https://www.primeintellect.ai/
    license: All rights reserved
  fields:
    - key: type
      value: AI infrastructure platform and research company
    - key: founded
      value: '2023'
    - key: founders
      value:
        - Vincent Weisser
        - Johannes Hagemann
    - key: headquarters
      value: San Francisco, California, United States
    - key: key_people
      value:
        - Vincent Weisser (chief executive)
        - Johannes Hagemann (chief technology officer)
    - key: industry
      value: Artificial-intelligence infrastructure and research
    - key: status
      value: Active; privately held as of July 2026
    - key: website
      value:
        text: primeintellect.ai
        url: https://www.primeintellect.ai/
---

**Prime Intellect** is an American artificial-intelligence infrastructure and research company. Its
services include a marketplace for accelerator capacity, managed reinforcement-learning and
evaluation systems, and model inference. The company also develops open-source training software and
publishes open-weight models.[^home]

Prime Intellect's Compute marketplace is a [cloud GPU service](/cloud-gpu-providers/), while its
Lab and Inference products provide managed training and [inference](/inference-providers/).
Physical capacity is supplied by a network of cloud companies rather than a single fleet owned by
Prime Intellect.

## History

Prime Intellect was founded in 2023 by Vincent Weisser and Johannes Hagemann. Weisser serves as chief
executive and Hagemann as chief technology officer. The company announced a US$5.5 million seed
financing in April 2024 to develop a distributed computing and model-training platform.[^seed]

In February 2025, Prime Intellect announced a further US$15 million financing led by Founders Fund,
bringing its reported funding above US$20 million.[^fundraise] On 8 July 2026, it announced a US$130
million Series A led by Radical Ventures. NVIDIA Ventures, Intel Capital, Dell Technologies Capital,
and existing investors also participated. The company reported total financing of more than US$150
million and more than 6,000 customers.[^series-a]

Prime Intellect employs staff in San Francisco and remotely. Prime Intellect Inc. is registered in
Delaware, with a registered office in Dover.[^home][^imprint]

## Compute

Prime Intellect introduced its **Compute** marketplace in July 2024. The service aggregates machines
and clusters from several infrastructure providers through a common interface. Customers select an
accelerator type, number of devices, location, and other requirements, and the platform provisions a
matching offer.[^compute]

The marketplace includes individual machines, multi-GPU nodes, and reserved clusters. Prime
Intellect's terms describe the service as a marketplace in which offerings may be supplied by third
parties. Use of a machine can also be governed by the underlying cloud provider's terms.[^terms]

Compute acts as a brokerage and orchestration layer. Hardware security, networking, storage,
availability, and geographic location depend in part on the selected supplier. The common interface
standardizes provisioning but does not make all of the underlying infrastructure identical.

## Lab and inference

**Prime Intellect Lab** is a managed platform for reinforcement-learning post-training and
evaluation. It became generally available in May 2026 and combines hosted training jobs,
environments, rollouts, evaluations, checkpoints, and adapter deployment.[^lab] Environments can be
created with the company's open-source Verifiers framework or selected from a public hub.

Lab abstracts the distributed training infrastructure from the customer and can charge for work in
units such as processed tokens. It differs from a Compute instance, where the customer receives an
accelerator environment and configures the training stack directly.

**Prime Inference** serves supported models through serverless or dedicated endpoints.[^home]
Dedicated endpoints reserve capacity for a workload while leaving the serving environment under
Prime Intellect's management. The product does not expose the same administrative access as a
Compute machine.

## Research

Prime Intellect conducts research into training models across geographically distributed and
heterogeneous hardware. Its **INTELLECT-1** project trained a 10-billion-parameter language model
using machines in five countries across three continents, reaching a reported maximum of 112 H100
GPUs. The company released checkpoints, data, and a technical report in December 2024.[^intellect-1]

**INTELLECT-2**, released in May 2025, applied globally distributed reinforcement learning to a
32-billion-parameter reasoning model.[^intellect-2] Subsequent work has included synthetic-data
generation, reinforcement-learning software, and larger open models.

The company uses **decentralized** to describe computing supplied by multiple operators, training
that spans several locations, and collaborative development of models or datasets. Customer
deployments still use Prime Intellect's central marketplace, accounts, scheduling, and billing.
Some workloads run on conventional cloud providers through that control plane rather than on
community-owned hardware.

## References

[^home]: [Prime Intellect](https://www.primeintellect.ai/), official website.

[^seed]: [Prime Intellect secures $5.5M in seed funding](https://www.prnewswire.com/news-releases/prime-intellect-secures-5-5m-in-seed-funding-co-led-by-distributed-global-and-coinfund-to-advance-its-decentralized-and-collaborative-ai-ecosystem-302124585.html), Prime Intellect press release, 23 April 2024.

[^fundraise]: [$15M to build the open superintelligence stack](https://www.primeintellect.ai/blog/fundraise), Prime Intellect, 28 February 2025.

[^series-a]: [$130M Series A to build the open superintelligence stack](https://www.primeintellect.ai/blog/series-a), Prime Intellect, 8 July 2026.

[^imprint]: [Imprint](https://www.primeintellect.ai/imprint), Prime Intellect.

[^compute]: [Introducing Prime Intellect Compute](https://www.primeintellect.ai/blog/compute), Prime Intellect, 1 July 2024.

[^terms]: [Terms of service](https://www.primeintellect.ai/terms-of-service), Prime Intellect.

[^lab]: [Prime Intellect Lab is open](https://www.primeintellect.ai/blog/lab-is-open), Prime Intellect, 7 May 2026.

[^intellect-1]: [INTELLECT-1 release](https://www.primeintellect.ai/blog/intellect-1-release), Prime Intellect, 2 December 2024.

[^intellect-2]: [INTELLECT-2 release](https://www.primeintellect.ai/blog/intellect-2-release), Prime Intellect, 12 May 2025.
