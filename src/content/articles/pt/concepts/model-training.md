---
id: model-training
title: Treinamento de modelos
summary: O processo de otimizar um modelo de aprendizado de máquina, desde o pré-treinamento de modelos fundacionais até adaptação, aprendizado por preferências e destilação.
locale: pt-BR
kind: concept
translatedFromRevision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - treinamento de modelos de IA
  - treinamento de modelos fundacionais
  - treinamento de modelos de linguagem
  - treinamento de LLMs
redirects:
  - ai-model-training
  - llm-training
related:
  - mechanistic-interpretability
infobox:
  fields:
    - key: type
      value: Processo de otimização de aprendizado de máquina
---

O **treinamento de modelos** é o processo de ajustar os parâmetros de um modelo de aprendizado de
máquina para que suas saídas atendam melhor a um objetivo escolhido sobre dados. Em uma rede neural,
o treinamento normalmente consiste em passagens diretas repetidas, cálculo da perda,
retropropagação e atualizações do otimizador. O resultado é um conjunto de **pesos** aprendidos:
parâmetros numéricos que codificam padrões estatísticos úteis para previsão ou geração.

Para um modelo fundacional moderno, “treinamento” normalmente é um pipeline, não uma única execução.
Uma equipe pode pré-treinar um modelo-base com dados brutos, continuar o pré-treinamento em um
domínio, fazer ajuste fino com demonstrações, otimizá-lo segundo preferências ou recompensas e, por
fim, destilá-lo em um modelo menor. Essas etapas têm finalidades e custos diferentes. Termos como
**SFT**, **DPO**, **LoRA** e **QLoRA** não são alternativas mutuamente exclusivas: alguns descrevem o
sinal de aprendizado; outros, quais parâmetros são armazenados ou atualizados.

Este artigo dá ênfase a modelos de linguagem transformer, nos quais a terminologia é mais comum, mas
as mesmas distinções se aplicam de forma ampla a modelos de visão, áudio, multimodais e outras redes
neurais.

## Mapa da terminologia

Os métodos de treinamento podem ser classificados em vários eixos independentes:

| Pergunta                                       | Opções comuns                                                                                   |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Em que ponto do ciclo de vida está a execução? | Pré-treinamento, pré-treinamento continuado, pós-treinamento ou destilação                      |
| O que fornece o sinal-alvo?                    | Previsão de dados brutos, demonstrações, pares de preferência, recompensa ou professor          |
| Quais parâmetros podem mudar?                  | Todos os pesos, alguns pesos existentes, adaptadores, matrizes de baixo posto ou prompts suaves |
| Como o modelo é representado na memória?       | Precisão completa, precisão mista ou backbone congelado e quantizado                            |

Por exemplo, **SFT com LoRA** usa demonstrações como sinal-alvo e matrizes de baixo posto como
parâmetros treináveis. **DPO com QLoRA** usa pares de preferência como sinal-alvo, mantém um backbone
quantizado e congelado e atualiza adaptadores de baixo posto em maior precisão. Portanto, “LoRA ou
DPO” mistura categorias diferentes, a menos que a verdadeira pergunta seja quais receitas completas
de treinamento devem ser comparadas.

## Como funciona o treinamento por gradientes

Uma etapa típica de treinamento tem quatro partes:

1. Um carregador de dados transforma exemplos em tensores e os reúne em um **lote**. Em um modelo de
   linguagem, um tokenizador primeiro converte texto em IDs de tokens.
2. Uma **passagem direta** calcula as previsões do modelo. Uma **função de perda** atribui uma
   penalidade escalar à diferença entre essas previsões e o alvo de treinamento.
3. A **retropropagação** calcula o gradiente da perda em relação a cada parâmetro treinável.
4. Um **otimizador**, geralmente uma variante do gradiente descendente estocástico, como Adam, usa
   esses gradientes e seu estado interno para atualizar os parâmetros.[^adam]

Uma atualização é uma **etapa**. Uma **época** é uma passagem por um conjunto de dados finito, embora
misturas de tokens, corpora em streaming, reamostragem e dados sintéticos tornem o número de tokens
ou etapas mais informativo do que o número de épocas em muitos treinamentos de modelos
fundacionais. Um
**cronograma da taxa de aprendizado** controla o tamanho das atualizações ao longo do tempo.
**Checkpoints** preservam os pesos e, quando o treinamento precisa continuar exatamente do mesmo
ponto, os estados do otimizador, do agendador e do gerador de números aleatórios.

A perda de treinamento mede o ajuste aos dados de treinamento amostrados; sozinha, não mede
utilidade. Equipes usam dados de validação separados para escolhas como momento de parada e
hiperparâmetros e um conjunto de teste reservado ou uma bateria de avaliações para a estimativa
final. Se exemplos da avaliação vazarem para o treinamento, a pontuação relatada poderá medir
memorização, não generalização. Os autores do GPT-3, por exemplo, documentaram sobreposição com
benchmarks e um bug de filtragem cuja correção por retreinamento seria cara demais.[^gpt3]

