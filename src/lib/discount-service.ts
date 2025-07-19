
export interface DiscountCode {
  code: string;
  percentage: number;
  validUntil: Date;
  maxUses?: number;
  currentUses: number;
  active: boolean;
}

class DiscountServiceClass {
  private discounts: DiscountCode[] = [
    {
      code: "FOCUSFLOW10",
      percentage: 10,
      validUntil: new Date("2024-12-31"),
      maxUses: 100,
      currentUses: 0,
      active: true,
    },
    {
      code: "EARLYBIRD",
      percentage: 25,
      validUntil: new Date("2024-06-30"),
      maxUses: 50,
      currentUses: 0,
      active: true,
    },
  ];

  validateDiscount(code: string): DiscountCode | null {
    const discount = this.discounts.find(
      (d) => d.code.toLowerCase() === code.toLowerCase() && d.active,
    );

    if (!discount) return null;

    // Check if expired
    if (discount.validUntil < new Date()) {
      return null;
    }

    // Check if max uses reached
    if (discount.maxUses && discount.currentUses >= discount.maxUses) {
      return null;
    }

    return discount;
  }

  applyDiscount(code: string): boolean {
    const discount = this.validateDiscount(code);
    if (!discount) return false;

    discount.currentUses++;
    return true;
  }

  calculateDiscountAmount(subtotal: number, code: string): number {
    const discount = this.validateDiscount(code);
    if (!discount) return 0;

    return Math.round((subtotal * discount.percentage) / 100);
  }
}

export const discountService = new DiscountServiceClass();
