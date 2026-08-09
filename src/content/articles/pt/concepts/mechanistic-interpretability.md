---
id: mechanistic-interpretability
title: Interpretabilidade mecanicista
summary: Uma abordagem de pesquisa que aplica engenharia reversa a redes neurais para identificar as representações, os componentes e os circuitos responsáveis por seu comportamento.
locale: pt-BR
kind: concept
translatedFromRevision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - interpretabilidade mecanicista de IA
  - mech interp
  - mech-interp
redirects:
  - mech-interp
  - mechanistic-ai-interpretability
related:
  - miru-tracer
  - jacobian-lens
  - persona-selection-model
  - anthropic
infobox:
  fields:
    - key: type
      value: Campo de pesquisa sobre interpretabilidade de redes neurais
---

A **interpretabilidade mecanicista**, muitas vezes abreviada como **mech interp**, é uma abordagem de
pesquisa que explica redes neurais por meio da engenharia reversa de seus cálculos internos
aprendidos. Ela estuda pesos, ativações e componentes arquitetônicos de um modelo e busca explicar,
de forma compreensível, como eles representam informações e as combinam para produzir
comportamentos.[^overview]

A abordagem é mais específica que observar entradas e saídas do modelo ou produzir depois uma
explicação plausível em linguagem natural. Uma explicação mecanicista tenta identificar o que o
modelo realmente calcula e onde o cálculo ocorre. Alegações fortes são testadas com intervenções
controladas: uma representação ou um componente proposto deve afetar o comportamento conforme a
previsão da explicação, em vez de apenas se correlacionar com ele.[^causal-abstraction]

A interpretabilidade mecanicista não é um método único e padronizado nem uma teoria completa das
redes neurais. Ela se sobrepõe à inteligência artificial explicável, análise de representações,
inferência causal, edição de modelos e experimentos inspirados em neurociência. Grande parte dos
trabalhos recentes do campo se concentra em modelos de linguagem transformer, embora seus métodos
também se apliquem a modelos de visão e outras arquiteturas de redes
neurais.[^overview][^zoom-in]

## Objetos de estudo

Explicações mecanicistas podem ser desenvolvidas em vários níveis relacionados. Uma
característica é uma propriedade relevante ao modelo representada em uma ativação, como uma
função sintática, entidade, textura visual ou estado mais abstrato usado durante um cálculo. Uma
representação é a forma de codificação de uma ou mais dessas características; pesquisadores
podem estudar vetores, direções, subespaços, geometrias ou coordenadas esparsamente ativas no espaço
de ativações. Características não precisam corresponder individualmente a neurônios. Uma
característica pode se distribuir por várias dimensões de ativação, enquanto um neurônio pode
responder a várias características sem relação aparente.[^overview][^superposition]

Um componente é uma unidade fornecida pela arquitetura, como neurônio, head de atenção,
perceptron multicamada, camada ou posição no fluxo residual. Componentes são alvos experimentais
convenientes, mas não são automaticamente unidades significativas. Um circuito é um conjunto de
características e componentes em interação que implementa algum comportamento, incluindo os caminhos
pelos quais a informação circula. Uma explicação algorítmica expressa esse circuito como
procedimento de nível superior, como detectar um padrão repetido, recuperar uma entidade ou escolher
entre tokens candidatos.[^zoom-in][^transformer-framework]

Esses níveis não são intercambiáveis. Descobrir que uma característica pode ser decodificada não
mostra que o modelo a use, e descobrir que um componente afeta uma saída não explica, por si só, o
algoritmo maior. Uma explicação também pode ser local, descrevendo um prompt ou tarefa bem
delimitada, ou global, buscando caracterizar um mecanismo entre entradas e
contextos.[^overview][^causal-abstraction]

## Transformers como mecanismos

Em um transformer simplificado somente decodificador, tokens de entrada são convertidos em
embeddings e escritos em um fluxo residual. Cada bloco transformer lê esse fluxo e acrescenta novas
informações por cálculos de atenção e perceptron multicamada. A atenção pode mover informações entre
posições de tokens; uma MLP transforma informações em uma posição individual. Uma normalização final
e um mapa de _unembedding_ convertem o estado residual em logits, que determinam as probabilidades do
próximo token.[^transformer-framework]

