export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  metal?: string
  diamondShape?: string
  image?: string
  customizations?: {
    metal?: string
    carat?: number
    color?: string
    clarity?: string
    cut?: string
    certificate?: string
  }
}

export function addToCart(item: Omit<CartItem, 'quantity'>) {
  const cartKey = 'cart'
  const existingCart = localStorage.getItem(cartKey)
  const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : []
  
  const existingItem = cart.find(
    cartItem => {
      // Check if items match by id and customizations
      if (cartItem.id !== item.id) return false
      
      // If both have customizations, compare them
      if (item.customizations && cartItem.customizations) {
        return JSON.stringify(item.customizations) === JSON.stringify(cartItem.customizations)
      }
      
      // If neither have customizations, compare by metal and diamondShape
      if (!item.customizations && !cartItem.customizations) {
        return cartItem.metal === item.metal && cartItem.diamondShape === item.diamondShape
      }
      
      // If one has customizations and the other doesn't, they're different items
      return false
    }
  )

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...item, quantity: 1 })
  }

  localStorage.setItem(cartKey, JSON.stringify(cart))
  return cart
}

export function getCart(): CartItem[] {
  const cartKey = 'cart'
  const cart = localStorage.getItem(cartKey)
  return cart ? JSON.parse(cart) : []
}

export function removeFromCart(id: string) {
  const cartKey = 'cart'
  const existingCart = localStorage.getItem(cartKey)
  const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : []
  
  const updatedCart = cart.filter(item => item.id !== id)
  localStorage.setItem(cartKey, JSON.stringify(updatedCart))
  return updatedCart
}

export function clearCart() {
  const cartKey = 'cart'
  localStorage.removeItem(cartKey)
  return []
}
