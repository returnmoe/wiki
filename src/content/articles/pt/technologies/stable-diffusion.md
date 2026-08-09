---
id: stable-diffusion
title: Stable Diffusion
summary: Uma família de modelos generativos de imagem derivados da difusão latente, executáveis localmente e lançados ao público pela primeira vez em 2022.
locale: pt-BR
kind: technology
translatedFromRevision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - família de modelos Stable Diffusion
  - SD
redirects:
  - stable-diffusion-model
related:
  - stability-ai
  - stable-diffusion-xl
  - low-rank-adaptation
  - model-training
infobox:
  fields:
    - key: developer
      value:
        - CompVis e Runway (liderança do modelo original)
        - Stability AI e colaboradores
    - key: initial_release
      value: 22 de agosto de 2022
    - key: technologies
      value:
        - Modelagem generativa latente
        - Condicionamento por texto
        - Difusão e fluxo retificado
    - key: license
      value: Varia conforme a geração do modelo
    - key: status
      value: Família de modelos ativa
    - key: website
      value:
        text: Modelos Stable Diffusion
        url: https://stability.ai/core-models
---

O **Stable Diffusion** é uma família de modelos generativos de imagem cujos pesos disponíveis para
download tornaram viável gerar imagens de alta qualidade a partir de texto em hardware de consumo.
O primeiro lançamento público ocorreu em 22 de agosto de 2022. Ele se baseava no **modelo de difusão
latente** desenvolvido por pesquisadores ligados ao grupo CompVis da Universidade Luís Maximiliano
de Munique e à Runway, com capacidade de treinamento e apoio organizacional da [Stability
AI](/pt/stability-ai/) e contribuições de comunidades como LAION e
EleutherAI.[^public-release][^launch]

O nome tem três sentidos comuns:

1. **A geração original do modelo**, principalmente os checkpoints 1.x lançados em 2022.
2. **A família de modelos**, que inclui 2.x, [Stable Diffusion XL](/pt/stable-diffusion-xl/)
   (SDXL) e Stable Diffusion 3 e 3.5.
3. **O ecossistema de geração local ao redor deles**, embora interfaces como ComfyUI e o WebUI do
   AUTOMATIC1111, checkpoints da comunidade, extensões e a maioria das LoRAs sejam projetos
   independentes.

O segundo sentido é o mais preciso quando não se informa uma versão. “Stable Diffusion” não é um
único modelo imutável, um só aplicativo nem o nome de todo gerador de imagens executado localmente.

## Origens

Modelos de difusão aprendem a reverter um processo que corrompe os dados gradualmente com ruído.
Aplicar esse processo diretamente a pixels em resolução completa custa muito processamento. O artigo
de 2022 sobre difusão latente usou, em vez disso, um autoencoder pré-treinado para comprimir imagens
em um **espaço latente** de menor dimensão, realizou ali o processo generativo iterativo e decodificou
o resultado de volta em pixels. A atenção cruzada permitiu que a rede de redução de ruído respondesse
a texto ou outros sinais condicionantes.[^ldm]

O Stable Diffusion original adaptou essa arquitetura a um sistema condicionado por texto cujos pesos
cabiam em uma placa de vídeo de consumo. A ficha do modelo 1.4 descreve três grandes componentes
aprendidos:

- um autoencoder variacional (**VAE**) que codifica e decodifica imagens com fator oito de compressão
  espacial;
- um codificador de texto CLIP ViT-L/14 congelado, que transforma tokens do prompt em vetores de
  condicionamento; e
- uma **U-Net** convolucional que prevê como reduzir o ruído do latente da imagem enquanto presta
  atenção a esses vetores.[^v14-card]

O treinamento usou subconjuntos do LAION-5B, uma coleção derivada da web com aproximadamente 5,85
bilhões de pares de imagem e texto filtrados pelo CLIP. Etapas posteriores usaram filtros de
pontuação estética e outros critérios para escolher subconjuntos. A escala e a origem na web deram ao
modelo cobertura de muitos conceitos visuais, mas também trouxeram vieses sociais, legendas
incorretas, material protegido por direitos autorais e outras características da distribuição de
origem.[^laion5b][^v14-card]

O lançamento original foi colaborativo. O anúncio da Stability AI informa que Patrick Esser, da
Runway, e Robin Rombach, da LMU, lideraram o desenvolvimento e que a Stability AI forneceu o cluster
usado no treinamento. Por isso, relatos históricos associam o Stable Diffusion ao CompVis, à Runway
e à Stability AI; nenhum desses nomes, isoladamente, descreve por completo o primeiro
lançamento.[^launch]

## Como a geração de imagens funciona

Uma execução básica de texto para imagem com Stable Diffusion 1.x ou 2.x pode ser entendida pelo
seguinte ciclo:

