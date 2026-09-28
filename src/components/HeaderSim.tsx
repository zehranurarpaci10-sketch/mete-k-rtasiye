import React, { useState, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  Phone,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  Backpack,
  PenTool,
  Palette,
  FolderArchive,
  Scissors,
  Gift,
  Check,
  Tag,
  Printer,
  Package,
  User,
  HelpCircle,
  Home,
  Store,
  Building2,
} from 'lucide-react';
import { METE_CATEGORIES, SAMPLE_CATALOG_DATA } from '../data/stationeryData';
import { MainCategory, ProductCatalogRow } from '../types/architecture';
import { LiveSearchDropdown } from './LiveSearchDropdown';

interface HeaderSimProps {
  onSelectCategory?: (category: MainCategory) => void;
  activeCategoryId?: string;
  cartCount: number;
  cartTotalAmount?: number;
  onAddToCart: (product: ProductCatalogRow | string) => void;
  onOpenCartPreview?: () => void;
  onOpenPrintModal?: () => void;
  onFilterVitrinBySearch?: (query: string) => void;
  onOpenQuickView?: (product: ProductCatalogRow) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Backpack':
      return <Backpack className="w-4 h-4" />;
    case 'BookOpen':
      return <BookOpen className="w-4 h-4" />;
    case 'PenTool':
      return <PenTool className="w-4 h-4" />;
    case 'Palette':
      return <Palette className="w-4 h-4" />;
    case 'FolderArchive':
      return <FolderArchive className="w-4 h-4" />;
    case 'Scissors':
      return <Scissors className="w-4 h-4" />;
    case 'Gift':
      return <Gift className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

export const HeaderSim: React.FC<HeaderSimProps> = ({
  onSelectCategory,
  activeCategoryId,
  cartCount,
  cartTotalAmount = 0,
  onAddToCart,
  onOpenCartPreview,
  onOpenPrintModal,
  onFilterVitrinBySearch,
  onOpenQuickView,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<MainCategory | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [activeNavTab, setActiveNavTab] = useState('anasayfa');
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (cat: MainCategory) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setHoveredCategory(cat);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 180);
  };

