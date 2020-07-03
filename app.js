//variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//cart
let cart = [];
//buttons
let buttonsDOM = [];

//getting products
class Products {
  async getProducts() {
    try {
      let results = await fetch("./products.json");
      let data = await results.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;

        return { title, price, id, image };
      });
      return products;
    } catch (err) {
      console.error("error", err);
    }
  }
}

//display products
class UI {
  displayProducts(products) {
    let result = "";

    products.forEach((product) => {
      result += `<article class="product">
                <div class="img-container">
                    <img class="product-img" src=${product.image} alt="product">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to bag
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article>`;
    });
    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;

    buttons.forEach((button) => {
      let id = button.dataset.id;
      //cart is defined above as an array of items
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (e) => {
        e.target.innerText = "In Cart";
        e.target.disabled = true;
        //get product from products
        let cartItem = {...Storage.getProduct(id), amout:1};        
        //add product to the cart
        cart = [...cart, cartItem];       
        //save cart in local storage
        Storage.saveCart(cart);
        //set cart values
        //display cart item
        //show the cart
      });
    });
  }
}

//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id){
      let products = JSON.parse(localStorage.getItem('products'));
      return products.find(product => product.id === id);
  }

  static saveCart(cart){
      localStorage.setItem('cart', JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    })
    .catch((err) => console.error("Something went wrong: ", err));
});