1. A interface tokeniza um **prompt**, e um codificador de texto transforma os tokens em embeddings.
2. O amostrador cria um tensor latente, em geral iniciado com ruído pseudoaleatório determinado por
   uma **semente**.
3. Em cada etapa de amostragem, a U-Net estima uma direção de redução de ruído condicionada pelo
   texto.
4. Um agendador ou **amostrador** usa essa estimativa para levar o latente a um estado com menos
   ruído.
5. Depois da quantidade solicitada de etapas, o VAE decodifica o latente em uma imagem.

A maioria dos fluxos usa **orientação sem classificador** (_classifier-free guidance_, CFG). Durante
o treinamento, às vezes o modelo não recebe condição alguma; na inferência, o software combina
previsões condicionais e não condicionais. Aumentar a escala de orientação faz a amostra seguir o
prompt com mais força, mas um valor excessivo pode reduzir a variedade, saturar demais as cores ou
criar artefatos.[^cfg] Em muitas implementações, um **prompt negativo** fornece texto ao ramo que
seria não condicionado, direcionando o resultado para longe dessas características. É uma
orientação, não uma lista garantida de objetos proibidos.

A semente torna o latente inicial reproduzível dentro de uma pilha suficientemente semelhante de
software e hardware. Ela não determina sozinha uma imagem: modelo, VAE, amostrador, agendador,
quantidade de etapas, resolução, interpretação do prompt, precisão e implementação podem mudar o
resultado.

### Outros modos de geração

O mesmo processo latente permite mais do que gerar imagens a partir de texto:

- **Imagem para imagem** codifica uma imagem de entrada, adiciona uma quantidade de ruído definida
  por um controle de intensidade e gera a partir desse estado intermediário. Uma intensidade menor
  preserva mais da entrada.
- **Preenchimento** (_inpainting_) regenera uma região mascarada condicionado pela imagem não
  mascarada e pelo texto.
- **Expansão** (_outpainting_) aumenta a tela e preenche a nova área.
- **Ampliação de resolução** pode usar um ampliador latente específico, difusão em blocos ou uma
  segunda passagem de imagem para imagem.
- **ControlNet** adiciona uma rede treinada separadamente que condiciona a geração a informações
  espaciais como bordas, profundidade, pose ou segmentação sem substituir o modelo-base.[^controlnet]

Recursos da interface, como ênfase no prompt, prompting regional, restauração facial, correção em
alta resolução e scripts de extensão, não são necessariamente capacidades incorporadas ao
checkpoint. Portanto, um fluxo salvo registra mais que o prompt em prosa.

## Gerações de modelos

Stable Diffusion é uma linhagem, não uma simples sequência de correções:

| Geração                      | Estreia pública | Diferença arquitetônica ou prática                                                                                                    |
| ---------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **1.x**                      | 2022            | Base de difusão latente de 512 pixels com CLIP ViT-L/14; tornou-se a fundação do ecossistema inicial.                                 |
| **2.x**                      | 2022            | Mudou para o codificador de texto OpenCLIP; incluiu modelos de 512 e 768 pixels, além de ferramentas de profundidade e ampliação.     |
| **SDXL 1.0**                 | 2023            | U-Net muito maior, dois codificadores de texto, treinamento nativo em 1024 pixels, condicionamento de proporção e refinador opcional. |
| **Stable Diffusion 3 e 3.5** | 2024            | Trocou a receita clássica de U-Net por um transformer multimodal de difusão treinado com fluxo retificado.                            |

A mudança de codificador de texto, filtragem de dados e arquitetura no Stable Diffusion 2.0 fez com
que ajustes finos e adaptadores 1.x, em geral, não fossem compatíveis. O lançamento acrescentou um
codificador OpenCLIP, checkpoints de texto para imagem de 768 e 512 pixels, um modelo condicionado
por profundidade e um ampliador de quatro vezes.[^sd2]

O SDXL foi uma reformulação maior e tem seu próprio artigo porque se tornou uma plataforma distinta
para a comunidade, não apenas um número de versão mais alto. Seu modelo-base usa dois codificadores
de texto e foi treinado em torno de imagens de 1024 pixels; seus adaptadores e ajustes finos são
específicos ao SDXL.[^sdxl-paper]

O Stable Diffusion 3 mudou o projeto central de forma ainda mais profunda. Ele usa treinamento por
fluxo retificado e um **Transformer Multimodal de Difusão** (MMDiT), com pesos separados para os
fluxos de imagem e linguagem que podem trocar informações. A arquitetura buscava melhorar a
composição de prompts e a tipografia, áreas em que gerações anteriores costumavam
falhar.[^sd3-paper] A Stability AI lançou as versões 3.5 Large, Large Turbo e Medium mais tarde em 2024. Em julho de 2026, o Stable Diffusion 3.5 continuava sendo a geração Stable Diffusion mais nova
documentada publicamente na lista atual de modelos da empresa.[^sd35][^core-models]

