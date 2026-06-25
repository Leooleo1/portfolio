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
        '<a href="mailto:' +
          esc(p.email) +
          '" data-cursor="link">' +
          esc(p.email) +
          "</a>"
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
        '<p class="sidebar-name">' +
        esc(p.name) +
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
    var shots = (project.coverShots && project.coverShots.length
      ? project.coverShots
      : project.cover
      ? [project.cover]
      : []
    ).slice(0, 3);
    var stage = shots
      .map(function (src) {
        return (
          '<figure class="card__shot"><img src="' +
          asset(src) +
          '" alt="" loading="lazy" decoding="async"></figure>'
        );
      })
      .join("");
    var cover =
      '<div class="card__stage" data-count="' + shots.length + '">' + stage + "</div>";

    return (
      '<li class="reveal">' +
      '<article class="card" data-theme="' +
      esc(project.theme || "pink") +
      '" data-slug="' +
      esc(project.slug) +
      '" role="button" tabindex="0" data-cursor="view" aria-label="Ampliar prints de ' +
      esc(project.title) +
      '">' +
      '<div class="card__top">' +
      '<span class="card__hole" aria-hidden="true"></span>' +
      '<span class="card__num">' +
      esc(num) +
      "</span>" +
      "</div>" +
      '<div class="card__media" data-device="' +
      esc(project.device || "mobile") +
      '" data-theme="' +
      esc(project.theme || "pink") +
      '">' +
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
      "</article>" +
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

  function columnMarkup(col, profile) {
    var items = col.kind === "social" ? profile.social || [] : col.items || [];
    var links = items
      .map(function (item) {
        return (
          '<li><a href="' +
          esc(item.href) +
          '" data-cursor="link"' +
          (item.active ? ' class="is-active"' : "") +
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

  /* ---- Lightbox / visualizador de prints -------------------------- */
  // Reúne todas as imagens únicas de um projeto, na ordem de exibição.
  function projectGallery(p) {
    var imgs = [];
    function add(s) {
      if (s && imgs.indexOf(s) === -1) imgs.push(s);
    }
    (p.coverShots || []).forEach(add);
    add(p.cover);
    ((p.detail && p.detail.sections) || []).forEach(function (sec) {
      (sec.images || []).forEach(add);
    });
    return imgs;
  }

  var lb = null;
  var lbState = { items: [], active: 0, lastFocus: null };

  function buildLightbox() {
    if (lb) return lb;
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("data-lightbox", "");
    lb.hidden = true;
    lb.innerHTML =
      '<div class="lightbox__backdrop" data-lb-close></div>' +
      '<div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="Visualização ampliada do projeto">' +
      '<div class="lightbox__bar">' +
      '<p class="lightbox__title" data-lb-title></p>' +
      '<button class="lightbox__close" type="button" data-lb-close aria-label="Fechar">×</button>' +
      "</div>" +
      '<div class="lightbox__stage" data-lb-stage></div>' +
      '<div class="lightbox__controls">' +
      '<button class="lightbox__arrow" type="button" data-lb-prev aria-label="Anterior">‹</button>' +
      '<span class="lightbox__count" data-lb-count></span>' +
      '<button class="lightbox__arrow" type="button" data-lb-next aria-label="Próximo">›</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(lb);

    lb.querySelectorAll("[data-lb-close]").forEach(function (b) {
      b.addEventListener("click", closeLightbox);
    });
    lb.querySelector("[data-lb-prev]").addEventListener("click", function () {
      setActive(lbState.active - 1);
    });
    lb.querySelector("[data-lb-next]").addEventListener("click", function () {
      setActive(lbState.active + 1);
    });
    lb.querySelector("[data-lb-stage]").addEventListener("click", function (e) {
      var item = e.target.closest(".lightbox__item");
      if (!item) return;
      var i = parseInt(item.getAttribute("data-i"), 10);
      if (i !== lbState.active) setActive(i);
    });
    return lb;
  }

  function layoutStage() {
    var items = lb.querySelectorAll(".lightbox__item");
    items.forEach(function (item, i) {
      var off = i - lbState.active;
      var abs = Math.abs(off);
      var x = off * 56;
      var scale = off === 0 ? 1 : abs === 1 ? 0.78 : 0.6;
      var rot = off === 0 ? 0 : off < 0 ? 7 : -7;
      var op = abs > 2 ? 0 : off === 0 ? 1 : abs === 1 ? 0.85 : 0.4;
      item.style.transform =
        "translate(-50%, -50%) translateX(" +
        x +
        "%) scale(" +
        scale +
        ") rotateY(" +
        rot +
        "deg)";
      item.style.opacity = op;
      item.style.zIndex = String(100 - abs);
      item.style.pointerEvents = abs > 2 ? "none" : "auto";
      item.classList.toggle("is-active", off === 0);
    });
    var count = lb.querySelector("[data-lb-count]");
    if (count) {
      count.textContent =
        lbState.items.length > 1
          ? lbState.active + 1 + " / " + lbState.items.length
          : "";
    }
  }

  function setActive(i) {
    var n = lbState.items.length;
    lbState.active = Math.max(0, Math.min(n - 1, i));
    layoutStage();
  }

  function openLightbox(slug) {
    var p = findProject(slug);
    if (!p) return;
    var imgs = projectGallery(p);
    if (!imgs.length) return;

    buildLightbox();
    lbState.items = imgs;
    lbState.active = 0;
    lbState.lastFocus = document.activeElement;

    var stage = lb.querySelector("[data-lb-stage]");
    stage.setAttribute("data-device", p.device || "mobile");
    stage.innerHTML = imgs
      .map(function (src, i) {
        return (
          '<figure class="lightbox__item" data-i="' +
          i +
          '" data-cursor="link"><img src="' +
          asset(src) +
          '" alt="" decoding="async"></figure>'
        );
      })
      .join("");
    lb.querySelector("[data-lb-title]").textContent = p.title;

    lb.hidden = false;
    document.body.classList.add("lb-open");
    requestAnimationFrame(function () {
      lb.classList.add("is-open");
      layoutStage();
    });
    var closeBtn = lb.querySelector(".lightbox__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.classList.remove("is-open");
    document.body.classList.remove("lb-open");
    var done = function () {
      lb.hidden = true;
      lb.removeEventListener("transitionend", done);
    };
    if (prefersReduced) {
      done();
    } else {
      lb.addEventListener("transitionend", done);
      setTimeout(done, 450);
    }
    if (lbState.lastFocus && lbState.lastFocus.focus) lbState.lastFocus.focus();
  }

  function wireLightbox() {
    var cards = el("cards");
    if (!cards) return;
    cards.addEventListener("click", function (e) {
      var card = e.target.closest(".card[data-slug]");
      if (card) openLightbox(card.getAttribute("data-slug"));
    });
    cards.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var card = e.target.closest(".card[data-slug]");
      if (!card) return;
      e.preventDefault();
      openLightbox(card.getAttribute("data-slug"));
    });
    document.addEventListener("keydown", function (e) {
      if (!lb || lb.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") setActive(lbState.active - 1);
      else if (e.key === "ArrowRight") setActive(lbState.active + 1);
    });
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

  /* ---- Cursor customizado (apenas em ponteiro fino) --------------- */
  function wireCursor() {
    var fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || prefersReduced) return;

    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;

    document.body.classList.add("has-cursor");

    var rx = 0, ry = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform =
        "translate3d(" + (tx - 3.5) + "px," + (ty - 3.5) + "px,0)";
      document.body.classList.add("cursor-ready");
    });

    (function loop() {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      ring.style.transform =
        "translate3d(" + (rx - 17) + "px," + (ry - 17) + "px,0)";
      requestAnimationFrame(loop);
    })();

    document.addEventListener("mouseover", function (e) {
      if (e.target.closest("a, button, [data-cursor]")) {
        document.body.classList.add("cursor-active");
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest("a, button, [data-cursor]")) {
        document.body.classList.remove("cursor-active");
      }
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
    wireSidebar();
    wireCursor();
    wireReveal();
    wireLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
