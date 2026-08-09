---
id: comfyui
title: ComfyUI
summary: An open-source node-based interface and inference engine for constructing and running generative-media workflows.
locale: en
kind: software
revision: 1
categories:
  - software
  - artificial-intelligence
aliases:
  - Comfy UI
related:
  - rina
  - diffusion-models
  - stable-diffusion
  - stable-diffusion-xl
infobox:
  fields:
    - key: developer
      value: comfyanonymous and contributors
    - key: platform
      value:
        - Windows
        - Linux
        - macOS
    - key: technologies
      value:
        - Python
        - PyTorch
    - key: repository
      value:
        text: github.com/Comfy-Org/ComfyUI
        url: https://github.com/Comfy-Org/ComfyUI
    - key: license
      value: GPL-3.0
    - key: status
      value: Active
    - key: website
      value:
        text: comfy.org
        url: https://www.comfy.org/
---

**ComfyUI** is an open-source, node-based interface and inference engine for constructing and
running generative-artificial-intelligence workflows. It was written by the pseudonymous developer
**comfyanonymous** and other contributors and is maintained in the Comfy-Org organization on
GitHub.[^documentation][^repository]

ComfyUI is not itself a generative model. It provides the graph editor, execution engine, model
loaders, queue, and interfaces used to connect models and operations into reproducible workflows.
The model weights used by a graph remain separate software and data artifacts.

## Workflow model

A ComfyUI **workflow** is a graph of connected **nodes**. Each node performs a task, exposes typed
inputs and outputs, and passes its results to other nodes through links. A graph can therefore
express a process such as loading a model, encoding a prompt, sampling a latent representation,
decoding an image, and saving the result without fixing those steps behind a single-purpose
interface.[^workflow][^nodes]

Workflows can be saved as human-readable JSON. ComfyUI also embeds workflow information in supported
generated files, allowing a user to reopen the graph that produced an output. When a graph is run
again, the execution engine can reuse unchanged results and execute only the portions affected by
changed inputs.[^workflow][^repository]

The local server accepts workflows through an HTTP API, places them in an execution queue, and uses
a WebSocket connection for progress messages. This allows the visual interface and automated
production pipelines to use the same graph execution model.[^server-api]

## Models and media

ComfyUI became widely associated with [diffusion-model](/diffusion-models/) image workflows and
supports families including [Stable Diffusion](/stable-diffusion/) and [Stable Diffusion
XL](/stable-diffusion-xl/). Its scope is broader than one model family: the project documents
workflows for image generation and editing, video, audio, and 3D content. Exact model support changes
as core nodes and templates are updated.[^repository]

The core application can run locally and does not require Comfy's hosted service. Official
distribution options include desktop builds, a Windows portable package, and manual installation on
Windows, Linux, and macOS. **Comfy Cloud** is a separate hosted way to execute compatible workflows;
optional API nodes can also call external model providers.[^repository][^installation]

## Extensibility and operational considerations

The base installation includes officially maintained **Comfy Core** nodes. Community authors can
add **custom nodes**, which may implement new model integrations, processing operations, or interface
extensions. Custom nodes can bring their own Python dependencies, and incompatible dependency pins
can break other extensions in the same environment.[^custom-nodes]

Because custom nodes are executable extensions rather than inert workflow data, their source and
provenance matter. ComfyUI's registry standards prohibit obfuscated code, runtime package
installation, and uses of `eval` or `exec` that can enable arbitrary-code-execution
vulnerabilities.[^registry-standards] A shared workflow may therefore be portable as JSON while
still requiring particular model files and trusted node packages to run correctly.

## Use with Rina

At Rio Maker Space's Arduino Day 2025, [Rodrigo Laneth](/rodrigo-laneth/) presented ComfyUI as
the visual counterpart to the [Rina](/rina/) language-model demonstration. The combined lesson
introduced attendees with no previous AI-character-design or system-prompting experience to both
conversational character design and the generation of visual character assets.

Laneth self-hosted both the Rina services and ComfyUI on the same dedicated cloud GPU instance. This
was a deployment of the open-source ComfyUI server on infrastructure controlled by Laneth, not a use
of the Comfy Cloud service. Rina's language-model chat and the ComfyUI image-generation workflows
were separate workloads sharing that compute infrastructure.

## References

[^documentation]: [ComfyUI official documentation](https://docs.comfy.org/).

[^repository]: [ComfyUI source repository](https://github.com/Comfy-Org/ComfyUI).

[^workflow]: [Workflow](https://docs.comfy.org/development/core-concepts/workflow), ComfyUI documentation.

[^nodes]: [Nodes](https://docs.comfy.org/development/core-concepts/nodes), ComfyUI documentation.

[^server-api]: [ComfyUI server routes](https://docs.comfy.org/development/comfyui-server/comms_routes), ComfyUI documentation.

[^installation]: [Manual installation](https://docs.comfy.org/installation/manual_install), ComfyUI documentation.

[^custom-nodes]: [Custom nodes](https://docs.comfy.org/development/core-concepts/custom-nodes), ComfyUI documentation.

[^registry-standards]: [Registry standards](https://docs.comfy.org/registry/standards), ComfyUI documentation.
