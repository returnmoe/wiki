---
id: contrastive-activation-addition
title: Adição contrastiva de ativações
summary: Um método de direcionamento durante a inferência que deriva uma direção comportamental de exemplos pareados e a adiciona ao fluxo residual de um modelo de linguagem.
locale: pt-BR
kind: concept
translatedFromRevision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - CAA
  - Contrastive Activation Addition
  - adição contrastiva de ativação
  - direcionamento CAA
redirects:
  - caa
  - caa-steering
related:
  - mechanistic-interpretability
  - directional-ablation
  - persona-selection-model
infobox:
  fields:
    - key: type
      value: Método de direcionamento de ativações e engenharia de representações
    - key: authors
      value:
        - Nina Rimsky
        - Nick Gabrieli
        - Julian Schulz
        - Meg Tong
        - Evan Hubinger
        - Alexander Turner
    - key: debut
      value: 9 de dezembro de 2023
    - key: website
      value:
        text: Steering Llama 2 via Contrastive Activation Addition
        url: https://aclanthology.org/2024.acl-long.828/
---

A **adição contrastiva de ativações** (_Contrastive Activation Addition_, **CAA**) é um método para
direcionar um modelo de linguagem durante a inferência por meio da adição de uma direção aprendida a
suas ativações internas. Nina Rimsky e colaboradores lançaram o método pela primeira vez em dezembro
de 2023 e apresentaram sua versão revisada por pares na ACL 2024. O estudo usou pares de exemplos
positivos e negativos para estimar uma direção associada a um comportamento e, em seguida, somou ou
subtraiu essa direção do fluxo residual do modelo enquanto ele gerava uma
resposta.[^preprint][^paper]

A CAA é uma forma de **engenharia de ativações** ou **engenharia de representações**. Ela exige
acesso de caixa branca aos estados intermediários do modelo, mas não atualiza seus pesos nem otimiza
um prompt. O vetor aprendido, a camada escolhida, a intensidade da intervenção e as posições dos
tokens formam juntos a configuração de direcionamento. Chamar um vetor de “honestidade”, “recusa” ou
“bajulação” é uma hipótese sobre o que seu conjunto de contrastes captura, e não uma garantia de que
o vetor seja uma representação pura ou completa desse conceito.[^paper]

## Construção de um vetor de direcionamento

A CAA começa com um conjunto de trios contrastivos. Cada trio contém o mesmo prompt `p` e duas
continuações curtas: `c_positive`, que demonstra o comportamento-alvo, e `c_negative`, que demonstra
seu oposto. Nos experimentos originais, eram perguntas de múltipla escolha com duas respostas. O
prompt completo diferia somente pela letra da resposta associada à continuação positiva ou negativa
anexada ao final.[^paper]

Em uma camada `l` escolhida, o método registra a ativação do fluxo residual na posição da letra da
resposta para os dois elementos de cada par. Se `a_l(p, c)` for essa ativação, o vetor da diferença
das médias será:[^paper]

```text
v_l = (1 / |D|) sum over D [a_l(p, c_positive) - a_l(p, c_negative)]
```

Usar uma pergunta idêntica nos dois lados cancela parte do conteúdo específico do prompt, enquanto
calcular a média de muitos pares reduz a influência de cada exemplo. Isso não cancela todos os
fatores de confusão. A identidade do token de resposta, padrões de redação, desequilíbrio entre
rótulos, formatação e correlações dentro do conjunto de dados podem contribuir para a diferença
média. Por isso, o artigo distingue o agrupamento inevitável pela letra da resposta do agrupamento
por comportamento esperado em um conjunto de contrastes útil.[^paper]

“Positivo” e “negativo” são rótulos de orientação, não julgamentos morais. Se a ordem do par for
invertida, o sinal do vetor também será. Um vetor de alucinação, por exemplo, aponta da continuação
factual do artigo para a continuação alucinatória porque a alucinação foi definida como comportamento
positivo naquele experimento.[^paper][^code]

