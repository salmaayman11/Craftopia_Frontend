import { createContext, useState, useContext, useEffect } from "react";
import { apiGet, apiPost, apiDelete } from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (user && storedToken) {
      setToken(storedToken);
    }
  }, [user]);
  useEffect(() => {
    if (token) {
      fetchCart(token);
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const res = await apiGet("/mycart");

      const items = res.cartItems.map((item) => {
        const product = item.product;
        return {
          id: product.productId,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category?.name || "Unknown",
          artist: product.artist?.name || "Unknown",
          description: product.description,
          dimensions: product.dimensions,
          material: product.material,
          cartQuantity: item.quantity,
          stockQuantity: product.quantity - product.sellingNumber,
          inStock: product.quantity > 0,
          averageRating: product.averageRating || 0,
          totalReviews: product.totalReviews || 0,
        };
      });

      setCartItems(items);
    } catch (error) {
      console.error("❌ Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!token) return;

    const existing = cartItems.find((item) => item.id === product.id);
    const currentCartQty = existing?.cartQuantity || 0;
    const maxQty = existing?.stockQuantity || product.quantity;

    if (currentCartQty >= maxQty) return;

    try {
      console.log("🛒 Adding product to cart:", product);
      await apiPost(`/mycart/add/${product.id}`, {});

      await fetchCart();
      console.log("✅ Product added to cart successfully");
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      throw err;
    }
  };

  const incrementQuantity = async (product) => {
    const id = product.id;
    if (!token) return;

    try {
      const res = await apiPost(`/mycart/increment/${id}`, {});

      const updatedQty = res.cartItem.quantity;

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, cartQuantity: updatedQty } : item
        )
      );
    } catch (err) {
      console.error("❌ Increment failed:", err.message);
    }
  };

  const decrementQuantity = async (product) => {
    const id = product.id;
    if (!token) return;

    try {
      const res = await apiPost(`/mycart/decrement/${id}`, {});

      if (res.message === "Cart item removed completely") {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        const updatedQty = res.cartItem.quantity;
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, cartQuantity: updatedQty } : item
          )
        );
      }
    } catch (err) {
      console.error("❌ Decrement failed:", err.message);
    }
  };

  const removeFromCart = async (id) => {
    if (!token) return;

    try {
      await apiDelete(`/mycart/remove/${id}`);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("❌ Remove from cart failed:", err);
    }
  };

  const clearCart = async () => {
    if (!token) return;

    try {
      await apiDelete("/mycart/clear");
      setCartItems([]);
    } catch (err) {
      console.error("❌ Clear cart failed:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        fetchCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
