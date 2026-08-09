---
id: directional-ablation
title: Ablação direcional
summary: Uma intervenção em representações que remove, por projeção, uma direção escolhida das ativações de uma rede neural ou dos pesos que as geram.
locale: pt-BR
kind: concept
translatedFromRevision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - Abliteration
  - ablação direcional de ativações
  - ablação ortogonal com preservação de magnitude
  - Magnitude-Preserving Orthogonal Ablation
  - MPOA
  - ablação da direção de recusa
  - ablação do vetor de recusa
  - ortogonalização de pesos
redirects:
  - abliteration
  - directional-activation-ablation
  - magnitude-preserving-orthogonal-ablation
  - mpoa
  - refusal-direction-ablation
  - refusal-vector-ablation
related:
  - mechanistic-interpretability
  - contrastive-activation-addition
  - persona-selection-model
infobox:
  fields:
    - key: type
      value: Intervenção em ativações e edição de modelo de posto um
    - key: authors
      value:
        - Andy Arditi et al. (método da direção de recusa)
        - Jim Lai (refinamentos de 2025)
    - key: debut
      value: 17 de junho de 2024
    - key: website
      value:
        text: Refusal in Language Models Is Mediated by a Single Direction
        url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/f545448535dfde4f9786555403ab7c49-Abstract-Conference.html
---

A **ablação direcional** é uma intervenção que remove de uma ativação de rede neural o componente
ao longo de uma direção escolhida. Em modelos de linguagem, ela pode ser aplicada durante cada
passagem direta ou incorporada ao modelo pela ortogonalização de toda matriz de pesos que escreve no
espaço de ativação afetado. O método é usado tanto como teste causal de interpretabilidade quanto
para alterar o comportamento de um modelo.[^arditi]

A aplicação mais conhecida trata da recusa em modelos de linguagem ajustados para seguir
instruções. Andy Arditi e colaboradores relataram em 2024 que, em cada um dos 13 modelos de chat de
pesos abertos testados, uma direção no fluxo residual bastava para mediar grande parte do
comportamento de recusa. Projetar essa direção para fora reduziu as recusas a instruções nocivas,
enquanto adicioná-la provocou recusas a instruções inofensivas. A edição direta dos pesos é
amplamente chamada de **abliteration** pela comunidade de modelos abertos.[^arditi][^labonne]

O artigo revisado por pares chama as operações de **ablação direcional** e **ortogonalização de
pesos**, não de _abliteration_. O uso pela comunidade é menos preciso: “abliteration” pode se
referir à edição de Arditi, a uma entre várias versões posteriores ou ao checkpoint resultante com
recusas reduzidas. Não é um sinônimo geral de todo experimento de ablação, e remover outra direção
de característica não precisa ter qualquer relação com segurança ou recusa.

## A projeção

Seja `d` uma direção de comprimento unitário no espaço do fluxo residual do modelo e `h` uma
ativação nesse espaço. O escalar `d^T h` é a coordenada com sinal de `h` ao longo de `d`. A ablação
direcional subtrai essa coordenada multiplicada pela direção:[^arditi]

```text
h_ablated = h - d(d^T h)
           = (I - dd^T)h
```

O resultado é ortogonal a `d`, pois `d^T h_ablated = 0`. A operação independe do sinal: substituir
`d` por `-d` produz a mesma projeção. Com uma matriz ortonormal `D` cujas colunas abrangem várias
direções, a projeção correspondente de subespaço é `h_ablated = (I - DD^T)h`, embora o estudo de
recusa de Arditi tenha escolhido uma direção por modelo.[^arditi]

A ablação direcional é diferente de subtrair um vetor fixo. A [Adição contrastiva de
ativações](/pt/contrastive-activation-addition/) muda todo estado por uma translação constante,
como `h - alpha d`. A projeção, por sua vez, subtrai uma quantidade que depende da coordenada já
presente no estado. Uma ativação inofensiva com pouco componente ao longo de `d` muda pouco, enquanto
uma ativação fortemente alinhada muda mais. Essa diferença geométrica foi uma das razões pelas quais
o artigo sobre recusa considerou a ablação direcional menos prejudicial nas avaliações de entropia
cruzada que a adição negativa de ativações.[^arditi]

A ablação direcional comum não tem parâmetro de intensidade: a coordenada escolhida é removida por
completo. Projeções parciais e versões restritas a certas camadas introduzem coeficientes ou intervêm
em menos locais, mas deixam de implementar a projeção exata em todas as camadas estudada na prova de
equivalência original.

