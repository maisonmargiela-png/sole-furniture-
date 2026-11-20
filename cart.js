const CHECKOUT_EMAIL = "solejugg@gmail.com";
const CART_KEY = "sole-cart";
const PAY_API = "https://sole-play.solejugg.workers.dev";
const MARK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#24402F"/><path d="M18 36a14 14 0 0 1 28 0z" fill="#E0A66F"/><rect x="11" y="38" width="42" height="5" rx="2.5" fill="#F6F2EA"/><rect x="17" y="43" width="4" height="11" rx="1.5" fill="#F6F2EA"/><rect x="43" y="43" width="4" height="11" rx="1.5" fill="#F6F2EA"/></svg>';
const MARK_BARE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M18 36a14 14 0 0 1 28 0z" fill="#E0A66F"/><rect x="11" y="38" width="42" height="5" rx="2.5" fill="#F6F2EA"/><rect x="17" y="43" width="4" height="11" rx="1.5" fill="#F6F2EA"/><rect x="43" y="43" width="4" height="11" rx="1.5" fill="#F6F2EA"/></svg>';
const money = n => "€" + n.toLocaleString("en", { maximumFractionDigits: 2 });

const BAG = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" style="margin-right:6px"><path d="M6 8h12l-1 12H7L6 8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
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
  addLink("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@400;500&display=swap");
  addLink("theme.css");
  const header = document.querySelector("header");
  if (!header) return;
  const here = new URLSearchParams(location.search).get("c");
  const page = location.pathname.split("/").pop() || "index.html";
  const onShop = page === "shop.html";
  const used = categories.filter(c => products.some(p => p.category.includes(c.id)));
  const cur = on => on ? ' aria-current="page"' : "";
  const tabs = `<a href="shop.html"${cur(onShop && !here)}>Collection</a>`
    + used.map(c => `<a href="shop.html?c=${c.id}"${cur(onShop && here === c.id)}>${c.name}</a>`).join("")
    + `<a href="about.html"${cur(page === "about.html")}>About</a><a href="contact.html"${cur(page === "contact.html")}>Contact</a>`;
  header.innerHTML = `
    <a class="logo" href="index.html" aria-label="Sole Furniture home">
      <span style="display:block;width:38px;height:38px">${MARK_BARE}</span>
      <span class="wm"><b>Sole</b><small>FURNITURE</small></span>
    </a>
    <nav class="tabs" aria-label="Main">${tabs}</nav>
    <div class="actions">
      <button id="menu-btn" aria-expanded="false" aria-controls="menu-panel" onclick="toggleMenu()">Menu</button>
      <button id="basket-btn" onclick="openBasket()">${BAG}<span class="bl">Basket&nbsp;</span>(<span class="basket-count">0</span>)</button>
    </div>
    <div id="menu-panel" aria-label="Site menu">
      <a href="index.html">Home</a>
      <h4>Collection</h4>
      <a href="shop.html"${cur(onShop && !here)}>All products</a>
      ${used.map(c => `<a href="shop.html?c=${c.id}"${cur(onShop && here === c.id)}>${c.name}</a>`).join("")}
      <h4>Information</h4>
      <a href="about.html"${cur(page === "about.html")}>About us</a>
      <a href="help.html"${cur(page === "help.html")}>Delivery, returns &amp; FAQ</a>
      <a href="contact.html"${cur(page === "contact.html")}>Contact</a>
    </div>`;
  const act = header.querySelector(".tabs a[aria-current]"), strip = header.querySelector(".tabs");
  if (act && strip) window.addEventListener("load", () => { strip.scrollLeft = act.offsetLeft - (strip.clientWidth - act.offsetWidth) / 2; });
  if (strip) {
    const g = document.createElement("span");
    g.className = "glide";
    strip.prepend(g);
    const go = a => { if (!a) { g.style.opacity = 0; return; } g.style.opacity = 1; g.style.width = a.offsetWidth + "px"; g.style.transform = "translateX(" + a.offsetLeft + "px)"; };
    strip.querySelectorAll("a").forEach(a => { a.addEventListener("mouseenter", () => go(a)); a.addEventListener("focus", () => go(a)); });
    strip.addEventListener("mouseleave", () => { g.style.opacity = 0; });
  }
  document.querySelectorAll("#menu-panel a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));
  document.addEventListener("click", e => { if (!e.target.closest("#menu-panel, #menu-btn")) toggleMenu(false); });
}
function initReveal() {
  const items = document.querySelectorAll(".card, .room, .values > div, main section > h2, .facts > div");
  if (!("IntersectionObserver" in window)) { items.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { const t = en.target; t.classList.add("in"); io.unobserve(t); setTimeout(() => { t.style.transitionDelay = ""; }, 1200); }
  }), { threshold: 0.12 });
  items.forEach(e => {
    const sibs = [...e.parentElement.children].filter(x => x.matches(".card, .room, .values > div, .facts > div"));
    const i = sibs.indexOf(e);
    if (i > 0) e.style.transitionDelay = ((i % 4) * 90) + "ms";
    e.classList.add("reveal");
    io.observe(e);
  });
}

