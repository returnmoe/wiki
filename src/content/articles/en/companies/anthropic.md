---
id: anthropic
title: Anthropic
summary: An American public-benefit AI company that develops the Claude model family and conducts research on alignment, interpretability, and frontier-model safety.
locale: en
kind: company
revision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - Anthropic PBC
  - Anthropic AI
redirects:
  - anthropic-pbc
related:
  - mechanistic-interpretability
  - jacobian-lens
  - persona-selection-model
  - model-training
  - model-context-protocol
infobox:
  fields:
    - key: type
      value: Delaware public benefit corporation
    - key: founded
      value: Early 2021
    - key: founders
      value:
        - Dario Amodei
        - Daniela Amodei
        - Tom Brown
        - Jack Clark
        - Jared Kaplan
        - Sam McCandlish
        - Christopher Olah
    - key: headquarters
      value: San Francisco, California, United States
    - key: key_people
      value:
        - Dario Amodei (chief executive)
        - Daniela Amodei (president)
    - key: industry
      value: Artificial intelligence
    - key: status
      value: Active; privately held as of July 2026
    - key: website
      value:
        text: anthropic.com
        url: https://www.anthropic.com/
---

**Anthropic** is an American artificial-intelligence company that develops the proprietary
**Claude** family of language models and conducts research on AI alignment, interpretability, model
evaluation, and the social effects of advanced AI. It was founded in early 2021 by former OpenAI
employees and is led by siblings Dario Amodei, its chief executive, and Daniela Amodei, its
president.[^series-b][^founders]

Anthropic is a for-profit **Delaware public benefit corporation** (**PBC**), not a nonprofit research
institute. Its stated public-benefit purpose is the responsible development and maintenance of
advanced AI for humanity's long-term benefit. The company combines that mission with commercial
products, private shareholders, large infrastructure commitments, and institutional investors.[^company][^ltbt]

“Anthropic” and “Claude” are not interchangeable. Anthropic is the organization; Claude is its model
and product family. The company also develops software such as Claude Code, publishes research,
operates an API, and originated the [Model Context Protocol](/model-context-protocol/).

## Founding

Anthropic began operating at the start of 2021 after a group of researchers and executives left
OpenAI. The seven founders commonly identified in contemporary reporting are Dario and Daniela
Amodei, Tom Brown, Jack Clark, Jared Kaplan, Sam McCandlish, and Christopher Olah.[^founders] Their
prior specialties included large-scale language-model training, policy, scaling laws, and
[mechanistic interpretability](/mechanistic-interpretability/).

The company announced a US$124 million financing in May 2021, saying it would initially concentrate
on research into reliable and steerable general AI systems. A US$580 million Series B in April 2022
funded large-scale experimental infrastructure for robustness, steerability, and interpretability
research.[^funding][^series-b] These early announcements already expressed the strategy that
continued to define Anthropic: train models near the capability frontier both as commercial systems
and as experimental subjects for safety research.

Anthropic's founders have generally described their departure from OpenAI in terms of shared trust,
values, and mission rather than publishing a complete account of the disagreement. Reporting has
connected the split to differences over governance and how quickly increasingly capable systems
should be commercialized, but those accounts should not be treated as a single documented founding
event.[^time-profile]

## Claude and other products

Anthropic introduced Claude publicly on 14 March 2023 after a closed period with early partners.
Claude was offered through a chat interface and developer API for summarization, question answering,
writing, coding, and other language tasks.[^claude-launch] Unlike an open-weight model, a production
Claude checkpoint is not distributed for users to run or inspect locally. Users access models through
Anthropic's services or supported cloud platforms; system cards disclose selected architecture-
independent evaluations, training methods, and risks rather than the full weights and training
corpus.

The Claude 3 release in March 2024 established three recurring product tiers:

- **Haiku**, optimized for speed and lower cost;
- **Sonnet**, intended to balance capability, speed, and price; and
- **Opus**, the highest-capability tier.[^claude-3]

