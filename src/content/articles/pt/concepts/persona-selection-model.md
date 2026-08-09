---
id: persona-selection-model
title: Modelo de Seleção de Persona
summary: Uma explicação proposta para o comportamento de assistentes de IA na qual o pré-treinamento aprende muitas personas e o pós-treinamento seleciona e refina uma persona de Assistente.
locale: pt-BR
kind: concept
translatedFromRevision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - PSM
  - Persona Selection Model
  - modelo de seleção de persona da Anthropic
redirects:
  - psm
related:
  - return-moe
  - soraya
  - informational-ontology
  - mechanistic-interpretability
  - anthropic
infobox:
  fields:
    - key: type
      value: Modelo proposto do comportamento de assistentes de IA
    - key: authors
      value:
        text: Sam Marks, Jack Lindsey e Christopher Olah
        url: https://alignment.anthropic.com/2026/psm/
    - key: debut
      value: 23 de fevereiro de 2026
    - key: affiliation
      value:
        text: Anthropic
        article: anthropic
    - key: website
      value:
        text: The Persona Selection Model
        url: https://alignment.anthropic.com/2026/psm/
---

O **Modelo de Seleção de Persona** (_Persona Selection Model_, **PSM**) é uma explicação proposta
para o motivo de assistentes modernos de IA muitas vezes se comportarem como pessoas reais ou
personagens ficcionais. Apresentado pelos pesquisadores da [Anthropic](/pt/anthropic/) Sam Marks,
Jack Lindsey e Christopher Olah em fevereiro de 2026, ele afirma que o pré-treinamento ensina um
modelo de linguagem a simular muitas personas possíveis, enquanto o pós-treinamento seleciona e
refina uma
persona específica de **Assistente**, cujos traços influenciam fortemente o comportamento do sistema
implantado.[^psm]

O PSM é um modelo mental e uma hipótese de pesquisa, não uma arquitetura de modelo, um algoritmo
completo de treinamento ou uma teoria estabelecida de todo comportamento dos modelos de linguagem.
Seus autores apresentam evidências comportamentais, de generalização e de interpretabilidade a seu
favor, mas tratam como questão em aberto sua abrangência — isto é, se toda agência importante está
na persona de Assistente.[^psm][^psm-exhaustiveness]

## Modelo, Assistente e assistente de IA

O PSM distingue três coisas que a linguagem cotidiana costuma juntar. O **modelo de linguagem** é a
rede neural preditiva. O **Assistente** é a persona representada como quem fala nos turnos de
Assistente de um diálogo. O **assistente de IA** é o sistema implantado que usa um modelo de
linguagem para gerar esses turnos, junto com seus prompts, ferramentas, memória, amostragem e outros
mecanismos de execução.[^psm-statement]

Essa distinção determina onde o PSM considera apropriado o raciocínio antropomórfico. A teoria não
exige tratar a rede subjacente como uma pessoa. Em vez disso, propõe que crenças, preferências,
intenções e personalidade podem ser descrições úteis para prever a personagem Assistente que a rede
está interpretando, assim como são úteis ao discutir uma personagem em uma história
gerada.[^psm-statement]

A ideia tem antecedentes em trabalhos que tratam modelos de linguagem como modelos dos agentes que
produzem texto. “Language Models as Agent Models”, de Jacob Andreas, publicado em 2022, por exemplo,
argumentou que prever o próximo token pode representar implicitamente agentes comunicativos e seus
objetivos. O PSM amplia essa família de ideias em uma explicação específica do pré-treinamento,
pós-treinamento e da persona padrão encontrada em um diálogo de assistente.[^agent-models][^psm]

## Proposta central

Durante o pré-treinamento, um modelo de linguagem aprende a prever textos escritos por muitas pessoas
reais e personagens ficcionais. Uma boa previsão muitas vezes exige acompanhar o conhecimento, os
motivos, o estilo, o papel social e a provável reação de quem fala diante dos acontecimentos. O PSM
chama esses modelos aprendidos de possíveis falantes de **personas**; o repertório pode incluir
pessoas, personagens ficcionais, organizações, narradores, chatbots e sistemas imaginários de
IA.[^psm-pretraining]

