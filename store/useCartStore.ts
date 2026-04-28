import { create } from 'zustand'

export interface CartItem {
  id: string
  nombre: string
  precio: number
  cantidad: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, cantidad: number) => void
  clearCart: () => void
  getTotal: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existingItem = state.items.find(i => i.id === item.id)
    if (existingItem) {
      return {
        items: state.items.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + item.cantidad } : i)
      }
    }
    return { items: [...state.items, item] }
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),
  updateQuantity: (id, cantidad) => set((state) => {
    if (cantidad <= 0) {
      return { items: state.items.filter(i => i.id !== id) }
    }
    return {
      items: state.items.map(i => i.id === id ? { ...i, cantidad } : i)
    }
  }),
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  },
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.cantidad, 0)
  }
}))
