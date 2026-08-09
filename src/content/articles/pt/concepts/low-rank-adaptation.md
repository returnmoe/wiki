---
id: low-rank-adaptation
title: Adaptação de baixo posto
summary: Um método de ajuste fino eficiente em parâmetros conhecido como LoRA e os pequenos arquivos adaptadores usados para personalizar modelos Stable Diffusion e SDXL.
locale: pt-BR
kind: concept
translatedFromRevision: 1
categories:
  - research
  - artificial-intelligence
aliases:
  - LoRA
  - Low-Rank Adaptation
  - adaptação de baixo rank
  - LoRA para Stable Diffusion
  - LoRA para SDXL
redirects:
  - lora
  - lora-model
  - stable-diffusion-lora
related:
  - model-training
  - stable-diffusion
  - stable-diffusion-xl
  - stability-ai
infobox:
  fields:
    - key: type
      value: Técnica de ajuste fino eficiente em parâmetros e formato de adaptador
    - key: authors
      value:
        - Edward Hu
        - Yelong Shen
        - Phillip Wallis
        - Zeyuan Allen-Zhu
        - Yuanzhi Li
        - Shean Wang
        - Lu Wang
        - Weizhu Chen
    - key: debut
      value: '2021'
---

A **adaptação de baixo posto** (_Low-Rank Adaptation_, **LoRA**) é um método para adaptar uma rede
neural mantendo congelados seus pesos originais. Em vez de armazenar uma cópia com ajuste fino de
cada matriz grande de pesos, a LoRA aprende uma atualização de baixo posto representada por duas
matrizes muito menores. Edward Hu e colaboradores apresentaram o método para modelos de linguagem em 2021.[^lora-paper]

Nas comunidades do [Stable Diffusion](/pt/stable-diffusion/) e do [Stable Diffusion
XL](/pt/stable-diffusion-xl/), **uma LoRA** também significa o adaptador resultante: em geral, um
arquivo `.safetensors` que contém atualizações de baixo posto para partes de um modelo de imagem
compatível. Ele pode ensinar uma personagem, pessoa, objeto, traje, vocabulário de poses, estilo de
renderização, efeito de câmera ou comportamento visual mais geral. O arquivo normalmente não é um
gerador de imagens completo. Precisa ser carregado junto à arquitetura do modelo — e muitas vezes à
família específica de checkpoints — para a qual foi treinado.[^diffusers-load]

Esses dois sentidos estão relacionados, mas não devem ser confundidos:

- **LoRA, a técnica**, é uma forma geral e eficiente em parâmetros de [treinamento de
  modelos](/pt/model-training/).
- **Uma LoRA de Stable Diffusion** é um conjunto específico de pesos adaptadores, associado a
  legendas e escolhas de treinamento, pressupostos sobre o modelo-base e condições de licença.

## A atualização de baixo posto

Considere uma transformação linear pré-treinada com matriz de pesos `W`, largura de entrada `k` e
largura de saída `d`. O ajuste fino completo pode mudar todos os `d × k` valores. A LoRA congela `W`
e representa sua atualização como produto de uma matriz `d × r` e outra `r × k`:

```text
W_adapted = W + (alpha / r) BA
```

O **posto** `r` é escolhido muito menor que `d` ou `k`. Assim, o adaptador treina e armazena
aproximadamente `r(d + k)` valores para essa transformação, em vez de `dk`, além das outras camadas
que forem tratadas. A escala `alpha / r` controla a magnitude nominal da atualização. As
implementações diferem em detalhes como inicialização, dropout, escolha de camadas e incorporação ou
não da escala aos pesos salvos.[^lora-paper]

Durante o treinamento, a matriz-base continua congelada, mas os gradientes ainda atravessam a rede
até as matrizes do adaptador. Portanto, a LoRA reduz gradientes treináveis, estados do otimizador e o
armazenamento de cada variante; ela **não** elimina o custo de executar o modelo-base nem de manter
as ativações necessárias à retropropagação. A memória e a velocidade reais dependem de resolução,
tamanho do lote, precisão, módulos tratados, otimizador, checkpointing e implementação.

Na inferência, o software pode aplicar a atualização dinamicamente ou **fundi-la** aos pesos-base. O
carregamento dinâmico facilita trocar adaptadores e mudar suas escalas. A fusão pode simplificar a
execução, mas dificulta a remoção se os pesos originais não continuarem disponíveis. O Hugging Face
Diffusers permite carregar, remover da memória, nomear, ponderar, combinar, fundir e desfazer a fusão de
adaptadores LoRA.[^diffusers-load]

## LoRA no Stable Diffusion e no SDXL

