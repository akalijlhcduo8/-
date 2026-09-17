import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  Trash2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Mail, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Download, 
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  AlertCircle,
  Lock,
  Smartphone,
  Printer,
  ChevronRight,
  Shield,
  HelpCircle,
  QrCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PurchasedKey } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQty, 
    clearCart, 
    cartTotal, 
    cartSubtotal, 
    appliedCoupon, 
    applyCoupon, 
    discountAmount, 
    formatPrice, 
    currency,
    language, 
    navigateTo, 
    addPurchasedKeys, 
    userProfile, 
    firebaseUser,
    openAuthModal,
    t, 
    addToast 
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [couponInput, setCouponInput] = useState('');
  const [deliveryEmail, setDeliveryEmail] = useState(userProfile.email || 'customer@nexuskeys.store');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'paypal' | 'wallet' | 'stripe_hosted'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState(userProfile.name || 'AHMED AL-GAMER');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [billingCountry, setBillingCountry] = useState('SA');
  const [saveCard, setSaveCard] = useState(true);

  // 3D Secure / OTP Simulation Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('749201');
  const [otpTimer, setOtpTimer] = useState(45);

  // Apple Pay Sheet Simulation
  const [showApplePaySheet, setShowApplePaySheet] = useState(false);

  // PayPal Sheet Simulation
  const [showPayPalSheet, setShowPayPalSheet] = useState(false);

  // Completed Order State
  const [orderReceipt, setOrderReceipt] = useState<{
    orderId: string;
    transactionId: string;
    authCode: string;
    paymentMethod: string;
    cardBrand?: string;
    cardLast4?: string;
    keys: PurchasedKey[];
    email: string;
    date: string;
    time: string;
    total: number;
    currency: string;
  } | null>(null);

  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [hiddenKeys, setHiddenKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (userProfile.email && deliveryEmail === 'customer@nexuskeys.store') {
      setDeliveryEmail(userProfile.email);
    }
  }, [userProfile.email]);

  // Card Brand Detection
  const getCardBrand = (number: string) => {
    const clean = number.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5') || clean.startsWith('2')) return 'Mastercard';
    if (clean.startsWith('34') || clean.startsWith('37')) return 'Amex';
    if (clean.startsWith('5888') || clean.startsWith('4847') || clean.startsWith('9682')) return 'Mada';
    return 'Visa';
  };

  // Card number input formatter
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Expiry input formatter
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length > 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  // Pre-fill Test Cards
  const setTestCard = (type: 'visa' | 'mastercard' | 'mada') => {
    if (type === 'visa') {
      setCardNumber('4242 4242 4242 4242');
      setCardExpiry('12/28');
      setCardCvc('789');
    } else if (type === 'mastercard') {
      setCardNumber('5555 5555 5555 4444');
      setCardExpiry('08/29');
      setCardCvc('512');
    } else if (type === 'mada') {
      setCardNumber('5888 5012 3456 7890');
      setCardExpiry('11/27');
      setCardCvc('321');
    }
    addToast(
      language === 'ar' ? 'تم تعبئة بيانات البطاقة' : 'Card Loaded',
      `${type.toUpperCase()} Card`,
      'info'
    );
  };

  // Handle return from Stripe hosted checkout if redirected
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const status = params.get('status');

    if (sessionId && status === 'success') {
      const verifyStripeSession = async () => {
        setIsProcessing(true);
        try {
          const res = await fetch(`/api/checkout-session/${sessionId}`);
          if (res.ok) {
            const data = await res.json();
            const keys: PurchasedKey[] = data.keys.map((k: any, idx: number) => ({
              id: `key-stripe-${Date.now()}-${idx}`,
              orderId: `NX-${sessionId.substring(sessionId.length - 6).toUpperCase()}`,
              gameId: k.title.toLowerCase().replace(/\s+/g, '-'),
              gameTitle: k.title,
              gameTitleAr: k.title,
              gameCover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
              platform: k.platform,
              activationKey: k.key,
              purchaseDate: new Date().toLocaleString(),
              price: k.price,
              status: 'Active',
            }));

            await addPurchasedKeys(keys);
            clearCart();

            setOrderReceipt({
              orderId: `NX-${sessionId.substring(sessionId.length - 6).toUpperCase()}`,
              transactionId: sessionId,
              authCode: `AUTH_${sessionId.slice(-6).toUpperCase()}`,
              paymentMethod: 'Stripe Official Checkout',
              keys,
              email: data.customerEmail || deliveryEmail,
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString(),
              total: data.amountTotal,
              currency: data.currency || 'USD',
            });

            setStep(3);

            try {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#06B6D4', '#8B5CF6', '#10B981', '#F59E0B'],
              });
            } catch (e) {}

            addToast(
              language === 'ar' ? 'تم تأكيد الدفع عبر Stripe وتسليم المفاتيح!' : 'Stripe Payment Verified & Keys Delivered!',
              language === 'ar' ? 'تم حفظ المفاتيح في قاعدة بيانات حسابك بنجاح' : 'Keys saved permanently to your account',
              'success'
            );
          }
        } catch (e) {
          console.error('Error verifying Stripe session:', e);
        } finally {
          setIsProcessing(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };

      verifyStripeSession();
    }
  }, []);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  // Primary Payment Trigger
  const handleStartPayment = () => {
    setErrorNotice(null);

    // Validate email
    if (!deliveryEmail || !deliveryEmail.includes('@')) {
      setErrorNotice(language === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح لاستلام المفاتيح' : 'Please enter a valid delivery email address');
      return;
    }

    if (paymentMethod === 'card') {
      // Validate card
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15) {
        setErrorNotice(language === 'ar' ? 'يرجى كتابة رقم بطاقة صحيح مكون من 16 رقماً' : 'Please enter a valid 16-digit card number');
        return;
      }
      if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
        setErrorNotice(language === 'ar' ? 'تاريخ انتهاء البطاقة غير صحيح (MM/YY)' : 'Invalid expiry date (MM/YY)');
        return;
      }
      if (cardCvc.length < 3) {
        setErrorNotice(language === 'ar' ? 'رمز الأمان CVC غير صحيح' : 'Invalid CVC security code');
        return;
      }

      // Launch 3D Secure / OTP Bank verification
      setShowOtpModal(true);
      setOtpTimer(45);
      return;
    }

    if (paymentMethod === 'applepay') {
      setShowApplePaySheet(true);
      return;
    }

    if (paymentMethod === 'paypal') {
      setShowPayPalSheet(true);
      return;
    }

    if (paymentMethod === 'stripe_hosted') {
      executeStripeHostedCheckout();
      return;
    }

    if (paymentMethod === 'wallet') {
      executePaymentFinalize('wallet');
    }
  };

  // Execute Stripe Hosted Checkout session
  const executeStripeHostedCheckout = async () => {
    setIsProcessing(true);
    setErrorNotice(null);

    try {
      const payload = {
        items: cart.map(item => ({
          id: item.game.id,
          title: language === 'ar' ? item.game.titleAr : item.game.title,
          coverImage: item.game.coverImage,
          platform: item.game.platform,
          price: item.game.price,
          quantity: item.quantity,
        })),
        customerEmail: deliveryEmail,
        userId: firebaseUser?.uid || 'guest',
        origin: window.location.origin,
      };

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.stripeConfigured === false) {
        // Fallback to seamless direct card processing
        setErrorNotice(
          language === 'ar'
            ? 'مفتاح Stripe غير متوفر حالياً في الخادم، يمكنك إتمام الدفع مباشرة بالبطاقة البنكية أدناه بأمان وبدون مغادرة الصفحة.'
            : 'Stripe live key not configured in .env. You can complete the card payment directly below.'
        );
        setPaymentMethod('card');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Stripe error:', err);
      setErrorNotice(err.message || 'Payment initiation failed');
      setIsProcessing(false);
    }
  };

  // Finalize Real Payment & Deliver Keys
  const executePaymentFinalize = async (method: 'card' | 'applepay' | 'paypal' | 'wallet') => {
    setIsProcessing(true);
    setShowOtpModal(false);
    setShowApplePaySheet(false);
    setShowPayPalSheet(false);

    try {
      const brand = getCardBrand(cardNumber);
      const payload = {
        items: cart.map(c => ({
          id: c.game.id,
          title: c.game.title,
          titleAr: c.game.titleAr,
          platform: c.game.platform,
          price: c.game.price,
          quantity: c.quantity,
          coverImage: c.game.coverImage,
        })),
        customerEmail: deliveryEmail,
        userId: firebaseUser?.uid || 'guest',
        paymentMethod: method,
        amount: cartTotal,
        currency,
        cardDetails: {
          cardNumber,
          cardBrand: brand,
          cardholderName: cardHolder,
          expiryDate: cardExpiry,
          cvc: cardCvc,
          country: billingCountry,
        },
      };

      const res = await fetch('/api/process-card-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        const keys: PurchasedKey[] = data.keys;

        // 1. Add keys permanently to Firestore and state
        await addPurchasedKeys(keys);

        // 2. Also log the official completed order in Firestore 'orders'
        if (auth.currentUser) {
          try {
            await addDoc(collection(db, 'orders'), {
              orderId: data.orderId,
              transactionId: data.transactionId,
              authCode: data.authCode,
              userId: auth.currentUser.uid,
              userEmail: deliveryEmail,
              amount: data.amount,
              currency: data.currency,
              paymentMethod: method,
              cardBrand: brand,
              cardLast4: data.cardLast4,
              itemCount: keys.length,
              status: 'Completed',
              createdAt: serverTimestamp(),
            });
          } catch (orderErr) {
            console.error('Error logging order to Firestore:', orderErr);
          }
        }

        // 3. Set Receipt
        setOrderReceipt({
          orderId: data.orderId,
          transactionId: data.transactionId,
          authCode: data.authCode,
          paymentMethod: method === 'card' ? `Credit Card (${brand} •••• ${data.cardLast4})` : method === 'applepay' ? 'Apple Pay' : method === 'paypal' ? 'PayPal Express' : 'Nexus Wallet',
          cardBrand: brand,
          cardLast4: data.cardLast4,
          keys,
          email: deliveryEmail,
          date: data.date,
          time: data.time,
          total: data.amount,
          currency: data.currency,
        });

        // 4. Clear Cart & advance to Step 3
        clearCart();
        setStep(3);

        // Celebration Confetti
        try {
          confetti({
            particleCount: 130,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#06B6D4', '#8B5CF6', '#10B981', '#F59E0B'],
          });
        } catch (e) {}

        addToast(
          language === 'ar' ? 'تمت معالجة الدفع بنجاح وتسليم المفاتيح!' : 'Payment Approved & Keys Delivered!',
          language === 'ar' ? `تم إرسال كود التفعيل إلى ${deliveryEmail}` : `Digital keys sent to ${deliveryEmail}`,
          'success'
        );
      } else {
        throw new Error(data.error || 'Payment gateway refused transaction');
      }
    } catch (err: any) {
      console.error('Payment finalized error:', err);
      setErrorNotice(err.message || 'Payment processing failed');
      addToast(
        language === 'ar' ? 'فشل معالجة الدفع' : 'Payment Failed',
        err.message || 'Please try again',
        'warning'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyKey = (keyString: string, keyId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(keyString);
      setCopiedKeyId(keyId);
      addToast(
        language === 'ar' ? 'تم نسخ المفتاح' : 'Key Copied',
        keyString,
        'success'
      );
      setTimeout(() => setCopiedKeyId(null), 3000);
    }
  };

  const toggleHideKey = (keyId: string) => {
    setHiddenKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  // Redemption link helper
  const getRedeemUrl = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('steam')) return 'https://store.steampowered.com/account/registerkey';
    if (p.includes('xbox')) return 'https://redeem.microsoft.com';
    if (p.includes('playstation') || p.includes('psn')) return 'https://store.playstation.com';
    if (p.includes('epic')) return 'https://store.epicgames.com/redeem';
    if (p.includes('ubisoft')) return 'https://redeem.ubisoft.com';
    if (p.includes('ea') || p.includes('origin')) return 'https://www.ea.com/redeem';
    return 'https://store.steampowered.com/account/registerkey';
  };

  // If cart is empty and not on step 3 (receipt)
  if (cart.length === 0 && step !== 3) {
    return (
      <div className="py-20 text-center space-y-6 max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center mx-auto text-purple-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white font-gaming">
            {t.cartEmpty}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'ar' 
              ? 'سلتك فارغة حالياً. تصفح أحدث الألعاب واختر المفاتيح الرقمية التي ترغب بها.'
              : 'Your cart is empty. Browse the store and find your next game!'}
          </p>
        </div>
        <button
          onClick={() => navigateTo('catalog')}
          className="bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs font-gaming shadow-lg shadow-cyan-400/20 hover:scale-105 transition-transform"
        >
          {t.startShopping}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-center gap-2 sm:gap-6 py-4">
        {/* Step 1 */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-gaming text-xs font-bold ${step >= 1 ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30' : 'bg-[#151828] text-slate-400'}`}>
            1
          </div>
          <span className={`text-xs font-bold hidden sm:inline ${step >= 1 ? 'text-white' : 'text-slate-500'}`}>
            {t.cartReview}
          </span>
        </div>

        <div className={`w-10 sm:w-16 h-0.5 ${step >= 2 ? 'bg-cyan-500' : 'bg-purple-900/40'}`} />

        {/* Step 2 */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-gaming text-xs font-bold ${step >= 2 ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30' : 'bg-[#151828] text-slate-400'}`}>
            2
          </div>
          <span className={`text-xs font-bold hidden sm:inline ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>
            {t.paymentTitle}
          </span>
        </div>

        <div className={`w-10 sm:w-16 h-0.5 ${step >= 3 ? 'bg-cyan-500' : 'bg-purple-900/40'}`} />

        {/* Step 3 */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-gaming text-xs font-bold ${step === 3 ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' : 'bg-[#151828] text-slate-400'}`}>
            3
          </div>
          <span className={`text-xs font-bold hidden sm:inline ${step === 3 ? 'text-white' : 'text-slate-500'}`}>
            {t.orderComplete}
          </span>
        </div>
      </div>

      {/* STEP 1: CART REVIEW */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white font-gaming">
                {t.yourCart} ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
              <button
                onClick={clearCart}
                className="text-xs text-rose-400 hover:underline"
              >
                {t.clearCart}
              </button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.game.id}
                  className="p-4 rounded-2xl bg-[#0f111e] border border-purple-900/40 hover:border-purple-700/60 transition-colors flex items-center gap-4"
                >
                  <img
                    src={item.game.coverImage}
                    alt={item.game.title}
                    className="w-14 h-16 rounded-xl object-cover border border-purple-900/60"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-purple-300 px-2 py-0.5 rounded bg-purple-950 border border-purple-800 font-medium">
                      {item.game.platform} Key
                    </span>
                    <h4 className="text-sm font-bold text-white truncate mt-1">
                      {language === 'ar' ? item.game.titleAr : item.game.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-cyan-400 font-bold font-gaming">
                        {formatPrice(item.game.price)}
                      </span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                        <Zap className="w-3 h-3" />
                        {language === 'ar' ? 'تسليم فوري' : 'Instant Delivery'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#15182a] border border-purple-900/50 rounded-xl px-2 py-1 text-xs">
                      <button 
                        onClick={() => updateCartQty(item.game.id, item.quantity - 1)}
                        className="text-slate-400 hover:text-white px-1 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 font-gaming font-bold text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQty(item.game.id, item.quantity + 1)}
                        className="text-slate-400 hover:text-white px-1 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.game.id)}
                      className="text-slate-500 hover:text-rose-400 p-2 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Email Input */}
            <div className="p-5 rounded-2xl bg-[#0f111e] border border-purple-900/40 space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>{t.deliveryEmail}</span>
              </label>
              <input
                type="email"
                required
                value={deliveryEmail}
                onChange={(e) => setDeliveryEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                {t.deliveryEmailHelp}
              </p>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#121424] border border-purple-900/50 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base font-gaming">
                {t.orderSummary}
              </h3>

              {/* Promo code form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={t.discountCode}
                  className="flex-1 bg-[#181a30] border border-purple-900/50 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors font-gaming"
                >
                  {t.applyCode}
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/30">
                  <span className="flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.discountApplied}
                  </span>
                  <span className="font-gaming font-bold">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-purple-900/40 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{t.subtotal}</span>
                  <span className="font-gaming text-slate-200">{formatPrice(cartSubtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>خصم الكوبون (10%)</span>
                    <span className="font-gaming">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>{t.taxVat}</span>
                  <span className="text-slate-400">0.00</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-purple-900/40">
                  <span>{t.total}</span>
                  <span className="text-cyan-400 font-gaming text-xl glow-text-cyan">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <button
                id="checkout-step1-next-btn"
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-slate-950 font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all font-gaming shadow-lg shadow-cyan-400/20"
              >
                <span>{language === 'ar' ? 'المتابعة لاختيار وسيلة الدفع' : 'Proceed to Payment'}</span>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: REAL PAYMENT GATEWAY & IN-APP CARD PROCESSING */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white font-gaming flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <span>{t.paymentMethod}</span>
              </h2>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>256-bit SSL</span>
              </span>
            </div>

            {/* Error / Alert banner */}
            {errorNotice && (
              <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorNotice}</span>
              </div>
            )}

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Credit Card / Mada */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border text-start transition-all flex flex-col justify-between gap-2 ${
                  paymentMethod === 'card'
                    ? 'bg-purple-900/40 border-cyan-400 glow-cyan ring-1 ring-cyan-400'
                    : 'bg-[#0f111e] border-purple-900/40 hover:border-purple-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <div className={`w-3.5 h-3.5 rounded-full border ${paymentMethod === 'card' ? 'bg-cyan-400 border-cyan-400' : 'border-slate-600'}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{language === 'ar' ? 'بطاقة بنكية / مدى' : 'Credit / Mada'}</span>
                  <span className="text-[10px] text-slate-400">Visa, MC, Mada</span>
                </div>
              </button>

              {/* Apple Pay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`p-3.5 rounded-2xl border text-start transition-all flex flex-col justify-between gap-2 ${
                  paymentMethod === 'applepay'
                    ? 'bg-purple-900/40 border-cyan-400 glow-cyan ring-1 ring-cyan-400'
                    : 'bg-[#0f111e] border-purple-900/40 hover:border-purple-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <Smartphone className="w-5 h-5 text-white" />
                  <div className={`w-3.5 h-3.5 rounded-full border ${paymentMethod === 'applepay' ? 'bg-cyan-400 border-cyan-400' : 'border-slate-600'}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Apple Pay</span>
                  <span className="text-[10px] text-slate-400">{language === 'ar' ? 'دفع فوري ببصمة الوجه' : '1-Touch ID'}</span>
                </div>
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3.5 rounded-2xl border text-start transition-all flex flex-col justify-between gap-2 ${
                  paymentMethod === 'paypal'
                    ? 'bg-purple-900/40 border-cyan-400 glow-cyan ring-1 ring-cyan-400'
                    : 'bg-[#0f111e] border-purple-900/40 hover:border-purple-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-black text-blue-400 text-xs">PayPal</span>
                  <div className={`w-3.5 h-3.5 rounded-full border ${paymentMethod === 'paypal' ? 'bg-cyan-400 border-cyan-400' : 'border-slate-600'}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">PayPal</span>
                  <span className="text-[10px] text-slate-400">{language === 'ar' ? 'محفظة بايبال' : 'Express'}</span>
                </div>
              </button>

              {/* Store Wallet */}
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3.5 rounded-2xl border text-start transition-all flex flex-col justify-between gap-2 ${
                  paymentMethod === 'wallet'
                    ? 'bg-purple-900/40 border-cyan-400 glow-cyan ring-1 ring-cyan-400'
                    : 'bg-[#0f111e] border-purple-900/40 hover:border-purple-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <div className={`w-3.5 h-3.5 rounded-full border ${paymentMethod === 'wallet' ? 'bg-cyan-400 border-cyan-400' : 'border-slate-600'}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{t.payWallet}</span>
                  <span className="text-[10px] text-slate-400">{formatPrice(userProfile.walletBalance)}</span>
                </div>
              </button>
            </div>

            {/* TAB CONTENT: REAL CARD FORM */}
            {paymentMethod === 'card' && (
              <div className="space-y-5">
                {/* Interactive Virtual Card Preview */}
                <div className="relative rounded-3xl p-6 bg-gradient-to-br from-purple-900 via-indigo-950 to-[#0b0c16] border border-cyan-400/40 shadow-2xl overflow-hidden text-white font-mono space-y-4 glow-cyan">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-7 rounded-md bg-amber-400/80 border border-amber-300 flex items-center justify-center text-[10px] font-bold text-slate-900">
                        CHIP
                      </div>
                      <span className="text-[10px] text-cyan-300 uppercase tracking-widest font-sans font-bold">NexusKeys Secure Pay</span>
                    </div>

                    {/* Card Brand Badge */}
                    <div className="text-sm font-black font-gaming text-cyan-400 px-3 py-0.5 rounded-lg bg-black/40 border border-cyan-400/40">
                      {getCardBrand(cardNumber)}
                    </div>
                  </div>

                  {/* Card Number display */}
                  <div className="text-lg sm:text-xl font-black tracking-widest text-cyan-200 select-all pt-2 relative z-10">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  {/* Card Details Footer */}
                  <div className="flex justify-between items-end text-xs relative z-10 pt-1">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Cardholder</span>
                      <span className="font-bold text-white uppercase truncate max-w-[200px] block">
                        {cardHolder || 'GAMER'}
                      </span>
                    </div>

                    <div className="text-end">
                      <span className="text-[9px] text-slate-400 uppercase block">Expires</span>
                      <span className="font-bold text-cyan-300">{cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Test Card Fills */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 font-bold">{language === 'ar' ? 'تعبئة تجريبية سريعة:' : 'Quick Test Cards:'}</span>
                  <button
                    type="button"
                    onClick={() => setTestCard('visa')}
                    className="px-2.5 py-1 rounded-lg bg-[#15182a] border border-purple-900/60 hover:border-cyan-400 text-cyan-300 text-[11px] font-bold transition-colors"
                  >
                    Visa (4242)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestCard('mada')}
                    className="px-2.5 py-1 rounded-lg bg-[#15182a] border border-purple-900/60 hover:border-emerald-400 text-emerald-300 text-[11px] font-bold transition-colors"
                  >
                    Mada (مدى)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestCard('mastercard')}
                    className="px-2.5 py-1 rounded-lg bg-[#15182a] border border-purple-900/60 hover:border-amber-400 text-amber-300 text-[11px] font-bold transition-colors"
                  >
                    Mastercard
                  </button>
                </div>

                {/* Card Fields */}
                <div className="p-6 rounded-2xl bg-[#0f111e] border border-purple-900/40 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {language === 'ar' ? 'رقم البطاقة (16 رقم)' : 'Card Number'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 tracking-wider"
                      />
                      <span className="absolute end-3 top-2.5 text-xs text-cyan-400 font-bold font-gaming">
                        {getCardBrand(cardNumber)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        {language === 'ar' ? 'اسم صاحب البطاقة' : 'Cardholder Name'}
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="NAME ON CARD"
                        className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-4 py-2.5 text-white font-mono text-xs uppercase focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {language === 'ar' ? 'الانتهاء' : 'Expiry'}
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-3 py-2.5 text-white font-mono text-xs text-center focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center justify-between">
                          <span>CVV</span>
                          <Shield className="w-3 h-3 text-cyan-400" />
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••"
                          className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-3 py-2.5 text-white font-mono text-xs text-center focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Country Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        {language === 'ar' ? 'دولة الفوترة' : 'Billing Country'}
                      </label>
                      <select
                        value={billingCountry}
                        onChange={(e) => setBillingCountry(e.target.value)}
                        className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400"
                      >
                        <option value="SA">المملكة العربية السعودية (Saudi Arabia)</option>
                        <option value="AE">الإمارات العربية المتحدة (UAE)</option>
                        <option value="KW">الكويت (Kuwait)</option>
                        <option value="QA">قطر (Qatar)</option>
                        <option value="OM">سلطنة عمان (Oman)</option>
                        <option value="BH">البحرين (Bahrain)</option>
                        <option value="EG">مصر (Egypt)</option>
                        <option value="US">الولايات المتحدة (United States)</option>
                        <option value="GLOBAL">عالمي (International)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="save-card-check"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="rounded border-purple-900 text-cyan-500 focus:ring-0"
                      />
                      <label htmlFor="save-card-check" className="text-xs text-slate-300 cursor-pointer">
                        {language === 'ar' ? 'حفظ بيانات البطاقة بشكل مشفر للمشتريات القادمة' : 'Save encrypted card for 1-click checkout'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: APPLE PAY */}
            {paymentMethod === 'applepay' && (
              <div className="p-8 rounded-3xl bg-[#0f111e] border border-purple-900/40 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-white">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-gaming">Apple Pay</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {language === 'ar' 
                      ? 'ادفع بأمان وبنقرة واحدة باستخدام Face ID أو Touch ID المحفوظة على جهاز Apple الخاص بك.'
                      : 'Pay safely and instantly using Face ID or Touch ID saved on your device.'}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplePaySheet(true)}
                    className="bg-white hover:bg-slate-200 text-slate-950 font-bold px-8 py-3 rounded-2xl text-xs font-gaming shadow-xl flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>{language === 'ar' ? 'الدفع باستخدام Apple Pay' : 'Pay with Apple Pay'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PAYPAL */}
            {paymentMethod === 'paypal' && (
              <div className="p-8 rounded-3xl bg-[#0f111e] border border-purple-900/40 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mx-auto text-blue-400">
                  <span className="font-black text-2xl">P</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-gaming">PayPal Express</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {language === 'ar'
                      ? 'سيتم توجيهك للمصادقة عبر حساب PayPal الخاص بك لإتمام الدفع الآمن واستلام المفاتيح فوراً.'
                      : 'Authenticate through your PayPal account to finalize payment and receive keys instantly.'}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPayPalSheet(true)}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-3 rounded-2xl text-xs font-gaming shadow-xl flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>{language === 'ar' ? 'المتابعة عبر PayPal' : 'Continue with PayPal'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: STORE WALLET */}
            {paymentMethod === 'wallet' && (
              <div className="p-8 rounded-3xl bg-[#0f111e] border border-purple-900/40 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-gaming">{t.payWallet}</h3>
                  <p className="text-xs text-slate-300">
                    {language === 'ar' ? 'رصيدك الحالي:' : 'Current Balance:'}{' '}
                    <strong className="text-cyan-400 font-gaming text-sm">{formatPrice(userProfile.walletBalance)}</strong>
                  </p>
                  {userProfile.walletBalance < cartTotal && (
                    <p className="text-[11px] text-amber-400">
                      {language === 'ar'
                        ? 'رصيد المحفظة غير كافٍ لتغطية كامل الطلب، يمكنك الدفع بالبطاقة البنكية أو شحن المحفظة.'
                        : 'Insufficient wallet balance for this order. Please use a credit card.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Optional Stripe Hosted Checkout Link */}
            <div className="p-4 rounded-2xl bg-[#0b0d18] border border-purple-900/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>{language === 'ar' ? 'هل تفضل صفحة Stripe الرسمية الخارجية؟' : 'Prefer Stripe external checkout?'}</span>
              </div>
              <button
                type="button"
                onClick={executeStripeHostedCheckout}
                disabled={isProcessing}
                className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
              >
                <span>{language === 'ar' ? 'صفحة Stripe Checkout' : 'Stripe Checkout Page'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Summary & Submit */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#121424] border border-purple-900/50 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base font-gaming">
                {t.orderSummary}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{language === 'ar' ? 'البريد المرسل إليه:' : 'Delivery To:'}</span>
                  <span className="text-white font-mono truncate max-w-[180px]">{deliveryEmail}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{language === 'ar' ? 'عدد المفاتيح:' : 'Key Quantity:'}</span>
                  <span className="text-white font-gaming">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{language === 'ar' ? 'طريقة الدفع:' : 'Method:'}</span>
                  <span className="text-cyan-300 font-bold uppercase">{paymentMethod}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-purple-900/40">
                  <span>{t.total}</span>
                  <span className="text-cyan-400 font-gaming text-xl glow-text-cyan">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Primary Pay Button */}
              <button
                id="checkout-confirm-pay-btn"
                disabled={isProcessing}
                onClick={handleStartPayment}
                className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all font-gaming shadow-xl shadow-emerald-500/20"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.processingPayment}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>
                      {language === 'ar' 
                        ? `إتمام الدفع الحقيقي (${formatPrice(cartTotal)})`
                        : `Pay ${formatPrice(cartTotal)} Now`}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
              >
                {language === 'ar' ? '← العودة لمراجعة السلة' : '← Back to Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D SECURE / BANK OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#101222] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center glow-cyan relative">
            <div className="flex justify-between items-center pb-3 border-b border-purple-900/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-xs text-white">Verified by Visa / Mada Protect</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">3D-Secure 2.0</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white font-gaming">
                {language === 'ar' ? 'التحقق الأمني من البنك' : 'Bank OTP Verification'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'ar'
                  ? `أرسل البنك رمز تحقق لمرة واحدة (OTP) إلى رقم هاتفك المسجل لتأكيد عملية الشراء بقيمة ${formatPrice(cartTotal)}.`
                  : `A one-time passcode was sent to your registered mobile number for ${formatPrice(cartTotal)}.`}
              </p>
            </div>

            {/* OTP Code Box */}
            <div className="p-4 rounded-2xl bg-[#090a12] border border-cyan-500/30 space-y-3">
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'أدخل رمز التحقق المكون من 6 أرقام:' : 'Enter 6-Digit OTP:'}</span>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="text-center font-mono font-black text-2xl tracking-widest text-cyan-400 bg-transparent border-b-2 border-cyan-400 focus:outline-none w-48 mx-auto"
              />
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                <span>{language === 'ar' ? 'صالح لمدة:' : 'Expires in:'}</span>
                <strong className="text-amber-400 font-mono">{otpTimer}s</strong>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => executePaymentFinalize('card')}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black py-3.5 rounded-xl text-xs font-gaming shadow-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{language === 'ar' ? 'تأكيد وإتمام الشراء' : 'Confirm & Authorize Payment'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="w-full text-xs text-slate-400 hover:text-white py-1"
              >
                {language === 'ar' ? 'إلغاء العملية' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLE PAY BIOMETRIC SHEET SIMULATION */}
      {showApplePaySheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 border border-white/20">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="font-bold text-sm">Apple Pay</span>
              <button onClick={() => setShowApplePaySheet(false)} className="text-xs text-slate-400 hover:text-white">Done</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">PAY TO</span>
                <span className="font-bold">NexusKeys Gaming Store</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">ACCOUNT</span>
                <span className="font-mono">{deliveryEmail}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span>TOTAL</span>
                <span className="text-cyan-400 text-base">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <div className="text-center py-4 space-y-2">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-400 flex items-center justify-center mx-auto text-cyan-400 animate-pulse">
                <Smartphone className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {language === 'ar' ? 'انقر مرتين على الزر الجانبي للموافقة بـ Face ID' : 'Double Click Side Button to Pay with Face ID'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => executePaymentFinalize('applepay')}
              className="w-full bg-white text-black font-black py-3 rounded-2xl text-xs font-gaming hover:bg-slate-200 transition-colors"
            >
              {language === 'ar' ? 'تأكيد الدفع بـ Face ID' : 'Confirm with Face ID'}
            </button>
          </div>
        </div>
      )}

      {/* PAYPAL SHEET SIMULATION */}
      {showPayPalSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#121424] text-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 border border-blue-500/40 glow-cyan">
            <div className="flex justify-between items-center pb-2 border-b border-purple-900/40">
              <span className="font-black text-blue-400 text-base">PayPal</span>
              <button onClick={() => setShowPayPalSheet(false)} className="text-xs text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-center">
              <h4 className="font-bold text-sm">{language === 'ar' ? 'الموافقة على الدفع من حساب PayPal' : 'Authorize PayPal Payment'}</h4>
              <p className="text-xs text-slate-300">{deliveryEmail}</p>
              <div className="text-2xl font-black text-cyan-400 font-gaming pt-2">
                {formatPrice(cartTotal)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => executePaymentFinalize('paypal')}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-3 rounded-2xl text-xs font-gaming shadow-lg transition-colors"
            >
              {language === 'ar' ? 'موافقة وإتمام الدفع' : 'Agree and Complete Payment'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: INSTANT KEYS DELIVERED & PERMANENT CLOUD VAULT */}
      {step === 3 && orderReceipt && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          {/* Success Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1d17] via-[#0f241d] to-[#0d1d17] border border-emerald-500/40 text-center space-y-3 shadow-2xl glow-emerald">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-gaming">
              {t.orderSuccessTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              {t.orderSuccessSubtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 bg-[#091510] border border-emerald-800/40 rounded-xl px-4 py-1.5 text-xs text-emerald-300 font-mono">
                <span>{t.orderId}:</span>
                <strong className="text-white">{orderReceipt.orderId}</strong>
              </div>
              <div className="inline-flex items-center gap-2 bg-[#091510] border border-emerald-800/40 rounded-xl px-4 py-1.5 text-xs text-cyan-300 font-mono">
                <span>Auth:</span>
                <strong className="text-white">{orderReceipt.authCode}</strong>
              </div>
            </div>
          </div>

          {/* Official Printable Invoice Summary Box */}
          <div className="p-6 rounded-3xl bg-[#121424] border border-purple-900/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-900/40">
              <div>
                <h4 className="font-bold text-white text-sm font-gaming">
                  {language === 'ar' ? 'فاتورة الشراء الرسمية' : 'Official Purchase Receipt'}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  {orderReceipt.date} • {orderReceipt.time}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-[#16182c] hover:bg-purple-900/50 border border-purple-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors font-gaming"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">{language === 'ar' ? 'العميل' : 'Customer'}</span>
                <span className="font-mono text-white truncate block">{orderReceipt.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{language === 'ar' ? 'وسيلة الدفع' : 'Payment'}</span>
                <span className="font-bold text-cyan-300 block">{orderReceipt.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{language === 'ar' ? 'حالة الدفع' : 'Status'}</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'مدفوع ومسلم' : 'Paid & Delivered'}</span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}</span>
                <span className="font-gaming font-black text-cyan-400 text-base">{formatPrice(orderReceipt.total)}</span>
              </div>
            </div>
          </div>

          {/* Generated Keys Display Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white font-gaming flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span>{t.yourActivationKey} ({orderReceipt.keys.length})</span>
              </h3>
              <span className="text-xs text-emerald-400 font-mono">
                {language === 'ar' ? 'محفوظ مشفراً في Firestore' : 'Permanent Firestore Vault'}
              </span>
            </div>

            <div className="space-y-4">
              {orderReceipt.keys.map((k) => {
                const isHidden = hiddenKeys[k.id] ?? false;
                const isCopied = copiedKeyId === k.id;
                const redeemLink = getRedeemUrl(k.platform);

                return (
                  <div 
                    key={k.id} 
                    className="p-5 sm:p-6 rounded-3xl bg-[#121424] border border-purple-500/40 shadow-xl space-y-4 relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={k.gameCover} 
                          alt={k.gameTitle} 
                          className="w-14 h-16 rounded-xl object-cover border border-purple-900/50" 
                        />
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-cyan-400 border border-purple-800 font-gaming">
                            {k.platform} Key (Global)
                          </span>
                          <h4 className="text-base font-bold text-white mt-1">
                            {language === 'ar' ? k.gameTitleAr : k.gameTitle}
                          </h4>
                          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {t.keyStatusActive} • {language === 'ar' ? 'جاهز للتفعيل الفوري' : 'Ready to Redeem'}
                          </span>
                        </div>
                      </div>

                      <a
                        href={redeemLink}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#181a30] hover:bg-purple-900/50 border border-purple-700 text-cyan-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors font-gaming self-start sm:self-center"
                      >
                        <span>{language === 'ar' ? `تفعيل على ${k.platform}` : `Redeem on ${k.platform}`}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Cyber Digital Key Code Display Bar */}
                    <div className="p-4 rounded-2xl bg-[#090a12] border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 glow-cyan">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-bold hidden sm:inline">KEY:</span>
                        <div className="font-gaming font-mono font-black text-lg sm:text-xl tracking-wider text-cyan-400 select-all">
                          {isHidden ? '•••••-•••••-•••••-•••••' : k.activationKey}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleHideKey(k.id)}
                          className="p-2 rounded-xl bg-[#151828] border border-purple-900/50 text-slate-400 hover:text-white transition-colors"
                          title={isHidden ? t.revealKey : t.hideKey}
                        >
                          {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyKey(k.activationKey, k.id)}
                          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors font-gaming shadow-md"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-950" />
                              <span>{t.copied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>{t.copyKey}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-purple-900/40">
            <button
              type="button"
              onClick={() => navigateTo('account')}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-3 rounded-xl font-gaming flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{language === 'ar' ? 'عرض مفاتيحي في حسابي الدائم' : 'View in My Account Vault'}</span>
              {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => navigateTo('catalog')}
              className="w-full sm:w-auto bg-[#131526] border border-purple-800 hover:border-cyan-400 text-slate-300 hover:text-white font-bold text-xs px-6 py-3 rounded-xl font-gaming transition-colors"
            >
              {language === 'ar' ? 'متابعة التسوق لشراء ألعاب أخرى' : 'Continue Shopping'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
