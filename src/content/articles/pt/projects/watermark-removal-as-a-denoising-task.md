---
id: watermark-removal-as-a-denoising-task
title: Remoção de marca-d'água como tarefa de redução de ruído
summary: Um experimento da return moe de 2025 que testou se uma ou duas etapas finais de redução de ruído por difusão poderiam apagar marcas-d'água invisíveis preservando o conteúdo de uma imagem de anime.
locale: pt-BR
kind: project
translatedFromRevision: 1
categories:
  - projects
  - research
  - artificial-intelligence
aliases:
  - experimento de remoção de marca-d'água por difusão
  - experimento de redução de ruído de marca-d'água
  - Watermark Removal as a Denoising Task
redirects:
  - watermark-removal-denoising
related:
  - return-moe
  - rodrigo-laneth
  - diffusion-models
  - stable-diffusion-xl
infobox:
  fields:
    - key: type
      value: Experimento de robustez de marcas-d'água em imagens
    - key: author
      value:
        text: Rodrigo Laneth
        article: rodrigo-laneth
    - key: formed
      value: 21 de dezembro de 2025
    - key: focus
      value: Remoção de marcas-d'água invisíveis por redução mínima de ruído por difusão
    - key: affiliation
      value:
        text: return moe
        article: return-moe
    - key: status
      value: Publicado com artefatos de teste e fluxo de trabalho
    - key: website
      value:
        text: Watermark removal as a denoising task
        url: https://blog.return.moe/en/2025/12/21/watermark-removal-as-a-denoising-task/
---

**Remoção de marca-d'água como tarefa de redução de ruído** é um experimento de autenticidade de
imagens de 2025 da [return moe](/pt/return-moe/), realizado por [Rodrigo
Laneth](/pt/rodrigo-laneth/). Ele testou se um [modelo de
difusão](/pt/diffusion-models/) pré-treinado poderia tornar indetectáveis três marcas-d'água
invisíveis como efeito colateral de aplicar apenas uma ou duas etapas finais de redução de ruído. O
gerador testado foi o **WAI-Illustrious-SDXL v15**, um checkpoint voltado a anime do ramo
Illustrious da arquitetura [SDXL](/pt/stable-diffusion-xl/).[^experiment][^wai-model]

O experimento relatou remoção bem-sucedida segundo os decodificadores disponíveis do Adobe
TrustMark, Watermark Anything da Meta e SynthID do Google. Também registrou danos localizados na
imagem, sobretudo em textos pequenos e detalhes de interface na tela de um smartphone. Portanto, o
resultado mostra, em uma única imagem de anime, que tornar a marca-d'água indetectável pode reduzir
a fidelidade visual;
não comprova que o procedimento remova universalmente toda marca-d'água sem alterar o
conteúdo.[^experiment]

## Pergunta de pesquisa

Uma marca-d'água invisível em imagem codifica um sinal legível por máquinas por meio de pequenas
alterações na imagem. Sistemas robustos tentam manter o sinal recuperável após transformações
esperadas, como compressão JPEG, recorte, redimensionamento e filtragem. Uma avaliação útil também
precisa considerar transformações que usem um prior aprendido de imagens, em vez de um filtro fixo
de pixels ou frequências.

A hipótese da return moe era que um redutor de ruído por difusão trataria um sinal incorporado e
imperceptível como perturbação improvável e levaria a imagem de volta em direção à distribuição de
imagens aprendida. O trabalho do Adobe TrustMark ofereceu o estímulo conceitual imediato: seus
autores formulam a remoção de marcas-d'água como um problema de redução de ruído em imagens e
treinam uma rede de restauração específica, a TrustMark-RM.[^trustmark-paper] A return moe perguntou
se um checkpoint generativo de difusão existente, treinado para síntese de imagens e não para uma
marca-d'água específica, poderia produzir o mesmo efeito colateral praticamente sem trajetória
reversa.