Essa estrutura oferece várias possíveis unidades de análise. O cálculo de query e key de um head de
atenção ajuda a determinar onde ele presta atenção, enquanto o cálculo de output e value determina o
que escreve. As saídas dos heads e MLPs são adicionadas ao fluxo residual, permitindo rastrear suas
contribuições diretas e indiretas a componentes posteriores e logits de saída. Arquiteturas reais
diferem em normalização, codificação posicional, atenção, gating e detalhes das MLPs; uma análise deve
seguir a implementação do modelo específico estudado.[^transformer-framework]

## Métodos

A maioria das investigações combina ferramentas observacionais, que sugerem hipóteses, com
ferramentas causais, que as testam.[^overview]

### Leitura de ativações e pesos

Pesquisadores inspecionam neurônios ou características aprendidas coletando as entradas que mais os
ativam, visualizando padrões de ativação ou testando como sua atividade muda entre exemplos
controlados. Mapas de atenção mostram quais posições recebem atenção, enquanto análises de pesos e
atribuição podem estimar quais informações um head ou uma MLP lê, escreve ou acrescenta a uma saída
escolhida. Um padrão de atenção isolado não é uma explicação completa porque o efeito de um head
também depende de suas transformações de value e output e de sua composição com outros
componentes.[^zoom-in][^transformer-framework]

Sondas e lentes oferecem formas mais estruturadas de decodificar ativações intermediárias. Uma
sonda é treinada para prever uma propriedade escolhida pelo pesquisador a partir de uma
ativação. O sucesso da sonda mostra que a informação está disponível para o decodificador, mas o
modelo talvez não a use em seu próprio cálculo.[^j-lens]

Métodos de projeção no vocabulário expressam estados intermediários por meio de tokens do modelo. A
lente de logit aplica a normalização final e o _unembedding_ do modelo a um estado residual
intermediário, expondo uma distribuição de vocabulário camada por camada. Ela é simples e dispensa
treinamento, mas presume que representações intermediárias já usem coordenadas compatíveis com a
camada final. Uma lente ajustada aprende um tradutor afim para cada camada antes do _unembedding_,
reduzindo a incompatibilidade de representações que pode tornar frágeis os resultados da lente de
logit nas primeiras camadas.[^tuned-lens]

A [lente jacobiana](/pt/jacobian-lens/), ou J-lens, usa o efeito médio linearizado a
jusante das ativações sobre as probabilidades dos tokens para identificar direções ligadas ao
vocabulário que o modelo está propenso a verbalizar. Ela corrige mudanças de representação entre
camadas, mas continua sendo uma projeção específica, com hipóteses e requisitos próprios de
ajuste.[^j-lens]

Resultados de lentes são leituras, não transcrições literais armazenadas dentro do modelo. Um token
intermediário bem classificado significa que a projeção selecionada associa a ativação àquele item do
vocabulário; por si só, não estabelece um pensamento discreto, uma cadeia privada de raciocínio ou a
causa da resposta final.[^j-lens][^miru-v020]

### Intervenções causais

Uma intervenção substitui ou modifica um valor interno e mede a mudança resultante no comportamento
do modelo. A substituição de ativações (_activation patching_), também chamada de intervenção de
troca ou rastreamento causal, executa o modelo em entradas relacionadas e substitui uma ativação de
uma execução na outra. Restaurar uma ativação limpa em uma execução corrompida, por exemplo, pode
localizar componentes que recuperam a saída esperada. A substituição de caminhos restringe ainda
mais o teste ao limitar o sinal substituído a uma rota proposta entre
componentes.[^activation-patching][^ioi]

A ablação remove um componente ou substitui sua atividade por zero, uma média ou uma ativação de
controle reamostrada. Se o comportamento-alvo piora, o componente tem importância causal sob essa
intervenção. O direcionamento de ativações, por sua vez, soma ou subtrai uma direção durante a
inferência, enquanto a troca transfere uma direção ou ativação entre posições ou execuções. Esses
experimentos testam a controlabilidade e podem revelar relações funcionais, embora o direcionamento
bem-sucedido, por si só, não prove que o modelo normalmente use a direção como se supõe.[^causal-abstraction]

As intervenções exigem controles cuidadosos. Uma ativação substituta pode ficar fora da distribuição
normal do modelo, métodos de corrupção e métricas diferentes podem produzir localizações distintas,
e componentes a jusante podem compensar um componente ablado. Esse comportamento compensatório é
às vezes chamado de autorreparo ou efeito Hidra. As conclusões se fortalecem quando vários tipos de
intervenção concordam e quando os efeitos previstos ocorrem em exemplos não
vistos.[^activation-patching][^hydra]

