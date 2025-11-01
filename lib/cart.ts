export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  metal?: string
  diamondShape?: string
  image?: string
}

export function addToCart(item: Omit<CartItem, 'quantity'>) {
  const cartKey = 'cart'
  const existingCart = localStorage.getItem(cartKey)
  const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : []
  
  const existingItem = cart.find(
    cartItem => 
      cartItem.id === item.id &&
      cartItem.metal === item.metal &&
      cartItem.diamondShape === item.diamondShape
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
