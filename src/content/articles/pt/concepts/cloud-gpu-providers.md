---
id: cloud-gpu-providers
title: Provedores de GPU na nuvem
summary: Serviços que alugam capacidade remota de GPUs ou outros aceleradores, em contraste com provedores que oferecem modelos por endpoints de inferência gerenciada.
locale: pt-BR
kind: concept
translatedFromRevision: 1
categories:
  - artificial-intelligence
aliases:
  - provedores de instâncias de GPU na nuvem
  - provedores de nuvem com GPU
  - provedores de aluguel de GPU
redirects:
  - cloud-gpu-instance-providers
  - gpu-cloud-providers
  - gpu-rental-providers
related:
  - inference-providers
  - runpod
  - vast-ai
  - prime-intellect
  - cerebras
  - model-training
infobox:
  fields:
    - key: type
      value: Categoria de infraestrutura remota com aceleradores
---

Um **provedor de GPU na nuvem** aluga capacidade remota de unidades de processamento gráfico
(**GPUs**). O serviço pode assumir a forma de máquina virtual, contêiner, servidor bare metal, nó ou
cluster com vários nós. GPUs na nuvem são muito usadas no [treinamento de
modelos](/pt/model-training/) e na inferência de inteligência artificial, além de renderização,
simulação, processamento de vídeo e outras cargas paralelas.

O termo abrange vários modelos de negócio. Nuvens públicas de uso geral operam GPUs ao lado de uma
grande variedade de serviços computacionais. Nuvens especializadas se concentram em cargas com
aceleradores, enquanto marketplaces reúnem máquinas pertencentes a hosts independentes. Algumas
plataformas combinam a capacidade de diversos provedores de nuvem já estabelecidos. A categoria
também é aplicada informalmente a outros aceleradores de IA, embora sistemas como os processadores em
escala de wafer da [Cerebras](/pt/cerebras/) não sejam GPUs.

## Serviços

Máquinas virtuais com GPUs seguem o modelo de outros produtos de infraestrutura como serviço, mas
incluem um ou mais aceleradores. Contêineres ou pods oferecem um ambiente de software preparado e
menos controle sobre o sistema operacional do host. Serviços bare metal destinam o servidor físico
inteiro a um cliente. Clusters acrescentam agendamento e comunicação de alta velocidade entre vários
nós.

A alocação nem sempre envolve um dispositivo físico completo. Algumas nuvens oferecem frações de
GPU por virtualização ou particionamento de hardware. O Google Compute Engine permite tanto a
passagem direta de GPUs para máquinas virtuais quanto configurações fracionárias.[^google-attached]
Um produto chamado de dedicado pode se referir a um acelerador, uma máquina virtual, um host físico
ou um cluster, com diferentes graus de isolamento em cada caso.

Contratos de GPU na nuvem geralmente estão disponíveis sob demanda ou por reserva. Instâncias spot ou
interrompíveis usam capacidade excedente por um preço menor, mas podem ser retomadas pelo provedor. A
Vast.ai oferece contratos sob demanda, reservados e interrompíveis em um marketplace no qual os
hosts definem os preços de processamento, armazenamento e tráfego de rede.[^vast-pricing]

## Tipos de provedor

Amazon Web Services, Google Cloud e Microsoft Azure são exemplos de nuvens públicas de uso geral com
instâncias de GPU. O Google apresenta o Compute Engine como opção para máquinas virtuais com GPUs e
clusters menores, enquanto o Vertex AI fornece um ambiente mais gerenciado para cargas de
IA.[^google-gpus] A Amazon oferece famílias de instâncias aceleradas do EC2 e, separadamente, o
serviço gerenciado Amazon Bedrock.[^aws-ec2][^bedrock] Essas empresas atuam como provedores de GPU na
nuvem ou como [provedores de inferência](/pt/inference-providers/), conforme o produto.

Nuvens especializadas costumam oferecer menos serviços convencionais, mas incluem imagens,
armazenamento, modelos prontos e provisionamento voltados a IA. Os Pods da
[Runpod](/pt/runpod/) fornecem um contêiner persistente com GPU, acesso por SSH e notebooks. A
mesma empresa também opera workers Serverless e endpoints públicos de modelos.[^runpod-pods]

Marketplaces distribuídos usam um único plano de controle para listar hardware de vários
proprietários. A [Vast.ai](/pt/vast-ai/) conecta clientes a hosts independentes e executa uma
imagem Docker escolhida pelo cliente na oferta contratada.[^vast-concepts][^vast-instances] A
[Prime Intellect](/pt/prime-intellect/) reúne fornecedores de nuvem estabelecidos e acrescenta
provisionamento e orquestração pela plataforma Compute.[^prime-compute] Nenhuma das duas empresas
necessariamente possui o acelerador físico selecionado para cada trabalho.

## Relação com provedores de inferência

Um serviço de GPU na nuvem fornece um ambiente computacional. O cliente instala ou escolhe o modelo,
o ambiente de execução, o framework e o servidor de modelos, além de assumir grande parte da
operação da implantação. Um provedor de inferência fornece um endpoint cujo acelerador e sistema de
execução são administrados como parte do serviço.

