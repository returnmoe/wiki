---
id: model-context-protocol
title: Model Context Protocol
summary: Um protocolo aberto e neutro quanto ao modelo para conectar aplicativos de IA a ferramentas, fontes de dados e templates reutilizáveis de prompts.
locale: pt-BR
kind: technology
translatedFromRevision: 1
categories:
  - software
  - artificial-intelligence
aliases:
  - MCP
  - Model Context Protocol (MCP)
redirects:
  - mcp
related:
  - anthropic
  - agentic-ai-foundation
infobox:
  fields:
    - key: developer
      value: Anthropic (criadora); governado pela comunidade sob a Agentic AI Foundation
    - key: initial_release
      value: 25 de novembro de 2024
    - key: technologies
      value:
        - JSON-RPC 2.0
        - Arquitetura sem estado de cliente, host e servidor
        - Entrada e saída padrão e HTTP com streaming
        - Negociação de capacidades por solicitação
    - key: license
      value: MIT (repositório da especificação e documentação)
    - key: status
      value: Padrão aberto ativo; versão 2026-07-28 vigente em 9 de agosto de 2026
    - key: website
      value:
        text: modelcontextprotocol.io
        url: https://modelcontextprotocol.io/
---

O **Model Context Protocol** (**MCP**) é um protocolo aberto pelo qual um aplicativo de IA pode
descobrir e usar dados externos, operações e templates reutilizáveis de prompts. Um servidor MCP
pode expor arquivos de um repositório, esquemas de banco de dados, uma operação de busca na web
ou um comando que altere um rastreador de issues. Um host MCP conecta essas capacidades a um modelo
de linguagem e decide o que o modelo e o usuário podem ver ou executar.[^specification]

O MCP não treina um modelo, não aumenta sua janela de contexto nem o transforma em agente autônomo.
Ele padroniza a conexão entre um aplicativo de IA e integrações que, sem isso, exigiriam adaptadores
específicos de cada produto. O host ainda escolhe o modelo, monta seu contexto, executa o ciclo do
agente, apresenta controles de consentimento e aplica as políticas. O servidor continua responsável
por implementar a API, consulta ao banco de dados ou operação local subjacente.

A [Anthropic](/pt/anthropic/) apresentou o MCP em 25 de novembro de 2024 e abriu sua
especificação, kits de desenvolvimento de software e servidores de exemplo. David Soria Parra e
Justin Spahr-Summers criaram o protocolo na Anthropic.[^origin] Em dezembro de 2025, a Anthropic o
transferiu para a **[Agentic AI Foundation](/pt/agentic-ai-foundation/)** (**AAIF**), um fundo
administrado pela Linux Foundation e criado em parceria com a Block e a OpenAI. A mudança deu ao
projeto uma estrutura de governança neutra quanto a fornecedores; a Anthropic continuou como
colaboradora, não como única proprietária do padrão.[^aaif]

## Por que um protocolo é útil

Antes de um protocolo compartilhado, cada combinação de produto de IA e serviço externo podia
exigir um conector próprio. Se três assistentes precisassem trabalhar com o mesmo serviço de
hospedagem de código-fonte, suas equipes talvez implementassem separadamente descoberta, esquemas,
autenticação, chamadas e tratamento de erros. O MCP tenta tornar a integração reutilizável: o
serviço implementa um servidor MCP, e cada aplicativo de IA implementa um cliente MCP.

Isso lembra o papel do Language Server Protocol nas ferramentas de desenvolvimento. Um servidor de
linguagem não substitui o compilador nem o editor; ele oferece uma interface comum entre os dois. Da
mesma forma, o MCP não substitui a API comum de um serviço nem a lógica de orquestração de um
aplicativo de IA. Ele fornece um protocolo de comunicação e um vocabulário comuns entre os
dois.[^specification]

A abstração tem limites práticos. Dois servidores podem seguir o MCP e ainda expor nomes,
descrições, esquemas de ferramentas, escopos de autorização e comportamentos diferentes.
Compatibilidade de protocolo não é equivalência semântica nem garante que um modelo escolha a
ferramenta certa.

## Arquitetura

O protocolo estável atual usa uma arquitetura de **host, cliente e servidor**:[^architecture]

- O **host** é o aplicativo de IA voltado ao usuário. Ele cria clientes, coordena o modelo de
  linguagem, agrega contexto, aplica permissões e isola as conexões com servidores.
