---
id: llama-pro
title: LLaMA Pro
summary: Um método de pós-pré-treinamento e uma família de modelos que acrescenta blocos Transformer inicializados como identidade e treina a capacidade adicionada em novos domínios.
locale: pt-BR
kind: concept
translatedFromRevision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - LLaMA Pro
  - LLaMA-Pro
  - Progressive LLaMA
  - expansão de blocos
redirects:
  - block-expansion
  - progressive-llama
related:
  - model-training
  - low-rank-adaptation
infobox:
  fields:
    - key: type
      value: Método de pós-pré-treinamento e família de modelos de linguagem
    - key: authors
      value:
        - Chengyue Wu
        - Yukang Gan
        - Yixiao Ge
        - Zeyu Lu
        - Jiahao Wang
        - Ye Feng
        - Ying Shan
        - Ping Luo
    - key: debut
      value: 4 de janeiro de 2024
    - key: affiliation
      value: Universidade de Hong Kong; ARC Lab, Tencent PCG; Universidade Jiao Tong de Xangai; Universidade de Língua e Cultura de Pequim
    - key: website
      value:
        text: Artigo e artefatos do LLaMA Pro
        url: https://github.com/TencentARC/LLaMA-Pro
---

O **LLaMA Pro** é um método de pós-pré-treinamento e uma família de modelos de linguagem
apresentados por Chengyue Wu e colaboradores no artigo de 2024 _LLaMA Pro: Progressive LLaMA with
Block Expansion_. O método aumenta a profundidade de um transformer pré-treinado com novos blocos
que inicialmente implementam a função identidade, congela os blocos herdados e treina somente os
blocos adicionados em um corpus de novo domínio. O objetivo é acrescentar capacidade de domínio e
reduzir a perda de capacidades gerais que pode ocorrer durante o pré-treinamento
continuado.[^paper][^preprint]

O principal artefato do artigo, o **LLaMA Pro-8.3B**, amplia o LLaMA 2 7B de 32 para 40 blocos
decodificadores e faz o pós-treinamento dos oito blocos novos em código e matemática. Um checkpoint
**LLaMA Pro-Instruct** lançado separadamente recebe depois ajuste supervisionado de instruções. São
modelos de pesquisa externos desenvolvidos pelos autores do artigo, sobretudo no ARC Lab da Tencent
PCG; não são um lançamento oficial do Meta Llama.[^paper][^model-card]

“LLaMA Pro” pode, portanto, se referir a três temas relacionados: o procedimento de expansão de
blocos, o checkpoint-base de 8,3 bilhões de parâmetros produzido com ele ou a pequena família de
experimentos posteriores, como LLaMA Pro-Instruct e Mistral-Pro. O método não está matematicamente
vinculado ao LLaMA 2, embora sua inicialização como identidade dependa dos detalhes do bloco
ampliado.[^paper][^repository]

## Motivação

Continuar o pré-treinamento em um corpus especializado pode melhorar um modelo nesse domínio, mas
atualizar todos os parâmetros também pode afastá-lo da distribuição na qual suas capacidades gerais
foram aprendidas. Esse problema é geralmente chamado de **esquecimento catastrófico**. Misturar
dados antigos e novos, reduzir a taxa de aprendizado, usar adaptadores eficientes em parâmetros ou
regularizar as mudanças pode reduzir esse conflito, mas cada escolha limita o treinamento ou
exige acesso a um corpus geral adequado.[^paper]

A expansão de blocos adota uma estratégia de crescimento da capacidade. Em vez de reescrever os
blocos pré-treinados, ela coloca cálculos treináveis entre eles. No momento da expansão, o cálculo
adicionado não muda nada, de modo que a rede ampliada começa como a mesma função do modelo-base.
Durante o pós-treinamento no domínio, os gradientes atualizam apenas os blocos adicionados. Isso
protege os pesos herdados de modificação direta e oferece ao novo corpus blocos completos de atenção
e feed-forward nos quais moldar novos cálculos.[^paper]

Congelar os pesos herdados não garante que todo comportamento anterior permaneça igual. Assim que
os novos blocos deixam de ser identidades, suas saídas alteram o fluxo residual lido por todos os
blocos posteriores. “Reduzir o esquecimento” é, portanto, um resultado empírico a avaliar, não uma
garantia matemática de que conhecimentos gerais e de domínio ocupem módulos separados.

## Expansão de blocos

Um bloco LLaMA simplificado com pré-normalização aplica atenção e uma rede feed-forward por duas
adições residuais:[^paper]

```text
x_attention = x + Attention(RMSNorm(x))
y = x_attention + FFN(RMSNorm(x_attention))
```

