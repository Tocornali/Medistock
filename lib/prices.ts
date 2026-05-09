import { Product, User, Role } from '@prisma/client';

export function calculatePrice(
  product: Pick<Product, 'precio' | 'companyPrice'>,
  user?: Pick<User, 'role'> | null
): number {
  if (user?.role === Role.COMPANY) {
    return product.companyPrice ?? (product.precio * 0.85);
  }
  return product.precio;
}
