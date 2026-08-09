---
id: stable-diffusion-xl
title: Stable Diffusion XL
summary: Modelo de texto para imagem em alta resolução da Stability AI, lançado em 2023 e amplamente usado como base para geração local de imagens e modelos voltados a anime.
locale: pt-BR
kind: technology
translatedFromRevision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - SDXL
  - SDXL 1.0
  - Stable Diffusion XL 1.0
redirects:
  - sdxl
  - stable-diffusion-xl-1-0
related:
  - stable-diffusion
  - stability-ai
  - low-rank-adaptation
  - model-training
  - watermark-removal-as-a-denoising-task
infobox:
  fields:
    - key: developer
      value: Stability AI
    - key: initial_release
      value: 26 de julho de 2023 (versão 1.0)
    - key: technologies
      value:
        - Difusão latente
        - Redutor de ruído U-Net
        - Dois codificadores de texto
        - Microcondicionamento
    - key: license
      value: CreativeML Open RAIL++-M
    - key: status
      value: Lançado; amplamente aceito por ferramentas da comunidade
    - key: website
      value:
        text: Ficha do modelo-base SDXL 1.0
        url: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
---

O **Stable Diffusion XL** (**SDXL**) é um modelo de texto para imagem em alta resolução
lançada pela [Stability AI](/pt/stability-ai/) em 26 de julho de 2023. Ele manteve o projeto de
difusão latente e U-Net das versões anteriores do [Stable
Diffusion](/pt/stable-diffusion/), mas ampliou bastante o redutor de ruído, acrescentou um
segundo codificador de texto e mudou a forma de representar tamanho, recorte e proporção das imagens
durante o treinamento.[^release][^paper]

O SDXL 1.0 é formado principalmente por um **modelo-base**, capaz de gerar sozinho imagens prontas,
e um **refinador** opcional especializado na parte final e de baixo ruído da geração. No uso da
comunidade, “SDXL” normalmente significa a arquitetura-base e seus muitos derivados compatíveis, não
necessariamente um fluxo que use o refinador oficial.[^base-card][^refiner-card]

Em agosto de 2026, o SDXL já não era o estado da arte na renderização de texto nem em seguir prompts
complexos. Ainda assim, continuava sendo uma plataforma importante para entusiastas: ferramentas
voltadas ao uso local ainda ofereciam suporte direto, e sua arquitetura era compacta o bastante para
muitos sistemas
locais e, ao longo dos anos, surgiu um grande acervo de checkpoints, LoRAs, ControlNets, tutoriais e
fluxos reutilizáveis.[^comfyui][^a1111-features][^diffusers-lora] Em trabalhos com anime e
personagens, boa parte dessa importância pertence a linhagens derivadas do SDXL e retreinadas de
forma extensa, não aos pesos-base oficiais da Stability AI.

## Do Stable Diffusion 1.x e 2.x ao XL

O Stable Diffusion 1.x geralmente era treinado para imagens de 512 pixels e usava uma U-Net com
cerca de 860 milhões de parâmetros. O Stable Diffusion 2.x mudou o codificador de texto e ofereceu
um modelo de 768 pixels, mas não substituiu o 1.5 como única base da comunidade. O SDXL foi uma
reformulação mais abrangente, voltada a resolução maior, composição melhor e condicionamento por
texto mais forte.

O artigo do SDXL relata uma U-Net com 2,6 bilhões de parâmetros, aproximadamente três vezes o
tamanho dos redutores de ruído anteriores, além de mais blocos transformer e atenção concentrada nas
resoluções espaciais menores. O pipeline-base completo é ainda maior quando se contam o VAE e os
dois codificadores de texto.[^paper] Por isso, os números de parâmetros podem parecer inconsistentes:
uma fonte pode contar a U-Net; outra, todo o pipeline-base; e outra, o conjunto do modelo-base com o
refinador.

A versão de pesquisa SDXL 0.9 foi lançada em junho de 2023 com uma licença apenas para pesquisa. A
versão 1.0 veio em julho, com pesos separados para base e refinador sob a CreativeML Open
RAIL++-M.[^repository][^license] Referências da comunidade apenas a “SDXL” quase sempre significam a
arquitetura compatível com a versão 1.0.