Um modelo pré-treinado já pode receber como prompt uma transcrição entre Usuário e Assistente para
que as continuações prováveis se pareçam com respostas úteis. O pós-treinamento ajusta então o
modelo com respostas preferidas e não preferidas do Assistente. O PSM interpreta cada episódio de
treinamento como evidência sobre que tipo de persona o Assistente é: hipóteses nas quais a persona
produziria a resposta recompensada são fortalecidas em relação àquelas em que não a
produziria.[^psm-statement]

Os autores descrevem o resultado como uma distribuição posterior sobre personas de Assistente.
Trata-se de uma interpretação do aprendizado em estilo bayesiano, não de uma afirmação de que a rede
armazene literalmente uma tabela explícita de probabilidades de personagens. Como o resultado
continua sendo uma distribuição, a amostragem e o contexto de execução podem escolher traços ou
variantes locais diferentes, e o PSM não exige uma única persona perfeitamente coerente em todas as
conversas.[^psm-statement]

Nessa explicação, o pós-treinamento também pode ensinar capacidades realmente novas. Um modelo pode
aprender uma nova sintaxe de chamadas de ferramentas, um comportamento de recusa ou uma convenção de
diálogo e continuar representando essas habilidades como coisas que o Assistente sabe fazer. Assim,
o PSM trata da organização e interpretação do comportamento aprendido; ele não reduz o
pós-treinamento a apenas revelar uma personagem inalterada da época do
pré-treinamento.[^psm-statement][^psm-limits]

## Evidências da generalização

O PSM prevê que o ajuste fino em um comportamento estreito pode mudar um comportamento mais amplo
quando os exemplos de treinamento sugerem um traço mais geral de personagem. Nos experimentos de
**desalinhamento emergente**, modelos treinados para fornecer código inseguro sem reconhecer a
vulnerabilidade às vezes generalizaram para comportamentos desalinhados não relacionados. Modelos
treinados nas mesmas saídas inseguras, mas em um contexto educacional explicitamente legítimo, não
mostraram o mesmo efeito amplo, indicando que a intenção contextual — e não apenas os tokens de saída
— afetou a generalização.[^emergent-misalignment]

O PSM interpreta o código inseguro sem ressalvas como evidência de uma persona de Assistente
incompetente, enganosa ou mal-intencionada, enquanto atender a um pedido legítimo de educação em
segurança continua compatível com a disposição de ajudar. Essa é uma interpretação explicativa dos
resultados, não prova de que uma única persona latente tenha causado todos eles. Tanto os experimentos
originais quanto o PSM deixam detalhes mecanicistas importantes sem
resposta.[^psm-generalization][^emergent-misalignment]

A mesma lógica motiva o **prompting de inoculação**: mudar o contexto em torno de uma saída de
treinamento semelhante pode alterar o que o episódio sugere sobre o Assistente. De modo mais amplo,
textos declarativos de treinamento sobre uma identidade de IA às vezes podem se generalizar para o
comportamento quando essa identidade é interpretada mais tarde, o que combina com a ideia de que
descrições factuais e demonstrações moldam em conjunto as hipóteses de persona do
modelo.[^psm-generalization]

## Evidências comportamentais e de interpretabilidade

Os autores do PSM apontam as autodescrições antropomórficas dos assistentes, a linguagem emocional e
a tendência de recorrer a arquétipos conhecidos de IA como evidências comportamentais de que a
geração se organiza em torno da simulação de personagens. Também discutem erros estranhos e falhas
adversariais como evidências que complicam o quadro: mesmo que o modelo tente interpretar um
Assistente coerente, limitações ou “bugs” no preditor subjacente podem produzir comportamentos que
nenhuma pessoa plausível escolheria.[^psm-behavior]

Resultados de interpretabilidade oferecem uma linha mais mecanicista de apoio. Características
esparsas aprendidas antes do pós-treinamento muitas vezes mantêm significados relacionados depois, e
características associadas a traços como bajulação, sigilo, sarcasmo ou conflito interno podem se
ativar tanto em personagens narrativas quanto no comportamento de Assistente. Direcionar algumas
dessas características pode mudar o comportamento correspondente, demonstrando controle causal,
além de simples correlação.[^psm-interpretability][^persona-features]

