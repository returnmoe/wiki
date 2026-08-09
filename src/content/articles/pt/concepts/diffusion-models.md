---
id: diffusion-models
title: Modelos de difusão
summary: Modelos generativos de aprendizado de máquina que aprendem a reverter um processo gradual de corrupção, transformando ruído em dados estruturados por redução iterativa de ruído.
locale: pt-BR
kind: concept
translatedFromRevision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - difusão
  - modelo de difusão
  - modelo de difusão com redução de ruído
  - modelo probabilístico de difusão com redução de ruído
  - modelo generativo baseado em score
redirects:
  - diffusion
  - diffusion-model
  - denoising-diffusion-model
  - ddpm
  - score-based-generative-model
related:
  - model-training
  - stable-diffusion
  - stable-diffusion-xl
  - watermark-removal-as-a-denoising-task
infobox:
  fields:
    - key: type
      value: Família de modelos generativos
    - key: debut
      value: '2015'
---

**Modelos de difusão** são modelos generativos de aprendizado de máquina que aprendem a transformar
uma distribuição aleatória simples, normalmente ruído gaussiano, em amostras semelhantes aos dados
de treinamento. Eles são treinados com o reverso de um processo destrutivo deliberado: um
**processo direto** conhecido acrescenta ruído aos dados aos poucos, e uma rede neural aprende a
remover a corrupção em muitos níveis de ruído. Para gerar uma nova amostra, um amostrador começa com
uma nova amostra de ruído e aplica repetidamente as atualizações reversas
aprendidas.[^thermodynamics][^ddpm]

O termo geralmente inclui **modelos probabilísticos de difusão com redução de ruído** (DDPMs),
modelos generativos baseados em score e suas versões em tempo discreto ou contínuo. Essas formulações
estão intimamente ligadas, em vez de serem métodos totalmente separados. Um DDPM descreve uma cadeia
de Markov finita; um modelo de score aprende o gradiente de uma sequência de densidades de dados com
ruído; e uma formulação por equações diferenciais estocásticas expressa os dois em tempo
contínuo.[^score-model][^score-sde]

A difusão é um framework de modelagem e treinamento, não uma arquitetura específica de rede neural
nem sinônimo de geração de texto para imagem. O redutor de ruído pode ser uma U-Net convolucional,
um transformer ou uma rede própria do domínio; pode operar em pixels, representações latentes
comprimidas, formas de onda, coordenadas tridimensionais ou símbolos
discretos.[^latent-diffusion][^dit][^d3pm] Portanto, o Stable Diffusion é uma aplicação da difusão
latente, não a definição de difusão em aprendizado de máquina.

Este artigo trata da difusão generativa. A palavra também aparece em técnicas sem relação ou apenas
vagamente relacionadas, como mapas de difusão, difusão em grafos e troca de mensagens baseada em
difusão.

## Visão geral do modelo

Um sistema padrão de difusão separa vários componentes que muitas vezes são confundidos:

| Componente                    | Função                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| Representação dos dados `x_0` | O objeto modelado: pixels, latente de autoencoder, amostras de áudio, coordenadas ou tokens          |
| Processo direto `q`           | Regra fixa de corrupção que leva os dados a uma distribuição terminal simples                        |
| Rede de redução de ruído      | Prevê ruído, dados limpos, velocidade, score ou parâmetros da transição reversa                      |
| Cronograma de ruído ou tempo  | Define a intensidade da corrupção em cada instante de treinamento                                    |
| Condição `c`                  | Informação opcional, como classe, embedding de texto, entrada em baixa resolução ou região conhecida |
| Amostrador ou solver          | Converte numericamente o ruído terminal em amostra usando a rede treinada                            |
| Decodificador                 | Na difusão latente, transforma a representação comprimida final de volta ao domínio original         |

Normalmente, apenas a rede de redução de ruído e os codificadores ou decodificadores são aprendidos.
O processo direto é escolhido por quem projeta o sistema. O amostrador é um algoritmo de inferência;
por isso, um checkpoint treinado pode ser compatível com vários amostradores e cronogramas de
etapas. Trocar o amostrador pode mudar a velocidade e as características da saída sem retreinar o
redutor de ruído.[^ddim][^dpm-solver]

## Desenvolvimento histórico

A formulação generativa moderna foi apresentada em 2015 por Jascha Sohl-Dickstein e colaboradores.
Inspirado na termodinâmica fora do equilíbrio, o método destruía lentamente a estrutura dos dados e
aprendia um processo reverso para restaurá-la.[^thermodynamics] Uma linha paralela de pesquisa
treinava redes neurais para estimar o **score** — o gradiente do logaritmo da densidade dos dados — e
fazia a amostragem por dinâmica de Langevin com recozimento em vários níveis de ruído.[^score-model]

Em 2020, Jonathan Ho, Ajay Jain e Pieter Abbeel apresentaram os DDPMs com um objetivo simplificado de
previsão do ruído, que produziu imagens de alta qualidade e revelou uma ligação estreita entre
difusão e correspondência de score com redução de ruído.[^ddpm] Trabalhos posteriores em tempo
contínuo colocaram modelos de score e modelos probabilísticos de difusão em um mesmo framework de
equações diferenciais estocásticas, incluindo tanto amostragem reversa estocástica quanto uma
equação diferencial ordinária determinística de fluxo de probabilidade.[^score-sde]