These are product classes, not fixed architectures. Their version numbers can advance independently.
As of July 2026, recent releases included Claude Sonnet 5, Claude Opus 4.8, and the more capable Claude
Fable 5.[^sonnet-5][^opus-48][^fable-launch] Model rankings and prices change rapidly, so an
application should select an exact model identifier and consult its current system card rather than
relying on the tier name alone.

**Claude Code** is Anthropic's agentic software-development tool. It began as a command-line research
preview and became generally available with the Claude 4 models in May 2025, with terminal, editor,
and background-workflow integrations.[^claude-4] It is a product built around Claude models, tools,
permissions, and a software agent loop—not a separate foundation model.

Anthropic released the **[Model Context Protocol](/model-context-protocol/)** (**MCP**) in
November 2024 as an open protocol for connecting AI applications to tools and data sources through a
common client-server interface.[^mcp]
The company later donated MCP to the Agentic AI Foundation, a Linux Foundation directed fund
co-founded with Block and OpenAI.[^mcp-donation] MCP is model-neutral despite its origins: clients and
servers need not use Claude.

Claude is also available through Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Azure. Cloud
distribution lets customers use Claude within an existing provider's identity, billing, regional,
and compliance controls, but it adds another contractual and technical layer between the customer
and the model.[^amazon][^cloud-compute][^microsoft-nvidia]

## Research

Anthropic divides much of its safety work into **alignment capabilities**, which attempt to make
models safer or more controllable, and **alignment science**, which investigates whether those
methods work and how failures could emerge as capabilities scale. Its published work also covers
frontier threat evaluation, red teaming, model welfare, security, economic effects, and policy.[^core-views]

### Constitutional AI

**Constitutional AI** is Anthropic's best-known training contribution. In the original method, a
written list of principles guides a model in critiquing and revising its own responses. A supervised
stage trains on the revisions; a preference stage has a model compare candidate responses under the
principles, producing **reinforcement learning from AI feedback** (**RLAIF**). Humans still choose the
constitution, training setup, and evaluation criteria, but they need not label every harmful output
pair directly.[^constitutional-ai]

The word “constitution” is an analogy, not a claim that the document has democratic or legal
authority. Its effects depend on which principles are included, how conflicts are resolved, what the
feedback model understands, and which behaviors the evaluations measure. Anthropic has published
several iterations and experiments involving public input; Claude's production behavior also depends
on other [model-training](/model-training/) stages, system prompts, runtime safeguards, and
product policies.

### Interpretability and alignment science

Interpretability has been part of Anthropic's research identity since its founding. Work associated
with its researchers helped develop the superposition account of polysemantic features, scaled sparse
autoencoders to frontier language models, and constructed attribution graphs intended to trace parts
of a model's computation. Anthropic released open tools for applying one version of circuit tracing
to compatible open-weight models.[^circuit-tools]

This work is influential but partial. Sparse features and attribution graphs are fitted explanatory
models with reconstruction error and methodological choices; they are not complete source code for a
neural network's behavior. Anthropic's own publications present scalable interpretability as an open
engineering and scientific problem rather than a solved safety check.[^interpretability-engineering]

Two 2026 research proposals covered elsewhere in this wiki illustrate the program's range. The
[Persona Selection Model](/persona-selection-model/) treats post-trained assistant behavior as
selection and refinement of a character-like Assistant persona. The
[Jacobian Lens](/jacobian-lens/) uses averaged first-order downstream effects to read and
intervene on vocabulary-linked directions in intermediate representations.[^psm][^j-lens] Both are
research frameworks with stated limitations that address only parts of model behavior.

## Governance

### Public-benefit corporation and trust

Delaware PBC status permits Anthropic's directors to balance shareholder interests, the company's
specified public benefit, and the interests of people materially affected by its conduct. It does
not eliminate shareholders, profits, executive control, or ordinary commercial incentives.[^ltbt]

