"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Package } from "lucide-react";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";

const localTranslations = {
  es: {
    orderSummary: "Resumen del pedido",
    selectDelivery: "Selecciona envío",
    freeShippingMessage: "Añade {amount} más para envío gratis",
    vatIncluded: "IVA 23% (incluido en precio)",
    grossPrices: "Precios brutos",
    securePayments: "Pagos seguros",
    deliveryPartners: "Socios de envío",
    clearCart: "Vaciar carrito",
    perUnit: "/ ud.",
    free: "Gratis",
    inpostName: "InPost Casilleros",
    inpostDesc: "Entrega en casillero 24-48h",
    glsName: "GLS Mensajero",
    glsDesc: "Entrega por mensajero 24-48h",
    viewCart: "Ver carrito",
    emptyMessage: "Comienza a comprar para añadir artículos a tu carrito",
  },
  en: {
    orderSummary: "Order Summary",
    selectDelivery: "Select delivery",
    freeShippingMessage: "Add {amount} more for free shipping",
    vatIncluded: "VAT 23% (included in price)",
    grossPrices: "Gross prices",
    securePayments: "Secure payments",
    deliveryPartners: "Delivery partners",
    clearCart: "Clear cart",
    perUnit: "/ pc.",
    free: "Free",
    inpostName: "InPost Parcel Lockers",
    inpostDesc: "Delivery to locker 24-48h",
    glsName: "GLS Courier",
    glsDesc: "Courier delivery 24-48h",
    viewCart: "View Cart",
    emptyMessage: "Start shopping to add items to your cart",
  },
  pl: {
    orderSummary: "Podsumowanie zamówienia",
    selectDelivery: "Wybierz dostawę",
    freeShippingMessage: "Dodaj jeszcze {amount} do darmowej dostawy!",
    vatIncluded: "VAT 23% (zawarty w cenie)",
    grossPrices: "Ceny brutto",
    securePayments: "Bezpieczne płatności",
    deliveryPartners: "Partnerzy dostawy",
    clearCart: "Wyczyść koszyk",
    perUnit: "/ szt.",
    free: "Gratis",
    inpostName: "InPost Paczkomaty",
    inpostDesc: "Dostawa do paczkomatu 24-48h",
    glsName: "GLS Kurier",
    glsDesc: "Dostawa kurierem 24-48h",
    viewCart: "Zobacz koszyk",
    emptyMessage: "Zacznij zakupy, aby dodać produkty do koszyka",
  },
};

export default function CartPage() {
  const t = useTranslations("cart");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const lt = localTranslations[locale as keyof typeof localTranslations] || localTranslations.en;
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedShipping, setSelectedShipping] = useState("inpost");

  // Dynamic shipping options based on locale
  const shippingOptions = [
    {
      id: "inpost",
      name: lt.inpostName,
      description: lt.inpostDesc,
      price: 18,
      icon: Package,
    },
    {
      id: "gls",
      name: lt.glsName,
      description: lt.glsDesc,
      price: 24,
      icon: Truck,
    },
  ];

  const subtotal = getTotalPrice();
  // Free shipping over 5000 PLN
  const freeShippingThreshold = 5000;
  const selectedShippingOption = shippingOptions.find(s => s.id === selectedShipping);
  const shipping = subtotal >= freeShippingThreshold ? 0 : (selectedShippingOption?.price || 18);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1504px] mx-auto px-6 py-16">
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 text-neutral-200 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">{t("empty")}</h1>
            <p className="text-neutral-500 mb-8">
              {lt.emptyMessage}
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
              >
                {t("continueShopping")}
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-[1504px] mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/products"
              className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("continueShopping")}
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">{t("title")}</h1>
          <p className="text-neutral-500 mt-2">
            {items.length} {t("items")}
          </p>
        </div>
      </div>

      <div className="max-w-[1504px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-6 p-6 bg-neutral-50 rounded-2xl"
                >
                  {/* Image */}
                  <div className="w-32 h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-neutral-300" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {item.brand && (
                          <span className="text-sm text-neutral-500">{item.brand}</span>
                        )}
                        <h3 className="font-semibold text-neutral-900 text-lg">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-sm text-neutral-400 mt-1">{item.variant}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-neutral-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-2.5 text-neutral-400 hover:text-neutral-900 transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-neutral-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-neutral-400">
                            {formatPrice(item.price)} {lt.perUnit}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Clear Cart */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearCart}
                className="text-sm text-neutral-500 hover:text-red-500 transition-colors"
              >
                {lt.clearCart}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">{lt.orderSummary}</h2>

              {/* Shipping Options */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-700 mb-3">{lt.selectDelivery}</h3>
                <div className="space-y-2">
                  {shippingOptions.map((option) => {
                    const Icon = option.icon;
                    const isFree = subtotal >= freeShippingThreshold;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedShipping(option.id)}
                        className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                          selectedShipping === option.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-neutral-200 bg-white hover:border-neutral-300"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          selectedShipping === option.id ? "bg-blue-100" : "bg-neutral-100"
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            selectedShipping === option.id ? "text-blue-600" : "text-neutral-500"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">{option.name}</p>
                          <p className="text-xs text-neutral-500">{option.description}</p>
                        </div>
                        <div className="text-right">
                          {isFree ? (
                            <span className="text-green-600 font-medium">{lt.free}</span>
                          ) : (
                            <span className="font-semibold">{formatPrice(option.price)}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-500">{t("subtotal")}</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{t("shipping")}</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">{lt.free}</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>{lt.vatIncluded}</span>
                  <span>{lt.grossPrices}</span>
                </div>

                {subtotal < freeShippingThreshold && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      {lt.freeShippingMessage.replace("{amount}", formatPrice(freeShippingThreshold - subtotal))}
                    </p>
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("total")}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Link href={`/${locale}/checkout`} className="block mt-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  {t("checkout")}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 text-center">
                <p className="text-xs text-neutral-400 mb-3">{lt.securePayments}</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs font-medium">
                    VISA
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs font-medium">
                    Mastercard
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs font-medium">
                    PayPal
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs font-medium">
                    BLIK
                  </div>
                </div>
              </div>

              {/* Shipping Partners */}
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-xs text-neutral-400 mb-2 text-center">{lt.deliveryPartners}</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="px-3 py-1 bg-yellow-400 rounded text-xs font-bold text-yellow-900">
                    InPost
                  </div>
                  <div className="px-3 py-1 bg-blue-600 rounded text-xs font-bold text-white">
                    GLS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
