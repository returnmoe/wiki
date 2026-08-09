---
id: miru-tracer
title: Miru Tracer
summary: Um aplicativo de código aberto para acompanhar a geração de tokens, ler estados intermediários do modelo e testar intervenções nas ativações.
locale: pt-BR
kind: software
translatedFromRevision: 1
categories:
  - software
  - projects
  - research
  - artificial-intelligence
aliases:
  - Miru
  - iniciativa Miru
  - rastreador de tokens Miru
redirects:
  - miru
  - miru-tracer-v0-2-0
related:
  - return-moe
  - mechanistic-interpretability
  - jacobian-lens
infobox:
  fields:
    - key: developer
      value:
        text: return moe
        article: return-moe
    - key: initial_release
      value: 20 de novembro de 2025
    - key: latest_release
      value: v0.3.3 (27 de julho de 2026)
    - key: platform
      value: Aplicativo web Gradio
    - key: technologies
      value:
        - Python
        - PyTorch
        - Hugging Face Transformers
    - key: repository
      value:
        text: github.com/returnmoe/miru-tracer
        url: https://github.com/returnmoe/miru-tracer
    - key: license
      value: Unlicense, com trechos incorporados sob licenças separadas
    - key: status
      value: Ativa
---

A **Miru Tracer** é um aplicativo de código aberto desenvolvido pela [return
moe](/pt/return-moe/) para examinar a geração de modelos de linguagem. Pela interface em
Gradio, é possível acompanhar distribuições de probabilidade token a token, ler estados
intermediários com lentes de logit e [lentes jacobianas](/pt/jacobian-lens/) e aplicar
intervenções nas ativações durante a execução do modelo.[^introduction][^v02][^repository]

## História

A return moe anunciou a **Miru** em novembro de 2025 como uma iniciativa de [interpretabilidade
mecanicista](/pt/mechanistic-interpretability/). O nome vem do verbo japonês 見る (_miru_),
“ver” ou “observar”. A Miru Tracer foi o primeiro projeto da iniciativa e continua sendo a única
ferramenta lançada com esse nome.[^introduction]

A versão original se concentrava na saída do modelo. Ela mostrava a probabilidade e a entropia dos
possíveis tokens seguintes e permitia que o usuário substituísse a escolha do modelo antes de
continuar a geração.[^introduction]

A return moe publicou o lançamento oficial da v0.2 em 16 de julho de 2026. Até o anúncio, correções
feitas durante o desenvolvimento já haviam levado o número da versão a v0.2.4, embora o lançamento
fosse apresentado como v0.2. Com a atualização, a Miru Tracer deixou de se limitar à análise do
próximo token e passou também a inspecionar e modificar ativações intermediárias.[^v02]

A série v0.3 começou em 26 de julho de 2026 e chegou à v0.3.3 no dia 27. A versão 0.3.0 alinhou as
posições de tokens exibidas aos estados residuais realmente decodificados, reduziu a frequência e o
custo de memória dos checkpoints durante o ajuste das lentes, acrescentou diagnósticos detalhados
para ajustes longos e passou a conferir a proveniência da lente ajustada com o modelo carregado.
Três versões de correção refinaram essas verificações, corrigiram a exibição de probabilidades muito
pequenas e eliminaram uma falsa incompatibilidade de impressão digital da arquitetura em
configurações compostas da Qwen3.5 e da Qwen3.6. Essas mudanças não exigiram um novo ajuste das
matrizes jacobianas existentes.[^v03]

## Leitura e alteração dos estados do modelo

A lente de logit passa um estado residual intermediário pelas camadas finais de normalização e
saída do modelo. Ela não exige ajuste separado e costuma ser mais fácil de ler perto do fim da
rede. Como as camadas iniciais trabalham com representações que ainda podem ser diferentes do
espaço de saída, os resultados da lente de logit nessas camadas são mais difíceis de
interpretar.[^v02]

A lente jacobiana estima como mudanças em uma camada anterior afetam o estado residual final. Ela
pode produzir leituras mais claras no meio do modelo, mas exige um ajuste feito para o checkpoint
exato em análise. A preparação desse ajuste ocorre separadamente e demanda bastante
processamento.[^v02]

A Miru Tracer organiza essas leituras em uma visualização por camada e token. Nela, o usuário pode
comparar as duas lentes, acompanhar um token selecionado ao longo da rede e examinar diferentes
posições de uma sequência gerada. Desde a v0.3.0, selecionar a posição de token `p` decodifica o
resíduo produzido pelo bloco nessa mesma posição, depois que o token entra no contexto causal; por
isso, a última linha da lente de logit fornece a distribuição do token seguinte. Versões anteriores
exibiam o token `p` enquanto decodificavam a posição `p - 1`, de modo que capturas de tela e
interpretações com o alinhamento antigo precisam ser recalculadas antes de uma comparação direta.
Os rótulos são projeções no vocabulário do modelo, não uma transcrição de raciocínio privado nem uma
descrição definitiva do que o modelo estaria pensando.[^v02][^v03]

