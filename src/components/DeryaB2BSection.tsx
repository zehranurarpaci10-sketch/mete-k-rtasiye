import React from 'react';
import {
  Building2,
  Package,
  Truck,
  CreditCard,
  FileSpreadsheet,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Layers,
  Percent,
  TrendingUp,
} from 'lucide-react';
import { DERYA_DEALER_INFO } from '../data/deryaB2BData';

interface DeryaB2BSectionProps {
  onOpenPortal: (tab?: 'products' | 'orders' | 'reports' | 'payment' | 'statement' | 'catalog') => void;
}

export const DeryaB2BSection: React.FC<DeryaB2BSectionProps> = ({ onOpenPortal }) => {
  return (
    <section id="b2b-portal" className="py-12 bg-[#121620] text-white border-y border-slate-800 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Derya Dağıtım A.Ş. · Destek B2B Portalı (b2b.destekkirtasiye.com.tr)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Toptan Kırtasiye Dağıtımı & B2B Cari Yönetimi
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              b2b.destekkirtasiye.com.tr portalı: Cari bakiye & ekstre kontrolü, çanta ve toptan ürün gezintisi, firmaya özel baskı ilaveli sipariş yapılandırması ve cari hesap ile ödeme tamamlama.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenPortal('products')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950/40 transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>Destek B2B Portalı Aç</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Dealer Account Card Banner */}
        <div className="bg-[#1e2535] border border-slate-700/80 rounded-2xl p-5 mb-8 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border-b sm:border-b-0 sm:border-r border-slate-700/80 pb-3 sm:pb-0 sm:pr-4">
            <span className="text-[10px] uppercase font-bold text-slate-400">Bayi & Müşteri Ünvanı</span>
            <div className="font-bold text-sm text-white mt-0.5 truncate" title={DERYA_DEALER_INFO.dealerTitle}>
              {DERYA_DEALER_INFO.dealerTitle}
            </div>
            <div className="text-[11px] text-amber-400 font-mono mt-0.5">
              Kod: {DERYA_DEALER_INFO.dealerCode} · {DERYA_DEALER_INFO.taxOffice}
            </div>
          </div>

          <div className="border-b sm:border-b-0 lg:border-r border-slate-700/80 pb-3 sm:pb-0 sm:pr-4">
            <span className="text-[10px] uppercase font-bold text-slate-400">Cari Bakiye (Güncel Borç)</span>
            <div className="font-mono font-black text-lg text-red-400 mt-0.5">
              {DERYA_DEALER_INFO.currentBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
            </div>
            <div className="text-[11px] text-slate-400">
              Vadesi Geçen: <span className="text-red-400 font-bold">{DERYA_DEALER_INFO.overdueAmount.toLocaleString('tr-TR')} ₺</span>
            </div>
          </div>

          <div className="border-b sm:border-b-0 sm:border-r border-slate-700/80 pb-3 sm:pb-0 sm:pr-4">
            <span className="text-[10px] uppercase font-bold text-slate-400">Tanımlı Risk Limiti</span>
            <div className="font-mono font-black text-lg text-emerald-400 mt-0.5">
              {DERYA_DEALER_INFO.riskLimit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
            </div>
            <div className="text-[11px] text-slate-400">
              Kullanılabilir: <span className="text-emerald-400 font-bold">{DERYA_DEALER_INFO.availableLimit.toLocaleString('tr-TR')} ₺</span>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <button
              onClick={() => onOpenPortal('payment')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Kredi Kartıyla Bakiyeyi Kapat</span>
            </button>
          </div>
        </div>

        {/* Feature Grid based on the Video */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Hızlı Toptan Sipariş */}
          <div
            onClick={() => onOpenPortal('products')}
            className="bg-[#1a202e] border border-slate-700 hover:border-red-500/50 rounded-2xl p-5 transition-all cursor-pointer group shadow-lg hover:shadow-red-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span>Hızlı Toptan Sipariş & İskonto Tablosu</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Barkod, stok kodu, liste fiyatı, %40-%45 bayi iskontoları ve net KDV'li tutar tablosu. Kutu veya koli bazında hızlı sepete ekleme.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-amber-400 font-semibold">%25 - %45 Bayi İskontosu</span>
              <span className="font-mono">Excel Toplu Aktarım</span>
            </div>
          </div>

          {/* Card 2: Sipariş Takip / Detaylı */}
          <div
            onClick={() => onOpenPortal('orders')}
            className="bg-[#1a202e] border border-slate-700 hover:border-red-500/50 rounded-2xl p-5 transition-all cursor-pointer group shadow-lg hover:shadow-red-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span>Sipariş Takip & Kalem Kalem Sevkiyat</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              İrsaliye no, kargo takip numarası, sipariş edilen vs. sevk edilen miktar karşılaştırması ve anlık durum takibi.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-blue-400 font-semibold">Detaylı Kalem İnceleme</span>
              <span className="font-mono">XLS Dışa Aktar</span>
            </div>
          </div>

          {/* Card 3: Sipariş Raporu (Tarih & Durum Filtreli) */}
          <div
            onClick={() => onOpenPortal('reports')}
            className="bg-[#1a202e] border border-slate-700 hover:border-red-500/50 rounded-2xl p-5 transition-all cursor-pointer group shadow-lg hover:shadow-red-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span>Tarih & Durum Bazlı Sipariş Raporu</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Başlangıç-bitiş tarihi seçimi, açık/sevk/faturalanan radyo buton filtreleri, KPI toplamları ve Excel rapor dökümü.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-purple-400 font-semibold">Hızlı Tarih Butonları</span>
              <span className="font-mono">Radyo Buton Filtresi</span>
            </div>
          </div>

          {/* Card 4: Kredi Kartı ile Cari Ödeme & Taksit */}
          <div
            onClick={() => onOpenPortal('payment')}
            className="bg-[#1a202e] border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-5 transition-all cursor-pointer group shadow-lg hover:shadow-emerald-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span>3D Secure Kredi Kartı ile Cari Ödeme</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Bonus, World, Maximum, Axess, Paraf ve Bankkart taksit tablosu, sanal POS, SMS OTP doğrulaması ve tahsilat makbuzu.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">2 - 12 Taksit Oranları</span>
              <span className="font-mono">Anında Bakiye Düşümü</span>
            </div>
          </div>

          {/* Card 5: Cari Hesap Ekstresi */}
          <div
            onClick={() => onOpenPortal('statement')}
            className="bg-[#1a202e] border border-slate-700 hover:border-red-500/50 rounded-2xl p-5 transition-all cursor-pointer group shadow-lg hover:shadow-red-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span>Cari Hesap Ekstresi (Mizan & Hareketler)</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Toptan satış faturaları, sanal POS kredi kartı tahsilatları ve banka havaleleri hareket dökümü ve Excel çıktısı.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-amber-400 font-semibold">Borç / Alacak Bakiyesi</span>
              <span className="font-mono">Ekstre Dökümü</span>
            </div>
          </div>

          {/* Card 6: 2026 Fiyat Listesi */}
          <div
            onClick={() => onOpenPortal('catalog')}
            className="bg-[#1a202e] border border-slate-700 hover:border-red-500/50 rounded-2xl p-5 transition-all cursor-pointer group shadow-lg hover:shadow-red-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span>Derya 2026 Fiyat Listesi & İskonto Kataloğu</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Tek tıkla Excel (.csv / .xlsx) ve PDF olarak tüm kırtasiye ürünlerinin toptan fiyat listesini ve koli miktarlarını indirin.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-red-400 font-semibold">Güncel 2026/1 Fiyatları</span>
              <span className="font-mono">Tek Tıkla İndir</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
