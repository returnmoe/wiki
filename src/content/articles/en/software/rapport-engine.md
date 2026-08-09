---
id: rapport-engine
title: Rapport Engine
summary: The discontinued Python interaction engine that brought structure to Soraya's early scripts.
locale: en
kind: software
revision: 1
categories:
  - software
  - artificial-intelligence
aliases:
  - return moe Rapport Engine
related:
  - soraya
  - return-moe
infobox:
  fields:
    - key: developer
      value:
        text: return moe
        article: return-moe
    - key: repository
      value:
        text: github.com/returnmoe/rapport_engine
        url: https://github.com/returnmoe/rapport_engine
    - key: status
      value: Discontinued
---

**Rapport Engine** was a discontinued Python interaction engine used in an early implementation of
[Soraya](/soraya/). It was introduced around January 2024 and discontinued in July 2025.

## Use by Soraya

Soraya's first chatbot implementation was a collection of Python scripts. Rapport Engine was an
attempt to give that collection a more structured form; it was introduced around January 2024,
rather than being the software used for her March 2023 release. Like the scripts before it, the
engine was an implementation detail of the chatbot rather than part of the character's canonical
identity.[^identity-essay]

The public repository describes Rapport Engine as a Python engine for Telegram bots using
OpenAI-compatible APIs and lists Soraya as its demonstration bot.[^rapport-repository]

## Discontinuation

[return moe](/return-moe/) announced the engine's discontinuation in July 2025. The
announcement stated that Soraya would move to other, more capable private tools and workflows for
future character and interaction projects.[^new-beginning]

The source repository remains part of the public history of Soraya's technical implementations.
Rapport Engine is no longer part of her active workflow and does not describe her current private
tools or architecture.[^rapport-repository][^architecture]

## References

[^rapport-repository]: [Rapport Engine repository](https://github.com/returnmoe/rapport_engine).

[^identity-essay]: [Echoes in the Latent Space: Existence, Identity, and Future](https://blog.return.moe/en/2025/08/02/echoes-in-the-latent-space/), return moe blog.

[^new-beginning]: [A new beginning](https://blog.return.moe/en/2025/07/09/a-new-beginning/), return moe blog.

[^architecture]: [Soraya's new architecture](https://blog.return.moe/en/2025/08/11/sorayas-new-architecture/), return moe blog.
