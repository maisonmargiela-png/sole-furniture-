const products = [
  { name: "Oak dining table", desc: "Solid oak table with a natural oil finish.", price: "€690", color: "#8A6A44", image: "", link: "#" },
  { name: "Dining chairs, set of 2", desc: "Solid wood chairs with a curved back.", price: "€260", color: "#6B5238", image: "", link: "#" },
  { name: "Open bookshelf", desc: "Five open shelves for books and plants.", price: "€240", color: "#6E7F6A", image: "", link: "#" },
  { name: "Writing desk", desc: "Solid wood desk with a cable gap and one drawer.", price: "€390", color: "#7A5C3E", image: "", link: "#" },
  { name: "Bedside table", desc: "One soft-close drawer and an open shelf.", price: "€130", color: "#9A8B76", image: "", link: "#" },
  { name: "Coffee table", desc: "Low solid wood table with rounded corners.", price: "€210", color: "#5E4A36", image: "", link: "#" },
  { name: "Storage bench", desc: "Seat with space inside for shoes or blankets.", price: "€180", color: "#4F6558", image: "", link: "#" },
  { name: "Sideboard", desc: "Three doors and adjustable shelves inside.", price: "€420", color: "#8B735A", image: "", link: "#" },
  { name: "Wall shelf set", desc: "Set of three floating wooden shelves.", price: "€85", color: "#A39378", image: "", link: "#" },
  { name: "Hallway console table", desc: "Slim solid wood table for narrow spaces.", price: "€240", color: "#6A5A47", image: "", link: "#" }
];

function renderProducts(containerId, from, to) {
  const list = document.getElementById(containerId);
  products.slice(from, to).forEach(p => {
    const photo = p.image
      ? `<img src="${p.image}" alt="${p.name}">`
      : `<span>Add photo</span>`;
    list.insertAdjacentHTML("beforeend", `
      <article class="card">
        <div class="photo" style="background:${p.color}">${photo}</div>
        <div class="info">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="price">${p.price}</div>
          <a class="buy" href="${p.link}">Buy now</a>
        </div>
      </article>`);
  });
}