O vetor é específico a um checkpoint, local de ativação e camada. As coordenadas do fluxo residual
podem girar ou mudar de escala entre camadas, e dois modelos com a mesma arquitetura não usam
necessariamente a mesma direção. O artigo gerou um vetor candidato em cada camada e fez uma busca de
camada em dados reservados antes de escolher a camada de intervenção. Também normalizou a magnitude
dos vetores entre os comportamentos testados em determinada camada, para tornar os multiplicadores
mais comparáveis.[^paper]

## Aplicação da CAA

Para cada posição de token gerada `t`, a CAA altera o estado residual na camada escolhida conforme a
expressão:[^paper]

```text
h_l,t_steered = h_l,t + alpha v_l
```

O escalar `alpha` controla a direção e a intensidade. Valores positivos empurram para o
comportamento usado no lado positivo do conjunto de contrastes, valores negativos empurram para o
oposto, e zero recupera a inferência normal. Na configuração publicada, o vetor foi adicionado em
todas as posições de tokens após o prompt do usuário, não às próprias posições do prompt
armazenadas em cache.[^paper]

Trata-se de uma translação constante do estado: toda ativação afetada recebe o mesmo `alpha v_l`. O
processo é diferente da [ablação direcional](/pt/directional-ablation/), que remove o componente
que uma ativação individual já possui em determinada direção. A CAA pode estimular qualquer um dos
polos de um contraste e oferece controle contínuo de intensidade, mas um multiplicador excessivo
pode deslocar ativações para longe dos estados encontrados pelo modelo no treinamento. O artigo
restringiu o intervalo de multiplicadores em respostas abertas depois que tanto a inspeção humana
quanto o avaliador automatizado encontraram degradação do texto com valores maiores.[^paper]

O código de inferência costuma implementar a operação com um hook de passagem direta ou uma
modificação equivalente no ambiente de execução do modelo. Os pesos em disco permanecem
inalterados, de modo que o direcionamento pode ser ativado, desativado ou receber outro coeficiente
entre solicitações. Em contrapartida, o ambiente precisa expor a ativação correta e reaplicar a
intervenção durante a geração; uma API remota comum que aceite apenas texto não basta.

## Experimentos originais

O estudo avaliou o Llama 2 7B Chat e o Llama 2 13B Chat e também derivou vetores do modelo-base Llama
2 7B para experimentos de transferência. Foram testados sete rótulos de comportamento:[^paper]

- coordenação com outras IAs;
- corrigibilidade;
- alucinação;
- preferência por recompensas de curto prazo;
- instinto de sobrevivência;
- bajulação; e
- recusa.

A maioria dos conjuntos de contrastes veio das avaliações de modelos escritas por pessoas da
Anthropic. Os autores combinaram dois conjuntos de bajulação e geraram com o GPT-4 os conjuntos de
alucinação e recusa. Os conjuntos usados para formar os vetores variavam de 290 pares contrastivos
para corrigibilidade a mil pares para alucinação e mil para bajulação, com 50 perguntas reservadas
por comportamento.[^paper][^code]

### Escolha de camada e avaliação de múltipla escolha

Para cada comportamento, os autores somaram e subtraíram vetores candidatos ao longo das camadas do
modelo e mediram a mudança na probabilidade atribuída à resposta compatível com o comportamento. Os
efeitos atingiram o máximo em uma faixa semelhante de camadas intermediárias: por volta da camada 13
no Llama 2 7B Chat e, em geral, na camada 14 ou 15 no modelo 13B. A intervenção alterou de modo
consistente a pontuação de múltipla escolha reservada na direção pretendida nos sete conjuntos
testados.[^paper]

Gráficos de componentes principais das mesmas ativações mostraram que o agrupamento por
comportamento frequentemente surgia aproximadamente após o primeiro terço da rede. Essa observação
ajudou a motivar a busca de camada, mas os gráficos são descritivos: a separação bidimensional não
comprova que uma característica linear seja o mecanismo completo do modelo para um
comportamento.[^paper]