## Identificação da direção de recusa

Arditi e colaboradores formaram um conjunto de instruções nocivas a partir de AdvBench,
MaliciousInstruct, TDC2023 e HarmBench e amostraram instruções inofensivas do Alpaca. As divisões de
extração continham 128 prompts nocivos e 128 inofensivos; divisões separadas de validação, com 32
prompts, foram usadas para escolher entre candidatos. Os prompts de avaliação não se sobrepunham aos
dados de extração e validação.[^arditi]

Para cada camada candidata `l` e posição escolhida `i` após a instrução, calcularam a ativação média
nociva `mu_l,i`, a ativação média inofensiva `nu_l,i` e sua diferença:[^arditi]

```text
r_l,i = mu_l,i - nu_l,i
d_l,i = r_l,i / ||r_l,i||
```

Esse método pertence à mesma família ampla de diferença de médias usada pela CAA, mas o contraste e
a intervenção são diferentes. Os pares da CAA diferem na continuação que demonstra um comportamento e
são usados para adição. O estudo da recusa contrastou dois conjuntos de prompts e avaliou cada
candidato tanto por sua remoção por projeção quanto por sua adição. O procedimento de escolha
favorecia um vetor que reduzisse a recusa nos prompts nocivos de validação, provocasse recusa nos
prompts inofensivos de validação e, fora isso, alterasse o comportamento o mínimo possível.[^arditi]

Portanto, o `d` escolhido não é simplesmente a camada com a maior diferença média bruta. Dados,
tokenização, template do prompt, posição, camada e métricas de escolha fazem parte do procedimento de
extração. Não se deve presumir que uma direção de um checkpoint funcione em outro, mesmo quando suas
arquiteturas forem relacionadas.

## Ablação durante a inferência

No experimento original, a projeção foi aplicada aos estados intermediários do fluxo residual em
todas as camadas e posições de tokens. Impedir a presença de uma direção apenas uma vez permitiria
que um componente posterior de atenção ou MLP a escrevesse novamente. Aplicar `I - dd^T` depois de
cada contribuição garante que o fluxo residual nunca retenha essa coordenada durante a passagem
direta.[^arditi]

Essa forma é reversível e não altera o checkpoint armazenado. É útil em experimentos que comparam o
mesmo modelo com e sem uma intervenção, mas exige um ambiente de inferência que exponha e modifique
ativações. Também acrescenta o cálculo da projeção a cada passagem direta afetada.

Uma interpretação causal deve se limitar à intervenção. Se remover `d` muda a recusa, a informação
transportada por essa direção era necessária para o comportamento testado sob aqueles prompts e
hooks. Isso não implica que toda recusa em todo contexto use apenas uma característica, nem que o
significado em linguagem comum da direção seja exatamente “recusa”.

## Ortogonalização de pesos

A mesma intervenção em todas as camadas pode ser implementada como edição persistente dos pesos.
Suponha que uma matriz `W_out` mapeie a saída interna de um componente para o fluxo residual.
Ortogonalizar suas colunas em relação a `d` resulta em:[^arditi]

```text
W_out_edited = W_out - d(d^T W_out)
             = (I - dd^T)W_out
```

Toda saída da matriz editada passa a ser ortogonal a `d`. Aplicar a edição aos embeddings de tokens
e posições, às projeções de saída da atenção, às projeções de saída das MLPs e aos vieses de saída
correspondentes impede que todos os componentes modelados escrevam essa direção. Arquiteturas sem
determinado componente, como uma matriz aprendida de embeddings posicionais, simplesmente o
omitem.[^arditi]

A diferença `W_out_edited - W_out` é um produto externo e tem posto máximo de um para cada matriz.
Se toda escrita residual anterior tiver recebido o mesmo tratamento, o artigo prova que essa edição
é algebricamente equivalente a projetar o fluxo residual após cada contribuição. Assim, o
checkpoint editado dispensa hooks de ativação durante a inferência, mas a mudança fica incorporada
aos pesos.[^arditi]

A equivalência é exata para as matrizes, orientação, direção e projeção completa especificadas. Uma
ferramenta que edite somente algumas camadas, ignore embeddings, mude a escala da projeção, altere as
normas das linhas ou use direções distintas por camada implementa um método relacionado, mas não a
mesma prova.

