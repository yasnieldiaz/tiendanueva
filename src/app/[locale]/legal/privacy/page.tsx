"use client";

import { Shield, Mail, MapPin } from "lucide-react";
import { useLocale } from "next-intl";

const translations = {
  es: {
    title: "Política de Privacidad",
    lastUpdate: "Última actualización",
    sections: {
      admin: {
        title: "Administrador de datos personales",
        content: "El administrador de tus datos personales es DroneParts con sede en Polonia. En asuntos relacionados con la protección de datos personales puedes contactarnos:",
        email: "privacy@drone-partss.com",
        address: "ul. Smolna 14, 44-200 Rybnik, Polonia"
      },
      legal: {
        title: "Base legal del procesamiento de datos",
        content: "Procesamos tus datos personales de acuerdo con el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016 (RGPD) sobre las siguientes bases:",
        items: [
          { code: "Art. 6.1.a)", desc: "consentimiento para el procesamiento de datos" },
          { code: "Art. 6.1.b)", desc: "ejecución de un contrato o acciones previas a su celebración" },
          { code: "Art. 6.1.c)", desc: "cumplimiento de una obligación legal" },
          { code: "Art. 6.1.f)", desc: "interés legítimo del administrador" }
        ]
      },
      purposes: {
        title: "Fines del procesamiento de datos",
        content: "Procesamos tus datos personales para los siguientes fines:",
        items: [
          "Realización de pedidos y contratos de venta",
          "Gestión de cuenta de usuario",
          "Gestión de reclamaciones y devoluciones",
          "Envío de newsletter (con consentimiento)",
          "Marketing directo de productos y servicios",
          "Análisis estadístico y mejora de la calidad del servicio",
          "Cumplimiento de obligaciones fiscales y contables"
        ]
      },
      dataTypes: {
        title: "Tipos de datos recopilados",
        content: "Recopilamos las siguientes categorías de datos personales:",
        items: [
          { title: "Datos de identificación", desc: "nombre, apellidos" },
          { title: "Datos de contacto", desc: "email, teléfono, dirección" },
          { title: "Datos transaccionales", desc: "historial de pedidos, pagos" },
          { title: "Datos técnicos", desc: "IP, navegador, cookies" }
        ]
      },
      retention: {
        title: "Período de retención de datos",
        content: "Conservamos tus datos durante el período:",
        items: [
          { period: "Datos de cuenta", time: "hasta la eliminación de la cuenta o retiro del consentimiento" },
          { period: "Datos transaccionales", time: "5 años desde el final del año fiscal" },
          { period: "Datos de marketing", time: "hasta el retiro del consentimiento" },
          { period: "Datos de cookies", time: "según la configuración de cookies" }
        ]
      },
      rights: {
        title: "Tus derechos (RGPD)",
        content: "Según el RGPD, tienes los siguientes derechos:",
        items: [
          { right: "Derecho de acceso", desc: "puedes obtener información sobre los datos procesados" },
          { right: "Derecho de rectificación", desc: "puedes solicitar la corrección de datos incorrectos" },
          { right: "Derecho de supresión", desc: "puedes solicitar la eliminación de datos (\"derecho al olvido\")" },
          { right: "Derecho de limitación", desc: "puedes limitar el alcance del procesamiento" },
          { right: "Derecho de portabilidad", desc: "puedes recibir los datos en formato electrónico" },
          { right: "Derecho de oposición", desc: "puedes oponerte al procesamiento de datos" },
          { right: "Derecho de retirar el consentimiento", desc: "puedes retirar tu consentimiento en cualquier momento" },
          { right: "Derecho de reclamación", desc: "puedes presentar una queja ante la autoridad supervisora" }
        ]
      },
      cookies: {
        title: "Cookies",
        content: "Nuestro sitio web utiliza cookies. Son pequeños archivos de texto almacenados en tu dispositivo. Utilizamos los siguientes tipos de cookies:",
        items: [
          { type: "Necesarias", desc: "necesarias para el funcionamiento del sitio", color: "bg-green-100 text-green-700" },
          { type: "Analíticas", desc: "ayudan a entender el uso del sitio", color: "bg-blue-100 text-blue-700" },
          { type: "Marketing", desc: "utilizadas para personalizar anuncios", color: "bg-purple-100 text-purple-700" },
          { type: "Preferencias", desc: "recuerdan tu configuración", color: "bg-orange-100 text-orange-700" }
        ],
        manage: "Puedes gestionar las cookies en la configuración de tu navegador o a través de nuestro panel de preferencias."
      },
      recipients: {
        title: "Destinatarios de datos",
        content: "Tus datos pueden ser transferidos a:",
        items: [
          "Empresas de mensajería (DHL, GLS) - para la entrega de pedidos",
          "Operadores de pago (Stripe, PayPal) - para procesar pagos",
          "Proveedores de servicios IT - hosting, email",
          "Autoridades estatales - cuando lo requiera la ley"
        ]
      },
      security: {
        title: "Seguridad de datos",
        content: "Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos:",
        items: [
          "Cifrado SSL/TLS",
          "Almacenamiento seguro de contraseñas (bcrypt)",
          "Copias de seguridad regulares",
          "Control de acceso a datos"
        ]
      },
      contact: {
        title: "Contacto",
        content: "Para asuntos relacionados con la protección de datos personales puedes contactarnos:",
        complaint: "También tienes derecho a presentar una queja ante la Autoridad de Protección de Datos."
      }
    }
  },
  en: {
    title: "Privacy Policy",
    lastUpdate: "Last update",
    sections: {
      admin: {
        title: "Personal Data Administrator",
        content: "The administrator of your personal data is DroneParts based in Poland. For matters related to personal data protection you can contact us:",
        email: "privacy@drone-partss.com",
        address: "ul. Smolna 14, 44-200 Rybnik, Poland"
      },
      legal: {
        title: "Legal Basis for Data Processing",
        content: "We process your personal data in accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 (GDPR) on the following bases:",
        items: [
          { code: "Art. 6(1)(a)", desc: "consent to data processing" },
          { code: "Art. 6(1)(b)", desc: "performance of a contract or pre-contractual actions" },
          { code: "Art. 6(1)(c)", desc: "compliance with a legal obligation" },
          { code: "Art. 6(1)(f)", desc: "legitimate interest of the administrator" }
        ]
      },
      purposes: {
        title: "Purposes of Data Processing",
        content: "We process your personal data for the following purposes:",
        items: [
          "Processing orders and sales contracts",
          "User account management",
          "Handling complaints and returns",
          "Newsletter sending (with consent)",
          "Direct marketing of products and services",
          "Statistical analysis and service quality improvement",
          "Fulfillment of tax and accounting obligations"
        ]
      },
      dataTypes: {
        title: "Types of Data Collected",
        content: "We collect the following categories of personal data:",
        items: [
          { title: "Identification data", desc: "first name, last name" },
          { title: "Contact data", desc: "email, phone, address" },
          { title: "Transaction data", desc: "order history, payments" },
          { title: "Technical data", desc: "IP, browser, cookies" }
        ]
      },
      retention: {
        title: "Data Retention Period",
        content: "We store your data for the period:",
        items: [
          { period: "Account data", time: "until account deletion or consent withdrawal" },
          { period: "Transaction data", time: "5 years from the end of the tax year" },
          { period: "Marketing data", time: "until consent withdrawal" },
          { period: "Cookie data", time: "according to cookie settings" }
        ]
      },
      rights: {
        title: "Your Rights (GDPR)",
        content: "Under GDPR, you have the following rights:",
        items: [
          { right: "Right of access", desc: "you can obtain information about processed data" },
          { right: "Right to rectification", desc: "you can request correction of incorrect data" },
          { right: "Right to erasure", desc: "you can request data deletion (\"right to be forgotten\")" },
          { right: "Right to restriction", desc: "you can limit the scope of processing" },
          { right: "Right to portability", desc: "you can receive data in electronic format" },
          { right: "Right to object", desc: "you can object to data processing" },
          { right: "Right to withdraw consent", desc: "you can withdraw your consent at any time" },
          { right: "Right to complaint", desc: "you can file a complaint with the supervisory authority" }
        ]
      },
      cookies: {
        title: "Cookies",
        content: "Our website uses cookies. These are small text files stored on your device. We use the following types of cookies:",
        items: [
          { type: "Necessary", desc: "required for site operation", color: "bg-green-100 text-green-700" },
          { type: "Analytical", desc: "help understand site usage", color: "bg-blue-100 text-blue-700" },
          { type: "Marketing", desc: "used to personalize ads", color: "bg-purple-100 text-purple-700" },
          { type: "Preferences", desc: "remember your settings", color: "bg-orange-100 text-orange-700" }
        ],
        manage: "You can manage cookies in your browser settings or through our preferences panel."
      },
      recipients: {
        title: "Data Recipients",
        content: "Your data may be transferred to:",
        items: [
          "Courier companies (DHL, GLS) - for order delivery",
          "Payment operators (Stripe, PayPal) - for payment processing",
          "IT service providers - hosting, email",
          "State authorities - when required by law"
        ]
      },
      security: {
        title: "Data Security",
        content: "We apply appropriate technical and organizational measures to protect your data:",
        items: [
          "SSL/TLS encryption",
          "Secure password storage (bcrypt)",
          "Regular backups",
          "Data access control"
        ]
      },
      contact: {
        title: "Contact",
        content: "For matters related to personal data protection you can contact us:",
        complaint: "You also have the right to file a complaint with the Data Protection Authority."
      }
    }
  },
  pl: {
    title: "Polityka Prywatności",
    lastUpdate: "Ostatnia aktualizacja",
    sections: {
      admin: {
        title: "Administrator danych osobowych",
        content: "Administratorem Twoich danych osobowych jest DroneParts z siedzibą w Polsce. W sprawach związanych z ochroną danych osobowych możesz kontaktować się z nami:",
        email: "privacy@drone-partss.com",
        address: "ul. Smolna 14, 44-200 Rybnik, Polska"
      },
      legal: {
        title: "Podstawa prawna przetwarzania danych",
        content: "Przetwarzamy Twoje dane osobowe zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO/GDPR) na następujących podstawach:",
        items: [
          { code: "Art. 6 ust. 1 lit. a)", desc: "zgoda na przetwarzanie danych" },
          { code: "Art. 6 ust. 1 lit. b)", desc: "wykonanie umowy lub podjęcie działań przed jej zawarciem" },
          { code: "Art. 6 ust. 1 lit. c)", desc: "wypełnienie obowiązku prawnego" },
          { code: "Art. 6 ust. 1 lit. f)", desc: "prawnie uzasadniony interes administratora" }
        ]
      },
      purposes: {
        title: "Cele przetwarzania danych",
        content: "Twoje dane osobowe przetwarzamy w następujących celach:",
        items: [
          "Realizacja zamówień i umów sprzedaży",
          "Obsługa konta użytkownika",
          "Obsługa reklamacji i zwrotów",
          "Wysyłka newslettera (za zgodą)",
          "Marketing bezpośredni produktów i usług",
          "Analiza statystyczna i poprawa jakości usług",
          "Wypełnienie obowiązków podatkowych i rachunkowych"
        ]
      },
      dataTypes: {
        title: "Rodzaje zbieranych danych",
        content: "Zbieramy następujące kategorie danych osobowych:",
        items: [
          { title: "Dane identyfikacyjne", desc: "imię, nazwisko" },
          { title: "Dane kontaktowe", desc: "e-mail, telefon, adres" },
          { title: "Dane transakcyjne", desc: "historia zamówień, płatności" },
          { title: "Dane techniczne", desc: "IP, przeglądarka, cookies" }
        ]
      },
      retention: {
        title: "Okres przechowywania danych",
        content: "Przechowujemy Twoje dane przez okres:",
        items: [
          { period: "Dane konta", time: "do czasu usunięcia konta lub wycofania zgody" },
          { period: "Dane transakcyjne", time: "5 lat od końca roku podatkowego" },
          { period: "Dane marketingowe", time: "do czasu wycofania zgody" },
          { period: "Dane z cookies", time: "zgodnie z ustawieniami plików cookies" }
        ]
      },
      rights: {
        title: "Twoje prawa (RODO)",
        content: "Zgodnie z RODO przysługują Ci następujące prawa:",
        items: [
          { right: "Prawo dostępu", desc: "możesz uzyskać informacje o przetwarzanych danych" },
          { right: "Prawo do sprostowania", desc: "możesz żądać poprawienia nieprawidłowych danych" },
          { right: "Prawo do usunięcia", desc: "możesz żądać usunięcia danych (\"prawo do bycia zapomnianym\")" },
          { right: "Prawo do ograniczenia", desc: "możesz ograniczyć zakres przetwarzania" },
          { right: "Prawo do przenoszenia", desc: "możesz otrzymać dane w formacie elektronicznym" },
          { right: "Prawo do sprzeciwu", desc: "możesz sprzeciwić się przetwarzaniu danych" },
          { right: "Prawo do cofnięcia zgody", desc: "w każdej chwili możesz cofnąć zgodę" },
          { right: "Prawo do skargi", desc: "możesz złożyć skargę do organu nadzorczego (UODO)" }
        ]
      },
      cookies: {
        title: "Pliki cookies",
        content: "Nasza strona wykorzystuje pliki cookies (ciasteczka). Są to małe pliki tekstowe przechowywane na Twoim urządzeniu. Używamy następujących rodzajów cookies:",
        items: [
          { type: "Niezbędne", desc: "konieczne do działania strony", color: "bg-green-100 text-green-700" },
          { type: "Analityczne", desc: "pomagają zrozumieć użycie strony", color: "bg-blue-100 text-blue-700" },
          { type: "Marketingowe", desc: "służą do personalizacji reklam", color: "bg-purple-100 text-purple-700" },
          { type: "Preferencje", desc: "zapamiętują Twoje ustawienia", color: "bg-orange-100 text-orange-700" }
        ],
        manage: "Możesz zarządzać cookies w ustawieniach przeglądarki lub przez nasz panel preferencji."
      },
      recipients: {
        title: "Odbiorcy danych",
        content: "Twoje dane mogą być przekazywane:",
        items: [
          "Firmom kurierskim (DHL, GLS) - w celu dostawy zamówień",
          "Operatorom płatności (Stripe, PayPal) - w celu realizacji płatności",
          "Dostawcom usług IT - hosting, e-mail",
          "Organom państwowym - gdy wymagają tego przepisy prawa"
        ]
      },
      security: {
        title: "Bezpieczeństwo danych",
        content: "Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony Twoich danych:",
        items: [
          "Szyfrowanie SSL/TLS",
          "Bezpieczne przechowywanie haseł (bcrypt)",
          "Regularne kopie zapasowe",
          "Kontrola dostępu do danych"
        ]
      },
      contact: {
        title: "Kontakt",
        content: "W sprawach związanych z ochroną danych osobowych możesz kontaktować się z nami:",
        complaint: "Masz również prawo złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa."
      }
    }
  }
};