- Um **cliente** MCP é um conector dentro do host. Cada cliente se comunica com exatamente um
  servidor, anexa metadados do protocolo às solicitações e mantém o limite de segurança entre esse
  servidor e o restante do host.
- Um **servidor** MCP é um processo local ou serviço remoto que expõe um conjunto específico de
  capacidades. Um servidor pode envolver um sistema de arquivos; outro, um aplicativo de design; e
  outro, um serviço empresarial hospedado.

Essa terminologia pode parecer contraintuitiva. Um assistente para desktop é o **host**, enquanto o
código dentro dele que conversa com determinada integração é o **cliente**. A integração externa é
o **servidor**, mesmo quando executada como processo filho no mesmo computador.

A arquitetura mantém intencionalmente a orquestração no host. Em condições normais, um servidor
recebe somente as solicitações e o contexto necessários ao próprio trabalho; ele não ganha acesso
automático à conversa inteira nem à saída de outros servidores. A eficácia dessa separação depende
da implementação do host e das permissões reais de sistema operacional e rede concedidas a cada
servidor.[^architecture]

O MCP `2026-07-28` não tem estado no nível do protocolo. Uma conexão, um fluxo HTTP ou um processo
`stdio` não é conversa nem sessão, e o servidor não deve inferir contexto de solicitações anteriores
no mesmo transporte. O estado que precisa sobreviver entre solicitações é representado por um
identificador explícito que o cliente envia novamente, como um identificador do aplicativo ou de uma
tarefa.[^base-protocol]

### Mensagens, versões e capacidades

As mensagens do MCP usam solicitações, respostas e notificações **JSON-RPC 2.0**. A revisão atual não
tem o handshake `initialize`/`initialized`. Cada solicitação declara em `_meta` sua versão do
protocolo, em formato de data, e as capacidades do cliente; clientes também devem incluir sua
identidade de implementação. O servidor aceita a versão de forma independente ou retorna um
`UnsupportedProtocolVersionError` com as versões que aceita.[^versioning]

Todo servidor deve implementar `server/discover`, que informa as versões e capacidades aceitas, sua
identidade e instruções opcionais de uso. A chamada é opcional para o cliente: ele pode enviar
diretamente uma solicitação comum e tratar um erro de versão. A descoberta é especialmente útil como
teste de compatibilidade quando o cliente também aceita versões baseadas em handshake, de
`2025-11-25` ou anteriores.[^discovery][^versioning]

A negociação de capacidades permite que um servidor mínimo implemente apenas ferramentas, por
exemplo, enquanto outro oferece recursos, prompts e notificações de mudança. As capacidades do
cliente também indicam quais solicitações de dados adicionais ele pode atender. Extensões opcionais
são anunciadas por identificador no mapa de capacidades `extensions`. Nenhuma das partes deve usar
um recurso que a outra não tenha declarado. A negociação reduz incompatibilidades acidentais, mas
uma capacidade anunciada é uma alegação técnica, não evidência de que a implementação seja segura ou
correta.

### Transportes

A especificação estável define dois transportes padrão:[^transports]

- **Entrada e saída padrão (`stdio`)**: o cliente inicia um processo de servidor local e troca uma
  mensagem JSON-RPC por linha pelos fluxos padrão. Os logs devem ir para o erro padrão, pois a saída
  padrão fica reservada às mensagens do protocolo.
- **HTTP com streaming** (_Streamable HTTP_): cada solicitação ou notificação do cliente é um `POST`
  separado para um único endpoint MCP. Uma solicitação recebe um objeto JSON ou um fluxo de
  Server-Sent Events restrito àquela solicitação. O protocolo não define fluxo HTTP `GET` nem sessão
  compartilhada entre solicitações.

O `stdio` é simples e útil para ferramentas locais, mas instalar um servidor local equivale a
instalar um software que será executado com as permissões recebidas por seu processo. O HTTP com
streaming evita distribuir o executável do servidor para o usuário e se encaixa em serviços
administrados centralmente, mas traz questões de autenticação de rede, isolamento entre clientes,
disponibilidade e latência.

No HTTP com streaming, o corpo da solicitação continua sendo a fonte da verdade, enquanto os
cabeçalhos `MCP-Protocol-Version`, `Mcp-Method` e `Mcp-Name` espelham metadados de roteamento.
Notificações de mudança duradouras usam o fluxo de resposta de uma solicitação
`subscriptions/listen` iniciada pelo cliente; notificações de progresso e logs específicas de uma
solicitação permanecem no fluxo de resposta que a originou.[^streamable-http]

