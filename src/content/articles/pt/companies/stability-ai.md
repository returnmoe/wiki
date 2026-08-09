---
id: stability-ai
title: Stability AI
summary: Uma empresa britânica de IA generativa conhecida principalmente por financiar, lançar e comercializar a família de modelos de imagem Stable Diffusion.
locale: pt-BR
kind: company
translatedFromRevision: 1
categories:
  - organizations
  - artificial-intelligence
aliases:
  - Stability.ai
  - Stability AI Ltd
redirects:
  - stabilityai
related:
  - stable-diffusion
  - stable-diffusion-xl
  - low-rank-adaptation
  - model-training
infobox:
  fields:
    - key: type
      value: Empresa de IA generativa
    - key: founded
      value: 2019 (constituída em 4 de novembro)
    - key: founders
      value:
        - Emad Mostaque
        - Cyrus Hodes
    - key: headquarters
      value: Londres, Inglaterra
    - key: key_people
      value:
        - Prem Akkaraju (diretor-executivo)
        - Sean Parker (presidente-executivo)
    - key: industry
      value: Inteligência artificial
    - key: status
      value: Ativa
    - key: website
      value:
        text: stability.ai
        url: https://stability.ai/
---

A **Stability AI** é uma empresa britânica de inteligência artificial generativa conhecida
principalmente por seu papel no financiamento, lançamento e comercialização da família de modelos de
geração de imagens [Stable Diffusion](/pt/stable-diffusion/). A Stability AI Ltd foi constituída
na Inglaterra e no País de Gales em 4 de novembro de 2019.[^companies-house] O
material de imprensa publicado pela Stability AI em 2022 identificava Emad Mostaque como fundador;
reportagens da época e um trecho de uma apresentação da empresa também identificam Cyrus Hodes como
cofundador.[^funding][^hodes]

O Stable Diffusion deu destaque à empresa, mas os dois nomes não são intercambiáveis. A Stability AI
é uma organização com produtos, pessoal, investidores e várias famílias de modelos; Stable
Diffusion é uma família de pesos e arquiteturas de modelos. Tampouco o modelo original foi uma
invenção exclusiva da empresa. Ele surgiu da pesquisa acadêmica sobre difusão latente e de uma
colaboração entre pesquisadores do grupo CompVis da Universidade Luís Maximiliano de Munique e da
Runway, com infraestrutura e apoio da Stability AI, LAION, EleutherAI e outras
organizações.[^ldm][^launch]

## Fundação e crescimento inicial

Mostaque fundou a empresa em torno da ideia de tornar modelos generativos poderosos amplamente
acessíveis. Sua estratégia inicial combinava infraestrutura computacional financiada de forma
privada com colaborações entre pesquisadores independentes e comunidades de pesquisa aberta. Em
outubro de 2022, pouco depois do lançamento público do Stable Diffusion, a Stability AI anunciou uma
rodada de financiamento de US$ 101 milhões liderada pela Coatue, Lightspeed Venture Partners e
O'Shaughnessy Ventures.[^funding]

A empresa forneceu a capacidade computacional usada para treinar a primeira versão do Stable
Diffusion. Seu próprio relato do lançamento atribui a liderança do trabalho a Patrick Esser, da
Runway, e Robin Rombach, da LMU de Munique, com base no projeto de difusão latente do CompVis e apoio
da equipe da Stability AI e das comunidades LAION e EleutherAI. Os primeiros pesos de ampla
disponibilidade pública foram lançados em 22 de agosto de 2022.[^launch][^public-release]

Essa divisão de trabalho é historicamente importante. Chamar a Stability AI de _publicadora_ ou
principal patrocinadora comercial do modelo inicial é correto; descrever a empresa como sua única
criadora apaga a linhagem de pesquisa e as organizações colaboradoras. Gerações posteriores, entre
elas o [Stable Diffusion XL](/pt/stable-diffusion-xl/) e o Stable Diffusion 3, foram
desenvolvidas e lançadas mais diretamente sob a Stability AI.[^sdxl-paper][^sd3-paper]

## Modelos e produtos

A Stability AI se expandiu da geração de imagens para pesquisas em áudio, vídeo, 3D e linguagem.
Entre seus lançamentos e serviços mais conhecidos estão:

- **Stable Diffusion**, uma sucessão de modelos de texto para imagem disponíveis para download, que
  inclui as gerações 1.x, 2.x, SDXL, 3 e 3.5.
- **Stable Image**, um conjunto de serviços hospedados de geração e edição de imagens baseado nos
  modelos da empresa.
- **DreamStudio**, uma interface web voltada ao público para gerar imagens.
- **Stable Video**, **Stable Audio** e várias famílias de modelos 3D.
- APIs para desenvolvedores, pacotes de implantação, trabalhos com modelos personalizados e
  ferramentas empresariais de produção.

