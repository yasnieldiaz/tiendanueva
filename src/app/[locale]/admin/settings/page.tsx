"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Truck,
  Mail,
  MessageSquare,
  FileText,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Info,
  CreditCard,
  Building2,
  Banknote,
  ExternalLink,
} from "lucide-react";

type TabType = "shipping" | "payments" | "email" | "sms" | "templates";

interface Settings {
  // Shipping
  inpost_price: string;
  gls_price: string;
  free_shipping_threshold: string;

  // InPost API
  inpost_api_enabled: string;
  inpost_api_token: string;
  inpost_organization_id: string;
  inpost_sender_email: string;
  inpost_sender_phone: string;
  inpost_sender_name: string;
  inpost_sender_address: string;
  inpost_sender_city: string;
  inpost_sender_postcode: string;

  // GLS API
  gls_api_enabled: string;
  gls_api_username: string;
  gls_api_password: string;
  gls_sender_name: string;
  gls_sender_address: string;
  gls_sender_city: string;
  gls_sender_postcode: string;
  gls_sender_country: string;

  // Payments - Przelewy24 Direct
  przelewy24_enabled: string;
  przelewy24_merchant_id: string;
  przelewy24_shop_id: string;
  przelewy24_crc_key: string;
  przelewy24_api_key: string;
  przelewy24_mode: string;
  przelewy24_title: string;
  przelewy24_description: string;

  // Stripe (fallback)
  stripe_publishable_key: string;
  stripe_secret_key: string;

  // COD
  cod_enabled: string;
  cod_fee: string;

  // Bank Transfer
  bank_transfer_enabled: string;
  // EUR Account
  bank_eur_enabled: string;
  bank_eur_name: string;
  bank_eur_holder: string;
  bank_eur_iban: string;
  bank_eur_swift: string;
  // USD Account
  bank_usd_enabled: string;
  bank_usd_name: string;
  bank_usd_holder: string;
  bank_usd_iban: string;
  bank_usd_swift: string;
  // PLN Account
  bank_pln_enabled: string;
  bank_pln_name: string;
  bank_pln_holder: string;
  bank_pln_iban: string;
  bank_pln_swift: string;

  // Email
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;

  // SMS (Vonage)
  vonage_api_key: string;
  vonage_api_secret: string;
  vonage_from_number: string;

  // Notifications
  notify_admin_email: string;
  notify_admin_phone: string;
  notify_on_new_order: string;
  notify_on_shipped: string;

  // Email Templates
  template_email_new_order_subject: string;
  template_email_new_order_body: string;
  template_email_shipped_subject: string;
  template_email_shipped_body: string;
  template_email_admin_order_subject: string;
  template_email_admin_order_body: string;

  // SMS Templates
  template_sms_new_order: string;
  template_sms_shipped: string;
}

