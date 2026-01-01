"use client";

import { Suspense, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Loader2,
  Check,
  AlertCircle,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

// Shipping options with prices in PLN (brutto)
const shippingOptions = [
  {
    id: "inpost",
    name: "InPost Paczkomaty",
    description: "Dostawa do paczkomatu 24-48h",
    price: 18,
    icon: Package,
  },
  {
    id: "gls",
    name: "GLS Kurier",
    description: "Dostawa kurierem 24-48h",
    price: 24,
    icon: Truck,
  },
];

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

function CheckoutContent() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  const { items, getTotalPrice, clearCart } = useCart();
  const { formatPrice } = useCurrency();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");
  const [selectedShipping, setSelectedShipping] = useState("inpost");

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Poland",
  });

  const subtotal = getTotalPrice();
  const freeShippingThreshold = 500;
  const selectedShippingOption = shippingOptions.find(s => s.id === selectedShipping);
  const shipping = subtotal >= freeShippingThreshold ? 0 : (selectedShippingOption?.price || 18);
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const validateShipping = () => {
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "postalCode"];
    for (const field of required) {
      if (!shippingForm[field as keyof ShippingForm]) {
        setError(`Please fill in all required fields`);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handleCheckout = async () => {
    if (!validateShipping()) return;

    setIsProcessing(true);
    setError("");

    try {
      if (paymentMethod === "stripe") {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              variant: item.variant,
            })),
            shippingAddress: shippingForm,
          }),
        });

        const data = await response.json();

        if (data.url) {
          clearCart();
          window.location.href = data.url;
        } else {
          throw new Error(data.error || "Failed to create checkout session");
        }
      } else {
        // Cash on delivery
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              variant: item.variant,
            })),
            shippingAddress: shippingForm,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          clearCart();
          router.push(`/${locale}/checkout/success?orderId=${data.id}`);
        } else {
          throw new Error(data.error || "Failed to create order");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !canceled) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Your cart is empty</h1>
        <Link href={`/${locale}/products`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-neutral-900 text-white font-semibold rounded-xl"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/cart`}
              className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mt-4">{t("title")}</h1>

          {/* Steps */}
          <div className="flex items-center gap-4 mt-6">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-neutral-900" : "text-neutral-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? "bg-neutral-900 text-white" : "bg-neutral-200"
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className="font-medium">{t("shippingInfo")}</span>
            </div>
            <div className="flex-1 h-px bg-neutral-200" />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-neutral-900" : "text-neutral-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? "bg-neutral-900 text-white" : "bg-neutral-200"
              }`}>
                2
              </div>
              <span className="font-medium">{t("paymentInfo")}</span>
            </div>
          </div>
        </div>
      </div>

      {canceled && (
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-700">Payment was canceled. Please try again.</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                {error}
              </div>
            )}

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  {t("shippingInfo")}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingForm.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingForm.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingForm.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingForm.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={shippingForm.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="Poland">Poland</option>
                      <option value="Germany">Germany</option>
                      <option value="Spain">Spain</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Czech Republic">Czech Republic</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleContinueToPayment}
                  className="w-full mt-6 py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800"
                >
                  Continue to Payment
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t("paymentInfo")}
                </h2>

                <div className="space-y-4">
                  <button
                    onClick={() => setPaymentMethod("stripe")}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
                      paymentMethod === "stripe"
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6" />
                        <div>
                          <p className="font-medium">Credit / Debit Card</p>
                          <p className="text-sm text-neutral-500">Secure payment via Stripe</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        paymentMethod === "stripe" ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                      }`}>
                        {paymentMethod === "stripe" && (
                          <Check className="w-full h-full text-white p-0.5" />
                        )}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
                      paymentMethod === "cod"
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck className="w-6 h-6" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-neutral-500">Pay when you receive the order</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        paymentMethod === "cod" ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                      }`}>
                        {paymentMethod === "cod" && (
                          <Check className="w-full h-full text-white p-0.5" />
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-4 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t("processing")}
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        {t("placeOrder")} - {formatPrice(total)}
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-6">{t("orderSummary")}</h2>

              <div className="space-y-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-neutral-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-sm text-neutral-500">Ilość: {item.quantity}</p>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Selection */}
              <div className="border-t border-neutral-200 mt-4 pt-4">
                <h3 className="text-sm font-medium text-neutral-700 mb-3">Dostawa</h3>
                <div className="space-y-2">
                  {shippingOptions.map((option) => {
                    const Icon = option.icon;
                    const isFree = subtotal >= freeShippingThreshold;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedShipping(option.id)}
                        className={`w-full p-2.5 rounded-lg border transition-all text-left flex items-center gap-2 ${
                          selectedShipping === option.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${
                          selectedShipping === option.id ? "text-blue-600" : "text-neutral-500"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{option.name}</p>
                        </div>
                        <span className="text-sm font-medium">
                          {isFree ? (
                            <span className="text-green-600">Gratis</span>
                          ) : (
                            formatPrice(option.price)
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-neutral-200 mt-4 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">{tCart("subtotal")}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">{tCart("shipping")}</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Gratis</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>VAT 23% (zawarty w cenie)</span>
                  <span>Ceny brutto</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-neutral-200">
                  <span>{tCart("total")}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-neutral-500">
                <Shield className="w-4 h-4" />
                <span>Bezpieczne płatności przez Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="animate-pulse space-y-6 max-w-6xl w-full px-6">
        <div className="h-8 bg-neutral-200 rounded-lg w-48" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 h-96" />
          <div className="bg-white rounded-2xl p-6 h-64" />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
