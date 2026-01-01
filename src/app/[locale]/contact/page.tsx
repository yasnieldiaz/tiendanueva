"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Building,
  CheckCircle,
  AlertCircle,
  Home,
  ChevronRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-neutral-100 rounded-2xl flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  ),
});

const translations = {
  es: {
    home: "Inicio",
    title: "Contacto",
    subtitle: "Estamos aquí para ayudarte",
    description: "Tienes preguntas sobre nuestros productos o servicios? No dudes en contactarnos. Nuestro equipo te respondera lo antes posible.",
    formTitle: "Envianos un mensaje",
    name: "Nombre completo",
    namePlaceholder: "Tu nombre",
    email: "Correo electronico",
    emailPlaceholder: "tu@email.com",
    subject: "Asunto",
    subjectPlaceholder: "Como podemos ayudarte?",
    message: "Mensaje",
    messagePlaceholder: "Escribe tu mensaje aqui...",
    send: "Enviar mensaje",
    sending: "Enviando...",
    successTitle: "Mensaje enviado!",
    successMessage: "Gracias por contactarnos. Te responderemos pronto.",
    errorTitle: "Error",
    errorMessage: "Hubo un problema al enviar tu mensaje. Por favor, intentalo de nuevo.",
    required: "Este campo es obligatorio",
    invalidEmail: "Por favor, introduce un email valido",
    contactInfo: "Informacion de contacto",
    address: "Direccion",
    phone: "Telefono",
    emailLabel: "Email",
    hours: "Horario de atencion",
    hoursValue: "Lun - Vie: 9:00 - 17:00",
    weekend: "Sab - Dom: Cerrado",
    findUs: "Encuentranos",
    companyName: "DroneParts Sp. z o.o.",
    companyAddress: "ul. Smolna 14",
    companyCity: "44-200 Rybnik, Polonia",
    subjects: [
      "Consulta general",
      "Soporte tecnico",
      "Pedidos y envios",
      "Devoluciones",
      "Colaboracion comercial",
      "Otro"
    ]
  },
  en: {
    home: "Home",
    title: "Contact",
    subtitle: "We're here to help",
    description: "Have questions about our products or services? Don't hesitate to contact us. Our team will respond as soon as possible.",
    formTitle: "Send us a message",
    name: "Full name",
    namePlaceholder: "Your name",
    email: "Email address",
    emailPlaceholder: "you@email.com",
    subject: "Subject",
    subjectPlaceholder: "How can we help you?",
    message: "Message",
    messagePlaceholder: "Write your message here...",
    send: "Send message",
    sending: "Sending...",
    successTitle: "Message sent!",
    successMessage: "Thank you for contacting us. We will respond soon.",
    errorTitle: "Error",
    errorMessage: "There was a problem sending your message. Please try again.",
    required: "This field is required",
    invalidEmail: "Please enter a valid email",
    contactInfo: "Contact information",
    address: "Address",
    phone: "Phone",
    emailLabel: "Email",
    hours: "Business hours",
    hoursValue: "Mon - Fri: 9:00 AM - 5:00 PM",
    weekend: "Sat - Sun: Closed",
    findUs: "Find us",
    companyName: "DroneParts Sp. z o.o.",
    companyAddress: "ul. Smolna 14",
    companyCity: "44-200 Rybnik, Poland",
    subjects: [
      "General inquiry",
      "Technical support",
      "Orders and shipping",
      "Returns",
      "Business partnership",
      "Other"
    ]
  },
  pl: {
    home: "Strona główna",
    title: "Kontakt",
    subtitle: "Jesteśmy tu, aby pomóc",
    description: "Masz pytania dotyczace naszych produktow lub uslug? Nie wahaj sie z nami skontaktowac. Nasz zespol odpowie najszybciej jak to mozliwe.",
    formTitle: "Wyslij nam wiadomosc",
    name: "Imie i nazwisko",
    namePlaceholder: "Twoje imie",
    email: "Adres e-mail",
    emailPlaceholder: "twoj@email.com",
    subject: "Temat",
    subjectPlaceholder: "W czym mozemy pomoc?",
    message: "Wiadomosc",
    messagePlaceholder: "Napisz swoja wiadomosc tutaj...",
    send: "Wyslij wiadomosc",
    sending: "Wysylanie...",
    successTitle: "Wiadomosc wyslana!",
    successMessage: "Dziekujemy za kontakt. Odpowiemy wkrotce.",
    errorTitle: "Blad",
    errorMessage: "Wystapil problem podczas wysylania wiadomosci. Sprobuj ponownie.",
    required: "To pole jest wymagane",
    invalidEmail: "Prosze podac prawidlowy adres e-mail",
    contactInfo: "Informacje kontaktowe",
    address: "Adres",
    phone: "Telefon",
    emailLabel: "E-mail",
    hours: "Godziny pracy",
    hoursValue: "Pon - Pt: 9:00 - 17:00",
    weekend: "Sob - Nd: Zamkniete",
    findUs: "Znajdz nas",
    companyName: "DroneParts Sp. z o.o.",
    companyAddress: "ul. Smolna 14",
    companyCity: "44-200 Rybnik, Polska",
    subjects: [
      "Zapytanie ogolne",
      "Wsparcie techniczne",
      "Zamowienia i wysylka",
      "Zwroty",
      "Wspolpraca biznesowa",
      "Inne"
    ]
  }
};

