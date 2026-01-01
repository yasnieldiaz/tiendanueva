"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  ChevronRight,
  Wrench,
  UserPlus,
  FileText,
  Package,
  CheckCircle,
  CreditCard,
  Truck,
  Clock,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const translations = {
  es: {
    home: "Inicio",
    title: "Servicio Técnico",
    subtitle: "Centro de reparación profesional de drones",
    heroTitle: "Bienvenido al Servicio Drone-Partss",
    heroDescription: "Somos un centro de servicio autorizado especializado en la reparación y mantenimiento de drones. Nuestro equipo de técnicos certificados está listo para ayudarte.",
    introTitle: "Sistema de Reparación Online",
    introText: "Hemos preparado un sistema de reparación online que te permite enviar tu dispositivo para reparación o reclamación de forma rápida y cómoda. A continuación encontrarás instrucciones paso a paso sobre cómo hacerlo.",
    processTitle: "Proceso de Reparación",
    step1Title: "1. Registro / Inicio de Sesión",
    step1Text: "Ve a nuestro portal de servicio en repair.drone-partss.com. Si ya tienes una cuenta, inicia sesión. Si eres un nuevo cliente, regístrate proporcionando tus datos de contacto.",
    step2Title: "2. Envío de Solicitud",
    step2Text: "Después de iniciar sesión, selecciona 'Nueva solicitud de reparación' y completa el formulario con los detalles del dispositivo y la descripción del problema. Adjunta fotos si es posible.",
    step3Title: "3. Preparación del Paquete",
    step3Text: "Empaqueta cuidadosamente tu dispositivo. Incluye todos los accesorios necesarios para el diagnóstico. Envía el paquete a nuestra dirección: ul. Smolna 14, 44-200 Rybnik, Polonia.",
    step4Title: "4. Confirmación y Seguimiento",
    step4Text: "Una vez que recibamos tu paquete, recibirás una confirmación por correo electrónico. Podrás seguir el estado de la reparación en tu cuenta del portal de servicio.",
    step5Title: "5. Presupuesto",
    step5Text: "Después del diagnóstico, recibirás un presupuesto detallado. Puedes aceptarlo o rechazarlo a través del portal. Si lo aceptas, procederemos con la reparación.",
    step6Title: "6. Pago y Devolución",
    step6Text: "Una vez completada la reparación, recibirás la factura. Después del pago, enviaremos tu dispositivo reparado de vuelta a la dirección indicada.",
    faqTitle: "Preguntas Frecuentes",
    faq1Question: "¿Cuánto tiempo tarda una reparación típica?",
    faq1Answer: "El tiempo de reparación estándar es de aproximadamente 14 días hábiles desde la recepción del dispositivo. Para reparaciones más complejas o si necesitamos pedir piezas, este tiempo puede extenderse.",
    faq2Question: "¿Cómo debo enviar mi dispositivo?",
    faq2Answer: "Empaqueta tu dispositivo de forma segura, preferiblemente en el embalaje original. Incluye una copia impresa de la confirmación de la solicitud. Recomendamos usar un servicio de mensajería con seguimiento.",
    faq3Question: "¿Me devolverán las piezas reemplazadas?",
    faq3Answer: "Sí, a petición del cliente podemos devolver las piezas reemplazadas junto con el dispositivo reparado. Por favor, indica esta preferencia en tu solicitud.",
    faq4Question: "¿Cómo puedo verificar el estado de mi reparación?",
    faq4Answer: "Puedes verificar el estado en cualquier momento iniciando sesión en tu cuenta en repair.drone-partss.com. También recibirás notificaciones por correo electrónico sobre cambios importantes en el estado.",
    portalButton: "Ir al Portal de Servicio",
    contactTitle: "¿Necesitas Ayuda?",
    contactText: "Si tienes preguntas adicionales, no dudes en contactarnos.",
    contactUs: "Contáctanos",
    address: "Dirección",
    phone: "Teléfono",
    email: "Correo electrónico",
  },
  en: {
    home: "Home",
    title: "Technical Service",
    subtitle: "Professional drone repair center",
    heroTitle: "Welcome to Drone-Partss Service",
    heroDescription: "We are an authorized service center specializing in drone repair and maintenance. Our team of certified technicians is ready to help you.",
    introTitle: "Online Repair System",
    introText: "We have prepared an online repair system that allows you to send your device for repair or warranty claim quickly and conveniently. Below you will find step-by-step instructions on how to do this.",
    processTitle: "Repair Process",
    step1Title: "1. Registration / Login",
    step1Text: "Go to our service portal at repair.drone-partss.com. If you already have an account, log in. If you are a new customer, register by providing your contact details.",
    step2Title: "2. Request Submission",
    step2Text: "After logging in, select 'New repair request' and complete the form with device details and problem description. Attach photos if possible.",
    step3Title: "3. Package Preparation",
    step3Text: "Carefully package your device. Include all accessories necessary for diagnosis. Send the package to our address: ul. Smolna 14, 44-200 Rybnik, Poland.",
    step4Title: "4. Confirmation & Tracking",
    step4Text: "Once we receive your package, you will receive an email confirmation. You can track the repair status in your service portal account.",
    step5Title: "5. Quotation",
    step5Text: "After diagnosis, you will receive a detailed quotation. You can accept or reject it through the portal. If you accept, we will proceed with the repair.",
    step6Title: "6. Payment & Return",
    step6Text: "Once the repair is completed, you will receive the invoice. After payment, we will ship your repaired device back to the indicated address.",
    faqTitle: "Frequently Asked Questions",
    faq1Question: "How long does a typical repair take?",
    faq1Answer: "The standard repair time is approximately 14 business days from receiving the device. For more complex repairs or if we need to order parts, this time may be extended.",
    faq2Question: "How should I ship my device?",
    faq2Answer: "Package your device securely, preferably in the original packaging. Include a printed copy of the request confirmation. We recommend using a courier service with tracking.",
    faq3Question: "Will replaced parts be returned to me?",
    faq3Answer: "Yes, upon customer request we can return the replaced parts along with the repaired device. Please indicate this preference in your request.",
    faq4Question: "How can I check my repair status?",
    faq4Answer: "You can check the status at any time by logging into your account at repair.drone-partss.com. You will also receive email notifications about important status changes.",
    portalButton: "Go to Service Portal",
    contactTitle: "Need Help?",
    contactText: "If you have additional questions, don't hesitate to contact us.",
    contactUs: "Contact Us",
    address: "Address",
    phone: "Phone",
    email: "Email",
  },
  pl: {
    home: "Strona główna",
    title: "Serwis Techniczny",
    subtitle: "Profesjonalne centrum naprawy dronów",
    heroTitle: "Witamy w Serwisie Drone-Partss",
    heroDescription: "Jesteśmy autoryzowanym centrum serwisowym specjalizującym się w naprawie i konserwacji dronów. Nasz zespół certyfikowanych techników jest gotowy, aby Ci pomóc.",
    introTitle: "System Napraw Online",
    introText: "Przygotowaliśmy dla Państwa system napraw online, który pozwala na szybkie i wygodne zgłoszenie urządzenia do naprawy lub reklamacji. Poniżej znajdą Państwo instrukcję krok po kroku, jak to zrobić.",
    processTitle: "Proces Naprawy",
    step1Title: "1. Rejestracja / Logowanie",
    step1Text: "Wejdź na nasz portal serwisowy repair.drone-partss.com. Jeśli masz już konto, zaloguj się. Jeśli jesteś nowym klientem, zarejestruj się podając swoje dane kontaktowe.",
    step2Title: "2. Zgłoszenie Naprawy",
    step2Text: "Po zalogowaniu wybierz 'Nowe zgłoszenie naprawy' i wypełnij formularz podając dane urządzenia oraz opis problemu. Jeśli to możliwe, dołącz zdjęcia.",
    step3Title: "3. Przygotowanie Przesyłki",
    step3Text: "Starannie zapakuj swoje urządzenie. Dołącz wszystkie akcesoria niezbędne do diagnostyki. Wyślij paczkę na nasz adres: ul. Smolna 14, 44-200 Rybnik.",
    step4Title: "4. Potwierdzenie i Śledzenie",
    step4Text: "Po otrzymaniu przesyłki otrzymasz potwierdzenie mailowe. Status naprawy możesz śledzić na swoim koncie w portalu serwisowym.",
    step5Title: "5. Wycena",
    step5Text: "Po przeprowadzeniu diagnostyki otrzymasz szczegółową wycenę naprawy. Możesz ją zaakceptować lub odrzucić przez portal. Po akceptacji przystąpimy do naprawy.",
    step6Title: "6. Płatność i Zwrot",
    step6Text: "Po zakończeniu naprawy otrzymasz fakturę. Po dokonaniu płatności odeślemy naprawione urządzenie na wskazany adres.",
    faqTitle: "Najczęściej Zadawane Pytania",
    faq1Question: "Ile trwa standardowa naprawa?",
    faq1Answer: "Standardowy czas naprawy to około 14 dni roboczych od momentu otrzymania urządzenia. W przypadku bardziej skomplikowanych napraw lub konieczności zamówienia części, czas ten może ulec wydłużeniu.",
    faq2Question: "Jak powinienem wysłać urządzenie?",
    faq2Answer: "Zapakuj urządzenie w sposób bezpieczny, najlepiej w oryginalnym opakowaniu. Dołącz wydruk potwierdzenia zgłoszenia. Zalecamy skorzystanie z usługi kurierskiej z śledzeniem przesyłki.",
    faq3Question: "Czy wymienione części zostaną mi zwrócone?",
    faq3Answer: "Tak, na życzenie klienta możemy zwrócić wymienione części wraz z naprawionym urządzeniem. Prosimy o zaznaczenie tej preferencji w zgłoszeniu.",
    faq4Question: "Jak mogę sprawdzić status mojej naprawy?",
    faq4Answer: "Status naprawy możesz sprawdzić w każdej chwili logując się na swoje konto na repair.drone-partss.com. Otrzymasz również powiadomienia mailowe o ważnych zmianach statusu.",
    portalButton: "Przejdź do Portalu Serwisowego",
    contactTitle: "Potrzebujesz Pomocy?",
    contactText: "Jeśli masz dodatkowe pytania, nie wahaj się z nami skontaktować.",
    contactUs: "Skontaktuj się",
    address: "Adres",
    phone: "Telefon",
    email: "E-mail",
  },
};