As direções encontradas pelas lentes também podem alterar a geração. O direcionamento soma ou
subtrai uma direção; a ablação remove o componente alinhado a ela; e a troca transfere esse
componente de uma direção de token para outra. Essas intervenções modificam as ativações durante a
execução, sem editar os pesos do modelo, e podem ser combinadas em diferentes camadas na mesma
passagem pela rede.[^v02]

## Ajustes e adaptadores das lentes

Arquivos de ajuste recentes da Miru podem registrar o repositório do modelo, a revisão imutável
resolvida, a configuração normalizada da arquitetura, a impressão digital do tokenizador, a revisão
do corpus de calibração e detalhes de convergência. A Miru compara as informações de identidade
disponíveis com o modelo carregado e rejeita incompatibilidades confirmadas. Artefatos antigos ou de
outros projetos sem proveniência completa continuam utilizáveis com um aviso, e há uma opção de
substituição de escopo restrito quando o usuário verifica o ajuste de forma independente; as
verificações de largura e intervalo de camadas não podem ser ignoradas. A versão 0.3.3 define a
impressão digital da arquitetura pela configuração textual causal dos modelos compostos, evitando
que configurações externas e somente de texto equivalentes sejam tratadas como arquiteturas
diferentes.[^v03][^v033docs]

A return moe também mantém uma coleção pública de adaptadores J-Lens pré-ajustados para
`Qwen/Qwen3-0.6B`, `Qwen/Qwen3-4B`, `Qwen/Qwen3-8B` e `Qwen/Qwen3.6-27B`. Cada adaptador é um arquivo
`safetensors` específico de um modelo e contém transformações por camada e metadados do ajuste. Eles
são artefatos de interpretabilidade, não adaptadores LoRA, modelos com ajuste fino, pesos de modelo
ou plugins de geração; ainda é necessário carregar na Miru o checkpoint exato do modelo-base.[^adapters]

## Geração e limitações

A Miru Tracer preserva os controles token a token da primeira versão. O mecanismo de geração da
v0.2 distingue as probabilidades brutas do modelo da distribuição produzida depois dos ajustes de
temperatura, top-k e top-p. É possível interromper uma sessão, voltar a um token anterior, retomar a
geração e exportar um log versionado para análise posterior.[^v02]

O software é escrito em Python e carrega modelos compatíveis pelo Hugging Face Transformers. O
aplicativo web, o utilitário de ajuste das lentes e a ferramenta de conversão de ajustes estão
disponíveis como programas de linha de comando, e o projeto também publica imagens de contêiner. A
versão 0.3.3 inclui detecção de arquitetura para as famílias Llama, Qwen, Mistral, Gemma, OLMo,
GPT-2, Phi e GPT-NeoX, além de wrappers da Gemma 4 e modelos GLM MoE-DSA. A maioria das famílias é
coberta por testes com modelos minúsculos, não por validação em escala completa; portanto, o suporte
a uma arquitetura não garante que todos os checkpoints, modos de quantização ou configurações de
hardware tenham sido testados.[^v033docs][^repository]

A Miru Tracer é um instrumento experimental. Uma leitura clara da lente ou uma intervenção que
altere a saída não demonstra que o rótulo de um token corresponda a um conceito único e isolado
dentro do modelo. Os resultados precisam ser comparados entre camadas, lentes, prompts e execuções
repetidas.[^v02]

## Referências

[^introduction]:
    Rodrigo Laneth, [Miru: reverse engineering neural
    networks](https://blog.return.moe/en/2025/11/20/miru-reverse-engineering-neural-networks/),
    blog da return moe, 20 de novembro de 2025.

[^v02]:
    Rodrigo Laneth, [Miru Tracer v0.2: from token probabilities to model
    internals](https://blog.return.moe/en/2026/07/16/miru-tracer-v0-2/), blog da return moe, 16 de
    julho de 2026; [tag do lançamento
    v0.2.4](https://github.com/returnmoe/miru-tracer/releases/tag/v0.2.4), GitHub.

[^v03]:
    [Miru Tracer v0.3.0](https://github.com/returnmoe/miru-tracer/releases/tag/v0.3.0),
    [v0.3.1](https://github.com/returnmoe/miru-tracer/releases/tag/v0.3.1),
    [v0.3.2](https://github.com/returnmoe/miru-tracer/releases/tag/v0.3.2) e
    [v0.3.3](https://github.com/returnmoe/miru-tracer/releases/tag/v0.3.3), GitHub, 26–27 de julho de 2026.

[^v033docs]:
    [README da Miru Tracer
    v0.3.3](https://github.com/returnmoe/miru-tracer/blob/v0.3.3/README.md) e [tutorial das
    lentes](https://github.com/returnmoe/miru-tracer/blob/v0.3.3/docs/lens-tutorial.md), GitHub.

[^adapters]:
    [Adaptadores de lente jacobiana da Miru
    Tracer](https://huggingface.co/returnmoe/jlens-adapters), Hugging Face.

[^repository]: [Repositório da Miru Tracer](https://github.com/returnmoe/miru-tracer).
