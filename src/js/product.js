import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart");
  if (cart) {
    cart.push(product);
  } else {
    cart = [product];
  }
  setLocalStorage("so-cart", cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// TODO: Implement this function
// Given a product object, return the discount percentage as a whole number (0-100),
// or 0 if there is no discount.
// Use product.SuggestedRetailPrice and product.FinalPrice.
// Example: SuggestedRetailPrice=89.99, FinalPrice=69.99 → should return 22
function calculateDiscountPercent(product) {
  const { SuggestedRetailPrice, FinalPrice } = product;
  if (FinalPrice >= SuggestedRetailPrice) return 0;
  return Math.round(((SuggestedRetailPrice - FinalPrice) / SuggestedRetailPrice) * 100);
}

async function renderDiscountBadge() {
  const productId = document.getElementById("addToCart").dataset.id;
  const product = await dataSource.findProductById(productId);
  const discount = calculateDiscountPercent(product);

  if (discount > 0) {
    const priceEl = document.querySelector(".product-card__price");
    priceEl.classList.add("product__price-wrapper");
    priceEl.insertAdjacentHTML(
      "beforeend",
      `<span class="product__original-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>
       <span class="product__discount-badge">Save ${discount}%</span>`
    );
  }
}

renderDiscountBadge();

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