const steps = [
  { icon: UserPlus, color: "bg-blue-500" },
  { icon: FileText, color: "bg-green-500" },
  { icon: Package, color: "bg-orange-500" },
  { icon: CheckCircle, color: "bg-purple-500" },
  { icon: CreditCard, color: "bg-red-500" },
  { icon: Truck, color: "bg-teal-500" },
];

export default function ServicePage() {
  const locale = useLocale();
  const t = translations[locale as keyof typeof translations] || translations.pl;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { question: t.faq1Question, answer: t.faq1Answer },
    { question: t.faq2Question, answer: t.faq2Answer },
    { question: t.faq3Question, answer: t.faq3Answer },
    { question: t.faq4Question, answer: t.faq4Answer },
  ];

  const stepTexts = [
    { title: t.step1Title, text: t.step1Text },
    { title: t.step2Title, text: t.step2Text },
    { title: t.step3Title, text: t.step3Text },
    { title: t.step4Title, text: t.step4Text },
    { title: t.step5Title, text: t.step5Text },
    { title: t.step6Title, text: t.step6Text },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
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

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-full text-blue-400 text-sm font-medium mb-6">
                  <Wrench className="w-4 h-4" />
                  {t.subtitle}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {t.heroTitle}
                </h1>
                <p className="text-xl text-neutral-300 mb-8 max-w-2xl">
                  {t.heroDescription}
                </p>
                <a
                  href="https://repair.drone-partss.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                >
                  {t.portalButton}
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>

              <div className="flex-1 flex justify-center">
                <div className="relative w-80 h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full opacity-20 blur-3xl" />
                  <div className="relative w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-3xl p-8 flex items-center justify-center border border-neutral-600">
                    <Wrench className="w-32 h-32 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  {t.introTitle}
                </h2>
                <p className="text-neutral-600 text-lg">
                  {t.introText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">
            {t.processTitle}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stepTexts.map((step, index) => {
              const StepIcon = steps[index].icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${steps[index].color} rounded-xl flex items-center justify-center mb-4`}>
                    <StepIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Portal Button */}
          <div className="text-center mt-12">
            <a
              href="https://repair.drone-partss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              {t.portalButton}
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white border-y border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <HelpCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">
                {t.faqTitle}
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-neutral-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left bg-neutral-50 hover:bg-neutral-100 transition-colors"
                  >
                    <span className="font-semibold text-neutral-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-500 transition-transform ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 py-4 bg-white">
                      <p className="text-neutral-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {t.contactTitle}
                </h2>
                <p className="text-blue-100 text-lg mb-6">
                  {t.contactText}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                >
                  {t.contactUs}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">{t.address}</p>
                    <p className="font-medium">ul. Smolna 14, 44-200 Rybnik</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">{t.phone}</p>
                    <p className="font-medium">+48 123 456 789</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">{t.email}</p>
                    <p className="font-medium">serwis@drone-partss.com</p>
                  </div>
                </div>
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
