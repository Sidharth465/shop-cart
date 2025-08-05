import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  products: Product[];
  selectedProduct: Product | null;

  cartItems: CartItem[];
  cartTotal: number;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchProducts: () => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setSelectedProduct: (product: Product | null) => void;
  calculateCartTotal: () => void;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;

  return (
    hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && hasMinLength
  );
};

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  products: [],
  selectedProduct: null,
  cartItems: [],
  cartTotal: 0,

  login: async (email: string, password: string) => {
    set({ isLoading: true });

    try {
      const isEmailValid = validateEmail(email);
      const isPasswordValid = validatePassword(password);

      if (isEmailValid && isPasswordValid) {
        const demoUser: User = {
          id: 1,
          email: email,
          username: email.split("@")[0],
          password: password,
          name: {
            firstname: "Demo",
            lastname: "User",
          },
          address: {
            city: "Demo City",
            street: "Demo Street",
            number: 123,
            zipcode: "12345",
            geolocation: {
              lat: "40.7128",
              long: "-74.0060",
            },
          },
          phone: "+1-555-123-4567",
        };

        await AsyncStorage.setItem("user", JSON.stringify(demoUser));
        await AsyncStorage.setItem("isAuthenticated", "true");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        set({
          user: demoUser,
          isAuthenticated: true,
          isLoading: false,
        });

        return true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      cartItems: [],
      cartTotal: 0,
      selectedProduct: null,
    });

    AsyncStorage.removeItem("user");
    AsyncStorage.removeItem("isAuthenticated");
    AsyncStorage.removeItem("cartItems");
  },

  fetchProducts: async () => {
    set({ isLoading: true });

    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const products: Product[] = await response.json();

      set({ products, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addToCart: (product: Product) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );

    let newCartItems: CartItem[];

    if (existingItem) {
      newCartItems = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCartItems = [...cartItems, { product, quantity: 1 }];
    }

    set({ cartItems: newCartItems });
    get().calculateCartTotal();

    AsyncStorage.setItem("cartItems", JSON.stringify(newCartItems));
  },

  removeFromCart: (productId: number) => {
    const { cartItems } = get();
    const newCartItems = cartItems.filter(
      (item) => item.product.id !== productId
    );

    set({ cartItems: newCartItems });
    get().calculateCartTotal();

    AsyncStorage.setItem("cartItems", JSON.stringify(newCartItems));
  },

  updateCartItemQuantity: (productId: number, quantity: number) => {
    const { cartItems } = get();

    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const newCartItems = cartItems.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );

    set({ cartItems: newCartItems });
    get().calculateCartTotal();

    AsyncStorage.setItem("cartItems", JSON.stringify(newCartItems));
  },

  clearCart: () => {
    set({ cartItems: [], cartTotal: 0 });
    AsyncStorage.removeItem("cartItems");
  },

  setSelectedProduct: (product: Product | null) => {
    set({ selectedProduct: product });
  },

  calculateCartTotal: () => {
    const { cartItems } = get();
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    set({ cartTotal: total });
  },
}));

export const initializeStore = async () => {
  try {
    const userStr = await AsyncStorage.getItem("user");
    const isAuthenticated =
      (await AsyncStorage.getItem("isAuthenticated")) === "true";
    const cartItemsStr = await AsyncStorage.getItem("cartItems");

    if (userStr) {
      const user = JSON.parse(userStr);
      useAppStore.setState({ user, isAuthenticated });
    }

    if (cartItemsStr) {
      const cartItems = JSON.parse(cartItemsStr);
      useAppStore.setState({ cartItems });
      useAppStore.getState().calculateCartTotal();
    }
  } catch (error) {}
};