const defaultSettings: Settings = {
  inpost_price: "18",
  gls_price: "24",
  free_shipping_threshold: "5000",
  // InPost API
  inpost_api_enabled: "false",
  inpost_api_token: "",
  inpost_organization_id: "",
  inpost_sender_email: "",
  inpost_sender_phone: "",
  inpost_sender_name: "Drone-Partss",
  inpost_sender_address: "ul. Smolna 14",
  inpost_sender_city: "Rybnik",
  inpost_sender_postcode: "44-200",
  // GLS API
  gls_api_enabled: "false",
  gls_api_username: "",
  gls_api_password: "",
  gls_sender_name: "Drone-Partss",
  gls_sender_address: "ul. Smolna 14",
  gls_sender_city: "Rybnik",
  gls_sender_postcode: "44-200",
  gls_sender_country: "PL",
  // Payments - Przelewy24 Direct
  przelewy24_enabled: "true",
  przelewy24_merchant_id: "",
  przelewy24_shop_id: "",
  przelewy24_crc_key: "",
  przelewy24_api_key: "",
  przelewy24_mode: "sandbox",
  przelewy24_title: "Przelewy24",
  przelewy24_description: "Szybkie przelewy, BLIK, karty płatnicze",

  // Stripe (fallback)
  stripe_publishable_key: "",
  stripe_secret_key: "",

  // COD
  cod_enabled: "true",
  cod_fee: "10",
  // Bank Transfer
  bank_transfer_enabled: "false",
  bank_eur_enabled: "false",
  bank_eur_name: "",
  bank_eur_holder: "",
  bank_eur_iban: "",
  bank_eur_swift: "",
  bank_usd_enabled: "false",
  bank_usd_name: "",
  bank_usd_holder: "",
  bank_usd_iban: "",
  bank_usd_swift: "",
  bank_pln_enabled: "false",
  bank_pln_name: "",
  bank_pln_holder: "",
  bank_pln_iban: "",
  bank_pln_swift: "",
  // Email
  smtp_host: "",
  smtp_port: "587",
  smtp_user: "",
  smtp_password: "",
  smtp_from_email: "",
  smtp_from_name: "DroneParts",
  vonage_api_key: "",
  vonage_api_secret: "",
  vonage_from_number: "",
  notify_admin_email: "",
  notify_admin_phone: "",
  notify_on_new_order: "true",
  notify_on_shipped: "true",
  // Default templates
  template_email_new_order_subject: "Confirmación de pedido #{orderNumber} - DroneParts",
  template_email_new_order_body: `Hola {customerName},

¡Gracias por tu pedido!

Hemos recibido tu pedido #{orderNumber} y estamos procesándolo.

Total: {total} zł

Te enviaremos otro email cuando tu pedido sea enviado.

Saludos,
El equipo de DroneParts`,
  template_email_shipped_subject: "Tu pedido #{orderNumber} ha sido enviado - DroneParts",
  template_email_shipped_body: `Hola {customerName},

¡Buenas noticias! Tu pedido #{orderNumber} está en camino.

Transportista: {carrier}
Número de seguimiento: {trackingNumber}

Puedes rastrear tu envío usando el número de seguimiento.

Saludos,
El equipo de DroneParts`,
  template_email_admin_order_subject: "Nuevo pedido #{orderNumber} - {total} zł",
  template_email_admin_order_body: `Nuevo pedido recibido:

Pedido: #{orderNumber}
Cliente: {customerName}
Email: {customerEmail}
Teléfono: {customerPhone}
Total: {total} zł

Accede al panel de administración para ver los detalles.`,
  template_sms_new_order: "Nuevo pedido #{orderNumber} recibido por {total} zł - DroneParts",
  template_sms_shipped: "Tu pedido #{orderNumber} ha sido enviado. Tracking: {trackingNumber} - DroneParts",
};

