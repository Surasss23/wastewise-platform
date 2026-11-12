export type WasteCategory = "Wet waste" | "Dry waste" | "Sanitary waste" | "Special care";

export type WasteGuideItem = {
  name: string;
  category: WasteCategory;
  preparation: string;
  reason: string;
  destination: string;
  keywords: string[];
};

export const wasteGuide: WasteGuideItem[] = [
  { name: "Banana peel", category: "Wet waste", preparation: "Keep it separate from plastic and other dry waste. Drain excess liquid.", reason: "Food scraps decompose and can be processed as organic waste.", destination: "Wet-waste collection or home composting.", keywords: ["banana", "peel", "fruit", "food"] },
  { name: "Vegetable scraps", category: "Wet waste", preparation: "Collect in a covered, leak-proof container. Avoid mixing with wrappers.", reason: "Most uncooked vegetable scraps are biodegradable.", destination: "Wet-waste collection or composting.", keywords: ["vegetable", "scraps", "food", "kitchen"] },
  { name: "Paper", category: "Dry waste", preparation: "Keep clean and dry. Flatten cardboard boxes.", reason: "Clean paper can often be recycled; greasy or wet paper may not be accepted.", destination: "Dry recyclable collection.", keywords: ["paper", "newspaper", "cardboard", "carton"] },
  { name: "Plastic bottle", category: "Dry waste", preparation: "Empty, rinse if needed, dry and keep separate. Follow local recycler instructions for caps.", reason: "Clean bottles may be accepted by material recovery facilities.", destination: "Dry recyclable collection or verified recycler.", keywords: ["plastic", "bottle", "water bottle", "pet"] },
  { name: "Glass bottle", category: "Special care", preparation: "Do not break it. Keep it in a rigid container and label it if cracked.", reason: "Glass is recyclable in some systems but broken glass can injure handlers.", destination: "Ask your local collector or verified glass recycler.", keywords: ["glass", "bottle", "jar"] },
  { name: "Used battery", category: "Special care", preparation: "Keep terminals protected where possible. Never puncture, burn or put in wet waste.", reason: "Batteries can contain hazardous materials and may cause fires.", destination: "Authorised battery take-back point or e-waste channel.", keywords: ["battery", "cell", "power bank"] },
  { name: "Sanitary pad", category: "Sanitary waste", preparation: "Wrap securely in paper or the original wrapper. Do not mix with recyclables.", reason: "It requires separate handling to protect sanitation workers.", destination: "Follow your local body's sanitary-waste collection instructions.", keywords: ["pad", "sanitary", "menstrual", "diaper", "nappy"] },
  { name: "Old phone", category: "Special care", preparation: "Back up and erase personal data. Do not dismantle or put in household bins.", reason: "Electronics contain recoverable materials and components needing safe handling.", destination: "Authorised e-waste collection centre or producer take-back.", keywords: ["phone", "mobile", "charger", "electronics", "earphones"] }
];

export function findWasteGuide(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return wasteGuide.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.keywords.some(keyword => keyword.includes(q) || q.includes(keyword))
  );
}
