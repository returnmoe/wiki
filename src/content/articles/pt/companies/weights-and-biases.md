---
id: weights-and-biases
title: Weights & Biases
summary: Uma plataforma para desenvolvedores de IA voltada ao acompanhamento de experimentos, gerenciamento de modelos e dados, avaliação de aplicativos e inferência hospedada, pertencente à CoreWeave.
locale: pt-BR
kind: company
translatedFromRevision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - W&B
  - WandB
  - Weights and Biases
  - Weights & Biases, Inc.
redirects:
  - wandb
  - weights-biases
  - weights-and-biases-inc
related:
  - inference-providers
  - cloud-gpu-providers
  - model-training
  - prime-intellect
  - cerebras
infobox:
  image:
    src: /media/companies/weights-and-biases/logo.png
    alt: Logotipo da Weights & Biases com colunas de pontos dourados, o nome da empresa e a indicação by CoreWeave
    crop: false
    surface: light
    caption: Logotipo oficial da Weights & Biases
    credit: Weights & Biases
    sourceUrl: https://wandb.ai/site/brand-identity/
    license: Todos os direitos reservados
  fields:
    - key: type
      value: Empresa de plataforma para desenvolvedores de IA
    - key: founded
      value: '2017'
    - key: founders
      value:
        - Lukas Biewald
        - Chris Van Pelt
        - Shawn Lewis
    - key: headquarters
      value: São Francisco, Califórnia, Estados Unidos
    - key: key_people
      value: Lukas Biewald (gerente-geral)
    - key: industry
      value: MLOps e ferramentas para desenvolvimento de IA
    - key: parent
      value: CoreWeave
    - key: status
      value: Subsidiária ativa da CoreWeave
    - key: website
      value:
        text: wandb.ai
        url: https://wandb.ai/
---

A **Weights & Biases** (**W&B**) é uma empresa norte-americana de software que desenvolve
ferramentas para criar, avaliar e operar sistemas de aprendizado de máquina. Sua plataforma inclui
acompanhamento de experimentos, controle de versões de modelos e conjuntos de dados, rastreamento de
aplicativos, avaliações e inferência hospedada. A empresa foi fundada em 2017 por Lukas Biewald,
Chris Van Pelt e Shawn Lewis.[^about]

A operadora de nuvem com GPUs CoreWeave adquiriu a Weights & Biases em maio de 2025.[^acquisition] A W&B continua funcionando como uma organização de produtos dentro da CoreWeave,
com Biewald como gerente-geral. Seu software permanece compatível com infraestruturas e serviços de
modelos de outras empresas.

## História

Biewald e Van Pelt haviam fundado a empresa de rotulagem de dados CrowdFlower, mais tarde chamada
Figure Eight. Eles criaram a Weights & Biases com Lewis para melhorar o registro e a comparação de
experimentos de aprendizado de máquina. Biewald se tornou diretor-executivo; Van Pelt, diretor de
informação; e Lewis, diretor de tecnologia.[^about]

O primeiro produto importante da empresa combinava um cliente Python de código aberto com um painel
hospedado para acompanhamento de experimentos. Depois, a plataforma recebeu buscas de
hiperparâmetros, relatórios colaborativos, controle de versões de artefatos, registros de modelos e
opções de implantação empresarial. A W&B entrou na área de observabilidade de IA generativa com o
**Weave**, um sistema para rastrear e avaliar aplicativos que usam modelos de linguagem ou
multimodais.

A CoreWeave concluiu a aquisição em 5 de maio de 2025. As empresas afirmaram que a W&B continuaria
compatível com várias nuvens, plataformas de infraestrutura e provedores de modelos.[^acquisition]

## W&B Models

O **W&B Models** é a parte da plataforma voltada ao ciclo de desenvolvimento de modelos. O serviço
Experiments registra métricas, configurações, saídas e uso do hardware durante o treinamento. O
Sweeps coordena buscas de hiperparâmetros, enquanto Artifacts e Registry controlam as versões de
conjuntos de dados, checkpoints e outros recursos. Reports e Automations oferecem análise
colaborativa e fluxos acionados por eventos.[^models]

O processamento do treinamento normalmente ocorre na infraestrutura escolhida pelo cliente. O
cliente da W&B registra informações da execução e as envia a um serviço da W&B hospedado ou
implantado de forma privada. O acompanhamento do experimento não transfere a carga de treinamento
para hardware da W&B ou da CoreWeave.

