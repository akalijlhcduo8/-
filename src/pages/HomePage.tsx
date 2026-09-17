import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Play, 
  Tag, 
  CheckCircle2, 
  Filter,
  Gamepad2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_GAMES } from '../data/mockGames';
import { GameCard } from '../components/GameCard';
import { Platform } from '../types';

export const HomePage: React.FC = () => {
  const { 
    language, 
    formatPrice, 
    navigateTo, 
    addToCart, 
    setFilters, 
    t 
  } = useApp();

  const featuredGame = MOCK_GAMES[0]; // Cyberpunk 2077
  const flashDeals = MOCK_GAMES.filter((g) => g.isFlashDeal);
  const bestsellers = MOCK_GAMES.filter((g) => g.isBestseller);
  const newReleases = MOCK_GAMES.filter((g) => g.isNewRelease || g.releaseDate.startsWith('2024'));

  // Countdown timer for flash deals
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePlatformClick = (platform: Platform) => {
    setFilters((prev) => ({ ...prev, platforms: [platform] }));
    navigateTo('catalog');
  };

  const platforms: { id: Platform; name: string; icon: string; count: number; color: string }[] = [
    { id: 'Steam', name: 'Steam', icon: '🎮', count: 6, color: 'hover:border-sky-500 hover:text-sky-400' },
    { id: 'Epic', name: 'Epic Games', icon: '⚡', count: 2, color: 'hover:border-neutral-400 hover:text-neutral-200' },
    { id: 'EA', name: 'EA App', icon: '🏆', count: 1, color: 'hover:border-orange-500 hover:text-orange-400' },
    { id: 'Xbox', name: 'Xbox / PC', icon: '🟢', count: 1, color: 'hover:border-emerald-500 hover:text-emerald-400' },
    { id: 'PlayStation', name: 'PlayStation', icon: '🔵', count: 1, color: 'hover:border-blue-500 hover:text-blue-400' },
  ];

  return (
    <div className="space-y-14">
      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden border border-purple-900/50 bg-[#0d0f1c] shadow-2xl">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src={featuredGame.bannerImage}
            alt={featuredGame.title}
            className="w-full h-full object-cover object-center opacity-30 transform scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090a10] via-[#090a10]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a10] via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/50 text-cyan-300 text-xs font-bold mb-4 backdrop-blur-md glow-purple">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-gaming tracking-tight">
            {language === 'ar' ? featuredGame.titleAr : featuredGame.title}
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-2xl">
            {language === 'ar' ? featuredGame.descriptionAr : featuredGame.description}
          </p>

          {/* Price & Discount Info */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="bg-[#141628]/90 border border-purple-500/40 rounded-2xl px-4 py-2 backdrop-blur-md flex items-center gap-3">
              <span className="bg-emerald-500 text-slate-950 font-black text-sm px-2.5 py-1 rounded-lg font-gaming">
                -{featuredGame.discount}%
              </span>
              <div>
                <span className="block text-[11px] text-slate-400 line-through">
                  {formatPrice(featuredGame.originalPrice)}
                </span>
                <span className="font-gaming font-black text-2xl text-cyan-400">
                  {formatPrice(featuredGame.price)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-sky-950/70 border border-sky-500/40 text-sky-400 font-bold">
                Steam Key
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-300 font-bold">
                Global Region
              </span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                {t.stockInStock}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              id="hero-buy-now-btn"
              onClick={() => {
                addToCart(featuredGame);
                navigateTo('checkout');
              }}
              className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-slate-950 font-black text-sm px-6 py-3.5 rounded-xl shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 font-gaming"
            >
              <span>{t.buyNow}</span>
              {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              id="hero-details-btn"
              onClick={() => navigateTo('product', featuredGame.id)}
              className="bg-[#141628]/80 hover:bg-purple-900/50 text-white font-bold text-sm px-5 py-3.5 rounded-xl border border-purple-800/60 hover:border-cyan-400 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <span>{t.viewGame}</span>
            </button>

            <button
              onClick={() => navigateTo('how-it-works')}
              className="text-xs text-purple-300 hover:text-cyan-400 font-semibold underline underline-offset-4 transition-colors"
            >
              {t.heroHowItWorks}
            </button>
          </div>
        </div>
      </section>

      {/* PLATFORMS QUICK SELECTOR BAR */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
            <h2 className="font-gaming font-bold text-lg text-white">
              {language === 'ar' ? 'تصفح حسب منصة التفعيل' : 'Browse By Platform'}
            </h2>
          </div>
          <button 
            onClick={() => navigateTo('catalog')}
            className="text-xs text-cyan-400 hover:underline font-semibold"
          >
            {t.browseAll}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {platforms.map((p) => (
            <div
              key={p.id}
              onClick={() => handlePlatformClick(p.id)}
              className={`p-3.5 rounded-2xl bg-[#121424] border border-purple-900/40 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${p.color} flex items-center justify-between group`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{p.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-inherit transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {p.count} {t.gamesWord}
                  </span>
                </div>
              </div>
              {language === 'ar' ? (
                <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-inherit transition-colors" />
              ) : (
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-inherit transition-colors" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FLASH DEALS (عروض محدودة بوقت) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121024] via-[#101328] to-[#0c0e1a] border border-rose-900/40 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-gaming font-extrabold text-xl sm:text-2xl text-white flex items-center gap-2">
                <span>{t.flashDealsTitle}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? 'خصومات تصل إلى 70% تنتهي قريباً مع تسليم فوري' : 'Up to 70% off discounts ending soon with instant delivery'}
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-[#090a12]/80 border border-rose-800/40 rounded-xl px-4 py-2 self-start sm:self-auto">
            <Clock className="w-4 h-4 text-rose-400 animate-spin" />
            <span className="text-xs text-slate-300 font-medium">{t.flashDealsEndsIn}</span>
            <div className="flex items-center gap-1 font-gaming font-mono font-bold text-rose-400 text-sm">
              <span className="bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Flash Deals Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashDeals.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* BESTSELLERS (الأكثر مبيعاً) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-gaming font-extrabold text-2xl text-white flex items-center gap-2">
              <span>{t.bestsellersTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'ar' ? 'المفاتيح الأكثر طلباً من مجتمع اللاعبين هذا الأسبوع' : 'Most purchased CD keys this week across all platforms'}
            </p>
          </div>

          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, sortBy: 'bestseller' }));
              navigateTo('catalog');
            }}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors font-gaming"
          >
            <span>{t.browseAll}</span>
            {language === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestsellers.slice(0, 4).map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* NEW RELEASES (إصدارات جديدة) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-gaming font-extrabold text-2xl text-white flex items-center gap-2">
              <span>{t.newReleasesTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'ar' ? 'أقوى العناوين العالمية الصادرة حديثاً بأسعار تنافسية' : 'Brand new releases and pre-orders at special launch discounts'}
            </p>
          </div>

          <button
            onClick={() => navigateTo('catalog')}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors font-gaming"
          >
            <span>{t.browseAll}</span>
            {language === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newReleases.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* INTERACTIVE HOW IT WORKS QUICK BANNER */}
      <section className="rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-purple-950/60 border border-purple-700/40 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-right">
            <span className="text-xs font-bold text-cyan-400 font-gaming uppercase tracking-wider">
              {language === 'ar' ? 'آلية عمل تلقائية 100%' : '100% Automated System'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-gaming">
              {language === 'ar' ? 'كيف تستلم مفتاح لعبتك فوراً بعد الدفع؟' : 'How does automated instant key delivery work?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {language === 'ar'
                ? 'نظامنا البرمجي مربوط مباشرة بمخزن المفاتيح المشفر. بمجرد تأكيد الدفع، يتم توليد المفتاح على شاشتك في 3 ثوانٍ وتصلك نسخة فورية لإيميلك.'
                : 'Our automated gateway connects directly to encrypted vaults. Within 3 seconds of payment, your key appears on screen and arrives in your inbox.'}
            </p>
          </div>

          <button
            onClick={() => navigateTo('how-it-works')}
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-400/20 transition-all font-gaming flex-shrink-0"
          >
            <span>{t.navHowItWorks}</span>
            {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </section>
    </div>
  );
};
