---
id: see-through
title: See-through
summary: Um framework de código aberto que decompõe uma única ilustração de anime em camadas semânticas com regiões ocultas preenchidas e uma ordem de composição inferida para animação 2,5D.
locale: pt-BR
kind: software
translatedFromRevision: 1
categories:
  - software
  - research
  - artificial-intelligence
aliases:
  - See-Through
  - 'See-through: Single-image Layer Decomposition for Anime Characters'
  - 'See-through: decomposição em camadas de personagens de anime a partir de uma única imagem'
related:
  - return-moe
  - diffusion-models
  - stable-diffusion-xl
  - model-training
infobox:
  fields:
    - key: developer
      value: Jian Lin, Chengze Li e colaboradores
    - key: initial_release
      value: '2026'
    - key: technologies
      value:
        - Python
        - PyTorch
        - Stable Diffusion XL
        - Marigold
    - key: repository
      value:
        text: github.com/shitagaki-lab/see-through
        url: https://github.com/shitagaki-lab/see-through
    - key: license
      value: Apache-2.0
    - key: status
      value: Software de pesquisa ativo
    - key: website
      value:
        text: arXiv:2602.03749
        url: https://arxiv.org/abs/2602.03749
---

O **See-through** é um framework de pesquisa de código aberto que transforma uma única ilustração
estática de uma personagem de anime em camadas RGBA editáveis de partes do corpo, com as regiões
ocultas preenchidas e uma ordem de composição inferida. Ele foi apresentado em um artigo de 2026
por Jian Lin, Chengze Li, Haoyun Qin, Kwun Wang Chan, Yanghua Jin, Hanyuan Liu, Stephen Chun Wang
Choy e Xueting Liu. Os autores declaram vínculos com a Saint Francis University, a Universidade da
Pensilvânia, a Spellbrush e o Shitagaki Lab; o repositório oficial do código-fonte é publicado pela
organização do Shitagaki Lab no GitHub.[^paper][^upstream]

O framework trata de uma etapa preparatória da animação de personagens em 2,5D. Normalmente, artistas
separam uma ilustração plana em partes, desenham o conteúdo que estava oculto na vista original e
definem quais fragmentos devem aparecer à frente dos demais. O See-through tenta automatizar esse
trabalho enquanto preserva o traçado, as cores e a aparência geral da ilustração de
origem.[^paper]

## Resultado e escopo

O See-through gera camadas transparentes para regiões semânticas como cabelo, rosto, olhos, roupas,
membros e acessórios. O artigo descreve uma taxonomia de 19 classes de partes do corpo, enquanto o
pipeline de inferência V3 do repositório pode estratificar seus resultados em até 23 camadas. Seu
script principal exporta um documento do Photoshop com camadas, além de máscaras intermediárias de
segmentação e mapas de profundidade.[^paper][^upstream]

O resultado pretende ser uma **representação pronta para 2,5D**, não um modelo Live2D concluído. O
See-through não cria malhas de deformação, parâmetros de física nem curvas de movimento e tampouco
decide como uma personagem deve se mover. Essas etapas de rigging e animação ainda exigem software
posterior e trabalho artístico.[^upstream]

## Método

### Dados de treinamento

Os pesquisadores construíram a supervisão a partir de modelos Live2D existentes. Uma personagem
Live2D é composta por **ArtMeshes** texturizadas, cujas máscaras de visibilidade e índices de ordem
de desenho definidos pelo artista fornecem limites precisos dos fragmentos e relações de oclusão.
Como os nomes e as hierarquias das malhas não são padronizados entre criadores, o mecanismo de dados
atribui os fragmentos a uma taxonomia semântica fixa.[^paper]

O processo de rotulagem começa com tags de imagem e mapas de ativação Grad-CAM, ajusta as respostas
aproximadas às máscaras de visibilidade das ArtMeshes e refina o resultado com decodificadores do
Segment Anything específicos para cada classe. As previsões são projetadas de volta nas malhas,
propagadas aos fragmentos totalmente ocultos e verificadas manualmente. Os índices registrados da
ordem de desenho são normalizados em valores de **pseudoprofundidade**, que representam a ordem de
composição, e não a distância física de uma câmera.[^paper]

