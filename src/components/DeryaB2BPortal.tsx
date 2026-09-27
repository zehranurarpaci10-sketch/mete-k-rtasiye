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
  Sparkles,
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
  DERYA_DEALER_INFO,
  DERYA_B2B_PRODUCTS,
  DERYA_B2B_ORDERS,
  DERYA_CARI_MOVEMENTS,
  BANK_INSTALLMENT_OPTIONS,
} from '../data/deryaB2BData';
import { B2BCustomPrintModal } from './B2BCustomPrintModal';
import { B2BScenarioTour } from './B2BScenarioTour';
import { B2BCheckoutModal } from './B2BCheckoutModal';

interface DeryaB2BPortalProps {
  onClose: () => void;
  onOpenCustomerVitrin?: () => void;
  onOpenSellerDashboard?: () => void;
  initialTab?: 'products' | 'orders' | 'reports' | 'payment' | 'statement' | 'catalog';
}

export const DeryaB2BPortal: React.FC<DeryaB2BPortalProps> = ({
  onClose,
  onOpenCustomerVitrin,
  onOpenSellerDashboard,
  initialTab = 'products',
}) => {
  // Authentication state for B2B portal simulation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginCustomerCode, setLoginCustomerCode] = useState('06.METE.001');
  const [loginPassword, setLoginPassword] = useState('mete2026');
  const [rememberMe, setRememberMe] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'reports' | 'payment' | 'statement' | 'catalog'>(initialTab);

  // Dealer account state (reactive)
  const [dealerInfo, setDealerInfo] = useState<B2BCariAccount>(DERYA_DEALER_INFO);
  const [cariMovements, setCariMovements] = useState<B2BCariMovement[]>(DERYA_CARI_MOVEMENTS);
  const [orders, setOrders] = useState<B2BOrder[]>(DERYA_B2B_ORDERS);
  const [products] = useState<B2BProduct[]>(DERYA_B2B_PRODUCTS);

  // Custom Print Modal State
  const [customPrintProduct, setCustomPrintProduct] = useState<B2BProduct | null>(null);
  // Checkout Modal State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  // Scenario Tour Active Step State (1-4)
  const [scenarioStep, setScenarioStep] = useState<number>(1);

  // B2B Wholesale Cart
  const [b2bCart, setB2bCart] = useState<B2BCartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Product Catalog Filters
  const [productSearch, setProductSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyHighDiscount, setOnlyHighDiscount] = useState(false);

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<B2BOrder | null>(null);

  // Order Report Filters (Tarih ve Durum Bazlı Filtreleme)
  const [reportStartDate, setReportStartDate] = useState('2026-09-01');
  const [reportEndDate, setReportEndDate] = useState('2026-09-30');
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'open' | 'shipped' | 'invoiced' | 'cancelled'>('all');

  // Credit Card Payment State
  const [paymentAmount, setPaymentAmount] = useState<number>(4200.0); // Default to overdue
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

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Distinct Brands & Categories for filter
  const distinctBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand)));
  }, [products]);

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

      const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchStock = !onlyInStock || p.stockStatus !== 'out_of_stock';
      const matchDiscount = !onlyHighDiscount || p.discountRate >= 40;

      return matchSearch && matchBrand && matchCategory && matchStock && matchDiscount;
    });
  }, [products, productSearch, selectedBrand, selectedCategory, onlyInStock, onlyHighDiscount]);

  // Add Product to B2B Cart
  const handleAddProductToCart = (product: B2BProduct, quantity: number, packType: 'adet' | 'kutu' | 'koli' = 'adet') => {
    let units = quantity;
    if (packType === 'kutu') units = quantity * product.boxQuantity;
    if (packType === 'koli') units = quantity * product.caseQuantity;

    const netItemTotal = units * product.netPrice;

    setB2bCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.packType === packType);
      if (existing) {
        return prev.map((item) => {
          if (item.product.id === product.id && item.packType === packType) {
            const newQty = item.quantity + quantity;
            const newUnits = item.totalUnits + units;
            return {
              ...item,
              quantity: newQty,
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

    showToast(`"${product.title}" (${units} adet) toptan sipariş sepetine eklendi.`);
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

  // Confirm and Complete Order from B2BCheckoutModal
  const handleConfirmOrderFromModal = (orderData: {
    paymentType: 'Cari Hesap' | 'Kredi Kartı (Sanal POS)' | 'Vadeli Çek';
    invoiceAddress: string;
    notes: string;
  }): B2BOrder => {
    const orderId = `SIP-2026-BASKI-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: B2BOrder = {
      id: orderId,
      orderDate: '27.09.2026 13:50',
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
      carrier: 'Derya Dağıtım Merkez Sevkiyat',
      trackingNo: `DRY-BASKI-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentType: orderData.paymentType,
      invoiceAddress: orderData.invoiceAddress,
      notes: orderData.notes,
      orderSource: 'b2b.destekkirtasiye.com.tr',
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

    setScenarioStep(4);
    showToast(`Toptan Siparişiniz (#${orderId}) Derya Dağıtım A.Ş. onayına iletildi.`);
    return newOrder;
  };

  // Scenario Walkthrough Step Controller
  const handleExecuteScenarioStep = (stepNumber: number) => {
    setScenarioStep(stepNumber);
    if (stepNumber === 1) {
      // Step 1: Giriş ve Bakiye Kontrolü
      setActiveTab('statement');
      showToast('Adım 1: b2b.destekkirtasiye.com.tr cari bakiye (38.450 ₺) ve ekstre görüntülendi.');
    } else if (stepNumber === 2) {
      // Step 2: Kategori & Sipariş/Finans Gezintisi
      setActiveTab('orders');
      showToast('Adım 2: Geçmiş siparişler ve cari ödeme hareketleri inceleniyor.');
    } else if (stepNumber === 3) {
      // Step 3: Çanta Seçimi & Özel Baskı İlavesi
      setActiveTab('products');
      setSelectedCategory('Çanta & Sırt Çantası');
      const bag = products.find((p) => p.category === 'Çanta & Sırt Çantası') || products[0];
      setCustomPrintProduct(bag);
      showToast("Adım 3: Çanta modeli için 'Ürüne özel baskı ilavesi yapılacaktır' yapılandırması açıldı.");
    } else if (stepNumber === 4) {
      // Step 4: Sepet & Süreç Tamamlama
      if (b2bCart.length === 0) {
        const bag = products.find((p) => p.category === 'Çanta & Sırt Çantası') || products[0];
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
    setSelectedCategory('Çanta & Sırt Çantası');
    const bag = products.find((p) => p.category === 'Çanta & Sırt Çantası') || products[0];
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

  // Cart Calculations
  const b2bCartTotalNet = b2bCart.reduce((sum, item) => sum + item.itemNetTotal, 0);
  const b2bCartTotalVat = b2bCart.reduce((sum, item) => sum + item.itemNetTotal * (item.product.vatRate / 100), 0);
  const b2bCartGrandTotal = b2bCartTotalNet + b2bCartTotalVat;
  const b2bCartItemCount = b2bCart.reduce((sum, item) => sum + item.totalUnits, 0);

  // Complete B2B Wholesale Order
  const handleCompleteB2BOrder = () => {
    if (b2bCart.length === 0) return;

    const orderId = `SIP-2026-0927-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: B2BOrder = {
      id: orderId,
      orderDate: '27.09.2026 13:45',
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
      carrier: 'Derya Dağıtım Merkez Sevkiyat',
      trackingNo: `DRY-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentType: 'Cari Hesap',
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
      })),
      notes: 'B2B portal üzerinden toptan sipariş geçildi.',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setB2bCart([]);
    setIsCartDrawerOpen(false);

    // Update pending order in dealer info
    setDealerInfo((prev) => ({
      ...prev,
      pendingOrdersAmount: prev.pendingOrdersAmount + b2bCartGrandTotal,
    }));

    showToast(`Toptan Siparişiniz (#${orderId}) Derya Dağıtım A.Ş. onayına iletildi.`);
  };

  // Filtered Orders for Reports
  const filteredReportOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Status filter
      if (reportStatusFilter === 'open' && ord.status !== 'Onaylandı' && ord.status !== 'Hazırlanıyor') return false;
      if (reportStatusFilter === 'shipped' && ord.status !== 'Sevk Edildi' && ord.status !== 'Teslim Edildi') return false;
      if (reportStatusFilter === 'invoiced' && ord.status !== 'Faturalandı') return false;
      if (reportStatusFilter === 'cancelled' && ord.status !== 'İptal Edildi') return false;
      return true;
    });
  }, [orders, reportStatusFilter]);

  // Report Metrics
  const reportTotalAmount = filteredReportOrders.reduce((s, o) => s + o.totalNetAmount, 0);
  const reportShippedAmount = filteredReportOrders.reduce((s, o) => s + o.shippedNetAmount, 0);
  const reportRemainingAmount = filteredReportOrders.reduce((s, o) => s + o.remainingNetAmount, 0);
  const reportTotalItems = filteredReportOrders.reduce((s, o) => s + o.itemCount, 0);

  // Bank Installment Table
  const currentBankData = useMemo(() => {
    return BANK_INSTALLMENT_OPTIONS.find((b) => b.bankName === selectedBank) || BANK_INSTALLMENT_OPTIONS[0];
  }, [selectedBank]);

  // Handle Online Payment (3D Secure Step 1)
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      alert('Lütfen geçerli bir ödeme tutarı giriniz.');
      return;
    }
    setIs3DModalOpen(true);
  };

  // Handle 3D Secure SMS Verification (Step 2)
  const handleConfirm3DVerification = () => {
    const receipt = {
      orderId: `POS-3D-${Math.floor(100000 + Math.random() * 900000)}`,
      date: '27.09.2026 13:48',
      dealerTitle: dealerInfo.dealerTitle,
      dealerCode: dealerInfo.dealerCode,
      amount: paymentAmount,
      bank: selectedBank,
      installments: selectedInstallmentCount,
      cardMasked: cardNumber.replace(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})/, '$1 **** **** $4'),
      authCode: `PROV-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setLastPaymentReceipt(receipt);
    setIs3DModalOpen(false);

    // Update Cari Balance and add Cari Movement
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
      description: `Sanal POS 3D Kredi Kartı Ödemesi (${selectedBank} ${selectedInstallmentCount} Taksit)`,
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

  // If simulated logout
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0f172a] text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#1e293b] border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />

          {/* Derya Dağıtım & Destek B2B Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 mb-3">
              <Building2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Derya Dağıtım A.Ş.</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Destek B2B Kırtasiye & Ofis Malzemeleri Bayi Portalı
            </p>
            <span className="inline-block mt-2 text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
              b2b.destekkirtasiye.com.tr
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAuthenticated(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Müşteri / Cari Kodu</label>
              <input
                type="text"
                value={loginCustomerCode}
                onChange={(e) => setLoginCustomerCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-red-500"
                placeholder="Örn: 06.METE.001"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Cari Bayi: <strong className="text-amber-400">METE KİTAP KIRTASİYE LİMİTED ŞİRKETİ</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">B4B Giriş Şifresi</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span>Beni Hatırla</span>
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-red-400 hover:underline">
                Şifremi Unuttum?
              </a>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>b2b.destekkirtasiye.com.tr Giriş Yap</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginCustomerCode('06.METE.001');
                  setLoginPassword('mete2026');
                  setIsAuthenticated(true);
                  handleAutoRunScenario();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tek Tıkla Giriş Yap & B2B Senaryosunu Başlat</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={onClose}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>← Mete Kırtasiye Vitrinine Dön</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">B4B v4.12</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn text-xs font-bold border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP BAR: Derya Dağıtım & Destek B2B Kurumsal Header */}
      <header className="bg-[#1e293b] border-b border-slate-700/80 px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-black shadow-md shadow-red-900/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white tracking-tight">Derya Dağıtım A.Ş.</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-600/20 text-red-400 border border-red-500/30">
                  Destek B2B
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                  (b2b.destekkirtasiye.com.tr)
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Bayi:</span>
                <strong className="text-amber-400 font-bold">{dealerInfo.dealerTitle}</strong>
                <span className="text-slate-500 font-mono text-[11px]">({dealerInfo.dealerCode})</span>
              </div>
            </div>
          </div>

          {/* Quick Cari Balance Badges & Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Cari Bakiye Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Cari Bakiye:</span>
              <span className="font-mono font-bold text-red-400">
                {dealerInfo.currentBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺ (Borç)
              </span>
            </div>

            {/* Vadesi Geçen / Risk */}
            {dealerInfo.overdueAmount > 0 && (
              <div
                onClick={() => {
                  setPaymentAmount(dealerInfo.overdueAmount);
                  setActiveTab('payment');
                }}
                className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 flex items-center gap-1.5 cursor-pointer hover:bg-red-900/50 transition-colors"
                title="Tıklayarak hemen kredi kartıyla ödeyin"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span className="text-[11px]">Vadesi Geçen:</span>
                <span className="font-mono font-bold">
                  {dealerInfo.overdueAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </span>
              </div>
            )}

            {/* Toptan Sepet Butonu */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Toptan Sepet ({b2bCartItemCount})</span>
              {b2bCartGrandTotal > 0 && (
                <span className="font-mono text-[11px] bg-black/30 px-1.5 py-0.5 rounded">
                  {b2bCartGrandTotal.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                </span>
              )}
            </button>

            {/* Çıkış / Vitrine Dön */}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Mete Kırtasiye Vitrinine Dön"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Vitrine Dön</span>
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* SUB-HEADER / TAB NAVIGATION */}
      <div className="bg-[#1e293b]/90 border-b border-slate-700 px-4 py-2 shrink-0 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1 sm:gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-red-600 text-white shadow-md'
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
                  ? 'bg-red-600 text-white shadow-md'
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
                  ? 'bg-red-600 text-white shadow-md'
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
                  ? 'bg-red-600 text-white shadow-md'
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
                  ? 'bg-red-600 text-white shadow-md'
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Guided Scenario Tour for B2B Evaluation */}
          <B2BScenarioTour
            currentStep={scenarioStep}
            onExecuteStep={handleExecuteScenarioStep}
            onAutoRunAll={handleAutoRunScenario}
          />

          {/* =========================================================================
              TAB 1: HIZLI SİPARİŞ & ÜRÜN KATALOĞU (Toptan İskontolu Fiyat Listesi)
             ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Stok Kodu, Barkod, Ürün Adı veya Marka ile arayın..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-red-500"
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

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Marka Seçimi */}
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="all">Tüm Markalar</option>
                    {distinctBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>

                  {/* Kategori Seçimi */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    {distinctCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {/* Stoktakiler Toggle */}
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

                  {/* Yüksek İskonto (%40+) */}
                  <button
                    onClick={() => setOnlyHighDiscount(!onlyHighDiscount)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      onlyHighDiscount
                        ? 'bg-red-600/20 text-red-400 border-red-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    %40+ İskontolu
                  </button>
                </div>
              </div>

              {/* Product Wholesale Table */}
              <div className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-3">Görsel</th>
                        <th className="py-3 px-3">Stok Kodu / Barkod</th>
                        <th className="py-3 px-3">Ürün Açıklaması</th>
                        <th className="py-3 px-3">Marka / Kat.</th>
                        <th className="py-3 px-3 text-right">Liste Fiyatı</th>
                        <th className="py-3 px-3 text-center">İskonto</th>
                        <th className="py-3 px-3 text-right text-amber-300">Net Bayi Fiyatı</th>
                        <th className="py-3 px-3 text-right">KDV Dahil</th>
                        <th className="py-3 px-3 text-center">Stok</th>
                        <th className="py-3 px-3 text-center">Kutu / Koli</th>
                        <th className="py-3 px-3 text-center">Hızlı Sipariş</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredProducts.map((p) => {
                        return (
                          <ProductTableRow
                            key={p.id}
                            product={p}
                            onAddToCart={handleAddProductToCart}
                            onOpenCustomPrint={(prod) => setCustomPrintProduct(prod)}
                          />
                        );
                      })}
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

                <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Toplam {filteredProducts.length} ürün listeleniyor</span>
                  <span className="text-[11px]">Derya Dağıtım A.Ş. 2026/1 Toptan İskonto Şartları Geçerlidir</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: SİPARİŞ TAKİP / DETAYLI (Video Screen: Sipariş Takip / Detaylı)
             ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-red-500" />
                    <span>Sipariş Takip & Detaylı Sevkiyat Listesi</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Derya Dağıtım A.Ş. üzerinden verilen toptan siparişlerin anlık durumları, irsaliye ve kargo hareketleri.
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
                      link.setAttribute('download', `Derya_B2B_Siparisler_${Date.now()}.csv`);
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

              {/* Order List Table */}
              <div className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
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
                        <th className="py-3.5 px-4">Kargo / Dağıtım Aracı</th>
                        <th className="py-3.5 px-4 text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {orders.map((ord) => {
                        const getStatusBadge = (status: string) => {
                          switch (status) {
                            case 'Onaylandı':
                              return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                            case 'Hazırlanıyor':
                              return 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse';
                            case 'Sevk Edildi':
                              return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
                            case 'Faturalandı':
                              return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                            case 'Teslim Edildi':
                              return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
                            case 'İptal Edildi':
                              return 'bg-red-500/20 text-red-400 border-red-500/30';
                            default:
                              return 'bg-slate-700 text-slate-300';
                          }
                        };

                        return (
                          <tr key={ord.id} className="hover:bg-slate-800/60 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-white">
                              {ord.id}
                            </td>
                            <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                              {ord.orderDate}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                              {ord.documentNo}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-slate-200">
                              {ord.itemCount} Kalem
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-300">
                              {ord.totalNetAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${getStatusBadge(
                                  ord.status
                                )}`}
                              >
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-300">
                              <div className="font-semibold text-xs">{ord.carrier}</div>
                              <span className="font-mono text-[10px] text-slate-400">{ord.trackingNo}</span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition-all font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Detay Gör</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: SİPARİŞ RAPORU (Video Screen: Sipariş Raporu - Tarih & Radyo Buton)
             ========================================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {/* Report Header & Filter Options */}
              <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-red-500" />
                      <span>Sipariş Raporlama & Analiz Modülü</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tarih aralığı ve sipariş durumuna göre Derya Dağıtım alışveriş raporu dökümü.
                    </p>
                  </div>

                  {/* Excel Export Button */}
                  <button
                    onClick={() => {
                      const csvContent =
                        'data:text/csv;charset=utf-8,' +
                        ['SiparisNo;Tarih;BelgeNo;Kalem;NetTutar;SevkTutar;KalanTutar;Durum']
                          .concat(
                            filteredReportOrders.map(
                              (o) =>
                                `${o.id};${o.orderDate};${o.documentNo};${o.itemCount};${o.totalNetAmount};${o.shippedNetAmount};${o.remainingNetAmount};${o.status}`
                            )
                          )
                          .join('\n');
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement('a');
                      link.setAttribute('href', encodedUri);
                      link.setAttribute('download', `Siparis_Raporu_${reportStartDate}_${reportEndDate}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Raporu Excel Olarak İndir</span>
                  </button>
                </div>

                {/* Date Filters & Quick Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Başlangıç Tarihi</label>
                    <input
                      type="date"
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Bitiş Tarihi</label>
                    <input
                      type="date"
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-400 font-bold mb-1">Hızlı Tarih Seçimi</label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => {
                          setReportStartDate('2026-09-27');
                          setReportEndDate('2026-09-27');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Bugün
                      </button>
                      <button
                        onClick={() => {
                          setReportStartDate('2026-09-20');
                          setReportEndDate('2026-09-27');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Bu Hafta
                      </button>
                      <button
                        onClick={() => {
                          setReportStartDate('2026-09-01');
                          setReportEndDate('2026-09-30');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Bu Ay (Eylül)
                      </button>
                      <button
                        onClick={() => {
                          setReportStartDate('2026-07-01');
                          setReportEndDate('2026-09-30');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Son 3 Ay
                      </button>
                      <button
                        onClick={() => {
                          setReportStartDate('2026-01-01');
                          setReportEndDate('2026-12-31');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Tüm Yıl (2026)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Radio Filter Buttons (Video'daki radyo buton filtreleri) */}
                <div className="pt-2">
                  <label className="block text-slate-400 font-bold text-xs mb-2">Sipariş Durumu Filtresi:</label>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-slate-500">
                      <input
                        type="radio"
                        name="reportStatus"
                        checked={reportStatusFilter === 'all'}
                        onChange={() => setReportStatusFilter('all')}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-white font-medium">Tüm Siparişler</span>
                    </label>

                    <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-slate-500">
                      <input
                        type="radio"
                        name="reportStatus"
                        checked={reportStatusFilter === 'open'}
                        onChange={() => setReportStatusFilter('open')}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-amber-400 font-medium">Açık / Bekleyenler</span>
                    </label>

                    <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-slate-500">
                      <input
                        type="radio"
                        name="reportStatus"
                        checked={reportStatusFilter === 'shipped'}
                        onChange={() => setReportStatusFilter('shipped')}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-purple-400 font-medium">Sevk Edilenler</span>
                    </label>

                    <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-slate-500">
                      <input
                        type="radio"
                        name="reportStatus"
                        checked={reportStatusFilter === 'invoiced'}
                        onChange={() => setReportStatusFilter('invoiced')}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-emerald-400 font-medium">Faturalananlar</span>
                    </label>

                    <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-slate-500">
                      <input
                        type="radio"
                        name="reportStatus"
                        checked={reportStatusFilter === 'cancelled'}
                        onChange={() => setReportStatusFilter('cancelled')}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-red-400 font-medium">İptal Edilenler</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 shadow-md">
                  <div className="text-[11px] text-slate-400 font-medium">Toplam Sipariş Tutarı</div>
                  <div className="text-lg font-black text-white font-mono mt-1">
                    {reportTotalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{filteredReportOrders.length} adet sipariş</div>
                </div>

                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 shadow-md">
                  <div className="text-[11px] text-slate-400 font-medium">Sevk Edilen Tutar</div>
                  <div className="text-lg font-black text-emerald-400 font-mono mt-1">
                    {reportShippedAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </div>
                  <div className="text-[10px] text-emerald-500/80 mt-0.5">İrsaliye ile teslimde</div>
                </div>

                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 shadow-md">
                  <div className="text-[11px] text-slate-400 font-medium">Bekleyen / Kalan Tutar</div>
                  <div className="text-lg font-black text-amber-400 font-mono mt-1">
                    {reportRemainingAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </div>
                  <div className="text-[10px] text-amber-500/80 mt-0.5">Depoda hazırlıkta</div>
                </div>

                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 shadow-md">
                  <div className="text-[11px] text-slate-400 font-medium">Ortalama İskonto Oranı</div>
                  <div className="text-lg font-black text-red-400 font-mono mt-1">
                    % 41.2
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Derya B2B bayilik avantajı</div>
                </div>
              </div>

              {/* Report Table */}
              <div className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Sipariş No</th>
                        <th className="py-3 px-4">Tarih</th>
                        <th className="py-3 px-4">İrsaliye / Belge</th>
                        <th className="py-3 px-4 text-center">Kalem</th>
                        <th className="py-3 px-4 text-right">Net Tutar</th>
                        <th className="py-3 px-4 text-right">Sevk Tutar</th>
                        <th className="py-3 px-4 text-right">Kalan Tutar</th>
                        <th className="py-3 px-4 text-center">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredReportOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-800/60">
                          <td className="py-3 px-4 font-mono font-bold text-white">{ord.id}</td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">{ord.orderDate}</td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{ord.documentNo}</td>
                          <td className="py-3 px-4 text-center text-slate-200">{ord.itemCount}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-white">
                            {ord.totalNetAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-emerald-400">
                            {ord.shippedNetAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-amber-400">
                            {ord.remainingNetAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                              {ord.status}
                            </span>
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
              TAB 4: KREDİ KARTI İLE CARİ ÖDEME (Sanal POS & Taksit Tablosu)
             ========================================================================= */}
          {activeTab === 'payment' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sol Sütun: Cari Bakiye & Kredi Kartı Formu (7 Kolon) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Cari Bakiye Kartı */}
                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                        METE KİTAP KIRTASİYE · CARİ HESAP
                      </span>
                      <h3 className="text-xl font-black text-white mt-0.5">Online Sanal POS Tahsilat</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Güncel Cari Borç:</div>
                      <div className="text-xl font-black text-red-400 font-mono">
                        {dealerInfo.currentBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </div>
                    </div>
                  </div>

                  {/* Vadesi Geçen Uyarısı & Hızlı Tutar Butonları */}
                  <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400">Hızlı Tutar Seçimi:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {dealerInfo.overdueAmount > 0 && (
                        <button
                          type="button"
                          onClick={() => setPaymentAmount(dealerInfo.overdueAmount)}
                          className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Vadesi Geçeni Kapat ({dealerInfo.overdueAmount.toLocaleString('tr-TR')} ₺)
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setPaymentAmount(dealerInfo.currentBalance)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Tüm Bakiyeyi Kapat ({dealerInfo.currentBalance.toLocaleString('tr-TR')} ₺)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentAmount(10000)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                      >
                        10.000 ₺
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sanal POS Kredi Kartı Formu */}
                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Kredi Kartı Bilgileri (256-Bit SSL 3D Secure)</span>
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Banka Güvencesi
                    </span>
                  </div>

                  {/* Canlı Kart Önizlemesi */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 border border-slate-700 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                        {selectedBank}
                      </div>
                      <div className="w-10 h-7 rounded-md bg-amber-400/80 flex items-center justify-center font-black text-slate-950 text-[10px]">
                        CHIP
                      </div>
                    </div>

                    <div className="font-mono text-lg sm:text-xl tracking-widest font-black text-amber-200 mb-4">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-end justify-between text-xs">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-400">Kart Sahibi</div>
                        <div className="font-bold text-slate-200 truncate max-w-[200px]">
                          {cardHolder || 'AD SOYAD'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] uppercase tracking-wider text-slate-400">SKT</div>
                        <div className="font-mono font-bold text-slate-200">{cardExpiry || 'AA/YY'}</div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleInitiatePayment} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Ödeme Tutarı (₺)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base font-bold focus:outline-none focus:border-red-500"
                          placeholder="0,00"
                          required
                        />
                        <span className="absolute right-3.5 top-3 text-slate-400 font-bold">₺</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Kart Sahibi Adı Soyadı</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-red-500 uppercase"
                        placeholder="KART ÜZERİNDEKİ İSİM"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Kart Numarası (16 Hane)</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                          const matches = v.match(/\d{4,16}/g);
                          const match = (matches && matches[0]) || '';
                          const parts = [];
                          for (let i = 0, len = match.length; i < len; i += 4) {
                            parts.push(match.substring(i, i + 4));
                          }
                          if (parts.length) {
                            setCardNumber(parts.join(' '));
                          } else {
                            setCardNumber(v);
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-red-500"
                        placeholder="5400 6100 8923 4510"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Son Kullanma (AA/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center text-xs focus:outline-none focus:border-red-500"
                          placeholder="11/28"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">CVV / Güvenlik Kodu</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center text-xs focus:outline-none focus:border-red-500"
                          placeholder="•••"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>
                        3D Secure ile Güvenli Öde ({paymentAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺)
                      </span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Sağ Sütun: Banka Seçimi & Taksit Seçenekleri Tablosu (5 Kolon) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Percent className="w-4 h-4 text-amber-400" />
                      <span>Anlaşmalı Banka Taksit Tablosu</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Ticari & Bireysel</span>
                  </div>

                  {/* Banka Seçimi Butonları */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {BANK_INSTALLMENT_OPTIONS.map((b) => (
                      <button
                        key={b.bankName}
                        type="button"
                        onClick={() => setSelectedBank(b.bankName)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedBank === b.bankName
                            ? 'bg-red-600/20 border-red-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-xs text-white">{b.bankLogo}</div>
                        <div className="text-[10px] text-slate-400 truncate">{b.bankName}</div>
                      </button>
                    ))}
                  </div>

                  {/* Taksit Seçenekleri Tablosu */}
                  <div className="border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-700">
                        <tr>
                          <th className="py-2.5 px-3">Seç</th>
                          <th className="py-2.5 px-3">Taksit</th>
                          <th className="py-2.5 px-3 text-right">Aylık Tutar</th>
                          <th className="py-2.5 px-3 text-right">Toplam Tutar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {currentBankData.installments.map((inst) => {
                          const calculatedTotal = paymentAmount * (1 + inst.rate / 100);
                          const calculatedMonthly = calculatedTotal / inst.count;

                          return (
                            <tr
                              key={inst.count}
                              onClick={() => setSelectedInstallmentCount(inst.count)}
                              className={`cursor-pointer transition-colors ${
                                selectedInstallmentCount === inst.count
                                  ? 'bg-red-600/20 text-white'
                                  : 'hover:bg-slate-800 text-slate-300'
                              }`}
                            >
                              <td className="py-2 px-3">
                                <input
                                  type="radio"
                                  name="installmentRadio"
                                  checked={selectedInstallmentCount === inst.count}
                                  onChange={() => setSelectedInstallmentCount(inst.count)}
                                  className="text-red-600 focus:ring-red-500"
                                />
                              </td>
                              <td className="py-2 px-3 font-semibold">
                                {inst.count === 1 ? 'Tek Çekim' : `${inst.count} Taksit`}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-[11px]">
                                {calculatedMonthly.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-amber-300 text-[11px]">
                                {calculatedTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>BDDK Lisanslı Sanal POS Entegrasyonu</span>
                    </div>
                    <p>
                      Ödeme sonrasında dekont anında e-posta adresinize gönderilir ve cari bakiyenizden otomatik olarak düşülür.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: CARİ HESAP EKSTRESİ (Mizan & Cari Hareketler)
             ========================================================================= */}
          {activeTab === 'statement' && (
            <div className="space-y-4">
              <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-red-500" />
                    <span>Cari Hesap Ekstresi & Hesap Hareketleri</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Derya Dağıtım A.Ş. ile Mete Kitap Kırtasiye Limited Şirketi arasındaki resmi mizan ve fatura hareketleri.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const csvContent =
                      'data:text/csv;charset=utf-8,' +
                      ['Tarih;BelgeTuru;EvrakNo;Borc;Alacak;Bakiye;Aciklama']
                        .concat(
                          cariMovements.map(
                            (m) =>
                              `${m.date};${m.docType};${m.docNo};${m.debt};${m.credit};${m.balance};${m.description}`
                          )
                        )
                        .join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', `Cari_Ekstre_${dealerInfo.dealerCode}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Ekstre Excel İndir</span>
                </button>
              </div>

              {/* Ekstre Tablosu */}
              <div className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Tarih</th>
                        <th className="py-3 px-4">Belge Türü</th>
                        <th className="py-3 px-4">Evrak / Fatura No</th>
                        <th className="py-3 px-4">Açıklama</th>
                        <th className="py-3 px-4 text-right">Borç (₺)</th>
                        <th className="py-3 px-4 text-right">Alacak (₺)</th>
                        <th className="py-3 px-4 text-right">Bakiye (₺)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {cariMovements.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-300">{m.date}</td>
                          <td className="py-3 px-4 font-semibold text-slate-200">{m.docType}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{m.docNo}</td>
                          <td className="py-3 px-4 text-slate-300 text-xs">{m.description}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-red-400">
                            {m.debt > 0 ? m.debt.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '-'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                            {m.credit > 0 ? m.credit.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '-'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-amber-300">
                            {m.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
                  <span>
                    Son Ödeme: <strong>{dealerInfo.lastPaymentDate}</strong> ({dealerInfo.lastPaymentAmount.toLocaleString('tr-TR')} ₺)
                  </span>
                  <div className="flex items-center gap-3">
                    <span>
                      Risk Limiti: <strong>{dealerInfo.riskLimit.toLocaleString('tr-TR')} ₺</strong>
                    </span>
                    <span>
                      Kullanılabilir: <strong className="text-emerald-400">{dealerInfo.availableLimit.toLocaleString('tr-TR')} ₺</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: FİYAT LİSTESİ & B2B İNDİRME
             ========================================================================= */}
          {activeTab === 'catalog' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 shadow-lg text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
                  <Download className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-white">Derya Dağıtım A.Ş. 2026/1 Genel Fiyat Listesi</h2>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto mt-1">
                    Tüm kırtasiye, ofis, okul, sanatsal ve fotokopi ürünlerinin barkodlu, KDV'li liste ve bayi net iskontolu fiyat tablosu.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
                  <button
                    onClick={() => {
                      const csvHeader = 'Barkod;StokKodu;UrunAdi;Marka;Kategori;KDVorani;ListeFiyati;IskontoOrani;NetBayiFiyati;KutuAdet;KoliAdet\n';
                      const csvRows = products
                        .map(
                          (p) =>
                            `${p.barcode};${p.code};"${p.title}";${p.brand};${p.category};%${p.vatRate};${p.listPrice} TL;%${p.discountRate};${p.netPrice} TL;${p.boxQuantity};${p.caseQuantity}`
                        )
                        .join('\n');
                      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', 'Derya_Dagitim_2026_Toptan_Fiyat_Listesi.csv');
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast('Derya Dağıtım 2026 Toptan Fiyat Listesi (.csv) indirildi.');
                    }}
                    className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all text-left flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Excel Fiyat Listesi (.xlsx / .csv)</div>
                      <div className="text-[10px] text-slate-400">Otomatik ERP ve muhasebe aktarımı</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all text-left flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="p-3 rounded-xl bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">PDF Katalog & İskonto Tablosu</div>
                      <div className="text-[10px] text-slate-400">Yazdırılabilir renkli ürün rehberi</div>
                    </div>
                  </button>
                </div>
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

          <div className="relative w-full max-w-md bg-[#1e293b] border-l border-slate-700 shadow-2xl flex flex-col h-full text-slate-100 z-10 animate-slideLeft">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-sm text-white">Derya B2B Toptan Sepeti</h3>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {b2bCart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.packType}-${idx}`}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2 text-xs"
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
                        onClick={() => {
                          setB2bCart((prev) => prev.filter((_, i) => i !== idx));
                        }}
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
                        <span>Özel Baskı Talebi Eklendi</span>
                      </div>
                      <div className="text-slate-300 italic">
                        "{item.customPrint.printNote}"
                      </div>
                      <div className="text-slate-400 font-mono text-[9px]">
                        Tür: {item.customPrint.printType} · Konum: {item.customPrint.printLocation}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {b2bCart.length === 0 && (
                <div className="text-center py-16 text-slate-400 text-xs">
                  <ShoppingCart className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <span>Toptan sepetinizde henüz ürün bulunmuyor.</span>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {b2bCart.length > 0 && (
              <div className="p-4 border-t border-slate-700 bg-slate-900/90 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Ara Toplam (Net):</span>
                    <span className="font-mono">{b2bCartTotalNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toplam KDV:</span>
                    <span className="font-mono">{b2bCartTotalVat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                    <span>Genel Toplam:</span>
                    <span className="font-mono text-amber-300">
                      {b2bCartGrandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
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
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
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
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Items Table */}
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
                        <td className="py-2.5 px-3 text-center font-bold text-red-400">%{it.discountRate}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-300">
                          {it.totalNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Info & Logistics */}
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

            {/* Modal Footer */}
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
          MODAL: 3D SECURE SMS DOĞRULAMA SİMÜLASYONU
         ========================================================================= */}
      {is3DModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
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
                <strong className="text-white">DERYA DAĞITIM A.Ş.</strong>
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
                <label className="block text-xs font-bold text-slate-300 mb-1">6 Haneli SMS Şifresi</label>
                <input
                  type="text"
                  maxLength={6}
                  value={smsOtpCode}
                  onChange={(e) => setSmsOtpCode(e.target.value)}
                  placeholder="Örn: 489210"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-center font-mono text-lg font-bold text-white tracking-widest focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIs3DModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  İptal Et
                </button>
                <button
                  type="button"
                  onClick={handleConfirm3DVerification}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg cursor-pointer"
                >
                  Onayla & Öde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BAŞARILI ÖDEME / TAHSİLAT MAKBUZU
         ========================================================================= */}
      {isPaymentSuccessModalOpen && lastPaymentReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleIn text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Ödeme Başarıyla Tamamlandı!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Tahsilat tutarı cari hesabınızdan anında düşüldü ve makbuz oluşturuldu.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Dekont / İşlem No:</span>
                <strong className="text-white font-mono">{lastPaymentReceipt.orderId}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tarih / Saat:</span>
                <span className="text-slate-300 font-mono">{lastPaymentReceipt.date}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Bayi Ünvanı:</span>
                <span className="text-white font-semibold truncate max-w-[200px]">
                  {lastPaymentReceipt.dealerTitle}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Kart Bilgisi:</span>
                <span className="text-slate-300 font-mono">{lastPaymentReceipt.cardMasked}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Provizyon Kodu:</span>
                <span className="text-slate-300 font-mono">{lastPaymentReceipt.authCode}</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800 font-bold">
                <span>Tahsil Edilen Tutar:</span>
                <span className="text-emerald-400 font-mono text-sm">
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
          MODAL: EXCEL'DEN TOPLU SİPARİŞ YÜKLEME
         ========================================================================= */}
      {isExcelImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-scaleIn space-y-4">
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
              aşağıdaki kutuya yapıştırın. Sistem ürünleri otomatik eşleştirerek toptan sepetinize ekleyecektir.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Örnek Format: <code className="text-amber-400 font-mono">8690555123456 [TAB] 24</code>
              </label>
              <textarea
                rows={6}
                value={excelPasteText}
                onChange={(e) => setExcelPasteText(e.target.value)}
                placeholder="8690555123456&#9;24&#10;8690826014521&#9;48&#10;8691234567890&#9;5"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setExcelPasteText('8690555123456\t24\n8690826014521\t48\n8691234567890\t5\n8690637890123\t24');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Örnek Veri Doldur
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
          MODAL: ÇANTA ÖZEL BASKI & 10 ADET SİPARİŞ YAPILANDIRMASI
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
          MODAL: SEPET & CARİ ÖDEME ONFormatı & SÜREÇ TAMAMLAMA
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

// Row Sub-Component for Clean Interaction
interface ProductTableRowProps {
  product: B2BProduct;
  onAddToCart: (product: B2BProduct, quantity: number, packType: 'adet' | 'kutu' | 'koli') => void;
  onOpenCustomPrint?: (product: B2BProduct) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  onAddToCart,
  onOpenCustomPrint,
}) => {
  const [orderQty, setOrderQty] = useState<number>(
    product.supportsCustomPrint || product.category === 'Çanta & Sırt Çantası' ? 10 : product.minOrderQty
  );
  const [packType, setPackType] = useState<'adet' | 'kutu' | 'koli'>('adet');

  const isBagProduct = product.supportsCustomPrint || product.category === 'Çanta & Sırt Çantası';

  return (
    <tr className="hover:bg-slate-800/50 transition-colors">
      <td className="py-2.5 px-3">
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
          />
          {isBagProduct && (
            <span className="absolute -bottom-1 -right-1 p-0.5 rounded bg-red-600 text-white text-[8px] font-bold">
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
      <td className="py-2.5 px-3 text-right font-mono text-slate-400">
        {product.listPrice.toFixed(2)} ₺
      </td>
      <td className="py-2.5 px-3 text-center">
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-600/20 text-red-400 border border-red-500/30 font-mono">
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
        {product.stockStatus === 'in_stock' ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Var ({product.stockQuantity})
          </span>
        ) : product.stockStatus === 'critical' ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
            Kritik ({product.stockQuantity})
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            Tükendi
          </span>
        )}
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
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
              title="Toptan Sepete Ekle"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Ekle</span>
            </button>

            {isBagProduct && onOpenCustomPrint && (
              <button
                onClick={() => onOpenCustomPrint(product)}
                className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                title="Ürüne özel baskı talebiyle yapılandır ve 10 adet ekle"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Özel Baskı</span>
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};