Para que um novo bloco seja uma identidade, os dois ramos aprendidos precisam inicialmente escrever
zero enquanto o caminho residual deixa a entrada passar. O LLaMA Pro cria um bloco copiando um bloco
existente e, depois, zera a projeção de saída da atenção `W_O` e a projeção de saída feed-forward
`W_3`:[^paper]

```text
Attention(RMSNorm(x)) = 0
FFN(RMSNorm(x_attention)) = 0
y = x
```

Os outros pesos copiados são preservados. À medida que as matrizes de saída zeradas recebem
atualizações, sinais diferentes de zero começam a fluir, e os gradientes podem alcançar o restante
do novo bloco. O artigo compara isso a zerar os pesos de escala do RMSNorm: no bloco LLaMA analisado,
essa escolha também bloquearia gradientes necessários para treinar o caminho de normalização.[^paper]

O padrão de inserção é importante. No experimento do LLaMA Pro-8.3B, os 32 blocos herdados foram
divididos em oito grupos de quatro. Uma cópia inicializada como identidade foi colocada após cada
grupo, produzindo um modelo intercalado de 40 blocos, em vez de pôr todos os oito blocos na entrada
ou na saída. Os autores argumentaram que a intercalação preserva melhor a progressão do transformer
de representações de baixo para alto nível, e a ablação no domínio jurídico favoreceu o arranjo
intercalado em comparação ao empilhamento no prefixo ou sufixo.[^paper]

## Pipeline de treinamento

A execução publicada do LLaMA Pro usou a parte em Python do Stack-dedup e o corpus Proof-Pile-2,
voltado à matemática. Os autores relatam 80 bilhões de tokens de pós-treinamento, sequências de 4.096
tokens, lote de 1.024 e 15.900 etapas do otimizador. Somente cerca de um bilhão de parâmetros nos
oito blocos adicionados eram treináveis. O treinamento usou 16 GPUs NVIDIA H800 por aproximadamente
sete dias, descritos como 2.830 horas de GPU.[^paper]

Isso produziu o checkpoint-base LLaMA Pro-8.3B, geralmente arredondado para **LLaMA-Pro-8B** nos
nomes dos artefatos. A versão ajustada para instruções foi treinada em seguida com aproximadamente um
milhão de exemplos, ou cerca de 80 milhões de tokens, reunidos de cinco fontes de instruções. Ao
contrário da etapa de expansão de blocos, esse ajuste fino supervisionado atualizou todos os blocos.
O experimento testa, portanto, se um modelo-base ampliado pode entrar em um pipeline comum de ajuste
para instruções e se seus ganhos de domínio sobrevivem ao processo.[^paper]

O repositório também aplica o procedimento ao Mistral 7B e fornece código de treinamento e
avaliação. O código-fonte do repositório usa a licença Apache-2.0, enquanto os checkpoints LLaMA Pro
lançados estão marcados com a licença do Llama 2 porque derivam do LLaMA 2. Assim, código e pesos dos
modelos têm condições de licenciamento diferentes.[^repository][^model-card]

## Resultados relatados

Na avaliação de modelos-base do artigo, o LLaMA Pro preservou resultados próximos aos do LLaMA 2 7B
nos cinco benchmarks de linguagem geral e melhorou as tarefas escolhidas de código e matemática. A
comparação também contém regressões: HellaSwag e WinoGrande, por exemplo, tiveram resultados
ligeiramente menores. Portanto, “preservou” não significa desempenho idêntico em toda
métrica.[^paper]

| Modelo       |  MMLU | GSM8K | HumanEval pass@1 | MBPP pass@1 | Média de nove tarefas |
| ------------ | ----: | ----: | ---------------: | ----------: | --------------------: |
| LLaMA 2 7B   | 46,87 | 14,48 |            13,05 |       20,09 |                 39,62 |
| LLaMA Pro 8B | 47,88 | 17,89 |            28,66 |       33,20 |                 44,23 |

O modelo ajustado para instruções foi comparado na mesma tabela com LLaMA 2 Chat, Code Llama
Instruct, WizardCoder e WizardMath e também foi avaliado com MT-Bench e MINT-Bench, que envolve uso
de ferramentas. O LLaMA Pro-Instruct registrou médias combinadas mais altas em código, matemática e
tarefas gerais do que os modelos relacionados na comparação. Esses valores estabelecem o resultado
sob as misturas de dados e a configuração de avaliação do artigo; não isolam a expansão de blocos de
diferenças nos tokens de pós-treinamento, dados de instruções, formatação dos prompts ou linhas de
base contemporâneas.[^paper]