A **inferência** usa os pesos aprendidos sem atualizá-los. Prompts comuns, exemplos _few-shot_ na
janela de contexto, uso de ferramentas e geração aumentada por recuperação podem mudar a saída
imediata sem treinar o modelo. Essa diferença importa na operação: colocar um documento em um índice
de busca não o ensina aos pesos do modelo, e um prompt não cria um novo checkpoint.

## Pré-treinamento do zero

O **pré-treinamento** dá a um modelo capacidades amplamente reutilizáveis antes de sua adaptação a um
aplicativo específico. “Do zero” significa começar com pesos recém-inicializados e fazer escolhas
fundamentais como arquitetura, quantidade de parâmetros, tokenizador, tamanho do contexto, mistura
de dados e objetivo.

A maior parte do pré-treinamento de modelos de linguagem é **autossupervisionada**: os alvos são
derivados dos dados, e não escritos como rótulos por pessoas. Um modelo causal ou autorregressivo
prevê cada próximo token a partir dos anteriores, como nos modelos no estilo GPT.[^gpt3] Um modelo de
linguagem mascarado prevê tokens ocultos usando o contexto dos dois lados, como no BERT.[^bert]
Modelos codificador-decodificador podem reconstruir trechos corrompidos de propósito, como estudado
no T5.[^t5] O objetivo influencia o que a arquitetura faz naturalmente, mas a fronteira não é
absoluta; mais tarde, um modelo pré-treinado pode ser adaptado a muitas outras tarefas.

Treinar do zero oferece o maior controle e evita herdar dados desconhecidos ou restrições de outro
checkpoint. Também é a opção mais exigente. A equipe precisa obter e administrar um corpus grande,
treinar um tokenizador, estabilizar a otimização distribuída, realizar experimentos de escala e
avaliar checkpoints intermediários e finais. Um modelo maior nem sempre é o melhor uso de um
orçamento fixo: experimentos de escala ótima em processamento indicaram que o tamanho do modelo e a
quantidade de tokens de treinamento devem ser equilibrados, em vez de gastar quase todo o aumento de
processamento em parâmetros. Esses resultados são orientações empíricas para a família e a faixa de
modelos estudadas, não uma lei universal para toda arquitetura ou restrição de implantação.[^chinchilla]

A saída dessa etapa costuma ser chamada de **modelo-base**. Um modelo-base de linguagem pode
completar textos bem sem seguir de forma confiável instruções de uma conversa, pois prever o próximo
token em um corpus amplo não é o mesmo objetivo de atender a um pedido do usuário.

## Pré-treinamento continuado

O **pré-treinamento continuado** começa em um checkpoint existente e retoma um objetivo de
pré-treinamento sobre dados brutos ou pouco estruturados adicionais. A sigla **CPT** é usada tanto
para _continued pretraining_ quanto para _continual pretraining_; a terminologia varia. Rótulos
próximos incluem:

- **Pré-treinamento adaptativo de domínio** (DAPT), com material de uma área como medicina, direito
  ou programação.
- **Pré-treinamento adaptativo de tarefa** (TAPT), com texto não rotulado da distribuição ao redor
  de uma tarefa posterior.
- **Adaptação de idioma**, acrescentando muito mais dados no idioma-alvo.
- **Pré-treinamento contínuo**, incorporando novos dados periodicamente, em vez de recomeçar do zero.

Experimentos com o RoBERTa observaram que o pré-treinamento adaptativo de domínio e de tarefa
melhorou resultados posteriores em várias áreas, inclusive após um pré-treinamento inicial
amplo.[^dapt] O CPT pode ser útil quando há muitos dados brutos do domínio, mas poucos dados
rotulados de instruções. Em geral, ele muda todos ou muitos pesos do backbone e pode alterar as
representações subjacentes de forma mais profunda que um pequeno adaptador de tarefa.

O CPT custa menos que repetir todo o pré-treinamento anterior, mas ainda pode ser uma grande
execução sobre o modelo completo. Também exige um **equilíbrio entre plasticidade e retenção**:
concentrar-se em uma nova distribuição pode melhorá-la e prejudicar capacidades anteriores.
Reaquecer a taxa de aprendizado, repetir parte dos dados antigos e misturar com cuidado as
distribuições antiga e nova pode reduzir o esquecimento. Em experimentos com modelos de até dez
bilhões de parâmetros, reaquecer e reduzir novamente a taxa, junto com a repetição de dados,
igualou uma linha de base de retreinamento nas mudanças estudadas usando apenas uma fração do
processamento.[^continual-pretraining]

## Pós-treinamento e ajuste fino supervisionado

