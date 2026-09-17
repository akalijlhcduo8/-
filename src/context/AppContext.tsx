import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Game, 
  CartItem, 
  PurchasedKey, 
  UserProfile, 
  Language, 
  Currency, 
  PageView, 
  FilterState, 
  Platform, 
  Genre, 
  Region 
} from '../types';
import { MOCK_GAMES } from '../data/mockGames';
import { translations } from '../translations';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  FirebaseUser
} from '../lib/firebase';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  formatPrice: (amountInUSD: number) => string;
  currentPage: PageView;
  selectedGameId: string | null;
  navigateTo: (page: PageView, gameId?: string) => void;
  cart: CartItem[];
  addToCart: (game: Game, quantity?: number) => void;
  removeFromCart: (gameId: string) => void;
  updateCartQty: (gameId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartTotal: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  discountAmount: number;
  wishlist: string[];
  toggleWishlist: (gameId: string) => void;
  isWishlisted: (gameId: string) => boolean;
  purchasedKeys: PurchasedKey[];
  addPurchasedKeys: (keys: PurchasedKey[]) => Promise<void>;
  toggleKeyStatus: (keyId: string) => Promise<void>;
  userProfile: UserProfile;
  firebaseUser: FirebaseUser | null;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register' | 'forgot';
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, gamerTag: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  t: typeof translations.ar;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language & Direction
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('nexus_lang') as Language) || 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nexus_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Currency
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('nexus_currency') as Currency) || (language === 'ar' ? 'SAR' : 'USD');
  });

  const setCurrency = (cur: Currency) => {
    setCurrencyState(cur);
    localStorage.setItem('nexus_currency', cur);
  };

  const formatPrice = (amountInUSD: number): string => {
    if (currency === 'SAR') {
      const sar = (amountInUSD * 3.75).toFixed(2);
      return language === 'ar' ? `${sar} ر.س` : `${sar} SAR`;
    }
    if (currency === 'AED') {
      const aed = (amountInUSD * 3.67).toFixed(2);
      return language === 'ar' ? `${aed} د.إ` : `${aed} AED`;
    }
    return `$${amountInUSD.toFixed(2)}`;
  };

  // Navigation
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const navigateTo = (page: PageView, gameId?: string) => {
    if (gameId) {
      setSelectedGameId(gameId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    uid: 'guest',
    name: 'زائر المتجر',
    email: '',
    emailVerified: false,
    gamerTag: 'Guest_Gamer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    level: 1,
    rewardPoints: 50,
    walletBalance: 0,
    role: 'user',
  });

  // Purchased Keys (Synced with Firestore)
  const [purchasedKeys, setPurchasedKeys] = useState<PurchasedKey[]>([]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(['cyberpunk-2077', 'black-myth-wukong']);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Load or create Firestore user profile
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserProfile({
              uid: user.uid,
              name: data.name || user.displayName || 'Gamer',
              email: user.email || '',
              emailVerified: user.emailVerified,
              gamerTag: data.gamerTag || user.displayName?.replace(/\s+/g, '_') || 'Pro_Gamer',
              avatar: data.avatar || user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
              level: data.level || 1,
              rewardPoints: data.rewardPoints || 100,
              walletBalance: data.walletBalance || 0,
              role: data.role || (user.email === 'hmama7280@gmail.com' ? 'admin' : 'user'),
            });
            if (data.wishlist && Array.isArray(data.wishlist)) {
              setWishlist(data.wishlist);
            }
          } else {
            // First time user registration in Firestore
            const initialData = {
              name: user.displayName || 'Gamer',
              email: user.email || '',
              gamerTag: (user.displayName || 'Gamer').replace(/\s+/g, '_'),
              avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
              level: 1,
              rewardPoints: 100,
              walletBalance: 0,
              role: user.email === 'hmama7280@gmail.com' ? 'admin' : 'user',
              wishlist: ['cyberpunk-2077', 'black-myth-wukong'],
              createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, initialData);
            setUserProfile({
              uid: user.uid,
              ...initialData,
              emailVerified: user.emailVerified,
            });
          }
        } catch (err) {
          console.error('Error fetching Firestore user profile:', err);
        }

        // Setup real-time listener for user's purchased keys in Firestore
        try {
          const keysQuery = query(
            collection(db, 'purchased_keys'),
            where('userId', '==', user.uid)
          );

          const unsubKeys = onSnapshot(keysQuery, (snapshot) => {
            const keys: PurchasedKey[] = [];
            snapshot.forEach((d) => {
              const data = d.data();
              keys.push({
                id: d.id,
                orderId: data.orderId || 'NX-0000',
                gameId: data.gameId,
                gameTitle: data.gameTitle,
                gameTitleAr: data.gameTitleAr || data.gameTitle,
                gameCover: data.gameCover,
                platform: data.platform,
                activationKey: data.activationKey,
                purchaseDate: data.purchaseDate || new Date().toLocaleString(),
                price: data.price || 0,
                status: data.status || 'Active',
              });
            });
            setPurchasedKeys(keys);
          });

          return () => unsubKeys();
        } catch (err) {
          console.error('Error listening to user purchased keys in Firestore:', err);
        }
      } else {
        // Reset to guest
        setUserProfile({
          uid: 'guest',
          name: language === 'ar' ? 'حساب زائر' : 'Guest Player',
          email: '',
          emailVerified: false,
          gamerTag: 'Guest_User',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          level: 1,
          rewardPoints: 0,
          walletBalance: 0,
          role: 'user',
        });
        setPurchasedKeys([]);
      }
    });

    return () => unsubscribe();
  }, [language]);

  // Auth Functions
  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string, name: string, gamerTag: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      // Send real email verification
      await sendEmailVerification(cred.user);
      
      // Save user record to Firestore
      const userDocRef = doc(db, 'users', cred.user.uid);
      await setDoc(userDocRef, {
        name,
        gamerTag,
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        level: 1,
        rewardPoints: 100,
        walletBalance: 0,
        role: 'user',
        wishlist: [],
        createdAt: serverTimestamp(),
      });
    }
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
    addToast(
      language === 'ar' ? 'تم تسجيل الخروج' : 'Logged Out',
      language === 'ar' ? 'إلى اللقاء قريباً' : 'See you next time',
      'info'
    );
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      addToast(
        language === 'ar' ? 'تم إرسال إيميل التحقق' : 'Verification Sent',
        language === 'ar' ? 'يرجى مراجعة بريدك الوارد' : 'Check your inbox for the verification link',
        'info'
      );
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
  }, [cart]);

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const addToCart = (game: Game, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.game.id === game.id);
      if (existing) {
        return prev.map((item) =>
          item.game.id === game.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { game, quantity }];
    });
    addToast(
      language === 'ar' ? 'أضيف إلى السلة' : 'Added to Cart',
      language === 'ar' ? `تم إضافة "${game.titleAr}" إلى سلة مشترياتك` : `Added "${game.title}" to cart`,
      'success'
    );
  };

  const removeFromCart = (gameId: string) => {
    setCart((prev) => prev.filter((item) => item.game.id !== gameId));
  };

  const updateCartQty = (gameId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(gameId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.game.id === gameId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.game.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? cartSubtotal * 0.1 : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const applyCoupon = (code: string): boolean => {
    if (code.trim().toUpperCase() === 'NEXUS10') {
      setAppliedCoupon('NEXUS10');
      addToast(
        language === 'ar' ? 'تم تطبيق الخصم!' : 'Coupon Applied!',
        language === 'ar' ? 'حصلت على خصم 10% على طلبك' : '10% discount applied to your order',
        'success'
      );
      return true;
    }
    addToast(
      language === 'ar' ? 'كود غير صالح' : 'Invalid Code',
      language === 'ar' ? 'يرجى تجربة الكود: NEXUS10' : 'Try code: NEXUS10',
      'warning'
    );
    return false;
  };

  const toggleWishlist = async (gameId: string) => {
    const exists = wishlist.includes(gameId);
    const updated = exists ? wishlist.filter((id) => id !== gameId) : [...wishlist, gameId];
    setWishlist(updated);

    // Save to Firestore if user logged in
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          wishlist: updated,
        });
      } catch (err) {
        console.error('Error updating wishlist in Firestore', err);
      }
    }

    const game = MOCK_GAMES.find((g) => g.id === gameId);
    const name = game ? (language === 'ar' ? game.titleAr : game.title) : '';
    if (exists) {
      addToast(language === 'ar' ? 'أزيلت من المفضلة' : 'Removed from Wishlist', name, 'info');
    } else {
      addToast(language === 'ar' ? 'أضيفت للمفضلة' : 'Saved to Wishlist', name, 'success');
    }
  };

  const isWishlisted = (gameId: string) => wishlist.includes(gameId);

  // Add Purchased Keys to Firestore
  const addPurchasedKeys = async (newKeys: PurchasedKey[]) => {
    const currentUid = auth.currentUser?.uid || 'guest';
    const currentEmail = auth.currentUser?.email || userProfile.email || 'guest@nexuskeys.store';

    // Optimistic UI update
    setPurchasedKeys((prev) => [...newKeys, ...prev]);

    // Persist each key securely to Firestore
    if (auth.currentUser) {
      try {
        for (const k of newKeys) {
          await addDoc(collection(db, 'purchased_keys'), {
            userId: currentUid,
            userEmail: currentEmail,
            orderId: k.orderId,
            gameId: k.gameId,
            gameTitle: k.gameTitle,
            gameTitleAr: k.gameTitleAr,
            gameCover: k.gameCover,
            platform: k.platform,
            activationKey: k.activationKey,
            price: k.price,
            purchaseDate: k.purchaseDate,
            status: k.status,
            createdAt: serverTimestamp(),
          });
        }
      } catch (err) {
        console.error('Error saving keys to Firestore:', err);
      }
    }
  };

  // Toggle Key status (Active <-> Redeemed) in Firestore
  const toggleKeyStatus = async (keyId: string) => {
    const target = purchasedKeys.find((k) => k.id === keyId);
    if (!target) return;

    const newStatus = target.status === 'Active' ? 'Redeemed' : 'Active';

    setPurchasedKeys((prev) =>
      prev.map((k) => (k.id === keyId ? { ...k, status: newStatus } : k))
    );

    if (auth.currentUser) {
      try {
        const keyRef = doc(db, 'purchased_keys', keyId);
        await updateDoc(keyRef, { status: newStatus });
      } catch (err) {
        console.error('Error updating key status in Firestore:', err);
      }
    }
  };

  // Filters
  const defaultFilters: FilterState = {
    search: '',
    platforms: [],
    genres: [],
    regions: [],
    maxPrice: 100,
    sortBy: 'featured',
    onlyDiscounted: false,
    inStockOnly: false,
  };

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const resetFilters = () => setFilters(defaultFilters);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        formatPrice,
        currentPage,
        selectedGameId,
        navigateTo,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        discountAmount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        purchasedKeys,
        addPurchasedKeys,
        toggleKeyStatus,
        userProfile,
        firebaseUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        sendVerificationEmail,
        resetPassword,
        t,
        filters,
        setFilters,
        resetFilters,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