Os termos exatos de acesso e licença variam entre lançamentos. Os primeiros pesos do Stable
Diffusion usavam variantes da licença CreativeML Open RAIL. O SDXL 1.0 usava a CreativeML Open
RAIL++-M, enquanto o Stable Diffusion 3.5 usa a licença posterior Stability AI Community License.
Esta é gratuita para uso não comercial e para organizações comerciais abaixo do limite de receita
anual indicado; nos casos abrangidos acima desse limite, exige-se uma licença
empresarial.[^sdxl-license][^community-license] Portanto, quem usar um checkpoint específico deve
ler a ficha do modelo e a licença daquele checkpoint, em vez de presumir que todos os modelos com o
nome “Stable” tenham os mesmos termos.

A Stability AI costuma descrever seus lançamentos disponíveis para download como “abertos” ou “de
código aberto”. Os pesos podem ser inspecionados, executados localmente e adaptados, o que representa
uma abertura consideravelmente maior do que a de um serviço disponível somente por API. Ainda
assim, alguns lançamentos impõem restrições de uso. Como a Definição de IA de Código Aberto da Open
Source Initiative exige liberdade para usar um sistema para qualquer finalidade, **pesos abertos**
costuma ser a descrição neutra mais precisa para lançamentos de pesos restritos.[^osaid]

## Mudança de liderança e direção comercial

Mostaque renunciou aos cargos de diretor-executivo e membro do conselho em 23 de março de 2024. A
diretora de operações Shan Shan Wong e o diretor de tecnologia Christian Laforte assumiram
interinamente como codiretores-executivos.[^resignation] Em 25 de junho, a Stability AI anunciou um
novo grupo de investidores, nomeou o ex-diretor-executivo da Weta Digital Prem Akkaraju como
diretor-executivo e tornou Sean Parker presidente-executivo.[^new-investment] Hanno Basse foi
nomeado diretor de tecnologia em agosto de 2024, e o cineasta James Cameron entrou para o conselho
no mês seguinte.[^basse][^cameron]

Sob essa liderança, a empresa passou a enfatizar a produção profissional de mídia, sistemas
empresariais personalizados e parcerias, além dos modelos fundacionais disponíveis para download.
Uma parceria de investimento e pesquisa com o grupo publicitário WPP em 2025 e o lançamento da
plataforma de produção Brand Studio em 2026 ilustram essa direção.[^wpp][^news] A Stability AI
continuava sendo uma empresa britânica ativa e anunciando novos produtos em julho de 2026; seus
lançamentos de maio de 2026 incluíram a família Stable Audio 3.0.[^companies-house][^news]

## Relação com a comunidade

Os pesos locais do Stable Diffusion possibilitaram um ecossistema de terceiros excepcionalmente
amplo. Desenvolvedores criaram interfaces como o Stable Diffusion WebUI do AUTOMATIC1111 e o
ComfyUI; especialistas em treinamento publicaram checkpoints com ajuste fino e adaptadores
[LoRA](/pt/low-rank-adaptation/); e artistas desenvolveram fluxos com preenchimento de regiões,
ControlNet, imagens de referência e prompts regionais. Grande parte desse trabalho não foi criada
nem é controlada pela Stability AI. A empresa oferece algumas bases e ferramentas oficiais,
enquanto integrantes da comunidade mantêm de modo independente muitos dos aplicativos que o público
chama informalmente de “Stable Diffusion”.[^a1111][^comfyui]

Esse ecossistema também sobreviveu a gerações individuais de modelos. O SDXL continua amplamente
utilizável em ferramentas locais, embora arquiteturas mais novas, da Stability AI ou não, possam
seguir prompts complexos com maior confiabilidade. Sua importância contínua entre entusiastas
depende tanto do acervo acumulado de adaptadores, checkpoints, documentação e fluxos para hardware
de consumo quanto dos resultados originais do modelo-base em benchmarks.

## Controvérsias e críticas

O treinamento de geradores de imagens em conjuntos de imagens e legendas obtidos na web em grande
escala provocou controvérsias sobre consentimento, direitos autorais, atribuição, viés e trabalho. A
Getty Images processou a Stability AI no Reino Unido e nos Estados Unidos e alegou, entre outras
coisas, que os modelos da empresa haviam sido treinados com material da Getty. Na ação inglesa, a
Getty abandonou durante o julgamento sua alegação principal de cópia para treinamento. A High Court
rejeitou a teoria restante de infração secundária de direitos autorais porque os modelos em questão
não armazenavam nem reproduziam as obras protegidas, mas reconheceu infração limitada de marca
relacionada a marcas-d'água da Getty em algumas saídas anteriores.[^getty-judgment] Essa decisão não
declarou lícito todo treinamento de modelos: a alegação territorial sobre o treinamento já não
estava diante do tribunal, e os resultados jurídicos dependem da jurisdição e dos fatos.

