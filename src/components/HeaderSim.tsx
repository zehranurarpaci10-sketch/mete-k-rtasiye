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
import { MainCategory } from '../types/architecture';

interface HeaderSimProps {
  onSelectCategory?: (category: MainCategory) => void;
  activeCategoryId?: string;
  cartCount: number;
  cartTotalAmount?: number;
  onAddToCart: (productTitle: string) => void;
  onOpenCartPreview?: () => void;
  onOpenPrintModal?: () => void;
  onOpenSellerAuth?: () => void;
  isSellerLoggedIn?: boolean;
  onOpenDeryaB2B?: (tab?: 'products' | 'orders' | 'reports' | 'payment' | 'statement' | 'catalog') => void;
  onOpenMeteB2B?: () => void;
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
  onOpenSellerAuth,
  isSellerLoggedIn,
  onOpenDeryaB2B,
  onOpenMeteB2B,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<MainCategory | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
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

  // Filtered live results for autocomplete search
  const searchResults = searchQuery.trim().length > 1
    ? SAMPLE_CATALOG_DATA.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.mainCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const matchedCategories = searchQuery.trim().length > 1
    ? METE_CATEGORIES.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.subCategories.some((sub) =>
            sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.searchKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
          )
      )
    : [];

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

        {/* Görseldeki gibi Yuvarlak Beyaz Arama Kutusu */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              placeholder="🔎 Ürün veya kategori ara..."
              className="w-full bg-white text-slate-900 placeholder:text-slate-500 text-xs sm:text-sm rounded-full pl-5 pr-10 py-2 sm:py-2.5 outline-none border-2 border-transparent focus:border-[#f43f2d] shadow-sm transition-all"
            />
            <Search className="w-4 h-4 text-purple-600 absolute right-4 top-3" />
          </div>

          {searchFeedback && (
            <div className="absolute left-0 right-0 -top-8 bg-[#f43f2d] text-white text-xs px-3 py-1 rounded-md shadow-sm flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>{searchFeedback}</span>
            </div>
          )}

          {/* Anlık Canlı Arama Sonuç Penceresi (Autocomplete Dropdown) */}
          {searchFocused && searchQuery.trim().length > 1 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 z-50 text-slate-900 animate-fadeIn">
              {matchedCategories.length > 0 && (
                <div className="mb-3 pb-2 border-b border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    İlgili Kategoriler
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onMouseDown={() => onSelectCategory && onSelectCategory(cat)}
                        className="text-xs font-medium text-slate-700 hover:text-[#f43f2d] bg-slate-100 hover:bg-rose-50 px-2.5 py-1 rounded-md transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Eşleşen Ürünler ({searchResults.length})
                </div>
                {searchResults.length === 0 ? (
                  <div className="text-xs text-slate-500 py-3 text-center">
                    "{searchQuery}" için ürün bulunamadı. Lütfen ana kategorilere göz atın.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {searchResults.map((item) => (
                      <div
                        key={item.barcode}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-9 h-9 object-cover rounded border border-slate-200"
                          />
                          <div>
                            <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {item.mainCategory} · {item.brand}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-bold text-[#f43f2d]">
                            {item.discountPrice ? item.discountPrice : item.priceWithVat} TL
                          </div>
                          <button
                            onMouseDown={() => {
                              onAddToCart(item.title);
                              setSearchFeedback(`"${item.title}" sepete eklendi!`);
                              setTimeout(() => setSearchFeedback(null), 2500);
                            }}
                            className="text-xs bg-[#f43f2d] hover:bg-[#d93424] text-white px-2.5 py-1.5 rounded-md transition-colors font-semibold whitespace-nowrap cursor-pointer"
                          >
                            + Ekle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sağ: İletişim, B2B Toptan Portalı, Satıcı Girişi & Hızlı Sepet */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mete Kırtasiye B2B Kurumsal Katalog Portalı Butonu */}
          <button
            onClick={() => {
              if (onOpenMeteB2B) onOpenMeteB2B();
              else if (onOpenDeryaB2B) onOpenDeryaB2B('products');
            }}
            className="flex items-center gap-1.5 bg-[#1b253b] hover:bg-[#253350] text-amber-300 hover:text-amber-200 px-3 py-2 rounded-xl text-xs font-bold border border-amber-500/40 transition-all cursor-pointer shadow-xs"
            title="Mete Kırtasiye Kurumsal B2B Online Katalog & Sipariş Portalı"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Mete B2B Katalog</span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
              Toptan & Özel Baskı
            </span>
          </button>

          {/* Sadece Satıcının Göreceği Panele Geçiş Butonu (Trendyol Partner stili) */}
          <button
            onClick={onOpenSellerAuth}
            className="flex items-center gap-1.5 bg-[#252830] hover:bg-[#323642] text-amber-300 hover:text-amber-200 px-3 py-2 rounded-xl text-xs font-bold border border-amber-500/30 transition-all cursor-pointer shadow-xs"
            title="Sadece Yetkili Satıcı & Stok Ekranı"
          >
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {isSellerLoggedIn ? 'Satıcı Paneli' : 'Satıcı Girişi'}
            </span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Partner
            </span>
          </button>

          <div className="hidden xl:flex flex-col text-right">
            <span className="text-[10px] text-slate-400 leading-none">Hızlı Destek & Sipariş</span>
            <span className="text-xs font-bold text-white flex items-center gap-1 justify-end mt-0.5">
              <Phone className="w-3 h-3 text-[#f43f2d]" />
              0 (312) 270 00 00
            </span>
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

      {/* 2. Görseldeki Alt Navigasyon Menüsü (Ana Sayfa, Kampanyalar, Baskı, Siparişler, Sepet, Üyelik, İletişim) */}
      <div className="border-t border-[#2d3038] bg-[#1e2025] px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs font-semibold">
            {/* Görseldeki gibi Kırmızı Buton: Ana Sayfa */}
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
              href="#senaryolar"
              onClick={() => setActiveNavTab('kampanyalar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeNavTab === 'kampanyalar'
                  ? 'bg-[#f43f2d] text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#2a2d35]'
              }`}
            >
              <span>🎁</span>
              <span>Kampanyalar</span>
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
              <span>Baskı Hizmeti</span>
            </button>

            <a
              href="#excel-format"
              onClick={() => setActiveNavTab('siparisler')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeNavTab === 'siparisler'
                  ? 'bg-[#f43f2d] text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#2a2d35]'
              }`}
            >
              <span>📦</span>
              <span>Siparişler & Excel</span>
            </a>

            <button
              onClick={() => {
                if (onOpenCartPreview) {
                  onOpenCartPreview();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#2a2d35] transition-colors cursor-pointer"
            >
              <span>🛒</span>
              <span>Sepet ({cartCount})</span>
            </button>

            <a
              href="#ux-raporu"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#2a2d35] transition-colors"
            >
              <span>👤</span>
              <span>Üyelik / Kurumsal</span>
            </a>

            <a
              href="#iletisim"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#2a2d35] transition-colors"
            >
              <span>☎️</span>
              <span>İletişim</span>
            </a>

            <button
              onClick={onOpenSellerAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-amber-300 hover:text-amber-200 hover:bg-[#2a2d35] transition-colors cursor-pointer font-bold"
            >
              <span>🏪</span>
              <span>Satıcı Portalı</span>
            </button>

            <button
              onClick={() => {
                if (onOpenDeryaB2B) onOpenDeryaB2B('products');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-[#2a2d35] transition-colors cursor-pointer font-bold"
            >
              <span>🏢</span>
              <span>Derya Dağıtım B2B</span>
            </button>
          </nav>

          <div className="flex items-center gap-2 text-[11px] text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Aynı Gün Kargoda</span>
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
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenDeryaB2B) onOpenDeryaB2B('products');
                }}
                className="bg-[#2a1717] border border-red-500/40 text-red-300 p-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1"
              >
                <span>🏢 Derya B2B</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenSellerAuth) onOpenSellerAuth();
                }}
                className="bg-[#252830] border border-amber-500/30 text-amber-300 p-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1"
              >
                <span>🏪 Satıcı Paneli</span>
              </button>
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
