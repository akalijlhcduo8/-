import React from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Zap, 
  Globe, 
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { Game, Platform } from '../types';
import { useApp } from '../context/AppContext';

interface GameCardProps {
  game: Game;
  layout?: 'grid' | 'horizontal';
}

export const GameCard: React.FC<GameCardProps> = ({ game, layout = 'grid' }) => {
  const { 
    language, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isWishlisted, 
    navigateTo, 
    t 
  } = useApp();

  const getPlatformBadge = (platform: Platform) => {
    switch (platform) {
      case 'Steam':
        return { text: 'Steam', bg: 'bg-[#1b2838]', border: 'border-[#66c0f4]/50', textCol: 'text-[#66c0f4]' };
      case 'Epic':
        return { text: 'Epic Games', bg: 'bg-neutral-900', border: 'border-neutral-600', textCol: 'text-neutral-200' };
      case 'EA':
        return { text: 'EA App', bg: 'bg-[#ff4747]/15', border: 'border-[#ff4747]/40', textCol: 'text-[#ff4747]' };
      case 'Ubisoft':
        return { text: 'Ubisoft Connect', bg: 'bg-[#0070d6]/15', border: 'border-[#0070d6]/40', textCol: 'text-[#0070d6]' };
      case 'Xbox':
        return { text: 'Xbox / PC', bg: 'bg-[#107c10]/15', border: 'border-[#107c10]/50', textCol: 'text-[#52d852]' };
      case 'PlayStation':
        return { text: 'PlayStation', bg: 'bg-[#003791]/20', border: 'border-[#0070d6]/50', textCol: 'text-[#2997ff]' };
      default:
        return { text: platform, bg: 'bg-purple-900/40', border: 'border-purple-500/40', textCol: 'text-purple-300' };
    }
  };

  const badge = getPlatformBadge(game.platform);
  const wishlisted = isWishlisted(game.id);

  if (layout === 'horizontal') {
    return (
      <div 
        id={`game-card-${game.id}`}
        className="group relative bg-[#121424] hover:bg-[#181a30] border border-purple-900/40 hover:border-cyan-500/50 rounded-2xl p-3 sm:p-4 flex gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
        onClick={() => navigateTo('product', game.id)}
      >
        {/* Cover thumbnail */}
        <div className="relative w-28 sm:w-36 h-36 sm:h-44 flex-shrink-0 overflow-hidden rounded-xl border border-purple-900/50">
          <img 
            src={game.coverImage} 
            alt={game.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {game.discount > 0 && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-md shadow-lg font-gaming">
              -{game.discount}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md border ${badge.bg} ${badge.border} ${badge.textCol}`}>
                {badge.text}
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{game.rating}</span>
                <span className="text-slate-500 font-normal">({game.reviewsCount})</span>
              </div>
            </div>

            <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
              {language === 'ar' ? game.titleAr : game.title}
            </h3>
            
            <p className="text-xs text-slate-400 line-clamp-2 mt-1 hidden sm:block">
              {language === 'ar' ? game.shortDescAr : game.shortDesc}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                <Zap className="w-3 h-3 text-cyan-400" />
                {language === 'ar' ? 'تسليم فوري' : 'Instant Key'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/30">
                <Globe className="w-3 h-3 text-purple-400" />
                {game.region}
              </span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-900/30">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-gaming font-extrabold text-lg sm:text-xl text-cyan-400">
                  {formatPrice(game.price)}
                </span>
                {game.originalPrice > game.price && (
                  <span className="text-xs text-slate-500 line-through">
                    {formatPrice(game.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggleWishlist(game.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  wishlisted 
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                    : 'bg-[#0f111e] border-purple-900/40 text-slate-400 hover:text-rose-400'
                }`}
                title={t.navWishlist}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => addToCart(game)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all font-gaming"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.addToCart}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout
  return (
    <div 
      id={`game-card-${game.id}`}
      onClick={() => navigateTo('product', game.id)}
      className="group relative bg-[#121424] hover:bg-[#16182c] border border-purple-900/40 hover:border-cyan-400/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-900/30 flex flex-col justify-between cursor-pointer"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img 
          src={game.coverImage} 
          alt={game.title} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
        />
        
        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          {game.discount > 0 ? (
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-lg shadow-lg font-gaming">
              -{game.discount}%
            </span>
          ) : <div />}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(game.id);
            }}
            className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-all ${
              wishlisted 
                ? 'bg-rose-500/80 text-white shadow-lg' 
                : 'bg-black/50 hover:bg-black/80 text-white/80 hover:text-rose-400'
            }`}
            title={t.navWishlist}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bestseller or Flash Deal Ribbon */}
        {game.isFlashDeal && (
          <div className="absolute bottom-2 left-2 bg-rose-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
            <Flame className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
            <span>{language === 'ar' ? 'عرض فلاش' : 'Flash Deal'}</span>
          </div>
        )}

        {/* Region watermark */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-[10px] text-slate-300 px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1">
          <Globe className="w-2.5 h-2.5 text-cyan-400" />
          <span>{game.region}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Platform and Rating */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badge.bg} ${badge.border} ${badge.textCol}`}>
              {badge.text}
            </span>

            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{game.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {language === 'ar' ? game.titleAr : game.title}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <span>{language === 'ar' ? game.genreAr : game.genre}</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
              <Zap className="w-3 h-3" />
              {t.stockInStock}
            </span>
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center justify-between">
          <div>
            {game.originalPrice > game.price && (
              <span className="block text-[11px] text-slate-500 line-through">
                {formatPrice(game.originalPrice)}
              </span>
            )}
            <span className="font-gaming font-extrabold text-lg text-cyan-400 group-hover:text-cyan-300 transition-colors">
              {formatPrice(game.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => addToCart(game)}
              className="bg-purple-950/70 hover:bg-purple-600 text-purple-200 hover:text-white p-2.5 rounded-xl border border-purple-700/40 hover:border-purple-500 transition-all group-hover:glow-purple"
              title={t.addToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                addToCart(game);
                navigateTo('checkout');
              }}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1 transition-all shadow-md font-gaming"
            >
              <span>{t.buyNow}</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
