import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  CreditCard,
  Truck,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { CartItem } from '../types/architecture';

interface QuickCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderCompleted: (orderId: string) => void;
}

export const QuickCheckoutModal: React.FC<QuickCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderCompleted,
}) => {
  const [name, setName] = useState('Zehra Nur Arpacı');
  const [phone, setPhone] = useState('0 (542) 987 65 43');
  const [address, setAddress] = useState('Batı Sitesi Mah. 2307 Cad. No: 14/B Yenimahalle / Ankara');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.discountPrice ?? item.price) * item.quantity,
    0
  );
  const shipping = subtotal >= 250 ? 0 : 39.9;
  const grandTotal = subtotal + shipping;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedOrderId = `SIP-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsProcessing(false);
      setOrderSuccess(generatedOrderId);
      onOrderCompleted(generatedOrderId);
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-[#14161b] border border-[#282b35] rounded-3xl w-full max-w-lg text-white shadow-2xl overflow-hidden animate-scaleUp">
        {/* Üst Bar */}
        <div className="p-5 border-b border-[#282b35] bg-[#181a20] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f43f2d] flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-white">
                Hızlı Sipariş Onayı (2 Tık)
              </h3>
              <p className="text-[11px] text-slate-400">
                Sayfa değiştirmeden doğrudan sipariş tamamlama
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252834] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                Siparişiniz Başarıyla Alındı!
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                Sipariş Kodu: #{orderSuccess}
              </h2>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                {name} adına {totalQuantity} adet ürün için siparişiniz sisteme kaydedildi. Hazırlanma süreci SMS ile bildirilecektir.
              </p>
            </div>

            <div className="bg-[#1a1d26] p-4 rounded-2xl border border-[#2d313d] text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Toplam Ürün:</span>
                <span className="text-white">{totalQuantity} Adet</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ödenen Tutar:</span>
                <span className="text-emerald-400 font-bold">{grandTotal.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Teslimat:</span>
                <span className="text-slate-200 truncate max-w-[200px]">{address}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#f43f2d] hover:bg-[#d93424] text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md"
            >
              Alışverişe Devam Et
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirmOrder} className="p-5 space-y-4">
            {/* Teslimat Bilgileri */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Teslimat & İletişim Bilgileri
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Ad Soyad</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1e2029] border border-[#2d313d] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#f43f2d]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Telefon Numarası</span>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#1e2029] border border-[#2d313d] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#f43f2d]"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Teslimat Adresi</span>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#1e2029] border border-[#2d313d] rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-[#f43f2d] resize-none"
                />
              </div>
            </div>

            {/* Ödeme Tercihi */}
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-2">Ödeme Yöntemi</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#1f2330] border-[#f43f2d] text-white'
                      : 'bg-[#181a20] border-[#282b35] text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#f43f2d]" />
                  <div>
                    <div className="text-xs font-bold">Kredi / Banka Kartı</div>
                    <div className="text-[10px] text-slate-400">3D Güvenli Ödeme</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-[#1f2330] border-[#f43f2d] text-white'
                      : 'bg-[#181a20] border-[#282b35] text-slate-400'
                  }`}
                >
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold">Kapıda Ödeme</div>
                    <div className="text-[10px] text-slate-400">Nakit veya POS</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Özet ve Onay */}
            <div className="pt-3 border-t border-[#282b35] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Toplam Ürün ({totalQuantity} Adet):</span>
                <span className="font-mono font-bold text-white">{subtotal.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Kargo Bedeli:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {shipping === 0 ? 'ÜCRETSİZ' : `${shipping.toFixed(2)} TL`}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-[#232630]">
                <span className="font-bold text-white">Toplam Ödenecek:</span>
                <span className="font-mono font-black text-lg text-[#f43f2d]">
                  {grandTotal.toFixed(2)} TL
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#f43f2d] hover:bg-[#d93424] text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all active:scale-98 mt-2"
              >
                {isProcessing ? (
                  <span>Sipariş Oluşturuluyor...</span>
                ) : (
                  <>
                    <span>Siparişi Onayla & Tamamla</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