### Geração das camadas

O gerador de camadas se baseia no [Stable Diffusion XL](/pt/stable-diffusion-xl/). Um
decodificador de transparência estende a representação latente RGB do modelo para produzir uma
saída RGBA. O treinamento ocorre em duas etapas: a primeira ensina o modelo a extrair uma parte do
corpo solicitada; a segunda reduz o ruído de toda a pilha em conjunto. Um **Body Part Consistency
Module** (Módulo de Consistência de Partes do Corpo) permite que as partes previstas troquem
informações para que o conteúdo ambíguo seja distribuído com mais consistência por toda a
decomposição.[^paper]

O See-through usa um [modelo de difusão](/pt/diffusion-models/) Marigold ajustado separadamente
para prever a pseudoprofundidade das camadas. Algumas categorias podem então ser divididas em
estratos dianteiros e traseiros, o que permite que uma única parte semântica, como o cabelo, passe
tanto por trás quanto pela frente do rosto. Uma etapa de preenchimento completa as regiões expostas
por essa subdivisão antes que as camadas sejam reunidas na pilha final.[^paper]

## Distribuição e operação

O repositório upstream oferece código de inferência e de [treinamento de
modelos](/pt/model-training/) sob a Licença Apache 2.0, com checkpoints dos modelos distribuídos
separadamente pelo Hugging Face. Seu script principal de inferência aceita uma imagem ou um
diretório e grava o PSD com camadas e os artefatos intermediários em um diretório de
trabalho.[^upstream][^license]

O pipeline normal usa precisão BF16 e, na resolução de trabalho documentada de 1280 pixels, exige
aproximadamente 12–16 GB de memória da GPU. O repositório também inclui modos de descarregamento por
grupos, quantização NF4 e troca de blocos para GPUs com menos memória. Esses modos trocam velocidade,
precisão ou uso da memória do sistema por uma menor demanda máxima de memória de
vídeo.[^upstream]

## Limitações

O conteúdo oculto na imagem de entrada não pode ser observado diretamente. Por isso, o See-through
produz um preenchimento plausível em vez de recuperar a aparência original das regiões ocultas.
Pontas finas de cabelo, pequenas decorações, acessórios e outros detalhes de alta frequência podem
permanecer ambíguos ou exibir padrões visuais gerados pelo modelo. Na avaliação informal com
artistas descrita no artigo, os participantes em geral trataram a saída como um ponto de partida
útil, mas ainda identificaram casos que exigiam comparação com o original e edição manual.[^paper]

Da mesma forma, a pseudoprofundidade registra uma ordem relativa útil das camadas, não uma geometria
3D métrica. Mesmo uma reconstrução visualmente fiel pode precisar de separações diferentes para uma
animação específica, como distinguir os membros esquerdos dos direitos. Portanto, a saída deve ser
revisada e adaptada ao rig pretendido, e não tratada como substituta automática de um artista de
Live2D.[^paper][^upstream]

## Relevância para a return moe

A [return moe](/pt/return-moe/) mantém um
[fork independente do See-through](https://github.com/returnmoe/see-through) para criar imagens
Docker e ferramentas de implantação otimizadas para provedores de GPU em nuvem, como a RunPod. O
fork acrescenta uma interface web, empacotamento em contêiner e orientações operacionais para
ambientes de nuvem.[^return-moe-fork]

## Referências

[^paper]: Jian Lin et al., [See-through: Single-image Layer Decomposition for Anime Characters](https://arxiv.org/abs/2602.03749), arXiv:2602.03749 (2026).

[^upstream]: [Repositório do código-fonte do See-through](https://github.com/shitagaki-lab/see-through), Shitagaki Lab.

[^license]: [Licença do código-fonte do See-through](https://github.com/shitagaki-lab/see-through/blob/main/LICENSE), Licença Apache 2.0.

[^return-moe-fork]: [Fork do See-through mantido pela return moe](https://github.com/returnmoe/see-through) e seu [guia de implantação na RunPod](https://github.com/returnmoe/see-through/blob/development/docs/runpod.md).
