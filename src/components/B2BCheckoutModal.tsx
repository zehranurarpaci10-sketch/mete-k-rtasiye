import React, { useState } from 'react';
import {
  X,
  Check,
  Building2,
  MapPin,
  CreditCard,
  Printer,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { B2BCartItem, B2BCariAccount, B2BOrder } from '../types/b2b';

interface B2BCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: B2BCartItem[];
  dealerInfo: B2BCariAccount;
  onConfirmOrder: (orderData: {
    paymentType: 'Cari Hesap' | 'Kredi Kartı (Sanal POS)' | 'Vadeli Çek';
    invoiceAddress: string;
    notes: string;
  }) => B2BOrder;
}

export const B2BCheckoutModal: React.FC<B2BCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  dealerInfo,
  onConfirmOrder,
}) => {
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    'Cari Hesap' | 'Kredi Kartı (Sanal POS)' | 'Vadeli Çek'
  >('Cari Hesap');
  const [invoiceAddress, setInvoiceAddress] = useState<string>(
    `${dealerInfo.dealerTitle}\n${dealerInfo.address}\n${dealerInfo.taxOffice} - V.N: ${dealerInfo.taxNumber}`
  );
  const [orderNotes, setOrderNotes] = useState<string>(
    'Ürüne özel baskı ilavesi yapılacaktır. Firma vektör logomuz sisteme iletilmiştir, numune onayı sonrası seri üretime geçilsin.'
  );
  const [completedOrder, setCompletedOrder] = useState<B2BOrder | null>(null);

  if (!isOpen) return null;

  const totalUnits = cartItems.reduce((sum, item) => sum + item.totalUnits, 0);
  const totalNet = cartItems.reduce((sum, item) => sum + item.itemNetTotal, 0);
  const totalVat = cartItems.reduce(
    (sum, item) => sum + item.itemNetTotal * (item.product.vatRate / 100),
    0
  );
  const grandTotal = totalNet + totalVat;

  const handleComplete = () => {
    const newOrd = onConfirmOrder({
      paymentType: selectedPaymentType,
      invoiceAddress,
      notes: orderNotes,
    });
    setCompletedOrder(newOrd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#1e293b] border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn text-slate-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700/80 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {completedOrder ? 'Toptan Sipariş & Özel Baskı Onay Belgesi' : 'Sipariş & Cari Ödeme Onayı'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                b2b.destekkirtasiye.com.tr · Derya Dağıtım A.Ş. Destek B2B
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {completedOrder ? (
            /* SUCCESS STATE */
            <div className="space-y-5">
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">
                  Toptan Siparişiniz Başarıyla Oluşturuldu & Üretime Alındı!
                </h4>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  Sipariş No: <strong className="font-mono text-amber-400">{completedOrder.id}</strong> ·
                  Cari hesabınız üzerinden provizyon ayrılmıştır.
                </p>
              </div>

              {/* Order Document Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                  <span>Belge / İrsaliye No:</span>
                  <span className="text-white font-bold">{completedOrder.documentNo}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                  <span>Sipariş Tarihi:</span>
                  <span className="text-white">{completedOrder.orderDate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                  <span>Ödeme Türü:</span>
                  <span className="text-amber-400 font-bold">{completedOrder.paymentType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                  <span>Toplam Miktar:</span>
                  <span className="text-white font-bold">{totalUnits} Adet</span>
                </div>
                <div className="flex justify-between text-slate-300 font-bold text-sm pt-1">
                  <span>Genel Toplam (KDV Dahil):</span>
                  <span className="text-emerald-400">
                    {completedOrder.totalNetAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </span>
                </div>
              </div>

              {/* Custom Print & Notes Box */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <FileCheck className="w-4 h-4" />
                  <span>Özel Baskı & İmalat Şartnamesi (Sipariş Kaydına İşlendi):</span>
                </div>
                <p className="text-slate-200 font-sans italic bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  "{completedOrder.notes}"
                </p>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1 font-sans">
                  <span>Taşıyıcı / Sevk: <strong>{completedOrder.carrier}</strong></span>
                  <span>·</span>
                  <span>Takip Kodu: <strong className="font-mono text-amber-400">{completedOrder.trackingNo}</strong></span>
                </div>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <div className="space-y-5">
              {/* Step 4 Check Info Banner */}
              <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <div className="text-slate-300">
                  <strong className="text-white">Sepet ve Süreç Tamamlama Adımı:</strong> Lütfen fatura adresi, ürün adetleri ve cari hesap ödeme seçeneğini kontrol edip onaylayınız.
                </div>
              </div>

              {/* Products List in Cart */}
              <div className="space-y-2">
                <span className="font-bold text-slate-300 block">Sipariş Edilecek Ürünler & Adetler:</span>
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 border-b border-slate-800 last:border-b-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{item.product.title}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Kod: {item.product.code} · {item.product.brand}
                          </div>
                          {item.customPrint?.hasCustomPrint && (
                            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                              <span>✓ Özel Baskı Talebi: "{item.customPrint.printNote}"</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-amber-400 text-sm">
                          {item.totalUnits} Adet
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.itemNetTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺ + KDV
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Address Field */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Fatura & Teslimat Adresi:</span>
                </label>
                <textarea
                  rows={3}
                  value={invoiceAddress}
                  onChange={(e) => setInvoiceAddress(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Special Print Note / Order Requirement (Highlighted) */}
              <div className="space-y-1.5">
                <label className="font-bold text-amber-300 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Özel Not / Baskı Talebi (Sipariş Kaydına İşlenecek):</span>
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-amber-500/50 text-white font-semibold text-xs focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-400 block">
                  * Sipariş oluşturma adımında <strong className="text-white">'Ürüne özel baskı ilavesi yapılacaktır'</strong> detayı üretim irsaliyesine otomatik aktarılır.
                </span>
              </div>

              {/* Payment Type Selection */}
              <div className="space-y-2">
                <span className="font-bold text-slate-300 block">Ödeme Seçeneği:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Cari Hesap (Target) */}
                  <label
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-1.5 cursor-pointer transition-all ${
                      selectedPaymentType === 'Cari Hesap'
                        ? 'bg-red-600/20 border-red-500 ring-1 ring-red-500/50'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">Cari Hesap / Açık Hesap</span>
                      <input
                        type="radio"
                        name="paymentType"
                        value="Cari Hesap"
                        checked={selectedPaymentType === 'Cari Hesap'}
                        onChange={() => setSelectedPaymentType('Cari Hesap')}
                        className="text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      30 Gün Vadeli · Risk Limitinden Düşüm
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Limit: {dealerInfo.availableLimit.toLocaleString('tr-TR')} ₺
                    </span>
                  </label>

                  {/* Option 2: Sanal POS */}
                  <label
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-1.5 cursor-pointer transition-all ${
                      selectedPaymentType === 'Kredi Kartı (Sanal POS)'
                        ? 'bg-red-600/20 border-red-500 ring-1 ring-red-500/50'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">Kredi Kartı (3D POS)</span>
                      <input
                        type="radio"
                        name="paymentType"
                        value="Kredi Kartı (Sanal POS)"
                        checked={selectedPaymentType === 'Kredi Kartı (Sanal POS)'}
                        onChange={() => setSelectedPaymentType('Kredi Kartı (Sanal POS)')}
                        className="text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">Tüm Banka Kartlarına 12 Taksit</span>
                    <span className="text-[10px] font-mono text-slate-400">3D Güvenli Ödeme</span>
                  </label>

                  {/* Option 3: Vadeli Çek */}
                  <label
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-1.5 cursor-pointer transition-all ${
                      selectedPaymentType === 'Vadeli Çek'
                        ? 'bg-red-600/20 border-red-500 ring-1 ring-red-500/50'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">Vadeli Çek / Senet</span>
                      <input
                        type="radio"
                        name="paymentType"
                        value="Vadeli Çek"
                        checked={selectedPaymentType === 'Vadeli Çek'}
                        onChange={() => setSelectedPaymentType('Vadeli Çek')}
                        className="text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">60 - 90 Gün Bayi Çeki</span>
                    <span className="text-[10px] font-mono text-slate-400">Genel Merkez Onaylı</span>
                  </label>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Toplam Ürün Miktarı:</span>
                  <span className="font-mono text-white font-bold">{totalUnits} Adet</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Net Ara Toplam:</span>
                  <span className="font-mono text-white">
                    {totalNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>KDV Tutarı:</span>
                  <span className="font-mono text-white">
                    {totalVat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Genel Toplam (Cari Hesaba Borç Kaydedilecek):</span>
                  <span className="font-mono text-amber-400 text-base">
                    {grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-700/80 bg-slate-900 flex items-center justify-between gap-3">
          {completedOrder ? (
            <>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Sipariş Fişini Yazdır</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer"
              >
                Tamamlandı & Sipariş Takibine Dön
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
              >
                İptal / Sepete Dön
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Siparişi Onayla & Süreci Tamamla</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
