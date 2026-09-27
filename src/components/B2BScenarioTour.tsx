import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  CreditCard,
  FileCheck,
  Play,
} from 'lucide-react';

export interface B2BScenarioTourProps {
  currentStep: number;
  onExecuteStep: (stepNumber: number) => void;
  onAutoRunAll: () => void;
}

export const B2BScenarioTour: React.FC<B2BScenarioTourProps> = ({
  currentStep,
  onExecuteStep,
  onAutoRunAll,
}) => {
  const steps = [
    {
      num: 1,
      title: 'Giriş & Bakiye Kontrolü',
      desc: 'b2b.destekkirtasiye.com.tr giriş, cari bakiye (38.450 ₺) ve ekstre kontrolü.',
      icon: ShieldCheck,
    },
    {
      num: 2,
      title: 'Kategoriler & Finans Gezintisi',
      desc: 'Çanta, Kırtasiye, Ofis kategorileri; Sipariş Takip ve Finans sekmeleri.',
      icon: Layers,
    },
    {
      num: 3,
      title: 'Çanta Seçimi & Özel Baskı (10 Adet)',
      desc: "'Ürüne özel baskı ilavesi yapılacaktır' notu, DTF baskı ve önizleme kaydı.",
      icon: Package,
    },
    {
      num: 4,
      title: 'Sepet & Cari Hesap ile Tamamlama',
      desc: 'Fatura adresi kontrolü, 10 adet teyidi, cari ödeme seçimi ve sipariş onayı.',
      icon: CreditCard,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-[#1e293b] border border-red-500/40 rounded-2xl p-4 shadow-xl text-slate-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                Canlı B2B Senaryo Asistanı (Baştan Sona Rehberli Akış)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                b2b.destekkirtasiye.com.tr
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              İstenen senaryoyu ister adım adım inceleyin, ister tek tıkla canlı olarak baştan sona otomatik tamamlayın.
            </p>
          </div>
        </div>

        {/* Action Button: Auto Run */}
        <button
          onClick={onAutoRunAll}
          className="self-start lg:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Tüm Senaryoyu Otomatik Yürüt</span>
        </button>
      </div>

      {/* Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
        {steps.map((st) => {
          const StepIcon = st.icon;
          const isActive = currentStep === st.num;
          const isCompleted = currentStep > st.num;

          return (
            <div
              key={st.num}
              onClick={() => onExecuteStep(st.num)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                isActive
                  ? 'bg-red-600/20 border-red-500 text-white shadow-md ring-1 ring-red-500/50'
                  : isCompleted
                  ? 'bg-slate-900/90 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : isActive
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? '✓' : st.num}
                  </span>
                  <span className={isActive ? 'text-white' : 'text-slate-200'}>{st.title}</span>
                </div>
                <StepIcon
                  className={`w-4 h-4 ${
                    isCompleted ? 'text-emerald-400' : isActive ? 'text-red-400' : 'text-slate-500'
                  }`}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-tight">{st.desc}</p>

              <div className="pt-1 flex items-center justify-between text-[10px]">
                <span
                  className={`font-semibold ${
                    isCompleted
                      ? 'text-emerald-400'
                      : isActive
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }`}
                >
                  {isCompleted ? 'Tamamlandı' : isActive ? 'Şu Anki Adım' : 'Sonraki Adım'}
                </span>
                <span className="text-red-400 flex items-center gap-0.5 font-bold">
                  <span>Adımı Aç</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