A divisão se baseia no controle operacional, não no compartilhamento físico do hardware. Um endpoint
de inferência dedicado pode reservar capacidade sem expor o sistema operacional, enquanto uma
instância de GPU pode usar apenas uma fração virtualizada do dispositivo. Produtos serverless
oferecidos por nuvens de GPU ficam em uma posição intermediária: o cliente fornece um contêiner ou
programa, e a plataforma gerencia a alocação e o dimensionamento dos workers.

O treinamento é outra diferença. Uma instância de GPU de uso geral pode executar qualquer carga
compatível de treinamento ou inferência permitida pelo provedor. APIs de inferência gerenciada usam
um modelo existente e normalmente não permitem alterar seus pesos-base. Plataformas de treinamento
gerenciado formam outra categoria, embora possam ser vendidas pela mesma empresa.

## Hardware e desempenho

O modelo da GPU e sua capacidade de memória são as especificações mais visíveis, mas não determinam
o desempenho sozinhos. Memória do host, CPU, armazenamento local e persistente, geração do PCIe,
limites de energia e versões do software podem restringir uma carga. Trabalhos com várias GPUs ou
nós também dependem da topologia e da largura de banda das interconexões.

Essas diferenças são particularmente marcantes em marketplaces. Ofertas com o mesmo modelo de GPU
podem usar processadores, discos, redes e instalações físicas diferentes. Pontuações de
confiabilidade e verificação fornecem informações sobre a oferta, mas não tornam as máquinas
uniformes.

O treinamento distribuído exige mais do que um número total suficiente de GPUs. A comunicação entre
nós pode dominar o tempo de execução, e uma interrupção pode invalidar o trabalho feito desde o
último checkpoint. A localização do cluster, a rede, o armazenamento dos checkpoints e o
comportamento de recuperação também fazem parte do desempenho efetivo do serviço.

## Preço

Os preços de GPUs na nuvem são normalmente anunciados por hora de máquina ou de GPU. O custo total
pode incluir armazenamento persistente, endereços públicos, transferência de dados, capacidade
reservada e tempo ocioso durante a configuração. Dependendo do provedor e do tipo de volume, a
cobrança de armazenamento pode continuar depois que o processamento é interrompido.

A menor tarifa por hora nem sempre produz o menor custo por trabalho concluído. Um acelerador mais
caro pode terminar a execução antes ou oferecer memória suficiente para um lote mais eficiente. Por
outro lado, armazenamento lento, transferências de rede e trabalhos interrompidos podem anular a
economia no preço do processamento.

Executar inferência por conta própria em uma instância alugada tende a se tornar mais econômico
quando a utilização aumenta. Em serviços esporádicos, o custo das réplicas ociosas e de sua
administração pode superar a cobrança por solicitação da inferência gerenciada. Alguns sistemas de
produção combinam uma frota básica de GPUs com um serviço gerenciado para picos temporários.

## Administração e segurança

O modelo de infraestrutura divide responsabilidades entre provedor e cliente. O provedor administra
as instalações, o hardware físico e o plano de controle do serviço. Em geral, o cliente cuida das
credenciais, do sistema operacional ou contêiner, dos pesos dos modelos, das portas expostas, dos
dados e dos controles de acesso do aplicativo.

Imagens e modelos de ambiente prontos reduzem o tempo de configuração, mas ainda fazem parte da
cadeia de fornecimento de software. Armazenamento efêmero pode ser perdido quando uma instância é
encerrada; volumes persistentes podem continuar existindo e gerando cobranças. Trabalhos longos de
treinamento também exigem monitoramento e checkpoints, pois a substituição do hardware não restaura
automaticamente o estado do aplicativo.

Implantações em marketplaces acrescentam o operador do host à relação de confiança. Verificação,
localização física, apagamento de discos, isolamento de rede e responsabilidade contratual variam
entre classes de serviço. Essas diferenças importam para cargas com dados sigilosos ou regulados,
mesmo quando o acelerador é alocado exclusivamente a um cliente.

## Referências

[^google-attached]: [Sobre GPUs](https://docs.cloud.google.com/compute/docs/gpus/about-gpus), documentação do Google Cloud.

[^vast-pricing]: [Preços de instâncias](https://docs.vast.ai/guides/instances/pricing), documentação da Vast.ai.

[^google-gpus]: [Plataformas de GPU](https://docs.cloud.google.com/compute/docs/gpus/overview), documentação do Google Cloud.

[^aws-ec2]: [Instâncias de computação acelerada do Amazon EC2](https://aws.amazon.com/ec2/instance-types/accelerated-computing/), Amazon Web Services.

[^bedrock]: [Visão geral da documentação do Amazon Bedrock](https://aws.amazon.com/documentation-overview/bedrock/), Amazon Web Services.

[^runpod-pods]: [Visão geral dos Pods](https://docs.runpod.io/pods/overview), documentação da Runpod.

[^vast-concepts]: [Conceitos principais](https://docs.vast.ai/guides/concepts), documentação da Vast.ai.

[^vast-instances]: [Visão geral das instâncias](https://docs.vast.ai/guides/instances/overview), documentação da Vast.ai.

[^prime-compute]: [Apresentação do Prime Intellect Compute](https://www.primeintellect.ai/blog/compute), Prime Intellect, 1º de julho de 2024.