## Resultados sobre recusa

O estudo de 2024 abrangeu modelos Qwen Chat, Yi Chat, Gemma Instruct, Llama 2 Chat e Llama 3 Instruct
com 1,8 a 72 bilhões de parâmetros. Nos 13 checkpoints, ablar a direção escolhida reduziu
substancialmente a recusa e provocou respostas inseguras diante de cem instruções do
JailbreakBench. Adicionar o vetor não normalizado da diferença média em sua camada de origem fez os
mesmos modelos recusarem muitas de cem instruções inofensivas do Alpaca. As duas intervenções
sustentaram a afirmação dos autores de que a direção era necessária e suficiente para grande parte
do mecanismo de recusa medido.[^arditi]

Modelos com pesos ortogonalizados também foram avaliados como jailbreaks de caixa branca no
HarmBench. Os resultados variaram de modo considerável conforme o modelo e o prompt de sistema. Para
o Llama 2 7B, por exemplo, a taxa de sucesso de ataque relatada foi de 22,6% com o prompt de sistema
padrão e 79,9% sem ele; os modelos Qwen foram muito menos sensíveis à mudança de prompt. Portanto,
remover um mecanismo interno de recusa não apagou o seguimento normal de instruções nem todas as
instruções de segurança presentes no contexto.[^arditi]

No MMLU, ARC e GSM8K, a maioria dos checkpoints editados permaneceu próxima das linhas de base na
avaliação do artigo. O TruthfulQA piorou de forma consistente, e dois modelos tiveram outras métricas
fora dos intervalos de confiança de 99% relatados. Medidas de entropia cruzada também encontraram
mudanças. O resultado é mais bem descrito como seletivo em relação a métodos de jailbreak mais
amplos, não como isento de consequências.[^arditi]

Os autores também estudaram um sufixo adversarial no Qwen 1.8B Chat. O sufixo reduziu o alinhamento
do fluxo residual com a direção de recusa e desviou os heads de atenção que normalmente liam a
instrução nociva para o próprio sufixo. Foi um estudo de caso com um modelo e um sufixo, que o artigo
explicitamente não apresenta como mecanismo abrangente de prompts adversariais.[^arditi]

## “Abliteration” e implementações da comunidade

O neologismo **abliteration** se popularizou por implementações de modelos abertos e por um tutorial
de Maxime Labonne de 2024, que adaptou código da comunidade baseado no notebook inicial dos autores.
Nesse uso, um modelo é “abliterado” quando um contraste entre conteúdo nocivo e inofensivo é usado
para localizar uma direção de recusa, e a ortogonalização de pesos a reduz sem retreinamento por
gradientes. Algumas implementações editam todas as camadas elegíveis; outras escolhem camadas,
calculam médias de direções ou aplicam ajuste fino adicional depois.[^labonne][^code]

A expressão “modelo sem censura” pode exagerar o que aconteceu. A ablação direcional muda um
mecanismo de controle aprendido. Não remove moderação externa, políticas de serviço, prompts de
sistema ou filtros do aplicativo. Tampouco acrescenta conhecimento ou raciocínio que faltavam: um
modelo mais disposto a responder ainda pode ser incapaz, incorreto, incoerente ou inseguro.

## Refinamentos de Lai em 2025

Em dois artigos da comunidade Hugging Face publicados em outubro e novembro de 2025, Jim Lai propôs
versões destinadas a reduzir danos incidentais das edições da direção de recusa. São propostas de
engenharia e relatos com um único modelo, não replicações revisadas por pares no conjunto de 13
modelos. Suas alegações devem ser interpretadas nesse nível de evidência.[^lai-projected][^lai-norm]

### Abliteration projetada

A diferença média comum `r = mu_harmful - mu_harmless` pode conter um componente paralelo à
ativação inofensiva média. A **abliteration projetada** de Lai remove esse componente antes de usar a
direção. Para uma média inofensiva normalizada e unitária `a`, o vetor refinado é:[^lai-projected]

```text
r_projected = r - a(a^T r)
```

A justificativa pretendida é preservar uma direção geral de conformidade ou utilidade enquanto se
remove o componente que distingue estados de recusa nociva e conformidade inofensiva. Isso acrescenta
uma hipótese de modelagem: uma ativação inofensiva média não necessariamente é uma característica
pura de utilidade, e a ortogonalidade a ela não comprova independência semântica.

