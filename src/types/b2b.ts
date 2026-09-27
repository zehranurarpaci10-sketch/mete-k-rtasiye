export interface B2BCustomPrintConfig {
  hasCustomPrint: boolean;
  printNote: string; // e.g. "Ürüne özel baskı ilavesi yapılacaktır"
  printType: 'Sıcak Transfer Baskı (DTF)' | 'Serigrafi Baskı' | 'Nakış Arma' | 'UV Renkli Baskı' | 'Reflektif Baskı';
  logoFileName: string;
  printLocation: string; // e.g. "Ön Cep Üstü - Merkez", "Sağ Yan Bölme", "Sırt Şeridi"
  unitPrintFee: number; // Toptan baskı birim ücreti (örn: 0 veya 25 TL)
  firmName: string;
}

export interface B2BProduct {
  id: string;
  code: string; // Stok Kodu (e.g. DERYA-FBR-01)
  barcode: string;
  title: string;
  brand: string;
  category: string;
  vatRate: number; // 10 or 20
  listPrice: number; // Tavsiye Edilen Satış Fiyatı (KDV Hariç)
  discountRate: number; // % İskonto
  netPrice: number; // Bayi Net Alış Fiyatı (KDV Hariç)
  netPriceWithVat: number; // KDV Dahil Net Tutar
  stockStatus: 'in_stock' | 'critical' | 'out_of_stock';
  stockQuantity: number;
  boxQuantity: number; // Kutu İçi Adet
  caseQuantity: number; // Koli İçi Adet
  minOrderQty: number;
  unit: string;
  imageUrl: string;
  supportsCustomPrint?: boolean; // Özel kurumsal baskı yapılabilir mi
  customPrintBadge?: string; // Örn: 'Baskıya Uygun Model'
}

export interface B2BOrderItem {
  code: string;
  barcode: string;
  title: string;
  brand: string;
  orderedQty: number;
  shippedQty: number;
  remainingQty: number;
  unitPrice: number;
  discountRate: number;
  vatRate: number;
  netPrice: number;
  totalNet: number;
  customPrint?: B2BCustomPrintConfig;
}

export interface B2BOrder {
  id: string;
  orderDate: string;
  documentNo: string;
  itemCount: number;
  totalGrossAmount: number;
  totalDiscountAmount: number;
  totalVatAmount: number;
  totalNetAmount: number;
  shippedNetAmount: number;
  remainingNetAmount: number;
  status: 'Onaylandı' | 'Hazırlanıyor' | 'Sevk Edildi' | 'Faturalandı' | 'Teslim Edildi' | 'İptal Edildi';
  carrier: string;
  trackingNo: string;
  paymentType: 'Cari Hesap' | 'Kredi Kartı (Sanal POS)' | 'Vadeli Çek';
  items: B2BOrderItem[];
  notes?: string;
  invoiceAddress?: string;
  customPrintDetails?: string;
  orderSource?: string;
}

export interface B2BCariAccount {
  dealerTitle: string;
  dealerCode: string;
  taxOffice: string;
  taxNumber: string;
  address: string;
  phone: string;
  email: string;
  riskLimit: number;
  currentBalance: number; // Pozitif: Borç, Negatif: Alacak
  availableLimit: number;
  overdueAmount: number;
  pendingOrdersAmount: number;
  lastPaymentDate: string;
  lastPaymentAmount: number;
}

export interface B2BCariMovement {
  id: string;
  date: string;
  docType: 'Toptan Satış Faturası' | 'Kredi Kartı Tahsilatı' | 'Banka Havalesi' | 'İade Faturası' | 'Çek Girişi';
  docNo: string;
  debt: number; // Borç
  credit: number; // Alacak
  balance: number; // Bakiye
  description: string;
}

export interface B2BCartItem {
  product: B2BProduct;
  quantity: number;
  packType: 'adet' | 'kutu' | 'koli';
  totalUnits: number;
  itemNetTotal: number;
  customPrint?: B2BCustomPrintConfig;
}

export interface BankInstallmentOption {
  bankName: string;
  bankLogo: string;
  installments: {
    count: number;
    monthlyAmount: number;
    totalAmount: number;
    rate: number;
  }[];
}