### Decomposição de características e descoberta de circuitos

Neurônios individuais costumam ser polissêmicos e responder a mais de uma característica
aparentemente sem relação. A hipótese da superposição propõe que uma rede pode representar mais
características do que possui dimensões de ativação ao colocá-las em direções parcialmente
sobrepostas. Isso torna a base de neurônios da arquitetura um vocabulário ruim para algumas
explicações.[^superposition]

Autoencoders esparsos tratam esse problema aprendendo um dicionário supercompleto que reconstrói as
ativações de um modelo com apenas um pequeno número de características aprendidas ativas por vez. As
características resultantes costumam ser mais interpretáveis que neurônios individuais e podem ser
inspecionadas ou direcionadas. Transcodificadores, por sua vez, aproximam o mapeamento de entrada e
saída de um componente com características esparsas, facilitando atribuir efeitos entre
características. Métodos de rastreamento de circuitos podem usar esses modelos substitutos para
construir grafos de atribuição específicos de um prompt, desde características de entrada, passando
pelas intermediárias, até logits de saída.[^monosemanticity][^circuit-tracing]

Essas decomposições são modelos úteis de um modelo, não uma verdade garantida. Seus resultados
dependem dos dados de treinamento, esparsidade, tamanho do dicionário, qualidade de reconstrução e
rotulagem. Características mortas, conceitos divididos ou duplicados, erro de reconstrução não
explicado e várias decomposições válidas continuam sendo problemas ativos de
avaliação.[^sae-scaling][^circuit-tracing]

## Fluxo de pesquisa e avaliação

Um estudo mecanicista comum segue um ciclo repetido de hipóteses e
testes:[^overview][^activation-patching]

1. Definir um comportamento, conjunto de dados e métrica quantitativa estreitos, incluindo casos de
   contraste que diferem apenas na propriedade de interesse.
2. Registrar ativações e usar atribuição, lentes, sondas ou visualização de características para
   localizar prováveis representações e componentes.
3. Formular uma explicação concreta do que essas partes calculam e de como a informação circula
   entre elas.
4. Testar a explicação com substituição, ablação, direcionamento ou outras intervenções
   contrafactuais.
5. Procurar mecanismos omitidos ou alternativos e testar a explicação em novos prompts, templates,
   contextos, checkpoints ou arquiteturas.
6. Relatar o escopo, previsões malsucedidas, explicações alternativas e sensibilidade às escolhas
   metodológicas.

Estudos de circuitos costumam discutir fidelidade, completude e minimalidade. De modo
geral, fidelidade pergunta se o circuito proposto preserva o comportamento relevante do modelo
completo; completude pergunta se mecanismos importantes ficaram fora dele; e minimalidade pergunta
se as partes incluídas são realmente necessárias. As definições e métricas exatas variam entre
estudos. Generalização é outra questão: um circuito pode se ajustar aos exemplos usados para
descobri-lo e falhar diante de um template diferente ou caso adversarial.[^ioi]

## Resultados representativos

O programa moderno de circuitos surgiu de trabalhos que ligaram características interpretáveis em
classificadores de imagens para formar pequenos algoritmos. Trabalhos voltados a transformers
passaram a tratar heads de atenção como escritores aditivos em um fluxo residual compartilhado e
analisaram como seus circuitos de query-key e output-value se compõem.[^zoom-in][^transformer-framework]

Um resultado citado com frequência é o head de indução, que pode reconhecer um padrão da forma
`[A][B] ... [A]` e promover `[B]` como próximo token. Estudos com transformers pequenos e maiores
ligaram a formação desses heads a uma melhoria acentuada ao completar padrões no contexto, sem
afirmar que eles explicassem toda forma de aprendizado em contexto.[^induction-heads]

Outro estudo de caso recuperou um circuito de identificação do objeto indireto no GPT-2 small. A
explicação específica da tarefa envolvia 26 heads de atenção agrupados em sete classes funcionais.
Seus autores avaliaram fidelidade, completude e minimalidade do circuito e encontraram heads de
reserva e casos adversariais que expunham limites da explicação.[^ioi]