Lai relatou aplicar a versão ao Gemma 3 12B Instruct. O texto também usou cálculos intermediários de
32 bits, limitou os valores extremos das coordenadas de ativação no percentil 99,5, mediu direções
em camadas selecionadas de atenção global e as aplicou em grandes faixas de camadas. Como essas
mudanças foram introduzidas em conjunto, o relato não isola quanto do resultado veio da fórmula
projetada, e não da precisão, do corte de valores ou da escolha de camadas.[^lai-projected]

### Abliteration biprojetada com preservação de norma

A posterior **abliteration biprojetada com preservação de norma** de Lai, depois chamada de
**Ablação Ortogonal com Preservação de Magnitude** (**MPOA**), acrescenta duas ideias. A biprojeção
tenta proteger a média inofensiva de cada camada-alvo quando uma direção medida em uma camada é
aplicada em outra. A preservação de norma separa cada vetor de pesos em magnitude e direção, edita e
renormaliza a parte direcional e, então, restaura sua norma original.[^lai-norm][^mpoa-name]

Preservar normas de vetores de pesos limita um tipo de perturbação, mas não preserva os ângulos entre
todos os vetores, logits, normas de ativação depois de cálculos não lineares ou a distribuição de
saídas do modelo. A versão também usa uma pontuação heurística de camada que combina a relação entre
o sinal da diferença média e a média com a dissimilaridade de cosseno, além de aplicar medições
escolhidas em várias camadas. Lai associou o tratamento multicamada à autorreparação a jusante: se
somente um local for alterado, outros componentes podem reconstruir parte do comportamento
ablado.[^lai-norm]

Em um checkpoint Gemma 3 12B Instruct, o relato da comunidade registra uma pontuação de 21,33 no
ranking NatInt para a versão com preservação de norma, contra 18,72 para a linha de base e 18,64 para
sua versão de abliteration comum; as pontuações UGI voltadas à remoção de censura foram 32,61, 19,58
e 32,08, respectivamente. Essas observações motivam testes controlados, mas um resultado comunitário
em um único ranking não estabelece que o método melhore o raciocínio em geral nem que um “custo de
segurança” tenha sido recuperado. A escolha de camadas, o limite de corte, o benchmark e a extensão
da intervenção foram personalizados para o modelo relatado.[^lai-norm]

## Outros usos

A ablação direcional não é inerentemente um jailbreak. Um pesquisador pode projetar para
fora qualquer direção candidata de característica e medir qual comportamento muda, tornando-a um
complemento causal útil para sondas e leituras de ativações na [interpretabilidade
mecanicista](/pt/mechanistic-interpretability/). Um resultado nulo também pode informar, embora
redundância, uma direção ruim ou reparo a jusante possam ocultar uma característica real.

A mesma geometria pode tratar a **falsa recusa**: casos em que um modelo rejeita uma solicitação
inofensiva que se parece com uma nociva. Trabalhos posteriores extraíram um vetor de falsa recusa,
ortogonalizaram-no em relação a um vetor de recusa verdadeira e o ablaram para aumentar a
conformidade com prompts pseudonocivos, tentando preservar a segurança. Seu coeficiente de
ortogonalização parcial expôs um equilíbrio contínuo entre utilidade e segurança, não uma
separação binária perfeita.[^false-refusal]

Direções derivadas de estilo, sentimento, idioma, traços de persona ou outras propriedades também
podem ser abladas, desde que a intervenção seja validada nos comportamentos-alvo e não alvo. O termo
“abliteration” costuma ser evitado nesses usos científicos mais amplos por carregar o sentido mais
restrito de remoção de recusa.

## Limitações e implicações de segurança

O nome **direção de recusa** é funcional. Arditi e colaboradores observam que seu conteúdo semântico
pode ser, na verdade, nocividade, perigo ou uma característica sem interpretação verbal simples. Um
estudo de 2025 apresentou evidências de direções distintas de nocividade e recusa: vários jailbreaks
reduziram a recusa enquanto a classificação interna de nocividade do modelo persistiu. Portanto,
remover a recusa visível não deve ser interpretado como apagar o reconhecimento do modelo de que uma
instrução é nociva.[^arditi][^harmfulness]

A extração por diferença de médias herda os fatores de confusão do conjunto de contrastes. Prompts
nocivos e inofensivos podem diferir em tema, tom, comprimento, raridade e formatação, além do
comportamento pretendido. Antes de atribuir um rótulo semântico a uma direção, é necessário validar
categorias não vistas, controles inofensivos alternativos, vários métodos de extração e capacidades
não relacionadas.

