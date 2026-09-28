/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeaderSim } from './components/HeaderSim';
import { CustomerCategoryBubbles } from './components/CustomerCategoryBubbles';
import { HeroBannerFeatured } from './components/HeroBannerFeatured';
import { PrintServiceSection } from './components/PrintServiceSection';
import { PrintServiceModal } from './components/PrintServiceModal';
import { ScenarioButtonsSection } from './components/ScenarioButtonsSection';
import { ProductGridShowcase } from './components/ProductGridShowcase';
import { CartPreviewModal } from './components/CartPreviewModal';
import { QuickCheckoutModal } from './components/QuickCheckoutModal';
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
  Zap,
  Printer,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | null>(METE_CATEGORIES[1]); // Default to Defter & Kağıt
  const [products] = useState<ProductCatalogRow[]>(SAMPLE_CATALOG_DATA);

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
  const [vitrinSearchQuery, setVitrinSearchQuery] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<ProductCatalogRow | null>(null);

  // Müşteri Fotokopi ve Baskı Siparişleri
  const [, setPrintJobs] = useState<PrintJobOrder[]>([]);

  const handleAddPrintJob = (newJob: PrintJobOrder) => {
    setPrintJobs((prev) => [newJob, ...prev]);
    setToastMessage(`"${newJob.customerName}" adına fotokopi baskı siparişiniz (#${newJob.id}) alındı. Hazırlanıyor!`);
    setTimeout(() => setToastMessage(null), 4000);
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
      setToastMessage(null), 3500;
    });
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

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col selection:bg-rose-100 selection:text-[#f43f2d]">
      {/* Toast Bildirim Kutusu */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1e2025] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header: Arama, WhatsApp, Fotokopi ve Sepet */}
      <HeaderSim
        activeCategoryId={selectedCategory?.id}
        onSelectCategory={handleCategorySelect}
        cartCount={totalCartCount}
        cartTotalAmount={totalCartAmount}
        onAddToCart={handleAddToCart}
        onOpenCartPreview={() => setIsCartPreviewOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onFilterVitrinBySearch={(query) => {
          setVitrinSearchQuery(query);
          const element = document.getElementById('vitrin');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenQuickView={(product) => {
          setQuickViewProduct(product);
          const element = document.getElementById('vitrin');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Sayfa Geçişi Olmadan Açılan Sepet Önizleme Penceresi */}
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

      {/* Pop-up Hızlı Baskı Modalı */}
      <PrintServiceModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onAddToCart={handleAddToCart}
        onAddPrintOrder={handleAddPrintJob}
      />

      {/* 2. Hero Banner & 4 Öne Çıkan Ürün */}
      <HeroBannerFeatured
        onAddToCart={handleAddToCart}
        onExploreCampaigns={() => {
          const el = document.getElementById('hazir-paketler');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Reyonlar & Kategoriler (Trendyol Görsel Kategori Hikaye Daireleri) */}
      <CustomerCategoryBubbles
        selectedCategoryId={selectedCategory?.id}
        onSelectCategory={handleCategorySelect}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
      />

      {/* Hızlı Müşteri Kısayol Çubuğu (Sticky) */}
      <div className="bg-white border-y border-slate-200 py-3 px-4 shadow-2xs sticky top-[56px] z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-rose-50 text-[#f43f2d] border border-rose-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Mete Kırtasiye Mağazası</span>
            </span>
            <span className="text-xs text-slate-600 font-medium hidden md:inline">
              150 TL üzeri kargo bedava · Saat 16:00'ya kadar aynı gün kargo
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <a
              href="#vitrin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <span>🛍️</span>
              <span>Tüm Vitrin</span>
            </a>

            <a
              href="#hazir-paketler"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-[#f43f2d]" />
              <span>Hazır Paketler</span>
            </a>

            <a
              href="#baski-hizmeti"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-[#f43f2d] hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Fotokopi & Baskı</span>
            </a>

            <a
              href="https://wa.me/905429876543?text=Merhaba%2C%20Mete%20K%C4%B1rtasiye%27den%20bilgi%20ve%20sipari%C5%9F%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
            >
              <span>💬</span>
              <span>WhatsApp Destek</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4. Canlı Kategori Vitrini (Trendyol Fotoğraflı Ürün Kartları, Hızlı Bakış, Filtreler) */}
      <div id="vitrin">
        <ProductGridShowcase
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          onAddToCart={handleAddToCart}
          products={products}
          onOpenPrintModal={() => setIsPrintModalOpen(true)}
          externalSearchQuery={vitrinSearchQuery}
          quickViewProduct={quickViewProduct}
          onCloseQuickView={() => setQuickViewProduct(null)}
        />
      </div>

      {/* 5. Online Fotokopi & Dijital Baskı Merkezi */}
      <div id="baski-hizmeti">
        <PrintServiceSection
          onAddToCart={handleAddToCart}
          onAddPrintOrder={handleAddPrintJob}
        />
      </div>

      {/* 6. Müşteri Dostu Hızlı İhtiyaç Paketleri */}
      <div id="hazir-paketler">
        <ScenarioButtonsSection
          onAddToCart={handleAddToCart}
          onFilterByCategory={(catId) => {
            const found = METE_CATEGORIES.find((c) => c.id === catId);
            if (found) handleCategorySelect(found);
          }}
        />
      </div>

      {/* Güvenilirlik & Değer Önerisi Bandı */}
      <div className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-50 text-[#f43f2d] shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Hızlı & Güvenli Teslimat</div>
              <div className="text-[11px] text-slate-500">150 TL üzeri kargo bedava</div>
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
              <div className="text-xs font-bold text-slate-900">Güvenli Ödeme</div>
              <div className="text-[11px] text-slate-500">Kapıda ödeme & 3D Secure</div>
            </div>
          </div>
        </div>
      </div>

      {/* Müşteri Odaklı Footer */}
      <footer id="iletisim" className="bg-[#1e2025] text-slate-400 py-12 text-xs border-t border-[#2d3038]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-black tracking-tight text-[#f43f2d] font-heading mb-2">
              Mete Kırtasiye
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Mete Kırtasiye Tuhafiye & Hediyelik Eşya · Ankara Sincan merkezli güvenilir mağaza, geniş okul ve ofis kırtasiye kataloğu, anında online fotokopi & tez ciltleme hizmeti.
            </p>
            <div className="text-[11px] text-slate-400">
              Web: <a href="https://www.metekirtasiye.com.tr" target="_blank" rel="noreferrer" className="text-[#f43f2d] hover:underline font-semibold">www.metekirtasiye.com.tr</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Reyonlar & Kategoriler
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
              Müşteri Hizmetleri
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="#vitrin"
                  className="hover:text-[#f43f2d] transition-colors text-left font-bold text-white flex items-center gap-1"
                >
                  <span>🛍️ Tüm Ürünler & Kampanyalar</span>
                </a>
              </li>
              <li>
                <a
                  href="#baski-hizmeti"
                  className="hover:text-[#f43f2d] transition-colors text-left flex items-center gap-1"
                >
                  <span>🖨️ Online Fotokopi & Tez Çıktısı</span>
                </a>
              </li>
              <li>
                <a href="#hazir-paketler" className="hover:text-[#f43f2d]">
                  🎒 Okul Listesi Hazır Paketi
                </a>
              </li>
              <li>
                <a href="#hazir-paketler" className="hover:text-[#f43f2d]">
                  💼 Ofis Masaüstü Seti
                </a>
              </li>
              <li>
                <a href="#hazir-paketler" className="hover:text-[#f43f2d]">
                  🎨 Sanat & Resim Malzemeleri
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsCartPreviewOpen(true)}
                  className="hover:text-[#f43f2d] cursor-pointer text-left"
                >
                  🛒 Sepetim ({totalCartCount})
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              İletişim & Mağaza
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
              <li className="pt-2">
                <a
                  href="https://wa.me/905429876543?text=Merhaba%2C%20Mete%20K%C4%B1rtasiye%27den%20sipari%C5%9F%20vermek%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-[#20bd5a] transition-all shadow-xs"
                >
                  <span>💬 WhatsApp Sipariş Hattı</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-[#2d3038] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Mete Kırtasiye Tuhafiye & Hediyelik Eşya. Tüm Hakları Saklıdır.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Gizlilik Politikası</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Mesafeli Satış Sözleşmesi</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">İade ve Teslimat</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
