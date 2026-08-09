---
id: vast-ai
title: Vast.ai
summary: A distributed GPU-cloud marketplace that connects renters with independent hosts and also offers serverless inference and clusters.
locale: en
kind: company
revision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - Vast AI
  - Vast.ai Inc.
redirects:
  - vastai
related:
  - cloud-gpu-providers
  - inference-providers
  - runpod
  - prime-intellect
  - model-training
infobox:
  image:
    src: /media/companies/vast-ai/logo.svg
    alt: Vast.ai logo with an outlined V mark beside the Vast.ai wordmark
    crop: false
    surface: light
    caption: Official Vast.ai logo
    credit: Vast.ai
    sourceUrl: https://vast.ai/press-kit
    license: All rights reserved
  fields:
    - key: type
      value: Distributed GPU-cloud marketplace
    - key: founded
      value: 28 June 2016
    - key: founders
      value:
        - Jake Cannell
        - Christian Horne
    - key: headquarters
      value: Los Angeles, California, United States
    - key: key_people
      value:
        - Jake Cannell (chief executive)
        - Travis Cannell (chief operating officer)
    - key: industry
      value: Cloud computing and AI infrastructure
    - key: status
      value: Active; privately held as of July 2026
    - key: website
      value:
        text: vast.ai
        url: https://vast.ai/
---

**Vast.ai** is an American cloud-computing company that operates a distributed marketplace for
graphics-processing-unit capacity. Independent hosts list machines on the service, and renters
select them according to hardware, location, reliability, and price. Vast.ai provides the search,
provisioning, billing, reputation, and software control systems used by both parties.[^concepts][^press]

The company's marketplace instances form a [cloud GPU service](/cloud-gpu-providers/). Vast.ai
also offers Serverless workers and managed clusters, extending the platform into services that
overlap with [inference providers](/inference-providers/).[^start]

## History

Vast.ai was incorporated on 28 June 2016 by Jake Cannell and Christian Horne. Cannell developed the
idea while working with neural networks and seeking access to less expensive GPU hardware. The
marketplace became publicly available in 2018.[^about]

The company is headquartered in Los Angeles. Cannell serves as chief executive, while Travis Cannell
serves as chief operating officer. Vast.ai's press materials reported hundreds of independent hosts
across dozens of data centers by 2026.[^press] The number and location of active hosts changes with
marketplace supply.

## Marketplace

Hosts install Vast.ai software on compatible machines and publish offers containing their available
GPU, CPU, memory, storage, and network resources. They set the prices and remain responsible for
their hardware, internet connection, configuration, and maintenance.[^hosting] Hosts range from
individual operators to professional data centers.

Renters search the marketplace using attributes such as GPU model and count, memory, verification,
reliability, location, storage bandwidth, and network speed. After an offer is accepted, Vast.ai
starts a customer-selected Docker image with the resources assigned by the listing. Instances can
provide SSH, notebook, and web-service access.[^instances]

The ordinary instance product allocates a GPU to the renter's container, but does not provide a
complete physical-server environment. The host operating system and the Vast.ai host software
remain outside the container. CPU, disk, and network characteristics are specific to each listing.

Vast.ai distinguishes verified data-center machines from other marketplace hosts. Verification adds
platform checks to a listing but does not make all verified machines identical. Hardware
configuration, physical location, network design, and contractual arrangements continue to vary by
host.

## Pricing

Prices on Vast.ai are set by hosts and change with supply and demand. Compute, storage, and network
traffic may be charged separately. The platform supports on-demand, reserved, and interruptible
contracts.[^pricing]

On-demand contracts run while the renter continues to pay and the host remains available. Reserved
contracts provide a discount in exchange for an advance commitment. Interruptible instances are
lower-priced offers that can be displaced by another renter. Storage can continue to accrue charges
after compute has stopped, depending on the state of the instance.

Marketplace pricing permits similar GPUs to be offered at different rates. The cost of a completed
job also depends on storage speed, host reliability, data-transfer time, and interruptions. These
differences are more pronounced than in a standardized fleet operated by a single cloud company.

## Serverless and clusters

**Vast.ai Serverless** runs containerized workers in response to requests and adjusts capacity using
eligible marketplace machines.[^start] Customers provide the containerized application, while the
platform handles worker scheduling and request distribution. It is a more managed service than an
ordinary Vast.ai instance, although the application and model remain customer supplied.

The company also offers coordinated clusters and a **Secure Cloud** supply class.[^press] Clusters
are intended for workloads that require several linked accelerators, while Secure Cloud limits
deployment to infrastructure meeting additional operational requirements. These products use the
same broader platform but differ from an unrestricted marketplace search.

## Operational characteristics

The distributed supply model makes consumer GPUs, data-center accelerators, and otherwise idle
machines available through one interface. It also produces differences among offers that share the
same GPU model. Host processors, disks, network links, power limits, multi-GPU topology, and uptime
can all affect performance.

Security arrangements also depend on the host and service class. GPU allocation does not by itself
establish single tenancy for the complete physical machine, secure disk erasure, regulatory
compliance, or a particular jurisdiction. Vast.ai's verification and reliability data provide
information for selecting hosts, while the marketplace model leaves more infrastructure variation
visible to the renter than a conventional cloud does.

## References

[^concepts]: [Core concepts](https://docs.vast.ai/guides/concepts), Vast.ai documentation.

[^press]: [Press kit](https://vast.ai/press-kit), Vast.ai.

[^start]: [Get started with Vast.ai](https://docs.vast.ai/guides/get-started/index), Vast.ai documentation.

[^about]: [About Vast.ai](https://vast.ai/about), Vast.ai.

[^hosting]: [Hosting overview](https://docs.vast.ai/host/hosting-overview), Vast.ai documentation.

[^instances]: [Instances overview](https://docs.vast.ai/guides/instances/overview), Vast.ai documentation.

[^pricing]: [Instance pricing](https://docs.vast.ai/guides/instances/pricing), Vast.ai documentation.
