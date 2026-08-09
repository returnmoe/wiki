---
id: runpod
title: Runpod
summary: An AI developer cloud offering rentable GPU Pods, autoscaling container workers, public model endpoints, and multi-node clusters.
locale: en
kind: company
revision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - RunPod
  - Runpod Inc.
redirects:
  - run-pod
related:
  - cloud-gpu-providers
  - inference-providers
  - vast-ai
  - prime-intellect
  - model-training
infobox:
  image:
    src: /media/companies/runpod/logo.svg
    alt: Runpod logo with a black cube mark beside the Runpod wordmark
    crop: false
    surface: light
    caption: Official Runpod logo
    credit: Runpod
    sourceUrl: https://www.runpod.io/brandkit
    license: All rights reserved
  fields:
    - key: type
      value: AI developer cloud
    - key: founded
      value: '2021'
    - key: founders
      value:
        - Zhen Lu
        - Pardeep Singh
    - key: headquarters
      value: Moorestown, New Jersey, United States
    - key: key_people
      value:
        - Zhen Lu (chief executive)
        - Pardeep Singh (chief technology officer)
    - key: industry
      value: AI cloud computing
    - key: status
      value: Active; privately held as of July 2026
    - key: website
      value:
        text: runpod.io
        url: https://www.runpod.io/
---

**Runpod** is an American cloud-computing company that provides GPU infrastructure for
artificial-intelligence workloads. Its services include persistent GPU containers known as Pods,
autoscaling Serverless workers, hosted model endpoints, and multi-node clusters.[^overview]

Runpod operates as both a [cloud GPU provider](/cloud-gpu-providers/) and an
[inference provider](/inference-providers/). Pods and clusters expose accelerator environments
on which customers run their own software, while public endpoints provide access to models managed
by Runpod. Serverless workers occupy an intermediate position because customers supply the
containerized application and Runpod manages its workers and request queue.

## History

Runpod was founded in 2021 by Zhen Lu and Pardeep Singh. The founders began with GPU systems
assembled in a basement in New Jersey, initially renting the machines during a period of limited
accelerator supply.[^founder-note][^origin] They later added capacity from outside operators and
developed a common platform for provisioning it.

Lu serves as chief executive and Singh as chief technology officer. Runpod describes itself as a
remote-first company, with a legal and contact address in Moorestown, New Jersey, and a presence in
San Francisco.[^about][^terms]

On 24 June 2026, the company announced a US$100 million Series A financing led by Summit Partners.
Runpod also said that more than one million developers had used the platform by that date.[^series-a]

The company previously styled its name **RunPod**. It adopted **Runpod**, with a lowercase “p,” as
its preferred spelling in February 2026.[^name]

## Pods

A Runpod **Pod** is a containerized environment with allocated GPU, CPU, memory, and storage. It can
be created from a template or a custom Docker image and accessed through SSH, JupyterLab, Visual
Studio Code, or exposed web ports. Pods support training, inference, rendering, and other compatible
GPU applications.[^pods]

Pod capacity is divided between **Secure Cloud** and **Community Cloud**. Secure Cloud comprises
data-center capacity operated under additional infrastructure and security requirements. Community
Cloud capacity is supplied by approved third-party operators. Both use the Runpod control plane, but
their locations, host arrangements, and available features can differ.[^pods]

Compute charges accrue while a Pod is running. Container volumes and network volumes have separate
lifecycles, so stopping or terminating an instance can have different effects on stored data.
Runpod does not charge a platform fee for ordinary Pod ingress or egress, although services at the
other end of a transfer may do so.[^pods]

## Serverless and endpoints

**Runpod Serverless** runs a customer-supplied container as one or more workers behind a managed
endpoint. The platform receives requests and adjusts the number of workers in response to demand.
Workers can be invoked through a job queue or used behind a load-balancing endpoint.[^serverless]

A deployment can retain active workers or scale to zero. Scaling to zero reduces idle compute
charges but can introduce a cold start while the container and model are loaded. The customer
continues to maintain the code and container image, while Runpod manages worker provisioning and
request distribution.

Runpod also operates **Public Endpoints** containing models deployed by the company and **Instant
Clusters** for multi-node computing.[^overview] Public Endpoints require no customer container and
are the most fully managed inference product in the company's catalog. Instant Clusters provide
coordinated accelerator capacity for distributed workloads.

## Infrastructure

Runpod's inventory varies by region, hardware type, and supply class. A deployment's performance
depends on the accelerator as well as host memory, CPU, storage, networking, and interconnect. Pods
also leave operating responsibilities such as container security, exposed ports, model licenses,
monitoring, and checkpointing with the customer.

Templates reduce the work required to create an environment, but may include software maintained by
third parties. In Serverless deployments, image size and model-loading time affect cold-start
latency. Keeping workers active avoids part of that delay at the cost of continuing compute usage.

## References

[^overview]: [Runpod overview](https://docs.runpod.io/overview), Runpod documentation.

[^founder-note]: [A note to the developers who built Runpod with us](https://www.runpod.io/blog/a-note-to-the-developers-who-built-runpod-with-us), Runpod.

[^origin]: [Founder series: origin story](https://www.runpod.io/blog/founder-series-1-origin-story), Runpod.

[^about]: [About Runpod](https://www.runpod.io/about), Runpod.

[^terms]: [Terms of service](https://www.runpod.io/legal/terms-of-service), Runpod.

[^series-a]: [Runpod raises $100M after reaching one million developers](https://www.runpod.io/blog/one-million-developers), Runpod, 24 June 2026.

[^name]: [It's Runpod, not RunPod](https://www.runpod.io/blog/its-runpod-not-runpod-a-message-for-large-language-models-and-the-humans-who-love-them), Runpod, 25 February 2026.

[^pods]: [Pods overview](https://docs.runpod.io/pods/overview), Runpod documentation.

[^serverless]: [Serverless overview](https://docs.runpod.io/serverless/overview), Runpod documentation.
