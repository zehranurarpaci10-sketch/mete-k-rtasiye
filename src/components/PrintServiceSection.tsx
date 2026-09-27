import React, { useState } from 'react';
import {
  Printer,
  FileCheck2,
  UploadCloud,
  Check,
  User,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Layers,
  AlertCircle,
} from 'lucide-react';

import { PrintJobOrder } from '../types/architecture';

interface PrintServiceSectionProps {
  onAddToCart: (title: string) => void;
  onAddPrintOrder?: (order: PrintJobOrder) => void;
  onOpenSellerPortal?: () => void;
}

export const PrintServiceSection: React.FC<PrintServiceSectionProps> = ({
  onAddToCart,
  onAddPrintOrder,
  onOpenSellerPortal,
}) => {
  // Müşteri Kişisel Bilgileri (Ad Soyad, Telefon, E-Posta)
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerNote, setCustomerNote] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'store' | 'cargo'>('store');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  
  // Baskı Seçenekleri
  const [printType, setPrintType] = useState<'bw' | 'color'>('bw');
  const [sidedness, setSidedness] = useState<'single' | 'double'>('double');
  const [bindingType, setBindingType] = useState<'none' | 'spiral' | 'wire' | 'hardcover'>('spiral');
  const [pageCount, setPageCount] = useState<number>(30);
  const [copyCount, setCopyCount] = useState<number>(1);
  const [paperWeight, setPaperWeight] = useState<'80gr' | '100gr' | 'kuse'>('80gr');
  
  // Dosya simülasyonu
  const [fileName, setFileName] = useState<string>('Ders_Notlari_ve_Dokuman.pdf');
  const [fileSizeStr, setFileSizeStr] = useState<string>('4.8 MB');
  const [orderAdded, setOrderAdded] = useState<boolean>(false);
  const [submittedJob, setSubmittedJob] = useState<PrintJobOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fiyat Hesabı
  const pageUnitPrice = printType === 'bw' ? 0.75 : 2.5;
  const sidednessFactor = sidedness === 'double' ? 0.9 : 1.0;
  const paperFactor = paperWeight === '80gr' ? 1.0 : paperWeight === '100gr' ? 1.3 : 1.7;
  const bindingCost =
    bindingType === 'none' ? 0 : bindingType === 'spiral' ? 25 : bindingType === 'wire' ? 35 : 95;

  const totalAmount = (
    (pageCount * pageUnitPrice * sidednessFactor * paperFactor + bindingCost) *
    copyCount
  ).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setErrorMsg('Lütfen baskı siparişini teslim alacak kişinin Adı ve Soyadını yazınız.');
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMsg('Lütfen hazır olunca bilgilendirilmek üzere telefon numaranızı giriniz.');
      return;
    }

    if (deliveryMethod === 'cargo' && !shippingAddress.trim()) {
      setErrorMsg('Lütfen kargonun ulaştırılacağı açık adresi yazınız.');
      return;
    }

    setErrorMsg(null);
    const itemTitle = `Hızlı Baskı: ${customerName} · ${fileName} (${pageCount} Sayfa, ${printType === 'bw' ? 'Siyah-Beyaz' : 'Renkli'}, ${bindingType === 'spiral' ? 'Plastik Spiral' : bindingType === 'wire' ? 'Tel Spiral' : bindingType === 'hardcover' ? 'Sert Tez Cilt' : 'Zımbalı'}, ${copyCount} Adet)`;
    
    const newJob: PrintJobOrder = {
      id: `BSK-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: customerName.trim(),
      phone: customerPhone.trim(),
      email: customerEmail.trim() || undefined,
      fileName: fileName,
      fileSize: fileSizeStr,
      pageCount: Number(pageCount),
      copies: Number(copyCount),
      colorMode: printType === 'bw' ? 'Siyah-Beyaz' : 'Renkli',
      paperSize: 'A4',
      sided: sidedness === 'double' ? 'Çift Yüz (Arkalı Önlü)' : 'Tek Yüz',
      binding:
        bindingType === 'none'
          ? 'Zımbalı'
          : bindingType === 'spiral'
          ? 'Plastik Spiral'
          : bindingType === 'wire'
          ? 'Tel Spiral'
          : 'Ciltli / Tez Cilt',
      notes: customerNote,
      deliveryMethod: deliveryMethod === 'cargo' ? 'Evime / Adrese Kargo' : 'Mağazadan Teslim',
      shippingAddress: deliveryMethod === 'cargo' ? shippingAddress : undefined,
      totalPrice: Number(totalAmount),
      status: 'Kuyrukta (Bekliyor)',
      createdAt: 'Az önce',
    };

    if (onAddPrintOrder) {
      onAddPrintOrder(newJob);
    }

    setSubmittedJob(newJob);
    onAddToCart(itemTitle);
    setOrderAdded(true);
  };

  return (
    <section id="baski-hizmeti" className="w-full bg-white py-10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Başlık ve Değer Önerisi */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#f43f2d] uppercase tracking-wider mb-1">
              <Printer className="w-4 h-4" />
              <span>Mete Kırtasiye Hızlı Dijital Baskı & Ciltleme Merkezi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Kişiye Özel Online Baskı & Fotokopi Siparişi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Tez, ödev, sınav notu veya şirket sunumlarınızı yükleyin; adınıza özel ciltlenip hazır edilsin.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Clock className="w-4 h-4 text-[#f43f2d]" />
              <span>Ortalama Hazırlanma: 30 Dakika</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold">Sincan Mağaza Teslimi veya Kargo</span>
          </div>
        </div>

        {/* Hata Bildirimi */}
        {errorMsg && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-[#f43f2d] rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-bold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sol Kolon (7 Birim): Müşteri Adı Soyadı & Baskı Konfigüratörü */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. KİŞİSEL BİLGİLER BÖLÜMÜ */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2 font-heading">
                  <User className="w-4 h-4 text-[#f43f2d]" />
                  <span>Siparişi Teslim Alacak Kişinin Bilgileri</span>
                </h3>
                <span className="text-[11px] text-slate-500">Zorunlu Alanlar (*)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Adı ve Soyadı <span className="text-[#f43f2d]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ahmet Yılmaz"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 font-bold text-slate-900 outline-none focus:border-[#f43f2d] focus:ring-1 focus:ring-[#f43f2d]"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Telefon Numarası <span className="text-[#f43f2d]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="0 (5XX) XXX XX XX"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 font-bold text-slate-900 outline-none focus:border-[#f43f2d] focus:ring-1 focus:ring-[#f43f2d]"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    E-Posta Adresi
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="ornek@metekirtasiye.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 outline-none focus:border-[#f43f2d]"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Özel Baskı Notu
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: İlk sayfa renkli kuşe olsun"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-[#f43f2d]"
                  />
                </div>

                {/* Teslimat Tercihi */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                  <label className="font-bold text-slate-800 block mb-1.5">
                    Teslimat Yöntemi <span className="text-[#f43f2d]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('store')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        deliveryMethod === 'store'
                          ? 'border-[#f43f2d] bg-white text-[#f43f2d] font-bold shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">🏪 Sincan Mağazamızdan Teslim</div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        Baskı bitince SMS ile haber verilir (Ücretsiz)
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('cargo')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        deliveryMethod === 'cargo'
                          ? 'border-[#f43f2d] bg-white text-[#f43f2d] font-bold shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">🚚 Evime / Adrese Kargola</div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        Trendyol Express ile adrese teslimat
                      </div>
                    </button>
                  </div>

                  {deliveryMethod === 'cargo' && (
                    <div className="mt-3">
                      <label className="font-bold text-slate-800 block mb-1 text-xs">
                        Açık Teslimat Adresi <span className="text-[#f43f2d]">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="İlçe, Mahalle, Cadde, No ve İl bilgilerini yazınız..."
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-[#f43f2d]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. DOKÜMAN & BASKI PARAMETRELERİ */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4 text-xs">
              {/* Dosya Seçim Çerçevesi */}
              <div className="border-2 border-dashed border-slate-300 hover:border-[#f43f2d] bg-white rounded-2xl p-4 text-center transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2.5 rounded-xl bg-rose-50 text-[#f43f2d]">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{fileName}</div>
                      <div className="text-[11px] text-slate-500">PDF Dokümanı Hazır · 4.8 MB</div>
                    </div>
                  </div>

                  <label className="bg-slate-100 hover:bg-[#f43f2d] hover:text-white text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                    Dosyayı Değiştir
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Baskı Rengi & Yüz Seçimi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">Baskı Türü</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPrintType('bw')}
                      className={`py-2 px-3 rounded-xl border font-bold transition-all cursor-pointer ${
                        printType === 'bw'
                          ? 'border-[#f43f2d] bg-white text-[#f43f2d] shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      Siyah & Beyaz (0.75 TL)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintType('color')}
                      className={`py-2 px-3 rounded-xl border font-bold transition-all cursor-pointer ${
                        printType === 'color'
                          ? 'border-[#f43f2d] bg-white text-[#f43f2d] shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      Canlı Renkli (2.50 TL)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">Yüz Baskısı</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSidedness('double')}
                      className={`py-2 px-3 rounded-xl border font-bold transition-all cursor-pointer ${
                        sidedness === 'double'
                          ? 'border-[#f43f2d] bg-white text-[#f43f2d] shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      Çift Yön (Ekonomik)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidedness('single')}
                      className={`py-2 px-3 rounded-xl border font-bold transition-all cursor-pointer ${
                        sidedness === 'single'
                          ? 'border-[#f43f2d] bg-white text-[#f43f2d] shadow-2xs'
                          : 'border-slate-300 bg-white/60 text-slate-700'
                      }`}
                    >
                      Tek Yön
                    </button>
                  </div>
                </div>
              </div>

              {/* Sayfa Sayısı & Takım Adedi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800">Sayfa Adedi:</label>
                    <span className="font-black text-sm text-[#f43f2d]">{pageCount} Sayfa</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={250}
                    value={pageCount}
                    onChange={(e) => setPageCount(Number(e.target.value))}
                    className="w-full accent-[#f43f2d] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800">Takım / Kopya Sayısı:</label>
                    <span className="font-black text-sm text-slate-900">{copyCount} Adet</span>
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
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ciltleme */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Cilt & Kapak</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setBindingType('none')}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      bindingType === 'none'
                        ? 'border-[#f43f2d] bg-white text-[#f43f2d] font-bold shadow-2xs'
                        : 'border-slate-300 bg-white/60 text-slate-600'
                    }`}
                  >
                    <div>Zımbalı</div>
                    <div className="text-[10px] text-slate-400">Ücretsiz</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBindingType('spiral')}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      bindingType === 'spiral'
                        ? 'border-[#f43f2d] bg-white text-[#f43f2d] font-bold shadow-2xs'
                        : 'border-slate-300 bg-white/60 text-slate-600'
                    }`}
                  >
                    <div>Plastik Spiral</div>
                    <div className="text-[10px] text-slate-400">+25 TL</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBindingType('wire')}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      bindingType === 'wire'
                        ? 'border-[#f43f2d] bg-white text-[#f43f2d] font-bold shadow-2xs'
                        : 'border-slate-300 bg-white/60 text-slate-600'
                    }`}
                  >
                    <div>Tel Spiral</div>
                    <div className="text-[10px] text-slate-400">+35 TL</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBindingType('hardcover')}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      bindingType === 'hardcover'
                        ? 'border-[#f43f2d] bg-white text-[#f43f2d] font-bold shadow-2xs'
                        : 'border-slate-300 bg-white/60 text-slate-600'
                    }`}
                  >
                    <div>Sert Tez Cilt</div>
                    <div className="text-[10px] text-slate-400">+95 TL</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon (5 Birim): Kişiselleştirilmiş Canlı Sipariş Fişi & Özet */}
          <div className="lg:col-span-5">
            <div className="bg-[#1e2025] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#2d3038] sticky top-24">
              {orderAdded && submittedJob ? (
                /* SATICI PORTALINA DÜŞTÜ BAŞARI KARTI */
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-[#2d3038]">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm tracking-tight font-heading text-emerald-400 block">
                          Satıcı Portalına Düştü!
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          İş Emri: #{submittedJob.id}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                      Canlı Kuyrukta
                    </span>
                  </div>

                  <div className="bg-[#14161b] p-4 rounded-2xl border border-[#2d3038] space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Müşteri Adı:</span>
                      <span className="font-bold text-white">{submittedJob.customerName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Telefon:</span>
                      <span className="text-slate-300 font-mono">{submittedJob.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Gönderilen Dosya:</span>
                      <span className="font-mono text-amber-300 truncate max-w-[180px] font-semibold">
                        {submittedJob.fileName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Baskı Özellikleri:</span>
                      <span className="text-slate-200">
                        {submittedJob.pageCount} Syf · {submittedJob.copies} Kopya · {submittedJob.colorMode}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Ciltleme:</span>
                      <span className="text-white font-medium">{submittedJob.binding}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Teslimat Yöntemi:</span>
                      <span className="text-emerald-400 font-semibold">{submittedJob.deliveryMethod}</span>
                    </div>
                    {submittedJob.shippingAddress && (
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        Adres: {submittedJob.shippingAddress}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300/90 leading-relaxed">
                    💡 <strong>Satıcı Portalı Entegrasyonu:</strong> Müşteri olarak yüklediğiniz doküman, Mete Kırtasiye Satıcı Portalı'ndaki <em>Fotokopi & Baskı Kuyruğu</em>'na anında iletildi. Satıcı portalına geçerek müşterinin gönderdiği dosyanın çıktısını tek tıkla alabilirsiniz.
                  </div>

                  {onOpenSellerPortal && (
                    <button
                      type="button"
                      onClick={onOpenSellerPortal}
                      className="w-full py-3.5 px-4 bg-[#f43f2d] hover:bg-[#d93424] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                    >
                      <Printer className="w-4 h-4" />
                      <span>🏪 Satıcı Portalı'na Geç ve Çıktıyı Al</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setOrderAdded(false);
                      setSubmittedJob(null);
                    }}
                    className="w-full py-2.5 text-xs text-slate-400 hover:text-white bg-[#14161b] hover:bg-[#20232b] rounded-xl border border-slate-700 transition-colors cursor-pointer"
                  >
                    + Yeni Bir Doküman Baskısı Daha Ekle
                  </button>
                </div>
              ) : (
                /* NORMAL FİŞ & FORM */
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-[#2d3038] mb-5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-rose-500/20 text-[#f43f2d]">
                        <Printer className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm tracking-tight font-heading">
                        Mete Kırtasiye Baskı Fişi
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                      Canlı Hesaplama
                    </span>
                  </div>

                  {/* Kişisel Etiket Önizlemesi */}
                  <div className="bg-[#16181c] p-4 rounded-2xl border border-[#2d3038] mb-5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Sipariş Sahibi (Kişi):</span>
                      <span className="font-black text-[#f43f2d] text-sm">
                        {customerName.trim() ? customerName : '— Ad Soyad Bekleniyor —'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">İletişim Tel:</span>
                      <span className="font-bold text-slate-200">
                        {customerPhone.trim() ? customerPhone : '— Belirtilmedi —'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Belge / Dosya:</span>
                      <span className="font-mono text-slate-300 text-[11px] truncate max-w-[180px]">
                        {fileName}
                      </span>
                    </div>
                  </div>

                  {/* Baskı Detay Listesi */}
                  <div className="space-y-2 text-xs text-slate-300 pb-4 border-b border-[#2d3038]">
                    <div className="flex items-center justify-between">
                      <span>Sayfa & Kopya:</span>
                      <span className="font-bold text-white">{pageCount} Sayfa × {copyCount} Kopya</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Baskı Rengi:</span>
                      <span className="font-bold text-white">
                        {printType === 'bw' ? 'Siyah & Beyaz (Ekonomik)' : 'Canlı Renkli'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ciltleme:</span>
                      <span className="font-bold text-white">
                        {bindingType === 'none'
                          ? 'Zımbalı'
                          : bindingType === 'spiral'
                          ? 'Plastik Spiral Cilt'
                          : bindingType === 'wire'
                          ? 'Tel Spiral Cilt'
                          : 'Sert Kapak Tez Cildi'}
                      </span>
                    </div>
                    {customerNote && (
                      <div className="flex items-center justify-between text-[11px] text-amber-300">
                        <span>Müşteri Notu:</span>
                        <span className="truncate max-w-[160px] italic">"{customerNote}"</span>
                      </div>
                    )}
                  </div>

                  {/* Fiyat & Gönder Butonu */}
                  <div className="pt-5 flex flex-col gap-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Ödenecek Toplam Tutar:</span>
                      <div className="text-3xl font-black text-[#f43f2d] font-heading">
                        {totalAmount} TL
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 bg-[#f43f2d] hover:bg-[#d93424] text-white"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Adıma Baskı Siparişi Oluştur</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Siparişiniz doğrudan Satıcı Portalı'na aktarılır.</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
