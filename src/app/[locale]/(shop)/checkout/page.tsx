"use client";

import { Suspense, useState, useRef, useCallback } from "react";
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
  Banknote,
  Building2,
  Search,
  MapPin,
  X,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";

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
  companyName: string;
  vatNumber: string;
  paczkomatId: string;
  paczkomatAddress: string;
}

interface VatValidation {
  isValid: boolean;
  isIntraCommunity: boolean;
  vatExempt: boolean;
  companyName?: string;
  companyAddress?: string;
  message?: string;
  isValidating: boolean;
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
  const [paymentMethod, setPaymentMethod] = useState<"przelewy24" | "cod">("przelewy24");
  const [selectedShipping, setSelectedShipping] = useState("inpost");
  const [isBusinessPurchase, setIsBusinessPurchase] = useState(false);
  const [vatValidation, setVatValidation] = useState<VatValidation>({
    isValid: false,
    isIntraCommunity: false,
    vatExempt: false,
    isValidating: false,
  });

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Poland",
    companyName: "",
    vatNumber: "",
    paczkomatId: "",
    paczkomatAddress: "",
  });
  const [showPaczkomatSearch, setShowPaczkomatSearch] = useState(false);
  const [paczkomatSearchQuery, setPaczkomatSearchQuery] = useState("");
  const [paczkomatResults, setPaczkomatResults] = useState<Array<{id: string; name: string; address: string; city: string; description?: string; postCode?: string; distance?: number}>>([]);
  const [isSearchingPaczkomat, setIsSearchingPaczkomat] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const subtotalNet = getTotalPrice(); // Prices are now net (without VAT)
  const vatRate = 0.23;
  const subtotalVat = vatValidation.vatExempt ? 0 : subtotalNet * vatRate;
  const subtotalGross = subtotalNet + subtotalVat;
  // Free shipping over 5000 PLN (gross)
  const freeShippingThreshold = 5000;
  const selectedShippingOption = shippingOptions.find(s => s.id === selectedShipping);
  const baseShippingNet = subtotalGross >= freeShippingThreshold ? 0 : (selectedShippingOption?.price || 18);
  const codFeeNet = paymentMethod === "cod" ? 10 : 0; // COD fee (net)
  const shippingNet = baseShippingNet + codFeeNet;
  const shippingVat = vatValidation.vatExempt ? 0 : shippingNet * vatRate;
  const totalNet = subtotalNet + shippingNet;
  const totalVat = subtotalVat + shippingVat;
  const totalGross = totalNet + totalVat;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingForm({ ...shippingForm, [name]: value });

    // Reset VAT validation when VAT number changes
    if (name === "vatNumber") {
      setVatValidation({
        isValid: false,
        isIntraCommunity: false,
        vatExempt: false,
        isValidating: false,
      });
    }
  };

  // Geocode address using OpenStreetMap Nominatim
  const geocodeAddress = async (address: string): Promise<{lat: number; lon: number} | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Poland')}&limit=1`,
        { headers: { 'Accept-Language': 'pl' } }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return null;
  };

  // Search for Paczkomaty using InPost API with geolocation
  const searchPaczkomaty = async (query: string) => {
    if (query.length < 3) {
      setPaczkomatResults([]);
      return;
    }

    setIsSearchingPaczkomat(true);
    try {
      const trimmedQuery = query.trim();

      // First, try to geocode the address to get coordinates
      const coords = await geocodeAddress(trimmedQuery);

      let lockers: Array<{
        id: string;
        name: string;
        address: string;
        city: string;
        description: string;
        postCode: string;
        distance?: number;
      }> = [];

      if (coords) {
        // Search by coordinates - finds nearest Paczkomaty
        const response = await fetch(
          `https://api-pl-points.easypack24.net/v1/points?relative_point=${coords.lat},${coords.lon}&type=parcel_locker&limit=15&status=Operating`
        );

        if (response.ok) {
          const data = await response.json();
          lockers = data.items?.map((item: {
            name: string;
            status: string;
            distance?: number;
            location_description?: string;
            address_details: { city: string; street: string; building_number: string; post_code: string }
          }) => ({
            id: item.name,
            name: item.name,
            address: `${item.address_details.street} ${item.address_details.building_number}`,
            city: item.address_details.city,
            description: item.location_description || '',
            postCode: item.address_details.post_code,
            distance: item.distance,
          })) || [];
        }
      }

      // Fallback: if geocoding failed or no results, try direct city/postal search
      if (lockers.length === 0) {
        const isPostCode = /^\d{2}[-]?\d{3}$/.test(trimmedQuery.replace(/\s/g, ''));
        let searchParams = isPostCode
          ? `post_code=${trimmedQuery.replace(/[-\s]/g, '')}`
          : `city=${encodeURIComponent(trimmedQuery.split(',')[0].split(' ')[0])}`;

        const response = await fetch(
          `https://api-pl-points.easypack24.net/v1/points?${searchParams}&type=parcel_locker&limit=15&status=Operating`
        );

        if (response.ok) {
          const data = await response.json();
          lockers = data.items?.map((item: {
            name: string;
            location_description?: string;
            address_details: { city: string; street: string; building_number: string; post_code: string }
          }) => ({
            id: item.name,
            name: item.name,
            address: `${item.address_details.street} ${item.address_details.building_number}`,
            city: item.address_details.city,
            description: item.location_description || '',
            postCode: item.address_details.post_code,
          })) || [];
        }
      }

      setPaczkomatResults(lockers);
    } catch (error) {
      console.error("Error searching Paczkomaty:", error);
      setPaczkomatResults([]);
    } finally {
      setIsSearchingPaczkomat(false);
    }
  };

  const selectPaczkomat = (paczkomat: {id: string; name: string; address: string; city: string}) => {
    setShippingForm({
      ...shippingForm,
      paczkomatId: paczkomat.id,
      paczkomatAddress: `${paczkomat.name} - ${paczkomat.address}, ${paczkomat.city}`,
    });
    setShowPaczkomatSearch(false);
    setPaczkomatResults([]);
    setPaczkomatSearchQuery("");
  };

  // Debounced search handler
  const handlePaczkomatSearch = useCallback((value: string) => {
    setPaczkomatSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchPaczkomaty(value);
    }, 500); // Wait 500ms after user stops typing
  }, []);

  const validateVatNumber = async () => {
    if (!shippingForm.vatNumber.trim()) {
      setVatValidation({
        isValid: false,
        isIntraCommunity: false,
        vatExempt: false,
        isValidating: false,
        message: "Wprowadź numer VAT",
      });
      return;
    }

    setVatValidation(prev => ({ ...prev, isValidating: true }));

    try {
      const response = await fetch("/api/validate-vat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vatNumber: shippingForm.vatNumber }),
      });

      const data = await response.json();

      setVatValidation({
        isValid: data.isValid,
        isIntraCommunity: data.isIntraCommunity || false,
        vatExempt: data.vatExempt || false,
        companyName: data.name,
        companyAddress: data.address,
        message: data.message || data.error,
        isValidating: false,
      });

      // Auto-fill company name if returned from VIES
      if (data.name && !shippingForm.companyName) {
        setShippingForm(prev => ({ ...prev, companyName: data.name }));
      }
    } catch (err) {
      setVatValidation({
        isValid: false,
        isIntraCommunity: false,
        vatExempt: false,
        isValidating: false,
        message: "Błąd walidacji. Spróbuj ponownie.",
      });
    }
  };

  const validateShipping = () => {
    const required = ["firstName", "lastName", "email", "phone"];

    // For GLS, require full address
    if (selectedShipping === "gls") {
      required.push("address", "city", "postalCode");
    }

    // For InPost, require Paczkomat selection
    if (selectedShipping === "inpost" && !shippingForm.paczkomatId) {
      setError("Wybierz Paczkomat dla dostawy InPost");
      return false;
    }

    for (const field of required) {
      if (!shippingForm[field as keyof ShippingForm]) {
        setError(`Proszę wypełnić wszystkie wymagane pola`);
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
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
        })),
        shippingAddress: shippingForm,
        paymentMethod: paymentMethod === "przelewy24" ? "przelewy24" : "cod",
        shippingCost: shippingNet + shippingVat,
        shippingMethod: selectedShipping, // "inpost" or "gls"
        paczkomatId: selectedShipping === "inpost" ? shippingForm.paczkomatId : undefined,
        paczkomatAddress: selectedShipping === "inpost" ? shippingForm.paczkomatAddress : undefined,
      };

      if (paymentMethod === "przelewy24") {
        // Przelewy24 through Stripe
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (data.url) {
          clearCart();
          window.location.href = data.url;
        } else {
          throw new Error(data.error || "Failed to create checkout session");
        }
      } else {
        // Cash on delivery (COD)
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
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
                      Imię / First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingForm.firstName}
                      onChange={handleInputChange}
                      className="w-full h-[50px] px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nazwisko / Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingForm.lastName}
                      onChange={handleInputChange}
                      className="w-full h-[50px] px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingForm.email}
                      onChange={handleInputChange}
                      className="w-full h-[50px] px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Telefon / Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleInputChange}
                      className="w-full h-[50px] px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Adres / Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingForm.address}
                      onChange={handleInputChange}
                      className="w-full h-[50px] px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Miasto / City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleInputChange}
                      className="w-full h-[50px] px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Kod pocztowy *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingForm.postalCode}
                      onChange={handleInputChange}
                      className="w-full h-[50px] px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Kraj / Country
                    </label>
                    <select
                      name="country"
                      value={shippingForm.country}
                      onChange={handleInputChange}
                      className="w-full h-[50px] px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
                    >
                      <option value="Poland">Polska (PL)</option>
                      <option value="Germany">Niemcy (DE)</option>
                      <option value="Spain">Hiszpania (ES)</option>
                      <option value="France">Francja (FR)</option>
                      <option value="Italy">Włochy (IT)</option>
                      <option value="Netherlands">Holandia (NL)</option>
                      <option value="Czech Republic">Czechy (CZ)</option>
                      <option value="Austria">Austria (AT)</option>
                      <option value="Belgium">Belgia (BE)</option>
                      <option value="Slovakia">Słowacja (SK)</option>
                      <option value="Lithuania">Litwa (LT)</option>
                      <option value="Latvia">Łotwa (LV)</option>
                      <option value="Estonia">Estonia (EE)</option>
                      <option value="Sweden">Szwecja (SE)</option>
                      <option value="Denmark">Dania (DK)</option>
                      <option value="Finland">Finlandia (FI)</option>
                      <option value="Ireland">Irlandia (IE)</option>
                      <option value="Portugal">Portugalia (PT)</option>
                      <option value="Greece">Grecja (EL)</option>
                      <option value="Hungary">Węgry (HU)</option>
                      <option value="Romania">Rumunia (RO)</option>
                      <option value="Bulgaria">Bułgaria (BG)</option>
                      <option value="Croatia">Chorwacja (HR)</option>
                      <option value="Slovenia">Słowenia (SI)</option>
                      <option value="Luxembourg">Luksemburg (LU)</option>
                      <option value="Malta">Malta (MT)</option>
                      <option value="Cyprus">Cypr (CY)</option>
                    </select>
                  </div>
                </div>

                {/* Business Purchase / Company Details */}
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="businessPurchase"
                      checked={isBusinessPurchase}
                      onChange={(e) => setIsBusinessPurchase(e.target.checked)}
                      className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    <label htmlFor="businessPurchase" className="text-sm font-medium text-neutral-700">
                      Zakup na firmę / Faktura VAT
                    </label>
                  </div>

                  {isBusinessPurchase && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Nazwa firmy / Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={shippingForm.companyName}
                          onChange={handleInputChange}
                          placeholder="np. Firma Sp. z o.o."
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          NIP / VAT Number (EU)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="vatNumber"
                            value={shippingForm.vatNumber}
                            onChange={handleInputChange}
                            placeholder="np. PL1234567890 lub ES12345678A"
                            className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          />
                          <button
                            type="button"
                            onClick={validateVatNumber}
                            disabled={vatValidation.isValidating || !shippingForm.vatNumber}
                            className="px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {vatValidation.isValidating ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Sprawdź VIES
                          </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          Wprowadź numer VAT z prefiksem kraju (np. ES, DE, FR)
                        </p>
                      </div>

                      {/* VAT Validation Result */}
                      {vatValidation.message && (
                        <div className={`p-4 rounded-xl flex items-start gap-3 ${
                          vatValidation.vatExempt
                            ? "bg-green-50 border border-green-200"
                            : vatValidation.isValid
                              ? "bg-blue-50 border border-blue-200"
                              : "bg-red-50 border border-red-200"
                        }`}>
                          {vatValidation.vatExempt ? (
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : vatValidation.isValid ? (
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className={`font-medium ${
                              vatValidation.vatExempt
                                ? "text-green-700"
                                : vatValidation.isValid
                                  ? "text-blue-700"
                                  : "text-red-700"
                            }`}>
                              {vatValidation.message}
                            </p>
                            {vatValidation.companyName && (
                              <p className="text-sm text-neutral-600 mt-1">
                                Firma: {vatValidation.companyName}
                              </p>
                            )}
                            {vatValidation.vatExempt && (
                              <p className="text-sm text-green-600 mt-1 font-medium">
                                Transakcja wewnątrzwspólnotowa - VAT 0%
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
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
                  {/* Przelewy24 Option */}
                  <button
                    onClick={() => setPaymentMethod("przelewy24")}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
                      paymentMethod === "przelewy24"
                        ? "border-blue-600 bg-blue-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-white rounded border border-neutral-200 flex items-center justify-center overflow-hidden">
                          <Building2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Przelewy24</p>
                          <p className="text-sm text-neutral-500">Szybki przelew, BLIK, karta płatnicza</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        paymentMethod === "przelewy24" ? "border-blue-600 bg-blue-600" : "border-neutral-300"
                      }`}>
                        {paymentMethod === "przelewy24" && (
                          <Check className="w-full h-full text-white p-0.5" />
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white border border-neutral-200 rounded text-xs font-medium text-neutral-600">BLIK</span>
                      <span className="px-2 py-1 bg-white border border-neutral-200 rounded text-xs font-medium text-neutral-600">Przelew bankowy</span>
                      <span className="px-2 py-1 bg-white border border-neutral-200 rounded text-xs font-medium text-neutral-600">Visa / Mastercard</span>
                    </div>
                  </button>

                  {/* Cash on Delivery Option */}
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
                      paymentMethod === "cod"
                        ? "border-green-600 bg-green-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-green-100 rounded border border-green-200 flex items-center justify-center">
                          <Banknote className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Płatność przy odbiorze</p>
                          <p className="text-sm text-neutral-500">Zapłać gotówką kurierowi</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        paymentMethod === "cod" ? "border-green-600 bg-green-600" : "border-neutral-300"
                      }`}>
                        {paymentMethod === "cod" && (
                          <Check className="w-full h-full text-white p-0.5" />
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      Dodatkowa opłata +10 zł za pobranie
                    </p>
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
                        {t("placeOrder")} - {formatPrice(totalGross)}
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
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.image}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover"
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
                      <p className="font-medium">{formatPrice(item.price * item.quantity)} <span className="text-xs text-neutral-500">+ VAT</span></p>
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
                    const isFree = subtotalGross >= freeShippingThreshold;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedShipping(option.id);
                          if (option.id !== "inpost") {
                            setShippingForm(prev => ({ ...prev, paczkomatId: "", paczkomatAddress: "" }));
                          }
                        }}
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

                {/* Paczkomat Selector for InPost */}
                {selectedShipping === "inpost" && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Wybierz Paczkomat</span>
                    </div>

                    {shippingForm.paczkomatId ? (
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-yellow-300">
                        <MapPin className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">{shippingForm.paczkomatId}</p>
                          <p className="text-xs text-neutral-500 truncate">{shippingForm.paczkomatAddress}</p>
                        </div>
                        <button
                          onClick={() => {
                            setShippingForm(prev => ({ ...prev, paczkomatId: "", paczkomatAddress: "" }));
                            setShowPaczkomatSearch(true);
                          }}
                          className="p-1 hover:bg-neutral-100 rounded"
                        >
                          <X className="w-4 h-4 text-neutral-400" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            type="text"
                            value={paczkomatSearchQuery}
                            onChange={(e) => handlePaczkomatSearch(e.target.value)}
                            placeholder="Wpisz adres, np: Smolna 14, Rybnik"
                            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                          {isSearchingPaczkomat && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-600 animate-spin" />
                          )}
                        </div>
                        <p className="text-xs text-yellow-700 mt-1">
                          Wpisz ulicę i miasto - znajdziemy najbliższe paczkomaty
                        </p>

                        {paczkomatResults.length > 0 && (
                          <div className="max-h-56 overflow-y-auto bg-white rounded-lg border border-neutral-200 shadow-lg">
                            {paczkomatResults.map((paczkomat) => (
                              <button
                                key={paczkomat.id}
                                onClick={() => selectPaczkomat(paczkomat)}
                                className="w-full p-2.5 text-left hover:bg-yellow-50 transition-colors flex items-start gap-2 border-b border-neutral-100 last:border-b-0"
                              >
                                <MapPin className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-bold text-yellow-700">{paczkomat.id}</p>
                                    {paczkomat.distance && (
                                      <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">
                                        {paczkomat.distance < 1000
                                          ? `${Math.round(paczkomat.distance)} m`
                                          : `${(paczkomat.distance / 1000).toFixed(1)} km`}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-neutral-700">{paczkomat.address}, {paczkomat.city}</p>
                                  {paczkomat.description && (
                                    <p className="text-xs text-neutral-500 truncate">{paczkomat.description}</p>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {paczkomatSearchQuery.length >= 2 && paczkomatResults.length === 0 && !isSearchingPaczkomat && (
                          <p className="text-xs text-neutral-500 text-center py-2">
                            Nie znaleziono paczkomatów. Spróbuj inną nazwę miasta.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-200 mt-4 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">{tCart("subtotal")} (netto)</span>
                  <span>{formatPrice(subtotalNet)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">{tCart("shipping")} (netto)</span>
                  <span>{baseShippingNet === 0 ? <span className="text-green-600">Gratis</span> : formatPrice(baseShippingNet)}</span>
                </div>
                {codFeeNet > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Pobranie (COD)</span>
                    <span>{formatPrice(codFeeNet)}</span>
                  </div>
                )}
                {vatValidation.vatExempt ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-medium">VAT (0% - WDT)</span>
                    <span className="text-green-600 font-medium">0,00 zł</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">VAT 23%</span>
                    <span>{formatPrice(totalVat)}</span>
                  </div>
                )}
                {vatValidation.vatExempt && (
                  <div className="p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700 font-medium">
                      Transakcja wewnątrzwspólnotowa - zwolnienie z VAT
                    </p>
                  </div>
                )}
                <div className="border-t border-neutral-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>{tCart("total")} netto</span>
                    <span>{formatPrice(totalNet)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>{tCart("total")} brutto</span>
                    <span>{formatPrice(totalGross)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-neutral-500">
                <Shield className="w-4 h-4" />
                <span>Bezpieczne płatności przez Przelewy24</span>
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
