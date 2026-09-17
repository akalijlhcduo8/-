import React, { useState } from 'react';
import { 
  Headphones, 
  Mail, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { language, addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [category, setCategory] = useState<'key_activation' | 'order_inquiry' | 'payment_issue' | 'partnership'>('key_activation');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      addToast(
        language === 'ar' ? 'تم استلام تذكرتك!' : 'Ticket Received!',
        language === 'ar' ? 'سيقوم فريق الدعم الفني بالرد خلال 15 دقيقة' : 'Our team will respond within 15 minutes',
        'success'
      );
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-cyan-300 text-xs font-bold font-gaming">
          <Headphones className="w-3.5 h-3.5 text-cyan-400" />
          <span>{language === 'ar' ? 'مركز المساعدة والدعم الفني 24/7' : '24/7 Gamer Support Center'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-gaming">
          {language === 'ar' ? 'تواصل مع فريق الدعم' : 'Contact Support'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          {language === 'ar'
            ? 'فريقنا متواجد على مدار الساعة للرد على استفساراتكم وحل أي مشكلة تخص مفاتيح الألعاب وتفعيلها.'
            : 'Our specialists are available 24/7 to assist with key redemption, orders, and inquiries.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Support Channels & Info (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0f111e] border border-purple-900/40 space-y-4">
            <h3 className="font-bold text-white text-base font-gaming flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{language === 'ar' ? 'قنوات المساعدة السريعة' : 'Instant Channels'}</span>
            </h3>

            <div className="space-y-3">
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141628] border border-purple-900/50 hover:border-indigo-500 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">
                      {language === 'ar' ? 'مجتمع الدعم على Discord' : 'Discord Gamer Server'}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {language === 'ar' ? 'رد فوري من المشرفين' : 'Direct live chat assistance'}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </a>

              <a
                href="mailto:support@nexuskeys.store"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141628] border border-purple-900/50 hover:border-cyan-400 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-cyan-400 transition-colors">
                      support@nexuskeys.store
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {language === 'ar' ? 'للاستفسارات الرسمية والتجارية' : 'Direct email support'}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121424] border border-purple-900/40 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-gaming">
              <Clock className="w-4 h-4" />
              <span>{language === 'ar' ? 'متوسط سرعة الاستجابة' : 'Average Response Time'}</span>
            </div>
            <p className="text-slate-300">
              {language === 'ar'
                ? 'يتم الرد على التذاكر واستفسارات التفعيل في غضون أقل من 15 دقيقة.'
                : 'Tickets and activation help requests are resolved within 15 minutes.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'ar' ? 'ضمان حل المشكلة أو الاسترجاع' : 'Guaranteed resolution or refund'}</span>
            </div>
          </div>
        </div>

        {/* Contact / Ticket Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f111e] border border-purple-900/40 shadow-2xl space-y-6">
            <h3 className="font-bold text-white text-lg font-gaming">
              {language === 'ar' ? 'فتح تذكرة دعم فني جديدة' : 'Open a Support Ticket'}
            </h3>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-[#141628] border border-emerald-500/40 rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white font-gaming">
                  {language === 'ar' ? 'تم إرسال تذكرتك بنجاح!' : 'Your Ticket Has Been Submitted!'}
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  {language === 'ar'
                    ? 'رقم التذكرة: #TK-8421. تم إرسال إشعار تأكيد إلى بريدك وسيتواصل معك فني الدعم قريباً.'
                    : 'Ticket #TK-8421. We have sent a confirmation email and will follow up shortly.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl font-gaming"
                >
                  {language === 'ar' ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1.5">{language === 'ar' ? 'الاسم' : 'Name'}</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'ar' ? 'اسمك الكريم' : 'Your name'}
                      className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1.5">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1.5">{language === 'ar' ? 'رقم الطلب (إن وجد)' : 'Order ID (Optional)'}</label>
                    <input
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="NX-123456"
                      className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1.5">{language === 'ar' ? 'نوع الاستفسار' : 'Inquiry Category'}</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="key_activation">{language === 'ar' ? 'مساعدة في تفعيل المفتاح' : 'Key Activation Help'}</option>
                      <option value="order_inquiry">{language === 'ar' ? 'استفسار عن طلب سابق' : 'Order Status Inquiry'}</option>
                      <option value="payment_issue">{language === 'ar' ? 'مشكلة في الدفع' : 'Payment Issue'}</option>
                      <option value="partnership">{language === 'ar' ? 'شراكات وتوزيع' : 'Partnership & Wholesale'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1.5">{language === 'ar' ? 'تفاصيل المشكلة أو الرسالة' : 'Message Details'}</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب تفاصيل طلبك بالتفصيل هنا...' : 'Provide as much detail as possible...'}
                    className="w-full bg-[#15182a] border border-purple-900/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 disabled:opacity-50 text-slate-950 font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all font-gaming shadow-lg shadow-cyan-400/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (language === 'ar' ? 'إرسال التذكرة الآن' : 'Submit Ticket')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
