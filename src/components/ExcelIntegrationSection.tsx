import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Search,
  CheckCircle,
  AlertCircle,
  FileText,
  Table as TableIcon,
  HelpCircle,
} from 'lucide-react';
import { EXCEL_COLUMN_DEFINITIONS, SAMPLE_CATALOG_DATA, METE_CATEGORIES } from '../data/stationeryData';

export const ExcelIntegrationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sampleData' | 'columnDefs' | 'guide'>('sampleData');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copiedCsv, setCopiedCsv] = useState(false);

  // Filtered sample products
  const filteredProducts = SAMPLE_CATALOG_DATA.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.mainCategory === categoryFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.barcode.includes(searchFilter) ||
      item.sku.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Generate real CSV with UTF-8 BOM for Microsoft Excel compatibility
  const generateCsvContent = () => {
    const headers = [
      'Barkod (EAN-13)',
      'Stok Kodu (SKU)',
      'Ürün Adı',
      'Ana Kategori',
      'Alt Kategori',
      '3. Seviye Tip',
      'Marka',
      'Satış Fiyatı (KDV Dahil)',
      'İndirimli Fiyat',
      'KDV Oranı (%)',
      'Stok Adedi',
      'Para Birimi',
      'Birim',
      'Arama Etiketleri',
      'Durum',
    ];

    const rows = SAMPLE_CATALOG_DATA.map((p) => [
      `"${p.barcode}"`,
      `"${p.sku}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.mainCategory}"`,
      `"${p.subCategory}"`,
      `"${p.subCategoryLevel3}"`,
      `"${p.brand}"`,
      p.priceWithVat.toFixed(2),
      p.discountPrice ? p.discountPrice.toFixed(2) : '',
      p.vatRate,
      p.stock,
      p.currency,
      p.unit,
      `"${p.tags.replace(/"/g, '""')}"`,
      p.status,
    ]);

    // UTF-8 BOM prefix
    return '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  };

  const handleDownloadExcel = () => {
    const csvContent = generateCsvContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'metekirtasiye_urun_yukleme_sablonu.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCsv = () => {
    const csvContent = generateCsvContent().replace('\uFEFF', '');
    navigator.clipboard.writeText(csvContent);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  return (
    <section id="excel-format" className="w-full bg-white py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#f43f2d] uppercase tracking-wider mb-1">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Veri & ERP Entegrasyonu · Çıktı 3</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Ürün Entegrasyonu İçin Excel / Veri Formatı
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Toplu ürün yükleme, kategori eşleme ve ERP stok entegrasyonu için standart veri formatı.
            </p>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyCsv}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedCsv ? (
                <>
                  <Check className="w-4 h-4 text-[#f43f2d]" />
                  <span className="text-[#f43f2d] font-bold">CSV Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>CSV Formatını Kopyala</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 bg-[#f43f2d] hover:bg-[#d93424] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Örnek Excel / CSV İndir (.csv)</span>
            </button>
          </div>
        </div>

        {/* Tab Butonları */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('sampleData')}
            className={`flex items-center gap-1.5 pb-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'sampleData'
                ? 'border-[#f43f2d] text-[#f43f2d]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Örnek Ürün Veri Tablosu ({SAMPLE_CATALOG_DATA.length} Ürün)</span>
          </button>

          <button
            onClick={() => setActiveTab('columnDefs')}
            className={`flex items-center gap-1.5 pb-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'columnDefs'
                ? 'border-[#f43f2d] text-[#f43f2d]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Sütun Tanımları & Veri Sözlüğü (15 Sütun)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 pb-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'guide'
                ? 'border-[#f43f2d] text-[#f43f2d]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Toplu Yükleme & Entegrasyon Kılavuzu</span>
          </button>
        </div>

        {/* TAB 1: ÖRNEK ÜRÜN VERİ TABLOSU */}
        {activeTab === 'sampleData' && (
          <div className="space-y-4">
            {/* Tablo Filtreleri */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Ürün adı, barkod, marka veya SKU ara..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 outline-none focus:border-[#f43f2d]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Kategori:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#f43f2d]"
                >
                  <option value="all">Tüm Ana Kategoriler</option>
                  {METE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* İnteraktif Tablo */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3 whitespace-nowrap">Barkod (EAN-13)</th>
                    <th className="p-3 whitespace-nowrap">Stok Kodu (SKU)</th>
                    <th className="p-3 min-w-[220px]">Ürün Adı</th>
                    <th className="p-3 whitespace-nowrap">Ana Kategori</th>
                    <th className="p-3 whitespace-nowrap">Alt Kategori</th>
                    <th className="p-3 whitespace-nowrap">Marka</th>
                    <th className="p-3 text-right whitespace-nowrap">Fiyat (TL)</th>
                    <th className="p-3 text-center whitespace-nowrap">KDV</th>
                    <th className="p-3 text-right whitespace-nowrap">Stok</th>
                    <th className="p-3 text-center whitespace-nowrap">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((row) => (
                    <tr key={row.barcode} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {row.barcode}
                      </td>
                      <td className="p-3 font-mono text-slate-600 whitespace-nowrap">
                        {row.sku}
                      </td>
                      <td className="p-3 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <img
                            src={row.imageUrl}
                            alt=""
                            className="w-6 h-6 object-cover rounded-md border border-slate-200 shrink-0"
                          />
                          <span className="line-clamp-1">{row.title}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{row.mainCategory}</span>
                      </td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">
                        {row.subCategory}
                      </td>
                      <td className="p-3 font-semibold text-slate-700 whitespace-nowrap">
                        {row.brand}
                      </td>
                      <td className="p-3 text-right font-black text-[#f43f2d] whitespace-nowrap">
                        {row.priceWithVat.toFixed(0)} TL
                      </td>
                      <td className="p-3 text-center text-slate-600 font-mono whitespace-nowrap">
                        %{row.vatRate}
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-slate-800 whitespace-nowrap">
                        {row.stock} {row.unit}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
              <span>Toplam {filteredProducts.length} ürün listeleniyor.</span>
              <span>Noktalı virgül (;) ayraçlı UTF-8 standart format.</span>
            </div>
          </div>
        )}

        {/* TAB 2: SÜTUN TANIMLARI */}
        {activeTab === 'columnDefs' && (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-3 whitespace-nowrap">Sütun Başlığı</th>
                  <th className="p-3 whitespace-nowrap">Zorunluluk</th>
                  <th className="p-3 whitespace-nowrap">Veri Tipi</th>
                  <th className="p-3 min-w-[200px]">Açıklama</th>
                  <th className="p-3 min-w-[180px]">Örnek Değer</th>
                  <th className="p-3 min-w-[200px]">Doğrulama & Kural</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {EXCEL_COLUMN_DEFINITIONS.map((col) => (
                  <tr key={col.field} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {col.label}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {col.required ? (
                        <span className="text-[10px] font-bold text-[#f43f2d] bg-rose-50 px-2 py-0.5 rounded-full">
                          ZORUNLU
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          OPSİYONEL
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-600 font-medium whitespace-nowrap">
                      {col.type}
                    </td>
                    <td className="p-3 text-slate-700 leading-relaxed">
                      {col.description}
                    </td>
                    <td className="p-3 font-mono text-slate-600 bg-slate-50/50">
                      {col.example}
                    </td>
                    <td className="p-3 text-slate-600">
                      {col.validationRule}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: KILAVUZ */}
        {activeTab === 'guide' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-3">
                <CheckCircle className="w-4 h-4 text-[#f43f2d]" />
                <span>1. Kategori Ağacı Eşleştirme</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Excel tablosundaki "Ana Kategori" ve "Alt Kategori" isimlerinin, tasarlanan 7 ana kategori ve bunların alt başlıklarıyla harfiyen aynı yazılması şarttır.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>2. KDV & Fiyat Ayrımı</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kırtasiye ve kağıt ürünlerinde %10 veya %20 KDV uygulanır. Sütundaki tutarlar müşterinin ödeyeceği nihai KDV Dahil tutar olarak belirlenmiştir.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-3">
                <FileText className="w-4 h-4 text-slate-700" />
                <span>3. Barkod (EAN-13) Senkronizasyonu</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mete Kırtasiye mağaza barkod okuyucusu ve e-ticaret web sitesinin eşleşmesi için EAN-13 barkodlar birincil kimliktir.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
