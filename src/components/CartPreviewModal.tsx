import React, { useEffect, useRef } from 'react';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { CartItem } from '../types/architecture';

interface CartPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (barcode: string, delta: number) => void;
  onRemoveItem: (barcode: string) => void;
  onClearCart: () => void;
  lastAddedItem?: CartItem | null;
  onCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD = 250; // 250 TL üzeri kargo bedava

export const CartPreviewModal: React.FC<CartPreviewModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  lastAddedItem,
  onCheckout,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Toplam ürün sayısı ve toplam tutar hesaplama
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.discountPrice ?? item.price) * item.quantity,
    0
  );

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);
  const freeShippingProgress = Math.min(
    100,
    Math.round((totalAmount / FREE_SHIPPING_THRESHOLD) * 100)
  );

  // Esc tuşu ile kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sepet Önizleme"
      className="fixed inset-0 z-50 overflow-hidden flex justify-end"
    >
      {/* Sayfa Geçişi Olmadan Karartma / Backdrop (Tıklanınca kapanır) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Sağdan Açılan Sepet Önizleme Çekmecesi / Popover */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md sm:max-w-lg bg-[#14161b] text-slate-100 h-full shadow-2xl border-l border-[#282b35] flex flex-col z-10 animate-slideInRight"
      >
        {/* 1. Üst Bar: Başlık, Toplam Adet Rozeti ve Kapat */}
        <div className="p-4 sm:p-5 border-b border-[#282b35] bg-[#181a20] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f43f2d] text-white flex items-center justify-center shadow-md">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white font-heading">
                  Sepet Önizleme
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  {totalItemCount} Ürün
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sayfa yenilenmeden canlı sepet ve tutar özeti
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#252834] transition-colors cursor-pointer"
            title="Kapat (Alışverişe Devam Et)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Son Eklenen Ürün Vurgusu (Eğer az önce bir ürün eklendiyse) */}
        {lastAddedItem && (
          <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-4 py-2.5 flex items-center gap-2.5 text-xs text-emerald-300 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-white">Sepete Eklendi:</span>{' '}
              <span className="text-emerald-200">{lastAddedItem.title}</span>
            </div>
          </div>
        )}

        {/* 3. Ücretsiz Kargo İlerleme Çubuğu */}
        <div className="p-3.5 bg-[#191b22] border-b border-[#232630]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Truck className="w-3.5 h-3.5 text-[#f43f2d]" />
              {freeShippingRemaining === 0 ? (
                <span className="text-emerald-400 font-bold">
                  🎉 Tebrikler! Kargo Ücretsiz!
                </span>
              ) : (
                <span>
                  Kargo Bedava için:{' '}
                  <strong className="text-white font-mono">
                    {freeShippingRemaining.toFixed(2)} TL
                  </strong>{' '}
                  kaldı
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {FREE_SHIPPING_THRESHOLD} TL Limiti
            </span>
          </div>

          <div className="w-full bg-[#101115] rounded-full h-2 overflow-hidden border border-[#2d313d]">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                freeShippingRemaining === 0
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-amber-500 to-[#f43f2d]'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* 4. Sepetteki Ürünlerin Listesi (Kaydırılabilir Alan) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1e2029] border border-[#282b35] flex items-center justify-center text-slate-500">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Sepetiniz Boş</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Kırtasiye vitrininden defter, kalem veya fotokopi hizmeti ekleyebilirsiniz.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 bg-[#f43f2d] hover:bg-[#d93424] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>Ürünleri İncele</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {cartItems.map((item) => {
                const isJustAdded = lastAddedItem?.barcode === item.barcode;
                const unitPrice = item.discountPrice ?? item.price;
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={item.barcode}
                    className={`p-3 rounded-2xl border transition-all ${
                      isJustAdded
                        ? 'bg-[#1a1f2c] border-emerald-500/40 shadow-sm ring-1 ring-emerald-500/20'
                        : 'bg-[#181a20] border-[#282b35] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Ürün Görseli */}
                      <div className="w-14 h-14 rounded-xl bg-slate-900 border border-[#282b35] overflow-hidden shrink-0 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Resim yüklenemezse ikon göster
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-slate-500" />
                        )}
                      </div>

                      {/* Ürün Bilgisi */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.barcode)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Ürünü Sepetten Çıkar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {item.brand} · {item.category}
                        </div>

                        {/* Adet Kontrolü ve Fiyat */}
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#232630]">
                          <div className="flex items-center gap-1.5 bg-[#121418] border border-[#2b2f3a] rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.barcode, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#252834] transition-colors cursor-pointer"
                              title="Adet Azalt"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs font-bold text-white w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.barcode, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#252834] transition-colors cursor-pointer"
                              title="Adet Artır"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-mono font-black text-xs text-white">
                              {itemTotal.toFixed(2)} TL
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Birim: {unitPrice.toFixed(2)} TL
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Alt Sabit Özet Barı (Toplam Adet & Toplam Tutar ve Aksiyonlar) */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#181a20] border-t border-[#282b35] space-y-3">
            {/* Toplam Adet ve Fiyat Dağılımı */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sepetteki Toplam Adet:</span>
                <span className="font-bold text-white font-mono">
                  {totalItemCount} Adet Ürün
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Kargo Tutarı:</span>
                <span className="font-mono font-bold">
                  {freeShippingRemaining === 0 ? (
                    <span className="text-emerald-400">ÜCRETSİZ</span>
                  ) : (
                    <span className="text-slate-300">39.90 TL</span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#282b35] text-sm">
                <div>
                  <span className="font-black text-white block font-heading">
                    Ödenecek Toplam Tutar
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    KDV Dahil Net Fiyat
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-xl text-[#f43f2d]">
                    {(
                      totalAmount + (freeShippingRemaining === 0 ? 0 : 39.9)
                    ).toFixed(2)}{' '}
                    TL
                  </span>
                </div>
              </div>
            </div>

            {/* Eylemler: Siparişi Tamamla & Alışverişe Devam Et */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onCheckout}
                className="w-full bg-[#f43f2d] hover:bg-[#d93424] text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all active:scale-98"
              >
                <span>Siparişi Tamamla ({totalItemCount} Ürün)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={onClose}
                  className="w-full bg-[#242731] hover:bg-[#2e323e] text-slate-300 hover:text-white font-semibold py-2 px-3 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Alışverişe Devam Et (Sayfada Kal)
                </button>

                <button
                  onClick={onClearCart}
                  className="px-3 py-2 text-[11px] text-slate-400 hover:text-rose-400 font-medium transition-colors cursor-pointer whitespace-nowrap"
                  title="Tüm sepeti boşalt"
                >
                  Sepeti Temizle
                </button>
              </div>
            </div>

            {/* Güvenlik & Hızlı İade Taahhüdü */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-[#232630]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Güvenli 256-Bit SSL · 14 Gün Kolay İade · Ankara İçi Hızlı Teslimat</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
