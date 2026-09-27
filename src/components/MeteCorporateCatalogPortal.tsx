import React, { useState, useMemo } from 'react';
import {
  Building2,
  Package,
  Search,
  Filter,
  ShoppingCart,
  Palette,
  Upload,
  Check,
  CheckCircle2,
  FileText,
  Printer,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  FileCheck,
  Tag,
  Briefcase,
  FolderOpen,
  BookOpen,
  PenTool,
  Gift,
  LayoutGrid,
  List,
  Eye,
  Camera,
} from 'lucide-react';

export interface CorporateProduct {
  id: string;
  sku: string;
  barcode: string;
  title: string;
  category: 'cantalar' | 'dosyalama' | 'ofis' | 'yazim' | 'defter' | 'promosyon';
  categoryLabel: string;
  subCategory: string;
  description: string;
  listPrice: number;
  wholesalePrice: number; // Toptan baz birim fiyat
  minOrderQty: number;
  boxQty: number;
  caseQty: number;
  stockQty: number;
  imageUrl: string;
  mockupImageUrl?: string;
  supportsCustomPrint: boolean;
  printLocationDefault: string;
  printTechniques: string[];
  specs: { [key: string]: string };
}

export interface CorporateCartItem {
  product: CorporateProduct;
  quantity: number;
  hasCustomPrint: boolean;
  printNote: string;
  printType: string;
  printLocation: string;
  logoFileName: string;
  customerFirmName: string;
  unitPrice: number;
  totalPrice: number;
}

