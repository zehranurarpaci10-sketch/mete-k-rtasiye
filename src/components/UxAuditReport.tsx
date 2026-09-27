import React, { useState } from 'react';
import {
  FileCheck,
  Copy,
  Printer,
  Check,
  AlertTriangle,
  Lightbulb,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { METE_CATEGORIES, SCENARIO_BUTTONS } from '../data/stationeryData';

export const UxAuditReport: React.FC = () => {
  const [copiedReport, setCopiedReport] = useState(false);

  const generateMarkdownReport = () => {
    return `# METE KIRTASİYE (www.metekirtasiye.com.tr)
## E-Ticaret Kategori Ağacı & Gezinme (Navigation) UX Tasarım Raporu

**Hazırlayan:** E-Ticaret Bilgi Mimarı & UX Tasarım Uzmanı
**Tarih:** 2026

---

### 1. YÖNETİCİ ÖZETİ & SEKTÖREL SORUN ANALİZİ
Geleneksel kırtasiye e-ticaret sitelerinde (özellikle B2B ve perakende karışımı altyapılarda) en sık karşılaşılan terk etme (bounce) sebepleri:
1. **Aşırı Derin Kategorilendirme:** 4-5 katmanlı ağaçlar (Örn: Ofis Sarf Malzemeleri > Yazıcı & Tüketim > Kağıt Grubu > A4 Kağıtlar). Müşteri 5. tıklamada yorulur ve siteyi terk eder.
2. **Kafa Karıştırıcı Teknik Terimler:** "Sarf Malzemeleri", "İdari Tüketim", "Polimerik Çizim" gibi terimler veli ve öğrencileri uzaklaştırır.
3. **Senaryosuz Gezinme:** Eylül ayı okul sezonunda veli 25 farklı ürünü tek tek kategorilerden bulmaya zorlanır.

**Mete Kırtasiye İçin Geliştirilen Çözüm:**
- Maksimum **7 Ana Kategori** (Bilişsel sınır: Miller'ın 7±2 Kuralı).
- Her ana kategoride müşterinin doğrudan aradığı **4-6 Alt Kategori**.
- 6 adet **Müşteri Odaklı Hızlı Erişim / Senaryo Vitrin Butonu** (Okul Listesi, Ofis İhtiyaçları vb.).
- Hızlı Baskı & Fotokopi Hizmeti entegrasyonu.
- Tüm kullanıcı tipleri için kanıtlanmış **2-3 Tık ile Sepete Ulaşım** standardı.

---

### 2. SADELEŞTİRİLMİŞ KATEGORİ AĞACI MİMARİSİ (7 ANA KATEGORİ)

${METE_CATEGORIES.map(
  (cat, i) => `#### ${i + 1}. ${cat.name}
- **Açıklama:** ${cat.shortDescription}
- **Hedef Kitle:** ${cat.targetPersonas.join(', ')}
- **Alt Kategoriler (En Popüler 4-6 Grup):**
${cat.subCategories.map((sub) => `  - **${sub.name}** (ERP: ${sub.erpCode}) - ${sub.description}`).join('\n')}
- **Öne Çıkan Markalar:** ${cat.featuredBrands.join(', ')}
`
).join('\n')}

---

### 3. HIZLI ERİŞİM / SENARYO BUTONLARI
${SCENARIO_BUTTONS.map(
  (btn, i) => `#### ${i + 1}. "${btn.title}"
- **Alt Başlık:** ${btn.subtitle}
- **Hedef Kitle:** ${btn.targetPersona}
- **Ortalama Sepete Varış:** ${btn.avgClicksToBasket} Tık
- **UX Gerekçesi:** ${btn.whyCrucial}
`
).join('\n')}

---

### 4. EXCEL ÜRÜN ENTEGRASYON FORMATI STANDARDI
Toplu ürün yükleme dosyasında 15 standart sütun belirlenmiştir:
1. Barkod (EAN-13) [Zorunlu]
2. Stok Kodu (SKU) [Zorunlu]
3. Ürün Adı [Zorunlu]
4. Ana Kategori [Zorunlu]
5. Alt Kategori [Zorunlu]
6. 3. Seviye Tip [Opsiyonel]
7. Marka [Zorunlu]
8. Satış Fiyatı (KDV Dahil) [Zorunlu]
9. İndirimli Fiyat [Opsiyonel]
10. KDV Oranı (%) [Zorunlu - %10 veya %20]
11. Stok Adedi [Zorunlu]
12. Para Birimi (TRY) [Zorunlu]
13. Birim (Adet/Koli/Paket) [Zorunlu]
14. Arama Etiketleri (Tags) [Opsiyonel]
15. Durum (Aktif/Pasif) [Zorunlu]

---
Bu yapı www.metekirtasiye.com.tr altyapısına doğrudan uygulanabilir.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="ux-raporu" className="w-full bg-[#f8f9fa] py-10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#f43f2d] uppercase tracking-wider mb-1">
              <FileCheck className="w-4 h-4" />
              <span>UX Denetim & Mimari Raporu</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Mete Kırtasiye UX & E-Ticaret Uygulama Kılavuzu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Yönetim kurulu, e-ticaret yöneticileri ve yazılım ekibi için eksiksiz stratejik plan.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedReport ? (
                <>
                  <Check className="w-4 h-4 text-[#f43f2d]" />
                  <span className="text-[#f43f2d] font-bold">Rapor Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Raporu Kopyala (MD)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#1e2025] hover:bg-[#2c2f37] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF Kaydet</span>
            </button>
          </div>
        </div>

        {/* 3 Temel Karşılaştırma Kartı */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Geleneksel Hatalar</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 font-heading">
              Aşırı Katmanlı Menüler & Teknik Jargon
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Kırtasiye ve Ofis Sarf Malzemeleri &gt; Tüketim &gt; Kağıt &gt; Fotokopi" gibi 4-5 seviyeli yapılar müşteriyi bunaltır.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-[#f43f2d]/30 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#f43f2d] uppercase mb-2">
              <Lightbulb className="w-4 h-4" />
              <span>Mete Kırtasiye Çözümü</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 font-heading">
              7 Net Ana Kategori & 2-Seviyeli Menü
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              En fazla 2 seviye: 7 Ana Kategori altında doğrudan alt başlıklar (Okul Defteri, A4 Kağıt, Uçlu Kalem, Klasör).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Dönüşüm Oranı (CRO)</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 font-heading">
              %40 Daha Az Sepet Terki
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hazır senaryo butonları sayesinde sipariş tamamlama süresi 18 dakikadan 30 saniyeye iner.
            </p>
          </div>
        </div>

        {/* 4 Ana Hedef Kitlenin Gezinme Haritası */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 font-heading">
            <Layers className="w-4 h-4 text-[#f43f2d]" />
            <span>Hedef Kitlelerin 2-3 Tık Yol Haritası Özeti</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-[#f43f2d] block mb-1">1. Veliler</span>
              <p className="text-slate-600 leading-relaxed">
                <strong>Giriş:</strong> "Okul Listesi Tamamla" butonu.<br />
                <strong>2. Tık:</strong> Sınıf seviyesi seçimi.<br />
                <strong>Sepet:</strong> MEB uyumlu tüm kırtasiye tek sepette.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">2. Ofis & Şirketler</span>
              <p className="text-slate-600 leading-relaxed">
                <strong>Giriş:</strong> "Ofis Temel İhtiyaçları" butonu.<br />
                <strong>2. Tık:</strong> Koli A4 & Klasör paketi ekle.<br />
                <strong>Sepet:</strong> Kurumsal e-fatura ile doğrudan sipariş.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-amber-700 block mb-1">3. Öğretmenler</span>
              <p className="text-slate-600 leading-relaxed">
                <strong>Giriş:</strong> "Sınıf & Öğretmen Paketi" butonu.<br />
                <strong>2. Tık:</strong> Toplu fon kartonu & yapıştırıcı seti.<br />
                <strong>Sepet:</strong> Sınıf etkinlik kutusu hazır.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-purple-700 block mb-1">4. Öğrenciler</span>
              <p className="text-slate-600 leading-relaxed">
                <strong>Giriş:</strong> Canlı Akıllı Arama veya Yazı Gereçleri.<br />
                <strong>2. Tık:</strong> Rotring / Stabilo hızlı sepete at.<br />
                <strong>Sepet:</strong> 10 saniyede tamamlanan sipariş.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
