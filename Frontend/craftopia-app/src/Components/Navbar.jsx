import React, { useState, useEffect, useRef } from 'react';
import { apiGet } from '../api/api';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { FaUser, FaSearch, FaUserFriends } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const blurTimeoutRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, artistsRes, auctionsRes] = await Promise.all([
          apiGet('/product/get'),
          apiGet('/artist/all'),
          apiGet('/auction'),
        ]);

        setAllProducts(productsRes.products || []);
        setAllArtists(artistsRes.artists || []);
        setAuctions(auctionsRes.auctions || []);
      } catch (err) {
        console.error('Navbar fetch error:', err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const term = searchTerm.toLowerCase();

    const matchedProducts = allProducts
      .filter(p => p.name.toLowerCase().includes(term))
      .slice(0, 5)
      .map(p => ({ ...p, type: p.type }));

    const matchedArtists = allArtists
      .filter(a => a.name.toLowerCase().includes(term) || a.username.toLowerCase().includes(term))
      .slice(0, 5)
      .map(a => ({ ...a, type: 'artist' }));

    setSuggestions([...matchedProducts, ...matchedArtists]);
  }, [searchTerm, allProducts, allArtists]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar at the top
      if (currentScrollY <= 0) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down (only hide after scrolling past 100px to prevent immediate hiding)
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getProfileLink = () => {
    if (!user) return '/login';
    if (user.role === 'artist') return '/artist-profile';
    if (user.role === 'admin') return '/admin';
    return '/customer-profile';
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setSuggestions([]);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setSuggestions([]);
    }, 150);
  };

  const handleSuggestionClick = (item) => {
    clearTimeout(blurTimeoutRef.current);
    setSearchTerm(item.name || item.username);
    setSuggestions([]);

    if (item.type === 'artist') {
      navigate(`/artist-profile-customer/${item.artistId}`);
    } else if (item.type === 'auction') {
      const auction = auctions.find(a => a.productId === item.productId);
      if (auction) {
        navigate(`/auction/${auction.id}`);
      } else {
        console.warn('Auction not found for product', item.productId);
      }
    } else {
      navigate(`/product/${item.productId}`, { state: { product: item } });
    }
  };

  return (
    <nav className={`bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between py-2 sm:py-4 gap-2 sm:gap-4">
        <Link
          to="/"
          className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-wide flex-shrink-0"
          style={{ fontFamily: "'Lily Script One', cursive" }}
        >
          Craftopia
        </Link>

        <div className="relative flex-1 max-w-xs sm:max-w-none sm:w-1/3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            onBlur={handleBlur}
            placeholder="Search..."
            className="w-full border border-coral rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coral"
          />
          <FaSearch className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm sm:text-lg pointer-events-none" />

          {suggestions.length > 0 && (
            <ul className="absolute z-50 bg-white border border-gray-200 mt-1 w-full rounded-lg shadow-md max-h-60 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer touch-manipulation"
                  onMouseDown={() => handleSuggestionClick(item)}
                >
                  {item.name || item.username} (
                  {item.type === 'artist'
                    ? 'Artist'
                    : item.type === 'auction'
                    ? 'Auction'
                    : 'Product'}
                  )
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-5 text-gray-700 text-lg sm:text-2xl flex-shrink-0">
          {user?.role === 'customer' && (
            <>
              <AiOutlineHeart
                className="cursor-pointer hover:text-burgundy transition touch-manipulation"
                title="Wishlist"
                onClick={() => navigate('/wishlist')}
              />
              <FaUserFriends
                className="cursor-pointer hover:text-burgundy transition touch-manipulation hidden sm:block"
                title="Following"
                onClick={() => navigate('/following')}
              />
              <AiOutlineShoppingCart
                className="cursor-pointer hover:text-burgundy transition touch-manipulation"
                title="Cart"
                onClick={() => navigate('/cart')}
              />
            </>
          )}

          <div
            className="cursor-pointer hover:text-burgundy transition touch-manipulation"
            onClick={() => navigate(getProfileLink())}
            title={user ? 'My Account' : 'Sign In'}
          >
            <FaUser className="text-lg sm:text-[1.6rem]" />
          </div>

          {user && (
            <button
              onClick={() => {
                logout();
                navigate('/');
                window.location.href = '/';
              }}
              className="hidden sm:inline-block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-coral rounded-md hover:bg-coral hover:text-white transition touch-manipulation"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
