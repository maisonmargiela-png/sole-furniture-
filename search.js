(function () {
  if (window.SoleSearch) return;

  const SYN = {
    black: ["dark", "charcoal", "grey", "gray", "anthracite"],
    dark: ["black", "charcoal", "brown", "walnut"],
    white: ["cream", "ecru", "ivory", "light"],
    cream: ["white", "ecru", "ivory", "beige"],
    beige: ["cream", "natural", "tan"],
    grey: ["gray", "charcoal", "dark", "silver"],
    gray: ["grey", "charcoal", "dark"],
    brown: ["oak", "walnut", "wood", "dark", "tan", "acacia"],
    natural: ["oak", "light", "wood", "acacia"],
    wood: ["wooden", "oak", "acacia", "walnut"],
    wooden: ["wood", "oak", "acacia"],
    sofa: ["couch", "settee"],
    couch: ["sofa"],
    seat: ["chair", "bench", "stool"],
    chair: ["seat", "stool"],
    shelf: ["bookcase", "shelving", "bookshelf"],
    bookcase: ["shelf", "bookshelf"],
    storage: ["shelf", "drawer", "bench", "sideboard"],
    small: ["compact", "slim"],
    big: ["large"],
    large: ["big", "extending"]
  };
  const norm = t => t.toLowerCase().replace(/[^a-z0-9]/g, "");
  const stem = t => (t.length > 3 ? t.replace(/(es|s)$/, "") : t);

  function fieldsOf(p) {
    const cats = categories.filter(c => p.category.includes(c.id)).map(c => c.name.toLowerCase()).join(" ");
    return {
      name: p.name.toLowerCase(),
      attrs: [].concat(p.colour || [], p.material || [], p.size || "").join(" ").toLowerCase(),
      cats: cats,
      text: (p.desc + " " + (p.longDesc || "") + " " + (p.specs || []).map(s => s.join(" ")).join(" ")).toLowerCase()
    };
  }
  function scoreToken(f, tok) {
    let s = 0;
    if (f.name.includes(tok)) s += 6;
    if (f.attrs.includes(tok)) s += 4;
    if (f.cats.includes(tok)) s += 3;
    if (f.text.includes(tok)) s += 1;
    return s;
  }
  function search(q) {
    const toks = String(q || "").split(/\s+/).map(norm).filter(Boolean).map(stem);
    if (!toks.length) return [];
    return products
      .map(p => {
        const f = fieldsOf(p);
        let total = 0, matched = 0;
        toks.forEach(t => {
          let s = scoreToken(f, t);
          if (!s && SYN[t]) s = Math.max.apply(null, SYN[t].map(x => scoreToken(f, norm(x)))) * 0.5;
          if (s) { matched++; total += s; }
        });
        return { p: p, score: total + matched * 2 };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.p);
  }
  window.SoleSearch = { search: search };

  const ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const CSS = `
#search-btn{background:transparent;color:var(--ink);border:1px solid var(--stone);border-radius:99px;padding:9px 11px;cursor:pointer;display:inline-flex;align-items:center;transition:transform .2s}
#search-btn:hover{transform:translateY(-2px)}
#search-panel{display:none;position:absolute;top:100%;left:0;right:0;background:var(--white);border-bottom:1px solid var(--stone);box-shadow:var(--shadow);padding:14px 5vw 18px;z-index:9}
#search-panel.open{display:block}
#search-form{display:flex;gap:8px;max-width:720px;margin:0 auto}
#search-input{flex:1;min-width:0;padding:12px 18px;border-radius:99px;border:1px solid var(--stone);background:var(--bg);color:var(--ink);font:inherit}
.s-go{padding:0 20px;border:0;border-radius:99px;background:var(--ink);color:var(--white);font:inherit;font-weight:600;cursor:pointer}
#search-results{max-width:720px;margin:10px auto 0}
.s-item{display:flex;align-items:center;gap:12px;padding:8px;border-radius:14px;text-decoration:none}
.s-item:hover{background:var(--bg)}
.s-item img,.s-item i{width:52px;height:52px;border-radius:10px;object-fit:contain;background:var(--bg);flex:none}
.s-item b{display:block;font-weight:600}
.s-item span{font-size:.92rem;opacity:.75}
.s-more,.s-none{display:block;padding:10px 8px;font-weight:600}
`;

  function init() {
    const actions = document.querySelector(".actions");
    const header = document.querySelector("header");
    if (!actions || !header) return;
    const st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);
    actions.insertAdjacentHTML("afterbegin", `<button id="search-btn" aria-label="Search" aria-expanded="false">${ICON}</button>`);
    header.insertAdjacentHTML("beforeend", `
      <div id="search-panel">
        <form id="search-form" role="search">
          <input id="search-input" type="search" placeholder="Search, e.g. “black table”" autocomplete="off" aria-label="Search products">
          <button type="submit" class="s-go">Search</button>
        </form>
        <div id="search-results" aria-live="polite"></div>
      </div>`);
    const btn = document.getElementById("search-btn");
    const panel = document.getElementById("search-panel");
    const input = document.getElementById("search-input");
    const out = document.getElementById("search-results");
    function toggle(force) {
      const open = typeof force === "boolean" ? force : !panel.classList.contains("open");
      panel.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      if (open) setTimeout(() => input.focus(), 30);
    }
    function render() {
      const q = input.value.trim();
      if (!q) { out.innerHTML = ""; return; }
      const found = search(q);
      if (!found.length) {
        out.innerHTML = '<span class="s-none">No matches yet. Try a colour, material or room, or <a href="contact.html" style="text-decoration:underline">ask us</a>.</span>';
        return;
      }
      const img = p => (p.images && p.images[0]) || p.image || "";
      out.innerHTML = found.slice(0, 5).map(p => `
        <a class="s-item" href="product.html?id=${p.id}">
          ${img(p) ? `<img src="${img(p)}" alt="">` : "<i></i>"}
          <div><b>${p.name}</b><span>${money(p.price)}</span></div>
        </a>`).join("")
        + `<a class="s-more" href="shop.html?q=${encodeURIComponent(q)}">See all ${found.length} result${found.length === 1 ? "" : "s"} →</a>`;
    }
    btn.addEventListener("click", () => toggle());
    input.addEventListener("input", render);
    document.getElementById("search-form").addEventListener("submit", e => {
      e.preventDefault();
      const q = input.value.trim();
      if (q) location.href = "shop.html?q=" + encodeURIComponent(q);
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") toggle(false); });
    document.addEventListener("click", e => {
      if (!e.target.closest("#search-panel, #search-btn")) toggle(false);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
