import React, { useState, useMemo } from 'react';
import {
  Building2,
  Package,
  Truck,
  CreditCard,
  FileText,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  ChevronRight,
  Eye,
  X,
  Plus,
  Minus,
  ShoppingCart,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Store,
  DollarSign,
  TrendingUp,
  Receipt,
  Check,
  Percent,
  Layers,
  HelpCircle,
  FileCheck,
  Palette,
  Camera,
  LayoutGrid,
  List,
} from 'lucide-react';
import {
  B2BProduct,
  B2BOrder,
  B2BCariAccount,
  B2BCariMovement,
  B2BCartItem,
  BankInstallmentOption,
  B2BCustomPrintConfig,
} from '../types/b2b';
import {
  METE_PORTAL_BRAND,
  METE_DEALER_INFO,
  METE_B2B_PRODUCTS,
  METE_B2B_ORDERS,
  METE_CARI_MOVEMENTS,
  METE_BANK_INSTALLMENTS,
} from '../data/meteB2BData';
import { B2BCustomPrintModal } from './B2BCustomPrintModal';
import { B2BCheckoutModal } from './B2BCheckoutModal';
import { B2BScenarioTour } from './B2BScenarioTour';

interface MeteB2BIndependentPortalProps {
  onOpenVitrin?: () => void;
  onOpenSellerDashboard?: () => void;
}

