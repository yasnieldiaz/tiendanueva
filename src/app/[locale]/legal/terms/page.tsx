"use client";

import Link from "next/link";
import { FileText, AlertCircle, CreditCard, Truck, RefreshCw, Shield, Scale, HelpCircle, Mail, MapPin, Building } from "lucide-react";
import { useLocale } from "next-intl";

const translations = {
  es: {
    title: "Terminos y Condiciones",
    lastUpdate: "Ultima actualizacion",
    sections: {
      general: {
        title: "Disposiciones generales",
        items: [
          "La tienda online DroneParts, disponible en www.drone-partss.com, es operada por DroneParts Sp. z o.o.",
          "Este reglamento define las normas de uso de la tienda online, realizacion de pedidos, entrega de productos, pagos, desistimiento del contrato y reclamaciones.",
          "La condicion para usar la tienda es la aceptacion de este Reglamento.",
          "La tienda realiza ventas en el territorio de la Union Europea."
        ]
      },
      definitions: {
        title: "Definiciones",
        items: [
          { term: "Vendedor", def: "DroneParts Sp. z o.o., NIP: XXXXXXXXXX" },
          { term: "Cliente", def: "persona fisica, juridica o unidad organizativa que realiza compras" },
          { term: "Consumidor", def: "persona fisica que realiza una compra no relacionada con actividad empresarial" },
          { term: "Tienda", def: "tienda online disponible en www.drone-partss.com" },
          { term: "Pedido", def: "declaracion de voluntad del Cliente dirigida a celebrar un contrato de venta" },
          { term: "Producto", def: "producto ofrecido en la tienda" }
        ]
      },
      ordering: {
        title: "Realizacion de pedidos",
        intro: "Se pueden realizar pedidos las 24 horas del dia, los 7 dias de la semana.",
        steps: [
          "Seleccionar productos y agregarlos al carrito",
          "Completar el formulario de pedido",
          "Elegir el metodo de envio y pago",
          "Confirmar el pedido"
        ],
        items: [
          "Despues de realizar el pedido, el Cliente recibe una confirmacion en la direccion de correo electronico proporcionada.",
          "El contrato de venta se celebra en el momento en que el Cliente recibe la confirmacion de aceptacion del pedido."
        ]
      },
      prices: {
        title: "Precios y pagos",
        items: [
          "Los precios indicados en la tienda son precios brutos (incluyen IVA).",
          "Los precios se expresan en zlotys polacos (PLN), euros (EUR) o dolares estadounidenses (USD)."
        ],
        paymentMethods: "Metodos de pago disponibles:",
        methods: ["Visa", "Mastercard", "PayPal", "Stripe", "Apple Pay", "Transferencia"],
        paymentNote: "El pago debe realizarse dentro de los 7 dias posteriores a la realizacion del pedido."
      },
      delivery: {
        title: "Entrega",
        intro: "La entrega se realiza en el territorio de la Union Europea.",
        options: [
          { name: "InPost Paczkomaty", time: "24-48 horas", price: "18 zl" },
          { name: "GLS Mensajero", time: "24-48 horas", price: "24 zl" }
        ],
        freeShipping: "Envio gratuito para pedidos superiores a 5000 zl!"
      },
      withdrawal: {
        title: "Derecho de desistimiento",
        badge: {
          days: "14",
          label: "dias para devolucion",
          sublabel: "sin dar razones"
        },
        items: [
          "El Consumidor tiene derecho a desistir del contrato en un plazo de 14 dias sin dar razones (de acuerdo con la Directiva 2011/83/UE).",
          "El plazo para desistir comienza desde el dia de recepcion del producto.",
          "Para desistir, se debe presentar una declaracion (correo electronico o formulario en la pagina).",
          "El producto debe devolverse dentro de los 14 dias posteriores al desistimiento.",
          "El Vendedor devuelve todos los pagos dentro de los 14 dias posteriores a la recepcion del producto.",
          "Los costos de devolucion del producto corren por cuenta del Consumidor.",
          "El derecho de desistimiento no se aplica a productos hechos a medida."
        ]
      },
      complaints: {
        title: "Reclamaciones y garantia",
        warranty: {
          months: "24",
          monthsLabel: "meses de garantia legal",
          years: "2",
          yearsLabel: "anos de garantia"
        },
        intro: "Se puede presentar una reclamacion:",
        methods: [
          "Por correo electronico: reklamacje@drone-partss.com",
          "A traves del formulario en la pagina",
          "Por correo a la direccion de la sede"
        ],
        note: "La reclamacion se resolvera en un plazo de 14 dias."
      },
      dataProtection: {
        title: "Proteccion de datos personales",
        items: [
          "El administrador de datos personales es el Vendedor.",
          "Los datos se procesan de acuerdo con el RGPD (Reglamento UE 2016/679).",
          "Los detalles sobre el procesamiento de datos se encuentran en la",
          "El Cliente tiene derecho a acceder, rectificar, eliminar y transferir datos."
        ],
        privacyLink: "Politica de Privacidad"
      },
      disputes: {
        title: "Resolucion de disputas",
        items: [
          "Todas las disputas se resolveran de manera amistosa.",
          "El Consumidor puede utilizar metodos extrajudiciales de resolucion de disputas:",
          "El tribunal competente es el tribunal segun la sede del Vendedor o el lugar de residencia del Consumidor."
        ],
        methods: [
          { name: "Plataforma ODR", link: "ec.europa.eu/consumers/odr" },
          { name: "Defensor del consumidor", link: null },
          { name: "Inspeccion de Comercio", link: null }
        ]
      },
      euInfo: {
        title: "Informacion para consumidores de la UE",
        content: "De acuerdo con la Directiva 2011/83/UE sobre derechos de los consumidores y el Reglamento (UE) 2016/679 (RGPD), garantizamos la plena proteccion de sus derechos como consumidor en la Union Europea.",
        items: [
          { icon: "arrow-left", text: "14 dias de derecho a devolucion" },
          { icon: "shield", text: "2 anos de garantia" },
          { icon: "lock", text: "Proteccion de datos RGPD" },
          { icon: "scale", text: "Plataforma ODR" }
        ]
      }
    },
    company: {
      name: "DroneParts Sp. z o.o.",
      address: "ul. Smolna 14, 44-200 Rybnik, Polonia",
      email: "kontakt@drone-partss.com"
    }
  },
  en: {
    title: "Terms and Conditions",
    lastUpdate: "Last update",
    sections: {
      general: {
        title: "General provisions",
        items: [
          "The online store DroneParts, available at www.drone-partss.com, is operated by DroneParts Sp. z o.o.",
          "This regulation defines the rules for using the online store, placing orders, delivery of goods, payments, withdrawal from the contract, and complaints.",
          "The condition for using the store is acceptance of this Regulation.",
          "The store conducts sales within the European Union territory."
        ]
      },
      definitions: {
        title: "Definitions",
        items: [
          { term: "Seller", def: "DroneParts Sp. z o.o., NIP: XXXXXXXXXX" },
          { term: "Customer", def: "natural person, legal entity, or organizational unit making purchases" },
          { term: "Consumer", def: "natural person making a purchase unrelated to business activity" },
          { term: "Store", def: "online store available at www.drone-partss.com" },
          { term: "Order", def: "Customer's declaration of intent to conclude a sales contract" },
          { term: "Product", def: "product offered in the store" }
        ]
      },
      ordering: {
        title: "Placing orders",
        intro: "Orders can be placed 24 hours a day, 7 days a week.",
        steps: [
          "Select products and add them to the cart",
          "Fill out the order form",
          "Choose the delivery and payment method",
          "Confirm the order"
        ],
        items: [
          "After placing an order, the Customer receives confirmation at the provided email address.",
          "The sales contract is concluded when the Customer receives confirmation of order acceptance."
        ]
      },
      prices: {
        title: "Prices and payments",
        items: [
          "Prices shown in the store are gross prices (including VAT).",
          "Prices are expressed in Polish zlotys (PLN), euros (EUR), or US dollars (USD)."
        ],
        paymentMethods: "Available payment methods:",
        methods: ["Visa", "Mastercard", "PayPal", "Stripe", "Apple Pay", "Bank Transfer"],
        paymentNote: "Payment must be made within 7 days of placing the order."
      },
      delivery: {
        title: "Delivery",
        intro: "Delivery is carried out within the European Union territory.",
        options: [
          { name: "InPost Parcel Lockers", time: "24-48 hours", price: "18 PLN" },
          { name: "GLS Courier", time: "24-48 hours", price: "24 PLN" }
        ],
        freeShipping: "Free shipping for orders over 5000 PLN!"
      },
      withdrawal: {
        title: "Right of withdrawal",
        badge: {
          days: "14",
          label: "days for return",
          sublabel: "without giving reasons"
        },
        items: [
          "The Consumer has the right to withdraw from the contract within 14 days without giving reasons (in accordance with Directive 2011/83/EU).",
          "The withdrawal period begins from the day the product is received.",
          "To withdraw, a declaration must be submitted (email or form on the website).",
          "The product must be returned within 14 days of withdrawal.",
          "The Seller refunds all payments within 14 days of receiving the product.",
          "The costs of returning the product are borne by the Consumer.",
          "The right of withdrawal does not apply to custom-made products."
        ]
      },
      complaints: {
        title: "Complaints and warranty",
        warranty: {
          months: "24",
          monthsLabel: "months statutory warranty",
          years: "2",
          yearsLabel: "years guarantee"
        },
        intro: "A complaint can be submitted:",
        methods: [
          "By email: reklamacje@drone-partss.com",
          "Through the form on the website",
          "By mail to the registered office address"
        ],
        note: "The complaint will be processed within 14 days."
      },
      dataProtection: {
        title: "Personal data protection",
        items: [
          "The administrator of personal data is the Seller.",
          "Data is processed in accordance with GDPR (EU Regulation 2016/679).",
          "Details regarding data processing can be found in the",
          "The Customer has the right to access, rectify, delete, and transfer data."
        ],
        privacyLink: "Privacy Policy"
      },
      disputes: {
        title: "Dispute resolution",
        items: [
          "All disputes will be resolved amicably.",
          "The Consumer may use out-of-court dispute resolution methods:",
          "The competent court is the court according to the Seller's registered office or the Consumer's place of residence."
        ],
        methods: [
          { name: "ODR Platform", link: "ec.europa.eu/consumers/odr" },
          { name: "Consumer ombudsman", link: null },
          { name: "Trade Inspection", link: null }
        ]
      },
      euInfo: {
        title: "Information for EU consumers",
        content: "In accordance with Directive 2011/83/EU on consumer rights and Regulation (EU) 2016/679 (GDPR), we ensure full protection of your rights as a consumer in the European Union.",
        items: [
          { icon: "arrow-left", text: "14-day right of return" },
          { icon: "shield", text: "2-year guarantee" },
          { icon: "lock", text: "GDPR data protection" },
          { icon: "scale", text: "ODR Platform" }
        ]
      }
    },
    company: {
      name: "DroneParts Sp. z o.o.",
      address: "ul. Smolna 14, 44-200 Rybnik, Poland",
      email: "kontakt@drone-partss.com"
    }
  },
  pl: {
    title: "Regulamin Sklepu",
    lastUpdate: "Ostatnia aktualizacja",
    sections: {
      general: {
        title: "Postanowienia ogolne",
        items: [
          "Sklep internetowy DroneParts, dostepny pod adresem www.drone-partss.com, prowadzony jest przez DroneParts Sp. z o.o.",
          "Regulamin okresla zasady korzystania ze sklepu internetowego, skladania zamowien, dostawy towarow, platnosci, odstapienia od umowy oraz reklamacji.",
          "Warunkiem korzystania ze sklepu jest akceptacja niniejszego Regulaminu.",
          "Sklep prowadzi sprzedaz na terenie Unii Europejskiej."
        ]
      },
      definitions: {
        title: "Definicje",
        items: [
          { term: "Sprzedawca", def: "DroneParts Sp. z o.o., NIP: XXXXXXXXXX" },
          { term: "Klient", def: "osoba fizyczna, prawna lub jednostka organizacyjna dokonujaca zakupow" },
          { term: "Konsument", def: "osoba fizyczna dokonujaca zakupu niezwiazanego z dzialalnoscia gospodarcza" },
          { term: "Sklep", def: "sklep internetowy dostepny pod adresem www.drone-partss.com" },
          { term: "Zamowienie", def: "oswiadczenie woli Klienta zmierzajace do zawarcia umowy sprzedazy" },
          { term: "Towar", def: "produkt oferowany w sklepie" }
        ]
      },
      ordering: {
        title: "Skladanie zamowien",
        intro: "Zamowienia mozna skladac 24 godziny na dobe, 7 dni w tygodniu.",
        steps: [
          "Wybrac produkty i dodac je do koszyka",
          "Wypelnic formularz zamowienia",
          "Wybrac sposob dostawy i platnosci",
          "Potwierdzic zamowienie"
        ],
        items: [
          "Po zlozeniu zamowienia Klient otrzymuje potwierdzenie na podany adres e-mail.",
          "Umowa sprzedazy zostaje zawarta z chwila otrzymania przez Klienta potwierdzenia przyjecia zamowienia."
        ]
      },
      prices: {
        title: "Ceny i platnosci",
        items: [
          "Ceny podane w sklepie sa cenami brutto (zawieraja podatek VAT).",
          "Ceny sa wyrazone w zlotych polskich (PLN), euro (EUR) lub dolarach (USD)."
        ],
        paymentMethods: "Dostepne metody platnosci:",
        methods: ["Visa", "Mastercard", "PayPal", "Stripe", "Apple Pay", "Przelew"],
        paymentNote: "Platnosc nalezy uregulowac w ciagu 7 dni od zlozenia zamowienia."
      },
      delivery: {
        title: "Dostawa",
        intro: "Dostawa realizowana jest na terenie Unii Europejskiej.",
        options: [
          { name: "InPost Paczkomaty", time: "24-48 godzin", price: "18 zl" },
          { name: "GLS Kurier", time: "24-48 godzin", price: "24 zl" }
        ],
        freeShipping: "Bezplatna dostawa przy zamowieniach powyzej 5000 zl!"
      },
      withdrawal: {
        title: "Prawo odstapienia od umowy",
        badge: {
          days: "14",
          label: "dni na zwrot",
          sublabel: "bez podania przyczyny"
        },
        items: [
          "Konsument ma prawo odstapic od umowy w terminie 14 dni bez podania przyczyny (zgodnie z Dyrektywa 2011/83/UE).",
          "Termin na odstapienie biegnie od dnia otrzymania towaru.",
          "W celu odstapienia nalezy zlozyc oswiadczenie (e-mail lub formularz na stronie).",
          "Towar nalezy zwrocic w terminie 14 dni od odstapienia.",
          "Sprzedawca zwraca wszystkie platnosci w ciagu 14 dni od otrzymania towaru.",
          "Koszty zwrotu towaru ponosi Konsument.",
          "Prawo odstapienia nie przysluguje w przypadku towarow wykonanych na zamowienie."
        ]
      },
      complaints: {
        title: "Reklamacje i gwarancja",
        warranty: {
          months: "24",
          monthsLabel: "miesiace rekojmi",
          years: "2",
          yearsLabel: "lata gwarancji"
        },
        intro: "Reklamacje mozna zlozyc:",
        methods: [
          "E-mailem: reklamacje@drone-partss.com",
          "Przez formularz na stronie",
          "Listownie na adres siedziby"
        ],
        note: "Reklamacja zostanie rozpatrzona w ciagu 14 dni."
      },
      dataProtection: {
        title: "Ochrona danych osobowych",
        items: [
          "Administratorem danych osobowych jest Sprzedawca.",
          "Dane przetwarzane sa zgodnie z RODO (Rozporzadzenie UE 2016/679).",
          "Szczegoly dotyczace przetwarzania danych znajduja sie w",
          "Klient ma prawo dostepu, sprostowania, usuniecia i przenoszenia danych."
        ],
        privacyLink: "Polityce Prywatnosci"
      },
      disputes: {
        title: "Rozstrzyganie sporow",
        items: [
          "Wszelkie spory beda rozstrzygane polubownie.",
          "Konsument moze skorzystac z pozasadowych sposobow rozwiazywania sporow:",
          "Sadem wlasciwym jest sad wedlug siedziby Sprzedawcy lub miejsca zamieszkania Konsumenta."
        ],
        methods: [
          { name: "Platforma ODR", link: "ec.europa.eu/consumers/odr" },
          { name: "Rzecznik konsumentow", link: null },
          { name: "Inspekcja Handlowa", link: null }
        ]
      },
      euInfo: {
        title: "Informacje dla konsumentow z UE",
        content: "Zgodnie z Dyrektywa 2011/83/UE w sprawie praw konsumentow oraz Rozporzadzeniem (UE) 2016/679 (RODO), zapewniamy pelna ochrone Twoich praw jako konsumenta w Unii Europejskiej.",
        items: [
          { icon: "arrow-left", text: "14-dniowe prawo do zwrotu" },
          { icon: "shield", text: "2-letnia gwarancja" },
          { icon: "lock", text: "Ochrona danych RODO" },
          { icon: "scale", text: "Platforma ODR" }
        ]
      }
    },
    company: {
      name: "DroneParts Sp. z o.o.",
      address: "ul. Smolna 14, 44-200 Rybnik, Polska",
      email: "kontakt@drone-partss.com"
    }
  }
};

