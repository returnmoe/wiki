---
id: return-moe-wiki
title: return moe wiki
summary: The community-editable reference for return moe and relevant connected subjects, with explicit authoritative designations where applicable.
locale: en
kind: project
revision: 1
categories:
  - projects
  - wiki
aliases:
  - wiki.return.moe
  - return moe reference wiki
related:
  - return-moe
  - soraya
  - rodrigo-laneth
  - authoritative-articles
  - informational-ontology
infobox:
  fields:
    - key: type
      value: Reference wiki
    - key: focus
      value: Documented context and explicitly tagged authoritative material
    - key: affiliation
      value:
        text: return moe
        article: return-moe
    - key: repository
      value:
        text: github.com/returnmoe/wiki
        url: https://github.com/returnmoe/wiki
    - key: website
      value:
        text: wiki.return.moe
        url: https://wiki.return.moe
    - key: status
      value: Active
---

The **return moe wiki** is a reference for [return moe](/return-moe/) and relevant connected
subjects. It records definitions, relationships, history, and attribution in a form that can be
reviewed independently of a running model, application, or social account.[^repository]

The wiki is centered on return moe, but it is not limited to subjects created or owned by the
studio. A partner-created character, outside researcher, independent project, external organization,
or third-party tool may have an article when it provides material context. Such an article must
identify the subject's actual creator, owner, developer, and affiliations without implying that it
belongs to return moe.[^repository]

## Authoritative articles

The wiki is descriptive by default. Only an article displaying the explicit
[authoritative designation](/authoritative-articles/) is a primary source for return moe lore
or worldbuilding, or for an explicitly stated return moe conceptual framework. Being a character
article, covering a subject created by return moe, or belonging to any particular category does not
confer that status.[^repository]

For example, [Soraya](/soraya/) carries the notice, so her current article records the branch
maintained by return moe when prompts, regenerated avatar images, language models, or inconsistent
model answers change. That status does not make fan-maintained branches less valid; it identifies the
source for claims specifically about return moe's continuity. Another character may instead be
defined primarily by a separate work, such as a visual novel, and its wiki article is not
authoritative unless it displays the same notice.[^repository]

The authoritative [Informational Ontology Framework (return moe)](/informational-ontology/) article serves a different
scope: it defines return moe's framework for fictional characters and related personas. Its notice
makes it an official statement of that framework, not a claim that every external work it discusses
shares the same position.

## Editing and governance

Articles and categories are Markdown files in the official repository. Corrections can be proposed
through issues, and source changes can be submitted as pull requests targeting the `master` branch.
This reviewable history makes disagreements and revisions visible instead of allowing a transient
generated answer to become authoritative.[^repository]

Manual updates are allowed. Using artificial intelligence to draft or revise content is also
allowed and actively encouraged, provided that the result maintains the wiki's overall tone and
meets the same sourcing, attribution, and editorial standards as manually written work.

When AI is used, a sufficiently capable AI agent is strongly preferred—for example, Anthropic's
Claude Cowork or Claude Code, or OpenAI's ChatGPT Work or Codex. The agent should be able to find and
consult sources, ask clarifying questions, process information accurately, and identify and correct
its own mistakes. In every case, human review for correctness and clarity is mandatory before
publication.[^repository]

English is the source edition. Brazilian Portuguese pages are translations and record which English
revision they represent so the site can flag an outdated translation.[^repository]

## Technology and search

The site is generated as static HTML with Astro and is served at `wiki.return.moe`. Production builds
create a Pagefind index from article titles, aliases, summaries, categories, and prose. Search runs
in the browser and does not require a hosted search service.[^repository]

The repository is the editing and review surface, but the site is not published through GitHub
Pages.[^repository]

## References

[^repository]: [return moe wiki repository](https://github.com/returnmoe/wiki).