A marca compartilhada não deve esconder essas diferenças. Não se deve presumir que um checkpoint,
ControlNet, embedding ou [LoRA](/pt/low-rank-adaptation/) criado para uma arquitetura funcione
em outra.

## Checkpoints, ajustes finos e adaptadores

Um **checkpoint** é um conjunto armazenado de pesos do modelo. Nas discussões da comunidade, “o
checkpoint” geralmente significa um modelo-base completo ou quase completo, muitas vezes salvo em
um arquivo `.safetensors`. Um **checkpoint com ajuste fino** começa a partir de uma versão-base e
atualiza muitos ou todos os pesos para um domínio visual, estilo ou meta geral de qualidade. Um
**checkpoint fundido** combina mudanças nos pesos de modelos existentes sem necessariamente realizar
novo treinamento.

Uma LoRA armazena um conjunto comparativamente pequeno de atualizações de baixo posto nos pesos. Ela
exige um checkpoint-base compatível no momento da geração e, em geral, pode ser ativada, escalada,
combinada ou removida sem duplicar todo o modelo. Embeddings de inversão textual armazenam vetores de
tokens aprendidos, enquanto ControlNets e outros adaptadores adicionam formas diferentes de
condicionamento. Esses artefatos resolvem problemas relacionados, mas não idênticos.

A compatibilidade é arquitetônica e empírica. Uma LoRA treinada sobre a base Stable Diffusion 1.5
não se encaixa nos módulos do SDXL. Uma LoRA de SDXL pode carregar tecnicamente em vários checkpoints
derivados de SDXL, mas se comportar de forma diferente quando seus estilos e representações
subjacentes tiverem se afastado. As licenças do modelo e do adaptador também continuam relevantes na
distribuição de uma fusão ou derivado.

## Por que os pesos públicos foram importantes

No lançamento, a Stability AI informou que os pesos 1.4 podiam gerar imagens localmente com cerca de
6,9 GB de memória gráfica na configuração recomendada.[^public-release] Isso colocou um modelo
capaz de texto para imagem ao alcance de computadores comuns para jogos e permitiu usos que uma API
sozinha dificilmente ofereceria:

- geração privada e sem conexão;
- inspeção e modificação do código de inferência;
- ajuste fino e treinamento de adaptadores pela comunidade;
- pipelines reproduzíveis baseados em nós;
- integração em ferramentas de arte, jogos, pesquisa e automação; e
- uso sem cobrança por imagem, depois dos custos de hardware e energia.

Interfaces independentes se tornaram tão influentes quanto o código oficial de lançamento. O WebUI
do AUTOMATIC1111 reuniu geração, preenchimento, extensões, ferramentas de treinamento e otimizações
de memória em uma interface de navegador. O ComfyUI representou a geração como um grafo de nós
reutilizáveis e serializou o fluxo em metadados da imagem ou em JSON. Os dois continuaram
compatíveis com várias gerações do Stable Diffusion, além de famílias de modelos sem relação com
ele.[^a1111][^comfyui]

A execução local não torna a geração gratuita. O custo aparece no hardware, energia, tempo de
configuração, armazenamento e iterações mais lentas com pouca memória gráfica. Serviços hospedados
trocam esses custos fixos e de manutenção por cobrança conforme o uso, políticas no nível da conta e
menos controle do ambiente de execução.

## Licenças e a expressão “código aberto”

Os primeiros pesos públicos usavam a licença CreativeML Open RAIL-M, enquanto o SDXL 1.0 usava a
Open RAIL++-M.[^v14-card][^sdxl-license] Essas licenças permitem executar, modificar e redistribuir
os modelos sob certas condições, incluindo restrições baseadas no uso e obrigações para derivados.
Gerações posteriores usam outras licenças da Stability AI. Repositórios de código também podem ter
licenças de software separadas dos pesos, e os conjuntos de treinamento não são licenciados
automaticamente com o modelo.

O Stable Diffusion foi amplamente descrito como **código aberto**, inclusive pela Stability AI. Pela
Definição de IA de Código Aberto publicada depois pela Open Source Initiative, porém, um sistema de
IA de código aberto precisa permitir uso para qualquer finalidade e fornecer a forma preferida para
modificações, incluindo determinadas informações sobre os dados de treinamento. Licenças de pesos
com restrições não atendem a todos esses critérios.[^osaid] Assim, **pesos abertos** ou **código
disponível** evita sugerir que toda versão do Stable Diffusion satisfaça determinada definição de
código aberto.

A licença de um gerador também não determina se toda saída pode receber direitos autorais, é lícita
ou está livre de direitos de terceiros. A situação da saída depende da obra, da contribuição do
usuário, dos materiais de treinamento ou entrada e da jurisdição.

