---
id: cerebras
title: Cerebras
summary: Uma empresa norte-americana de computação para IA que desenvolve aceleradores em escala de wafer e oferece sistemas físicos, treinamento em nuvem e inferência gerenciada.
locale: pt-BR
kind: company
translatedFromRevision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - Cerebras Systems
  - Cerebras Systems Inc.
redirects:
  - cerebras-systems
related:
  - inference-providers
  - cloud-gpu-providers
  - model-training
  - openrouter
  - weights-and-biases
infobox:
  image:
    src: /media/companies/cerebras/logo.svg
    alt: Logotipo da Cerebras com arcos concêntricos laranja ao lado do nome da empresa
    crop: false
    surface: light
    caption: Logotipo da Cerebras
    credit: Cerebras Systems
    sourceUrl: https://commons.wikimedia.org/wiki/File:Cerebras_logo.svg
    license: Domínio público (logotipo simples com formas geométricas e texto)
  fields:
    - key: type
      value: Empresa de aceleradores de IA e computação em nuvem
    - key: founded
      value: '2015'
    - key: founders
      value:
        - Andrew Feldman
        - Gary Lauterbach
        - Michael James
        - Sean Lie
        - Jean-Philippe Fricker
    - key: headquarters
      value: Sunnyvale, Califórnia, Estados Unidos
    - key: key_people
      value: Andrew Feldman (diretor-executivo)
    - key: industry
      value: Semicondutores e computação para inteligência artificial
    - key: status
      value: Ativa; negociada na Nasdaq sob o código CBRS desde maio de 2026
    - key: website
      value:
        text: cerebras.ai
        url: https://www.cerebras.ai/
---

A **Cerebras Systems**, conhecida como **Cerebras**, é uma empresa norte-americana de semicondutores
e computação para inteligência artificial. Ela desenvolve processadores em escala de wafer, sistemas
computacionais completos e serviços em nuvem para treinamento e inferência de modelos.[^company] A
empresa tem sede em Sunnyvale, na Califórnia.

O Wafer-Scale Engine da Cerebras é um acelerador especializado em IA, não uma unidade de
processamento gráfico. Os serviços em nuvem da empresa concorrem com [provedores de GPU na
nuvem](/pt/cloud-gpu-providers/) em algumas cargas, mas não oferecem máquinas virtuais
convencionais com GPU. Sua API de modelos hospedados, Cerebras Inference, é um [serviço de
inferência](/pt/inference-providers/).[^inference]

## História

A Cerebras foi fundada em 2015 por Andrew Feldman, Gary Lauterbach, Michael James, Sean Lie e
Jean-Philippe Fricker. Feldman se tornou o diretor-executivo.[^company][^investor-faq] Vários
fundadores haviam trabalhado juntos na SeaMicro, uma empresa de servidores adquirida pela AMD em 2012.

A empresa apresentou o primeiro **Wafer-Scale Engine** (**WSE-1**) e o sistema CS-1 em 2019. A
segunda geração, WSE-2 e CS-2, veio em 2021. Em março de 2024, a Cerebras anunciou o WSE-3 e o CS-3,
da terceira geração.[^company][^cs3]

A Cerebras definiu o preço de sua oferta pública inicial em 13 de maio de 2026. As ações começaram a
ser negociadas no Nasdaq Global Select Market sob o código **CBRS** no dia seguinte.[^ipo][^investor-faq]

## Wafer-Scale Engine

Na fabricação convencional de semicondutores, um wafer é cortado em vários chips antes do
encapsulamento. A Cerebras conecta uma malha de núcleos por quase todo o wafer e a encapsula como um
único processador. Núcleos e conexões redundantes permitem contornar defeitos de fabricação.

Segundo a Cerebras, o WSE-3 contém cerca de quatro trilhões de transistores e 900 mil núcleos
voltados a IA. Ele é instalado no **CS-3**, um sistema completo com refrigeração líquida,
alimentação, rede e software de apoio.[^cs3][^system] Sistemas externos MemoryX armazenam e
transmitem os pesos dos modelos, enquanto a interconexão SwarmX liga vários sistemas CS.

O software da Cerebras compila modelos PyTorch compatíveis para o WSE e apresenta um cluster como um
único sistema lógico.[^software] A plataforma usa compilador, ambiente de execução e kit de
desenvolvimento próprios. Programas específicos para CUDA e kernels personalizados para GPUs não são
diretamente compatíveis com a arquitetura WSE.

## Produtos

A Cerebras vende sistemas CS para instalação em data centers dos clientes. Esses equipamentos
oferecem controle local do hardware e dos dados e podem ser conectados em clusters
maiores.[^system] A empresa também disponibiliza o hardware pela Cerebras Cloud e por instalações
operadas por parceiros.

