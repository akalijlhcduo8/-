import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  KeyRound, 
  Laptop, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  RefreshCcw,
  Headphones
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Platform } from '../types';

export const HowItWorksPage: React.FC = () => {
  const { language, navigateTo } = useApp();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Steam');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      step: '01',
      titleAr: 'اختر لعبتك المفضلة',
      titleEn: 'Choose Your Game',
      descAr: 'تصفح تشكيلة الألعاب الضخمة واختر المنصة التي تناسب جهازك (Steam، Epic، EA، Xbox، إلخ). تأكد من المنطقة الإقليمية (Global/MENA).',
      descEn: 'Browse our massive catalog and select the right platform for your setup. Verify the region tag (Global/MENA).',
      icon: Laptop,
    },
    {
      step: '02',
      titleAr: 'ادفع بأمان عبر بوابتك المفضلة',
      titleEn: 'Pay Securely',
      descAr: 'ادفع ببطاقات الائتمان، Apple Pay، PayPal، STC Pay، أو العملات الرقمية عبر خوادم مشفرة بنسبة 100%.',
      descEn: 'Checkout using credit cards, Apple Pay, PayPal, or crypto via 256-bit SSL encrypted bank gateways.',
      icon: CreditCard,
    },
    {
      step: '03',
      titleAr: 'استلم مفتاحك الرقمي فوراً',
      titleEn: 'Instant Key Delivery',
      descAr: 'تولد خوادمنا الآلية مفتاح التفعيل الرسمي على شاشتك في 3 ثوانٍ فقط مع إرسال نسخة موثقة إلى بريدك الإلكتروني.',
      descEn: 'Our automated system generates your official game key on screen within 3 seconds and emails you a backup receipt.',
      icon: Zap,
    },
    {
      step: '04',
      titleAr: 'فعّل والعب مدى الحياة',
      titleEn: 'Activate & Play Forever',
      descAr: 'انسخ المفتاح، ألصقه في تطبيق المنصة، وابدأ تنزيل اللعبة فوراً لتصبح ملكاً لحسابك مدى الحياة.',
      descEn: 'Paste the key into your launcher, trigger download, and own the game on your profile forever.',
      icon: KeyRound,
    },
  ];

  const platformGuides: Record<Platform, { titleAr: string; titleEn: string; stepsAr: string[]; stepsEn: string[] }> = {
    Steam: {
      titleAr: 'طريقة تفعيل مفتاح Steam:',
      titleEn: 'How to Redeem on Steam:',
      stepsAr: [
        'افتح برنامج Steam على جهاز الكمبيوتر وسجّل الدخول بحسابك.',
        'من القائمة السفلية أو العلوية، انقر على "إضافة لعبة" (Add a Game) ثم "تفعيل منتج على Steam" (Activate a Product on Steam).',
        'وافق على اتفاقية المشترك، ثم الصق كود المفتاح المستلم والمكوّن من 15 رقماً وحرفاً.',
        'ستتم إضافة اللعبة فوراً إلى مكتبتك الدائمة ويمكنك البدء في تحميلها.',
      ],
      stepsEn: [
        'Launch the Steam client on your PC and sign in.',
        'Click "Add a Game" in the lower-left corner, then "Activate a Product on Steam".',
        'Agree to the Subscriber Agreement, then paste your 15-character key.',
        'The game is permanently added to your library ready to download.',
      ],
    },
    Epic: {
      titleAr: 'طريقة تفعيل مفتاح Epic Games:',
      titleEn: 'How to Redeem on Epic Games:',
      stepsAr: [
        'افتح مشغل Epic Games Launcher أو توجه لموقع epicgames.com.',
        'انقر على صورة حسابك في الزاوية العلوية واختر "استرداد رمز" (Redeem Code).',
        'الصق المفتاح وانقر على "استرداد" (Redeem).',
        'ستظهر رسالة التأكيد وستجد اللعبة جاهزة في قائمة "المكتبة" (Library).',
      ],
      stepsEn: [
        'Open Epic Games Launcher or visit epicgames.com.',
        'Click on your profile icon in the top right corner and choose "Redeem Code".',
        'Enter the code and click "Redeem".',
        'Confirm redemption; the title will appear immediately in your Library.',
      ],
    },
    EA: {
      titleAr: 'طريقة تفعيل مفتاح EA App / Origin:',
      titleEn: 'How to Redeem on EA App:',
      stepsAr: [
        'افتح تطبيق EA App على نظام Windows.',
        'انقر على "مجموعتي" (My Collection) ثم انقر على "استرداد رمز" (Redeem Code) في الزاوية العلوية.',
        'أدخل رمز المفتاح واضغط "التالي" للتأكيد.',
        'تبدأ اللعبة بالتحميل مباشرة وتُربط بحساب EA الخاص بك.',
      ],
      stepsEn: [
        'Open EA App on Windows.',
        'Navigate to "My Collection" and click "Redeem Code" in the top right.',
        'Enter your product key and click "Next" to confirm.',
        'The game activates instantly in your EA library.',
      ],
    },
    Ubisoft: {
      titleAr: 'طريقة تفعيل مفتاح Ubisoft Connect:',
      titleEn: 'How to Redeem on Ubisoft Connect:',
      stepsAr: [
        'افتح تطبيق Ubisoft Connect وسجّل الدخول.',
        'انقر على أيقونة القائمة (أعلى اليسار) واختر "تفعيل مفتاح" (Activate a key).',
        'الصق المفتاح واضغط "تفعيل" (Activate).',
        'ستضاف اللعبة مباشرة وتصبح جاهزة للتنزيل.',
      ],
      stepsEn: [
        'Open Ubisoft Connect and sign in.',
        'Click the menu icon on the top-left and select "Activate a key".',
        'Paste the key and press "Activate".',
        'Your game will appear under "Games".',
      ],
    },
    Xbox: {
      titleAr: 'طريقة تفعيل مفتاح Xbox / PC Game Pass:',
      titleEn: 'How to Redeem on Xbox / Windows:',
      stepsAr: [
        'افتح تطبيق Xbox على Windows أو توجه إلى redeem.microsoft.com.',
        'سجل الدخول بحساب Microsoft الخاص بك.',
        'أدخل الرمز المكون من 25 حرفاً واضغط تأكيد.',
        'ستظهر اللعبة في قائمة التنزيلات في متجر Microsoft وتطبيق Xbox.',
      ],
      stepsEn: [
        'Open Xbox App on Windows or navigate to redeem.microsoft.com.',
        'Sign in to your Microsoft account.',
        'Enter the 25-character key and confirm.',
        'Install the game through the Xbox App or Microsoft Store.',
      ],
    },
    PlayStation: {
      titleAr: 'طريقة تفعيل مفتاح PlayStation Store:',
      titleEn: 'How to Redeem on PlayStation Store:',
      stepsAr: [
        'افتح PlayStation Store على جهاز الكونسول أو الموقع الإلكتروني.',
        'انقر على صورة الحساب واختر "استرداد الرمز" (Redeem Code).',
        'أدخل الرمز المكون من 12 رقماً واضغط استرداد.',
        'ستضاف اللعبة لمكتبتك الرقمية فوراً.',
      ],
      stepsEn: [
        'Open PlayStation Store on your console or browser.',
        'Click on your avatar and choose "Redeem Code".',
        'Enter the 12-digit code and hit Redeem.',
        'Game is immediately added to your Game Library.',
      ],
    },
  };

  const faqs = [
    {
      qAr: 'هل مفاتيح الألعاب لديكم رسمية وقانونية 100%؟',
      qEn: 'Are your game keys 100% official and genuine?',
      aAr: 'نعم تماماً، جميع المفاتيح تأتي مباشرة من الناشرين الرسميين والموزعين المعتمدين دولياً. لا نبيع أي حسابات مشتركة أو برامج غير قانونية.',
      aEn: 'Yes, 100%. All keys are sourced directly from authorized global publishers and distributors. We never sell shared accounts or pirated goods.',
    },
    {
      qAr: 'كم من الوقت يستغرق استلام المفتاح بعد إتمام الدفع؟',
      qEn: 'How long does key delivery take after payment?',
      aAr: 'التسليم فوري وآلي بالكامل! يظهر المفتاح مباشرة على شاشتك في غضون 3 ثوانٍ فقط، ويتم إرسال بريد إلكتروني يحتوي على المفتاح وفاتورة الشراء تلقائياً.',
      aEn: 'Delivery is 100% instant and automated! Your key appears on-screen within 3 seconds, and a backup is emailed instantly.',
    },
    {
      qAr: 'ماذا أفعل إذا واجهت مشكلة أثناء تفعيل المفتاح؟',
      qEn: 'What happens if a key does not activate?',
      aAr: 'نقدم ضمان تفعيل ذهبي 100%. في حال واجهت أي خطأ غير متوقع، يتوفر فريق الدعم الفني على مدار الساعة لفحص المفتاح واستبداله فوراً أو استرداد كامل المبلغ.',
      aEn: 'We provide a 100% Golden Activation Guarantee. If any issue arises, 24/7 technical support is on standby to replace it or issue a full refund.',
    },
    {
      qAr: 'ما معنى المفتاح العالمي (Global) مقابل (MENA)؟',
      qEn: 'What does Global region mean compared to MENA?',
      aAr: 'المفتاح العالمي (Global) يعمل في أي دولة في العالم دون قيود. أما مفاتيح (MENA) فهي مخصصة لحسابات منطقة الشرق الأوسط وشمال أفريقيا وتعمل بأسعار تفضيلية.',
      aEn: 'A Global key activates in any country worldwide without VPN or restrictions. MENA keys are region-tailored for Middle East & North Africa accounts.',
    },
    {
      qAr: 'هل المفتاح يعمل لمرة واحدة أم يمكن استخدامه لاحقاً؟',
      qEn: 'Can I gift or keep the key for later use?',
      aAr: 'يمكنك شراء المفتاح وتفعيله في أي وقت تريده، أو إهداؤه لصديقك. وبمجرد تفعيله على حساب المنصة يُربط بالحساب للأبد.',
      aEn: 'Keys do not expire until redeemed. You can keep them or gift them to a friend at any time.',
    },
  ];

  return (
    <div className="space-y-14 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-gaming">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>{language === 'ar' ? 'التسليم الفوري الآلي' : 'Automated Instant Delivery'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-gaming">
          {language === 'ar' ? 'كيف يعمل موقع نكسس كيز؟' : 'How NexusKeys Works'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {language === 'ar'
            ? 'خطوات بسيطة وسريعة تمكنك من شراء مفاتيح ألعابك الأصلية وتفعيلها على حسابك في ثوانٍ معدودة.'
            : 'Simple and fast steps to buy genuine game keys and activate them on your profile in seconds.'}
        </p>
      </div>

      {/* 4 Steps Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div 
              key={i}
              className="p-6 rounded-3xl bg-[#101222] border border-purple-900/40 space-y-4 relative overflow-hidden group hover:border-cyan-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-gaming font-black text-2xl text-purple-600/70 group-hover:text-cyan-400 transition-colors">
                  {st.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 text-cyan-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-bold text-base text-white font-gaming">
                {language === 'ar' ? st.titleAr : st.titleEn}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' ? st.descAr : st.descEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* Platform Activation Instructions with Tabs */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f111e] border border-purple-900/40 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white font-gaming">
            {language === 'ar' ? 'دليل تفعيل المفاتيح حسب المنصة' : 'Platform Activation Guide'}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'ar' ? 'اختر المنصة لمعرفة طريقة الاسترداد خطوة بخطوة:' : 'Select a platform to view step-by-step redemption instructions:'}
          </p>
        </div>

        {/* Platform selectors */}
        <div className="flex flex-wrap gap-2">
          {(['Steam', 'Epic', 'EA', 'Ubisoft', 'Xbox', 'PlayStation'] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all font-gaming ${
                selectedPlatform === p
                  ? 'bg-cyan-400 text-slate-950 shadow-md glow-cyan'
                  : 'bg-[#15182a] border border-purple-900/50 text-slate-300 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Selected Platform Guide Box */}
        <div className="p-6 rounded-2xl bg-[#141628] border border-purple-800/40 space-y-4">
          <h3 className="text-base font-bold text-cyan-300 font-gaming">
            {language === 'ar' ? platformGuides[selectedPlatform].titleAr : platformGuides[selectedPlatform].titleEn}
          </h3>

          <div className="space-y-2.5">
            {(language === 'ar' ? platformGuides[selectedPlatform].stepsAr : platformGuides[selectedPlatform].stepsEn).map((stepText, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-slate-200">
                <span className="w-5 h-5 rounded-full bg-purple-950 border border-purple-600 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{stepText}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guarantees Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#121424] border border-emerald-900/40 space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <h4 className="font-bold text-white text-sm font-gaming">
            {language === 'ar' ? 'ضمان تفعيل 100%' : '100% Activation Guarantee'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'ar'
              ? 'مفاتيح أصلية غير مستخدمة مسبقاً مضمونة مدى الحياة من الناشر الرسمي.'
              : 'Brand new, untouched original CD keys backed by our lifetime activation warranty.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#121424] border border-purple-900/40 space-y-3">
          <RefreshCcw className="w-8 h-8 text-purple-400" />
          <h4 className="font-bold text-white text-sm font-gaming">
            {language === 'ar' ? 'استبدال أو استرجاع فوري' : 'Instant Replacement / Refund'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'ar'
              ? 'في حال وجود أي خطأ غير متوقع في الكود، نقوم باستبداله خلال دقائق دون تأخير.'
              : 'If an activation anomaly occurs, our team verifies and replaces the code within minutes.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#121424] border border-cyan-900/40 space-y-3">
          <Headphones className="w-8 h-8 text-cyan-400" />
          <h4 className="font-bold text-white text-sm font-gaming">
            {language === 'ar' ? 'دعم فني سريع 24/7' : '24/7 Gamer Support'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'ar'
              ? 'فريق متخصص من محبي الألعاب للإجابة على جميع استفسارات التفعيل والتوافق.'
              : 'Our dedicated team of gamers is always available via tickets and live chat.'}
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white font-gaming flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          <span>{language === 'ar' ? 'الأسئلة الشائعة (FAQ)' : 'Frequently Asked Questions'}</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="rounded-2xl bg-[#0f111e] border border-purple-900/40 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-cyan-400 transition-colors"
                >
                  <span>{language === 'ar' ? faq.qAr : faq.qEn}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-purple-950 pt-3">
                    {language === 'ar' ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-cyan-950/40 border border-cyan-500/40 text-center space-y-4">
        <h3 className="text-xl font-black text-white font-gaming">
          {language === 'ar' ? 'جاهز لتجربة لعب لا تُنسى؟' : 'Ready to start gaming?'}
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          {language === 'ar'
            ? 'تصفح أحدث مفاتيح ألعاب الكمبيوتر واستفد من خصومات اليوم الحصرية.'
            : 'Browse the latest PC game keys and grab our hot discounts today.'}
        </p>
        <button
          onClick={() => navigateTo('catalog')}
          className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all font-gaming shadow-lg"
        >
          {language === 'ar' ? 'استعرض مكتبة الألعاب الآن' : 'Explore Game Library Now'}
        </button>
      </div>
    </div>
  );
};