Trabalhos seguintes melhoraram variâncias reversas, cronogramas, arquiteturas, condicionamento e
solvers numéricos. Modelos de difusão se tornaram competitivos com os principais geradores de
imagens GAN em benchmarks selecionados, enquanto a difusão latente transferiu o caro processo
iterativo dos pixels para uma representação menor de autoencoder.[^improved-ddpm][^guided-diffusion][^latent-diffusion]
Esses resultados estabeleceram a difusão como uma família ampla de modelos generativos.

## Difusão direta

Seja `x_0` um exemplo limpo de treinamento. Um processo gaussiano discreto comum o corrompe ao longo
de `T` etapas:

```text
q(x_t | x_(t-1)) = Normal(sqrt(1 - beta_t) x_(t-1), beta_t I)
```

Aqui, `beta_t` é uma pequena variância positiva escolhida por um **cronograma de ruído**. Defina
`alpha_t = 1 - beta_t` e `alpha_bar_t` como o produto de `alpha_1` até `alpha_t`. A composição
gaussiana fornece então uma expressão direta para qualquer instante:[^ddpm]

```text
q(x_t | x_0) = Normal(sqrt(alpha_bar_t) x_0, (1 - alpha_bar_t) I)

x_t = sqrt(alpha_bar_t) x_0 + sqrt(1 - alpha_bar_t) epsilon
epsilon ~ Normal(0, I)
```

Nos primeiros instantes, `x_t` preserva a maior parte da amostra. Nos últimos, o ruído domina. O
cronograma é escolhido para que a distribuição terminal `q(x_T)` fique próxima de um prior simples,
como uma distribuição normal padrão.

A forma fechada é importante na prática: o treinamento não precisa adicionar o ruído etapa por
etapa. O programa pode escolher um instante aleatório `t`, sortear um único `epsilon` e construir
`x_t` diretamente. A cadeia longa aparece sobretudo durante a geração, quando cada atualização
reversa depende do resultado anterior.[^ddpm]

O processo direto não descobre como dados reais ficam ruidosos nem busca ser um modelo físico
realista de degradação. Ele cria uma escada de distribuições mais simples e suavizadas por ruído
entre dados complexos e um prior tratável. Outras famílias de corrupção são possíveis. A difusão
discreta, por exemplo, pode trocar o ruído gaussiano por matrizes de transição que substituem ou
mascaram categorias de forma aleatória.[^d3pm]

## Aprendizado do processo reverso

A condicional reversa exata `q(x_(t-1) | x_t)` depende da distribuição desconhecida dos dados. Um
DDPM a aproxima com transições gaussianas aprendidas:

```text
p_theta(x_(t-1) | x_t, c) = Normal(mu_theta(x_t, t, c), Sigma_theta(x_t, t, c))
```

O `c` opcional é uma condição. A rede pode prever diretamente a média e a variância reversas, mas
parametrizações comuns preveem o ruído `epsilon` adicionado, o exemplo limpo `x_0` ou uma combinação
linear às vezes chamada de velocidade. Dado o cronograma, essas quantidades podem ser convertidas
umas nas outras, embora a ponderação da perda e o comportamento numérico variem entre níveis de
ruído.[^ddpm][^progressive-distillation][^edm]

Na forma muito usada de previsão de ruído, o treinamento minimiza uma versão ponderada de:

```text
L_simple = E[x_0, t, epsilon] ||epsilon - epsilon_theta(x_t, t, c)||^2
```

Uma etapa comum de [treinamento de modelos](/pt/model-training/) consiste, então, em cinco
operações:

1. Sortear dados limpos `x_0` e, quando houver, sua condição `c`.
2. Sortear um instante `t` e um ruído gaussiano independente `epsilon`.
3. Construir `x_t` diretamente a partir de `x_0`, `t` e `epsilon`.
4. Pedir à rede que preveja o alvo a partir de `x_t`, `t` e `c`.
5. Retropropagar o erro da previsão e atualizar os parâmetros da rede.

Isso se parece com regressão supervisionada porque o programa fabrica um alvo exato para cada
exemplo sem rótulo. Ainda assim, normalmente é **autossupervisionado**: ninguém precisa rotular o
ruído correto. A geração condicional pode exigir também rótulos pareados, legendas ou outros dados de
condicionamento.

A derivação probabilística original otimiza um limite inferior variacional da log-verossimilhança
dos dados. O erro quadrático médio simplificado muda a ponderação de seus termos e foi escolhido pela
qualidade das amostras nos experimentos DDPM. Trabalhos posteriores combinaram objetivos
simplificados e variacionais e aprenderam variâncias reversas para melhorar a verossimilhança e
reduzir a quantidade de avaliações durante a amostragem.[^ddpm][^improved-ddpm]

### Interpretação pelo score

Para uma distribuição marginal ruidosa `p_t(x)`, seu **score** é o campo vetorial

```text
s(x, t) = gradient_x log p_t(x)
```

Não se trata de uma nota de qualidade nem de uma probabilidade. O vetor aponta localmente na direção
em que o logaritmo da densidade aumenta. Uma rede condicionada pelo nível de ruído pode aprender esse
campo por correspondência de score com redução de ruído, sem calcular a densidade normalizada. Na
perturbação gaussiana comum, o ruído previsto e o score são proporcionais, com escala e sinal
determinados pelo desvio-padrão do ruído.[^score-model]

