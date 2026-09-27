import React, { useState } from 'react';
import {
  FolderTree,
  LayoutGrid,
  Check,
  Copy,
  BookOpen,
  Backpack,
  PenTool,
  Palette,
  FolderArchive,
  Scissors,
  Gift,
  ChevronRight,
  Info,
} from 'lucide-react';
import { METE_CATEGORIES } from '../data/stationeryData';
import { MainCategory, SubCategory } from '../types/architecture';

interface CategoryArchitectureViewProps {
  onCategorySelect?: (cat: MainCategory) => void;
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

export const CategoryArchitectureView: React.FC<CategoryArchitectureViewProps> = ({
  onCategorySelect,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'tree'>('cards');
  const [selectedPersona, setSelectedPersona] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const filteredCategories = METE_CATEGORIES.filter((cat) => {
    if (selectedPersona === 'all') return true;
    return cat.targetPersonas.includes(selectedPersona as any);
  });

  const handleCopyHierarchy = () => {
    const jsonOutput = JSON.stringify(
      METE_CATEGORIES.map((c) => ({
        anaKategori: c.name,
        slug: c.slug,
        altKategoriler: c.subCategories.map((s) => ({
          altKategori: s.name,
          slug: s.slug,
          erpKodu: s.erpCode,
          aramaKelimeleri: s.searchKeywords,
        })),
      })),
      null,
      2
    );
    navigator.clipboard.writeText(jsonOutput);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <section id="kategori-agaci" className="w-full bg-[#f8f9fa] py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#f43f2d] uppercase tracking-wider mb-1">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Sade Kategori Mimarisi · Çıktı 1</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              7 Ana Kategori & 36 Alt Kategori Ağacı
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Müşterinin boğulmasını engelleyen, 2. seviyede doğrudan hedefe ulaştıran hiyerarşik yapı.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Persona Filtresi */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <button
                onClick={() => setSelectedPersona('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedPersona === 'all'
                    ? 'bg-[#f43f2d] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tümü (7)
              </button>
              <button
                onClick={() => setSelectedPersona('veli')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedPersona === 'veli'
                    ? 'bg-[#f43f2d] text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Veliler
              </button>
              <button
                onClick={() => setSelectedPersona('ofis')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedPersona === 'ofis'
                    ? 'bg-[#f43f2d] text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ofis / Kurumsal
              </button>
              <button
                onClick={() => setSelectedPersona('ogretmen')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedPersona === 'ogretmen'
                    ? 'bg-[#f43f2d] text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Öğretmenler
              </button>
            </div>

            {/* Görünüm Modu */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-[#1e2025] text-white' : 'text-slate-400'
                }`}
                title="Kart Görünümü"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'tree' ? 'bg-[#1e2025] text-white' : 'text-slate-400'
                }`}
                title="Ağaç Görünümü"
              >
                <FolderTree className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleCopyHierarchy}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#f43f2d]" />
                  <span className="text-[#f43f2d] font-bold">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Ağacı JSON Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Mode 1: Kart Görünümü */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories.map((cat, idx) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-rose-200 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-rose-50 text-[#f43f2d]">
                        {getCategoryIcon(cat.iconName)}
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-bold">
                        0{idx + 1}
                      </span>
                    </div>
                    {cat.badge && (
                      <span className="text-[10px] font-bold text-[#f43f2d] bg-rose-50 px-2 py-0.5 rounded-full">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-slate-900 font-heading">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {cat.shortDescription}
                  </p>

                  {/* Alt Kategoriler Listesi */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Alt Kategoriler ({cat.subCategories.length})
                    </div>
                    {cat.subCategories.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSubCategory(sub)}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-rose-50/60 cursor-pointer text-xs text-slate-700 transition-colors group"
                      >
                        <div className="flex items-center gap-1.5 line-clamp-1">
                          <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#f43f2d] transition-colors" />
                          <span className="font-medium group-hover:text-[#f43f2d]">
                            {sub.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {sub.erpCode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alt Bilgi */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="text-slate-500 truncate max-w-[160px]">
                    <span className="font-bold text-slate-700">Markalar: </span>
                    <span>{cat.featuredBrands.slice(0, 2).join(', ')}</span>
                  </div>
                  <button
                    onClick={() => onCategorySelect && onCategorySelect(cat)}
                    className="text-[#f43f2d] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span>Vitrini Gör</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Mode 2: Ağaç Görünümü */}
        {viewMode === 'tree' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 overflow-x-auto shadow-sm">
            <div className="text-xs font-mono text-slate-500 mb-4 pb-2 border-b border-slate-100">
              Mete Kırtasiye ERP / XML Kategori Ağacı Hiyerarşisi
            </div>

            <div className="space-y-4 font-mono text-xs">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="border-l-2 border-[#f43f2d] pl-4 py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 bg-rose-50 text-[#f43f2d] px-2 py-0.5 rounded-md">
                      [L1] {cat.name}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      slug: /{cat.slug} · hedef: {cat.targetPersonas.join(', ')}
                    </span>
                  </div>

                  <div className="mt-2 ml-4 space-y-2 border-l border-slate-200 pl-4">
                    {cat.subCategories.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSubCategory(sub)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-rose-50/50 cursor-pointer border border-transparent hover:border-rose-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-800 font-semibold">
                            ├── [L2] {sub.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            (slug: /{cat.slug}/{sub.slug})
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            ERP: {sub.erpCode}
                          </span>
                          <span>{sub.itemCount} Ürün</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alt Kategori Bilgi Modalı */}
        {selectedSubCategory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-rose-50 text-[#f43f2d] rounded-xl">
                    <Info className="w-4 h-4" />
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 font-heading">
                    Alt Kategori Detayı
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedSubCategory(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Kategori Adı</span>
                  <div className="text-sm font-bold text-slate-900">{selectedSubCategory.name}</div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Açıklama & Kapsam</span>
                  <div className="text-slate-700 leading-relaxed">{selectedSubCategory.description}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">ERP Kodu</span>
                    <div className="font-mono font-bold text-slate-900">{selectedSubCategory.erpCode}</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Katalog Ürün Sayısı</span>
                    <div className="font-bold text-[#f43f2d]">{selectedSubCategory.itemCount} Ürün</div>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Arama Motoru (SEO / Algolia) Etiketleri
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedSubCategory.searchKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedSubCategory(null)}
                  className="bg-[#1e2025] hover:bg-[#2c2f37] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
