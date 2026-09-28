import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Check,
  ChevronRight,
  Search,
  Filter,
  Eye,
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Heart,
  Zap,
  SlidersHorizontal,
  Plus,
  Minus,
  ZoomIn,
  ThumbsUp,
  Share2,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowLeftRight,
} from 'lucide-react';
import { SAMPLE_CATALOG_DATA, METE_CATEGORIES, BRAND_INFO } from '../data/stationeryData';
import { MainCategory, ProductCatalogRow } from '../types/architecture';
import { ProductCompareModal } from './ProductCompareModal';

interface ProductGridShowcaseProps {
  selectedCategory: MainCategory | null;
  onSelectCategory: (cat: MainCategory) => void;
  onAddToCart: (product: ProductCatalogRow | string, quantity?: number) => void;
  products?: ProductCatalogRow[];
  onOpenPrintModal?: () => void;
  externalSearchQuery?: string;
  quickViewProduct?: ProductCatalogRow | null;
  onCloseQuickView?: () => void;
}

export const ProductGridShowcase: React.FC<ProductGridShowcaseProps> = ({
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  products = SAMPLE_CATALOG_DATA,
  onOpenPrintModal,
  externalSearchQuery,
  quickViewProduct,
  onCloseQuickView,
}) => {
  // Navigation & Category States
  const [selectedCatId, setSelectedCatId] = useState<string>(selectedCategory?.id || 'all');
  const [selectedSub, setSelectedSub] = useState<string>('all');
  
  // Filter States (Trendyol-Style)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearchQuery, setBrandSearchQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock'>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyFreeShipping, setOnlyFreeShipping] = useState<boolean>(false);
  const [onlyFastDelivery, setOnlyFastDelivery] = useState<boolean>(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'rating' | 'reviews'>('featured');
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  // Favorites & Added states
  const [favorites, setFavorites] = useState<{ [barcode: string]: boolean }>({});
  const [addedItems, setAddedItems] = useState<{ [barcode: string]: number }>({});
  // Per-card active photo preview index on hover
  const [cardActivePhoto, setCardActivePhoto] = useState<{ [barcode: string]: number }>({});

  // Product Compare State (Max 3 products)
  const [compareProducts, setCompareProducts] = useState<ProductCatalogRow[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [compareToast, setCompareToast] = useState<string | null>(null);

  // Toggle compare selection
  const handleToggleCompare = (product: ProductCatalogRow, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const exists = compareProducts.some((p) => p.barcode === product.barcode);
    if (exists) {
      setCompareProducts((prev) => prev.filter((p) => p.barcode !== product.barcode));
    } else {
      if (compareProducts.length >= 3) {
        setCompareToast('En fazla 3 ürün karşılaştırabilirsiniz. Başka bir ürün çıkarmalısınız.');
        setTimeout(() => setCompareToast(null), 3500);
        return;
      }
      setCompareProducts((prev) => [...prev, product]);
      setCompareToast(`"${product.title.slice(0, 26)}..." karşılaştırmaya eklendi.`);
      setTimeout(() => setCompareToast(null), 2500);
    }
  };

  const handleRemoveCompare = (barcode: string) => {
    setCompareProducts((prev) => prev.filter((p) => p.barcode !== barcode));
  };

  const handleClearCompare = () => {
    setCompareProducts([]);
  };

  // Trendyol-Style Product Detail Modal
  const [detailProduct, setDetailProduct] = useState<ProductCatalogRow | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [selectedVariantOption, setSelectedVariantOption] = useState<string | null>(null);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'brand' | 'reviews'>('specs');

  // Sync with prop when parent updates selectedCategory
  React.useEffect(() => {
    if (selectedCategory) {
      setSelectedCatId(selectedCategory.id);
      setSelectedSub('all');
    }
  }, [selectedCategory]);

  // Sync external search query from Header live search
  React.useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
      if (externalSearchQuery.trim()) {
        setSelectedCatId('all');
        setSelectedSub('all');
      }
    }
  }, [externalSearchQuery]);

  // Sync quick view product from search or external cards
  React.useEffect(() => {
    if (quickViewProduct) {
      setDetailProduct(quickViewProduct);
      setActivePhotoIndex(0);
      setDetailQuantity(1);
    }
  }, [quickViewProduct]);

  // Current category object
  const currentCategory = useMemo(() => {
    if (selectedCatId === 'all') return null;
    return METE_CATEGORIES.find((c) => c.id === selectedCatId) || null;
  }, [selectedCatId]);

  // Unique brands across current products with item counts
  const availableBrandsWithCount = useMemo(() => {
    const counts: { [brand: string]: number } = {};
    products.forEach((p) => {
      // Check if product belongs to current category
      if (currentCategory && p.mainCategory !== currentCategory.name) return;
      if (selectedSub !== 'all' && p.subCategory !== selectedSub) return;
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count);
  }, [products, currentCategory, selectedSub]);

  // Filtered available brands for the search box inside sidebar
  const filteredSidebarBrands = useMemo(() => {
    if (!brandSearchQuery.trim()) return availableBrandsWithCount;
    return availableBrandsWithCount.filter((b) =>
      b.brand.toLowerCase().includes(brandSearchQuery.toLowerCase())
    );
  }, [availableBrandsWithCount, brandSearchQuery]);

  // Stock count metrics for current category / subcategory
  const stockCounts = useMemo(() => {
    let all = 0;
    let inStock = 0;
    let lowStock = 0;

    products.forEach((p) => {
      if (currentCategory && p.mainCategory !== currentCategory.name) return;
      if (selectedSub !== 'all' && p.subCategory !== selectedSub) return;
      all++;
      if (p.stock > 0) inStock++;
      if (p.stock > 0 && p.stock <= 10) lowStock++;
    });

    return { all, inStock, lowStock };
  }, [products, currentCategory, selectedSub]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (currentCategory && p.mainCategory !== currentCategory.name) {
        return false;
      }
      // Subcategory filter
      if (selectedSub !== 'all' && p.subCategory !== selectedSub) {
        return false;
      }
      // Multiple Brands filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Price Range filter
      const effectivePrice = p.discountPrice ?? p.priceWithVat;
      if (minPrice && effectivePrice < parseFloat(minPrice)) {
        return false;
      }
      if (maxPrice && effectivePrice > parseFloat(maxPrice)) {
        return false;
      }
      // Rating filter
      const rating = p.rating ?? 4.8;
      if (minRating > 0 && rating < minRating) {
        return false;
      }
      // Stock filter (interaktif)
      if ((stockFilter === 'inStock' || onlyInStock) && p.stock <= 0) {
        return false;
      }
      if (stockFilter === 'lowStock' && (p.stock <= 0 || p.stock > 10)) {
        return false;
      }
      // Discount filter
      if (onlyDiscounted && !p.discountPrice) {
        return false;
      }
      // Free shipping filter (over 150 TL or explicitly tagged)
      if (onlyFreeShipping && effectivePrice < 150 && !p.badges?.includes('Kargo Bedava')) {
        return false;
      }
      // Fast delivery filter
      if (onlyFastDelivery && !p.badges?.includes('Hızlı Teslimat') && p.stock < 10) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesSub = p.subCategory.toLowerCase().includes(q);
        const matchesTags = p.tags ? p.tags.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesBrand && !matchesSub && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice ?? a.priceWithVat;
      const priceB = b.discountPrice ?? b.priceWithVat;
      if (sortBy === 'priceAsc') return priceA - priceB;
      if (sortBy === 'priceDesc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating ?? 4.8) - (a.rating ?? 4.8);
      if (sortBy === 'reviews') return (b.reviewCount ?? 100) - (a.reviewCount ?? 100);
      return 0; // featured/default
    });
  }, [
    products,
    currentCategory,
    selectedSub,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    stockFilter,
    onlyInStock,
    onlyDiscounted,
    onlyFreeShipping,
    onlyFastDelivery,
    searchQuery,
    sortBy,
  ]);

  // Brand toggle handler
  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Add to cart handler
  const handleAdd = (product: ProductCatalogRow, delta = 1) => {
    onAddToCart(product, delta);
    setAddedItems((prev) => ({
      ...prev,
      [product.barcode]: (prev[product.barcode] || 0) + delta,
    }));
  };

  // Toggle favorite
  const handleToggleFavorite = (barcode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [barcode]: !prev[barcode] }));
  };

  // Open Trendyol-style Product Detail Modal
  const handleOpenDetail = (product: ProductCatalogRow) => {
    setDetailProduct(product);
    setActivePhotoIndex(0);
    setDetailQuantity(1);
    setIsPhotoZoomed(false);
    setActiveTab('specs');
    if (product.variants && product.variants.options.length > 0) {
      setSelectedVariantOption(product.variants.options[0].label);
    } else {
      setSelectedVariantOption(null);
    }
  };

  // Get photo list for a product (guarantees 4 high-resolution angle shots for every product)
  const getProductImages = (product: ProductCatalogRow): string[] => {
    if (product.images && product.images.length >= 3) {
      return product.images;
    }
    // High-res realistic stationery angle shots tailored by category
    const mainImg = product.imageUrl;
    const cat = product.mainCategory.toLowerCase();
    
    if (cat.includes('boya') || cat.includes('sanat')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80', // Renkler ve ambalaj
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80', // Palet / fırça / kağıt üstü
        'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&auto=format&fit=crop&q=80', // Pigment ve detay
      ];
    }
    if (cat.includes('yazı') || cat.includes('kalem') || cat.includes('çizim')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1585336261026-70e28f11ecf3?w=800&auto=format&fit=crop&q=80', // Kalem ucu ve çizim açısı
        'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80', // Masada kullanım görünümü
        'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80', // Tutuş ve mekanizma detayı
      ];
    }
    if (cat.includes('defter') || cat.includes('kağıt')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', // Açık sayfalar ve çizgiler
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', // Dikiş, sırt ve kapak dokusu
        'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80', // Kağıt beyazlığı ve deste görünüm
      ];
    }
    if (cat.includes('çanta') || cat.includes('okul')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', // Bölmeler ve iç hacim
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80', // Sırt askıları ve ergonomik ped
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80', // Fermuar ve su geçirmez kumaş detayı
      ];
    }
    if (cat.includes('ofis') || cat.includes('dosya') || cat.includes('masaüstü')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800&auto=format&fit=crop&q=80', // Dosya / klasör mekanizması
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', // Masada düzen ve kullanım
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80', // Metal aksam ve barkod detayı
      ];
    }

    return [
      mainImg,
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585336261026-70e28f11ecf3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
    ];
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedBrands([]);
    setBrandSearchQuery('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setStockFilter('all');
    setOnlyInStock(false);
    setOnlyDiscounted(false);
    setOnlyFreeShipping(false);
    setOnlyFastDelivery(false);
    setSelectedSub('all');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (minPrice || maxPrice) count += 1;
    if (stockFilter !== 'all' || onlyInStock) count += 1;
    if (onlyDiscounted) count += 1;
    if (onlyFreeShipping) count += 1;
    if (onlyFastDelivery) count += 1;
    if (minRating > 0) count += 1;
    if (selectedSub !== 'all') count += 1;
    if (searchQuery.trim()) count += 1;
    return count;
  }, [
    selectedBrands,
    minPrice,
    maxPrice,
    stockFilter,
    onlyInStock,
    onlyDiscounted,
    onlyFreeShipping,
    onlyFastDelivery,
    minRating,
    selectedSub,
    searchQuery,
  ]);

  const hasActiveFilters = activeFiltersCount > 0;

  // Helper to render the interactive filter panel (used by both desktop sidebar and mobile drawer)
  const renderFilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-sm font-black text-slate-900">
          <SlidersHorizontal className="w-4 h-4 text-[#f43f2d]" />
          <span>Filtreler</span>
          {activeFiltersCount > 0 && (
            <span className="bg-[#f43f2d] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-[#f43f2d] font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Tümünü Sıfırla</span>
          </button>
        )}
      </div>

      {/* 1. Alt Kategoriler */}
      {currentCategory && (
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Reyon / Alt Kategori</span>
            <span className="text-[10px] text-slate-400 font-normal">
              {currentCategory.subCategories.length} reyon
            </span>
          </h4>
          <div className="space-y-1 text-xs">
            <button
              onClick={() => setSelectedSub('all')}
              className={`w-full text-left py-2 px-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                selectedSub === 'all'
                  ? 'bg-rose-50 text-[#f43f2d] font-bold border border-rose-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Tüm {currentCategory.name}</span>
              <span className="text-[11px] text-slate-400 font-medium">
                {products.filter((p) => p.mainCategory === currentCategory.name).length}
              </span>
            </button>
            {currentCategory.subCategories.map((sub) => {
              const subCount = products.filter(
                (p) => p.mainCategory === currentCategory.name && p.subCategory === sub.name
              ).length;
              const isSubSelected = selectedSub === sub.name;

              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSub(sub.name)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    isSubSelected
                      ? 'bg-rose-50 text-[#f43f2d] font-bold border border-rose-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="line-clamp-1">{sub.name}</span>
                  <span className="text-[11px] text-slate-400 font-medium">({subCount})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Marka Filtresi (İnteraktif & Hızlı Aramalı) */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span>Marka</span>
            {selectedBrands.length > 0 && (
              <span className="text-[#f43f2d] text-[10px] font-black bg-rose-50 px-1.5 py-0.2 rounded-md">
                {selectedBrands.length} seçili
              </span>
            )}
          </h4>
          {selectedBrands.length > 0 && (
            <button
              onClick={() => setSelectedBrands([])}
              className="text-[10px] text-slate-500 hover:text-[#f43f2d] font-semibold cursor-pointer"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Marka Arama Kutusu */}
        <div className="relative mb-2.5">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Marka ara..."
            value={brandSearchQuery}
            onChange={(e) => setBrandSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#f43f2d] focus:bg-white transition-all"
          />
          {brandSearchQuery && (
            <button
              onClick={() => setBrandSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Marka Checkbox Listesi */}
        <div className="max-h-48 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
          {filteredSidebarBrands.length === 0 ? (
            <div className="text-[11px] text-slate-400 py-1.5 text-center">Marka bulunamadı</div>
          ) : (
            filteredSidebarBrands.map(({ brand, count }) => {
              const isChecked = selectedBrands.includes(brand);

              return (
                <label
                  key={brand}
                  className={`flex items-center justify-between text-xs py-1 px-1.5 rounded-lg transition-colors cursor-pointer select-none ${
                    isChecked ? 'bg-rose-50/70 font-bold text-[#f43f2d]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleBrand(brand)}
                      className="rounded border-slate-300 text-[#f43f2d] focus:ring-0 cursor-pointer w-3.5 h-3.5 accent-[#f43f2d]"
                    />
                    <span className="truncate">{brand}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">({count})</span>
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Fiyat Aralığı (TL) (İnteraktif Giriş & Hızlı Butonlar) */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Fiyat Aralığı (TL)
          </h4>
          {(minPrice || maxPrice) && (
            <button
              onClick={() => { setMinPrice(''); setMaxPrice(''); }}
              className="text-[10px] text-slate-500 hover:text-[#f43f2d] font-semibold cursor-pointer"
            >
              Temizle
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="En Az"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full pl-2.5 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-[#f43f2d] focus:bg-white"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">TL</span>
          </div>
          <span className="text-slate-400 text-xs font-bold">-</span>
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="En Çok"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full pl-2.5 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-[#f43f2d] focus:bg-white"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">TL</span>
          </div>
        </div>

        {/* Hızlı Fiyat Aralıkları */}
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: '0 - 100 TL', min: '0', max: '100' },
            { label: '100 - 300 TL', min: '100', max: '300' },
            { label: '300 - 600 TL', min: '300', max: '600' },
            { label: '600+ TL', min: '600', max: '2500' },
          ].map((preset) => {
            const isPresetActive = minPrice === preset.min && maxPrice === preset.max;

            return (
              <button
                key={preset.label}
                onClick={() => {
                  if (isPresetActive) {
                    setMinPrice('');
                    setMaxPrice('');
                  } else {
                    setMinPrice(preset.min);
                    setMaxPrice(preset.max);
                  }
                }}
                className={`px-2 py-1.5 text-[11px] rounded-xl transition-all border text-center font-semibold cursor-pointer ${
                  isPresetActive
                    ? 'bg-[#f43f2d] text-white border-[#f43f2d] shadow-2xs font-bold'
                    : 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-[#f43f2d] border-slate-200'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Stok Durumu (İnteraktif Butonlar / Radyo) */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Stok Durumu</span>
          <span className="text-[10px] text-slate-400 font-normal">Anlık Kontrol</span>
        </h4>

        <div className="space-y-1.5">
          {/* Tümü */}
          <button
            onClick={() => {
              setStockFilter('all');
              setOnlyInStock(false);
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
              stockFilter === 'all' && !onlyInStock
                ? 'bg-rose-50 text-[#f43f2d] border-rose-200 font-bold'
                : 'text-slate-700 border-transparent hover:bg-slate-50'
            }`}
          >
            <span>Tüm Ürünler</span>
            <span className="text-[11px] text-slate-400 font-medium">({stockCounts.all})</span>
          </button>

          {/* Sadece Stoktakiler */}
          <button
            onClick={() => {
              setStockFilter(stockFilter === 'inStock' ? 'all' : 'inStock');
              setOnlyInStock(stockFilter !== 'inStock');
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
              stockFilter === 'inStock' || onlyInStock
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-2xs'
                : 'text-slate-700 border-transparent hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sadece Stoktakiler</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100/60 px-1.5 py-0.2 rounded-md">
              {stockCounts.inStock}
            </span>
          </button>

          {/* Tükenmek Üzere (Son 10 Ürün) */}
          <button
            onClick={() => {
              setStockFilter(stockFilter === 'lowStock' ? 'all' : 'lowStock');
              setOnlyInStock(false);
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
              stockFilter === 'lowStock'
                ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-2xs'
                : 'text-slate-700 border-transparent hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px]">⚠️</span>
              <span>Tükenmek Üzere</span>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded-md">
              {stockCounts.lowStock}
            </span>
          </button>
        </div>
      </div>

      {/* 5. Avantajlar & Hizmetler */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Fırsatlar & Avantajlar
        </h4>

        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-50">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={onlyDiscounted}
              onChange={(e) => setOnlyDiscounted(e.target.checked)}
              className="rounded border-slate-300 text-[#f43f2d] focus:ring-0 cursor-pointer w-3.5 h-3.5 accent-[#f43f2d]"
            />
            <span className="flex items-center gap-1 font-medium">
              <Tag className="w-3.5 h-3.5 text-rose-500" />
              <span>İndirimli Ürünler</span>
            </span>
          </div>
        </label>

        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-50">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={onlyFreeShipping}
              onChange={(e) => setOnlyFreeShipping(e.target.checked)}
              className="rounded border-slate-300 text-[#f43f2d] focus:ring-0 cursor-pointer w-3.5 h-3.5 accent-[#f43f2d]"
            />
            <span className="flex items-center gap-1 font-medium">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kargo Bedava</span>
            </span>
          </div>
        </label>

        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-50">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={onlyFastDelivery}
              onChange={(e) => setOnlyFastDelivery(e.target.checked)}
              className="rounded border-slate-300 text-[#f43f2d] focus:ring-0 cursor-pointer w-3.5 h-3.5 accent-[#f43f2d]"
            />
            <span className="flex items-center gap-1 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Hızlı Teslimat (24 Saat)</span>
            </span>
          </div>
        </label>
      </div>

      {/* Online Fotokopi Banner */}
      {onOpenPrintModal && (
        <div className="pt-4 border-t border-slate-100">
          <div
            onClick={onOpenPrintModal}
            className="p-3.5 rounded-2xl bg-linear-to-br from-rose-500 to-[#f43f2d] text-white cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="text-[11px] font-bold text-rose-200 uppercase tracking-wider">
              Öğrenci & Ofis Hizmeti
            </div>
            <div className="text-xs font-black mt-0.5">
              🖨️ Online Fotokopi & Tez Cilt Hesapla
            </div>
            <p className="text-[10px] text-white/80 mt-1 leading-snug">
              PDF yükle, sayfa adedi ve spiralini seç, anında kapına gelsin.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section id="vitrin" className="w-full bg-[#f8f9fa] py-6 sm:py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trendyol Tarzı Breadcrumb Gezinme Yolu */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 flex-wrap">
          <button
            onClick={() => {
              setSelectedCatId('all');
              setSelectedSub('all');
            }}
            className="hover:text-[#f43f2d] transition-colors font-medium cursor-pointer"
          >
            Ana Sayfa
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button
            onClick={() => setSelectedSub('all')}
            className={`font-semibold cursor-pointer transition-colors ${
              selectedSub === 'all' ? 'text-slate-900' : 'hover:text-[#f43f2d]'
            }`}
          >
            {currentCategory ? currentCategory.name : 'Tüm Kırtasiye Ürünleri'}
          </button>
          {selectedSub !== 'all' && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-[#f43f2d] font-bold">{selectedSub}</span>
            </>
          )}
        </nav>

        {/* Üst Reyon Sekmeleri (Trendyol Kategori Şeridi) */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs mb-6 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <button
            onClick={() => {
              setSelectedCatId('all');
              setSelectedSub('all');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCatId === 'all'
                ? 'bg-[#f43f2d] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            🛍️ Tüm Ürünler ({products.length})
          </button>

          {METE_CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.mainCategory === cat.name).length;
            const isSelected = selectedCatId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCatId(cat.id);
                  setSelectedSub('all');
                  onSelectCategory(cat);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#f43f2d] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ===================== TRENDYOL GÖRSEL REYON & ALT KATEGORİ FOTOĞRAFLI HİKAYE ŞERİDİ ===================== */}
        {currentCategory && (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                    {currentCategory.name}
                  </h3>
                  <span className="text-xs bg-rose-50 text-[#f43f2d] font-bold px-2 py-0.5 rounded-full border border-rose-100">
                    {products.filter((p) => p.mainCategory === currentCategory.name).length} Fotoğraflı Ürün
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentCategory.shortDescription} — Tüm ürünler orijinal kutusu, barkodu ve teknik fotoğraflarıyla listelenmektedir.
                </p>
              </div>

              {selectedSub !== 'all' && (
                <button
                  onClick={() => setSelectedSub('all')}
                  className="text-xs text-[#f43f2d] font-bold hover:underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Tüm {currentCategory.name} Reyonunu Göster</span>
                </button>
              )}
            </div>

            {/* Fotoğraflı Alt Kategori Yuvarlak Butonları (Trendyol Story Mantığı) */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pt-1">
              {/* Tümü Butonu */}
              <button
                onClick={() => setSelectedSub('all')}
                className={`flex flex-col items-center gap-1.5 shrink-0 p-2 rounded-2xl transition-all cursor-pointer ${
                  selectedSub === 'all'
                    ? 'bg-rose-50/80 border-2 border-[#f43f2d] shadow-xs scale-102'
                    : 'border-2 border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-rose-500 to-[#f43f2d] flex flex-col items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-black">TÜMÜ</span>
                </div>
                <span className={`text-[11px] font-bold text-center max-w-[80px] truncate ${
                  selectedSub === 'all' ? 'text-[#f43f2d]' : 'text-slate-700'
                }`}>
                  Tüm Çeşitler
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  ({products.filter((p) => p.mainCategory === currentCategory.name).length})
                </span>
              </button>

              {/* Her Alt Kategori İçin Net Ürün Fotoğrafı */}
              {currentCategory.subCategories.map((sub) => {
                const subProd = products.find(
                  (p) => p.mainCategory === currentCategory.name && p.subCategory === sub.name
                );
                const subImage = subProd?.imageUrl || 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200&auto=format&fit=crop&q=80';
                const isSelected = selectedSub === sub.name;
                const count = products.filter(
                  (p) => p.mainCategory === currentCategory.name && p.subCategory === sub.name
                ).length;

                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSub(sub.name)}
                    className={`flex flex-col items-center gap-1.5 shrink-0 p-2 rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/80 border-2 border-[#f43f2d] shadow-xs scale-105'
                        : 'border-2 border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 transition-all shadow-2xs ${
                      isSelected ? 'border-[#f43f2d] ring-2 ring-rose-200' : 'border-slate-200 group-hover:border-slate-300'
                    }`}>
                      <img
                        src={subImage}
                        alt={sub.name}
                        className="w-full h-full object-contain p-1.5 hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className={`text-[11px] font-bold text-center max-w-[96px] truncate ${
                      isSelected ? 'text-[#f43f2d]' : 'text-slate-700'
                    }`}>
                      {sub.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Ana Gövde: Sol Filtreleme Menüsü + Sağ Trendyol Ürün Listesi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ===================== SOL SÜTUN: TRENDYOL FİLTRE PANELİ (MASAÜSTÜ) ===================== */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
            {renderFilterPanel()}
          </aside>

          {/* ===================== MOBİL FİLTRELEME ÇEKMECESİ (DRAWER) ===================== */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs animate-fadeIn lg:hidden">
              <div className="w-full max-w-sm h-full bg-white p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                    <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                      <SlidersHorizontal className="w-4 h-4 text-[#f43f2d]" />
                      <span>Filtreler ({activeFiltersCount} Aktif)</span>
                    </div>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {renderFilterPanel()}
                </div>
                <div className="pt-4 border-t border-slate-200 mt-6 sticky bottom-0 bg-white">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 bg-[#f43f2d] hover:bg-[#d93424] text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
                  >
                    {filteredProducts.length} Ürünü Göster
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== SAĞ SÜTUN: TRENDYOL ÜRÜN VİTRİNİ ===================== */}
          <main className="lg:col-span-9 space-y-4">
            {/* Üst Sıralama ve Kontrol Barı */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Sol: Sonuç Sayısı ve Arama */}
              <div className="flex items-center gap-3">
                <div className="text-xs font-bold text-slate-800 shrink-0">
                  <span className="text-[#f43f2d] font-black">{filteredProducts.length}</span> ürün
                </div>

                {/* Reyon İçi Canlı Arama */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Bu kategoride ara..."
                    className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#f43f2d] focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sağ: Mobil Filtre Butonu, Sıralama & Izgara Görünümü */}
              <div className="flex items-center gap-2 justify-end">
                {/* Mobil Filtre Butonu */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#f43f2d]" />
                  <span>Filtrele</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#f43f2d] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-500 hidden sm:inline">Sıralama:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#f43f2d] cursor-pointer"
                  >
                    <option value="featured">Önerilen Sıralama</option>
                    <option value="priceAsc">En Düşük Fiyat</option>
                    <option value="priceDesc">En Yüksek Fiyat</option>
                    <option value="rating">En Yüksek Puanlılar</option>
                    <option value="reviews">En Çok Değerlendirilenler</option>
                  </select>
                </div>

                {/* 3'lü veya 4'lü Izgara Seçimi */}
                <div className="hidden md:flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setGridCols(3)}
                    title="Büyük Görünüm (3'lü)"
                    className={`px-2 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                      gridCols === 3 ? 'bg-[#f43f2d] text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    3'lü
                  </button>
                  <button
                    onClick={() => setGridCols(4)}
                    title="Standart Görünüm (4'lü)"
                    className={`px-2 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                      gridCols === 4 ? 'bg-[#f43f2d] text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    4'lü
                  </button>
                </div>

                {/* Karşılaştır Butonu (Üst Hızlı Erişim) */}
                {compareProducts.length > 0 && (
                  <button
                    onClick={() => setIsCompareModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
                    <span>Karşılaştır ({compareProducts.length}/3)</span>
                  </button>
                )}
              </div>
            </div>

            {/* ===================== SEÇİLİ FİLTRE ETİKETLERİ BARI ===================== */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs animate-fadeIn">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3 text-[#f43f2d]" />
                  <span>Seçili Filtreler:</span>
                </span>

                {/* Alt Kategori Chip */}
                {selectedSub !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-rose-50 text-[#f43f2d] border border-rose-200 text-xs px-2.5 py-1 rounded-xl font-bold">
                    <span>{selectedSub}</span>
                    <button
                      onClick={() => setSelectedSub('all')}
                      className="hover:text-red-800 cursor-pointer font-black"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Marka Chips */}
                {selectedBrands.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 border border-slate-200 text-xs px-2.5 py-1 rounded-xl font-bold"
                  >
                    <span>{b}</span>
                    <button
                      onClick={() => handleToggleBrand(b)}
                      className="hover:text-red-500 cursor-pointer font-black"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {/* Fiyat Aralığı Chip */}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-xl font-bold">
                    <span>{minPrice || '0'} - {maxPrice || '∞'} TL</span>
                    <button
                      onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                      }}
                      className="hover:text-amber-700 cursor-pointer font-black"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Stok Durumu Chips */}
                {stockFilter === 'inStock' && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-xl font-bold">
                    <span>Stokta Var</span>
                    <button
                      onClick={() => setStockFilter('all')}
                      className="hover:text-emerald-950 cursor-pointer font-black"
                    >
                      ×
                    </button>
                  </span>
                )}

                {stockFilter === 'lowStock' && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-xl font-bold">
                    <span>Tükenmek Üzere</span>
                    <button
                      onClick={() => setStockFilter('all')}
                      className="hover:text-amber-950 cursor-pointer font-black"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* İndirimli Ürünler */}
                {onlyDiscounted && (
                  <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs px-2.5 py-1 rounded-xl font-bold">
                    <span>İndirimli Ürünler</span>
                    <button
                      onClick={() => setOnlyDiscounted(false)}
                      className="hover:text-rose-950 cursor-pointer font-black"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Kargo Bedava */}
                {onlyFreeShipping && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-xl font-bold">
                    <span>Kargo Bedava</span>
                    <button
                      onClick={() => setOnlyFreeShipping(false)}
                      className="hover:text-emerald-950 cursor-pointer font-black"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Hızlı Teslimat */}
                {onlyFastDelivery && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs px-2.5 py-1 rounded-xl font-bold">
                    <span>Hızlı Teslimat</span>
                    <button
                      onClick={() => setOnlyFastDelivery(false)}
                      className="hover:text-amber-950 cursor-pointer font-black"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Arama Terimi */}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 border border-purple-200 text-xs px-2.5 py-1 rounded-xl font-bold">
                    <span>"{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:text-purple-950 cursor-pointer font-black"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Tümünü Temizle */}
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-[#f43f2d] hover:underline font-bold ml-auto cursor-pointer"
                >
                  Tümünü Temizle ({activeFiltersCount})
                </button>
              </div>
            )}

            {/* Aktif Filtre Rozetleri */}
            {hasActiveFilters && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Seçili Filtreler:</span>
                {selectedSub !== 'all' && (
                  <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-2xs">
                    <span>{selectedSub}</span>
                    <button onClick={() => setSelectedSub('all')} className="text-slate-400 hover:text-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrands.map((b) => (
                  <span
                    key={b}
                    className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-[#f43f2d] flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{b}</span>
                    <button onClick={() => handleToggleBrand(b)} className="text-slate-400 hover:text-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(minPrice || maxPrice) && (
                  <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-2xs">
                    <span>{minPrice || '0'} - {maxPrice || '∞'} TL</span>
                    <button
                      onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                      }}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {onlyFreeShipping && (
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <span>Kargo Bedava</span>
                    <button onClick={() => setOnlyFreeShipping(false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {onlyFastDelivery && (
                  <span className="bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <span>Hızlı Teslimat</span>
                    <button onClick={() => setOnlyFastDelivery(false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* TRENDYOL ÜRÜN KARTLARI IZGARASI */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-500 shadow-2xs">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <div className="text-sm font-bold text-slate-800 mb-1">
                  Seçili filtrelerde ürün bulunamadı.
                </div>
                <p className="text-slate-500 max-w-sm mx-auto mb-4">
                  Filtreleri sıfırlayarak veya arama kelimesini değiştirerek tekrar deneyebilirsiniz.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-[#f43f2d] text-white rounded-xl font-bold cursor-pointer hover:bg-[#d93424] transition-colors"
                >
                  Tüm Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-4 sm:gap-5 ${
                  gridCols === 3
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {filteredProducts.map((product) => {
                  const effectivePrice = product.discountPrice ?? product.priceWithVat;
                  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.priceWithVat);
                  const discountPercent = hasDiscount
                    ? Math.round(((product.priceWithVat - (product.discountPrice || 0)) / product.priceWithVat) * 100)
                    : 0;
                  const isFav = Boolean(favorites[product.barcode]);
                  const isCompared = compareProducts.some((cp) => cp.barcode === product.barcode);
                  const qtyInCart = addedItems[product.barcode] || 0;
                  const productImages = getProductImages(product);
                  const activeCardImgIdx = cardActivePhoto[product.barcode] || 0;

                  return (
                    <div
                      key={product.barcode}
                      onClick={() => handleOpenDetail(product)}
                      className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all group relative cursor-pointer"
                    >
                      {/* Üst Rozetler ve Favori Butonu */}
                      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1 items-start pointer-events-none">
                        {hasDiscount && (
                          <span className="bg-[#f43f2d] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs">
                            %{discountPercent} İndirim
                          </span>
                        )}
                        {effectivePrice >= 150 && (
                          <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                            Kargo Bedava
                          </span>
                        )}
                      </div>

                      {/* Çoklu Fotoğraf Noktaları (Trendyol Çoklu Görsel Gezinme) */}
                      {productImages.length > 1 && (
                        <div
                          className="absolute top-4.5 right-14 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {productImages.slice(0, 4).map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              onMouseEnter={() => setCardActivePhoto((prev) => ({ ...prev, [product.barcode]: dotIdx }))}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardActivePhoto((prev) => ({ ...prev, [product.barcode]: dotIdx }));
                              }}
                              className={`h-2 rounded-full transition-all cursor-pointer ${
                                activeCardImgIdx === dotIdx ? 'bg-[#f43f2d] w-3.5' : 'bg-slate-300 hover:bg-slate-400 w-2'
                              }`}
                              title={`Fotoğraf Açısı ${dotIdx + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Favori Kalp Butonu */}
                      <button
                        onClick={(e) => handleToggleFavorite(product.barcode, e)}
                        className={`absolute top-5 right-5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                          isFav
                            ? 'bg-rose-50 text-[#f43f2d]'
                            : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white'
                        }`}
                        title={isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-[#f43f2d]' : ''}`} />
                      </button>

                      {/* Ürün Fotoğrafı (Trendyol Net Kare Görsel) */}
                      <div>
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 mb-3 border border-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                          <img
                            src={productImages[activeCardImgIdx] || productImages[0]}
                            alt={product.title}
                            className="h-full w-full object-contain p-2.5 group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />

                          {/* Trendyol "Hızlı Bakış" & "Karşılaştır" Butonları (Hover'da beliren şık butonlar) */}
                          <div className="absolute inset-x-2.5 bottom-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(product);
                              }}
                              className="flex-1 py-2 px-2 rounded-xl bg-slate-900/90 hover:bg-black text-white text-[11px] font-black shadow-lg backdrop-blur-xs flex items-center justify-center gap-1 cursor-pointer transform translate-y-1.5 group-hover:translate-y-0 transition-transform"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#f43f2d]" />
                              <span>Hızlı Bakış</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleToggleCompare(product, e)}
                              className={`py-2 px-2.5 rounded-xl text-[11px] font-black shadow-lg backdrop-blur-xs flex items-center justify-center gap-1 cursor-pointer transform translate-y-1.5 group-hover:translate-y-0 transition-all ${
                                isCompared
                                  ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                                  : 'bg-white/95 text-slate-800 hover:bg-blue-600 hover:text-white'
                              }`}
                              title={isCompared ? 'Karşılaştırmadan Çıkar' : 'Karşılaştırmaya Ekle (En fazla 3)'}
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{isCompared ? 'Seçildi' : 'Kıyasla'}</span>
                            </button>
                          </div>

                          {/* Stok Uyarısı */}
                          {product.stock <= 0 ? (
                            <span className="absolute bottom-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                              Tükendi
                            </span>
                          ) : product.stock <= 15 ? (
                            <span className="absolute bottom-2 left-2 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse shadow-xs">
                              Son {product.stock} Ürün!
                            </span>
                          ) : null}
                        </div>

                        {/* Marka ve Başlık (Trendyol Stili) */}
                        <div className="text-[11px] font-black text-slate-900 group-hover:text-[#f43f2d] transition-colors mb-0.5">
                          {product.brand}
                        </div>
                        <h3
                          className="text-xs font-medium text-slate-700 leading-snug line-clamp-2 min-h-[34px]"
                          title={product.title}
                        >
                          {product.title}
                        </h3>

                        {/* Yıldız, Değerlendirme ve Kıyasla Butonu */}
                        <div className="flex items-center justify-between mt-1.5 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center text-amber-400">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="font-bold text-slate-900 ml-1">
                                {product.rating ?? 4.9}
                              </span>
                            </div>
                            <span className="text-slate-400">
                              ({product.reviewCount ?? 142})
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleToggleCompare(product, e)}
                            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                              isCompared
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'text-slate-500 hover:text-blue-700 hover:bg-blue-50 border border-transparent'
                            }`}
                            title={isCompared ? 'Karşılaştırmadan Çıkar' : 'Karşılaştırmaya Ekle (Maks. 3)'}
                          >
                            <ArrowLeftRight className="w-3 h-3" />
                            <span>{isCompared ? 'Kıyasla ✓' : 'Kıyasla'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Fiyat ve Sepete Ekle Butonu */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-2.5">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-[#f43f2d]">
                              {effectivePrice.toFixed(0)} TL
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-slate-400 line-through">
                                {product.priceWithVat.toFixed(0)} TL
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                            Hızlı Teslimat
                          </span>
                        </div>

                        {/* Sepete Ekleme Butonu / Miktar Artırıcı */}
                        <div onClick={(e) => e.stopPropagation()}>
                          {qtyInCart > 0 ? (
                            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-1 text-emerald-900">
                              <button
                                onClick={() => handleAdd(product, -1)}
                                className="w-8 h-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center font-bold hover:bg-emerald-100 text-xs transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-black">
                                {qtyInCart} Adet Sepette
                              </span>
                              <button
                                onClick={() => handleAdd(product, 1)}
                                className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold hover:bg-emerald-700 text-xs transition-colors shadow-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              disabled={product.stock <= 0}
                              onClick={() => handleAdd(product, 1)}
                              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                                product.stock <= 0
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : 'bg-[#f43f2d] hover:bg-[#d93424] text-white active:scale-98'
                              }`}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>{product.stock <= 0 ? 'Tükendi' : 'Sepete Ekle'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ===================== TRENDYOL STİLİ ÜRÜN DETAY & FOTOĞRAF GALERİSİ MODALI ===================== */}
      {detailProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl relative border border-slate-100 my-auto animate-scaleUp max-h-[92vh] overflow-y-auto">
            {/* Kapat Butonu */}
            <button
              onClick={() => {
                setDetailProduct(null);
                if (onCloseQuickView) onCloseQuickView();
              }}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* SOL SÜTUN (6 Birim): FOTOĞRAF GALERİSİ */}
              <div className="md:col-span-6 flex flex-col gap-3">
                {/* Büyük Fotoğraf Alanı */}
                <div
                  onClick={() => setIsPhotoZoomed(!isPhotoZoomed)}
                  className={`relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center cursor-zoom-in group ${
                    isPhotoZoomed ? 'scale-105 shadow-xl z-20' : ''
                  }`}
                >
                  <img
                    src={getProductImages(detailProduct)[activePhotoIndex]}
                    alt={detailProduct.title}
                    className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Fotoğraf Sayacı */}
                  <span className="absolute bottom-3 right-3 bg-slate-900/70 text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                    {activePhotoIndex + 1} / {getProductImages(detailProduct).length} Fotoğraf
                  </span>

                  <span className="absolute top-3 left-3 bg-[#f43f2d] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Orijinal Ürün Görseli
                  </span>
                </div>

                {/* Küçük Resimler (Thumbnail Strip) - Kullanıcı tek tek fotoğrafları görsün */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {getProductImages(detailProduct).map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border-2 transition-all shrink-0 cursor-pointer ${
                        activePhotoIndex === idx
                          ? 'border-[#f43f2d] shadow-sm scale-102'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Fotoğraf ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-[#f43f2d]" />
                  <span>Fotoğraflara tıklayarak detaylı yakından inceleyebilirsiniz.</span>
                </div>
              </div>

              {/* SAĞ SÜTUN (6 Birim): ÜRÜN BİLGİLERİ, VARYANTLAR & SATIN ALMA */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Marka ve Satıcı Bilgisi */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#f43f2d] uppercase tracking-wide">
                        {detailProduct.brand}
                      </span>
                      {BRAND_INFO[detailProduct.brand] && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                          {BRAND_INFO[detailProduct.brand].country}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                      ✓ Yetkili Satıcı: Mete Kırtasiye (9.9 ⭐)
                    </span>
                  </div>

                  {/* Başlık */}
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug mb-2 font-heading">
                    {detailProduct.title}
                  </h2>

                  {/* Yıldız ve Değerlendirmeler */}
                  <div className="flex items-center gap-3 text-xs mb-3.5 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                      <span className="font-bold text-slate-900 ml-1.5">
                        {detailProduct.rating ?? 4.9}
                      </span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-600 font-medium">
                      {detailProduct.reviewCount ?? 142} Değerlendirme
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500 font-medium">
                      SKU: <span className="font-mono text-slate-700">{detailProduct.sku}</span>
                    </span>
                  </div>

                  {/* Fiyat Alanı */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-3.5">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-black text-[#f43f2d]">
                        {(detailProduct.discountPrice ?? detailProduct.priceWithVat).toFixed(0)} TL
                      </span>
                      {detailProduct.discountPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          {detailProduct.priceWithVat.toFixed(0)} TL
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 font-medium ml-auto">
                        KDV Dahil ({detailProduct.unit})
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>150 TL üzeri siparişlerde Kargo Bedava!</span>
                    </div>
                  </div>

                  {/* ===================== 1. STOK DURUMU & TESLİMAT BİLGİSİ (TRENDYOL MANTIĞI) ===================== */}
                  <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-3 mb-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                        </span>
                        <span className="text-xs font-black text-emerald-950">
                          {detailProduct.stock > 15
                            ? `Stok Durumu: Depoda ${detailProduct.stock} Adet Hazır`
                            : `⚠️ Kritik Stok: Son ${detailProduct.stock} Adet Kaldı!`}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                        {detailProduct.stock > 0 ? '✓ Hemen Teslim' : 'Tükendi'}
                      </span>
                    </div>

                    {/* Canlı Stok Doluluk Çubuğu */}
                    <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          detailProduct.stock > 15 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(15, (detailProduct.stock / 250) * 100))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-emerald-950/80 pt-1">
                      <span className="flex items-center gap-1 font-semibold">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Saat 16:00'ya kadar siparişlerde <strong>AYNI GÜN KARGO</strong></span>
                      </span>
                      <span className="text-slate-600 font-medium">Tahmini: 24-48 Saat</span>
                    </div>
                  </div>

                  {/* ===================== 2. MARKA TANITIMI ÖZETİ (BRAND DESCRIPTION) ===================== */}
                  {BRAND_INFO[detailProduct.brand] && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-3.5">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900">
                            {BRAND_INFO[detailProduct.brand].name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            (Kuruluş: {BRAND_INFO[detailProduct.brand].foundedYear})
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#f43f2d] bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                          %100 Orijinal Ürün
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {BRAND_INFO[detailProduct.brand].description}
                      </p>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center gap-1 text-[10px] text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-700">{BRAND_INFO[detailProduct.brand].qualityGuarantee}</span>
                      </div>
                    </div>
                  )}

                  {/* VARYANT / SEÇENEK SEÇİCİ (Örn: 12'li / 24'lü / 36'lı Kutu veya Renk) */}
                  {detailProduct.variants && (
                    <div className="mb-3.5">
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        {detailProduct.variants.type} Seçiniz:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {detailProduct.variants.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setSelectedVariantOption(opt.label)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              selectedVariantOption === opt.label
                                ? 'bg-[#f43f2d] text-white border-[#f43f2d] shadow-2xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Adet ve Satın Alma Butonları */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* Miktar Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => setDetailQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-black text-slate-900">
                        {detailQuantity}
                      </span>
                      <button
                        onClick={() => setDetailQuantity((q) => Math.min(detailProduct.stock, q + 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Sepete Ekle Butonu */}
                    <button
                      disabled={detailProduct.stock <= 0}
                      onClick={() => {
                        handleAdd(detailProduct, detailQuantity);
                        setDetailProduct(null);
                      }}
                      className="flex-1 py-3 px-5 rounded-xl bg-[#f43f2d] hover:bg-[#d93424] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Sepete Ekle ({((detailProduct.discountPrice ?? detailProduct.priceWithVat) * detailQuantity).toFixed(0)} TL)</span>
                    </button>

                    {/* Karşılaştır Butonu (Detail Modal) */}
                    <button
                      type="button"
                      onClick={() => handleToggleCompare(detailProduct)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        compareProducts.some((p) => p.barcode === detailProduct.barcode)
                          ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                      title={
                        compareProducts.some((p) => p.barcode === detailProduct.barcode)
                          ? 'Karşılaştırma listesinden çıkar'
                          : 'Karşılaştırma listesine ekle (Maks. 3)'
                      }
                    >
                      <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                      <span className="hidden sm:inline">
                        {compareProducts.some((p) => p.barcode === detailProduct.barcode)
                          ? 'Kıyaslamada ✓'
                          : 'Kıyasla'}
                      </span>
                    </button>
                  </div>

                  {/* Güven Rozetleri */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 mb-3.5">
                    <div className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>%100 Orijinal Ürün Faturası</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <RotateCcw className="w-4 h-4 text-blue-600" />
                      <span>14 Gün Koşulsuz Kolay İade</span>
                    </div>
                  </div>
                </div>

                {/* ===================== SEKME DETAYLARI: TEKNİK ÖZELLİKLER & MARKA TANITIMI ===================== */}
                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 mb-3 text-xs font-bold overflow-x-auto scrollbar-none">
                    <button
                      onClick={() => setActiveTab('specs')}
                      className={`pb-2 transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                        activeTab === 'specs'
                          ? 'border-[#f43f2d] text-[#f43f2d]'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Teknik Özellikler
                    </button>
                    <button
                      onClick={() => setActiveTab('desc')}
                      className={`pb-2 transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                        activeTab === 'desc'
                          ? 'border-[#f43f2d] text-[#f43f2d]'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Detaylı Bilgi
                    </button>
                    <button
                      onClick={() => setActiveTab('brand')}
                      className={`pb-2 transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                        activeTab === 'brand'
                          ? 'border-[#f43f2d] text-[#f43f2d]'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Marka Tanıtımı & Hikayesi
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`pb-2 transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                        activeTab === 'reviews'
                          ? 'border-[#f43f2d] text-[#f43f2d]'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Yorumlar ({detailProduct.reviewCount ?? 142})
                    </button>
                  </div>

                  {/* 1. TEKNİK ÖZELLİKLER TABLOSU */}
                  {activeTab === 'specs' && (
                    <div className="space-y-1.5 text-xs">
                      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400">Barkod (EAN-13):</span>
                        <span className="font-mono text-slate-900 font-bold">{detailProduct.barcode}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400">Stok Kodu (SKU):</span>
                        <span className="font-mono text-slate-900 font-bold">{detailProduct.sku}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400">Marka & Üretici:</span>
                        <span className="font-bold text-slate-900">{detailProduct.brand}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400">Reyon / Kategori:</span>
                        <span className="font-semibold text-slate-900">{detailProduct.mainCategory} &gt; {detailProduct.subCategory}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400">Satış Birimi:</span>
                        <span className="font-bold text-slate-900">{detailProduct.unit}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400">KDV Oranı:</span>
                        <span className="font-bold text-slate-900">%{detailProduct.vatRate}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400">Güvenlik / Sağlık Standardı:</span>
                        <span className="font-bold text-emerald-700">EN-71 / CE Onaylı (Toksiksiz)</span>
                      </div>

                      {/* Varsa Özel Nitelik Maddeleri */}
                      {detailProduct.features && detailProduct.features.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100">
                          <span className="text-slate-700 font-bold block mb-1">Öne Çıkan Özellikler:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                            {detailProduct.features.map((feat, idx) => (
                              <li key={idx}>{feat}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. DETAYLI AÇIKLAMA */}
                  {activeTab === 'desc' && (
                    <div className="space-y-2 text-xs">
                      <p className="text-slate-700 leading-relaxed">
                        {detailProduct.description ||
                          `${detailProduct.title}, Mete Kırtasiye güvencesiyle doğrudan yetkili distribütöründen temin edilmiştir. Okul, ofis ve atölye çalışmalarınızda en yüksek performansı ve dayanıklılığı sunar.`}
                      </p>
                      <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-[11px] text-slate-600 space-y-1">
                        <div className="font-bold text-slate-800">Mete Kırtasiye Orijinallik Taahhüdü:</div>
                        <p>
                          Web sitemizde gördüğünüz tüm ürün fotoğrafları distribütörün resmi kataloglarından ve fiziksel stoklarımızdan temin edilmiştir. Tarafınıza gönderilecek ürün fotoğraftakiyle birebir aynıdır.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 3. MARKA TANITIMI (BRAND DESCRIPTION) */}
                  {activeTab === 'brand' && (
                    <div className="space-y-3 text-xs">
                      {BRAND_INFO[detailProduct.brand] ? (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div>
                              <div className="text-sm font-black text-slate-900">
                                {BRAND_INFO[detailProduct.brand].name}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {BRAND_INFO[detailProduct.brand].tagline}
                              </div>
                            </div>
                            <span className="text-xs bg-slate-100 font-bold px-2.5 py-1 rounded-lg text-slate-800">
                              {BRAND_INFO[detailProduct.brand].country} · {BRAND_INFO[detailProduct.brand].foundedYear}
                            </span>
                          </div>

                          <p className="text-slate-600 leading-relaxed">
                            {BRAND_INFO[detailProduct.brand].description}
                          </p>

                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                            <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 mb-1">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>Resmi Kalite ve Orijinallik Garantisi</span>
                            </div>
                            <p className="text-emerald-800 text-[11px]">
                              {BRAND_INFO[detailProduct.brand].qualityGuarantee}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-600">
                          <strong>{detailProduct.brand}</strong>, Mete Kırtasiye güvencesiyle temin edilen yetkili distribütör markasıdır.
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. DEĞERLENDİRMELER */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-slate-800">Ayşe K. (Doğrulanmış Müşteri)</span>
                          <span className="text-amber-500">★★★★★</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          Fotoğraftaki ürünün birebir aynısı geldi, paketleme çok özenliydi. Çok teşekkürler Mete Kırtasiye!
                        </p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-slate-800">Mehmet T. (Öğretmen)</span>
                          <span className="text-amber-500">★★★★★</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          Sınıf için toplu sipariş verdik, ertesi gün eksiksiz ulaştı. Kalitesi harika.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== FLOATING COMPARE BAR / DOCK (ALTTAN YÜZEN KARŞILAŞTIRMA BARI) ===================== */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-3xl bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-slideUp">
          {/* Sol: Seçili Ürün Minyatürleri ve Sayaç */}
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white">Karşılaştırma</span>
                  <span className="bg-blue-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {compareProducts.length} / 3
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate max-w-[170px] sm:max-w-none">
                  {compareProducts.length === 1
                    ? 'Kıyaslamak için 1 ürün daha seçin'
                    : `${compareProducts.length} ürün kıyaslamaya hazır`}
                </span>
              </div>
            </div>

            {/* Ürün Resimleri */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 pl-1 scrollbar-none">
              {compareProducts.map((p) => (
                <div
                  key={p.barcode}
                  className="relative group w-10 h-10 rounded-xl bg-white p-1 border border-slate-700 shrink-0 flex items-center justify-center"
                  title={p.title}
                >
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-contain" />
                  <button
                    onClick={() => handleRemoveCompare(p.barcode)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-[10px] font-black cursor-pointer shadow-xs"
                    title="Çıkar"
                  >
                    ×
                  </button>
                </div>
              ))}
              {Array.from({ length: 3 - compareProducts.length }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center text-[10px] text-slate-500 shrink-0 select-none font-bold"
                  title="Boş Karşılaştırma Yuvası"
                >
                  +{idx + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Sağ: Aksiyon Butonları */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              onClick={handleClearCompare}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 cursor-pointer transition-colors font-medium"
            >
              Temizle
            </button>

            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#f43f2d] hover:bg-[#d93424] text-white text-xs font-black rounded-xl shadow-lg cursor-pointer transition-all active:scale-98"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Ürünleri Karşılaştır ({compareProducts.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================== BİLDİRİM TOASTI (Örn: Maks 3 Ürün) ===================== */}
      {compareToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-fadeIn max-w-sm">
          <ArrowLeftRight className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="leading-snug">{compareToast}</span>
        </div>
      )}

      {/* ===================== ÜRÜN KARŞILAŞTIRMA MODALI ===================== */}
      <ProductCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={compareProducts}
        onRemoveProduct={handleRemoveCompare}
        onClearAll={handleClearCompare}
        onAddToCart={(p, qty) => handleAdd(p, qty || 1)}
        onOpenAddMore={() => setIsCompareModalOpen(false)}
      />
    </section>
  );
};
