import React, { useState } from 'react';
import { 
  KeyRound, 
  Heart, 
  User, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Trash2, 
  ShoppingCart, 
  Trophy, 
  ShieldCheck, 
  Coins, 
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Mail,
  MailCheck,
  LogOut,
  LogIn,
  Store,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_GAMES } from '../data/mockGames';

export const AccountPage: React.FC = () => {
  const { 
    userProfile, 
    firebaseUser,
    logout,
    openAuthModal,
    sendVerificationEmail,
    purchasedKeys, 
    toggleKeyStatus, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    language, 
    formatPrice, 
    navigateTo, 
    t, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'keys' | 'wishlist' | 'profile'>('keys');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [hiddenKeys, setHiddenKeys] = useState<{ [key: string]: boolean }>({});
  const [isSendingVerification, setIsSendingVerification] = useState(false);

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
    setHiddenKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const handleResendEmail = async () => {
    setIsSendingVerification(true);
    await sendVerificationEmail();
    setIsSendingVerification(false);
  };

  const wishlistedGames = MOCK_GAMES.filter((g) => wishlist.includes(g.id));

  // If user is not signed in
  if (!firebaseUser) {
    return (
      <div className="py-16 max-w-xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center mx-auto text-cyan-400">
          <Lock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-gaming">
            {language === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'Sign In to Your Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {language === 'ar'
              ? 'قم بتسجيل الدخول أو إنشاء حساب جديد للوصول إلى مفاتيح الألعاب المشتراة، قائمة رغباتك، ورصيد محفظتك الرقمية.'
              : 'Sign in or register to view your cloud-stored game keys, wishlisted games, and wallet.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-xs font-gaming shadow-xl shadow-cyan-400/20 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
          </button>

          <button
            onClick={() => openAuthModal('register')}
            className="w-full sm:w-auto bg-[#131526] border border-purple-800 hover:border-cyan-400 text-white font-bold px-8 py-3.5 rounded-2xl text-xs font-gaming flex items-center justify-center gap-2"
          >
            <span>{language === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Gamer Profile Banner */}
      <div className="bg-[#101222] border border-purple-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="relative">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.gamerTag} 
              className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-400 glow-cyan"
            />
            <span className="absolute -bottom-2 -right-2 bg-purple-600 text-white font-gaming text-xs font-black px-2 py-0.5 rounded-lg shadow-md border border-purple-400">
              Lv.{userProfile.level}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-start space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-black text-white font-gaming">
                    {userProfile.gamerTag}
                  </h1>
                  {userProfile.emailVerified ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                      <CheckCircle2 className="w-3 h-3" />
                      {language === 'ar' ? 'موثق' : 'Verified'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-950/60 border border-amber-500/40 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                      <MailCheck className="w-3 h-3" />
                      {language === 'ar' ? 'غير موثق' : 'Unverified'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono">{userProfile.email}</p>
              </div>

              {/* Badges / Stats & Logout */}
              <div className="flex items-center justify-center sm:justify-end gap-3 text-xs">
                <div className="bg-[#16182c] border border-purple-900/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300 font-medium">{t.rewardPoints}:</span>
                  <strong className="text-amber-400 font-gaming">{userProfile.rewardPoints}</strong>
                </div>

                <div className="bg-[#16182c] border border-purple-900/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300 font-medium">{t.walletBalance}:</span>
                  <strong className="text-cyan-400 font-gaming">{formatPrice(userProfile.walletBalance)}</strong>
                </div>

                <button
                  onClick={logout}
                  className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 p-2 rounded-xl transition-colors"
                  title={language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Email Verification Action */}
            {!userProfile.emailVerified && (
              <div className="pt-2">
                <button
                  onClick={handleResendEmail}
                  disabled={isSendingVerification}
                  className="text-xs text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                >
                  {isSendingVerification ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>{language === 'ar' ? 'إرسال رابط تأكيد وتفعيل البريد الإلكتروني' : 'Resend Verification Email'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-purple-900/50 gap-2">
        <button
          onClick={() => setActiveTab('keys')}
          className={`pb-3 px-5 font-gaming font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'keys'
              ? 'border-cyan-400 text-cyan-400 glow-text-cyan'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>{t.myKeysTab} ({purchasedKeys.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 px-5 font-gaming font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'border-cyan-400 text-cyan-400 glow-text-cyan'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{t.wishlistTab} ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-5 font-gaming font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-cyan-400 text-cyan-400 glow-text-cyan'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t.userProfileTab}</span>
        </button>
      </div>

      {/* TAB 1: MY KEYS */}
      {activeTab === 'keys' && (
        <div className="space-y-4">
          {purchasedKeys.length === 0 ? (
            <div className="p-12 text-center bg-[#0f111e] border border-purple-900/40 rounded-3xl space-y-3">
              <KeyRound className="w-12 h-12 text-purple-400 mx-auto" />
              <h3 className="text-lg font-bold text-white font-gaming">{t.noKeysYet}</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {language === 'ar'
                  ? 'لم تقم بشراء أي مفاتيح ألعاب بعد. جميع المفاتيح التي تشتريها تحفظ مشفرة ودائمة هنا في حسابك.'
                  : 'You have not purchased any keys yet. All purchased game keys are stored permanently in your cloud vault.'}
              </p>
              <button
                onClick={() => navigateTo('catalog')}
                className="bg-cyan-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl font-gaming mt-2"
              >
                {t.startShopping}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {purchasedKeys.map((item) => {
                const isHidden = hiddenKeys[item.id] ?? false;
                const isCopied = copiedKeyId === item.id;

                return (
                  <div 
                    key={item.id}
                    className="p-5 rounded-2xl bg-[#0f111e] border border-purple-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.gameCover} 
                        alt={item.gameTitle} 
                        className="w-16 h-20 rounded-xl object-cover border border-purple-900/60"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-cyan-400 border border-purple-800 font-gaming">
                            {item.platform} Key
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {item.orderId} • {item.purchaseDate}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          {language === 'ar' ? item.gameTitleAr : item.gameTitle}
                        </h4>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                            item.status === 'Active'
                              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}>
                            {item.status === 'Active' ? t.keyStatusActive : t.keyStatusRedeemed}
                          </span>
                          <button
                            onClick={() => toggleKeyStatus(item.id)}
                            className="text-[11px] text-slate-400 hover:text-cyan-400 underline"
                          >
                            {item.status === 'Active' ? t.markAsRedeemed : (language === 'ar' ? 'إعادة كجاهز للتفعيل' : 'Mark as Active')}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Key Box with Copy */}
                    <div className="flex items-center gap-3 bg-[#090a12] border border-cyan-500/30 rounded-2xl p-3 glow-cyan">
                      <div className="font-gaming font-mono font-bold text-sm tracking-widest text-cyan-400 px-2 select-all">
                        {isHidden ? '•••••-•••••-•••••-•••••' : item.activationKey}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleHideKey(item.id)}
                          className="p-2 rounded-lg bg-[#151828] text-slate-400 hover:text-white"
                          title={isHidden ? t.revealKey : t.hideKey}
                        >
                          {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleCopyKey(item.activationKey, item.id)}
                          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-gaming"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? t.copied : t.copyKey}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistedGames.length === 0 ? (
            <div className="p-12 text-center bg-[#0f111e] border border-purple-900/40 rounded-3xl space-y-3">
              <Heart className="w-12 h-12 text-rose-400 mx-auto" />
              <h3 className="text-lg font-bold text-white font-gaming">
                {language === 'ar' ? 'قائمة أمنياتك فارغة' : 'Your Wishlist is Empty'}
              </h3>
              <button
                onClick={() => navigateTo('catalog')}
                className="bg-cyan-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl font-gaming mt-2"
              >
                {t.startShopping}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedGames.map((game) => (
                <div key={game.id} className="p-4 rounded-2xl bg-[#0f111e] border border-purple-900/40 space-y-3">
                  <img src={game.coverImage} alt={game.title} className="w-full aspect-[16/10] rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-white truncate">
                      {language === 'ar' ? game.titleAr : game.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-cyan-400 font-bold font-gaming">{formatPrice(game.price)}</span>
                      <span className="text-[10px] text-purple-300 font-bold">{game.platform}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-purple-900/30">
                    <button
                      onClick={() => addToCart(game)}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 font-gaming"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{t.addToCart}</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(game.id)}
                      className="p-2 rounded-xl bg-[#141628] text-slate-400 hover:text-rose-400 border border-purple-900/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USER PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-[#0f111e] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base font-gaming">
              {language === 'ar' ? 'بيانات الحساب الشخصي' : 'Account Details'}
            </h3>
            <button
              onClick={() => navigateTo('merchant')}
              className="bg-purple-900/60 hover:bg-purple-800 text-cyan-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-700 flex items-center gap-1.5 transition-colors font-gaming"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'لوحة تحكم التاجر' : 'Merchant Dashboard'}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1">{language === 'ar' ? 'الاسم المعروض' : 'Display Name'}</label>
              <input
                type="text"
                defaultValue={userProfile.name}
                className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">{language === 'ar' ? 'اسم اللاعب (GamerTag)' : 'GamerTag'}</label>
              <input
                type="text"
                defaultValue={userProfile.gamerTag}
                className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 font-gaming"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">{language === 'ar' ? 'البريد الإلكتروني الحقيقي' : 'Verified Email'}</label>
              <input
                type="email"
                disabled
                defaultValue={userProfile.email}
                className="w-full bg-[#15182a]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-400 cursor-not-allowed font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Firebase UID</label>
              <input
                type="text"
                disabled
                defaultValue={userProfile.uid || 'Firebase Authenticated'}
                className="w-full bg-[#15182a]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-purple-900/40">
            <button
              onClick={() => {
                addToast(
                  language === 'ar' ? 'تم الحفظ' : 'Saved',
                  language === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Settings updated successfully',
                  'success'
                );
              }}
              className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs px-6 py-2.5 rounded-xl font-gaming transition-colors"
            >
              {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
            </button>

            <button
              onClick={logout}
              className="text-rose-400 hover:text-rose-300 text-xs font-bold font-gaming flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