export default function PrivacyPolicyPage() {
  const locale = useLocale();
  const t = translations[locale as keyof typeof translations] || translations.pl;

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-200">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
            {t.title}
          </h1>
          <p className="text-neutral-500 text-sm">
            {t.lastUpdate}: {new Date().toLocaleDateString(locale === "pl" ? "pl-PL" : locale === "es" ? "es-ES" : "en-US")}
          </p>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none">
        {/* Section 1 - Admin */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">1</span>
            {t.sections.admin.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.admin.content}</p>
          <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-neutral-400" />
              <span className="text-neutral-700">{t.sections.admin.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-neutral-400" />
              <span className="text-neutral-700">{t.sections.admin.address}</span>
            </div>
          </div>
        </section>

        {/* Section 2 - Legal */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">2</span>
            {t.sections.legal.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.legal.content}</p>
          <div className="grid gap-3">
            {t.sections.legal.items.map((item, idx) => (
              <div key={idx} className="bg-neutral-50 rounded-xl p-4">
                <span className="font-semibold text-neutral-900">{item.code}</span>
                <p className="text-neutral-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 - Purposes */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">3</span>
            {t.sections.purposes.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.purposes.content}</p>
          <ul className="space-y-2">
            {t.sections.purposes.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-neutral-600">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4 - Data Types */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">4</span>
            {t.sections.dataTypes.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.dataTypes.content}</p>
          <div className="grid md:grid-cols-2 gap-3">
            {t.sections.dataTypes.items.map((item, idx) => (
              <div key={idx} className="bg-neutral-50 rounded-xl p-4">
                <span className="font-semibold text-neutral-900">{item.title}</span>
                <p className="text-neutral-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 - Retention */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">5</span>
            {t.sections.retention.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.retention.content}</p>
          <div className="space-y-3">
            {t.sections.retention.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-neutral-50 rounded-xl p-4">
                <span className="font-medium text-neutral-900">{item.period}</span>
                <span className="text-neutral-600 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 - Rights */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">6</span>
            {t.sections.rights.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.rights.content}</p>
          <div className="grid gap-3">
            {t.sections.rights.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-neutral-50 rounded-xl p-4">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  ✓
                </span>
                <div>
                  <span className="font-semibold text-neutral-900">{item.right}</span>
                  <p className="text-neutral-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7 - Cookies */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">7</span>
            {t.sections.cookies.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.cookies.content}</p>
          <div className="grid md:grid-cols-2 gap-3">
            {t.sections.cookies.items.map((item, idx) => (
              <div key={idx} className="bg-neutral-50 rounded-xl p-4">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${item.color}`}>
                  {item.type}
                </span>
                <p className="text-neutral-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-neutral-600 mt-4">{t.sections.cookies.manage}</p>
        </section>

        {/* Section 8 - Recipients */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">8</span>
            {t.sections.recipients.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.recipients.content}</p>
          <ul className="space-y-2">
            {t.sections.recipients.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-neutral-600">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 9 - Security */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">9</span>
            {t.sections.security.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.security.content}</p>
          <div className="grid md:grid-cols-2 gap-3">
            {t.sections.security.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-green-50 rounded-xl p-4">
                <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                <span className="text-neutral-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="p-6 bg-blue-50 rounded-2xl">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">{t.sections.contact.title}</h2>
          <p className="text-neutral-600 mb-4">{t.sections.contact.content}</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="text-neutral-700">privacy@drone-partss.com</span>
            </div>
          </div>
          <p className="text-neutral-600 mt-4 text-sm">{t.sections.contact.complaint}</p>
        </section>
      </div>
    </div>
  );
}