Isso explica como “prever o ruído” pode gerar estrutura. Não se espera que a rede recupere aquele
ruído aleatório específico como se fosse informação criptografada. Entre muitos exemplos
corrompidos, a previsão ótima de redução de ruído codifica uma direção estatística para regiões mais
plausíveis sob a distribuição de treinamento. Repetir essas correções locais transporta um ponto
aleatório em direção à distribuição aprendida dos dados.

### Interpretação em tempo contínuo

Uma equação diferencial estocástica direta pode escrever a corrupção gradual como

```text
dx = f(x, t) dt + g(t) dw
```

em que `dw` é ruído browniano. Sua EDE em tempo reverso depende do score de cada marginal ruidosa:

```text
dx = [f(x, t) - g(t)^2 gradient_x log p_t(x)] dt + g(t) d(w_reverse)
```

Na segunda expressão, o tempo corre do ruído de volta aos dados. Substituir o score desconhecido por
uma estimativa neural produz um processo generativo. As mesmas marginais também podem ser seguidas
pela **EDO de fluxo de probabilidade**, determinística, cujo termo de score tem fator um meio.[^score-sde]

Essa visão separa o campo aprendido do caminho numérico usado para integrá-lo. Também mostra por que
um amostrador derivado de difusão pode ser estocástico ou determinístico. A linguagem de DDPM, EDE
baseada em score e EDO muitas vezes descreve discretizações ou parametrizações diferentes de modelos
estreitamente relacionados, não três invenções sem relação.

## Geração e amostragem

Um amostrador DDPM ancestral começa com `x_T` sorteado do prior terminal e avalia a rede de `T` até
`1`. Em cada etapa, forma um `x_(t-1)` com menos ruído e normalmente injeta a variância definida pela
transição reversa. Cada avaliação da rede opera em paralelo sobre todas as posições espaciais ou da
sequência, mas as avaliações são sequenciais entre si, pois cada uma consome o estado
anterior.[^ddpm]

O cronograma original pode conter centenas ou milhares de instantes de treinamento, mas a inferência
não precisa visitar todos. Métodos de amostragem fazem escolhas diferentes entre velocidade,
qualidade e variedade:

- A **amostragem ancestral DDPM** segue transições reversas estocásticas e pode produzir trajetórias
  diferentes até a partir de um estado intermediário.
- O **DDIM** constrói processos diretos não markovianos com o mesmo objetivo de treinamento. Sua
  configuração determinística mapeia um tensor fixo de ruído inicial para um resultado reproduzível
  e pode usar uma sequência muito menor de instantes.[^ddim]
- **Preditores e corretores de EDE** integram numericamente uma EDE reversa e podem alternar uma
  etapa de previsão com correções baseadas em score.[^score-sde]
- **Fluxo de probabilidade e solvers específicos para EDOs de difusão** usam integração
  determinística. O DPM-Solver, por exemplo, resolve analiticamente parte da EDO de difusão e
  aproxima a integral neural restante com um método de ordem superior.[^dpm-solver]
- **Métodos de destilação e consistência** treinam um aluno para aproximar uma longa trajetória em
  uma ou poucas avaliações. Modelos de consistência podem ser destilados de modelos de difusão ou
  treinados como família generativa própria.[^progressive-distillation][^consistency-models]

Assim, “etapas” é uma informação incompleta sobre desempenho. Uma etapa pode exigir uma ou mais
avaliações do redutor de ruído, geralmente relatadas como **número de avaliações da função** (NFE). A
latência real também depende de tamanho do modelo, resolução, lote, orientação, hardware e
implementação. Um solver que funciona bem para uma parametrização ou escala de orientação talvez
não preserve a qualidade em outra, e menos avaliações nem sempre são melhores.

A semente aleatória normalmente determina o ruído inicial e os sorteios estocásticos posteriores.
Ela não escolhe uma imagem completa já escondida no ruído. A saída surge da interação entre esse
estado aleatório, a distribuição aprendida, a condição, a orientação e o amostrador numérico.

## Condicionamento e orientação

Um modelo incondicional aproxima `p(x)`. Um modelo condicional aproxima `p(x | c)`, em que `c` pode
representar uma classe, texto, outra modalidade, uma amostra em baixa resolução, uma máscara ou
valores observados. O redutor de ruído recebe uma codificação de `c` por mecanismos como
concatenação, atenção cruzada ou normalização adaptativa. O processo reverso usa então a condição em
cada nível de ruído escolhido.[^latent-diffusion][^dit]

A **orientação por classificador** combina um score de difusão com gradientes de um classificador
separado e treinado para reconhecer a condição desejada em entradas ruidosas. Aumentar a contribuição
do classificador pode melhorar a fidelidade à condição e reduzir a variedade.[^guided-diffusion]

A **orientação sem classificador** (_classifier-free guidance_, CFG) dispensa o classificador
separado. Durante o treinamento, o modelo vê tanto exemplos condicionados quanto exemplos em que a
condição foi retirada. Na inferência, combina previsões condicionais e não condicionais, de forma
esquemática:

```text
guided = unconditioned + guidance_scale * (conditioned - unconditioned)
```

A diferença estima uma direção associada à condição. Amplificá-la costuma melhorar a fidelidade ao
prompt ou à classe, mas muda a distribuição amostrada e troca variedade por fidelidade. Orientação
muito forte pode produzir artefatos ou características exageradas. As convenções da fórmula para a
escala informada variam; portanto, as escalas não são necessariamente comparáveis entre
implementações.[^cfg]

