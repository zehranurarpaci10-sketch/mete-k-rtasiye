export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  popularItems: string[];
  searchKeywords: string[];
  erpCode: string;
  itemCount: number;
}

export interface MainCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  shortDescription: string;
  targetPersonas: ('veli' | 'ogrenci' | 'ofis' | 'ogretmen' | 'sanatci')[];
  badge?: string;
  subCategories: SubCategory[];
  featuredBrands: string[];
  bannerText: string;
  bannerCta: string;
}

export interface ScenarioButton {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  targetPersona: string;
  personaIcon: string;
  targetCategoryIds: string[];
  avgClicksToBasket: number;
  whyCrucial: string;
  sampleItems: { name: string; price: number; brand: string }[];
}

export interface ExcelColumnDefinition {
  field: string;
  label: string;
  required: boolean;
  type: string;
  example: string;
  description: string;
  validationRule: string;
}

export interface ProductCatalogRow {
  barcode: string;
  sku: string;
  title: string;
  mainCategory: string;
  subCategory: string;
  subCategoryLevel3: string;
  brand: string;
  priceWithVat: number;
  discountPrice?: number;
  vatRate: number;
  stock: number;
  currency: string;
  imageUrl: string;
  status: 'Aktif' | 'Pasif';
  tags: string;
  unit: string;
}

export interface UserJourney {
  id: string;
  personaName: string;
  personaRole: string;
  avatarBg: string;
  scenario: string;
  targetProduct: string;
  oldWebsiteClicks: number;
  newDesignClicks: number;
  steps: {
    clickNumber: number;
    action: string;
    screen: string;
    duration: string;
  }[];
  benefit: string;
}

export interface CartItem {
  barcode: string;
  sku?: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  imageUrl: string;
  stock?: number;
  addedAt?: number;
}

export interface ShipmentOrder {

  id: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  destinationType: 'home' | 'customer' | 'branch';
  items: {
    title: string;
    quantity: number;
    barcode: string;
    price: number;
  }[];
  status: 'Hazırlanıyor' | 'Kargoya Verildi' | 'Yolda' | 'Teslim Edildi';
  carrier: 'Trendyol Express' | 'Yurtiçi Kargo' | 'Aras Kargo' | 'PTT Kargo';
  trackingNumber: string;
  createdAt: string;
  desi: number;
  notes?: string;
}

export interface PrintJobOrder {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  fileName: string;
  fileSize?: string;
  filePreviewUrl?: string;
  fileTextSnippet?: string;
  pageCount: number;
  copies: number;
  colorMode: 'Siyah-Beyaz' | 'Renkli';
  paperSize: 'A4' | 'A3';
  paperWeight?: '80 gr Standart' | '100 gr Kalın' | '160 gr Kuşe / Karton';
  sided: 'Tek Yüz' | 'Çift Yüz (Arkalı Önlü)';
  binding: 'Zımbalı' | 'Plastik Spiral' | 'Tel Spiral' | 'Ciltli / Tez Cilt';
  notes?: string;
  deliveryMethod: 'Mağazadan Teslim' | 'Evime / Adrese Kargo';
  shippingAddress?: string;
  totalPrice: number;
  status: 'Kuyrukta (Bekliyor)' | 'Yazdırılıyor 🖨️' | 'Ciltleniyor' | 'Hazır (Teslim Bekliyor)' | 'Kargoya Verildi' | 'Tamamlandı';
  createdAt: string;
  isOwnerJob?: boolean;
}


