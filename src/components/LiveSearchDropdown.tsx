import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  ShoppingCart,
  Check,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { SAMPLE_CATALOG_DATA, METE_CATEGORIES } from '../data/stationeryData';
import { MainCategory, ProductCatalogRow } from '../types/architecture';

interface LiveSearchDropdownProps {
  onSelectCategory?: (category: MainCategory) => void;
  onAddToCart?: (product: ProductCatalogRow | string) => void;
  onOpenQuickView?: (product: ProductCatalogRow) => void;
  onFilterVitrinBySearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const LiveSearchDropdown: React.FC<LiveSearchDropdownProps> = ({
  onSelectCategory,
  onAddToCart,
  onOpenQuickView,
  onFilterVitrinBySearch,
  placeholder = '🔎 Ürün, marka veya kategori ara... (örn: Faber-Castell, A4 Kağıt, Defter)',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [addedItemBarcode, setAddedItemBarcode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Popular search suggestions when search is focused but empty
  const popularKeywords = [
    'Faber-Castell Grip',
    'Rotring Tikky',
    'A4 Kağıt',
    'Gıpta Defter',
    'Kuru Boya',
    'Okul Çantası',
    'Pritt Stick',
    'Fosforlu Kalem',
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation & escape handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter' && query.trim()) {
      handleShowAllInVitrin();
    }
  };

  // Real-time matching categories
  const matchedCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    return METE_CATEGORIES.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(q);
      const matchSub = cat.subCategories.some(
        (sub) =>
          sub.name.toLowerCase().includes(q) ||
          sub.searchKeywords.some((k) => k.toLowerCase().includes(q))
      );
      return matchName || matchSub;
    }).slice(0, 4);
  }, [query]);

  // Real-time matching brands
  const matchedBrands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const brandsSet = new Map<string, number>();
    SAMPLE_CATALOG_DATA.forEach((item) => {
      if (item.brand.toLowerCase().includes(q)) {
        brandsSet.set(item.brand, (brandsSet.get(item.brand) || 0) + 1);
      }
    });

    return Array.from(brandsSet.entries())
      .map(([brand, count]) => ({ brand, count }))
      .slice(0, 4);
  }, [query]);

  // Real-time matching products
  const matchedProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    return SAMPLE_CATALOG_DATA.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchCat = item.mainCategory.toLowerCase().includes(q);
      const matchSub = item.subCategory.toLowerCase().includes(q);
      const matchTags = item.tags ? item.tags.toLowerCase().includes(q) : false;
      const matchBarcode = item.barcode.includes(q);
      const matchSku = item.sku.toLowerCase().includes(q);

      return (
        matchTitle ||
        matchBrand ||
        matchCat ||
        matchSub ||
        matchTags ||
        matchBarcode ||
        matchSku
      );
    }).slice(0, 6); // Top 6 matching products for compact dropdown
  }, [query]);

  const totalMatchesCount = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return 0;

    return SAMPLE_CATALOG_DATA.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.mainCategory.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q) ||
        (item.tags && item.tags.toLowerCase().includes(q))
      );
    }).length;
  }, [query]);

  const handleShowAllInVitrin = () => {
    if (onFilterVitrinBySearch && query.trim()) {
      onFilterVitrinBySearch(query.trim());
    }
    setIsOpen(false);
    const element = document.getElementById('vitrin');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent, item: ProductCatalogRow) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(item);
    }
    setAddedItemBarcode(item.barcode);
    setTimeout(() => {
      setAddedItemBarcode(null);
    }, 2000);
  };

  // Helper to highlight matching text in title
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="text-[#f43f2d] font-black bg-rose-50 px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Arama Input Alanı */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-full pl-5 pr-16 py-2 sm:py-2.5 outline-none border-2 border-transparent focus:border-[#f43f2d] shadow-sm transition-all"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Aramayı Temizle"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleShowAllInVitrin}
            className="p-1.5 rounded-full bg-[#f43f2d] hover:bg-[#d93424] text-white transition-colors cursor-pointer shadow-xs"
            title="Ara"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ===================== CANLI ARAMA DROPDOWN BİLEŞENİ ===================== */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 text-slate-900 overflow-hidden animate-fadeIn">
          {/* DURUM 1: Henüz bir şey yazılmadıysa (Popüler Aramalar & Hızlı Öneriler) */}
          {query.trim().length < 2 && (
            <div className="p-4 bg-slate-50/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#f43f2d]" />
                <span>Popüler Aramalar</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => {
                      setQuery(kw);
                      if (onFilterVitrinBySearch) onFilterVitrinBySearch(kw);
                      const el = document.getElementById('vitrin');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      setIsOpen(false);
                    }}
                    className="text-xs bg-white hover:bg-rose-50 text-slate-700 hover:text-[#f43f2d] px-3 py-1.5 rounded-full border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer font-medium shadow-2xs"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DURUM 2: 2 karakter ve üzeri arama yapılıyorsa */}
          {query.trim().length >= 2 && (
            <div className="max-h-[460px] overflow-y-auto scrollbar-thin">
              {/* Eşleşen Kategoriler & Reyonlar */}
              {matchedCategories.length > 0 && (
                <div className="p-3 bg-slate-50 border-b border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#f43f2d]" />
                    <span>Eşleşen Reyonlar & Kategoriler</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          if (onSelectCategory) onSelectCategory(cat);
                          setIsOpen(false);
                          const el = document.getElementById('vitrin');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-xs font-bold text-slate-800 hover:text-white bg-white hover:bg-[#f43f2d] px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#f43f2d] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 group"
                      >
                        <span>{cat.name}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-white" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Eşleşen Markalar */}
              {matchedBrands.length > 0 && (
                <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    Markalar:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedBrands.map(({ brand, count }) => (
                      <button
                        key={brand}
                        onClick={() => {
                          setQuery(brand);
                          handleShowAllInVitrin();
                        }}
                        className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-[#f43f2d] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        {brand} <span className="text-slate-400 text-[10px]">({count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Eşleşen Ürünler */}
              <div className="p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-[#f43f2d]" />
                    <span>Ürünler ({matchedProducts.length} gösteriliyor)</span>
                  </span>
                  {totalMatchesCount > 0 && (
                    <span className="text-xs text-[#f43f2d] font-bold">
                      Toplam {totalMatchesCount} ürün bulundu
                    </span>
                  )}
                </div>

                {matchedProducts.length === 0 ? (
                  <div className="text-center py-6 px-4">
                    <p className="text-xs text-slate-600 font-medium">
                      "{query}" ile eşleşen ürün bulunamadı.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Lütfen kelimeyi kontrol edin veya ana kategorilerden seçim yapın.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {matchedProducts.map((product) => {
                      const effectivePrice = product.discountPrice ?? product.priceWithVat;
                      const hasDiscount = Boolean(product.discountPrice);
                      const isAdded = addedItemBarcode === product.barcode;

                      return (
                        <div
                          key={product.barcode}
                          onClick={() => {
                            if (onOpenQuickView) {
                              onOpenQuickView(product);
                            }
                            setIsOpen(false);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            {/* Ürün Küçük Görseli */}
                            <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                            </div>

                            {/* Ürün Detayları */}
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 group-hover:text-[#f43f2d] transition-colors truncate">
                                {renderHighlightedText(product.title, query)}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span className="font-semibold text-slate-700">{product.brand}</span>
                                <span>·</span>
                                <span className="truncate">{product.subCategory}</span>
                                <span>·</span>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                    product.stock > 10
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-amber-50 text-amber-700'
                                  }`}
                                >
                                  {product.stock > 10 ? 'Stokta Var' : `Son ${product.stock} Ürün`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Fiyat & Hızlı Sepete Ekle */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="text-sm font-black text-[#f43f2d]">
                                {effectivePrice.toFixed(0)} TL
                              </div>
                              {hasDiscount && (
                                <div className="text-[10px] text-slate-400 line-through">
                                  {product.priceWithVat.toFixed(0)} TL
                                </div>
                              )}
                            </div>

                            <button
                              onClick={(e) => handleAddToCartClick(e, product)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95 ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#f43f2d] hover:bg-[#d93424] text-white'
                              }`}
                              title="Sepete Ekle"
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Eklendi</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  <span>+ Ekle</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Alt Bilgi: Tüm Sonuçları Vitrinde Göster */}
              {totalMatchesCount > 0 && (
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">
                    "{query}" ile ilgili <strong>{totalMatchesCount}</strong> ürün mevcut
                  </span>
                  <button
                    onClick={handleShowAllInVitrin}
                    className="text-xs font-bold text-white bg-[#f43f2d] hover:bg-[#d93424] px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Tüm Sonuçları Vitrinde Listele</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
