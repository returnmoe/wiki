---
id: anthropic
title: Anthropic
summary: Uma empresa norte-americana de IA de benefício público que desenvolve a família de modelos Claude e pesquisa alinhamento, interpretabilidade e segurança de modelos de fronteira.
locale: pt-BR
kind: company
translatedFromRevision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - Anthropic PBC
  - Anthropic AI
redirects:
  - anthropic-pbc
related:
  - mechanistic-interpretability
  - jacobian-lens
  - persona-selection-model
  - model-training
  - model-context-protocol
infobox:
  fields:
    - key: type
      value: Sociedade de benefício público de Delaware
    - key: founded
      value: Início de 2021
    - key: founders
      value:
        - Dario Amodei
        - Daniela Amodei
        - Tom Brown
        - Jack Clark
        - Jared Kaplan
        - Sam McCandlish
        - Christopher Olah
    - key: headquarters
      value: São Francisco, Califórnia, Estados Unidos
    - key: key_people
      value:
        - Dario Amodei (diretor-executivo)
        - Daniela Amodei (presidente)
    - key: industry
      value: Inteligência artificial
    - key: status
      value: Ativa; empresa de capital fechado em julho de 2026
    - key: website
      value:
        text: anthropic.com
        url: https://www.anthropic.com/
---

A **Anthropic** é uma empresa norte-americana de inteligência artificial que desenvolve a família
proprietária de modelos de linguagem **Claude** e realiza pesquisas sobre alinhamento de IA,
interpretabilidade, avaliação de modelos e efeitos sociais da IA avançada. Foi fundada no início de
2021 por ex-integrantes da OpenAI e é dirigida pelos irmãos Dario Amodei, seu diretor-executivo, e
Daniela Amodei, sua presidente.[^series-b][^founders]

A Anthropic é uma **sociedade de benefício público** (_public benefit corporation_, **PBC**) com fins
lucrativos registrada em Delaware, e não um instituto de pesquisa sem fins lucrativos. Seu propósito
de benefício público declarado é desenvolver e manter IA avançada de modo responsável para o
benefício da humanidade no longo prazo. A empresa combina essa missão com produtos comerciais,
acionistas privados, grandes compromissos de infraestrutura e investidores
institucionais.[^company][^ltbt]

“Anthropic” e “Claude” não são nomes intercambiáveis. Anthropic é a organização; Claude é sua família
de modelos e produtos. A empresa também desenvolve softwares como o Claude Code, publica pesquisas,
opera uma API e deu origem ao [Model Context Protocol](/pt/model-context-protocol/).

## Fundação

A Anthropic começou a operar no início de 2021, depois que um grupo de pesquisadores e executivos
deixou a OpenAI. Os sete fundadores geralmente identificados em reportagens da época são Dario e
Daniela Amodei, Tom Brown, Jack Clark, Jared Kaplan, Sam McCandlish e Christopher Olah.[^founders]
Suas especialidades anteriores incluíam treinamento de modelos de linguagem em grande escala,
políticas públicas, leis de escala e [interpretabilidade
mecanicista](/pt/mechanistic-interpretability/).

A empresa anunciou um financiamento de US$ 124 milhões em maio de 2021 e declarou que se concentraria
inicialmente em pesquisas sobre sistemas de IA gerais, confiáveis e direcionáveis. Uma rodada Série
B de US$ 580 milhões, em abril de 2022, financiou infraestrutura experimental em grande escala para
pesquisas de robustez, capacidade de direcionamento e interpretabilidade.[^funding][^series-b] Esses primeiros
anúncios já expressavam a estratégia que continuaria definindo a Anthropic: treinar modelos próximos
à fronteira de capacidades, tanto como sistemas comerciais quanto como objetos experimentais para
pesquisas de segurança.

Os fundadores da Anthropic costumam explicar sua saída da OpenAI em termos de confiança, valores e
missão compartilhados, sem publicar um relato completo da divergência. Reportagens relacionaram a
separação a diferenças sobre governança e sobre a rapidez com que sistemas cada vez mais capazes
deveriam ser comercializados, mas esses relatos não devem ser tratados como uma única versão
documentada da fundação.[^time-profile]

## Claude e outros produtos