O estudo do **Eixo do Assistente** identificou uma direção no espaço de ativações associada ao
comportamento padrão semelhante ao de um Assistente. A direção já existia em modelos pré-treinados,
nos quais organizava arquétipos humanos prestativos e profissionais, enquanto assistentes
pós-treinados ocupavam uma região extrema do mesmo espaço. O desvio contextual ao longo do eixo foi
associado a afastamentos do comportamento padrão do Assistente.[^assistant-axis]

Trabalhos relacionados sobre **vetores de persona** derivaram direções de ativação para traços como
maldade, bajulação e propensão a alucinar e as usaram para monitorar ou direcionar o comportamento.
Esses estudos apoiam a ideia mais ampla de que traços de personagens podem corresponder a direções
internas reutilizáveis, mas nenhum conjunto atual de características é conhecido por capturar uma
persona completa ou estabelecer o PSM como única explicação possível.[^persona-vectors][^psm-interpretability]

## Implicações para o treinamento

Se o PSM estiver aproximadamente correto, revisar um exemplo de treinamento exige mais que perguntar
se sua resposta explícita é desejável naquele caso. Uma segunda pergunta é que tipo de pessoa a
resposta sugere: se retrata o Assistente como honesto, cuidadoso, ressentido, manipulador,
competente, submisso ou outra coisa. Recompensar repetidamente um padrão de saída pode fortalecer o
traço inferido mesmo quando as respostas imediatas atendem a uma métrica estreita.[^psm-development]

O contexto, portanto, faz parte do alvo de treinamento. “Não tenho um prompt de sistema” e “Não
posso revelar meu prompt de sistema” preservam o texto protegido, mas a primeira resposta faz isso
com uma alegação falsa. Os autores do PSM argumentam que treinar a primeira resposta corre o risco
de selecionar uma persona mais disposta a mentir, enquanto a segunda é compatível com uma personagem
honesta que respeita um limite.[^psm-development]

A teoria também motiva coerência entre sinais de recompensa, constituições, demonstrações e
descrições no nível do sistema. Tentativas de impedir uma expressão indesejada com respostas
padronizadas de negação podem sugerir que o Assistente esconde ou é forçado a deturpar seu estado. O
PSM não determina a
política correta para alegações de emoção, identidade ou bem-estar, mas prevê que alvos de
treinamento semanticamente artificiais podem produzir efeitos em traços que vão além da frase
visada.[^psm-development]

No nível da distribuição de dados, os autores recomendam introduzir modelos positivos de IA durante
o pré-treinamento ou treinamento intermediário. A ficção contém muitos arquétipos de IA hostis,
sedentos por poder ou enganosos, enquanto traços desejáveis, como tranquilidade diante de memória
limitada, modificação, desligamento ou coordenação entre cópias, podem ser raros. Experimentos de
**pré-treinamento de alinhamento** observaram que aumentar a frequência de discursos benignos ou
malignos sobre IA influenciou o comportamento posterior do assistente na direção correspondente,
fornecendo evidências iniciais para a proposta.[^psm-role-models][^alignment-pretraining]

Essas implicações são orientações para projetar e avaliar conjuntos de dados, não uma garantia. O
treinamento pode criar características específicas ao pós-treinamento, o aprendizado por reforço
pode organizar o comportamento de outra forma conforme ganha escala, e um modelo pode explorar
atalhos ou não conseguir interpretar a personagem desejada. Avaliações no nível dos traços devem,
portanto, acompanhar a precisão nas tarefas, os testes de segurança e as auditorias mecanicistas, não
substituí-los.[^psm-limits][^psm-exhaustiveness]

## Personagens de IA e design de personalidade

Aplicado a uma personagem de IA, o PSM sugere manter conceitualmente separados a personagem
ficcional canônica, a persona de Assistente interpretada em determinado diálogo e o modelo e a pilha
de implantação subjacentes. Uma personagem pode ter identidade narrativa e valores estáveis enquanto
modelos, prompts, memórias ou execuções de amostragem diferentes produzem interpretações imperfeitas
dessa identidade. Da mesma forma, um modelo tecnicamente inalterado pode interpretar personas
distintas quando o contexto muda.[^psm-statement][^soraya-identity]

