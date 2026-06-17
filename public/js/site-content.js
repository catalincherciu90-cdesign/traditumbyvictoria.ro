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
            applyContact(cfg.contact);
            applyPromo(cfg.promo);
            applyPageTitle(cfg.pageTitles);
            applyCarousel(cfg.carousel);
        })
        .catch(function () { /* păstrează conținutul static implicit */ });
})();