O **AI Model Studio** é um serviço gerenciado de treinamento hospedado em clusters dedicados de CS-3
na Cirrascale Cloud. O cliente envia uma carga PyTorch compatível e paga pelo serviço de treinamento
do modelo.[^software] A plataforma abstrai o cluster em escala de wafer, em vez de expô-lo como uma
máquina virtual de uso geral com aceleradores.

Os produtos de software são reunidos sob o nome **CSoft**. Eles incluem integração com PyTorch, um
Model Zoo, o SDK da Cerebras e a Cerebras Software Language para kernels de nível mais
baixo.[^docs] A compatibilidade dos modelos e o suporte do compilador são partes importantes da
plataforma, pois softwares escritos especificamente para o ecossistema de GPUs podem precisar de
adaptação.

## Cerebras Inference

A Cerebras apresentou seu serviço de inferência hospedada em agosto de 2024.[^inference-launch] O
serviço opera modelos compatíveis de pesos abertos em sistemas WSE e os oferece por uma API
compatível com a da OpenAI. Um plano por autoatendimento, com cobrança por token, foi lançado em
outubro de 2025.[^pay-token]

Os planos para desenvolvedores e empresas oferecem limites, prioridades, condições de serviço e
suporte diferentes. As opções empresariais também incluem pesos personalizados, treinamento e
ajuste fino.[^pricing] A Cerebras determina as versões implantadas, o software de execução e a
capacidade subjacente.

A empresa promove o serviço principalmente pela velocidade de geração de tokens e publicou
resultados com taxas de saída muito superiores às de alguns endpoints baseados em
GPUs.[^inference] Esses benchmarks foram produzidos pela própria Cerebras e dependem do modelo, da
quantização, do tamanho do prompt, da concorrência e do método de medição. A latência da rede e as
filas também influenciam o tempo de resposta percebido pelo aplicativo.

No catálogo, a Cerebras diferencia modelos de produção de modelos em fase de prévia. A oferta e o
status podem mudar com a introdução de novas versões ou a retirada de implantações
antigas.[^models] O serviço também está disponível por parceiros como a OpenRouter, que pode formar
uma camada separada de roteamento e cobrança.

## Negócios

A receita da Cerebras vem de sistemas físicos, capacidade em nuvem, software e serviços
relacionados. Os documentos de sua oferta pública descrevem um negócio dependente de fabricação
especializada de semicondutores, infraestrutura de nuvem e um número limitado de grandes
clientes.[^s1] A arquitetura oferece uma alternativa a clusters de GPUs para cargas compatíveis,
enquanto seu ambiente próprio de hardware e software pode exigir trabalho adicional na migração de
aplicativos para plataformas de GPU ou a partir delas.

## Referências

[^company]: [Empresa](https://www.cerebras.ai/company), Cerebras.

[^inference]: [Cerebras Inference](https://www.cerebras.ai/inference), Cerebras.

[^investor-faq]: [Perguntas frequentes para investidores](https://investors.cerebras.ai/shareholder-services/investor-faqs/), Cerebras.

[^cs3]: [Cerebras CS-3](https://www.cerebras.ai/blog/cerebras-cs3), Cerebras, 12 de março de 2024.

[^ipo]: [Cerebras Systems anuncia o preço da oferta pública inicial](https://investors.cerebras.ai/news-releases/news-release-details/cerebras-systems-announces-pricing-initial-public-offering), Cerebras, 13 de maio de 2026.

[^system]: [Sistema CS-3](https://www.cerebras.ai/system/), Cerebras.

[^software]: [Plataforma de software da Cerebras](https://www.cerebras.ai/product-software), Cerebras.

[^docs]: [Documentação para desenvolvedores](https://docs.cerebras.ai/), Cerebras.

[^inference-launch]: [Apresentação do Cerebras Inference](https://www.cerebras.ai/blog/introducing-cerebras-inference-ai-at-instant-speed), Cerebras, 27 de agosto de 2024.

[^pay-token]: [Cerebras Inference passa a oferecer cobrança por token](https://www.cerebras.ai/blog/cerebras-inference-now-available-via-pay-per-token), Cerebras, 13 de outubro de 2025.

[^pricing]: [Preços](https://www.cerebras.ai/pricing), Cerebras, acesso em 18 de julho de 2026.

[^models]: [Visão geral dos modelos](https://inference-docs.cerebras.ai/models/overview), documentação de inferência da Cerebras.

[^s1]: [Declaração de registro no Formulário S-1](https://www.sec.gov/Archives/edgar/data/2021728/000162828026029503/cerebras-sx1amay2026.htm), Cerebras Systems, apresentada à Comissão de Valores Mobiliários dos Estados Unidos em 2026.
