export interface PricedCourse {
  regular_price: number;
  discount_price: number | null;
}

export interface DisplayPrice {
  current: number;
  original: number | null;
  hasDiscount: boolean;
}

export function getDisplayPrice(course: PricedCourse): DisplayPrice {
  const regular = course.regular_price;
  const discount = course.discount_price;

  const validDiscount =
    discount !== null &&
    Number.isFinite(discount) &&
    discount >= 0 &&
    discount <= regular;

  if (validDiscount) {
    return { current: discount, original: regular, hasDiscount: true };
  }

  return { current: regular, original: null, hasDiscount: false };
}

export function formatTaka(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}
