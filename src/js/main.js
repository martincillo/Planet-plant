"use strict";
const select = document.getElementById("order-products");
let config = {
  sort: null
};
const cart = new Cart({
  total: "#total-products",
  amount: "#amount"
});

const catalog = new Catalog({
  url: "products.json",
  container: "#products",
  config,
  cart
});

catalog.render();

const orderedList = e => {
  const select = e.target;
  const optionSelected = select.options[select.selectedIndex].value;

  switch (optionSelected) {
    case "0":
      config.sort = (a, b) => b.price - a.price;
      break;

    case "1":
      config.sort = (a, b) => a.price - b.price;
      break;
  }

  catalog.render();
};

select.addEventListener("change", e => orderedList(e));
