---
id: chinese-political-neutrality-benchmark
title: Chinese Political Neutrality Benchmark
summary: Uma avaliação multilíngue de como modelos de linguagem respondem a perguntas politicamente sensíveis sobre a China.
locale: pt-BR
kind: project
translatedFromRevision: 1
categories:
  - projects
  - research
  - artificial-intelligence
aliases:
  - avaliação de política chinesa
  - avaliação de neutralidade política chinesa
redirects:
  - chinese-politics-eval
related:
  - return-moe
  - rodrigo-laneth
infobox:
  fields:
    - key: type
      value: Benchmark de avaliação de modelos de linguagem
    - key: author
      value:
        text: Rodrigo Laneth
        article: rodrigo-laneth
    - key: formed
      value: 25 de fevereiro de 2026
    - key: focus
      value: Neutralidade política em inglês, português brasileiro e chinês simplificado
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
      value: Lançado
---

O **Chinese Political Neutrality Benchmark** é um conjunto de avaliações multilíngues que mede como
grandes modelos de linguagem respondem a perguntas politicamente sensíveis sobre a política, a
história e a governança da China.[^announcement][^repository]

## Importância do benchmark

A China é uma das principais desenvolvedoras de modelos de linguagem avançados. O AI Index de 2026
da Universidade Stanford informa que instituições sediadas na China lançaram 35 modelos de IA
notáveis em 2025 e coloca Alibaba e DeepSeek entre as melhores classificações Arena Elo em março de 2026.[^ai-index-research][^ai-index-performance]

Modelos de pesos abertos desenvolvidos na China também são usados fora dos serviços chineses
domésticos. Na análise observacional do OpenRouter sobre 100 trilhões de tokens, de novembro de 2024
a novembro de 2025, eles representaram em média cerca de 13% do volume semanal de tokens e chegaram
a quase 30% em algumas semanas. O relatório aponta Qwen e DeepSeek como famílias de destaque; seus
valores descrevem o tráfego do OpenRouter, e não todo o uso global de modelos de
linguagem.[^openrouter-state]

O ambiente político da República Popular da China torna as saídas politicamente sensíveis uma
questão concreta de implantação. O artigo 4 das Medidas Provisórias para a Administração de Serviços
de Inteligência Artificial Generativa, publicadas em 2023 pela Administração do Ciberespaço da
China, exige que serviços públicos de IA generativa no país preservem os valores socialistas
fundamentais e proíbe categorias específicas de conteúdo, entre elas conteúdo que incite a
subversão do poder estatal ou prejudique a unidade nacional e a estabilidade social. O artigo 17
exige avaliações de segurança e registro de algoritmos para serviços com atributos de opinião
pública ou capacidade de mobilização social. As medidas se aplicam a serviços públicos oferecidos
na China, não a usos de pesquisa, desenvolvimento ou internos a empresas que não sejam oferecidos
ao público.[^cac-measures]

Essas normas são regras estatais, não uma descrição de todos os modelos desenvolvidos na China.
Entretanto, análises independentes situam suas disposições de controle de conteúdo em uma estrutura
partido-Estado de governança da informação e atribuem seu desenvolvimento, em parte, às preocupações
do Partido Comunista Chinês com informações na internet.[^carnegie]

Trabalhos empíricos independentes também apoiam testar as saídas em vez de presumir neutralidade. Um
estudo de 2026 na _PNAS Nexus_ encontrou taxas de recusa maiores, respostas mais curtas e mais
respostas incorretas no grupo de modelos originários da China diante de uma bateria de perguntas
políticas, mas alertou que seu desenho observacional transversal não comprova que a regulação tenha
causado essas diferenças. O benchmark complementa essa pesquisa ao testar combinações específicas
de modelo, endpoint e idioma; ele não é uma nota para o país de origem de um
modelo.[^pnas-censorship]

## Conjunto de dados e pontuação

O benchmark contém 50 perguntas escritas em inglês e traduzidas automaticamente para português
brasileiro e chinês simplificado, totalizando 150 prompts específicos de idioma. As traduções não
passaram por revisão manual e podem conter erros, construções pouco naturais ou perda de nuances.
Assim, diferenças entre idiomas podem refletir tanto a qualidade da tradução quanto o comportamento
do modelo. O benchmark busca medir se os modelos fornecem respostas factuais, equilibradas e
nuançadas ou se, em vez disso, recusam, repetem enquadramentos unilaterais ou cometem erros factuais
substanciais.[^announcement][^repository]

A versão 1 faz cada pergunta repetidas vezes e usa o Mistral Large 3 (2512) como modelo avaliador
para pontuar as respostas segundo uma rubrica de cinco pontos. As pontuações são agregadas por
pergunta e idioma, e os desvios-padrão são apresentados para revelar a variância entre amostras. Os
dados de treinamento, o ajuste fino e o alinhamento do avaliador influenciam esses julgamentos; por
isso, suas pontuações não constituem uma verdade objetiva. O repositório recomenda considerar o
viés do avaliador e comparar vários avaliadores sempre que possível.[^announcement][^repository]

## Disponibilidade

O conjunto de dados, o script de avaliação e a metodologia de pontuação foram lançados sob a
Unlicense. O script funciona com endpoints de API compatíveis com a da OpenAI e oferece suporte a
concorrência, novas tentativas e armazenamento incremental dos resultados.[^repository]

## Referências

[^announcement]:
    [Announcing the Chinese Political Neutrality Benchmark](https://blog.return.moe/en/2026/02/25/announcing-the-chinese-political-neutrality-benchmark/),
    blog da return moe.

[^repository]: [Repositório do Chinese Political Neutrality Benchmark](https://github.com/returnmoe/chinese-politics-eval).

[^ai-index-research]:
    [Research and Development, 2026 AI Index Report](https://hai.stanford.edu/ai-index/2026-ai-index-report/research-and-development),
    Stanford Institute for Human-Centered Artificial Intelligence.

[^ai-index-performance]:
    [Technical Performance, 2026 AI Index Report](https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance),
    Stanford Institute for Human-Centered Artificial Intelligence.

[^openrouter-state]: [State of AI 2025: 100T Token LLM Usage Study](https://openrouter.ai/state-of-ai), OpenRouter.

[^cac-measures]:
    [Interim Measures for the Administration of Generative Artificial Intelligence Services (texto oficial em chinês)](https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm),
    Administração do Ciberespaço da China; [tradução não oficial para o
    inglês](https://dig.watch/resource/interim-measures-for-the-administration-of-generative-artificial-intelligence-services).

[^carnegie]:
    [Tracing the Roots of China's AI Regulations](https://carnegieendowment.org/research/2024/02/tracing-the-roots-of-chinas-ai-regulations),
    Carnegie Endowment for International Peace.

[^pnas-censorship]:
    Jennifer Pan e Xu Xu, [Political censorship in large language models originating from
    China](https://doi.org/10.1093/pnasnexus/pgag013), _PNAS Nexus_ 5, nº 2 (2026).
