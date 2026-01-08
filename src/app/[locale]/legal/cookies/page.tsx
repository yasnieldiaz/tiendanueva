"use client";

import { Cookie, Settings, BarChart3, Target, Shield } from "lucide-react";
import { useLocale } from "next-intl";

const translations = {
  es: {
    title: "Politica de Cookies",
    lastUpdate: "Ultima actualizacion",
    intro: "Este sitio web utiliza cookies y tecnologias similares para mejorar tu experiencia de navegacion, analizar el trafico y personalizar el contenido.",
    sections: {
      what: {
        title: "Que son las cookies?",
        content: "Las cookies son pequenos archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones y preferencias durante un periodo de tiempo."
      },
      types: {
        title: "Tipos de cookies que utilizamos",
        items: [
          {
            icon: "Shield",
            type: "Cookies necesarias",
            desc: "Esenciales para el funcionamiento del sitio. Permiten navegar y usar funciones basicas como areas seguras y carrito de compras.",
            examples: ["Sesion de usuario", "Carrito de compras", "Preferencias de cookies"],
            color: "green"
          },
          {
            icon: "BarChart3",
            type: "Cookies analiticas",
            desc: "Nos ayudan a entender como los visitantes interactuan con el sitio, recopilando informacion de forma anonima.",
            examples: ["Google Analytics", "Estadisticas de visitas", "Paginas mas visitadas"],
            color: "blue"
          },
          {
            icon: "Target",
            type: "Cookies de marketing",
            desc: "Se utilizan para mostrar anuncios relevantes y medir la efectividad de las campanas publicitarias.",
            examples: ["Facebook Pixel", "Google Ads", "Remarketing"],
            color: "purple"
          },
          {
            icon: "Settings",
            type: "Cookies de preferencias",
            desc: "Permiten que el sitio recuerde tus preferencias como idioma, moneda y region.",
            examples: ["Idioma preferido", "Moneda", "Configuracion de visualizacion"],
            color: "orange"
          }
        ]
      },
      manage: {
        title: "Como gestionar las cookies",
        content: "Puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las cookies que ya estan en tu dispositivo y configurar la mayoria de los navegadores para que no las acepten.",
        browsers: [
          { name: "Chrome", url: "chrome://settings/cookies" },
          { name: "Firefox", url: "about:preferences#privacy" },
          { name: "Safari", url: "Preferencias > Privacidad" },
          { name: "Edge", url: "edge://settings/privacy" }
        ]
      },
      thirdParty: {
        title: "Cookies de terceros",
        content: "Algunos de nuestros socios pueden establecer cookies en tu dispositivo:",
        items: [
          { name: "Google Analytics", purpose: "Analisis de trafico web", policy: "https://policies.google.com/privacy" },
          { name: "Stripe", purpose: "Procesamiento de pagos", policy: "https://stripe.com/privacy" },
          { name: "Facebook", purpose: "Publicidad y analisis", policy: "https://www.facebook.com/privacy/explanation" }
        ]
      },
      consent: {
        title: "Tu consentimiento",
        content: "Al utilizar nuestro sitio web, aceptas el uso de cookies de acuerdo con esta politica. Puedes cambiar tus preferencias en cualquier momento a traves de nuestro banner de cookies o en la configuracion de tu navegador."
      },
      updates: {
        title: "Actualizaciones de esta politica",
        content: "Podemos actualizar esta politica de cookies periodicamente. Te recomendamos revisar esta pagina regularmente para estar informado sobre cualquier cambio."
      },
      contact: {
        title: "Contacto",
        content: "Si tienes preguntas sobre nuestra politica de cookies, contactanos en:"
      }
    }
  },
  en: {
    title: "Cookie Policy",
    lastUpdate: "Last update",
    intro: "This website uses cookies and similar technologies to improve your browsing experience, analyze traffic, and personalize content.",
    sections: {
      what: {
        title: "What are cookies?",
        content: "Cookies are small text files that are stored on your device when you visit a website. They allow the site to remember your actions and preferences over a period of time."
      },
      types: {
        title: "Types of cookies we use",
        items: [
          {
            icon: "Shield",
            type: "Necessary cookies",
            desc: "Essential for the site to function. They allow you to navigate and use basic features like secure areas and shopping cart.",
            examples: ["User session", "Shopping cart", "Cookie preferences"],
            color: "green"
          },
          {
            icon: "BarChart3",
            type: "Analytical cookies",
            desc: "Help us understand how visitors interact with the site by collecting information anonymously.",
            examples: ["Google Analytics", "Visit statistics", "Most visited pages"],
            color: "blue"
          },
          {
            icon: "Target",
            type: "Marketing cookies",
            desc: "Used to display relevant ads and measure the effectiveness of advertising campaigns.",
            examples: ["Facebook Pixel", "Google Ads", "Remarketing"],
            color: "purple"
          },
          {
            icon: "Settings",
            type: "Preference cookies",
            desc: "Allow the site to remember your preferences such as language, currency, and region.",
            examples: ["Preferred language", "Currency", "Display settings"],
            color: "orange"
          }
        ]
      },
      manage: {
        title: "How to manage cookies",
        content: "You can control and/or delete cookies as you wish. You can delete all cookies already on your device and set most browsers not to accept them.",
        browsers: [
          { name: "Chrome", url: "chrome://settings/cookies" },
          { name: "Firefox", url: "about:preferences#privacy" },
          { name: "Safari", url: "Preferences > Privacy" },
          { name: "Edge", url: "edge://settings/privacy" }
        ]
      },
      thirdParty: {
        title: "Third-party cookies",
        content: "Some of our partners may set cookies on your device:",
        items: [
          { name: "Google Analytics", purpose: "Web traffic analysis", policy: "https://policies.google.com/privacy" },
          { name: "Stripe", purpose: "Payment processing", policy: "https://stripe.com/privacy" },
          { name: "Facebook", purpose: "Advertising and analytics", policy: "https://www.facebook.com/privacy/explanation" }
        ]
      },
      consent: {
        title: "Your consent",
        content: "By using our website, you consent to the use of cookies in accordance with this policy. You can change your preferences at any time through our cookie banner or in your browser settings."
      },
      updates: {
        title: "Updates to this policy",
        content: "We may update this cookie policy periodically. We recommend reviewing this page regularly to stay informed about any changes."
      },
      contact: {
        title: "Contact",
        content: "If you have questions about our cookie policy, contact us at:"
      }
    }
  },
  pl: {
    title: "Polityka Cookies",
    lastUpdate: "Ostatnia aktualizacja",
    intro: "Ta strona internetowa wykorzystuje pliki cookies i podobne technologie w celu poprawy jakosci przegladania, analizy ruchu i personalizacji tresci.",
    sections: {
      what: {
        title: "Czym sa pliki cookies?",
        content: "Cookies to male pliki tekstowe przechowywane na Twoim urzadzeniu podczas odwiedzania strony internetowej. Pozwalaja stronie zapamietac Twoje dzialania i preferencje przez okreslony czas."
      },
      types: {
        title: "Rodzaje cookies, ktorych uzywamy",
        items: [
          {
            icon: "Shield",
            type: "Cookies niezbedne",
            desc: "Niezbedne do dzialania strony. Pozwalaja na nawigacje i korzystanie z podstawowych funkcji, takich jak bezpieczne obszary i koszyk zakupow.",
            examples: ["Sesja uzytkownika", "Koszyk zakupow", "Preferencje cookies"],
            color: "green"
          },
          {
            icon: "BarChart3",
            type: "Cookies analityczne",
            desc: "Pomagaja nam zrozumiec, jak odwiedzajacy korzystaja ze strony, zbierajac informacje anonimowo.",
            examples: ["Google Analytics", "Statystyki odwiedzin", "Najpopularniejsze strony"],
            color: "blue"
          },
          {
            icon: "Target",
            type: "Cookies marketingowe",
            desc: "Sluza do wyswietlania odpowiednich reklam i mierzenia skutecznosci kampanii reklamowych.",
            examples: ["Facebook Pixel", "Google Ads", "Remarketing"],
            color: "purple"
          },
          {
            icon: "Settings",
            type: "Cookies preferencji",
            desc: "Pozwalaja stronie zapamietac Twoje preferencje, takie jak jezyk, waluta i region.",
            examples: ["Preferowany jezyk", "Waluta", "Ustawienia wyswietlania"],
            color: "orange"
          }
        ]
      },
      manage: {
        title: "Jak zarzadzac cookies",
        content: "Mozesz kontrolowac i/lub usuwac pliki cookies wedlug wlasnego uznania. Mozesz usunac wszystkie pliki cookies znajdujace sie na Twoim urzadzeniu i ustawic wiekszosc przegladarek tak, aby ich nie akceptowaly.",
        browsers: [
          { name: "Chrome", url: "chrome://settings/cookies" },
          { name: "Firefox", url: "about:preferences#privacy" },
          { name: "Safari", url: "Preferencje > Prywatnosc" },
          { name: "Edge", url: "edge://settings/privacy" }
        ]
      },
      thirdParty: {
        title: "Cookies stron trzecich",
        content: "Niektorzy z naszych partnerow moga ustawiac pliki cookies na Twoim urzadzeniu:",
        items: [
          { name: "Google Analytics", purpose: "Analiza ruchu na stronie", policy: "https://policies.google.com/privacy" },
          { name: "Stripe", purpose: "Przetwarzanie platnosci", policy: "https://stripe.com/privacy" },
          { name: "Facebook", purpose: "Reklama i analityka", policy: "https://www.facebook.com/privacy/explanation" }
        ]
      },
      consent: {
        title: "Twoja zgoda",
        content: "Korzystajac z naszej strony internetowej, wyrazasz zgode na uzywanie plikow cookies zgodnie z ta polityka. Mozesz zmienic swoje preferencje w dowolnym momencie poprzez nasz baner cookies lub w ustawieniach przegladarki."
      },
      updates: {
        title: "Aktualizacje tej polityki",
        content: "Mozemy okresowo aktualizowac te polityke cookies. Zalecamy regularne przegladanie tej strony, aby byc na biezaco z wszelkimi zmianami."
      },
      contact: {
        title: "Kontakt",
        content: "Jesli masz pytania dotyczace naszej polityki cookies, skontaktuj sie z nami:"
      }
    }
  }
};