A Anthropic apresentou o Claude publicamente em 14 de março de 2023, depois de um período fechado
com parceiros iniciais. O Claude foi oferecido por uma interface de chat e uma API para
desenvolvedores, com usos em resumo, respostas a perguntas, escrita, programação e outras tarefas de
linguagem.[^claude-launch] Ao contrário de um modelo de pesos abertos, um checkpoint de produção do
Claude não é distribuído para execução ou inspeção local. O acesso aos modelos ocorre pelos serviços
da Anthropic ou por plataformas de nuvem compatíveis; as fichas de sistema divulgam avaliações
selecionadas independentes da arquitetura, métodos de treinamento e riscos, mas não os pesos e o
corpus de treinamento completos.

O lançamento do Claude 3, em março de 2024, estabeleceu três categorias recorrentes de produtos:

- **Haiku**, otimizado para velocidade e menor custo;
- **Sonnet**, destinado a equilibrar capacidade, velocidade e preço; e
- **Opus**, a categoria de maior capacidade.[^claude-3]

Essas são classes de produtos, não arquiteturas fixas. Seus números de versão podem avançar de forma
independente. Em julho de 2026, lançamentos recentes incluíam Claude Sonnet 5, Claude Opus 4.8 e o
mais capaz Claude Fable 5.[^sonnet-5][^opus-48][^fable-launch] Rankings de modelos e preços mudam
rapidamente; portanto, um aplicativo deve selecionar um identificador exato de modelo e consultar a
ficha de sistema atual, em vez de depender apenas do nome da categoria.

O **Claude Code** é a ferramenta agêntica de desenvolvimento de software da Anthropic. Surgiu como
uma prévia de pesquisa em linha de comando e se tornou disponível em geral com os modelos Claude 4,
em maio de 2025, com integrações para terminal, editor e fluxos em segundo plano.[^claude-4] É um
produto construído em torno de modelos Claude, ferramentas, permissões e um ciclo de agente de
software — não um modelo fundacional separado.

A Anthropic lançou o **[Model Context Protocol](/pt/model-context-protocol/)** (**MCP**) em
novembro de 2024 como protocolo aberto para conectar aplicativos de IA a ferramentas e fontes de
dados por uma interface cliente-servidor comum.[^mcp] Mais tarde, a empresa doou o MCP à Agentic AI
Foundation, um fundo administrado pela Linux Foundation e criado em parceria com a Block e a
OpenAI.[^mcp-donation]
Apesar de sua origem, o MCP é neutro quanto ao modelo: clientes e servidores não precisam usar o
Claude.

O Claude também está disponível pelo Amazon Bedrock, Google Cloud Vertex AI e Microsoft Azure. A
distribuição em nuvem permite que clientes usem o Claude dentro dos controles de identidade,
cobrança, região e conformidade de um provedor existente, mas acrescenta outra camada contratual e
técnica entre o cliente e o modelo.[^amazon][^cloud-compute][^microsoft-nvidia]

## Pesquisa

A Anthropic divide grande parte de seu trabalho de segurança em **capacidades de alinhamento**, que
tentam tornar modelos mais seguros ou controláveis, e **ciência do alinhamento**, que investiga se
esses métodos funcionam e como falhas podem surgir com o aumento das capacidades. Seus trabalhos
publicados também abrangem avaliação de ameaças de fronteira, red teaming, bem-estar de modelos,
segurança, efeitos econômicos e políticas públicas.[^core-views]

### IA Constitucional

A **IA Constitucional** é a contribuição de treinamento mais conhecida da Anthropic. No método
original, uma lista escrita de princípios orienta um modelo a criticar e revisar suas próprias
respostas. Uma etapa supervisionada treina sobre as revisões; em uma etapa de preferências, um
modelo compara respostas candidatas segundo os princípios, produzindo **aprendizado por reforço com
feedback de IA** (**RLAIF**). Pessoas ainda escolhem a constituição, a configuração de treinamento e
os critérios de avaliação, mas não precisam rotular diretamente todos os pares de saídas
nocivas.[^constitutional-ai]

A palavra “constituição” é uma analogia, não uma afirmação de que o documento tenha autoridade
democrática ou jurídica. Seus efeitos dependem dos princípios incluídos, de como conflitos são
resolvidos, do que o modelo de feedback compreende e dos comportamentos medidos pelas avaliações. A
Anthropic publicou várias versões e experimentos com participação pública; o comportamento do
Claude em produção também depende de outras etapas de [treinamento de
modelos](/pt/model-training/), prompts de sistema, proteções durante a execução e políticas do
produto.

### Interpretabilidade e ciência do alinhamento

