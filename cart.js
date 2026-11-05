const CHECKOUT_EMAIL = "solejug@gmail.com";
const CART_KEY = "sole-cart";
const MARK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2F4A3A"/><rect x="12" y="22" width="40" height="8" rx="2" fill="#B8864B"/><rect x="17" y="30" width="6" height="18" rx="1.5" fill="#B8864B"/><rect x="41" y="30" width="6" height="18" rx="1.5" fill="#B8864B"/></svg>';
const money = n => "€" + n.toLocaleString("en", { maximumFractionDigits: 2 });

let cart = [];
try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  updateBasket();
}
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++; else cart.push({ id: id, qty: 1 });
  saveCart();
  openBasket();
}
function changeQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
}
function cartLines() {
  return cart
    .map(i => ({ p: products.find(p => p.id === i.id), qty: i.qty }))
    .filter(l => l.p);
}
function cartTotal() {
  return cartLines().reduce((sum, l) => sum + l.p.price * l.qty, 0);
}
function openBasket() {
  document.getElementById("overlay").classList.add("open");
  document.getElementById("panel").classList.add("open");
}
function closeBasket() {
  document.getElementById("overlay").classList.remove("open");
  document.getElementById("panel").classList.remove("open");
}
function updateBasket() {
  const lines = cartLines();
  const count = lines.reduce((s, l) => s + l.qty, 0);
  document.querySelectorAll(".basket-count").forEach(e => e.textContent = count);
  const box = document.getElementById("basket-items");
  if (!box) return;
  box.innerHTML = lines.length
    ? lines.map(l => `
      <div class="line">
        <div><strong>${l.p.name}</strong><br>${money(l.p.price)}</div>
        <div class="qty">
          <button aria-label="Remove one" onclick="changeQty('${l.p.id}', -1)">−</button>
          <span>${l.qty}</span>
          <button aria-label="Add one" onclick="changeQty('${l.p.id}', 1)">+</button>
        </div>
      </div>`).join("")
    : "<p>Your basket is empty.</p>";
  document.getElementById("basket-total").textContent = money(cartTotal());
  document.getElementById("checkout-btn").style.display = lines.length ? "block" : "none";
}
function checkout() {
  const lines = cartLines();
  if (!lines.length) return;
  const text = "Hello, I would like to order:\n\n"
    + lines.map(l => `${l.qty} x ${l.p.name} (${money(l.p.price)} each)`).join("\n")
    + `\n\nTotal: ${money(cartTotal())}\n\nName:\nDelivery address:\nPhone:`;
  window.location.href = "mailto:" + CHECKOUT_EMAIL
    + "?subject=" + encodeURIComponent("New order from Sole Furniture")
    + "&body=" + encodeURIComponent(text);
}
const photoOf = p => (p.images && p.images[0]) || p.image || "";
function renderProducts(containerId, list) {
  const box = document.getElementById(containerId);
  if (!list.length) { box.innerHTML = "<p class='empty'>No products here yet. Check back soon.</p>"; return; }
  box.innerHTML = list.map(p => `
    <article class="card">
      <a href="product.html?id=${p.id}" style="text-decoration:none;color:inherit">
        <div class="photo" style="background:${p.color}">${photoOf(p) ? `<img src="${photoOf(p)}" alt="${p.name}">` : "<span>Add photo</span>"}</div>
      </a>
      <div class="info">
        <h3><a href="product.html?id=${p.id}" style="text-decoration:none;color:inherit">${p.name}</a></h3>
        <p>${p.desc}</p>
        <div class="price">${money(p.price)}</div>
        <button class="buy" onclick="addToCart('${p.id}')">Add to basket</button>
      </div>
    </article>`).join("");
}
function renderCategoryBar(activeId) {
  const bar = document.getElementById("catbar");
  const used = categories.filter(c => products.some(p => p.category.includes(c.id)));
  bar.innerHTML = `<a href="shop.html"${activeId ? "" : ' aria-current="page"'}>All</a>`
    + used.map(c => `<a href="shop.html?c=${c.id}"${c.id === activeId ? ' aria-current="page"' : ""}>${c.name}</a>`).join("");
}
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="overlay" id="overlay" onclick="closeBasket()"></div>
    <aside class="panel" id="panel" aria-label="Your basket">
      <div class="panel-head"><h3>Your basket</h3><button onclick="closeBasket()" aria-label="Close basket">×</button></div>
      <div id="basket-items"></div>
      <div class="total"><span>Total</span><span id="basket-total">€0</span></div>
      <button id="checkout-btn" onclick="checkout()">Send order by email</button>
      <p class="note">We’ll reply to confirm your order, delivery cost and payment details.</p>
    </aside>`);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeBasket(); });
  const icon = document.createElement("link");
  icon.rel = "icon";
  icon.type = "image/svg+xml";
  icon.href = "data:image/svg+xml," + encodeURIComponent(MARK);
  document.head.appendChild(icon);
  document.querySelectorAll(".logo").forEach(a => a.insertAdjacentHTML("afterbegin",
    `<span style="display:inline-block;width:30px;height:30px;margin-right:10px;vertical-align:-8px">${MARK}</span>`));
  updateBasket();
});
