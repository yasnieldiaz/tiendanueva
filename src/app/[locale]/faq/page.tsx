"use client";

import { HelpCircle, ChevronDown, Truck, CreditCard, RotateCcw, Shield, Wrench, Package } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

const translations = {
  es: {
    title: "Preguntas Frecuentes",
    subtitle: "Encuentra respuestas a las preguntas mas comunes",
    categories: {
      shipping: "Envio y Entrega",
      payment: "Pagos",
      returns: "Devoluciones",
      products: "Productos",
      warranty: "Garantia",
      service: "Servicio Tecnico"
    },
    faqs: [
      {
        category: "shipping",
        question: "Cuanto tiempo tarda el envio?",
        answer: "Los pedidos se procesan en 1-2 dias habiles. El envio estandar tarda 3-5 dias habiles dentro de Polonia y 5-10 dias habiles para envios internacionales dentro de la UE."
      },
      {
        category: "shipping",
        question: "Cuanto cuesta el envio?",
        answer: "El envio es gratuito para pedidos superiores a 5000 PLN. Para pedidos menores, el costo de envio es de 18 PLN para envios nacionales. Los envios internacionales se calculan segun el destino."
      },
      {
        category: "shipping",
        question: "Hacen envios internacionales?",
        answer: "Si, enviamos a todos los paises de la Union Europea. Los tiempos de entrega y costos varian segun el destino. Contactanos para mas informacion sobre envios fuera de la UE."
      },
      {
        category: "shipping",
        question: "Como puedo rastrear mi pedido?",
        answer: "Una vez enviado tu pedido, recibiras un email con el numero de seguimiento. Puedes usar este numero en la pagina del transportista (GLS o InPost) para rastrear tu paquete."
      },
      {
        category: "payment",
        question: "Que metodos de pago aceptan?",
        answer: "Aceptamos tarjetas de credito/debito (Visa, Mastercard), BLIK, Przelewy24, transferencias bancarias y PayPal. Todos los pagos son procesados de forma segura a traves de Stripe."
      },
      {
        category: "payment",
        question: "Es seguro pagar en su sitio?",
        answer: "Si, utilizamos encriptacion SSL y procesamos todos los pagos a traves de Stripe, uno de los procesadores de pago mas seguros del mundo. Nunca almacenamos los datos de tu tarjeta."
      },
      {
        category: "payment",
        question: "Puedo pagar en cuotas?",
        answer: "Actualmente no ofrecemos pago en cuotas directamente. Sin embargo, puedes usar servicios de tu banco que permitan financiar compras con tarjeta."
      },
      {
        category: "returns",
        question: "Cual es la politica de devolucion?",
        answer: "Tienes 14 dias desde la recepcion del producto para solicitar una devolucion. El producto debe estar sin usar, en su embalaje original y con todos los accesorios."
      },
      {
        category: "returns",
        question: "Como inicio una devolucion?",
        answer: "Contactanos por email a admin@drone-partss.com indicando tu numero de pedido y el motivo de la devolucion. Te enviaremos las instrucciones para proceder."
      },
      {
        category: "returns",
        question: "Quien paga el envio de devolucion?",
        answer: "Si la devolucion es por defecto del producto o error nuestro, nosotros cubrimos el envio. Para devoluciones por otros motivos, el cliente asume el costo del envio."
      },
      {
        category: "products",
        question: "Los drones vienen con factura?",
        answer: "Si, todos los productos incluyen factura IVA. Si necesitas factura con datos de empresa, indicalo al realizar el pedido o contactanos."
      },
      {
        category: "products",
        question: "Los productos son originales?",
        answer: "Si, todos nuestros productos son 100% originales y nuevos. Somos distribuidores autorizados de DJI, Autel y XAG."
      },
      {
        category: "products",
        question: "Tienen stock de todos los productos?",
        answer: "La mayoria de productos estan en stock. Si un producto no esta disponible, se indica en la pagina. Puedes contactarnos para consultar disponibilidad y tiempos de reposicion."
      },
      {
        category: "warranty",
        question: "Que garantia tienen los productos?",
        answer: "Todos nuestros productos tienen garantia de 2 anos conforme a la legislacion de la UE. Algunos productos pueden tener garantia extendida del fabricante."
      },
      {
        category: "warranty",
        question: "Como hago una reclamacion de garantia?",
        answer: "Contactanos con tu numero de pedido, descripcion del problema y fotos/videos si es posible. Evaluaremos el caso y te indicaremos los pasos a seguir."
      },
      {
        category: "warranty",
        question: "La garantia cubre accidentes de vuelo?",
        answer: "La garantia estandar no cubre danos por accidentes, uso indebido o caidas. Para esto, recomendamos contratar DJI Care Refresh u otros seguros especificos para drones."
      },
      {
        category: "service",
        question: "Ofrecen servicio de reparacion?",
        answer: "Si, contamos con servicio tecnico especializado para drones DJI, Autel y XAG. Realizamos diagnosticos, reparaciones y mantenimiento preventivo."
      },
      {
        category: "service",
        question: "Cuanto cuesta una reparacion?",
        answer: "El costo depende del tipo de dano y modelo del drone. Ofrecemos diagnostico gratuito y presupuesto sin compromiso antes de cualquier reparacion."
      },
      {
        category: "service",
        question: "Cuanto tarda una reparacion?",
        answer: "Las reparaciones simples tardan 3-5 dias habiles. Reparaciones complejas o que requieran piezas especiales pueden tardar 1-2 semanas."
      }
    ]
  },
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to the most common questions",
    categories: {
      shipping: "Shipping & Delivery",
      payment: "Payments",
      returns: "Returns",
      products: "Products",
      warranty: "Warranty",
      service: "Technical Service"
    },
    faqs: [
      {
        category: "shipping",
        question: "How long does shipping take?",
        answer: "Orders are processed within 1-2 business days. Standard shipping takes 3-5 business days within Poland and 5-10 business days for international shipments within the EU."
      },
      {
        category: "shipping",
        question: "How much does shipping cost?",
        answer: "Shipping is free for orders over 5000 PLN. For smaller orders, shipping cost is 18 PLN for domestic shipments. International shipping is calculated based on destination."
      },
      {
        category: "shipping",
        question: "Do you ship internationally?",
        answer: "Yes, we ship to all European Union countries. Delivery times and costs vary by destination. Contact us for more information about shipping outside the EU."
      },
      {
        category: "shipping",
        question: "How can I track my order?",
        answer: "Once your order is shipped, you will receive an email with the tracking number. You can use this number on the carrier's website (GLS or InPost) to track your package."
      },
      {
        category: "payment",
        question: "What payment methods do you accept?",
        answer: "We accept credit/debit cards (Visa, Mastercard), BLIK, Przelewy24, bank transfers, and PayPal. All payments are securely processed through Stripe."
      },
      {
        category: "payment",
        question: "Is it safe to pay on your site?",
        answer: "Yes, we use SSL encryption and process all payments through Stripe, one of the most secure payment processors in the world. We never store your card details."
      },
      {
        category: "payment",
        question: "Can I pay in installments?",
        answer: "We currently don't offer direct installment payments. However, you can use your bank's services that allow financing purchases made with card."
      },
      {
        category: "returns",
        question: "What is the return policy?",
        answer: "You have 14 days from receiving the product to request a return. The product must be unused, in its original packaging, and with all accessories."
      },
      {
        category: "returns",
        question: "How do I initiate a return?",
        answer: "Contact us by email at admin@drone-partss.com with your order number and reason for return. We will send you instructions on how to proceed."
      },
      {
        category: "returns",
        question: "Who pays for return shipping?",
        answer: "If the return is due to product defect or our error, we cover shipping. For returns due to other reasons, the customer assumes the shipping cost."
      },
      {
        category: "products",
        question: "Do drones come with an invoice?",
        answer: "Yes, all products include a VAT invoice. If you need an invoice with company details, indicate this when placing the order or contact us."
      },
      {
        category: "products",
        question: "Are the products original?",
        answer: "Yes, all our products are 100% original and new. We are authorized distributors of DJI, Autel, and XAG."
      },
      {
        category: "products",
        question: "Do you have stock of all products?",
        answer: "Most products are in stock. If a product is unavailable, it is indicated on the page. You can contact us to check availability and restocking times."
      },
      {
        category: "warranty",
        question: "What warranty do products have?",
        answer: "All our products have a 2-year warranty according to EU legislation. Some products may have extended manufacturer warranty."
      },
      {
        category: "warranty",
        question: "How do I make a warranty claim?",
        answer: "Contact us with your order number, description of the problem, and photos/videos if possible. We will evaluate the case and indicate the steps to follow."
      },
      {
        category: "warranty",
        question: "Does the warranty cover flight accidents?",
        answer: "Standard warranty does not cover damage from accidents, misuse, or crashes. For this, we recommend purchasing DJI Care Refresh or other drone-specific insurance."
      },
      {
        category: "service",
        question: "Do you offer repair service?",
        answer: "Yes, we have specialized technical service for DJI, Autel, and XAG drones. We perform diagnostics, repairs, and preventive maintenance."
      },
      {
        category: "service",
        question: "How much does a repair cost?",
        answer: "The cost depends on the type of damage and drone model. We offer free diagnosis and no-obligation quote before any repair."
      },
      {
        category: "service",
        question: "How long does a repair take?",
        answer: "Simple repairs take 3-5 business days. Complex repairs or those requiring special parts may take 1-2 weeks."
      }
    ]
  },
  pl: {
    title: "Czesto Zadawane Pytania",
    subtitle: "Znajdz odpowiedzi na najczesciej zadawane pytania",
    categories: {
      shipping: "Wysylka i Dostawa",
      payment: "Platnosci",
      returns: "Zwroty",
      products: "Produkty",
      warranty: "Gwarancja",
      service: "Serwis Techniczny"
    },
    faqs: [
      {
        category: "shipping",
        question: "Ile trwa wysylka?",
        answer: "Zamowienia sa realizowane w ciagu 1-2 dni roboczych. Standardowa wysylka trwa 3-5 dni roboczych w Polsce i 5-10 dni roboczych dla przesylek miedzynarodowych w UE."
      },
      {
        category: "shipping",
        question: "Ile kosztuje wysylka?",
        answer: "Wysylka jest bezplatna dla zamowien powyzej 5000 PLN. Dla mniejszych zamowien koszt wysylki wynosi 18 PLN dla przesylek krajowych. Wysylka miedzynarodowa jest kalkulowana indywidualnie."
      },
      {
        category: "shipping",
        question: "Czy wysylacie za granice?",
        answer: "Tak, wysylamy do wszystkich krajow Unii Europejskiej. Czasy dostawy i koszty roznia sie w zaleznosci od miejsca docelowego. Skontaktuj sie z nami po wiecej informacji o wysylce poza UE."
      },
      {
        category: "shipping",
        question: "Jak moge sledzic moje zamowienie?",
        answer: "Po wyslaniu zamowienia otrzymasz email z numerem sledzenia. Mozesz uzyc tego numeru na stronie przewoznika (GLS lub InPost) aby sledzic swoja paczke."
      },
      {
        category: "payment",
        question: "Jakie metody platnosci akceptujecie?",
        answer: "Akceptujemy karty kredytowe/debetowe (Visa, Mastercard), BLIK, Przelewy24, przelewy bankowe i PayPal. Wszystkie platnosci sa bezpiecznie przetwarzane przez Stripe."
      },
      {
        category: "payment",
        question: "Czy platnosc na stronie jest bezpieczna?",
        answer: "Tak, uzywamy szyfrowania SSL i przetwarzamy wszystkie platnosci przez Stripe, jeden z najbezpieczniejszych procesorow platnosci na swiecie. Nigdy nie przechowujemy danych Twojej karty."
      },
      {
        category: "payment",
        question: "Czy moge placic na raty?",
        answer: "Obecnie nie oferujemy bezposredniej platnosci ratalnej. Mozesz jednak skorzystac z uslug swojego banku pozwalajacych na finansowanie zakupow karta."
      },
      {
        category: "returns",
        question: "Jaka jest polityka zwrotow?",
        answer: "Masz 14 dni od otrzymania produktu na zgloszenie zwrotu. Produkt musi byc nieuzywany, w oryginalnym opakowaniu i ze wszystkimi akcesoriami."
      },
      {
        category: "returns",
        question: "Jak zainicjowac zwrot?",
        answer: "Skontaktuj sie z nami przez email admin@drone-partss.com podajac numer zamowienia i powod zwrotu. Wysliemy Ci instrukcje jak postepowac."
      },
      {
        category: "returns",
        question: "Kto placi za wysylke zwrotna?",
        answer: "Jesli zwrot jest spowodowany wada produktu lub naszym bledem, pokrywamy koszty wysylki. W przypadku zwrotow z innych powodow, klient ponosi koszt wysylki."
      },
      {
        category: "products",
        question: "Czy drony sa z faktura?",
        answer: "Tak, wszystkie produkty zawieraja fakture VAT. Jesli potrzebujesz faktury z danymi firmy, zaznacz to przy skladaniu zamowienia lub skontaktuj sie z nami."
      },
      {
        category: "products",
        question: "Czy produkty sa oryginalne?",
        answer: "Tak, wszystkie nasze produkty sa w 100% oryginalne i nowe. Jestesmy autoryzowanymi dystrybutorami DJI, Autel i XAG."
      },
      {
        category: "products",
        question: "Czy macie wszystkie produkty na stanie?",
        answer: "Wiekszosc produktow jest na stanie. Jesli produkt jest niedostepny, jest to zaznaczone na stronie. Mozesz sie z nami skontaktowac aby sprawdzic dostepnosc i czasy uzupelnienia."
      },
      {
        category: "warranty",
        question: "Jaka gwarancje maja produkty?",
        answer: "Wszystkie nasze produkty maja 2-letnia gwarancje zgodnie z prawodawstwem UE. Niektore produkty moga miec przedluzona gwarancje producenta."
      },
      {
        category: "warranty",
        question: "Jak zglosic reklamacje gwarancyjna?",
        answer: "Skontaktuj sie z nami podajac numer zamowienia, opis problemu oraz zdjecia/filmy jesli to mozliwe. Ocenimy sprawe i wskażemy kolejne kroki."
      },
      {
        category: "warranty",
        question: "Czy gwarancja obejmuje wypadki podczas lotu?",
        answer: "Standardowa gwarancja nie obejmuje uszkodzen z wypadkow, niewlasciwego uzytkowania lub upadkow. Do tego zalecamy zakup DJI Care Refresh lub innych ubezpieczen specyficznych dla dronow."
      },
      {
        category: "service",
        question: "Czy oferujecie serwis naprawczy?",
        answer: "Tak, posiadamy specjalistyczny serwis techniczny dla dronow DJI, Autel i XAG. Wykonujemy diagnostyke, naprawy i konserwacje zapobiegawcza."
      },
      {
        category: "service",
        question: "Ile kosztuje naprawa?",
        answer: "Koszt zalezy od rodzaju uszkodzenia i modelu drona. Oferujemy bezplatna diagnostyke i wycene bez zobowiazan przed kazda naprawa."
      },
      {
        category: "service",
        question: "Ile trwa naprawa?",
        answer: "Proste naprawy trwaja 3-5 dni roboczych. Skomplikowane naprawy lub wymagajace specjalnych czesci moga trwac 1-2 tygodnie."
      }
    ]
  }
};