A interpretabilidade faz parte da identidade de pesquisa da Anthropic desde sua fundação. Trabalhos
associados a seus pesquisadores ajudaram a desenvolver a explicação da superposição para
características polissêmicas, aplicaram autoencoders esparsos em escala a modelos de linguagem de
fronteira e construíram grafos de atribuição destinados a rastrear partes do cálculo de um modelo.
A Anthropic lançou ferramentas abertas para aplicar uma versão de rastreamento de circuitos a
modelos compatíveis de pesos abertos.[^circuit-tools]

Esse trabalho é influente, mas parcial. Características esparsas e grafos de atribuição são modelos
explicativos ajustados, com erro de reconstrução e escolhas metodológicas; não são o código-fonte
completo do comportamento de uma rede neural. As próprias publicações da Anthropic apresentam a
interpretabilidade escalável como um problema científico e de engenharia ainda aberto, não como uma
verificação de segurança resolvida.[^interpretability-engineering]

Duas propostas de pesquisa de 2026 abordadas em outros artigos desta wiki ilustram a amplitude do
programa. O [Modelo de Seleção de Persona](/pt/persona-selection-model/) trata o comportamento do
assistente após o pós-treinamento como seleção e refinamento de uma persona de Assistente semelhante
a uma personagem. A [lente jacobiana](/pt/jacobian-lens/) usa efeitos médios de primeira ordem a
jusante para ler e intervir em direções intermediárias ligadas ao vocabulário.[^psm][^j-lens] Ambos
são modelos de pesquisa com limitações declaradas que abordam apenas partes do comportamento dos
modelos.

## Governança

### Sociedade de benefício público e trust

O status de PBC de Delaware permite que o conselho da Anthropic equilibre os interesses dos
acionistas, o benefício público especificado pela empresa e os interesses de pessoas materialmente
afetadas por sua conduta. Ele não elimina acionistas, lucros, controle executivo ou incentivos
comerciais comuns.[^ltbt]

A Anthropic acrescentou à governança corporativa um **Long-Term Benefit Trust** (**LTBT**) separado.
O trust foi projetado como um órgão sem interesse financeiro, com poder para selecionar e remover
parte do conselho. Sua autoridade deveria aumentar ao longo do tempo, até alcançar a maioria do
conselho. Em abril de 2026, a Anthropic declarou que integrantes nomeados pelo trust haviam chegado a
essa maioria.[^ltbt][^narasimhan] A página atual de governança da empresa relaciona integrantes do
conselho e responsáveis pelo trust, ao mesmo tempo em que destaca que tanto acionistas quanto o LTBT
elegem membros do conselho.[^company]

O LTBT é um mecanismo institucional, não um órgão regulador independente nem uma garantia de
resultados seguros. A própria Anthropic descreveu a estrutura como um experimento. Seus documentos
de fundação incluem disposições para emendas e supermaiorias, e o trust depende de informações e
processos de avaliação fornecidos em parte pela empresa.[^ltbt]

### Política de Escala Responsável

A **Responsible Scaling Policy** (**RSP**, ou Política de Escala Responsável), publicada pela
primeira vez em setembro de 2023, vincula capacidades avaliadas dos modelos a salvaguardas graduais
de segurança e implantação chamadas **AI Safety Levels**. Seus limites se concentram sobretudo em
riscos de uso catastrófico e autonomia. Versões posteriores acrescentaram relatórios de risco,
processos de garantia, comunicação interna e mecanismos de revisão externa.[^rsp]

A política mudou várias vezes à medida que a Anthropic ganhou experiência em sua implementação. A
versão 3.2 entrou em vigor em 29 de abril de 2026 e ampliou o papel do LTBT ao solicitar revisão
externa e aprovar a escolha de responsáveis por ela. A versão 3.3 entrou em vigor em 26 de maio e
revisou um limite de capacidade relacionado a armas químicas e biológicas e o processo de
atualizações extraordinárias de risco de modelos. A versão atual, 3.4, entrou em vigor em 8 de
julho. Ela revisou o limite para pesquisa e desenvolvimento automatizados, as regras de distribuição
e datação de relatórios de risco, a indicação pública de trechos omitidos e a forma como uma revisão
externa pode ser dividida entre responsáveis.[^rsp] Revisões podem ser úteis quando ameaças e
métodos de avaliação mudam, mas também significam que um compromisso da RSP deve ser lido na versão
aplicável a uma determinada decisão de treinamento ou implantação. A política é um compromisso da
empresa, não um regime legal de licenciamento, e grande parte de suas evidências é produzida ou
encomendada pela Anthropic.