A aplicação da LoRA a modelos de difusão foi uma adaptação comunitária de uma técnica demonstrada
inicialmente em transformers. O projeto pioneiro `cloneofsimo/lora` aplicou atualizações de baixo
posto às camadas de atenção do Stable Diffusion e popularizou seu treinamento, escalonamento e fusão
para gerar imagens.[^cloneofsimo][^diffusers-advanced] Ferramentas de treinamento posteriores
ampliaram os possíveis alvos e as convenções de arquivos.

Um pipeline clássico do Stable Diffusion contém um redutor de ruído U-Net, um codificador de texto e
um VAE. O SDXL possui uma U-Net maior e **dois** codificadores de texto. Uma LoRA de difusão costuma
modificar:

- projeções de atenção na **U-Net**, que participa diretamente da conversão de latentes ruidosos em
  imagens;
- outras camadas lineares ou convolucionais da U-Net, conforme a ferramenta e o método do adaptador;
  e
- opcionalmente, projeções no **codificador ou nos codificadores de texto**, alterando como tokens do
  prompt condicionam o modelo de imagem.

O VAE geralmente não faz parte de uma LoRA comum. Um arquivo com apenas adaptadores da U-Net ainda
pode aprender um conceito visual forte. Treinar adaptadores do codificador de texto pode reforçar a
associação entre palavras e esse conceito, mas consome mais memória e pode tornar o resultado menos
portátil entre estilos de prompt ou checkpoints compatíveis. Scripts de SDXL podem treinar nenhum,
um ou os dois codificadores de texto, além da U-Net; o carregador precisa compreender os prefixos de
parâmetros correspondentes.[^diffusers-api][^kohya-sdxl]

### Conteúdo do arquivo

Um arquivo típico armazena tensores nomeados das matrizes adaptadoras, valores de escala e, às vezes,
metadados sobre a configuração de treinamento. O formato `.safetensors` é comum porque contém apenas
dados tensoriais e evita a execução arbitrária de código possível ao carregar um pickle genérico de
Python.[^safetensors] Os metadados exatos não são padronizados entre todas as ferramentas e
repositórios. Por isso, apenas o nome do arquivo é uma documentação ruim.

Uma boa publicação de LoRA identifica pelo menos:

- a arquitetura-base e, de preferência, o checkpoint exato de treinamento;
- as palavras de ativação ou o padrão de legendas pretendidos;
- intensidades recomendadas de inferência e configurações do modelo;
- o tipo de conceito e limitações importantes do conjunto de dados;
- a licença do adaptador e a procedência de suas imagens de treinamento; e
- imagens de exemplo com os parâmetros completos de geração, não somente o texto do prompt.

O arquivo pode ter de alguns a centenas de megabytes, conforme o posto, as camadas tratadas, a
arquitetura e a precisão. Seu tamanho é pequeno em relação a um checkpoint de vários gigabytes, não
uma promessa de tamanho fixo.

### Compatibilidade com o modelo-base

Os tensores LoRA se conectam a camadas nomeadas de formatos específicos. **Uma LoRA do Stable
Diffusion 1.5 não é uma LoRA do SDXL.** A U-Net do SDXL é maior, e sua pilha de condicionamento de
texto é diferente; por isso, nomes e dimensões dos tensores não correspondem. Stable Diffusion 2.x e
Stable Diffusion 3 também formam outras famílias de compatibilidade.

Dois checkpoints podem compartilhar a arquitetura SDXL e ter comportamentos aprendidos muito
diferentes. Um adaptador pode carregar sem erro de formato e, ainda assim, produzir um conceito mais
fraco ou alterado porque sua base de treinamento e a base de inferência representam características
de maneiras diferentes. Para fins de reprodutibilidade, “LoRA de SDXL” é apenas o primeiro nível de
compatibilidade; o checkpoint-base exato é o segundo.

Fundir uma LoRA a um checkpoint elimina a necessidade de carregá-la separadamente, mas não a
transforma em adaptador universal nem apaga as licenças dos artefatos de origem. Fusões repetidas
também podem dificultar a reconstrução da procedência e das escalas.

## O que uma LoRA de difusão pode aprender

Alvos comuns incluem:

- uma pessoa ou personagem ficcional específica;
- um objeto, veículo, formato de produto, peça de roupa ou acessório;
- um estilo visual, técnica, paleta, iluminação ou efeito de câmera;
- uma pose, expressão, padrão de composição ou cena recorrente; e
- um comportamento, como mais detalhes ou uma trajetória destilada de amostragem em poucas etapas.

