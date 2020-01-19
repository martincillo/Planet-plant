class Cart {
  constructor(obj) {
    this._total = document.querySelector(obj.total);
    this._amount = document.querySelector(obj.amount);
    this._data = [];
    this._key = "products";

    this.render();
  }

  render() {
    const total = this._data.reduce((acc, product) => acc + product.price, 0);

    this._total.textContent = this._data.length;
    this._amount.textContent = `$${total}`;
  }

  initialize(productList) {
    const productsLocal = localStorage.getItem(this._key);
    if (productsLocal) {
      const productsId = JSON.parse(productsLocal);
      this._data = productList.filter(product =>
        productsId.includes(product.id)
      );
      this.render();
    }
  }

  add(product) {
    const updateLocalStorage = () => {
      const productsId = JSON.stringify(this._data.map(product => product.id));

      localStorage.setItem(this._key, productsId);
    };

    if (this._data.some(item => item.id === product.id)) {
      alert("El producto seleccionado ya ha sido agregado.");
    } else {
      this._data.push(product);
      this.render();

      updateLocalStorage();
    }
  }
}

class Catalog {
  constructor(obj) {
    this._data = [];
    this._url = obj.url;
    this.container = document.querySelector(obj.container);
    this._config = obj.config;
    this._cart = obj.cart;
  }

  render() {
    const getData = () => {
      this.container.textContent = "Cargando...";
      if (this._data.length === 0) {
        return fetch(this._url)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw `Ha ocurrido un error: ${response.status}`;
            }
          })
          .then(json => {
            this._data = json;
            this._cart.initialize(json);
            return this._data;
          })
          .catch(error => console.error(error));
      } else {
        return new Promise(resolve => resolve(this._data));
      }
    };

    getData().then(data => {
      let template = [];
      const productTemplate = product => {
        return `
          <article class="product">
            <figure class="product__image">
              <img class="img-fluid" src="${product.image}" alt="${product.name}">
              <figcaption class="product__title">${product.name}</figcaption>
            </figure>
            <div class="product__info">
              ${product.description}
            </div>
            <footer class="product__footer flex">
              <a href="#" data-id="${product.id}" class="product__button text-center">Añadir al carrito</a>
              <p class="product__price text-center align-self-center">$${product.price}</p>
            </footer>
          </article>
        `;
      };

      const addCartEvent = e => {
        this.container.addEventListener("click", e => {
          const element = e.target;
          if (element.classList.contains("product__button")) {
            const id = parseInt(element.dataset.id);
            const product = this._data.find(item => item.id == id);

            this._cart.add(product);
          }
        });
      };

      data
        .sort(this._config.sort || ((a, b) => true))
        .map(product => template.push(productTemplate(product)));

      const products = template.join("");

      this.container.innerHTML = products;

      addCartEvent();
    });
  }
}
