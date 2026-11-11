const CHECKOUT_EMAIL = "solejugg@gmail.com";
const CART_KEY = "sole-cart";
const PAY_API = "https://sole-play.solejugg.workers.dev";
const MARK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#24402F"/><path d="M18 36a14 14 0 0 1 28 0z" fill="#E0A66F"/><rect x="11" y="38" width="42" height="5" rx="2.5" fill="#F6F2EA"/><rect x="17" y="43" width="4" height="11" rx="1.5" fill="#F6F2EA"/><rect x="43" y="43" width="4" height="11" rx="1.5" fill="#F6F2EA"/></svg>';
const money = n => "€" + n.toLocaleString("en", { maximumFractionDigits: 2 });

const BAG = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" style="margin-right:6px"><path d="M6 8h12l-1 12H7L6 8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/></svg>';
const SUN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const EXTRA_CSS = `
.catbar{display:none}
.tabs a{padding:8px 10px;font-size:.88rem}
.card.reveal.in{transition:transform .3s,box-shadow .3s,opacity .7s}
@media(min-width:1000px) and (max-width:1239px){.tabs{display:none}#menu-btn{display:inline-flex}.actions{margin-left:auto}}
@media(max-width:480px){header{padding:10px 4vw}.wm b{font-size:1.4rem}#theme-btn,#search-btn{padding:8px 9px}#menu-btn,#basket-btn{padding:8px 12px;font-size:.88rem}.actions{gap:6px}.bl{display:none}#basket-btn svg{margin-right:3px}}
@media(max-width:380px){.wm small{display:none}.wm b{font-size:1.25rem}}
#pay-btn{display:none;width:100%;margin-bottom:8px;border:0;border-radius:999px;padding:14px;font:inherit;font-weight:600;cursor:pointer;background:var(--oak);color:var(--ink)}
#pay-btn:disabled{opacity:.6;cursor:wait}
#pay-msg{font-size:.9rem;margin:6px 0 10px}
[data-theme="dark"] .hero,[data-theme="dark"] .page-hero,[data-theme="dark"] .slide{color:#fff}
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
function addLink(href) {
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  document.head.appendChild(l);
}
function buildHeader() {
  addLink("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,600&display=swap");
  addLink("theme.css");
  const style = document.createElement("style");
  style.textContent = EXTRA_CSS;
  document.head.appendChild(style);
  const header = document.querySelector("header");
  if (!header) return;
  const here = new URLSearchParams(location.search).get("c");
  const page = location.pathname.split("/").pop() || "index.html";
  const onShop = page === "shop.html";
  const used = categories.filter(c => products.some(p => p.category.includes(c.id)));
  const cur = on => on ? ' aria-current="page"' : "";
  const tabs = `<a href="shop.html"${cur(onShop && !here)}>Shop</a>`
    + used.map(c => `<a href="shop.html?c=${c.id}"${cur(onShop && here === c.id)}>${c.name}</a>`).join("")
    + `<a href="about.html"${cur(page === "about.html")}>About</a><a href="contact.html"${cur(page === "contact.html")}>Contact</a>`;
  header.innerHTML = `
    <a class="logo" href="index.html" aria-label="Sole Furniture home">
      <span style="display:block;width:36px;height:36px">${MARK}</span>
      <span class="wm"><b>Sole</b><small>FURNITURE</small></span>
    </a>
    <nav class="tabs" aria-label="Main">${tabs}</nav>
    <div class="actions">
      <button id="theme-btn" onclick="toggleTheme()"></button>
      <button id="menu-btn" aria-expanded="false" aria-controls="menu-panel" onclick="toggleMenu()">Menu</button>
      <button id="basket-btn" onclick="openBasket()">${BAG}<span class="bl">Basket&nbsp;</span>(<span class="basket-count">0</span>)</button>
    </div>
    <div id="menu-panel" aria-label="Site menu">
      <a href="index.html">Home</a>
      <h4>Shop</h4>
      <a href="shop.html"${cur(onShop && !here)}>All products</a>
      ${used.map(c => `<a href="shop.html?c=${c.id}"${cur(onShop && here === c.id)}>${c.name}</a>`).join("")}
      <h4>Information</h4>
      <a href="about.html"${cur(page === "about.html")}>About us</a>
      <a href="help.html"${cur(page === "help.html")}>Delivery, returns &amp; FAQ</a>
      <a href="contact.html"${cur(page === "contact.html")}>Contact</a>
    </div>`;
  applyTheme(document.documentElement.getAttribute("data-theme"));
  document.querySelectorAll("#menu-panel a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));
  document.addEventListener("click", e => { if (!e.target.closest("#menu-panel, #menu-btn")) toggleMenu(false); });
}
function initReveal() {
  const items = document.querySelectorAll(".card, .room, .values > div, main section > h2, .facts > div");
  if (!("IntersectionObserver" in window)) { items.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  items.forEach(e => { e.classList.add("reveal"); io.observe(e); });
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
  document.getElementById("pay-btn").style.display = lines.length ? "block" : "none";
}
async function payByCard() {
  const lines = cartLines();
  if (!lines.length) return;
  const btn = document.getElementById("pay-btn"), msg = document.getElementById("pay-msg");
  btn.disabled = true;
  msg.textContent = "Opening secure checkout…";
  try {
    const r = await fetch(PAY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: lines.map(l => ({ id: l.p.id, qty: l.qty })) })
    });
    const data = await r.json();
    if (!r.ok || !data.url) throw new Error(data.error || "failed");
    window.location.href = data.url;
  } catch (e) {
    btn.disabled = false;
    msg.textContent = "Card payment is not available right now. You can send your order by email below and we will reply with how to pay.";
  }
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
        <div class="photo" style="background:${p.color}">${photoOf(p) ? `<img src="${photoOf(p)}" alt="${p.name}">` : "<span>Photo coming soon</span>"}</div>
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
  if (!bar) return;
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
      <button id="pay-btn" onclick="payByCard()">Pay by card (test mode)</button>
      <p id="pay-msg" role="status"></p>
      <button id="checkout-btn" onclick="checkout()">Send order by email</button>
      <p class="note">We’ll reply to confirm your order, delivery cost and payment details.</p>
    </aside>`);
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeBasket(); toggleMenu(false); } });
  buildHeader();
  const foot = document.querySelector("footer");
  if (foot) foot.insertAdjacentHTML("beforeend", '<a href="help.html">Delivery &amp; FAQ</a><a href="contact.html">Contact</a>');
  const icon = document.createElement("link");
  icon.rel = "icon";
  icon.type = "image/svg+xml";
  icon.href = "data:image/svg+xml," + encodeURIComponent(MARK);
  document.head.appendChild(icon);
  initReveal();
  updateBasket();
  [["search.js", "SoleSearch"], ["chat.js", "SoleChat"]].forEach(([src, key]) => {
    if (window[key]) return;
    const s = document.createElement("script");
    s.src = src;
    document.body.appendChild(s);
  });
});
