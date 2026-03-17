import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

// Featured products: maps product ID to its detail page URL
const featured = [
  { id: "880RR", url: "product_pages/marmot-ajax-3.html" },
  { id: "985RF", url: "product_pages/northface-talus-4.html" },
  { id: "985PR", url: "product_pages/northface-alpine-3.html" },
  { id: "344YJ", url: "product_pages/cedar-ridge-rimrock-2.html" },
];

function calculateDiscountPercent(product) {
  const { SuggestedRetailPrice, FinalPrice } = product;
  if (FinalPrice >= SuggestedRetailPrice) return 0;
  return Math.round(
    ((SuggestedRetailPrice - FinalPrice) / SuggestedRetailPrice) * 100
  );
}

// TODO: Implement this function.
// Given a product and its discount percentage, return an HTML string for the
// discount indicator displayed on the listing card.
//
// When discount > 0, include BOTH:
//   - An overlay badge inside the image wrapper (class "product-card__discount-badge")
//     — shown on top of the product image in the top-right corner
//   - The original price with strikethrough (class "product-card__original-price")
//     — shown beside the final price
//
// Trade-off to consider:
//   Image overlay → eye-catching, seen before reading price, but can obscure the product photo.
//   Inline price → subtle, only noticed when reading price, easier to compare numbers.
//   This implementation uses BOTH for maximum clarity.
//
// When discount === 0, return "".
// Hint: You can return a template literal containing multiple HTML elements.
function discountTemplate(product, discount) {
  if (discount === 0) return "";
  return {
    badge: `<span class="product-card__discount-badge">-${discount}%</span>`,
    priceNote: `<span class="product-card__original-price"><s>$${product.SuggestedRetailPrice.toFixed(2)}</s></span>`,
  };
}

function productCardTemplate(product, url) {
  const discount = calculateDiscountPercent(product);
  const { badge = "", priceNote = "" } = discountTemplate(product, discount) ?? {};
  return `<li class="product-card">
    <a href="${url}">
      <div class="product-card__image-wrapper">
        <img src="${product.Image}" alt="${product.Name}" />
        ${badge}
      </div>
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">
        $${product.FinalPrice.toFixed(2)}
        ${priceNote}
      </p>
    </a>
  </li>`;
}

async function renderFeaturedProducts() {
  const allProducts = await dataSource.getData();
  const list = document.querySelector(".product-list");

  list.innerHTML = featured
    .map(({ id, url }) => {
      const product = allProducts.find((p) => p.Id === id);
      return product ? productCardTemplate(product, url) : "";
    })
    .join("");
}

renderFeaturedProducts();
