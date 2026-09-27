import React, { useState } from 'react';
import {
  Printer,
  X,
  FileText,
  Check,
  UploadCloud,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Trash2,
} from 'lucide-react';

import { PrintJobOrder } from '../types/architecture';

interface PrintServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (title: string) => void;
  onAddPrintOrder?: (order: PrintJobOrder) => void;
  onOpenSellerPortal?: () => void;
}

export const PrintServiceModal: React.FC<PrintServiceModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onAddPrintOrder,
  onOpenSellerPortal,
}) => {
  // Müşteri Bilgileri
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'store' | 'cargo'>('store');
  const [orderNote, setOrderNote] = useState<string>('');
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  // Baskı Özellikleri
  const [pageCount, setPageCount] = useState<number>(25);
  const [copyCount, setCopyCount] = useState<number>(1);
  const [printType, setPrintType] = useState<'bw' | 'color'>('bw');
  const [sidedness, setSidedness] = useState<'single' | 'double'>('double');
  const [binding, setBinding] = useState<'none' | 'spiral' | 'wire' | 'hardcover'>('spiral');
  const [paperType, setPaperType] = useState<'80gr' | '100gr' | 'glossy'>('80gr');
  
  // Dosya Durumu
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>({
    name: 'Tez_veya_Dokuman_Baskisi.pdf',
    size: '4.8 MB',
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  // Hesaplama
  const unitPagePrice = printType === 'bw' ? 0.75 : 2.5;
  const sidednessDiscount = sidedness === 'double' ? 0.9 : 1.0;
  const paperMultiplier = paperType === '80gr' ? 1.0 : paperType === '100gr' ? 1.3 : 1.8;
  
  const bindingPrice =
    binding === 'none' ? 0 : binding === 'spiral' ? 25 : binding === 'wire' ? 35 : 95;

  const totalCost = (
    (pageCount * unitPagePrice * sidednessDiscount * paperMultiplier + bindingPrice) *
    copyCount
  ).toFixed(2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      });
      setValidationError(null);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setValidationError('Lütfen baskı siparişi için Ad ve Soyadınızı giriniz.');
      return;
    }

    if (!phone.trim()) {
      setValidationError('Lütfen hazır olunca bilgilendirme için Telefon numaranızı giriniz.');
      return;
    }

    const newId = `BSK-${Math.floor(10000 + Math.random() * 90000)}`;
    setCreatedOrderId(newId);

    const orderTitle = `Baskı: ${fullName} · ${uploadedFile?.name || 'Doküman'} (${pageCount} Syf, ${printType === 'bw' ? 'S/B' : 'Renkli'}, ${binding === 'none' ? 'Zımbalı' : binding === 'spiral' ? 'Spiral' : binding === 'wire' ? 'Tel Spiral' : 'Sert Tez Cilt'}, ${copyCount} Adet)`;

    if (onAddPrintOrder) {
      onAddPrintOrder({
        id: newId,
        customerName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        fileName: uploadedFile?.name || 'Dokuman_Baskisi.pdf',
        fileSize: uploadedFile?.size,
        pageCount: Number(pageCount),
        copies: Number(copyCount),
        colorMode: printType === 'bw' ? 'Siyah-Beyaz' : 'Renkli',
        paperSize: 'A4',
        sided: sidedness === 'double' ? 'Çift Yüz (Arkalı Önlü)' : 'Tek Yüz',
        binding:
          binding === 'none'
            ? 'Zımbalı'
            : binding === 'spiral'
            ? 'Plastik Spiral'
            : binding === 'wire'
            ? 'Tel Spiral'
            : 'Ciltli / Tez Cilt',
        notes: orderNote,
        deliveryMethod: deliveryMethod === 'cargo' ? 'Evime / Adrese Kargo' : 'Mağazadan Teslim',
        totalPrice: Number(totalCost),
        status: 'Kuyrukta (Bekliyor)',
        createdAt: 'Az önce',
      });
    }

    onAddToCart(orderTitle);
    setOrderSuccess(true);
    setValidationError(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-6 p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        {/* Modal Üst Başlık */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-[#f43f2d] rounded-2xl border border-rose-100">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-[#f43f2d]">
                  Profesyonel Dijital Baskı Merkezi
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-bold text-slate-700">Mete Kırtasiye Sincan</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading mt-0.5">
                Kişiye Özel Doküman & Tez Baskı Siparişi
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hata veya Başarı Bildirimi */}
        {validationError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-[#f43f2d] rounded-xl text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{validationError}</span>
          </div>
        )}

        {orderSuccess ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2">
                İş Emri Kodu: #{createdOrderId}
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Baskı Siparişiniz Satıcı Portalına Düştü!
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Sayın <strong>{fullName}</strong>, yüklediğiniz doküman Mete Kırtasiye Satıcı Portalı'ndaki fotokopi kuyruğuna iletildi.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-xs text-left space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Müşteri:</span>
                <span className="font-bold text-slate-900">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">İletişim:</span>
                <span className="font-mono text-slate-800">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Yüklenen Belge:</span>
                <span className="font-bold text-rose-600 truncate max-w-[200px]">
                  {uploadedFile?.name || 'Dokuman_Baskisi.pdf'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Baskı Özellikleri:</span>
                <span>{pageCount} Sayfa · {copyCount} Kopya · {printType === 'bw' ? 'Siyah-Beyaz' : 'Renkli'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ciltleme:</span>
                <span className="font-semibold text-slate-800">
                  {binding === 'none' ? 'Zımbalı' : binding === 'spiral' ? 'Plastik Spiral' : binding === 'wire' ? 'Tel Spiral' : 'Sert Tez Cilt'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Teslimat:</span>
                <span className="font-semibold text-emerald-600">
                  {deliveryMethod === 'cargo' ? 'Evime / Adrese Kargo' : 'Mağazadan Teslim'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl max-w-md mx-auto text-xs text-amber-900 text-left">
              💡 <strong>Satıcı Çıktı Entegrasyonu:</strong> Bu sipariş, mağaza yetkilisinin satıcı portalına anında düştü. Dilerseniz hemen Satıcı Portalı'na geçerek bu dosyanın makineden çıktısını verebilirsiniz.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              {onOpenSellerPortal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSellerPortal();
                  }}
                  className="w-full sm:w-auto flex-1 bg-[#f43f2d] hover:bg-[#d93424] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>🏪 Satıcı Portalı'na Git & Çıktıyı Al</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setOrderSuccess(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Kapat ve Alışverişe Devam Et
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="mt-5 space-y-5 text-xs">
            {/* 1. MÜŞTERİ BİLGİLERİ (Ad Soyad, Telefon, E-Posta) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <User className="w-4 h-4 text-[#f43f2d]" />
                  <span>Sipariş Sahibi / Kişi Bilgileri (Zorunlu)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Baskı etiketine yazılacaktır
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Adı Soyadı */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Adı Soyadı <span className="text-[#f43f2d]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ahmet Yılmaz"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#f43f2d] focus:ring-1 focus:ring-[#f43f2d]"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Telefon */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Telefon Numarası (SMS / WhatsApp) <span className="text-[#f43f2d]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="0 (5XX) XXX XX XX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#f43f2d] focus:ring-1 focus:ring-[#f43f2d]"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* E-Posta */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    E-Posta Adresi (Fatura & Bildirim)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="ornek@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-[#f43f2d]"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Teslimat Tercihi */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Teslim Alma Tercihi
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('store')}
                      className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-colors cursor-pointer ${
                        deliveryMethod === 'store'
                          ? 'border-[#f43f2d] bg-white text-[#f43f2d] shadow-2xs'
                          : 'border-slate-300 bg-white/70 text-slate-600'
                      }`}
                    >
                      Mağazadan Teslim
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('cargo')}
                      className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-colors cursor-pointer ${
                        deliveryMethod === 'cargo'
                          ? 'border-[#f43f2d] bg-white text-[#f43f2d] shadow-2xs'
                          : 'border-slate-300 bg-white/70 text-slate-600'
                      }`}
                    >
                      Adrese Kargo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DOSYA YÜKLEME & DOKÜMAN BELİRLEME */}
            <div className="border-2 border-dashed border-slate-300 hover:border-[#f43f2d] rounded-2xl p-4 text-center bg-slate-50/50 transition-colors relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              {uploadedFile ? (
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2 bg-rose-50 text-[#f43f2d] rounded-lg">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{uploadedFile.name}</div>
                      <div className="text-[10px] text-slate-500">Boyut: {uploadedFile.size} · PDF / Word Dokümanı Hazır</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 z-20 cursor-pointer"
                    title="Dosyayı Değiştir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <div className="font-bold text-slate-800">
                    Baskı Yapılacak Dosyayı Seçin veya Sürükleyin
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    PDF, DOCX, PPTX veya ZIP formatları desteklenir (Maks. 100 MB)
                  </div>
                </div>
              )}
            </div>

            {/* 3. BASKI ÖZELLİKLERİ SEÇİCİ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Baskı Türü (S/B - Renkli) */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  Baskı Rengi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPrintType('bw')}
                    className={`py-2 px-3 rounded-xl border font-bold transition-colors cursor-pointer ${
                      printType === 'bw'
                        ? 'border-[#f43f2d] bg-rose-50/50 text-[#f43f2d]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Siyah & Beyaz (0.75 TL)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintType('color')}
                    className={`py-2 px-3 rounded-xl border font-bold transition-colors cursor-pointer ${
                      printType === 'color'
                        ? 'border-[#f43f2d] bg-rose-50/50 text-[#f43f2d]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Canlı Renkli (2.50 TL)
                  </button>
                </div>
              </div>

              {/* Tek Yön / Çift Yön */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  Yüz Tercihi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSidedness('double')}
                    className={`py-2 px-3 rounded-xl border font-bold transition-colors cursor-pointer ${
                      sidedness === 'double'
                        ? 'border-[#f43f2d] bg-rose-50/50 text-[#f43f2d]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Çift Yön (Tavsiye Edilen)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSidedness('single')}
                    className={`py-2 px-3 rounded-xl border font-bold transition-colors cursor-pointer ${
                      sidedness === 'single'
                        ? 'border-[#f43f2d] bg-rose-50/50 text-[#f43f2d]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Tek Yön
                  </button>
                </div>
              </div>
            </div>

            {/* Sayfa Sayısı & Kopya Adedi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    Doküman Sayfa Sayısı:
                  </label>
                  <span className="font-black text-sm text-[#f43f2d]">{pageCount} Sayfa</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={300}
                  value={pageCount}
                  onChange={(e) => setPageCount(Number(e.target.value))}
                  className="w-full accent-[#f43f2d] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    Kopya Adedi (Takım):
                  </label>
                  <span className="font-black text-sm text-slate-900">{copyCount} Takım</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCopyCount(num)}
                      className={`flex-1 py-1.5 rounded-lg border text-center font-bold cursor-pointer transition-colors ${
                        copyCount === num
                          ? 'bg-[#1e2025] text-white border-[#1e2025]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ciltleme & Sonlandırma */}
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Cilt & Kapak Seçeneği
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setBinding('none')}
                  className={`py-2 px-2 rounded-xl border text-center transition-colors cursor-pointer ${
                    binding === 'none'
                      ? 'border-[#f43f2d] bg-rose-50 text-[#f43f2d] font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="font-bold">Zımbalı</div>
                  <div className="text-[10px] text-slate-400">Ücretsiz</div>
                </button>
                <button
                  type="button"
                  onClick={() => setBinding('spiral')}
                  className={`py-2 px-2 rounded-xl border text-center transition-colors cursor-pointer ${
                    binding === 'spiral'
                      ? 'border-[#f43f2d] bg-rose-50 text-[#f43f2d] font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="font-bold">Plastik Spiral</div>
                  <div className="text-[10px] text-slate-400">+25 TL</div>
                </button>
                <button
                  type="button"
                  onClick={() => setBinding('wire')}
                  className={`py-2 px-2 rounded-xl border text-center transition-colors cursor-pointer ${
                    binding === 'wire'
                      ? 'border-[#f43f2d] bg-rose-50 text-[#f43f2d] font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="font-bold">Tel Spiral</div>
                  <div className="text-[10px] text-slate-400">+35 TL</div>
                </button>
                <button
                  type="button"
                  onClick={() => setBinding('hardcover')}
                  className={`py-2 px-2 rounded-xl border text-center transition-colors cursor-pointer ${
                    binding === 'hardcover'
                      ? 'border-[#f43f2d] bg-rose-50 text-[#f43f2d] font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="font-bold">Sert Tez Cilt</div>
                  <div className="text-[10px] text-slate-400">+95 TL</div>
                </button>
              </div>
            </div>

            {/* Özel Not & Baskı Talimatı */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Baskı Talimatı & Özel Not
              </label>
              <input
                type="text"
                placeholder="Örn: İlk 2 sayfa renkli, diğerleri siyah-beyaz basılsın."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#f43f2d]"
              />
            </div>

            {/* Canlı Sipariş Özeti ve Fiyat */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    Sipariş Sahibi:
                  </span>
                  <span className="font-bold text-slate-900">
                    {fullName.trim() ? fullName : 'Henüz Girilmedi'}
                  </span>
                </div>
                <div className="text-2xl font-black text-[#f43f2d]">
                  {totalCost} TL <span className="text-xs text-slate-400 font-normal">KDV Dahil</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>

                <button
                  type="submit"
                  className="bg-[#f43f2d] hover:bg-[#d93424] text-white font-black py-2.5 px-6 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Kişisel Baskı Siparişini Tamamla</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