**Pós-treinamento** é um termo amplo para as etapas que transformam um modelo-base pré-treinado em um
modelo voltado a um produto ou tarefa. Pode incluir ajuste fino supervisionado, otimização por
preferências, aprendizado por reforço, ajuste de segurança, treinamento para ferramentas e
combinações desses métodos. O pós-treinamento geralmente usa muito menos exemplos que o
pré-treinamento, mas seus rótulos e objetivos têm efeito desproporcional no comportamento visto por
quem usa o modelo.

O **ajuste fino supervisionado** (_supervised fine-tuning_, **SFT**) treina um modelo pré-treinado em
exemplos rotulados de entrada e saída. Para um assistente, o exemplo costuma conter uma instrução ou
conversa seguida de uma resposta desejada. Durante o **teacher forcing**, o modelo recebe os
tokens-alvo anteriores corretos e é otimizado para prever o próximo. Algumas implementações mascaram a
perda nos tokens do usuário ou do prompt, de modo que somente os tokens do assistente
forneçam alvos.

O **ajuste por instruções** é SFT em muitas tarefas expressas como instruções em linguagem natural.
Nos experimentos FLAN, aumentar a variedade de tarefas e incluir exemplos de raciocínio melhorou o
desempenho com zero ou poucos exemplos.[^flan] O SFT pode ensinar formato de resposta, tom, sintaxe
de chamada de ferramentas, procedimento de tarefa e como expor capacidades já presentes no
modelo-base. Também pode especializar um modelo em novo conteúdo rotulado, mas um conjunto estreito
de demonstrações não substitui de forma confiável uma fonte de conhecimento atual e pesquisável.

A qualidade e a cobertura dos dados muitas vezes importam mais que a quantidade bruta de exemplos.
O estudo LIMA obteve bom seguimento de instruções com mil exemplos selecionados em um modelo-base
capaz de 65 bilhões de parâmetros, apoiando a hipótese de “alinhamento superficial” dos autores
naquela configuração experimental. O volume de dados necessário varia conforme o modelo-base, o
idioma, a política de segurança e a tarefa especializada.[^lima]

No **ajuste fino completo**, todos os pesos do modelo podem ser treinados. Isso dá liberdade máxima
ao otimizador e pode ser valioso para grandes mudanças de distribuição ou tarefas com muitos
recursos. Também exige gradientes e estados do otimizador para o modelo inteiro, produz um checkpoint
completo por variante e pode perturbar mais facilmente capacidades não relacionadas. Métodos
eficientes em parâmetros trocam parte dessa liberdade por requisitos muito menores de estado e
armazenamento.

## Ajuste fino eficiente em parâmetros

O **ajuste fino eficiente em parâmetros** (_parameter-efficient fine-tuning_, **PEFT**) congela a
maioria dos pesos pré-treinados e aprende um pequeno conjunto de parâmetros específico da tarefa. A
categoria inclui vários projetos:

- **Adaptadores** inserem pequenos módulos treináveis entre componentes congelados da rede.
  Experimentos iniciais com adaptadores para transformers chegaram perto do ajuste fino completo nas
  tarefas estudadas, acrescentando um pequeno conjunto de parâmetros por tarefa.[^adapters]
- **Prompts suaves** e **prefix tuning** aprendem vetores contínuos que condicionam um modelo
  congelado. Eles são otimizados por gradientes, ao contrário de prompts comuns escritos por
  pessoas.[^prefix-tuning]
- Métodos seletivos atualizam somente alguns parâmetros existentes, como vieses ou determinadas
  camadas.
- A **LoRA** representa mudanças nos pesos com matrizes de baixo posto.

O PEFT é especialmente útil quando uma organização precisa de muitas variantes do mesmo modelo-base.
O backbone compartilhado pode ser armazenado uma vez, enquanto cada tarefa, cliente ou estilo usa um
adaptador pequeno. Normalmente, o adaptador está vinculado ao checkpoint-base e à arquitetura exatos
em que foi treinado.

### LoRA

A **Adaptação de Baixo Posto** (_Low-Rank Adaptation_, **LoRA**) congela uma matriz de pesos
pré-treinada `W` e aprende sua atualização como produto de duas matrizes muito menores:[^lora]

```text
W_adapted = W + (alpha / r) BA
```

Se `W` tem largura de entrada `k` e largura de saída `d`, então `A` e `B` usam um posto intermediário
`r`, muito menor que `k` ou `d`. Os hiperparâmetros incluem posto, escala `alpha`, dropout,
módulos-alvo e camadas que recebem adaptadores. Um posto maior oferece um espaço mais amplo de
atualização, mas aumenta os parâmetros e a memória.

A LoRA reduz muito os parâmetros treináveis, o armazenamento de gradientes, os estados do otimizador
e o tamanho do checkpoint de cada variante. O artigo original relatou qualidade competitiva com o
ajuste fino completo nos modelos e tarefas testados, e a atualização aprendida pode ser fundida à
matriz-base para não acrescentar operações à inferência.[^lora] Mantê-la separada permite trocar
adaptadores, mas o sistema de serviço precisa administrar a combinação de base e adaptador.