O transporte anterior `HTTP+SSE` está obsoleto em favor do HTTP com streaming. Código de
compatibilidade continua importante, pois hosts, servidores e SDKs de cada linguagem não adotam uma
nova versão do protocolo ao mesmo tempo.[^transports][^versioning]

## Primitivas do servidor

As três primitivas mais conhecidas do MCP descrevem tipos diferentes de contribuição do servidor. A
especificação sugere um padrão comum de controle, mas não impõe uma interface
específica:[^prompts][^resources][^tools]

| Primitiva       | O que o servidor expõe                                          | Controlador comum   |
| --------------- | --------------------------------------------------------------- | ------------------- |
| **Prompts**     | Templates parametrizados de mensagens e fluxos reutilizáveis    | Usuário             |
| **Recursos**    | Contexto em texto ou binário identificado por URI               | Aplicativo host     |
| **Ferramentas** | Operações nomeadas com entradas estruturadas e saídas opcionais | Modelo de linguagem |

### Prompts

A definição de um prompt tem nome, descrição opcional e argumentos opcionais. Obtê-lo produz uma ou
mais mensagens que podem conter texto, imagens, áudio ou recursos incorporados. Um host pode expor
esses templates como comandos de barra escolhidos explicitamente pelo usuário. Portanto, um
prompt MCP é um template de fluxo fornecido pelo servidor, não o prompt oculto de sistema do host
nem um método para mudar os pesos do modelo.[^prompts]

### Recursos

Um recurso é identificado por uma URI e fornece dados em texto ou binário, como arquivo, esquema de
banco de dados, objeto de repositório ou registro de aplicativo. Servidores podem oferecer recursos
concretos e templates parametrizados de recursos. Um cliente pode receber mudanças na lista ou
atualizações de recursos selecionados por meio de uma solicitação `subscriptions/listen`. O host
decide se vai exibir, localizar, buscar ou colocar o material no contexto do modelo.[^resources]

Os recursos podem apoiar geração aumentada por recuperação, mas o MCP não é um algoritmo de busca.
Ele não define embeddings, índice, ranking, divisão em trechos nem quanto material recuperado deve
entrar no prompt. Essas escolhas continuam com o servidor e o host.

### Ferramentas

Uma ferramenta tem nome, descrição e JSON Schema para sua entrada; também pode declarar um esquema
para a saída estruturada. Um cliente pode listar ferramentas e chamar uma delas com argumentos JSON.
Os resultados podem conter texto, imagens, áudio, links para recursos, recursos incorporados ou
conteúdo estruturado.[^tools]

As ferramentas são descritas como **controladas pelo modelo** porque o host pode deixar o modelo de
linguagem decidir quando solicitá-las. O protocolo não exige execução automática. Sua especificação
recomenda que os aplicativos mostrem quais ferramentas estão disponíveis, exibam as chamadas e
permitam ao usuário recusá-las — sobretudo quando a operação tem efeitos
colaterais.[^tools]

## Dados do cliente e solicitações com várias viagens

O MCP continua bidirecional, mas, em `2026-07-28`, o servidor não inicia uma solicitação JSON-RPC. Se
precisar de mais informações enquanto processa `prompts/get`, `resources/read` ou `tools/call`, ele
retorna um `InputRequiredResult` com `resultType: "input_required"`. O mapa `inputRequests` descreve os
dados necessários, e um `requestState` opaco opcional permite ao servidor carregar estado explícito.
O cliente obtém os dados permitidos e repete a operação original com os `inputResponses`
correspondentes. Cada rodada continua sendo uma solicitação independente.[^mrtr]

Esse padrão de **solicitações com várias viagens** (_Multi Round-Trip Requests_, **MRTR**) pode
transportar três tipos de dados do cliente:

- **Elicitação** pede ao host que obtenha informações do usuário. O modo de formulário solicita
  dados estruturados; o modo URL direciona o usuário a uma página externa para interações sensíveis
  que não devem passar pelo cliente MCP.[^elicitation]
- **Raízes** (_roots_) descrevem locais do sistema de arquivos relevantes a um espaço de trabalho.
  Uma raiz é apenas um limite declarado, não uma sandbox do sistema operacional; um processo local
  com permissões mais amplas ainda pode ignorá-la.
- **Amostragem** pede ao host uma geração de modelo de linguagem, enquanto o host mantém as
  credenciais, a escolha do modelo, o controle de permissões e o domínio sobre o prompt e o
  resultado.

