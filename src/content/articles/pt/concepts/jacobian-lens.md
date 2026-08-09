---
id: jacobian-lens
title: Lente jacobiana
summary: Uma técnica de interpretabilidade baseada no vocabulário que lê e edita representações intermediárias de modelos de linguagem por seus efeitos médios de primeira ordem nas saídas posteriores.
locale: pt-BR
kind: concept
translatedFromRevision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - J-lens
  - Jacobian Lens
  - lente jacobiana
redirects:
  - j-lens
related:
  - mechanistic-interpretability
  - miru-tracer
  - anthropic
infobox:
  fields:
    - key: type
      value: Técnica de interpretabilidade por projeção no vocabulário
    - key: authors
      value:
        text: Wes Gurnee et al.
        url: https://transformer-circuits.pub/2026/workspace/index.html
    - key: debut
      value: 6 de julho de 2026
    - key: affiliation
      value:
        text: Anthropic
        article: anthropic
    - key: website
      value:
        text: Verbalizable Representations Form a Global Workspace in Language Models
        url: https://transformer-circuits.pub/2026/workspace/index.html
---

A **lente jacobiana**, geralmente abreviada como **J-lens**, é uma técnica de [interpretabilidade
mecanicista](/pt/mechanistic-interpretability/) que traduz uma ativação intermediária de um
modelo de linguagem em uma lista ordenada de tokens do vocabulário. Ela foi apresentada por
pesquisadores da [Anthropic](/pt/anthropic/) no artigo de 2026 _Verbalizable Representations
Form a Global Workspace in Language Models_.[^paper]

Em vez de perguntar apenas qual token o modelo está prestes a produzir, a J-lens estima quais
palavras uma ativação é, em geral, capaz de fazer o modelo produzir na posição atual ou em uma
posição posterior. Para isso, usa uma jacobiana média: uma aproximação de primeira ordem de como
perturbar um fluxo residual em determinada camada muda os estados da camada final a
jusante.[^construction]

A lista de tokens resultante é uma leitura que depende do modelo e do método, não a transcrição
literal de uma frase privada dentro do modelo. Na interpretação do artigo, um token bem classificado
nomeia um conceito que a ativação está **propensa a verbalizar** entre diferentes contextos. Para
estabelecer qual papel esse conceito exerce, ainda são necessárias comparações, intervenções e
atenção às limitações da lente.[^interpretation][^limitations]

## Motivação

Um transformer somente decodificador atualiza repetidamente um vetor do fluxo residual em cada
posição de token. Na camada final, a normalização e a matriz de _unembedding_ convertem esse vetor em
logits do próximo token. Aplicar a mesma operação de saída diretamente a um fluxo residual anterior
produz a **lente de logit**, mas esse atalho presume que representações iniciais e finais usem
coordenadas compatíveis. As conexões residuais tornam a aproximação útil em camadas posteriores,
enquanto mudanças de representação podem tornar a saída das primeiras camadas ruidosa ou
enganosa.[^comparison]

A J-lens substitui a hipótese de identidade por um mapa ajustado de cada camada de origem à camada
final. O mapa deriva de derivadas locais do próprio modelo e, assim, descreve um caminho causal médio
de primeira ordem entre uma direção de ativação e estados residuais posteriores. Ainda é uma
aproximação linear, mas corrige rotações, mudanças de escala e outras alterações sistemáticas de
representação ignoradas por um _unembedding_ direto.[^construction][^comparison]

## Construção

Seja `h_l,t` a ativação do fluxo residual na camada `l` e posição de token `t`, e seja `h_final,t'`
a ativação da camada final em uma posição `t'` igual ou posterior a `t`. A jacobiana local
`∂h_final,t' / ∂h_l,t` descreve como uma pequena mudança na origem alteraria esse estado posterior
em primeira ordem. O artigo calcula a média dessas jacobianas entre posições de origem, todas as
posições posteriores e mil prompts amostrados de uma distribuição semelhante à de
pré-treinamento:[^construction]

```text
J_l = E[t, t' >= t, prompt](∂h_final,t' / ∂h_l,t)
```

Isso produz uma matriz quadrada `J_l` para cada camada ajustada. Aplicar a matriz a uma ativação e,
depois, usar a normalização e a operação de _unembedding_ normais do modelo resulta em uma pontuação
para cada token do vocabulário:[^construction]