A porcentagem de parâmetros treináveis não é a porcentagem do custo total de treinamento. Uma
execução LoRA ainda faz a passagem direta pelo backbone congelado e propaga gradientes por suas
ativações até alcançar adaptadores anteriores. Também precisa manter o backbone na memória. A LoRA
elimina principalmente os custos dos gradientes do backbone e dos estados do otimizador; os ganhos
reais de velocidade dependem de tamanho do lote, comprimento da sequência, módulos-alvo, kernels e
hardware. Uma atualização de baixo posto também pode ficar atrás do ajuste fino completo quando a
mudança necessária não cabe em seu espaço restrito.

### QLoRA

A **Adaptação Quantizada de Baixo Posto** (_Quantized Low-Rank Adaptation_, **QLoRA**) armazena o
backbone congelado em formato de poucos bits e faz a retropropagação por ele até parâmetros LoRA de
maior precisão. O método original usou um formato NormalFloat de 4 bits, quantização dupla das
constantes de quantização e otimizadores paginados para controlar picos de memória. Demonstrou o
ajuste fino de um modelo de 65 bilhões de parâmetros em uma GPU de 48 GB, preservando o desempenho
nas tarefas medido no estudo para o ajuste fino completo em 16 bits.[^qlora]

O principal benefício da QLoRA é caber na memória. O tempo total depende da desquantização durante a
execução e do suporte dos kernels, e a representação quantizada no treinamento não precisa ser a
mesma usada no serviço final. Os próprios pesos LoRA não são apenas “treinados em 4 bits”; o backbone
congelado é quantizado, enquanto o cálculo e as atualizações dos adaptadores usam maior precisão.
Assim como na LoRA, o resultado depende de um checkpoint-base compatível, a menos que a atualização
seja fundida e um novo checkpoint independente seja exportado.

## Otimização por preferências e aprendizado por reforço

Demonstrações especificam uma resposta-alvo, mas muitas qualidades de um assistente são mais fáceis
de expressar como comparação: a resposta A é mais útil, correta, segura ou adequada ao estilo que a
resposta B. O **treinamento por preferências** aprende com esses rankings. Preferências humanas são
necessariamente medidas dos avaliadores, da rubrica, dos prompts e das saídas candidatas
escolhidas, não uma definição universal de qualidade.

### RLHF e RLAIF

Uma receita comum de **aprendizado por reforço com feedback humano** (_reinforcement learning from
human feedback_, **RLHF**) tem três etapas:

1. Treinar uma política inicial com SFT.
2. Pedir a pessoas que ordenem respostas candidatas e treinar um **modelo de recompensa** para
   prever os rankings.
3. Gerar novas respostas e atualizar a política com um algoritmo de aprendizado por reforço,
   geralmente PPO, para aumentar a recompensa prevista sem se afastar demais de uma política de
   referência.

O trabalho InstructGPT usou esse pipeline de SFT, modelo de recompensa e PPO e constatou que
avaliadores humanos, em sua distribuição de prompts, preferiam o modelo alinhado de 1,3 bilhão de
parâmetros ao modelo-base GPT-3 de 175 bilhões. O mesmo estudo observou regressões em alguns
conjuntos públicos de NLP e misturou gradientes de pré-treinamento ao PPO para reduzir o
problema.[^instructgpt]

O RLHF é flexível e pode aprender com novas amostras geradas pela política, mas é complexo na
operação. Uma execução pode envolver modelos de política, referência, recompensa e valor; geração
repetida; inferência distribuída; e coleta contínua de dados humanos. Se a recompensa aprendida for
uma aproximação imperfeita, uma otimização agressiva poderá explorar seus erros. Uma penalidade de
divergência e avaliações independentes reduzem, mas não eliminam, esse risco de **exploração da
recompensa** ou otimização excessiva.

O **aprendizado por reforço com feedback de IA** (_reinforcement learning from AI feedback_,
**RLAIF**) substitui parte dos rankings humanos por avaliações de outro modelo. A IA Constitucional,
por exemplo, gerou críticas e revisões a partir de princípios escritos e depois usou preferências do
modelo como sinal de recompensa em uma etapa de RL.[^constitutional-ai] Isso permite ampliar o
feedback e deixar a rubrica explícita, mas pode reproduzir vieses, pontos cegos e erros
correlacionados do modelo avaliador. A supervisão humana foi reduzida, não se tornou desnecessária.

### DPO

A **Otimização Direta de Preferências** (_Direct Preference Optimization_, **DPO**) treina uma
política diretamente em pares de respostas escolhidas e rejeitadas. Sua perda aumenta a
probabilidade da resposta escolhida em relação à rejeitada e a uma política fixa de referência. A
derivação original reparametrizou o objetivo comum de RLHF limitado por divergência KL, dispensando
um modelo de recompensa separado e um ciclo on-line de aprendizado por reforço.[^dpo]

