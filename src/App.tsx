/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeaderSim } from './components/HeaderSim';
import { HeroBannerFeatured } from './components/HeroBannerFeatured';
import { PrintServiceSection } from './components/PrintServiceSection';
import { PrintServiceModal } from './components/PrintServiceModal';
import { ScenarioButtonsSection } from './components/ScenarioButtonsSection';
import { CategoryArchitectureView } from './components/CategoryArchitectureView';
import { ProductGridShowcase } from './components/ProductGridShowcase';
import { ExcelIntegrationSection } from './components/ExcelIntegrationSection';
import { ClickJourneySimulator } from './components/ClickJourneySimulator';
import { UxAuditReport } from './components/UxAuditReport';
import { SellerPartnerDashboard } from './components/SellerPartnerDashboard';
import { SellerAuthModal } from './components/SellerAuthModal';
import { CartPreviewModal } from './components/CartPreviewModal';
import { QuickCheckoutModal } from './components/QuickCheckoutModal';
import { DeryaB2BPortal } from './components/DeryaB2BPortal';
import { DeryaB2BSection } from './components/DeryaB2BSection';
import { MeteCorporateCatalogPortal } from './components/MeteCorporateCatalogPortal';
import { METE_CATEGORIES, SAMPLE_CATALOG_DATA } from './data/stationeryData';
import { MainCategory, ProductCatalogRow, PrintJobOrder, CartItem } from './types/architecture';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Layers,
  FileSpreadsheet,
  Zap,
  FileText,
  Printer,
  Store,
  ArrowRight,
  ExternalLink,
  Building2,
} from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | null>(METE_CATEGORIES[1]); // Default to Defter & Kağıt
  // Mete Kırtasiye Kurumsal B2B Katalog & Sipariş Portalı
  const [isMeteB2BOpen, setIsMeteB2BOpen] = useState<boolean>(true);
  const [isB2BPortalOpen, setIsB2BPortalOpen] = useState<boolean>(false);
  const [b2bInitialTab, setB2bInitialTab] = useState<'products' | 'orders' | 'reports' | 'payment' | 'statement' | 'catalog'>('products');

  const handleOpenB2BPortal = (tab: 'products' | 'orders' | 'reports' | 'payment' | 'statement' | 'catalog' = 'products') => {
    setB2bInitialTab(tab);
    setIsB2BPortalOpen(true);
  };

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      barcode: '8690826014521',
      sku: 'METE-DEF-001',
      title: 'Gıpta A4 80 Yaprak Spiralli Kareli Defter (Sert Kapak)',
      brand: 'Gıpta',
      category: 'Defter & Kağıt',
      price: 65.0,
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
      stock: 120,
    },
    {
      barcode: '8690555123456',
      sku: 'METE-KAL-002',
      title: 'Faber-Castell Grip 2011 Versatil Kalem 0.7mm',
      brand: 'Faber-Castell',
      category: 'Yazım & Çizim Araçları',
      price: 110.0,
      discountPrice: 95.0,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80',
      stock: 45,
    },
  ]);
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState<boolean>(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Satıcı Paneli (Trendyol Partner Modeli) State'leri
  const [products, setProducts] = useState<ProductCatalogRow[]>(SAMPLE_CATALOG_DATA);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState<boolean>(false);
  const [isSellerAuthOpen, setIsSellerAuthOpen] = useState<boolean>(false);
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState<boolean>(false);

  // Satıcı Paneline Entegre Fotokopi & Baskı İş Emirleri Kuyruğu
  const [printJobs, setPrintJobs] = useState<PrintJobOrder[]>([
    {
      id: 'BSK-10492',
      customerName: 'Zehra Nur Arpacı',
      phone: '0 (542) 987 65 43',
      fileName: 'Universite_Tez_Calismasi_Son_Baski.pdf',
      fileSize: '14.2 MB',
      pageCount: 140,
      copies: 1,
      colorMode: 'Siyah-Beyaz',
      paperSize: 'A4',
      sided: 'Çift Yüz (Arkalı Önlü)',
      binding: 'Ciltli / Tez Cilt',
      notes: 'Bordo cilt kapağı üzerine altın yaldız baskı yapılacak.',
      deliveryMethod: 'Evime / Adrese Kargo',
      shippingAddress: 'Batı Sitesi Mah. 2307 Cad. No: 14/B Yenimahalle / Ankara',
      totalPrice: 189.5,
      status: 'Yazdırılıyor 🖨️',
      createdAt: 'Bugün, 14:20',
      isOwnerJob: false,
    },
    {
      id: 'BSK-10488',
      customerName: 'Ahmet Yılmaz',
      phone: '0 (533) 222 33 44',
      fileName: 'Vize_Final_Ders_Notlari.pdf',
      fileSize: '3.6 MB',
      pageCount: 45,
      copies: 3,
      colorMode: 'Renkli',
      paperSize: 'A4',
      sided: 'Tek Yüz',
      binding: 'Plastik Spiral',
      notes: 'Ön ve arka kapak şeffaf asetat korumalı olsun lütfen.',
      deliveryMethod: 'Mağazadan Teslim',
      totalPrice: 412.5,
      status: 'Ciltleniyor',
      createdAt: 'Bugün, 11:45',
      isOwnerJob: false,
    },
    {
      id: 'BSK-10485',
      customerName: 'Mete Mağaza Yetkilisi (Ev Adresi)',
      phone: '0 (532) 111 22 33',
      fileName: 'Mete_Kirtasiye_Yillik_Stok_ve_Mali_Rapor.pdf',
      fileSize: '2.1 MB',
      pageCount: 32,
      copies: 2,
      colorMode: 'Siyah-Beyaz',
      paperSize: 'A4',
      sided: 'Çift Yüz (Arkalı Önlü)',
      binding: 'Zımbalı',
      notes: 'Şahsi inceleme için mağaza sahibinin evine kargo edilecek.',
      deliveryMethod: 'Evime / Adrese Kargo',
      shippingAddress: 'Batı Sitesi Mah. 2307 Cad. No: 14/B Yenimahalle / Ankara',
      totalPrice: 48.0,
      status: 'Hazır (Teslim Bekliyor)',
      createdAt: 'Dün, 16:30',
      isOwnerJob: true,
    },
  ]);

  const handleAddPrintJob = (newJob: PrintJobOrder) => {
    setPrintJobs((prev) => [newJob, ...prev]);
    setToastMessage(`"${newJob.customerName}" adına fotokopi baskı iş emri Satıcı Paneline iletildi.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdatePrintJob = (updatedJob: PrintJobOrder) => {
    setPrintJobs((prev) =>
      prev.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    );
  };

  const handleAddToCart = (productOrTitle: ProductCatalogRow | string, quantity = 1) => {
    let itemToAdd: CartItem;

    if (typeof productOrTitle === 'string') {
      const found = products.find(
        (p) =>
          p.title.toLowerCase() === productOrTitle.toLowerCase() ||
          productOrTitle.toLowerCase().includes(p.title.toLowerCase()) ||
          p.title.toLowerCase().includes(productOrTitle.toLowerCase())
      );

      if (found) {
        itemToAdd = {
          barcode: found.barcode,
          sku: found.sku,
          title: found.title,
          brand: found.brand,
          category: found.mainCategory,
          price: found.priceWithVat,
          discountPrice: found.discountPrice,
          quantity: quantity,
          imageUrl: found.imageUrl,
          stock: found.stock,
          addedAt: Date.now(),
        };
      } else {
        const isPrint =
          productOrTitle.toLowerCase().includes('baskı') ||
          productOrTitle.toLowerCase().includes('fotokopi');
        itemToAdd = {
          barcode: `ITEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: productOrTitle,
          brand: 'Mete Kırtasiye',
          category: isPrint ? 'Fotokopi & Baskı Hizmeti' : 'Kırtasiye',
          price: isPrint ? 85.0 : 45.0,
          quantity: quantity,
          imageUrl: isPrint
            ? 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
          addedAt: Date.now(),
        };
      }
    } else {
      itemToAdd = {
        barcode: productOrTitle.barcode,
        sku: productOrTitle.sku,
        title: productOrTitle.title,
        brand: productOrTitle.brand,
        category: productOrTitle.mainCategory,
        price: productOrTitle.priceWithVat,
        discountPrice: productOrTitle.discountPrice,
        quantity: quantity,
        imageUrl: productOrTitle.imageUrl,
        stock: productOrTitle.stock,
        addedAt: Date.now(),
      };
    }

    setCartItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.barcode === itemToAdd.barcode ||
          i.title.toLowerCase() === itemToAdd.title.toLowerCase()
      );
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: copy[idx].quantity + itemToAdd.quantity,
          addedAt: Date.now(),
        };
        setLastAddedItem(copy[idx]);
        return copy;
      } else {
        setLastAddedItem(itemToAdd);
        return [itemToAdd, ...prev];
      }
    });

    // Sayfa geçişi olmadan anında 'Sepet Önizleme' açılır penceresini aç
    setIsCartPreviewOpen(true);

    setToastMessage(`"${itemToAdd.title}" sepete eklendi.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleUpdateCartQuantity = (barcode: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.barcode === barcode) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveCartItem = (barcode: string) => {
    setCartItems((prev) => prev.filter((item) => item.barcode !== barcode));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setLastAddedItem(null);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cartItems.reduce(
    (acc, item) => acc + (item.discountPrice ?? item.price) * item.quantity,
    0
  );

  const handleCategorySelect = (category: MainCategory) => {
    setSelectedCategory(category);
    const element = document.getElementById('vitrin');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateProduct = (updated: ProductCatalogRow) => {
    setProducts((prev) =>
      prev.map((p) => (p.barcode === updated.barcode ? updated : p))
    );
    setToastMessage(`"${updated.title}" stok ve fiyatı güncellendi.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddProduct = (newProduct: ProductCatalogRow) => {
    setProducts((prev) => [newProduct, ...prev]);
    setToastMessage(`"${newProduct.title}" envantere eklendi ve satışa açıldı.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Eğer Satıcı Paneli açıksa: SADECE SATICININ GÖRECEĞİ TRENDYOL PARTNER EKRANI
  if (isSellerDashboardOpen) {
    return (
      <SellerPartnerDashboard
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onCloseDashboard={() => setIsSellerDashboardOpen(false)}
        printJobs={printJobs}
        onUpdatePrintJob={handleUpdatePrintJob}
        onAddPrintJob={handleAddPrintJob}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col selection:bg-rose-100 selection:text-[#f43f2d]">
      {/* Toast Bildirim Kutusu */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1e2025] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Satıcı Giriş / Yetki Modalı */}
      <SellerAuthModal
        isOpen={isSellerAuthOpen}
        onClose={() => setIsSellerAuthOpen(false)}
        onSuccess={() => {
          setIsSellerAuthenticated(true);
          setIsSellerAuthOpen(false);
          setIsSellerDashboardOpen(true);
        }}
      />

      {/* Eğer satıcı oturum açtıysa ve müşteri vitrinine bakıyorsa üst uyarı bandı */}
      {isSellerAuthenticated && (
        <div className="bg-[#181a20] text-amber-300 px-4 py-2 text-xs font-bold border-b border-amber-500/30 flex items-center justify-between z-50">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" />
              <span>
                🏪 <strong>Satıcı Yetkisi Aktif:</strong> Şu anda müşteri vitrinindesiniz. Yaptığınız stok/fiyat değişiklikleri canlı test edilebilir.
              </span>
            </div>
            <button
              onClick={() => setIsSellerDashboardOpen(true)}
              className="bg-[#f43f2d] hover:bg-[#d93424] text-white px-3 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Satıcı Paneline Dön (Partner)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Header & Canlı Mega Menü Gezinme Mimarisi */}
      <HeaderSim
        activeCategoryId={selectedCategory?.id}
        onSelectCategory={handleCategorySelect}
        cartCount={totalCartCount}
        cartTotalAmount={totalCartAmount}
        onAddToCart={handleAddToCart}
        onOpenCartPreview={() => setIsCartPreviewOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenSellerAuth={() => {
          if (isSellerAuthenticated) {
            setIsSellerDashboardOpen(true);
          } else {
            setIsSellerAuthOpen(true);
          }
        }}
        isSellerLoggedIn={isSellerAuthenticated}
        onOpenDeryaB2B={handleOpenB2BPortal}
        onOpenMeteB2B={() => setIsMeteB2BOpen(true)}
      />

      {/* Sayfa Geçişi Olmadan Açılan Sepet Önizleme Penceresi (Toplam Adet & Tutar Gösterimi) */}
      <CartPreviewModal
        isOpen={isCartPreviewOpen}
        onClose={() => setIsCartPreviewOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        lastAddedItem={lastAddedItem}
        onCheckout={() => {
          setIsCartPreviewOpen(false);
          setIsCheckoutModalOpen(true);
        }}
      />

      {/* Hızlı Sipariş Onay Modalı */}
      <QuickCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        onOrderCompleted={(orderId) => {
          setCartItems([]);
          setToastMessage(`Sipariş #${orderId} oluşturuldu. Teşekkür ederiz!`);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />

      {/* 2. Kullanıcı Görselindeki Birebir Hero Banner & "Öne Çıkan Ürünler" Satırı */}
      <HeroBannerFeatured
        onAddToCart={handleAddToCart}
        onExploreCampaigns={() => {
          const el = document.getElementById('senaryolar');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Pop-up Hızlı Baskı Modalı (Kişinin Adı Soyadı, İletişim ve Baskı Özellikleriyle) */}
      <PrintServiceModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onAddToCart={handleAddToCart}
        onAddPrintOrder={handleAddPrintJob}
      />

      {/* Profesyonel Mimari Navigasyon Bandı */}
      <div className="bg-white border-y border-slate-200 py-4 px-4 shadow-2xs sticky top-[56px] z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-rose-50 text-[#f43f2d] border border-rose-100">
              Mete Kırtasiye E-Ticaret & UX Altyapısı
            </span>
            <span className="text-xs text-slate-600 font-medium hidden sm:inline">
              Maksimum 2-3 tık mimarisi, 7 kategori ağacı, online baskı ve satıcı paneli
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => {
                if (isSellerAuthenticated) {
                  setIsSellerDashboardOpen(true);
                } else {
                  setIsSellerAuthOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Satıcı Portalı (Evime Kargo)</span>
            </button>

            <button
              onClick={() => setIsMeteB2BOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Mete B2B Katalog & Sipariş</span>
            </button>

            <a
              href="#baski-hizmeti"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-[#f43f2d] hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Kişiye Özel Baskı</span>
            </a>

            <a
              href="#senaryolar"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-[#f43f2d]" />
              <span>Senaryolar</span>
            </a>

            <a
              href="#kategori-agaci"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-slate-700" />
              <span>Kategori Ağacı</span>
            </a>

            <a
              href="#excel-format"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-700" />
              <span>Excel Formatı</span>
            </a>

            <a
              href="#ux-raporu"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e2025] text-white hover:bg-[#2c2f37] transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Strateji Raporu</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. KİŞİYE ÖZEL DİJİTAL BASKI VE FOTOKOPİ MERKEZİ (Kişinin Adı Soyadı ile) */}
      <PrintServiceSection
        onAddToCart={handleAddToCart}
        onAddPrintOrder={handleAddPrintJob}
      />

      {/* 3.1 DERYA DAĞITIM A.Ş. B2B / DESTEK B2B TOPTAN ENTEGRASYONU (Videodaki Tüm Özellikler) */}
      <DeryaB2BSection onOpenPortal={handleOpenB2BPortal} />

      {/* 4. Çıktı 2: Müşteri Dostu Hızlı Erişim / Senaryo Butonları */}
      <div id="senaryolar">
        <ScenarioButtonsSection
          onAddToCart={handleAddToCart}
          onFilterByCategory={(catId) => {
            const found = METE_CATEGORIES.find((c) => c.id === catId);
            if (found) handleCategorySelect(found);
          }}
        />
      </div>

      {/* 5. Canlı Kategori Vitrini (Satıcının anlık güncellediği stok ve fiyatlarla bağlı) */}
      <div id="vitrin">
        <ProductGridShowcase
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          onAddToCart={handleAddToCart}
          products={products}
        />
      </div>

      {/* 6. Çıktı 1: Sade Kategori Mimarisi (7 Ana Kategori & 36 Alt Kategori) */}
      <CategoryArchitectureView onCategorySelect={handleCategorySelect} />

      {/* 7. 2-3 Tık Kuralı Doğrulama ve Canlı Simülatörü */}
      <ClickJourneySimulator onAddToCart={handleAddToCart} />

      {/* 8. Çıktı 3: Ürün Entegrasyonu İçin Excel / Veri Formatı (.csv indirmeli) */}
      <ExcelIntegrationSection />

      {/* 9. UX Denetim & Stratejik Yönetici Raporu */}
      <UxAuditReport />

      {/* Güvenilirlik & Değer Önerisi Bandı */}
      <div className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-50 text-[#f43f2d] shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Hızlı & Güvenli Teslimat</div>
              <div className="text-[11px] text-slate-500">Aynı gün kargo imkanı</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-50 text-[#f43f2d] shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">%100 Orijinal Ürün</div>
              <div className="text-[11px] text-slate-500">Yetkili kırtasiye bayisi</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-50 text-[#f43f2d] shadow-2xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">14 Gün Kolay İade</div>
              <div className="text-[11px] text-slate-500">Koşulsuz müşteri memnuniyeti</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-50 text-[#f43f2d] shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Güvenli 3D Ödeme</div>
              <div className="text-[11px] text-slate-500">Kurumsal e-fatura seçeneği</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="iletisim" className="bg-[#1e2025] text-slate-400 py-12 text-xs border-t border-[#2d3038]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-black tracking-tight text-[#f43f2d] font-heading mb-2">
              Mete Kırtasiye
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Mete Kırtasiye Tuhafiye & Hediyelik Eşya · Ankara Sincan merkezli güvenilir mağaza, hızlı online kırtasiye, kişiye özel baskı ve Trendyol Partner entegre satıcı altyapısı.
            </p>
            <div className="text-[11px] text-slate-400">
              Web: <a href="https://www.metekirtasiye.com.tr" target="_blank" rel="noreferrer" className="text-[#f43f2d] hover:underline font-semibold">www.metekirtasiye.com.tr</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              7 Ana Kategori
            </h4>
            <ul className="space-y-1.5">
              {METE_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategorySelect(cat)}
                    className="hover:text-[#f43f2d] transition-colors text-left cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Hızlı Hizmetler & Satıcı
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => handleOpenB2BPortal('products')}
                  className="hover:text-red-400 text-red-400 font-bold transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>🏢 Derya Dağıtım B2B (Toptan Sipariş & Cari)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (isSellerAuthenticated) {
                      setIsSellerDashboardOpen(true);
                    } else {
                      setIsSellerAuthOpen(true);
                    }
                  }}
                  className="hover:text-amber-300 text-amber-400 font-bold transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>🏪 Satıcı Paneli (Evime Kargo & Stok)</span>
                </button>
              </li>
              <li>
                <a
                  href="#baski-hizmeti"
                  className="hover:text-[#f43f2d] transition-colors text-left font-bold text-white flex items-center gap-1"
                >
                  <span>🖨️ Kişiye Özel Baskı & Tez Ciltleme</span>
                </a>
              </li>
              <li><a href="#senaryolar" className="hover:text-[#f43f2d]">🎒 Okul Listesi Tamamlama</a></li>
              <li><a href="#senaryolar" className="hover:text-[#f43f2d]">🏢 Ofis Temel İhtiyaçları</a></li>
              <li><a href="#senaryolar" className="hover:text-[#f43f2d]">👩‍🏫 Sınıf & Öğretmen Paketi</a></li>
              <li><a href="#excel-format" className="hover:text-[#f43f2d]">📦 Excel Ürün Yükleme</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              İletişim & Destek
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#f43f2d] shrink-0" />
                <span>Sincan, Ankara / Türkiye</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f43f2d] shrink-0" />
                <span>0 (312) 270 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f43f2d] shrink-0" />
                <span>destek@metekirtasiye.com.tr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-[#2d3038] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>© 2026 Mete Kırtasiye (www.metekirtasiye.com.tr). Tüm Hakları Saklıdır.</span>
          <span>Trendyol Partner Mantığında Özel Satıcı & Stok Yönetim Modülü</span>
        </div>
      </footer>

      {/* METE KIRTASİYE KURUMSAL B2B ONLINE KATALOG & SİPARİŞ PORTALI */}
      {isMeteB2BOpen && (
        <MeteCorporateCatalogPortal onClose={() => setIsMeteB2BOpen(false)} />
      )}

      {/* DERYA DAĞITIM A.Ş. B2B / DESTEK B2B PORTALI */}
      {isB2BPortalOpen && (
        <DeryaB2BPortal
          onClose={() => setIsB2BPortalOpen(false)}
          initialTab={b2bInitialTab}
          onOpenCustomerVitrin={() => setIsB2BPortalOpen(false)}
          onOpenSellerDashboard={() => {
            setIsB2BPortalOpen(false);
            setIsSellerDashboardOpen(true);
          }}
        />
      )}
    </div>
  );
}
