import React, { useState } from 'react';
import {
  MousePointerClick,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { USER_JOURNEYS } from '../data/stationeryData';
import { UserJourney } from '../types/architecture';

interface ClickJourneySimulatorProps {
  onAddToCart: (title: string) => void;
}

export const ClickJourneySimulator: React.FC<ClickJourneySimulatorProps> = ({ onAddToCart }) => {
  const [selectedJourney, setSelectedJourney] = useState<UserJourney>(USER_JOURNEYS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completed, setCompleted] = useState(false);

  const handleSelectJourney = (journey: UserJourney) => {
    setSelectedJourney(journey);
    setCurrentStepIndex(0);
    setCompleted(false);
  };

  const handleNextStep = () => {
    if (currentStepIndex < selectedJourney.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCompleted(true);
      onAddToCart(selectedJourney.targetProduct);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setCompleted(false);
  };

  return (
    <section className="w-full bg-[#1e2025] text-white py-10 border-b border-[#2d3038]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#f43f2d] uppercase tracking-wider mb-1.5">
              <MousePointerClick className="w-4 h-4" />
              <span>UX Doğrulama Laboratuvarı</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-heading">
              "Maksimum 2-3 Tık" Kuralı Canlı Simülatörü
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Veliler, öğrenciler, ofis çalışanları ve öğretmenlerin hedeflerine nasıl 2 tıkta ulaştığını adım adım test edin.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#16181c] p-3 rounded-2xl border border-[#2d3038] text-xs">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase">Geleneksel Siteler</span>
              <span className="font-bold text-rose-400">6 - 9 Tık & Sepet Terki</span>
            </div>
            <span className="text-slate-600">vs</span>
            <div className="text-left">
              <span className="text-slate-400 block text-[10px] uppercase">Mete Kırtasiye</span>
              <span className="font-black text-[#f43f2d]">Sadece 2 Tık</span>
            </div>
          </div>
        </div>

        {/* Persona Seçici Butonları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {USER_JOURNEYS.map((journey) => {
            const isSelected = selectedJourney.id === journey.id;

            return (
              <button
                key={journey.id}
                onClick={() => handleSelectJourney(journey)}
                className={`text-left p-4 rounded-2xl transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#282b33] border-[#f43f2d] shadow-md ring-1 ring-[#f43f2d]/40'
                    : 'bg-[#181a1f] border-[#2a2d35] hover:bg-[#22252c] text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2f323c] text-slate-300">
                    {journey.id.replace('journey-', '')}
                  </span>
                  <span className="text-xs font-bold text-[#f43f2d] flex items-center gap-1">
                    <MousePointerClick className="w-3 h-3" />
                    <span>{journey.newDesignClicks} Tık</span>
                  </span>
                </div>
                <div className="font-bold text-xs text-white line-clamp-1">
                  {journey.personaName}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {journey.personaRole}
                </div>
              </button>
            );
          })}
        </div>

        {/* İnteraktif Simülatör Sahnesi */}
        <div className="bg-[#181a1f] rounded-2xl border border-[#2d3038] p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Sol: Senaryo & Karşılaştırma */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#f43f2d] uppercase tracking-wider block mb-1">
                  Müşteri Senaryosu & Arayış
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedJourney.personaName}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {selectedJourney.scenario}
                </p>
              </div>

              <div className="bg-[#1e2025] p-4 rounded-2xl border border-[#2d3038] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hedef Ürün / Paket:</span>
                  <span className="font-bold text-white text-right">{selectedJourney.targetProduct}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#2a2d35]">
                  <span className="text-slate-400">Eski Sitede Tıklama Sayısı:</span>
                  <span className="font-bold text-rose-400 line-through">
                    {selectedJourney.oldWebsiteClicks} Tık (~3-5 dk)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mete Kırtasiye Yeni Mimarisi:</span>
                  <span className="font-black text-[#f43f2d]">
                    Yalnızca {selectedJourney.newDesignClicks} Tık (&lt;30 sn)
                  </span>
                </div>
              </div>

              <div className="text-xs text-rose-200 bg-rose-950/30 border border-rose-800/40 p-3.5 rounded-xl flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#f43f2d] shrink-0 mt-0.5" />
                <span>{selectedJourney.benefit}</span>
              </div>
            </div>

            {/* Sağ: Tıklama Adımları & Canlandırma */}
            <div className="lg:col-span-7 bg-[#1e2025] rounded-2xl p-5 sm:p-6 border border-[#2d3038]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Adım Adım Gezinme Akışı
                </span>
                <span className="text-xs font-mono text-[#f43f2d] font-bold">
                  Adım {currentStepIndex + 1} / {selectedJourney.steps.length}
                </span>
              </div>

              <div className="space-y-3">
                {selectedJourney.steps.map((step, idx) => {
                  const isActive = idx === currentStepIndex;
                  const isPast = idx < currentStepIndex || completed;

                  return (
                    <div
                      key={step.clickNumber}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-rose-950/20 border-[#f43f2d] shadow-sm'
                          : isPast
                          ? 'bg-[#181a1f] border-slate-700'
                          : 'bg-[#181a1f]/50 border-[#252830] opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                              isPast
                                ? 'bg-emerald-500 text-white'
                                : isActive
                                ? 'bg-[#f43f2d] text-white animate-pulse'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {step.clickNumber}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {step.clickNumber}. Tık Aksiyonu
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {step.duration}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 pl-8 leading-relaxed font-medium">
                        {step.action}
                      </p>

                      <div className="text-[10px] text-slate-400 pl-8 mt-1">
                        Ekran: <span className="text-slate-300 font-semibold">{step.screen}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Simülasyon Butonları */}
              <div className="mt-5 pt-4 border-t border-[#2d3038] flex items-center justify-between">
                {completed ? (
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tebrikler! Müşteri 2 tıkta sepetini doldurdu!</span>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-xs bg-[#2a2d35] hover:bg-[#383c46] text-white px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Yeniden Başlat
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-xs text-slate-400">
                      Sonraki adım:
                    </span>
                    <button
                      onClick={handleNextStep}
                      className="bg-[#f43f2d] hover:bg-[#d93424] text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>
                        {currentStepIndex === selectedJourney.steps.length - 1
                          ? 'Son Tık: Sepete Ekle'
                          : 'Sonraki Tık Adımı'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