## Arquitetura

### Dois codificadores de texto

O modelo-base condiciona sua U-Net com representações tanto do OpenAI CLIP ViT-L/14 quanto do
OpenCLIP ViT-bigG/14. As saídas dos dois no nível dos tokens são concatenadas para a atenção cruzada,
enquanto um embedding de texto agrupado do codificador maior fornece condicionamento
adicional.[^paper][^base-card]

Esse projeto com dois codificadores dá ao SDXL representações de texto mais ricas que o codificador
único das gerações anteriores do Stable Diffusion, mas também traz consequências práticas:

- no pipeline padrão, os dois tokenizadores têm contexto de 77 tokens; portanto, um prompt longo
  ainda não é uma instrução ilimitada em linguagem natural;
- o software pode enviar textos diferentes aos dois codificadores, embora a maioria das interfaces
  use o mesmo prompt para ambos;
- uma LoRA pode tratar a U-Net, um ou os dois codificadores de texto ou alguma combinação; e
- embeddings e LoRAs do Stable Diffusion 1.5 não correspondem aos módulos do SDXL.

A melhoria do modelo não deve ser atribuída somente aos codificadores de texto. O redutor de ruído
maior, o sistema de condicionamento, os dados e a receita de treinamento mudaram juntos.

### Condicionamento de tamanho e recorte

Descartar toda imagem de treinamento que não seja um quadrado perfeito desperdiça dados e pode
ensinar enquadramentos indesejados. Além do prompt, o SDXL usa vários valores de
**microcondicionamento**:

- largura e altura originais da imagem;
- coordenadas superior e esquerda do recorte; e
- largura e altura desejadas da saída.

Esses valores ajudam o modelo a distinguir, por exemplo, uma imagem-fonte realmente pequena de um
recorte de uma imagem maior. O SDXL também recebeu ajuste fino em vários grupos de proporções com
aproximadamente a mesma área de pixels de uma imagem de 1024 por 1024, permitindo gerar retratos e
paisagens sem forçar toda composição a caber em um quadrado.[^paper]

Os aplicativos normalmente preenchem esses metadados de forma automática a partir da tela escolhida.
Usuários experientes podem alterá-los, mas combinações improváveis podem levar a geração para
fora da distribuição de treinamento do modelo.

### Base e refinador

A U-Net base cuida de toda a trajetória de redução de ruído e pode ser usada sozinha. O refinador é
um modelo separado de difusão latente, treinado para a parte final e de baixo ruído do processo; um
fluxo pode passar o latente parcialmente limpo da base ao refinador nas etapas
restantes.[^paper][^refiner-card]

Trata-se de um **pipeline de especialistas** em duas etapas, não de uma mistura esparsa de
especialistas no sentido comum dos modelos de linguagem. Os dois grandes modelos não competem
dinamicamente por cada token. Em vez disso, recebem partes diferentes de um cronograma de redução de
ruído definido de antemão.

O refinador pode melhorar texturas ou detalhes locais em algumas imagens, mas acrescenta tempo de
carregamento, pressão sobre a memória gráfica e outro conjunto de escolhas de amostragem. Muitos
checkpoints da comunidade são ajustados para terminar as imagens sem ele, e vários fluxos de
entusiastas gastam o processamento adicional em uma segunda passagem, um ampliador, preenchimento ou
detalhador especializado. O refinador é uma opção, não parte da definição de uma imagem SDXL válida.

## Uso do SDXL

A escala de trabalho padrão do SDXL é de cerca de um megapixel. Uma tela de 1024 por 1024 é a
referência quadrada, enquanto resoluções como 1152 por 896 ou 832 por 1216 mantêm uma área parecida e
correspondem a grupos de proporções usados no treinamento. Telas muito pequenas podem produzir sujeitos
grandes demais ou repetidos, e dimensões extremas podem gerar composições instáveis. Listas exatas de
resoluções seguras nas interfaces são convenções, não limites rígidos da
arquitetura.[^comfy-examples]

Um fluxo local típico contém:

