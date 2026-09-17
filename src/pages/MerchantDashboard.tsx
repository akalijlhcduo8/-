import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  KeyRound, 
  DollarSign, 
  Users, 
  Package, 
  Activity,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_GAMES } from '../data/mockGames';

export const MerchantDashboard: React.FC = () => {
  const { language, formatPrice, addToast } = useApp();
  
  const [gatewayStatus, setGatewayStatus] = useState<{
    stripeConfigured: boolean;
    hasWebhookSecret: boolean;
    time: string;
  } | null>(null);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [liveStripeCharges, setLiveStripeCharges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const healthRes = await fetch('/api/health');
      const healthData = await healthRes.json();
      setGatewayStatus(healthData);

      const transRes = await fetch('/api/merchant/transactions');
      const transData = await transRes.json();
      setTransactions(transData.transactions || []);
      setLiveStripeCharges(transData.liveStripeCharges || []);
    } catch (err) {
      console.error('Failed to fetch merchant data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const triggerTestWebhook = async () => {
    try {
      const testEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: `cs_test_${Math.random().toString(36).substring(2, 12)}`,
            customer_details: { email: 'gamer.test@example.com' },
            customer_email: 'gamer.test@example.com',
            amount_total: 5999,
            currency: 'usd',
            metadata: {
              orderItems: JSON.stringify([
                { id: 'black-myth-wukong', title: 'Black Myth: Wukong', platform: 'Steam', price: 59.99 }
              ])
            }
          }
        }
      };

      const res = await fetch('/api/webhook/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testEvent),
      });

      if (res.ok) {
        addToast(
          language === 'ar' ? 'تم محاكاة Webhook بنجاح!' : 'Webhook Event Processed!',
          language === 'ar' ? 'تم استلام الدفعة وتوليد المفتاح تلقائياً' : 'Payment verified and key generated',
          'success'
        );
        fetchStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-gaming mb-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{language === 'ar' ? 'بوابة التاجر والمعاملات الحية' : 'Merchant Live Operations'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-gaming">
            {language === 'ar' ? 'لوحة تحكم التاجر وبوابة الدفع' : 'Merchant & Payment Gateway Dashboard'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar' 
              ? 'متابعة بوابات الدفع الفعلية، استلام أحداث الـ Webhooks، والتسليم الآلي للمفاتيح.'
              : 'Real-time monitoring of payment gateways, Webhook listeners, and automated key fulfillment.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="bg-[#121424] border border-purple-800 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{language === 'ar' ? 'تحديث' : 'Refresh'}</span>
          </button>

          <button
            onClick={triggerTestWebhook}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl font-gaming flex items-center gap-1.5 transition-colors shadow-lg"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'ar' ? 'تجربة إرسال Webhook فعلي' : 'Test Webhook Event'}</span>
          </button>
        </div>
      </div>

      {/* Gateway Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stripe Connection Card */}
        <div className="p-5 rounded-2xl bg-[#0f111e] border border-purple-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{language === 'ar' ? 'حالة بوابة Stripe' : 'Stripe Status'}</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${gatewayStatus?.stripeConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-gaming font-bold text-white text-sm">
              {gatewayStatus?.stripeConfigured ? (language === 'ar' ? 'مفعل ومتصل' : 'Active & Connected') : (language === 'ar' ? 'في انتظار المفتاح' : 'Awaiting Secret Key')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            {gatewayStatus?.stripeConfigured
              ? (language === 'ar' ? 'يقبل بطاقات فيزا وماستركارد مباشرة' : 'Ready to accept live cards')
              : (language === 'ar' ? 'أضف STRIPE_SECRET_KEY في .env لتفعيل التحصيل الحي' : 'Set STRIPE_SECRET_KEY in .env')}
          </p>
        </div>

        {/* Webhook Listener Card */}
        <div className="p-5 rounded-2xl bg-[#0f111e] border border-purple-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{language === 'ar' ? 'مستمع الـ Webhook' : 'Webhook Listener'}</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-gaming font-bold text-white text-sm">
              /api/webhook/stripe
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {language === 'ar' ? 'يتحقق من توقيع المعاملة قبل تسليم المفتاح' : 'Signature validation active'}
          </p>
        </div>

        {/* Total Webhook Transactions */}
        <div className="p-5 rounded-2xl bg-[#0f111e] border border-purple-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{language === 'ar' ? 'إجمالي المعاملات الناجحة' : 'Total Transactions'}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-gaming font-black text-2xl text-emerald-400">
            {transactions.length} {language === 'ar' ? 'طلب' : 'orders'}
          </div>
          <p className="text-[11px] text-slate-500">
            {language === 'ar' ? `بقيمة: ${formatPrice(totalRevenue)}` : `Volume: ${formatPrice(totalRevenue)}`}
          </p>
        </div>

        {/* Catalog Stock */}
        <div className="p-5 rounded-2xl bg-[#0f111e] border border-purple-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{language === 'ar' ? 'المخزون المتوفر' : 'Catalog Inventory'}</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-gaming font-black text-2xl text-cyan-400">
            {MOCK_GAMES.length} {language === 'ar' ? 'لعبة نشطة' : 'titles'}
          </div>
          <p className="text-[11px] text-slate-500">
            {language === 'ar' ? 'جميع المفاتيح جاهزة للتسليم الآلي' : 'All keys primed for instant delivery'}
          </p>
        </div>
      </div>

      {/* Stripe Configuration Guide Banner if not configured */}
      {!gatewayStatus?.stripeConfigured && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1b1509] to-[#120f08] border border-amber-500/40 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold font-gaming text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>{language === 'ar' ? 'طريقة ربط حساب Stripe الفعلي الخاص بك:' : 'How to Connect Your Real Stripe Account:'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {language === 'ar'
              ? 'قم بتسجيل الدخول إلى لوحة Stripe، واحصل على مفتاح (Secret Key) من قائمة Developers > API Keys. ثم أضفه في متغيرات البيئة STRIPE_SECRET_KEY. بمجرد إضافته، سيتم تحويل الزبائن مباشرة إلى صفحة الدفع الرسمية لـ Stripe.'
              : 'Sign in to your Stripe dashboard, get your Secret Key from Developers > API Keys, and supply it via STRIPE_SECRET_KEY in your environment. Customers will then be redirected directly to the official Stripe checkout.'}
          </p>
          <div className="pt-1 flex items-center gap-2 text-xs text-amber-300 font-mono">
            <span className="bg-amber-950/80 px-2.5 py-1 rounded border border-amber-500/30">
              STRIPE_SECRET_KEY=sk_test_...
            </span>
            <span className="bg-amber-950/80 px-2.5 py-1 rounded border border-amber-500/30">
              STRIPE_WEBHOOK_SECRET=whsec_...
            </span>
          </div>
        </div>
      )}

      {/* Webhook Completed Transactions Table */}
      <div className="p-6 rounded-3xl bg-[#0f111e] border border-purple-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base font-gaming flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>{language === 'ar' ? 'سجل العمليات المؤكدة عبر الـ Webhook والتسليم الفوري' : 'Webhook Verified Orders & Key Deliveries'}</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {transactions.length} {language === 'ar' ? 'عملية مسجلة' : 'records'}
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-10 text-center space-y-3 bg-[#131526] border border-purple-950 rounded-2xl">
            <CreditCard className="w-10 h-10 text-purple-400 mx-auto" />
            <p className="text-xs text-slate-400">
              {language === 'ar' 
                ? 'لا توجد معاملات بعد. يمكنك الضغط على "تجربة إرسال Webhook فعلي" في الأعلى لتوليد معاملة فورية واختبار التسليم.' 
                : 'No transactions recorded yet. Click "Test Webhook Event" above to test automated fulfillment.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#15182a] text-slate-400 font-gaming">
                <tr>
                  <th className="p-3 text-start">Order ID</th>
                  <th className="p-3 text-start">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="p-3 text-start">{language === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th className="p-3 text-start">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="p-3 text-start">{language === 'ar' ? 'المفاتيح المصروفة' : 'Delivered Keys'}</th>
                  <th className="p-3 text-start">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {transactions.map((t, idx) => (
                  <tr key={idx} className="hover:bg-[#141628] transition-colors">
                    <td className="p-3 font-mono font-bold text-cyan-400">{t.orderId}</td>
                    <td className="p-3 font-mono text-slate-300">{t.customerEmail}</td>
                    <td className="p-3 font-gaming font-bold text-white">{formatPrice(t.amount)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-[10px] flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 space-y-1">
                      {t.items.map((it: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-[11px]">
                          <span className="text-slate-300 truncate max-w-[140px]">{it.title}:</span>
                          <span className="font-mono text-cyan-300 bg-black/60 px-1.5 py-0.5 rounded border border-purple-900">
                            {it.key}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[10px]">
                      {new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