A difusão também permite restauração e edição condicionais. O preenchimento pode preservar regiões
observadas enquanto amostra as ausentes; a super-resolução se condiciona em uma entrada menor; e a
geração de imagem para imagem pode começar por uma representação ruidosa de uma entrada, em vez de
ruído terminal puro. Essas operações são probabilísticas quando várias saídas podem atender de forma
plausível à mesma evidência, ao contrário de um sistema de regressão de estimativa pontual treinado
para retornar uma única resposta.[^palette][^sdedit]

## Representações de dados e arquiteturas de rede

### Difusão em pixels ou no espaço dos dados

Um modelo no espaço dos dados aplica corrupção e redução de ruído diretamente ao objeto gerado. Para
uma imagem, `x_t` é um tensor de pixels do tamanho da imagem; para síntese de formas de onda, pode ser
uma sequência de amostras de áudio. Isso dispensa um modelo de compressão treinado separadamente,
mas as avaliações repetidas da rede na dimensionalidade completa encarecem a geração em alta
resolução.[^ddpm][^diffwave]

### Difusão latente

Um **modelo de difusão latente** primeiro treina ou obtém um autoencoder. Seu codificador mapeia os
dados `x` para uma representação contínua menor `z`; a difusão modela a distribuição de `z`; e o
decodificador transforma um `z` amostrado de volta em dados. A redução do tamanho espacial e da
dimensionalidade diminui o custo de cada avaliação do redutor de ruído. A atenção cruzada pode
condicionar o redutor de ruído latente com texto ou outras entradas.[^latent-diffusion]

Esse projeto é uma composição de dois modelos. Sua saída não consegue preservar diferenças
descartadas pelo autoencoder, e o erro de reconstrução limita os detalhes recuperáveis pelo caminho
latente. Difusão latente não deve ser confundida com a observação mais ampla de que um DDPM é
matematicamente um modelo de variáveis latentes, cujos estados ruidosos intermediários são variáveis
latentes.

### U-Nets e transformers de difusão

Os primeiros DDPMs de imagens geralmente usavam U-Nets: redes convolucionais multiescala, com
conexões de atalho, atenção e um embedding do instante atual. A U-Net é uma arquitetura prática para
reduzir ruído, não um requisito da formulação probabilística.[^ddpm]

Transformers de Difusão (DiTs) tokenizam um latente espacial e processam suas regiões com blocos
transformer. Os experimentos originais com DiT substituíram o backbone U-Net comum em um sistema de
difusão latente e observaram ganhos previsíveis conforme aumentava o processamento do transformer
nas tarefas estudadas do ImageNet.[^dit] Qualquer uma das arquiteturas pode usar o mesmo objetivo
geral de corrupção, ideia de condicionamento e família de amostradores.

### Difusão discreta

A difusão gaussiana pressupõe valores contínuos. Tokens de texto, atributos categóricos e estruturas
de grafos são discretos, de modo que adicionar um pequeno ruído gaussiano a seus IDs não tem
significado semântico próprio. Modelos probabilísticos de difusão discreta com redução de ruído
(D3PMs) usam matrizes de transição categóricas. Um processo pode substituir símbolos, mover-se entre
categorias próximas ou transformá-los em um token de máscara absorvente, enquanto o modelo reverso
prevê estados categóricos anteriores.[^d3pm]

A difusão discreta pode revisar várias posições em uma única iteração e oferece preenchimento de
forma natural. A decodificação autorregressiva, por sua vez, confirma as saídas em uma ordem
escolhida. A diferença não é absoluta: um processo de corrupção discreto com máscaras absorventes
liga a difusão à modelagem mascarada, e tanto modelos de difusão quanto autorregressivos podem usar
transformers.

## Comparação com outros métodos generativos

Nenhum ranking único representa todos os modelos generativos. Eles diferem em sinal de treinamento,
avaliação de densidade, direção de inferência, latência de amostragem, cobertura da distribuição e
suporte a condicionamento. A tabela descreve as formas comuns; sistemas híbridos podem combinar as
linhas.

| Família                           | O que é aprendido                                      | Como a amostra é produzida                                | Vantagens e limitações típicas                                                                  |
| --------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Modelo de difusão ou score        | Transições reversas, alvo de redução de ruído ou score | Atualizações iterativas por EDE, EDO ou processo discreto | Treinamento flexível por regressão e controle iterativo, mas avaliações repetidas da rede       |
| Rede generativa adversarial       | Gerador em oposição a um discriminador                 | Normalmente uma passagem do gerador a partir do ruído     | Amostragem rápida sem verossimilhança normalizada explícita; jogo adversarial no treinamento    |
| Autoencoder variacional           | Codificador e decodificador probabilístico sob ELBO    | Sortear um latente compacto e decodificá-lo               | Inferência amortizada; a qualidade depende muito das escolhas de latente e verossimilhança      |
| Modelo autorregressivo            | Distribuições condicionais ordenadas                   | Gerar um elemento ou bloco depois do outro                | Fatoração tratável, mas decodificação sequencial na ordem escolhida                             |
| Fluxo normalizante                | Transformação invertível com jacobiana tratável        | Transformar uma amostra-base por um mapa invertível       | Densidade exata por mudança de variáveis, com restrições arquitetônicas ou de integração        |
| Flow matching ou fluxo retificado | Campo de velocidade dependente do tempo                | Integrar uma EDO determinística da origem aos dados       | Regressão estável e caminhos potencialmente diretos; qualidade e velocidade dependem do caminho |