export const INITIAL_CORPORATE_PRODUCTS: CorporateProduct[] = [
  // ÇANTALAR & SIRT ÇANTALARI
  {
    id: 'METE-BAG-01',
    sku: 'METE-CAN-ERG-01',
    barcode: '8690333001010',
    title: 'Mete Ergonomik Çok Bölmeli Su Geçirmez Sırt Çantası (Baskıya Hazır Model)',
    category: 'cantalar',
    categoryLabel: 'Çantalar & Sırt Çantaları',
    subCategory: 'Ergonomik Sırt Çantaları',
    description: 'Su geçirmez dayanıklı imperteks kumaş, ortopedik sırt paneli, USB çıkış yuvası ve özel kurumsal logo transfer alanı.',
    listPrice: 580.0,
    wholesalePrice: 348.0,
    minOrderQty: 10,
    boxQty: 5,
    caseQty: 25,
    stockQty: 240,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Ön Cep Üstü - Merkez',
    printTechniques: ['Sıcak Transfer (DTF)', 'Serigrafi Baskı', 'Nakış Arma', 'Reflektif Baskı'],
    specs: {
      Kumaş: '600D Su İtici Kumaş',
      Hacim: '28 Litre',
      Bölmeler: '3 Ana Göz + Matara Cebi',
      Baskı: 'DTF Transfer Uyumlu',
    },
  },
  {
    id: 'METE-BAG-02',
    sku: 'METE-CAN-ORT-02',
    barcode: '8690333001027',
    title: 'Mete Ortopedik Destekli İlkokul & Genç Sırt Çantası (Reflektörlü)',
    category: 'cantalar',
    categoryLabel: 'Çantalar & Sırt Çantaları',
    subCategory: 'Okul Çantaları',
    description: 'Omurga dostu ortopedik sırt desteği, reflektif güvenlik şeritleri ve geniş ön cep logo alanı.',
    listPrice: 620.0,
    wholesalePrice: 372.0,
    minOrderQty: 10,
    boxQty: 6,
    caseQty: 24,
    stockQty: 180,
    imageUrl: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Ön Cep Merkezi',
    printTechniques: ['Sıcak Transfer (DTF)', 'Nakış / Dokuma Arma', 'Serigrafi'],
    specs: {
      Kumaş: 'Terletmeyen Airmesh Sırt',
      Ağırlık: '720 gr (Hafif)',
      Garanti: '2 Yıl İmalat Garantisi',
    },
  },
  {
    id: 'METE-BAG-03',
    sku: 'METE-CAN-EVR-03',
    barcode: '8690333001034',
    title: 'Mete Business 15.6" Laptop & Evrak Sırt Çantası (Kurumsal Promosyon)',
    category: 'cantalar',
    categoryLabel: 'Çantalar & Sırt Çantaları',
    subCategory: 'Evrak & Laptop Çantaları',
    description: 'Darbe emici laptop koruma yuvası, kurumsal firmalara özel sıcak baskı ve metal logo alanı.',
    listPrice: 690.0,
    wholesalePrice: 414.0,
    minOrderQty: 10,
    boxQty: 10,
    caseQty: 40,
    stockQty: 135,
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Ön Sağ Metal/Deri Plaka Üstü',
    printTechniques: ['Lazer Kazıma Metal Plaka', 'Sıcak Transfer', 'UV Renkli Baskı'],
    specs: {
      Uyum: '15.6 İnç Laptop',
      Tasarım: 'İnce & Şık Executive Stil',
      Körük: 'Genişleyebilir Taban',
    },
  },

  // DOSYALAMA & ARŞİV GRUBU
  {
    id: 'METE-DOS-01',
    sku: 'METE-DOS-KLAS-01',
    barcode: '8690444002011',
    title: 'Mete Geniş Sırt Mekanizmalı Plastik Klasör (A4 Boyut - Özel Firma Baskılı)',
    category: 'dosyalama',
    categoryLabel: 'Dosyalama & Arşiv',
    subCategory: 'Mekanizmalı Klasörler',
    description: 'Avrupa mekanizmalı, metal kenar koruyuculu, şık kurumsal logo serigrafi/sıcak baskı uyumlu arşiv klasörü.',
    listPrice: 95.0,
    wholesalePrice: 57.0,
    minOrderQty: 25,
    boxQty: 25,
    caseQty: 100,
    stockQty: 850,
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Kapak Ön Yüzü & Sırt Etiketi',
    printTechniques: ['Serigrafi Baskı', 'Sıcak Varak Baskı', 'UV Dijital'],
    specs: {
      Kapasite: '500 Sayfa (7.5 cm Sırt)',
      Mekanizma: 'Nikel Kaplamalı Çelik Kol',
      Malzeme: 'Geri Dönüştürülebilir PP',
    },
  },
  {
    id: 'METE-DOS-02',
    sku: 'METE-DOS-POS-02',
    barcode: '8690444002028',
    title: 'Mete A4 Delikli Şeffaf Poşet Dosya 100lü Paket (Ekstra Dayanıklı)',
    category: 'dosyalama',
    categoryLabel: 'Dosyalama & Arşiv',
    subCategory: 'Poşet Dosyalar',
    description: 'Buzlu/şeffaf yüzeyli, statik elektriklenme yapmayan, klasör delikleri takviyeli 100lü sunum poşeti.',
    listPrice: 85.0,
    wholesalePrice: 51.0,
    minOrderQty: 10,
    boxQty: 10,
    caseQty: 50,
    stockQty: 600,
    imageUrl: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: false,
    printLocationDefault: 'Paket Üzeri Firma Etiketleme',
    printTechniques: ['Özel Ambalaj Etiketi'],
    specs: {
      Adet: '100 Yaprak / Paket',
      Kalınlık: '55 Mikron',
      Boyut: 'A4 (21 x 29.7 cm)',
    },
  },
  {
    id: 'METE-DOS-03',
    sku: 'METE-DOS-CIT-03',
    barcode: '8690444002035',
    title: 'Mete Çıtçıtlı Evrak Zarfı (Özel Logo Baskılı Şeffaf / Opak Renkler)',
    category: 'dosyalama',
    categoryLabel: 'Dosyalama & Arşiv',
    subCategory: 'Çıtçıtlı Zarflar',
    description: 'Kurumsal evrak teslimatı, fatura ve sözleşmeler için firma logolu çıtçıtlı dayanıklı polipropilen zarf.',
    listPrice: 25.0,
    wholesalePrice: 14.5,
    minOrderQty: 50,
    boxQty: 50,
    caseQty: 500,
    stockQty: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Kapak Ön Ortası',
    printTechniques: ['Serigrafi Tek Renk', 'Renkli UV Baskı'],
    specs: {
      Boyut: 'A4 Geniş',
      Kilit: 'Sağlam Plastik Çıtçıt',
    },
  },

  // OFİS & KIRTASİYE
  {
    id: 'METE-OFS-01',
    sku: 'METE-OFS-ZMB-01',
    barcode: '8690555003012',
    title: 'Mete No: 24/6 Ağır Hizmet Metal Zımba Makinesi (Özel Logolu)',
    category: 'ofis',
    categoryLabel: 'Ofis & Kırtasiye',
    subCategory: 'Zımba & Delgeç',
    description: 'Paslanmaz çelik iç mekanizma, ergonomik yumuşak üst gövde, masa üstü kurumsal logo baskısına uygun alan.',
    listPrice: 125.0,
    wholesalePrice: 75.0,
    minOrderQty: 10,
    boxQty: 10,
    caseQty: 60,
    stockQty: 320,
    imageUrl: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Üst Gövde Tampon / Lazer',
    printTechniques: ['Tampon Baskı', 'Lazer Markalama'],
    specs: {
      Kapasite: '25 Sayfa',
      Tel: 'No: 24/6 ve 26/6',
      Gövde: 'Metal + ABS Plastik',
    },
  },
  {
    id: 'METE-OFS-02',
    sku: 'METE-OFS-YAP-02',
    barcode: '8690555003029',
    title: 'Mete Solvent İçermez Stick Yapıştırıcı 43 gr (Koli: 24lü)',
    category: 'ofis',
    categoryLabel: 'Ofis & Kırtasiye',
    subCategory: 'Yapıştırıcı & Bant',
    description: 'Hızlı kuruyan, solvent içermeyen, kağıt ve karton için güvenli büyük boy stick yapıştırıcı.',
    listPrice: 52.0,
    wholesalePrice: 31.2,
    minOrderQty: 24,
    boxQty: 24,
    caseQty: 144,
    stockQty: 720,
    imageUrl: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: false,
    printLocationDefault: 'Koli Üzeri Özel Logo',
    printTechniques: ['Ambalaj Etiketi'],
    specs: {
      Gramaj: '43 gr',
      Özellik: 'Yıkanabilir, Toksik Değil',
    },
  },

  // YAZIM & ÇİZİM ARAÇLARI
  {
    id: 'METE-YAZ-01',
    sku: 'METE-YAZ-KAL-01',
    barcode: '8690666004013',
    title: 'Mete Elegance Metal Gövde Roller Kalem Seti (Lazer İsim & Logo Baskılı)',
    category: 'yazim',
    categoryLabel: 'Yazım & Çizim Araçları',
    subCategory: 'Kurumsal Kalemler',
    description: 'Ağır metal gövde, yumuşak akışkan Alman mürekkebi, kurumsal firma adı ve isim lazer kazıma hediye kutulu.',
    listPrice: 180.0,
    wholesalePrice: 108.0,
    minOrderQty: 10,
    boxQty: 10,
    caseQty: 100,
    stockQty: 450,
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Gövde Yanı Lazer Kazıma',
    printTechniques: ['Lazer Kazıma (Soyulmaz)', 'Tampon Baskı'],
    specs: {
      Uç: '0.7 mm Seramik Bilye',
      Kutu: 'Özel Kadife Yataklı Kutu',
      Mürekkep: 'Mavi / Siyah Seçenekli',
    },
  },
  {
    id: 'METE-YAZ-02',
    sku: 'METE-YAZ-VER-02',
    barcode: '8690666004020',
    title: 'Mete Grip 0.7mm Mekanik Versatil Kalem (12li Stand Kutu)',
    category: 'yazim',
    categoryLabel: 'Yazım & Çizim Araçları',
    subCategory: 'Versatil Kalemler',
    description: 'Kauçuk tutaçlı ergonomik gövde, kırılmaya dayanıklı esnek uç mekanizması.',
    listPrice: 110.0,
    wholesalePrice: 66.0,
    minOrderQty: 12,
    boxQty: 12,
    caseQty: 144,
    stockQty: 580,
    imageUrl: 'https://images.unsplash.com/photo-1585336261026-7f5a4d2c8845?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Klips & Gövde Üstü',
    printTechniques: ['Tampon Renkli Baskı'],
    specs: {
      Uç: '0.7 mm',
      Silgi: 'Döner Mekanizmalı Tepe Silgi',
    },
  },

  // DEFTER & KAĞIT GRUBU
  {
    id: 'METE-DEF-01',
    sku: 'METE-DEF-AJN-01',
    barcode: '8690777005014',
    title: 'Mete Deri Kapak Termo Deri Kurumsal Ajanda & Not Defteri (Sıcak Yaldız Baskılı)',
    category: 'defter',
    categoryLabel: 'Defter & Kağıt Grubu',
    subCategory: 'Kurumsal Logolu Defterler',
    description: 'Termo deri şık kapak, krem rengi göz yormayan kağıt, sayfalarında firma logo filigranı ve kapakta sıcak gofre baskı.',
    listPrice: 145.0,
    wholesalePrice: 87.0,
    minOrderQty: 10,
    boxQty: 20,
    caseQty: 80,
    stockQty: 390,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Kapak Ön Merkez Gofre',
    printTechniques: ['Sıcak Gofre (Kabartma)', 'Yaldız Baskı (Altın/Gümüş)', 'UV Renkli'],
    specs: {
      Boyut: '13 x 21 cm (Orta Boy)',
      Yaprak: '192 Sayfa (96 Yaprak)',
      Kağıt: '80 gr İvory Kağıt',
    },
  },
  {
    id: 'METE-DEF-02',
    sku: 'METE-DEF-A4-02',
    barcode: '8690777005021',
    title: 'Mete A4 80 Yaprak Sert Kapak Spiralli Kareli Okul & Ofis Defteri',
    category: 'defter',
    categoryLabel: 'Defter & Kağıt Grubu',
    subCategory: 'Spiralli Defterler',
    description: 'Mikroperforeli kolay koparılabilir sayfalar, çift spiral sağlam tel ve sert parlak laminasyonlu kapak.',
    listPrice: 75.0,
    wholesalePrice: 45.0,
    minOrderQty: 20,
    boxQty: 24,
    caseQty: 96,
    stockQty: 820,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Kapak Sol Alt / Merkez',
    printTechniques: ['Serigrafi', 'Dijital Etiket Baskı'],
    specs: {
      Boyut: 'A4',
      Kareleme: '5x5 mm Gri Çizgili',
    },
  },

  // PROMOSYON & KURUMSAL HEDİYE
  {
    id: 'METE-PRM-01',
    sku: 'METE-PRM-TRM-01',
    barcode: '8690888006015',
    title: 'Mete 500ml Çift Cidarlı Paslanmaz Çelik Dijital Termos (Lazer İsim/Logo Baskılı)',
    category: 'promosyon',
    categoryLabel: 'Promosyon Grubu',
    subCategory: 'Termos & Mataralar',
    description: 'Sıcaklık göstergeli dokunmatik kapak, 12 saat sıcak/24 saat soğuk tutma, firmanıza özel soyulmaz lazer kazıma.',
    listPrice: 280.0,
    wholesalePrice: 168.0,
    minOrderQty: 10,
    boxQty: 10,
    caseQty: 50,
    stockQty: 210,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Gövde Ön Yüzü Dikey Kazıma',
    printTechniques: ['Lazer Kazıma (Gümüş Efekt)', 'Renkli UV Baskı'],
    specs: {
      Hacim: '500 ml',
      Malzeme: '304 Gıda Uyumlu Paslanmaz Çelik',
      Yalıtım: 'Vakumlu Çift Duvar',
    },
  },
  {
    id: 'METE-PRM-02',
    sku: 'METE-PRM-SET-02',
    barcode: '8690888006022',
    title: 'Mete VIP Kurumsal Karşılama Seti (Termos + Defter + Metal Kalem + USB Bellek)',
    category: 'promosyon',
    categoryLabel: 'Promosyon Grubu',
    subCategory: 'VIP Hediye Setleri',
    description: 'Özel sünger yataklı lüks hediye kutusunda, tüm parçalarında aynı firma logosu ve kurumsal renk kombinasyonu.',
    listPrice: 590.0,
    wholesalePrice: 354.0,
    minOrderQty: 10,
    boxQty: 5,
    caseQty: 20,
    stockQty: 95,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    supportsCustomPrint: true,
    printLocationDefault: 'Kutu Kapağı & 4 Parça Üzeri',
    printTechniques: ['Kombine Lazer & Gofre & UV'],
    specs: {
      Kutu: 'Mıknatıslı Kapak Özel Kutu',
      Parçalar: 'Termos, Defter, Kalem, 32GB USB',
    },
  },
];