A Stability AI também alterou as políticas de filtragem, segurança e licenciamento entre gerações
de modelos. Esses controles podem reduzir algumas saídas nocivas, mas também têm custos:
filtros podem remover material lícito ou prejudicar conceitos não relacionados, enquanto pesos
executáveis localmente não podem ser governados como um serviço centralizado. A empresa entrou para
a Tech Coalition em 2026, depois de participar de seu programa de segurança infantil, como parte de
seu trabalho declarado na área.[^tech-coalition]

## Referências

[^companies-house]:
    [Stability AI Ltd: company overview](https://find-and-update.company-information.service.gov.uk/company/12295325),
    UK Companies House.

[^funding]:
    [Stability AI announces $101 million in funding for open-source artificial intelligence](https://stability.ai/news-updates/stability-ai-announces-101-million-in-funding-for-open-source-artificial-intelligence),
    Stability AI, 17 de outubro de 2022.

[^hodes]:
    Kenrick Cai e Iain Martin, [Stability AI cofounder says Emad Mostaque tricked him into selling
    stake for $100](https://www.forbes.com/sites/kenrickcai/2023/07/13/stability-ai-cofounder-says-emad-mostaque-tricked-him-into-selling-stake-for-100/),
    _Forbes_, 13 de julho de 2023.

[^ldm]:
    Robin Rombach et al., [High-Resolution Image Synthesis with Latent Diffusion
    Models](https://arxiv.org/abs/2112.10752), _Proceedings of CVPR 2022_.

[^launch]:
    [Stable Diffusion launch announcement](https://stability.ai/news-updates/stable-diffusion-announcement),
    Stability AI, 10 de agosto de 2022.

[^public-release]:
    [Stable Diffusion public release](https://stability.ai/news-updates/stable-diffusion-public-release),
    Stability AI, 22 de agosto de 2022.

[^sdxl-paper]:
    Dustin Podell et al., [SDXL: Improving Latent Diffusion Models for High-Resolution Image
    Synthesis](https://arxiv.org/abs/2307.01952), _ICLR 2024_.

[^sd3-paper]:
    Patrick Esser et al., [Scaling Rectified Flow Transformers for High-Resolution Image
    Synthesis](https://arxiv.org/abs/2403.03206), 2024.

[^sdxl-license]:
    [CreativeML Open RAIL++-M License for SDXL 1.0](https://github.com/Stability-AI/generative-models/blob/main/model_licenses/LICENSE-SDXL1.0),
    Stability AI.

[^community-license]: [Stability AI Community License Agreement](https://stability.ai/license), Stability AI.

[^osaid]:
    [The Open Source AI Definition 1.0](https://opensource.org/ai/open-source-ai-definition), Open
    Source Initiative, 28 de outubro de 2024.

[^resignation]:
    [Stability AI announcement](https://stability.ai/news/stabilityai-announcement), Stability AI,
    23 de março de 2024.

[^new-investment]:
    [Stability AI secures significant new investment and appoints Prem Akkaraju as CEO](https://stability.ai/news-updates/stability-ai-secures-significant-new-investment),
    Stability AI, 25 de junho de 2024.

[^basse]:
    [Stability AI names Hanno Basse as new chief technology officer](https://stability.ai/news-updates/stability-ai-names-hanno-basse-as-new-chief-technology-officer),
    Stability AI, 19 de agosto de 2024.

[^cameron]:
    [James Cameron joins Stability AI board of directors](https://stability.ai/news-updates/james-cameron-joins-stability-ai-board-of-directors),
    Stability AI, 24 de setembro de 2024.

[^wpp]:
    [Stability AI announces investment from WPP and new partnership](https://stability.ai/news-updates/stability-ai-announces-investment-from-wpp-and-new-partnership-to-shape-the-future-of-media-and-entertainment-production),
    Stability AI, 5 de março de 2025.

[^news]: [News and updates](https://stability.ai/news-updates), Stability AI, acesso em 12 de julho de 2026.

[^a1111]:
    [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui), colaboradores
    do AUTOMATIC1111, GitHub.

[^comfyui]: [ComfyUI](https://github.com/comfyanonymous/ComfyUI), colaboradores do ComfyUI, GitHub.

[^getty-judgment]:
    _Getty Images (US), Inc. and others v Stability AI Ltd_, [\[2025\] EWHC 2863
    (Ch)](https://www.judiciary.uk/judgments/getty-images-and-others-v-stability-ai/), High Court of
    Justice of England and Wales, 4 de novembro de 2025.

[^tech-coalition]:
    [Stability AI joins the Tech Coalition](https://stability.ai/news-updates/stability-ai-joins-the-tech-coalition),
    Stability AI, 11 de fevereiro de 2026.