export default function TermsPage() {
  const locale = useLocale();
  const t = translations[locale as keyof typeof translations] || translations.pl;

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-200">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-purple-600" />
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

      {/* Company Info Banner */}
      <div className="mb-8 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-neutral-400" />
            <span className="font-medium">{t.company.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <span>{t.company.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-neutral-400" />
            <span>{t.company.email}</span>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none">
        {/* Section 1 - General Provisions */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">1</span>
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-neutral-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">{t.sections.general.title}</h2>
          </div>
          <div className="bg-neutral-50 rounded-xl p-5">
            <ol className="list-decimal pl-5 text-neutral-600 space-y-3 m-0">
              {t.sections.general.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* Section 2 - Definitions */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">2</span>
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-neutral-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">{t.sections.definitions.title}</h2>
          </div>
          <div className="grid gap-3">
            {t.sections.definitions.items.map((item, idx) => (
              <div key={idx} className="bg-neutral-50 rounded-xl p-4 flex items-start gap-3">
                <span className="font-semibold text-neutral-900 min-w-[120px]">{item.term}</span>
                <span className="text-neutral-600">{item.def}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 - Ordering */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600">3</span>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">{t.sections.ordering.title}</h2>
          </div>
          <div className="bg-blue-50 rounded-xl p-5">
            <p className="text-neutral-600 mb-3">{t.sections.ordering.intro}</p>
            <ul className="list-disc pl-5 text-neutral-600 space-y-2 mb-4">
              {t.sections.ordering.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
            <ol className="list-decimal pl-5 text-neutral-600 space-y-2 m-0">
              {t.sections.ordering.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* Section 4 - Prices and Payments */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm font-bold text-green-600">4</span>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">{t.sections.prices.title}</h2>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <ol className="list-decimal pl-5 text-neutral-600 space-y-3 m-0">
              {t.sections.prices.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
              <li>{t.sections.prices.paymentMethods}</li>
            </ol>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
              {t.sections.prices.methods.map((method) => (
                <div key={method} className="bg-white rounded-lg px-3 py-2 text-center text-sm font-medium text-neutral-700 shadow-sm">
                  {method}
                </div>
              ))}
            </div>
            <p className="text-neutral-600 mt-3 text-sm">{t.sections.prices.paymentNote}</p>
          </div>
        </section>

        {/* Section 5 - Delivery */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm font-bold text-orange-600">5</span>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">{t.sections.delivery.title}</h2>
          </div>
          <div className="bg-orange-50 rounded-xl p-5">
            <p className="text-neutral-600 mb-4">{t.sections.delivery.intro}</p>
            <div className="space-y-3">
              {t.sections.delivery.options.map((option, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="font-semibold text-neutral-900">{option.name}</span>
                    <p className="text-sm text-neutral-500">{option.time}</p>
                  </div>
                  <span className="font-bold text-orange-600">{option.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium text-sm flex items-center gap-2">
                <span className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">&#10003;</span>
                {t.sections.delivery.freeShipping}
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 - Right of Withdrawal */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm font-bold text-purple-600">6</span>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">{t.sections.withdrawal.title}</h2>
          </div>
          <div className="bg-purple-50 rounded-xl p-5">
            {/* 14-day return badge */}
            <div className="flex items-center gap-3 mb-4 p-4 bg-purple-100 rounded-lg border border-purple-200">
              <span className="text-4xl font-bold text-purple-600">{t.sections.withdrawal.badge.days}</span>
              <div>
                <p className="font-semibold text-purple-900">{t.sections.withdrawal.badge.label}</p>
                <p className="text-sm text-purple-700">{t.sections.withdrawal.badge.sublabel}</p>
              </div>
            </div>
            <ol className="list-decimal pl-5 text-neutral-600 space-y-2 m-0">
              {t.sections.withdrawal.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* Section 7 - Complaints and Warranty */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-sm font-bold text-red-600">7</span>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">{t.sections.complaints.title}</h2>
          </div>
          <div className="bg-red-50 rounded-xl p-5">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <span className="text-3xl font-bold text-red-600">{t.sections.complaints.warranty.months}</span>
                <p className="text-sm text-neutral-600">{t.sections.complaints.warranty.monthsLabel}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <span className="text-3xl font-bold text-red-600">{t.sections.complaints.warranty.years}</span>
                <p className="text-sm text-neutral-600">{t.sections.complaints.warranty.yearsLabel}</p>
              </div>
            </div>
            <p className="text-neutral-600 mb-3">{t.sections.complaints.intro}</p>
            <ul className="space-y-2">
              {t.sections.complaints.methods.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-neutral-600">
                  <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-neutral-600 mt-4 text-sm">{t.sections.complaints.note}</p>
          </div>
        </section>

        {/* Section 8 - Data Protection */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600">8</span>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">{t.sections.dataProtection.title}</h2>
          </div>
          <div className="bg-blue-50 rounded-xl p-5">
            <ol className="list-decimal pl-5 text-neutral-600 space-y-2 m-0">
              <li>{t.sections.dataProtection.items[0]}</li>
              <li>{t.sections.dataProtection.items[1]}</li>
              <li>
                {t.sections.dataProtection.items[2]}{" "}
                <Link href="/legal/privacy" className="text-blue-600 hover:underline font-medium">
                  {t.sections.dataProtection.privacyLink}
                </Link>.
              </li>
              <li>{t.sections.dataProtection.items[3]}</li>
            </ol>
          </div>
        </section>

        {/* Section 9 - Dispute Resolution */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">9</span>
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-neutral-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 m-0">{t.sections.disputes.title}</h2>
          </div>
          <div className="bg-neutral-50 rounded-xl p-5">
            <ol className="list-decimal pl-5 text-neutral-600 space-y-2 m-0">
              <li>{t.sections.disputes.items[0]}</li>
              <li>
                {t.sections.disputes.items[1]}
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {t.sections.disputes.methods.map((method, idx) => (
                    <li key={idx}>
                      {method.link ? (
                        <>
                          {method.name}:{" "}
                          <a
                            href={`https://${method.link}`}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {method.link}
                          </a>
                        </>
                      ) : (
                        method.name
                      )}
                    </li>
                  ))}
                </ul>
              </li>
              <li>{t.sections.disputes.items[2]}</li>
            </ol>
          </div>
        </section>

        {/* EU Consumer Info Box */}
        <section className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">&#127466;&#127482;</span>
            {t.sections.euInfo.title}
          </h2>
          <p className="text-neutral-600 mb-4">
            {t.sections.euInfo.content}
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {t.sections.euInfo.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                <span className="text-xl">
                  {item.icon === "arrow-left" && <RefreshCw className="w-5 h-5 text-blue-600" />}
                  {item.icon === "shield" && <Shield className="w-5 h-5 text-green-600" />}
                  {item.icon === "lock" && <Shield className="w-5 h-5 text-purple-600" />}
                  {item.icon === "scale" && <Scale className="w-5 h-5 text-orange-600" />}
                </span>
                <span className="text-neutral-700 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