A DPO é mais simples e geralmente mais barata de implementar que o RLHF baseado em PPO, pois usa um
objetivo off-line semelhante a classificação. Não é gratuita: o treinamento avalia as duas
respostas, mantém ou pré-calcula as log-probabilidades de referência e ainda exige um bom conjunto de
preferências. Durante a execução, não pode explorar além da cobertura desse conjunto, e seu
parâmetro de equilíbrio, distribuição de amostragem, ruído nos rótulos e comprimento das respostas
podem alterar muito o resultado.

### Recompensas verificáveis e de processo

Em matemática, programação, jogos e agentes que usam ferramentas, um programa ou ambiente às vezes
consegue verificar o resultado. O aprendizado por reforço com essas recompensas baseadas em regras
evita rótulos subjetivos na parte verificável da tarefa e pode gerar muitas tentativas de
trajetórias.

A **Otimização de Política Relativa ao Grupo** (_Group Relative Policy Optimization_, **GRPO**) é um
algoritmo relacionado ao PPO apresentado no trabalho DeepSeekMath. Ele amostra um grupo de saídas
para um prompt e estima suas vantagens relativas pelas recompensas do grupo, em vez de treinar um
modelo crítico separado, reduzindo a memória usada pelo PPO naquela implementação.[^deepseekmath]
Ainda é um método de RL com rollouts: amostrar grupos, executar verificadores ou modelos de
recompensa e manter cálculos da política de referência pode custar caro.

O DeepSeek-R1 relatou que o RL em grande escala com recompensas baseadas em regras provocou
comportamentos de raciocínio, mas também observou que uma versão anterior, treinada apenas com RL,
tinha problemas de legibilidade e mistura de idiomas, o que motivou dados iniciais e uma receita em
várias etapas.[^deepseek-r1]

A **supervisão de resultado** pontua a resposta final; a **supervisão de processo** pontua etapas
intermediárias. Em um subconjunto do benchmark MATH, um modelo de recompensa com supervisão de
processo superou outro com supervisão de resultado ao escolher soluções, mas exigiu rótulos por
etapa. O estudo treinou verificadores e os usou na seleção, sem aplicar RL ao gerador; ele comparou a
seleção de soluções por verificadores, e não a otimização de políticas por processo e por
resultado.[^process-supervision]

## Destilação de conhecimento

A **destilação de conhecimento** treina um modelo **aluno** para imitar um modelo **professor**. O
aluno costuma ser menor ou mais barato de servir. Em vez de aprender apenas com rótulos rígidos da
verdade de referência, pode aprender com a distribuição de probabilidades do professor, seus logits,
representações ocultas, sequências geradas, explicações ou uma mistura de alvos do professor com os
dados originais. Alvos probabilísticos mais suaves podem comunicar quais respostas erradas o
professor considera semelhantes, fornecendo mais informação que um único rótulo de
classe.[^distillation]

Na **destilação de caixa branca**, o treinamento pode acessar logits ou estados internos do
professor. Na **destilação de caixa preta**, o professor pode ser uma API que fornece apenas saídas
geradas; o conjunto resultante de imitação de respostas também pode se parecer com SFT comum. A
destilação no nível da sequência treina com sequências geradas pelo professor, abordagem estudada
originalmente para tradução automática neural.[^sequence-distillation]

A destilação troca inferências repetidas por um projeto inicial de geração com o professor e
treinamento do aluno. Um aluno bem-sucedido pode reduzir latência, memória, energia e custo de
serviço e pode ser especializado em uma tarefa estreita. O custo é um teto menor de
capacidade e dependência da cobertura do professor. O aluno pode herdar erros e vieses, falhar em
comportamentos ausentes do conjunto de transferência ou aprender o estilo superficial sem a
competência geral do professor. O DistilBERT é um exemplo inicial concreto: seus autores relataram
um modelo 40% menor e 60% mais rápido que o BERT, preservando 97% do desempenho de compreensão de
linguagem medido nos experimentos.[^distilbert]

Destilação é diferente de **quantização**, que representa números com menos bits, e de **poda**, que
remove pesos ou estruturas. Um pipeline de compressão pode combinar os três e depois retreinar o
modelo comprimido.

## Dados e supervisão

O conjunto de dados faz parte da especificação do treinamento; não é um combustível intercambiável.
Sua mistura determina quais idiomas, domínios, estilos, valores e erros são recompensados
repetidamente. Operações importantes incluem escolha de fontes, análise, filtragem, avaliação de
qualidade, remoção de duplicatas, descontaminação, balanceamento, tokenização e documentação da
procedência e dos usos permitidos.