```text
lens(h_l) = softmax(W_U norm(J_l h_l))
```

As linhas de `W_U J_l` são os **vetores da J-lens** da camada. Cada uma é uma direção do fluxo
residual associada a um token do vocabulário. Como a média abrange muitos prompts e posições
futuras, a direção busca capturar uma disposição geral para verbalizar aquele token, e não a
continuação específica do prompt inspecionado.[^construction]

O ajuste é a etapa custosa. Depois de calcular uma matriz para uma camada, a leitura comum exige
somente o mapa linear ajustado e a operação de saída do modelo. O artefato está vinculado aos pesos
e à arquitetura do modelo; não se deve presumir que um ajuste feito para um checkpoint seja válido
para outro.[^construction][^miru-v020]

## Leitura de ativações

A leitura mais simples ordena as pontuações da lente e mostra os tokens mais bem classificados para
uma camada e posição. Acompanhar um token entre camadas pode mostrar quando um conceito candidato
ganha destaque, enquanto acompanhar uma camada entre posições pode mostrar onde ele é representado
na sequência. Um único vetor da J-lens também pode servir como sonda de um conceito escolhido, sem
ordenar todo o vocabulário.[^use-cases]

A leitura deve ser interpretada como um conjunto de ideias relacionadas, e não como uma frase. Um
conceito pode aparecer por meio de vários sinônimos, nomes ou fragmentos de tokens, e diversas
palavras bem classificadas podem descrever a mesma vizinhança semântica. A posição no ranking também
é relativa: um token pode subir porque sua própria pontuação aumentou ou porque tokens concorrentes
enfraqueceram.[^interpretation][^limitations]

Quando é necessário um inventário discreto, o artigo usa decomposição esparsa não negativa para
aproximar uma ativação por um conjunto pequeno de vetores da J-lens. Como os vetores indexados por
tokens são supercompletos e não ortogonais, essa solução esparsa não equivale a escolher os tokens
com os maiores produtos internos individuais nem é matematicamente única sem restrições
adicionais.[^j-space]

## Escrita e intervenções

Os mesmos vetores usados para leitura podem apoiar experimentos causais. Adicionar a uma ativação um
vetor da J-lens multiplicado por uma escala direciona o modelo ao conceito associado. Subtraí-lo,
removê-lo por projeção ou desativar vários vetores ativos realiza uma ablação. Essas intervenções
testam se uma direção decodificada pode influenciar o cálculo posterior; por si só, não comprovam
que o modelo normalmente use a direção da forma proposta.[^use-cases]

A **troca de coordenadas da lente** permuta as coordenadas associadas a dois vetores de tokens e
mantém inalterado o componente da ativação fora do espaço que abrangem. Nos experimentos de relato
verbal do artigo, trocar um item de categoria escolhido espontaneamente pelo modelo por outro
candidato deslocou a resposta relatada em direção ao conceito inserido. Outros experimentos usaram
trocas e ablações para redirecionar o raciocínio intermediário, fornecendo evidência causal mais
forte do que uma leitura isolada.[^workspace-evidence]

Como no direcionamento de ativações em geral, importam a intensidade da intervenção, o intervalo de
camadas, a posição do token e efeitos fora da distribuição. Uma intervenção malsucedida pode indicar
que o conceito estava ausente, era mal representado por seu vetor de vocabulário, foi escrito em
outro local ou estava protegido por cálculo redundante; uma intervenção bem-sucedida pode refletir
controle artificial sem identificar o algoritmo normal do modelo.[^use-cases][^limitations]

## Espaço J e hipótese do espaço de trabalho global

O artigo chama de **espaço J** o conjunto esparso de ativações que podem ser expressas como
combinações não negativas de vetores da J-lens. Os vetores formam um frame supercompleto porque o
vocabulário contém mais tokens do que o fluxo residual tem dimensões. Em geral, os autores limitaram
as decomposições a no máximo 25 vetores ativos e relataram que o componente resultante no espaço J
explicava menos de 10% da variância das ativações nas camadas estudadas.[^j-space]