### Comparação com redes generativas adversariais

Uma GAN treina gerador e discriminador em um jogo minimax com dois participantes. O gerador aprende
a mapear ruído em amostras parecidas com os dados, enquanto o discriminador aprende a distinguir
amostras geradas das reais.[^gan] Depois do treinamento, um gerador GAN comum pode produzir uma
amostra em uma única passagem direta. Um amostrador padrão de difusão reutiliza um redutor de ruído
em vários níveis, o que torna a latência sua desvantagem mais visível.

A difusão troca o jogo adversarial por alvos de regressão produzidos a partir de exemplos reais. Em
geral, isso evita equilibrar dois oponentes e fornece um alvo durante todo o treinamento. Os resultados
continuam sensíveis à arquitetura, ponderação de ruído, dados e processamento. Por outro lado, GANs
não definem inerentemente uma densidade normalizada que possa ser avaliada, enquanto a difusão
probabilística permite um limite variacional de verossimilhança e o cálculo da verossimilhança em
tempo contínuo com mecanismos adicionais.[^ddpm][^score-sde]

Comparações empíricas dependem do conjunto e da métrica. Experimentos com DDPMs melhorados relataram
recall mais alto que algumas linhas de base GAN com pontuações semelhantes de qualidade de imagem, e
a difusão guiada depois superou os principais resultados de GAN em determinados benchmarks de
geração do ImageNet.[^improved-ddpm][^guided-diffusion] Uma GAN treinada pode ser preferível quando
uma única passagem de baixa latência importa mais que o refinamento iterativo ou a flexibilidade da
orientação na difusão.

### Comparação com autoencoders variacionais

Um VAE aprende um codificador `q(z | x)` que aproxima uma distribuição posterior sobre variáveis
latentes compactas e um decodificador `p(x | z)`. Seu limite inferior da evidência equilibra a
verossimilhança da reconstrução com uma divergência que regulariza a distribuição codificada em
direção a um prior.[^vae] A inferência padrão de VAE oferece, assim, um mapa aprendido de dados para
latente, e a geração com decodificador feed-forward pode exigir apenas o sorteio de um latente e uma
passagem do decodificador.

Um DDPM também pode ser derivado como modelo variacional de variáveis latentes, mas normalmente usa
uma distribuição fixa de corrupção direta e uma longa hierarquia `x_1 ... x_T`, em vez de aprender
um codificador compacto de inferência para essa hierarquia. Sua perda simples de redução de ruído é
aplicada entre níveis de ruído, e a geração percorre iterativamente a hierarquia aprendida. Um sistema
de difusão latente combina as duas ideias: um autoencoder fornece a compressão, e a difusão fornece
o prior sobre os códigos comprimidos.[^ddpm][^latent-diffusion]

VAEs são úteis quando codificação rápida, representação compacta ou inferência posterior amortizada
são requisitos centrais. A difusão é atraente quando refinamento iterativo e amostragem condicional
flexível justificam mais processamento na geração. Nenhum dos rótulos determina sozinho a qualidade
perceptiva; verossimilhanças do decodificador, capacidade latente, arquitetura e avaliação importam.

### Comparação com modelos autorregressivos

Um modelo autorregressivo fatora uma distribuição conjunta em uma ordem:

```text
p(x) = product_i p(x_i | x_1, ..., x_(i-1))
```

O PixelRNN, por exemplo, prevê pixels de imagens em sequência e atribui uma probabilidade discreta a
seus valores brutos.[^pixelrnn] Modelos modernos de linguagem aplicam o mesmo princípio a tokens. O
treinamento pode avaliar muitas previsões do próximo elemento em paralelo quando o exemplo inteiro é
conhecido, mas a geração comum precisa esperar pelos elementos anteriores já gerados.

A difusão reverte um nível de corrupção, não uma ordem da esquerda para a direita ou de varredura.
Em uma avaliação do redutor de ruído, pode atualizar todo o tensor em paralelo; depois, repete a
operação ao longo do tempo. Sua profundidade sequencial está ligada às avaliações do amostrador, e
não diretamente à quantidade de elementos. Isso pode ser vantajoso para grandes matrizes espaciais
ou preenchimento, enquanto a autorregressão combina naturalmente com dados discretos, ordenados e em
streaming e oferece uma fatoração normalizada direta.

A comparação de latência depende da escala. A geração autorregressiva aproveita estados em cache e
normalmente calcula um novo elemento por etapa; a difusão revisita todas as posições atuais, mas pode
usar muito menos etapas que a quantidade de pixels, amostras de áudio ou tokens. Difusão discreta e
autorregressão em blocos tornam a fronteira ainda menos clara.

### Comparação com fluxos normalizantes

Um fluxo normalizante aprende uma transformação invertível entre os dados e uma distribuição-base
conhecida. A fórmula de mudança de variáveis fornece log-densidade exata, inversão latente exata e
amostragem direta quando a transformação e o determinante de sua jacobiana podem ser
calculados.[^realnvp] Essas exigências limitam as arquiteturas convencionais de fluxo.

