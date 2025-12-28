import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../api/api";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = localStorage.getItem("token");
      if (newToken !== token) {
        setToken(newToken);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [token]);

  const fetchWishlist = async () => {
  try {
    const res = await apiGet("/wishlist/mywishlist");

    const items = res.wishlistItems.map((item) => {
      const product = item.product;
      return {
        ...product,
        id: product.productId,
        category: product.category || { name: "Unknown" },
        artist: product.artist || { name: "Unknown" },
        inStock: product.quantity > 0,
        averageRating: product.averageRating || 0,
        totalReviews: product.totalReviews || 0,
      };
    });

    setWishlist(items);
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
  }
};


  const addToWishlist = async (product) => {
  try {
    await apiPost(`/wishlist/add/${product.id}`, null);

    const normalizedProduct = {
      ...product,
      id: product.productId || product.id,
      category: product.category || { name: "Unknown" },
      artist: product.artist || { name: "Unknown" },
      inStock: product.quantity > 0,
      averageRating: product.averageRating || 0,
      totalReviews: product.totalReviews || 0,
    };

    setWishlist((prev) => [...prev, normalizedProduct]);
  } catch (error) {
    if (error.message && error.message.includes("already in wishlist")) {
      console.warn("Already in wishlist.");
    } else {
      console.error("Failed to add to wishlist:", error);
    }
  }
};


  const removeFromWishlist = async (productId) => {
  try {
    await apiDelete(`/wishlist/remove/${productId}`);

    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  } catch (error) {
    console.error("Failed to remove from wishlist:", error);
  }
};

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
