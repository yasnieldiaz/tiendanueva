import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            Strona główna
          </Link>
          <span className="mx-2 text-neutral-400">/</span>
          <span className="text-neutral-900">Regulamin</span>
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Regulamin Sklepu Internetowego</h1>

        <div className="prose prose-neutral max-w-none">
          <p className="text-neutral-600 mb-6">
            Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">§1 Postanowienia ogólne</h2>
            <ol className="list-decimal pl-6 text-neutral-600 space-y-2">
              <li>Sklep internetowy DroneParts, dostępny pod adresem www.drone-partss.com, prowadzony jest przez DroneParts Sp. z o.o.</li>
              <li>Regulamin określa zasady korzystania ze sklepu internetowego, składania zamówień, dostawy towarów, płatności, odstąpienia od umowy oraz reklamacji.</li>
              <li>Warunkiem korzystania ze sklepu jest akceptacja niniejszego Regulaminu.</li>
              <li>Sklep prowadzi sprzedaż na terenie Unii Europejskiej.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">§2 Definicje</h2>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li><strong>Sprzedawca</strong> - DroneParts Sp. z o.o., NIP: XXXXXXXXXX</li>
              <li><strong>Klient</strong> - osoba fizyczna, prawna lub jednostka organizacyjna dokonująca zakupów</li>
              <li><strong>Konsument</strong> - osoba fizyczna dokonująca zakupu niezwiązanego z działalnością gospodarczą</li>
              <li><strong>Sklep</strong> - sklep internetowy dostępny pod adresem www.drone-partss.com</li>
              <li><strong>Zamówienie</strong> - oświadczenie woli Klienta zmierzające do zawarcia umowy sprzedaży</li>
              <li><strong>Towar</strong> - produkt oferowany w sklepie</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">§3 Składanie zamówień</h2>
            <ol className="list-decimal pl-6 text-neutral-600 space-y-2">
              <li>Zamówienia można składać 24 godziny na dobę, 7 dni w tygodniu.</li>
              <li>W celu złożenia zamówienia należy:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Wybrać produkty i dodać je do koszyka</li>
                  <li>Wypełnić formularz zamówienia</li>
                  <li>Wybrać sposób dostawy i płatności</li>
                  <li>Potwierdzić zamówienie</li>
                </ul>
              </li>
              <li>Po złożeniu zamówienia Klient otrzymuje potwierdzenie na podany adres e-mail.</li>
              <li>Umowa sprzedaży zostaje zawarta z chwilą otrzymania przez Klienta potwierdzenia przyjęcia zamówienia.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">§4 Ceny i płatności</h2>
            <ol className="list-decimal pl-6 text-neutral-600 space-y-2">
              <li>Ceny podane w sklepie są cenami brutto (zawierają podatek VAT).</li>
              <li>Ceny są wyrażone w złotych polskich (PLN), euro (EUR) lub dolarach (USD).</li>
              <li>Dostępne metody płatności:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Karta płatnicza (Visa, Mastercard, Maestro)</li>
                  <li>PayPal</li>
                  <li>Stripe</li>
                  <li>Apple Pay, Google Pay</li>
                  <li>Przelew bankowy</li>
                </ul>
              </li>
              <li>Płatność należy uregulować w ciągu 7 dni od złożenia zamówienia.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">§5 Dostawa</h2>
            <ol className="list-decimal pl-6 text-neutral-600 space-y-2">
              <li>Dostawa realizowana jest na terenie Unii Europejskiej.</li>
              <li>Dostępne metody dostawy:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Odbiór osobisty - bezpłatnie</li>
                  <li>Kurier - 17,80 zł (24 godziny)</li>
                  <li>DHL - 17,80 zł (24-48 godzin)</li>
                </ul>
              </li>
              <li>Bezpłatna dostawa przy zamówieniach powyżej 500 zł.</li>
              <li>Czas realizacji zamówienia: 1-3 dni robocze.</li>
              <li>W przypadku braku towaru Klient zostanie poinformowany o przewidywanym terminie realizacji.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">§6 Prawo odstąpienia od umowy</h2>
            <ol className="list-decimal pl-6 text-neutral-600 space-y-2">
              <li>Konsument ma prawo odstąpić od umowy w terminie 14 dni bez podania przyczyny (zgodnie z Dyrektywą 2011/83/UE).</li>
              <li>Termin na odstąpienie biegnie od dnia otrzymania towaru.</li>
              <li>W celu odstąpienia należy złożyć oświadczenie (e-mail lub formularz na stronie).</li>
              <li>Towar należy zwrócić w terminie 14 dni od odstąpienia.</li>
              <li>Sprzedawca zwraca wszystkie płatności w ciągu 14 dni od otrzymania towaru.</li>
              <li>Koszty zwrotu towaru ponosi Konsument.</li>
              <li>Prawo odstąpienia nie przysługuje w przypadku towarów wykonanych na zamówienie.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">§7 Reklamacje i gwarancja</h2>
            <ol className="list-decimal pl-6 text-neutral-600 space-y-2">
              <li>Sprzedawca odpowiada za wady towaru na podstawie rękojmi (24 miesiące dla Konsumentów).</li>
              <li>Wszystkie produkty objęte są 2-letnią gwarancją producenta.</li>
              <li>Reklamację można złożyć:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>E-mailem: reklamacje@drone-partss.com</li>
                  <li>Przez formularz na stronie</li>
                  <li>Listownie na adres siedziby</li>
                </ul>
              </li>
              <li>Reklamacja zostanie rozpatrzona w ciągu 14 dni.</li>
              <li>W przypadku uznania reklamacji Klient może żądać naprawy, wymiany, obniżenia ceny lub zwrotu pieniędzy.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">§8 Ochrona danych osobowych</h2>
            <ol className="list-decimal pl-6 text-neutral-600 space-y-2">
              <li>Administratorem danych osobowych jest Sprzedawca.</li>
              <li>Dane przetwarzane są zgodnie z RODO (Rozporządzenie UE 2016/679).</li>
              <li>Szczegóły dotyczące przetwarzania danych znajdują się w <Link href="/privacy" className="text-blue-600 hover:underline">Polityce Prywatności</Link>.</li>
              <li>Klient ma prawo dostępu, sprostowania, usunięcia i przenoszenia danych.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">§9 Rozstrzyganie sporów</h2>
            <ol className="list-decimal pl-6 text-neutral-600 space-y-2">
              <li>Wszelkie spory będą rozstrzygane polubownie.</li>
              <li>Konsument może skorzystać z pozasądowych sposobów rozwiązywania sporów:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Platforma ODR: <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a></li>
                  <li>Rzecznik konsumentów</li>
                  <li>Inspekcja Handlowa</li>
                </ul>
              </li>
              <li>Sądem właściwym jest sąd według siedziby Sprzedawcy lub miejsca zamieszkania Konsumenta.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">§10 Postanowienia końcowe</h2>
            <ol className="list-decimal pl-6 text-neutral-600 space-y-2">
              <li>Regulamin obowiązuje od dnia publikacji na stronie.</li>
              <li>Sprzedawca zastrzega sobie prawo do zmiany Regulaminu.</li>
              <li>Zmiana Regulaminu nie dotyczy zamówień złożonych przed zmianą.</li>
              <li>W sprawach nieuregulowanych stosuje się przepisy prawa polskiego i UE.</li>
            </ol>
          </section>

          <section className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Informacje dla konsumentów z UE</h2>
            <p className="text-neutral-600 mb-4">
              Zgodnie z Dyrektywą 2011/83/UE w sprawie praw konsumentów oraz Rozporządzeniem (UE) 2016/679 (RODO),
              zapewniamy pełną ochronę Twoich praw jako konsumenta w Unii Europejskiej.
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>14-dniowe prawo do zwrotu bez podania przyczyny</li>
              <li>2-letnia gwarancja na wszystkie produkty</li>
              <li>Pełna ochrona danych osobowych zgodnie z RODO</li>
              <li>Możliwość rozwiązywania sporów przez platformę ODR</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