const categoryIcons = {
  shipping: Truck,
  payment: CreditCard,
  returns: RotateCcw,
  products: Package,
  warranty: Shield,
  service: Wrench
};

export default function FAQPage() {
  const locale = useLocale();
  const t = translations[locale as keyof typeof translations] || translations.pl;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFaqs = activeCategory
    ? t.faqs.filter(faq => faq.category === activeCategory)
    : t.faqs;

  const categories = Object.entries(t.categories) as [string, string][];

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-200">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <HelpCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
            {t.title}
          </h1>
          <p className="text-neutral-500">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === null
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          {locale === "pl" ? "Wszystkie" : locale === "es" ? "Todos" : "All"}
        </button>
        {categories.map(([key, label]) => {
          const Icon = categoryIcons[key as keyof typeof categoryIcons];
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                activeCategory === key
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const Icon = categoryIcons[faq.category as keyof typeof categoryIcons];
          return (
            <div
              key={idx}
              className="bg-neutral-50 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-neutral-500" />
                  </div>
                  <span className="font-medium text-neutral-900">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 transition-transform ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0">
                  <div className="pl-11 text-neutral-600">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 p-6 bg-blue-50 rounded-2xl text-center">
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          {locale === "pl" ? "Nie znalazles odpowiedzi?" : locale === "es" ? "No encontraste tu respuesta?" : "Didn't find your answer?"}
        </h3>
        <p className="text-neutral-600 mb-4">
          {locale === "pl" ? "Skontaktuj sie z nami, chetnie pomożemy!" : locale === "es" ? "Contactanos, estaremos encantados de ayudarte!" : "Contact us, we'll be happy to help!"}
        </p>
        <a
          href={`/${locale}/contact`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          {locale === "pl" ? "Kontakt" : locale === "es" ? "Contacto" : "Contact"}
        </a>
      </div>
    </div>
  );
}
