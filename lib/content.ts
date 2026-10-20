/**
 * Structured, CMS-ready content collections.
 * Every collection can later be replaced by a headless CMS / MDX source
 * without touching components.
 */

// ------------------------------------------------------------------ gallery
export type GalleryCategory =
  | "Ornamental Fish"
  | "Breeding Facilities"
  | "Hatchery & Fry"
  | "Farm Operations"
  | "Packing & Export Prep"
  | "Community & Training";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
};

const g = (
  id: string,
  category: GalleryCategory,
  caption: string,
  alt = caption,
): GalleryItem => ({ id, src: `/images/${id}.jpg`, alt, caption, category });

// TODO: add "Quarantine" and "International Exhibitions" photos when supplied.
export const gallery: GalleryItem[] = [
  g("koi-pond", "Ornamental Fish", "Koi in a clear holding pond", "Colourful koi swimming in clear shallow water"),
  g("koi-showa", "Ornamental Fish", "Showa and Sanke koi", "Black, red and white koi in a blue basin"),
  g("koi-kohaku", "Ornamental Fish", "Kohaku koi", "A red and white Kohaku koi swimming over a pale pond floor"),
  g("koi-sanke", "Ornamental Fish", "Red and white koi", "Red and white koi in bright blue water"),
  g("koi-underwater", "Ornamental Fish", "A koi gliding through blue water", "A koi seen from above in blue water"),
  g("goldfish-blue", "Ornamental Fish", "Goldfish in bright water", "Orange goldfish swimming in turquoise water"),
  g("oranda", "Ornamental Fish", "Oranda goldfish", "Orange oranda goldfish with head growth"),
  g("black-moor", "Ornamental Fish", "Black moor goldfish", "Black moor goldfish in turquoise water"),
  g("fluorescent-shoal", "Ornamental Fish", "A shoal of colourful small fish", "A dense shoal of brightly coloured small fish in deep blue water"),
  g("yellow-fish", "Ornamental Fish", "Bright yellow juveniles", "Five small yellow fish swimming near the water surface"),
  g("green-fish", "Ornamental Fish", "Green striped fish", "Five small green fish with yellow fins in rippling water"),
  g("tank-hall-a", "Breeding Facilities", "Glass aquarium hall", "A worker walking between racks of glass aquariums"),
  g("tank-hall-b", "Breeding Facilities", "Multi-level tank racks", "Multi-level glass tank racks in a bright, shaded hall"),
  g("glass-tanks", "Breeding Facilities", "Glass tank systems", "Rows of glass tanks with filtration"),
  g("outdoor-tanks", "Breeding Facilities", "Shaded outdoor tank complex", "Concrete and tarpaulin grow-out tanks under shade net"),
  g("aerated-tank", "Breeding Facilities", "Aerated grow-out tank", "Aerated blue tank with water inflow"),
  g("shade-house", "Breeding Facilities", "Shade-house grow-out tanks", "Long concrete tanks under a shade-net roof"),
  g("numbered-tanks", "Breeding Facilities", "Numbered tank systems", "Numbered blue tanks for organised stock management"),
  g("pond-round", "Breeding Facilities", "Round pond with aeration", "A round tarpaulin pond with a paddle aerator among trees"),
  g("aerator-tanks", "Breeding Facilities", "Aerated tank blocks", "Rows of concrete tanks with blue float aerators beside a blue pool"),
  g("young-orange-fish", "Hatchery & Fry", "Young orange fish", "A group of small orange juvenile fish in pale water"),
  g("fry-bowl", "Hatchery & Fry", "Young fish ready for grading", "A tub full of pale juvenile fish"),
  g("grading-fry", "Hatchery & Fry", "Hands-on fry handling", "A farm worker handling young fish in a concrete tank"),
  g("farm-worker", "Farm Operations", "Daily tank management", "A farm worker managing water levels at a tank"),
  g("farm-manager", "Farm Operations", "Tank inspection", "A manager inspecting tanks in a shade house"),
  g("net-handling", "Farm Operations", "Netting and catching", "A worker handling nets beside the tanks"),
  g("tub-handling", "Farm Operations", "Handling stock between tanks", "Two workers with blue tubs beside net-covered tanks"),
  g("farm-landscape", "Farm Operations", "The farm landscape", "Blue tarpaulin tanks with green hills beyond"),
  g("oxygen-packing", "Packing & Export Prep", "Packing bags ready for oxygenation", "Clear packing bags floating in a tank before packing"),
  g("packing-station", "Packing & Export Prep", "Packing station", "Packing bags and tanks at the packing station"),
  g("outgrower-visit", "Community & Training", "Farm and outgrower visit", "A group visiting tanks on a training farm"),
  g("farm-training", "Community & Training", "Practical training on the tanks", "Participants gathered around grow-out tanks"),
  g("community-training", "Community & Training", "Community training session", "A community group listening to a demonstration beside a tank"),
  g("community-visit", "Community & Training", "Farm-community learning visit", "Visitors and community members walking between tanks"),
  g("farm-visit-shade-net", "Community & Training", "Visitors under the shade net", "A group of visitors looking at grow-out tanks under shade netting"),
  g("farm-briefing", "Community & Training", "Guided briefing at the tanks", "A guide briefing a group beside tanks surrounded by coconut palms"),
  g("feeding-team", "Community & Training", "Farm visit", "Two people handling plants on the farm"),
];