Em vários modelos Claude, os autores observaram que conteúdo coerente no espaço J surgia após uma
faixa inicial de camadas e mudava em direção a representações de saída iminente perto do fim. Eles
relataram evidências de que a faixa intermediária permitia relato verbal, modulação deliberada,
raciocínio em várias etapas, reutilização flexível entre tarefas e participação seletiva, em vez de
universal, nos cálculos do modelo. Com base nisso, descreveram-na como funcionalmente semelhante a
um **espaço de trabalho global**.[^workspace-evidence]

Trata-se de uma analogia funcional e mecanicista, não de uma afirmação de que um transformer recria
a arquitetura cerebral proposta pelas teorias do espaço de trabalho global ou de que o modelo seja
consciente. O artigo observa que um transformer feed-forward não possui equivalentes claros de
processadores recorrentes especializados e que suas evidências não resolvem questões sobre
experiência subjetiva.[^paper]

## Comparação com outras lentes

Na formulação do artigo, a lente de logit é o caso especial `J_l = I`: ela aplica o _unembedding_
final como se as camadas posteriores preservassem a direção relevante. Os dois métodos tendem a
concordar perto da saída e divergir nas camadas iniciais. Os autores consideraram a lente de logit
útil na prática, mas a J-lens mais confiável para conceitos intermediários iniciais e não
verbalizados nas avaliações escolhidas.[^comparison][^lens-evaluation]

A **lente ajustada** (_tuned lens_) também aprende um tradutor para cada camada, mas o otimiza para
prever a distribuição de saída final do modelo. A J-lens deriva seu tradutor dos efeitos causais
locais médios. Nos experimentos do artigo sobre o espaço de trabalho, as leituras da lente ajustada
às vezes pulavam cálculos intermediários e iam diretamente para a resposta; o resultado diz respeito
aos modelos e benchmarks estudados, não estabelece que uma lente seja universalmente
preferível.[^tuned-lens][^comparison]

Portanto, os métodos respondem a perguntas relacionadas, mas distintas. A lente de logit é barata e
dispensa artefato ajustado, a lente ajustada é treinada para reconstruir previsões de saída, e a
J-lens é ajustada para aproximar como perturbações intermediárias se propagam até saídas presentes e
futuras. Usar mais de uma pode revelar quando uma interpretação depende de determinada
projeção.[^comparison]

## Aplicações relatadas no artigo

Os autores usaram leituras da J-lens para revelar avaliações intermediárias que não eram copiadas da
entrada nem idênticas ao próximo token, entre elas o reconhecimento de um rosto, um defeito de
código, a função de uma proteína e uma injeção de prompt. Também examinaram deliberação estratégica,
reações a interpretação de papéis e desvio de personagem, além de assinaturas internas em modelos
desalinhados treinados especificamente. Esses estudos de caso motivam usos em auditoria, mas não
mostram que todo plano relevante precise atravessar um espaço J legível.[^paper][^alignment-monitoring]

O artigo também apresentou o **treinamento de reflexão contrafactual**. Os modelos foram treinados
para articular princípios éticos em continuações hipotéticas nas quais eram interrompidos e
convidados a refletir; os conceitos associados então apareceram no espaço J durante tarefas sem
interrupção, e sua ablação reduziu substancialmente a melhoria comportamental relatada. O experimento
vincula a lente a uma intervenção específica de treinamento, mas novas replicações são necessárias
antes de tratar o método como uma receita geral de alinhamento.[^counterfactual-reflection]

## Limitações

Cada vetor padrão da J-lens corresponde a um token do tokenizador. Nomes, expressões e conceitos com
vários tokens e sem rótulo lexical compacto podem, assim, se fragmentar na leitura ou continuar
difíceis de identificar. O artigo explorou extensões baseadas em templates para conceitos de vários
tokens, mas esses métodos têm custos e modos de falha próprios.[^limitations]

A lente também produz um conjunto plano de conceitos sem mostrar como eles se vinculam em relações.
Uma leitura que contenha palavras correspondentes a uma entidade, um número e um atributo não diz
qual atributo pertence a qual entidade. Algumas leituras nas camadas do espaço de trabalho continuam
ininterpretáveis, as camadas iniciais costumam ser ruidosas e a fronteira traçada entre
representações semelhantes a um espaço de trabalho e representações “motoras” voltadas à saída foi
parcialmente definida após os resultados.[^limitations]