export default function SettingsPage() {
  const t = useTranslations("admin");
  const [activeTab, setActiveTab] = useState<TabType>("shipping");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...defaultSettings, ...data });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveStatus("idle");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  function togglePassword(field: string) {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  const tabs = [
    { id: "shipping" as TabType, label: t("settingsPage.shipping"), icon: Truck },
    { id: "payments" as TabType, label: "Płatności", icon: CreditCard },
    { id: "email" as TabType, label: t("settingsPage.email"), icon: Mail },
    { id: "sms" as TabType, label: t("settingsPage.sms"), icon: MessageSquare },
    { id: "templates" as TabType, label: t("settingsPage.templates"), icon: FileText },
  ];

  const templateVariables = [
    { var: "{orderNumber}", desc: "Número de pedido" },
    { var: "{customerName}", desc: "Nombre del cliente" },
    { var: "{customerEmail}", desc: "Email del cliente" },
    { var: "{customerPhone}", desc: "Teléfono del cliente" },
    { var: "{total}", desc: "Total del pedido" },
    { var: "{trackingNumber}", desc: "Número de seguimiento" },
    { var: "{carrier}", desc: "Transportista (InPost/GLS)" },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{t("settingsPage.title")}</h1>
        <p className="text-neutral-500 mt-1">{t("settingsPage.subtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm mb-6">
        <div className="flex border-b border-neutral-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Shipping Settings */}
          {activeTab === "shipping" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.inpostPrice")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={settings.inpost_price}
                      onChange={(e) =>
                        setSettings({ ...settings, inpost_price: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      zł
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.glsPrice")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={settings.gls_price}
                      onChange={(e) =>
                        setSettings({ ...settings, gls_price: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      zł
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.freeShippingThreshold")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      value={settings.free_shipping_threshold}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          free_shipping_threshold: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      zł
                    </span>
                  </div>
                </div>
              </div>

              {/* InPost API Section */}
              <div className="border border-neutral-200 rounded-xl p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">InPost ShipX API</h3>
                      <p className="text-sm text-neutral-500">Automatyczne generowanie etykiet InPost/Paczkomaty</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.inpost_api_enabled === "true"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          inpost_api_enabled: e.target.checked ? "true" : "false",
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>

                {settings.inpost_api_enabled === "true" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium mb-1">Jak uzyskać dostęp do API?</p>
                          <p>Zarejestruj się w <a href="https://manager.paczkomaty.pl" target="_blank" rel="noopener noreferrer" className="underline font-medium">InPost Manager</a> i wygeneruj token API w ustawieniach konta.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Token API
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.inpost ? "text" : "password"}
                            value={settings.inpost_api_token}
                            onChange={(e) => setSettings({ ...settings, inpost_api_token: e.target.value })}
                            className="w-full px-4 py-3 pr-12 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                            placeholder="eyJ..."
                          />
                          <button
                            type="button"
                            onClick={() => togglePassword("inpost")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPasswords.inpost ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Organization ID
                        </label>
                        <input
                          type="text"
                          value={settings.inpost_organization_id}
                          onChange={(e) => setSettings({ ...settings, inpost_organization_id: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="123456"
                        />
                      </div>
                    </div>

                    <h4 className="font-medium text-neutral-900 mt-4">Dane nadawcy</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Nazwa firmy</label>
                        <input
                          type="text"
                          value={settings.inpost_sender_name}
                          onChange={(e) => setSettings({ ...settings, inpost_sender_name: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={settings.inpost_sender_email}
                          onChange={(e) => setSettings({ ...settings, inpost_sender_email: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="admin@drone-partss.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Telefon</label>
                        <input
                          type="text"
                          value={settings.inpost_sender_phone}
                          onChange={(e) => setSettings({ ...settings, inpost_sender_phone: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="+48784608733"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Adres</label>
                        <input
                          type="text"
                          value={settings.inpost_sender_address}
                          onChange={(e) => setSettings({ ...settings, inpost_sender_address: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Miasto</label>
                        <input
                          type="text"
                          value={settings.inpost_sender_city}
                          onChange={(e) => setSettings({ ...settings, inpost_sender_city: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Kod pocztowy</label>
                        <input
                          type="text"
                          value={settings.inpost_sender_postcode}
                          onChange={(e) => setSettings({ ...settings, inpost_sender_postcode: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="44-200"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* GLS API Section */}
              <div className="border border-neutral-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">GLS Web API</h3>
                      <p className="text-sm text-neutral-500">Automatyczne generowanie etykiet GLS</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.gls_api_enabled === "true"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          gls_api_enabled: e.target.checked ? "true" : "false",
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {settings.gls_api_enabled === "true" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Jak uzyskać dostęp do API?</p>
                          <p>Skontaktuj się z GLS Poland aby uzyskać dane dostępowe do Web API.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Username / Customer ID
                        </label>
                        <input
                          type="text"
                          value={settings.gls_api_username}
                          onChange={(e) => setSettings({ ...settings, gls_api_username: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="2000000000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.gls ? "text" : "password"}
                            value={settings.gls_api_password}
                            onChange={(e) => setSettings({ ...settings, gls_api_password: e.target.value })}
                            className="w-full px-4 py-3 pr-12 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => togglePassword("gls")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPasswords.gls ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-medium text-neutral-900 mt-4">Dane nadawcy</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Nazwa firmy</label>
                        <input
                          type="text"
                          value={settings.gls_sender_name}
                          onChange={(e) => setSettings({ ...settings, gls_sender_name: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Adres</label>
                        <input
                          type="text"
                          value={settings.gls_sender_address}
                          onChange={(e) => setSettings({ ...settings, gls_sender_address: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Miasto</label>
                        <input
                          type="text"
                          value={settings.gls_sender_city}
                          onChange={(e) => setSettings({ ...settings, gls_sender_city: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Kod pocztowy</label>
                        <input
                          type="text"
                          value={settings.gls_sender_postcode}
                          onChange={(e) => setSettings({ ...settings, gls_sender_postcode: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="44-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Kraj</label>
                        <input
                          type="text"
                          value={settings.gls_sender_country}
                          onChange={(e) => setSettings({ ...settings, gls_sender_country: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="PL"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Payment Settings */}
          {activeTab === "payments" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Przelewy24 Section */}
              <div className="border border-neutral-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Przelewy24</h3>
                      <p className="text-sm text-neutral-500">Szybkie przelewy, BLIK, karty płatnicze</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.przelewy24_enabled === "true"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          przelewy24_enabled: e.target.checked ? "true" : "false",
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                {settings.przelewy24_enabled === "true" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-red-800">
                          <p className="font-medium mb-1">Dane z panelu Przelewy24</p>
                          <p>Zaloguj się do <a href="https://panel.przelewy24.pl" target="_blank" rel="noopener noreferrer" className="underline font-medium">panelu Przelewy24</a> aby pobrać dane konfiguracyjne ze zakładki &quot;Moje dane&quot;.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Tytuł
                        </label>
                        <input
                          type="text"
                          value={settings.przelewy24_title}
                          onChange={(e) => setSettings({ ...settings, przelewy24_title: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="Przelewy24"
                        />
                        <p className="text-xs text-neutral-500 mt-1">Tekst który zobaczą klienci podczas dokonywania zakupu</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Tryb modułu
                        </label>
                        <select
                          value={settings.przelewy24_mode}
                          onChange={(e) => setSettings({ ...settings, przelewy24_mode: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        >
                          <option value="sandbox">Sandbox (testowy)</option>
                          <option value="live">Produkcyjny (live)</option>
                        </select>
                        <p className="text-xs text-neutral-500 mt-1">Tryb przeprowadzania transakcji</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          ID Sprzedawcy (Merchant ID)
                        </label>
                        <input
                          type="text"
                          value={settings.przelewy24_merchant_id}
                          onChange={(e) => setSettings({ ...settings, przelewy24_merchant_id: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="57442"
                        />
                        <p className="text-xs text-neutral-500 mt-1">Identyfikator sprzedawcy nadany w systemie Przelewy24</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          ID Sklepu (Shop ID)
                        </label>
                        <input
                          type="text"
                          value={settings.przelewy24_shop_id}
                          onChange={(e) => setSettings({ ...settings, przelewy24_shop_id: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="57442"
                        />
                        <p className="text-xs text-neutral-500 mt-1">Identyfikator sklepu nadany w systemie Przelewy24</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Klucz CRC
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.p24crc ? "text" : "password"}
                            value={settings.przelewy24_crc_key}
                            onChange={(e) => setSettings({ ...settings, przelewy24_crc_key: e.target.value })}
                            className="w-full px-4 py-3 pr-12 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                            placeholder="7121d1d1a86a24a2"
                          />
                          <button
                            type="button"
                            onClick={() => togglePassword("p24crc")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPasswords.p24crc ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Klucz do CRC nadany w systemie Przelewy24</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Klucz API
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.p24api ? "text" : "password"}
                            value={settings.przelewy24_api_key}
                            onChange={(e) => setSettings({ ...settings, przelewy24_api_key: e.target.value })}
                            className="w-full px-4 py-3 pr-12 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                            placeholder="a3c305d5e748a49cf8de772423321a3c"
                          />
                          <button
                            type="button"
                            onClick={() => togglePassword("p24api")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPasswords.p24api ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Klucz API należy pobrać z panelu Przelewy24 z zakładki Moje dane</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Opis
                      </label>
                      <textarea
                        value={settings.przelewy24_description}
                        onChange={(e) => setSettings({ ...settings, przelewy24_description: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
                        placeholder="Szybkie przelewy, BLIK, karty płatnicze"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Tekst który zobaczą klienci przy wyborze metody płatności</p>
                    </div>

                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-800">
                        <strong>Webhook URL:</strong> Dodaj ten adres w panelu Przelewy24 jako adres powrotny:
                        <br />
                        <code className="bg-amber-100 px-1 rounded text-xs">{typeof window !== 'undefined' ? window.location.origin : 'https://tienda.esix.online'}/api/webhooks/przelewy24</code>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Stripe (Fallback) Section */}
              <div className="border border-neutral-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Stripe (Opcjonalne)</h3>
                    <p className="text-sm text-neutral-500">Alternatywna bramka płatności dla kart międzynarodowych</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Stripe Publishable Key
                    </label>
                    <input
                      type="text"
                      value={settings.stripe_publishable_key}
                      onChange={(e) =>
                        setSettings({ ...settings, stripe_publishable_key: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                      placeholder="pk_live_..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Stripe Secret Key
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.stripe ? "text" : "password"}
                        value={settings.stripe_secret_key}
                        onChange={(e) =>
                          setSettings({ ...settings, stripe_secret_key: e.target.value })
                        }
                        className="w-full px-4 py-3 pr-12 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm"
                        placeholder="sk_live_..."
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("stripe")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPasswords.stripe ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cash on Delivery Section */}
              <div className="border border-neutral-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Banknote className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Płatność przy odbiorze (COD)</h3>
                      <p className="text-sm text-neutral-500">Klient płaci gotówką kurierowi</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.cod_enabled === "true"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          cod_enabled: e.target.checked ? "true" : "false",
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Opłata za pobranie
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={settings.cod_fee}
                        onChange={(e) =>
                          setSettings({ ...settings, cod_fee: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                        zł
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Dodatkowa opłata doliczana do zamówienia przy płatności przy odbiorze
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Transfer Section */}
              <div className="border border-neutral-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Przelew bankowy</h3>
                      <p className="text-sm text-neutral-500">Płatność tradycyjnym przelewem na konto</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.bank_transfer_enabled === "true"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bank_transfer_enabled: e.target.checked ? "true" : "false",
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {settings.bank_transfer_enabled === "true" && (
                  <div className="space-y-6 mt-6">
                    {/* EUR Account */}
                    <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇪🇺</span>
                          <h4 className="font-semibold text-neutral-900">Konto EUR (Euro)</h4>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.bank_eur_enabled === "true"}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                bank_eur_enabled: e.target.checked ? "true" : "false",
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      {settings.bank_eur_enabled === "true" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Nazwa banku
                            </label>
                            <input
                              type="text"
                              value={settings.bank_eur_name}
                              onChange={(e) => setSettings({ ...settings, bank_eur_name: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                              placeholder="np. ING Bank"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Właściciel konta
                            </label>
                            <input
                              type="text"
                              value={settings.bank_eur_holder}
                              onChange={(e) => setSettings({ ...settings, bank_eur_holder: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                              placeholder="np. Drone-Partss Sp. z o.o."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              IBAN
                            </label>
                            <input
                              type="text"
                              value={settings.bank_eur_iban}
                              onChange={(e) => setSettings({ ...settings, bank_eur_iban: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                              placeholder="PL00 0000 0000 0000 0000 0000 0000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              SWIFT/BIC
                            </label>
                            <input
                              type="text"
                              value={settings.bank_eur_swift}
                              onChange={(e) => setSettings({ ...settings, bank_eur_swift: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                              placeholder="np. INGBPLPW"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* USD Account */}
                    <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇺🇸</span>
                          <h4 className="font-semibold text-neutral-900">Konto USD (Dolar)</h4>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.bank_usd_enabled === "true"}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                bank_usd_enabled: e.target.checked ? "true" : "false",
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      {settings.bank_usd_enabled === "true" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Nazwa banku
                            </label>
                            <input
                              type="text"
                              value={settings.bank_usd_name}
                              onChange={(e) => setSettings({ ...settings, bank_usd_name: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                              placeholder="np. Bank of America"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Właściciel konta
                            </label>
                            <input
                              type="text"
                              value={settings.bank_usd_holder}
                              onChange={(e) => setSettings({ ...settings, bank_usd_holder: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                              placeholder="np. Drone-Partss LLC"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              IBAN / Account Number
                            </label>
                            <input
                              type="text"
                              value={settings.bank_usd_iban}
                              onChange={(e) => setSettings({ ...settings, bank_usd_iban: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                              placeholder="Numer konta"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              SWIFT/BIC / Routing
                            </label>
                            <input
                              type="text"
                              value={settings.bank_usd_swift}
                              onChange={(e) => setSettings({ ...settings, bank_usd_swift: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                              placeholder="np. BOFAUS3N"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PLN Account */}
                    <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇵🇱</span>
                          <h4 className="font-semibold text-neutral-900">Konto PLN (Złoty)</h4>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.bank_pln_enabled === "true"}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                bank_pln_enabled: e.target.checked ? "true" : "false",
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      {settings.bank_pln_enabled === "true" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Nazwa banku
                            </label>
                            <input
                              type="text"
                              value={settings.bank_pln_name}
                              onChange={(e) => setSettings({ ...settings, bank_pln_name: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                              placeholder="np. PKO Bank Polski"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Właściciel konta
                            </label>
                            <input
                              type="text"
                              value={settings.bank_pln_holder}
                              onChange={(e) => setSettings({ ...settings, bank_pln_holder: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                              placeholder="np. Drone-Partss Sp. z o.o."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Numer konta
                            </label>
                            <input
                              type="text"
                              value={settings.bank_pln_iban}
                              onChange={(e) => setSettings({ ...settings, bank_pln_iban: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                              placeholder="00 0000 0000 0000 0000 0000 0000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              SWIFT/BIC
                            </label>
                            <input
                              type="text"
                              value={settings.bank_pln_swift}
                              onChange={(e) => setSettings({ ...settings, bank_pln_swift: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                              placeholder="np. BPKOPLPW"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods Summary */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <h4 className="font-medium text-neutral-900 mb-3">Aktywne metody płatności:</h4>
                <div className="flex flex-wrap gap-2">
                  {settings.przelewy24_enabled === "true" && (
                    <>
                      <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700">
                        Przelewy24
                      </span>
                      <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700">
                        BLIK
                      </span>
                      <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700">
                        Visa / Mastercard
                      </span>
                    </>
                  )}
                  {settings.cod_enabled === "true" && (
                    <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700">
                      Przy odbiorze (+{settings.cod_fee} zł)
                    </span>
                  )}
                  {settings.bank_transfer_enabled === "true" && (
                    <span className="px-3 py-1.5 bg-purple-100 border border-purple-200 rounded-lg text-sm font-medium text-purple-700">
                      Przelew bankowy
                      {settings.bank_eur_enabled === "true" && " (EUR)"}
                      {settings.bank_usd_enabled === "true" && " (USD)"}
                      {settings.bank_pln_enabled === "true" && " (PLN)"}
                    </span>
                  )}
                  {settings.przelewy24_enabled !== "true" && settings.cod_enabled !== "true" && settings.bank_transfer_enabled !== "true" && (
                    <span className="text-sm text-red-600">Brak aktywnych metod płatności!</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800">
                  {t("settingsPage.smtpDescription")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.smtpServer")}
                  </label>
                  <input
                    type="text"
                    value={settings.smtp_host}
                    onChange={(e) =>
                      setSettings({ ...settings, smtp_host: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.smtpPort")}
                  </label>
                  <input
                    type="text"
                    value={settings.smtp_port}
                    onChange={(e) =>
                      setSettings({ ...settings, smtp_port: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="587"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.smtpUser")}
                  </label>
                  <input
                    type="text"
                    value={settings.smtp_user}
                    onChange={(e) =>
                      setSettings({ ...settings, smtp_user: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="tu-email@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.smtpPassword")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.smtp ? "text" : "password"}
                      value={settings.smtp_password}
                      onChange={(e) =>
                        setSettings({ ...settings, smtp_password: e.target.value })
                      }
                      className="w-full px-4 py-3 pr-12 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("smtp")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPasswords.smtp ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.fromEmail")}
                  </label>
                  <input
                    type="email"
                    value={settings.smtp_from_email}
                    onChange={(e) =>
                      setSettings({ ...settings, smtp_from_email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="pedidos@drone-partss.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.fromName")}
                  </label>
                  <input
                    type="text"
                    value={settings.smtp_from_name}
                    onChange={(e) =>
                      setSettings({ ...settings, smtp_from_name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="DroneParts"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6 mt-6">
                <h3 className="font-semibold text-neutral-900 mb-4">
                  {t("settingsPage.adminNotifications")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t("settingsPage.adminEmail")}
                    </label>
                    <input
                      type="email"
                      value={settings.notify_admin_email}
                      onChange={(e) =>
                        setSettings({ ...settings, notify_admin_email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      placeholder="admin@drone-partss.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notify_on_new_order === "true"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notify_on_new_order: e.target.checked ? "true" : "false",
                        })
                      }
                      className="w-5 h-5 rounded border-neutral-300"
                    />
                    <span className="text-sm text-neutral-700">
                      {t("settingsPage.notifyNewOrder")}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notify_on_shipped === "true"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notify_on_shipped: e.target.checked ? "true" : "false",
                        })
                      }
                      className="w-5 h-5 rounded border-neutral-300"
                    />
                    <span className="text-sm text-neutral-700">
                      {t("settingsPage.notifyShipped")}
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* SMS / Vonage Settings */}
          {activeTab === "sms" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-800">
                  {t("settingsPage.vonageDescription")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.vonageApiKey")}
                  </label>
                  <input
                    type="text"
                    value={settings.vonage_api_key}
                    onChange={(e) =>
                      setSettings({ ...settings, vonage_api_key: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="abc12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.vonageApiSecret")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.vonage ? "text" : "password"}
                      value={settings.vonage_api_secret}
                      onChange={(e) =>
                        setSettings({ ...settings, vonage_api_secret: e.target.value })
                      }
                      className="w-full px-4 py-3 pr-12 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("vonage")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPasswords.vonage ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.vonageFromNumber")}
                  </label>
                  <input
                    type="text"
                    value={settings.vonage_from_number}
                    onChange={(e) =>
                      setSettings({ ...settings, vonage_from_number: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="DroneParts o +48123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("settingsPage.adminPhone")}
                  </label>
                  <input
                    type="text"
                    value={settings.notify_admin_phone}
                    onChange={(e) =>
                      setSettings({ ...settings, notify_admin_phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="+48123456789"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Templates */}
          {activeTab === "templates" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Variables Reference */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 mb-2">
                      {t("templates.variables")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {templateVariables.map((v) => (
                        <span
                          key={v.var}
                          className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-mono rounded"
                          title={v.desc}
                        >
                          {v.var}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email: New Order (Customer) */}
              <div className="border border-neutral-200 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t("templates.emailNewOrder")}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t("settingsPage.subject")}
                    </label>
                    <input
                      type="text"
                      value={settings.template_email_new_order_subject}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          template_email_new_order_subject: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t("settingsPage.messageBody")}
                    </label>
                    <textarea
                      value={settings.template_email_new_order_body}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          template_email_new_order_body: e.target.value,
                        })
                      }
                      rows={8}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Email: Order Shipped (Customer) */}
              <div className="border border-neutral-200 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t("templates.emailShipped")}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t("settingsPage.subject")}
                    </label>
                    <input
                      type="text"
                      value={settings.template_email_shipped_subject}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          template_email_shipped_subject: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t("settingsPage.messageBody")}
                    </label>
                    <textarea
                      value={settings.template_email_shipped_body}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          template_email_shipped_body: e.target.value,
                        })
                      }
                      rows={8}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Email: New Order (Admin) */}
              <div className="border border-neutral-200 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t("templates.emailAdminOrder")}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t("settingsPage.subject")}
                    </label>
                    <input
                      type="text"
                      value={settings.template_email_admin_order_subject}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          template_email_admin_order_subject: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t("settingsPage.messageBody")}
                    </label>
                    <textarea
                      value={settings.template_email_admin_order_body}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          template_email_admin_order_body: e.target.value,
                        })
                      }
                      rows={6}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* SMS Templates */}
              <div className="border border-neutral-200 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {t("templates.smsNewOrder")}
                </h3>
                <input
                  type="text"
                  value={settings.template_sms_new_order}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      template_sms_new_order: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t("settingsPage.maxSmsChars")}
                </p>
              </div>

              <div className="border border-neutral-200 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {t("templates.smsShipped")}
                </h3>
                <input
                  type="text"
                  value={settings.template_sms_shipped}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      template_sms_shipped: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t("settingsPage.maxSmsChars")}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center gap-2">
          {saveStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-green-600"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{t("settingsPage.savedSuccessfully")}</span>
            </motion.div>
          )}
          {saveStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-red-600"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{t("settingsPage.errorSaving")}</span>
            </motion.div>
          )}
        </div>

        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("saving")}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {t("settingsPage.saveSettings")}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
