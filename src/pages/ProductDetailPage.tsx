import React, { useState } from 'react';
import { 
  Star, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Layers, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Heart, 
  Share2, 
  Flame, 
  Users, 
  ChevronRight, 
  ChevronLeft,
  Play,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_GAMES } from '../data/mockGames';
import { UserReview } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedGameId, 
    language, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isWishlisted, 
    navigateTo, 
    t, 
    addToast 
  } = useApp();

  const game = MOCK_GAMES.find((g) => g.id === selectedGameId) || MOCK_GAMES[0];
  const [selectedImage, setSelectedImage] = useState(game.coverImage);
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'activation' | 'reviews'>('overview');
  
  // Review form state
  const [reviewsList, setReviewsList] = useState<UserReview[]>(game.reviews);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const wishlisted = isWishlisted(game.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: newReviewText,
      commentAr: newReviewText,
      verifiedPurchase: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewText('');
    setShowReviewForm(false);
    addToast(
      language === 'ar' ? 'شكراً لتقييمك!' : 'Thank you!',
      language === 'ar' ? 'تم نشر مراجعتك بنجاح' : 'Your review has been posted',
      'success'
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast(
        language === 'ar' ? 'تم النسخ' : 'Link Copied',
        language === 'ar' ? 'تم نسخ رابط اللعبة إلى الحافظة' : 'Product link copied to clipboard',
        'info'
      );
    }
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <button onClick={() => navigateTo('home')} className="hover:text-cyan-400 transition-colors">
          {t.navHome}
        </button>
        <span>/</span>
        <button onClick={() => navigateTo('catalog')} className="hover:text-cyan-400 transition-colors">
          {t.navCatalog}
        </button>
        <span>/</span>
        <span className="text-slate-200 font-semibold truncate max-w-xs">
          {language === 'ar' ? game.titleAr : game.title}
        </span>
      </nav>

      {/* Social proof banner bar */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-purple-950/60 border border-purple-700/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>
            <strong className="text-white font-gaming">{game.purchasesToday}</strong> {t.purchasedTodayTicker}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-purple-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>{t.guaranteeNotice}</span>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-black border border-purple-900/50 shadow-2xl group">
            <img 
              src={selectedImage} 
              alt={game.title} 
              className="w-full h-full object-cover" 
            />
            {game.discount > 0 && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm px-3 py-1 rounded-xl shadow-lg font-gaming">
                -{game.discount}%
              </span>
            )}
            {game.trailerUrl && (
              <a
                href={game.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{language === 'ar' ? 'مشاهدة العرض (Trailer)' : 'Watch Trailer'}</span>
              </a>
            )}
          </div>

          {/* Thumbnails row */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            <div
              onClick={() => setSelectedImage(game.coverImage)}
              className={`w-24 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                selectedImage === game.coverImage ? 'border-cyan-400 glow-cyan scale-105' : 'border-purple-900/40 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={game.coverImage} alt="Cover" className="w-full h-full object-cover" />
            </div>
            {game.screenshots.map((shot, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(shot)}
                className={`w-24 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                  selectedImage === shot ? 'border-cyan-400 glow-cyan scale-105' : 'border-purple-900/40 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={shot} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Quick Specifications Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#121424] border border-purple-900/40 text-center">
              <span className="block text-[10px] text-slate-400 uppercase">{t.filterByPlatform}</span>
              <span className="font-bold text-xs text-sky-400 mt-1 block">{game.platform}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#121424] border border-purple-900/40 text-center">
              <span className="block text-[10px] text-slate-400 uppercase">{t.filterByRegion}</span>
              <span className="font-bold text-xs text-purple-300 mt-1 block">{game.region} (عالمي)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#121424] border border-purple-900/40 text-center">
              <span className="block text-[10px] text-slate-400 uppercase">{language === 'ar' ? 'التسليم' : 'Delivery'}</span>
              <span className="font-bold text-xs text-emerald-400 mt-1 block flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" />
                {language === 'ar' ? 'فوري آلي' : 'Instant'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#121424] border border-purple-900/40 text-center">
              <span className="block text-[10px] text-slate-400 uppercase">{language === 'ar' ? 'التقييم' : 'Score'}</span>
              <span className="font-bold text-xs text-amber-400 mt-1 block flex items-center justify-center gap-1 font-gaming">
                <Star className="w-3 h-3 fill-amber-400" />
                {game.rating} / 5
              </span>
            </div>
          </div>
        </div>

        {/* Right Checkout & Purchase Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121424] border border-purple-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full filter blur-2xl pointer-events-none" />

            {/* Title & Category */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/30 text-cyan-300 text-xs font-bold font-gaming">
                  {game.platform} CD Key
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlist(game.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      wishlisted 
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                        : 'bg-[#181a30] border-purple-900/40 text-slate-400 hover:text-white'
                    }`}
                    title={t.navWishlist}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-[#181a30] border border-purple-900/40 text-slate-400 hover:text-white transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white font-gaming leading-tight">
                {language === 'ar' ? game.titleAr : game.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold">{game.rating}</span>
                </div>
                <span>•</span>
                <span>{game.reviewsCount} {language === 'ar' ? 'تقييم موثق' : 'verified reviews'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{t.stockInStock}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="my-6 p-4 rounded-2xl bg-[#0b0c16] border border-purple-900/60 flex items-center justify-between">
              <div>
                <span className="block text-xs text-slate-400 mb-0.5">{language === 'ar' ? 'السعر النهائي المباشر:' : 'Direct Price:'}</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-gaming font-black text-3xl text-cyan-400 glow-text-cyan">
                    {formatPrice(game.price)}
                  </span>
                  {game.originalPrice > game.price && (
                    <span className="text-sm text-slate-500 line-through">
                      {formatPrice(game.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {game.discount > 0 && (
                <div className="text-right">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 py-1 rounded-lg inline-block font-gaming">
                    {t.saveDiscount} {formatPrice(game.originalPrice - game.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Delivery Guarantees */}
            <div className="space-y-2 mb-6 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-950/30 border border-purple-800/30">
                <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{t.instantDeliveryNotice}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-950/30 border border-purple-800/30">
                <Globe className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>{t.regionNotice}</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="space-y-3">
              <button
                id="pdp-buy-now-btn"
                onClick={() => {
                  addToCart(game);
                  navigateTo('checkout');
                }}
                className="w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-slate-950 font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all font-gaming"
              >
                <span>{t.buyNow}</span>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                id="pdp-add-cart-btn"
                onClick={() => addToCart(game)}
                className="w-full bg-[#181a30] hover:bg-purple-900/50 text-white font-bold py-3.5 rounded-2xl text-xs border border-purple-700/50 hover:border-cyan-400 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                <span>{t.addToCart}</span>
              </button>
            </div>

            {/* Publisher Metadata */}
            <div className="mt-6 pt-5 border-t border-purple-900/40 text-xs text-slate-400 space-y-1.5">
              <div className="flex justify-between">
                <span>{t.developer}</span>
                <span className="text-white font-medium">{game.developer}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.publisher}</span>
                <span className="text-white font-medium">{game.publisher}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.releaseDate}</span>
                <span className="text-white font-medium font-gaming">{game.releaseDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Overview, System Requirements, Activation Guide, Reviews */}
      <div className="pt-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-purple-900/50 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-gaming font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-400 glow-text-cyan'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.productOverview}
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`pb-3 px-4 font-gaming font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'requirements'
                ? 'border-cyan-400 text-cyan-400 glow-text-cyan'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.systemRequirements}
          </button>
          <button
            onClick={() => setActiveTab('activation')}
            className={`pb-3 px-4 font-gaming font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'activation'
                ? 'border-cyan-400 text-cyan-400 glow-text-cyan'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.activationGuide}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 font-gaming font-bold text-sm transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-cyan-400 text-cyan-400 glow-text-cyan'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.customerReviews}</span>
            <span className="px-1.5 py-0.2 bg-purple-900 text-purple-300 rounded text-xs">
              {reviewsList.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-[#0f111e] border border-purple-900/40 rounded-2xl p-6 leading-relaxed text-sm text-slate-300">
                <h3 className="font-bold text-white text-base font-gaming mb-3">
                  {language === 'ar' ? 'نبذة عن اللعبة' : 'Game Summary'}
                </h3>
                <p>{language === 'ar' ? game.descriptionAr : game.description}</p>
              </div>

              {/* Highlights */}
              <div className="bg-[#0f111e] border border-purple-900/40 rounded-2xl p-6">
                <h3 className="font-bold text-white text-base font-gaming mb-4">
                  {language === 'ar' ? 'أبرز مميزات ومحتويات هذا الإصدار:' : 'Key Features & Included Content:'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(language === 'ar' ? game.featuresAr : game.features).map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#141628] border border-purple-900/30 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM REQUIREMENTS */}
          {activeTab === 'requirements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Minimum */}
              <div className="bg-[#0f111e] border border-purple-900/40 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-cyan-400 text-base font-gaming flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span>{t.minimumSpecs}</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#141628] border border-purple-950">
                    <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'نظام التشغيل:' : 'OS:'}</span>
                    <span className="font-semibold text-white">{game.systemRequirements.minimum.os}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141628] border border-purple-950">
                    <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'المعالج (CPU):' : 'Processor:'}</span>
                    <span className="font-semibold text-white">{game.systemRequirements.minimum.cpu}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141628] border border-purple-950">
                    <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'الذاكرة العشوائية (RAM):' : 'Memory:'}</span>
                    <span className="font-semibold text-white">{game.systemRequirements.minimum.ram}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141628] border border-purple-950">
                    <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'كرت الشاشة (GPU):' : 'Graphics:'}</span>
                    <span className="font-semibold text-white">{game.systemRequirements.minimum.gpu}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141628] border border-purple-950">
                    <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'المساحة التخزينية:' : 'Storage:'}</span>
                    <span className="font-semibold text-white">{game.systemRequirements.minimum.storage}</span>
                  </div>
                </div>
              </div>

              {/* Recommended */}
              <div className="bg-[#0f111e] border border-purple-900/40 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-purple-400 text-base font-gaming flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-purple-400" />
                  <span>{t.recommendedSpecs}</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#141628] border border-purple-950">
                    <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'نظام التشغيل:' : 'OS:'}</span>
                    <span className="font-semibold text-white">{game.systemRequirements.recommended.os}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141628] border border-purple-950">
                    <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'المعالج (CPU):' : 'Processor:'}</span>
                    <span className="font-semibold text-white">{game.systemRequirements.recommended.cpu}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141628] border border-purple-950">
                    <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'الذاكرة العشوائية (RAM):' : 'Memory:'}</span>
                    <span className="font-semibold text-white">{game.systemRequirements.recommended.ram}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141628] border border-purple-950">
                    <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'كرت الشاشة (GPU):' : 'Graphics:'}</span>
                    <span className="font-semibold text-white">{game.systemRequirements.recommended.gpu}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141628] border border-purple-950">
                    <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'المساحة التخزينية:' : 'Storage:'}</span>
                    <span className="font-semibold text-white">{game.systemRequirements.recommended.storage}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVATION GUIDE */}
          {activeTab === 'activation' && (
            <div className="bg-[#0f111e] border border-purple-900/40 rounded-2xl p-6 space-y-6">
              <h3 className="font-bold text-white text-base font-gaming">
                {language === 'ar' ? `طريقة تفعيل مفتاح ${game.platform}:` : `How to Redeem Your ${game.platform} Key:`}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#141628] border border-purple-900/40 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/20 text-cyan-300 font-bold flex items-center justify-center font-gaming">
                    1
                  </div>
                  <h4 className="font-bold text-white text-xs">
                    {language === 'ar' ? `افتح تطبيق ${game.platform}` : `Launch ${game.platform} Client`}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {language === 'ar'
                      ? 'قم بتسجيل الدخول إلى حسابك الشخصي أو إنشاء حساب جديد مجاناً.'
                      : 'Sign in to your launcher account or create a free user profile.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#141628] border border-purple-900/40 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-400/20 text-purple-300 font-bold flex items-center justify-center font-gaming">
                    2
                  </div>
                  <h4 className="font-bold text-white text-xs">
                    {language === 'ar' ? 'اختر تفعيل منتج (Redeem Code)' : 'Select Activate a Product'}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {language === 'ar'
                      ? 'انقر على خيار "إضافة لعبة" أو "استرداد رمز التفعيل" من القائمة الرئيسية.'
                      : 'Click "Add a Game" or "Redeem Code" from the navigation menu.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#141628] border border-purple-900/40 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 font-bold flex items-center justify-center font-gaming">
                    3
                  </div>
                  <h4 className="font-bold text-white text-xs">
                    {language === 'ar' ? 'الصق الكود وابدأ التحميل' : 'Paste Code & Download'}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {language === 'ar'
                      ? 'الصق المفتاح المستلم، وسيتم ربط اللعبة بمكتبتك إلى الأبد للتحميل في أي وقت.'
                      : 'Enter your official key. The game will bind permanently to your library.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating Summary Bar */}
              <div className="bg-[#0f111e] border border-purple-900/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="font-gaming font-black text-4xl text-amber-400">{game.rating}</span>
                    <div className="flex items-center gap-1 text-amber-400 justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {game.reviewsCount} {language === 'ar' ? 'تقييم موثق' : 'verified reviews'}
                    </span>
                  </div>
                  <div className="h-12 w-px bg-purple-900/40 hidden sm:block" />
                  <p className="text-xs text-slate-300 max-w-sm">
                    {language === 'ar'
                      ? 'جميع التقييمات من مشترين حقيقيين استلموا مفاتيح اللعبة وفعلوا حساباتهم بنجاح.'
                      : 'All reviews are submitted by verified purchasers with confirmed key activations.'}
                  </p>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors font-gaming"
                >
                  {t.writeReview}
                </button>
              </div>

              {/* Review Submission Form Modal / Box */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className="bg-[#141628] border border-purple-500/40 rounded-2xl p-6 space-y-4">
                  <h4 className="font-bold text-white text-sm font-gaming">
                    {t.writeReview}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">{language === 'ar' ? 'اسمك أو لقبك' : 'Your Name / GamerTag'}</label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: فيصل العتيبي' : 'e.g. Faisal'}
                        className="w-full bg-[#0d0e17] border border-purple-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">{language === 'ar' ? 'التقييم' : 'Star Rating'}</label>
                      <div className="flex items-center gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="p-1"
                          >
                            <Star className={`w-5 h-5 ${star <= newReviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">{language === 'ar' ? 'رأيك وتجربتك في استلام وتفعيل المفتاح' : 'Your Review'}</label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder={language === 'ar' ? 'اكتب رأيك هنا...' : 'Write your review here...'}
                      className="w-full bg-[#0d0e17] border border-purple-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="bg-cyan-400 text-black font-bold px-4 py-2 rounded-xl text-xs font-gaming"
                    >
                      {t.submitReview}
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-[#0f111e] border border-purple-900/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={rev.avatar} alt={rev.author} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{rev.author}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                {t.verifiedBuyer}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pr-10">
                      {language === 'ar' ? rev.commentAr : rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