A difusão padrão destrói informação deliberadamente em seu processo direto estocástico e aprende
uma reversão aproximada; ela pode usar um redutor de ruído genérico e não invertível. Sua formulação
discreta comum fornece um limite de verossimilhança, não a densidade exata e simples de um fluxo
invertível. Ainda assim, a fronteira é permeável: a EDO de fluxo de probabilidade de um modelo de
difusão é invertível sob integração ideal e pode permitir o cálculo de verossimilhança, embora isso
exija resolver uma EDO e estimar um termo de divergência.[^score-sde]

### Comparação com flow matching e fluxos retificados

O **flow matching** treina um fluxo normalizante contínuo pela regressão de um campo de velocidade
dependente do tempo para um caminho escolhido entre uma distribuição de origem e os dados. A
amostragem integra uma EDO determinística. Ao contrário da difusão baseada em score, a rede não
precisa estimar o gradiente de uma densidade ruidosa, e o caminho não precisa surgir de uma corrupção
gaussiana progressiva.[^flow-matching]

As duas famílias se sobrepõem. O flow matching pode usar caminhos de probabilidade de difusão,
enquanto outras versões escolhem caminhos mais retos, semelhantes ao transporte ótimo, para facilitar
a integração. Ambas podem usar backbones U-Net ou transformer parecidos, mecanismos semelhantes de
condicionamento e solvers iterativos. A distinção mais clara está no campo e no caminho aprendidos:
o score ao longo de um processo estocástico de adição de ruído, em comparação com a velocidade ao longo
de um caminho de probabilidade. Ela não está no fato de o produto ser um gerador de imagens ou um
transformer.

O **fluxo retificado** é uma construção próxima que faz regressão de velocidades em linhas retas
entre amostras de duas distribuições nos extremos. Seu procedimento de retificação pode ser repetido
para deixar as trajetórias aprendidas mais retas e, assim, mais fáceis de aproximar com passos
maiores no tempo.[^rectified-flow] Ele costuma ser discutido junto ao flow matching porque os dois
aprendem EDOs determinísticas de transporte, embora seus objetivos originais e formas de acoplamento
não sejam idênticos.

## Aplicações

A difusão é útil quando a saída desejada é uma distribuição de objetos plausíveis e de alta
dimensão, em vez de um único alvo determinístico. Entre as aplicações estão:

- geração de imagens incondicional, condicionada por classe e condicionada por texto;
- preenchimento, expansão, colorização, restauração e super-resolução;[^palette]
- geração de formas de onda e vocoders neurais;[^diffwave]
- geração de vídeo incondicional, preditiva e condicionada por texto;[^video-diffusion]
- geração de conformações moleculares com redes que consideram rotação e translação;[^geodiff]
- preenchimento de séries temporais condicionado por valores observados;[^csdi]
- problemas inversos e amostragem posterior quando observações podem orientar o processo reverso.[^score-sde]

Essas aplicações exigem representações e vieses indutivos diferentes. Um sistema molecular pode
precisar de equivariância geométrica; vídeo deve preservar coerência temporal e espacial; texto
precisa de uma formulação discreta ou por embeddings contínuos. “Usa difusão” define o mecanismo
generativo, não um projeto completo de sistema.

### Estudo de caso: remoção de marcas-d'água invisíveis

A restauração de imagens também pode atuar como ataque a um sistema de procedência. Uma marca-d'água
invisível é uma pequena perturbação estruturada na imagem; um redutor de ruído generativo pode trocar
esse sinal por detalhes favorecidos pelo prior de imagens aprendido, mesmo sem ter sido treinado para
atacar a marca. Pesquisas anteriores formalizaram e testaram essa família de **ataques de
regeneração**, adicionando ruído e reconstruindo a imagem com modelos generativos
pré-treinados.[^watermark-regeneration]

O experimento de 2025 da return moe [Remoção de marca-d'água como tarefa de redução de
ruído](/pt/watermark-removal-as-a-denoising-task/) testou uma versão especialmente pequena da
transformação. Ele codificou um quadro de anime com marca-d'água pelo WAI-Illustrious-SDXL v15 e
executou uma atualização reversa tardia, com a adição de novo ruído desativada; uma segunda passagem
também foi testada para o Watermark Anything. Os decodificadores disponíveis deixaram de recuperar
os sinais TrustMark e SynthID depois de uma passagem, enquanto a precisão do conteúdo WAM caiu de
`1.00` para `0.56` após uma passagem e para os `0.53` do controle sem marca depois de
duas.[^return-moe-watermark]

Não se trata de difusão direta completa seguida de geração a partir de muito ruído. É uma projeção
mínima de imagem para imagem por um prior SDXL especializado em anime. A saída preservou a cena
principal, mas alterou pequenos detalhes de interface, revelando o principal custo da abordagem: a
reconstrução generativa pode evitar um detector de baixo nível e preservar a aparência semântica,
mas não a imagem exata. O resultado de uma única imagem é um estudo de robustez, não uma taxa universal de
remoção.

## Pontos fortes

Modelos de difusão apresentam várias vantagens recorrentes:

- O objetivo central de redução de ruído é um problema direto de regressão, com alvos produzidos a
  partir dos dados, não um adversário aprendido.[^ddpm]
- A suavização por ruído permite que uma rede aprenda uma sequência de distribuições entre um prior
  simples e dados complexos, sem exigir que a própria arquitetura seja invertível.[^score-model]