Não foi a primeira pesquisa a usar modelos generativos contra marcas-d'água invisíveis. Um artigo de
2023 sobre ataques de regeneração estudou formal e empiricamente a adição de ruído e a reconstrução
de uma imagem com modelos generativos pré-treinados.[^regeneration-attack] Um artigo de conferência
de 2024 propôs modelos de remoção de marcas-d'água por redução de ruído por difusão, que aplicam
ruído direto e um processo reverso de redução de ruído a regiões da imagem marcada.[^ddwrm] O
experimento da return moe é mais estreito e operacionalmente distinto: ele testou sistemas atuais de
procedência com um derivado público do SDXL para anime, desativou novo ruído e usou somente o fim de
um cronograma comum de amostragem de imagem para imagem.

## Desenho experimental

A imagem-base era um quadro recortado, redimensionado e codificado em JPEG de um trailer oficial da
terceira temporada de _Oshi no Ko_. A escolha forneceu ao checkpoint especializado em anime uma
entrada próxima de seu domínio visual aprendido, ao mesmo tempo que garantiu que a imagem inicial
não havia sido gerada por IA. Os três testes de marca-d'água usaram derivados desse
quadro.[^experiment]

### Modelo e pipeline de redução de ruído

O fluxo codificou cada imagem marcada no espaço latente do checkpoint e executou o
WAI-Illustrious-SDXL v15 com as seguintes configurações de amostragem:[^experiment]

- 28 etapas totais programadas;
- início na etapa 27, deixando uma atualização reversa de redução de ruído;
- amostragem Euler ancestral; e
- `add_noise` desativado.

O teste do Watermark Anything repetiu a mesma passagem mais uma vez para avaliar um resultado de
duas atualizações. Como a adição de novo ruído gaussiano estava desativada, esse não é o procedimento
didático completo de corromper uma imagem e depois reverter a corrupção. É mais bem entendido como
uma **pequena projeção pelo prior aprendido do checkpoint**: a reconstrução pelo VAE e a atualização
tardia do redutor de ruído preservam grande parte da entrada enquanto substituem algumas estruturas
finas por detalhes que o modelo considera plausíveis.

A escolha do checkpoint é importante. O WAI v15 deriva da linhagem Illustrious, especializada em
ilustrações, que preserva a arquitetura geral do SDXL, mas tem pesos retreinados de modo
substancial.[^illustrious] Por isso, combinava bem com um quadro de anime. O experimento não mostra
que a base oficial SDXL da Stability AI, um checkpoint fotográfico ou um modelo de difusão que não
seja SDXL faria a mesma troca de fidelidade.

### Sistemas de marca-d'água

O estudo abrangeu três sistemas com condições de acesso bastante diferentes:

| Sistema                      | Construção do teste                                                                                                           | Verificação disponível                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Adobe TrustMark**          | O modelo Q do TrustMark incorporou o conteúdo textual `kawaii`.                                                               | Decodificador oficial aberto e removedor específico TrustMark-RM-Q.             |
| **Watermark Anything (WAM)** | O modelo público incorporou uma codificação de 32 bits de `moe` seguida por um byte nulo de terminação.                       | Decodificador oficial aberto, avaliado pela precisão dos bits recuperados.      |
| **Google SynthID**           | O editor de imagens do Google modificou e depois restaurou aproximadamente o quadro original, gerando uma imagem com SynthID. | A interface pública de verificação do Gemini retornou um resultado de detecção. |

O TrustMark é um sistema de marca-d'água de 100 bits para resoluções arbitrárias cuja implementação
pública inclui modelos de incorporação, decodificação e remoção.[^trustmark-repository] O Watermark
Anything permite mensagens localizadas de 32 bits e publica seu código e seus
pesos.[^wam-paper][^wam-repository] O SynthID funciona com vários tipos de mídia, mas os pesos de seu
incorporador e detector de imagens não eram públicos; pouco antes do experimento, o Google havia
disponibilizado a verificação de imagens para usuários finais pelo
Gemini.[^synthid][^gemini-verification]

## Resultados

Os resultados relatados em 21 de dezembro de 2025 foram:[^experiment]