Essas categorias se sobrepõem. Um conjunto de dados de personagem pode ensinar acidentalmente o
fundo e as roupas habituais; um conjunto de estilo pode memorizar sujeitos; um conjunto de produto pode
vinculá-lo a um único ângulo de câmera. A LoRA limita a parametrização da atualização, não as
correlações que o otimizador pode aprender.

Uma **palavra de ativação** ou **palavra-gatilho** é um texto incluído deliberadamente nas legendas
para que o modelo associe um token ou sequência de tokens ao conceito de treinamento. Não é um
comando executável separado armazenado no arquivo. Se a cadeia escolhida for tokenizada em partes
comuns, seu efeito virá do treinamento desses contextos de prompt com as imagens. O nível de detalhe
das legendas determina quais propriedades são descritas explicitamente e quais o adaptador pode
absorver no gatilho.

Por exemplo, se toda imagem de uma personagem mostra um casaco vermelho e as legendas citam apenas o
token da personagem, o adaptador pode aprender o casaco como parte da identidade. Legendar o casaco
separadamente e incluir roupas variadas dá ao otimizador evidência de que os dois atributos podem
variar. Nenhuma receita de legendas garante separação perfeita; a variação do conjunto de dados é
igualmente importante.

## Escolhas de treinamento

A qualidade do treinamento não pode ser inferida apenas pelo posto ou pela quantidade de etapas.
Entre as escolhas importantes estão:

### Conjunto de dados e legendas

As imagens devem representar o conceito pretendido e variar os fatores irrelevantes. Duplicatas
quase idênticas podem dar peso excessivo a uma vista. Imagens de baixa resolução, artefatos de
compressão, marcas-d'água ou fundos repetitivos podem entrar na distribuição aprendida. As legendas
podem ser escritas manualmente, geradas e corrigidas ou montadas a partir de tags, mas devem separar
de modo consistente a identidade dos atributos que o usuário pode querer controlar depois.

Imagens de regularização ou de classe são usadas em algumas receitas de treinamento de sujeitos para
preservar uma classe ampla enquanto se aprende uma instância. Seu papel vem do objetivo de
treinamento, não da LoRA em si.

### Resolução e arquitetura

O treinamento deve corresponder à escala e ao pré-processamento esperados pelo modelo-base. O Stable
Diffusion 1.5 costuma ser treinado por volta de 512 pixels; o SDXL usa grupos de proporções em torno
de uma área de 1024 por 1024 pixels. Ampliar um conjunto minúsculo para esse tamanho não cria
detalhes ausentes. A U-Net maior e os dois codificadores do SDXL também elevam os requisitos de
memória em relação ao 1.5.[^sdxl-paper][^kohya-sdxl]

### Posto e alfa

Um posto maior amplia o espaço de possíveis atualizações e o arquivo, mas não melhora o resultado de
forma monotônica. Um estilo simples pode caber em um posto baixo; um conceito variado pode se
beneficiar de mais capacidade. Capacidade ou treinamento excessivos podem preservar detalhes
indesejados do conjunto da mesma forma que um ajuste fino completo. `alpha` interage com o posto e
a implementação; por isso, dois arquivos com a mesma intensidade exibida ao usuário não
necessariamente produzem a mesma atualização efetiva.

### Taxa de aprendizado e duração

Adaptadores da U-Net e do codificador de texto podem usar taxas de aprendizado diferentes. Pouca
otimização gera subajuste; otimização excessiva pode causar sobreajuste, distorcer o modelo-base ou
fazer todo prompt convergir para as imagens de treinamento. “Épocas”, “repetições” e “etapas” se
relacionam pelo tamanho do conjunto e do lote; relatar uma delas sem as demais é ambíguo. Amostras
periódicas e checkpoints intermediários ajudam a identificar o ponto útil antes da etapa final.

### Módulos-alvo e otimizador

Tratar mais camadas aumenta a expressividade e os estados do otimizador. Treinar apenas projeções de
atenção segue o padrão LoRA mais simples, enquanto métodos mais amplos podem adaptar convoluções ou
usar decomposições alternativas de baixo posto. Precisão mista, checkpointing de gradientes,
latentes VAE em cache e otimizadores eficientes em memória tornam possível o treinamento local, mas
cada recurso tem limitações. Latentes em cache, por exemplo, impedem aumentos de dados da imagem que
precisariam ser recalculados após a codificação.

## Uso e combinação de LoRAs

As interfaces expõem uma **intensidade do adaptador**, geralmente com `1.0` como escala nominal
treinada e `0` como ausência de efeito. Ela não é uma porcentagem de “quanto de personagem” ou
“quanto de estilo”. O intervalo útil depende do adaptador e do checkpoint-base; valores acima de um
e valores negativos podem ser aceitos, mas produzir mudanças exageradas ou pouco intuitivas.