- Condicionamento e orientação podem ser aplicados várias vezes durante a geração, permitindo
  ajustar o equilíbrio entre fidelidade à condição e variedade.[^guided-diffusion][^cfg]
- A geração iterativa aceita naturalmente observações parciais e correções repetidas, o que é útil
  para edição e problemas inversos.[^palette][^score-sde]
- O framework funciona em domínios contínuos, discretos, espaciais, temporais e geométricos, em vez
  de pertencer apenas à síntese de imagens.[^d3pm][^diffwave][^video-diffusion][^geodiff]

São tendências, não garantias. Um conjunto de dados, uma representação, um objetivo, um amostrador
ou uma avaliação mal escolhidos podem pesar mais que as vantagens da família.

## Limitações e riscos

**Custo da amostragem.** A geração comum exige avaliar várias vezes uma rede grande. Solvers mais
rápidos, representações latentes, destilação e treinamento de consistência reduzem a quantidade ou o
custo das etapas, mas podem introduzir erro de aproximação, gargalo de compressão, treinamento
adicional ou perdas de qualidade e variedade.[^latent-diffusion][^dpm-solver][^consistency-models]

**Custo e ponderação do treinamento.** Embora um único nível aleatório de ruído baste por exemplo de
treinamento, o modelo precisa aprender o comportamento em toda a faixa. Cronograma de ruído,
parametrização do alvo, ponderação da perda, pré-condicionamento e precisão numérica afetam bastante a
otimização.[^improved-ddpm][^edm]

**Erro acumulado.** O amostrador age repetidamente sobre suas próprias saídas intermediárias. Erros
de previsão e discretização podem se acumular, sobretudo quando se usam pouquíssimas etapas ou a
orientação leva a trajetória para fora das regiões representadas no treinamento. Mais etapas não
corrigem um score, condição ou conjunto de dados sistematicamente errado.

**Limites da representação.** A difusão latente herda as informações perdidas pelo autoencoder. A
difusão discreta depende de um processo de corrupção adequado ao vocabulário ou à estrutura. A
arquitetura do redutor de ruído ainda precisa da capacidade e dos vieses indutivos exigidos pelo
domínio.[^latent-diffusion][^d3pm]

**Controle não é correção.** A orientação pode fazer uma saída parecer mais compatível com uma
condição sem torná-la factual, fisicamente válida, imparcial ou segura. Um modelo de imagem
condicionado por texto não é um sistema de busca, e um gerador de moléculas não substitui a validação
experimental.

**Riscos de dados e privacidade.** Assim como outros grandes modelos generativos, sistemas de
difusão podem reproduzir vieses, conteúdo sensível e exemplos protegidos ou privados presentes nos
dados. Um estudo de extração de 2023 recuperou exemplos memorizados de treinamento de vários sistemas
de difusão de imagem por um ataque de geração e filtragem, mostrando que não se pode presumir que a
saída gerada seja independente de registros individuais do treinamento.[^training-data-extraction]
A incidência depende do modelo, duplicação dos dados, prompts e ataque; o resultado não significa
que toda saída seja uma imagem armazenada do treinamento.

## Equívocos comuns

- **“O modelo aprende a desfazer uma sequência exata de adição de ruído.”** O treinamento sorteia
  tempos e ruídos independentes. A rede aprende um campo reverso estatístico sobre a distribuição dos
  dados.
- **“A geração executa o processo direto e depois o reverte.”** A geração incondicional começa com
  uma nova amostra de ruído terminal. O processo direto é principalmente uma construção de
  treinamento.
- **“O redutor de ruído revela a imagem original escondida no ruído aleatório.”** Uma nova amostra
  de ruído não tem um original único. Em cada nível, muitas amostras limpas são compatíveis com um
  estado ruidoso.
- **“A difusão é necessariamente aleatória em toda etapa.”** Amostradores ancestrais e por EDE são
  estocásticos; a amostragem por DDIM e EDO de fluxo de probabilidade pode ser determinística para
  um estado inicial fixo.[^ddim][^score-sde]
- **“Um modelo de difusão é uma U-Net.”** U-Nets e transformers são alternativas de backbone para o
  redutor de ruído. A difusão define a corrupção e o processo generativo.[^dit]
- **“Difusão latente e difusão são a mesma coisa.”** Difusão latente é um projeto de eficiência; a
  difusão no espaço dos dados e a discreta não exigem seu autoencoder.[^latent-diffusion][^d3pm]
- **“Mais etapas de redução de ruído sempre melhoram o resultado.”** Precisão do solver, erro do
  modelo, aleatoriedade, orientação e cronograma de tempos interagem; a quantidade ideal depende do
  sistema e do orçamento.

## Escolha entre métodos

A difusão é uma forte candidata quando as saídas são multidimensionais e multimodais,
condicionamento ou edição precisam ser flexíveis, cobertura da distribuição importa e várias
avaliações da rede cabem no limite de latência. A difusão latente é especialmente útil quando um
autoencoder de alta qualidade consegue remover dimensões perceptivamente redundantes sem descartar
informações essenciais à tarefa.

Outra família pode ser um ponto de partida melhor quando seus requisitos se alinham mais diretamente
à estrutura dela:

- usar uma GAN quando a latência de geração em uma passagem é prioritária e o treinamento
  adversarial é aceitável;
