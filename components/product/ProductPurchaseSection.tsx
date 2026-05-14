
"use client";

import { useState } from "react";
import VariantSelector from "./VariantSelector";
import AddToCartButton from "@/components/AddToCartButton";
import QuantitySelector from "./QuantitySelector";
import { useSession } from "next-auth/react";

interface ProductPurchaseSectionProps {
  product: {
    id: string;
    name: string;
    imageUrl?: string;
    isInstitutionalOnly: boolean;
    requiereReceta: boolean;
    maxRetailQty: number;
    maxCompanyQty: number;
  };
  variants: any[];
}

export default function ProductPurchaseSection({ product, variants }: ProductPurchaseSectionProps) {
  const { data: session } = useSession();
  const isCompany = session?.user?.role === "COMPANY";
  
  // Rastrear la variante seleccionada localmente
  const initialVariant = variants.find(v => v.stock > 0) || variants[0];
  const [activeVariant, setActiveVariant] = useState(initialVariant);
  const [quantity, setQuantity] = useState(1);

  const handleVariantChange = (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (variant) setActiveVariant(variant);
  };

  // Cálculo del límite máximo dinámico
  const accountLimit = isCompany ? product.maxCompanyQty : product.maxRetailQty;
  const effectiveMax = Math.min(activeVariant.stock, accountLimit);

  const showPurchase = !product.isInstitutionalOnly || isCompany;

  return (
    <div className="space-y-8">
      <VariantSelector 
        product={product} 
        variants={variants} 
        onVariantChange={handleVariantChange}
      />

      {showPurchase && (
        <div className="pt-6 border-t border-slate-100 dark:border-white/10 space-y-6">
          <QuantitySelector 
            max={effectiveMax} 
            onChange={setQuantity} 
          />

          <AddToCartButton 
            product={{
              id: activeVariant.id,
              productId: product.id,
              nombre: product.name,
              sku: activeVariant.sku,
              variantName: activeVariant.nameModifier,
              precio: isCompany ? activeVariant.companyPrice : activeVariant.price,
              stock_global: activeVariant.stock,
              requiereReceta: product.requiereReceta,
              image: product.imageUrl || undefined
            }}
            quantity={quantity}
          />
        </div>
      )}
    </div>
  );
}
