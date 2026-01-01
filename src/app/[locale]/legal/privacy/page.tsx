import { useTranslations } from "next-intl";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            Strona główna
          </Link>
          <span className="mx-2 text-neutral-400">/</span>
          <span className="text-neutral-900">Polityka prywatności</span>
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Polityka Prywatności</h1>

        <div className="prose prose-neutral max-w-none">
          <p className="text-neutral-600 mb-6">
            Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">1. Administrator danych osobowych</h2>
            <p className="text-neutral-600 mb-4">
              Administratorem Twoich danych osobowych jest DroneParts z siedzibą w Polsce.
              W sprawach związanych z ochroną danych osobowych możesz kontaktować się z nami:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>E-mail: privacy@drone-partss.com</li>
              <li>Adres: ul. Przykładowa 123, 00-001 Warszawa</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">2. Podstawa prawna przetwarzania danych</h2>
            <p className="text-neutral-600 mb-4">
              Przetwarzamy Twoje dane osobowe zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679
              z dnia 27 kwietnia 2016 r. (RODO/GDPR) na następujących podstawach:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li><strong>Art. 6 ust. 1 lit. a)</strong> - zgoda na przetwarzanie danych</li>
              <li><strong>Art. 6 ust. 1 lit. b)</strong> - wykonanie umowy lub podjęcie działań przed jej zawarciem</li>
              <li><strong>Art. 6 ust. 1 lit. c)</strong> - wypełnienie obowiązku prawnego</li>
              <li><strong>Art. 6 ust. 1 lit. f)</strong> - prawnie uzasadniony interes administratora</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">3. Cele przetwarzania danych</h2>
            <p className="text-neutral-600 mb-4">Twoje dane osobowe przetwarzamy w następujących celach:</p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Realizacja zamówień i umów sprzedaży</li>
              <li>Obsługa konta użytkownika</li>
              <li>Obsługa reklamacji i zwrotów</li>
              <li>Wysyłka newslettera (za zgodą)</li>
              <li>Marketing bezpośredni produktów i usług</li>
              <li>Analiza statystyczna i poprawa jakości usług</li>
              <li>Wypełnienie obowiązków podatkowych i rachunkowych</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">4. Rodzaje zbieranych danych</h2>
            <p className="text-neutral-600 mb-4">Zbieramy następujące kategorie danych osobowych:</p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Dane identyfikacyjne (imię, nazwisko)</li>
              <li>Dane kontaktowe (adres e-mail, numer telefonu, adres pocztowy)</li>
              <li>Dane transakcyjne (historia zamówień, metody płatności)</li>
              <li>Dane techniczne (adres IP, informacje o przeglądarce, pliki cookies)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">5. Okres przechowywania danych</h2>
            <p className="text-neutral-600 mb-4">Przechowujemy Twoje dane przez okres:</p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Dane konta - do czasu usunięcia konta lub wycofania zgody</li>
              <li>Dane transakcyjne - 5 lat od końca roku podatkowego</li>
              <li>Dane marketingowe - do czasu wycofania zgody</li>
              <li>Dane z cookies - zgodnie z ustawieniami plików cookies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">6. Twoje prawa (RODO)</h2>
            <p className="text-neutral-600 mb-4">Zgodnie z RODO przysługują Ci następujące prawa:</p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li><strong>Prawo dostępu</strong> - możesz uzyskać informacje o przetwarzanych danych</li>
              <li><strong>Prawo do sprostowania</strong> - możesz żądać poprawienia nieprawidłowych danych</li>
              <li><strong>Prawo do usunięcia</strong> - możesz żądać usunięcia danych ("prawo do bycia zapomnianym")</li>
              <li><strong>Prawo do ograniczenia przetwarzania</strong> - możesz ograniczyć zakres przetwarzania</li>
              <li><strong>Prawo do przenoszenia danych</strong> - możesz otrzymać dane w formacie elektronicznym</li>
              <li><strong>Prawo do sprzeciwu</strong> - możesz sprzeciwić się przetwarzaniu danych</li>
              <li><strong>Prawo do cofnięcia zgody</strong> - w każdej chwili możesz cofnąć zgodę</li>
              <li><strong>Prawo do skargi</strong> - możesz złożyć skargę do organu nadzorczego (UODO)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">7. Pliki cookies</h2>
            <p className="text-neutral-600 mb-4">
              Nasza strona wykorzystuje pliki cookies (ciasteczka). Są to małe pliki tekstowe przechowywane
              na Twoim urządzeniu. Używamy następujących rodzajów cookies:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li><strong>Niezbędne</strong> - konieczne do działania strony</li>
              <li><strong>Analityczne</strong> - pomagają zrozumieć, jak korzystasz ze strony</li>
              <li><strong>Marketingowe</strong> - służą do personalizacji reklam</li>
              <li><strong>Preferencje</strong> - zapamiętują Twoje ustawienia</li>
            </ul>
            <p className="text-neutral-600 mt-4">
              Możesz zarządzać cookies w ustawieniach przeglądarki lub przez nasz panel preferencji.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">8. Odbiorcy danych</h2>
            <p className="text-neutral-600 mb-4">Twoje dane mogą być przekazywane:</p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Firmom kurierskim (DHL, GLS) - w celu dostawy zamówień</li>
              <li>Operatorom płatności (Stripe, PayPal) - w celu realizacji płatności</li>
              <li>Dostawcom usług IT - hosting, e-mail</li>
              <li>Organom państwowym - gdy wymagają tego przepisy prawa</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">9. Przekazywanie danych poza EOG</h2>
            <p className="text-neutral-600 mb-4">
              Niektórzy nasi dostawcy usług mogą przetwarzać dane poza Europejskim Obszarem Gospodarczym.
              W takich przypadkach zapewniamy odpowiedni poziom ochrony danych poprzez:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Standardowe klauzule umowne zatwierdzone przez Komisję Europejską</li>
              <li>Decyzje o adekwatności poziomu ochrony</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">10. Bezpieczeństwo danych</h2>
            <p className="text-neutral-600 mb-4">
              Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony Twoich danych:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Szyfrowanie SSL/TLS</li>
              <li>Bezpieczne przechowywanie haseł (bcrypt)</li>
              <li>Regularne kopie zapasowe</li>
              <li>Kontrola dostępu do danych</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">11. Kontakt</h2>
            <p className="text-neutral-600 mb-4">
              W sprawach związanych z ochroną danych osobowych możesz kontaktować się z nami:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>E-mail: privacy@drone-partss.com</li>
              <li>Formularz kontaktowy na stronie</li>
            </ul>
            <p className="text-neutral-600 mt-4">
              Masz również prawo złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO),
              ul. Stawki 2, 00-193 Warszawa.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