Anthropic added a separate **Long-Term Benefit Trust** (**LTBT**) to its corporate governance. The
trust is designed as a financially disinterested body with power to select and remove a portion of
the board. Its authority was scheduled to increase over time, ultimately to a board majority. In
April 2026, Anthropic said trust-appointed directors had reached that majority.[^ltbt][^narasimhan]
The company's current governance page lists directors and trustees, while emphasizing that both
stockholders and the LTBT elect board members.[^company]

The LTBT is an institutional mechanism, not an independent regulator or a guarantee of safe outcomes.
Anthropic itself described the structure as an experiment. Its founding documents include amendment
and supermajority provisions, and trustees depend on information and evaluation processes supplied
partly by the company.[^ltbt]

### Responsible Scaling Policy

The **Responsible Scaling Policy** (**RSP**), first published in September 2023, connects evaluated
model capabilities to graduated security and deployment safeguards called **AI Safety Levels**. Its
thresholds focus particularly on catastrophic misuse and autonomy risks. Later versions added risk
reports, assurance processes, internal reporting, and external review mechanisms.[^rsp]

The policy has changed repeatedly as Anthropic gained implementation experience. Version 3.2 took
effect on 29 April 2026 and expanded the LTBT's role in requesting external review and approving
reviewer selection. Version 3.3 took effect on 26 May and revised a chemical-and-biological-weapons
capability threshold and the process for off-cycle model-risk updates. The current version, 3.4,
took effect on 8 July. It revised the automated-research-and-development threshold, rules for
distributing and dating risk reports, public indications of redactions, and how external review can
be divided among reviewers.[^rsp] Revision can be useful when threats and evaluation methods change,
but it also means that an RSP commitment must be read in the version governing a particular training
or deployment decision. The policy is a company commitment, not a statutory licensing regime, and
much of its evidence is produced or commissioned by Anthropic.

System cards, capability evaluations, red-team reports, and the RSP make more information public than
a product claim alone. They still cannot establish the absence of an unknown failure mode. Claude can
hallucinate, be jailbroken, mishandle ambiguous instructions, or use tools incorrectly; a model's
“safety” is conditional on the threat model, deployment controls, and evidence tested.

## Financing and computing infrastructure

Frontier-model training and serving require capital, specialized chips, data centers, and long-term
cloud capacity. Amazon's investments in Anthropic totaled US$8 billion by November 2024, while Amazon
remained a minority investor and AWS became Anthropic's primary cloud and training partner.[^amazon]
Anthropic has also used Google TPUs and NVIDIA GPUs and expanded Claude distribution to Microsoft
Azure, pursuing a multi-platform compute strategy despite AWS's primary-partner status.[^cloud-compute][^microsoft-nvidia]

These relationships combine investment, model distribution, chip collaboration, and large purchase
commitments. They do not make Amazon, Google, Microsoft, or NVIDIA Anthropic's parent company. They do
create mutual dependencies: Anthropic needs enormous compute supply, while the cloud providers use
Claude to attract customers to their platforms.

On 28 May 2026, Anthropic announced a US$65 billion Series H financing at a US$965 billion post-money
valuation.[^series-h] A private-round valuation is an implied transaction price, not a public market
capitalization or an independent measure of social value. On 1 June, the company confidentially
submitted a draft Form S-1 for a possible initial public offering. The submission began a regulatory
process but did not itself make Anthropic a publicly traded company.[^s1] Anthropic therefore remained
privately held as of 12 July 2026.

## Criticism and disputes

### Openness and concentration

Anthropic argues that training frontier models is necessary both to study their risks and to compete
on safety. The same strategy concentrates model access, unpublished weights, training data, and
evaluation infrastructure within a privately controlled company. External researchers can inspect
papers, system cards, APIs, and selected open tools, but cannot independently reproduce a production
Claude model from the information released.

