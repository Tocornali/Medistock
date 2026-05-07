'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'

export default function ClearCart() {
  const { clearCart } = useCartStore()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return null
}
