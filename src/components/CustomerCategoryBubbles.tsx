import React from 'react';
import { METE_CATEGORIES } from '../data/stationeryData';
import { MainCategory } from '../types/architecture';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CustomerCategoryBubblesProps {
  selectedCategoryId?: string;
  onSelectCategory: (cat: MainCategory) => void;
  onOpenPrintModal?: () => void;
}

// Category visual photo mapping
const CATEGORY_VISUALS: { [key: string]: { img: string; badge: string; color: string } } = {
  'boya-sanat': {
    img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=80',
    badge: '180+ Çeşit',
    color: 'from-amber-500 to-rose-500',
  },
  'yazi-cizim': {
    img: 'https://images.unsplash.com/photo-1585336261026-62c72b220374?w=400&auto=format&fit=crop&q=80',
    badge: '240+ Kalem',
    color: 'from-blue-500 to-cyan-500',
  },
  'defter-kagit': {
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
    badge: 'Gıpta & Keskin',
    color: 'from-emerald-500 to-teal-500',
  },
  'okul-canta': {
    img: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=400&auto=format&fit=crop&q=80',
    badge: 'Yaygan & Coral',
    color: 'from-purple-500 to-indigo-500',
  },
  'ofis-dosyalama': {
    img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&auto=format&fit=crop&q=80',
    badge: 'Leitz & Mas',
    color: 'from-slate-600 to-slate-800',
  },
  'hobi-tuhafiye': {
    img: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=400&auto=format&fit=crop&q=80',
    badge: 'Oyun & Dikiş',
    color: 'from-pink-500 to-rose-500',
  },
  'fotokopi-baski': {
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
    badge: '1 Dk Çıktı',
    color: 'from-red-600 to-orange-600',
  },
};

export const CustomerCategoryBubbles: React.FC<CustomerCategoryBubblesProps> = ({
  selectedCategoryId,
  onSelectCategory,
  onOpenPrintModal,
}) => {
  return (
    <div className="w-full bg-white border-y border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-[#f43f2d]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-heading">
                Reyonlar & Kategoriler
              </h3>
              <p className="text-[11px] text-slate-500">
                Görmek istediğiniz kategoriye tıklayın, tüm ürün fotoğrafları anında açılsın
              </p>
            </div>
          </div>

          <a
            href="#vitrin"
            className="text-xs font-bold text-[#f43f2d] hover:text-[#d93424] flex items-center gap-1"
          >
            <span>Tüm Vitrin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 7 Kategori Kartı (Trendyol Görsel Kategori Stili) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {METE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const visual = CATEGORY_VISUALS[cat.id] || {
              img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
              badge: 'Popüler',
              color: 'from-slate-600 to-slate-800',
            };

            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'fotokopi-baski' && onOpenPrintModal) {
                    onOpenPrintModal();
                  } else {
                    onSelectCategory(cat);
                  }
                }}
                className={`group flex flex-col items-center text-center p-3 rounded-2xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-[#f43f2d] bg-rose-50/50 shadow-md ring-2 ring-[#f43f2d]/20 scale-102'
                    : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm'
                }`}
              >
                {/* Dairesel Fotoğraf */}
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2.5 shadow-xs border border-slate-200 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={visual.img}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <span className="absolute bottom-1 right-1 text-[9px] font-black text-white bg-black/60 px-1.5 py-0.5 rounded-md">
                    {visual.badge}
                  </span>
                </div>

                {/* Kategori Adı */}
                <span
                  className={`text-xs font-bold transition-colors line-clamp-1 ${
                    isSelected ? 'text-[#f43f2d]' : 'text-slate-800 group-hover:text-[#f43f2d]'
                  }`}
                >
                  {cat.name}
                </span>

                <span className="text-[10px] text-slate-400 mt-0.5">
                  {cat.subCategories.length} Alt Reyon
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