Várias LoRAs podem ficar ativas ao mesmo tempo. No nível dos pesos, suas atualizações podem ser
somadas com escalas distintas. No nível da imagem, seus conceitos não se combinam de forma
independente: podem tratar as mesmas camadas, reforçar vieses compartilhados, disputar tokens do
prompt ou, em conjunto, empurrar o modelo para fora de uma região bem treinada. Reduzir intensidades,
simplificar o prompt ou aplicar conceitos em etapas separadas de imagem para imagem e preenchimento
de regiões pode ser mais confiável que empilhar muitos adaptadores na intensidade total.

Nomes e pesos dinâmicos dos adaptadores fazem parte da reprodutibilidade. Duas interfaces podem
interpretar a sintaxe da LoRA de maneiras diferentes, e uma pode aplicar a escala do codificador de
texto de modo distinto da escala da U-Net. Salvar o hash do modelo, os hashes dos adaptadores, a
versão do software, o fluxo, a semente e as configurações de geração é mais seguro do que depender
de uma captura de tela do prompt.

## Relação com outros métodos de adaptação

Os termos a seguir respondem a perguntas diferentes e, em alguns casos, podem ser combinados:

| Artefato ou método                      | O que muda ou é adicionado                                    | Uso comum                                                                            |
| --------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Checkpoint com ajuste fino completo** | Muitos ou todos os pesos do modelo-base                       | Mudança ampla de domínio ou estilo, com capacidade máxima                            |
| **LoRA**                                | Atualizações de baixo posto anexadas a camadas escolhidas     | Tema, estilo, comportamento portátil ou especialização eficiente                     |
| **Inversão textual**                    | Um ou mais vetores aprendidos de embedding de texto           | Representação muito pequena de conceito no nível dos tokens                          |
| **DreamBooth**                          | Um objetivo e uma receita de dados para personalizar sujeitos | Vincular um identificador raro a um sujeito usando um pequeno conjunto de imagens    |
| **ControlNet**                          | Uma rede paralela de condicionamento                          | Controle espacial por pose, profundidade, bordas, segmentação e entradas semelhantes |

**DreamBooth e LoRA não são opostos.** O DreamBooth descreve como ensinar um sujeito usando um
identificador raro, exemplos da instância e um objetivo de preservação da classe; o trabalho
original ajustava os pesos do modelo. Uma implementação posterior pode usar LoRA como forma
eficiente em parâmetros de armazenar as atualizações.[^dreambooth][^diffusers-load]

A **inversão textual** otimiza embeddings que representam um conceito, mantendo o gerador congelado.
Os arquivos podem ser muito menores, mas a atualização entra pelo caminho de condicionamento de
texto e tem menos capacidade que adaptadores distribuídos pela U-Net.[^textual-inversion]

O **ControlNet** aprende a incorporar uma condição espacial por uma rede adicionada. Pode controlar
onde uma estrutura aparece sem ensinar ao modelo-base a aparência de uma nova pessoa. É comum usar
um ControlNet e uma ou mais LoRAs em conjunto.[^controlnet]

Nomes como **LoCon**, **LoHa**, **LoKr** e **LyCORIS** se referem a implementações ou decomposições
de adaptadores relacionadas. Interfaces e sites de hospedagem às vezes as agrupam sob o rótulo
informal “LoRA” por exercerem papéis semelhantes, mas seus tensores e sua matemática não são
necessariamente LoRA comum. O suporte do carregador precisa corresponder ao tipo de adaptador
salvo.[^lycoris]

## LoRA e QLoRA

A **QLoRA** não é um arquivo LoRA especialmente comprimido para Stable Diffusion. No método original
para modelos de linguagem, um modelo-base congelado é mantido em forma quantizada de 4 bits,
enquanto adaptadores LoRA de maior precisão são treinados por meio dele. Quantizar o backbone reduz a
memória; a atualização de baixo posto continua sendo a parte treinável.[^qlora-paper] O termo aparece
com muito mais frequência no treinamento de modelos de linguagem que em listagens comuns de modelos
SDXL. Uma ferramenta de difusão que use pesos quantizados ou um otimizador de 8 bits deve documentar
exatamente o que está quantizado, em vez de chamar toda configuração que economiza memória de
“QLoRA”.

## Custos e limitações

Em comparação ao ajuste fino completo, a LoRA geralmente oferece:

