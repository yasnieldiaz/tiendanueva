"use client";

import { useLocale } from "next-intl";
import {
  Truck,
  Package,
  RefreshCw,
  Clock,
  MapPin,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const translations = {
  pl: {
    title: "Dostawa i Zwroty",
    subtitle: "Informacje o wysyłce i zwrotach",
    shippingMethods: "Metody dostawy",
    shippingDescription:
      "Oferujemy szybką i bezpieczną dostawę na terenie całej Unii Europejskiej.",
    freeShipping: "Darmowa dostawa!",
    freeShippingDesc: "Przy zamówieniach powyżej 5000 zł",
    processingTime: "Czas realizacji",
    processingDescription:
      "Zamówienia są przetwarzane w ciągu 1-3 dni roboczych. Po wysłaniu otrzymasz e-mail z numerem śledzenia przesyłki.",
    businessDays: "dni robocze",
    orderPreparation: "Kompletowanie zamówienia",
    hours: "godzin",
    deliveryTime: "Czas dostawy",
    tracking: "tracking",
    shipmentTracking: "Śledzenie przesyłki",
    outOfStockNote:
      "W przypadku braku towaru w magazynie skontaktujemy się z Tobą w celu ustalenia terminu realizacji.",
    deliveryCountries: "Obszar dostawy",
    deliveryCountriesDescription:
      "Realizujemy dostawy na terenie całej Unii Europejskiej:",
    countriesList: [
      "Polska",
      "Niemcy",
      "Czechy",
      "Słowacja",
      "Litwa",
      "Łotwa",
      "Estonia",
      "Węgry",
      "Austria",
      "Francja",
      "Holandia",
      "Belgia",
      "Włochy",
      "Hiszpania",
      "Portugalia",
      "Grecja",
      "Rumunia",
      "Bułgaria",
      "Szwecja",
      "Dania",
      "Finlandia",
      "Irlandia",
      "Słowenia",
      "Chorwacja",
      "Luksemburg",
      "Malta",
      "Cypr",
    ],
    outsideEUNote:
      "Dla dostaw poza UE prosimy o kontakt w celu ustalenia kosztów wysyłki.",
    returnPolicy: "Zwroty",
    returnDays: "dni na zwrot",
    withoutReason: "bez podania przyczyny",
    returnPolicyDescription:
      "Zgodnie z Dyrektywą 2011/83/UE masz prawo odstąpić od umowy w ciągu 14 dni od daty otrzymania towaru bez podawania przyczyny.",
    returnProcess: "Jak dokonać zwrotu?",
    returnSteps: [
      {
        title: "Wypełnij formularz",
        description:
          "Wypełnij formularz zwrotu na naszej stronie lub wyślij e-mail",
      },
      {
        title: "Zapakuj towar",
        description:
          "Zapakuj produkt w oryginalnym opakowaniu lub odpowiednio zabezpiecz",
      },
      {
        title: "Wyślij przesyłkę",
        description: "Wyślij paczkę na nasz adres (koszty pokrywa kupujący)",
      },
      {
        title: "Otrzymaj zwrot",
        description: "Po otrzymaniu towaru zwrot pieniędzy w ciągu 14 dni",
      },
    ],
    importantNotes: "Ważne informacje",
    notes: [
      "Towar musi być nienaruszony i w oryginalnym opakowaniu",
      "Dołącz dowód zakupu (paragon lub fakturę)",
      "Koszty zwrotu pokrywa kupujący",
      "Prawo zwrotu nie dotyczy produktów wykonanych na zamówienie",
      "Zwrot dotyczy tylko konsumentów (osób fizycznych)",
    ],
    contactUs: "Masz pytania dotyczące dostawy?",
    contactDescription: "Nasz zespół obsługi klienta chętnie pomoże.",
    inpostName: "InPost Paczkomaty",
    inpostDesc: "Odbiór w paczkomacie 24/7",
    glsName: "GLS Kurier",
    glsDesc: "Dostawa pod wskazany adres",
    dhlName: "DHL Express",
    dhlDesc: "Ekspresowa dostawa priorytetowa",
    gross: "brutto",
  },
  en: {
    title: "Shipping & Returns",
    subtitle: "Shipping and returns information",
    shippingMethods: "Shipping Methods",
    shippingDescription:
      "We offer fast and secure delivery throughout the European Union.",
    freeShipping: "Free shipping!",
    freeShippingDesc: "On orders over 5000 PLN",
    processingTime: "Processing Time",
    processingDescription:
      "Orders are processed within 1-3 business days. Once shipped, you will receive an email with a tracking number.",
    businessDays: "business days",
    orderPreparation: "Order preparation",
    hours: "hours",
    deliveryTime: "Delivery time",
    tracking: "tracking",
    shipmentTracking: "Shipment tracking",
    outOfStockNote:
      "If an item is out of stock, we will contact you to arrange the delivery date.",
    deliveryCountries: "Delivery Area",
    deliveryCountriesDescription:
      "We deliver throughout the European Union:",
    countriesList: [
      "Poland",
      "Germany",
      "Czech Republic",
      "Slovakia",
      "Lithuania",
      "Latvia",
      "Estonia",
      "Hungary",
      "Austria",
      "France",
      "Netherlands",
      "Belgium",
      "Italy",
      "Spain",
      "Portugal",
      "Greece",
      "Romania",
      "Bulgaria",
      "Sweden",
      "Denmark",
      "Finland",
      "Ireland",
      "Slovenia",
      "Croatia",
      "Luxembourg",
      "Malta",
      "Cyprus",
    ],
    outsideEUNote:
      "For deliveries outside the EU, please contact us to arrange shipping costs.",
    returnPolicy: "Returns",
    returnDays: "days to return",
    withoutReason: "without giving a reason",
    returnPolicyDescription:
      "In accordance with EU Directive 2011/83/EU, you have the right to withdraw from the contract within 14 days of receiving the goods without giving any reason.",
    returnProcess: "How to make a return?",
    returnSteps: [
      {
        title: "Fill out the form",
        description:
          "Fill out the return form on our website or send an email",
      },
      {
        title: "Pack the item",
        description:
          "Pack the product in original packaging or secure it properly",
      },
      {
        title: "Send the package",
        description:
          "Send the package to our address (shipping costs covered by the buyer)",
      },
      {
        title: "Receive refund",
        description: "After receiving the item, refund within 14 days",
      },
    ],
    importantNotes: "Important Information",
    notes: [
      "The item must be undamaged and in original packaging",
      "Include proof of purchase (receipt or invoice)",
      "Return shipping costs are covered by the buyer",
      "The right of return does not apply to custom-made products",
      "Returns apply only to consumers (natural persons)",
    ],
    contactUs: "Have questions about delivery?",
    contactDescription: "Our customer service team is happy to help.",
    inpostName: "InPost Parcel Lockers",
    inpostDesc: "24/7 parcel locker pickup",
    glsName: "GLS Courier",
    glsDesc: "Delivery to your address",
    dhlName: "DHL Express",
    dhlDesc: "Express priority delivery",
    gross: "gross",
  },
  es: {
    title: "Envio y Devoluciones",
    subtitle: "Informacion sobre envios y devoluciones",
    shippingMethods: "Metodos de Envio",
    shippingDescription:
      "Ofrecemos envio rapido y seguro a toda la Union Europea.",
    freeShipping: "Envio gratuito!",
    freeShippingDesc: "En pedidos superiores a 5000 PLN",
    processingTime: "Tiempo de Procesamiento",
    processingDescription:
      "Los pedidos se procesan en 1-3 dias habiles. Una vez enviado, recibiras un correo electronico con el numero de seguimiento.",
    businessDays: "dias habiles",
    orderPreparation: "Preparacion del pedido",
    hours: "horas",
    deliveryTime: "Tiempo de entrega",
    tracking: "seguimiento",
    shipmentTracking: "Seguimiento del envio",
    outOfStockNote:
      "Si un articulo no esta disponible, nos pondremos en contacto para acordar la fecha de entrega.",
    deliveryCountries: "Area de Entrega",
    deliveryCountriesDescription:
      "Realizamos entregas en toda la Union Europea:",
    countriesList: [
      "Polonia",
      "Alemania",
      "Republica Checa",
      "Eslovaquia",
      "Lituania",
      "Letonia",
      "Estonia",
      "Hungria",
      "Austria",
      "Francia",
      "Paises Bajos",
      "Belgica",
      "Italia",
      "Espana",
      "Portugal",
      "Grecia",
      "Rumania",
      "Bulgaria",
      "Suecia",
      "Dinamarca",
      "Finlandia",
      "Irlanda",
      "Eslovenia",
      "Croacia",
      "Luxemburgo",
      "Malta",
      "Chipre",
    ],
    outsideEUNote:
      "Para envios fuera de la UE, contactenos para establecer los costos de envio.",
    returnPolicy: "Devoluciones",
    returnDays: "dias para devolver",
    withoutReason: "sin dar ninguna razon",
    returnPolicyDescription:
      "De acuerdo con la Directiva UE 2011/83/UE, tienes derecho a desistir del contrato dentro de los 14 dias posteriores a la recepcion de la mercancia sin dar ninguna razon.",
    returnProcess: "Como hacer una devolucion?",
    returnSteps: [
      {
        title: "Completa el formulario",
        description:
          "Completa el formulario de devolucion en nuestra web o envia un correo electronico",
      },
      {
        title: "Empaca el articulo",
        description:
          "Empaca el producto en su embalaje original o aseguralo adecuadamente",
      },
      {
        title: "Envia el paquete",
        description:
          "Envia el paquete a nuestra direccion (costos de envio cubiertos por el comprador)",
      },
      {
        title: "Recibe el reembolso",
        description:
          "Despues de recibir el articulo, reembolso en 14 dias",
      },
    ],
    importantNotes: "Informacion Importante",
    notes: [
      "El articulo debe estar sin danar y en su embalaje original",
      "Incluye el comprobante de compra (recibo o factura)",
      "Los costos de envio de devolucion son cubiertos por el comprador",
      "El derecho de devolucion no aplica a productos hechos a medida",
      "Las devoluciones aplican solo a consumidores (personas fisicas)",
    ],
    contactUs: "Tienes preguntas sobre la entrega?",
    contactDescription:
      "Nuestro equipo de atencion al cliente estara encantado de ayudarte.",
    inpostName: "InPost Casilleros",
    inpostDesc: "Recogida en casillero 24/7",
    glsName: "GLS Mensajero",
    glsDesc: "Entrega a tu direccion",
    dhlName: "DHL Express",
    dhlDesc: "Entrega prioritaria express",
    gross: "bruto",
  },
};

export default function ShippingPage() {
  const locale = useLocale();
  const t =
    translations[locale as keyof typeof translations] || translations.en;

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-200">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <Truck className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
            {t.title}
          </h1>
          <p className="text-neutral-500 text-sm">{t.subtitle}</p>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none">
        {/* Shipping Options */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">
              {t.shippingMethods}
            </h2>
          </div>

          <div className="grid gap-4">
            {/* InPost */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Package className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-lg m-0">
                      {t.inpostName}
                    </h3>
                    <p className="text-neutral-600 text-sm m-0">
                      {t.inpostDesc}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-neutral-700">24-48h</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-orange-600">
                    18 zl
                  </span>
                  <p className="text-sm text-neutral-500 m-0">{t.gross}</p>
                </div>
              </div>
            </div>

            {/* GLS */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Truck className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-lg m-0">
                      {t.glsName}
                    </h3>
                    <p className="text-neutral-600 text-sm m-0">{t.glsDesc}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-neutral-700">24-48h</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-600">
                    24 zl
                  </span>
                  <p className="text-sm text-neutral-500 m-0">{t.gross}</p>
                </div>
              </div>
            </div>

            {/* DHL Express */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Truck className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-lg m-0">
                      {t.dhlName}
                    </h3>
                    <p className="text-neutral-600 text-sm m-0">{t.dhlDesc}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-neutral-700">24h</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-yellow-600">
                    35 zl
                  </span>
                  <p className="text-sm text-neutral-500 m-0">{t.gross}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Free Shipping Banner */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg m-0">{t.freeShipping}</p>
                <p className="text-green-100 text-sm m-0">
                  {t.freeShippingDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Area */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">
              {t.deliveryCountries}
            </h2>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6">
            <p className="text-neutral-700 mb-4">
              {t.deliveryCountriesDescription}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {t.countriesList.map((country) => (
                <div
                  key={country}
                  className="bg-white rounded-lg px-3 py-2 text-center text-sm font-medium text-neutral-700"
                >
                  {country}
                </div>
              ))}
            </div>
            <p className="text-neutral-600 text-sm mt-4">{t.outsideEUNote}</p>
          </div>
        </section>

        {/* Order Processing */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">
              {t.processingTime}
            </h2>
          </div>

          <div className="bg-purple-50 rounded-2xl p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <span className="text-3xl font-bold text-purple-600">1-3</span>
                <p className="text-sm text-neutral-600 m-0">{t.businessDays}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {t.orderPreparation}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <span className="text-3xl font-bold text-purple-600">
                  24-48
                </span>
                <p className="text-sm text-neutral-600 m-0">{t.hours}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {t.deliveryTime}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <span className="text-3xl font-bold text-purple-600">24/7</span>
                <p className="text-sm text-neutral-600 m-0">{t.tracking}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {t.shipmentTracking}
                </p>
              </div>
            </div>
            <p className="text-neutral-600 text-sm mt-4">{t.outOfStockNote}</p>
          </div>
        </section>

        {/* Returns Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">
              {t.returnPolicy}
            </h2>
          </div>

          {/* 14 Days Return */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 mb-4 border border-green-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-4xl font-bold text-green-600">14</span>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-xl m-0">
                  {t.returnDays}
                </h3>
                <p className="text-green-700 m-0">{t.withoutReason}</p>
              </div>
            </div>
            <p className="text-neutral-600 text-sm">
              {t.returnPolicyDescription}
            </p>
          </div>

          {/* How to Return */}
          <div className="bg-neutral-50 rounded-2xl p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              {t.returnProcess}
            </h3>
            <div className="space-y-4">
              {t.returnSteps.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 m-0">
                      {item.title}
                    </h4>
                    <p className="text-neutral-600 text-sm m-0">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">
              {t.importantNotes}
            </h2>
          </div>

          <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
            <ul className="space-y-3 m-0">
              {t.notes.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-neutral-700"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact Box */}
        <section className="p-6 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl text-white">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {t.contactUs}
          </h2>
          <p className="text-neutral-300 mb-4">{t.contactDescription}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:info@drone-partss.com"
              className="inline-flex items-center gap-2 bg-white text-neutral-900 px-4 py-2 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              info@drone-partss.com
            </a>
            <a
              href="tel:+48123456789"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors"
            >
              +48 123 456 789
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
