---
id: comfyui
title: ComfyUI
summary: Uma interface e mecanismo de inferência de código aberto, baseados em nós, para construir e executar fluxos de mídia generativa.
locale: pt-BR
kind: software
translatedFromRevision: 1
categories:
  - software
  - artificial-intelligence
aliases:
  - Comfy UI
related:
  - rina
  - diffusion-models
  - stable-diffusion
  - stable-diffusion-xl
infobox:
  fields:
    - key: developer
      value: comfyanonymous e colaboradores
    - key: platform
      value:
        - Windows
        - Linux
        - macOS
    - key: technologies
      value:
        - Python
        - PyTorch
    - key: repository
      value:
        text: github.com/Comfy-Org/ComfyUI
        url: https://github.com/Comfy-Org/ComfyUI
    - key: license
      value: GPL-3.0
    - key: status
      value: Ativo
    - key: website
      value:
        text: comfy.org
        url: https://www.comfy.org/
---

O **ComfyUI** é uma interface e um mecanismo de inferência de código aberto, baseados em nós, para
construir e executar fluxos de inteligência artificial generativa. Foi escrito pelo desenvolvedor
conhecido pelo pseudônimo **comfyanonymous** e por outros colaboradores e é mantido na
organização Comfy-Org no GitHub.[^documentation][^repository]

O ComfyUI não é, por si só, um modelo generativo. Ele oferece o editor de grafos, o mecanismo de
execução, os carregadores de modelos, a fila e as interfaces usados para conectar modelos e
operações em fluxos reproduzíveis. Os pesos dos modelos usados por um grafo continuam sendo
artefatos separados de software e dados.

## Modelo de fluxo de trabalho

Um **fluxo de trabalho** do ComfyUI é um grafo de **nós** conectados. Cada nó executa uma tarefa,
expõe entradas e saídas tipadas e envia seus resultados a outros nós por conexões. Assim, um grafo
pode expressar um processo como carregar um modelo, codificar um prompt, amostrar uma representação
latente, decodificar uma imagem e salvar o resultado, sem esconder essas etapas atrás de uma
interface de finalidade única.[^workflow][^nodes]

Os fluxos podem ser salvos em um formato JSON de fácil leitura. O ComfyUI também incorpora
informações do fluxo a arquivos gerados compatíveis, o que permite reabrir o grafo que produziu uma
saída. Quando um grafo é executado novamente, o mecanismo pode reutilizar resultados inalterados e
executar somente as partes afetadas pelas entradas modificadas.[^workflow][^repository]

O servidor local recebe fluxos por uma API HTTP, coloca-os em uma fila de execução e usa uma conexão
WebSocket para mensagens de progresso. Desse modo, a interface visual e os pipelines automatizados
de produção podem usar o mesmo modelo de execução por grafos.[^server-api]

## Modelos e mídia

O ComfyUI tornou-se amplamente associado a fluxos de imagem com [modelos de
difusão](/pt/diffusion-models/) e oferece suporte a famílias como [Stable
Diffusion](/pt/stable-diffusion/) e [Stable Diffusion XL](/pt/stable-diffusion-xl/). Seu
escopo é mais amplo que uma única família de modelos: o projeto documenta fluxos para geração e
edição de imagens, vídeo, áudio e conteúdo 3D. O suporte exato a modelos muda à medida que os nós
principais e os modelos de fluxo são atualizados.[^repository]

O aplicativo principal pode ser executado localmente e não exige o serviço hospedado da Comfy. As
opções oficiais de distribuição incluem builds para desktop, um pacote portátil para Windows e
instalação manual no Windows, Linux e macOS. O **Comfy Cloud** é uma forma hospedada e separada de
executar fluxos compatíveis; nós opcionais de API também podem chamar provedores externos de
modelos.[^repository][^installation]

## Extensibilidade e considerações operacionais

A instalação básica inclui nós **Comfy Core** mantidos oficialmente. Autores da comunidade podem
adicionar **nós personalizados**, que podem implementar novas integrações de modelos, operações de
processamento ou extensões de interface. Nós personalizados podem trazer suas próprias dependências
Python, e versões de dependências incompatíveis podem quebrar outras extensões no mesmo
ambiente.[^custom-nodes]

Como os nós personalizados são extensões executáveis, e não dados inertes de um fluxo, a origem e a
procedência do código importam. Os padrões do registro do ComfyUI proíbem código ofuscado,
instalação de pacotes em tempo de execução e usos de `eval` ou `exec` que possam possibilitar
vulnerabilidades de execução arbitrária de código.[^registry-standards] Portanto, um fluxo
compartilhado pode ser portátil como JSON e, ainda assim, exigir arquivos específicos de modelos e
pacotes de nós confiáveis para funcionar corretamente.

## Uso com Rina

No Arduino Day 2025 do Rio Maker Space, [Rodrigo Laneth](/pt/rodrigo-laneth/) apresentou o
ComfyUI como contraparte visual da demonstração do modelo de linguagem de [Rina](/pt/rina/). A
experiência conjunta mostrou, a participantes sem experiência anterior com design de personagens de
IA ou prompts de sistema, tanto o design conversacional quanto a geração de recursos visuais para
essas personagens.

Laneth hospedou por conta própria os serviços de Rina e o ComfyUI na mesma instância dedicada de GPU
em nuvem. Tratava-se de uma implantação do servidor ComfyUI de código aberto em infraestrutura
controlada por Laneth, e não do uso do serviço Comfy Cloud. O chat com o modelo de linguagem de Rina
e os fluxos de geração de imagem do ComfyUI eram cargas de trabalho separadas que compartilhavam
essa infraestrutura computacional.

## Referências

[^documentation]: [Documentação oficial do ComfyUI](https://docs.comfy.org/).

[^repository]: [Repositório do código-fonte do ComfyUI](https://github.com/Comfy-Org/ComfyUI).

[^workflow]: [Workflow](https://docs.comfy.org/development/core-concepts/workflow), documentação do ComfyUI.

[^nodes]: [Nodes](https://docs.comfy.org/development/core-concepts/nodes), documentação do ComfyUI.

[^server-api]:
    [Rotas do servidor ComfyUI](https://docs.comfy.org/development/comfyui-server/comms_routes),
    documentação do ComfyUI.

[^installation]:
    [Instalação manual](https://docs.comfy.org/installation/manual_install), documentação do
    ComfyUI.

[^custom-nodes]:
    [Custom nodes](https://docs.comfy.org/development/core-concepts/custom-nodes), documentação do
    ComfyUI.

[^registry-standards]: [Padrões do registro](https://docs.comfy.org/registry/standards), documentação do ComfyUI.