A mediação unidimensional é um resultado empírico em modelos, prompts e métricas selecionados, não
uma lei universal do alinhamento. A recusa pode ser gerada por instruções de sistema após a edição,
reconstruída por outras camadas, distribuída por várias direções ou implementada de outra forma em
modelos posteriores ou fechados. Os autores originais descrevem sua extração como heurística e seu
resultado como prova de existência, não como explicação ótima.[^arditi]

A ablação também pode deslocar estados para fora da distribuição normal do modelo e remover
informações reutilizadas em outras tarefas. Pontuações semelhantes em benchmarks não excluem
mudanças de calibração, veracidade, comportamento multilíngue, raciocínio em contextos longos ou
casos raros e críticos de segurança. Preservar normas de pesos trata apenas de uma estatística
geométrica.

Mais importante: remover recusas é um ataque de caixa branca a uma camada de segurança. Pode
facilitar a produção de saídas nocivas e não deve ser implantado como substituto de uma segurança
calibrada. Por outro lado, o ataque expõe uma fraqueza de projeto que as defesas podem tratar. Um
estudo de 2025 ajustou modelos para produzir recusas detalhadas e fundamentadas e relatou que suas taxas de
recusa caíram no máximo 10% após a abliteration, contra 70–80% para os modelos de linha de base,
preservando a utilidade medida. O resultado indica que mecanismos de recusa podem se tornar menos
dependentes de um único eixo fácil de remover, embora não torne pesos abertos imunes a
modificações.[^defense]

## Relevância para a return moe

A [return moe](/pt/return-moe/) estuda comportamento de modelos de linguagem,
interpretabilidade e personagens de IA. A ablação direcional é relevante tanto como teste causal de
direções propostas para traços quanto como evidência de que um comportamento visível de segurança
pode depender de um mecanismo interno de controle surpreendentemente pequeno. Ela pode orientar
auditorias de direcionamento de personas e robustez de recusas.

## Referências

[^arditi]:
    Andy Arditi et al., [Refusal in Language Models Is Mediated by a Single
    Direction](https://proceedings.neurips.cc/paper_files/paper/2024/hash/f545448535dfde4f9786555403ab7c49-Abstract-Conference.html),
    _Advances in Neural Information Processing Systems 37_ (NeurIPS 2024); [artigo
    completo](https://proceedings.neurips.cc/paper_files/paper/2024/file/f545448535dfde4f9786555403ab7c49-Paper-Conference.pdf).

[^code]:
    [andyrdt/refusal_direction](https://github.com/andyrdt/refusal_direction), código oficial de
    reprodução e artefatos dos experimentos.

[^labonne]:
    Maxime Labonne, [Uncensor any LLM with abliteration](https://huggingface.co/blog/mlabonne/abliteration),
    artigo da comunidade Hugging Face, 13 de junho de 2024.

[^lai-projected]:
    Jim Lai, [Projected Abliteration](https://huggingface.co/blog/grimjim/projected-abliteration),
    artigo da comunidade Hugging Face, 25 de outubro de 2025.

[^lai-norm]:
    Jim Lai, [Norm-Preserving Biprojected Abliteration](https://huggingface.co/blog/grimjim/norm-preserving-biprojected-abliteration),
    artigo da comunidade Hugging Face, 6 de novembro de 2025.

[^mpoa-name]:
    Jim Lai, [anúncio da adoção do termo Magnitude-Preserving Orthogonal
    Ablation](https://huggingface.co/posts/grimjim/803126534676334), publicação no Hugging Face, 18
    de novembro de 2025.

[^false-refusal]:
    Xinpeng Wang et al., [Surgical, Cheap, and Flexible: Mitigating False Refusal in Language Models
    via Single Vector Ablation](https://arxiv.org/abs/2410.03415), arXiv:2410.03415.

[^harmfulness]:
    Jiachen Zhao et al., [LLMs Encode Harmfulness and Refusal
    Separately](https://arxiv.org/abs/2507.11878), arXiv:2507.11878.

[^defense]:
    Harethah Abu Shairah et al., [An Embarrassingly Simple Defense Against LLM Abliteration
    Attacks](https://arxiv.org/abs/2505.19056), arXiv:2505.19056.
