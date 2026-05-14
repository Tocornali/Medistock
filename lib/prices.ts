import { ProductVariant, User, Role } from '@prisma/client';

export function calculatePrice(
  variant: Pick<ProductVariant, 'price' | 'companyPrice'>,
  user?: Pick<User, 'role'> | null
): number {
  if (user?.role === Role.COMPANY) {
    return variant.companyPrice;
  }
  return variant.price;
}

