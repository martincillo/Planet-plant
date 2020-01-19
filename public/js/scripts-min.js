"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}var Cart=function(){function e(t){_classCallCheck(this,e),this._total=document.querySelector(t.total),this._amount=document.querySelector(t.amount),this._data=[],this._key="products",this.render()}return _createClass(e,[{key:"render",value:function(){var t=this._data.reduce(function(t,e){return t+e.price},0);this._total.textContent=this._data.length,this._amount.textContent="$".concat(t)}},{key:"initialize",value:function(t){var e=localStorage.getItem(this._key);if(e){var n=JSON.parse(e);this._data=t.filter(function(t){return n.includes(t.id)}),this.render()}}},{key:"add",value:function(e){var t,n=this;this._data.some(function(t){return t.id===e.id})?alert("El producto seleccionado ya ha sido agregado."):(this._data.push(e),this.render(),t=JSON.stringify(n._data.map(function(t){return t.id})),localStorage.setItem(n._key,t))}}]),e}(),Catalog=function(){function e(t){_classCallCheck(this,e),this._data=[],this._url=t.url,this.container=document.querySelector(t.container),this._config=t.config,this._cart=t.cart}return _createClass(e,[{key:"render",value:function(){var a=this;(a.container.textContent="Cargando...",0===a._data.length?fetch(a._url).then(function(t){if(t.ok)return t.json();throw"Ha ocurrido un error: ".concat(t.status)}).then(function(t){return a._data=t,a._cart.initialize(t),a._data}).catch(function(t){return console.error(t)}):new Promise(function(t){return t(a._data)})).then(function(t){var e=[];t.sort(a._config.sort||function(t,e){return!0}).map(function(t){return e.push(function(t){return'\n          <article class="product">\n            <figure class="product__image">\n              <img class="img-fluid" src="'.concat(t.image,'" alt="').concat(t.name,'">\n              <figcaption class="product__title">').concat(t.name,'</figcaption>\n            </figure>\n            <div class="product__info">\n              ').concat(t.description,'\n            </div>\n            <footer class="product__footer flex">\n              <a href="#" data-id="').concat(t.id,'" class="product__button text-center">Añadir al carrito</a>\n              <p class="product__price text-center align-self-center">$').concat(t.price,"</p>\n            </footer>\n          </article>\n        ")}(t))});var n=e.join("");a.container.innerHTML=n,a.container.addEventListener("click",function(t){var e=t.target;if(e.classList.contains("product__button")){var n=parseInt(e.dataset.id),r=a._data.find(function(t){return t.id==n});a._cart.add(r)}})})}}]),e}(),select=document.getElementById("order-products"),config={sort:null},cart=new Cart({total:"#total-products",amount:"#amount"}),catalog=new Catalog({url:"products.json",container:"#products",config:config,cart:cart});catalog.render();var orderedList=function(t){var e=t.target;switch(e.options[e.selectedIndex].value){case"0":config.sort=function(t,e){return e.price-t.price};break;case"1":config.sort=function(t,e){return t.price-e.price}}catalog.render()};select.addEventListener("change",function(t){return orderedList(t)});