Um mapa médio de primeira ordem necessariamente descarta dinâmicas não lineares específicas do
prompt. Informações fora do frame indexado por tokens, cálculos automáticos que evitam o espaço J ou
circuitos indesejáveis bem praticados podem escapar à inspeção. Por isso, o artigo apresenta o
monitoramento com J-lens como uma ferramenta de auditoria a combinar com avaliação comportamental,
características esparsas e outros métodos causais — não como monitor de segurança
suficiente.[^alignment-monitoring]

## Relação com a Miru Tracer

A [Miru Tracer](/pt/miru-tracer/) inclui leituras de lentes jacobianas ajustadas em sua interface
por camada e token, ao lado de uma lente de logit que dispensa treinamento. Seus arquivos de ajuste
precisam corresponder exatamente ao checkpoint do modelo, e a interface ajuda usuários a comparar
tokens entre posições e camadas antes de experimentar direcionamento, ablação ou trocas de direções
de tokens.[^miru-v020][^miru-repository]

Isso faz da Miru Tracer uma ferramenta prática para explorar a técnica nos modelos compatíveis, mas
a interface não elimina os limites interpretativos do método. A documentação da própria Miru alerta
que leituras de tokens não são transcrições verdadeiras dos pensamentos de um modelo, e alegações
causais ainda exigem execuções controladas para comparação.[^miru-v020]

## Referências

[^paper]:
    [Verbalizable Representations Form a Global Workspace in Language Models](https://transformer-circuits.pub/2026/workspace/index.html),
    Transformer Circuits Thread.

[^construction]:
    [The Jacobian Lens](https://transformer-circuits.pub/2026/workspace/index.html#the-jacobian-lens),
    em _Verbalizable Representations Form a Global Workspace in Language Models_.

[^interpretation]:
    [Interpreting the J-lens](https://transformer-circuits.pub/2026/workspace/index.html#interpreting-the-j-lens),
    em _Verbalizable Representations Form a Global Workspace in Language Models_.

[^use-cases]:
    [Technical details of J-lens use cases](https://transformer-circuits.pub/2026/workspace/index.html#technical-details-of-j-lens-use-cases),
    em _Verbalizable Representations Form a Global Workspace in Language Models_.

[^j-space]:
    [The J-Space](https://transformer-circuits.pub/2026/workspace/index.html#the-j-space), em
    _Verbalizable Representations Form a Global Workspace in Language Models_.

[^workspace-evidence]:
    [The J-space acts as a Global Workspace](https://transformer-circuits.pub/2026/workspace/index.html#the-j-space-acts-as-a-global-workspace),
    em _Verbalizable Representations Form a Global Workspace in Language Models_.

[^comparison]:
    [Comparison to Related Techniques](https://transformer-circuits.pub/2026/workspace/index.html#comparison-to-related-techniques),
    em _Verbalizable Representations Form a Global Workspace in Language Models_.

[^lens-evaluation]:
    [Comparison between lensing methods](https://transformer-circuits.pub/2026/workspace/index.html#comparison-between-lensing-methods),
    em _Verbalizable Representations Form a Global Workspace in Language Models_.

[^tuned-lens]: [Eliciting Latent Predictions from Transformers with the Tuned Lens](https://arxiv.org/abs/2303.08112).

[^alignment-monitoring]:
    [Alignment monitoring](https://transformer-circuits.pub/2026/workspace/index.html#alignment-monitoring),
    em _Verbalizable Representations Form a Global Workspace in Language Models_.

[^counterfactual-reflection]:
    [Counterfactual Reflection Training](https://transformer-circuits.pub/2026/workspace/index.html#counterfactual-reflection-training),
    em _Verbalizable Representations Form a Global Workspace in Language Models_.

[^limitations]:
    [Limitations and open questions](https://transformer-circuits.pub/2026/workspace/index.html#limitations-and-open-questions),
    em _Verbalizable Representations Form a Global Workspace in Language Models_.

[^miru-v020]:
    [Miru Tracer v0.2.0: from token probabilities to model internals](https://blog.return.moe/en/2026/07/11/miru-tracer-v0-2-0/),
    blog da return moe.

[^miru-repository]: [Repositório da Miru Tracer](https://github.com/returnmoe/miru-tracer).
