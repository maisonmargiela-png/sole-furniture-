/* EDIT YOUR PRODUCTS HERE. One block per product.
   id: a short unique name with no spaces (e.g. "oak-table")
   category: one or more category ids from the list below
   price: just the number (690 means €690)
   image: your photo, e.g. "images/oak-table.jpg". Leave "" for a colour block.
   images: a list of photos for the product page (the first is the main one).
   specs, longDesc, leadTime: optional extra details for the product page.
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
  {
    id: "oak-table",
    name: "Rustic oak extending dining table",
    desc: "Seats 6 to 8. Butterfly leaf extension, satin oil finish.",
    longDesc: "A sturdy rustic dining table that fits most households. It seats six at 140 cm and up to eight with the butterfly leaf out at 180 cm. Thick oak legs and top, rounded corners and lightly sanded edges give it a worn, lived-in look, and the satin oil-lacquer finish is hard wearing and easy to care for.",
    price: 690,
    category: ["dining"],
    color: "#8A6A44",
    images: ["images/IMG_6425.jpeg", "images/IMG_6426.jpeg", "images/IMG_6427.jpeg", "images/IMG_6428.jpeg", "images/IMG_6429.jpeg"],
    leadTime: "[In stock / made to order: X weeks]",
    specs: [
      ["Size (closed)", "140 cm long × 90 cm wide × 77 cm high"],
      ["Size (extended)", "180 cm long × 90 cm wide × 77 cm high"],
      ["Seats", "6 people closed, up to 8 extended"],
      ["Extension", "Butterfly leaf"],
      ["Material", "Oak top and legs [confirm: solid oak or veneer]"],
      ["Finish", "Medium to dark oak stain with a natural oil lacquer, satin finish"],
      ["Style", "Rustic, with rounded corners and lightly sanded edges"],
      ["Assembly", "Minor assembly: the legs bolt onto the base"]
    ]
  },
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