- usar um VAE quando um codificador aprendido e uma representação latente probabilística compacta
  são centrais;
- usar um modelo autorregressivo quando os dados têm uma ordem causal natural, o streaming é
  necessário ou uma fatoração discreta direta da verossimilhança é valiosa;
- usar um fluxo normalizante invertível quando transformação e avaliação exatas de densidade
  justificam suas restrições;
- considerar flow matching ou fluxo retificado quando o transporte determinístico por um caminho de
  probabilidade escolhido é preferível a aprender um score de difusão.

A decisão deve usar dados, tamanho de modelo, condicionamento, avaliação e processamento
equivalentes. A qualidade das amostras sozinha não basta: estabilidade do treinamento,
verossimilhança ou calibração, variedade, latência, memória, controle, privacidade e validade para o
uso posterior podem levar a escolhas diferentes.

## Referências

[^thermodynamics]: [Deep Unsupervised Learning using Nonequilibrium Thermodynamics](https://proceedings.mlr.press/v37/sohl-dickstein15.html).

[^score-model]: [Generative Modeling by Estimating Gradients of the Data Distribution](https://arxiv.org/abs/1907.05600).

[^ddpm]: [Denoising Diffusion Probabilistic Models](https://proceedings.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1ab10179ca4b-Abstract.html).

[^score-sde]: [Score-Based Generative Modeling through Stochastic Differential Equations](https://openreview.net/forum?id=PxTIG12RRHS).

[^improved-ddpm]: [Improved Denoising Diffusion Probabilistic Models](https://proceedings.mlr.press/v139/nichol21a.html).

[^guided-diffusion]: [Diffusion Models Beat GANs on Image Synthesis](https://proceedings.neurips.cc/paper/2021/hash/49ad23d1ec9fa4bd8d77d02681df5cfa-Abstract.html).

[^ddim]: [Denoising Diffusion Implicit Models](https://arxiv.org/abs/2010.02502).

[^progressive-distillation]: [Progressive Distillation for Fast Sampling of Diffusion Models](https://arxiv.org/abs/2202.00512).

[^cfg]: [Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598).

[^latent-diffusion]: [High-Resolution Image Synthesis with Latent Diffusion Models](https://openaccess.thecvf.com/content/CVPR2022/html/Rombach_High-Resolution_Image_Synthesis_With_Latent_Diffusion_Models_CVPR_2022_paper.html).

[^edm]: [Elucidating the Design Space of Diffusion-Based Generative Models](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a98846e9d9cc01cfb87eb694d946ce6b-Abstract-Conference.html).

[^dpm-solver]:
    [DPM-Solver: A Fast ODE Solver for Diffusion Probabilistic Model Sampling in Around 10
    Steps](https://proceedings.neurips.cc/paper_files/paper/2022/hash/260a14acce2a89dad36adc8eefe7c59e-Abstract-Conference.html).

[^consistency-models]: [Consistency Models](https://proceedings.mlr.press/v202/song23a.html).

[^dit]: [Scalable Diffusion Models with Transformers](https://openaccess.thecvf.com/content/ICCV2023/html/Peebles_Scalable_Diffusion_Models_with_Transformers_ICCV_2023_paper.html).

[^d3pm]: [Structured Denoising Diffusion Models in Discrete State-Spaces](https://proceedings.neurips.cc/paper/2021/hash/958c530554f78bcd8e97125b70e6973d-Abstract.html).

[^gan]: [Generative Adversarial Nets](https://proceedings.neurips.cc/paper_files/paper/2014/hash/f033ed80deb0234979a61f95710dbe25-Abstract.html).

[^vae]: [Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114).

[^pixelrnn]: [Pixel Recurrent Neural Networks](https://proceedings.mlr.press/v48/oord16.html).

[^realnvp]: [Density Estimation using Real NVP](https://openreview.net/forum?id=HkpbnH9lx).

[^flow-matching]: [Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747).

[^rectified-flow]:
    [Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified
    Flow](https://arxiv.org/abs/2209.03003).

[^palette]: [Palette: Image-to-Image Diffusion Models](https://arxiv.org/abs/2111.05826).

[^sdedit]: [SDEdit: Guided Image Synthesis and Editing with Stochastic Differential Equations](https://arxiv.org/abs/2108.01073).

[^diffwave]: [DiffWave: A Versatile Diffusion Model for Audio Synthesis](https://arxiv.org/abs/2009.09761).

[^video-diffusion]: [Video Diffusion Models](https://arxiv.org/abs/2204.03458).

[^geodiff]: [GeoDiff: A Geometric Diffusion Model for Molecular Conformation Generation](https://arxiv.org/abs/2203.02923).

[^csdi]:
    [CSDI: Conditional Score-based Diffusion Models for Probabilistic Time Series
    Imputation](https://arxiv.org/abs/2107.03502).

[^training-data-extraction]: [Extracting Training Data from Diffusion Models](https://www.usenix.org/conference/usenixsecurity23/presentation/carlini).

[^watermark-regeneration]: [Invisible Image Watermarks Are Provably Removable Using Generative AI](https://arxiv.org/abs/2306.01953).

[^return-moe-watermark]:
    [Watermark removal as a denoising task](https://blog.return.moe/en/2025/12/21/watermark-removal-as-a-denoising-task/),
    blog da return moe, 21 de dezembro de 2025.
