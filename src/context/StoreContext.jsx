import { createContext, useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (err) {
      console.error("Error loading cart from localstorage:", err);
      return {};
    }
  });
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const [product_list, setProductList] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || "");
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist") || "[]"));
  const [categories, setCategories] = useState([]);
  const [storefrontSettings, setStorefrontSettings] = useState({ hide_empty_new_arrivals: true });
  const [cartQuote, setCartQuote] = useState(null);
  const [quoteError, setQuoteError] = useState('');
  const [priceRefresh, setPriceRefresh] = useState(0);
  const cartKey = JSON.stringify(cartItems);
  const quoteReady = cartQuote?.key === cartKey && cartQuote?.refresh === priceRefresh;
  const refreshQuote = () => setPriceRefresh(value => value + 1);

  const addToCart = async (itemId, quantity = 1) => {
    const currentQty = cartItems[itemId] || 0;

    // Always fetch fresh stock from backend to avoid stale product_list state
    let liveStock = null;
    try {
      const res = await axiosClient.get(`/api/product/${itemId}`);
      if (res.data.success && res.data.data) {
        liveStock = res.data.data.stock;
        // Also update product_list in place so subsequent local reads are fresh
        setProductList((prev) =>
          prev.map((p) => (p.id === itemId ? { ...p, ...res.data.data } : p))
        );
      }
    } catch (err) {
      console.warn("Could not verify live stock, falling back to cached value:", err);
    }

    // Prefer the live value; fall back to cached product_list entry
    const itemInfo = product_list.find(p => p.id === itemId);
    const stockToCheck = liveStock !== null ? liveStock : itemInfo?.stock;

    if (stockToCheck !== undefined && currentQty + quantity > stockToCheck) {
      toast.warning(`Cannot add more. Only ${stockToCheck} in stock!`);
      return;
    }

    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: quantity }))
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + quantity }))
    }
    toast.success("Added to Cart!", { position: "bottom-right", autoClose: 2000 });
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    toast.info("Removed from Cart", { position: "bottom-right", autoClose: 2000 });
  }

  const deleteFromCart = (itemId) => {
    setCartItems((prev) => {
      const newItems = { ...prev };
      delete newItems[itemId];
      return newItems;
    })
    toast.error("Item Deleted", { position: "bottom-right", autoClose: 2000 });
  }

  // Totals come from the quote endpoint; browser prices never determine checkout totals.
  const getTotalCartAmount = () => quoteReady ? cartQuote.subtotal : 0;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const items = Object.entries(cartItems).filter(([, quantity]) => quantity > 0).map(([productId, quantity]) => ({ productId, quantity }));
    setQuoteError('');
    if (!items.length) { setCartQuote({ key: cartKey, refresh: priceRefresh, items: [], subtotal: 0, deliveryFee: 50 }); return; }
    const timer = setTimeout(async () => {
      try {
        const { data } = await axiosClient.post('/api/order/quote', { items }, { signal: controller.signal });
        if (!data.success) throw new Error('Unable to price cart');
        if (cancelled) return;
        setCartQuote({ ...data.data, key: cartKey, refresh: priceRefresh });
        setProductList(previous => previous.map(product => {
          const item = data.data.items.find(i => i.productId === product.id);
          return item ? { ...product, effectivePrice: item.effectivePrice, price: item.originalPrice, hasOffer: item.hasOffer, discountPercent: item.discountPercent } : product;
        }));
      } catch (error) { if (!cancelled) setQuoteError(error.response?.data?.message || 'تعذر تحديث أسعار السلة / Unable to refresh cart prices'); }
    }, 150);
    return () => { cancelled = true; clearTimeout(timer); controller.abort(); };
  }, [cartKey, priceRefresh]);

  const syncUserWishlist = async (tokenToUse, userToUse) => {
    if (!tokenToUse || !userToUse) return;
    try {
      const currentLocal = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const response = await axiosClient.post('/api/users/sync-wishlist', 
        { userId: userToUse.id, localWishlist: currentLocal }
      );
      if (response.data.success) {
        setWishlist(response.data.wishlist);
        localStorage.setItem("wishlist", JSON.stringify(response.data.wishlist));
      }
    } catch (err) {
      console.error("Wishlist sync error:", err);
    }
  }

  const toggleWishlist = async (productId) => {
    const isWishlisted = wishlist.includes(productId);
    const updatedWishlist = isWishlisted 
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    if (token) {
      try {
        await axiosClient.post('/api/users/wishlist', 
          { userId: userData.id, productId }
        );
      } catch (err) {
        console.error("Wishlist toggle backend error:", err);
      }
    }
    
    if (isWishlisted) {
      toast.info("Removed from Wishlist", { position: "bottom-right", autoClose: 2000 });
    } else {
      toast.success("Added to Wishlist!", { position: "bottom-right", autoClose: 2000 });
    }
  };

  const getWishlistCount = () => {
    return wishlist.length;
  }

  const fetchProductList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/api/product/active');
      if (response.data.success) {
        setProductList(response.data.data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get('/api/product/category/list');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  useEffect(() => {
    const refresh = () => { fetchProductList(); fetchCategories(); refreshQuote();
      axiosClient.get('/api/product/storefront-settings').then(({ data }) => { if (data.success) setStorefrontSettings(data.data); }).catch(() => {});
    };
    refresh();
    const interval = setInterval(refresh, 60000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(interval); window.removeEventListener('focus', refresh); };
  }, [])

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems])

  const getTotalCartCount = () => {
    return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
  }

  const contextValue = {
    url,
    product_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartAmount,
    getTotalCartCount,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    loading,
    error,
    token,
    setToken,
    userData,
    setUserData,
    wishlist,
    toggleWishlist,
    getWishlistCount,
    syncUserWishlist,
    categories, storefrontSettings, cartQuote, quoteReady, quoteError, refreshQuote
  }
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
}

export default StoreContextProvider;