| Teste                      | Antes da difusão                                                                | Depois da difusão                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **TrustMark Q**            | O decodificador oficial recuperou `kawaii`.                                     | Depois de uma atualização, o decodificador não recuperou o conteúdo.                                                           |
| **WAM, uma atualização**   | A mensagem de 32 bits foi decodificada exatamente, com precisão de bits `1.00`. | A precisão dos bits recuperados caiu para `0.56`; a concordância aleatória teria média `0.50`.                                 |
| **WAM, duas atualizações** | Mesma entrada marcada.                                                          | O decodificador retornou a cadeia composta apenas por zeros, com precisão `0.53`, igual à saída para a fonte sem marca-d'água. |
| **SynthID**                | O Gemini informou haver SynthID na imagem de teste editada pelo Google.         | Depois de uma atualização, o Gemini informou que nenhuma marca-d'água SynthID havia sido detectada.                            |

A comparação do TrustMark incluiu o modelo específico TrustMark-RM-Q da Adobe. Tanto o removedor
oficial quanto a saída da difusão impediram a decodificação. O artigo original considerou o
resultado da difusão visualmente melhor, mas não relatou um estudo cego de preferência nem métricas
objetivas de fidelidade, como PSNR, SSIM ou distância perceptiva. Por isso, esse julgamento deve
continuar explicitamente subjetivo.

No WAM, o original sem marca-d'água já era decodificado como uma sequência só de zeros e, por acaso,
coincidia com 53% do conteúdo escolhido. O decodificador do WAM sempre retorna bits, mesmo quando não
há marca-d'água; assim, a observação relevante não é que `0.53` prove a ausência dela. É que a
imagem processada caiu de recuperação perfeita para um resultado comparável ao controle sem
marca-d'água do estudo. Seriam necessárias mais imagens e conteúdos para estimar uma taxa de falsos
negativos.

O resultado do SynthID tem outro fator de confusão. Como a interface pública não oferecia um
incorporador, a imagem de teste precisou passar por uma edição substancial com um modelo do Google
antes de receber o SynthID; a tentativa posterior de reverter essas edições não restaurou a
identidade de pixels com a fonte. O verificador disponível no Gemini retornou um resultado binário,
e não a confiança bruta do detector ou dados localizados do
conteúdo.[^experiment][^gemini-verification]

## Interpretação

O experimento ilustra por que a restauração generativa é um modelo de ameaça difícil para sistemas
de marcas-d'água invisíveis. Uma marca pode sobreviver ao processamento convencional de sinais e, ainda
assim, falhar quando um modelo aprendido reconstrói a aparência da cena. A reconstrução não precisa
estimar nem procurar a mensagem secreta. Basta substituir uma parcela suficiente do sinal de baixo
nível para que o detector perca a correlação com o conteúdo original.

O mesmo mecanismo explica o dano observado. Textos pequenos, ícones e a geometria de interfaces na
tela são difíceis para modelos da família SDXL e ocupam relativamente poucos pixels. Um redutor de
ruído treinado para produzir imagens de anime plausíveis pode preservar a personagem e o ambiente
enquanto inventa esses detalhes. A saída continua parecida no conteúdo, mas deixou de ser uma cópia
fiel para fins de comprovação. Isso torna o método inadequado sempre que a autenticidade pixel a
pixel, o texto
exato ou a preservação forense forem importantes.

O resultado de uma etapa também é um exemplo concreto de por que os ramos de anime continuam
relevantes além da geração comum de texto para imagem. O WAI-Illustrious-SDXL v15 compartilha a
arquitetura carregável do SDXL, mas usa uma distribuição aprendida substancialmente diferente. Nesse
caso, a distribuição especializada funcionou como prior útil para restaurar um quadro de anime.
Descrever o modelo apenas como “SDXL” esconderia por que o prior escolhido combinava com a imagem de
teste.

## Limitações

O estudo foi deliberadamente pequeno. Suas principais limitações são:

- uma única imagem-fonte de um único domínio visual;
- um checkpoint WAI/Illustrious e uma configuração de amostragem;
- um conteúdo para o TrustMark e um para o WAM;
- nenhuma repetição entre sementes, resoluções, níveis de complexidade da imagem ou de compressão;
- nenhuma métrica quantitativa de fidelidade nem painel de avaliação humana;
- somente a interface pública do Gemini para verificar o SynthID; e
- nenhuma comparação com outras linhagens do SDXL, modelos fotográficos de difusão ou métodos de
  restauração sem difusão.

