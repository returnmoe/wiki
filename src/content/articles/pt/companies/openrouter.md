---
id: openrouter
title: OpenRouter
summary: Uma empresa de gateway e marketplace de inferência de IA que oferece uma API única para modelos servidos por vários provedores.
locale: pt-BR
kind: company
translatedFromRevision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - OpenRouter AI
  - OpenRouter Inc.
redirects:
  - open-router
related:
  - inference-providers
  - cloud-gpu-providers
  - weights-and-biases
  - cerebras
infobox:
  image:
    src: /media/companies/openrouter/logo.svg
    alt: Logotipo da OpenRouter com um símbolo geométrico OR roxo ao lado do nome openrouter
    crop: false
    surface: light
    caption: Logotipo oficial da OpenRouter
    credit: OpenRouter
    sourceUrl: https://openrouter.ai/blog/announcements/brand-refresh/
    license: Todos os direitos reservados
  fields:
    - key: type
      value: Gateway e marketplace de inferência de IA
    - key: founded
      value: Início de 2023
    - key: founders
      value:
        - Alex Atallah
        - Louis Vichy
    - key: headquarters
      value: Nova York, Nova York, Estados Unidos
    - key: key_people
      value: Alex Atallah (diretor-executivo)
    - key: industry
      value: Infraestrutura de inteligência artificial
    - key: status
      value: Ativa; empresa de capital fechado em julho de 2026
    - key: website
      value:
        text: openrouter.ai
        url: https://openrouter.ai/
---

A **OpenRouter** é uma empresa norte-americana de inteligência artificial que opera um gateway e
marketplace de inferência. Seu serviço dá acesso a modelos de vários provedores por uma única API,
conta e sistema de cobrança. A OpenRouter encaminha cada solicitação a um provedor elegível, que
executa o modelo.[^about][^faq]

A empresa atua como [provedora de inferência](/pt/inference-providers/) na camada de serviço
usada pelo cliente, mas normalmente não funciona como [provedora de GPU na
nuvem](/pt/cloud-gpu-providers/). Ela oferece acesso a endpoints gerenciados de modelos, e não a
instâncias com aceleradores administradas pelo cliente. O desenvolvedor do modelo, a empresa que o
hospeda e a OpenRouter podem ser organizações diferentes.

## História

A OpenRouter foi fundada no início de 2023 por Alex Atallah e Louis Vichy. Atallah havia sido
cofundador e diretor de tecnologia do marketplace de NFTs OpenSea.[^about][^a16z] O serviço surgiu
com o aumento do número de fornecedores de modelos, cada um com contas, interfaces e características
de disponibilidade próprias.

Em 28 de maio de 2026, a OpenRouter anunciou uma rodada Série B de US$ 113 milhões liderada pela
CapitalG, com participação da Andreessen Horowitz, Menlo Ventures, Sequoia Capital e outros
investidores. Na ocasião, a empresa informou que sua rede reunia mais de 400 modelos e 70
provedores.[^series-b] Esses números variam à medida que modelos e endpoints entram ou saem do
catálogo.

A OpenRouter apresentou uma nova identidade visual em julho de 2026. O projeto usa um símbolo
geométrico “OR” inspirado em formas da Bauhaus.[^brand]

## Serviço

Os aplicativos enviam solicitações à OpenRouter com um identificador de modelo e uma chave da
plataforma. O gateway autentica e registra a solicitação, escolhe um endpoint e retransmite a
resposta. A API segue muitas convenções da API da OpenAI, o que permite usar bibliotecas clientes
existentes com outra URL-base.[^faq] Os recursos específicos de cada modelo, os parâmetros
aceitos e o formato das respostas ainda podem variar.

O serviço diferencia o modelo dos endpoints que o executam. Vários provedores podem oferecer o mesmo
modelo de pesos abertos com hardware, quantização, limite de contexto ou software de inferência
diferentes. A OpenRouter publica metadados sobre os endpoints e permite restringir uma solicitação a
determinados provedores ou características de implantação.

O sistema de roteamento pode ordenar os provedores por preço, latência ou taxa de processamento e
recorrer a outro endpoint depois de uma falha. Também é possível filtrar por quantização e política
de dados.[^routing] Quando o aplicativo não especifica um provedor, solicitações sucessivas ao mesmo
modelo podem ser processadas por hosts diferentes.

## Preços

A OpenRouter reúne as cobranças dos provedores. O preço por token exibido geralmente corresponde ao
endpoint escolhido, e a empresa cobra uma tarifa na compra de créditos.[^pricing] Alguns provedores
também aceitam o uso de chaves próprias, conhecido como _bring your own key_ (**BYOK**), mantendo a
relação de cobrança original por meio da interface da OpenRouter.

Esse arranjo dá aos hosts acesso à demanda de um marketplace comum e permite que aplicativos usem
vários provedores sem integrações separadas. Ao mesmo tempo, a OpenRouter passa a ser uma dependência
operacional adicional entre o aplicativo e o host de inferência.

## Tratamento de dados

A OpenRouter afirma que não armazena o conteúdo de prompts e respostas por padrão, embora conserve
metadados como modelo, provedor, número de tokens e latência. O cliente pode ativar o registro do
conteúdo para recursos compatíveis.[^data]

A política do provedor escolhido se aplica separadamente. A OpenRouter documenta as condições de
retenção e uso para treinamento de cada provedor e permite limitar o roteamento a endpoints
identificados como compatíveis com retenção zero.[^zdr] Assim, uma solicitação pode estar sujeita às
políticas da OpenRouter e da empresa que executa a inferência.

## Referências

[^about]: [Sobre a OpenRouter](https://openrouter.ai/about), OpenRouter.

[^faq]: [Perguntas frequentes](https://openrouter.ai/docs/faq), documentação da OpenRouter.

[^a16z]: [Investimento na OpenRouter](https://a16z.com/announcement/investing-in-openrouter/), Andreessen Horowitz, 26 de junho de 2025.

[^series-b]: [OpenRouter capta US$ 113 milhões para construir a interface universal de IA](https://openrouter.ai/blog/series-b/), OpenRouter, 28 de maio de 2026.

[^brand]: [A nova aparência da OpenRouter](https://openrouter.ai/blog/announcements/brand-refresh/), OpenRouter, 13 de julho de 2026.

[^routing]: [Roteamento de provedores](https://openrouter.ai/docs/guides/routing/provider-selection), documentação da OpenRouter.

[^pricing]: [Preços](https://openrouter.ai/pricing), OpenRouter, acesso em 18 de julho de 2026.

[^data]: [Coleta de dados](https://openrouter.ai/docs/guides/privacy/data-collection), documentação da OpenRouter.

[^zdr]: [Retenção zero de dados](https://openrouter.ai/docs/guides/features/zdr) e [políticas de dados dos provedores](https://openrouter.ai/docs/guides/privacy/provider-logging/), documentação da OpenRouter.