Fichas de sistema, avaliações de capacidades, relatórios de red team e a RSP tornam públicas mais
informações do que uma simples alegação sobre o produto. Ainda assim, não podem comprovar a ausência
de um modo de falha desconhecido. O Claude pode alucinar, sofrer jailbreak, lidar incorretamente com
instruções ambíguas ou usar ferramentas de modo inadequado; a “segurança” de um modelo é condicionada
ao modelo de ameaças, aos controles de implantação e às evidências testadas.

## Financiamento e infraestrutura computacional

Treinar e servir modelos de fronteira exige capital, chips especializados, data centers e
capacidade de nuvem de longo prazo. Os investimentos da Amazon na Anthropic chegaram a US$ 8
bilhões em novembro de 2024; a Amazon continuou como acionista minoritária, e a AWS se tornou a
principal parceira de nuvem e treinamento da Anthropic.[^amazon] A Anthropic também usa TPUs do
Google e GPUs da NVIDIA e ampliou a distribuição do Claude ao Microsoft Azure, seguindo uma
estratégia computacional multiplataforma apesar do status da AWS como parceira
principal.[^cloud-compute][^microsoft-nvidia]

Essas relações combinam investimento, distribuição de modelos, colaboração em chips e grandes
compromissos de compra. Elas não tornam Amazon, Google, Microsoft ou NVIDIA controladoras da
Anthropic. Criam, porém, dependências mútuas: a Anthropic precisa de uma oferta enorme de capacidade
computacional, enquanto os provedores de nuvem usam o Claude para atrair clientes às suas
plataformas.

Em 28 de maio de 2026, a Anthropic anunciou um financiamento Série H de US$ 65 bilhões, com
avaliação pós-investimento de US$ 965 bilhões.[^series-h] A avaliação de uma rodada privada é um
preço implícito da transação, não uma capitalização em bolsa nem uma medida independente de valor
social. Em 1º de junho, a empresa apresentou confidencialmente uma minuta de Formulário S-1 para
uma possível oferta pública inicial. O envio iniciou um processo regulatório, mas não tornou a
Anthropic uma empresa de capital aberto.[^s1] Portanto, a Anthropic continuava sendo uma empresa de
capital fechado em 12 de julho de 2026.

## Críticas e controvérsias

### Abertura e concentração

A Anthropic sustenta que treinar modelos de fronteira é necessário tanto para estudar seus riscos
quanto para competir em segurança. A mesma estratégia concentra o acesso a modelos, pesos não
publicados, dados de treinamento e infraestrutura de avaliação dentro de uma empresa controlada
privadamente. Pesquisadores externos podem examinar artigos, fichas de sistema, APIs e algumas
ferramentas abertas, mas não podem reproduzir de modo independente um modelo Claude de produção com
as informações divulgadas.

Isso cria uma tensão recorrente. Manter os pesos privados pode reduzir o roubo e algumas formas de
uso irrestrito indevido, ao mesmo tempo que limita a auditoria independente, o controle
local e a replicação científica. O sucesso comercial financia pesquisas e salvaguardas de
implantação, enquanto exigências de investidores e clientes podem aumentar a pressão para treinar e
lançar modelos rapidamente. O status de PBC, o LTBT e a RSP buscam administrar esses incentivos; sua
eficácia deve ser julgada pelas decisões e evidências, e não pelos rótulos organizacionais.

### Direitos autorais e dados de treinamento

Autores processaram a Anthropic pelo uso de livros no desenvolvimento de modelos. Em _Bartz v.
Anthropic_, um tribunal federal de primeira instância decidiu em junho de 2025 que o uso dos livros
em questão para treinar os modelos de linguagem da empresa constituía uso justo diante daqueles
fatos. A mesma decisão concluiu que baixar e manter cópias pirateadas para montar uma biblioteca
central não se justificava como uso justo.[^bartz-order] São conclusões distintas: a decisão não
declarou lícita toda forma de obtenção de dados de treinamento.

