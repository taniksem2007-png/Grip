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

  function renderCard(product) {
    var card = el("article", "product-card");
    card.id = product.id;

    var media = el("div", "product-media");
    var img = document.createElement("img");
    img.src = product.image;
    img.alt = product.imageAlt || product.name;
    media.appendChild(img);
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
      body.appendChild(
        el("p", "product-sports", "Подходит для " + product.sports.join(", ") + ".")
      );
    }

    if (product.orderable) {
      var actions = el("div", "product-actions");
      var btn = el("button", "btn btn-primary", "Заказать");
      btn.type = "button";
      btn.addEventListener("click", function () {
        openOrder(product, 1);
      });
      actions.appendChild(btn);
      body.appendChild(actions);
    }

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
  renderCatalog();
})();
