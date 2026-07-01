/* =====================================================================
   main.js — Lê window.PORTFOLIO e desenha a interface.
   Funciona em duas páginas:
   - index.html  → home (intro + cards)
   - projeto.html?p=SLUG → estudo de caso do projeto
   Sem dependências.
   ===================================================================== */
(function () {
  "use strict";

  var data = window.PORTFOLIO;
  if (!data) {
    console.error("PORTFOLIO não encontrado. Verifique js/projects.js.");
    return;
  }

  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---- Helpers ---------------------------------------------------- */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function el(id) {
    return document.querySelector('[data-mount="' + id + '"]');
  }
  // Resolve caminho de imagem (lida com espaços/acentos nas pastas).
  function asset(path) {
    return encodeURI(String(path || ""));
  }

  // Linha de contato: localização · e-mail
  function contactMarkup(p) {
    var parts = [];
    if (p.location) parts.push("<span>" + esc(p.location) + "</span>");
    if (p.email)
      parts.push(
        '<button type="button" class="contact__action" data-footer-email-trigger aria-haspopup="dialog" aria-controls="footer-email-modal" data-cursor="link">' +
          esc(p.email) +
          "</button>"
      );
    if (!parts.length) return "";
    return (
      '<p class="contact">' +
      parts.join('<span class="contact__sep" aria-hidden="true">·</span>') +
      "</p>"
    );
  }

  /* ---- Sidebar: marca, navegação, status -------------------------- */
  function renderSidebar(p) {
    var brand = el("brand");
    if (brand) {
      brand.innerHTML =
        '<p class="sidebar-name sidebar-name--signature">' +
        esc(p.signatureName || p.name) +
        "</p>" +
        '<p class="sidebar-role">' +
        esc(p.role) +
        "</p>" +
        (p.bio ? '<p class="sidebar-bio">' + esc(p.bio) + "</p>" : "") +
        contactMarkup(p);
    }

    var nav = el("nav");
    if (nav && Array.isArray(p.nav)) {
      nav.innerHTML = p.nav
        .map(function (item) {
          return (
            '<a href="' +
            esc(item.href) +
            '"' +
            (item.active ? ' class="is-active" aria-current="page"' : "") +
            ">" +
            esc(item.label) +
            "</a>"
          );
        })
        .join("");
    }

    var status = el("status");
    if (status && p.status) {
      status.innerHTML =
        '<span class="dot" aria-hidden="true"></span>' + esc(p.status);
    }
  }

  /* ---- Intro (mobile) --------------------------------------------- */
  function renderIntro(p) {
    var mount = el("intro");
    if (!mount) return;
    // O nome aparece como assinatura no topo; aqui fica só o essencial.
    mount.innerHTML =
      '<h1 class="visually-hidden">' +
      esc(p.name) +
      "</h1>" +
      '<p class="intro__role">' +
      esc(p.role) +
      "</p>" +
      (p.bio ? '<p class="intro__statement">' + esc(p.bio) + "</p>" : "") +
      contactMarkup(p);
  }

  /* ---- Assinatura (canto superior direito) ------------------------ */
  function renderSignature(p) {
    var mount = el("signature");
    if (!mount) return;
    if (!p.signatureName) {
      mount.remove();
      return;
    }
    mount.innerHTML =
      '<span class="signature__name">' +
      esc(p.signatureName) +
      "</span>" +
      (p.signatureTag
        ? '<span class="signature__tag">' + esc(p.signatureTag) + "</span>"
        : "");
  }

  /* ---- Cards da home ---------------------------------------------- */
  function cardMarkup(project, index) {
    var num = "NO. " + String(index + 1).padStart(2, "0");
    var tags = (project.tags || [])
      .map(function (t) {
        return '<span class="tag">' + esc(t) + "</span>";
      })
      .join("");
    // Capa = composição "em leque" de até 3 prints sobre fundo temático.
    var coverSrc = project.cover || (project.coverShots && project.coverShots[0]) || "";
    var loading = index < 3 ? "eager" : "lazy";
    var priority =
      index === 0 || project.slug === "personal-ai" ? ' fetchpriority="high"' : "";
    var cover = coverSrc
      ? '<figure class="card__cover"><img src="' +
        asset(coverSrc) +
        '" alt="" loading="' +
        loading +
        '" decoding="async"' +
        priority +
        "></figure>"
      : "";

    return (
      '<li class="reveal">' +
      '<a class="card" href="projeto.html?p=' +
      esc(project.slug) +
      '" data-theme="' +
      esc(project.theme || "pink") +
      '" data-slug="' +
      esc(project.slug) +
      '" data-cursor="link" aria-label="Abrir projeto ' +
      esc(project.title) +
      '">' +
      '<div class="card__top">' +
      '<span class="card__hole" aria-hidden="true"></span>' +
      '<span class="card__num">' +
      esc(num) +
      "</span>" +
      "</div>" +
      '<div class="card__media">' +
      cover +
      "</div>" +
      '<div class="card__body">' +
      '<div class="card__header">' +
      '<h3 class="card__title">' +
      esc(project.title) +
      "</h3>" +
      (project.subtitle
        ? '<p class="card__subtitle">' + esc(project.subtitle) + "</p>"
        : "") +
      '<div class="card__tags">' +
      tags +
      "</div>" +
      "</div>" +
      (project.summary
        ? '<p class="card__desc">' + esc(project.summary) + "</p>"
        : "") +
      "</div>" +
      "</a>" +
      "</li>"
    );
  }

  function renderCards(projects) {
    var mount = el("cards");
    if (!mount || !Array.isArray(projects)) return;
    mount.innerHTML = projects
      .map(function (p, i) {
        return cardMarkup(p, i);
      })
      .join("");
  }

  /* ---- Página de projeto (case study) ----------------------------- */
  function findProject(slug) {
    return (data.projects || []).filter(function (p) {
      return p.slug === slug;
    })[0];
  }

  function shotsMarkup(images, device) {
    if (!images || !images.length) return "";
    var figs = images
      .map(function (src) {
        return (
          '<figure class="shot reveal"><img src="' +
          asset(src) +
          '" alt="" loading="lazy" decoding="async"></figure>'
        );
      })
      .join("");
    return '<div class="shots" data-device="' + esc(device || "desktop") + '">' + figs + "</div>";
  }

  function renderCase() {
    var mount = el("case");
    if (!mount) return;

    var slug = new URLSearchParams(window.location.search).get("p");
    var project = findProject(slug);

    if (!project) {
      mount.innerHTML =
        '<a class="case__back" href="index.html#projetos" data-cursor="link">' +
        '<span aria-hidden="true">←</span> Voltar</a>' +
        '<h1 class="case__title">Projeto não encontrado</h1>' +
        '<p class="case__intro">Volte para a home e escolha um projeto da lista.</p>';
      return;
    }

    document.title = project.title + " — Leonardo Lucena";

    // Tema do rodapé acompanha o projeto.
    var footer = document.querySelector("[data-footer]");
    if (footer && project.theme) footer.setAttribute("data-footer-color", project.theme);

    var tags = (project.tags || [])
      .map(function (t) {
        return '<span class="tag">' + esc(t) + "</span>";
      })
      .join("");

    var meta = (project.meta || [])
      .map(function (row) {
        return "<div><dt>" + esc(row.k) + "</dt><dd>" + esc(row.v) + "</dd></div>";
      })
      .join("");

    var detail = project.detail || {};
    var sections = (detail.sections || [])
      .map(function (s) {
        return (
          '<section class="case__section">' +
          (s.title ? "<h2>" + esc(s.title) + "</h2>" : "") +
          (s.body ? "<p>" + esc(s.body) + "</p>" : "") +
          shotsMarkup(s.images, project.device) +
          "</section>"
        );
      })
      .join("");

    mount.innerHTML =
      '<a class="case__back" href="index.html#projetos" data-cursor="link">' +
      '<span aria-hidden="true">←</span> Todos os projetos</a>' +
      '<header class="case__head">' +
      '<div class="case__tags">' +
      tags +
      "</div>" +
      '<h1 class="case__title">' +
      esc(project.title) +
      "</h1>" +
      (project.subtitle
        ? '<p class="case__subtitle">' + esc(project.subtitle) + "</p>"
        : "") +
      "</header>" +
      (detail.intro ? '<p class="case__intro">' + esc(detail.intro) + "</p>" : "") +
      (meta ? '<dl class="case__meta">' + meta + "</dl>" : "") +
      (project.cover
        ? '<div class="case__hero reveal"><img src="' +
          asset(project.cover) +
          '" alt="Tela principal de ' +
          esc(project.title) +
          '"></div>'
        : "") +
      sections;
  }

  /* ---- Rodapé: frase + colunas ------------------------------------ */
  function quoteMarkup(quote, bloom) {
    var bloomSet = {};
    (bloom || []).forEach(function (w) {
      bloomSet[w.toLowerCase()] = true;
    });
    return String(quote || "")
      .split(/\s+/)
      .map(function (word) {
        var clean = word.toLowerCase().replace(/[.,!?;:]/g, "");
        var cls = bloomSet[clean] ? "footer-word footer-word--bloom" : "footer-word";
        return '<span class="' + cls + '"><span>' + esc(word) + "</span></span>";
      })
      .join(" ");
  }

  var footerEmailModal = null;
  var footerEmailLastTrigger = null;

  function ensureFooterEmailModal(profile) {
    if (!profile || !profile.email || !document.body) return null;

    var existing = document.querySelector("[data-footer-email-modal]");
    if (existing) {
      var value = existing.querySelector("[data-footer-email-value]");
      var mailto = existing.querySelector("[data-footer-email-mailto]");
      if (value) value.textContent = profile.email;
      if (mailto) mailto.setAttribute("href", "mailto:" + profile.email);
      return existing;
    }

    var modal = document.createElement("div");
    modal.className = "footer-modal";
    modal.id = "footer-email-modal";
    modal.setAttribute("data-footer-email-modal", "");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="footer-modal__backdrop" data-footer-email-backdrop></div>' +
      '<div class="footer-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="footer-email-title">' +
      '<button type="button" class="footer-modal__close" data-footer-email-close aria-label="Fechar modal">×</button>' +
      '<p class="footer-modal__eyebrow">Email</p>' +
      '<h2 class="footer-modal__title" id="footer-email-title">Contato direto</h2>' +
      '<p class="footer-modal__value" data-footer-email-value>' +
      esc(profile.email) +
      '</p>' +
      '<a class="footer-modal__mailto" data-footer-email-mailto href="mailto:' +
      esc(profile.email) +
      '">Abrir no app de email</a>' +
      "</div>";
    document.body.appendChild(modal);
    return modal;
  }

  function openFooterEmailModal(trigger, profile) {
    footerEmailModal = footerEmailModal || ensureFooterEmailModal(profile);
    if (!footerEmailModal) return;

    footerEmailLastTrigger = trigger || document.activeElement;
    footerEmailModal.classList.add("is-open");
    footerEmailModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-footer-modal");

    var closeBtn = footerEmailModal.querySelector("[data-footer-email-close]");
    if (closeBtn) closeBtn.focus();
  }

  function closeFooterEmailModal() {
    if (!footerEmailModal) return;

    footerEmailModal.classList.remove("is-open");
    footerEmailModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-footer-modal");

    if (footerEmailLastTrigger && typeof footerEmailLastTrigger.focus === "function") {
      footerEmailLastTrigger.focus();
    }
  }

  function wireFooterEmailModal(profile) {
    if (!profile || !profile.email) return;

    footerEmailModal = ensureFooterEmailModal(profile);
    if (!footerEmailModal || footerEmailModal.__wired) return;
    footerEmailModal.__wired = true;

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-footer-email-trigger]");
      if (trigger) {
        e.preventDefault();
        openFooterEmailModal(trigger, profile);
        return;
      }

      if (
        e.target.closest("[data-footer-email-close]") ||
        e.target.closest("[data-footer-email-backdrop]")
      ) {
        closeFooterEmailModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && footerEmailModal.classList.contains("is-open")) {
        closeFooterEmailModal();
      }
    });
  }

  function columnMarkup(col, profile) {
    var items = col.kind === "social" ? profile.social || [] : col.items || [];
    var links = items
      .map(function (item) {
        if (item.action === "email-modal") {
          return (
            '<li><button type="button" class="footer__action" data-footer-email-trigger aria-haspopup="dialog" aria-controls="footer-email-modal" data-cursor="link">' +
            esc(item.label || profile.email) +
            "</button></li>"
          );
        }

        var attrs = "";
        if (item.target) attrs += ' target="' + esc(item.target) + '"';
        var rel = item.rel || (item.target === "_blank" ? "noreferrer noopener" : "");
        if (rel) attrs += ' rel="' + esc(rel) + '"';

        return (
          '<li><a href="' +
          esc(item.href) +
          '" data-cursor="link"' +
          (item.active ? ' class="is-active"' : "") +
          attrs +
          ">" +
          esc(item.label) +
          "</a></li>"
        );
      })
      .join("");
    return '<ul class="footer__col">' + links + "</ul>";
  }

  function renderFooter(footer, profile) {
    var quoteMount = el("footer-quote");
    if (quoteMount && footer) {
      quoteMount.innerHTML = quoteMarkup(footer.quote, footer.bloom);
    }
    var navMount = el("footer-nav");
    if (navMount && footer) {
      navMount.innerHTML = (footer.columns || [])
        .map(function (c) {
          return columnMarkup(c, profile);
        })
        .join("");
    }
  }

  /* ---- Sidebar como gaveta (mobile) ------------------------------- */
  function wireSidebar() {
    var sidebar = document.querySelector("[data-sidebar]");
    var tab = document.querySelector("[data-sidebar-open]");
    var closeBtn = document.querySelector("[data-sidebar-close]");
    var backdrop = document.querySelector("[data-sidebar-backdrop]");
    if (!sidebar) return;

    function open() {
      sidebar.classList.add("is-open");
      if (backdrop) backdrop.classList.add("is-open");
      if (tab) tab.setAttribute("aria-expanded", "true");
      var firstLink = sidebar.querySelector("a, button");
      if (firstLink) firstLink.focus();
    }
    function close() {
      sidebar.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-open");
      if (tab) {
        tab.setAttribute("aria-expanded", "false");
        tab.focus();
      }
    }

    if (tab) tab.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sidebar.classList.contains("is-open")) close();
    });
    sidebar.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a) close();
    });
  }

  /* ---- Revelar ao rolar + tema do rodapé na home ------------------ */
  function wireReveal() {
    var footer = document.querySelector("[data-footer]");
    var revealEls = document.querySelectorAll(".reveal");

    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (n) {
        n.classList.add("is-in");
      });
      return;
    }

    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    revealEls.forEach(function (n) {
      revealObs.observe(n);
    });

    // Na home, o tema do rodapé acompanha o card mais visível.
    var cards = document.querySelectorAll(".card[data-theme]");
    if (footer && cards.length) {
      var themeObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var theme = entry.target.getAttribute("data-theme");
              if (theme) footer.setAttribute("data-footer-color", theme);
            }
          });
        },
        { threshold: 0.6 }
      );
      cards.forEach(function (c) {
        themeObs.observe(c);
      });
    }
  }

  /* ---- Bootstrap -------------------------------------------------- */
  function init() {
    var profile = data.profile || {};
    renderSidebar(profile);
    renderIntro(profile);
    renderSignature(profile);
    renderCards(data.projects || []);
    renderCase();
    renderFooter(data.footer, profile);
    wireFooterEmailModal(profile);
    wireSidebar();
    wireReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
