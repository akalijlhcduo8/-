import React, { useState, useRef, useEffect } from 'react';
import { 
  Gamepad2, 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  Globe, 
  KeyRound, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Trash2,
  LogIn,
  LogOut,
  ShieldAlert,
  Store,
  MailCheck,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_GAMES } from '../data/mockGames';
import { Platform } from '../types';

export const Header: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    currency, 
    setCurrency, 
    currentPage, 
    navigateTo, 
    cart, 
    cartTotalCount, 
    cartTotal,
    removeFromCart,
    wishlist, 
    t, 
    formatPrice, 
    filters, 
    setFilters,
    userProfile,
    firebaseUser,
    openAuthModal,
    logout,
    sendVerificationEmail
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Filter search recommendations
  const searchResults = searchQuery.trim() === '' ? [] : MOCK_GAMES.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.titleAr.includes(searchQuery) ||
    g.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.genre.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
      navigateTo('catalog');
      setIsSearchOpen(false);
    }
  };

  const getPlatformColor = (p: Platform) => {
    switch (p) {
      case 'Steam': return 'text-sky-400 bg-sky-950/60 border-sky-500/40';
      case 'Epic': return 'text-neutral-300 bg-neutral-900 border-neutral-700';
      case 'EA': return 'text-orange-400 bg-orange-950/60 border-orange-500/40';
      case 'Ubisoft': return 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40';
      case 'Xbox': return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      case 'PlayStation': return 'text-blue-400 bg-blue-950/60 border-blue-500/40';
      default: return 'text-purple-400 bg-purple-950/60 border-purple-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#090a10]/95 backdrop-blur-md border-b border-purple-900/30">
      {/* Email Verification Alert Banner */}
      {firebaseUser && !firebaseUser.emailVerified && (
        <div className="bg-amber-950/90 border-b border-amber-500/40 py-2 px-4 text-xs font-medium text-amber-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MailCheck className="w-4 h-4 text-amber-400 flex-shrink-0 animate-bounce" />
              <span>
                {language === 'ar' 
                  ? `حسابك (${firebaseUser.email}) غير مفعل بعد. يرجى التحقق من صندوق الوارد لتفعيل الحساب بالكامل.` 
                  : `Your account (${firebaseUser.email}) is not verified yet. Please check your inbox.`}
              </span>
            </div>
            <button
              onClick={sendVerificationEmail}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1 rounded-lg font-bold text-[11px] transition-colors font-gaming"
            >
              {language === 'ar' ? 'إعادة إرسال رابط التحقق' : 'Resend Verification Link'}
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-purple-950/80 border-b border-purple-800/20 py-1.5 px-4 text-xs font-medium text-purple-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{language === 'ar' ? '⚡ مصادقة Firebase مشفرة وبوابة Stripe Webhook جاهزة 100%' : '⚡ Live Firebase Auth & Stripe Webhook Gateway Active 100%'}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-purple-300">
            <button 
              onClick={() => navigateTo('merchant')} 
              className="hover:text-cyan-400 font-bold flex items-center gap-1 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'لوحة التاجر' : 'Merchant'}</span>
            </button>
            <span>|</span>
            <span>{language === 'ar' ? 'كوبون: NEXUS10 لخصم 10%' : 'Promo Code: NEXUS10'}</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div 
            id="site-logo"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 glow-purple group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0d0e17] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#090a10]">
                <KeyRound className="w-2.5 h-2.5 text-black" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-gaming font-extrabold text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-400">
                  {language === 'ar' ? 'نيكسوس' : 'NEXUS'}
                </span>
                <span className="font-gaming font-extrabold text-2xl text-purple-500">
                  {language === 'ar' ? 'كيز' : 'KEYS'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-[#121422] text-slate-200 placeholder-slate-500 text-sm rounded-xl py-2.5 pl-11 pr-11 border border-purple-900/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-inner"
              />
              <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-white ${language === 'ar' ? 'left-3.5' : 'right-3.5'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Instant Search Suggestions Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-[#131525] border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-purple-900/30 backdrop-blur-xl">
                <div className="p-2 text-xs font-semibold text-purple-300 bg-[#0d0e17]/80 flex justify-between items-center">
                  <span>{language === 'ar' ? 'نتائج البحث السريع' : 'Quick Search Results'}</span>
                  <span className="text-[11px] text-slate-400">{searchResults.length} {t.gamesWord}</span>
                </div>
                {searchResults.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => {
                      navigateTo('product', game.id);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-3 hover:bg-purple-900/20 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={game.coverImage} 
                        alt={game.title} 
                        className="w-10 h-12 object-cover rounded-md border border-purple-800/40 group-hover:border-cyan-400 transition-colors"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {language === 'ar' ? game.titleAr : game.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${getPlatformColor(game.platform)}`}>
                            {game.platform}
                          </span>
                          <span className="text-xs text-slate-400">
                            {language === 'ar' ? game.genreAr : game.genre}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-cyan-400 font-gaming">
                        {formatPrice(game.price)}
                      </span>
                      {game.discount > 0 && (
                        <div className="text-[10px] text-emerald-400">
                          -{game.discount}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-5 text-sm font-medium">
              <button 
                id="nav-home-btn"
                onClick={() => navigateTo('home')}
                className={`transition-colors hover:text-cyan-400 ${currentPage === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
              >
                {t.navHome}
              </button>
              <button 
                id="nav-catalog-btn"
                onClick={() => navigateTo('catalog')}
                className={`transition-colors hover:text-cyan-400 ${currentPage === 'catalog' ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
              >
                {t.navCatalog}
              </button>
              <button 
                id="nav-how-btn"
                onClick={() => navigateTo('how-it-works')}
                className={`transition-colors hover:text-cyan-400 ${currentPage === 'how-it-works' ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
              >
                {t.navHowItWorks}
              </button>
              <button 
                id="nav-support-btn"
                onClick={() => navigateTo('contact')}
                className={`transition-colors hover:text-cyan-400 ${currentPage === 'contact' ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
              >
                {t.navSupport}
              </button>
            </nav>

            <div className="h-6 w-px bg-purple-900/40" />

            {/* Currency & Language Controls */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center bg-[#131525] rounded-lg p-0.5 border border-purple-900/40">
                <button
                  id="currency-sar-btn"
                  onClick={() => setCurrency('SAR')}
                  className={`px-2 py-1 rounded font-bold transition-all ${currency === 'SAR' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  SAR
                </button>
                <button
                  id="currency-usd-btn"
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-1 rounded font-bold transition-all ${currency === 'USD' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  USD
                </button>
              </div>

              <button
                id="language-toggle-btn"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-1.5 bg-[#131525] hover:bg-purple-900/30 text-slate-300 hover:text-cyan-400 px-2.5 py-1.5 rounded-lg border border-purple-900/40 transition-all font-semibold"
                title="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'ar' ? 'English' : 'عربي'}</span>
              </button>
            </div>

            {/* User, Wishlist & Cart Buttons */}
            <div className="flex items-center gap-3">
              {/* Wishlist */}
              <button
                id="header-wishlist-btn"
                onClick={() => navigateTo('account')}
                className="relative p-2.5 rounded-xl bg-[#131525] border border-purple-900/40 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all"
                title={t.navWishlist}
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Button with Quick Dropdown */}
              <div className="relative">
                <button
                  id="header-cart-btn"
                  onClick={() => setIsMiniCartOpen(!isMiniCartOpen)}
                  className="relative p-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/40 text-cyan-300 hover:border-cyan-400 transition-all flex items-center gap-2 group"
                >
                  <ShoppingCart className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-gaming font-bold hidden xl:inline">
                    {formatPrice(cartTotal)}
                  </span>
                  {cartTotalCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-500 text-black text-[11px] font-black flex items-center justify-center glow-cyan">
                      {cartTotalCount}
                    </span>
                  )}
                </button>

                {/* Mini Cart Slideout Dropdown */}
                {isMiniCartOpen && (
                  <div className={`absolute top-full mt-3 w-80 sm:w-96 bg-[#131525] border border-purple-500/30 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                    <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-sm text-white">{t.navCart} ({cartTotalCount})</span>
                      </div>
                      <button 
                        onClick={() => setIsMiniCartOpen(false)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {cart.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-sm">
                        <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-purple-400/40" />
                        <p>{t.cartEmpty}</p>
                        <button
                          onClick={() => {
                            setIsMiniCartOpen(false);
                            navigateTo('catalog');
                          }}
                          className="mt-3 text-xs text-cyan-400 font-bold hover:underline"
                        >
                          {t.startShopping}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-60 overflow-y-auto divide-y divide-purple-900/30 my-2">
                          {cart.map((item) => (
                            <div key={item.game.id} className="py-2.5 flex items-center justify-between gap-3">
                              <img 
                                src={item.game.coverImage} 
                                alt={item.game.title} 
                                className="w-10 h-12 rounded object-cover border border-purple-900/50"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-semibold text-white truncate">
                                  {language === 'ar' ? item.game.titleAr : item.game.title}
                                </h5>
                                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span className="text-cyan-400 font-gaming">{formatPrice(item.game.price)}</span>
                                  <span>× {item.quantity}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.game.id)}
                                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-purple-900/40 space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-300 font-medium">{t.total}:</span>
                            <span className="text-cyan-400 font-bold font-gaming text-lg">
                              {formatPrice(cartTotal)}
                            </span>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              id="mini-cart-checkout-btn"
                              onClick={() => {
                                setIsMiniCartOpen(false);
                                navigateTo('checkout');
                              }}
                              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all font-gaming"
                            >
                              <span>{t.checkoutTitle}</span>
                              {language === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* User Profile / Auth Button */}
              {firebaseUser ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    id="header-user-btn"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[#131525] border border-purple-900/40 hover:border-cyan-400/60 transition-all group"
                  >
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.gamerTag} 
                      className="w-8 h-8 rounded-lg object-cover border border-purple-500/50 group-hover:border-cyan-400 transition-colors"
                    />
                    <div className="text-start hidden xl:block">
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{userProfile.gamerTag}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {userProfile.emailVerified ? (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            {language === 'ar' ? 'موثق' : 'Verified'}
                          </span>
                        ) : (
                          <span className="text-amber-400">{language === 'ar' ? 'غير موثق' : 'Unverified'}</span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className={`absolute top-full mt-2 w-56 bg-[#131525] border border-purple-500/40 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-purple-900/30 backdrop-blur-xl ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                      <div className="p-2.5">
                        <p className="text-xs font-bold text-white truncate">{userProfile.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{userProfile.email}</p>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigateTo('account');
                          }}
                          className="w-full text-start px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-purple-900/30 rounded-xl flex items-center gap-2 transition-colors"
                        >
                          <KeyRound className="w-4 h-4 text-cyan-400" />
                          <span>{language === 'ar' ? 'مفاتيحي المشحونة' : 'My Game Keys'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigateTo('account');
                          }}
                          className="w-full text-start px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-purple-900/30 rounded-xl flex items-center gap-2 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-rose-400" />
                          <span>{language === 'ar' ? 'قائمة المفضلة' : 'Wishlist'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigateTo('merchant');
                          }}
                          className="w-full text-start px-3 py-2 text-xs text-purple-300 hover:text-cyan-400 hover:bg-purple-900/30 rounded-xl flex items-center gap-2 transition-colors"
                        >
                          <Store className="w-4 h-4 text-purple-400" />
                          <span>{language === 'ar' ? 'لوحة تحكم التاجر' : 'Merchant Dashboard'}</span>
                        </button>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-start px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl flex items-center gap-2 transition-colors font-bold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    id="header-login-btn"
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#131525] border border-purple-900/60 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-bold font-gaming transition-all shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                  </button>

                  <button
                    id="header-register-btn"
                    onClick={() => openAuthModal('register')}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 text-xs font-black font-gaming transition-all shadow-md"
                  >
                    <span>{language === 'ar' ? 'حساب جديد' : 'Sign Up'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => navigateTo('checkout')}
              className="relative p-2 rounded-xl bg-purple-950/60 text-cyan-400 border border-purple-900/40"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyan-500 text-black text-[10px] font-black flex items-center justify-center">
                  {cartTotalCount}
                </span>
              )}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-[#131525] border border-purple-900/40 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#121422] text-slate-200 placeholder-slate-500 text-xs rounded-xl py-2 pl-9 pr-9 border border-purple-900/40 focus:border-cyan-400 focus:outline-none"
            />
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0e101c] border-b border-purple-900/40 px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm">
            <button 
              onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
              className={`text-start py-2 px-3 rounded-lg ${currentPage === 'home' ? 'bg-purple-900/40 text-cyan-400 font-bold' : 'text-slate-300'}`}
            >
              {t.navHome}
            </button>
            <button 
              onClick={() => { navigateTo('catalog'); setIsMobileMenuOpen(false); }}
              className={`text-start py-2 px-3 rounded-lg ${currentPage === 'catalog' ? 'bg-purple-900/40 text-cyan-400 font-bold' : 'text-slate-300'}`}
            >
              {t.navCatalog}
            </button>
            <button 
              onClick={() => { navigateTo('merchant'); setIsMobileMenuOpen(false); }}
              className={`text-start py-2 px-3 rounded-lg ${currentPage === 'merchant' ? 'bg-purple-900/40 text-cyan-400 font-bold' : 'text-slate-300'}`}
            >
              {language === 'ar' ? 'لوحة تحكم التاجر' : 'Merchant Dashboard'}
            </button>
            <button 
              onClick={() => { navigateTo('how-it-works'); setIsMobileMenuOpen(false); }}
              className={`text-start py-2 px-3 rounded-lg ${currentPage === 'how-it-works' ? 'bg-purple-900/40 text-cyan-400 font-bold' : 'text-slate-300'}`}
            >
              {t.navHowItWorks}
            </button>
            <button 
              onClick={() => { navigateTo('contact'); setIsMobileMenuOpen(false); }}
              className={`text-start py-2 px-3 rounded-lg ${currentPage === 'contact' ? 'bg-purple-900/40 text-cyan-400 font-bold' : 'text-slate-300'}`}
            >
              {t.navSupport}
            </button>
            <button 
              onClick={() => { navigateTo('account'); setIsMobileMenuOpen(false); }}
              className={`text-start py-2 px-3 rounded-lg ${currentPage === 'account' ? 'bg-purple-900/40 text-cyan-400 font-bold' : 'text-slate-300'}`}
            >
              {t.navAccount}
            </button>
          </nav>

          <div className="pt-3 border-t border-purple-900/40 flex flex-col gap-2">
            {firebaseUser ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 bg-[#181a30] border border-purple-800 text-white rounded-xl text-xs font-bold font-gaming"
                >
                  {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 bg-cyan-400 text-slate-950 rounded-xl text-xs font-black font-gaming"
                >
                  {language === 'ar' ? 'حساب جديد' : 'Sign Up'}
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrency('SAR')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${currency === 'SAR' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
              >
                SAR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${currency === 'USD' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
              >
                USD
              </button>
            </div>

            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 text-xs text-cyan-400 font-bold bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-900/40"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