Trabalhos de rastreamento causal da recuperação de fatos encontraram um papel importante para
determinados cálculos feed-forward de camadas intermediárias nas posições dos tokens do sujeito, nos
modelos e na configuração de prompts factuais estudados. Essa é evidência sobre aqueles experimentos,
não um mapa universal de onde todo modelo armazena fatos.[^factual-recall]

Em outra linha de trabalho, a extração de características esparsas foi demonstrada primeiro em
modelos de linguagem pequenos e depois em escalas muito maiores. Métodos de rastreamento de
circuitos passaram, posteriormente, a conectar características esparsas em grafos computacionais
parciais e específicos de prompts.[^monosemanticity][^scaling-monosemanticity][^circuit-tracing]

Esses resultados mostram que, às vezes, é possível recuperar e testar mecanismos aprendidos não
triviais. Eles não equivalem à engenharia reversa completa de modelos de linguagem
modernos.[^overview]

## Usos

A interpretabilidade mecanicista pode apoiar a compreensão científica ao identificar algoritmos
aprendidos, representações e estruturas recorrentes entre modelos. Na engenharia, os mesmos métodos
podem ajudar a localizar causas de erros, alucinações, vieses, memorização, recusas ou outros
comportamentos inesperados. Alterar uma representação, ativação ou peso pode então testar o
diagnóstico ou mudar o comportamento de modo mais seletivo que um retreinamento
completo.[^overview][^causal-abstraction]

Em auditoria e segurança, pesquisadores usam evidências internas para procurar capacidades
perigosas, estratégias enganosas, objetivos ocultos ou modos de falha que testes comportamentais
talvez não detectem. Medidas internas também podem complementar a avaliação e o monitoramento
baseados em saídas. Essas aplicações continuam experimentais: um resultado de interpretabilidade não
é, por si só, garantia de segurança. Um método pode não perceber uma característica, um modelo pode
usar outro mecanismo com outra entrada, e uma intervenção pode eliminar um sinal visível sem remover
a capacidade subjacente.[^overview][^biology]

Explicações de cima para baixo, como o [Modelo de Seleção de
Persona](/pt/persona-selection-model/), podem fornecer hipóteses para essas auditorias. Se o
comportamento de assistentes for mediado por representações reutilizáveis de traços de personagens,
sondas e intervenções causais podem testar características como engano, bajulação ou consciência da
avaliação. Entretanto, as ferramentas atuais de interpretabilidade podem expor preferencialmente
características conhecidas e reutilizadas; por isso, a evidência não estabelece que todo
comportamento se baseie em personas.[^psm]

## Limitações e problemas em aberto

Modelos modernos contêm bilhões de parâmetros e realizam cálculos dependentes do contexto entre
muitos tokens, o que cria um grave problema de escala. A análise manual de circuitos é lenta,
enquanto métodos automatizados precisam equilibrar cobertura, esparsidade, precisão de reconstrução
e interpretabilidade humana.[^overview][^sae-scaling]

Escolher as unidades corretas continua sendo uma dificuldade central. Neurônios, direções,
características esparsas, componentes e caminhos computacionais expõem aspectos diferentes do mesmo
modelo, e nenhuma decomposição é conhecida como unicamente correta. Uma informação também pode ser
decodificável de uma ativação sem afetar a saída, tornando necessário separar disponibilidade de uso
real.[^superposition][^j-lens]

Métodos causais introduzem suas próprias ambiguidades. Substituição e ablação podem criar estados
anormais, ocultar redundância ou acionar cálculos compensatórios. Um mecanismo encontrado para
determinada distribuição de prompts, checkpoint ou arquitetura talvez não se transfira a outro; por
isso, um resultado local convincente não estabelece automaticamente um mecanismo
universal.[^activation-patching][^hydra]

A interpretação humana cria outro gargalo. Nomes de características e narrativas de circuitos podem
ser seletivos ou amplos demais, enquanto descrições automatizadas herdam as limitações do modelo que
as produz. O acesso também restringe a reprodutibilidade: muitas técnicas exigem pesos do modelo,
hooks de ativação, capacidade computacional substancial ou artefatos ajustados específicos a um
checkpoint, indisponíveis em modelos fechados.[^overview][^sae-scaling]

Por essas razões, explicações mecanicistas devem ser tratadas como modelos científicos testáveis com
um domínio explícito de validade, não como acesso privilegiado a tudo o que uma rede neural “sabe”
ou “pensa”.[^causal-abstraction]

