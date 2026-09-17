import React, { useState } from 'react';
import { 
  Gamepad2, 
  KeyRound, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  Lock, 
  CreditCard, 
  Send, 
  CheckCircle2, 
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { language, navigateTo, t, addToast } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      addToast(
        language === 'ar' ? 'تم الاشتراك بنجاح!' : 'Subscribed!',
        language === 'ar' ? 'كود خصم 10%: GAMER10 متاح لك الآن' : 'Your 10% coupon: GAMER10 is ready to use!',
        'success'
      );
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-[#07080d] border-t border-purple-950 text-slate-400 text-sm mt-20 relative overflow-hidden">
      {/* Top Cyber Glow Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-500 to-purple-600 opacity-60" />

      {/* Trust Guarantee Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-purple-950/60">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0f111c] border border-purple-900/30">
            <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t.featureInstantDeliveryTitle}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{language === 'ar' ? 'خلال 3 إلى 5 ثوانٍ بعد الدفع' : '3 to 5 seconds after checkout'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0f111c] border border-purple-900/30">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t.featureGenuineKeysTitle}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{language === 'ar' ? 'مباشرة من الناشرين المعتمدين' : 'Directly from verified publishers'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0f111c] border border-purple-900/30">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t.featureSecurePaymentTitle}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{language === 'ar' ? 'تشفير آمن 256-bit SSL' : '256-bit bank-grade encryption'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0f111c] border border-purple-900/30">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Headphones className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t.featureSupportTitle}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{language === 'ar' ? 'شات مباشر ودعم 24 ساعة' : 'Live chat and assistance 24/7'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 glow-purple">
                <div className="w-full h-full bg-[#0d0e17] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-gaming font-extrabold text-xl tracking-wider text-white">
                  {language === 'ar' ? 'نيكسوس' : 'NEXUS'}
                </span>
                <span className="font-gaming font-extrabold text-xl text-purple-500">
                  {language === 'ar' ? 'كيز' : 'KEYS'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {language === 'ar'
                ? 'المنصة الرائدة في الشرق الأوسط لبيع مفاتيح تفعيل الألعاب الرقمية الأصلية لأجهزة الكمبيوتر والكونسول مع ضمان التسليم الفوري والتلقائي خلال ثوانٍ.'
                : 'The premier destination for authentic digital game CD keys across PC and console ecosystems with guaranteed instant automatic fulfillment.'}
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="block text-xs font-bold text-purple-300 mb-2">
                {language === 'ar' ? 'اشترك واحصل على كود خصم 10% فوري:' : 'Subscribe & get an instant 10% coupon code:'}
              </span>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  className="bg-[#121422] border border-purple-900/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 flex-1 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'اشتراك' : 'Join'}</span>
                </button>
              </form>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تم الاشتراك! كود الخصم: GAMER10' : 'Subscribed! Promo code: GAMER10'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white text-sm mb-4 font-gaming">
              {language === 'ar' ? 'روابط المتجر' : 'Quick Navigation'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-cyan-400 transition-colors">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('catalog')} className="hover:text-cyan-400 transition-colors">
                  {t.navCatalog}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('how-it-works')} className="hover:text-cyan-400 transition-colors">
                  {t.navHowItWorks}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('account')} className="hover:text-cyan-400 transition-colors">
                  {t.navAccount}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-cyan-400 transition-colors">
                  {t.navSupport}
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Platforms */}
          <div>
            <h5 className="font-bold text-white text-sm mb-4 font-gaming">
              {language === 'ar' ? 'المنصات المدعومة' : 'Platforms'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-sky-400">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>Steam (PC Keys)</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                <span>Epic Games Store</span>
              </li>
              <li className="flex items-center gap-2 text-orange-400">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span>EA App / Origin</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Xbox / Microsoft Store</span>
              </li>
              <li className="flex items-center gap-2 text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>PlayStation Network</span>
              </li>
              <li className="flex items-center gap-2 text-indigo-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Ubisoft Connect</span>
              </li>
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h5 className="font-bold text-white text-sm mb-4 font-gaming">
              {language === 'ar' ? 'خدمة العملاء' : 'Customer Support'}
            </h5>
            <div className="space-y-3 text-xs">
              <p className="text-slate-400">
                {language === 'ar' ? 'الدعم الفني متاح 24/7 للرد الفوري على التذاكر واستفسارات التفعيل.' : 'Support is ready 24/7 for key activation & order assistance.'}
              </p>
              <div className="space-y-1">
                <div className="text-slate-300 font-mono">support@nexuskeys.store</div>
                <div className="text-cyan-400 flex items-center gap-1 font-semibold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Discord: NexusKeysCommunity</span>
                </div>
              </div>
              <button
                onClick={() => navigateTo('contact')}
                className="inline-block bg-purple-950/60 hover:bg-purple-900 border border-purple-700/50 text-cyan-300 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors"
              >
                {t.navSupport}
              </button>
            </div>
          </div>
        </div>

        {/* Payment Badges & Copyright */}
        <div className="mt-12 pt-8 border-t border-purple-950/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            © 2026 NexusKeys Inc. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-500 mr-2">{language === 'ar' ? 'طرق الدفع الآمنة:' : 'Secure Payment:'}</span>
            <span className="px-2 py-1 rounded bg-[#131525] border border-purple-900/50 text-slate-300 font-bold font-gaming text-[10px]">
              MADA
            </span>
            <span className="px-2 py-1 rounded bg-[#131525] border border-purple-900/50 text-slate-300 font-bold font-gaming text-[10px]">
              VISA / MASTERCARD
            </span>
            <span className="px-2 py-1 rounded bg-[#131525] border border-purple-900/50 text-slate-300 font-bold font-gaming text-[10px]">
              APPLE PAY
            </span>
            <span className="px-2 py-1 rounded bg-[#131525] border border-purple-900/50 text-slate-300 font-bold font-gaming text-[10px]">
              PAYPAL
            </span>
            <span className="px-2 py-1 rounded bg-[#131525] border border-purple-900/50 text-slate-300 font-bold font-gaming text-[10px]">
              STC PAY
            </span>
            <span className="px-2 py-1 rounded bg-[#131525] border border-purple-900/50 text-emerald-400 font-bold font-gaming text-[10px]">
              USDT
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