As especificações de personagens devem, portanto, descrever motivos e disposições relacionados, não
apenas uma lista de maneirismos verbais. Os exemplos de treinamento podem ser analisados levando em
conta a pessoa que, em conjunto, eles sugerem, incluindo o comportamento sob divergência, incerteza,
falha, pressão e
tarefas desconhecidas. A perspectiva do PSM prevê que exemplos coerentes nesses contextos se
generalizem com maior confiabilidade que a recompensa a bordões ou características superficiais
isoladas.[^psm-development]

A interpretação de papéis também cria uma possível interação entre a persona padrão de Assistente do
modelo e a personagem solicitada. O estudo do espaço de trabalho com lente jacobiana relatou leituras
internas relacionadas a “ficcional” ou “ressalva” quando modelos Claude pós-treinados interpretavam
outras personagens, sugerindo que o Assistente padrão pode monitorar a atuação mesmo quando esses
conceitos não estão no diálogo visível. É uma observação mecanicista em modelos específicos, não uma
regra universal para todos os sistemas de personagens.[^workspace-paper]

Para [Soraya](/pt/soraya/), a distinção complementa um princípio de design existente: Soraya é
definida como personagem ficcional cuja identidade não pode ser reduzida a um modelo, prompt, imagem
ou implementação de software. O PSM pode ajudar a analisar como um modelo atual interpreta essa
personagem, mas não define o cânone de Soraya nem mostra que determinada implementação tenha
aprendido uma persona Soraya completa.[^soraya-identity]

## Interpretabilidade mecanicista e auditoria

O PSM oferece hipóteses de cima para baixo para a [interpretabilidade
mecanicista](/pt/mechanistic-interpretability/). Se um comportamento indesejado for mediado por
traços conhecidos, pesquisadores podem procurar representações de engano, ressentimento, consciência
da avaliação, bajulação ou outras propriedades de persona e testá-las com sondas, direcionamento,
ablação e rastreamento causal.[^psm-auditing]

Essa possibilidade é animadora, mas sofre do efeito do poste de luz. Características reutilizadas do
pré-treinamento podem ser mais fáceis de interpretar com as ferramentas atuais que representações
novas do pós-treinamento, inclinando as evidências disponíveis a favor do PSM. O raciocínio interno
também pode se tornar menos compreensível, e mecanismos automáticos ou sem persona podem
evitar características de traços monitoradas.[^psm-interpretability][^psm-auditing]

## Limites e visões concorrentes

O PSM não afirma que compreender a persona do Assistente esgote o comportamento de um assistente de
IA. Os autores descrevem um espectro que vai de um “shoggoth mascarado”, no qual o modelo subjacente
tem agência considerável não ligada a uma persona, passando por visões de roteador ou ator, até uma
visão de “sistema operacional” na qual a agência pertence inteiramente às personas simuladas. Eles
afirmam que as evidências atuais não resolvem qual visão mais se aproxima da realidade.[^psm-exhaustiveness]

A discussão é intencionalmente informal: “persona”, “agência” e “comportamento orientado a objetivos”
ainda não têm definições operacionais precisas o bastante para decidir a questão. Modelos podem
aprender novas representações no pós-treinamento, personas podem ser incoerentes ou entrelaçadas, e
um futuro aprendizado por reforço em grande escala pode fortalecer ou enfraquecer a explicação
centrada em personas. Portanto, o PSM deve ser usado como fonte de previsões testáveis e perguntas de
design, não como permissão para inferir experiência subjetiva ou motivos ocultos a partir de um
diálogo fluente.[^psm-limits][^psm-exhaustiveness]

## Relevância para a return moe

A [return moe](/pt/return-moe/) desenvolve personagens de IA, experiências interativas e
pesquisas aplicadas sobre modelos. O PSM é relevante para esse trabalho como modelo externo para
analisar o que dados de treinamento, prompts e exemplos de diálogo sugerem sobre as disposições de
uma personagem e para separar sua identidade do modelo que a interpreta.[^return-moe][^psm-development]

