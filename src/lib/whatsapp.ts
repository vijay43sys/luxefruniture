export const WHATSAPP_NUMBER = "919840000000";
export const BUSINESS = {
  name: "APJ Furniture & Interior",
  tagline: "Premium Quality Furniture at Best Price",
  phone: "+91 98400 00000",
  email: "sales@apjfurniture.com",
  address: "F Type, 5/16, 4th Main Rd, Sidco Nagar, Villivakkam, Chennai, Tamil Nadu 600049",
  mapsQuery: "APJ Furniture Sidco Nagar Villivakkam Chennai 600049",
  hours: "Monday — Saturday: 10am — 8pm",
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? `Hello APJ Furniture, I'd like to enquire about your products.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export const CATEGORIES = ["Sofa", "Dining Table", "Bed", "Office Furniture", "Wardrobe"] as const;
export type Category = (typeof CATEGORIES)[number];
