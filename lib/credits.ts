export type CreditAction =
  | "product_finder"
  | "description_optimizer"
  | "pricing_intelligence"
  | "photo_studio"
  | "video_generator"
  | "template_finder"
  | "template_video";

export const STARTER_CREDITS = 5;

export const creditCosts: Record<CreditAction, number> = {
  product_finder: 2,
  description_optimizer: 2,
  pricing_intelligence: 3,
  photo_studio: 5,
  video_generator: 5,
  template_finder: 8,
  template_video: 10
};

export function getCreditCost(action: CreditAction) {
  return creditCosts[action];
}
