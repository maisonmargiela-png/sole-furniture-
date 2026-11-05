/* EDIT YOUR PRODUCTS HERE. One block per product.
   id: a short unique name with no spaces (e.g. "oak-table")
   category: one or more category ids from the list below
   price: just the number (690 means €690)
   image: your photo, e.g. "images/oak-table.jpg". Leave "" for a colour block.
   Only list products you can actually supply. */

const categories = [
  { id: "dining", name: "Dining room" },
  { id: "chairs", name: "Chairs" },
  { id: "living", name: "Living room" },
  { id: "kitchen", name: "Kitchen" },
  { id: "sofas", name: "Sofas" },
  { id: "bedroom", name: "Bedroom" },
  { id: "office", name: "Office" },
  { id: "hallway", name: "Hallway" }
];
/* A category only shows in the menu once it has at least one product. */

const products = [
  { id: "oak-table", name: "Oak dining table", desc: "Solid oak table with a natural oil finish.", price: 690, category: ["dining"], color: "#8A6A44", image: "" },
  { id: "dining-chairs", name: "Dining chairs, set of 2", desc: "Solid wood chairs with a curved back.", price: 260, category: ["dining", "chairs"], color: "#6B5238", image: "" },
  { id: "bookshelf", name: "Open bookshelf", desc: "Five open shelves for books and plants.", price: 240, category: ["living"], color: "#6E7F6A", image: "" },
  { id: "desk", name: "Writing desk", desc: "Solid wood desk with a cable gap and one drawer.", price: 390, category: ["office"], color: "#7A5C3E", image: "" },
  { id: "bedside", name: "Bedside table", desc: "One soft-close drawer and an open shelf.", price: 130, category: ["bedroom"], color: "#9A8B76", image: "" },
  { id: "coffee-table", name: "Coffee table", desc: "Low solid wood table with rounded corners.", price: 210, category: ["living"], color: "#5E4A36", image: "" },
  { id: "bench", name: "Storage bench", desc: "Seat with space inside for shoes or blankets.", price: 180, category: ["hallway", "chairs"], color: "#4F6558", image: "" },
  { id: "sideboard", name: "Sideboard", desc: "Three doors and adjustable shelves inside.", price: 420, category: ["living", "dining"], color: "#8B735A", image: "" },
  { id: "wall-shelves", name: "Wall shelf set", desc: "Set of three floating wooden shelves.", price: 85, category: ["living"], color: "#A39378", image: "" },
  { id: "console", name: "Hallway console table", desc: "Slim solid wood table for narrow spaces.", price: 240, category: ["hallway"], color: "#6A5A47", image: "" }
];
