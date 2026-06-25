/* Aplică pe paginile publice conținutul editabil din admin (/api/config):
   carousel, banner promo, titluri pagini, date de contact. */
(function () {
    function esc(s) {
        return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }
    function setText(sel, value) {
        if (value == null) return;
        document.querySelectorAll(sel).forEach(function (el) { el.textContent = value; });
    }

    function applyContact(c) {
        if (!c) return;
        setText('[data-content="contact-phone"]', c.phone);
        setText('[data-content="contact-address"]', c.address);
        document.querySelectorAll('[data-content="contact-email"]').forEach(function (el) {
            if (!c.email) return;
            el.textContent = c.email;
            if (el.tagName === "A") el.setAttribute("href", "mailto:" + c.email);
        });
        // linkuri social: setează href sau ascunde dacă lipsește
        ["facebook", "instagram", "tiktok"].forEach(function (net) {
            var url = c[net];
            document.querySelectorAll('[data-social="' + net + '"]').forEach(function (el) {
                if (url) {
                    el.setAttribute("href", url);
                    el.setAttribute("target", "_blank");
                    el.setAttribute("rel", "noopener");
                    el.style.display = "";
                } else {
                    el.style.display = "none";
                }
            });
        });
    }

    function applyLogo(url) {
        if (!url) return;
        document.querySelectorAll("a.navbar-brand[data-logo]").forEach(function (a) {
            a.innerHTML = '<img src="' + esc(url) + '" alt="Traditum By Victoria" style="max-height:85px;width:auto;padding:6px 0;filter:drop-shadow(0 0 5px rgba(255,255,255,.65)) drop-shadow(0 0 14px rgba(201, 164, 92,.6))">';
        });
    }

    function applyPromo(p) {
        if (p && p.title) setText('[data-content="promo-title"]', p.title);
    }

    function applyPageTitle(titles) {
        if (!titles) return;
        var page = document.body.getAttribute("data-page");
        if (page && titles[page]) setText('[data-content="page-title"]', titles[page]);
    }

    function slideHtml(s) {
        var eyebrow = s.eyebrow ? '<p class="text-primary text-uppercase fw-bold mb-2">// ' + esc(s.eyebrow) + '</p>' : '';
        var subtitle = s.subtitle ? '<p class="text-light fs-5 mb-4 pb-3">' + esc(s.subtitle) + '</p>' : '';
        var button = s.buttonText ? '<a href="' + esc(s.buttonLink || '#') + '" class="btn btn-primary rounded-pill py-3 px-5">' + esc(s.buttonText) + '</a>' : '';
        return '' +
            '<div class="owl-carousel-item position-relative">' +
            '  <img class="img-fluid" src="' + esc(s.image) + '" alt="' + esc(s.title) + '">' +
            '  <div class="owl-carousel-inner">' +
            '    <div class="container"><div class="row justify-content-start"><div class="col-lg-8">' +
            eyebrow +
            '      <h1 class="display-1 text-light mb-4 animated slideInDown">' + esc(s.title) + '</h1>' +
            subtitle + button +
            '    </div></div></div>' +
            '  </div>' +
            '</div>';
    }

    function applyProductPage(pages) {
        if (!pages) return;
        var page = document.body.getAttribute("data-page");
        if (page !== "torturi" && page !== "candybar") return;
        var p = pages[page];
        if (!p) return;
        setText('[data-content="page-title"]', p.title);
        setText("#page-content-title", p.title);
        var desc = document.getElementById("page-content-desc");
        if (desc && p.description != null) {
            desc.innerHTML = String(p.description).split(/\n+/).filter(Boolean)
                .map(function (par) { return "<p>" + esc(par) + "</p>"; }).join("");
        }
        var priceEl = document.getElementById("page-price");
        if (priceEl) {
            var min = (p.priceMin || "").trim(), max = (p.priceMax || "").trim(), txt = "";
            if (min && max) txt = min + " – " + max + " lei";
            else if (min || max) txt = (min || max) + " lei";
            if (txt) { priceEl.textContent = txt; }
            else { var w = priceEl.closest(".d-inline-flex"); if (w) w.style.display = "none"; }
        }
        var imgWrap = document.getElementById("page-images");
        if (imgWrap && Array.isArray(p.images) && p.images.length) {
            var jq = window.jQuery;
            var imgStyle = "height:clamp(300px,42vw,520px);object-fit:cover";
            if (jq && p.images.length > 1) {
                imgWrap.className = "owl-carousel page-image-carousel rounded overflow-hidden shadow-sm";
                imgWrap.innerHTML = p.images.map(function (src) {
                    return '<div class="page-image-item"><img class="w-100" style="' + imgStyle + '" src="' + esc(src) + '" alt="' + esc(p.title) + '"></div>';
                }).join("");
                jq(imgWrap).owlCarousel({
                    items: 1, loop: true, autoplay: true, autoplayTimeout: 3500,
                    autoplayHoverPause: true, smartSpeed: 800, dots: false, nav: false,
                    animateOut: "fadeOut",
                });
            } else {
                imgWrap.className = "";
                imgWrap.innerHTML = '<img class="img-fluid rounded w-100 shadow-sm" style="' + imgStyle + '" src="' + esc(p.images[0]) + '" alt="' + esc(p.title) + '">';
            }
        }
    }

    function applyCarousel(slides) {
        var $ = window.jQuery;
        if (!$ || !slides || !slides.length) return;
        var $c = $(".header-carousel");
        if (!$c.length) return;
        try { $c.trigger("destroy.owl.carousel"); } catch (e) {}
        $c.removeClass("owl-loaded owl-drag owl-hidden").empty();
        $c.html(slides.map(slideHtml).join(""));
        $c.owlCarousel({
            autoplay: false, smartSpeed: 1500, loop: true, nav: true, dots: false, items: 1,
            navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'],
        });
    }

    fetch("/api/config", { credentials: "same-origin" })
        .then(function (r) { return r.json(); })
        .then(function (cfg) {
            if (!cfg) return;
            applyLogo(cfg.logo);
            applyContact(cfg.contact);
            applyPromo(cfg.promo);
            applyPageTitle(cfg.pageTitles);
            applyProductPage(cfg.pages);
            applyCarousel(cfg.carousel);
        })
        .catch(function () { /* păstrează conținutul static implicit */ });
})();
