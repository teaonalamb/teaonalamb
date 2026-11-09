import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playRetroClick, playChime } from '../audio';
import rawMerchProducts from '../merch-products.json';

export interface FourthwallVariant {
  name: string;
  price: number;
  url: string;
  inStock: boolean;
}

export interface MerchItem {
  id: string;
  slug: string;
  name: string;
  category: 'Apparel' | 'Desk Mats' | 'Stickers & Accessories';
  tag: string;
  price: number;
  currency: string;
  images: string[];
  description: string;
  fourthwallUrl: string;
  variants: FourthwallVariant[];
  details: string[];
}

const MERCH_PRODUCTS: MerchItem[] = (rawMerchProducts as MerchItem[]) || [];

interface MerchShelfProps {
  soundEnabled: boolean;
}

export const MerchShelf: React.FC<MerchShelfProps> = ({ soundEnabled }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<MerchItem | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [bagItems, setBagItems] = useState<Array<{ product: MerchItem; variant: FourthwallVariant }>>([]);
  const [showToast, setShowToast] = useState<string | null>(null);

  const categories = ['All', 'Apparel', 'Desk Mats', 'Stickers & Accessories'];

  const filteredItems =
    activeCategory === 'All'
      ? MERCH_PRODUCTS
      : MERCH_PRODUCTS.filter((item) => item.category === activeCategory);

  const handleOpenProduct = (product: MerchItem) => {
    playRetroClick(soundEnabled);
    setSelectedProduct(product);
    setSelectedVariantIndex(0);
    setSelectedImageIndex(0);
  };

  const handleAddToBag = (product: MerchItem, variant: FourthwallVariant) => {
    playChime(soundEnabled);
    setBagItems((prev) => [...prev, { product, variant }]);
    setShowToast(`Added "${product.name} (${variant.name})" to your bag!`);
    setTimeout(() => setShowToast(null), 3500);
  };

  const currentVariant = selectedProduct?.variants[selectedVariantIndex] || selectedProduct?.variants[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Official Store Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#eaf1fb] via-white to-[#f5f8fd] border-2 border-[#b5c9ea] shadow-[0_4px_0_rgba(9,50,144,0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">♡</span>
            <h2 className="font-pixel text-xl sm:text-2xl text-[#093290] font-bold">
              Tea&apos;s Fourthwall Merch Room
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#33477f] font-sans-clean mt-1">
            Official apparel, desk mats, embroidered hats, and stickers pulled live from Fourthwall. Orders ship worldwide.
          </p>
        </div>

        {/* Action Buttons: Direct Fourthwall Storefront + Shopping Bag */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#b5c9ea] text-xs font-pixel text-[#0D1D56] shadow-xs flex items-center gap-2">
            <span>🛍️</span>
            <span>Bag: {bagItems.length} items</span>
          </div>

          <a
            href="https://teaonalamb-shop.fourthwall.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playRetroClick(soundEnabled)}
            className="px-4 py-2 rounded-xl bg-[#093290] text-white font-pixel text-xs font-bold shadow-[0_3px_0_#000425] hover:bg-[#4974C1] transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Visit Fourthwall Store ↗</span>
          </a>
        </div>
      </div>

      {/* Bag Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-pixel flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span>✦</span>
              <span>{showToast}</span>
            </div>
            {currentVariant && (
              <a
                href={currentVariant.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-[#093290] hover:text-[#4974C1] ml-2 shrink-0"
              >
                Checkout on Fourthwall ↗
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-pixel">
        <span className="text-[#5E778C] mr-1 hidden sm:inline">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playRetroClick(soundEnabled);
              setActiveCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#093290] text-white border-[#093290] font-bold shadow-sm'
                : 'bg-white text-[#33477f] border-[#b5c9ea] hover:bg-[#eaf1fb]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border-2 border-[#b5c9ea] bg-white overflow-hidden shadow-[0_6px_0_rgba(9,50,144,0.1)] flex flex-col justify-between"
          >
            {/* Header Strip */}
            <div className="px-3.5 py-1.5 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white font-pixel text-xs flex items-center justify-between">
              <span className="truncate">{item.category}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">
                {item.tag}
              </span>
            </div>

            {/* Product Image */}
            <div
              onClick={() => handleOpenProduct(item)}
              className="p-5 bg-gradient-to-b from-[#f9fbff] to-white flex items-center justify-center relative min-h-[220px] max-h-[240px] border-b border-[#eaf1fb] cursor-pointer group overflow-hidden"
            >
              <img
                src={item.images[0] || '/sheep-tea.png'}
                alt={item.name}
                loading="lazy"
                className="max-h-48 max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white font-pixel text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                Click to inspect
              </span>
            </div>

            {/* Card Content & Pricing */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-pixel text-base text-[#0D1D56] font-bold leading-snug">
                    {item.name}
                  </h3>
                  <span className="font-pixel text-base font-bold text-[#093290] shrink-0">
                    ${item.price}
                  </span>
                </div>

                <p className="text-xs text-[#5E778C] font-sans-clean leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                <div className="mt-2 text-[11px] text-[#4974C1] font-mono">
                  {item.variants.length > 1
                    ? `★ ${item.variants.length} variant options`
                    : '★ Standard edition'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#eaf1fb]">
                <button
                  onClick={() => handleOpenProduct(item)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#b5c9ea] hover:bg-[#eaf1fb] text-[#093290] font-pixel text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Options
                </button>

                <a
                  href={item.variants[0]?.url || item.fourthwallUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playRetroClick(soundEnabled)}
                  className="px-4 py-2 rounded-lg bg-[#093290] hover:bg-[#4974C1] text-white font-pixel text-xs font-bold shadow-[0_2px_0_#000425] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Buy Direct ↗</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Quick View & Variant Picker Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl rounded-2xl border-2 border-[#093290] bg-white overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col"
            >
              {/* Window Header */}
              <div className="px-4 py-2 bg-gradient-to-r from-[#093290] to-[#5870B3] text-white flex items-center justify-between font-pixel text-xs shrink-0">
                <span className="flex items-center gap-1.5">
                  <span>♡</span>
                  <span>fourthwall_store.exe</span>
                </span>
                <button
                  onClick={() => {
                    playRetroClick(soundEnabled);
                    setSelectedProduct(null);
                  }}
                  className="px-2 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 font-sans-clean">
                {/* Image Gallery */}
                <div className="space-y-2">
                  <div className="p-4 bg-[#f5f8fd] rounded-2xl border border-[#b5c9ea] flex items-center justify-center min-h-[220px] max-h-[280px]">
                    <img
                      src={selectedProduct.images[selectedImageIndex] || selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="max-h-60 max-w-full object-contain drop-shadow-md"
                    />
                  </div>

                  {/* Thumbnail Row */}
                  {selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedProduct.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            playRetroClick(soundEnabled);
                            setSelectedImageIndex(idx);
                          }}
                          className={`w-14 h-14 rounded-lg border-2 overflow-hidden shrink-0 cursor-pointer p-1 bg-white ${
                            selectedImageIndex === idx
                              ? 'border-[#093290] shadow-sm'
                              : 'border-[#b5c9ea] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Title & Live Variant Price */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-pixel text-xl sm:text-2xl text-[#093290] font-bold">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-xs text-[#4974C1] font-pixel mt-0.5">
                        {selectedProduct.category} ★ {selectedProduct.tag}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="font-pixel text-2xl font-bold text-[#0D1D56]">
                        ${currentVariant ? currentVariant.price : selectedProduct.price}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-pixel font-bold">
                        ● Direct Fourthwall Checkout
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#33477f] leading-relaxed mt-2.5">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Variant Options Picker */}
                {selectedProduct.variants.length > 1 && (
                  <div className="p-3.5 rounded-xl bg-[#eaf1fb] border border-[#b5c9ea] space-y-2">
                    <label className="block text-xs font-pixel text-[#0D1D56] font-bold">
                      Select Variant or Size ({selectedProduct.variants.length} available):
                    </label>
                    <select
                      value={selectedVariantIndex}
                      onChange={(e) => {
                        playRetroClick(soundEnabled);
                        setSelectedVariantIndex(parseInt(e.target.value, 10));
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#b5c9ea] text-xs font-mono text-[#0D1D56] focus:outline-none focus:ring-2 focus:ring-[#093290] cursor-pointer"
                    >
                      {selectedProduct.variants.map((variant, vIdx) => (
                        <option key={vIdx} value={vIdx}>
                          {variant.name} (${variant.price} USD)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Product Specifications */}
                <div className="p-3 bg-white rounded-xl border border-[#b5c9ea] space-y-1 text-xs text-[#0D1D56] font-mono">
                  {selectedProduct.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-1.5">
                      <span className="text-[#4974C1]">★</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Purchase Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (currentVariant) {
                        handleAddToBag(selectedProduct, currentVariant);
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border-2 border-[#b5c9ea] hover:bg-[#eaf1fb] text-[#093290] font-pixel text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Add to Bag
                  </button>

                  <a
                    href={currentVariant?.url || selectedProduct.fourthwallUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playRetroClick(soundEnabled)}
                    className="flex-1 w-full px-5 py-2.5 rounded-xl bg-[#093290] hover:bg-[#4974C1] text-white font-pixel text-xs font-bold shadow-[0_3px_0_#000425] transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <span>Purchase on Fourthwall (${currentVariant ? currentVariant.price : selectedProduct.price}) ↗</span>
                  </a>
                </div>

                <p className="text-[11px] text-center text-[#5E778C] font-mono">
                  Official merchandise powered by Fourthwall. Secure checkout with Apple Pay, Google Pay, PayPal, and credit cards.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
