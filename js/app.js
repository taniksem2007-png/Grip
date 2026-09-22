(function () {
  var MAIL = "hi@grip-pro.ru";
  var catalog = document.getElementById("catalog-list");
  var modal = document.getElementById("order-modal");
  var form = document.getElementById("order-form");
  var title = document.getElementById("order-product-title");
  var qtyInput = document.getElementById("order-qty");
  var productIdInput = document.getElementById("order-product-id");

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderCatalog() {
    var products = window.GRIP_PRODUCTS || [];
    catalog.innerHTML = "";
    products.forEach(function (product) {
      catalog.appendChild(renderCard(product));
    });
  }

  function bindGallery(media, slides) {
    var gallery = el("div", "gallery");
    var track = el("div", "gallery-track");
    slides.forEach(function (slide) {
      var img = document.createElement("img");
      img.src = slide.src;
      img.alt = slide.alt || "";
      track.appendChild(img);
    });
    gallery.appendChild(track);
    media.appendChild(gallery);
    if (slides.length < 2) return;

    var index = 0;
    function go(next) {
      index = (next + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dots.forEach(function (dot, i) {
        dot.className = i === index ? "is-on" : "";
      });
    }

    var prev = el("button", "gallery-btn prev", "‹");
    prev.type = "button";
    prev.setAttribute("aria-label", "Предыдущее фото");
    prev.addEventListener("click", function () { go(index - 1); });
    var next = el("button", "gallery-btn next", "›");
    next.type = "button";
    next.setAttribute("aria-label", "Следующее фото");
    next.addEventListener("click", function () { go(index + 1); });
    media.appendChild(prev);
    media.appendChild(next);

    var dotsWrap = el("div", "gallery-dots");
    var dots = slides.map(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Фото " + (i + 1));
      if (i === 0) dot.className = "is-on";
      dot.addEventListener("click", function () { go(i); });
      dotsWrap.appendChild(dot);
      return dot;
    });
    media.appendChild(dotsWrap);

    var startX = 0;
    gallery.addEventListener("touchstart", function (event) {
      startX = event.changedTouches[0].clientX;
    }, { passive: true });
    gallery.addEventListener("touchend", function (event) {
      var dx = event.changedTouches[0].clientX - startX;
      if (dx > 40) go(index - 1);
      if (dx < -40) go(index + 1);
    }, { passive: true });
  }

  function renderCard(product) {
    var card = el("article", "product-card");
    card.id = product.id;

    var media = el("div", "product-media");
    var slides = product.images && product.images.length
      ? product.images
      : [{ src: product.image, alt: product.imageAlt || product.name }];
    bindGallery(media, slides);
    if (product.photoPending) {
      media.appendChild(el("span", "photo-note", "Фото товара появится здесь"));
    }
    card.appendChild(media);

    var body = el("div", "product-body");
    body.appendChild(el("h3", "product-name", product.name));
    if (product.volume) {
      body.appendChild(el("p", "product-meta", product.volume));
    }
    if (product.purpose) {
      body.appendChild(el("p", "product-purpose", product.purpose));
    }
    if (product.sports && product.sports.length) {
      var list = el("ul", "sports-pills");
      product.sports.forEach(function (sport) {
        list.appendChild(el("li", "", sport));
      });
      body.appendChild(list);
    }

    var actions = el("div", "product-actions");
    if (product.orderable) {
      var btn = el("button", "btn btn-primary", "Заказать");
      btn.type = "button";
      btn.addEventListener("click", function () {
        openOrder(product, 1);
      });
      actions.appendChild(btn);
    } else {
      var soon = el("button", "btn btn-soon", "Скоро в продаже");
      soon.type = "button";
      soon.disabled = true;
      actions.appendChild(soon);
    }
    body.appendChild(actions);

    var details = document.createElement("details");
    details.className = "fine-print";
    details.appendChild(el("summary", "", "Состав и подробности"));
    if (product.composition) {
      details.appendChild(el("p", "composition", "Состав: " + product.composition + "."));
    }
    if (product.extra) {
      details.appendChild(el("p", "", product.extra));
    }
    body.appendChild(details);

    card.appendChild(body);
    return card;
  }

  function openOrder(product, qty) {
    title.textContent = product.name + " · " + product.volume;
    productIdInput.value = product.id;
    qtyInput.value = String(qty || 1);
    modal.hidden = false;
    document.body.classList.add("modal-open");
    document.getElementById("order-name").focus();
  }

  function closeOrder() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function changeQty(delta) {
    var next = Math.max(1, (parseInt(qtyInput.value, 10) || 1) + delta);
    qtyInput.value = String(next);
  }

  document.querySelectorAll("[data-close-modal]").forEach(function (node) {
    node.addEventListener("click", closeOrder);
  });

  document.querySelector("[data-qty-minus]").addEventListener("click", function () {
    changeQty(-1);
  });
  document.querySelector("[data-qty-plus]").addEventListener("click", function () {
    changeQty(1);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) closeOrder();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var product = (window.GRIP_PRODUCTS || []).find(function (item) {
      return item.id === productIdInput.value;
    });
    var qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    var name = document.getElementById("order-name").value.trim();
    var phone = document.getElementById("order-phone").value.trim();
    var email = document.getElementById("order-email").value.trim();
    var city = document.getElementById("order-city").value.trim();
    var comment = document.getElementById("order-comment").value.trim();

    var lines = [
      "Заказ с сайта grip-pro.ru",
      "",
      "Товар: " + (product ? product.name + " (" + product.volume + ")" : productIdInput.value),
      "Количество: " + qty,
      "Имя: " + name,
      "Телефон: " + phone,
      "Почта: " + email,
      "Город: " + city,
      "Комментарий: " + (comment || "—")
    ];

    var href =
      "mailto:" +
      MAIL +
      "?subject=" +
      encodeURIComponent("Заказ Grip: " + (product ? product.name : "товар") + " × " + qty) +
      "&body=" +
      encodeURIComponent(lines.join("\n"));

    window.location.href = href;
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  renderCatalog();
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

  if ("IntersectionObserver" in window) {
    var pillObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          pillObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );
    document.querySelectorAll(".sports-pills").forEach(function (list) {
      pillObserver.observe(list);
    });
  } else {
    document.querySelectorAll(".sports-pills").forEach(function (list) {
      list.classList.add("is-in");
    });
  }
})();
