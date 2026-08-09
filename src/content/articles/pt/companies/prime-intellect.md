---
id: prime-intellect
title: Prime Intellect
summary: Uma empresa de plataforma e pesquisa em IA que reúne capacidade de aceleradores, infraestrutura gerenciada de aprendizado por reforço, inferência e pesquisa com modelos abertos.
locale: pt-BR
kind: company
translatedFromRevision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - Prime Intellect Inc.
redirects:
  - primeintellect
related:
  - cloud-gpu-providers
  - inference-providers
  - runpod
  - vast-ai
  - model-training
infobox:
  image:
    src: /media/companies/prime-intellect/logo.png
    alt: Logotipo branco da Prime Intellect em forma abstrata de ave e pena sobre um quadrado preto
    crop: false
    caption: Logotipo oficial da Prime Intellect
    credit: Prime Intellect
    sourceUrl: https://www.primeintellect.ai/
    license: Todos os direitos reservados
  fields:
    - key: type
      value: Empresa de infraestrutura e pesquisa em IA
    - key: founded
      value: '2023'
    - key: founders
      value:
        - Vincent Weisser
        - Johannes Hagemann
    - key: headquarters
      value: São Francisco, Califórnia, Estados Unidos
    - key: key_people
      value:
        - Vincent Weisser (diretor-executivo)
        - Johannes Hagemann (diretor de tecnologia)
    - key: industry
      value: Infraestrutura e pesquisa em inteligência artificial
    - key: status
      value: Ativa; empresa de capital fechado em julho de 2026
    - key: website
      value:
        text: primeintellect.ai
        url: https://www.primeintellect.ai/
---

A **Prime Intellect** é uma empresa norte-americana de infraestrutura e pesquisa em inteligência
artificial. Seus serviços incluem um marketplace de aceleradores, sistemas gerenciados de
aprendizado por reforço e avaliação, e inferência de modelos. A empresa também desenvolve software
de treinamento de código aberto e publica modelos com pesos abertos.[^home]

O marketplace Compute é um [serviço de GPU na nuvem](/pt/cloud-gpu-providers/), enquanto os
produtos Lab e Inference oferecem treinamento e [inferência](/pt/inference-providers/)
gerenciados. A capacidade física vem de uma rede de empresas de nuvem, e não de uma única frota
pertencente à Prime Intellect.

## História

A Prime Intellect foi fundada em 2023 por Vincent Weisser e Johannes Hagemann. Weisser é o
diretor-executivo, e Hagemann, o diretor de tecnologia. Em abril de 2024, a empresa anunciou um
financiamento inicial de US$ 5,5 milhões para desenvolver uma plataforma distribuída de computação e
treinamento de modelos.[^seed]

Em fevereiro de 2025, a Prime Intellect anunciou mais US$ 15 milhões em uma rodada liderada pela
Founders Fund, elevando o financiamento declarado a mais de US$ 20 milhões.[^fundraise] Em 8 de julho
de 2026, anunciou uma Série A de US$ 130 milhões liderada pela Radical Ventures. NVIDIA Ventures,
Intel Capital, Dell Technologies Capital e investidores existentes também participaram. A empresa
declarou ter captado mais de US$ 150 milhões no total e atender mais de 6 mil clientes.[^series-a]

A Prime Intellect mantém pessoal em São Francisco e em trabalho remoto. A Prime Intellect Inc. é
registrada em Delaware e tem escritório registrado em Dover.[^home][^imprint]

## Compute

A Prime Intellect apresentou o marketplace **Compute** em julho de 2024. O serviço reúne máquinas e
clusters de vários provedores de infraestrutura sob uma interface comum. O cliente escolhe o tipo e
o número de aceleradores, a localização e outros requisitos, e a plataforma provisiona uma oferta
compatível.[^compute]

O marketplace inclui máquinas individuais, nós com várias GPUs e clusters reservados. Os termos da
Prime Intellect descrevem o serviço como um marketplace no qual terceiros podem fornecer as ofertas.
O uso de uma máquina também pode estar sujeito aos termos do provedor de nuvem
subjacente.[^terms]

