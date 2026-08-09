---
id: agentic-ai-foundation
title: Agentic AI Foundation
summary: A Linux Foundation directed fund that provides a vendor-neutral home for open-source standards and infrastructure used by AI agents.
locale: en
kind: organization
revision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - AAIF
related:
  - model-context-protocol
  - anthropic
infobox:
  fields:
    - key: type
      value: Linux Foundation directed fund
    - key: formed
      value: 9 December 2025
    - key: founders
      value:
        - text: Anthropic
          article: anthropic
        - text: Block
        - text: OpenAI
    - key: purpose
      value: Vendor-neutral stewardship of open-source agentic AI infrastructure
    - key: parent
      value: Linux Foundation
    - key: status
      value: Active
    - key: website
      value:
        text: aaif.io
        url: https://aaif.io/
---

The **Agentic AI Foundation** (**AAIF**) is a directed fund under the Linux Foundation that provides
a vendor-neutral home for open-source standards, protocols, and software used to build **AI
agents**. It was formed on 9 December 2025 to support shared development, community participation,
and interoperable infrastructure across otherwise competing AI companies and platforms.[^formation]

Despite its name, AAIF is not a developer of a foundation model and does not regulate AI systems.
It is an organizational and governance home: the Linux Foundation supplies institutional support,
while participating companies, maintainers, and other contributors develop its hosted
projects.[^structure]

## Formation and projects

AAIF was co-founded by Anthropic, Block, and OpenAI, with initial support from Amazon Web Services,
Bloomberg, Cloudflare, Google, and Microsoft. Each co-founder contributed a project at launch:

- Anthropic contributed the **[Model Context Protocol](/model-context-protocol/)** (**MCP**), an
  open protocol for connecting AI applications to tools and data.
- Block contributed **goose**, an open-source, local-first framework for running AI agents with
  different language models and tools.
- OpenAI contributed **AGENTS.md**, a Markdown-file convention for giving coding agents
  repository-specific instructions.[^formation]

On 4 June 2026, **agentgateway** became AAIF's fourth hosted project. It is an open-source gateway for
managing MCP, agent-to-agent, language-model, API, and service traffic through a common control
plane.[^agentgateway] These four were the projects listed by AAIF as of 14 July 2026.[^projects]

## Governance and role

AAIF's public structure includes a **Governing Board** and a **Technical Committee**, with
representatives from member organizations and hosted projects.[^governance] This foundation-wide
structure does not turn the projects into one product: MCP is a protocol, AGENTS.md is a convention,
goose is an agent framework, and agentgateway is operational infrastructure. Each has its own
repository, contributors, releases, and technical scope.

Moving a project into AAIF is intended to reduce control by any single vendor and provide shared
institutional, financial, and community support. Technical development still occurs through the
projects' maintainer and contribution processes. Anthropic, for example, stated when donating MCP
that its maintainers and community-driven decision process would remain in place.[^mcp-governance]

## References

[^formation]: [Linux Foundation announces the formation of the Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation), Linux Foundation, 9 December 2025.

[^structure]: [OpenAI co-founds the Agentic AI Foundation under the Linux Foundation](https://openai.com/index/agentic-ai-foundation/), OpenAI, 9 December 2025.

[^agentgateway]: [agentgateway joins AAIF as an open gateway for agentic AI infrastructure](https://aaif.io/blog/agentgateway-joins-aaif-as-an-open-gateway-for-agentic-ai-infrastructure/), Agentic AI Foundation, 4 June 2026.

[^projects]: [Projects](https://aaif.io/projects/), Agentic AI Foundation, accessed 14 July 2026.

[^governance]: [Governing Board](https://aaif.io/board/) and [Technical Committee](https://aaif.io/tc/), Agentic AI Foundation, accessed 14 July 2026.

[^mcp-governance]: [Donating the Model Context Protocol and establishing the Agentic AI Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation), Anthropic, 9 December 2025.
