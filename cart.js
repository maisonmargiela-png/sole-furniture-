const CHECKOUT_EMAIL = "solejug@gmail.com";
const CART_KEY = "sole-cart";
const MARK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2F4A3A"/><rect x="12" y="22" width="40" height="8" rx="2" fill="#B8864B"/><rect x="17" y="30" width="6" height="18" rx="1.5" fill="#B8864B"/><rect x="41" y="30" width="6" height="18" rx="1.5" fill="#B8864B"/></svg>';
const money = n => "€" + n.toLocaleString("en", { maximumFractionDigits: 2 });

const MOON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/></svg>';
const SUN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const EXTRA_CSS = `
header{position:relative}
.catbar{display:none}
header nav{gap:10px}
header nav #basket-btn{margin-left:0}
#theme-btn,#menu-btn{background:transparent;color:var(--ink);border:1px solid var(--stone);border-radius:4px;padding:9px 14px;font:inherit;font-weight:600;cursor:pointer;display:inline-flex;align-items:center}
#theme-btn{padding:9px 10px}
#menu-panel{display:none;position:absolute;top:100%;right:5vw;width:min(300px,90vw);max-height:75vh;overflow:auto;background:var(--white);border:1px solid var(--stone);border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.18);padding:10px;z-index:9}
#menu-panel.open{display:block}
#menu-panel h4{font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:#6b766f;margin:12px 10px 4px}
#menu-panel a{display:block;padding:10px;border-radius:4px;text-decoration:none;font-weight:500}
#menu-panel a:hover,#menu-panel a[aria-current]{background:var(--bg)}
[data-theme="dark"]{--bg:#121714;--ink:#EEF0EC;--moss:#243B2F;--stone:#2E3933;--white:#1B231F;color-scheme:dark}
[data-theme="dark"] .hero,[data-theme="dark"] .photo,[data-theme="dark"] .main-photo{color:#FBFCFA}
[data-theme="dark"] .btn,[data-theme="dark"] #checkout-btn{color:#1F2A24}
[data-theme="dark"] .buy:hover{background:#B8864B;color:#1F2A24}
[data-theme="dark"] footer{background:#0D1210;color:#D9DDD5}
[data-theme="dark"] .info p,[data-theme="dark"] .note,[data-theme="dark"] .lead,[data-theme="dark"] .small{color:#A9B3AC}
[data-theme="dark"] #menu-panel h4{color:#8F9B93}
`;

let savedTheme = "light";
try { savedTheme = localStorage.getItem("sole-theme") || "light"; } catch (e) {}
document.documentElement.setAttribute("data-theme", savedTheme);

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  const b = document.getElementById("theme-btn");
  if (b) {
    b.innerHTML = t === "dark" ? SUN : MOON;
    b.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}
function toggleTheme() {
  const t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  try { localStorage.setItem("sole-theme", t); } catch (e) {}
  applyTheme(t);
}
function toggleMenu(force) {
  const panel = document.getElementById("menu-panel");
  const btn = document.getElementById("menu-btn");
  if (!panel || !btn) return;
  const open = typeof force === "boolean" ? force : !panel.classList.contains("open");
  panel.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", String(open));
}
function buildHeader() {
  const style = document.createElement("style");
  style.textContent = EXTRA_CSS;
  document.head.appendChild(style);
  const header = document.querySelector("header");
  const nav = document.querySelector("header nav");
  if (!header || !nav) return;
  nav.innerHTML = `
    <button id="theme-btn" onclick="toggleTheme()"></button>
    <button id="menu-btn" aria-expanded="false" aria-controls="menu-panel" onclick="toggleMenu()">Menu</button>
    <button id="basket-btn" onclick="openBasket()">Basket (<span class="basket-count">0</span>)</button>`;
  const here = new URLSearchParams(location.search).get("c");
  const onShop = location.pathname.endsWith("shop.html");
  const used = categories.filter(c => products.some(p => p.category.includes(c.id)));
  header.insertAdjacentHTML("beforeend", `
    <div id="menu-panel" aria-label="Site menu">
      <a href="index.html">Home</a>
      <h4>Shop</h4>
      <a href="shop.html"${onShop && !here ? ' aria-current="page"' : ""}>All products</a>
      ${used.map(c => `<a href="shop.html?c=${c.id}"${c.id === here ? ' aria-current="page"' : ""}>${c.name}</a>`).join("")}
      <h4>Information</h4>
      <a href="index.html#about">About us</a>
      <a href="index.html#contact">Contact</a>
    </div>`);
  applyTheme(document.documentElement.getAttribute("data-theme"));
  document.querySelectorAll("#menu-panel a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));
  document.addEventListener("click", e => { if (!e.target.closest("#menu-panel, #menu-btn")) toggleMenu(false); });
}

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
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeBasket(); toggleMenu(false); } });
  buildHeader();
  const icon = document.createElement("link");
  icon.rel = "icon";
  icon.type = "image/svg+xml";
  icon.href = "data:image/svg+xml," + encodeURIComponent(MARK);
  document.head.appendChild(icon);
  document.querySelectorAll(".logo").forEach(a => a.insertAdjacentHTML("afterbegin",
    `<span style="display:inline-block;width:30px;height:30px;margin-right:10px;vertical-align:-8px">${MARK}</span>`));
  updateBasket();
});