1. o checkpoint SDXL e seu VAE;
2. prompts positivo e negativo codificados pelos dois codificadores;
3. um latente aleatório no tamanho solicitado;
4. agendador, amostrador, quantidade de etapas e escala de orientação sem classificador;
5. LoRAs, ControlNets, adaptadores de imagem de referência ou outros condicionamentos opcionais; e
6. decodificação pelo VAE, seguida opcionalmente por refinamento, imagem para imagem ou ampliação.

Criar prompts continua mais próximo de escrever uma legenda visual do que de fornecer instruções
simbólicas confiáveis. Palavras para sujeito, ambiente, técnica, iluminação, câmera e composição
podem ajudar, mas o modelo ainda pode ignorar uma negação, ligar um atributo ao sujeito errado ou
renderizar palavras de forma
incorreta. Sequências muito longas de tags de qualidade podem tomar o espaço de conteúdo relevante.
Um resultado reproduzível exige salvar todo o fluxo e os identificadores dos modelos, não apenas o
prompt.

## Ajustes finos e LoRAs

O SDXL se tornou uma plataforma-base: integrantes da comunidade o adaptaram em checkpoints
generalistas, modelos de ilustração e fotografia, modelos de personagens, modelos de estilo e
variantes rápidas destiladas. Um checkpoint completo substitui ou modifica grande parte dos
pesos-base. Uma [LoRA de
SDXL](/pt/low-rank-adaptation/#lora-no-stable-diffusion-e-no-sdxl), por sua vez, armazena
atualizações de baixo posto para camadas escolhidas da U-Net e, às vezes, dos codificadores de texto.
Ela continua dependente de uma base compatível com SDXL.

“Compatível com SDXL” não significa “igualmente eficaz em todo modelo SDXL”. Uma LoRA treinada na
base oficial muitas vezes pode ser carregada em um derivado com a mesma estrutura de tensores, mas o
conceito visual pode enfraquecer, mudar de estilo ou entrar em conflito com o checkpoint. Da mesma
forma, uma LoRA treinada em um derivado muito especializado pode funcionar mal na base oficial. A
procedência do treinamento faz parte da compatibilidade.

O treinamento de SDXL exige mais memória e processamento que o Stable Diffusion 1.5 porque a U-Net,
a resolução de trabalho e a pilha de condicionamento por texto são maiores. Treinamento eficiente em
parâmetros, checkpointing de gradientes, precisão mista, latentes em cache e quantização do
otimizador reduzem essa carga, mas alteram memória, velocidade ou flexibilidade; não fazem o custo
desaparecer. Treinar um ou os dois codificadores de texto aumenta ainda mais o uso de
memória.[^diffusers-training][^kohya-sdxl]

## SDXL como arquitetura: linhagens de modelos de anime

Um dos legados mais importantes do SDXL é servir de base arquitetônica para modelos comunitários
de anime e ilustração. Esses checkpoints geralmente preservam a topologia da U-Net, os dois
codificadores de texto, as dimensões latentes, as entradas de microcondicionamento e a escala de
aproximadamente um megapixel do SDXL. Isso permite que softwares preparados para SDXL os carreguem.
Ainda assim, seus parâmetros treinados, vocabulário de prompts, distribuição visual e configurações
recomendadas de amostragem podem estar muito distantes da base SDXL 1.0 da Stability AI.

Três rótulos respondem a perguntas diferentes:

| Rótulo                         | O que identifica                                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Base SDXL 1.0                  | Os pesos-base e a configuração específicos lançados pela Stability AI em julho de 2023.                              |
| Derivado de SDXL ou compatível | Um checkpoint que preserva arquitetura e disposição de tensores suficientes para usar o caminho de software do SDXL. |
| Base de linhagem               | Um descendente treinado extensamente e usado como ponto de partida para seus próprios ajustes finos, fusões e LoRAs. |

Chamar os três apenas de “SDXL” esconde uma distinção importante. Arquitetura é a organização e o
formato dos componentes do modelo; pesos são os valores aprendidos dentro deles. Continuar o
pré-treinamento ou realizar um ajuste fino completo pode atualizar bilhões desses valores sem mudar
o formato das camadas. Não existe um limite numérico a partir do qual o modelo deixe de ter a
arquitetura SDXL, mas ele pode deixar de se comportar como o checkpoint oficial muito antes de se
tornar impossível carregá-lo por um pipeline SDXL.

### Exemplos de divergência

O Animagine XL 3.1 se descreve como construído sobre o SDXL, mas sua ficha documenta uma linhagem
de treinamento de anime em várias etapas, totalizando cerca de 2,1 milhões de imagens entre Animagine
3.0 e 3.1. Ele é otimizado para tags estruturadas de anime, personagens conhecidas, níveis de
qualidade, datas e rótulos estéticos, e não para a distribuição mais geral de legendas da base
oficial.[^animagine-card]

O Illustrious XL foi desenvolvido como uma fundação para ilustrações e anime dentro da
arquitetura SDXL. Seu relatório técnico destaca treinamento em resoluções maiores e legendas em
vários níveis, que combinam tags com linguagem natural.[^illustrious-paper] O NoobAI-XL partiu de
um checkpoint inicial do Illustrious, em vez de diretamente da base da Stability AI, e continuou o
treinamento com material do Danbooru e e621.[^noobai-card] É uma linhagem de descendentes — SDXL,
Illustrious, NoobAI e novos ajustes finos e LoRAs — e não uma coleção plana de pequenos ajustes de
estilo em um único modelo inalterado.

O Pony Diffusion V6 XL se tornou outra base derivada do SDXL para checkpoints especializados e
LoRAs.[^pony-card] Em catálogos de modelos, “Pony”, “Illustrious” e “NoobAI” são, portanto, rótulos de
modelo-base úteis por si só. Eles informam melhor a sintaxe de prompt esperada e a compatibilidade de
adaptadores do que o rótulo mais amplo “SDXL”.

As mudanças podem ir além do conhecimento dos sujeitos e do estilo. O relatório técnico da NovelAI
sobre o modelo de anime NAI Diffusion V3 documenta o treinamento continuado de uma inicialização
SDXL, passando de previsão de épsilon para previsão de `v`, mudando o regime terminal de relação
sinal-ruído e adaptando a amostragem.[^nai-v3] No nível arquitetônico, ele continua sendo um derivado
relevante do SDXL, mas exige hipóteses de inferência diferentes das da base oficial.

### Compatibilidade prática

Compatibilidade de carregamento não é compatibilidade semântica. Uma LoRA para a base oficial do
SDXL pode ter o formato correto de tensores para um checkpoint Illustrious, Pony ou NoobAI e ainda
funcionar mal porque as características que ela modifica se deslocaram com o treinamento posterior.
O inverso também vale. Por isso, linhagens de modelos de anime criam suas próprias LoRAs de
personagens, adaptadores de estilo, convenções de prompts, ControlNets e, às vezes, requisitos de
agendador.

Para uso ou treinamento confiáveis, a base deve ser registrada no nível mais específico que ajude:
não apenas “SDXL”, mas, por exemplo, o derivado e a versão exatos de Illustrious ou Pony. Os hashes
dos modelos são importantes quando uma linhagem possui muitas fusões com nomes parecidos. O
agendador e o tipo de previsão também precisam corresponder aos checkpoints que passaram da previsão
de épsilon para a previsão de `v`.

Licenças acompanham os artefatos e as cadeias de derivação, não os rótulos da arquitetura. Um
checkpoint pode usar o projeto de rede do SDXL e ter termos herdados de um modelo intermediário,
além de condições adicionais de quem o criou. Não se deve presumir que a licença oficial do SDXL
1.0 seja a licença completa do Animagine, Pony, Illustrious, NoobAI ou de seus descendentes.

### Um estudo de caso da return moe: WAI-Illustrious-SDXL v15

O experimento [Remoção de marca-d'água como tarefa de redução de
ruído](/pt/watermark-removal-as-a-denoising-task/) mostra um uso concreto de um descendente do
Illustrious fora da geração comum de imagens. A return moe codificou um quadro de anime com
marca-d'água e aplicou uma atualização tardia de redução de ruído pelo
WAI-Illustrious-SDXL v15, com a adição de novo ruído desativada. Segundo os decodificadores
disponíveis, a passagem tornou TrustMark e SynthID indetectáveis; uma ou duas passagens reduziram a
recuperação do conteúdo do Watermark Anything a aproximadamente o resultado no controle sem
marca-d'água.[^watermark-study]

O checkpoint deve ser descrito como da linhagem Illustrious e com arquitetura SDXL, não como a
base inalterada da Stability AI. Seu prior de anime extensamente adaptado provavelmente ajudou a
preservar a personagem e a cena, enquanto o mesmo prior substituiu pequenos textos e detalhes de
interface da tela do telefone por distorções. Essa combinação mostra os dois lados da especialização
de uma linhagem: o caminho de software compartilhado do SDXL tornou o fluxo possível, mas os pesos
descendentes determinaram o que o redutor de ruído considerava plausível. O teste com uma única
imagem não estabelece que todo checkpoint SDXL remova marcas-d'água com a mesma
eficácia.[^watermark-study][^wai-v15]

## Por que o SDXL continua importante para entusiastas

Em agosto de 2026, o SDXL continua importante por seu suporte de software consolidado, perfil de
hardware acessível e ecossistema amplo.

### Uma pilha local consolidada

A lista atual de modelos aceitos e a biblioteca de exemplos do ComfyUI ainda incluem fluxos
completos de base e refinador do SDXL. Da mesma forma, a documentação de recursos do AUTOMATIC1111
inclui suporte ao SDXL e otimizações de memória, e o Hugging Face Diffusers continua usando SDXL nos
exemplos atuais de carregamento de adaptadores.[^comfyui][^comfy-examples][^a1111-features][^diffusers-lora]
Isso importa porque uma plataforma para entusiastas é mais que um arquivo de pesos: instaladores,
nós, metadados, extensões, scripts de treinamento, conhecimento para resolver problemas e artefatos
interoperáveis reduzem o tempo entre uma ideia e um resultado controlado.

### Uma faixa de hardware acessível

No lançamento, a Stability AI afirmou que o modelo-base podia ser executado em GPUs de consumo com
8 GB de memória gráfica.[^release] Essa é uma declaração otimista sobre o produto, não um requisito
universal: resolução, tamanho do lote, implementação de atenção, precisão, uso do refinador,
ControlNets e a interface afetam a memória. Transferir parte do cálculo para a CPU e usar operações
do VAE em blocos pode diminuir o mínimo, ao custo da velocidade.

Ainda assim, uma U-Net de cerca de 2,6 bilhões de parâmetros ocupa uma faixa de processamento local
diferente da de transformers de imagem mais novos com 12 bilhões de parâmetros, como o
FLUX.1-dev.[^flux-card] Modelos mais novos podem justificar o custo por seguirem prompts e
renderizarem texto melhor, mas o SDXL muitas vezes permite iterar mais rápido, deixar mais espaço
para modelos auxiliares ou usar placas antigas. A Stability AI e a AMD ainda publicavam caminhos
otimizados do SDXL para GPUs Radeon em 2025, outra evidência de que o hardware-alvo continuava
relevante.[^amd]

### Um grande ecossistema de adaptações

A idade do SDXL é uma vantagem quando uma tarefa depende de determinado checkpoint, LoRA de
personagem, adaptador de estilo, ControlNet ou grafo de produção consolidado. Um modelo-base mais
novo pode gerar uma imagem melhor sem adaptação e não ter um recurso especializado equivalente.
Mudar de arquitetura também exige retreinar adaptadores e refazer fluxos; não é possível converter
um adaptador apenas renomeando o arquivo.

Para gerar anime, não se trata de uma coleção periférica de estilos aplicados à base oficial.
Animagine, Pony, Illustrious, NoobAI e seus descendentes funcionam como vários subecossistemas
maduros dentro da família arquitetônica mais ampla do SDXL. A capacidade de reutilizar softwares da
época do SDXL e, ao mesmo tempo, aceitar checkpoints e adaptadores próprios de cada linhagem é uma
razão central para o SDXL continuar importante em trabalhos de personagens feitos por entusiastas.

Pequenos adaptadores destilados ampliam a plataforma em outra direção. O LCM-LoRA aplica destilação
de consistência latente por uma LoRA para permitir que modelos de difusão compatíveis gerem em
pouquíssimas etapas, enquanto o SDXL-Lightning publica variantes de U-Net e LoRA do SDXL para poucas
etapas.[^lcm-lora][^lightning] São artefatos treinados separadamente, com amostradores e licenças
recomendados próprios, não uma configuração mágica de velocidade para qualquer peso do SDXL.

### Previsibilidade e controle

O SDXL é bem conhecido. Usuários conhecem suas resoluções comuns, modos de falha,
comportamento dos amostradores e interações entre adaptadores. Ferramentas baseadas em nós podem
executá-lo sem conexão e preservar grafos exatos. Para ilustração, personagens, combinação de
modelos, experimentos ou um pipeline estável e duradouro, a previsibilidade pode importar mais que
vencer uma comparação com um único prompt.

A licença 1.0 também permite uma ampla variedade de usos pessoais e comerciais, sob suas condições
e restrições de uso.[^license] Isso pode funcionar melhor em alguns projetos que um checkpoint mais
novo de pesos não comerciais. Não é uma licença de software totalmente permissiva, e cada checkpoint
derivado ou adaptador pode acrescentar termos próprios.

## Onde o SDXL ficou para trás

O SDXL não deve ser recomendado apenas por ser conhecido. Suas limitações agora estão claras:

- Ele costuma escrever palavras incorretamente e tem dificuldade com design gráfico denso.
- Prompts com várias pessoas, objetos, relações espaciais ou atributos distintos podem misturar os
  elementos.
- Seu fluxo de 1024 pixels é muito mais lento e pesado que o Stable Diffusion 1.5 em 512 pixels.
- O refinador oficial dobra a complexidade de administrar modelos quando usado.
- A tokenização do CLIP e o contexto curto o tornam menos conversacional que arquiteturas mais novas
  condicionadas por texto.
- Os recursos da comunidade variam muito em qualidade, documentação, procedência dos dados e clareza
  de licença.

O Stable Diffusion 3 apresentou um transformer multimodal de difusão e fluxo retificado justamente
para melhorar o seguimento de prompts e a tipografia, enquanto transformers de fluxo posteriores e
de outras empresas avançaram na mesma fronteira geral.[^sd3-paper] Para quem busca o melhor
seguimento de prompts sem exemplos e tem hardware suficiente, um modelo mais novo pode ser o melhor
ponto de partida. Para quem precisa dos adaptadores específicos do SDXL, de iteração local barata,
controles maduros ou fluxos reproduzíveis já existentes, o SDXL continua sendo uma plataforma
racional, não apenas um modelo obsoleto.

## Licença e limitações

A licença CreativeML Open RAIL++-M do SDXL 1.0 permite uso, modificação e distribuição sob
restrições baseadas no uso e obrigações posteriores. A Stability AI declara que não reivindica
direitos sobre as saídas geradas nos termos da licença e responsabiliza o usuário por
elas.[^license] Os dados de treinamento em si não são concedidos por essa licença de modelo, e ela
não garante que uma saída seja lícita, não infrinja direitos ou possa receber proteção autoral.

As fichas oficiais identificam outras limitações técnicas: o autoencoder tem perdas; rostos e
pessoas podem ser mal renderizados; composição e texto legível continuam difíceis; e o modelo é
condicionado principalmente em inglês. O SDXL é um prior generativo, não um renderizador factual nem
um substituto da permissão para retratar uma pessoa ou reutilizar material protegido de
origem.[^base-card][^refiner-card]

## Referências

[^release]:
    [Lançamento do Stable Diffusion XL 1.0](https://stability.ai/news-updates/stable-diffusion-sdxl-1-announcement),
    Stability AI, 26 de julho de 2023.

[^paper]:
    Dustin Podell et al., [SDXL: Improving Latent Diffusion Models for High-Resolution Image
    Synthesis](https://arxiv.org/abs/2307.01952), _ICLR 2024_.

[^base-card]:
    [Ficha do modelo-base Stable Diffusion XL 1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0),
    Stability AI, Hugging Face.

[^refiner-card]:
    [Ficha do refinador Stable Diffusion XL 1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0),
    Stability AI, Hugging Face.

[^comfyui]:
    [ComfyUI](https://github.com/comfy-org/ComfyUI), colaboradores do ComfyUI, GitHub, acesso em 12
    de julho de 2026.

[^a1111-features]:
    [Recursos do Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features),
    colaboradores do AUTOMATIC1111, GitHub.

[^diffusers-lora]:
    [Load adapters](https://huggingface.co/docs/diffusers/main/using-diffusers/loading_adapters),
    documentação do Hugging Face Diffusers, acesso em 12 de julho de 2026.

[^repository]:
    [Repositório generative-models da Stability AI](https://github.com/Stability-AI/generative-models),
    Stability AI, GitHub.

[^license]:
    [CreativeML Open RAIL++-M License for SDXL 1.0](https://github.com/Stability-AI/generative-models/blob/main/model_licenses/LICENSE-SDXL1.0),
    Stability AI.

[^comfy-examples]:
    [Exemplos de SDXL no ComfyUI](https://comfyanonymous.github.io/ComfyUI_examples/sdxl/),
    colaboradores do ComfyUI.

[^diffusers-training]:
    [Visão geral do treinamento no Diffusers](https://huggingface.co/docs/diffusers/training/overview),
    documentação do Hugging Face.

[^kohya-sdxl]:
    [Documentação de treinamento do SDXL](https://github.com/kohya-ss/sd-scripts/blob/main/docs/train_SDXL-en.md),
    colaboradores do kohya-ss sd-scripts, GitHub.

[^flux-card]:
    [Ficha do modelo FLUX.1-dev](https://huggingface.co/black-forest-labs/FLUX.1-dev), Black Forest
    Labs, Hugging Face.

[^amd]:
    [Stable Diffusion optimized for AMD Radeon GPUs](https://stability.ai/news-updates/stable-diffusion-now-optimized-for-amd-radeon-gpus),
    Stability AI, 16 de abril de 2025.

[^lcm-lora]:
    Simian Luo et al., [LCM-LoRA: A Universal Stable-Diffusion Acceleration
    Module](https://arxiv.org/abs/2311.05556), 2023.

[^lightning]:
    Shanchuan Lin et al., [SDXL-Lightning: Progressive Adversarial Diffusion
    Distillation](https://arxiv.org/abs/2402.13929), 2024.

[^sd3-paper]:
    Patrick Esser et al., [Scaling Rectified Flow Transformers for High-Resolution Image
    Synthesis](https://arxiv.org/abs/2403.03206), 2024.

[^animagine-card]:
    [Ficha do modelo Animagine XL 3.1](https://huggingface.co/cagliostrolab/animagine-xl-3.1),
    Cagliostro Research Lab, Hugging Face.

[^illustrious-paper]:
    Junha Lee et al., [Illustrious: An Open Advanced Illustration
    Model](https://arxiv.org/abs/2409.19946), 2024.

[^noobai-card]:
    [Ficha do modelo NoobAI-XL 1.0](https://huggingface.co/Laxhar/noobai-XL-1.0), Laxhar Lab,
    Hugging Face.

[^pony-card]:
    [Página do modelo Pony Diffusion V6 XL](https://civitai.com/models/257749/pony-diffusion-v6-xl),
    PurpleSmartAI, Civitai.

[^nai-v3]:
    Juan Ossa et al., [Improvements to SDXL in NovelAI Diffusion
    V3](https://arxiv.org/abs/2409.15997), 2024.

[^watermark-study]:
    Rodrigo Laneth, [Watermark removal as a denoising task](https://blog.return.moe/en/2025/12/21/watermark-removal-as-a-denoising-task/),
    blog da return moe, 21 de dezembro de 2025.

[^wai-v15]:
    [Página do modelo WAI-NSFW-Illustrious-SDXL](https://civitai.com/models/827184/wai-nsfw-illustrious-sdxl),
    WAI0731, Civitai.
