import React, { useState, useEffect } from 'react';
import {
  Store,
  Package,
  Truck,
  AlertTriangle,
  TrendingUp,
  Search,
  Plus,
  Edit3,
  Check,
  X,
  ExternalLink,
  Printer,
  Barcode,
  Home,
  User,
  Phone,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  DollarSign,
  Download,
  Filter,
  FileText,
  FileCheck2,
  Gauge,
  HardDrive,
  Clock,
  Send,
  UploadCloud,
  Eye,
  CheckCircle2,
  Share2,
  Copy,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { ProductCatalogRow, ShipmentOrder, PrintJobOrder, MainCategory } from '../types/architecture';
import { METE_CATEGORIES } from '../data/stationeryData';

interface SellerPartnerDashboardProps {
  products: ProductCatalogRow[];
  onUpdateProduct: (updated: ProductCatalogRow) => void;
  onAddProduct: (newProduct: ProductCatalogRow) => void;
  onCloseDashboard: () => void;
  printJobs?: PrintJobOrder[];
  onUpdatePrintJob?: (job: PrintJobOrder) => void;
  onAddPrintJob?: (job: PrintJobOrder) => void;
}

export const SellerPartnerDashboard: React.FC<SellerPartnerDashboardProps> = ({
  products,
  onUpdateProduct,
  onAddProduct,
  onCloseDashboard,
  printJobs: initialPrintJobs,
  onUpdatePrintJob,
  onAddPrintJob,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'photocopy' | 'shipping' | 'add_product'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [onlyCriticalStock, setOnlyCriticalStock] = useState(false);

  // Edit stock inline
  const [editingBarcode, setEditingBarcode] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // =========================================================
  // 1. FOTOKOPİ & BASKI SİSTEMİ YÖNETİMİ
  // =========================================================
  const defaultJobs: PrintJobOrder[] = [
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
  ];

  const [printOrders, setPrintOrders] = useState<PrintJobOrder[]>(
    initialPrintJobs && initialPrintJobs.length > 0 ? initialPrintJobs : defaultJobs
  );

  useEffect(() => {
    if (initialPrintJobs && initialPrintJobs.length > 0) {
      setPrintOrders(initialPrintJobs);
    }
  }, [initialPrintJobs]);

  const [printFilter, setPrintFilter] = useState<'all' | 'customer' | 'waiting' | 'printing' | 'ready' | 'home'>('all');

  // Doküman Çıktı İstasyonu State'leri
  const [selectedJobForOutput, setSelectedJobForOutput] = useState<PrintJobOrder | null>(null);
  const [isPrintingSimulated, setIsPrintingSimulated] = useState<boolean>(false);
  const [printProgress, setPrintProgress] = useState<number>(0);
  const [printStageMessage, setPrintStageMessage] = useState<string>('');
  const [activePreviewPage, setActivePreviewPage] = useState<'cover' | 'content1' | 'content2' | 'routing_slip'>('cover');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Fotokopi Birim Fiyatları & Sarf Malzeme Takibi (Satıcı tarafından yönetilebilir)
  const [bwPrice, setBwPrice] = useState<number>(0.75);
  const [colorPrice, setColorPrice] = useState<number>(2.5);
  const [spiralCost, setSpiralCost] = useState<number>(25.0);
  const [hardcoverCost, setHardcoverCost] = useState<number>(95.0);

  // Makine Sağlık & Sarf Malzeme Durumu
  const [paperReamsStock, setPaperReamsStock] = useState<number>(48);
  const [blackToner, setBlackToner] = useState<number>(86);
  const [colorToner, setColorToner] = useState<number>(74);

  // Satıcı Hızlı Baskı & Evime Gönderim Formu State'leri
  const [sellerDocName, setSellerDocName] = useState<string>('Ev_Adresi_Ozel_Dokuman_Ciktisi.pdf');
  const [sellerPages, setSellerPages] = useState<number>(20);
  const [sellerCopies, setSellerCopies] = useState<number>(1);
  const [sellerColorMode, setSellerColorMode] = useState<'Siyah-Beyaz' | 'Renkli'>('Siyah-Beyaz');
  const [sellerBinding, setSellerBinding] = useState<'Zımbalı' | 'Plastik Spiral' | 'Tel Spiral' | 'Ciltli / Tez Cilt'>('Plastik Spiral');
  const [sellerSendToHome, setSellerSendToHome] = useState<boolean>(true);
  const [sellerPrintNotes, setSellerPrintNotes] = useState<string>('Evde çalışma için numune baskı');

  // Shipments State (Mock orders including "Evime Kargola" orders)
  const [shipments, setShipments] = useState<ShipmentOrder[]>([
    {
      id: 'KRG-92041',
      recipientName: 'Mete Kırtasiye Mağaza Sahibi (Ev Adresi)',
      recipientPhone: '0 (532) 111 22 33',
      recipientAddress: 'Batı Sitesi Mah. 2307 Cad. No: 14/B Yenimahalle / Ankara',
      destinationType: 'home',
      items: [
        {
          title: 'A4 Fotokopi Kağıdı (80 gr 1. Hamur)',
          quantity: 2,
          barcode: '8693456789012',
          price: 120.0,
        },
        {
          title: 'Rotring Tikky 0.7mm Mekanik Kalem Bordo',
          quantity: 1,
          barcode: '8690826014521',
          price: 145.0,
        },
      ],
      status: 'Hazırlanıyor',
      carrier: 'Trendyol Express',
      trackingNumber: 'TYE-84729103',
      createdAt: 'Bugün, 14:15',
      desi: 3,
      notes: 'Kişisel kullanım için ev adresine kargolanacak numune paketi.',
    },
    {
      id: 'KRG-92039',
      recipientName: 'Ayşe Yılmaz (Müşteri)',
      recipientPhone: '0 (505) 444 55 66',
      recipientAddress: 'Atatürk Mah. Lale Sok. No: 8 Sincan / Ankara',
      destinationType: 'customer',
      items: [
        {
          title: 'Okul Defteri (A4 80 Yaprak Kareli)',
          quantity: 5,
          barcode: '8697412589632',
          price: 45.0,
        },
      ],
      status: 'Kargoya Verildi',
      carrier: 'Yurtiçi Kargo',
      trackingNumber: 'YK-601928374',
      createdAt: 'Dün, 17:30',
      desi: 2,
    },
  ]);

  // "Evime / Adrese Kargola" Modal Form State
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [newShipmentRecipient, setNewShipmentRecipient] = useState('Mete Mağaza Yetkilisi (Ev Adresi)');
  const [newShipmentPhone, setNewShipmentPhone] = useState('0 (532) 111 22 33');
  const [newShipmentAddress, setNewShipmentAddress] = useState('Batı Sitesi Mah. 2307 Cad. No: 14/B Yenimahalle / Ankara');
  const [newShipmentType, setNewShipmentType] = useState<'home' | 'customer'>('home');
  const [newShipmentCarrier, setNewShipmentCarrier] = useState<'Trendyol Express' | 'Yurtiçi Kargo' | 'Aras Kargo' | 'PTT Kargo'>('Trendyol Express');
  const [selectedProductToShip, setSelectedProductToShip] = useState<string>(products[0]?.barcode || '');
  const [shipQuantity, setShipQuantity] = useState<number>(1);
  const [shipmentNotes, setShipmentNotes] = useState<string>('Ev adresime acil numune gönderimi');

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newBarcode, setNewBarcode] = useState('');
  const [newCategory, setNewCategory] = useState(METE_CATEGORIES[0].name);
  const [newSubCategory, setNewSubCategory] = useState(METE_CATEGORIES[0].subCategories[0].name);
  const [newBrand, setNewBrand] = useState('Mete');
  const [newPrice, setNewPrice] = useState(95);
  const [newStock, setNewStock] = useState(50);
  const [newVat, setNewVat] = useState(20);

  // Critical stock threshold
  const criticalStockCount = products.filter((p) => p.stock <= 25).length;
  const activePrintingJobsCount = printOrders.filter((j) => j.status !== 'Tamamlandı').length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || p.mainCategory === categoryFilter;
    const matchesCritical = !onlyCriticalStock || p.stock <= 25;

    return matchesSearch && matchesCategory && matchesCritical;
  });

  // Filtered Print Orders
  const filteredPrintOrders = printOrders.filter((job) => {
    if (printFilter === 'waiting') return job.status === 'Kuyrukta (Bekliyor)';
    if (printFilter === 'printing') return job.status === 'Yazdırılıyor 🖨️';
    if (printFilter === 'ready') return job.status === 'Hazır (Teslim Bekliyor)';
    if (printFilter === 'home') return job.deliveryMethod === 'Evime / Adrese Kargo' || job.isOwnerJob;
    return true;
  });

  const handleStartEdit = (p: ProductCatalogRow) => {
    setEditingBarcode(p.barcode);
    setTempStock(p.stock);
    setTempPrice(p.priceWithVat);
  };

  const handleSaveEdit = (p: ProductCatalogRow) => {
    onUpdateProduct({
      ...p,
      stock: Number(tempStock),
      priceWithVat: Number(tempPrice),
    });
    setEditingBarcode(null);
  };

  const handleToggleStatus = (p: ProductCatalogRow) => {
    onUpdateProduct({
      ...p,
      status: p.status === 'Aktif' ? 'Pasif' : 'Aktif',
    });
  };

  const handleQuickStockAdjust = (p: ProductCatalogRow, delta: number) => {
    const nextStock = Math.max(0, p.stock + delta);
    onUpdateProduct({
      ...p,
      stock: nextStock,
    });
  };

  // Fotokopi Durumunu Güncelleme
  const handleUpdateJobStatus = (jobId: string, newStatus: PrintJobOrder['status']) => {
    const updated = printOrders.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j));
    setPrintOrders(updated);
    const target = updated.find((j) => j.id === jobId);
    if (target && onUpdatePrintJob) {
      onUpdatePrintJob(target);
    }
    if (selectedJobForOutput && selectedJobForOutput.id === jobId) {
      setSelectedJobForOutput({ ...selectedJobForOutput, status: newStatus });
    }
  };

  // Müşteri Dokümanının Makineden Çıktısını Verme (Fiziksel Baskı Döngüsü)
  const handleProducePrintOutput = (job: PrintJobOrder) => {
    setIsPrintingSimulated(true);
    setPrintProgress(15);
    setPrintStageMessage(`Canon C5535i: "${job.fileName}" makine kuyruğuna gönderildi...`);

    setTimeout(() => {
      setPrintProgress(45);
      setPrintStageMessage(
        `Lazer Ünitesi: ${job.pageCount} sayfa × ${job.copies} kopya (${job.colorMode}, ${job.sided}) basılıyor...`
      );
      // Makine toner tüketim simülasyonu
      if (job.colorMode === 'Renkli') {
        setColorToner((prev) => Math.max(10, prev - 1));
      } else {
        setBlackToner((prev) => Math.max(10, prev - 1));
      }
    }, 800);

    setTimeout(() => {
      setPrintProgress(80);
      setPrintStageMessage(
        job.binding !== 'Zımbalı'
          ? `Mekanik Son İşlem: ${job.binding} ciltleme ünitesinde tamamlanıyor...`
          : 'Mekanik Son İşlem: Köşe zımbalama ve katlama yapılıyor...'
      );
    }, 1700);

    setTimeout(() => {
      setPrintProgress(100);
      setPrintStageMessage('Tamamlandı! Müşteri çıktısı fiziksel olarak makineden alındı ve etiketlendi.');
      setIsPrintingSimulated(false);

      handleUpdateJobStatus(job.id, 'Hazır (Teslim Bekliyor)');

      // Kağıt stoğundan düşme
      const usedSheets = Math.max(1, Math.ceil((job.pageCount * job.copies) / 500));
      setPaperReamsStock((prev) => Math.max(1, prev - usedSheets));

      setNotificationToast(
        `✅ "${job.customerName}" adına kayıtlı "${job.fileName}" çıktısı başarıyla üretildi ve teslim masasına alındı!`
      );
      setTimeout(() => setNotificationToast(null), 5000);
    }, 2500);
  };

  // Müşteriye SMS / WhatsApp Bildirimi
  const handleSendReadyNotification = (job: PrintJobOrder) => {
    setNotificationToast(
      `📲 Sayın ${job.customerName} (${job.phone}) müşterisine: "Mete Kırtasiye'den verdiğiniz #${job.id} nolu baskınız hazır! Teslim alabilirsiniz." SMS ve WhatsApp bildirimi iletildi.`
    );
    setTimeout(() => setNotificationToast(null), 6000);
  };

  // Fotokopi İşini Doğrudan Evime Kargolama
  const handleShipPrintJobToHome = (job: PrintJobOrder) => {
    const newOrder: ShipmentOrder = {
      id: `KRG-${Math.floor(10000 + Math.random() * 90000)}`,
      recipientName: job.customerName.includes('Mete')
        ? 'Mete Kırtasiye Sahibi (Ev Adresi)'
        : job.customerName,
      recipientPhone: job.phone,
      recipientAddress:
        job.shippingAddress || 'Batı Sitesi Mah. 2307 Cad. No: 14/B Yenimahalle / Ankara',
      destinationType: job.isOwnerJob ? 'home' : 'customer',
      items: [
        {
          title: `Fotokopi/Baskı: ${job.fileName} (${job.pageCount} Sayfa, ${job.binding})`,
          quantity: job.copies,
          barcode: `869-PRN-${job.id.replace('BSK-', '')}`,
          price: job.totalPrice,
        },
      ],
      status: 'Hazırlanıyor',
      carrier: 'Trendyol Express',
      trackingNumber: `TY-PRN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: 'Az önce',
      desi: 1,
      notes: `Baskı iş emri #${job.id} kargoya aktarıldı.`,
    };

    setShipments([newOrder, ...shipments]);
    handleUpdateJobStatus(job.id, 'Kargoya Verildi');
    alert(`Baskı iş emri #${job.id} başarıyla kargoya verildi!\nKargo Kodu: ${newOrder.trackingNumber}\nAdres: ${newOrder.recipientAddress}`);
    setActiveTab('shipping');
  };

  // Satıcının Kendi Evine Hızlı Baskı Emri Oluşturması
  const handleCreateSellerPrintJob = (e: React.FormEvent) => {
    e.preventDefault();

    const unitPrice = sellerColorMode === 'Siyah-Beyaz' ? bwPrice : colorPrice;
    const bindPrice =
      sellerBinding === 'Zımbalı'
        ? 0
        : sellerBinding === 'Plastik Spiral'
        ? spiralCost
        : sellerBinding === 'Tel Spiral'
        ? spiralCost + 10
        : hardcoverCost;

    const calcTotal = (sellerPages * unitPrice + bindPrice) * sellerCopies;

    const newJob: PrintJobOrder = {
      id: `BSK-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: sellerSendToHome
        ? 'Mete Mağaza Yetkilisi (Ev Adresi)'
        : 'Mete Kırtasiye Mağaza İçi',
      phone: '0 (532) 111 22 33',
      fileName: sellerDocName.trim() || 'Dokuman_Ciktisi.pdf',
      fileSize: '4.5 MB',
      pageCount: Number(sellerPages),
      copies: Number(sellerCopies),
      colorMode: sellerColorMode,
      paperSize: 'A4',
      sided: 'Çift Yüz (Arkalı Önlü)',
      binding: sellerBinding,
      notes: sellerPrintNotes,
      deliveryMethod: sellerSendToHome ? 'Evime / Adrese Kargo' : 'Mağazadan Teslim',
      shippingAddress: sellerSendToHome
        ? 'Batı Sitesi Mah. 2307 Cad. No: 14/B Yenimahalle / Ankara'
        : undefined,
      totalPrice: Number(calcTotal.toFixed(2)),
      status: 'Kuyrukta (Bekliyor)',
      createdAt: 'Az önce',
      isOwnerJob: sellerSendToHome,
    };

    setPrintOrders([newJob, ...printOrders]);
    if (onAddPrintJob) onAddPrintJob(newJob);

    // Kağıt stoğunu güncelle
    setPaperReamsStock((prev) => Math.max(0, prev - 1));

    alert(`Satıcı Baskı Emri (#${newJob.id}) oluşturuldu ve fotokopi kuyruğuna alındı!\n${sellerSendToHome ? 'Teslimat: Ev adresinize kargolanacak.' : 'Mağazada teslim.'}`);
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();

    const product = products.find((p) => p.barcode === selectedProductToShip);
    if (!product) return;

    if (product.stock < shipQuantity) {
      alert(`Yetersiz stok! Mevcut stok: ${product.stock}`);
      return;
    }

    // Deduct stock from inventory
    onUpdateProduct({
      ...product,
      stock: product.stock - shipQuantity,
    });

    const newOrder: ShipmentOrder = {
      id: `KRG-${Math.floor(10000 + Math.random() * 90000)}`,
      recipientName: newShipmentRecipient,
      recipientPhone: newShipmentPhone,
      recipientAddress: newShipmentAddress,
      destinationType: newShipmentType,
      items: [
        {
          title: product.title,
          quantity: shipQuantity,
          barcode: product.barcode,
          price: product.priceWithVat,
        },
      ],
      status: 'Hazırlanıyor',
      carrier: newShipmentCarrier,
      trackingNumber: `TY-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: 'Az önce',
      desi: 2,
      notes: shipmentNotes,
    };

    setShipments([newOrder, ...shipments]);
    setShowShipmentModal(false);
    setActiveTab('shipping');
  };

  const handleAddNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBarcode.trim()) {
      alert('Lütfen ürün adı ve barkodunu eksiksiz doldurun.');
      return;
    }

    const newRow: ProductCatalogRow = {
      barcode: newBarcode.trim(),
      sku: `METE-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle.trim(),
      mainCategory: newCategory,
      subCategory: newSubCategory,
      subCategoryLevel3: 'Standart',
      brand: newBrand,
      priceWithVat: Number(newPrice),
      vatRate: Number(newVat),
      stock: Number(newStock),
      currency: 'TRY',
      imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80',
      status: 'Aktif',
      tags: `${newTitle.toLowerCase()}, ${newBrand.toLowerCase()}`,
      unit: 'Adet',
    };

    onAddProduct(newRow);
    setNewTitle('');
    setNewBarcode('');
    setActiveTab('inventory');
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-100 flex flex-col font-sans selection:bg-[#f43f2d] selection:text-white">
      {/* 1. TRENDYOL PARTNER STİLİ ÜST BAR */}
      <header className="bg-[#181a20] border-b border-[#282b35] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f43f2d] text-white flex items-center justify-center font-black text-xl shadow-md">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight font-heading">
                  Mete Kırtasiye Partner
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Satıcı Portalı
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Mağaza Kodu: #METE-TR-06 · Mağaza Puanı: <strong className="text-amber-400">9.8 ⭐</strong>
              </div>
            </div>
          </div>

          {/* Sağ Eylemler: Müşteri Görünümüne Dön & Kargo Butonu */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowShipmentModal(true)}
              className="bg-[#f43f2d] hover:bg-[#d93424] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Evime / Adrese Kargola</span>
            </button>

            <button
              onClick={onCloseDashboard}
              className="bg-[#242731] hover:bg-[#2e323e] text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Müşteri Görünümüne Dön"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mağazayı Gör (Müşteri Modu)</span>
            </button>
          </div>
        </div>

        {/* Satıcı Sekme Çubuğu - FOTOKOPİ SİSTEMİ EKLENDİ */}
        <div className="border-t border-[#232630] bg-[#14161b] px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 cursor-pointer transition-colors shrink-0 ${
                activeTab === 'inventory'
                  ? 'border-[#f43f2d] text-[#f43f2d]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Ürün & Stok Yönetimi ({products.length})</span>
            </button>

            {/* YENİ FOTOKOPİ & BASKI SİSTEMİ SEKME BUTONU */}
            <button
              onClick={() => setActiveTab('photocopy')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 cursor-pointer transition-colors shrink-0 ${
                activeTab === 'photocopy'
                  ? 'border-[#f43f2d] text-[#f43f2d]'
                  : 'border-transparent text-amber-400 hover:text-amber-300'
              }`}
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Fotokopi & Baskı Sistemi ({printOrders.length})</span>
              {activePrintingJobsCount > 0 && (
                <span className="bg-[#f43f2d] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {activePrintingJobsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 cursor-pointer transition-colors shrink-0 ${
                activeTab === 'shipping'
                  ? 'border-[#f43f2d] text-[#f43f2d]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Kargo & Evime Gönderim ({shipments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('add_product')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 cursor-pointer transition-colors shrink-0 ${
                activeTab === 'add_product'
                  ? 'border-[#f43f2d] text-[#f43f2d]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Hızlı Yeni Ürün Ekle</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. TRENDYOL PARTNER KPI ÖZET KARTLARI (FOTOKOPİ DAHİL) */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#181a20] p-4 rounded-2xl border border-[#282b35] shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Toplam Envanter Ürünleri</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{products.length} Çeşit</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <span>● {products.filter((p) => p.status === 'Aktif').length} Ürün Satışta</span>
            </div>
          </div>

          {/* FOTOKOPİ & DİJİTAL BASKI KPI KARTI */}
          <div
            onClick={() => setActiveTab('photocopy')}
            className="bg-[#181a20] p-4 rounded-2xl border border-amber-500/30 shadow-sm cursor-pointer hover:border-amber-400 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Fotokopi & Baskı Kuyruğu</span>
              <Printer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{activePrintingJobsCount} Aktif İş</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Toner: %{blackToner} · Kağıt: {paperReamsStock} Koli</span>
            </div>
          </div>

          <div className="bg-[#181a20] p-4 rounded-2xl border border-[#282b35] shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Evime / Adrese Kargolanan</span>
              <Home className="w-4 h-4 text-[#f43f2d]" />
            </div>
            <div className="text-2xl font-black text-white">
              {shipments.filter((s) => s.destinationType === 'home').length} Paket
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Satıcının şahsi ev teslimatları
            </div>
          </div>

          <div className="bg-[#181a20] p-4 rounded-2xl border border-[#282b35] shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Kritik Stok Uyarısı (&lt; 25 Adet)</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-[#f43f2d]">{criticalStockCount} Ürün</div>
            <div className="text-[11px] text-rose-400 mt-1">
              Acil tedarikçiden sipariş açılmalı
            </div>
          </div>
        </div>

        {/* =========================================================
            3. SEKME: FOTOKOPİ & BASKI SİSTEMİ YÖNETİM MERKEZİ
        ========================================================= */}
        {activeTab === 'photocopy' && (
          <div className="space-y-6">
            {/* Üst Banner & Özet */}
            <div className="bg-[#181a20] p-5 rounded-2xl border border-[#282b35] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-heading">
                    Fotokopi & Dijital Baskı Operasyon Masası
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Sadece Satıcı Ekranı
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Müşterilerden gelen tez/doküman siparişlerini yazdırın, sayfa birim fiyatlarını yönetin ve doğrudan kendi ev adresinize kargo emri verin.
                </p>
              </div>

              {/* Makine Sağlık & Sarf Malzeme Göstergesi */}
              <div className="flex items-center gap-4 bg-[#121418] p-3 rounded-xl border border-[#282b35] text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Siyah Toner</div>
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5" /> %{blackToner}
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-800"></div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Renkli Toner</div>
                  <div className="font-bold text-blue-400 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5" /> %{colorToner}
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-800"></div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">A4 Kağıt Stoğu</div>
                  <div className="font-bold text-white flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-amber-400" /> {paperReamsStock} Koli
                  </div>
                </div>
              </div>
            </div>

            {/* İki Kolonlu Yapı: Sol Taraf İş Emri Masası / Sağ Taraf Hızlı Evime Baskı & Fiyat Ayarları */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* SOL (2 Kolon): Gelen Baskı & Fotokopi İş Emirleri */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-[#181a20] rounded-2xl border border-[#282b35] p-4 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#282b35]">
                    <div className="flex items-center gap-2">
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-white text-xs">
                        Baskı İş Emirleri Kuyruğu ({printOrders.length})
                      </span>
                    </div>

                    {/* Filtre Butonları */}
                    <div className="flex flex-wrap items-center gap-1 text-[11px]">
                      <button
                        onClick={() => setPrintFilter('all')}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                          printFilter === 'all'
                            ? 'bg-[#f43f2d] text-white'
                            : 'bg-[#14161b] text-slate-400 hover:text-white'
                        }`}
                      >
                        Tümü ({printOrders.length})
                      </button>
                      <button
                        onClick={() => setPrintFilter('customer')}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                          printFilter === 'customer'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#14161b] text-blue-400 hover:text-white'
                        }`}
                      >
                        🔔 Müşteri Siparişleri ({printOrders.filter((j) => !j.isOwnerJob).length})
                      </button>
                      <button
                        onClick={() => setPrintFilter('waiting')}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                          printFilter === 'waiting'
                            ? 'bg-amber-600 text-white'
                            : 'bg-[#14161b] text-slate-400 hover:text-white'
                        }`}
                      >
                        ⏳ Bekleyen ({printOrders.filter((j) => j.status === 'Kuyrukta (Bekliyor)').length})
                      </button>
                      <button
                        onClick={() => setPrintFilter('printing')}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                          printFilter === 'printing'
                            ? 'bg-[#f43f2d] text-white'
                            : 'bg-[#14161b] text-slate-400 hover:text-white'
                        }`}
                      >
                        🖨️ Yazdırılıyor ({printOrders.filter((j) => j.status === 'Yazdırılıyor 🖨️').length})
                      </button>
                      <button
                        onClick={() => setPrintFilter('ready')}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                          printFilter === 'ready'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#14161b] text-slate-400 hover:text-white'
                        }`}
                      >
                        ✅ Hazır ({printOrders.filter((j) => j.status === 'Hazır (Teslim Bekliyor)').length})
                      </button>
                      <button
                        onClick={() => setPrintFilter('home')}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                          printFilter === 'home'
                            ? 'bg-purple-600 text-white'
                            : 'bg-[#14161b] text-slate-400 hover:text-white'
                        }`}
                      >
                        🏠 Evime Kargo ({printOrders.filter((j) => j.deliveryMethod === 'Evime / Adrese Kargo' || j.isOwnerJob).length})
                      </button>
                    </div>
                  </div>

                  {/* İş Emirleri Kart Listesi */}
                  <div className="divide-y divide-[#232630] mt-2">
                    {filteredPrintOrders.map((job) => (
                      <div key={job.id} className="py-4 space-y-3 first:pt-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                              {job.id}
                            </span>
                            <span className="font-bold text-white text-xs">{job.customerName}</span>
                            {job.isOwnerJob ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                🏠 Satıcı Şahsi İşi
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                🔔 Müşteri Çevrimiçi Siparişi
                              </span>
                            )}
                            {job.phone && (
                              <span className="text-[11px] font-mono text-slate-400">
                                ({job.phone})
                              </span>
                            )}
                          </div>

                          {/* Durum Seçici */}
                          <div className="flex items-center gap-2">
                            <select
                              value={job.status}
                              onChange={(e) =>
                                handleUpdateJobStatus(job.id, e.target.value as PrintJobOrder['status'])
                              }
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-xl outline-none border cursor-pointer ${
                                job.status === 'Yazdırılıyor 🖨️'
                                  ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                                  : job.status === 'Hazır (Teslim Bekliyor)'
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                                  : job.status === 'Kargoya Verildi'
                                  ? 'bg-purple-950/60 text-purple-300 border-purple-800/40'
                                  : 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                              }`}
                            >
                              <option value="Kuyrukta (Bekliyor)">Kuyrukta (Bekliyor)</option>
                              <option value="Yazdırılıyor 🖨️">Yazdırılıyor 🖨️</option>
                              <option value="Ciltleniyor">Ciltleniyor</option>
                              <option value="Hazır (Teslim Bekliyor)">Hazır (Teslim Bekliyor)</option>
                              <option value="Kargoya Verildi">Kargoya Verildi</option>
                              <option value="Tamamlandı">Tamamlandı</option>
                            </select>
                          </div>
                        </div>

                        {/* Dosya & Baskı Parametreleri */}
                        <div className="bg-[#121418] p-3 rounded-xl border border-[#282b35] text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-slate-200 font-bold truncate max-w-sm">
                              <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                              <span className="text-amber-300">{job.fileName}</span>
                            </div>
                            <span className="font-mono text-emerald-400 font-bold">
                              {job.totalPrice.toFixed(2)} TL
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                            <span>📄 {job.pageCount} Sayfa ({job.copies} Kopya)</span>
                            <span>•</span>
                            <span className={job.colorMode === 'Renkli' ? 'text-blue-400 font-semibold' : ''}>
                              🎨 {job.colorMode}
                            </span>
                            <span>•</span>
                            <span>📐 {job.sided}</span>
                            <span>•</span>
                            <span className="text-amber-300 font-medium">📚 {job.binding}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-medium">🚚 {job.deliveryMethod}</span>
                          </div>

                          {job.notes && (
                            <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/50">
                              Müşteri Notu: "{job.notes}"
                            </div>
                          )}

                          {job.shippingAddress && (
                            <div className="text-[11px] text-amber-300/90 flex items-start gap-1 pt-1 border-t border-slate-800/50">
                              <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                              <span>Teslimat Adresi: {job.shippingAddress}</span>
                            </div>
                          )}
                        </div>

                        {/* Aksiyon Butonları: Doğrudan Müşteri Dosyası Çıktısı */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{job.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {/* MÜŞTERİ DOSYASININ ÇIKTISINI VER BUTONU */}
                            <button
                              onClick={() => {
                                setSelectedJobForOutput(job);
                                setActivePreviewPage('cover');
                              }}
                              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs shadow-md cursor-pointer active:scale-95"
                              title="Müşterinin gönderdiği dokümanın çıktısını al"
                            >
                              <Printer className="w-4 h-4 text-slate-950" />
                              <span>Müşteri Çıktısını Ver</span>
                            </button>

                            {/* Dokümanı Önizle / Gör */}
                            <button
                              onClick={() => {
                                setSelectedJobForOutput(job);
                                setActivePreviewPage('content1');
                              }}
                              className="bg-[#242731] hover:bg-[#2e323e] text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 font-bold cursor-pointer text-xs"
                              title="Müşteri dokümanını oku ve incele"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-400" />
                              <span>Dosyayı Gör</span>
                            </button>

                            {/* Evime / Adrese Kargola Butonu */}
                            <button
                              onClick={() => handleShipPrintJobToHome(job)}
                              className="bg-[#f43f2d] hover:bg-[#d93424] text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold cursor-pointer text-xs shadow-xs"
                            >
                              <Home className="w-3.5 h-3.5" />
                              <span>Kargola</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SAĞ (1 Kolon): Satıcı İçin "Evime Çıktı Al & Kargola" ve Fiyat Yönetimi */}
              <div className="space-y-6">
                {/* 1. KENDİ EVİME ÇIKTI AL & KARGOLA FORMU */}
                <div className="bg-[#181a20] rounded-2xl border border-[#282b35] p-5 shadow-md">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#282b35] mb-4">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">
                        Evime Fotokopi / Doküman Çıktısı Al
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Şahsi dokümanlarınızı mağaza makinesinden bastırıp doğrudan evinize kargolayın.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleCreateSellerPrintJob} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">
                        Yazdırılacak Doküman Adı
                      </label>
                      <input
                        type="text"
                        required
                        value={sellerDocName}
                        onChange={(e) => setSellerDocName(e.target.value)}
                        className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Sayfa Sayısı</label>
                        <input
                          type="number"
                          min={1}
                          max={1000}
                          value={sellerPages}
                          onChange={(e) => setSellerPages(Number(e.target.value))}
                          className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Kopya</label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={sellerCopies}
                          onChange={(e) => setSellerCopies(Number(e.target.value))}
                          className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Renk</label>
                        <select
                          value={sellerColorMode}
                          onChange={(e) => setSellerColorMode(e.target.value as any)}
                          className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-2.5 py-2 text-white outline-none"
                        >
                          <option value="Siyah-Beyaz">Siyah-Beyaz</option>
                          <option value="Renkli">Renkli</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Ciltleme</label>
                        <select
                          value={sellerBinding}
                          onChange={(e) => setSellerBinding(e.target.value as any)}
                          className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-2.5 py-2 text-white outline-none"
                        >
                          <option value="Zımbalı">Zımbalı</option>
                          <option value="Plastik Spiral">Plastik Spiral</option>
                          <option value="Tel Spiral">Tel Spiral</option>
                          <option value="Ciltli / Tez Cilt">Tez Ciltli</option>
                        </select>
                      </div>
                    </div>

                    {/* Evime Gönder Onay Kutusu */}
                    <div className="p-3 bg-[#121418] rounded-xl border border-amber-500/20 flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="sellerHomeCheck"
                        checked={sellerSendToHome}
                        onChange={(e) => setSellerSendToHome(e.target.checked)}
                        className="mt-0.5 accent-[#f43f2d] cursor-pointer"
                      />
                      <label htmlFor="sellerHomeCheck" className="cursor-pointer text-[11px] text-slate-300">
                        <strong className="text-white block">🏠 Kendi Ev Adresime Kargola</strong>
                        Batı Sitesi Mah. 2307 Cad. Yenimahalle / Ankara adresine kargo etiketi oluşturulur.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Baskı Emri Ver & Evime Gönder</span>
                    </button>
                  </form>
                </div>

                {/* 2. BASKI & FOTOKOPİ BİRİM FİYAT DÜZENLEME PANELİ */}
                <div className="bg-[#181a20] rounded-2xl border border-[#282b35] p-5 shadow-md">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#282b35] mb-4">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">
                        Fotokopi Birim Fiyat Ayarları
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Müşterinin vitrinde gördüğü sayfa başı baskı tarifesini belirleyin.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Siyah-Beyaz Sayfa:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.05"
                          value={bwPrice}
                          onChange={(e) => setBwPrice(Number(e.target.value))}
                          className="w-16 bg-[#121418] border border-[#2d313d] rounded-lg px-2 py-1 text-center font-bold text-white outline-none focus:border-blue-400"
                        />
                        <span className="text-slate-400">TL</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Renkli Sayfa:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.10"
                          value={colorPrice}
                          onChange={(e) => setColorPrice(Number(e.target.value))}
                          className="w-16 bg-[#121418] border border-[#2d313d] rounded-lg px-2 py-1 text-center font-bold text-white outline-none focus:border-blue-400"
                        />
                        <span className="text-slate-400">TL</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Spiral Ciltleme:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={spiralCost}
                          onChange={(e) => setSpiralCost(Number(e.target.value))}
                          className="w-16 bg-[#121418] border border-[#2d313d] rounded-lg px-2 py-1 text-center font-bold text-white outline-none focus:border-blue-400"
                        />
                        <span className="text-slate-400">TL</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Sert Tez Ciltleme:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={hardcoverCost}
                          onChange={(e) => setHardcoverCost(Number(e.target.value))}
                          className="w-16 bg-[#121418] border border-[#2d313d] rounded-lg px-2 py-1 text-center font-bold text-white outline-none focus:border-blue-400"
                        />
                        <span className="text-slate-400">TL</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert('Fotokopi ve ciltleme fiyat tarifesi mağazada güncellendi!')}
                      className="w-full bg-[#242731] hover:bg-[#2e323e] text-slate-200 font-bold py-2 rounded-xl border border-slate-700 transition-colors mt-2 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Fiyat Tarifesini Kaydet</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            4. SEKME 1: ÜRÜN & STOK YÖNETİMİ TABLOSU
        ========================================================= */}
        {activeTab === 'inventory' && (
          <div className="bg-[#181a20] rounded-2xl border border-[#282b35] p-5 shadow-lg space-y-4">
            {/* Arama & Filtre Çubuğu */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#282b35]">
              <div className="flex flex-1 items-center gap-2 max-w-md">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Barkod, ürün adı veya SKU ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#f43f2d]"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Kritik Stok Butonu */}
                <button
                  onClick={() => setOnlyCriticalStock(!onlyCriticalStock)}
                  className={`px-3 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    onlyCriticalStock
                      ? 'bg-[#f43f2d] text-white'
                      : 'bg-[#22252e] hover:bg-[#2c303c] text-slate-300 border border-[#2d313d]'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Kritik Stoktakiler ({criticalStockCount})</span>
                </button>

                {/* Kategori Seçici */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-[#f43f2d]"
                >
                  <option value="all">Tüm Kategoriler</option>
                  {METE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowShipmentModal(true)}
                  className="bg-[#242731] hover:bg-[#2e323e] text-slate-200 px-3 py-2 rounded-xl border border-slate-700 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-[#f43f2d]" />
                  <span>Seçili Ürünü Evime Kargola</span>
                </button>
              </div>
            </div>

            {/* Ürün & Stok Tablosu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#14161b] text-slate-400 font-bold border-b border-[#282b35]">
                    <th className="p-3">Görsel & Ürün Adı</th>
                    <th className="p-3">Barkod / SKU</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-center">Fiyat (KDV Dahil)</th>
                    <th className="p-3 text-center">Anlık Stok</th>
                    <th className="p-3 text-center">Hızlı Stok Düzenleme</th>
                    <th className="p-3 text-center">Satış Durumu</th>
                    <th className="p-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232630]">
                  {filteredProducts.map((p) => {
                    const isCritical = p.stock <= 25;
                    const isEditing = editingBarcode === p.barcode;

                    return (
                      <tr key={p.barcode} className="hover:bg-[#1c1f26] transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg border border-[#2d313d] shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white line-clamp-1">{p.title}</div>
                              <div className="text-[10px] text-slate-400">{p.brand}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 font-mono text-[11px] text-slate-300">
                          <div>{p.barcode}</div>
                          <div className="text-slate-500">{p.sku}</div>
                        </td>

                        <td className="p-3 text-slate-300">
                          <span className="line-clamp-1">{p.mainCategory}</span>
                        </td>

                        {/* Fiyat Sütunu */}
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(Number(e.target.value))}
                              className="w-20 bg-[#121418] border border-[#f43f2d] rounded-lg px-2 py-1 text-center font-bold text-white outline-none"
                            />
                          ) : (
                            <span className="font-black text-sm text-[#f43f2d]">
                              {p.priceWithVat.toFixed(0)} TL
                            </span>
                          )}
                        </td>

                        {/* Anlık Stok */}
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={tempStock}
                              onChange={(e) => setTempStock(Number(e.target.value))}
                              className="w-16 bg-[#121418] border border-[#f43f2d] rounded-lg px-2 py-1 text-center font-bold text-white outline-none"
                            />
                          ) : (
                            <span
                              className={`font-black text-xs px-2.5 py-1 rounded-full ${
                                isCritical
                                  ? 'bg-rose-950/70 text-[#f43f2d] border border-rose-800/40'
                                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/30'
                              }`}
                            >
                              {p.stock} {p.unit}
                            </span>
                          )}
                        </td>

                        {/* Hızlı Stok +/- Butonları */}
                        <td className="p-3 text-center">
                          <div className="inline-flex items-center gap-1 bg-[#121418] p-1 rounded-xl border border-[#282b35]">
                            <button
                              onClick={() => handleQuickStockAdjust(p, -5)}
                              className="w-6 h-6 rounded-lg bg-[#22252e] hover:bg-[#f43f2d] hover:text-white text-slate-300 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                              title="5 Azalt"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjust(p, -1)}
                              className="w-6 h-6 rounded-lg bg-[#22252e] hover:bg-[#f43f2d] hover:text-white text-slate-300 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                              title="1 Azalt"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjust(p, 1)}
                              className="w-6 h-6 rounded-lg bg-[#22252e] hover:bg-emerald-600 hover:text-white text-slate-300 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                              title="1 Arttır"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjust(p, 10)}
                              className="w-6 h-6 rounded-lg bg-[#22252e] hover:bg-emerald-600 hover:text-white text-slate-300 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                              title="10 Ekle"
                            >
                              +10
                            </button>
                          </div>
                        </td>

                        {/* Satış Durumu (Aktif/Pasif) */}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleStatus(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                              p.status === 'Aktif'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {p.status === 'Aktif' ? 'Satışta' : 'Kapalı'}
                          </button>
                        </td>

                        {/* İşlemler */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveEdit(p)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                title="Kaydet"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="bg-[#242731] hover:bg-[#2e323e] text-slate-300 p-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                                title="Fiyat ve Stok Düzenle"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedProductToShip(p.barcode);
                                setShowShipmentModal(true);
                              }}
                              className="bg-[#f43f2d]/20 hover:bg-[#f43f2d] text-[#f43f2d] hover:text-white p-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                              title="Bu Ürünü Evime Kargola"
                            >
                              <Truck className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-[#282b35]">
              <span>Toplam {filteredProducts.length} adet ürün listelendi.</span>
              <span>Değişiklikler mağazada (müşteri görünümünde) anında aktif olur.</span>
            </div>
          </div>
        )}

        {/* =========================================================
            5. SEKME 2: KARGO & EVİME GÖNDERİM MODÜLÜ
        ========================================================= */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181a20] p-5 rounded-2xl border border-[#282b35]">
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Kargo & Teslimat Yönetim Merkezi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Satıcının kendi evine göndereceği şahsi numuneler, fotokopi çıktıları ve müşterilere gidecek paketlerin barkod takibi.
                </p>
              </div>

              <button
                onClick={() => setShowShipmentModal(true)}
                className="bg-[#f43f2d] hover:bg-[#d93424] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Kargo & Evime Gönderim Emri Ver</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shipments.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#181a20] rounded-2xl border border-[#282b35] p-5 space-y-4 hover:border-slate-600 transition-all shadow-md"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#282b35]">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#242731] text-[#f43f2d]">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-xs text-white">{order.id}</span>
                        <div className="text-[10px] text-slate-400">{order.createdAt}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.destinationType === 'home' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          🏠 Kendi Evime Kargo
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          👤 Müşteri Siparişi
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Alıcı & Adres Bilgisi */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.recipientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.recipientPhone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-300 text-[11px] leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{order.recipientAddress}</span>
                    </div>
                  </div>

                  {/* Kargo İçeriği */}
                  <div className="bg-[#121418] p-3 rounded-xl border border-[#282b35] space-y-1 text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Paket İçeriği</div>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-200">
                        <span className="truncate max-w-[240px]">{item.title}</span>
                        <span className="font-bold text-white font-mono">{item.quantity} Adet</span>
                      </div>
                    ))}
                  </div>

                  {/* Kargo Takip & Barkod Kartı */}
                  <div className="pt-3 border-t border-[#282b35] flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">
                        {order.carrier} Takip No
                      </div>
                      <div className="font-mono font-black text-amber-400">
                        {order.trackingNumber}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        alert(
                          `Kargo Barkod Etiketi Hazırlandı!\n\nKargo: ${order.carrier}\nTakip No: ${order.trackingNumber}\nAlıcı: ${order.recipientName}\nAdres: ${order.recipientAddress}\n\nYazıcıya gönderiliyor...`
                        );
                      }}
                      className="bg-[#242731] hover:bg-[#2e323e] text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
                    >
                      <Barcode className="w-3.5 h-3.5 text-[#f43f2d]" />
                      <span>Kargo Etiketi Yazdır</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            6. SEKME 4: HIZLI YENİ ÜRÜN EKLEME FORMU
        ========================================================= */}
        {activeTab === 'add_product' && (
          <div className="bg-[#181a20] rounded-2xl border border-[#282b35] p-6 max-w-2xl mx-auto shadow-xl">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#282b35] mb-5">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-[#f43f2d]">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Envantere Yeni Ürün Ekle
                </h3>
                <p className="text-xs text-slate-400">
                  Eklenen ürün anında müşteri mağazasında ve arama sonuçlarında listelenir.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddNewProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Ürün Tam Adı <span className="text-[#f43f2d]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Faber-Castell 12'li Kuru Boya Metal Tüp"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#f43f2d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Barkod (EAN-13) <span className="text-[#f43f2d]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="8690000000000"
                    value={newBarcode}
                    onChange={(e) => setNewBarcode(e.target.value)}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2.5 font-mono text-white outline-none focus:border-[#f43f2d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Marka</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Faber-Castell, Gıpta, Rotring"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#f43f2d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Ana Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      setNewCategory(e.target.value);
                      const matched = METE_CATEGORIES.find((c) => c.name === e.target.value);
                      if (matched && matched.subCategories[0]) {
                        setNewSubCategory(matched.subCategories[0].name);
                      }
                    }}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#f43f2d]"
                  >
                    {METE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Alt Kategori</label>
                  <select
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#f43f2d]"
                  >
                    {METE_CATEGORIES.find((c) => c.name === newCategory)?.subCategories.map(
                      (sub) => (
                        <option key={sub.id} value={sub.name}>
                          {sub.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Satış Fiyatı (TL)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2.5 font-bold text-[#f43f2d] outline-none focus:border-[#f43f2d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Başlangıç Stoğu</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#f43f2d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">KDV Oranı (%)</label>
                  <select
                    value={newVat}
                    onChange={(e) => setNewVat(Number(e.target.value))}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#f43f2d]"
                  >
                    <option value={10}>%10 (Kırtasiye)</option>
                    <option value={20}>%20 (Genel Ofis)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#282b35] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className="bg-[#242731] hover:bg-[#2e323e] text-slate-300 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-[#f43f2d] hover:bg-[#d93424] text-white font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Ürünü Kaydet ve Satışa Aç</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 7. "EVİME / ADRESE KARGOLA" SİHİRBAZ MODALI */}
      {showShipmentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#181a20] rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-[#2d313d] shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#282b35] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Kendi Evime / Özel Adrese Kargola
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Depo stokundan doğrudan şahsi adresinize kargo kodu ve etiketi oluşturun.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowShipmentModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-4">
              {/* Gönderim Türü */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewShipmentType('home')}
                  className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                    newShipmentType === 'home'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-[#121418] border-[#282b35] text-slate-400'
                  }`}
                >
                  🏠 Kendi Evime / Şahsıma Gönder
                </button>
                <button
                  type="button"
                  onClick={() => setNewShipmentType('customer')}
                  className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                    newShipmentType === 'customer'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-[#121418] border-[#282b35] text-slate-400'
                  }`}
                >
                  👤 Müşteri / Şube Adresine Gönder
                </button>
              </div>

              {/* Alıcı & Telefon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Alıcı Adı Soyadı
                  </label>
                  <input
                    type="text"
                    required
                    value={newShipmentRecipient}
                    onChange={(e) => setNewShipmentRecipient(e.target.value)}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2 text-white outline-none focus:border-[#f43f2d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    İletişim Telefonu
                  </label>
                  <input
                    type="tel"
                    required
                    value={newShipmentPhone}
                    onChange={(e) => setNewShipmentPhone(e.target.value)}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2 text-white outline-none focus:border-[#f43f2d]"
                  />
                </div>
              </div>

              {/* Teslimat Adresi */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Kargonun Gideceği Ev / Teslimat Adresi
                </label>
                <textarea
                  rows={2}
                  required
                  value={newShipmentAddress}
                  onChange={(e) => setNewShipmentAddress(e.target.value)}
                  className="w-full bg-[#121418] border border-[#2d313d] rounded-xl p-2.5 text-white outline-none focus:border-[#f43f2d]"
                />
              </div>

              {/* Kargolanacak Ürün ve Adet */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-300 block mb-1">
                    Depodan Çıkacak Ürün
                  </label>
                  <select
                    value={selectedProductToShip}
                    onChange={(e) => setSelectedProductToShip(e.target.value)}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2 text-white outline-none focus:border-[#f43f2d]"
                  >
                    {products.map((p) => (
                      <option key={p.barcode} value={p.barcode}>
                        {p.title} (Stok: {p.stock} adet)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Adet</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={shipQuantity}
                    onChange={(e) => setShipQuantity(Number(e.target.value))}
                    className="w-full bg-[#121418] border border-[#2d313d] rounded-xl px-3 py-2 font-bold text-white text-center outline-none focus:border-[#f43f2d]"
                  />
                </div>
              </div>

              {/* Kargo Firması */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Entegre Kargo Firması
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Trendyol Express', 'Yurtiçi Kargo', 'Aras Kargo', 'PTT Kargo'] as const).map(
                    (carrier) => (
                      <button
                        key={carrier}
                        type="button"
                        onClick={() => setNewShipmentCarrier(carrier)}
                        className={`py-2 px-1.5 rounded-xl border text-center font-bold cursor-pointer transition-colors ${
                          newShipmentCarrier === carrier
                            ? 'bg-[#f43f2d] text-white border-[#f43f2d]'
                            : 'bg-[#121418] border-[#282b35] text-slate-400 hover:text-white'
                        }`}
                      >
                        {carrier}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#282b35] flex items-center justify-between">
                <div className="text-[11px] text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Seçilen adet mevcut stoktan anında düşülecektir.</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowShipmentModal(false)}
                    className="px-3.5 py-2 rounded-xl bg-[#242731] hover:bg-[#2e323e] text-slate-300 font-semibold cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="bg-[#f43f2d] hover:bg-[#d93424] text-white font-black px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Kargo Barkodu Oluştur</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. CANLI BİLDİRİM TOASTI */}
      {notificationToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-emerald-950/95 border-2 border-emerald-500 text-emerald-100 p-4 rounded-2xl shadow-2xl animate-bounce flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs font-semibold leading-relaxed">
            {notificationToast}
          </div>
          <button
            onClick={() => setNotificationToast(null)}
            className="text-emerald-300 hover:text-white ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. MÜŞTERİ DOKÜMAN ÇIKTI İSTASYONU (DOCUMENT PRINT & OUTPUT PRODUCTION CENTER) */}
      {selectedJobForOutput && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="max-w-5xl w-full bg-[#16181f] border border-[#2d313d] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            {/* Modal Üst Başlığı */}
            <div className="p-4 sm:p-5 bg-[#1a1d25] border-b border-[#282b35] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black shadow-md">
                  <Printer className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Mete Kırtasiye Baskı Üretim Masası
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="font-mono text-xs text-slate-300 font-bold">
                      İş Emri #{selectedJobForOutput.id}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
                    Müşteri Dokümanı Çıktı & Üretim İstasyonu
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedJobForOutput(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#252834] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Ana Gövde (Sol: Canlı Doküman Kağıdı / Sağ: Donanım & Yazdırma Paneli) */}
            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* SOL SÜTUN (7 Birim): Yazdırılacak Gerçek A4 Doküman Önizleme Masası */}
              <div className="lg:col-span-7 space-y-3">
                {/* Sayfa Geçiş Sekmeleri */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                  <button
                    onClick={() => setActivePreviewPage('cover')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePreviewPage === 'cover'
                        ? 'bg-[#f43f2d] text-white shadow-xs'
                        : 'bg-[#1e2029] text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>1. Resmi Kapak</span>
                  </button>

                  <button
                    onClick={() => setActivePreviewPage('content1')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePreviewPage === 'content1'
                        ? 'bg-[#f43f2d] text-white shadow-xs'
                        : 'bg-[#1e2029] text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>2. Doküman Metni</span>
                  </button>

                  <button
                    onClick={() => setActivePreviewPage('content2')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePreviewPage === 'content2'
                        ? 'bg-[#f43f2d] text-white shadow-xs'
                        : 'bg-[#1e2029] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>3. Tablo & Grafik</span>
                  </button>

                  <button
                    onClick={() => setActivePreviewPage('routing_slip')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePreviewPage === 'routing_slip'
                        ? 'bg-[#f43f2d] text-white shadow-xs'
                        : 'bg-[#1e2029] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Barcode className="w-3.5 h-3.5" />
                    <span>4. Teslim & Kargo Barkodu</span>
                  </button>
                </div>

                {/* Birebir A4 Kağıt Simülasyonu */}
                <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border-2 border-slate-300 p-6 sm:p-8 font-sans select-none relative overflow-hidden min-h-[500px] flex flex-col justify-between">
                  {/* Filigran */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none rotate-[-30deg]">
                    <span className="text-7xl font-black font-heading tracking-widest text-slate-900">
                      METE KIRTASİYE
                    </span>
                  </div>

                  {/* 1. SAYFA: RESMİ İŞ EMRİ VE PROJE/TEZ KAPAĞI */}
                  {activePreviewPage === 'cover' && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Üst Antet */}
                      <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-rose-600">
                            Mete Kırtasiye Yüksek Hızlı Dijital Baskı Merkezi
                          </div>
                          <div className="text-xs text-slate-600 font-serif">
                            Sincan Şube · Tel: 0 (312) 271 22 33 · Ankara
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-xs font-bold text-slate-800">
                            İŞ EMRİ: #{selectedJobForOutput.id}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {selectedJobForOutput.createdAt}
                          </div>
                        </div>
                      </div>

                      {/* Doküman Başlığı */}
                      <div className="text-center py-6 border-b border-slate-200">
                        <div className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">
                          Müşteri Tarafından Yüklenen Belge
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black font-serif text-slate-900 leading-snug">
                          {selectedJobForOutput.fileName.replace(/\.pdf|\.docx|\.doc/gi, '').replace(/_/g, ' ')}
                        </h1>
                        <p className="text-xs text-slate-600 font-serif italic mt-2">
                          Akademik / Çalışma Dokümanı Nüshası
                        </p>
                      </div>

                      {/* Müşteri ve Baskı Bilgileri */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs font-serif">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                          <span className="text-slate-600 font-bold">Müşteri (Sipariş Sahibi):</span>
                          <span className="font-bold text-slate-900 text-sm">
                            {selectedJobForOutput.customerName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                          <span className="text-slate-600">İletişim Telefonu:</span>
                          <span className="font-mono text-slate-800">{selectedJobForOutput.phone}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                          <span className="text-slate-600">Sayfa & Kopya Adedi:</span>
                          <span className="font-bold text-slate-900">
                            {selectedJobForOutput.pageCount} Sayfa × {selectedJobForOutput.copies} Kopya
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                          <span className="text-slate-600">Baskı ve Renk Parametresi:</span>
                          <span className="font-semibold text-slate-900">
                            {selectedJobForOutput.colorMode} · {selectedJobForOutput.sided}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                          <span className="text-slate-600">Ciltleme Türü:</span>
                          <span className="font-bold text-rose-600">{selectedJobForOutput.binding}</span>
                        </div>
                        {selectedJobForOutput.notes && (
                          <div className="pt-1 text-[11px] text-amber-800 italic">
                            Müşterinin Özel Notu: "{selectedJobForOutput.notes}"
                          </div>
                        )}
                      </div>

                      {/* Alt Mühür ve Barkod */}
                      <div className="pt-4 flex items-end justify-between text-[11px] text-slate-500 font-mono">
                        <div className="space-y-1">
                          <div className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300 inline-block font-sans text-[10px]">
                            ✓ METE KIRTASİYE LAZER KALİTE KONTROL ONAYLI
                          </div>
                          <div>Canon imageRUNNER ADVANCE C5535i</div>
                        </div>
                        <div className="text-right">
                          <div className="tracking-widest font-black text-slate-800 text-xs">
                            ||||| | ||||| ||| |||||
                          </div>
                          <div>#{selectedJobForOutput.id}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. SAYFA: DOKÜMAN METNİ VE İÇERİK BÖLÜMÜ */}
                  {activePreviewPage === 'content1' && (
                    <div className="space-y-4 animate-fadeIn font-serif text-slate-800 text-xs leading-relaxed">
                      {/* Üst Bilgi Başlığı */}
                      <div className="border-b border-slate-300 pb-2 flex items-center justify-between text-[10px] text-slate-500 font-sans">
                        <span className="truncate max-w-xs">{selectedJobForOutput.fileName}</span>
                        <span>Sayfa 2 / {selectedJobForOutput.pageCount}</span>
                      </div>

                      <h2 className="text-base font-bold text-slate-900 border-b pb-1 font-sans">
                        BÖLÜM 1: GENEL ESASLAR VE ÇALIŞMA NOTLARI
                      </h2>

                      <p>
                        Bu doküman, <strong>{selectedJobForOutput.customerName}</strong> tarafından Mete Kırtasiye online baskı servisi üzerinden sisteme yüklenmiş olup, 1. hamur 80 gr kağıda 1200 DPI hassasiyetinde lazer ünitemizde basılmaktadır.
                      </p>

                      <div className="p-3 bg-slate-50 border-l-4 border-rose-500 rounded-r-lg space-y-1.5">
                        <div className="font-bold text-slate-900 font-sans text-[11px]">
                          1.1 Temel Yöntem ve Formülasyon Esasları
                        </div>
                        <p className="text-[11px] text-slate-700">
                          Doküman içeriğindeki diyagramlar, formüller ve analitik grafikler yüksek kontrastla rasterize edilmiş; çift yüzlü baskı standartlarına uygun şekilde kenar boşlukları (25 mm cilt payı) otomatik olarak hizalanmıştır.
                        </p>
                      </div>

                      <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px]">
                        <li>Doküman Formatı: Yüksek Çözünürlüklü Vektörel PDF Çıktısı</li>
                        <li>Renk Profili: {selectedJobForOutput.colorMode === 'Renkli' ? 'CMYK Canlı Renk Skalası (2.5 TL/syf)' : 'K-Monokrom Yüksek Kontrast (0.75 TL/syf)'}</li>
                        <li>Cilt Dayanıklılığı: {selectedJobForOutput.binding} ile uzun ömürlü kullanım</li>
                      </ul>

                      <p className="text-slate-600 text-[11px] pt-2">
                        Hazırlanan bu çalışma nüshası, ders notu veya proje teslimi için gereken tüm fiziksel mukavemet şartlarını sağlamaktadır.
                      </p>

                      {/* Sayfa Altı */}
                      <div className="pt-8 text-center text-[10px] text-slate-400 font-sans border-t border-slate-200">
                        Mete Kırtasiye Dijital Çıktı Çözümleri · Sayfa 2
                      </div>
                    </div>
                  )}

                  {/* 3. SAYFA: TABLO VE ANALİTİK VERİ GÖRÜNÜMÜ */}
                  {activePreviewPage === 'content2' && (
                    <div className="space-y-4 animate-fadeIn font-sans text-xs">
                      {/* Üst Bilgi Başlığı */}
                      <div className="border-b border-slate-300 pb-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="truncate max-w-xs">{selectedJobForOutput.fileName}</span>
                        <span>Sayfa 3 / {selectedJobForOutput.pageCount}</span>
                      </div>

                      <h2 className="text-sm font-black text-slate-900 font-heading">
                        BÖLÜM 2: ANALİTİK VERİ TABLOLARI VE METRİKLER
                      </h2>

                      {/* Tablo */}
                      <div className="border border-slate-300 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                            <tr>
                              <th className="p-2">Parametre</th>
                              <th className="p-2">Standart</th>
                              <th className="p-2">Ölçülen Değer</th>
                              <th className="p-2">Durum</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            <tr>
                              <td className="p-2 font-medium">Baskı Çözünürlüğü</td>
                              <td className="p-2">600 DPI</td>
                              <td className="p-2 font-mono font-bold text-blue-600">1200 DPI</td>
                              <td className="p-2 text-emerald-600 font-bold">✓ Mükemmel</td>
                            </tr>
                            <tr>
                              <td className="p-2 font-medium">Kağıt Gramajı</td>
                              <td className="p-2">70 gr</td>
                              <td className="p-2 font-mono font-bold">80 gr 1. Hamur</td>
                              <td className="p-2 text-emerald-600 font-bold">✓ Standart Üstü</td>
                            </tr>
                            <tr>
                              <td className="p-2 font-medium">Ciltleme Kalitesi</td>
                              <td className="p-2">Manuel</td>
                              <td className="p-2 font-mono font-bold">{selectedJobForOutput.binding}</td>
                              <td className="p-2 text-emerald-600 font-bold">✓ Güçlendirilmiş</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="font-bold text-rose-900 text-xs">Müşteri Doğrulama Kodu</div>
                          <div className="text-[10px] text-rose-700 font-mono">
                            VERIFIED-{selectedJobForOutput.id}-{selectedJobForOutput.pageCount}P
                          </div>
                        </div>
                        <div className="w-10 h-10 bg-white border border-rose-300 rounded-lg flex items-center justify-center font-bold text-rose-600">
                          QR
                        </div>
                      </div>

                      {/* Sayfa Altı */}
                      <div className="pt-8 text-center text-[10px] text-slate-400 border-t border-slate-200">
                        Mete Kırtasiye Dijital Çıktı Çözümleri · Sayfa 3
                      </div>
                    </div>
                  )}

                  {/* 4. SAYFA: RESMİ TESLİMAT & KARGO BARKODU FİŞİ */}
                  {activePreviewPage === 'routing_slip' && (
                    <div className="space-y-4 animate-fadeIn font-sans">
                      <div className="border-2 border-dashed border-slate-800 p-5 rounded-2xl bg-amber-50/50 space-y-4">
                        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                          <div>
                            <div className="text-base font-black tracking-tight font-heading">
                              METE KIRTASİYE FOTOKOPİ TESLİM FİŞİ
                            </div>
                            <div className="text-xs text-slate-600">
                              Paket Üstü Yapıştırma & Dağıtım Etiketi
                            </div>
                          </div>
                          <div className="text-right font-mono font-black text-sm">
                            #{selectedJobForOutput.id}
                          </div>
                        </div>

                        {/* Barkod Görsel Çubukları */}
                        <div className="py-2 text-center bg-white p-3 rounded-xl border border-slate-300">
                          <div className="text-2xl font-black font-mono tracking-widest text-slate-900">
                            ||||| ||| ||||||| |||| |||||| ||| |||||
                          </div>
                          <div className="font-mono text-xs text-slate-600 mt-1">
                            *{selectedJobForOutput.id}*
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-500 block text-[10px]">ALICI MÜŞTERİ:</span>
                            <span className="font-bold text-slate-900 text-sm">
                              {selectedJobForOutput.customerName}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">İLETİŞİM TELEFON:</span>
                            <span className="font-bold text-slate-900 font-mono">
                              {selectedJobForOutput.phone}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 block text-[10px]">TESLİMAT ŞEKLİ:</span>
                            <span className="font-black text-[#f43f2d] text-sm">
                              {selectedJobForOutput.deliveryMethod}
                            </span>
                            {selectedJobForOutput.shippingAddress && (
                              <div className="text-[11px] text-slate-700 mt-0.5 font-medium">
                                Adres: {selectedJobForOutput.shippingAddress}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-300 text-xs">
                          <div>
                            <span className="text-slate-500 block text-[10px]">DOKÜMAN & CİLT:</span>
                            <span className="font-bold text-slate-900">
                              {selectedJobForOutput.pageCount} Syf · {selectedJobForOutput.binding}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 block text-[10px]">TAHSİL EDİLECEK:</span>
                            <span className="text-lg font-black text-slate-900">
                              {selectedJobForOutput.totalPrice.toFixed(2)} TL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SAĞ SÜTUN (5 Birim): Donanım Durumu & Baskı Üretim Eylemleri */}
              <div className="lg:col-span-5 space-y-4">
                {/* 1. YAZICI DONANIM DURUM KUTUSU */}
                <div className="bg-[#121418] p-4 rounded-2xl border border-[#282b35] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Yazıcı Ünitesi</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Çevrimiçi / Hazır
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-slate-100">
                      Canon imageRUNNER ADVANCE C5535i
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      IP: 192.168.1.105 · Kaset 1 (A4 80 gr Dolu)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#232630] text-xs">
                    <div className="bg-[#181a20] p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Siyah Toner</span>
                      <div className="flex items-center justify-between mt-1">
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mr-2">
                          <div
                            className="bg-slate-300 h-1.5 rounded-full"
                            style={{ width: `${blackToner}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-[11px] text-slate-200">%{blackToner}</span>
                      </div>
                    </div>

                    <div className="bg-[#181a20] p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Renkli Toner</span>
                      <div className="flex items-center justify-between mt-1">
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mr-2">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${colorToner}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-[11px] text-blue-300">%{colorToner}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. MÜŞTERİ SİPARİŞ ÖZETİ VE BASKI PARAMETRELERİ */}
                <div className="bg-[#121418] p-4 rounded-2xl border border-[#282b35] space-y-2 text-xs">
                  <div className="font-bold text-white pb-2 border-b border-[#232630] flex items-center justify-between">
                    <span>Müşteri Baskı Parametreleri</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {selectedJobForOutput.totalPrice.toFixed(2)} TL
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Müşteri Adı:</span>
                    <span className="font-bold text-white">{selectedJobForOutput.customerName}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Telefon:</span>
                    <span className="font-mono text-slate-200">{selectedJobForOutput.phone}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Dosya:</span>
                    <span className="font-mono text-amber-300 truncate max-w-[180px]">
                      {selectedJobForOutput.fileName}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Sayfa × Kopya:</span>
                    <span className="font-bold text-white">
                      {selectedJobForOutput.pageCount} Syf × {selectedJobForOutput.copies} Takım
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Toplam Çekilecek Kağıt:</span>
                    <span className="font-bold text-rose-400">
                      {selectedJobForOutput.pageCount * selectedJobForOutput.copies} Yaprak
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Baskı Türü:</span>
                    <span className="font-medium text-white">{selectedJobForOutput.colorMode}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Ciltleme:</span>
                    <span className="font-bold text-amber-300">{selectedJobForOutput.binding}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Teslimat Tercihi:</span>
                    <span className="font-bold text-emerald-400">
                      {selectedJobForOutput.deliveryMethod}
                    </span>
                  </div>
                </div>

                {/* 3. İLERLEME ÇUBUĞU (YAZDIRILIYOR ESNASINDA) */}
                {isPrintingSimulated && (
                  <div className="bg-[#181a20] p-4 rounded-2xl border border-amber-500/40 space-y-2 animate-pulse">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Printer className="w-4 h-4 animate-spin" />
                        <span>Fiziksel Çıktı Alınıyor...</span>
                      </span>
                      <span className="font-mono text-amber-400 font-bold">%{printProgress}</span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${printProgress}%` }}
                      ></div>
                    </div>

                    <div className="text-[11px] text-slate-300 italic">
                      {printStageMessage}
                    </div>
                  </div>
                )}

                {/* 4. AKSİYON BUTONLARI */}
                <div className="space-y-2.5 pt-2">
                  {/* BİRİNCİL BUTON: MAKİNEDEN ÇIKTI VER */}
                  <button
                    type="button"
                    disabled={isPrintingSimulated}
                    onClick={() => handleProducePrintOutput(selectedJobForOutput)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-98 disabled:opacity-50"
                  >
                    <Printer className="w-4 h-4 text-slate-950" />
                    <span>🖨️ Makineden Çıktı Ver (Baskıyı Başlat)</span>
                  </button>

                  {/* FİZİKSEL TARAYICI YAZDIRMA PENCERESİ */}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full py-2.5 px-4 bg-[#242731] hover:bg-[#2e323e] text-slate-200 font-bold rounded-xl border border-slate-700 text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Gerçek Yazıcıya Gönder (window.print)</span>
                  </button>

                  {/* SMS / WHATSAPP BİLDİRİMİ */}
                  <button
                    type="button"
                    onClick={() => handleSendReadyNotification(selectedJobForOutput)}
                    className="w-full py-2.5 px-4 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-bold rounded-xl border border-emerald-800/50 text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Müşteriye 'Çıktınız Hazır' Bildirimi Gönder</span>
                  </button>

                  {/* KARGOYA VER / EVİME KARGOLA */}
                  <button
                    type="button"
                    onClick={() => {
                      handleShipPrintJobToHome(selectedJobForOutput);
                      setSelectedJobForOutput(null);
                    }}
                    className="w-full py-2.5 px-4 bg-[#f43f2d] hover:bg-[#d93424] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Evime / Adrese Kargola (Trendyol Express)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
