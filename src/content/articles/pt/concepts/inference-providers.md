---
id: inference-providers
title: Provedores de inferência
summary: Serviços que executam modelos de IA treinados em endpoints gerenciados, em contraste com serviços de infraestrutura que alugam instâncias com aceleradores.
locale: pt-BR
kind: concept
translatedFromRevision: 1
categories:
  - artificial-intelligence
aliases:
  - provedores de inferência de IA
  - provedores de inferência de modelos
  - provedores de inferência gerenciada
redirects:
  - ai-inference-providers
  - managed-inference-providers
related:
  - cloud-gpu-providers
  - openrouter
  - runpod
  - vast-ai
  - prime-intellect
  - weights-and-biases
  - cerebras
  - model-training
infobox:
  fields:
    - key: type
      value: Categoria de serviço gerenciado de execução de modelos de IA
---

Um **provedor de inferência** é um serviço que opera modelos de inteligência artificial já treinados
e os disponibiliza por uma interface de programação de aplicações ou outro endpoint gerenciado. O
cliente envia texto, imagens, áudio ou outros dados e recebe a saída do modelo sem administrar os
servidores nos quais ele é executado. Em geral, o provedor gerencia os pesos do modelo, o software de
inferência, os aceleradores, o dimensionamento da capacidade e a cobrança.

A expressão descreve um serviço, não um tipo específico de empresa. Desenvolvedores podem
disponibilizar seus próprios modelos proprietários, empresas especializadas podem operar modelos de
pesos abertos e gateways podem encaminhar solicitações a vários hosts. Grandes empresas de computação em nuvem
também oferecem inferência gerenciada ao lado de máquinas virtuais convencionais. A Hugging Face usa
o nome **Inference Providers** para um serviço que reúne modelos hospedados por várias empresas sob
um mesmo sistema de autenticação e cobrança.[^hf] O Amazon Bedrock é outro serviço com modelos de
diversas origens, embora a Amazon o descreva como uma plataforma totalmente gerenciada de modelos
fundacionais.[^bedrock]

## Funcionamento

Um serviço de inferência carrega um modelo na memória e o executa em um sistema preparado para
receber solicitações de vários aplicativos. O sistema pode agrupar solicitações compatíveis, manter
réplicas, substituir workers com falha e ajustar a capacidade de acordo com a demanda. Autenticação,
limites de uso, transmissão contínua de respostas, monitoramento e controle de versões do modelo
também costumam fazer parte do serviço.

O grau de controle do cliente varia. Serviços de catálogo oferecem modelos pré-configurados e um
conjunto de parâmetros de geração. Endpoints gerenciados mais flexíveis podem aceitar um checkpoint,
contêiner, modelo quantizado ou adaptador [LoRA](/pt/low-rank-adaptation/) fornecido pelo cliente.
Endpoints serverless podem reduzir o número de workers quando não há uso, enquanto serviços de
capacidade provisionada reservam recursos para um cliente. Em ambos os casos, trata-se de inferência
gerenciada porque o provedor continua responsável pelo ambiente de execução.

A inferência é diferente do [treinamento de modelos](/pt/model-training/). O treinamento altera
os parâmetros de um modelo; a inferência usa um conjunto de parâmetros existente para produzir uma
previsão ou outro resultado. Algumas empresas vendem os dois serviços, mas o treinamento costuma ser
um produto separado, com hardware, agendamento e cobrança próprios.

## Relação com serviços de GPU na nuvem

Um [provedor de GPU na nuvem](/pt/cloud-gpu-providers/) aluga um ambiente computacional com
aceleradores. Em geral, o cliente escolhe e opera o servidor de modelos, o framework, os drivers e os
pesos. Já um provedor de inferência entrega um endpoint de modelo em funcionamento. Serviços de GPU
na nuvem costumam cobrar pelo tempo da instância ou do acelerador; serviços de inferência geralmente
cobram por tokens, imagens, solicitações, tempo de processamento ou capacidade reservada.

| Característica      | Inferência gerenciada                             | Instância de GPU na nuvem                    |
| ------------------- | ------------------------------------------------- | -------------------------------------------- |
| Recurso principal   | Endpoint de modelo                                | Máquina ou contêiner com acelerador          |
| Servidor de modelos | Operado pelo provedor                             | Operado pelo cliente                         |
| Acesso do cliente   | API ou interface do produto                       | Shell, máquina virtual, contêiner ou cluster |
| Cobrança comum      | Solicitação, token, saída ou capacidade reservada | Tempo da instância ou do acelerador          |
| Treinamento         | Produto separado, quando disponível               | Possível no ambiente alugado                 |

Essa distinção não determina se a infraestrutura é compartilhada. Um endpoint gerenciado pode
reservar hardware para um único cliente, enquanto uma máquina virtual pode usar apenas uma fração de
um acelerador. Dependendo do produto, a palavra **dedicado** pode se referir a um endpoint, uma
máquina virtual, um acelerador, um host físico ou um cluster.

Grandes plataformas de nuvem atuam nos dois níveis. O Google Compute Engine oferece máquinas virtuais
com GPUs, enquanto o Vertex AI Model Garden inclui tanto modelos servidos por APIs gerenciadas quanto
modelos implantados em endpoints gerenciados do Vertex.[^gcp-gpus][^model-garden] A Amazon também
oferece instâncias EC2 com GPUs e, separadamente, o serviço de modelos Bedrock.[^ec2][^bedrock] A
mesma empresa pode, portanto, vender inferência gerenciada e instâncias de GPU sem que os produtos
sejam equivalentes.