A expressão “remoção completa” do relatório para o caso de duas etapas do WAM descreve o resultado
do decodificador naquele teste. Ela não estabelece que todo vestígio estatístico da marca-d'água
tenha desaparecido. Um estudo mais forte usaria muitos conteúdos e imagens aleatórios, preservaria a
confiança do detector quando disponível, compararia vários ataques sob limites equivalentes de
distorção e publicaria curvas agregadas de detecção e qualidade perceptiva.

## Reprodutibilidade e importância

A return moe publicou a imagem de origem, as imagens processadas e um fluxo mínimo do ComfyUI. O
arquivo registra os resultados intermediários do TrustMark, WAM e SynthID, além das saídas de uma e
duas passagens, permitindo que outras pessoas verifiquem o comportamento declarado do decodificador
e avaliem os danos visuais.[^experiment]

O resultado é relevante para o projeto de autenticidade de conteúdo porque o ataque usa software de
uso comum disponível para download e um checkpoint comum da comunidade, não um modelo de ataque
treinado especificamente para marcas-d'água. Portanto, alegações de robustez de marcas-d'água devem incluir
reconstrução generativa e priors de imagem adequados ao domínio, não apenas recorte,
redimensionamento, compressão e desfoque.

A pesquisa sobre remoção de marcas-d'água tem uso duplo. Ela ajuda projetistas a identificar
mecanismos fracos de procedência, mas a mesma técnica pode ser usada para ocultar a origem ou evitar
regras de plataformas. A falha de uma verificação de marca-d'água nunca deve ser tratada como prova
de que uma imagem foi feita por uma pessoa, e uma procedência robusta deve combinar vários sinais —
como metadados assinados, registros seguros de captura e verificação contextual — em vez de depender
de um único detector invisível.

## Referências

[^experiment]:
    Rodrigo Laneth, [Watermark removal as a denoising task](https://blog.return.moe/en/2025/12/21/watermark-removal-as-a-denoising-task/),
    blog da return moe, 21 de dezembro de 2025.

[^wai-model]:
    [Página do modelo WAI-NSFW-Illustrious-SDXL](https://civitai.com/models/827184/wai-nsfw-illustrious-sdxl),
    WAI0731, Civitai.

[^trustmark-paper]:
    Tu Bui, Shruti Agarwal e John Collomosse, [TrustMark: Robust Watermarking and Watermark Removal
    for Arbitrary Resolution Images](https://openaccess.thecvf.com/content/ICCV2025/html/Bui_TrustMark_Robust_Watermarking_and_Watermark_Removal_for_Arbitrary_Resolution_Images_ICCV_2025_paper.html),
    _ICCV 2025_.

[^regeneration-attack]:
    Xuandong Zhao et al., [Invisible Image Watermarks Are Provably Removable Using Generative
    AI](https://arxiv.org/abs/2306.01953), 2023.

[^ddwrm]:
    Hannes Mareen et al., [Diffusion Denoising Watermark Removal Models to Attack Invisible Image
    Watermarks](https://biblio.ugent.be/publication/01JJ1J4H62ZCZ3EKNTBPHMT0KC), _ICSPCS 2024_.
    [DOI](https://doi.org/10.1109/ICSPCS63175.2024.10815799).

[^illustrious]:
    Junha Lee et al., [Illustrious: An Open Advanced Illustration
    Model](https://arxiv.org/abs/2409.19946), 2024.

[^trustmark-repository]: [Implementação oficial do TrustMark](https://github.com/adobe/trustmark), Adobe, GitHub.

[^wam-paper]:
    Yuxuan Zhang et al., [Watermark Anything with Localized
    Messages](https://arxiv.org/abs/2411.07231), _ICLR 2025_.

[^wam-repository]:
    [Implementação oficial do Watermark Anything](https://github.com/facebookresearch/watermark-anything),
    Meta AI Research, GitHub.

[^synthid]: [SynthID](https://deepmind.google/models/synthid/), Google DeepMind.

[^gemini-verification]:
    [The Gemini app gets new image verification features](https://blog.google/innovation-and-ai/products/ai-image-verification-gemini-app/),
    Google, 20 de novembro de 2025.
