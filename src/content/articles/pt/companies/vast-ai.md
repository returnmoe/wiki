---
id: vast-ai
title: Vast.ai
summary: Um marketplace distribuído de GPUs na nuvem que conecta clientes a hosts independentes e também oferece inferência serverless e clusters.
locale: pt-BR
kind: company
translatedFromRevision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - Vast AI
  - Vast.ai Inc.
redirects:
  - vastai
related:
  - cloud-gpu-providers
  - inference-providers
  - runpod
  - prime-intellect
  - model-training
infobox:
  image:
    src: /media/companies/vast-ai/logo.svg
    alt: Logotipo da Vast.ai com um V contornado ao lado do nome da empresa
    crop: false
    surface: light
    caption: Logotipo oficial da Vast.ai
    credit: Vast.ai
    sourceUrl: https://vast.ai/press-kit
    license: Todos os direitos reservados
  fields:
    - key: type
      value: Marketplace distribuído de GPUs na nuvem
    - key: founded
      value: 28 de junho de 2016
    - key: founders
      value:
        - Jake Cannell
        - Christian Horne
    - key: headquarters
      value: Los Angeles, Califórnia, Estados Unidos
    - key: key_people
      value:
        - Jake Cannell (diretor-executivo)
        - Travis Cannell (diretor de operações)
    - key: industry
      value: Computação em nuvem e infraestrutura de IA
    - key: status
      value: Ativa; empresa de capital fechado em julho de 2026
    - key: website
      value:
        text: vast.ai
        url: https://vast.ai/
---

A **Vast.ai** é uma empresa norte-americana de computação em nuvem que opera um marketplace
distribuído de capacidade em unidades de processamento gráfico. Hosts independentes anunciam
máquinas no serviço, e os clientes as escolhem de acordo com o hardware, a localização, a
confiabilidade e o preço. A Vast.ai fornece os sistemas de busca, provisionamento, cobrança,
reputação e controle usados pelas duas partes.[^concepts][^press]

As instâncias do marketplace formam um [serviço de GPU na
nuvem](/pt/cloud-gpu-providers/). A Vast.ai também oferece workers Serverless e clusters
gerenciados, o que estende a plataforma a serviços próximos dos [provedores de
inferência](/pt/inference-providers/).[^start]

## História

A Vast.ai foi constituída em 28 de junho de 2016 por Jake Cannell e Christian Horne. Cannell
desenvolveu a ideia enquanto trabalhava com redes neurais e buscava acesso a GPUs mais baratas. O
marketplace ficou disponível ao público em 2018.[^about]

A empresa tem sede em Los Angeles. Jake Cannell é o diretor-executivo, e Travis Cannell, o diretor de
operações. Em 2026, os materiais de imprensa da Vast.ai informavam que a plataforma reunia centenas
de hosts independentes em dezenas de data centers.[^press] A quantidade e a localização dos hosts
ativos mudam conforme a oferta do marketplace.

## Marketplace

Os hosts instalam o software da Vast.ai em máquinas compatíveis e publicam ofertas com os recursos
disponíveis de GPU, CPU, memória, armazenamento e rede. Eles definem os preços e continuam
responsáveis pelo hardware, pela conexão com a internet, pela configuração e pela
manutenção.[^hosting] Entre os operadores estão tanto pessoas físicas quanto data centers
profissionais.

Os clientes pesquisam as ofertas por atributos como modelo e número de GPUs, memória, verificação,
confiabilidade, localização, velocidade do armazenamento e da rede. Depois da contratação, a Vast.ai
inicia uma imagem Docker escolhida pelo cliente com os recursos indicados no anúncio. As instâncias
podem oferecer acesso por SSH, notebook e serviços web.[^instances]

O produto comum de instâncias aloca uma GPU ao contêiner do cliente, mas não entrega o ambiente
completo do servidor físico. O sistema operacional do host e o software da Vast.ai permanecem fora
do contêiner. CPU, disco e rede têm as características específicas de cada anúncio.

