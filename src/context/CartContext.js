"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cepDestino, setCepDestino] = useState('');
  const [freteOptions, setFreteOptions] = useState([]);
  const [freteSelected, setFreteSelected] = useState(null);
  const [loadingFrete, setLoadingFrete] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("la-casa-cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("la-casa-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id_sac === product.id_sac);
      if (exists) return prev.map(i => i.id_sac === product.id_sac ? {...i, quantity: i.quantity + 1} : i);
      return [...prev, {...product, quantity: 1}];
    });
  };

  const updateQuantity = (id, q) => {
    if (q <= 0) return setCartItems(prev => prev.filter(i => i.id_sac !== id));
    setCartItems(prev => prev.map(i => i.id_sac === id ? {...i, quantity: q} : i));
  };

  const calcularFrete = async (cep) => {
    setLoadingFrete(true);
    try {
      const res = await fetch('/api/frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cepDestino: cep, produtos: cartItems })
      });
      const data = await res.json();
      setFreteOptions(data);
      setCepDestino(cep);
      setFreteSelected(null);
    } finally {
      setLoadingFrete(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart: (id) => updateQuantity(id, 0), updateQuantity,
      cartCount: cartItems.reduce((t, i) => t + i.quantity, 0),
      cepDestino, freteOptions, freteSelected, setFreteSelected, loadingFrete, calcularFrete
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