A elicitação continua sendo um recurso ativo do cliente. Raízes e amostragem estão obsoletas em
`2026-07-28`, assim como o recurso de logs. Implementações existentes podem usá-los durante o período
de descontinuação, mas novas implementações devem passar arquivos ou diretórios por parâmetros de
ferramentas, URIs de recursos ou configuração do servidor; integrar-se diretamente a APIs de
provedores de modelos; e usar o erro padrão ou OpenTelemetry para observabilidade. A primeira revisão
em que esses recursos podem ser removidos será lançada em 28 de julho de 2027 ou depois.[^deprecated]

## Exemplo de chamada de ferramenta

Uma interação MCP simplificada segue estas etapas:

1. O usuário habilita um servidor local ou remoto confiável em um host compatível com MCP.
2. O cliente chama `server/discover` opcionalmente ou envia uma solicitação comum com sua versão
   preferida do protocolo e suas capacidades.
3. O cliente solicita `tools/list`; o servidor retorna nomes, descrições, esquemas de entrada e
   orientações de cache.
4. O host disponibiliza algumas descrições de ferramentas ao modelo de linguagem.
5. O modelo propõe o nome e os argumentos de uma ferramenta. O host aplica suas políticas e, quando
   adequado, pede confirmação antes de enviar `tools/call`.
6. Se precisar de mais informações do usuário, do modelo ou das raízes, o servidor retorna
   `input_required`; o cliente atende às solicitações permitidas e repete `tools/call`.
7. O servidor valida autorização e entradas, executa a operação subjacente e retorna um resultado
   `complete`. O host decide quanto dele fornecer ao modelo ou ao usuário.

Somente as mensagens entre cliente e servidor são padronizadas pelo MCP. Etapas como escolha do
modelo, interface de confirmação, lógica de novas tentativas, gerenciamento de contexto e ciclo do
agente são comportamentos do host.

## MCP e conceitos próximos

**Uma API** define como um software acessa determinado serviço. Um servidor MCP muitas vezes envolve
uma ou mais APIs e apresenta algumas operações pelo MCP. Isso pode melhorar a portabilidade entre
hosts de IA, mas acrescenta uma camada que precisa preservar autenticação, semântica de erros,
limites de uso e tipos de dados da API.

**Chamada de ferramentas** ou **chamada de funções** é o mecanismo voltado ao modelo pelo qual ele
emite uma solicitação estruturada para uma operação. O MCP pode entregar definições e resultados de
ferramentas a um host, mas o host precisa traduzi-los para o formato aceito pelo modelo escolhido e
decidir se executará a solicitação. Qualquer um dos conceitos pode existir sem o outro.

**Geração aumentada por recuperação** é um padrão para escolher informações externas e adicioná-las
a uma solicitação do modelo. Recursos ou ferramentas MCP podem fornecer as informações, mas o
protocolo não define o pipeline de recuperação.

**Um framework de agentes** controla uma sequência de chamadas de modelos, ferramentas, estados e
decisões. O MCP fornece conexões interoperáveis que esse framework pode usar; não define objetivos,
método de planejamento, memória nem condição de parada do agente.

**Um catálogo de plugins** cuida da descoberta, distribuição, análise, instalação e das decisões de
confiança. O MCP define um protocolo, e existe um registro público, mas seguir o protocolo não
equivale a uma análise de segurança ou ao endosso de um servidor.

## Custos e limitações

O MCP pode reduzir trabalho duplicado de integração e dependência de fornecedores. Um servidor com
função específica pode ser reutilizado por vários hosts e modelos, enquanto um host pode combinar
serviços locais e remotos por uma mesma família de mensagens. SDKs oficiais em várias linguagens de
programação diminuem a quantidade de código do protocolo que uma implementação precisa
escrever.[^repository]

A camada comum também cria custos:

- **Implementação e manutenção**: alguém ainda precisa mapear o serviço subjacente em prompts,
  recursos ou ferramentas coerentes, testar esquemas, cuidar da autorização e acompanhar as versões
  da especificação e dos SDKs.
- **Latência e confiabilidade**: chamadas remotas acrescentam viagens pela rede; cada servidor e API
  posterior vira outro ponto de falha. Tempos limite, cancelamento, idempotência e falhas parciais
  exigem tratamento deliberado.
- **Custo de contexto e inferência**: descrições de ferramentas, conteúdo de recursos e resultados
  consomem tokens do modelo. Expor centenas de ferramentas ao mesmo tempo pode tornar a escolha
  menos confiável e mais cara; por isso, hosts costumam filtrar, pesquisar ou carregar capacidades
  sob demanda.
