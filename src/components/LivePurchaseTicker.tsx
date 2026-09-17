import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_GAMES } from '../data/mockGames';

interface BuyerNotification {
  buyer: string;
  buyerEn: string;
  city: string;
  cityEn: string;
  gameId: string;
  timeAgo: string;
  timeAgoEn: string;
}

const BUYER_NOTIFICATIONS: BuyerNotification[] = [
  {
    buyer: 'فيصل العتيبي',
    buyerEn: 'Faisal O.',
    city: 'الرياض',
    cityEn: 'Riyadh',
    gameId: 'cyberpunk-2077',
    timeAgo: 'منذ دقيقة واحدة',
    timeAgoEn: '1 min ago',
  },
  {
    buyer: 'محمد الغامدي',
    buyerEn: 'Mohammed G.',
    city: 'جدة',
    cityEn: 'Jeddah',
    gameId: 'black-myth-wukong',
    timeAgo: 'منذ 3 دقائق',
    timeAgoEn: '3 mins ago',
  },
  {
    buyer: 'خالد المنصوري',
    buyerEn: 'Khaled M.',
    city: 'دبي',
    cityEn: 'Dubai',
    gameId: 'ea-sports-fc-25',
    timeAgo: 'منذ 4 دقائق',
    timeAgoEn: '4 mins ago',
  },
  {
    buyer: 'سلطان القحطاني',
    buyerEn: 'Sultan Q.',
    city: 'الدمام',
    cityEn: 'Dammam',
    gameId: 'elden-ring',
    timeAgo: 'منذ 7 دقائق',
    timeAgoEn: '7 mins ago',
  },
  {
    buyer: 'عبدالله الشمري',
    buyerEn: 'Abdullah S.',
    city: 'الكويت',
    cityEn: 'Kuwait City',
    gameId: 'call-of-duty-black-ops-6',
    timeAgo: 'منذ 9 دقائق',
    timeAgoEn: '9 mins ago',
  },
];

export const LivePurchaseTicker: React.FC = () => {
  const { language, navigateTo } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show initial notification after 3 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Periodically change notification
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % BUYER_NOTIFICATIONS.length);
        setIsVisible(true);
      }, 600);
    }, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed) return null;

  const current = BUYER_NOTIFICATIONS[currentIdx];
  const game = MOCK_GAMES.find((g) => g.id === current.gameId) || MOCK_GAMES[0];

  return (
    <div
      className={`fixed bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} z-40 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-[#121424]/95 border border-purple-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl flex items-center gap-3.5 max-w-sm glow-purple">
        <div className="relative flex-shrink-0">
          <img
            src={game.coverImage}
            alt={game.title}
            className="w-12 h-14 object-cover rounded-xl border border-purple-800/60 shadow"
          />
          <div className="absolute -top-1 -right-1 bg-emerald-500 text-black rounded-full p-0.5 shadow">
            <CheckCircle2 className="w-3 h-3" />
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>
              {language === 'ar'
                ? `${current.buyer} من ${current.city}`
                : `${current.buyerEn} from ${current.cityEn}`}
            </span>
          </div>

          <div
            onClick={() => navigateTo('product', game.id)}
            className="text-xs font-semibold text-white hover:text-cyan-400 cursor-pointer truncate mt-0.5 transition-colors"
          >
            {language === 'ar' ? game.titleAr : game.title}
          </div>

          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-purple-300">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              {language === 'ar' ? 'تم تسليم المفتاح فوراً' : 'Key delivered instantly'}
            </span>
            <span>•</span>
            <span>{language === 'ar' ? current.timeAgo : current.timeAgoEn}</span>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-500 hover:text-white p-1 rounded-md transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