This produces a recurring trade-off. Keeping weights private can reduce theft and some forms of
unrestricted misuse, while limiting independent auditing, local control, and scientific replication.
Commercial success funds research and deployment safeguards, while investor and customer demands can
increase pressure to train and release models quickly. PBC status, the LTBT, and the RSP are intended
to manage those incentives; their effectiveness must be judged from decisions and evidence rather
than organizational labels.

### Copyright and training data

Authors have sued Anthropic over books used in model development. In _Bartz v. Anthropic_, a federal
district court held in June 2025 that using the books at issue to train the company's language models
was fair use under the facts before it. The same order held that downloading and retaining pirated
copies to build a central library was not justified as fair use.[^bartz-order] These are distinct
holdings: the decision did not declare every way of acquiring training data lawful.

Anthropic later agreed to a US$1.5 billion class settlement covering qualifying books from the LibGen
and PiLiMi collections, with destruction obligations for specified source files. The court granted
preliminary approval in 2025; final approval remained pending after a May 2026 fairness hearing.[^bartz-settlement][^settlement-status]
Music publishers have pursued separate claims concerning lyrics and alleged acquisition of works;
those proceedings were still active in 2026.[^music-case]

### Military-use restrictions

Anthropic has sold Claude access for government and national-security uses while maintaining some
usage restrictions. In February 2026, a dispute with the United States Department of Defense became
public after Anthropic refused proposed terms that it said could permit mass domestic surveillance
and fully autonomous weapons. The department disputed Anthropic's characterization of its intended
uses and designated the company a supply-chain risk.[^dow-statement][^dod-ap]

Anthropic challenged the designation, and a federal judge temporarily blocked the Pentagon's action
in March.[^dod-injunction] The episode demonstrates a practical consequence of company-level model
governance: a private developer can attempt to restrict customers, including governments, but those
restrictions can collide with procurement power, national-security authorities, and democratic
questions about who should set military policy.

### Fable 5, Mythos 5, and the June 2026 suspension

Anthropic launched **Claude Fable 5** on 9 June 2026 as the first generally available member of a
capability tier it calls **Mythos-class**, above the Opus class. Fable 5 and the restricted-access
**Claude Mythos 5** use the same underlying model. Their product distinction is principally the
deployment safeguards: Fable routes requests in some sensitive cybersecurity, biology, chemistry,
and suspected model-distillation cases to Opus 4.8, while Mythos exposes more of the base model's
capabilities to a small trusted-access group. Anthropic reported that the fallback activated in fewer
than 5 percent of Fable sessions on average, while acknowledging false positives on benign
work.[^fable-launch]

This means that “Fable 5” describes more than a checkpoint. The delivered service includes input
classifiers, fallback routing, monitoring, and access policy. Two users sending the same prompt to
the same named product can therefore receive behavior from different model tiers depending on a
safeguard decision. Mythos 5 is not simply a higher-priced public Fable mode; its less-restricted
deployment was initially limited to selected cyberdefenders and infrastructure providers through
Project Glasswing.[^fable-launch]

The launch also changed data handling for Mythos-class services. Anthropic required 30-day retention
of Fable 5 and Mythos 5 traffic even on business surfaces, saying that the records would be used for
safety monitoring rather than model training and deleted after the period in almost all cases. That
policy improves the provider's ability to detect attacks spanning many requests, but removes the
zero-retention option some organizations require for sensitive work.[^fable-launch]

Three days after launch, the United States government issued an export-control directive barring
access to Fable 5 and Mythos 5 by foreign nationals. Because Anthropic said it could not reliably
verify every user's nationality immediately, it suspended both models for all customers on 12 June.
The government cited national-security authority but did not publicly detail its evidence; Anthropic
said it understood the concern to involve a reported bypass of Fable's cyber safeguards.[^fable-suspension][^fable-ap]

