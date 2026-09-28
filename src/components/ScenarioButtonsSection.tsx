import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  Palette,
  TrendingUp,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Zap,
  Check,
} from 'lucide-react';
import { SCENARIO_BUTTONS } from '../data/stationeryData';
import { ScenarioButton } from '../types/architecture';

interface ScenarioButtonsSectionProps {
  onAddToCart: (title: string) => void;
  onFilterByCategory?: (categoryId: string) => void;
}

const getScenarioIcon = (iconName: string) => {
  switch (iconName) {
    case 'GraduationCap':
      return <GraduationCap className="w-5 h-5 text-[#f43f2d]" />;
    case 'Briefcase':
      return <Briefcase className="w-5 h-5 text-slate-700" />;
    case 'Sparkles':
      return <Sparkles className="w-5 h-5 text-amber-500" />;
    case 'Palette':
      return <Palette className="w-5 h-5 text-rose-500" />;
    case 'TrendingUp':
      return <TrendingUp className="w-5 h-5 text-[#f43f2d]" />;
    case 'Search':
      return <Search className="w-5 h-5 text-slate-700" />;
    default:
      return <Zap className="w-5 h-5 text-[#f43f2d]" />;
  }
};

export const ScenarioButtonsSection: React.FC<ScenarioButtonsSectionProps> = ({
  onAddToCart,
  onFilterByCategory,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioButton | null>(null);
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [addedSingleItem, setAddedSingleItem] = useState<{ [key: string]: boolean }>({});

  const handleQuickAddAll = (scenario: ScenarioButton) => {
    scenario.sampleItems.forEach((item) => {
      onAddToCart(item.name);
    });
    setAddedItems({ ...addedItems, [scenario.id]: true });
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [scenario.id]: false }));
    }, 2500);
  };

  const handleAddSingle = (itemName: string) => {
    onAddToCart(itemName);
    setAddedSingleItem((prev) => ({ ...prev, [itemName]: true }));
    setTimeout(() => {
      setAddedSingleItem((prev) => ({ ...prev, [itemName]: false }));
    }, 1500);
  };

  return (
    <section className="w-full bg-[#f8f9fa] border-b border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#f43f2d] uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Hızlı Müşteri Paketleri</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Tek Tıkla Hazır Sepet Paketleri
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Tek tek ürün aramak yerine ihtiyacınıza uygun eksiksiz paketi saniyeler içinde sepetinize ekleyin.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Aynı Gün Kargoya Verilir</span>
          </div>
        </div>

        {/* 6 Hızlı Paket Kartı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCENARIO_BUTTONS.map((btn) => {
            const isSelected = selectedScenario?.id === btn.id;
            const packageTotal = btn.sampleItems.reduce((acc, i) => acc + i.price, 0);

            return (
              <div
                key={btn.id}
                className={`relative rounded-2xl p-5 transition-all border text-left flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? 'border-[#f43f2d] bg-white shadow-md ring-2 ring-[#f43f2d]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedScenario(btn)}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-rose-50 transition-colors">
                      {getScenarioIcon(btn.icon)}
                    </div>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      {btn.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#f43f2d] transition-colors flex items-center justify-between">
                    <span>{btn.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#f43f2d] transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                    {btn.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Paket Fiyatı</span>
                    <span className="font-black text-[#f43f2d] text-base">{packageTotal} TL</span>
                  </div>
                  <span className="bg-[#f43f2d]/10 hover:bg-[#f43f2d] text-[#f43f2d] hover:text-white font-bold px-3 py-1.5 rounded-xl transition-all text-xs">
                    Paketi Aç & Sepete At &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Seçilen Paketin İnteraktif Vitrin Paneli */}
        {selectedScenario && (
          <div className="mt-6 rounded-3xl bg-white border-2 border-[#f43f2d]/40 p-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
              {/* Sol Açıklama */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-rose-50 text-[#f43f2d] shadow-2xs">
                    {getScenarioIcon(selectedScenario.icon)}
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-[#f43f2d] uppercase tracking-wider">
                      Seçilen Hazır Paket
                    </span>
                    <h4 className="text-xl font-black text-slate-900 font-heading">
                      {selectedScenario.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-3.5 leading-relaxed">
                  {selectedScenario.subtitle}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700">
                    📦 <strong>3 Temel Ürün</strong> Dahil
                  </div>
                  <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-800">
                    🚚 <strong>Ücretsiz / Hızlı Kargo</strong>
                  </div>
                  <div className="bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-800">
                    ⭐ <strong>%100 Orijinal Marka Garantisi</strong>
                  </div>
                </div>

                {onFilterByCategory && selectedScenario.targetCategoryIds.length > 0 && (
                  <div className="mt-5">
                    <button
                      onClick={() => {
                        const targetId = selectedScenario.targetCategoryIds[0];
                        onFilterByCategory(targetId);
                        const el = document.getElementById('vitrin');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-[#f43f2d] flex items-center gap-1.5 underline decoration-slate-300 hover:decoration-[#f43f2d] cursor-pointer"
                    >
                      <span>Bu pakete ait reyon ürünlerini vitrinde listele</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Sağ: Hazır Paket Ürünleri & Sepete Ekle */}
              <div className="w-full lg:w-[480px] bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-inner">
                <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#f43f2d]" />
                    <span>Paket İçeriğindeki Ürünler</span>
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Toplam Tutar</span>
                    <span className="text-base font-black text-[#f43f2d]">
                      {selectedScenario.sampleItems.reduce((acc, i) => acc + i.price, 0)} TL
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 mb-4">
                  {selectedScenario.sampleItems.map((item, idx) => {
                    const isItemAdded = addedSingleItem[item.name];

                    return (
                      <div
                        key={idx}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-2xs hover:border-rose-200 transition-colors"
                      >
                        <div className="pr-3 flex-1 min-w-0">
                          <div className="font-bold text-slate-900 truncate">{item.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{item.brand}</div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-black text-slate-900">{item.price} TL</span>
                          <button
                            onClick={() => handleAddSingle(item.name)}
                            className={`text-xs px-3 py-1.5 rounded-xl transition-all font-bold cursor-pointer flex items-center gap-1 ${
                              isItemAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 hover:bg-[#f43f2d] hover:text-white text-slate-700'
                            }`}
                          >
                            {isItemAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Eklendi</span>
                              </>
                            ) : (
                              <span>+ Ekle</span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleQuickAddAll(selectedScenario)}
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 ${
                      addedItems[selectedScenario.id]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#f43f2d] hover:bg-[#d93424] text-white'
                    }`}
                  >
                    {addedItems[selectedScenario.id] ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tüm Paket Sepete Eklendi!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Tüm Paketi Sepete Ekle ({selectedScenario.sampleItems.reduce((acc, i) => acc + i.price, 0)} TL)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedScenario(null)}
                    className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
