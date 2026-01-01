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
} from "lucide-react";

type TabType = "shipping" | "email" | "sms" | "templates";

interface Settings {
  // Shipping
  inpost_price: string;
  gls_price: string;
  free_shipping_threshold: string;

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
