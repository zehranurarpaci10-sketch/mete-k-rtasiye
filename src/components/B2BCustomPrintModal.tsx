import React, { useState } from 'react';
import { X, Check, Upload, Palette, Layers, FileCheck, ShieldCheck, Printer } from 'lucide-react';
import { B2BProduct, B2BCustomPrintConfig } from '../types/b2b';

interface B2BCustomPrintModalProps {
  product: B2BProduct;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAndAddToCart: (
    product: B2BProduct,
    quantity: number,
    customPrint: B2BCustomPrintConfig
  ) => void;
}

export const B2BCustomPrintModal: React.FC<B2BCustomPrintModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirmAndAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(10); // Standard prompt requested 10 units
  const [hasCustomPrint, setHasCustomPrint] = useState<boolean>(true);
  const [printNote, setPrintNote] = useState<string>('Ürüne özel baskı ilavesi yapılacaktır');
  const [printType, setPrintType] = useState<
    'Sıcak Transfer Baskı (DTF)' | 'Serigrafi Baskı' | 'Nakış Arma' | 'UV Renkli Baskı' | 'Reflektif Baskı'
  >('Sıcak Transfer Baskı (DTF)');
  const [printLocation, setPrintLocation] = useState<string>('Ön Cep Üstü - Merkez');
  const [firmName, setFirmName] = useState<string>('METE KİTAP KIRTASİYE LİMİTED ŞİRKETİ');
  const [logoFileName, setLogoFileName] = useState<string>('METE_KIRTASIYE_KURUMSAL_LOGO.pdf');

  if (!isOpen) return null;

  const unitNet = product.netPrice;
  const totalNet = unitNet * quantity;
  const totalVat = totalNet * (product.vatRate / 100);
  const grandTotal = totalNet + totalVat;

  const handleSave = () => {
    const config: B2BCustomPrintConfig = {
      hasCustomPrint,
      printNote,
      printType,
      logoFileName,
      printLocation,
      unitPrintFee: 0,
      firmName,
    };
    onConfirmAndAddToCart(product, quantity, config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#1e293b] border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700/80 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Çanta Özel Baskı & Sipariş Yapılandırması</h3>
              <p className="text-xs text-slate-400 font-mono">
                {product.code} · {product.title}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {/* Product Preview Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-700">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {/* Simulated Custom Print Overlay */}
              {hasCustomPrint && (
                <div className="absolute inset-x-2 bottom-3 bg-red-600/90 text-white text-[9px] font-bold py-1 px-1.5 rounded text-center shadow-lg border border-red-400 backdrop-blur-xs">
                  {firmName.split(' ')[0]} LOGOLU
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1 text-center sm:text-left">
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {product.brand} · {product.category}
              </div>
              <h4 className="font-bold text-white text-sm">{product.title}</h4>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                <span className="text-slate-400">
                  Liste Fiyatı: <del className="font-mono">{product.listPrice.toFixed(2)} ₺</del>
                </span>
                <span className="text-red-400 font-bold font-mono">%{product.discountRate} İskonto</span>
                <span className="text-amber-400 font-bold font-mono text-sm">
                  Net: {product.netPrice.toFixed(2)} ₺ + KDV
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-white block">Sipariş Adedi:</span>
              <span className="text-[11px] text-slate-400">Senaryo gereği toptan 10 adet önerilmektedir.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => setQuantity(10)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${
                  quantity === 10
                    ? 'bg-red-600/30 text-red-300 border-red-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                10 Adet (Hedef)
              </button>
            </div>
          </div>

          {/* Custom Print Option Banner */}
          <div className="border border-red-500/40 rounded-2xl bg-gradient-to-br from-red-950/40 to-slate-900/80 p-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCustomPrint}
                  onChange={(e) => setHasCustomPrint(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <span className="font-bold text-white text-sm">
                  Bu Ürün Tarzı Baz Alınacak, Üzerine Firmamıza Ait Özel Baskı İlavesi Yapılacaktır
                </span>
              </label>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                Ücretsiz Numune Baskı
              </span>
            </div>

            {hasCustomPrint && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                {/* Required Exact Note Field */}
                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1">
                    Özel Not / Baskı Talebi Metni (Sistem Kaydı & Sipariş Notu):
                  </label>
                  <input
                    type="text"
                    value={printNote}
                    onChange={(e) => setPrintNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-white font-bold text-xs focus:outline-none focus:border-amber-400 shadow-inner"
                    placeholder="Ürüne özel baskı ilavesi yapılacaktır"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    * Kullanıcı talebine uygun olarak <strong className="text-white">"{printNote}"</strong> ifadesi sipariş önizleme fişine ve üretim emrine otomatik işlenir.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Özel Baskı Türü:
                    </label>
                    <select
                      value={printType}
                      onChange={(e: any) => setPrintType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                    >
                      <option value="Sıcak Transfer Baskı (DTF)">Sıcak Transfer Baskı (DTF) - Tavsiye Edilen</option>
                      <option value="Serigrafi Baskı">Serigrafi Baskı</option>
                      <option value="Nakış Arma">Nakış Arma / Kabartma</option>
                      <option value="UV Renkli Baskı">UV Renkli Baskı</option>
                      <option value="Reflektif Baskı">Reflektif Güvenlik Baskı</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Baskı Konumu:
                    </label>
                    <select
                      value={printLocation}
                      onChange={(e) => setPrintLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                    >
                      <option value="Ön Cep Üstü - Merkez">Ön Cep Üstü - Merkez (Videodaki Tarz)</option>
                      <option value="Sağ Yan Cep / Matara Bölmesi">Sağ Yan Cep / Matara Bölmesi</option>
                      <option value="Üst Kapak / Omuz Askısı">Üst Kapak / Omuz Askısı</option>
                    </select>
                  </div>
                </div>

                {/* Logo & Company Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Firma / Bayi Ünvanı:
                    </label>
                    <input
                      type="text"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Yüklü Vektör / Logo Dosyası:
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
                      <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate font-mono text-[11px]">{logoFileName}</span>
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Önizleme & Üretim Şartnamesi Özeti:</span>
                  </div>
                  <div className="text-slate-300">
                    "{product.title}" model çanta üzerine, <strong>{firmName}</strong> için{' '}
                    <strong className="text-white">{printLocation}</strong> bölgesine{' '}
                    <strong className="text-white">{printType}</strong> uygulanacak; not: <em>'{printNote}'</em>.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Birim Net Alış Fiyatı:</span>
              <span className="font-mono text-white">{unitNet.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Sipariş Miktarı:</span>
              <span className="font-mono text-white font-bold">{quantity} Adet</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Özel Baskı Bedeli:</span>
              <span className="font-mono text-emerald-400 font-bold">0,00 ₺ (Kampanyalı / Ücretsiz)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>KDV (%20):</span>
              <span className="font-mono text-white">{totalVat.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
              <span>Genel Toplam (KDV Dahil):</span>
              <span className="font-mono text-amber-400 text-base">
                {grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-700/80 bg-slate-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Önizleme Kaydını Oluştur & Sepete {quantity} Adet Ekle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