export const galleryCategories: GalleryCategory[] = [
  "Ornamental Fish",
  "Breeding Facilities",
  "Hatchery & Fry",
  "Farm Operations",
  "Packing & Export Prep",
  "Community & Training",
];

// ----------------------------------------------------------------- services
export const services = [
  {
    title: "Fish Breeding & Sourcing",
    body: "Responsible breeding and sourcing through Aquazone's own facilities and its network of local outgrowers.",
    icon: "fish",
  },
  {
    title: "Fish Grading",
    body: "Selection and grading for quality, health and the specifications agreed with each buyer.",
    icon: "grade",
  },
  {
    title: "Quarantine & Conditioning",
    body: "Conditioning and fish-health monitoring prior to dispatch, supported by biosecurity procedures.",
    icon: "shield",
  },
  {
    title: "Professional Live-Fish Packaging",
    body: "Appropriate bags, oxygen packing and careful shipment preparation for live fish.",
    icon: "bag",
  },
  {
    title: "International Air Freight",
    body: "Time-sensitive shipment coordination with rapid transit routes to your market.",
    icon: "plane",
  },
  {
    title: "Export Documentation",
    body: "Relevant veterinary, customs and biosecurity documentation for the destination market.",
    icon: "doc",
  },
  {
    title: "Custom Consolidation Orders",
    body: "Support for mixed-species wholesale inquiries and consolidated shipments.",
    icon: "box",
  },
  {
    title: "International Buyer Support",
    body: "Clear communication throughout quotation, order confirmation and export coordination.",
    icon: "chat",
  },
] as const;

export const exportSteps = [
  {
    n: "01",
    title: "Breed",
    body: "Responsible breeding and sourcing through Aquazone's supply network.",
    icon: "fish",
  },
  {
    n: "02",
    title: "Quarantine",
    body: "Conditioning, health inspection and biosecurity procedures.",
    icon: "shield",
  },
  {
    n: "03",
    title: "Grade",
    body: "Selection and grading based on suitable export specifications.",
    icon: "grade",
  },
  {
    n: "04",
    title: "Pack",
    body: "Careful live-fish packing, oxygenation and shipment preparation.",
    icon: "bag",
  },
  {
    n: "05",
    title: "Ship",
    body: "Export documentation, air-freight coordination and international dispatch.",
    icon: "plane",
  },
] as const;

export const buyerJourney = [
  "Inquiry",
  "Product Selection",
  "Quotation",
  "Order Confirmation",
  "Export Preparation",
  "Dispatch",
] as const;

export const coreValues = [
  {
    title: "Uncompromised Quality",
    body: "Strict health checks, responsible breeding, optimal conditioning and quality grading for every fish.",
    icon: "diamond",
  },
  {
    title: "Social Empowerment",
    body: "Inclusive supply chains that support rural communities, local outgrowers and woman-headed microenterprises.",
    icon: "people",
  },
  {
    title: "Environmental Stewardship",
    body: "Eco-friendly aquaculture, responsible water management and sustainable breeding practices.",
    icon: "leaf",
  },
  {
    title: "Absolute Integrity",
    body: "Transparent communication, ethical trade, honest pricing and long-term international relationships.",
    icon: "handshake",
  },
] as const;