O Compute funciona como uma camada de intermediação e orquestração. Segurança do hardware, rede,
armazenamento, disponibilidade e localização geográfica dependem em parte do fornecedor escolhido. A
interface comum padroniza o provisionamento, mas não torna idênticas todas as infraestruturas
subjacentes.

## Lab e inferência

O **Prime Intellect Lab** é uma plataforma gerenciada de pós-treinamento por aprendizado por reforço
e avaliação. O serviço ficou disponível em geral em maio de 2026 e reúne trabalhos de treinamento,
ambientes, trajetórias de execução, avaliações, checkpoints e implantação de adaptadores.[^lab] Os
ambientes podem ser criados com o framework de código aberto Verifiers, desenvolvido pela empresa,
ou escolhidos em um hub público.

O Lab oculta do cliente a infraestrutura de treinamento distribuído e pode cobrar pelo trabalho em
unidades como tokens processados. Ele difere de uma instância do Compute, na qual o cliente recebe um
ambiente com aceleradores e configura diretamente a pilha de treinamento.

O **Prime Inference** serve modelos compatíveis por endpoints serverless ou dedicados.[^home]
Endpoints dedicados reservam capacidade para uma carga, mas deixam o ambiente de execução sob a
administração da Prime Intellect. O produto não oferece o mesmo acesso administrativo de uma máquina
do Compute.

## Pesquisa

A Prime Intellect pesquisa o treinamento de modelos em hardware heterogêneo e distribuído
geograficamente. O projeto **INTELLECT-1** treinou um modelo de linguagem de dez bilhões de
parâmetros com máquinas em cinco países e três continentes, chegando a um máximo declarado de 112
GPUs H100. A empresa publicou checkpoints, dados e um relatório técnico em dezembro de 2024.[^intellect-1]

O **INTELLECT-2**, lançado em maio de 2025, aplicou aprendizado por reforço distribuído globalmente a
um modelo de raciocínio com 32 bilhões de parâmetros.[^intellect-2] Trabalhos posteriores incluíram
geração de dados sintéticos, software de aprendizado por reforço e modelos abertos maiores.

A empresa usa o termo **descentralizado** para descrever processamento fornecido por vários
operadores, treinamento em diferentes locais e desenvolvimento colaborativo de modelos ou conjuntos
de dados. As implantações ainda usam o marketplace central, as contas, o agendamento e a cobrança da
Prime Intellect. Algumas cargas são executadas em provedores de nuvem convencionais por esse plano
de controle, não em hardware pertencente à comunidade.

## Referências

[^home]: [Prime Intellect](https://www.primeintellect.ai/), site oficial.

[^seed]: [Prime Intellect capta US$ 5,5 milhões em financiamento inicial](https://www.prnewswire.com/news-releases/prime-intellect-secures-5-5m-in-seed-funding-co-led-by-distributed-global-and-coinfund-to-advance-its-decentralized-and-collaborative-ai-ecosystem-302124585.html), comunicado da Prime Intellect, 23 de abril de 2024.

[^fundraise]: [US$ 15 milhões para construir a pilha aberta de superinteligência](https://www.primeintellect.ai/blog/fundraise), Prime Intellect, 28 de fevereiro de 2025.

[^series-a]: [Série A de US$ 130 milhões para construir a pilha aberta de superinteligência](https://www.primeintellect.ai/blog/series-a), Prime Intellect, 8 de julho de 2026.

[^imprint]: [Informações legais](https://www.primeintellect.ai/imprint), Prime Intellect.

[^compute]: [Apresentação do Prime Intellect Compute](https://www.primeintellect.ai/blog/compute), Prime Intellect, 1º de julho de 2024.

[^terms]: [Termos de serviço](https://www.primeintellect.ai/terms-of-service), Prime Intellect.

[^lab]: [Prime Intellect Lab está aberto](https://www.primeintellect.ai/blog/lab-is-open), Prime Intellect, 7 de maio de 2026.

[^intellect-1]: [Lançamento do INTELLECT-1](https://www.primeintellect.ai/blog/intellect-1-release), Prime Intellect, 2 de dezembro de 2024.

[^intellect-2]: [Lançamento do INTELLECT-2](https://www.primeintellect.ai/blog/intellect-2-release), Prime Intellect, 12 de maio de 2025.