- **Perda de abstração**: um conector genérico pode esconder comportamentos específicos e úteis do
  serviço. Fluxos complexos ainda podem exigir um cliente próprio ou integração direta com a API.
- **Custo operacional**: servidores remotos precisam de hospedagem, monitoramento, limitação de uso,
  rotação de credenciais, logs de auditoria e isolamento entre clientes. Servidores locais transferem
  ao host e ao usuário as dificuldades de instalação e segurança do processo.
- **Lacunas de portabilidade**: hosts implementam subconjuntos diferentes do MCP e apresentam o
  consentimento de maneiras distintas; servidores podem depender de extensões ou versões mais novas.
  “Aceita MCP” não significa uma experiência idêntica.

Para uma integração pequena usada por um único aplicativo, uma chamada direta de função pode ser
mais clara. O MCP ganha valor quando a mesma capacidade deve funcionar em vários hosts de IA, quando
a descoberta dinâmica importa ou quando integrações locais e remotas precisam de uma interface
uniforme.

## Segurança e confiança

O MCP conecta modelos probabilísticos ao acesso a dados e a operações potencialmente destrutivas;
por isso, seu limite mais importante não é a sintaxe das mensagens, mas a autoridade. A especificação
central exige consentimento explícito sobre compartilhamento de dados e ações, alerta que descrições
de ferramentas não são confiáveis e afirma que o protocolo não consegue aplicar sozinho todos os
seus princípios de segurança.[^specification]

Para servidores HTTP remotos, a especificação estável de autorização se baseia em padrões ligados ao
OAuth. Um servidor MCP protegido atua como servidor de recursos; o cliente MCP, como cliente OAuth;
e um servidor de autorização separado ou no mesmo local emite tokens de acesso. Implementações HTTP
devem seguir esse modelo, enquanto implementações `stdio` devem obter credenciais do ambiente. A
autorização continua opcional no nível do protocolo, mas um servidor que exponha dados privados ou
operações com privilégios ainda precisa de um sistema adequado de controle de
acesso.[^authorization]

Quando a autorização é usada, a revisão atual exige metadados do recurso protegido e fortalece a
validação do emissor do servidor de autorização. Ela prefere documentos de metadados do ID do
cliente ou pré-registro; o registro dinâmico de clientes continua disponível apenas por
compatibilidade e está obsoleto. Credenciais de cliente devem ficar vinculadas ao servidor de
autorização que as emitiu, não ser reutilizadas entre emissores.[^authorization][^changelog]

As orientações de segurança do projeto discutem ataques de _confused deputy_, repasse de tokens,
falsificação de solicitações no lado do servidor, comprometimento de servidores locais, escopos
amplos demais e injeção de prompt. Em especial, um servidor não deve aceitar e repassar um token
emitido para outro serviço posterior; públicos separados preservam os controles de segurança e a
possibilidade de auditoria.[^security]

Entre as defesas práticas estão:

- instalar ou conectar apenas servidores cujo código e responsável sejam confiáveis;
- conceder o menor escopo necessário no sistema de arquivos, rede, conta e OAuth;
- validar argumentos de ferramentas, URIs de recursos, saídas, destinos de redirecionamento e
  públicos dos tokens;
- exigir confirmação para operações importantes ou inesperadas;
- manter resultados de ferramentas e textos de recursos não confiáveis separados de instruções de
  maior prioridade;
- isolar processos locais quando possível e evitar segredos em argumentos de linha de comando ou
  logs; e
- usar tempos limite, limites de uso, trilhas de auditoria, revogação e isolamento por usuário.

Um servidor MCP pode seguir fielmente a especificação de comunicação e ainda ser malicioso,
vulnerável ou ter privilégios demais. O MCP é uma camada de interoperabilidade, não um certificado
de confiança.

## Versões e relevância atual

As versões do MCP usam datas que representam mudanças incompatíveis com versões anteriores. A versão
`2026-07-28` foi lançada em 28 de julho de 2026 e é a especificação vigente em 9 de agosto de 2026.
Ela é a primeira revisão **moderna** na terminologia de compatibilidade do projeto: usa metadados por
solicitação e não tem estado, enquanto `2025-11-25` e versões anteriores são revisões **legadas** que
estabelecem uma sessão por meio de `initialize`. Implementações podem aceitar as duas eras, mas um
cliente apenas legado não consegue conversar com um servidor apenas moderno.[^release][^versioning]

