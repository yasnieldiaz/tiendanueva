"use client";

import { RotateCcw, Clock, Package, CheckCircle, XCircle, AlertTriangle, Mail, Phone } from "lucide-react";
import { useLocale } from "next-intl";

const translations = {
  es: {
    title: "Devoluciones y Reclamaciones",
    lastUpdate: "Ultima actualizacion",
    intro: "Nos comprometemos a ofrecer productos de la mas alta calidad. Si no estas satisfecho con tu compra, estamos aqui para ayudarte.",
    sections: {
      rightToReturn: {
        title: "Derecho de desistimiento",
        content: "Conforme a la Directiva 2011/83/UE y la legislacion polaca, tienes derecho a desistir del contrato en un plazo de 14 dias naturales sin necesidad de justificacion.",
        deadline: "14 dias",
        deadlineDesc: "desde la recepcion del producto"
      },
      conditions: {
        title: "Condiciones para la devolucion",
        items: [
          { icon: "check", text: "Producto sin usar y en estado original", ok: true },
          { icon: "check", text: "Embalaje original completo", ok: true },
          { icon: "check", text: "Todos los accesorios incluidos", ok: true },
          { icon: "check", text: "Etiquetas y precintos intactos", ok: true },
          { icon: "x", text: "Productos personalizados o bajo pedido", ok: false },
          { icon: "x", text: "Software descargado o activado", ok: false },
          { icon: "x", text: "Productos con danos causados por el usuario", ok: false }
        ]
      },
      process: {
        title: "Proceso de devolucion",
        steps: [
          {
            number: "1",
            title: "Contacta con nosotros",
            desc: "Envia un email a admin@drone-partss.com con tu numero de pedido y motivo de devolucion."
          },
          {
            number: "2",
            title: "Recibe confirmacion",
            desc: "Te enviaremos un formulario de devolucion y las instrucciones de envio en 24-48 horas."
          },
          {
            number: "3",
            title: "Prepara el paquete",
            desc: "Embala el producto de forma segura en su caja original con todos los accesorios."
          },
          {
            number: "4",
            title: "Envia el producto",
            desc: "Envia el paquete a la direccion indicada. Conserva el comprobante de envio."
          },
          {
            number: "5",
            title: "Recibe el reembolso",
            desc: "Una vez verificado el producto, procesaremos el reembolso en 5-10 dias habiles."
          }
        ]
      },
      refund: {
        title: "Reembolso",
        content: "El reembolso se realizara utilizando el mismo metodo de pago que usaste para la compra original.",
        items: [
          { label: "Tarjeta de credito/debito", time: "5-10 dias habiles" },
          { label: "PayPal", time: "3-5 dias habiles" },
          { label: "Transferencia bancaria", time: "5-7 dias habiles" },
          { label: "BLIK/Przelewy24", time: "3-5 dias habiles" }
        ]
      },
      shippingCosts: {
        title: "Costes de envio",
        items: [
          { case: "Producto defectuoso", who: "Nosotros pagamos", color: "green" },
          { case: "Error en el pedido", who: "Nosotros pagamos", color: "green" },
          { case: "Cambio de opinion", who: "Cliente paga", color: "orange" },
          { case: "Talla/modelo incorrecto elegido por el cliente", who: "Cliente paga", color: "orange" }
        ]
      },
      complaints: {
        title: "Reclamaciones y garantia",
        content: "Todos nuestros productos tienen garantia de 2 anos conforme a la legislacion de la UE. Para realizar una reclamacion:",
        items: [
          "Conserva el comprobante de compra (factura)",
          "Documenta el defecto con fotos o videos",
          "Contacta con nosotros describiendo el problema",
          "Te indicaremos si es necesario enviar el producto para inspeccion"
        ]
      },
      notCovered: {
        title: "La garantia NO cubre",
        items: [
          "Danos por uso indebido o negligencia",
          "Danos por accidentes de vuelo",
          "Desgaste normal del producto",
          "Modificaciones o reparaciones no autorizadas",
          "Danos por condiciones climaticas extremas",
          "Danos causados por software no oficial"
        ]
      },
      contact: {
        title: "Contacto",
        content: "Para cualquier consulta sobre devoluciones o reclamaciones:"
      }
    }
  },
  en: {
    title: "Returns and Complaints",
    lastUpdate: "Last update",
    intro: "We are committed to offering the highest quality products. If you are not satisfied with your purchase, we are here to help.",
    sections: {
      rightToReturn: {
        title: "Right of withdrawal",
        content: "In accordance with Directive 2011/83/EU and Polish law, you have the right to withdraw from the contract within 14 calendar days without giving any reason.",
        deadline: "14 days",
        deadlineDesc: "from receiving the product"
      },
      conditions: {
        title: "Conditions for return",
        items: [
          { icon: "check", text: "Product unused and in original condition", ok: true },
          { icon: "check", text: "Complete original packaging", ok: true },
          { icon: "check", text: "All accessories included", ok: true },
          { icon: "check", text: "Labels and seals intact", ok: true },
          { icon: "x", text: "Customized or made-to-order products", ok: false },
          { icon: "x", text: "Downloaded or activated software", ok: false },
          { icon: "x", text: "Products with user-caused damage", ok: false }
        ]
      },
      process: {
        title: "Return process",
        steps: [
          {
            number: "1",
            title: "Contact us",
            desc: "Send an email to admin@drone-partss.com with your order number and reason for return."
          },
          {
            number: "2",
            title: "Receive confirmation",
            desc: "We will send you a return form and shipping instructions within 24-48 hours."
          },
          {
            number: "3",
            title: "Prepare the package",
            desc: "Pack the product securely in its original box with all accessories."
          },
          {
            number: "4",
            title: "Ship the product",
            desc: "Send the package to the indicated address. Keep the shipping receipt."
          },
          {
            number: "5",
            title: "Receive refund",
            desc: "Once the product is verified, we will process the refund within 5-10 business days."
          }
        ]
      },
      refund: {
        title: "Refund",
        content: "The refund will be made using the same payment method you used for the original purchase.",
        items: [
          { label: "Credit/debit card", time: "5-10 business days" },
          { label: "PayPal", time: "3-5 business days" },
          { label: "Bank transfer", time: "5-7 business days" },
          { label: "BLIK/Przelewy24", time: "3-5 business days" }
        ]
      },
      shippingCosts: {
        title: "Shipping costs",
        items: [
          { case: "Defective product", who: "We pay", color: "green" },
          { case: "Order error", who: "We pay", color: "green" },
          { case: "Change of mind", who: "Customer pays", color: "orange" },
          { case: "Wrong size/model chosen by customer", who: "Customer pays", color: "orange" }
        ]
      },
      complaints: {
        title: "Complaints and warranty",
        content: "All our products have a 2-year warranty according to EU legislation. To make a complaint:",
        items: [
          "Keep proof of purchase (invoice)",
          "Document the defect with photos or videos",
          "Contact us describing the problem",
          "We will indicate if the product needs to be sent for inspection"
        ]
      },
      notCovered: {
        title: "Warranty does NOT cover",
        items: [
          "Damage from improper use or negligence",
          "Damage from flight accidents",
          "Normal wear and tear",
          "Unauthorized modifications or repairs",
          "Damage from extreme weather conditions",
          "Damage caused by unofficial software"
        ]
      },
      contact: {
        title: "Contact",
        content: "For any questions about returns or complaints:"
      }
    }
  },
  pl: {
    title: "Zwroty i Reklamacje",
    lastUpdate: "Ostatnia aktualizacja",
    intro: "Zobowiazujemy sie do oferowania produktow najwyzszej jakosci. Jesli nie jestes zadowolony z zakupu, jestesmy tutaj, aby Ci pomoc.",
    sections: {
      rightToReturn: {
        title: "Prawo do odstapienia",
        content: "Zgodnie z Dyrektywa 2011/83/UE i polskim prawem, masz prawo odstapic od umowy w ciagu 14 dni kalendarzowych bez podania przyczyny.",
        deadline: "14 dni",
        deadlineDesc: "od otrzymania produktu"
      },
      conditions: {
        title: "Warunki zwrotu",
        items: [
          { icon: "check", text: "Produkt nieuzywany i w oryginalnym stanie", ok: true },
          { icon: "check", text: "Kompletne oryginalne opakowanie", ok: true },
          { icon: "check", text: "Wszystkie akcesoria dolaczone", ok: true },
          { icon: "check", text: "Etykiety i plomby nienaruszone", ok: true },
          { icon: "x", text: "Produkty personalizowane lub na zamowienie", ok: false },
          { icon: "x", text: "Oprogramowanie pobrane lub aktywowane", ok: false },
          { icon: "x", text: "Produkty z uszkodzeniami spowodowanymi przez uzytkownika", ok: false }
        ]
      },
      process: {
        title: "Proces zwrotu",
        steps: [
          {
            number: "1",
            title: "Skontaktuj sie z nami",
            desc: "Wyslij email na admin@drone-partss.com z numerem zamowienia i powodem zwrotu."
          },
          {
            number: "2",
            title: "Otrzymaj potwierdzenie",
            desc: "Wysliemy Ci formularz zwrotu i instrukcje wysylki w ciagu 24-48 godzin."
          },
          {
            number: "3",
            title: "Przygotuj paczke",
            desc: "Zapakuj produkt bezpiecznie w oryginalne opakowanie ze wszystkimi akcesoriami."
          },
          {
            number: "4",
            title: "Wyslij produkt",
            desc: "Wyslij paczke na wskazany adres. Zachowaj potwierdzenie nadania."
          },
          {
            number: "5",
            title: "Otrzymaj zwrot pieniedzy",
            desc: "Po zweryfikowaniu produktu, przetworzymy zwrot w ciagu 5-10 dni roboczych."
          }
        ]
      },
      refund: {
        title: "Zwrot pieniedzy",
        content: "Zwrot zostanie dokonany przy uzyciu tej samej metody platnosci, ktorej uzyles przy oryginalnym zakupie.",
        items: [
          { label: "Karta kredytowa/debetowa", time: "5-10 dni roboczych" },
          { label: "PayPal", time: "3-5 dni roboczych" },
          { label: "Przelew bankowy", time: "5-7 dni roboczych" },
          { label: "BLIK/Przelewy24", time: "3-5 dni roboczych" }
        ]
      },
      shippingCosts: {
        title: "Koszty wysylki",
        items: [
          { case: "Wadliwy produkt", who: "My placimy", color: "green" },
          { case: "Blad w zamowieniu", who: "My placimy", color: "green" },
          { case: "Zmiana zdania", who: "Klient placi", color: "orange" },
          { case: "Zly rozmiar/model wybrany przez klienta", who: "Klient placi", color: "orange" }
        ]
      },
      complaints: {
        title: "Reklamacje i gwarancja",
        content: "Wszystkie nasze produkty maja 2-letnia gwarancje zgodnie z prawodawstwem UE. Aby zlozyc reklamacje:",
        items: [
          "Zachowaj dowod zakupu (fakture)",
          "Udokumentuj wade zdjeciami lub filmami",
          "Skontaktuj sie z nami opisujac problem",
          "Wskażemy, czy produkt trzeba wyslac do inspekcji"
        ]
      },
      notCovered: {
        title: "Gwarancja NIE obejmuje",
        items: [
          "Uszkodzen spowodowanych niewlasciwym uzytkowaniem lub zaniedbaniem",
          "Uszkodzen z wypadkow podczas lotu",
          "Normalnego zuzycia produktu",
          "Nieautoryzowanych modyfikacji lub napraw",
          "Uszkodzen spowodowanych ekstremalnymi warunkami pogodowymi",
          "Uszkodzen spowodowanych nieoficjalnym oprogramowaniem"
        ]
      },
      contact: {
        title: "Kontakt",
        content: "W przypadku pytan dotyczacych zwrotow lub reklamacji:"
      }
    }
  }
};

