(function () {
  if (window.SoleChat) return;
  const params = new URLSearchParams(location.search);
  const page = location.pathname.split("/").pop();
  const product = page === "product.html" ? products.find(p => p.id === params.get("id")) : null;
  const link = (href, label) => `<a href="${href}" style="text-decoration:underline;font-weight:600">${label}</a>`;
  const rows = re => product && (product.specs || []).filter(s => re.test(s[0])).map(s => `<b>${s[0]}:</b> ${s[1]}`).join("<br>");

  const DELIVERY = "We offer <b>free delivery on orders over €300</b>, with tracking. For smaller orders we confirm the delivery cost when we reply to your order. Details are on our " + link("help.html", "delivery page") + ".";
  const RETURNS = "You can return any item within <b>14 days</b> of receiving it. It needs to be unused and in its original packaging. Email us to start a return and we will explain the steps. More on our " + link("help.html", "returns page") + ".";
  const ORDER = "Add items to your basket and tap <b>Send order by email</b>. We reply within 24 hours on working days to confirm your items, the delivery cost and how to pay.";

  function handoff(text) {
    const msg = text ? "&msg=" + encodeURIComponent(text) : "";
    const prod = product ? "&product=" + encodeURIComponent(product.name) : "";
    return "Of course. You can email " + link("mailto:" + CHECKOUT_EMAIL, CHECKOUT_EMAIL) + " or use our " + link("contact.html?x=1" + msg + prod, "contact form") + ". We reply within 24 hours on working days.";
  }

  function answer(text) {
    const t = text.toLowerCase();
    if (/human|person|someone|agent|speak|phone|call me|contact|talk/.test(t)) return handoff();
    if (product) {
      if (/size|dimension|measure|wide|width|tall|high|height|long|length|deep|depth|fit|big/.test(t)) {
        const r = rows(/size|width|depth|height|overall|shelf space|sold as|seats/i);
        if (r) return `Here are the sizes for the ${product.name}:<br>${r}`;
      }
      if (/material|made of|made from|wood|oak|metal|fabric|finish|colour|color/.test(t)) {
        const r = rows(/material|frame|upholstery|finish|colour|style|legs|detail/i);
        if (r) return `About the materials:<br>${r}`;
      }
      if (/assembl|build|put together|flat/.test(t)) {
        const r = rows(/assembly/i);
        if (r) return r;
      }
      if (/stock|available|availab|lead|when/.test(t) && product.leadTime) return `<b>Availability:</b> ${product.leadTime}`;
      if (/price|cost|how much/.test(t)) return `The ${product.name} is <b>${money(product.price)}</b>. Orders over €300 get free delivery.`;
    }
    if (/deliver|ship|arrive|post|courier|tracking/.test(t)) return DELIVERY;
    if (/return|refund|send back|money back|exchange/.test(t)) return RETURNS;
    if (/order|buy|checkout|basket|pay|purchase/.test(t)) return ORDER;
    if (/hello|hi\b|hey|good (morning|afternoon|evening)/.test(t)) return "Hello! What can I help you with?";
    if (/thank/.test(t)) return "You're welcome! Anything else I can help with?";
    if (window.SoleSearch) {
      const found = SoleSearch.search(text).slice(0, 3);
      if (found.length) {
        return "Here is what I found:<br>" + found.map(p => "• " + link("product.html?id=" + p.id, p.name) + " (" + money(p.price) + ")").join("<br>")
          + "<br><br>" + link("shop.html?q=" + encodeURIComponent(text), "See all results");
      }
    }
    return "I'm an automated assistant and I'm not sure about that one. " + handoff(text);
  }

  const ICON = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3.5V17H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" fill="currentColor"/><circle cx="8.5" cy="11" r="1.2" fill="#C58B5A"/><circle cx="12" cy="11" r="1.2" fill="#C58B5A"/><circle cx="15.5" cy="11" r="1.2" fill="#C58B5A"/></svg>';
  const CSS = `
#chat-fab{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));width:58px;height:58px;border-radius:50%;border:0;background:linear-gradient(135deg,#24402F,#3E6B54);color:#fff;cursor:pointer;z-index:8;box-shadow:0 10px 26px rgba(20,40,30,.35);display:flex;align-items:center;justify-content:center;transition:transform .25s}
#chat-fab:hover{transform:scale(1.08)}
#chat-fab::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid #C58B5A;animation:chatpulse 2.6s ease-out infinite}
@keyframes chatpulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.55);opacity:0}}
#chat-tip{position:fixed;right:84px;bottom:calc(30px + env(safe-area-inset-bottom,0px));max-width:230px;background:var(--white);color:var(--ink);padding:12px 32px 12px 14px;border-radius:18px;box-shadow:var(--shadow);font-size:.93rem;z-index:8;cursor:pointer;animation:rise .6s ease both}
#chat-tip button{position:absolute;top:4px;right:6px;border:0;background:none;color:inherit;font-size:1.1rem;cursor:pointer}
#chat-panel{position:fixed;right:18px;bottom:calc(88px + env(safe-area-inset-bottom,0px));width:min(370px,calc(100vw - 36px));max-height:min(72vh,560px);display:none;flex-direction:column;background:var(--white);color:var(--ink);border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.28);overflow:hidden;z-index:8}
#chat-panel.open{display:flex;animation:rise .35s ease both}
.c-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:linear-gradient(135deg,#24402F,#3E6B54);color:#fff}
.c-head small{display:block;opacity:.8;font-size:.78rem}
.c-head button{background:none;border:0;color:#fff;font-size:1.5rem;cursor:pointer}
#chat-log{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
.cm{max-width:86%;padding:10px 13px;border-radius:16px;line-height:1.45;font-size:.95rem}
.cm.bot{background:var(--bg);align-self:flex-start;border-bottom-left-radius:5px}
.cm.me{background:var(--ink);color:var(--white);align-self:flex-end;border-bottom-right-radius:5px}
#chat-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}
#chat-chips button{border:1px solid var(--stone);background:var(--white);color:var(--ink);border-radius:99px;padding:7px 12px;font:inherit;font-size:.88rem;cursor:pointer}
#chat-chips button:hover{background:var(--bg)}
#chat-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--stone)}
#chat-input{flex:1;min-width:0;padding:10px 14px;border-radius:99px;border:1px solid var(--stone);background:var(--bg);color:var(--ink);font:inherit}
#chat-form button{border:0;border-radius:99px;background:var(--oak);color:#1E2B25;font:inherit;font-weight:600;padding:0 16px;cursor:pointer}
@media(prefers-reduced-motion:reduce){#chat-fab::after,#chat-tip,#chat-panel.open{animation:none}}
`;

  function init() {
    const st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);
    document.body.insertAdjacentHTML("beforeend", `
      <button id="chat-fab" aria-label="Open chat" aria-expanded="false">${ICON}</button>
      <section id="chat-panel" aria-label="Chat with Sole Assistant">
        <div class="c-head"><div><b>Sole Assistant</b><small>Automated · answers instantly</small></div><button id="chat-x" aria-label="Close chat">×</button></div>
        <div id="chat-log" aria-live="polite"></div>
        <div id="chat-chips"></div>
        <form id="chat-form"><input id="chat-input" placeholder="Type your question…" autocomplete="off" aria-label="Your question"><button type="submit">Send</button></form>
      </section>`);
    const fab = document.getElementById("chat-fab");
    const panel = document.getElementById("chat-panel");
    const log = document.getElementById("chat-log");
    const chips = document.getElementById("chat-chips");
    const input = document.getElementById("chat-input");
    let started = false;

    function add(html, who) {
      const d = document.createElement("div");
      d.className = "cm " + who;
      d.innerHTML = html;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    }
    function botSay(html) {
      setTimeout(() => add(html, "bot"), 350);
    }
    function setChips(list) {
      chips.innerHTML = list.map(c => `<button type="button">${c}</button>`).join("");
      chips.querySelectorAll("button").forEach(b => b.addEventListener("click", () => ask(b.textContent)));
    }
    function ask(text) {
      add(text.replace(/</g, "&lt;"), "me");
      botSay(answer(text));
    }
    function open() {
      panel.classList.add("open");
      fab.setAttribute("aria-expanded", "true");
      const tip = document.getElementById("chat-tip");
      if (tip) tip.remove();
      if (!started) {
        started = true;
        add(product
          ? `Hi! Any questions about the <b>${product.name}</b>? Tap one below or type your own.`
          : "Hi! I'm Sole's automated assistant. I can help with delivery, returns and finding the right piece.", "bot");
        setChips(product ? ["Size", "Materials", "Assembly", "In stock?", "Delivery"] : ["Delivery", "Returns", "How do I order?", "Talk to a person"]);
      }
      setTimeout(() => input.focus(), 50);
    }
    function close() {
      panel.classList.remove("open");
      fab.setAttribute("aria-expanded", "false");
    }
    fab.addEventListener("click", () => (panel.classList.contains("open") ? close() : open()));
    document.getElementById("chat-x").addEventListener("click", close);
    document.getElementById("chat-form").addEventListener("submit", e => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) return;
      input.value = "";
      ask(v);
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    document.addEventListener("click", e => {
      const a = e.target.closest && e.target.closest(".ask");
      if (a) { e.preventDefault(); open(); }
    });
    if (product) {
      let seen = false;
      try { seen = sessionStorage.getItem("sole-chat-tip") === product.id; } catch (err) {}
      if (!seen) {
        setTimeout(() => {
          if (panel.classList.contains("open")) return;
          document.body.insertAdjacentHTML("beforeend", `<div id="chat-tip" role="button" tabindex="0">Any questions about the ${product.name}?<button aria-label="Dismiss">×</button></div>`);
          const tip = document.getElementById("chat-tip");
          tip.addEventListener("click", e => {
            if (e.target.tagName === "BUTTON") tip.remove(); else open();
          });
          try { sessionStorage.setItem("sole-chat-tip", product.id); } catch (err) {}
        }, 6000);
      }
    }
    window.SoleChat = { open: open, answer: answer };
  }
  window.SoleChat = { answer: answer };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