const iconMap = {
  Shield,
  BarChart3,
  Target,
  Settings
};

const colorMap = {
  green: { bg: "bg-green-100", text: "text-green-700", icon: "text-green-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-700", icon: "text-blue-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-700", icon: "text-purple-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-700", icon: "text-orange-600" }
};

export default function CookiePolicyPage() {
  const locale = useLocale();
  const t = translations[locale as keyof typeof translations] || translations.pl;

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-200">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <Cookie className="w-6 h-6 text-orange-600" />
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
        {/* What are cookies */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">1</span>
            {t.sections.what.title}
          </h2>
          <p className="text-neutral-600">{t.sections.what.content}</p>
        </section>

        {/* Types of cookies */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">2</span>
            {t.sections.types.title}
          </h2>
          <div className="grid gap-4">
            {t.sections.types.items.map((item, idx) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap];
              const colors = colorMap[item.color as keyof typeof colorMap];
              return (
                <div key={idx} className="bg-neutral-50 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 mb-2">{item.type}</h3>
                      <p className="text-neutral-600 text-sm mb-3">{item.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.examples.map((example, i) => (
                          <span key={i} className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded-full`}>
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How to manage */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">3</span>
            {t.sections.manage.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.manage.content}</p>
          <div className="grid md:grid-cols-2 gap-3">
            {t.sections.manage.browsers.map((browser, idx) => (
              <div key={idx} className="flex items-center justify-between bg-neutral-50 rounded-xl p-4">
                <span className="font-medium text-neutral-900">{browser.name}</span>
                <code className="text-xs bg-neutral-200 px-2 py-1 rounded text-neutral-600">{browser.url}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Third party cookies */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">4</span>
            {t.sections.thirdParty.title}
          </h2>
          <p className="text-neutral-600 mb-4">{t.sections.thirdParty.content}</p>
          <div className="space-y-3">
            {t.sections.thirdParty.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-neutral-50 rounded-xl p-4">
                <div>
                  <span className="font-medium text-neutral-900">{item.name}</span>
                  <p className="text-neutral-500 text-sm">{item.purpose}</p>
                </div>
                <a href={item.policy} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm">
                  Polityka
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Consent */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">5</span>
            {t.sections.consent.title}
          </h2>
          <p className="text-neutral-600">{t.sections.consent.content}</p>
        </section>

        {/* Updates */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-600">6</span>
            {t.sections.updates.title}
          </h2>
          <p className="text-neutral-600">{t.sections.updates.content}</p>
        </section>

        {/* Contact */}
        <section className="p-6 bg-orange-50 rounded-2xl">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">{t.sections.contact.title}</h2>
          <p className="text-neutral-600 mb-4">{t.sections.contact.content}</p>
          <a href="mailto:privacy@drone-partss.com" className="text-orange-600 hover:text-orange-700 font-medium">
            privacy@drone-partss.com
          </a>
        </section>
      </div>
    </div>
  );
}
