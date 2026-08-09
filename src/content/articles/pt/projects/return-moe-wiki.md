---
id: return-moe-wiki
title: return moe wiki
summary: A referência editável pela comunidade sobre a return moe e assuntos relacionados relevantes, com designações autoritativas explícitas quando aplicáveis.
locale: pt-BR
kind: project
translatedFromRevision: 1
categories:
  - projects
  - wiki
aliases:
  - wiki.return.moe
  - wiki de referência da return moe
related:
  - return-moe
  - soraya
  - rodrigo-laneth
  - authoritative-articles
  - informational-ontology
infobox:
  fields:
    - key: type
      value: Wiki de referência
    - key: focus
      value: Contexto documentado e material autoritativo marcado explicitamente
    - key: affiliation
      value:
        text: return moe
        article: return-moe
    - key: repository
      value:
        text: github.com/returnmoe/wiki
        url: https://github.com/returnmoe/wiki
    - key: website
      value:
        text: wiki.return.moe
        url: https://wiki.return.moe
    - key: status
      value: Ativa
---

A **return moe wiki** é uma referência sobre a [return moe](/pt/return-moe/) e assuntos
relacionados relevantes. Ela registra definições, relações, história e atribuições em um formato que
pode ser analisado independentemente de um modelo, aplicativo ou perfil social em
execução.[^repository]

A wiki tem a return moe como tema central, mas não se limita a assuntos criados ou pertencentes ao
estúdio. Uma personagem criada por parceiros, um pesquisador externo, um projeto independente, uma
organização externa ou uma ferramenta de terceiros pode receber um artigo quando oferece contexto
relevante. Esse artigo deve identificar corretamente quem criou, quem é o proprietário, quem
desenvolveu e quais são as afiliações do tema, sem dar a entender que ele pertence à return
moe.[^repository]

## Artigos autoritativos

A wiki é descritiva por padrão. Somente um artigo que exiba a
[designação autoritativa explícita](/pt/authoritative-articles/) é uma fonte primária
para o cânone ou a construção de mundo da return moe, ou para uma estrutura conceitual da return moe
declarado explicitamente. Ser um artigo de personagem, tratar de um assunto criado pela return moe
ou pertencer a qualquer categoria específica não confere esse status.[^repository]

Por exemplo, [Soraya](/pt/soraya/) exibe o aviso; por isso, seu artigo atual registra a
continuidade mantida pela return moe quando prompts, imagens de avatar regeneradas, modelos de
linguagem ou respostas incoerentes do modelo mudam. Esse status não torna menos válidas as
continuidades mantidas por fãs; ele identifica a fonte para afirmações especificamente sobre a
continuidade da return moe. Outra personagem pode ser definida principalmente em uma obra separada,
como uma visual novel, e seu artigo na wiki não é autoritativo sem o mesmo aviso.[^repository]

O artigo autoritativo sobre a [Estrutura de Ontologia Informacional (return
moe)](/pt/informational-ontology/) tem um escopo diferente: ele define a estrutura da return moe
para personagens fictícias e personas relacionadas. Seu aviso faz dele uma declaração oficial
dessa estrutura, não uma afirmação de que toda obra externa discutida no artigo adota a mesma posição.

## Edição e governança

Os artigos e as categorias são arquivos Markdown no repositório oficial. Correções podem ser
propostas por issues, e mudanças no código-fonte podem ser enviadas como pull requests para o branch
`master`. Esse histórico revisável torna divergências e revisões visíveis, em vez de permitir que
uma resposta gerada e temporária se torne oficial.[^repository]

A edição manual é permitida. O uso de inteligência artificial para redigir ou revisar conteúdo
também é permitido e ativamente incentivado, desde que o resultado preserve o tom geral da wiki e
cumpra os mesmos padrões de fontes, atribuição e edição aplicáveis a textos redigidos manualmente.

Ao usar IA, recomenda-se enfaticamente um agente de IA suficientemente capaz — por exemplo, Claude
Cowork ou Claude Code, da Anthropic, ou ChatGPT Work ou Codex, da OpenAI. O agente deve ser capaz de
encontrar e consultar fontes, fazer perguntas de esclarecimento, processar informações com precisão
e identificar e corrigir os próprios erros. Em todos os casos, a revisão humana quanto à correção e
à clareza é obrigatória antes da publicação.[^repository]

O inglês é a edição de origem. As páginas em português brasileiro são traduções e registram qual
revisão em inglês representam, permitindo que o site sinalize uma tradução desatualizada.[^repository]

## Tecnologia e busca

O site é gerado como HTML estático com Astro e fica disponível em `wiki.return.moe`. As builds de
produção criam um índice Pagefind a partir dos títulos, nomes alternativos, resumos, categorias e
textos dos artigos. A busca é executada no navegador e não exige um serviço de busca
hospedado.[^repository]

O repositório é o ambiente de edição e revisão, mas o site não é publicado pelo GitHub
Pages.[^repository]

## Referências

[^repository]: [Repositório da return moe wiki](https://github.com/returnmoe/wiki).
