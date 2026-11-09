/* EDIT YOUR PRODUCTS HERE. One block per product.
   id: a short unique name with no spaces (e.g. "oak-table")
   category: one or more category ids from the list below
   price: just the number (690 means €690)
   image: your photo, e.g. "images/oak-table.jpg". Leave "" for a colour block.
   images: a list of photos for the product page (the first is the main one).
   specs, longDesc, leadTime: optional extra details for the product page.
   size: "Small", "Medium" or "Large" (used by the filters).
   colour: list of colours, e.g. ["Brown"]. material: list, e.g. ["Oak"]. (Used by search and filters.)
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
    size: "Large",
    colour: ["Brown"],
    material: ["Oak"],
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
  {
    id: "dining-chairs",
    name: "Cream bouclé dining chairs, set of 2",
    desc: "Curved cream bouclé seat and back on a slim metal frame. Sold as a pair.",
    longDesc: "A pair of softly curved dining chairs with a cream bouclé seat and back that look warm and inviting at the table. Slim, tapered legs keep the shape light, and a small brass-tone detail where the back meets the frame adds a finishing touch. The frame is metal with an oak-effect finish, so it is sturdy and easy to live with.",
    price: 260,
    size: "Small",
    colour: ["Cream"],
    material: ["Fabric", "Metal"],
    category: ["dining", "chairs"],
    color: "#B9AD98",
    images: ["images/IMG_6431.jpeg", "images/IMG_6432.jpeg", "images/IMG_6433.jpeg", "images/IMG_6434.jpeg", "images/IMG_6435.jpeg"],
    leadTime: "In stock",
    specs: [
      ["Size (each chair)", "51 cm wide × 57 cm deep × 77 cm high"],
      ["Sold as", "A pair (2 chairs)"],
      ["Upholstery", "Cream (ecru) bouclé fabric on the seat and back"],
      ["Frame", "Metal with an oak-effect finish (not solid wood)"],
      ["Legs", "Slim and tapered"],
      ["Detail", "Brass-tone metal accent at the back"],
      ["Assembly", "Some assembly required"]
    ]
  },
  {
    id: "bookshelf",
    name: "Tall five-tier bookshelf",
    desc: "Five open shelves on a metal frame. 180 cm high, just 30 cm deep.",
    longDesc: "A tall bookcase that gives you plenty of open storage in a small footprint. At 180 cm high and only 30 cm deep it sits neatly against a wall, with five open tiers for books, baskets and plants. The shelves are engineered wood, supported by a sturdy iron-tube frame.",
    price: 240,
    size: "Medium",
    material: ["Engineered wood", "Metal"],
    category: ["living"],
    color: "#6E7F6A",
    images: ["images/IMG_6441.jpeg", "images/IMG_6442.jpeg", "images/IMG_6443.jpeg"],
    leadTime: "In stock",
    specs: [
      ["Overall size", "105 cm wide × 30 cm deep × 180 cm high"],
      ["Shelf space", "105 cm wide × 27.5 cm deep × 36.5 cm high"],
      ["Shelves", "5 tiers"],
      ["Material", "Engineered wood (particle board) shelves with an iron-tube frame"],
      ["Colour", "[Add colour]"],
      ["Weight", "29.2 kg"],
      ["Assembly", "[Add: assembly needed, and whether wall fixings are included]"]
    ]
  },
  {
    id: "desk",
    name: "Compact acacia wood desk with two drawers",
    desc: "Solid acacia desk, 100 cm wide, with two drawers for storage.",
    longDesc: "A compact desk made from acacia wood, chosen for its distinctive grain. At 100 cm wide it suits smaller rooms and still leaves space for a laptop, notebook or paperwork, while two drawers keep your essentials tidy. The finish shows off the character of the wood, and the style sits happily in modern, rustic and industrial rooms.",
    price: 390,
    size: "Medium",
    material: ["Acacia"],
    category: ["office"],
    color: "#7A5C3E",
    images: ["images/IMG_6448.jpeg", "images/IMG_6449.jpeg", "images/IMG_6450.jpeg"],
    leadTime: "In stock",
    specs: [
      ["Width", "100 cm"],
      ["Depth and height", "[Add depth × height in cm]"],
      ["Material", "Solid acacia wood"],
      ["Finish", "[Add finish colour]"],
      ["Storage", "Two drawers"],
      ["Style", "Works with modern, rustic and industrial interiors"],
      ["Weight", "[Add weight]"],
      ["Assembly", "[Add: assembled or assembly needed]"]
    ]
  },
  { id: "bedside", name: "Bedside table", desc: "One soft-close drawer and an open shelf.", price: 130, size: "Small", category: ["bedroom"], color: "#9A8B76", image: "" },
  { id: "coffee-table", name: "Coffee table", desc: "Low solid wood table with rounded corners.", price: 210, size: "Medium", category: ["living"], color: "#5E4A36", image: "" },
  { id: "bench", name: "Storage bench", desc: "Seat with space inside for shoes or blankets.", price: 180, size: "Medium", category: ["hallway", "chairs"], color: "#4F6558", image: "" },
  { id: "sideboard", name: "Sideboard", desc: "Three doors and adjustable shelves inside.", price: 420, size: "Large", category: ["living", "dining"], color: "#8B735A", image: "" },
  { id: "wall-shelves", name: "Wall shelf set", desc: "Set of three floating wooden shelves.", price: 85, size: "Small", category: ["living"], color: "#A39378", image: "" },
  { id: "console", name: "Hallway console table", desc: "Slim solid wood table for narrow spaces.", price: 240, size: "Medium", category: ["hallway"], color: "#6A5A47", image: "" }
];
