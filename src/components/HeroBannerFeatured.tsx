import React, { useState } from 'react';
import { Check } from 'lucide-react';

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
      title: 'A4 Fotokopi Kağıdı',
      desc: '80 gr kaliteli A4 kağıdı.',
      price: '120 TL',
    },
    {
      id: 'f2',
      title: 'Defter',
      desc: 'Okul için kaliteli defter.',
      price: '45 TL',
    },
    {
      id: 'f3',
      title: 'Tükenmez Kalem',
      desc: 'Mavi tükenmez kalem.',
      price: '15 TL',
    },
    {
      id: 'f4',
      title: 'Klasör',
      desc: 'Dayanıklı arşiv klasörü.',
      price: '55 TL',
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
    <div className="w-full bg-[#f8f9fa] pt-6 sm:pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Kullanıcının Görselindeki Birebir Banner */}
        <div className="w-full rounded-2xl bg-linear-to-r from-[#441a1f] via-[#852227] to-[#f43f2d] p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-xl relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 font-heading">
              Okula dönüş başladı!
            </h1>
            <p className="text-sm sm:text-base text-white/90 mb-6 font-normal leading-relaxed">
              Kırtasiye ürünleri, uygun fiyat ve hızlı baskı hizmeti.
            </p>
            <button
              onClick={onExploreCampaigns}
              className="bg-[#f43f2d] hover:bg-[#d93424] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Kampanyaları Gör</span>
            </button>
          </div>
        </div>

        {/* Görseldeki "Öne Çıkan Ürünler" Başlığı ve 4 Kart */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-5 font-heading">
            Öne Çıkan Ürünler
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredList.map((item) => {
              const isAdded = addedItems[item.id];

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-slate-100 flex flex-col justify-between transition-all"
                >
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5 font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="text-xl font-black text-[#f43f2d] mb-5">
                      {item.price}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdd(item.title, item.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
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
                      <span>Sepete Ekle</span>
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
