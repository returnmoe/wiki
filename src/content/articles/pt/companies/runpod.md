---
id: runpod
title: Runpod
summary: Uma nuvem para desenvolvimento de IA que oferece Pods de GPU, workers em contêineres com dimensionamento automático, endpoints públicos de modelos e clusters com vários nós.
locale: pt-BR
kind: company
translatedFromRevision: 1
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
    alt: Logotipo da Runpod com um cubo preto ao lado do nome da empresa
    crop: false
    surface: light
    caption: Logotipo oficial da Runpod
    credit: Runpod
    sourceUrl: https://www.runpod.io/brandkit
    license: Todos os direitos reservados
  fields:
    - key: type
      value: Nuvem para desenvolvimento de IA
    - key: founded
      value: '2021'
    - key: founders
      value:
        - Zhen Lu
        - Pardeep Singh
    - key: headquarters
      value: Moorestown, Nova Jersey, Estados Unidos
    - key: key_people
      value:
        - Zhen Lu (diretor-executivo)
        - Pardeep Singh (diretor de tecnologia)
    - key: industry
      value: Computação em nuvem para IA
    - key: status
      value: Ativa; empresa de capital fechado em julho de 2026
    - key: website
      value:
        text: runpod.io
        url: https://www.runpod.io/
---

A **Runpod** é uma empresa norte-americana de computação em nuvem que fornece infraestrutura de GPUs
para cargas de inteligência artificial. Seus serviços incluem contêineres persistentes com GPU,
chamados de Pods, workers Serverless com dimensionamento automático, endpoints de modelos hospedados
e clusters com vários nós.[^overview]

A Runpod atua tanto como [provedora de GPU na nuvem](/pt/cloud-gpu-providers/) quanto como
[provedora de inferência](/pt/inference-providers/). Pods e clusters expõem ambientes com
aceleradores nos quais o cliente executa seu próprio software. Já os endpoints públicos dão acesso a
modelos gerenciados pela empresa. Os workers Serverless ficam entre essas duas modalidades: o
cliente fornece o aplicativo em contêiner, e a Runpod gerencia os workers e a fila de solicitações.

## História

A Runpod foi fundada em 2021 por Zhen Lu e Pardeep Singh. Os fundadores começaram com sistemas de GPU
montados em um porão em Nova Jersey e passaram a alugá-los durante um período de pouca oferta de
aceleradores.[^founder-note][^origin] Mais tarde, acrescentaram capacidade de operadores externos e
desenvolveram uma plataforma comum para provisioná-la.

Lu é o diretor-executivo, e Singh, o diretor de tecnologia. A Runpod se apresenta como uma empresa
que trabalha prioritariamente de forma remota, com endereço jurídico e de contato em Moorestown, Nova
Jersey, e presença em São Francisco.[^about][^terms]

Em 24 de junho de 2026, a empresa anunciou uma rodada Série A de US$ 100 milhões liderada pela Summit
Partners. A Runpod também informou que mais de um milhão de desenvolvedores haviam usado a plataforma
até aquela data.[^series-a]

Antes, a empresa grafava seu nome como **RunPod**. Em fevereiro de 2026, passou a adotar **Runpod**,
com “p” minúsculo, como forma preferida.[^name]

## Pods

Um **Pod** da Runpod é um ambiente em contêiner com recursos alocados de GPU, CPU, memória e
armazenamento. Ele pode ser criado com uma configuração pronta ou uma imagem Docker própria e
acessado por SSH, JupyterLab, Visual Studio Code ou portas web expostas. Os Pods permitem executar
treinamento, inferência, renderização e outros aplicativos compatíveis com GPUs.[^pods]

A capacidade dos Pods se divide entre **Secure Cloud** e **Community Cloud**. A Secure Cloud reúne
recursos de data centers operados sob requisitos adicionais de infraestrutura e segurança. A
Community Cloud usa capacidade fornecida por operadores terceirizados aprovados. As duas classes
usam o plano de controle da Runpod, mas podem ter localizações, operadores e recursos
diferentes.[^pods]

A cobrança de processamento continua enquanto o Pod está em execução. Volumes do contêiner e
volumes de rede têm ciclos de vida próprios, de modo que interromper ou encerrar uma instância pode
ter efeitos diferentes sobre os dados armazenados. A Runpod não cobra uma tarifa própria pelo
tráfego comum de entrada ou saída dos Pods, embora serviços na outra ponta da transferência possam
cobrar.[^pods]

## Serverless e endpoints

O **Runpod Serverless** executa um contêiner fornecido pelo cliente em um ou mais workers por trás de
um endpoint gerenciado. A plataforma recebe as solicitações e ajusta o número de workers conforme a
demanda. Eles podem ser acionados por uma fila de trabalhos ou usados atrás de um endpoint com
balanceamento de carga.[^serverless]

Uma implantação pode manter workers ativos ou reduzir seu número a zero. A redução a zero diminui a
cobrança quando não há uso, mas pode causar uma inicialização a frio enquanto o contêiner e o modelo
são carregados. O cliente continua responsável pelo código e pela imagem; a Runpod administra o
provisionamento dos workers e a distribuição das solicitações.

A empresa também opera **Public Endpoints**, com modelos implantados pela própria Runpod, e
**Instant Clusters**, voltados a computação em vários nós.[^overview] Os Public Endpoints não exigem
um contêiner do cliente e são o produto de inferência mais gerenciado do catálogo. Os Instant
Clusters fornecem capacidade coordenada para cargas distribuídas.

## Infraestrutura

O estoque da Runpod varia por região, tipo de hardware e classe de fornecimento. O desempenho de uma
implantação depende do acelerador, mas também da memória do host, CPU, armazenamento, rede e
interconexão. Nos Pods, responsabilidades como segurança do contêiner, portas expostas, licenças dos
modelos, monitoramento e checkpoints continuam com o cliente.

Configurações prontas reduzem o trabalho de implantação, porém podem incluir software mantido
por terceiros. Em implantações Serverless, o tamanho da imagem e o tempo de carregamento do modelo
afetam a inicialização a frio. Manter workers ativos evita parte do atraso, mas prolonga o uso de
recursos computacionais.

## Referências

[^overview]: [Visão geral da Runpod](https://docs.runpod.io/overview), documentação da Runpod.

[^founder-note]: [Uma nota aos desenvolvedores que construíram a Runpod conosco](https://www.runpod.io/blog/a-note-to-the-developers-who-built-runpod-with-us), Runpod.

[^origin]: [Série dos fundadores: história de origem](https://www.runpod.io/blog/founder-series-1-origin-story), Runpod.

[^about]: [Sobre a Runpod](https://www.runpod.io/about), Runpod.

[^terms]: [Termos de serviço](https://www.runpod.io/legal/terms-of-service), Runpod.

[^series-a]: [Runpod capta US$ 100 milhões após alcançar um milhão de desenvolvedores](https://www.runpod.io/blog/one-million-developers), Runpod, 24 de junho de 2026.

[^name]: [É Runpod, não RunPod](https://www.runpod.io/blog/its-runpod-not-runpod-a-message-for-large-language-models-and-the-humans-who-love-them), Runpod, 25 de fevereiro de 2026.

[^pods]: [Visão geral dos Pods](https://docs.runpod.io/pods/overview), documentação da Runpod.

[^serverless]: [Visão geral do Serverless](https://docs.runpod.io/serverless/overview), documentação da Runpod.