export default function ContactPage() {
  const locale = useLocale();
  const t = translations[locale as keyof typeof translations] || translations.pl;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.required;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t.required;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus("loading");

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4">
              <Link
                href={`/${locale}`}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>{t.home}</span>
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{t.title}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t.title}
            </h1>
            <p className="text-blue-100 text-lg">
              {t.subtitle}
            </p>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                {t.formTitle}
              </h2>
              <p className="text-neutral-600 mb-6">
                {t.description}
              </p>

              {status === "success" ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    {t.successTitle}
                  </h3>
                  <p className="text-green-700">{t.successMessage}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    OK
                  </button>
                </div>
              ) : status === "error" ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    {t.errorTitle}
                  </h3>
                  <p className="text-red-700">{t.errorMessage}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                      {t.name} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.namePlaceholder}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name ? "border-red-500" : "border-neutral-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      {t.email} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.emailPlaceholder}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email ? "border-red-500" : "border-neutral-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                      {t.subject} *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.subject ? "border-red-500" : "border-neutral-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white`}
                    >
                      <option value="">{t.subjectPlaceholder}</option>
                      {t.subjects.map((subject, idx) => (
                        <option key={idx} value={subject}>{subject}</option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                      {t.message} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.messagePlaceholder}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.message ? "border-red-500" : "border-neutral-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t.sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t.send}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-6">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                {t.contactInfo}
              </h2>

              <div className="space-y-4">
                {/* Company */}
                <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{t.companyName}</p>
                    <p className="text-neutral-600 text-sm">NIP: 6423235808</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-700">{t.address}</p>
                    <p className="text-neutral-900">{t.companyAddress}</p>
                    <p className="text-neutral-900">{t.companyCity}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-700">{t.phone}</p>
                    <a href="tel:+48123456789" className="text-blue-600 hover:underline">
                      +48 123 456 789
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-700">{t.emailLabel}</p>
                    <a href="mailto:info@drone-partss.com" className="text-blue-600 hover:underline">
                      info@drone-partss.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-700">{t.hours}</p>
                    <p className="text-neutral-900">{t.hoursValue}</p>
                    <p className="text-neutral-500 text-sm">{t.weekend}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                {t.findUs}
              </h2>
              <MapComponent />
              <p className="mt-4 text-sm text-neutral-600 text-center">
                {t.companyAddress}, {t.companyCity}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
      <CartDrawer />
    </>
  );
}