  return (
    <header className="w-full bg-[#1e2025] text-white border-b border-[#2d3038] sticky top-0 z-40 shadow-md">
      {/* 1. Üst Bar: Logo ve Arama Kutusu (Kullanıcı görselindeki tam tonlama) */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Logo: Mete Kırtasiye (Canlı Kırmızı-Mercan Rengi) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-[#2c2f37] transition-colors"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <a href="#" className="flex flex-col group">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#f43f2d] font-heading hover:brightness-110 transition-all">
              Mete Kırtasiye
            </span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
              www.metekirtasiye.com.tr · Hızlı Kırtasiye & Baskı Merkezi
            </span>
          </a>
        </div>

        {/* ===================== CANLI ARAMA (LIVE SEARCH) BİLEŞENİ - MASAÜSTÜ ===================== */}
        <div className="flex-1 max-w-lg hidden md:block">
          <LiveSearchDropdown
            onSelectCategory={onSelectCategory}
            onAddToCart={onAddToCart}
            onFilterVitrinBySearch={onFilterVitrinBySearch}
            onOpenQuickView={onOpenQuickView}
          />
        </div>

        {/* Sağ: İletişim, WhatsApp Sipariş Hattı & Hızlı Sepet */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* WhatsApp ile Hızlı Sipariş Hattı Butonu */}
          <a
            href="https://wa.me/905429876543?text=Merhaba%2C%20Mete%20K%C4%B1rtasiye%27den%20sipari%C5%9F%20vermek%20ve%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] hover:text-emerald-300 px-3 py-2 rounded-xl text-xs font-bold border border-[#25D366]/30 transition-all cursor-pointer shadow-xs"
            title="WhatsApp Üzerinden Hızlı Sipariş Ver"
          >
            <span className="text-sm">💬</span>
            <span className="hidden sm:inline">WhatsApp Sipariş</span>
          </a>

          {/* Online Fotokopi & Baskı Hizmeti Butonu */}
          <button
            onClick={() => {
              if (onOpenPrintModal) onOpenPrintModal();
            }}
            className="flex items-center gap-1.5 bg-[#252830] hover:bg-[#323642] text-rose-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold border border-rose-500/30 transition-all cursor-pointer shadow-xs"
            title="PDF Yükle & Fotokopi / Tez Spiral Cilt Hesapla"
          >
            <Printer className="w-3.5 h-3.5 text-[#f43f2d]" />
            <span className="hidden md:inline">Online Fotokopi</span>
          </button>

          <div className="hidden xl:flex flex-col text-right">
            <span className="text-[10px] text-slate-400 leading-none">Müşteri Destek & Sipariş</span>
            <a
              href="tel:03122700000"
              className="text-xs font-bold text-white flex items-center gap-1 justify-end mt-0.5 hover:text-[#f43f2d] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#f43f2d]" />
              0 (312) 270 00 00
            </a>
          </div>

          <button
            onClick={() => {
              if (onOpenCartPreview) {
                onOpenCartPreview();
              }
            }}
            className="flex items-center gap-2 bg-[#f43f2d] hover:bg-[#d93424] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer group"
            title="Sepet Önizleme (Sayfa Yenilenmeden Açılır)"
          >
            <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-1.5">
              <span>Sepet ({cartCount})</span>
              {cartTotalAmount > 0 && (
                <span className="hidden sm:inline-block font-mono text-[11px] bg-black/25 px-1.5 py-0.5 rounded-md text-amber-200">
                  {cartTotalAmount.toFixed(0)} TL
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* ===================== CANLI ARAMA (LIVE SEARCH) BİLEŞENİ - MOBİL ===================== */}
      <div className="md:hidden px-4 pb-3 pt-0.5 border-t border-[#2d3038]/60 bg-[#1e2025]">
        <LiveSearchDropdown
          onSelectCategory={onSelectCategory}
          onAddToCart={onAddToCart}
          onFilterVitrinBySearch={onFilterVitrinBySearch}
          onOpenQuickView={onOpenQuickView}
          placeholder="🔎 Ürün veya kategori ara..."
        />
      </div>

      {/* 2. Müşteri Navigasyon Menüsü (Ana Sayfa, Kırtasiye Vitrini, Kampanyalar, Baskı, Sepet, İletişim) */}
      <div className="border-t border-[#2d3038] bg-[#1e2025] px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs font-semibold">
            {/* Kırmızı Buton: Ana Sayfa */}
            <a
              href="#"
              onClick={() => setActiveNavTab('anasayfa')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeNavTab === 'anasayfa'
                  ? 'bg-[#f43f2d] text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#2a2d35]'
              }`}
            >
              <span>🏠</span>
              <span>Ana Sayfa</span>
            </a>

            <a
              href="#vitrin"
              onClick={() => setActiveNavTab('vitrin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeNavTab === 'vitrin'
                  ? 'bg-[#f43f2d] text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#2a2d35]'
              }`}
            >
              <span>🛍️</span>
              <span>Tüm Ürünler / Vitrin</span>
            </a>

            <a
              href="#senaryolar"
              onClick={() => setActiveNavTab('kampanyalar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeNavTab === 'kampanyalar'
                  ? 'bg-[#f43f2d] text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#2a2d35]'
              }`}
            >
              <span>🎁</span>
              <span>İhtiyaç Paketleri</span>
            </a>

            <button
              onClick={() => {
                setActiveNavTab('baski');
                if (onOpenPrintModal) onOpenPrintModal();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeNavTab === 'baski'
                  ? 'bg-[#f43f2d] text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#2a2d35]'
              }`}
            >
              <span>🖨️</span>
              <span>Fotokopi & Tez Cilt</span>
            </button>

            <button
              onClick={() => {
                if (onOpenCartPreview) {
                  onOpenCartPreview();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#2a2d35] transition-colors cursor-pointer"
            >
              <span>🛒</span>
              <span>Sepetim ({cartCount})</span>
            </button>

            <a
              href="#iletisim"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#2a2d35] transition-colors"
            >
              <span>☎️</span>
              <span>Mağaza & İletişim</span>
            </a>
          </nav>

          <div className="flex items-center gap-2 text-[11px] text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Aynı Gün Kargo · Saat 16:00'ya Kadar</span>
          </div>
        </div>
      </div>

      {/* 3. 7 Ana Kategori Çubuğu (Mete Kırtasiye Mega Menü Gezinme Ağacı) */}
      <nav
        className="hidden lg:block bg-[#16181c] border-t border-[#2d3038] relative"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <ul className="flex items-center -mb-px">
            {METE_CATEGORIES.map((cat) => {
              const isCurrent = activeCategoryId === cat.id;
              const isHovered = hoveredCategory?.id === cat.id;

              return (
                <li
                  key={cat.id}
                  onMouseEnter={() => handleMouseEnter(cat)}
                  className="relative"
                >
                  <button
                    onClick={() => onSelectCategory && onSelectCategory(cat)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                      isCurrent || isHovered
                        ? 'text-white border-[#f43f2d] bg-[#22252c]'
                        : 'text-slate-300 border-transparent hover:text-white hover:border-slate-500'
                    }`}
                  >
                    <span className="text-[#f43f2d]">{getCategoryIcon(cat.iconName)}</span>
                    <span>{cat.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        isHovered ? 'rotate-180 text-[#f43f2d]' : ''
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
            <Tag className="w-3.5 h-3.5" />
            <span>Okula Dönüş Özel Fiyatları</span>
          </div>
        </div>

        {/* 4. Mega Menü Paneli (Hover açılır, temiz ve koyu tema uyumlu) */}
        {hoveredCategory && (
          <div
            onMouseEnter={() => handleMouseEnter(hoveredCategory)}
            onMouseLeave={handleMouseLeave}
            className="absolute left-0 right-0 top-full bg-white text-slate-900 border-b border-slate-200 shadow-2xl py-6 z-50 animate-fadeIn"
          >
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-12 gap-6">
              {/* Sol: 4-6 Doğrudan Alt Kategori Listesi */}
              <div className="col-span-4 border-r border-slate-100 pr-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-1.5 rounded-md bg-rose-50 text-[#f43f2d]">
                    {getCategoryIcon(hoveredCategory.iconName)}
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {hoveredCategory.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {hoveredCategory.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  {hoveredCategory.subCategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory(hoveredCategory);
                        setHoveredCategory(null);
                      }}
                      className="w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-rose-50 text-slate-700 hover:text-[#f43f2d] transition-colors text-xs font-medium group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#f43f2d] transition-colors"></span>
                        <span>{sub.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {sub.itemCount} ürün
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(hoveredCategory);
                      setHoveredCategory(null);
                    }}
                    className="text-xs font-bold text-[#f43f2d] hover:text-[#d93424] flex items-center gap-1 group"
                  >
                    <span>Tüm {hoveredCategory.name} Ürünlerini Gör</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Orta: En Popüler / En Çok Aranan Ürünler */}
              <div className="col-span-5 pr-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Popüler Alt Başlıklar & Arama Terimleri
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {hoveredCategory.subCategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-rose-200 transition-colors"
                    >
                      <div className="text-xs font-bold text-slate-800 mb-1">
                        {sub.name}
                      </div>
                      <ul className="text-[11px] text-slate-500 space-y-0.5">
                        {sub.popularItems.slice(0, 2).map((item, idx) => (
                          <li key={idx} className="truncate">
                            · {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-800">Öne Çıkan Markalar:</span>
                  <div className="flex flex-wrap gap-1.5 text-slate-600">
                    {hoveredCategory.featuredBrands.map((brand, i) => (
                      <span key={i} className="hover:text-[#f43f2d] cursor-pointer">
                        {brand}
                        {i < hoveredCategory.featuredBrands.length - 1 ? ' ·' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sağ: Satış Odaklı Kırmızı-Bordo Kampanya Kartı (Görseldeki Tonlama) */}
              <div className="col-span-3">
                <div className="h-full bg-linear-to-r from-[#44181c] via-[#8c2227] to-[#f43f2d] rounded-xl p-4 text-white flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                      Mete Kırtasiye Fırsatı
                    </span>
                    <h5 className="text-sm font-bold mt-2.5 text-white leading-snug">
                      {hoveredCategory.bannerText}
                    </h5>
                    <p className="text-xs text-rose-100 mt-1.5 leading-relaxed">
                      Eksiksiz kırtasiye sepetinizi tek tıkla tamamlayın, kapınıza gelsin.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(hoveredCategory);
                      setHoveredCategory(null);
                    }}
                    className="mt-4 w-full bg-white hover:bg-slate-100 text-[#f43f2d] font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{hoveredCategory.bannerCta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 5. Mobil Gezinme Menüsü (Responsive Drawer) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-slate-900/70 z-50 animate-fadeIn">
          <div className="w-4/5 max-w-sm h-full bg-[#1e2025] text-white shadow-2xl p-4 overflow-y-auto border-r border-[#2d3038]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d3038] mb-3">
              <span className="text-xs font-bold text-[#f43f2d] uppercase">
                Mete Kırtasiye Menü
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobil Canlı Arama */}
            <div className="mb-3.5">
              <LiveSearchDropdown
                onSelectCategory={(cat) => {
                  if (onSelectCategory) onSelectCategory(cat);
                  setMobileMenuOpen(false);
                }}
                onAddToCart={onAddToCart}
                onFilterVitrinBySearch={(q) => {
                  if (onFilterVitrinBySearch) onFilterVitrinBySearch(q);
                  setMobileMenuOpen(false);
                }}
                placeholder="🔎 Ürün veya kategori ara..."
              />
            </div>

            {/* Mobil Hızlı Butonlar */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#f43f2d] text-white p-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1"
              >
                <span>🏠 Ana Sayfa</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenPrintModal) onOpenPrintModal();
                }}
                className="bg-[#2c2f37] hover:bg-[#383c46] text-white p-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1"
              >
                <span>🖨️ Baskı</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <a
                href="#vitrin"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#2a2d35] hover:bg-[#383c46] text-white p-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1"
              >
                <span>🛍️ Vitrin</span>
              </a>
              <a
                href="https://wa.me/905429876543?text=Merhaba%2C%20Mete%20K%C4%B1rtasiye%27den%20sipari%C5%9F%20vermek%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] p-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1"
              >
                <span>💬 WhatsApp</span>
              </a>
            </div>

            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Kategoriler
            </div>

            <div className="space-y-1">
              {METE_CATEGORIES.map((cat) => {
                const isExpanded = expandedMobileCategory === cat.id;

                return (
                  <div key={cat.id} className="border-b border-[#2a2d35] pb-1">
                    <button
                      onClick={() =>
                        setExpandedMobileCategory(isExpanded ? null : cat.id)
                      }
                      className="w-full flex items-center justify-between py-2.5 px-2 text-xs font-bold text-slate-200 hover:text-[#f43f2d]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#f43f2d]">{getCategoryIcon(cat.iconName)}</span>
                        <span>{cat.name}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="pl-6 pr-2 py-2 space-y-1.5 bg-[#17181c] rounded-lg mb-2">
                        {cat.subCategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              if (onSelectCategory) onSelectCategory(cat);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full text-left text-xs py-1.5 text-slate-300 hover:text-[#f43f2d] flex items-center justify-between"
                          >
                            <span>{sub.name}</span>
                            <span className="text-[10px] text-slate-500">{sub.itemCount}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
