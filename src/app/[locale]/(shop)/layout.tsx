import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import CookieConsent from "@/components/CookieConsent";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <main className="min-h-screen overflow-x-hidden">{children}</main>
      <Footer />
      <CartDrawer />
      <CookieConsent />
    </div>
  );
}
