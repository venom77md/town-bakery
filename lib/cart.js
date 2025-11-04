// Cart utilities for localStorage management

export const CART_KEY = 'sweetcrust_cart';

export function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    // Silently fail in production, log only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('خطأ في قراءة السلة:', error);
    }
    return [];
  }
}

export function saveCart(cart) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  } catch (error) {
    // Silently fail in production, log only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('خطأ في حفظ السلة:', error);
    }
  }
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name_ar: product.name_ar,
      name_en: product.name_en,
      price: product.price,
      currency: product.currency,
      image: product.image,
      quantity: quantity,
    });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  return cart;
}

export function updateCartItemQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    saveCart(cart);
    return cart;
  }
  
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal() {
  return getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

