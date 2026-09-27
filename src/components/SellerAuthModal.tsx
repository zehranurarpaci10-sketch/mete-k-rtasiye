import React, { useState } from 'react';
import { Store, Lock, KeyRound, AlertCircle, ArrowRight, X, ShieldCheck } from 'lucide-react';

interface SellerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SellerAuthModal: React.FC<SellerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pinCode, setPinCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo passcode or any input
    if (pinCode.trim() === '1234' || pinCode.trim() === 'mete2026' || pinCode.trim().length >= 4) {
      setErrorMsg(null);
      onSuccess();
    } else {
      setErrorMsg('Geçersiz satıcı şifresi! Hızlı erişim için "Tek Tıkla Satıcı Girişi Yap" butonunu kullanabilirsiniz.');
    }
  };

  const handleQuickLogin = () => {
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-[#181a20] rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#2d313d] shadow-2xl text-slate-200 text-xs relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f43f2d] text-white flex items-center justify-center shadow-lg font-black text-xl">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-heading">
                Mete Partner Satıcı Girişi
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Yetkili Panel
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Trendyol Satıcı Paneli Mantığında Stok & Kargo Kontrolü
            </p>
          </div>
        </div>

        <div className="bg-[#121418] p-3.5 rounded-2xl border border-[#282b35] mb-5 text-slate-300 text-[11px] leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-[#f43f2d] mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Sadece Mağaza Sahibi & Satıcı Ekranı</span>
          </div>
          Bu panel müşterilere kapalıdır. Burada envanterinizi, anlık stokları ve depodan doğrudan <strong>kendi ev adresinize kargo</strong> süreçlerini yönetebilirsiniz.
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-bold text-slate-300 block mb-1">
              Satıcı Yetkili PIN / Şifresi
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Örn: 1234 veya mete2026"
                value={pinCode}
                onChange={(e) => {
                  setPinCode(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full bg-[#121418] border border-[#2d313d] rounded-xl pl-9 pr-3 py-2.5 text-white font-mono outline-none focus:border-[#f43f2d]"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Demo Test Şifresi: <code className="text-amber-400 font-bold">1234</code>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#f43f2d] hover:bg-[#d93424] text-white font-black py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>Şifre ile Satıcı Paneline Gir</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-[#282b35]"></div>
            <span className="shrink mx-2 text-[10px] text-slate-500 uppercase">veya</span>
            <div className="grow border-t border-[#282b35]"></div>
          </div>

          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full bg-[#242731] hover:bg-[#2e323e] text-emerald-400 font-bold py-2.5 px-4 rounded-xl border border-emerald-500/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Tek Tıkla Doğrula & Satıcı Paneline Geç</span>
          </button>
        </form>
      </div>
    </div>
  );
};
