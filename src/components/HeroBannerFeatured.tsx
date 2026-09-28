import React, { useState } from 'react';
import { Check, Star, ShoppingCart, Sparkles, ArrowRight } from 'lucide-react';

interface HeroBannerFeaturedProps {
  onAddToCart: (productTitle: string) => void;
  onExploreCampaigns: () => void;
}

export const HeroBannerFeatured: React.FC<HeroBannerFeaturedProps> = ({
  onAddToCart,
  onExploreCampaigns,
}) => {
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

  const featuredList = [
    {
      id: 'f1',
      title: 'Copier Bond A4 80 gr Fotokopi Kağıdı (500 Yaprak)',
      brand: 'Copier Bond',
      desc: 'Yüksek beyazlık, çift taraflı baskıya uygun lazer ve mürekkep püskürtmeli uyumlu.',
      price: '145 TL',
      oldPrice: '175 TL',
      rating: 4.9,
      reviewCount: 342,
      tag: 'Çok Satan',
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'f2',
      title: 'Gıpta Sert Kapak 80 Yaprak A4 Spiralli Kareli Defter',
      brand: 'Gıpta',
      desc: 'Mürekkep dağıtmayan 80 gr kaliteli hamur kağıt, mikroperfore koparılabilir sayfalar.',
      price: '65 TL',
      oldPrice: '85 TL',
      rating: 4.8,
      reviewCount: 189,
      tag: 'Öğrenci Favorisi',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'f3',
      title: 'Rotring Tikky 0.7mm Bordo Mekanik Versatil Kalem',
      brand: 'Rotring',
      desc: 'Ergonomik kauçuk tutma yeri, pirinç iç mekanizma ile kırılmayan kurşun ucu.',
      price: '145 TL',
      oldPrice: '180 TL',
      rating: 5.0,
      reviewCount: 520,
      tag: 'Efsane Klasik',
      image: 'https://images.unsplash.com/photo-1585336261026-62c72b220374?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'f4',
      title: 'Leitz Geniş Mekanizmalı Dayanıklı Arşiv Klasörü A4',
      brand: 'Leitz',
      desc: '180 derece patentli açılır mekanizma, güçlendirilmiş metal kenarlıklar.',
      price: '78 TL',
      oldPrice: '99 TL',
      rating: 4.7,
      reviewCount: 94,
      tag: 'Ofis Temel',
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80',
    },
  ];

  const handleAdd = (title: string, id: string) => {
    onAddToCart(title);
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="w-full bg-[#f8f9fa] pt-4 sm:pt-6 pb-2">
      <div className="max-w-7xl mx-auto px-4">
        {/* Kullanıcının Görselindeki Birebir Banner */}
        <div className="w-full rounded-3xl bg-linear-to-r from-[#3e1418] via-[#7e1c22] to-[#f43f2d] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Arka plan dekoratif daireler */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 right-24 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Yeni Sezon & Okula Dönüş Fırsatları</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 font-heading leading-tight">
              Okula dönüş başladı!
            </h1>
            <p className="text-sm sm:text-base text-rose-100 mb-6 font-normal leading-relaxed">
              Orijinal marka kırtasiye ürünleri, en uygun perakende fiyatları ve 1 dakikada online fotokopi & baskı hizmeti tek adreste.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreCampaigns}
                className="bg-white hover:bg-rose-50 text-[#f43f2d] px-6 py-3 rounded-xl font-black text-xs sm:text-sm shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
              >
                <span>Özel Paketleri İncele</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#vitrin"
                className="bg-black/30 hover:bg-black/40 text-white border border-white/30 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Tüm Reyonları Gez</span>
              </a>
            </div>
          </div>
        </div>

        {/* Görseldeki "Öne Çıkan Ürünler" Başlığı ve 4 Fotoğraflı Kart */}
        <div className="mt-8 mb-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                Öne Çıkan Ürünler
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mete Kırtasiye müşterilerinin bu hafta en çok tercih ettiği 4 favori ürün
              </p>
            </div>

            <a
              href="#vitrin"
              className="text-xs font-bold text-[#f43f2d] hover:text-[#d93424] flex items-center gap-1"
            >
              <span>Tümünü Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredList.map((item) => {
              const isAdded = addedItems[item.id];

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-100 flex flex-col justify-between transition-all group hover:border-rose-100"
                >
                  <div>
                    {/* Ürün Görseli */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-3.5 flex items-center justify-center border border-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-[#f43f2d] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                        {item.tag}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {item.brand}
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 mb-1 font-heading line-clamp-2 leading-snug group-hover:text-[#f43f2d] transition-colors">
                      {item.title}
                    </h3>

                    {/* Rating & Review */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-800 ml-1">
                          {item.rating}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        ({item.reviewCount})
                      </span>
                    </div>

                    {/* Fiyatlar */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-lg font-black text-[#f43f2d]">
                        {item.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {item.oldPrice}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdd(item.title, item.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#f43f2d] hover:bg-[#d93424] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Sepete Eklendi</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Sepete Ekle</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
