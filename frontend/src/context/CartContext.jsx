import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cb_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse cart from storage', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cb_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product, quantity = 1, options = {}) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        
        // Stock check
        if (product.stock_quantity && newQty > product.stock_quantity) {
          showToast(`Only ${product.stock_quantity} units available in stock.`);
          updated[existingIndex].quantity = product.stock_quantity;
        } else {
          updated[existingIndex].quantity = newQty;
          showToast(`Updated "${product.name}" quantity (${newQty})`);
        }
        return updated;
      } else {
        const itemPrice = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;
        const initialQty = product.stock_quantity ? Math.min(quantity, product.stock_quantity) : quantity;
        
        showToast(`Added "${product.name}" to your cart`);
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: itemPrice,
            image: product.image,
            category_name: product.category_name,
            stock_quantity: product.stock_quantity,
            quantity: initialQty,
            options,
          },
        ];
      }
    });

    // Automatically open right-side cart drawer on add
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const maxStock = item.stock_quantity || 99;
          const finalQty = Math.min(newQuantity, maxStock);
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