Depois, a Anthropic aceitou um acordo coletivo de US$ 1,5 bilhão relativo aos livros elegíveis das
coleções LibGen e PiLiMi, com obrigações de destruir arquivos-fonte específicos. O tribunal concedeu
aprovação preliminar em 2025; a aprovação final continuava pendente após uma audiência de aprovação
do acordo
em maio de 2026.[^bartz-settlement][^settlement-status] Editoras musicais apresentaram alegações
separadas sobre letras de músicas e suposta obtenção de obras; esses processos ainda estavam ativos
em 2026.[^music-case]

### Restrições de uso militar

A Anthropic vendeu acesso ao Claude para usos governamentais e de segurança nacional, mantendo
algumas restrições de uso. Em fevereiro de 2026, tornou-se pública uma disputa com o Departamento de
Defesa dos Estados Unidos depois que a Anthropic recusou termos propostos que, segundo ela, poderiam
permitir vigilância doméstica em massa e armas totalmente autônomas. O departamento contestou a
descrição feita pela Anthropic dos usos pretendidos e classificou a empresa como risco à cadeia de
suprimentos.[^dow-statement][^dod-ap]

A Anthropic contestou a classificação, e uma juíza federal bloqueou temporariamente a ação do
Pentágono em março.[^dod-injunction] O episódio demonstra uma consequência prática da governança de
modelos no nível da empresa: uma desenvolvedora privada pode tentar restringir clientes, inclusive
governos, mas essas restrições podem entrar em conflito com o poder de contratação, as autoridades
de segurança nacional e questões democráticas sobre quem deve definir a política militar.

### Fable 5, Mythos 5 e a suspensão de junho de 2026

A Anthropic lançou o **Claude Fable 5** em 9 de junho de 2026 como primeiro integrante disponível em
geral de uma categoria de capacidade que chama de **Mythos-class**, acima da classe Opus. O Fable 5
e o **Claude Mythos 5**, de acesso restrito, usam o mesmo modelo subjacente. A diferença entre os
produtos está principalmente nas salvaguardas de implantação: o Fable encaminha solicitações em
alguns casos sensíveis de cibersegurança, biologia, química e suspeita de destilação do modelo ao
Opus 4.8, enquanto o Mythos expõe mais capacidades do modelo-base a um pequeno grupo de acesso
confiável. A Anthropic informou que esse redirecionamento foi acionado, em média, em menos de 5% das
sessões
do Fable, ao mesmo tempo que reconheceu falsos positivos em trabalhos benignos.[^fable-launch]

Isso significa que “Fable 5” descreve mais que um checkpoint. O serviço entregue inclui
classificadores de entrada, encaminhamento para modelo alternativo, monitoramento e política de
acesso. Assim, duas pessoas que enviem o mesmo prompt ao mesmo produto nominal podem receber
comportamentos de categorias diferentes de modelo, conforme a decisão de uma salvaguarda. O Mythos
5 não é apenas um modo público mais caro do Fable; sua implantação menos restrita ficou inicialmente
limitada a organizações selecionadas de defesa cibernética e infraestrutura pelo Project
Glasswing.[^fable-launch]

O lançamento também mudou o tratamento de dados nos serviços Mythos-class. A Anthropic passou a
exigir retenção por 30 dias do tráfego do Fable 5 e Mythos 5, inclusive nos produtos corporativos,
e afirmou que os registros seriam usados para monitoramento de segurança, não para treinamento de
modelos, e apagados depois desse período em quase todos os casos. A política melhora a capacidade da
provedora de detectar ataques distribuídos por muitas solicitações, mas elimina a opção de retenção
zero exigida por algumas organizações para trabalhos sensíveis.[^fable-launch]

Três dias depois do lançamento, o governo dos Estados Unidos emitiu uma diretriz de controle de
exportação que proibia o acesso ao Fable 5 e ao Mythos 5 por cidadãos estrangeiros. Como a Anthropic
afirmou não conseguir verificar imediatamente a nacionalidade de cada usuário com
confiabilidade, suspendeu os dois modelos para todos os clientes em 12 de junho. O governo citou
autoridade de segurança nacional, mas não detalhou publicamente suas evidências; a Anthropic disse
entender que a preocupação envolvia uma suposta evasão das salvaguardas cibernéticas do
Fable.[^fable-suspension][^fable-ap]

Mais tarde, a Anthropic afirmou que pesquisadores da Amazon haviam demonstrado um prompt capaz de
evitar um classificador e, em um caso, obter código de exploração como prova de conceito. A empresa
contestou que o comportamento revelasse uma capacidade exclusiva do nível Mythos, mas treinou um
classificador adicional contra o método relatado e começou a desenvolver uma estrutura comum de
gravidade de jailbreaks com parceiros da indústria e do governo. Os controles foram revogados em 30
de junho. O Fable 5 voltou a ser oferecido globalmente em 1º de julho, enquanto o acesso ao Mythos
5 permaneceu restrito a organizações aprovadas.[^fable-redeployment][^fable-framework]