## Modelos de serviço

APIs operadas pelo próprio desenvolvedor são a forma habitual de acesso a modelos proprietários
cujos pesos de produção não são distribuídos. O desenvolvedor controla as versões, os limites de
uso, os sistemas de segurança e a interface disponível.

Hosts com vários modelos operam catálogos de diferentes desenvolvedores, sobretudo de modelos com
pesos abertos. Eles oferecem uma conta e uma API comuns, mas escolhem o ambiente de execução, a
quantização, a política de agrupamento e o hardware de cada implantação. O catálogo muda à medida que
modelos são lançados, atualizados ou retirados.

Gateways e marketplaces acrescentam outra camada. O [OpenRouter](/pt/openrouter/) recebe uma
solicitação por uma API única e a encaminha a um endpoint elegível. Seus controles de roteamento
podem considerar preço, disponibilidade, latência, taxa de processamento e política de
dados.[^or-routing] Assim, o desenvolvedor do modelo, o gateway, o host de inferência e o operador da
nuvem física podem ser quatro organizações diferentes.

Endpoints personalizados gerenciados ocupam uma posição intermediária entre APIs de catálogo e o
aluguel de infraestrutura. O Serverless da [Runpod](/pt/runpod/) executa contêineres fornecidos
pelo cliente em workers com dimensionamento automático. O cliente continua responsável pelo
aplicativo no contêiner, e a Runpod opera a fila de solicitações e o conjunto de workers.[^runpod-serverless]
O [W&B Inference](/pt/weights-and-biases/) oferece modelos de pesos abertos por uma API
compatível com a da OpenAI e também executa pesos LoRA compatíveis fornecidos pelo
cliente.[^wandb-inference]

## Preço e desempenho

A cobrança por uso torna a inferência gerenciada adequada a aplicativos com demanda variável, pois
servidores inativos não geram uma cobrança visível por instância. Em cargas constantes, administrar
aceleradores diretamente pode reduzir o custo imediato. Uma comparação completa também envolve
capacidade ociosa, trabalho de engenharia, replicação, armazenamento, rede e recuperação de falhas.

A latência inclui o trânsito pela rede, as filas de admissão, a preparação do modelo, o tempo até o
primeiro token e a geração da saída. Endpoints serverless podem sofrer uma inicialização a frio
quando nenhum worker apropriado está ativo. A capacidade provisionada reduz esse atraso, mas gera
uma cobrança permanente.

O roteamento entre provedores pode aumentar a disponibilidade, porém também afeta a
reprodutibilidade. Endpoints anunciados com o mesmo nome de modelo podem usar quantizações, kernels,
sistemas de segurança ou versões diferentes. A seleção do provedor e os metadados da resposta são
relevantes quando uma implantação precisa produzir resultados estáveis em avaliações.

## Tratamento de dados

A inferência gerenciada envia dados a um serviço externo, e serviços com roteamento podem incluir
intermediários adicionais. Cada organização no caminho da solicitação pode ter suas próprias
políticas de registro, retenção, treinamento de modelos, monitoramento de abuso e localização do
processamento.

O OpenRouter afirma que não conserva o conteúdo de prompts e respostas por padrão, mas registra
metadados como modelo, provedor, número de tokens e latência. O serviço publica políticas de dados
por endpoint e permite restringir solicitações a provedores identificados como compatíveis com
retenção zero.[^or-data] A política do endpoint usado pelo cliente não descreve necessariamente
todos os operadores que processam a solicitação.

A compatibilidade entre APIs também tem limites. Serviços que seguem o formato da OpenAI podem
diferir nos parâmetros aceitos, no tamanho do contexto, nas chamadas de ferramentas, nos erros, nos
controles de conteúdo e no ciclo de vida dos modelos. A interface comum reduz o trabalho de
integração, mas não torna os serviços técnica ou contratualmente idênticos.

## Referências

[^hf]: [Inference Providers](https://huggingface.co/docs/inference-providers/en/index), documentação da Hugging Face.

[^bedrock]: [Visão geral da documentação do Amazon Bedrock](https://aws.amazon.com/documentation-overview/bedrock/), Amazon Web Services.

[^gcp-gpus]: [Plataformas de GPU](https://docs.cloud.google.com/compute/docs/gpus/overview), documentação do Google Cloud.

[^model-garden]: [Explorar modelos no Model Garden](https://cloud.google.com/vertex-ai/generative-ai/docs/model-garden/explore-models), documentação do Google Cloud.

[^ec2]: [Instâncias de computação acelerada do Amazon EC2](https://aws.amazon.com/ec2/instance-types/accelerated-computing/), Amazon Web Services.

[^or-routing]: [Roteamento de provedores](https://openrouter.ai/docs/guides/routing/provider-selection), documentação da OpenRouter.

[^runpod-serverless]: [Visão geral do Serverless](https://docs.runpod.io/serverless/overview), documentação da Runpod.

[^wandb-inference]: [Serverless Inference](https://docs.wandb.ai/inference), documentação da Weights & Biases.

[^or-data]: [Coleta de dados](https://openrouter.ai/docs/guides/privacy/data-collection) e [políticas de dados dos provedores](https://openrouter.ai/docs/guides/privacy/provider-logging/), documentação da OpenRouter.