function initScrollFx() {
  const bar = document.createElement("div");
  bar.id = "progress";
  document.body.appendChild(bar);
  const header = document.querySelector("header"), slider = document.querySelector(".slider");
  let ticking = false;
  function tick() {
    const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    if (header) { if (y > 60) header.classList.add("scrolled"); else if (y < 20) header.classList.remove("scrolled"); }
    if (slider && y < window.innerHeight) slider.style.setProperty("--py", Math.min(y * 0.05, 24) + "px");
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }, { passive: true });
  tick();
}
function initWords() {
  document.querySelectorAll(".page-hero h1").forEach(h => {
    const w = h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label", h.textContent.trim());
    h.innerHTML = w.map((x, i) => `<span class="w" aria-hidden="true" style="animation-delay:${0.05 + i * 0.09}s">${x}</span>`).join(" ");
  });
}
function initTilt() {
  if (!window.matchMedia("(hover:hover)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.addEventListener("mousemove", e => {
    const p = e.target.closest && e.target.closest(".card .photo");
    document.querySelectorAll(".card .photo.tilt").forEach(x => { if (x !== p) { x.classList.remove("tilt"); x.style.removeProperty("--rx"); x.style.removeProperty("--ry"); } });
    if (!p) return;
    const r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    p.classList.add("tilt");
    p.style.setProperty("--rx", (-y * 5).toFixed(2) + "deg");
    p.style.setProperty("--ry", (x * 6).toFixed(2) + "deg");
  });
}
function initToTop() {
  const b = document.createElement("button");
  b.id = "totop";
  b.setAttribute("aria-label", "Back to top");
  b.innerHTML = "↑";
  b.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  document.body.appendChild(b);
  window.addEventListener("scroll", () => b.classList.toggle("show", window.scrollY > 700), { passive: true });
}
function flyToBasket(from) {
  const to = document.getElementById("basket-btn");
  if (!from || !to || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  const d = document.createElement("div");
  d.className = "fly";
  const img = from.querySelector("img");
  if (img) d.style.backgroundImage = "url('" + img.currentSrc + "')";
  d.style.left = a.left + a.width / 2 - 36 + "px";
  d.style.top = a.top + a.height / 2 - 45 + "px";
  document.body.appendChild(d);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const an = d.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${dx * .5}px,${dy * .5 - 60}px) scale(.7)`, opacity: 1, offset: .5 }, { transform: `translate(${dx}px,${dy}px) scale(.12)`, opacity: .2 }], { duration: 750, easing: "cubic-bezier(.5,0,.7,.4)" });
  an.onfinish = () => d.remove();
}
function initGlow() {
  if (!window.matchMedia("(hover:hover)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".page-hero, .slider").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
      el.classList.add("glow");
    });
    el.addEventListener("mouseleave", () => el.classList.remove("glow"));
  });
}
function initMagnet() {
  if (!window.matchMedia("(hover:hover)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const sel = ".btn, #basket-btn, .buybox .buy";
  document.addEventListener("mousemove", e => {
    const b = e.target.closest && e.target.closest(sel);
    document.querySelectorAll(".mag").forEach(x => { if (x !== b) { x.classList.remove("mag"); x.style.removeProperty("--tx"); x.style.removeProperty("--ty"); } });
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.classList.add("mag");
    b.style.setProperty("--tx", ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + "px");
    b.style.setProperty("--ty", ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + "px");
  });
}
function initImageFade() {
  const fade = img => {
    if (img.dataset.f) return;
    img.dataset.f = 1;
    if (img.complete && img.naturalWidth) return;
    img.classList.add("fadein");
    img.addEventListener("load", () => img.classList.add("ready"), { once: true });
    img.addEventListener("error", () => img.classList.add("ready"), { once: true });
  };
  const scan = () => document.querySelectorAll(".card .photo img:not(.alt), .room img, .gal-main img, .slide img").forEach(fade);
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
}
function initSlideCount() {
  const slider = document.querySelector(".slider");
  if (!slider) return;
  const run = () => {
    const slides = [...slider.querySelectorAll(".slide")];
    if (slides.length < 2) return false;
    const n = document.createElement("div");
    n.className = "scount";
    slider.appendChild(n);
    const upd = () => { const i = Math.max(0, slides.findIndex(s => s.classList.contains("on"))); n.innerHTML = "<b>" + String(i + 1).padStart(2, "0") + "</b> / " + String(slides.length).padStart(2, "0"); };
    upd();
    slides.forEach(s => new MutationObserver(upd).observe(s, { attributes: true, attributeFilter: ["class"] }));
    return true;
  };
  if (!run()) setTimeout(run, 600);
}
function tweenText(el, to, fmt) {
  const from = parseFloat(el.dataset.v || "0");
  el.dataset.v = to;
  if (from === to || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = fmt(to); return; }
  const t0 = performance.now(), dur = 600;
  (function step(t) {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(step); else el.textContent = fmt(to);
  })(t0);
}
function initPageLeave() {
  window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));
  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (a.target && a.target !== "_self") return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(() => { location.href = u.href; }, 220);
  });
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
  const nb = document.getElementById("basket-btn");
  if (nb) { nb.classList.remove("bump"); void nb.offsetWidth; nb.classList.add("bump"); }
  const ev = window.event, b = ev && ev.target && ev.target.closest ? ev.target.closest(".buy") : null;
  if (b) flyToBasket(document.querySelector(".card .photo") && b.closest(".card") ? b.closest(".card").querySelector(".photo") : document.querySelector(".gal-main"));
  if (b && !b.dataset.t) {
    b.dataset.t = b.textContent;
    b.textContent = "Added ✓";
    setTimeout(() => { b.textContent = b.dataset.t; delete b.dataset.t; }, 1500);
  }
  setTimeout(openBasket, 800);
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
  tweenText(document.getElementById("basket-total"), cartTotal(), v => money(Math.round(v)));
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
        <div class="photo" style="background:${p.color}">${photoOf(p) ? `<img src="${photoOf(p)}" alt="${p.name}" loading="lazy" decoding="async">${p.images && p.images[1] ? `<img class="alt" src="${p.images[1]}" alt="" loading="lazy" decoding="async">` : ""}` : "<span>Photo coming soon</span>"}</div>
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
  initWords();
  initGlow();
  initMagnet();
  initImageFade();
  initSlideCount();
  initScrollFx();
  initToTop();
  initTilt();
  initPageLeave();
  [["search.js", "SoleSearch"], ["chat.js", "SoleChat"]].forEach(([src, key]) => {
    if (window[key]) return;
    const s = document.createElement("script");
    s.src = src;
    document.body.appendChild(s);
  });
});