// --------------------------------------------------------------------- FAQ
export type Faq = { q: string; a: string; draft?: boolean };
/** Answers marked draft use placeholders - confirm policy before launch. */
export const faqs: Faq[] = [
  {
    q: "How can international buyers order ornamental fish?",
    a: "Browse the Fish Collection, add the species you are interested in to your quote list, and submit the inquiry form. Our export team will respond with a quotation; once it is confirmed we prepare the order for export.",
  },
  {
    q: "What is the minimum order quantity?",
    a: "Minimum order quantities depend on species and destination. [Aquazone to confirm MOQ policy before launch.] Please state your expected volume in the inquiry form and we will advise.",
    draft: true,
  },
  {
    q: "Which fish species are available?",
    a: "Our catalog includes koi and goldfish, tropical freshwater species and selected Sri Lankan native species. Availability changes with each production cycle, so every species is offered on an enquire-for-availability basis.",
  },
  {
    q: "How are live fish packed?",
    a: "Fish are graded, conditioned and packed in appropriate bags with calibrated oxygen, then placed in protective outer packaging for transit. Packing is adapted to species, size and journey time.",
  },
  {
    q: "How does international shipping work?",
    a: "Shipments travel by air freight on rapid transit routes. Aquazone coordinates dispatch and export documentation; your importer or agent handles destination clearance. [Aquazone to confirm routes and Incoterms offered.]",
    draft: true,
  },
  {
    q: "What export documents are provided?",
    a: "Documentation depends on the destination and may include veterinary/health documentation, customs and biosecurity paperwork and the commercial invoice and packing list. [Aquazone to confirm the exact document set.]",
    draft: true,
  },
  {
    q: "How is fish health monitored?",
    a: "Fish undergo health checks, quarantine and conditioning before dispatch, supported by water-quality monitoring and biosecurity procedures across the farm.",
  },
  {
    q: "What payment methods are available?",
    a: "Payment terms are agreed per order and confirmed in the quotation. [Aquazone to confirm accepted payment methods.]",
    draft: true,
  },
  {
    q: "Can buyers request mixed-species shipments?",
    a: "Yes. We support custom consolidation orders for mixed-species wholesale inquiries. Add several species to your quote list and mention your preferred mix in the message field.",
  },
  {
    q: "What import requirements should buyers check?",
    a: "Import rules for live fish differ by country and may require permits, health certificates or species restrictions. Please confirm requirements with your national authority; we will help with the exporter-side documentation.",
  },
  {
    q: "How can I request a quotation?",
    a: "Use the Request a Quotation button anywhere on the site, or open the Contact page. Include your company, destination and the species of interest. [Response-time commitment to be confirmed by Aquazone.]",
    draft: true,
  },
];

// -------------------------------------------------------------------- blog
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category:
    | "Aquarium Fish Care"
    | "Ornamental Fish Industry"
    | "International Export Updates"
    | "Conservation"
    | "Sustainable Aquaculture";
  author: string;
  /** ISO date. Leave null for undated evergreen drafts. */
  date: string | null;
  image: string;
  featured?: boolean;
  draft: boolean;
  body: string[];
};

/**
 * Evergreen educational drafts - NOT company news. No announcements or
 * dated events are invented. Replace/extend via CMS or MDX.
 */
export const posts: Post[] = [
  {
    slug: "preparing-live-fish-for-export",
    title: "How live ornamental fish are prepared for export",
    excerpt: "Why conditioning, grading and careful oxygen packing matter before a shipment leaves the farm.",
    category: "International Export Updates",
    author: "Aquazone Editorial (draft)",
    date: null,
    image: "/images/oxygen-packing.jpg",
    featured: true,
    draft: true,
    body: [
      "Healthy arrival starts long before packing. Fish that are conditioned, fasted appropriately and graded for uniform size travel better and arrive calmer.",
      "At packing, each bag is sized for the species and journey time, filled with clean water and sealed with oxygen. Outer packaging then protects the bags from temperature swings and handling.",
      "[Aquazone to review and edit this draft with its actual procedures before publication.]",
    ],
  },
  {
    slug: "koi-and-goldfish-grades-explained",
    title: "Koi and goldfish: a buyer's guide to grades",
    excerpt: "What quality grading means for wholesalers and retailers, and what to specify in an inquiry.",
    category: "Ornamental Fish Industry",
    author: "Aquazone Editorial (draft)",
    date: null,
    image: "/images/koi-pond.jpg",
    draft: true,
    body: [
      "Grading separates fish by body shape, pattern quality, colour and size. Clear specifications reduce misunderstandings between buyer and exporter.",
      "When you request a quotation, mention your target size range, the varieties you want and your market segment so that the right grade can be quoted.",
      "[Aquazone to review and edit this draft before publication.]",
    ],
  },
  {
    slug: "water-quality-basics-for-ornamental-fish",
    title: "Water quality basics for healthy ornamental fish",
    excerpt: "Temperature, pH and dissolved oxygen: the three numbers every aquaculture team watches.",
    category: "Aquarium Fish Care",
    author: "Aquazone Editorial (draft)",
    date: null,
    image: "/images/aerated-tank.jpg",
    draft: true,
    body: [
      "Stable water is the foundation of fish health. Sudden changes in temperature, pH or oxygen are a common cause of stress.",
      "Regular testing, good aeration and gradual changes keep fish healthy during breeding, conditioning and transport.",
      "[Aquazone to review and edit this draft before publication.]",
    ],
  },
  {
    slug: "community-aquaculture-in-rural-sri-lanka",
    title: "Community aquaculture: growing livelihoods in rural Sri Lanka",
    excerpt: "How training, breeding stock and a guaranteed buy-back market can turn home setups into micro-businesses.",
    category: "Sustainable Aquaculture",
    author: "Aquazone Editorial (draft)",
    date: null,
    image: "/images/community-training.jpg",
    draft: true,
    body: [
      "Aquazone works with local outgrowers, including woman-headed enterprises, providing technical training, quality breeding stock and a guaranteed buy-back market.",
      "[Aquazone to add verified programme details and, with consent, real stories before publication.]",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