O controle de versões dos artefatos registra os arquivos e a linhagem fornecidos pelo projeto. A
reprodutibilidade ainda depende de um registro completo do código, dos dados, da configuração e do
ambiente de software.

## Weave

O **W&B Weave** oferece observabilidade e avaliação para aplicativos de IA generativa. Ele registra
informações estruturadas sobre chamadas a modelos, recuperação de dados, ferramentas e etapas de
agentes, além de comparar versões do aplicativo em conjuntos de avaliação.[^platform] O Weave pode
ser usado com APIs de terceiros e com modelos executados pelo próprio cliente.

Quando o Weave registra uma chamada ao modelo de outra empresa, a W&B fornece a camada de
observabilidade, não a inferência. Esses registros podem conter prompts, documentos recuperados,
entradas de ferramentas, saídas e dados dos usuários. Seu acesso e sua retenção têm implicações
diferentes das métricas numéricas comuns de treinamento.

## W&B Inference

O **W&B Inference**, também chamado de **Serverless Inference**, é um serviço gerenciado de execução
de modelos. Ele oferece modelos fundacionais de pesos abertos por uma API compatível com a da OpenAI
e pela interface do Weave.[^inference][^api] A plataforma também pode executar pesos LoRA
compatíveis enviados pelo cliente sem exigir um endpoint dedicado.[^inference-product]

As solicitações de inferência são executadas na infraestrutura da CoreWeave e podem ser rastreadas e
avaliadas pelo Weave.[^inference-product] Nesses casos, a W&B funciona como [provedora de
inferência](/pt/inference-providers/). O produto não oferece máquinas virtuais com GPU
administradas pelo cliente, como as vendidas por um [provedor de GPU na
nuvem](/pt/cloud-gpu-providers/).

O catálogo de modelos disponíveis muda ao longo do tempo. A W&B classifica os modelos como
disponíveis em geral, obsoletos ou retirados e publica avisos de retirada na documentação do ciclo de
vida.[^lifecycle]

## Implantação e dados

A plataforma para desenvolvedores está disponível como serviço hospedado compartilhado, implantação
dedicada gerenciada ou software executado no ambiente do cliente, conforme a assinatura.[^pricing]
Essas opções se referem ao aplicativo da W&B e aos metadados armazenados por ele. A infraestrutura
de treinamento observada pode usar outra forma de compartilhamento.

As informações enviadas à W&B podem incluir metadados do controle de código-fonte, hiperparâmetros,
métricas, telemetria do hardware, conteúdo multimídia, saídas de modelos, conjuntos de dados,
checkpoints e registros do Weave. A empresa oferece controle de acesso por função, criptografia,
conectividade privada e opções administradas pelo cliente para uso empresarial.[^data]

A aquisição pela CoreWeave reuniu infraestrutura, inferência gerenciada e ferramentas de
desenvolvimento sob a mesma controladora. Os serviços continuam separados: a CoreWeave opera a
infraestrutura de GPUs, o W&B Inference serve modelos, e o W&B Models e o Weave registram dados de
desenvolvimento e dos aplicativos.

## Referências

[^about]: [Sobre a Weights & Biases](https://site.wandb.ai/company/about-us/), Weights & Biases.

[^acquisition]: [CoreWeave conclui a aquisição da Weights & Biases](https://coreweave.com/blog/coreweave-completes-acquisition-of-weights-biases), CoreWeave, 5 de maio de 2025.

[^models]: [W&B Models](https://wandb.ai/site/models/), Weights & Biases.

[^platform]: [Plataforma Weights & Biases](https://site.wandb.ai/), Weights & Biases.

[^inference]: [Serverless Inference](https://docs.wandb.ai/inference), documentação da Weights & Biases.

[^api]: [Visão geral da API Serverless Inference](https://docs.wandb.ai/inference/api-reference), documentação da Weights & Biases.

[^inference-product]: [W&B Serverless Inference](https://wandb.ai/site/inference/), Weights & Biases.

[^lifecycle]: [Ciclo de vida dos modelos](https://docs.wandb.ai/inference/lifecycle), documentação da Weights & Biases.

[^pricing]: [Preços e opções de implantação](https://wandb.ai/site/pricing/), Weights & Biases.

[^data]: [Segurança e privacidade dos dados](https://wandb.ai/site/data/), Weights & Biases.