Duplicatas desperdiçam processamento, distorcem o peso das fontes, aumentam a memorização e podem
vazar exemplos de avaliação. Um estudo de grande porte observou que remover duplicatas reduziu a
memorização literal e a sobreposição entre treinamento e teste, alcançando acurácia semelhante ou melhor
em menos etapas.[^deduplication] Informações pessoais identificáveis, segredos, conteúdo inseguro,
restrições de direitos autorais e licenças de dados criam questões próprias de governança que uma
perda baixa de treinamento não responde.

Dados escritos por pessoas custam caro e levam tempo, mas podem codificar conhecimento especializado
ausente em texto bruto. Dados sintéticos podem ampliar a cobertura por pouco custo: o Self-Instruct,
por exemplo, gerou e filtrou instruções e respostas antes de usá-las no ajuste por
instruções.[^self-instruct] Dados sintéticos não criam uma fonte independente de verdade. Sua
utilidade depende da qualidade do professor, variedade, filtragem, verificação e da quantidade de
apoio em sinais humanos ou ambientais confiáveis.

## Custos do treinamento

Não existe um único “custo para treinar um modelo”. Uma estimativa confiável especifica checkpoint,
objetivo, quantidade de tokens ou exemplos, comprimento da sequência, precisão, hardware,
utilização, quantidade de tentativas e se o trabalho com dados, avaliação e mão de obra está
incluído.

### Processamento

Para um transformer denso somente decodificador, uma estimativa aproximada comum para uma execução
de pré-treinamento é:

```text
training FLOPs ~= 6 x parameters x training tokens
```

O fator aproxima uma passagem direta e reversa pelas principais multiplicações de matrizes. Ele pode
errar no cálculo de atenção, embeddings, camadas de saída, modelos ativados de forma esparsa e certas
configurações pequenas ou de contexto longo; por isso, é preferível contabilizar FLOPs de acordo com
a arquitetura.[^chinchilla][^deepseek-llm]

Por essa regra, treinar um modelo denso de 7 bilhões de parâmetros em 1 trilhão de tokens exige
aproximadamente `4.2 x 10^22` operações de ponto flutuante, antes do custo adicional do sistema. O
total de horas de acelerador é aproximadamente o total de FLOPs dividido pelos FLOPs sustentados por
acelerador e por 3.600; o tempo total de execução é então dividido pelo número de aceleradores. O pico
de
desempenho do hardware não é o desempenho sustentado no treinamento. Comunicação, espera por dados,
checkpoints, recomputação de ativações, falhas e lotes incompletos reduzem a utilização.

Execuções publicadas ilustram a escala, mas não definem um preço universal. O treinamento final do
modelo BLOOM de 176 bilhões de parâmetros levou 1.082.990 horas de GPU A100 ao longo de cerca de 118
dias e consumiu 433.196 kWh. Esses valores excluem boa parte dos experimentos anteriores e da mão de
obra do projeto.[^bloom-carbon] Com uma taxa hipotética combinada de US$ 3 por hora de GPU, apenas o
tempo dos dispositivos na execução final corresponderia a cerca de US$ 3,25 milhões; a multiplicação
é uma ilustração, não a conta relatada do BLOOM nem uma cotação atual de mercado.

Em contraste, os experimentos originais de QLoRA incluíram uma adaptação de um modelo de 65 bilhões
de parâmetros concluída em 24 horas em uma única GPU de 48 GB.[^qlora] Os números não são
diretamente comparáveis: um criou um modelo-base a partir de um corpus enorme; o outro adaptou uma
base existente em um conjunto muito menor.

### Memória e sistemas

O treinamento completo precisa comportar pesos, gradientes, estados do otimizador e ativações
salvas. O Adam normalmente mantém duas estimativas de momento para cada parâmetro treinável; assim,
o estado do otimizador pode ocupar mais memória que os próprios pesos. O treinamento com precisão
mista executa grande parte dos cálculos em um formato de precisão menor e preserva alguns valores em
maior precisão para obter velocidade, capacidade e estabilidade numérica.[^mixed-precision]

Quando um único acelerador não comporta a execução, sistemas distribuídos combinam várias
estratégias:

- **Paralelismo de dados** fornece lotes diferentes aos dispositivos e sincroniza gradientes.
- **Paralelismo de tensores** divide operações dentro de uma camada.
- **Paralelismo de pipeline** coloca camadas ou blocos diferentes em dispositivos diferentes.
- **Particionamento**, como ZeRO, distribui estados do otimizador, gradientes e, possivelmente,
  parâmetros que, sem isso, seriam replicados.[^zero]
- **Checkpointing de ativações** armazena menos ativações intermediárias e as recalcula na
  retropropagação, trocando processamento por memória.

Esses métodos permitem execuções maiores, mas acrescentam tráfego de rede, tempo ocioso, complexidade
de implementação e novos modos de falha. Paralelismo de tensores, pipeline e dados têm custos
diferentes de comunicação e utilização; sistemas práticos de grande escala combinam os
três.[^megatron]