- conjuntos de parâmetros treináveis e salvos muito menores;
- menos memória para otimizador e gradientes;
- um modelo-base compartilhado entre muitos conceitos substituíveis;
- ajuste conveniente de intensidade e composição; e
- fusão opcional a um checkpoint de implantação.

Os custos correspondentes são:

- dependência de um modelo-base compatível;
- menor capacidade de atualização que um ajuste fino completo irrestrito;
- cálculo contínuo do backbone congelado durante o treinamento;
- interações quando vários adaptadores modificam a mesma rede; e
- um grafo maior de procedência e dependências na implantação.

Para um entusiasta, a preparação de dados e o tempo de experimento podem dominar o custo em
dinheiro. Uma execução curta em hardware próprio talvez tenha pouca despesa direta, mas pode consumir
horas de legendagem e amostragem repetida. O treinamento na nuvem transforma a compra de hardware em
tempo de GPU medido e torna execuções malsucedidas diretamente faturáveis. Em qualquer caso, salvar
adaptadores intermediários e usar um pequeno conjunto de prompts de validação custa menos que
descobrir o sobreajuste apenas após todo o cronograma.

## Licenciamento, consentimento e uso indevido

O tamanho pequeno de uma LoRA não a separa jurídica nem eticamente de suas fontes. Seu uso pode ser
limitado pela licença do modelo-base, por sua própria licença, pelos direitos sobre as imagens de
treinamento, pelo direito de imagem e pelas leis de privacidade, por regras de plataformas e pelas
saídas pretendidas.
Fundi-la a outro checkpoint não elimina essas obrigações automaticamente.

Adaptadores de pessoas reais e de artistas vivos levantam questões especialmente claras de
consentimento, imitação indevida e falsa atribuição. A semelhança técnica com alguém não comprova
autorização. Uma publicação
responsável documenta a procedência dos dados, obtém a permissão adequada, define condições claras
para as saídas e não apresenta um adaptador como endossado quando não é. Um adaptador bem rotulado
permite avaliar esses fatos; um arquivo opaco deixa incertas tanto a compatibilidade técnica quanto a
procedência.

## Referências

[^lora-paper]:
    Edward J. Hu et al., [LoRA: Low-Rank Adaptation of Large Language
    Models](https://arxiv.org/abs/2106.09685), _ICLR 2022_.

[^diffusers-load]:
    [Load adapters](https://huggingface.co/docs/diffusers/main/using-diffusers/loading_adapters),
    documentação do Hugging Face Diffusers, acesso em 12 de julho de 2026.

[^cloneofsimo]: [LoRA for Stable Diffusion](https://github.com/cloneofsimo/lora), `cloneofsimo/lora`, GitHub.

[^diffusers-advanced]:
    [Advanced diffusion training examples](https://github.com/huggingface/diffusers/blob/main/examples/advanced_diffusion_training/README.md),
    Hugging Face Diffusers, GitHub.

[^diffusers-api]:
    [API do carregador de LoRA](https://huggingface.co/docs/diffusers/main/api/loaders/lora),
    documentação do Hugging Face Diffusers.

[^kohya-sdxl]:
    [Documentação de treinamento do SDXL](https://github.com/kohya-ss/sd-scripts/blob/main/docs/train_SDXL-en.md),
    colaboradores do kohya-ss sd-scripts, GitHub.

[^safetensors]: [Safetensors](https://github.com/huggingface/safetensors), Hugging Face, GitHub.

[^sdxl-paper]:
    Dustin Podell et al., [SDXL: Improving Latent Diffusion Models for High-Resolution Image
    Synthesis](https://arxiv.org/abs/2307.01952), _ICLR 2024_.

[^dreambooth]:
    Nataniel Ruiz et al., [DreamBooth: Fine Tuning Text-to-Image Diffusion Models for Subject-Driven
    Generation](https://arxiv.org/abs/2208.12242), _CVPR 2023_.

[^textual-inversion]:
    Rinon Gal et al., [An Image is Worth One Word: Personalizing Text-to-Image Generation using
    Textual Inversion](https://arxiv.org/abs/2208.01618), _ICLR 2023_.

[^controlnet]:
    Lvmin Zhang, Anyi Rao e Maneesh Agrawala, [Adding Conditional Control to Text-to-Image Diffusion
    Models](https://arxiv.org/abs/2302.05543), _ICCV 2023_.

[^lycoris]:
    [Documentação do LyCORIS](https://github.com/KohakuBlueleaf/LyCORIS), colaboradores do LyCORIS,
    GitHub.

[^qlora-paper]:
    Tim Dettmers et al., [QLoRA: Efficient Finetuning of Quantized
    LLMs](https://arxiv.org/abs/2305.14314), _NeurIPS 2023_.