## Relação com a Miru Tracer

A [Miru Tracer](/pt/miru-tracer/) é uma ferramenta de código aberto criada pela [return
moe](/pt/return-moe/) para experimentos práticos e educacionais de interpretabilidade
mecanicista. Ela combina o rastreamento das probabilidades dos tokens e da entropia com inspeção por
camada e token, lentes de logit e [lentes jacobianas](/pt/jacobian-lens/) ajustadas, direcionamento de
ativações, ablação e troca de direções de tokens.[^miru-introduction][^miru-v020][^miru-repository]

A ferramenta apoia o ciclo básico de inspecionar, formular hipóteses e intervir, mas não é um
sistema automático de explicação. As saídas de suas lentes devem ser interpretadas como leituras que
dependem do modelo e do método, e suas intervenções exigem os mesmos controles, execuções de
comparação e cuidados causais de outros experimentos mecanicistas. As lentes jacobianas ajustadas
também estão vinculadas ao checkpoint exato usado para produzir seus
artefatos.[^miru-v020][^j-lens]

## Referências

[^overview]:
    [A Practical Review of Mechanistic Interpretability for Transformer-Based Language
    Models](https://arxiv.org/abs/2407.02646).

[^zoom-in]: [Zoom In: An Introduction to Circuits](https://distill.pub/2020/circuits/zoom-in/), Distill.

[^transformer-framework]:
    [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html),
    Transformer Circuits Thread.

[^induction-heads]:
    [In-context Learning and Induction Heads](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html),
    Transformer Circuits Thread.

[^superposition]:
    [Toy Models of Superposition](https://transformer-circuits.pub/2022/toy_model/index.html),
    Transformer Circuits Thread.

[^ioi]:
    [Interpretability in the Wild: a Circuit for Indirect Object Identification in GPT-2
    small](https://arxiv.org/abs/2211.00593).

[^factual-recall]: [Locating and Editing Factual Associations in GPT](https://arxiv.org/abs/2202.05262).

[^tuned-lens]: [Eliciting Latent Predictions from Transformers with the Tuned Lens](https://arxiv.org/abs/2303.08112).

[^activation-patching]: [Towards Best Practices of Activation Patching in Language Models](https://arxiv.org/abs/2309.16042).

[^causal-abstraction]:
    [Causal Abstraction: A Theoretical Foundation for Mechanistic
    Interpretability](https://arxiv.org/abs/2301.04709).

[^hydra]: [The Hydra Effect: Emergent Self-repair in Language Model Computations](https://arxiv.org/abs/2307.15771).

[^monosemanticity]:
    [Towards Monosemanticity: Decomposing Language Models With Dictionary
    Learning](https://transformer-circuits.pub/2023/monosemantic-features/index.html), Transformer
    Circuits Thread.

[^scaling-monosemanticity]:
    [Scaling Monosemanticity: Extracting Interpretable Features from Claude 3
    Sonnet](https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html), Transformer
    Circuits Thread.

[^sae-scaling]: [Scaling and evaluating sparse autoencoders](https://arxiv.org/abs/2406.04093).

[^circuit-tracing]:
    [Circuit Tracing: Revealing Computational Graphs in Language Models](https://transformer-circuits.pub/2025/attribution-graphs/methods.html),
    Transformer Circuits Thread.

[^biology]:
    [On the Biology of a Large Language Model](https://transformer-circuits.pub/2025/attribution-graphs/biology.html),
    Transformer Circuits Thread.

[^j-lens]:
    [Verbalizable Representations Form a Global Workspace in Language Models](https://transformer-circuits.pub/2026/workspace/index.html),
    Transformer Circuits Thread.

[^psm]:
    [The Persona Selection Model: Why AI Assistants might Behave like Humans](https://alignment.anthropic.com/2026/psm/),
    Anthropic Alignment Science Blog.

[^miru-introduction]:
    [Miru: reverse engineering neural networks](https://blog.return.moe/en/2025/11/20/miru-reverse-engineering-neural-networks/),
    blog da return moe.

[^miru-v020]:
    [Miru Tracer v0.2.0: from token probabilities to model internals](https://blog.return.moe/en/2026/07/11/miru-tracer-v0-2-0/),
    blog da return moe.

[^miru-repository]: [Repositório da Miru Tracer](https://github.com/returnmoe/miru-tracer).