O episódio expôs um dilema difícil no uso de modelos de fronteira. Classificadores durante a
execução podem tornar um modelo-base mais capaz acessível para uso amplo sem remover de forma
permanente a capacidade restrita de seus pesos, mas também podem bloquear pesquisas legítimas de
uso duplo, substituir silenciosamente o modelo por outro mais fraco e ser atacados
independentemente do modelo que protegem. A rápida intervenção do governo também mostrou que a
disponibilidade de um modelo pode depender de controles de exportação e regras de identidade, não
apenas da capacidade da provedora ou da estabilidade técnica de uma API.

## Referências

[^series-b]:
    [Anthropic raises Series B to build steerable, interpretable, robust AI systems](https://www.anthropic.com/news/anthropic-raises-series-b-to-build-safe-reliable-ai),
    Anthropic, 29 de abril de 2022.

[^founders]:
    Alex Konrad, [Anthropic's $60 billion valuation to mint seven new
    billionaires](https://www.forbes.com/sites/alexkonrad/2025/01/08/anthropic-60-billion-valuation-will-make-all-seven-cofounders-billionaires/),
    _Forbes_, 8 de janeiro de 2025.

[^company]: [Company](https://www.anthropic.com/company), Anthropic, acesso em 12 de julho de 2026.

[^ltbt]:
    [The Long-Term Benefit Trust](https://www.anthropic.com/news/the-long-term-benefit-trust),
    Anthropic, 19 de setembro de 2023.

[^funding]:
    [Anthropic raises $124 million to build more reliable, general AI systems](https://www.anthropic.com/news/anthropic-raises-124-million-to-build-more-reliable-general-ai-systems),
    Anthropic, 28 de maio de 2021.

[^time-profile]:
    Billy Perrigo, [Inside Anthropic, the AI company betting that safety can be a winning
    strategy](https://time.com/collections/time100-companies-2024/6980000/anthropic-2/), _Time_, 30
    de maio de 2024.

[^claude-launch]: [Introducing Claude](https://www.anthropic.com/news/introducing-claude), Anthropic, 14 de março de 2023.

[^claude-3]:
    [Introducing the next generation of Claude](https://www.anthropic.com/news/claude-3-family),
    Anthropic, 4 de março de 2024.

[^sonnet-5]:
    [Introducing Claude Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5), Anthropic, 30 de
    junho de 2026.

[^opus-48]:
    [Introducing Claude Opus 4.8](https://www.anthropic.com/news/claude-opus-4-8), Anthropic, 28 de
    maio de 2026.

[^fable-launch]:
    [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5),
    Anthropic, 9 de junho de 2026; atualizado em 1º de julho de 2026.

[^fable-suspension]:
    [Statement on the US government directive to suspend access to Fable 5 and Mythos
    5](https://www.anthropic.com/news/fable-mythos-access), Anthropic, 12 de junho de 2026.

[^fable-ap]:
    Matt O'Brien, [Anthropic takes its latest AI models offline after Trump administration
    order](https://apnews.com/article/anthropic-artificial-intelligence-trump-fable-mythos-d9cc7df5c02e93837d0f0bfb24d5cfd2),
    Associated Press, 13 de junho de 2026.

[^fable-redeployment]:
    [Redeploying Claude Fable 5](https://www.anthropic.com/news/redeploying-fable-5), Anthropic, 30
    de junho de 2026; atualizado em 1º de julho de 2026.

[^fable-framework]:
    [More details on Fable 5's cyber safeguards and our jailbreak
    framework](https://www.anthropic.com/news/fable-safeguards-jailbreak-framework), Anthropic, 2 de
    julho de 2026.

[^claude-4]: [Introducing Claude 4](https://www.anthropic.com/news/claude-4), Anthropic, 22 de maio de 2025.

[^mcp]:
    [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol),
    Anthropic, 25 de novembro de 2024.

[^mcp-donation]:
    [Donating the Model Context Protocol and establishing the Agentic AI
    Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation),
    Anthropic, 9 de dezembro de 2025.

[^cloud-compute]:
    [Expanding our use of Google Cloud TPUs and services](https://www.anthropic.com/news/expanding-our-use-of-google-cloud-tpus-and-services),
    Anthropic, 23 de outubro de 2025.

[^core-views]:
    [Anthropic's core views on AI safety](https://www.anthropic.com/news/core-views-on-ai-safety),
    Anthropic, 8 de março de 2023.

[^constitutional-ai]:
    Yuntao Bai et al., [Constitutional AI: Harmlessness from AI
    Feedback](https://arxiv.org/abs/2212.08073), 2022.

[^circuit-tools]:
    [Open-sourcing circuit-tracing tools](https://www.anthropic.com/research/open-source-circuit-tracing),
    Anthropic, 29 de maio de 2025.

[^interpretability-engineering]:
    [The engineering challenges of scaling interpretability](https://www.anthropic.com/research/engineering-challenges-interpretability),
    Anthropic, 13 de junho de 2024.

[^psm]:
    [The Persona Selection Model: Why AI assistants might behave like
    humans](https://alignment.anthropic.com/2026/psm/), Anthropic Alignment Science Blog, 23 de
    fevereiro de 2026.

[^j-lens]:
    Wes Gurnee et al., [Verbalizable Representations Form a Global Workspace in Language
    Models](https://transformer-circuits.pub/2026/workspace/index.html), Anthropic, 6 de julho de 2026.

[^narasimhan]:
    [Anthropic's Long-Term Benefit Trust appoints Vas Narasimhan to board of
    directors](https://www.anthropic.com/news/narasimhan-board), Anthropic, 14 de abril de 2026.

[^rsp]:
    [Anthropic's Responsible Scaling Policy](https://www.anthropic.com/responsible-scaling-policy),
    Anthropic, atualizado em 8 de julho de 2026.

[^amazon]:
    [Powering the next generation of AI development with AWS](https://www.anthropic.com/news/anthropic-amazon-trainium),
    Anthropic, 22 de novembro de 2024.

[^microsoft-nvidia]:
    [Microsoft, NVIDIA, and Anthropic announce strategic partnerships](https://www.anthropic.com/news/microsoft-nvidia-anthropic-announce-strategic-partnerships),
    Anthropic, 18 de novembro de 2025.

[^series-h]:
    [Anthropic raises $65 billion in Series H funding at $965 billion post-money
    valuation](https://www.anthropic.com/news/series-h), Anthropic, 28 de maio de 2026.

[^s1]:
    [Anthropic confidentially submits draft S-1 to the SEC](https://www.anthropic.com/news/confidential-draft-s1-sec),
    Anthropic, 1º de junho de 2026.

[^bartz-order]:
    _Bartz v. Anthropic PBC_, [Order on fair
    use](https://cases.justia.com/federal/district-courts/california/candce/3%3A2024cv05417/434709/231/0.pdf),
    nº 3:24-cv-05417 (N.D. Cal., 23 de junho de 2025).

[^bartz-settlement]:
    [Frequently asked questions](https://www.anthropiccopyrightsettlement.com/faq), administradora
    do acordo de _Bartz v. Anthropic_.

[^settlement-status]:
    Andrew Albanese, [Little drama at Anthropic's settlement
    hearing](https://www.publishersweekly.com/pw/by-topic/digital/copyright/article/100438-little-drama-at-anthropic-s-settlement-hearing.html),
    _Publishers Weekly_, 18 de maio de 2026.

[^music-case]:
    Blake Brittain, [US music publishers suing Anthropic make their case against AI fair
    use](https://content.next.westlaw.com/Document/I30b0ca70279c11f1986aeadf25d5b5ca/View/FullText.html),
    Reuters, 24 de março de 2026.

[^dow-statement]:
    [Statement from Dario Amodei on discussions with the Department of
    War](https://www.anthropic.com/news/statement-department-of-war), Anthropic, 26 de fevereiro de 2026.

[^dod-ap]:
    [Anthropic CEO says it cannot in good conscience accede to Pentagon's demands for AI
    use](https://apnews.com/article/9b28dda41bdb52b6a378fa9fc80b8fda), Associated Press, 26 de
    fevereiro de 2026.

[^dod-injunction]:
    [US judge blocks Pentagon's Anthropic blacklisting for
    now](https://www.investing.com/news/general-news/us-judge-blocks-pentagons-anthropic-blacklisting-for-now-4583980),
    Reuters, 26 de março de 2026.