interface MeteCorporateCatalogPortalProps {
  onClose?: () => void;
}

export const MeteCorporateCatalogPortal: React.FC<MeteCorporateCatalogPortalProps> = ({ onClose }) => {
  const [products, setProducts] = useState<CorporateProduct[]>(INITIAL_CORPORATE_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Cart / Quote Order State
  const [cart, setCart] = useState<CorporateCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState<boolean>(false);

  // Custom Print Detail Modal
  const [selectedProductForPrint, setSelectedProductForPrint] = useState<CorporateProduct | null>(null);

  // Photo Upload & Categorization Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadCategory, setUploadCategory] = useState<CorporateProduct['category']>('cantalar');
  const [uploadSubCategory, setUploadSubCategory] = useState<string>('Ergonomik Sırt Çantaları');
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadPrice, setUploadPrice] = useState<number>(350);
  const [uploadImageUrl, setUploadImageUrl] = useState<string>('');
  const [uploadSupportsPrint, setUploadSupportsPrint] = useState<boolean>(true);

  // Quote / Order Completed Document Modal
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Form Fields for Quote / Order
  const [customerName, setCustomerName] = useState<string>('Zehra Nur Arpacı');
  const [customerFirm, setCustomerFirm] = useState<string>('Mete Kitap Kırtasiye Ltd. Şti.');
  const [customerPhone, setCustomerPhone] = useState<string>('0 (312) 270 00 00');
  const [customerEmail, setCustomerEmail] = useState<string>('kurumsal@metekirtasiye.com.tr');
  const [customerAddress, setCustomerAddress] = useState<string>('Atatürk Mah. Lale Cad. No: 42/A Sincan / Ankara');
  const [orderNote, setOrderNote] = useState<string>('Ürüne özel baskı ilavesi yapılacaktır. Firma vektörel logomuz doğrultusunda üretim talimatı oluşturulsun.');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Categories list
  const categoryList = [
    { id: 'all', name: 'Tüm Kategoriler', icon: LayoutGrid, count: products.length },
    { id: 'cantalar', name: 'Çantalar & Sırt Çantaları', icon: Briefcase, count: products.filter((p) => p.category === 'cantalar').length },
    { id: 'dosyalama', name: 'Dosyalama & Arşiv', icon: FolderOpen, count: products.filter((p) => p.category === 'dosyalama').length },
    { id: 'ofis', name: 'Ofis & Kırtasiye', icon: Package, count: products.filter((p) => p.category === 'ofis').length },
    { id: 'yazim', name: 'Yazım & Çizim Araçları', icon: PenTool, count: products.filter((p) => p.category === 'yazim').length },
    { id: 'defter', name: 'Defter & Kağıt Grubu', icon: BookOpen, count: products.filter((p) => p.category === 'defter').length },
    { id: 'promosyon', name: 'Promosyon Grubu', icon: Gift, count: products.filter((p) => p.category === 'promosyon').length },
  ];

  // Distinct Subcategories for selected category
  const availableSubCategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    const subs = products.filter((p) => p.category === selectedCategory).map((p) => p.subCategory);
    return Array.from(new Set(subs));
  }, [products, selectedCategory]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSub = selectedSubCategory === 'all' || p.subCategory === selectedSubCategory;
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSub && matchSearch;
    });
  }, [products, selectedCategory, selectedSubCategory, searchQuery]);

  // Add to cart handler
  const handleAddToCart = (
    product: CorporateProduct,
    quantity: number,
    hasCustomPrint: boolean = false,
    printNote: string = 'Ürüne özel baskı ilavesi yapılacaktır',
    printType: string = 'Sıcak Transfer (DTF)',
    printLocation: string = product.printLocationDefault
  ) => {
    // Wholesale volume discount
    let unitDiscount = 0;
    if (quantity >= 50) unitDiscount = 0.1; // %10 extra volume discount
    else if (quantity >= 100) unitDiscount = 0.15;

    const unitPrice = product.wholesalePrice * (1 - unitDiscount);
    const totalPrice = unitPrice * quantity;

    const newItem: CorporateCartItem = {
      product,
      quantity,
      hasCustomPrint,
      printNote,
      printType,
      printLocation,
      logoFileName: 'METE_KIRTASIYE_LOGO_VEKTOR.pdf',
      customerFirmName: customerFirm,
      unitPrice,
      totalPrice,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`"${product.title}" (${quantity} adet) başarıyla sepete eklendi.`);
  };

  // Upload new product handler
  const handleSaveUploadedProduct = () => {
    if (!uploadTitle.trim()) {
      alert('Lütfen ürün başlığı giriniz.');
      return;
    }

    const defaultImg =
      uploadImageUrl.trim() ||
      (uploadCategory === 'cantalar'
        ? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'
        : uploadCategory === 'dosyalama'
        ? 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80'
        : uploadCategory === 'yazim'
        ? 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80');

    const newProd: CorporateProduct = {
      id: `METE-CUSTOM-${Date.now()}`,
      sku: `METE-${uploadCategory.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      barcode: `8690999${Math.floor(100000 + Math.random() * 900000)}`,
      title: uploadTitle,
      category: uploadCategory,
      categoryLabel: categoryList.find((c) => c.id === uploadCategory)?.name || 'Katalog',
      subCategory: uploadSubCategory,
      description: 'Mete Kırtasiye özel kurumsal koleksiyonu ürünü. Yüksek kaliteli hammadde ve özel baskı seçeneği.',
      listPrice: Math.round(uploadPrice * 1.65),
      wholesalePrice: uploadPrice,
      minOrderQty: 10,
      boxQty: 10,
      caseQty: 50,
      stockQty: 150,
      imageUrl: defaultImg,
      supportsCustomPrint: uploadSupportsPrint,
      printLocationDefault: 'Ön Yüzey - Merkez',
      printTechniques: ['Sıcak Transfer (DTF)', 'Serigrafi', 'Lazer Kazıma'],
      specs: {
        Kategori: uploadSubCategory,
        Baskı: uploadSupportsPrint ? 'Mete Kırtasiye Logolu / Özel Baskılı' : 'Standart',
      },
    };

    setProducts((prev) => [newProd, ...prev]);
    setIsUploadModalOpen(false);
    setSelectedCategory(uploadCategory);
    setUploadTitle('');
    setUploadImageUrl('');
    showToast(`Yeni ürün ("${newProd.title}") başarıyla "${newProd.categoryLabel}" kategorisine eklendi!`);
  };

  // Total cart calculations
  const totalCartUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartNet = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalCartVat = totalCartNet * 0.2;
  const grandCartTotal = totalCartNet + totalCartVat;

  // Complete Order / Quote handler
  const handleFinalizeQuoteOrOrder = (type: 'order' | 'quote') => {
    const docId = type === 'order' ? `METE-SIP-${Date.now().toString().slice(-6)}` : `METE-TEK-${Date.now().toString().slice(-6)}`;
    const docData = {
      docId,
      type,
      date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      customerName,
      customerFirm,
      customerPhone,
      customerEmail,
      customerAddress,
      orderNote,
      items: cart,
      totalNet: totalCartNet,
      totalVat: totalCartVat,
      grandTotal: grandCartTotal,
    };

    setCompletedOrder(docData);
    setCart([]);
    setIsQuoteFormOpen(false);
    setIsCartOpen(false);
    showToast(type === 'order' ? `Siparişiniz (${docId}) başarıyla alındı!` : `Resmi Teklif Formunuz (${docId}) oluşturuldu.`);
  };

  return (
    <div className="min-h-screen bg-[#0d121c] text-slate-100 font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn text-xs font-bold border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP CORPORATE STRIP (Mete Kırtasiye Kimliği)
         ========================================================================= */}
      <div className="bg-[#141b29] border-b border-slate-800 text-[11px] text-slate-300 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>METE KİTAP KIRTASİYE LTD. ŞTİ. · Kurumsal Çözümler & Toptan Sipariş</span>
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>0 (312) 270 00 00</span>
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Mail className="w-3 h-3 text-amber-400" />
              <span>kurumsal@metekirtasiye.com.tr</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[10px]">
            <span>Atatürk Mah. Lale Cad. No: 42/A Sincan / Ankara</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>%100 Orijinal Ürün & Özel Baskı Garantisi</span>
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN HEADER & NAVIGATION (B2B Layout Architecture)
         ========================================================================= */}
      <header className="bg-[#182133] border-b border-slate-700/80 sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedCategory('all')}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-900/30">
                <span className="text-xl font-black text-white tracking-tighter">M</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white tracking-tight">METE KIRTASİYE</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                    KURUMSAL KATALOG
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Online Toptan Ürün Kataloğu & Özel Baskı Atölyesi
                </p>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün adı, stok kodu (METE-CAN...), kategori veya özellik ile arayın..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0f172a] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 justify-end">
            {/* Fotoğraf Yükle Butonu */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Kendi ürün fotoğraflarınızı yükleyin ve anında ilgili kategoriye yerleştirin"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Fotoğraf Yükle & Ekle</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Vitrin Kart Görünümü"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Referans B2B Tablo Görünümü"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Cart / Quote Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-orange-950/30 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Sepet / Teklif ({totalCartUnits})</span>
              {grandCartTotal > 0 && (
                <span className="bg-slate-950/40 text-white font-mono text-[11px] px-1.5 py-0.5 rounded font-bold">
                  {grandCartTotal.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                </span>
              )}
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="hidden md:flex p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Bar (Referans B2B Menü Yapısı) */}
        <div className="bg-[#121927] border-t border-slate-800 px-4 py-1.5 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            {categoryList.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedSubCategory('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Subcategory Pills Bar (Eğer kategori seçildiyse) */}
      {availableSubCategories.length > 0 && (
        <div className="bg-[#0f172a] border-b border-slate-800/80 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-500 font-semibold text-[11px] shrink-0">Alt Kategoriler:</span>
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                selectedSubCategory === 'all'
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tüm Alt Gruplar
            </button>
            {availableSubCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                  selectedSubCategory === sub
                    ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN CONTENT AREA
         ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Banner: Özel Baskı & Mete Kırtasiye Garantisi */}
        <div className="bg-gradient-to-r from-[#1c2438] via-[#1e293b] to-[#1a202e] border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <Palette className="w-3.5 h-3.5" />
                <span>Mete Kırtasiye Özel Baskı & Kurumsal Markalama Merkezi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Tüm Ürünlerimize Kurumsal Firma Baskısı & Logo Uygulaması
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Katalogdaki çanta, dosya, defter ve promosyon modellerimiz referans gösterilen standartlarda üretilmekte; üzerine <strong>'Mete Kırtasiye'</strong> veya talep ettiğiniz <strong>kurumsal firma logonuz</strong> sıcak transfer, lazer veya serigrafi ile profesyonelce basılmaktadır.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setSelectedCategory('cantalar');
                  const bag = products.find((p) => p.category === 'cantalar');
                  if (bag) setSelectedProductForPrint(bag);
                }}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Palette className="w-4 h-4" />
                <span>Çanta Özel Baskı Mock-up'ını İncele</span>
              </button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Yeni Ürün Fotoğrafı Yükle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Stats & Results Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Listelenen: <strong className="text-white font-mono">{filteredProducts.length}</strong> adet kurumsal ürün
            {selectedCategory !== 'all' && (
              <span> · Kategori: <strong className="text-amber-400">{categoryList.find((c) => c.id === selectedCategory)?.name}</strong></span>
            )}
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Stoktan Anında Teslim</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Özel Logo Baskı Uyumlu</span>
            </span>
          </div>
        </div>

        {/* =========================================================================
            PRODUCTS DISPLAY: GRID VIEW OR TABLE VIEW
           ========================================================================= */}
        {viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductGridCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onOpenPrintModal={(p) => setSelectedProductForPrint(p)}
              />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 space-y-3 bg-[#161f30] rounded-3xl border border-slate-800">
                <Package className="w-12 h-12 mx-auto text-slate-600" />
                <h3 className="text-base font-bold text-white">Aradığınız kriterlere uygun ürün bulunamadı.</h3>
                <p className="text-xs max-w-md mx-auto">
                  Arama kelimesini değiştirebilir veya "Fotoğraf Yükle" butonuyla yeni bir ürün ekleyebilirsiniz.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSubCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        ) : (
          /* TABLE VIEW (Referans B2B Liste Düzeni) */
          <div className="bg-[#161f30] border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-3">Görsel</th>
                    <th className="py-3 px-3">Stok Kodu / Barkod</th>
                    <th className="py-3 px-3">Ürün Adı & Özellik</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3 text-right">Piyasa Fiyatı</th>
                    <th className="py-3 px-3 text-right text-amber-400">Toptan Fiyat</th>
                    <th className="py-3 px-3 text-center">Baskı</th>
                    <th className="py-3 px-3 text-center">Stok</th>
                    <th className="py-3 px-3 text-center">Sipariş & Sepet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredProducts.map((p) => (
                    <ProductTableRowItem
                      key={p.id}
                      product={p}
                      onAddToCart={handleAddToCart}
                      onOpenPrintModal={(prod) => setSelectedProductForPrint(prod)}
                    />
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        Arama kriterlerinize uygun ürün bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: ÖZEL BASKI & MOCK-UP ÖNİZLEME MODALI
         ========================================================================= */}
      {selectedProductForPrint && (
        <ProductCustomPrintModal
          product={selectedProductForPrint}
          isOpen={!!selectedProductForPrint}
          onClose={() => setSelectedProductForPrint(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* =========================================================================
          MODAL: FOTOĞRAF YÜKLE & KATEGORİYE YERLEŞTİR
         ========================================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a2336] border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-scaleIn text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Yeni Ürün Fotoğrafı Yükle & Kategoriye Ata</h3>
                  <p className="text-xs text-slate-400">Ürün görselini yükleyin, kategorisini belirleyip kataloğa ekleyin.</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Ürün Başlığı / Modeli:</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Örn: Mete Pro Özel Baskılı Su Geçirmez Sırt Çantası"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ana Kategori:</label>
                  <select
                    value={uploadCategory}
                    onChange={(e: any) => {
                      const cat = e.target.value;
                      setUploadCategory(cat);
                      if (cat === 'cantalar') setUploadSubCategory('Ergonomik Sırt Çantaları');
                      else if (cat === 'dosyalama') setUploadSubCategory('Mekanizmalı Klasörler');
                      else if (cat === 'ofis') setUploadSubCategory('Masaüstü Setleri');
                      else if (cat === 'yazim') setUploadSubCategory('Kurumsal Kalemler');
                      else if (cat === 'defter') setUploadSubCategory('Kurumsal Logolu Defterler');
                      else setUploadSubCategory('VIP Hediye Setleri');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="cantalar">Çantalar & Sırt Çantaları</option>
                    <option value="dosyalama">Dosyalama & Arşiv</option>
                    <option value="ofis">Ofis & Kırtasiye</option>
                    <option value="yazim">Yazım & Çizim Araçları</option>
                    <option value="defter">Defter & Kağıt Grubu</option>
                    <option value="promosyon">Promosyon Grubu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Alt Kategori:</label>
                  <input
                    type="text"
                    value={uploadSubCategory}
                    onChange={(e) => setUploadSubCategory(e.target.value)}
                    placeholder="Örn: Ergonomik Sırt Çantaları"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Toptan Fiyat (TL + KDV):</label>
                  <input
                    type="number"
                    value={uploadPrice}
                    onChange={(e) => setUploadPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fotoğraf URL (veya varsayılan görsel):</label>
                  <input
                    type="text"
                    value={uploadImageUrl}
                    onChange={(e) => setUploadImageUrl(e.target.value)}
                    placeholder="Boş bırakılırsa kategoriye uygun görsel atanır"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
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
          DRAWER: KURUMSAL SEPET & SİPARİŞ / TEKLİF ÇEKMECESİ
         ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#182133] border-l border-slate-700 shadow-2xl flex flex-col h-full text-slate-100 z-10 animate-slideLeft">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Mete Kırtasiye Sipariş & Teklif Sepeti</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-xs truncate">{item.product.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.quantity} Adet x {item.unitPrice.toFixed(2)} ₺
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-amber-300">
                        {item.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </div>
                      <button
                        onClick={() => setCart((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-[10px] text-red-400 hover:underline mt-1"
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>

                  {item.hasCustomPrint && (
                    <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[10px] space-y-0.5">
                      <div className="font-bold text-amber-300 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Mete Kırtasiye Özel Baskı Talebi</span>
                      </div>
                      <div className="text-slate-300 italic">"{item.printNote}"</div>
                      <div className="text-slate-400 font-mono text-[9px]">
                        Tür: {item.printType} · Konum: {item.printLocation}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {cart.length === 0 && (
                <div className="text-center py-20 text-slate-400 space-y-2">
                  <ShoppingCart className="w-12 h-12 mx-auto text-slate-600" />
                  <p>Sepetinizde henüz ürün bulunmuyor.</p>
                  <p className="text-[11px] text-slate-500">Katalogdan ürün seçip adet girerek sepete ekleyebilirsiniz.</p>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout Launcher */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-700 bg-slate-900 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span>Toplam Miktar:</span>
                    <span className="font-bold text-white">{totalCartUnits} Adet</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ara Toplam (Net):</span>
                    <span>{totalCartNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span>KDV (%20):</span>
                    <span>{totalCartVat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                    <span>Genel Toplam:</span>
                    <span className="text-amber-400">
                      {grandCartTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsQuoteFormOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Sipariş & Teklif Formunu Tamamla</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SİPARİŞ & TEKLİF FORMU OLUŞTURMA
         ========================================================================= */}
      {isQuoteFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#182133] border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-scaleIn">
            <div className="p-4 sm:p-5 border-b border-slate-700 bg-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Mete Kırtasiye Sipariş & Teklif Onayı</h3>
                  <p className="text-xs text-slate-400">Müşteri/Firma bilgilerinizi ve baskı detaylarını kontrol ediniz.</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuoteFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Yetkili Adı Soyadı:</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Firma / Kurum Ünvanı:</label>
                  <input
                    type="text"
                    value={customerFirm}
                    onChange={(e) => setCustomerFirm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">İletişim Telefonu:</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">E-Posta Adresi:</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Teslimat & Fatura Adresi:</label>
                <textarea
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>

              {/* Special Note / Print Requirement */}
              <div>
                <label className="block text-amber-300 font-bold mb-1">
                  Özel Not / Baskı Talebi (Sipariş Kaydına İşlenecek):
                </label>
                <textarea
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-white font-semibold text-xs"
                />
              </div>

              {/* Summary of Items */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Sipariş Edilen Ürün Özeti:</span>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="truncate max-w-[280px]">
                        {item.quantity}x {item.product.title} {item.hasCustomPrint ? '(Özel Baskılı)' : ''}
                      </span>
                      <span className="text-amber-300 font-bold">{item.totalPrice.toFixed(2)} ₺</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-1 font-bold text-white text-xs">
                    <span>Genel Toplam (KDV Dahil):</span>
                    <span className="text-emerald-400 font-mono text-sm">
                      {grandCartTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-700 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsQuoteFormOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >
                Geri Dön
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleFinalizeQuoteOrOrder('quote')}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Resmi Teklif Formu Al</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFinalizeQuoteOrOrder('order')}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Siparişi Onayla & Gönder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SİPARİŞ / TEKLİF ONAY BELGESİ & ÇIKTI
         ========================================================================= */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#182133] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-scaleIn text-slate-100 space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">
                {completedOrder.type === 'order' ? 'Siparişiniz Başarıyla Alındı!' : 'Resmi Fiyat Teklifi Hazırlandı!'}
              </h3>
              <p className="text-xs text-slate-300">
                Belge No: <strong className="text-amber-400 font-mono">{completedOrder.docId}</strong> · Tarih: {completedOrder.date}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-400">
                <span>Müşteri / Firma:</span>
                <span className="text-white font-bold">{completedOrder.customerFirm}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-400">
                <span>Yetkili & Tel:</span>
                <span className="text-white">{completedOrder.customerName} - {completedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-400">
                <span>Özel Baskı & Not:</span>
                <span className="text-amber-300 italic truncate max-w-[260px]">{completedOrder.orderNote}</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-1">
                <span>Genel Tutar:</span>
                <span className="text-emerald-400 text-sm">
                  {completedOrder.grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Yazdır / PDF Olarak Kaydet</span>
              </button>
              <button
                type="button"
                onClick={() => setCompletedOrder(null)}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                Kataloğa Geri Dön
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: PRODUCT GRID CARD
// =========================================================================
interface ProductGridCardProps {
  product: CorporateProduct;
  onAddToCart: (product: CorporateProduct, quantity: number, hasCustomPrint: boolean) => void;
  onOpenPrintModal: (product: CorporateProduct) => void;
}

const ProductGridCard: React.FC<ProductGridCardProps> = ({ product, onAddToCart, onOpenPrintModal }) => {
  const [showMockup, setShowMockup] = useState<boolean>(true);
  const [orderQty, setOrderQty] = useState<number>(product.minOrderQty);

  return (
    <div className="bg-[#161f30] border border-slate-700/80 hover:border-amber-500/50 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-amber-950/20 transition-all duration-300 group">
      {/* Product Image & Live Mock-up Overlay */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Live Mock-up Stamp Overlay (Mete Kırtasiye Kurumsal Baskısı) */}
        {showMockup && product.supportsCustomPrint && (
          <div className="absolute inset-x-4 bottom-4 bg-slate-950/85 backdrop-blur-md border border-amber-500/40 rounded-xl p-2 shadow-2xl flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-md bg-amber-500 flex items-center justify-center text-slate-950 font-black text-[10px] shrink-0">
                M
              </div>
              <div className="truncate">
                <div className="text-[10px] font-black text-white leading-tight">METE KIRTASİYE</div>
                <div className="text-[8px] text-amber-400 font-bold uppercase tracking-wider">Özel Baskılı Numune</div>
              </div>
            </div>
            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              MOCK-UP
            </span>
          </div>
        )}

        {/* Category Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-950/80 backdrop-blur-xs text-amber-300 border border-amber-500/30">
            {product.subCategory}
          </span>
        </div>

        {/* Mockup Toggle Switch */}
        {product.supportsCustomPrint && (
          <button
            onClick={() => setShowMockup(!showMockup)}
            className={`absolute top-3 right-3 px-2 py-1 rounded-xl text-[9px] font-bold border transition-all cursor-pointer backdrop-blur-xs ${
              showMockup
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900/80 text-slate-300 border-slate-700'
            }`}
            title="Özel baskı görselini aç / kapat"
          >
            {showMockup ? 'Baskılı Mockup' : 'Ham Model'}
          </button>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
            <span>Kod: {product.sku}</span>
            <span className="text-emerald-400 font-bold">Stok: {product.stockQty} Adet</span>
          </div>

          <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors" title={product.title}>
            {product.title}
          </h3>

          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Pricing & Min Order */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-slate-400">Toptan Birim:</span>
            <div className="text-right">
              <span className="text-xs text-slate-500 line-through mr-1 font-mono">
                {product.listPrice.toFixed(2)} ₺
              </span>
              <span className="text-base font-black text-amber-400 font-mono">
                {product.wholesalePrice.toFixed(2)} ₺
              </span>
              <span className="text-[10px] text-slate-400 ml-1">+ KDV</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>Asgari Sipariş: <strong>{product.minOrderQty} Adet</strong></span>
            {product.supportsCustomPrint && (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Palette className="w-3 h-3" />
                <span>Baskıya Uygun</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions & Quantity */}
        <div className="pt-2 flex items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
            <button
              onClick={() => setOrderQty(Math.max(product.minOrderQty, orderQty - 5))}
              className="px-2 py-1.5 text-slate-400 hover:text-white"
            >
              -
            </button>
            <input
              type="number"
              value={orderQty}
              onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-10 text-center bg-transparent text-white font-mono font-bold text-xs focus:outline-none"
            />
            <button
              onClick={() => setOrderQty(orderQty + 5)}
              className="px-2 py-1.5 text-slate-400 hover:text-white"
            >
              +
            </button>
          </div>

          {/* Quick Add or Customize Button */}
          {product.supportsCustomPrint ? (
            <button
              onClick={() => onOpenPrintModal(product)}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Özel Baskı & Sepet</span>
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product, orderQty, false)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
              <span>Sepete Ekle</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: PRODUCT TABLE ROW ITEM (B2B Layout)
// =========================================================================
interface ProductTableRowItemProps {
  product: CorporateProduct;
  onAddToCart: (product: CorporateProduct, quantity: number, hasCustomPrint: boolean) => void;
  onOpenPrintModal: (product: CorporateProduct) => void;
}

const ProductTableRowItem: React.FC<ProductTableRowItemProps> = ({
  product,
  onAddToCart,
  onOpenPrintModal,
}) => {
  const [orderQty, setOrderQty] = useState<number>(product.minOrderQty);

  return (
    <tr className="hover:bg-slate-800/40 transition-colors">
      <td className="py-2.5 px-3">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
        />
      </td>
      <td className="py-2.5 px-3">
        <div className="font-mono font-bold text-white text-xs">{product.sku}</div>
        <div className="font-mono text-[10px] text-slate-400">{product.barcode}</div>
      </td>
      <td className="py-2.5 px-3 max-w-[280px]">
        <div className="font-bold text-slate-200 text-xs truncate" title={product.title}>
          {product.title}
        </div>
        <div className="text-[10px] text-slate-400 truncate">
          {product.description}
        </div>
      </td>
      <td className="py-2.5 px-3">
        <span className="font-semibold text-slate-300">{product.categoryLabel}</span>
        <div className="text-[10px] text-slate-400">{product.subCategory}</div>
      </td>
      <td className="py-2.5 px-3 text-right font-mono text-slate-400 line-through">
        {product.listPrice.toFixed(2)} ₺
      </td>
      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400 text-sm">
        {product.wholesalePrice.toFixed(2)} ₺
      </td>
      <td className="py-2.5 px-3 text-center">
        {product.supportsCustomPrint ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Baskıya Uygun
          </span>
        ) : (
          <span className="text-[10px] text-slate-500">Standart</span>
        )}
      </td>
      <td className="py-2.5 px-3 text-center">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {product.stockQty} Adet
        </span>
      </td>
      <td className="py-2.5 px-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 overflow-hidden">
            <button
              onClick={() => setOrderQty(Math.max(product.minOrderQty, orderQty - 1))}
              className="px-1.5 py-1 text-slate-400 hover:text-white"
            >
              -
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
              +
            </button>
          </div>

          {product.supportsCustomPrint ? (
            <button
              onClick={() => onOpenPrintModal(product)}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
              title="Özel baskı ile yapılandır"
            >
              Özel Baskı
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product, orderQty, false)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Sepete Ekle
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

// =========================================================================
// SUB-COMPONENT: PRODUCT CUSTOM PRINT & MOCK-UP MODAL
// =========================================================================
interface ProductCustomPrintModalProps {
  product: CorporateProduct;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: CorporateProduct,
    quantity: number,
    hasCustomPrint: boolean,
    printNote: string,
    printType: string,
    printLocation: string
  ) => void;
}

const ProductCustomPrintModal: React.FC<ProductCustomPrintModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(10);
  const [hasCustomPrint, setHasCustomPrint] = useState<boolean>(true);
  const [printNote, setPrintNote] = useState<string>('Ürüne özel baskı ilavesi yapılacaktır');
  const [printType, setPrintType] = useState<string>(product.printTechniques[0] || 'Sıcak Transfer (DTF)');
  const [printLocation, setPrintLocation] = useState<string>(product.printLocationDefault);
  const [logoText, setLogoText] = useState<string>('METE KIRTASİYE');

  if (!isOpen) return null;

  const unitPrice = product.wholesalePrice;
  const totalNet = unitPrice * quantity;
  const totalVat = totalNet * 0.2;
  const grandTotal = totalNet + totalVat;

  const handleConfirm = () => {
    onAddToCart(product, quantity, hasCustomPrint, printNote, printType, printLocation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#182133] border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-scaleIn">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Özel Baskı & Mock-up Yapılandırması</h3>
              <p className="text-xs text-slate-400 font-mono">{product.sku} · {product.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {/* Live Mockup Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {/* Dynamic Mockup Stamp */}
              {hasCustomPrint && (
                <div className="absolute inset-x-2 bottom-3 bg-slate-950/90 border border-amber-500/60 rounded-lg p-1.5 text-center shadow-2xl backdrop-blur-xs">
                  <div className="text-[9px] font-black text-amber-300 tracking-wider uppercase">
                    {logoText}
                  </div>
                  <div className="text-[7px] text-slate-400 uppercase font-semibold">Özel Kurumsal Baskı</div>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1.5 text-center sm:text-left">
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {product.categoryLabel}
              </div>
              <h4 className="font-bold text-white text-sm">{product.title}</h4>
              <p className="text-slate-400 text-[11px]">{product.description}</p>
              <div className="font-mono text-amber-400 font-bold text-sm pt-1">
                Birim Fiyat: {product.wholesalePrice.toFixed(2)} ₺ + KDV
              </div>
            </div>
          </div>

          {/* Custom Print Switch & Form */}
          <div className="border border-amber-500/40 rounded-2xl bg-gradient-to-br from-amber-950/20 to-slate-900 p-4 space-y-3.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCustomPrint}
                onChange={(e) => setHasCustomPrint(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <span className="font-bold text-white text-sm">
                Ürün Modeli Baz Alınacak, Üzerine Mete Kırtasiye / Firma Özel Baskısı İlave Edilecektir
              </span>
            </label>

            {hasCustomPrint && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1">
                    Özel Not / Baskı Talebi Detayı:
                  </label>
                  <input
                    type="text"
                    value={printNote}
                    onChange={(e) => setPrintNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-white font-bold text-xs focus:outline-none focus:border-amber-400"
                    placeholder="Ürüne özel baskı ilavesi yapılacaktır"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Baskı Tekniği:
                    </label>
                    <select
                      value={printType}
                      onChange={(e) => setPrintType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    >
                      {product.printTechniques.map((tech) => (
                        <option key={tech} value={tech}>{tech}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Baskı Konumu:
                    </label>
                    <input
                      type="text"
                      value={printLocation}
                      onChange={(e) => setPrintLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Mock-up Üzerinde Görünen Marka / İsim:
                  </label>
                  <input
                    type="text"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-white block">Sipariş / Teklif Adedi:</span>
              <span className="text-[11px] text-slate-400">Asgari sipariş: {product.minOrderQty} Adet</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 5))}
                  className="px-3 py-2 text-slate-300 hover:text-white"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 5)}
                  className="px-3 py-2 text-slate-300 hover:text-white"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => setQuantity(10)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold ${
                  quantity === 10 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                10 Adet
              </button>
              <button
                type="button"
                onClick={() => setQuantity(50)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold ${
                  quantity === 50 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                50 Adet
              </button>
            </div>
          </div>

          {/* Total Calculation */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Ara Toplam ({quantity} Adet x {unitPrice.toFixed(2)} ₺):</span>
              <span>{totalNet.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>KDV (%20):</span>
              <span>{totalVat.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
              <span>Genel Tutar:</span>
              <span className="text-amber-400 text-base">
                {grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-700 bg-slate-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Önizleme Kaydını Oluştur & Sepete {quantity} Adet Ekle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
