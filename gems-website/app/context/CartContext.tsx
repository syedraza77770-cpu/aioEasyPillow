'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  carat?: number;
  category?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

interface CartContextValue {
  state: CartState;
  items: CartItem[];
  addItem: (item: CartItem) => void;
  addToCart: (item: CartItem) => void;
  removeItem: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
  totalPrice: number;
}

/* ─── Reducer ────────────────────────────────────────────────────────────── */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + (action.payload.quantity ?? 1) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

/* ─── Context ────────────────────────────────────────────────────────────── */
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const addItem     = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  const removeItem  = useCallback((id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id }), []);
  const updateQuantity = useCallback(
    (id: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
    []
  );
  const clearCart   = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const toggleCart  = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const openCart    = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart   = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  const itemCount   = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice  = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ state, items: state.items, addItem, addToCart: addItem, removeItem, removeFromCart: removeItem, updateQuantity, clearCart, toggleCart, openCart, closeCart, itemCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