O lançamento também introduziu roteamento HTTP por cabeçalhos, metadados de cache em resultados de
listas e recursos, MRTR, `subscriptions/listen` e um framework formal de extensões. **Tarefas**
longas saíram do núcleo experimental e passaram à extensão `io.modelcontextprotocol/tasks`, com
consulta por polling e atualizações explícitas. Outras extensões opcionais incluem MCP Apps para
interfaces interativas. O suporte a extensões é declarado por capacidades e exige que as duas partes
concordem com o comportamento da extensão.[^changelog][^extensions]

A mesma versão formalizou um ciclo de vida de recursos com período mínimo de descontinuação de doze
meses. Raízes, amostragem, logs, registro dinâmico de clientes e o transporte legado HTTP+SSE
continuam documentados para compatibilidade, mas estão obsoletos; novas implementações devem seguir
os caminhos de migração publicados.[^deprecated]

A importância do MCP já não depende apenas dos produtos da Anthropic. No lançamento da AAIF, em
dezembro de 2025, a Linux Foundation relatou sua adoção em Claude, Cursor, Microsoft Copilot, Gemini,
Visual Studio Code, ChatGPT e outras plataformas, além de mais de dez mil servidores
publicados.[^aaif] Esse alcance ajuda a explicar por que o MCP se tornou uma camada comum relevante
para ferramentas de entusiastas, agentes de desenvolvimento e integrações empresariais pouco mais de
um ano depois do lançamento.

## Referências

[^specification]:
    [Especificação do Model Context Protocol: visão geral](https://modelcontextprotocol.io/specification/2026-07-28),
    versão 2026-07-28, Model Context Protocol.

[^origin]:
    [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol),
    Anthropic, 25 de novembro de 2024.

[^aaif]:
    [Linux Foundation announces the formation of the Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation),
    Linux Foundation, 9 de dezembro de 2025.

[^architecture]:
    [Architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture),
    especificação do Model Context Protocol, versão 2026-07-28.

[^base-protocol]:
    [Visão geral do protocolo-base](https://modelcontextprotocol.io/specification/2026-07-28/basic),
    especificação do Model Context Protocol, versão 2026-07-28.

[^transports]:
    [Visão geral dos transportes](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports),
    especificação do Model Context Protocol, versão 2026-07-28.

[^streamable-http]:
    [Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http),
    especificação do Model Context Protocol, versão 2026-07-28.

[^versioning]:
    [Versioning and compatibility](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning),
    especificação do Model Context Protocol, versão 2026-07-28.

[^discovery]:
    [Server discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover),
    especificação do Model Context Protocol, versão 2026-07-28.

[^prompts]:
    [Prompts](https://modelcontextprotocol.io/specification/2026-07-28/server/prompts), especificação
    do Model Context Protocol, versão 2026-07-28.

[^resources]:
    [Resources](https://modelcontextprotocol.io/specification/2026-07-28/server/resources),
    especificação do Model Context Protocol, versão 2026-07-28.

[^tools]:
    [Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools), especificação do
    Model Context Protocol, versão 2026-07-28.

[^mrtr]:
    [Multi Round-Trip Requests](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr),
    especificação do Model Context Protocol, versão 2026-07-28.

[^elicitation]:
    [Elicitation](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation),
    especificação do Model Context Protocol, versão 2026-07-28.

[^deprecated]:
    [Recursos obsoletos](https://modelcontextprotocol.io/specification/2026-07-28/deprecated),
    especificação do Model Context Protocol, versão 2026-07-28.

[^repository]:
    [Repositório da especificação e documentação do Model Context Protocol](https://github.com/modelcontextprotocol/modelcontextprotocol),
    GitHub; licença MIT.

[^authorization]:
    [Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization),
    especificação do Model Context Protocol, versão 2026-07-28.

[^security]:
    [Práticas recomendadas de segurança](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices),
    documentação do Model Context Protocol.

[^changelog]:
    [Principais mudanças de 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog),
    especificação do Model Context Protocol.

[^extensions]: [Extensões do MCP](https://modelcontextprotocol.io/extensions), Model Context Protocol.

[^release]:
    David Soria Parra e Den Delimarsky, [The 2026-07-28
    specification](https://blog.modelcontextprotocol.io/posts/2026-07-28/), Model Context Protocol
    Blog, 28 de julho de 2026.