Em uma ablação separada no domínio jurídico, adicionar mais blocos reduziu a perda de treinamento,
mas os ganhos nas tarefas posteriores não cresceram monotonicamente. Oito blocos adicionados
ofereceram o equilíbrio entre desempenho e custo preferido pelos autores. Uma linha de base
[LoRA](/pt/low-rank-adaptation/) de posto 1.024 preservou melhor as tarefas gerais selecionadas,
mas aprendeu a nova distribuição de domínio com menor eficácia, enquanto o ajuste fino completo
provocou uma queda maior nas tarefas gerais. Esses resultados dizem respeito a uma configuração
LoRA incomumente alta e não devem ser tratados como classificação universal dos métodos de
adaptação.[^paper]

## Relação com outros métodos de adaptação

A expansão de blocos difere do pré-treinamento continuado comum porque congela a rede original e
aumenta sua profundidade. Difere da LoRA por adicionar blocos transformer completos, em vez de
atualizações de baixo posto dentro de matrizes escolhidas. Os dois reduzem a quantidade de parâmetros
treináveis em relação ao ajuste fino completo, mas somente a expansão de blocos aumenta o backbone
permanentemente ativo e seu custo de inferência.[^paper]

Ela também difere da expansão por mistura de especialistas. Todo bloco inserido pelo LLaMA Pro é
executado para cada token; não existe um roteador que escolha entre especialistas de domínio. Em
princípio, um modelo poderia combinar crescimento de blocos com adaptadores, roteamento ou ajuste
fino completo posterior, mas esses híbridos teriam propriedades de treinamento e implantação
distintas.

O método é uma forma de crescimento do modelo que preserva a função somente na inicialização. Após
o pós-treinamento, os blocos adicionados geralmente não podem ser removidos sem perder sua
contribuição, e o checkpoint não é um adaptador pequeno e portátil. Servi-lo exige a arquitetura
mais profunda e todos os seus pesos.

## Limitações

O estudo principal do artigo abrange inglês, código Python e texto matemático, com um experimento
menor em texto jurídico. Ele não estabelece o mesmo equilíbrio para modelos multilíngues,
multimodais, muito maiores ou de arquiteturas diferentes. Os autores identificam explicitamente a
cobertura de idiomas e domínios como limitações de escopo.[^paper]

A expansão economiza o custo da passagem reversa e dos estados do otimizador ao congelar a maioria
dos parâmetros, mas as passagens diretas ainda atravessam blocos congelados e treináveis durante o
treinamento. Na inferência, todos os 40 blocos são executados, aumentando o uso de memória, a latência
e o cálculo em relação ao LLaMA 2 7B. A estratégia troca custo de implantação por capacidade de
domínio adicional, em vez de produzir uma especialização gratuita.[^paper]

A inicialização como identidade também tem detalhes específicos da arquitetura. As projeções que
precisam ser zeradas, a existência de vieses, a posição da normalização e o modo de copiar blocos
podem variar entre famílias de modelos. Um bloco inserido mecanicamente que não seja uma identidade
exata pode perturbar o modelo antes do treinamento, enquanto uma inicialização que bloqueie os
caminhos errados dos gradientes pode não aprender.

Por fim, preservar benchmarks não é um teste completo de esquecimento. Um modelo pode manter a
acurácia agregada e, ainda assim, mudar calibração, estilo de geração, comportamento em contextos
longos, segurança ou desempenho em exemplos fora do conjunto escolhido. As comparações devem incluir
dados gerais reservados, dados de domínio e comportamentos relevantes à implantação sob capacidade
computacional equivalente.

## Relevância para a return moe

A [return moe](/pt/return-moe/) trabalha com treinamento de modelos de linguagem e sistemas de
personagens de IA. O LLaMA Pro é relevante como exemplo externo de adição de capacidade de domínio
sem atualizar diretamente todo um backbone pré-treinado e como lembrete de que eficiência de
treinamento e eficiência de inferência são questões de projeto distintas.

## Referências

[^paper]:
    Chengyue Wu et al., [LLaMA Pro: Progressive LLaMA with Block
    Expansion](https://aclanthology.org/2024.acl-long.352/), _Proceedings of ACL 2024_, p. 6518–6537.

[^preprint]:
    [Histórico de submissão e resumo do LLaMA Pro](https://arxiv.org/abs/2401.02415),
    arXiv:2401.02415.

[^repository]:
    [TencentARC/LLaMA-Pro](https://github.com/TencentARC/LLaMA-Pro), repositório oficial de código e
    artefatos.

[^model-card]:
    [Ficha do modelo LLaMA-Pro-8B](https://huggingface.co/TencentARC/LLaMA-Pro-8B), ARC Lab, Tencent
    PCG.