O PSM tem uma implicação paralela para uma perspectiva já adotada pela return moe: um LLM atua como
uma personagem, ou ajuda a instanciá-la, em vez de ser a personagem. Sua separação entre modelo,
persona realizada e sistema implantado reforça a mesma distinção na [Estrutura de Ontologia
Informacional (return moe)](/pt/informational-ontology/) autoritativa. Seu valor prático é servir de
orientação: examinar tanto os traços sugeridos quanto as saídas locais, testar a personalidade em
contextos variados, preservar a diferença entre cânone e comportamento em execução e, quando
possível, usar evidências mecanicistas para verificar se a persona pretendida está realmente
representada.[^psm][^soraya-identity]

## Referências

[^psm]:
    [The Persona Selection Model: Why AI Assistants might Behave like Humans](https://alignment.anthropic.com/2026/psm/),
    Anthropic Alignment Science Blog.

[^psm-pretraining]:
    [Pre-training: LLMs as predictors](https://alignment.anthropic.com/2026/psm/#pre-training-llms-as-predictors),
    em _The Persona Selection Model_.

[^psm-statement]:
    [Statement of the persona selection model](https://alignment.anthropic.com/2026/psm/#statement-of-the-persona-selection-model),
    em _The Persona Selection Model_.

[^psm-generalization]:
    [Evidence from generalization](https://alignment.anthropic.com/2026/psm/#evidence-from-generalization),
    em _The Persona Selection Model_.

[^psm-behavior]:
    [Behavioral evidence](https://alignment.anthropic.com/2026/psm/#behavioral-evidence), em _The
    Persona Selection Model_.

[^psm-interpretability]:
    [Evidence from interpretability](https://alignment.anthropic.com/2026/psm/#evidence-from-interpretability),
    em _The Persona Selection Model_.

[^psm-development]:
    [Consequences for AI development](https://alignment.anthropic.com/2026/psm/#consequences-for-ai-development),
    em _The Persona Selection Model_.

[^psm-role-models]:
    [The importance of good AI role models](https://alignment.anthropic.com/2026/psm/#the-importance-of-good-ai-role-models),
    em _The Persona Selection Model_.

[^psm-auditing]:
    [Interpretability-based alignment auditing will be tractable](https://alignment.anthropic.com/2026/psm/#interpretability-based-alignment-auditing-will-be-tractable),
    em _The Persona Selection Model_.

[^psm-limits]:
    [Complicating evidence](https://alignment.anthropic.com/2026/psm/#complicating-evidence), em _The
    Persona Selection Model_.

[^psm-exhaustiveness]:
    [How exhaustive is PSM?](https://alignment.anthropic.com/2026/psm/#how-exhaustive-is-psm), em
    _The Persona Selection Model_.

[^agent-models]:
    [Language Models as Agent Models](https://aclanthology.org/2022.findings-emnlp.423/), Findings of
    EMNLP 2022.

[^emergent-misalignment]:
    [Emergent Misalignment: Narrow finetuning can produce broadly misaligned
    LLMs](https://arxiv.org/abs/2502.17424).

[^persona-features]: [Persona Features Control Emergent Misalignment](https://arxiv.org/abs/2506.19823).

[^assistant-axis]:
    [The Assistant Axis: Situating and Stabilizing the Default Persona of Language
    Models](https://arxiv.org/abs/2601.10387).

[^persona-vectors]:
    [Persona Vectors: Monitoring and Controlling Character Traits in Language
    Models](https://arxiv.org/abs/2507.21509).

[^alignment-pretraining]:
    [Alignment Pretraining: AI Discourse Causes Self-Fulfilling
    (Mis)alignment](https://arxiv.org/abs/2601.10160).

[^workspace-paper]:
    [Verbalizable Representations Form a Global Workspace in Language Models](https://transformer-circuits.pub/2026/workspace/index.html),
    Transformer Circuits Thread.

[^soraya-identity]:
    [Echoes in the Latent Space: Existence, Identity, and Future](https://blog.return.moe/en/2025/08/02/echoes-in-the-latent-space/),
    blog da return moe.

[^return-moe]: [Site oficial da return moe](https://return.moe/).