O PEFT elimina grande parte do estado treinável, mas não o backbone congelado nem todas as ativações.
A QLoRA reduz ainda mais a representação do backbone na memória. Sequências mais longas ainda podem
dominar a memória das ativações, e mudar o tamanho do lote ou o acúmulo de gradientes para caber na
memória altera a velocidade e o comportamento da otimização.

### Custos além da execução principal

A conta visível dos aceleradores é apenas parte de um programa de treinamento:

- Obter, limpar, licenciar, armazenar, tokenizar e administrar dados exige processamento e trabalho
  humano.
- Demonstrações especializadas, rankings de preferências e rótulos de processo podem custar mais que
  uma execução curta de PEFT.
- Execuções-piloto, falhas, ablações, buscas de hiperparâmetros, testes de segurança e avaliações de
  regressão podem consumir várias vezes os recursos da receita final.
- O treinamento distribuído acrescenta redes, orquestração, armazenamento de checkpoints e trabalho
  de engenharia.
- A destilação paga pela inferência do professor e pelo treinamento do aluno em troca de um custo
  futuro menor no serviço.
- Uso de eletricidade, refrigeração, fabricação do hardware e matriz energética afetam o custo
  ambiental; apenas os FLOPs do modelo não determinam as emissões.[^bloom-carbon]

## Comparação de vantagens e limitações

A comparação a seguir pressupõe a mesma família geral de modelos. A “carga” é qualitativa; tamanho do
conjunto de dados, comprimento da sequência, hardware e implementação podem inverter a ordem de duas
execuções específicas.

| Método                  | Sinal comum                                    | Pesos geralmente atualizados                      | Carga de treinamento             | Principal custo ou limitação                                                                  |
| ----------------------- | ---------------------------------------------- | ------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| Pré-treinamento do zero | Previsão de dados brutos                       | Todo o novo modelo                                | Muito alta                       | Controle máximo e capacidade ampla pelo maior custo de dados e sistemas                       |
| CPT                     | Dados brutos adicionais de um domínio          | Em geral, maioria ou todos os pesos do backbone   | Alta                             | Adaptação profunda sem recomeçar, mas a retenção pode piorar                                  |
| SFT completo            | Demonstrações ou rótulos                       | Todos os pesos                                    | Média                            | Liberdade máxima de adaptação, com muita memória e uma variante completa por tarefa           |
| SFT com LoRA            | Demonstrações ou rótulos                       | Adaptadores de baixo posto                        | Baixa a média                    | Checkpoints e estados pequenos, mas espaço de atualização restrito                            |
| SFT com QLoRA           | Demonstrações ou rótulos                       | Adaptadores sobre uma base quantizada e congelada | Pouca memória do dispositivo     | Permite usar bases maiores, mas pode não maximizar a velocidade                               |
| DPO                     | Pares escolhidos e rejeitados                  | Todos os pesos ou parâmetros PEFT                 | Média                            | Treinamento off-line simples, limitado pela cobertura dos pares                               |
| RLHF ou RLAIF com PPO   | Recompensa aprendida e rollouts gerados        | Política, com modelos de apoio                    | Alta e operacionalmente complexa | Exploração on-line e recompensas flexíveis, com riscos de aproximação e estabilidade          |
| Destilação              | Probabilidades, estados ou saídas do professor | Modelo aluno                                      | Média a alta no início           | Paga uma vez para reduzir o custo de implantação, geralmente perdendo amplitude ou capacidade |

Os métodos também diferem no que otimizam. O pré-treinamento constrói principalmente capacidade
estatística; o SFT por instruções molda como essa capacidade é solicitada e expressa; a otimização
por preferências escolhe entre comportamentos plausíveis; e a destilação transfere uma parte
escolhida do comportamento para outro modelo. Etapas posteriores não conseguem corrigir de forma
confiável uma capacidade ausente na base apenas dando ao modelo um novo tom ou sinal de preferência.

## Escolha do método

A intervenção adequada depende do problema:

| Objetivo                                                                           | Ponto de partida provável                                |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Criar nova arquitetura, tokenizador ou modelo fundacional de capacidade ampla      | Pré-treinamento do zero                                  |
| Acrescentar idioma, distribuição de domínio ou grande volume de material bruto     | CPT, seguido de pós-treinamento específico se necessário |
| Ensinar instruções estáveis, esquemas de saída, estilo ou tarefa delimitada        | SFT                                                      |
| Produzir muitas variantes baratas de um modelo-base                                | LoRA ou outro método PEFT                                |
| Fazer a adaptação de um modelo grande caber em pouca memória de acelerador         | QLoRA                                                    |
| Aprender rankings subjetivos de um conjunto off-line existente                     | DPO ou outro objetivo direto de preferência              |
| Otimizar comportamento interativo ou gerar novas tentativas segundo uma recompensa | RLHF, RLAIF ou RL com recompensa verificável             |
| Implantar um modelo menor e mais rápido com grande volume de solicitações          | Destilação, possivelmente com poda e quantização         |
| Fornecer fatos que mudam sempre, citações ou documentos privados                   | Recuperação ou ferramentas antes de treinar pesos        |

