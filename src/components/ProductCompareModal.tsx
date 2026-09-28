import React, { useState } from 'react';
import {
  X,
  Check,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  Zap,
  ArrowLeftRight,
  Sparkles,
  Plus,
  Trash2,
  Info,
} from 'lucide-react';
import { ProductCatalogRow } from '../types/architecture';
import { BRAND_INFO } from '../data/stationeryData';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductCatalogRow[];
  onRemoveProduct: (barcode: string) => void;
  onClearAll: () => void;
  onAddToCart: (product: ProductCatalogRow, quantity?: number) => void;
  onOpenAddMore?: () => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
  onClearAll,
  onAddToCart,
  onOpenAddMore,
}) => {
  const [highlightDifferences, setHighlightDifferences] = useState<boolean>(true);
  const [addedItemBarcodes, setAddedItemBarcodes] = useState<{ [barcode: string]: boolean }>({});

  if (!isOpen) return null;

  // Find lowest price among compared products
  const lowestPrice = products.length > 1
    ? Math.min(...products.map((p) => p.discountPrice ?? p.priceWithVat))
    : null;

  // Helper to check if values differ across products
  const hasDifference = (getter: (p: ProductCatalogRow) => any): boolean => {
    if (products.length <= 1) return false;
    const firstVal = JSON.stringify(getter(products[0]));
    return products.some((p) => JSON.stringify(getter(p)) !== firstVal);
  };

  const handleAdd = (p: ProductCatalogRow) => {
    onAddToCart(p, 1);
    setAddedItemBarcodes((prev) => ({ ...prev, [p.barcode]: true }));
    setTimeout(() => {
      setAddedItemBarcodes((prev) => ({ ...prev, [p.barcode]: false }));
    }, 2000);
  };

  // Specification Row Definition
  interface SpecRow {
    id: string;
    label: string;
    category: 'fiyat' | 'marka' | 'teknik' | 'stok';
    getValue: (p: ProductCatalogRow) => React.ReactNode;
    rawValue: (p: ProductCatalogRow) => any;
  }

  const specRows: SpecRow[] = [
    // 1. FİYAT & AVANTAJ
    {
      id: 'price',
      label: 'Satış Fiyatı',
      category: 'fiyat',
      rawValue: (p) => p.discountPrice ?? p.priceWithVat,
      getValue: (p) => {
        const effPrice = p.discountPrice ?? p.priceWithVat;
        const isLowest = lowestPrice !== null && effPrice === lowestPrice;
        return (
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-[#f43f2d]">
                {effPrice.toFixed(0)} TL
              </span>
              {p.discountPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {p.priceWithVat.toFixed(0)} TL
                </span>
              )}
            </div>
            {isLowest && products.length > 1 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                En Uygun Fiyat
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'discount',
      label: 'İndirim Oranı',
      category: 'fiyat',
      rawValue: (p) => (p.discountPrice ? Math.round(((p.priceWithVat - p.discountPrice) / p.priceWithVat) * 100) : 0),
      getValue: (p) => {
        if (!p.discountPrice || p.discountPrice >= p.priceWithVat) {
          return <span className="text-slate-400 text-xs">İndirim Yok</span>;
        }
        const pct = Math.round(((p.priceWithVat - p.discountPrice) / p.priceWithVat) * 100);
        return (
          <span className="inline-flex items-center text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg">
            %{pct} İndirimli
          </span>
        );
      },
    },
    {
      id: 'shipping',
      label: 'Kargo Koşulu',
      category: 'fiyat',
      rawValue: (p) => ((p.discountPrice ?? p.priceWithVat) >= 150 || p.badges?.includes('Kargo Bedava') ? 'free' : 'paid'),
      getValue: (p) => {
        const isFree = (p.discountPrice ?? p.priceWithVat) >= 150 || p.badges?.includes('Kargo Bedava');
        return isFree ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
            <Truck className="w-3.5 h-3.5" />
            Ücretsiz Kargo
          </span>
        ) : (
          <span className="text-xs text-slate-500">Standart Kargo (150 TL altı)</span>
        );
      },
    },

    // 2. MARKA & MENŞEİ
    {
      id: 'brand',
      label: 'Marka & Üretici',
      category: 'marka',
      rawValue: (p) => p.brand,
      getValue: (p) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-black text-slate-900 text-sm">{p.brand}</span>
          {BRAND_INFO[p.brand] && (
            <span className="text-[11px] text-slate-500 font-medium">
              {BRAND_INFO[p.brand].country} · Kuruluş {BRAND_INFO[p.brand].foundedYear}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'guarantee',
      label: 'Orijinallik & Kalite',
      category: 'marka',
      rawValue: (p) => BRAND_INFO[p.brand]?.qualityGuarantee || 'Mete Kırtasiye Güvencesi',
      getValue: (p) => (
        <div className="flex items-start gap-1.5 text-xs text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="text-[11px] leading-tight">
            {BRAND_INFO[p.brand]?.qualityGuarantee || '%100 Orijinal Ürün Faturası'}
          </span>
        </div>
      ),
    },

    // 3. TEKNİK SPESİFİKASYONLAR
    {
      id: 'category',
      label: 'Kategori / Reyon',
      category: 'teknik',
      rawValue: (p) => `${p.mainCategory} > ${p.subCategory}`,
      getValue: (p) => (
        <div className="text-xs">
          <span className="font-bold text-slate-800">{p.mainCategory}</span>
          <div className="text-[11px] text-slate-500">{p.subCategory}</div>
        </div>
      ),
    },
    {
      id: 'unit',
      label: 'Satış Birimi',
      category: 'teknik',
      rawValue: (p) => p.unit,
      getValue: (p) => <span className="text-xs font-bold text-slate-800">{p.unit}</span>,
    },
    {
      id: 'vatRate',
      label: 'KDV Oranı',
      category: 'teknik',
      rawValue: (p) => p.vatRate,
      getValue: (p) => <span className="text-xs font-mono font-bold text-slate-700">%{p.vatRate}</span>,
    },
    {
      id: 'safety',
      label: 'Sağlık & Güvenlik',
      category: 'teknik',
      rawValue: () => 'EN-71 / CE',
      getValue: () => (
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          EN-71 & CE Onaylı (Toksiksiz)
        </span>
      ),
    },
    {
      id: 'barcode',
      label: 'Barkod (EAN-13)',
      category: 'teknik',
      rawValue: (p) => p.barcode,
      getValue: (p) => (
        <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {p.barcode}
        </span>
      ),
    },
    {
      id: 'sku',
      label: 'Stok Kodu (SKU)',
      category: 'teknik',
      rawValue: (p) => p.sku,
      getValue: (p) => (
        <span className="font-mono text-xs text-slate-700">{p.sku}</span>
      ),
    },
    {
      id: 'features',
      label: 'Öne Çıkan Özellikler',
      category: 'teknik',
      rawValue: (p) => (p.features ? p.features.join(', ') : p.tags),
      getValue: (p) => {
        if (p.features && p.features.length > 0) {
          return (
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
              {p.features.map((feat, idx) => (
                <li key={idx} className="leading-tight">{feat}</li>
              ))}
            </ul>
          );
        }
        return (
          <span className="text-[11px] text-slate-500">
            {p.tags || 'Standart kırtasiye spesifikasyonu'}
          </span>
        );
      },
    },

    // 4. STOK & TESLİMAT
    {
      id: 'stock',
      label: 'Stok Durumu',
      category: 'stok',
      rawValue: (p) => p.stock,
      getValue: (p) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                p.stock > 15 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs font-bold text-slate-900">
              {p.stock > 15
                ? `Stokta Var (${p.stock} Adet)`
                : p.stock > 0
                ? `Kritik Stok: ${p.stock} Adet Kaldı`
                : 'Tükendi'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            Aynı Gün Kargoda (16:00 öncesi)
          </span>
        </div>
      ),
    },
    {
      id: 'rating',
      label: 'Müşteri Puanı',
      category: 'stok',
      rawValue: (p) => p.rating ?? 4.9,
      getValue: (p) => (
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold text-slate-900 ml-1">
              {p.rating ?? 4.9}
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            ({p.reviewCount ?? 128} yorum)
          </span>
        </div>
      ),
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-fadeIn overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl relative border border-slate-200 my-auto animate-scaleUp max-h-[92vh] flex flex-col overflow-hidden">
        {/* MODAL ÜST BAŞLIK BARI */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-linear-to-r from-slate-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-rose-500 to-[#f43f2d] flex items-center justify-center text-white shadow-sm shrink-0">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                  Ürün Karşılaştırma
                </h2>
                <span className="bg-[#f43f2d] text-white text-xs font-black px-2 py-0.5 rounded-full shadow-2xs">
                  {products.length} / 3 Ürün
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Fiyat, marka, stok ve teknik özellikleri yan yana kıyaslayın.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Farkları Vurgula Toggle Switch */}
            {products.length > 1 && (
              <button
                onClick={() => setHighlightDifferences(!highlightDifferences)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  highlightDifferences
                    ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                title="Ürünler arasındaki farklı özellikleri vurgular"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    highlightDifferences ? 'bg-amber-500 border-amber-600 text-white' : 'border-slate-400'
                  }`}
                >
                  {highlightDifferences && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span>Farkları Vurgula</span>
                {highlightDifferences && (
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded font-black">
                    Açık
                  </span>
                )}
              </button>
            )}

            {/* Tümünü Temizle */}
            {products.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#f43f2d] hover:bg-rose-50 transition-colors cursor-pointer"
                title="Karşılaştırma listesini temizle"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Temizle</span>
              </button>
            )}

            {/* Kapat Butonu */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===================== İÇERİK ALANI ===================== */}
        {products.length === 0 ? (
          <div className="p-12 text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <ArrowLeftRight className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Karşılaştırmak İçin Ürün Seçilmedi
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              Vitrin üzerindeki ürün kartlarında bulunan <strong>"Karşılaştır"</strong> butonuna tıklayarak en fazla 3 ürünü buraya ekleyebilirsiniz.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#f43f2d] hover:bg-[#d93424] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
            >
              Vitrindeki Ürünlere Göz At
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
            {/* Ürünler Karşılaştırma Tablosu */}
            <div className="overflow-x-auto pb-2 scrollbar-thin">
              <div
                className="min-w-[640px] grid gap-4"
                style={{
                  gridTemplateColumns: `200px repeat(${Math.max(products.length, products.length < 3 ? products.length + 1 : 3)}, minmax(200px, 1fr))`,
                }}
              >
                {/* 1. ÜST SATIR: ÜRÜN KARTLARI */}
                <div className="flex flex-col justify-end pb-3">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Kriterler & Detaylar
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {highlightDifferences && (
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                        <Info className="w-3 h-3" />
                        Renkli satırlar farklılıkları gösterir
                      </span>
                    )}
                  </div>
                </div>

                {products.map((product) => {
                  const effectivePrice = product.discountPrice ?? product.priceWithVat;
                  const isLowest = lowestPrice !== null && effectivePrice === lowestPrice && products.length > 1;
                  const isAdded = Boolean(addedItemBarcodes[product.barcode]);

                  return (
                    <div
                      key={product.barcode}
                      className="bg-white rounded-2xl border-2 border-slate-200 p-3.5 flex flex-col justify-between shadow-2xs hover:border-[#f43f2d]/50 transition-all relative group"
                    >
                      {/* Kaldır Butonu */}
                      <button
                        onClick={() => onRemoveProduct(product.barcode)}
                        className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer z-10"
                        title="Karşılaştırmadan Çıkar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* En Uygun Fiyat Rozeti */}
                      {isLowest && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            En Uygun
                          </span>
                        </div>
                      )}

                      {/* Ürün Görseli */}
                      <div>
                        <div className="w-full aspect-square rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-2.5 mb-2.5">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-contain hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Marka & Başlık */}
                        <div className="text-[11px] font-black text-[#f43f2d] uppercase tracking-wide">
                          {product.brand}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 min-h-[32px] mt-0.5" title={product.title}>
                          {product.title}
                        </h4>
                      </div>

                      {/* Fiyat ve Sepete Ekle Butonu */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black text-[#f43f2d]">
                            {effectivePrice.toFixed(0)} TL
                          </span>
                          {product.discountPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              {product.priceWithVat.toFixed(0)} TL
                            </span>
                          )}
                        </div>

                        <button
                          disabled={product.stock <= 0}
                          onClick={() => handleAdd(product)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : product.stock <= 0
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-[#f43f2d] hover:bg-[#d93424] text-white active:scale-98'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Eklendi</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>{product.stock <= 0 ? 'Tükendi' : 'Sepete Ekle'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Eğer 3 üründen az seçilmişse: Boş Slot (+ Ürün Ekle) */}
                {products.length < 3 && (
                  <div
                    onClick={() => {
                      if (onOpenAddMore) onOpenAddMore();
                      else onClose();
                    }}
                    className="border-2 border-dashed border-slate-200 hover:border-[#f43f2d] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-rose-50/30 group min-h-[260px]"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 group-hover:border-[#f43f2d] flex items-center justify-center text-slate-400 group-hover:text-[#f43f2d] mb-2.5 transition-colors shadow-2xs">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#f43f2d] transition-colors">
                      + Ürün Ekle ({3 - products.length} Boş Slot)
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[150px] leading-tight">
                      Vitrinden bir ürün daha ekleyerek 3'lü karşılaştırın.
                    </p>
                  </div>
                )}

                {/* ===================== SPESİFİKASYON VE FARKLILIK SATIRLARI ===================== */}
                {specRows.map((row) => {
                  const isDiff = hasDifference(row.rawValue);
                  const isHighlighted = highlightDifferences && isDiff;

                  return (
                    <React.Fragment key={row.id}>
                      {/* Sol Etiket Hücresi */}
                      <div
                        className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold ${
                          isHighlighted
                            ? 'bg-amber-50/90 text-amber-950 border border-amber-200 font-black'
                            : 'bg-slate-50 text-slate-700 border border-slate-100'
                        }`}
                      >
                        <span>{row.label}</span>
                        {isHighlighted && (
                          <span className="text-[9px] uppercase tracking-wider bg-amber-200/90 text-amber-900 px-1.5 py-0.5 rounded font-black shrink-0 ml-1">
                            Farklı
                          </span>
                        )}
                      </div>

                      {/* Her Ürün İçin Değer Hücresi */}
                      {products.map((product) => (
                        <div
                          key={`${row.id}-${product.barcode}`}
                          className={`p-3 rounded-xl text-xs flex items-center transition-colors ${
                            isHighlighted
                              ? 'bg-amber-50/40 border border-amber-200/80 font-medium'
                              : 'bg-white border border-slate-100 hover:bg-slate-50/60'
                          }`}
                        >
                          {row.getValue(product)}
                        </div>
                      ))}

                      {/* Boş slot için boş hücre */}
                      {products.length < 3 && (
                        <div className="p-3 rounded-xl border border-dashed border-slate-100 bg-slate-50/30 flex items-center justify-center text-[11px] text-slate-400">
                          —
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODAL ALT FOOTER */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tüm ürünler Mete Kırtasiye güvencesiyle %100 orijinal ve faturalıdır.</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {products.length < 3 && onOpenAddMore && (
              <button
                onClick={onOpenAddMore}
                className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                + Başka Ürün Ekle
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
