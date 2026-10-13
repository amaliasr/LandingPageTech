export const WHATSAPP_NUMBER = "6281944496015";

export const products = {
  dapur: {
    name: "Dapur Mama Catering",
    category: "Food & hospitality",
    description:
      "A catering website that takes customers from choosing a menu to arranging their order on WhatsApp. Behind the scenes, the team has a place to keep menus, customers, and orders organized.",
    features: [
      "Menu, portion, delivery date, and address selection",
      "An order summary ready to continue on WhatsApp",
      "Menu, customer, and order management for the team",
    ],
  },
  rumah: {
    name: "RumahFLOW",
    category: "Household finance",
    description:
      "A home for the everyday details of household finances. Keep income, spending, receipts, and account balances together, then look back at the month with a clearer view.",
    features: [
      "Income and expense records with receipt uploads",
      "Multiple accounts and credit card records",
      "Monthly cash flow reports and CSV exports",
    ],
  },
  ternaku: {
    name: "TernaKu",
    category: "Poultry operations",
    description:
      "A practical workspace for poultry farm owners and staff. Keep daily production, feed, inventory, and sales records in order, so the details are easier to follow.",
    features: [
      "Daily egg production and stock movements",
      "Sales records with partial and full payment tracking",
      "Feed purchasing, usage, and operational reports",
    ],
  },
};

export function createWhatsAppUrl({ name = "", type = "", message = "" } = {}) {
  const intro = name.trim()
    ? `Hi R Studio Hub, I’m ${name.trim()}.`
    : "Hi R Studio Hub!";
  const interest = type.trim() ? `I’d like to talk about: ${type.trim()}.` : "";
  const text = [intro, interest, message.trim()].filter(Boolean).join("\n\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