Um pipeline de produção pode combinar várias linhas. Um assistente de domínio pode receber CPT em
documentos técnicos não rotulados, SFT com QLoRA em demonstrações de especialistas, DPO em pares de
preferência e recuperação para fatos atuais. Cada etapa deve ser justificada por uma avaliação que
mostre por que a opção anterior, mais barata, não bastou.

## Avaliação e modos de falha

Uma execução só termina quando seus efeitos e regressões são medidos. A avaliação deve comparar o
novo checkpoint com o modelo-base e com linhas de base relevantes que não envolvam treinamento,
incluindo um bom prompt ou sistema de recuperação. Grupos úteis de testes incluem:

- exemplos reservados no domínio e entradas com mudanças realistas de distribuição;
- capacidades gerais que devem ser mantidas;
- seguimento de instruções, formatação e correção no uso de ferramentas;
- factualidade, calibração, robustez, privacidade e propriedades de segurança relevantes;
- latência, vazão, pico de memória, tamanho do checkpoint e custo total de serviço;
- recortes por idioma, grupo demográfico, fonte, dificuldade da tarefa e comprimento da sequência.

Modos comuns de falha incluem sobreajuste a um conjunto pequeno, esquecimento catastrófico,
exploração da recompensa, verbosidade ou viés de estilo nos dados de preferência, contaminação de
benchmarks, memorização de material privado ou protegido, instabilidade numérica e incompatibilidade
entre treinamento e serviço. LoRA e QLoRA não impedem vazamento de dados apenas porque poucos
parâmetros mudam, e a queda da perda de preferência não prova que pessoas vão preferir o modelo em
novos prompts.

Um relato reproduzível registra o checkpoint-base exato, versões e mistura dos dados, tokenizador,
templates, objetivo, módulos treináveis, precisão e sistema de quantização, otimizador e cronograma,
sementes aleatórias, hardware, quantidades de tokens e exemplos, regra de parada e código de
avaliação. Sem essas informações, o nome de um método — “LoRA”, “DPO” ou “CPT” — descreve apenas uma
pequena parte do que realmente foi treinado.

## Referências

[^adam]: [Adam: A Method for Stochastic Optimization](https://arxiv.org/abs/1412.6980).

[^gpt3]: [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165).

[^bert]: [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://arxiv.org/abs/1810.04805).

[^t5]: [Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer](https://arxiv.org/abs/1910.10683).

[^chinchilla]: [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556).

[^dapt]: [Don't Stop Pretraining: Adapt Language Models to Domains and Tasks](https://arxiv.org/abs/2004.10964).

[^continual-pretraining]: [Simple and Scalable Strategies to Continually Pre-train Large Language Models](https://arxiv.org/abs/2403.08763).

[^flan]: [Scaling Instruction-Finetuned Language Models](https://arxiv.org/abs/2210.11416).

[^lima]: [LIMA: Less Is More for Alignment](https://arxiv.org/abs/2305.11206).

[^adapters]: [Parameter-Efficient Transfer Learning for NLP](https://arxiv.org/abs/1902.00751).

[^prefix-tuning]: [Prefix-Tuning: Optimizing Continuous Prompts for Generation](https://arxiv.org/abs/2101.00190).

[^lora]: [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685).

[^qlora]: [QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314).

[^instructgpt]: [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155).

[^constitutional-ai]: [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073).

[^dpo]: [Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290).

[^deepseekmath]: [DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models](https://arxiv.org/abs/2402.03300).

[^deepseek-r1]: [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948).

[^process-supervision]: [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050).

[^distillation]: [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531).

[^sequence-distillation]: [Sequence-Level Knowledge Distillation](https://arxiv.org/abs/1606.07947).

[^distilbert]: [DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter](https://arxiv.org/abs/1910.01108).

[^deduplication]: [Deduplicating Training Data Makes Language Models Better](https://arxiv.org/abs/2107.06499).

[^self-instruct]: [Self-Instruct: Aligning Language Models with Self-Generated Instructions](https://arxiv.org/abs/2212.10560).

[^deepseek-llm]: [DeepSeek LLM: Scaling Open-Source Language Models with Longtermism](https://arxiv.org/abs/2401.02954).

[^bloom-carbon]: [Estimating the Carbon Footprint of BLOOM, a 176B Parameter Language Model](https://arxiv.org/abs/2211.02001).

[^mixed-precision]: [Mixed Precision Training](https://arxiv.org/abs/1710.03740).

[^zero]: [ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054).

[^megatron]: [Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM](https://arxiv.org/abs/2104.04473).
