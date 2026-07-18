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

    function openLightbox(images, startIndex) {
        if (!images || !images.length) return;
        var idx = startIndex || 0;
        var ov = document.createElement("div");
        ov.className = "tv-lightbox";
        var multi = images.length > 1;
        ov.innerHTML =
            '<span class="tv-lb-close" aria-label="Închide">&times;</span>' +
            (multi ? '<span class="tv-lb-prev" aria-label="Înapoi">&#10094;</span>' : '') +
            '<img class="tv-lb-img" alt="">' +
            (multi ? '<span class="tv-lb-next" aria-label="Înainte">&#10095;</span>' : '');
        document.body.appendChild(ov);
        document.body.style.overflow = "hidden";
        var imgEl = ov.querySelector(".tv-lb-img");
        function show(i) { idx = (i + images.length) % images.length; imgEl.src = images[idx]; }
        function close() { document.removeEventListener("keydown", key); document.body.style.overflow = ""; ov.remove(); }
        function key(e) {
            if (e.key === "Escape") close();
            else if (multi && e.key === "ArrowRight") show(idx + 1);
            else if (multi && e.key === "ArrowLeft") show(idx - 1);
        }
        show(idx);
        ov.querySelector(".tv-lb-close").onclick = close;
        if (multi) {
            ov.querySelector(".tv-lb-next").onclick = function (e) { e.stopPropagation(); show(idx + 1); };
            ov.querySelector(".tv-lb-prev").onclick = function (e) { e.stopPropagation(); show(idx - 1); };
        }
        ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
        document.addEventListener("keydown", key);
    }

    function applyImages(images) {
        if (!images) return;
        document.querySelectorAll("img[src]").forEach(function (img) {
            var fname = (img.getAttribute("src") || "").split("/").pop();
            if (fname && images[fname]) img.setAttribute("src", images[fname]);
        });
        if (images.pageHeader) {
            document.querySelectorAll(".page-header").forEach(function (el) {
                el.style.backgroundImage = "linear-gradient(135deg, rgba(30,25,22,.78), rgba(201,164,92,.38)), url('" + images.pageHeader + "')";
                el.style.backgroundSize = "cover";
                el.style.backgroundPosition = "center";
            });
        }
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
        var eyebrow = s.eyebrow ? '<p class="text-primary text-uppercase fw-bold mb-2 tv-eyebrow">' + esc(s.eyebrow) + '</p>' : '';
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
            imgWrap.style.cursor = "zoom-in";
            imgWrap.addEventListener("click", function (e) {
                if (e.target && e.target.tagName === "IMG") {
                    var i = p.images.indexOf(e.target.getAttribute("src"));
                    openLightbox(p.images, i < 0 ? 0 : i);
                }
            });
        }
    }

    function applyWhatsApp(contact) {
        if (!contact || !contact.phone) return;
        var digits = String(contact.phone).replace(/\D/g, "");
        if (digits.length < 9) return; // număr incomplet / placeholder → nu afișa butonul
        if (digits.charAt(0) === "0") digits = "40" + digits.slice(1);
        if (document.querySelector(".tv-whatsapp")) return;
        var a = document.createElement("a");
        a.className = "tv-whatsapp";
        a.href = "https://wa.me/" + digits + "?text=" +
            encodeURIComponent("Bună ziua! Aș dori informații despre produsele Traditum By Victoria.");
        a.target = "_blank";
        a.rel = "noopener";
        a.setAttribute("aria-label", "Scrie-ne pe WhatsApp");
        a.innerHTML = '<i class="fab fa-whatsapp"></i>';
        document.body.appendChild(a);
    }

    function applyEyebrows() {
        document.querySelectorAll("p.text-primary.text-uppercase").forEach(function (el) {
            var t = el.textContent.trim();
            if (t.indexOf("//") !== 0) return;
            el.textContent = t.replace(/^\/\/\s*/, "");
            el.classList.add("tv-eyebrow");
            if (el.closest(".text-center")) el.classList.add("tv-eyebrow-center");
        });
    }

    function applyTestimonials(list) {
        var $ = window.jQuery;
        if (!$ || !Array.isArray(list)) return;
        var $c = $(".testimonial-carousel");
        if (!$c.length) return;
        if (!list.length) {
            var sec = $c.closest(".container-xxl");
            if (sec.length) sec.hide();
            return;
        }
        var html = list.map(function (t) {
            var initial = esc((t.name || "?").trim().charAt(0).toUpperCase());
            var rating = Math.min(5, Math.max(1, parseInt(t.rating, 10) || 5));
            var stars = "";
            for (var i = 1; i <= 5; i++) stars += '<i class="' + (i <= rating ? "fa" : "far") + ' fa-star"></i>';
            return '' +
                '<div class="testimonial-item bg-white rounded p-4">' +
                '  <div class="d-flex align-items-center mb-4">' +
                '    <div class="flex-shrink-0 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width:56px;height:56px;font-size:1.4rem;font-weight:700;font-family:\'Playfair Display\',serif">' + initial + '</div>' +
                '    <div class="ms-3"><h5 class="mb-1">' + esc(t.name) + '</h5><span>' + esc(t.role || "Client") + '</span></div>' +
                '  </div>' +
                '  <div class="tv-stars">' + stars + '</div>' +
                '  <p class="mb-0">' + esc(t.text) + '</p>' +
                '</div>';
        }).join("");
        try { $c.trigger("destroy.owl.carousel"); } catch (e) {}
        $c.removeClass("owl-loaded owl-drag owl-hidden").empty().html(html);
        $c.owlCarousel({
            autoplay: false, smartSpeed: 1000, margin: 25, loop: true, center: true,
            dots: false, nav: true,
            navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'],
            responsive: { 0: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } },
        });
    }

    function applyGallery(list) {
        var host = document.getElementById("tv-gallery");
        if (!host) return;
        var section = document.getElementById("tv-gallery-section");
        if (!Array.isArray(list) || !list.length) {
            if (section) section.style.display = "none";
            return;
        }
        host.innerHTML = list.map(function (src, i) {
            return '<div class="col-lg-3 col-md-4 col-6 wow fadeInUp" data-wow-delay="' + (0.1 + (i % 4) * 0.1).toFixed(1) + 's">' +
                '<div class="tv-gallery-item rounded overflow-hidden">' +
                '<img loading="lazy" class="w-100" src="' + esc(src) + '" alt="Realizare Traditum By Victoria">' +
                '<div class="tv-gallery-zoom"><i class="fa fa-search-plus"></i></div>' +
                '</div></div>';
        }).join("");
        host.addEventListener("click", function (e) {
            var img = e.target.closest(".tv-gallery-item");
            if (!img) return;
            var imgs = [].map.call(host.querySelectorAll("img"), function (im) { return im.getAttribute("src"); });
            var idx = [].indexOf.call(host.querySelectorAll(".tv-gallery-item"), img);
            openLightbox(imgs, idx < 0 ? 0 : idx);
        });
    }

    function applyHours(hours) {
        if (!hours) return;
        var footer = document.querySelector(".footer .container .row");
        if (!footer || footer.querySelector(".tv-hours")) return;
        var days = [
            ["mon", "Luni"], ["tue", "Marți"], ["wed", "Miercuri"], ["thu", "Joi"],
            ["fri", "Vineri"], ["sat", "Sâmbătă"], ["sun", "Duminică"],
        ];
        var jsDayToKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        var now = new Date();
        var todayKey = jsDayToKey[now.getDay()];

        function isOpenNow() {
            var t = String(hours[todayKey] || "").trim();
            if (!t) return false;
            var m = t.match(/(\d{1,2})[:.](\d{2})\s*[-–]\s*(\d{1,2})[:.](\d{2})/);
            if (!m) return false;
            var mins = now.getHours() * 60 + now.getMinutes();
            var start = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
            var end = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
            return mins >= start && mins < end;
        }
        var open = isOpenNow();
        var rows = days.map(function (d) {
            var val = String(hours[d[0]] || "").trim() || "Închis";
            var cls = d[0] === todayKey ? ' class="tv-hours-today"' : "";
            return '<tr' + cls + '><td>' + d[1] + '</td><td class="text-end">' + esc(val) + '</td></tr>';
        }).join("");

        // reduce cele două coloane existente ca să încapă o a treia
        footer.querySelectorAll(".col-lg-6").forEach(function (c) {
            c.classList.remove("col-lg-6");
            c.classList.add("col-lg-4");
        });
        var col = document.createElement("div");
        col.className = "col-lg-4 col-md-6";
        col.innerHTML =
            '<h4 class="text-light mb-4">Program</h4>' +
            '<span class="tv-openstatus ' + (open ? "is-open" : "is-closed") + '">' +
            '<i class="bi bi-circle-fill"></i> ' + (open ? "Deschis acum" : "Închis acum") + '</span>' +
            '<table class="tv-hours"><tbody>' + rows + '</tbody></table>';
        footer.appendChild(col);
    }

    function cookieBanner() {
        try { if (localStorage.getItem("tv-cookie-consent")) return; } catch (e) { return; }
        var bar = document.createElement("div");
        bar.className = "tv-cookie";
        bar.innerHTML =
            '<span>Folosim cookie-uri pentru o experiență mai bună pe site. ' +
            '<a href="confidentialitate.html">Detalii</a></span>' +
            '<button type="button" class="tv-cookie-btn">Accept</button>';
        document.body.appendChild(bar);
        bar.querySelector(".tv-cookie-btn").addEventListener("click", function () {
            try { localStorage.setItem("tv-cookie-consent", "1"); } catch (e) {}
            bar.remove();
        });
    }

    function applyContent(c) {
        if (!c) return;
        function setId(id, val) { var el = document.getElementById(id); if (el && val != null) el.textContent = val; }
        function setAttr(sel, val) { var el = document.querySelector(sel); if (el && val != null) el.textContent = val; }
        function paragraphs(id, text) {
            var el = document.getElementById(id);
            if (!el || text == null) return;
            var parts = String(text).split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
            if (parts.length) el.innerHTML = parts.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
        }
        // Prima pagină — Despre
        if (c.homeAbout) {
            var ha = c.homeAbout;
            setId("home-about-eyebrow", ha.eyebrow);
            setId("home-about-title", ha.title);
            var htext = document.getElementById("home-about-text");
            if (htext) {
                var ps = [ha.p1, ha.p2].filter(function (x) { return x != null && String(x).trim(); });
                if (ps.length) htext.innerHTML = ps.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
            }
            (ha.bullets || []).forEach(function (b, i) { setAttr('[data-bullet="' + i + '"]', b); });
        }
        // Cifre
        if (Array.isArray(c.facts)) {
            c.facts.forEach(function (f, i) {
                setAttr('[data-fact="' + i + '"]', f.value);
                setAttr('[data-factlabel="' + i + '"]', f.label);
            });
        }
        // Servicii
        if (c.services) {
            var sv = c.services;
            setId("home-svc-eyebrow", sv.eyebrow);
            setId("home-svc-title", sv.title);
            setId("home-svc-intro", sv.intro);
            (sv.items || []).forEach(function (it, i) {
                setAttr('[data-svc-title="' + i + '"]', it.title);
                setAttr('[data-svc-text="' + i + '"]', it.text);
            });
        }
        // Pagina „Despre noi"
        if (c.aboutPage) {
            var ap = c.aboutPage;
            setId("about-page-eyebrow", ap.eyebrow);
            setId("about-page-title", ap.title);
            paragraphs("about-page-text", ap.story);
            setId("about-page-highlight", ap.highlight);
        }
    }

    function footerLegalLink() {
        var links = document.querySelectorAll(".footer a.btn-link");
        if (!links.length) return;
        if (document.querySelector('.footer a.btn-link[href="confidentialitate.html"]')) return;
        var last = links[links.length - 1];
        var a = document.createElement("a");
        a.className = "btn btn-link";
        a.href = "confidentialitate.html";
        a.textContent = "Confidențialitate";
        last.parentNode.appendChild(a);
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

    applyEyebrows();
    cookieBanner();
    footerLegalLink();

    fetch("/api/config", { credentials: "same-origin" })
        .then(function (r) { return r.json(); })
        .then(function (cfg) {
            if (!cfg) return;
            applyImages(cfg.images);
            applyLogo(cfg.logo);
            applyContact(cfg.contact);
            applyWhatsApp(cfg.contact);
            applyPromo(cfg.promo);
            applyPageTitle(cfg.pageTitles);
            applyProductPage(cfg.pages);
            applyCarousel(cfg.carousel);
            applyTestimonials(cfg.testimonials);
            applyGallery(cfg.gallery);
            applyHours(cfg.hours);
            applyContent(cfg.content);
        })
        .catch(function () { /* păstrează conținutul static implicit */ });

    // Produse pe pagina principală (primele 3 din admin)
    (function () {
        var host = document.getElementById("home-products");
        if (!host) return;
        function card(p) {
            var price = p.price ? '<div class="d-inline-block border border-primary rounded-pill px-3 mb-3">' + esc(p.price) + '</div>' : '';
            var badge = p.badge ? '<span class="tv-badge">' + esc(p.badge) + '</span>' : '';
            var img = p.image ? '<img loading="lazy" class="img-fluid" src="' + esc(p.image) + '" alt="' + esc(p.name) + '">' : '';
            return '<div class="col-lg-4 col-md-6 wow fadeInUp">' +
                '<div class="product-item d-flex flex-column bg-white rounded overflow-hidden h-100">' + badge +
                '<div class="text-center p-4">' + price + '<h3 class="mb-3">' + esc(p.name) + '</h3><span>' + esc(p.description) + '</span></div>' +
                '<div class="position-relative mt-auto">' + img +
                '<div class="product-overlay"><a class="btn btn-lg-square btn-outline-light rounded-circle" href="product.html"><i class="fa fa-eye text-primary"></i></a></div>' +
                '</div></div></div>';
        }
        fetch("/api/products", { credentials: "same-origin" })
            .then(function (r) { return r.json(); })
            .then(function (list) {
                if (!Array.isArray(list) || !list.length) {
                    host.innerHTML = '<div class="col-12 text-center text-muted py-4">Momentan nu sunt produse.</div>';
                    return;
                }
                host.innerHTML = list.slice(0, 3).map(card).join("");
            })
            .catch(function () {
                host.innerHTML = '<div class="col-12 text-center text-muted py-4">Produsele nu au putut fi încărcate.</div>';
            });
    })();

    // Formular de contact -> /api/contact
    (function () {
        var cf = document.getElementById("contact-form");
        if (!cf) return;
        cf.addEventListener("submit", function (e) {
            e.preventDefault();
            var btn = cf.querySelector('button[type="submit"]');
            var status = document.getElementById("contact-status");
            function val(id) { var el = document.getElementById(id); return el ? el.value : ""; }
            var payload = { name: val("name"), email: val("email"), subject: val("subject"), message: val("message") };
            var old = btn.innerHTML; btn.disabled = true; btn.textContent = "Se trimite...";
            if (status) status.innerHTML = "";
            fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
                .then(function (r) { return r.json(); })
                .then(function (res) {
                    if (res && res.ok) {
                        cf.reset();
                        if (status) status.innerHTML = '<div class="alert alert-success mb-0">Mulțumim! Mesajul a fost trimis. Te contactăm în curând.</div>';
                    } else {
                        if (status) status.innerHTML = '<div class="alert alert-danger mb-0">' + esc((res && res.error) || "A apărut o eroare. Încearcă din nou.") + '</div>';
                    }
                })
                .catch(function () {
                    if (status) status.innerHTML = '<div class="alert alert-danger mb-0">Eroare de rețea. Încearcă din nou.</div>';
                })
                .finally(function () { btn.disabled = false; btn.innerHTML = old; });
        });
    })();
})();