A Vast.ai diferencia máquinas verificadas em data centers dos demais hosts do marketplace. A
verificação acrescenta inspeções da plataforma, mas não torna todas as máquinas equivalentes. A
configuração do hardware, a localização física, a arquitetura de rede e os contratos continuam
variando entre operadores.

## Preços

Os hosts definem os preços da Vast.ai, que mudam com a oferta e a demanda. Processamento,
armazenamento e tráfego de rede podem ser cobrados separadamente. A plataforma oferece contratos sob
demanda, reservados e interrompíveis.[^pricing]

Contratos sob demanda permanecem em execução enquanto o cliente paga e o host está disponível. Os
contratos reservados oferecem desconto em troca de um compromisso antecipado. Instâncias
interrompíveis têm preço mais baixo, mas podem ser ocupadas por outro cliente. Dependendo do estado
da instância, o armazenamento pode continuar gerando cobranças depois da interrupção do
processamento.

O modelo de marketplace permite que GPUs semelhantes sejam anunciadas por preços diferentes. O custo
de um trabalho concluído também depende da velocidade do armazenamento, da confiabilidade do host, do
tempo de transferência dos dados e de eventuais interrupções. Essas diferenças tendem a ser maiores
do que em uma frota padronizada operada por uma única empresa.

## Serverless e clusters

O **Vast.ai Serverless** executa workers em contêineres para atender solicitações e ajusta a
capacidade entre máquinas elegíveis do marketplace.[^start] O cliente fornece o aplicativo, enquanto
a plataforma gerencia o agendamento dos workers e a distribuição das solicitações. É um serviço mais
gerenciado do que uma instância comum da Vast.ai, embora o aplicativo e o modelo ainda sejam
fornecidos pelo cliente.

A empresa também oferece clusters coordenados e uma classe de fornecimento chamada **Secure
Cloud**.[^press] Os clusters se destinam a cargas que precisam de vários aceleradores interligados. A
Secure Cloud limita a implantação a infraestruturas que atendam a requisitos operacionais
adicionais. Esses produtos usam a plataforma mais ampla da Vast.ai, mas diferem de uma busca sem
restrições no marketplace.

## Características operacionais

O fornecimento distribuído disponibiliza, por uma única interface, GPUs de consumo, aceleradores de
data center e máquinas que estariam ociosas. Ele também produz diferenças entre anúncios do mesmo
modelo de GPU. Processadores, discos, redes, limites de energia, topologia entre GPUs e tempo de
atividade podem afetar o desempenho.

As condições de segurança também dependem do host e da classe de serviço. A alocação exclusiva da
GPU não estabelece, por si só, uso exclusivo da máquina física completa, apagamento seguro de
discos, conformidade regulatória ou uma jurisdição específica. Os dados de verificação e
confiabilidade da Vast.ai ajudam a descrever os hosts, mas o modelo de marketplace expõe ao cliente
mais variações de infraestrutura do que uma nuvem convencional.

## Referências

[^concepts]: [Conceitos principais](https://docs.vast.ai/guides/concepts), documentação da Vast.ai.

[^press]: [Kit de imprensa](https://vast.ai/press-kit), Vast.ai.

[^start]: [Primeiros passos com a Vast.ai](https://docs.vast.ai/guides/get-started/index), documentação da Vast.ai.

[^about]: [Sobre a Vast.ai](https://vast.ai/about), Vast.ai.

[^hosting]: [Visão geral para hosts](https://docs.vast.ai/host/hosting-overview), documentação da Vast.ai.

[^instances]: [Visão geral das instâncias](https://docs.vast.ai/guides/instances/overview), documentação da Vast.ai.

[^pricing]: [Preços das instâncias](https://docs.vast.ai/guides/instances/pricing), documentação da Vast.ai.