## Limitações e questões sociais

A ficha do modelo original alerta que o Stable Diffusion 1.x não alcança fotorrealismo perfeito,
renderiza mal textos legíveis, tem dificuldade com composições complexas e rostos e perde informações
em seu autoencoder. Também apresenta desempenho desigual entre idiomas e culturas porque os dados e
o codificador de texto CLIP se concentram muito no inglês.[^v14-card]

Gerações posteriores melhoram alguns desses problemas, mas não os eliminam. Entre os modos comuns de
falha estão anatomia incorreta, vazamento de atributos entre pessoas, relações espaciais
inverossímeis, texturas repetidas e reprodução confiante de estereótipos. Um resultado visualmente
plausível não comprova que os fatos, pessoas, textos ou produtos mostrados sejam reais.

O treinamento em escala da web também levanta controvérsias sobre consentimento de criadores,
privacidade, direitos autorais e atribuição. Os conjuntos LAION são índices de URLs de imagens e
textos associados, não uma biblioteca de imagens curada, e filtrar um rastreamento enorme não garante
que todo registro seja adequado. Em geral, os modelos aprendem representações estatísticas
distribuídas, em vez de manter um banco pesquisável de imagens, mas podem ocasionalmente memorizar ou
reproduzir elementos de exemplos de treinamento. Esses fatos técnicos, isoladamente, não resolvem as
questões jurídicas ou éticas.

Filtros de segurança e licenças de modelos podem desencorajar alguns usos, enquanto pesos locais
dificultam a aplicação centralizada das regras. A importância do Stable Diffusion traz, portanto,
duas consequências ligadas: ele distribuiu a capacidade criativa e de pesquisa para além de alguns
serviços hospedados e distribuiu a responsabilidade pela forma como essa capacidade é adaptada e
usada.

## Referências

[^public-release]:
    [Stable Diffusion public release](https://stability.ai/news-updates/stable-diffusion-public-release),
    Stability AI, 22 de agosto de 2022.

[^launch]:
    [Stable Diffusion launch announcement](https://stability.ai/news-updates/stable-diffusion-announcement),
    Stability AI, 10 de agosto de 2022.

[^ldm]:
    Robin Rombach et al., [High-Resolution Image Synthesis with Latent Diffusion
    Models](https://arxiv.org/abs/2112.10752), _Proceedings of CVPR 2022_.

[^v14-card]:
    [Ficha do modelo Stable Diffusion v1-4](https://huggingface.co/CompVis/stable-diffusion-v1-4),
    CompVis e Stability AI, Hugging Face.

[^laion5b]:
    Christoph Schuhmann et al., [LAION-5B: An Open Large-Scale Dataset for Training Next Generation
    Image-Text Models](https://arxiv.org/abs/2210.08402), _NeurIPS 2022 Datasets and Benchmarks_.

[^cfg]:
    Jonathan Ho e Tim Salimans, [Classifier-Free Diffusion
    Guidance](https://arxiv.org/abs/2207.12598), 2022.

[^controlnet]:
    Lvmin Zhang, Anyi Rao e Maneesh Agrawala, [Adding Conditional Control to Text-to-Image Diffusion
    Models](https://arxiv.org/abs/2302.05543), _ICCV 2023_.

[^sd2]:
    [Lançamento do Stable Diffusion 2.0](https://stability.ai/news-updates/stable-diffusion-v2-release),
    Stability AI, 24 de novembro de 2022.

[^sdxl-paper]:
    Dustin Podell et al., [SDXL: Improving Latent Diffusion Models for High-Resolution Image
    Synthesis](https://arxiv.org/abs/2307.01952), _ICLR 2024_.

[^sd3-paper]:
    Patrick Esser et al., [Scaling Rectified Flow Transformers for High-Resolution Image
    Synthesis](https://arxiv.org/abs/2403.03206), 2024.

[^sd35]:
    [Introducing Stable Diffusion 3.5](https://stability.ai/news/introducing-stable-diffusion-3-5),
    Stability AI, 22 de outubro de 2024.

[^core-models]:
    [Modelos principais da Stability AI](https://stability.ai/core-models), Stability AI,
    atualizado em 20 de maio de 2026.

[^a1111]:
    [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui), colaboradores
    do AUTOMATIC1111, GitHub.

[^comfyui]: [ComfyUI](https://github.com/comfyanonymous/ComfyUI), colaboradores do ComfyUI, GitHub.

[^sdxl-license]:
    [CreativeML Open RAIL++-M License for SDXL 1.0](https://github.com/Stability-AI/generative-models/blob/main/model_licenses/LICENSE-SDXL1.0),
    Stability AI.

[^osaid]:
    [The Open Source AI Definition 1.0](https://opensource.org/ai/open-source-ai-definition), Open
    Source Initiative, 28 de outubro de 2024.
