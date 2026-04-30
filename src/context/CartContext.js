"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  
  // Novo estado que vai servir de "trava de segurança"
  const [cartOwner, setCartOwner] = useState(null); 

  // 1. Descobre quem está logado
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || "deslogado");
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || "deslogado");
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Efeito de CARREGAMENTO (Muda de gaveta)
  useEffect(() => {
    if (!userId) return;

    const storageKey = `la-casa-cart-${userId}`;
    const savedCart = localStorage.getItem(storageKey);
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Erro ao carregar o carrinho:", error);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
    
    // Assim que ele termina de carregar, ele avisa quem é o dono desse novo carrinho
    setCartOwner(userId);
  }, [userId]);

  // 3. Efeito de SALVAMENTO
  useEffect(() => {
    // A TRAVA: O sistema só salva se o dono do carrinho atual bater com o status do usuário.
    // Isso impede que os itens da sua conta vazem para a gaveta "deslogado" no momento de sair.
    if (userId && cartOwner === userId) {
      const storageKey = `la-casa-cart-${userId}`;
      if (cartItems.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(cartItems));
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  }, [cartItems, userId, cartOwner]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Pega a quantidade configurada no frontend (ex: 999). Se não tiver, assume 1.
      const quantidadeParaAdicionar = product.quantity || 1;

      // Procura se já existe no carrinho o MESMO modelo com a MESMA cor
      const existingItem = prevItems.find(
        (item) => item.id_sac === product.id_sac && item.cor_id === product.cor_id
      );

      if (existingItem) {
        // Se já existe, soma as quantidades
        return prevItems.map((item) =>
          (item.id_sac === product.id_sac && item.cor_id === product.cor_id)
            ? { ...item, quantity: item.quantity + quantidadeParaAdicionar }
            : item
        );
      }
      
      // Se não existe, adiciona como item novo mantendo a quantidade escolhida
      return [...prevItems, { ...product, quantity: quantidadeParaAdicionar }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id_sac !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id_sac === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}