export const MeteB2BIndependentPortal: React.FC<MeteB2BIndependentPortalProps> = ({
  onOpenVitrin,
  onOpenSellerDashboard,
}) => {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'reports' | 'payment' | 'statement' | 'catalog'>('products');

  // View mode in products (Table vs Grid)
  const [productViewMode, setProductViewMode] = useState<'table' | 'grid'>('table');

  // Reactive state for B2B data
  const [dealerInfo, setDealerInfo] = useState<B2BCariAccount>(METE_DEALER_INFO);
  const [cariMovements, setCariMovements] = useState<B2BCariMovement[]>(METE_CARI_MOVEMENTS);
  const [orders, setOrders] = useState<B2BOrder[]>(METE_B2B_ORDERS);
  const [products, setProducts] = useState<B2BProduct[]>(METE_B2B_PRODUCTS);

  // Cart & Drawers
  const [b2bCart, setB2bCart] = useState<B2BCartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Modals
  const [customPrintProduct, setCustomPrintProduct] = useState<B2BProduct | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<B2BOrder | null>(null);
  const [scenarioStep, setScenarioStep] = useState<number>(1);

  // Product Filters
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyHighDiscount, setOnlyHighDiscount] = useState(false);

  // Reports Filter
  const [reportStartDate, setReportStartDate] = useState('2026-09-01');
  const [reportEndDate, setReportEndDate] = useState('2026-09-30');
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'open' | 'shipped' | 'invoiced'>('all');

  // Sanal POS Payment State
  const [paymentAmount, setPaymentAmount] = useState<number>(4200.0);
  const [cardHolder, setCardHolder] = useState('METE KİTAP KIRTASİYE LTD. ŞTİ.');
  const [cardNumber, setCardNumber] = useState('5400 6100 8923 4510');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('482');
  const [selectedBank, setSelectedBank] = useState<string>('Garanti BBVA Bonus');
  const [selectedInstallmentCount, setSelectedInstallmentCount] = useState<number>(1);
  const [is3DModalOpen, setIs3DModalOpen] = useState<boolean>(false);
  const [smsOtpCode, setSmsOtpCode] = useState<string>('');
  const [isPaymentSuccessModalOpen, setIsPaymentSuccessModalOpen] = useState<boolean>(false);
  const [lastPaymentReceipt, setLastPaymentReceipt] = useState<any>(null);

  // Excel Bulk Order Import Modal
  const [isExcelImportOpen, setIsExcelImportOpen] = useState<boolean>(false);
  const [excelPasteText, setExcelPasteText] = useState<string>('');

  // Photo Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState<string>('Çantalar & Sırt Çantaları');
  const [uploadPrice, setUploadPrice] = useState<number>(380);
  const [uploadImageUrl, setUploadImageUrl] = useState<string>('');
  const [uploadSupportsPrint, setUploadSupportsPrint] = useState<boolean>(true);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Distinct Categories from video
  const distinctCategories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.barcode.includes(productSearch) ||
        p.brand.toLowerCase().includes(productSearch.toLowerCase());

      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchStock = !onlyInStock || p.stockStatus !== 'out_of_stock';
      const matchDiscount = !onlyHighDiscount || p.discountRate >= 40;

      return matchSearch && matchCategory && matchStock && matchDiscount;
    });
  }, [products, productSearch, selectedCategory, onlyInStock, onlyHighDiscount]);

  // Add Product to Cart
  const handleAddProductToCart = (product: B2BProduct, quantity: number, packType: 'adet' | 'kutu' | 'koli' = 'adet') => {
    let units = quantity;
    if (packType === 'kutu') units = quantity * product.boxQuantity;
    if (packType === 'koli') units = quantity * product.caseQuantity;

    const netItemTotal = units * product.netPrice;

    setB2bCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.packType === packType && !item.customPrint);
      if (existing) {
        return prev.map((item) => {
          if (item.product.id === product.id && item.packType === packType && !item.customPrint) {
            const newUnits = item.totalUnits + units;
            return {
              ...item,
              quantity: item.quantity + quantity,
              totalUnits: newUnits,
              itemNetTotal: newUnits * product.netPrice,
            };
          }
          return item;
        });
      }
      return [
        ...prev,
        {
          product,
          quantity,
          packType,
          totalUnits: units,
          itemNetTotal: netItemTotal,
        },
      ];
    });

    showToast(`"${product.title}" (${units} adet) sepete eklendi.`);
  };

  // Add Product with Custom Print Configuration
  const handleAddCustomPrintProductToCart = (
    product: B2BProduct,
    quantity: number,
    customPrint: B2BCustomPrintConfig
  ) => {
    const netTotal = quantity * product.netPrice;
    setB2bCart((prev) => [
      ...prev,
      {
        product,
        quantity,
        packType: 'adet',
        totalUnits: quantity,
        itemNetTotal: netTotal,
        customPrint,
      },
    ]);
    setScenarioStep(4);
    setIsCartDrawerOpen(true);
    showToast(`"${product.title}" (${quantity} adet - Özel Baskılı) sepete eklendi.`);
  };

  // Cart Calculations
  const b2bCartTotalNet = b2bCart.reduce((sum, item) => sum + item.itemNetTotal, 0);
  const b2bCartTotalVat = b2bCart.reduce((sum, item) => sum + item.itemNetTotal * (item.product.vatRate / 100), 0);
  const b2bCartGrandTotal = b2bCartTotalNet + b2bCartTotalVat;
  const b2bCartItemCount = b2bCart.reduce((sum, item) => sum + item.totalUnits, 0);

  // Complete Order from Modal
  const handleConfirmOrderFromModal = (orderData: {
    paymentType: 'Cari Hesap' | 'Kredi Kartı (Sanal POS)' | 'Vadeli Çek';
    invoiceAddress: string;
    notes: string;
  }): B2BOrder => {
    const orderId = `SIP-2026-METE-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: B2BOrder = {
      id: orderId,
      orderDate: '27.09.2026 14:00',
      documentNo: `İRS-2026/${Math.floor(100000 + Math.random() * 900000)}`,
      itemCount: b2bCart.length,
      totalGrossAmount: b2bCart.reduce((s, i) => s + i.totalUnits * i.product.listPrice, 0),
      totalDiscountAmount: b2bCart.reduce(
        (s, i) => s + i.totalUnits * (i.product.listPrice - i.product.netPrice),
        0
      ),
      totalVatAmount: b2bCartTotalVat,
      totalNetAmount: b2bCartGrandTotal,
      shippedNetAmount: 0,
      remainingNetAmount: b2bCartGrandTotal,
      status: 'Onaylandı',
      carrier: METE_PORTAL_BRAND.fleet,
      trackingNo: `MET-SEVK-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentType: orderData.paymentType,
      invoiceAddress: orderData.invoiceAddress,
      notes: orderData.notes,
      orderSource: METE_PORTAL_BRAND.domain,
      items: b2bCart.map((i) => ({
        code: i.product.code,
        barcode: i.product.barcode,
        title: i.product.title,
        brand: i.product.brand,
        orderedQty: i.totalUnits,
        shippedQty: 0,
        remainingQty: i.totalUnits,
        unitPrice: i.product.listPrice,
        discountRate: i.product.discountRate,
        vatRate: i.product.vatRate,
        netPrice: i.product.netPrice,
        totalNet: i.itemNetTotal,
        customPrint: i.customPrint,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setB2bCart([]);

    // Update pending order in dealer info
    setDealerInfo((prev) => ({
      ...prev,
      pendingOrdersAmount: prev.pendingOrdersAmount + b2bCartGrandTotal,
    }));

    showToast(`Toptan Siparişiniz (#${orderId}) Mete Kırtasiye sevkiyat birimine iletildi.`);
    return newOrder;
  };

  // Save Uploaded Product
  const handleSaveUploadedProduct = () => {
    if (!uploadTitle.trim()) {
      alert('Lütfen ürün başlığı giriniz.');
      return;
    }

    const defaultImg =
      uploadImageUrl.trim() ||
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80';

    const newProd: B2BProduct = {
      id: `METE-CUSTOM-${Date.now()}`,
      code: `METE-${uploadCategory.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      barcode: `8690999${Math.floor(100000 + Math.random() * 900000)}`,
      title: uploadTitle,
      brand: 'Mete Collection',
      category: uploadCategory,
      vatRate: 20,
      listPrice: Math.round(uploadPrice * 1.65),
      discountRate: 40,
      netPrice: uploadPrice,
      netPriceWithVat: uploadPrice * 1.2,
      stockStatus: 'in_stock',
      stockQuantity: 150,
      boxQuantity: 10,
      caseQuantity: 50,
      minOrderQty: 10,
      unit: 'Adet',
      imageUrl: defaultImg,
      supportsCustomPrint: uploadSupportsPrint,
      customPrintBadge: uploadSupportsPrint ? 'Özel Baskı Uyumlu' : undefined,
    };

    setProducts((prev) => [newProd, ...prev]);
    setIsUploadModalOpen(false);
    setSelectedCategory(uploadCategory);
    setUploadTitle('');
    setUploadImageUrl('');
    showToast(`Yeni ürün ("${newProd.title}") başarıyla "${newProd.category}" kategorisine eklendi!`);
  };

  // Scenario Walkthrough Controller
  const handleExecuteScenarioStep = (stepNumber: number) => {
    setScenarioStep(stepNumber);
    if (stepNumber === 1) {
      setActiveTab('statement');
      showToast('Adım 1: b2b.metekirtasiye.com.tr cari bakiye (38.450 ₺) ve ekstre görüntülendi.');
    } else if (stepNumber === 2) {
      setActiveTab('orders');
      showToast('Adım 2: Geçmiş siparişler ve cari ödeme hareketleri inceleniyor.');
    } else if (stepNumber === 3) {
      setActiveTab('products');
      setSelectedCategory('Çantalar & Sırt Çantaları');
      const bag = products.find((p) => p.category === 'Çantalar & Sırt Çantaları') || products[0];
      setCustomPrintProduct(bag);
      showToast("Adım 3: Çanta modeli için 'Ürüne özel baskı ilavesi yapılacaktır' yapılandırması açıldı.");
    } else if (stepNumber === 4) {
      if (b2bCart.length === 0) {
        const bag = products.find((p) => p.category === 'Çantalar & Sırt Çantaları') || products[0];
        handleAddCustomPrintProductToCart(bag, 10, {
          hasCustomPrint: true,
          printNote: 'Ürüne özel baskı ilavesi yapılacaktır',
          printType: 'Sıcak Transfer Baskı (DTF)',
          logoFileName: 'METE_KIRTASIYE_KURUMSAL_LOGO.pdf',
          printLocation: 'Ön Cep Üstü - Merkez',
          unitPrintFee: 0,
          firmName: 'METE KİTAP KIRTASİYE LİMİTED ŞİRKETİ',
        });
      }
      setIsCheckoutModalOpen(true);
      showToast('Adım 4: Fatura adresi, ürün adetleri ve cari hesap ödeme onay ekranı açıldı.');
    }
  };

  const handleAutoRunScenario = () => {
    setActiveTab('products');
    setSelectedCategory('Çantalar & Sırt Çantaları');
    const bag = products.find((p) => p.category === 'Çantalar & Sırt Çantaları') || products[0];
    handleAddCustomPrintProductToCart(bag, 10, {
      hasCustomPrint: true,
      printNote: 'Ürüne özel baskı ilavesi yapılacaktır',
      printType: 'Sıcak Transfer Baskı (DTF)',
      logoFileName: 'METE_KIRTASIYE_KURUMSAL_LOGO.pdf',
      printLocation: 'Ön Cep Üstü - Merkez',
      unitPrintFee: 0,
      firmName: 'METE KİTAP KIRTASİYE LİMİTED ŞİRKETİ',
    });
    setScenarioStep(4);
    setTimeout(() => {
      setIsCheckoutModalOpen(true);
    }, 350);
  };

  // Sanal POS Payment Confirmation
  const handleConfirm3DVerification = () => {
    const receipt = {
      orderId: `METE-POS-${Date.now().toString().slice(-6)}`,
      date: '27.09.2026 14:05',
      dealerTitle: dealerInfo.dealerTitle,
      cardMasked: `**** **** **** ${cardNumber.slice(-4)}`,
      authCode: `AUT${Math.floor(100000 + Math.random() * 900000)}`,
      amount: paymentAmount,
      bank: selectedBank,
      installments: selectedInstallmentCount,
    };

    setLastPaymentReceipt(receipt);
    setIs3DModalOpen(false);

    // Update Cari Balance
    setDealerInfo((prev) => {
      const newBalance = Math.max(0, prev.currentBalance - paymentAmount);
      const newOverdue = Math.max(0, prev.overdueAmount - paymentAmount);
      const newAvailable = prev.riskLimit - newBalance;
      return {
        ...prev,
        currentBalance: newBalance,
        overdueAmount: newOverdue,
        availableLimit: newAvailable,
        lastPaymentDate: '27.09.2026',
        lastPaymentAmount: paymentAmount,
      };
    });

    const newMovement: B2BCariMovement = {
      id: `MOV-${Date.now()}`,
      date: '27.09.2026',
      docType: 'Kredi Kartı Tahsilatı',
      docNo: receipt.orderId,
      debt: 0.0,
      credit: paymentAmount,
      balance: Math.max(0, dealerInfo.currentBalance - paymentAmount),
      description: `Mete Kırtasiye Sanal POS 3D Kredi Kartı Ödemesi (${selectedBank} ${selectedInstallmentCount} Taksit)`,
    };

    setCariMovements((prev) => [newMovement, ...prev]);
    setIsPaymentSuccessModalOpen(true);
  };

  // Excel Bulk Order Import
  const handleProcessExcelPaste = () => {
    if (!excelPasteText.trim()) return;
    const lines = excelPasteText.split('\n');
    let addedCount = 0;

    lines.forEach((line) => {
      const parts = line.split(/[\t,;]+/);
      if (parts.length >= 2) {
        const codeOrBarcode = parts[0].trim();
        const qty = parseInt(parts[1].trim(), 10) || 1;
        const found = products.find(
          (p) =>
            p.barcode === codeOrBarcode ||
            p.code.toLowerCase() === codeOrBarcode.toLowerCase() ||
            p.title.toLowerCase().includes(codeOrBarcode.toLowerCase())
        );

        if (found) {
          handleAddProductToCart(found, qty, 'adet');
          addedCount += qty;
        }
      }
    });

    setIsExcelImportOpen(false);
    setExcelPasteText('');
    showToast(`Excel aktarımı tamamlandı! Toplam ${addedCount} adet ürün sepete eklendi.`);
  };

  return (
    <div className="min-h-screen bg-[#0d121c] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn text-xs font-bold border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP BRAND STRIP */}
      <div className="bg-[#141b29] border-b border-slate-800 text-[11px] text-slate-300 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{METE_PORTAL_BRAND.name} · Kurumsal Dağıtım & Toptan Sipariş Portalı</span>
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <span>Tel: {METE_PORTAL_BRAND.phone}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span>E-posta: {METE_PORTAL_BRAND.email}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span>{METE_PORTAL_BRAND.address}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Yetkili Kurumsal Distribütör</span>
            </span>
          </div>
        </div>
      </div>

      {/* TOP BAR: METE KIRTASİYE KURUMSAL HEADER */}
      <header className="bg-[#182133] border-b border-slate-700/80 px-4 py-3 shrink-0 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-900/30">
              <span className="text-xl font-black text-white tracking-tighter">M</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white tracking-tight">{METE_PORTAL_BRAND.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  {METE_PORTAL_BRAND.shortName}
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                  ({METE_PORTAL_BRAND.domain})
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Cari Hesap:</span>
                <strong className="text-amber-400 font-bold">{dealerInfo.dealerTitle}</strong>
                <span className="text-slate-500 font-mono text-[11px]">({dealerInfo.dealerCode})</span>
              </div>
            </div>
          </div>

          {/* Quick Balance Indicators & Actions */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Cari Bakiye Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Cari Bakiye:</span>
              <span className="font-mono font-bold text-red-400">
                {dealerInfo.currentBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺ (Borç)
              </span>
            </div>

            {/* Vadesi Geçen */}
            {dealerInfo.overdueAmount > 0 && (
              <div
                onClick={() => {
                  setPaymentAmount(dealerInfo.overdueAmount);
                  setActiveTab('payment');
                }}
                className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 flex items-center gap-1.5 cursor-pointer hover:bg-red-900/50 transition-colors"
                title="Tıklayarak Sanal POS ile hemen ödeyin"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span className="text-[11px]">Vadesi Geçen:</span>
                <span className="font-mono font-bold">
                  {dealerInfo.overdueAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </span>
              </div>
            )}

            {/* Fotoğraf Yükle Butonu */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Yeni ürün fotoğrafı yükleyin ve ilgili kategoriye ekleyin"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Fotoğraf Yükle</span>
            </button>

            {/* Toptan Sepet Butonu */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Toptan Sepet ({b2bCartItemCount})</span>
              {b2bCartGrandTotal > 0 && (
                <span className="font-mono text-[11px] bg-slate-950/40 text-white px-1.5 py-0.5 rounded">
                  {b2bCartGrandTotal.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                </span>
              )}
            </button>

            {/* Vitrin & Satıcı Paneli Geçiş Butonları */}
            {onOpenVitrin && (
              <button
                onClick={onOpenVitrin}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Mete Kırtasiye Perakende Vitrinini Görüntüle"
              >
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Perakende Vitrini</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SUB-HEADER / TAB NAVIGATION (Video İle Birebir Modüller) */}
      <div className="bg-[#141b29] border-b border-slate-700/80 px-4 py-2 shrink-0 overflow-x-auto scrollbar-none sticky top-[65px] z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1 sm:gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Hızlı Sipariş & Ürün Kataloğu</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Sipariş Takip (Detaylı)</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-[10px] text-amber-400 font-mono">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Sipariş Raporu (Tarih & Durum)</span>
            </button>

            <button
              onClick={() => setActiveTab('payment')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'payment'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Kredi Kartı ile Cari Ödeme</span>
            </button>

            <button
              onClick={() => setActiveTab('statement')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'statement'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Cari Hesap Ekstresi</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Fiyat Listesi İndir</span>
            </button>
          </nav>

          {/* Quick Excel Import Button */}
          <button
            onClick={() => setIsExcelImportOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel'den Hızlı Sipariş</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 p-4 sm:p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* GUIDED SCENARIO TOUR (Baştan Sona Rehberli Canlı Senaryo) */}
          <B2BScenarioTour
            currentStep={scenarioStep}
            onExecuteStep={handleExecuteScenarioStep}
            onAutoRunAll={handleAutoRunScenario}
          />

          {/* =========================================================================
              TAB 1: HIZLI SİPARİŞ & ÜRÜN KATALOĞU (Videodaki Toptan Tablo & Vitrin)
             ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="bg-[#182133] border border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Stok Kodu, Barkod, Ürün Adı veya Marka ile arayın..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">Tüm Kategoriler ({products.length})</option>
                    {distinctCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setOnlyInStock(!onlyInStock)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      onlyInStock
                        ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    Sadece Stoktakiler
                  </button>

                  <button
                    onClick={() => setOnlyHighDiscount(!onlyHighDiscount)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      onlyHighDiscount
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    %40+ İskontolu
                  </button>

                  {/* View Mode Switcher */}
                  <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 p-0.5 ml-1">
                    <button
                      onClick={() => setProductViewMode('table')}
                      className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                        productViewMode === 'table' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                      title="B2B Tablo Görünümü"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setProductViewMode('grid')}
                      className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                        productViewMode === 'grid' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                      title="Baskı Mockup Vitrin Görünümü"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* PRODUCTS DISPLAY */}
              {productViewMode === 'table' ? (
                /* B2B TABLE VIEW */
                <div className="bg-[#182133] border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-700">
                        <tr>
                          <th className="py-3 px-3">Görsel</th>
                          <th className="py-3 px-3">Stok Kodu / Barkod</th>
                          <th className="py-3 px-3">Ürün Açıklaması</th>
                          <th className="py-3 px-3">Marka / Kategori</th>
                          <th className="py-3 px-3 text-right">Liste Fiyatı</th>
                          <th className="py-3 px-3 text-center">İskonto</th>
                          <th className="py-3 px-3 text-right text-amber-300">Bayi Net Fiyatı</th>
                          <th className="py-3 px-3 text-right">KDV Dahil</th>
                          <th className="py-3 px-3 text-center">Stok</th>
                          <th className="py-3 px-3 text-center">Kutu / Koli</th>
                          <th className="py-3 px-3 text-center">Hızlı Sipariş & Özel Baskı</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredProducts.map((p) => (
                          <ProductRow
                            key={p.id}
                            product={p}
                            onAddToCart={handleAddProductToCart}
                            onOpenCustomPrint={(prod) => setCustomPrintProduct(prod)}
                          />
                        ))}
                        {filteredProducts.length === 0 && (
                          <tr>
                            <td colSpan={11} className="py-12 text-center text-slate-400">
                              Arama kriterlerinize uygun ürün bulunamadı.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Toplam {filteredProducts.length} kurumsal ürün listeleniyor</span>
                    <span className="text-[11px] font-mono">Mete Kırtasiye A.Ş. 2026/1 Genel Toptan İskonto Şartları Geçerlidir</span>
                  </div>
                </div>
              ) : (
                /* GRID CARDS VIEW WITH LIVE MOCK-UP OVERLAY */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={handleAddProductToCart}
                      onOpenCustomPrint={(prod) => setCustomPrintProduct(prod)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: SİPARİŞ TAKİP / DETAYLI (Videodaki Kalem Kalem Sevkiyat Ekranı)
             ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-[#182133] border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-400" />
                    <span>Sipariş Takip & Detaylı Sevkiyat Listesi</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mete Kırtasiye üzerinden verilen toptan siparişlerin anlık durumları, irsaliye ve kargo hareketleri.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => {
                      const csvContent =
                        'data:text/csv;charset=utf-8,' +
                        ['SiparisNo;Tarih;BelgeNo;Kalem;Tutar;Durum;Kargo']
                          .concat(
                            orders.map(
                              (o) =>
                                `${o.id};${o.orderDate};${o.documentNo};${o.itemCount};${o.totalNetAmount} TL;${o.status};${o.carrier}`
                            )
                          )
                          .join('\n');
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement('a');
                      link.setAttribute('href', encodedUri);
                      link.setAttribute('download', `Mete_B2B_Siparisler_${Date.now()}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Excel'e Aktar (.csv)</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-400" />
                    <span>Yazdır</span>
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#182133] border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-700">
                      <tr>
                        <th className="py-3.5 px-4">Sipariş No</th>
                        <th className="py-3.5 px-4">Sipariş Tarihi</th>
                        <th className="py-3.5 px-4">Belge / İrsaliye No</th>
                        <th className="py-3.5 px-4 text-center">Kalem</th>
                        <th className="py-3.5 px-4 text-right">Net Tutar</th>
                        <th className="py-3.5 px-4 text-center">Durum</th>
                        <th className="py-3.5 px-4">Dağıtım Aracı / Kargo</th>
                        <th className="py-3.5 px-4 text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-white text-xs">{ord.id}</td>
                          <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">{ord.orderDate}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">{ord.documentNo}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-200">{ord.itemCount} Kalem</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-300 text-sm">
                            {ord.totalNetAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                ord.status === 'Onaylandı'
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                  : ord.status === 'Hazırlanıyor'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse'
                                  : ord.status === 'Sevk Edildi'
                                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                            <div>{ord.carrier}</div>
                            <div className="text-[10px] text-slate-500 font-mono">Takip: {ord.trackingNo}</div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-[11px] transition-colors flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Kalem Detayı</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: SİPARİŞ RAPORU (Tarih & Durum Filtreli)
             ========================================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="bg-[#182133] border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                      <span>Sipariş & Satış Raporlama Ekranı</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Belirlediğiniz tarih aralığı ve sipariş durumuna göre kalem bazlı finansal özet.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Başlangıç Tarihi:</label>
                    <input
                      type="date"
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Bitiş Tarihi:</label>
                    <input
                      type="date"
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Sipariş Durumu:</label>
                    <select
                      value={reportStatusFilter}
                      onChange={(e: any) => setReportStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value="all">Tüm Durumlar</option>
                      <option value="open">Açık / Hazırlanıyor</option>
                      <option value="shipped">Sevk Edildi</option>
                      <option value="invoiced">Faturalandı</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Report Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#182133] border border-slate-700 p-4 rounded-2xl">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Toplam Raporlanan Tutar</div>
                  <div className="text-xl font-black text-amber-400 font-mono mt-1">
                    {orders.reduce((s, o) => s + o.totalNetAmount, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{orders.length} adet toptan sipariş</div>
                </div>

                <div className="bg-[#182133] border border-slate-700 p-4 rounded-2xl">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Sevk Edilen Net Hacim</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                    {orders.reduce((s, o) => s + o.shippedNetAmount, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Teslimatı tamamlanan ve yoldaki siparişler</div>
                </div>

                <div className="bg-[#182133] border border-slate-700 p-4 rounded-2xl">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Bekleyen / Hazırlanan Tutar</div>
                  <div className="text-xl font-black text-blue-400 font-mono mt-1">
                    {orders.reduce((s, o) => s + o.remainingNetAmount, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Mete Kırtasiye imalat & depo hazırlığında</div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: KREDİ KARTI İLE CARİ ÖDEME (3D Secure Sanal POS)
             ========================================================================= */}
          {activeTab === 'payment' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Payment Form */}
              <div className="lg:col-span-2 bg-[#182133] border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">3D Secure Sanal POS ile Cari Borç Kapatma</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Ödenecek Tutar (TL):</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setPaymentAmount(dealerInfo.overdueAmount)}
                        className="absolute right-2 top-2 px-2.5 py-1 rounded-lg bg-red-600/30 text-red-300 text-[10px] font-bold"
                      >
                        Vadesi Geçeni Doldur ({dealerInfo.overdueAmount.toFixed(0)} ₺)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Kart Üzerindeki İsim:</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Kart Numarası:</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Son Kullanma (AA/YY):</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Güvenlik Kodu (CVV):</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setIs3DModalOpen(true)}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>3D Secure ile Güvenli Ödeme Yap ({paymentAmount.toFixed(2)} ₺)</span>
                  </button>
                </div>
              </div>

              {/* Installment Rates Box */}
              <div className="bg-[#182133] border border-slate-700 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
                <div className="font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Anlaşmalı Banka Taksit Oranları</span>
                </div>
                <div className="space-y-2">
                  {METE_BANK_INSTALLMENTS.map((bank) => (
                    <div
                      key={bank.bankName}
                      onClick={() => setSelectedBank(bank.bankName)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        selectedBank === bank.bankName
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-white text-xs">{bank.bankName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">12 Taksite kadar vade farksız kampanya</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: CARİ HESAP EKSTRESİ
             ========================================================================= */}
          {activeTab === 'statement' && (
            <div className="space-y-4">
              <div className="bg-[#182133] border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-amber-400" />
                    <span>Mete Kırtasiye Cari Hesap Ekstresi</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tüm fatura, havale ve Sanal POS ödeme hareketlerinizin güncel dökümü.
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ekstre Yazdır (PDF)</span>
                </button>
              </div>

              <div className="bg-[#182133] border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Tarih</th>
                        <th className="py-3 px-4">Belge Türü</th>
                        <th className="py-3 px-4">Belge No</th>
                        <th className="py-3 px-4">Açıklama</th>
                        <th className="py-3 px-4 text-right text-red-400">Borç (₺)</th>
                        <th className="py-3 px-4 text-right text-emerald-400">Alacak (₺)</th>
                        <th className="py-3 px-4 text-right">Bakiye (₺)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {cariMovements.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono text-slate-300">{m.date}</td>
                          <td className="py-3 px-4 font-semibold text-white">{m.docType}</td>
                          <td className="py-3 px-4 font-mono text-slate-400">{m.docNo}</td>
                          <td className="py-3 px-4 text-slate-300 text-[11px]">{m.description}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-red-400">
                            {m.debt > 0 ? m.debt.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '-'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                            {m.credit > 0 ? m.credit.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '-'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-white">
                            {m.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: FİYAT LİSTESİ İNDİRME
             ========================================================================= */}
          {activeTab === 'catalog' && (
            <div className="bg-[#182133] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                <Download className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Mete Kırtasiye 2026/1 Genel Toptan Fiyat Listesi</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  ERP ve muhasebe programlarınıza anında aktarabileceğiniz güncel iskonto tablosu ve barkodlu ürün listesi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <button
                  onClick={() => {
                    const csvContent =
                      'data:text/csv;charset=utf-8,' +
                      ['StokKodu;Barkod;UrunAdi;Marka;Kategori;ListeFiyati;Iskonto;BayiNetFiyati;Kdv']
                        .concat(
                          products.map(
                            (p) =>
                              `${p.code};${p.barcode};${p.title};${p.brand};${p.category};${p.listPrice};%${p.discountRate};${p.netPrice};%${p.vatRate}`
                          )
                        )
                        .join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', `Mete_Kirtasiye_Fiyat_Listesi_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showToast('Excel fiyat listesi indirildi.');
                  }}
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center gap-3 text-left cursor-pointer transition-colors"
                >
                  <FileSpreadsheet className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white text-xs">Excel / CSV İndir</div>
                    <div className="text-[10px] text-slate-400">Barkod & İskonto Tablosu</div>
                  </div>
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center gap-3 text-left cursor-pointer transition-colors"
                >
                  <FileText className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white text-xs">PDF Katalog İndir</div>
                    <div className="text-[10px] text-slate-400">Yazdırılabilir Renkli Rehber</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =========================================================================
          DRAWER: TOPTAN SİPARİŞ SEPETİ
         ========================================================================= */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartDrawerOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#182133] border-l border-slate-700 shadow-2xl flex flex-col h-full text-slate-100 z-10 animate-slideLeft">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Mete B2B Toptan Sepeti</h3>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {b2bCart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.packType}-${idx}`}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-bold text-white text-xs">{item.product.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {item.quantity} {item.packType} ({item.totalUnits} Adet) x {item.product.netPrice.toFixed(2)} ₺
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-amber-300">
                        {item.itemNetTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </div>
                      <button
                        onClick={() => setB2bCart((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-[10px] text-red-400 hover:underline mt-1"
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>

                  {item.customPrint?.hasCustomPrint && (
                    <div className="p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-[10px] space-y-0.5">
                      <div className="font-bold text-amber-300 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Mete Kırtasiye Özel Baskı Talebi</span>
                      </div>
                      <div className="text-slate-300 italic">"{item.customPrint.printNote}"</div>
                      <div className="text-slate-400 font-mono text-[9px]">
                        Tür: {item.customPrint.printType} · Konum: {item.customPrint.printLocation}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {b2bCart.length === 0 && (
                <div className="text-center py-20 text-slate-400 text-xs">
                  <ShoppingCart className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <span>Toptan sepetinizde ürün bulunmuyor.</span>
                </div>
              )}
            </div>

            {b2bCart.length > 0 && (
              <div className="p-4 border-t border-slate-700 bg-slate-900 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span>Ara Toplam (Net):</span>
                    <span>{b2bCartTotalNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toplam KDV:</span>
                    <span>{b2bCartTotalVat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                    <span>Genel Toplam:</span>
                    <span className="text-amber-400">
                      {b2bCartGrandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Fatura & Cari Ödeme Adımına İlerle</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SİPARİŞ KALEM KALEM DETAYI
         ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#182133] border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between bg-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-mono">{selectedOrder.id}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Tarih: {selectedOrder.orderDate} · İrsaliye: {selectedOrder.documentNo}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="border border-slate-700 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Stok Kodu</th>
                      <th className="py-2.5 px-3">Ürün Adı</th>
                      <th className="py-2.5 px-3 text-center">Sipariş</th>
                      <th className="py-2.5 px-3 text-center">Sevk</th>
                      <th className="py-2.5 px-3 text-center">Kalan</th>
                      <th className="py-2.5 px-3 text-right">Liste F.</th>
                      <th className="py-2.5 px-3 text-center">İsk.</th>
                      <th className="py-2.5 px-3 text-right">Net Tutar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedOrder.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{it.code}</td>
                        <td className="py-2.5 px-3 font-semibold text-white">{it.title}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-200">{it.orderedQty}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-400">{it.shippedQty}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-400">{it.remainingQty}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-400">{it.unitPrice.toFixed(2)} ₺</td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-400">%{it.discountRate}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-300">
                          {it.totalNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400">Sevkiyat / Taşıyıcı:</div>
                  <div className="font-semibold text-white mt-0.5">{selectedOrder.carrier}</div>
                  <div className="text-[11px] text-slate-400 font-mono">Takip: {selectedOrder.trackingNo}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Ödeme Şekli & Not:</div>
                  <div className="font-semibold text-amber-300 mt-0.5">{selectedOrder.paymentType}</div>
                  <div className="text-[11px] text-slate-400">{selectedOrder.notes || 'Not bulunmuyor'}</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-900 flex items-center justify-between text-xs">
              <span className="font-bold text-white">
                Toplam Net Tutar:{' '}
                <span className="text-amber-300 font-mono text-sm ml-1">
                  {selectedOrder.totalNetAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </span>
              </span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: 3D SECURE SMS DOĞRULAMA
         ========================================================================= */}
      {is3DModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#182133] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{selectedBank} 3D Secure Doğrulama</h3>
              <p className="text-xs text-slate-400 mt-1">
                Sayın Müşterimiz, <strong>0 (532) *** ** 33</strong> numaralı telefonunuza gelen onay kodunu giriniz.
              </p>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-xs mb-4 space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>İşyeri:</span>
                <strong className="text-white">{METE_PORTAL_BRAND.name}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ödeme Tutarı:</span>
                <strong className="text-emerald-400 font-mono">
                  {paymentAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </strong>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">SMS Onay Kodu:</label>
                <input
                  type="text"
                  maxLength={6}
                  value={smsOtpCode}
                  onChange={(e) => setSmsOtpCode(e.target.value)}
                  placeholder="Örn: 492810"
                  className="w-full text-center tracking-widest text-lg font-mono py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIs3DModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleConfirm3DVerification}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg"
                >
                  Onayla ve Öde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ÖDEME BAŞARILI MAKBUZU
         ========================================================================= */}
      {isPaymentSuccessModalOpen && lastPaymentReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#182133] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleIn text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Check className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tahsilat Başarıyla Gerçekleşti!</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cari bakiyenizden <strong>{lastPaymentReceipt.amount.toFixed(2)} ₺</strong> anında düşülmüştür.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Dekont / İşlem No:</span>
                <strong className="text-white">{lastPaymentReceipt.orderId}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tarih / Saat:</span>
                <span className="text-slate-300">{lastPaymentReceipt.date}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Provizyon Kodu:</span>
                <span className="text-slate-300">{lastPaymentReceipt.authCode}</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800 font-bold">
                <span>Tahsil Edilen Tutar:</span>
                <span className="text-emerald-400 text-sm">
                  {lastPaymentReceipt.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Makbuzu Yazdır</span>
              </button>
              <button
                onClick={() => {
                  setIsPaymentSuccessModalOpen(false);
                  setActiveTab('statement');
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                Cari Ekstreye Git
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EXCEL'DEN TOPLU SİPARİŞ
         ========================================================================= */}
      {isExcelImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#182133] border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-scaleIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Excel'den Hızlı Sipariş Aktarımı</h3>
              </div>
              <button
                onClick={() => setIsExcelImportOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Excel tablonuzdan <strong>Barkod / Stok Kodu</strong> ve <strong>Miktar</strong> sütunlarını kopyalayıp
              aşağıdaki alana yapıştırın. Sistem ürünleri toptan sepetinize otomatik aktaracaktır.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Örnek Format: <code className="text-amber-400 font-mono">8690333001010 [TAB] 10</code>
              </label>
              <textarea
                rows={6}
                value={excelPasteText}
                onChange={(e) => setExcelPasteText(e.target.value)}
                placeholder="8690333001010&#9;10&#10;8690826014521&#9;48&#10;8691234567890&#9;5"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setExcelPasteText('8690333001010\t10\n8690826014521\t48\n8691234567890\t5');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Örnek Doldur
              </button>
              <button
                type="button"
                onClick={handleProcessExcelPaste}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg cursor-pointer"
              >
                Sepete Aktar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: FOTOĞRAF YÜKLE & YENİ ÜRÜN EKLE
         ========================================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#182133] border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-scaleIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Yeni Ürün Fotoğrafı Yükle & Kategoriye Ata</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Ürün Başlığı / Modeli:</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Örn: Mete Pro Özel Baskılı Su Geçirmez Sırt Çantası"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Kategori:</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    {distinctCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Toptan Fiyat (TL + KDV):</label>
                  <input
                    type="number"
                    value={uploadPrice}
                    onChange={(e) => setUploadPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Görsel URL / Fotoğraf Bağlantısı:</label>
                <input
                  type="text"
                  value={uploadImageUrl}
                  onChange={(e) => setUploadImageUrl(e.target.value)}
                  placeholder="Boş bırakılırsa kategoriye uygun görsel atanır"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Özel Baskı & Mock-up Desteği:</span>
                  <span className="text-[11px] text-slate-400">Ürün üzerinde 'Mete Kırtasiye' logo baskı önizlemesi etkinleştirilsin.</span>
                </div>
                <input
                  type="checkbox"
                  checked={uploadSupportsPrint}
                  onChange={(e) => setUploadSupportsPrint(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSaveUploadedProduct}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg cursor-pointer"
              >
                Kataloğa Ekle & Yayınla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ÇANTA ÖZEL BASKI & 10 ADET SİPARİŞ
         ========================================================================= */}
      {customPrintProduct && (
        <B2BCustomPrintModal
          product={customPrintProduct}
          isOpen={!!customPrintProduct}
          onClose={() => setCustomPrintProduct(null)}
          onConfirmAndAddToCart={handleAddCustomPrintProductToCart}
        />
      )}

      {/* =========================================================================
          MODAL: SEPET & CARİ ÖDEME ONFormatı
         ========================================================================= */}
      <B2BCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={b2bCart}
        dealerInfo={dealerInfo}
        onConfirmOrder={handleConfirmOrderFromModal}
      />
    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: PRODUCT ROW (TABLE VIEW)
// =========================================================================
interface ProductRowProps {
  product: B2BProduct;
  onAddToCart: (product: B2BProduct, quantity: number, packType: 'adet' | 'kutu' | 'koli') => void;
  onOpenCustomPrint?: (product: B2BProduct) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, onAddToCart, onOpenCustomPrint }) => {
  const [orderQty, setOrderQty] = useState<number>(
    product.supportsCustomPrint || product.category === 'Çantalar & Sırt Çantaları' ? 10 : product.minOrderQty
  );
  const [packType, setPackType] = useState<'adet' | 'kutu' | 'koli'>('adet');

  const isPrintable = product.supportsCustomPrint || product.category === 'Çantalar & Sırt Çantaları';

  return (
    <tr className="hover:bg-slate-800/50 transition-colors">
      <td className="py-2.5 px-3">
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
          />
          {isPrintable && (
            <span className="absolute -bottom-1 -right-1 p-0.5 rounded bg-amber-500 text-slate-950 text-[8px] font-black">
              Baskı
            </span>
          )}
        </div>
      </td>
      <td className="py-2.5 px-3">
        <div className="font-mono font-bold text-white text-xs">{product.code}</div>
        <div className="font-mono text-[10px] text-slate-400">{product.barcode}</div>
      </td>
      <td className="py-2.5 px-3 max-w-[260px]">
        <div className="font-bold text-slate-200 text-xs line-clamp-1" title={product.title}>
          {product.title}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-slate-400">Asgari: {product.minOrderQty} Adet</span>
          {product.customPrintBadge && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {product.customPrintBadge}
            </span>
          )}
        </div>
      </td>
      <td className="py-2.5 px-3">
        <span className="font-semibold text-slate-300">{product.brand}</span>
        <div className="text-[10px] text-slate-400 truncate">{product.category}</div>
      </td>
      <td className="py-2.5 px-3 text-right font-mono text-slate-400 line-through">
        {product.listPrice.toFixed(2)} ₺
      </td>
      <td className="py-2.5 px-3 text-center">
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
          %{product.discountRate}
        </span>
      </td>
      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-300">
        {product.netPrice.toFixed(2)} ₺
      </td>
      <td className="py-2.5 px-3 text-right font-mono text-slate-300 text-[11px]">
        {product.netPriceWithVat.toFixed(2)} ₺
      </td>
      <td className="py-2.5 px-3 text-center">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Var ({product.stockQuantity})
        </span>
      </td>
      <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-400">
        {product.boxQuantity} / {product.caseQuantity}
      </td>
      <td className="py-2.5 px-3 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 overflow-hidden">
            <button
              onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
              className="px-1.5 py-1 text-slate-400 hover:text-white"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              value={orderQty}
              onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-10 text-center bg-transparent text-white font-mono text-xs focus:outline-none"
            />
            <button
              onClick={() => setOrderQty(orderQty + 1)}
              className="px-1.5 py-1 text-slate-400 hover:text-white"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onAddToCart(product, orderQty, packType)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
              title="Toptan Sepete Ekle"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
              <span>Ekle</span>
            </button>

            {isPrintable && onOpenCustomPrint && (
              <button
                onClick={() => onOpenCustomPrint(product)}
                className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 transition-all cursor-pointer"
                title="Ürüne özel baskı talebiyle yapılandır ve 10 adet ekle"
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Özel Baskı</span>
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

// =========================================================================
// SUB-COMPONENT: PRODUCT CARD (GRID VIEW WITH MOCKUP)
// =========================================================================
interface ProductCardProps {
  product: B2BProduct;
  onAddToCart: (product: B2BProduct, quantity: number, packType: 'adet') => void;
  onOpenCustomPrint?: (product: B2BProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onOpenCustomPrint }) => {
  const [showMockup, setShowMockup] = useState(true);
  const [orderQty, setOrderQty] = useState(product.supportsCustomPrint ? 10 : product.minOrderQty);

  return (
    <div className="bg-[#182133] border border-slate-700 hover:border-amber-500/50 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all group">
      <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {showMockup && product.supportsCustomPrint && (
          <div className="absolute inset-x-3 bottom-3 bg-slate-950/85 backdrop-blur-md border border-amber-500/40 rounded-xl p-2 flex items-center justify-between gap-2 shadow-2xl">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-amber-500 flex items-center justify-center text-slate-950 font-black text-[10px]">
                M
              </div>
              <div className="text-[10px] font-black text-white">METE KIRTASİYE BASKILI</div>
            </div>
            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
              MOCKUP
            </span>
          </div>
        )}

        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-950/80 text-[10px] text-amber-300 font-bold border border-amber-500/30">
          {product.category}
        </div>

        {product.supportsCustomPrint && (
          <button
            onClick={() => setShowMockup(!showMockup)}
            className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-slate-900/90 text-[9px] font-bold text-slate-200 border border-slate-700 cursor-pointer"
          >
            {showMockup ? 'Baskılı' : 'Ham'}
          </button>
        )}
      </div>

      <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>{product.code}</span>
            <span className="text-emerald-400 font-bold">Stok: {product.stockQuantity}</span>
          </div>
          <h4 className="font-bold text-white text-xs line-clamp-2 mt-1">{product.title}</h4>
        </div>

        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-slate-400">Bayi Net:</span>
            <div className="text-right">
              <span className="text-xs text-slate-500 line-through mr-1 font-mono">
                {product.listPrice.toFixed(2)} ₺
              </span>
              <span className="text-sm font-black text-amber-400 font-mono">
                {product.netPrice.toFixed(2)} ₺
              </span>
            </div>
          </div>

          <div className="flex gap-1.5">
            {product.supportsCustomPrint && onOpenCustomPrint ? (
              <button
                onClick={() => onOpenCustomPrint(product)}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Özel Baskı (10 Adet)</span>
              </button>
            ) : (
              <button
                onClick={() => onAddToCart(product, orderQty, 'adet')}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                <span>Sepete Ekle</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