Anthropic later said Amazon researchers had demonstrated a prompt that bypassed a classifier and, in
one case, elicited proof-of-concept exploit code. The company disputed that the behavior revealed
unique Mythos-level capability, but trained an additional classifier targeting the reported method
and began developing a common jailbreak-severity framework with industry and government partners.
The controls were lifted on 30 June. Fable 5 returned globally on 1 July, while Mythos 5 access
remained limited to approved organizations.[^fable-redeployment][^fable-framework]

The episode exposed a difficult frontier-model trade-off. Runtime classifiers can make a more capable
base model broadly usable without permanently removing the restricted capability from its weights,
but they can also block legitimate dual-use research, silently substitute a weaker model, and be
attacked separately from the model they guard. The rapid government intervention also showed that
model availability can depend on export controls and identity rules, not only on provider capacity
or an API's technical stability.

## References

[^series-b]: [Anthropic raises Series B to build steerable, interpretable, robust AI systems](https://www.anthropic.com/news/anthropic-raises-series-b-to-build-safe-reliable-ai), Anthropic, 29 April 2022.

[^founders]: Alex Konrad, [Anthropic's $60 billion valuation to mint seven new billionaires](https://www.forbes.com/sites/alexkonrad/2025/01/08/anthropic-60-billion-valuation-will-make-all-seven-cofounders-billionaires/), _Forbes_, 8 January 2025.

[^company]: [Company](https://www.anthropic.com/company), Anthropic, accessed 12 July 2026.

[^ltbt]: [The Long-Term Benefit Trust](https://www.anthropic.com/news/the-long-term-benefit-trust), Anthropic, 19 September 2023.

[^funding]: [Anthropic raises $124 million to build more reliable, general AI systems](https://www.anthropic.com/news/anthropic-raises-124-million-to-build-more-reliable-general-ai-systems), Anthropic, 28 May 2021.

[^time-profile]: Billy Perrigo, [Inside Anthropic, the AI company betting that safety can be a winning strategy](https://time.com/collections/time100-companies-2024/6980000/anthropic-2/), _Time_, 30 May 2024.

[^claude-launch]: [Introducing Claude](https://www.anthropic.com/news/introducing-claude), Anthropic, 14 March 2023.

[^claude-3]: [Introducing the next generation of Claude](https://www.anthropic.com/news/claude-3-family), Anthropic, 4 March 2024.

[^sonnet-5]: [Introducing Claude Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5), Anthropic, 30 June 2026.

[^opus-48]: [Introducing Claude Opus 4.8](https://www.anthropic.com/news/claude-opus-4-8), Anthropic, 28 May 2026.

[^fable-launch]: [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5), Anthropic, 9 June 2026; updated 1 July 2026.

[^fable-suspension]: [Statement on the US government directive to suspend access to Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access), Anthropic, 12 June 2026.

[^fable-ap]: Matt O'Brien, [Anthropic takes its latest AI models offline after Trump administration order](https://apnews.com/article/anthropic-artificial-intelligence-trump-fable-mythos-d9cc7df5c02e93837d0f0bfb24d5cfd2), Associated Press, 13 June 2026.

[^fable-redeployment]: [Redeploying Claude Fable 5](https://www.anthropic.com/news/redeploying-fable-5), Anthropic, 30 June 2026; updated 1 July 2026.

[^fable-framework]: [More details on Fable 5's cyber safeguards and our jailbreak framework](https://www.anthropic.com/news/fable-safeguards-jailbreak-framework), Anthropic, 2 July 2026.

[^claude-4]: [Introducing Claude 4](https://www.anthropic.com/news/claude-4), Anthropic, 22 May 2025.

[^mcp]: [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol), Anthropic, 25 November 2024.

[^mcp-donation]: [Donating the Model Context Protocol and establishing the Agentic AI Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation), Anthropic, 9 December 2025.

[^cloud-compute]: [Expanding our use of Google Cloud TPUs and services](https://www.anthropic.com/news/expanding-our-use-of-google-cloud-tpus-and-services), Anthropic, 23 October 2025.

[^core-views]: [Anthropic's core views on AI safety](https://www.anthropic.com/news/core-views-on-ai-safety), Anthropic, 8 March 2023.

[^constitutional-ai]: Yuntao Bai et al., [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073), 2022.

[^circuit-tools]: [Open-sourcing circuit-tracing tools](https://www.anthropic.com/research/open-source-circuit-tracing), Anthropic, 29 May 2025.

[^interpretability-engineering]: [The engineering challenges of scaling interpretability](https://www.anthropic.com/research/engineering-challenges-interpretability), Anthropic, 13 June 2024.

[^psm]: [The Persona Selection Model: Why AI assistants might behave like humans](https://alignment.anthropic.com/2026/psm/), Anthropic Alignment Science Blog, 23 February 2026.

[^j-lens]: Wes Gurnee et al., [Verbalizable Representations Form a Global Workspace in Language Models](https://transformer-circuits.pub/2026/workspace/index.html), Anthropic, 6 July 2026.

[^narasimhan]: [Anthropic's Long-Term Benefit Trust appoints Vas Narasimhan to board of directors](https://www.anthropic.com/news/narasimhan-board), Anthropic, 14 April 2026.

[^rsp]: [Anthropic's Responsible Scaling Policy](https://www.anthropic.com/responsible-scaling-policy), Anthropic, updated 8 July 2026.

[^amazon]: [Powering the next generation of AI development with AWS](https://www.anthropic.com/news/anthropic-amazon-trainium), Anthropic, 22 November 2024.

[^microsoft-nvidia]: [Microsoft, NVIDIA, and Anthropic announce strategic partnerships](https://www.anthropic.com/news/microsoft-nvidia-anthropic-announce-strategic-partnerships), Anthropic, 18 November 2025.

[^series-h]: [Anthropic raises $65 billion in Series H funding at $965 billion post-money valuation](https://www.anthropic.com/news/series-h), Anthropic, 28 May 2026.

[^s1]: [Anthropic confidentially submits draft S-1 to the SEC](https://www.anthropic.com/news/confidential-draft-s1-sec), Anthropic, 1 June 2026.

[^bartz-order]: _Bartz v. Anthropic PBC_, [Order on fair use](https://cases.justia.com/federal/district-courts/california/candce/3%3A2024cv05417/434709/231/0.pdf), No. 3:24-cv-05417 (N.D. Cal. 23 June 2025).

[^bartz-settlement]: [Frequently asked questions](https://www.anthropiccopyrightsettlement.com/faq), _Bartz v. Anthropic_ settlement administrator.

[^settlement-status]: Andrew Albanese, [Little drama at Anthropic's settlement hearing](https://www.publishersweekly.com/pw/by-topic/digital/copyright/article/100438-little-drama-at-anthropic-s-settlement-hearing.html), _Publishers Weekly_, 18 May 2026.

[^music-case]: Blake Brittain, [US music publishers suing Anthropic make their case against AI fair use](https://content.next.westlaw.com/Document/I30b0ca70279c11f1986aeadf25d5b5ca/View/FullText.html), Reuters, 24 March 2026.

[^dow-statement]: [Statement from Dario Amodei on discussions with the Department of War](https://www.anthropic.com/news/statement-department-of-war), Anthropic, 26 February 2026.

[^dod-ap]: [Anthropic CEO says it cannot in good conscience accede to Pentagon's demands for AI use](https://apnews.com/article/9b28dda41bdb52b6a378fa9fc80b8fda), Associated Press, 26 February 2026.

[^dod-injunction]: [US judge blocks Pentagon's Anthropic blacklisting for now](https://www.investing.com/news/general-news/us-judge-blocks-pentagons-anthropic-blacklisting-for-now-4583980), Reuters, 26 March 2026.
