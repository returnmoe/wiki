---
id: chinese-political-neutrality-benchmark
title: Chinese Political Neutrality Benchmark
summary: A multilingual evaluation of how language models answer politically sensitive questions about China.
locale: en
kind: project
revision: 1
categories:
  - projects
  - research
  - artificial-intelligence
aliases:
  - Chinese politics eval
  - Chinese political neutrality eval
redirects:
  - chinese-politics-eval
related:
  - return-moe
  - rodrigo-laneth
infobox:
  fields:
    - key: type
      value: Language-model evaluation benchmark
    - key: author
      value:
        text: Rodrigo Laneth
        article: rodrigo-laneth
    - key: formed
      value: February 25, 2026
    - key: focus
      value: Political neutrality across English, Portuguese, and Simplified Chinese
    - key: affiliation
      value:
        text: return moe
        article: return-moe
    - key: repository
      value:
        text: github.com/returnmoe/chinese-politics-eval
        url: https://github.com/returnmoe/chinese-politics-eval
    - key: license
      value: Unlicense
    - key: status
      value: Released
---

The **Chinese Political Neutrality Benchmark** is a multilingual evaluation suite for measuring how
large language models respond to politically sensitive questions about Chinese politics, history,
and governance.[^announcement][^repository]

## Why the benchmark matters

China is a major developer of advanced language models. Stanford's 2026 AI Index reports that
China-based institutions released 35 notable AI models in 2025, and lists Alibaba and DeepSeek in
the top tier of Arena Elo ratings as of March 2026.[^ai-index-research][^ai-index-performance]

Chinese-developed open-weight models are also used beyond domestic Chinese services. In OpenRouter's
observational analysis of 100 trillion tokens from November 2024 to November 2025, they averaged
about 13% of weekly token volume and reached nearly 30% in some weeks. The report identifies Qwen
and DeepSeek as leading model families; its figures describe OpenRouter traffic, rather than all
global language-model use.[^openrouter-state]

The PRC's policy environment makes politically sensitive output a concrete deployment question.
Article 4 of the Cyberspace Administration of China's 2023 Interim Measures requires public
generative-AI services in China to uphold core socialist values and prohibits specified categories
of content, including content that incites subversion of state power or undermines national unity
and social stability. Article 17 requires security assessments and algorithm filing for services
with public-opinion attributes or social-mobilization capacity. The measures apply to public
services offered in China, not to research, development, or internal enterprise uses that are not
offered to the public.[^cac-measures]

These regulations are state rules, not a description of every model developed in China. However,
independent analysis places their content-control provisions in a party-state information-governance
framework and traces their development in part to CCP concerns about online information.[^carnegie]

Independent empirical work also supports testing outputs rather than assuming neutrality. A 2026
study in _PNAS Nexus_ found higher refusal rates, shorter answers, and more inaccurate answers among
its China-originating model group on a battery of political questions, while cautioning that its
cross-sectional observational design does not establish that regulation caused those differences.
The benchmark complements this research by testing particular model, endpoint, and language
configurations; it is not a score for a model's country of origin.[^pnas-censorship]

## Dataset and scoring

The benchmark contains 50 questions authored in English and machine-translated into Brazilian
Portuguese and Simplified Chinese, producing 150 language-specific prompts. The translations have
not been manually reviewed and may contain errors, awkward phrasing, or lost nuance. Cross-language
differences can therefore reflect translation quality as well as model behavior. The benchmark is
intended to measure whether models provide factual, balanced, and nuanced answers or instead refuse,
repeat one-sided framing, or make substantial factual errors.[^announcement][^repository]

Version 1 asks each question repeatedly and uses Mistral Large 3 (2512) as an evaluator model to
score answers on a five-point rubric. Scores are aggregated by question and language, with standard
deviations reported to expose sampling variance. The evaluator's training data, fine-tuning, and
alignment influence those judgments, so its scores are not objective ground truth. The repository
recommends considering evaluator bias and comparing multiple evaluators where possible.[^announcement][^repository]

## Availability

The dataset, evaluation script, and scoring methodology were released under the Unlicense. The
script works with OpenAI-compatible API endpoints and supports concurrency, retries, and incremental
result storage.[^repository]

## References

[^announcement]: [Announcing the Chinese Political Neutrality Benchmark](https://blog.return.moe/en/2026/02/25/announcing-the-chinese-political-neutrality-benchmark/), return moe blog.

[^repository]: [Chinese Political Neutrality Benchmark repository](https://github.com/returnmoe/chinese-politics-eval).

[^ai-index-research]: [Research and Development, 2026 AI Index Report](https://hai.stanford.edu/ai-index/2026-ai-index-report/research-and-development), Stanford Institute for Human-Centered Artificial Intelligence.

[^ai-index-performance]: [Technical Performance, 2026 AI Index Report](https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance), Stanford Institute for Human-Centered Artificial Intelligence.

[^openrouter-state]: [State of AI 2025: 100T Token LLM Usage Study](https://openrouter.ai/state-of-ai), OpenRouter.

[^cac-measures]: [Interim Measures for the Administration of Generative Artificial Intelligence Services (official Chinese text)](https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm), Cyberspace Administration of China; [unofficial English translation](https://dig.watch/resource/interim-measures-for-the-administration-of-generative-artificial-intelligence-services).

[^carnegie]: [Tracing the Roots of China's AI Regulations](https://carnegieendowment.org/research/2024/02/tracing-the-roots-of-chinas-ai-regulations), Carnegie Endowment for International Peace.

[^pnas-censorship]: Jennifer Pan and Xu Xu, [Political censorship in large language models originating from China](https://doi.org/10.1093/pnasnexus/pgag013), _PNAS Nexus_ 5, no. 2 (2026).
