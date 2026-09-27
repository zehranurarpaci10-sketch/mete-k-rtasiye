import React, { useState } from 'react';
import {
  ShoppingBag,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_CATALOG_DATA, METE_CATEGORIES } from '../data/stationeryData';
import { MainCategory, ProductCatalogRow } from '../types/architecture';

interface ProductGridShowcaseProps {
  selectedCategory: MainCategory | null;
  onSelectCategory: (cat: MainCategory) => void;
  onAddToCart: (product: ProductCatalogRow | string) => void;
  products?: ProductCatalogRow[];
}

export const ProductGridShowcase: React.FC<ProductGridShowcaseProps> = ({
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  products = SAMPLE_CATALOG_DATA,
}) => {
  const [selectedSub, setSelectedSub] = useState<string>('all');
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

  const activeCategory = selectedCategory || METE_CATEGORIES[1]; // Default Defter & Kağıt

  const displayProducts = products.filter((p) => {
    if (selectedCategory && p.mainCategory !== selectedCategory.name) {
      return false;
    }
    if (selectedSub !== 'all' && p.subCategory !== selectedSub) {
      return false;
    }
    return true;
  });

  const handleAdd = (product: ProductCatalogRow) => {
    onAddToCart(product);
    setAddedItems({ ...addedItems, [product.barcode]: true });
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.barcode]: false }));
    }, 2000);
  };

  return (
    <section className="w-full bg-[#f8f9fa] py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <a href="#" className="hover:text-slate-900 transition-colors">Ana Sayfa</a>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-slate-800">{activeCategory.name}</span>
          {selectedSub !== 'all' && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-[#f43f2d] font-bold">{selectedSub}</span>
            </>
          )}
        </nav>

        {/* Başlık ve Alt Kategori Filtre Butonları */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              {activeCategory.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {activeCategory.shortDescription}
            </p>
          </div>

          {/* Hızlı Alt Kategori Filtre Sekmeleri */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <button
              onClick={() => setSelectedSub('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                selectedSub === 'all'
                  ? 'bg-[#f43f2d] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü
            </button>
            {activeCategory.subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSub(sub.name)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedSub === sub.name
                    ? 'bg-[#f43f2d] text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ürün Kartları Izgarası (Görseldeki sade, beyaz kutu ve kırmızı butonlu stil) */}
        {displayProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            Bu alt kategoride henüz ürün listelenmedi. Diğer kategorileri seçebilirsiniz.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayProducts.map((product) => {
              const isAdded = addedItems[product.barcode];

              return (
                <div
                  key={product.barcode}
                  className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Görsel */}
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-50 mb-4 border border-slate-100">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {product.stock <= 0 ? (
                        <span className="absolute bottom-2 right-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Tükendi
                        </span>
                      ) : product.stock <= 25 ? (
                        <span className="absolute bottom-2 right-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md animate-pulse">
                          Son {product.stock} Adet!
                        </span>
                      ) : (
                        <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                          Stok: {product.stock}
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="text-[11px] text-slate-400 font-medium mb-1">
                      {product.brand} · {product.subCategory}
                    </div>

                    {/* Ürün Adı */}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 min-h-[38px]">
                      {product.title}
                    </h3>
                  </div>

                  {/* Fiyat ve Kırmızı Buton */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3">
                    <div>
                      <div className="text-xl font-black text-[#f43f2d]">
                        {product.discountPrice ? product.discountPrice.toFixed(0) : product.priceWithVat.toFixed(0)} TL
                      </div>
                      {product.discountPrice && (
                        <div className="text-xs text-slate-400 line-through">
                          {product.priceWithVat.toFixed(0)} TL
                        </div>
                      )}
                    </div>

                    <button
                      disabled={product.stock <= 0}
                      onClick={() => handleAdd(product)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        product.stock <= 0
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#f43f2d] hover:bg-[#d93424] text-white active:scale-98'
                      }`}
                    >
                      {product.stock <= 0 ? (
                        <span>Stok Tükendi</span>
                      ) : isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Sepete Eklendi</span>
                        </>
                      ) : (
                        <>
                          <span>Sepete Ekle</span>
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
    </section>
  );
};
