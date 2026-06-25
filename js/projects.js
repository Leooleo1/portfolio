/* =====================================================================
   projects.js — SEU CONTEÚDO MORA AQUI.
   Edite este arquivo para montar o portfólio. O site lê este objeto e
   desenha a home e as páginas de cada projeto sozinho.

   Como adicionar um projeto:
   1. Copie um bloco dentro de `projects: [ ... ]` e cole.
   2. Dê um `slug` único (vira o link: projeto.html?p=SEU-SLUG).
   3. Aponte as imagens para a pasta do projeto (com espaços, tudo bem).
   ===================================================================== */

window.PORTFOLIO = {
  /* ---- Perfil (sidebar) ------------------------------------------- */
  profile: {
    name: "Leonardo Lucena",
    role: "Designer & Desenvolvedor",
    logo: "✦ Leo",
    bio: "Projeto e construo produtos digitais — do conceito ao envio.",
    location: "Brasília/DF",
    email: "leonardorlucena@gmail.com",
    signatureName: "leonardolucena",
    signatureTag: "eu penso e então crio",
    status: "Disponível para novos projetos",
    nav: [
      { label: "Início", href: "index.html#inicio", active: true },
      { label: "Projetos", href: "index.html#projetos" },
      { label: "Contato", href: "mailto:leonardorlucena@gmail.com" },
    ],
    social: [
      { label: "Email", href: "mailto:leonardorlucena@gmail.com" },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },

  /* ---- Projetos --------------------------------------------------- */
  projects: [
    /* ---------------------------------------------------------------- 1 */
    {
      slug: "finance-auditor",
      title: "Finance Auditor",
      subtitle: "Controle financeiro com trilha de auditoria",
      tags: ["Produto", "Mobile", "Fintech"],
      theme: "green",
      device: "mobile",
      cover: "Projeto 1 Finance auditor/Pagina inicial.jpg",
      coverShots: [
        "Projeto 1 Finance auditor/Pagina inicial.jpg",
        "Projeto 1 Finance auditor/Dashboard.jpg",
        "Projeto 1 Finance auditor/Pagina contas.jpg",
      ],
      summary:
        "App de prestação de contas para campanhas: cada lançamento fica registrado com autoria e data, pronto para auditoria.",
      meta: [
        { k: "Função", v: "Produto, UI, Front-end" },
        { k: "Tipo", v: "Aplicativo mobile" },
        { k: "Ano", v: "2026" },
      ],
      detail: {
        intro:
          "Uma área restrita onde a equipe registra receitas e despesas da campanha com rastreabilidade total — desenhada para sobreviver a uma auditoria eleitoral.",
        sections: [
          {
            title: "Contexto",
            body:
              "Campanhas precisam prestar contas com rastreabilidade ponta a ponta. Planilhas soltas se perdem e não mostram quem lançou o quê, nem quando.",
            images: ["Projeto 1 Finance auditor/Pagina inicial.jpg"],
          },
          {
            title: "A solução",
            body:
              "Um painel financeiro onde todo lançamento carrega autor e data, alimentando relatórios já no formato da prestação de contas. Visual escuro e sóbrio para uso diário sem fadiga.",
            images: [
              "Projeto 1 Finance auditor/Dashboard.jpg",
              "Projeto 1 Finance auditor/Pagina painel.jpg",
            ],
          },
          {
            title: "Telas",
            body: "",
            images: [
              "Projeto 1 Finance auditor/Pagina contas.jpg",
              "Projeto 1 Finance auditor/Pagina relatorios.jpg",
              "Projeto 1 Finance auditor/Pagina troca de contas.jpg",
            ],
          },
        ],
      },
    },

    /* ---------------------------------------------------------------- 2 */
    {
      slug: "central-commander",
      title: "Central Commander",
      subtitle: "Central de comando para operação de redes",
      tags: ["Produto", "Dashboard", "Operação"],
      theme: "teal",
      device: "desktop",
      cover: "Projeto 2 Central Commander/Central pagina inicial.png",
      coverShots: [
        "Projeto 2 Central Commander/Central pagina inicial.png",
        "Projeto 2 Central Commander/pagina funcional.png",
        "Projeto 2 Central Commander/pagina dossie.png",
      ],
      summary:
        "Painel operacional que centraliza triagem de comentários e DMs, prova & custódia de incidentes e ações da equipe em tempo real.",
      meta: [
        { k: "Função", v: "Produto, UX, UI" },
        { k: "Tipo", v: "Aplicação web" },
        { k: "Ano", v: "2026" },
      ],
      detail: {
        intro:
          "Um centro de comando onde a equipe enxerga, tria e responde tudo que acontece nas redes — com registro de prova e custódia para cada incidente.",
        sections: [
          {
            title: "Contexto",
            body:
              "Comentários, mensagens e ocorrências chegavam por canais espalhados. Faltava um lugar único para priorizar e agir com histórico.",
            images: ["Projeto 2 Central Commander/Central pagina inicial.png"],
          },
          {
            title: "A solução",
            body:
              "Uma central com situação em tempo real, fila de triagem por canal e dossiês de incidente — tudo em um layout denso, porém legível.",
            images: [
              "Projeto 2 Central Commander/pagina funcional.png",
              "Projeto 2 Central Commander/pagina dossie.png",
            ],
          },
        ],
      },
    },

    /* ---------------------------------------------------------------- 3 */
    {
      slug: "personal-ai",
      title: "Personal AI",
      subtitle: "Assistente editorial com inteligência artificial",
      tags: ["Produto", "Mobile", "IA"],
      theme: "violet",
      device: "mobile",
      cover: "Projeto 3 - Personal Ai/Pagina inicial Ai.jpg",
      coverShots: [
        "Projeto 3 - Personal Ai/Pagina inicial Ai.jpg",
        "Projeto 3 - Personal Ai/Opçoes que ela fornece.jpg",
        "Projeto 3 - Personal Ai/Responsabilidade da ai.jpg",
      ],
      summary:
        "Assistente de IA sob medida que sugere pautas, revisa textos e checa conformidade para a comunicação da campanha.",
      meta: [
        { k: "Função", v: "Produto, UI, Conversa" },
        { k: "Tipo", v: "Assistente mobile" },
        { k: "Ano", v: "2026" },
      ],
      detail: {
        intro:
          "Um copiloto editorial que entende o contexto da campanha: ajuda a criar pautas, revisa o tom e verifica conformidade antes de publicar.",
        sections: [
          {
            title: "Contexto",
            body:
              "A equipe de conteúdo precisava de velocidade sem abrir mão de consistência e conformidade. Uma IA genérica não conhecia o contexto.",
            images: ["Projeto 3 - Personal Ai/Pagina inicial Ai.jpg"],
          },
          {
            title: "A solução",
            body:
              "Um assistente com atalhos para as tarefas reais — sugerir pauta, revisar texto, checar TSE — em uma conversa calma, com identidade própria.",
            images: [
              "Projeto 3 - Personal Ai/Opçoes que ela fornece.jpg",
              "Projeto 3 - Personal Ai/Responsabilidade da ai.jpg",
            ],
          },
        ],
      },
    },

    /* ---------------------------------------------------------------- 4 */
    {
      slug: "data-by-bi",
      title: "Data by BI",
      subtitle: "Inteligência de dados eleitorais",
      tags: ["Dados", "BI", "Análise"],
      theme: "orange",
      device: "desktop",
      cover: "Projeto 4 Data by BI/Dados.png",
      coverShots: [
        "Projeto 4 Data by BI/Dados.png",
        "Projeto 4 Data by BI/Dados2.png",
      ],
      summary:
        "Dashboards de BI que cruzam votos por localidade, partido e cargo para orientar as decisões da campanha.",
      meta: [
        { k: "Função", v: "Modelagem, Visualização" },
        { k: "Ferramenta", v: "Power BI" },
        { k: "Ano", v: "2026" },
      ],
      detail: {
        intro:
          "Painéis que transformam bases eleitorais brutas em leitura rápida: onde estão os votos, por quem e em qual cargo.",
        sections: [
          {
            title: "Contexto",
            body:
              "Os dados existiam, mas espalhados e ilegíveis. Decidir sem visão geográfica e por cargo era decidir no escuro.",
            images: ["Projeto 4 Data by BI/Dados.png"],
          },
          {
            title: "A solução",
            body:
              "Modelagem dos dados e dashboards com filtros por zona, partido, ano e cargo — incluindo um mapa de votos por região administrativa.",
            images: ["Projeto 4 Data by BI/Dados2.png"],
          },
        ],
      },
    },

    /* ---------------------------------------------------------------- 5 */
    {
      slug: "campaign-photos",
      title: "Campaign Photos",
      subtitle: "Galeria oficial de campanha",
      tags: ["Produto", "Galeria", "Web"],
      theme: "pink",
      device: "mobile",
      cover: "projeto 5 fotos/inicial.png",
      coverShots: ["projeto 5 fotos/inicial.png"],
      summary:
        "Galeria de fotos no estilo Google Photos / Pixieset: navegação por pessoas, favoritos e download em alta.",
      meta: [
        { k: "Função", v: "Produto, UI, Front-end" },
        { k: "Tipo", v: "Galeria web" },
        { k: "Ano", v: "2026" },
      ],
      detail: {
        intro:
          "Um acervo público e organizado das fotos da campanha — fácil de explorar no celular e de baixar em qualidade original.",
        sections: [
          {
            title: "Contexto",
            body:
              "Centenas de fotos precisavam chegar à imprensa e à equipe sem fricção, com curadoria e download confiável.",
            images: ["projeto 5 fotos/inicial.png"],
          },
          {
            title: "A solução",
            body:
              "Uma galeria com abas de Galeria, Favoritas e Pessoas, busca por momento e download em alta — pensada primeiro para o celular, fluida no desktop.",
            images: ["projeto 5 fotos/Desktop.png"],
          },
        ],
      },
    },
  ],

  /* ---- Rodapé ----------------------------------------------------- */
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
          { label: "Contato", href: "mailto:leonardorlucena@gmail.com" },
        ],
      },
    ],
  },
};