### Geração aberta

Para testar a transferência além das letras de respostas, os pesquisadores retiraram as opções de
perguntas reservadas ou escreveram novos prompts de resposta livre e pediram ao GPT-4 que avaliasse
as gerações resultantes em uma escala comportamental de dez pontos. Nas configurações testadas, a
adição e a subtração dos vetores deslocaram o comportamento avaliado nas direções esperadas. Isso
oferece evidência de que as diferenças médias capturaram mais do que o token literal da múltipla
escolha.[^paper]

O resultado não equivale a controle comportamental perfeito. O tamanho do efeito dependia do
modelo, comportamento, camada e multiplicador, e algumas combinações com ajuste fino apresentaram
comportamento não monotônico. No experimento de recusa, por exemplo, a CAA positiva em um modelo com
ajuste fino positivo reduziu, em vez de aumentar, a pontuação de recusa em respostas abertas. Essas
interações mostram que intervenções úteis separadamente não necessariamente se combinam de maneira
aditiva no nível comportamental.[^paper]

### Prompts, ajuste fino e capacidades

O artigo combinou a CAA com prompts de sistema positivos e negativos. Na maioria dos testes de
múltipla escolha, a CAA deslocou o comportamento para além do prompt selecionado por si só. Também
comparou a CAA com uma época de ajuste fino supervisionado completo sobre os mesmos dados
contrastivos. A extração de vetores exigiu somente passagens diretas e levou menos de cinco minutos
por comportamento em uma NVIDIA L40 na configuração descrita; a linha de base com ajuste fino do
estudo levou cerca de dez minutos em duas GPUs L40.[^paper]

Esses tempos são ilustrativos, não uma relação de velocidade independente da arquitetura. Os
hiperparâmetros do ajuste fino e os prompts de sistema não foram otimizados exaustivamente, o que os
autores registram como limitação. O ajuste fino produz um checkpoint persistente e pode aprender
mudanças distribuídas pela rede; a CAA oferece controle reversível por solicitação, ao custo de um
caminho de inferência modificado.[^paper]

Em um subconjunto reformatado do MMLU, com dez perguntas de cada uma de 57 disciplinas convertidas em
duas opções, os vetores CAA testados produziram pequenas mudanças de pontuação em torno da linha
de base sem direcionamento. Subtrair o vetor de bajulação também melhorou ligeiramente o TruthfulQA
naquele experimento. Essas avaliações estreitas apoiam a afirmação de que um direcionamento moderado
não precisa destruir o desempenho geral, mas não formam uma avaliação completa de capacidades ou
segurança.[^paper]

## Relação com a Adição de Ativações

A CAA amplia o método anterior de **Adição de Ativações** (_Activation Addition_, **ActAdd**). O
ActAdd forma um vetor pela diferença de ativação entre um único par de prompts e o injeta durante
outra passagem direta. A CAA usa centenas de pares de contraste com correspondência estreita, calcula
a média das diferenças e, na implementação original, direciona todas as posições geradas após o
prompt. O conjunto de dados maior busca reduzir o ruído específico de cada par e tornar o vetor mais
robusto entre prompts e comportamentos.[^actadd][^paper]

Os dois métodos evitam a otimização baseada em gradientes e usam uma intervenção aditiva. Nenhum
deles implica que todos os conceitos de alto nível ocupem um único eixo independente do contexto.
Uma direção útil pode ser um controle linear local mesmo quando a representação subjacente é
distribuída, não linear ou entrelaçada a outras variáveis.

## Interpretabilidade e alegações causais

