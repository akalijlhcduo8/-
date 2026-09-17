import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Grid3X3, 
  List, 
  Search, 
  SlidersHorizontal, 
  X, 
  Check, 
  Gamepad2, 
  Zap,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_GAMES } from '../data/mockGames';
import { GameCard } from '../components/GameCard';
import { Platform, Genre, Region } from '../types';

export const CatalogPage: React.FC = () => {
  const { 
    language, 
    formatPrice, 
    filters, 
    setFilters, 
    resetFilters, 
    t 
  } = useApp();

  const [layoutMode, setLayoutMode] = useState<'grid' | 'horizontal'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const availablePlatforms: Platform[] = ['Steam', 'Epic', 'EA', 'Ubisoft', 'Xbox', 'PlayStation'];
  const availableGenres: Genre[] = ['Action', 'RPG', 'Sports', 'Open World', 'Shooter', 'Racing'];
  const availableRegions: Region[] = ['GLOBAL', 'MENA', 'EU', 'US'];

  // Filter Logic
  const filteredGames = useMemo(() => {
    return MOCK_GAMES.filter((game) => {
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(query) || game.titleAr.includes(query);
        const matchesPlatform = game.platform.toLowerCase().includes(query);
        const matchesGenre = game.genre.toLowerCase().includes(query) || game.genreAr.includes(query);
        if (!matchesTitle && !matchesPlatform && !matchesGenre) return false;
      }

      // Platforms
      if (filters.platforms.length > 0 && !filters.platforms.includes(game.platform)) {
        return false;
      }

      // Genres
      if (filters.genres.length > 0 && !filters.genres.includes(game.genre)) {
        return false;
      }

      // Regions
      if (filters.regions.length > 0 && !filters.regions.includes(game.region)) {
        return false;
      }

      // Price
      if (game.price > filters.maxPrice) {
        return false;
      }

      // Only Discounted
      if (filters.onlyDiscounted && game.discount <= 0) {
        return false;
      }

      // In Stock
      if (filters.inStockOnly && !game.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'bestseller':
          return (b.purchasesToday || 0) - (a.purchasesToday || 0);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return b.discount - a.discount;
        default:
          return 0;
      }
    });
  }, [filters]);

  const togglePlatform = (p: Platform) => {
    setFilters((prev) => {
      const exists = prev.platforms.includes(p);
      return {
        ...prev,
        platforms: exists ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p],
      };
    });
  };

  const toggleGenre = (g: Genre) => {
    setFilters((prev) => {
      const exists = prev.genres.includes(g);
      return {
        ...prev,
        genres: exists ? prev.genres.filter((x) => x !== g) : [...prev.genres, g],
      };
    });
  };

  const toggleRegion = (r: Region) => {
    setFilters((prev) => {
      const exists = prev.regions.includes(r);
      return {
        ...prev,
        regions: exists ? prev.regions.filter((x) => x !== r) : [...prev.regions, r],
      };
    });
  };

  const activeFiltersCount = 
    (filters.search ? 1 : 0) +
    filters.platforms.length +
    filters.genres.length +
    filters.regions.length +
    (filters.onlyDiscounted ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < 100 ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-900/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-gaming">
            {t.navCatalog}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.showingGames} <span className="font-bold text-cyan-400">{filteredGames.length}</span> {t.ofGames} {MOCK_GAMES.length} {t.gamesWord}
          </p>
        </div>

        {/* Controls: Sort and Layout */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-[#141628] border border-purple-900/50 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>{language === 'ar' ? 'الفلاتر' : 'Filters'}</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-[#121424] border border-purple-900/50 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">{t.sortBy}</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#121424] text-white">{t.sortFeatured}</option>
              <option value="bestseller" className="bg-[#121424] text-white">{t.sortBestseller}</option>
              <option value="price-asc" className="bg-[#121424] text-white">{t.sortPriceAsc}</option>
              <option value="price-desc" className="bg-[#121424] text-white">{t.sortPriceDesc}</option>
              <option value="rating" className="bg-[#121424] text-white">{t.sortRating}</option>
              <option value="discount" className="bg-[#121424] text-white">{t.sortDiscount}</option>
            </select>
          </div>

          {/* Layout Toggle */}
          <div className="hidden sm:flex items-center bg-[#121424] border border-purple-900/50 rounded-xl p-1">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('horizontal')}
              className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'horizontal' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden lg:block space-y-6 bg-[#0f111e] border border-purple-900/40 rounded-2xl p-5 h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
            <div className="flex items-center gap-2 text-white font-bold font-gaming">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>{language === 'ar' ? 'فلاتر البحث' : 'Filters'}</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.clearFilters}</span>
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              {language === 'ar' ? 'بحث بالاسم' : 'Search by title'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder={language === 'ar' ? 'اكتب اسم اللعبة...' : 'Search title...'}
                className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                  className="absolute top-1/2 -translate-y-1/2 left-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Platform Filter */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2.5 font-gaming">
              {t.filterByPlatform}
            </label>
            <div className="space-y-1.5">
              {availablePlatforms.map((p) => {
                const checked = filters.platforms.includes(p);
                return (
                  <div
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer border transition-all ${
                      checked
                        ? 'bg-purple-900/40 border-cyan-400 text-white font-bold'
                        : 'bg-[#141626] border-purple-950/60 text-slate-400 hover:text-white hover:border-purple-800'
                    }`}
                  >
                    <span>{p}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${checked ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-600'}`}>
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2.5 font-gaming">
              {t.filterByGenre}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableGenres.map((g) => {
                const checked = filters.genres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      checked
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-[#141626] border-purple-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2 font-gaming">
              {t.filterByRegion}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {availableRegions.map((r) => {
                const checked = filters.regions.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => toggleRegion(r)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      checked
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-[#141626] border-purple-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300 font-gaming">
                {t.filterByPrice}
              </label>
              <span className="text-xs font-bold text-cyan-400 font-gaming">
                {formatPrice(filters.maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-purple-900/30">
            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span>{language === 'ar' ? 'عروض التخفيض فقط' : 'Only Discounted'}</span>
              <input
                type="checkbox"
                checked={filters.onlyDiscounted}
                onChange={(e) => setFilters((prev) => ({ ...prev, onlyDiscounted: e.target.checked }))}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span>{language === 'ar' ? 'المتوفر في المخزن فقط' : 'In Stock Only'}</span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </aside>

        {/* RESULTS GRID */}
        <main className="lg:col-span-3">
          {filteredGames.length === 0 ? (
            <div className="bg-[#0f111e] border border-purple-900/40 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white font-gaming">
                {language === 'ar' ? 'لم يتم العثور على ألعاب مطابقة' : 'No matching games found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {language === 'ar'
                  ? 'جرب تقليل الفلاتر أو البحث بكلمات أخرى للوصول إلى مفاتيح الألعاب المطلوبة.'
                  : 'Try clearing your active filters or searching with a different keyword.'}
              </p>
              <button
                onClick={resetFilters}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors font-gaming"
              >
                {t.clearFilters}
              </button>
            </div>
          ) : layoutMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} layout="horizontal" />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end lg:hidden">
          <div className="bg-[#121424] border-t border-purple-500/40 rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
              <h3 className="font-bold text-white font-gaming text-base">
                {language === 'ar' ? 'فلاتر الألعاب' : 'Game Filters'}
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">{t.filterByPlatform}</label>
              <div className="grid grid-cols-2 gap-2">
                {availablePlatforms.map((p) => {
                  const checked = filters.platforms.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                        checked ? 'bg-purple-600 border-purple-400 text-white' : 'bg-[#181b2e] border-purple-900/40 text-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">{t.filterByGenre}</label>
              <div className="flex flex-wrap gap-1.5">
                {availableGenres.map((g) => {
                  const checked = filters.genres.includes(g);
                  return (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        checked ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-[#181b2e] border-purple-900/40 text-slate-300'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-purple-900/40">
              <button
                onClick={() => {
                  resetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 bg-[#181b2e] text-slate-300 font-bold py-2.5 rounded-xl text-xs"
              >
                {t.clearFilters}
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 bg-cyan-400 text-black font-bold py-2.5 rounded-xl text-xs font-gaming"
              >
                {language === 'ar' ? `عرض (${filteredGames.length}) نتائج` : `Show (${filteredGames.length}) Results`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