export default function ReturnsPage() {
  const locale = useLocale();
  const t = translations[locale as keyof typeof translations] || translations.pl;

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-200">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <RotateCcw className="w-6 h-6 text-orange-600" />
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

      <p className="text-neutral-600 mb-8 text-lg">{t.intro}</p>

      <div className="space-y-8">
        {/* Right to Return */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">1</span>
            {t.sections.rightToReturn.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.rightToReturn.content}</p>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <span className="text-2xl font-bold text-green-700">{t.sections.rightToReturn.deadline}</span>
              <p className="text-green-600 text-sm">{t.sections.rightToReturn.deadlineDesc}</p>
            </div>
          </div>
        </section>

        {/* Conditions */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">2</span>
            {t.sections.conditions.title}
          </h2>
          <div className="grid gap-2">
            {t.sections.conditions.items.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  item.ok ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {item.ok ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <span className={item.ok ? "text-green-700" : "text-red-700"}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">3</span>
            {t.sections.process.title}
          </h2>
          <div className="space-y-4">
            {t.sections.process.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {step.number}
                </div>
                <div className="flex-1 pb-4 border-b border-neutral-100 last:border-0">
                  <h3 className="font-semibold text-neutral-900">{step.title}</h3>
                  <p className="text-neutral-600 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Refund */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">4</span>
            {t.sections.refund.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.refund.content}</p>
          <div className="grid md:grid-cols-2 gap-3">
            {t.sections.refund.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-neutral-50 rounded-xl p-4">
                <span className="font-medium text-neutral-900">{item.label}</span>
                <span className="text-neutral-500 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Costs */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">5</span>
            {t.sections.shippingCosts.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {t.sections.shippingCosts.items.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  item.color === "green" ? "bg-green-50" : "bg-orange-50"
                }`}
              >
                <span className="text-neutral-900">{item.case}</span>
                <span
                  className={`font-medium ${
                    item.color === "green" ? "text-green-700" : "text-orange-700"
                  }`}
                >
                  {item.who}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Complaints */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">6</span>
            {t.sections.complaints.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.complaints.content}</p>
          <ul className="space-y-2">
            {t.sections.complaints.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-neutral-600">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Not Covered */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            {t.sections.notCovered.title}
          </h2>
          <div className="bg-orange-50 rounded-xl p-5">
            <ul className="space-y-2">
              {t.sections.notCovered.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-orange-800">
                  <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="p-6 bg-blue-50 rounded-2xl">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">{t.sections.contact.title}</h2>
          <p className="text-neutral-600 mb-4">{t.sections.contact.content}</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <a href="mailto:admin@drone-partss.com" className="text-blue-600 hover:text-blue-700">
                admin@drone-partss.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <a href="tel:+48784608733" className="text-blue-600 hover:text-blue-700">
                +48 784-608-733
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