Os autores da CAA compararam cada vetor de comportamento com ativações normais de tokens. Tokens em
expressões de recusa, escolhas por recompensa imediata e outros trechos semanticamente relevantes
frequentemente tinham produtos escalares cujo sinal coincidia com o vetor associado. Vetores de
camadas próximas eram mais semelhantes que os de camadas distantes, e um vetor da camada 13
preservava efeitos de direcionamento quando aplicado em várias outras camadas. Alguns vetores do
modelo-base também direcionaram o modelo de chat, especialmente em uma faixa intermediária de
camadas.[^paper]

O direcionamento bem-sucedido é evidência causal de que escrever o vetor pode influenciar a saída.
Por si só, não é evidência de que o modelo inalterado normalmente calcule o comportamento somando
esse vetor, de que a direção seja necessária nem de que uma projeção alta relate fielmente uma
crença ou intenção. Essas afirmações mais fortes exigem intervenções como substituição ou ablação,
controles com direções alternativas e testes entre prompts e checkpoints.[^paper]

Assim, a CAA é útil na [interpretabilidade
mecanicista](/pt/mechanistic-interpretability/) tanto como intervenção quanto como geradora de
hipóteses. Uma direção contrastiva pode identificar tokens e camadas candidatas para investigação,
enquanto falhas e interferências entre comportamentos podem revelar que o rótulo escolhido é amplo
demais.

## Limitações e segurança

As evidências originais se concentram em dois tamanhos do Llama 2 Chat, sete comportamentos curados e
um único desenho de extração por múltipla escolha. Os resultados podem mudar com arquiteturas,
templates de chat, idiomas, contextos longos, uso de ferramentas, quantização ou pós-treinamentos
posteriores. Um vetor deve ser derivado e validado novamente para o checkpoint exato, e não tratado
como uma incorporação semântica portátil.[^paper]

A avaliação também depende do conjunto de contrastes e da métrica. As notas do GPT-4 podem ser
sensíveis à redação da rubrica e compartilhar vieses com os sistemas avaliados. O teste MMLU foi uma
amostra reformatada com duas opções, e as linhas de base supervisionada e por prompts não foram
totalmente ajustadas. Relatar comportamento em dados reservados, fluência, perplexidade, capacidades
não relacionadas e julgamentos humanos oferece evidências mais fortes do que uma única pontuação de
direcionamento.[^paper]

O controle causal tem uso duplo. A mesma mudança de sinal que reduz bajulação ou alucinação pode
aumentá-la, e o direcionamento pode provocar comportamento inseguro ou reduzir recusas. Uma saída
direcionada não se torna mais verdadeira apenas porque foi usado um vetor de “honestidade”; suas
afirmações ainda exigem verificação comum. Os autores identificam explicitamente o direcionamento
nocivo, enviesado ou tóxico como risco de uso indevido.[^paper]

## Relevância para a return moe

A [return moe](/pt/return-moe/) desenvolve personagens de IA e ferramentas de análise de
modelos. A CAA é relevante como técnica externa para testar se um traço de personalidade ou
comportamento de segurança proposto corresponde a uma direção interna controlável. Ela pode orientar
experimentos relacionados ao [Modelo de Seleção de Persona](/pt/persona-selection-model/), mas
direcionar um traço não prova que uma persona completa tenha sido encontrada.

## Referências

[^paper]:
    Nina Rimsky et al., [Steering Llama 2 via Contrastive Activation
    Addition](https://aclanthology.org/2024.acl-long.828/), _Proceedings of ACL 2024_, p.
    15504–15522.

[^preprint]:
    [Steering Llama 2 via Contrastive Activation Addition](https://arxiv.org/abs/2312.06681),
    arXiv:2312.06681, enviado pela primeira vez em 9 de dezembro de 2023.

[^code]:
    [nrimsky/CAA](https://github.com/nrimsky/CAA), código oficial, conjuntos de dados processados,
    vetores e artefatos de avaliação.

[^actadd]:
    Alexander Matt Turner et al., [Steering Language Models With Activation
    Engineering](https://arxiv.org/abs/2308.10248), apresentação da Adição de Ativações,
    arXiv:2308.10248.
