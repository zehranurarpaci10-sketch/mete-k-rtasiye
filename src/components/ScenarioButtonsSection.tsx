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

  const handleQuickAddAll = (scenario: ScenarioButton) => {
    scenario.sampleItems.forEach((item) => {
      onAddToCart(item.name);
    });
    setAddedItems({ ...addedItems, [scenario.id]: true });
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [scenario.id]: false }));
    }, 2500);
  };

  return (
    <section className="w-full bg-[#f8f9fa] border-b border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#f43f2d] uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Müşteri Odaklı Hızlı Senaryolar · Çıktı 2</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Hızlı Erişim & Alışveriş Senaryoları
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Müşterilerin sitede kaybolmadan doğrudan ihtiyaç paketine ulaşmasını sağlayan vitrin başlıkları.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#f43f2d]"></span>
            <span>Maksimum 2 Tık ile Sepete Eklenir</span>
          </div>
        </div>

        {/* 6 Hızlı Senaryo Buton Kartı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCENARIO_BUTTONS.map((btn) => {
            const isSelected = selectedScenario?.id === btn.id;

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
                    <span className="text-[11px] font-semibold text-slate-500">
                      {btn.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#f43f2d] transition-colors flex items-center gap-1.5">
                    <span>{btn.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#f43f2d] transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {btn.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#f43f2d]" />
                    <span>Sepete Varış: <strong>{btn.avgClicksToBasket} Tık</strong></span>
                  </span>
                  <span className="font-bold text-[#f43f2d] group-hover:underline">
                    Paketi Aç &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Seçilen Senaryonun İnteraktif Vitrin Paneli */}
        {selectedScenario && (
          <div className="mt-6 rounded-2xl bg-white border-2 border-[#f43f2d]/30 p-6 shadow-lg animate-fadeIn">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
              {/* Sol Açıklama */}
              <div className="flex-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-rose-50 text-[#f43f2d]">
                    {getScenarioIcon(selectedScenario.icon)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#f43f2d] uppercase tracking-wider">
                      Seçilen Senaryo Çözümü
                    </span>
                    <h4 className="text-lg font-black text-slate-900">
                      {selectedScenario.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 mt-3 leading-relaxed">
                  <strong>Strateji & Dönüşüm Nedeni:</strong> {selectedScenario.whyCrucial}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Hedef Kitle</span>
                    <span className="font-semibold text-slate-900">{selectedScenario.targetPersona}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Gezinme Hızı</span>
                    <span className="font-bold text-[#f43f2d]">&lt; 30 Saniye (2 Tık)</span>
                  </div>
                </div>
              </div>

              {/* Sağ: Hazır Paket Ürünleri & Sepete Ekle */}
              <div className="w-full lg:w-[460px] bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#f43f2d]" />
                    <span>Önerilen Senaryo Paketi</span>
                  </span>
                  <span className="text-xs font-black text-[#f43f2d]">
                    Toplam: {selectedScenario.sampleItems.reduce((acc, i) => acc + i.price, 0)} TL
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {selectedScenario.sampleItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="pr-2">
                        <div className="font-bold text-slate-800 line-clamp-1">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.brand}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#f43f2d] whitespace-nowrap">{item.price} TL</span>
                        <button
                          onClick={() => onAddToCart(item.name)}
                          className="bg-slate-100 hover:bg-[#f43f2d] hover:text-white text-slate-700 text-[11px] px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer"
                        >
                          + Ekle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickAddAll(selectedScenario)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      addedItems[selectedScenario.id]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#f43f2d] hover:bg-[#d93424] text-white shadow-xs'
                    }`}
                  >
                    {addedItems[selectedScenario.id] ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tüm Liste Sepete Eklendi!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Tüm Paketi 1 Tıkla Sepete Ekle</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedScenario(null)}
                    className="py-2.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
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
