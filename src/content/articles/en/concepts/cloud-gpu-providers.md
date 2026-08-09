---
id: cloud-gpu-providers
title: Cloud GPU Providers
summary: Services that rent remote GPU or accelerator capacity, contrasted with providers that expose models through managed inference endpoints.
locale: en
kind: concept
revision: 1
categories:
  - artificial-intelligence
aliases:
  - Cloud GPU instance providers
  - GPU cloud providers
  - GPU rental providers
redirects:
  - cloud-gpu-instance-providers
  - gpu-cloud-providers
  - gpu-rental-providers
related:
  - inference-providers
  - runpod
  - vast-ai
  - prime-intellect
  - cerebras
  - model-training
infobox:
  fields:
    - key: type
      value: Remote accelerator-infrastructure service category
---

A **cloud GPU provider** rents remote graphics-processing-unit (**GPU**) capacity. The service may
take the form of a virtual machine, container, bare-metal server, node, or multi-node cluster. Cloud
GPUs are widely used for artificial-intelligence [model training](/model-training/) and
inference, as well as rendering, simulation, video processing, and other parallel workloads.

The term covers several business models. General-purpose public clouds operate GPUs alongside a
broad range of computing services. Specialist GPU clouds concentrate on accelerator workloads, while
marketplaces aggregate machines owned by independent hosts. Some platforms combine capacity from
several established cloud providers. The category is also applied informally to other AI
accelerators, although systems such as the wafer-scale processors sold by
[Cerebras](/cerebras/) are not GPUs.

## Services

GPU-backed virtual machines resemble other infrastructure-as-a-service products, but include one or
more attached accelerators. Containers or pods provide a prepared software environment with less
control over the host operating system. Bare-metal services allocate an entire physical server.
Clusters add scheduling and high-speed communication across multiple nodes.

Allocation does not always involve a complete physical device. Some clouds offer fractional GPUs
through virtualization or hardware partitioning. Google Compute Engine supports both pass-through
GPUs and fractional configurations.[^google-attached] A product described as dedicated can refer to
an accelerator, virtual machine, physical host, or cluster, and these arrangements provide different
levels of isolation.

Cloud GPU contracts are commonly offered on demand or through a reservation. Spot and interruptible
instances use spare capacity at a lower price but can be reclaimed. Vast.ai uses on-demand, reserved,
and interruptible contracts in a marketplace where hosts set the prices of compute, storage, and
network traffic.[^vast-pricing]

## Types of provider

Amazon Web Services, Google Cloud, and Microsoft Azure are examples of general public clouds with GPU
instances. Google describes Compute Engine as suitable for individual GPU virtual machines and
smaller clusters, while Vertex AI provides a more managed environment for AI workloads.[^google-gpus]
Amazon offers accelerated EC2 instance families in addition to the managed Amazon Bedrock model
service.[^aws-ec2][^bedrock] These companies operate as both cloud GPU providers and
[inference providers](/inference-providers/), depending on the product.

Specialist clouds generally offer a smaller range of conventional cloud services but provide
AI-oriented images, storage, templates, and provisioning. [Runpod](/runpod/) Pods give customers
a persistent GPU container with SSH and notebook access. The same company also operates Serverless
workers and public model endpoints.[^runpod-pods]

Distributed marketplaces use a common control plane to list hardware from several owners.
[Vast.ai](/vast-ai/) connects renters with independent hosts and runs customer-selected Docker
images on the accepted offer.[^vast-concepts][^vast-instances] [Prime Intellect](/prime-intellect/)
aggregates established cloud suppliers and adds provisioning and orchestration through its Compute
platform.[^prime-compute] Neither company necessarily owns the physical accelerator selected for
every job.

## Relationship to inference providers

A cloud GPU service supplies a computing environment. The customer installs or selects the model,
runtime, framework, and serving software, and is responsible for much of the deployment's operation.
An inference provider supplies a model endpoint whose underlying accelerator and serving system are
managed as part of the service.

