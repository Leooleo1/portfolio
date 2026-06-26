/* =====================================================================
   projects.js — SEU CONTEÚDO MORA AQUI.
   A home e as páginas de projeto leem este objeto e montam a interface.
   ===================================================================== */

window.PORTFOLIO = {
  profile: {
    name: "Leonardo Lucena",
    role: "PRODUCT DESIGNER & DEVELOPER",
    logo: "✦ Leo",
    bio: "Projeto e construo produtos digitais — do conceito à operação real.",
    location: "Brasília/DF",
    email: "leonardorlucena@gmail.com",
    signatureName: "leonardolucena",
    signatureTag: "i think then i create",
    status: "Disponível para novos projetos",
    nav: [
      { label: "Início", href: "index.html#inicio", active: true },
      { label: "Projetos", href: "index.html#projetos" },
      {
        label: "Contato",
        href:
          "https://wa.me/5561996230474?text=" +
          encodeURIComponent(
            "Olá, gostaria de mais informações sobre o seu trabalho de desenvolvedor"
          ),
      },
    ],
    social: [
      { label: "Email", action: "email-modal" },
      {
        label: "GitHub",
        href: "https://github.com/Leooleo1",
        target: "_blank",
        rel: "noreferrer noopener",
      },
    ],
  },

  projects: [
    {
      slug: "finance-auditor",
      title: "Finance Auditor",
      subtitle: "Controle financeiro com trilha de auditoria",
      tags: ["Produto", "Mobile", "Fintech"],
      theme: "green",
      device: "mobile",
      cover: "Projeto 1 Finance auditor/edicoes-portfolio/proj1-hero.png",
      coverShots: [
        "Projeto 1 Finance auditor/edicoes-portfolio/proj1-1.png",
        "Projeto 1 Finance auditor/edicoes-portfolio/proj1-2.png",
        "Projeto 1 Finance auditor/edicoes-portfolio/proj1-3.png",
      ],
      summary:
        "App de prestação de contas para campanhas: cada lançamento fica registrado com autoria e data, pronto para auditoria.",
      meta: [
        { k: "Função", v: "Produto, UI, Front-end" },
        { k: "Tipo", v: "Aplicativo mobile" },
      ],
      detail: {
        intro:
          "Uma área restrita onde a equipe registra receitas e despesas da campanha com rastreabilidade total — desenhada para sobreviver a uma auditoria eleitoral.",
        sections: [
          {
            title: "Contexto",
            body:
              "Campanhas precisam prestar contas com rastreabilidade ponta a ponta. Planilhas soltas se perdem e não mostram quem lançou o quê, nem quando.",
            images: ["Projeto 1 Finance auditor/edicoes-portfolio/proj1-1.png"],
          },
          {
            title: "A solução",
            body:
              "Um painel financeiro onde todo lançamento carrega autor e data, alimentando relatórios já no formato da prestação de contas. Visual escuro e sóbrio para uso diário sem fadiga.",
            images: [
              "Projeto 1 Finance auditor/edicoes-portfolio/proj1-2.png",
            ],
          },
          {
            title: "Componentes-chave",
            body:
              "Auditoria garantida em um backend sólido, com armazenamento de PDF, imagens das notas fiscais por contas, espaço multi-conta funcional e totalmente personalizavel",
            images: [
              "Projeto 1 Finance auditor/edicoes-portfolio/proj1-3.png",
              "Projeto 1 Finance auditor/edicoes-portfolio/proj1-4.png",
            ],
          },
        ],
      },
    },

    {
      slug: "central-commander",
      title: "Central Commander",
      subtitle: "Central de comando para operação de redes",
      tags: ["Produto", "Dashboard", "Operação"],
      theme: "teal",
      device: "desktop",
      cover: "Projeto 2 Central Commander/edicoes-portfolio/00-central-cover-novo.png",
      coverShots: [
        "Projeto 2 Central Commander/edicoes-portfolio/novo-central-2.png",
        "Projeto 2 Central Commander/edicoes-portfolio/novo-central-3.png",
        "Projeto 2 Central Commander/edicoes-portfolio/novo-central-4.png",
      ],
      summary:
        "Painel operacional que centraliza triagem de comentários e DMs, prova & custódia de incidentes e ações da equipe em tempo real.",
      meta: [
        { k: "Função", v: "Produto, UX, UI" },
        { k: "Tipo", v: "Aplicação web" },
      ],
      detail: {
        intro:
          "Um centro de comando onde a equipe enxerga, tria e responde tudo que acontece nas redes — com registro de prova e custódia para cada incidente.",
        sections: [
          {
            title: "Contexto",
            body:
              "Comentários, mensagens e ocorrências chegavam por canais espalhados. Agora funcionam todos em um único lugar, garantindo assim melhor desempenho da equipe.",
            images: ["Projeto 2 Central Commander/edicoes-portfolio/novo-central-2.png"],
          },
          {
            title: "A solução",
            body:
              "Uma central com situação em tempo real, fila de triagem por canal e dossiês de incidente — juntamente com uma IA personalizada que automatiza a resposta aos comentários, criação de dossiês por contas para levar ao jurídico e também identificação de ataques coordenados em todas as redes sociais.",
            images: [
              "Projeto 2 Central Commander/edicoes-portfolio/novo-central-3.png",
            ],
          },
          {
            title: "Componentes-chave",
            body:
              "Automação para defesa de reputação social e criação de dossiês para levar casos de ataques/difamações ao jurídico de forma automática com a organização de PDF's com todos os dados dos ataques, print, hash, conta e rede.",
            images: [
              "Projeto 2 Central Commander/edicoes-portfolio/novo-central-4.png",
            ],
          },
        ],
      },
    },

    {
      slug: "personal-ai",
      title: "Personal AI",
      subtitle: "Assistente editorial com inteligência artificial",
      tags: ["Produto", "Mobile", "IA"],
      theme: "violet",
      device: "mobile",
      cover: "Projeto 3 - Personal Ai/edicoes-portfolio/05-personal-ai-hero.png",
      coverShots: [
        "Projeto 3 - Personal Ai/edicoes-portfolio/01-personal-ai-home-iphone.png",
        "Projeto 3 - Personal Ai/edicoes-portfolio/02-personal-ai-actions-iphone.png",
        "Projeto 3 - Personal Ai/edicoes-portfolio/03-personal-ai-responsabilidade-iphone.png",
      ],
      summary:
        "Assistente de IA sob medida que sugere pautas, revisa textos e checa conformidade para a comunicação da campanha.",
      meta: [
        { k: "Função", v: "Produto, UI, Conversa" },
        { k: "Tipo", v: "Assistente mobile" },
      ],
      detail: {
        intro:
          "Um copiloto editorial que entende o contexto da campanha: ajuda a criar pautas, personalizado com base no candidato, treinado para pensar como ele, revisa o tom e verifica conformidade antes de publicar.",
        sections: [
          {
            title: "Contexto",
            body:
              "A equipe de conteúdo precisava de velocidade sem abrir mão de consistência e conformidade. Uma IA genérica não conhecia o contexto. Agora com o agente personalizado você tem geração de imagens, ideias, pensamentos, briefings, posts e organogramas completos com base no perfil do candidato. Utilizamos diversos agentes de IA para calculo de risco na campanha, monitoramento da cidade com pautas atualizadas em tempo real",
            images: ["Projeto 3 - Personal Ai/edicoes-portfolio/01-personal-ai-home-iphone.png"],
          },
          {
            title: "A solução",
            body:
              "Um assistente com atalhos para as tarefas reais — sugerir pauta, revisar texto e checar as regulações do TSE — em uma conversa calma, com identidade própria.",
            images: [
              "Projeto 3 - Personal Ai/edicoes-portfolio/01-personal-ai-home-iphone.png",
              "Projeto 3 - Personal Ai/edicoes-portfolio/02-personal-ai-actions-iphone.png",
            ],
          },
          {
            title: "Componentes-chave",
            body:
              "Otimização do tempo, pensamento do candidato, geração de imagens com base no pensamento político, multíplos agentes, risco, editorial, briefings, monitoramento, jurídico e utilização pela população para questionamento de pautas",
            images: [
              "Projeto 3 - Personal Ai/edicoes-portfolio/03-personal-ai-responsabilidade-iphone.png",
              "Projeto 3 - Personal Ai/edicoes-portfolio/06-personal-ai-actions-callout.png",
              "Projeto 3 - Personal Ai/edicoes-portfolio/07-personal-ai-responsabilidade-callout.png",
            ],
          },
        ],
      },
    },

    {
      slug: "data-by-bi",
      title: "Data by BI",
      subtitle: "Inteligência de dados eleitorais",
      tags: ["Dados", "BI", "Análise"],
      theme: "orange",
      device: "desktop",
      cover: "Projeto 4 Data by BI/edicoes-portfolio/novo-bi-cover.png",
      coverShots: [
        "Projeto 4 Data by BI/edicoes-portfolio/novo-bi-cover.png",
        "Projeto 4 Data by BI/edicoes-portfolio/novo-bi-2.png",
      ],
      summary:
        "Dashboards de BI que cruzam votos por localidade, partido e cargo para orientar as decisões da campanha.",
      meta: [
        { k: "Função", v: "Modelagem, Visualização" },
        { k: "Ferramenta", v: "Power BI" },
      ],
      detail: {
        intro:
          "Painéis que transformam bases eleitorais brutas em leitura rápida: onde estão os votos, por quem e em qual cargo.",
        sections: [
          {
            title: "Contexto",
            body:
              "Os dados existiam, mas espalhados e ilegíveis. Decidir sem visão geográfica e por cargo era decidir no escuro.",
            images: ["Projeto 4 Data by BI/edicoes-portfolio/novo-bi-2.png"],
          },
          {
            title: "A solução",
            body:
              "Modelagem dos dados e dashboards com filtros por zona, partido, ano e cargo — incluindo um mapa de votos por região administrativa.",
            images: ["Projeto 4 Data by BI/edicoes-portfolio/novo-bi-cover.png"],
          },
          {
            title: "Componentes-chave",
            body:
              "A apresentação editorial destaca o mapa territorial e os cortes analíticos como ferramenta executiva, não como relatório cru.",
            images: [],
          },
        ],
      },
    },

    {
      slug: "campaign-photos",
      title: "Campaign Photos",
      subtitle: "Galeria oficial de campanha",
      tags: ["Produto", "Galeria", "Web"],
      theme: "pink",
      device: "desktop",
      cover: "projeto 5 fotos/edicoes-portfolio/04-photos-hero.png",
      coverShots: [
        "projeto 5 fotos/edicoes-portfolio/01-photos-browser-gallery.png",
        "projeto 5 fotos/edicoes-portfolio/04-photos-hero.png",
        "projeto 5 fotos/edicoes-portfolio/05-photos-browser-callout.png",
      ],
      summary:
        "Galeria de fotos no estilo Google Photos / Pixieset: navegação por pessoas, favoritos e download em alta.",
      meta: [
        { k: "Função", v: "Produto, UI, Front-end" },
        { k: "Tipo", v: "Galeria web" },
      ],
      detail: {
        intro:
          "Um acervo público e organizado das fotos da campanha — fácil de explorar no celular e de baixar em qualidade original.",
        sections: [
          {
            title: "Contexto",
            body:
              "Centenas de fotos precisavam chegar à imprensa e à equipe sem fricção, com curadoria e download confiável.",
            images: ["projeto 5 fotos/edicoes-portfolio/01-photos-browser-gallery.png"],
          },
          {
            title: "A solução",
            body:
              "Uma galeria com abas de Galeria, Favoritas e Pessoas, busca por momento e download em alta — pensada primeiro para o celular, fluida no desktop.",
            images: [
              "projeto 5 fotos/edicoes-portfolio/02-photos-mobile-showcase.png",
              "projeto 5 fotos/edicoes-portfolio/04-photos-hero.png",
            ],
          },
          {
            title: "Componentes-chave",
            body:
              "O case agora destaca busca, navegação por pessoas e CTA principal com callouts e composições prontas para apresentação.",
            images: [
              "projeto 5 fotos/edicoes-portfolio/03-photos-mobile-callout.png",
              "projeto 5 fotos/edicoes-portfolio/05-photos-browser-callout.png",
            ],
          },
        ],
      },
    },
  ],

  footer: {
    quote: "O próximo projeto pode ser o seu. Vamos conversar?",
    bloom: ["próximo", "seu", "conversar?"],
    columns: [
      { kind: "social" },
      {
        kind: "links",
        items: [
          { label: "Início", href: "index.html#inicio", active: true },
          { label: "Projetos", href: "index.html#projetos" },
          {
            label: "Contato",
            href:
              "https://wa.me/5561996230474?text=" +
              encodeURIComponent(
                "Olá, gostaria de mais informações sobre o seu trabalho de desenvolvedor"
              ),
          },
        ],
      },
    ],
  },
};