The division is based on operational control rather than tenancy. A dedicated inference endpoint can
reserve capacity without exposing its operating system, while a GPU instance can use a virtualized
fraction of a device. Serverless products offered by GPU clouds occupy an intermediate position:
customers provide a container or program, but the platform manages worker allocation and scaling.

Training is another distinction. A general GPU instance can run any compatible training or inference
workload permitted by the provider. Managed inference APIs use an existing model and do not usually
allow its base weights to be changed. Managed training platforms are a separate category, although
they may be sold by the same company.

## Hardware and performance

GPU model and memory capacity are the most visible specifications, but they do not determine
performance alone. Host memory, CPU capacity, local and persistent storage, PCIe generation, power
limits, and software versions can constrain a job. Multi-GPU and multi-node workloads also depend on
the topology and bandwidth of the interconnect.

These differences are especially pronounced in marketplaces. Offers for the same GPU model can use
different processors, disks, networks, and data-center arrangements. Reliability and verification
scores provide information about a listing but do not make the underlying machines uniform.

Distributed training requires more than an adequate total GPU count. Communication between nodes can
dominate the run, and an interruption can invalidate work since the previous checkpoint. Cluster
location, network fabric, checkpoint storage, and recovery behavior are consequently part of the
effective performance of the service.

## Pricing

Cloud GPU prices are normally quoted per machine-hour or GPU-hour. The full cost may also include
persistent storage, public addresses, network transfer, reserved capacity, and idle time during
setup. Storage charges can continue after compute is stopped, depending on the provider and the
volume type.

The lowest hourly rate does not always produce the lowest cost for a completed job. A more expensive
accelerator may finish sooner or provide enough memory for a more efficient batch size. Conversely,
slow storage, network transfers, or interrupted jobs can outweigh a low compute price.

Self-managed inference on a rented instance tends to become more economical as utilization rises.
For an intermittent service, the cost of idle replicas and their administration can exceed the
per-request price of managed inference. Production systems sometimes combine a base GPU fleet with a
managed service for temporary demand.

## Administration and security

The infrastructure model divides responsibility between provider and customer. The provider manages
facilities, physical hardware, and the service control plane. Customers generally manage account
credentials, operating-system or container software, model weights, exposed ports, data, and
application-level access controls.

Templates and prebuilt images reduce setup time but remain part of the software supply chain.
Ephemeral storage can be lost when an instance is terminated, while persistent volumes may continue
to exist and incur charges. Long-running training jobs also require monitoring and checkpointing,
since hardware replacement does not automatically restore application state.

Marketplace deployments add the host operator to the trust relationship. Host verification, physical
location, disk erasure, network isolation, and contractual responsibility vary by service class.
These differences are relevant when a workload contains confidential or regulated data, even when
the accelerator itself is allocated exclusively to one renter.

## References

[^google-attached]: [About GPUs](https://docs.cloud.google.com/compute/docs/gpus/about-gpus), Google Cloud documentation.

[^vast-pricing]: [Instance pricing](https://docs.vast.ai/guides/instances/pricing), Vast.ai documentation.

[^google-gpus]: [GPU platforms](https://docs.cloud.google.com/compute/docs/gpus/overview), Google Cloud documentation.

[^aws-ec2]: [Amazon EC2 accelerated computing instances](https://aws.amazon.com/ec2/instance-types/accelerated-computing/), Amazon Web Services.

[^bedrock]: [Amazon Bedrock documentation overview](https://aws.amazon.com/documentation-overview/bedrock/), Amazon Web Services.

[^runpod-pods]: [Pods overview](https://docs.runpod.io/pods/overview), Runpod documentation.

[^vast-concepts]: [Core concepts](https://docs.vast.ai/guides/concepts), Vast.ai documentation.

[^vast-instances]: [Instances overview](https://docs.vast.ai/guides/instances/overview), Vast.ai documentation.

[^prime-compute]: [Introducing Prime Intellect Compute](https://www.primeintellect.ai/blog/compute), Prime Intellect, 1 July 2024.
