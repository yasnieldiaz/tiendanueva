"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, Check, MapPin, Phone, Building2, ChevronDown } from "lucide-react";

// Country codes with flags
const countryCodes = [
  { code: "+48", country: "PL", flag: "🇵🇱", name: "Poland" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "+32", country: "BE", flag: "🇧🇪", name: "Belgium" },
  { code: "+43", country: "AT", flag: "🇦🇹", name: "Austria" },
  { code: "+41", country: "CH", flag: "🇨🇭", name: "Switzerland" },
  { code: "+420", country: "CZ", flag: "🇨🇿", name: "Czech Republic" },
  { code: "+45", country: "DK", flag: "🇩🇰", name: "Denmark" },
  { code: "+358", country: "FI", flag: "🇫🇮", name: "Finland" },
  { code: "+30", country: "GR", flag: "🇬🇷", name: "Greece" },
  { code: "+353", country: "IE", flag: "🇮🇪", name: "Ireland" },
  { code: "+47", country: "NO", flag: "🇳🇴", name: "Norway" },
  { code: "+351", country: "PT", flag: "🇵🇹", name: "Portugal" },
  { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
];

const localTranslations = {
  es: {
    title: "Crear cuenta",
    subtitle: "Completa tus datos para registrarte",
    firstName: "Nombre",
    lastName: "Apellidos",
    email: "Correo electronico",
    phone: "Telefono",
    address: "Direccion",
    city: "Ciudad",
    postalCode: "Codigo postal",
    country: "Pais",
    taxId: "NIF/CIF (opcional)",
    taxIdPlaceholder: "Numero de identificacion fiscal",
    password: "Contrasena",
    confirmPassword: "Confirmar contrasena",
    passwordMin8: "Minimo 8 caracteres",
    passwordUppercase: "Al menos una mayuscula",
    passwordNumber: "Al menos un numero",
    acceptTerms: "Acepto los",
    termsOfService: "Terminos de servicio",
    and: "y la",
    privacyPolicy: "Politica de privacidad",
    createAccount: "Crear cuenta",
    creatingAccount: "Creando cuenta...",
    alreadyHaveAccount: "Ya tienes cuenta?",
    signIn: "Iniciar sesion",
    backToStore: "Volver a la tienda",
    joinCommunity: "Unete a nuestra comunidad",
    registerBenefits: "Accede a ofertas exclusivas, seguimiento de pedidos y soporte prioritario.",
    passwordsDoNotMatch: "Las contrasenas no coinciden",
    mustAcceptTerms: "Debes aceptar los terminos y condiciones",
    somethingWentWrong: "Algo salio mal. Intentalo de nuevo.",
    selectCountry: "Selecciona pais",
    companyOptional: "Empresa (opcional)",
  },
  en: {
    title: "Create account",
    subtitle: "Complete your details to register",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    phone: "Phone number",
    address: "Address",
    city: "City",
    postalCode: "Postal code",
    country: "Country",
    taxId: "Tax ID (optional)",
    taxIdPlaceholder: "Tax identification number",
    password: "Password",
    confirmPassword: "Confirm password",
    passwordMin8: "Minimum 8 characters",
    passwordUppercase: "At least one uppercase letter",
    passwordNumber: "At least one number",
    acceptTerms: "I accept the",
    termsOfService: "Terms of Service",
    and: "and",
    privacyPolicy: "Privacy Policy",
    createAccount: "Create account",
    creatingAccount: "Creating account...",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
    backToStore: "Back to store",
    joinCommunity: "Join our community",
    registerBenefits: "Access exclusive offers, order tracking and priority support.",
    passwordsDoNotMatch: "Passwords do not match",
    mustAcceptTerms: "You must accept the terms and conditions",
    somethingWentWrong: "Something went wrong. Please try again.",
    selectCountry: "Select country",
    companyOptional: "Company (optional)",
  },
  pl: {
    title: "Utworz konto",
    subtitle: "Wypelnij dane, aby sie zarejestrowac",
    firstName: "Imie",
    lastName: "Nazwisko",
    email: "Adres e-mail",
    phone: "Numer telefonu",
    address: "Adres",
    city: "Miasto",
    postalCode: "Kod pocztowy",
    country: "Kraj",
    taxId: "NIP (opcjonalnie)",
    taxIdPlaceholder: "Numer identyfikacji podatkowej",
    password: "Haslo",
    confirmPassword: "Potwierdz haslo",
    passwordMin8: "Minimum 8 znakow",
    passwordUppercase: "Przynajmniej jedna wielka litera",
    passwordNumber: "Przynajmniej jedna cyfra",
    acceptTerms: "Akceptuje",
    termsOfService: "Regulamin",
    and: "oraz",
    privacyPolicy: "Polityke prywatnosci",
    createAccount: "Utworz konto",
    creatingAccount: "Tworzenie konta...",
    alreadyHaveAccount: "Masz juz konto?",
    signIn: "Zaloguj sie",
    backToStore: "Powrot do sklepu",
    joinCommunity: "Dolacz do naszej spolecznosci",
    registerBenefits: "Uzyskaj dostep do ekskluzywnych ofert, sledzenia zamowien i priorytetowego wsparcia.",
    passwordsDoNotMatch: "Hasla nie sa identyczne",
    mustAcceptTerms: "Musisz zaakceptowac regulamin",
    somethingWentWrong: "Cos poszlo nie tak. Sprobuj ponownie.",
    selectCountry: "Wybierz kraj",
    companyOptional: "Firma (opcjonalnie)",
  },
};

const countries = [
  { code: "PL", name: { pl: "Polska", en: "Poland", es: "Polonia" } },
  { code: "ES", name: { pl: "Hiszpania", en: "Spain", es: "Espana" } },
  { code: "GB", name: { pl: "Wielka Brytania", en: "United Kingdom", es: "Reino Unido" } },
  { code: "DE", name: { pl: "Niemcy", en: "Germany", es: "Alemania" } },
  { code: "FR", name: { pl: "Francja", en: "France", es: "Francia" } },
  { code: "IT", name: { pl: "Wlochy", en: "Italy", es: "Italia" } },
  { code: "NL", name: { pl: "Holandia", en: "Netherlands", es: "Paises Bajos" } },
  { code: "BE", name: { pl: "Belgia", en: "Belgium", es: "Belgica" } },
  { code: "AT", name: { pl: "Austria", en: "Austria", es: "Austria" } },
  { code: "CH", name: { pl: "Szwajcaria", en: "Switzerland", es: "Suiza" } },
  { code: "CZ", name: { pl: "Czechy", en: "Czech Republic", es: "Republica Checa" } },
  { code: "DK", name: { pl: "Dania", en: "Denmark", es: "Dinamarca" } },
  { code: "FI", name: { pl: "Finlandia", en: "Finland", es: "Finlandia" } },
  { code: "GR", name: { pl: "Grecja", en: "Greece", es: "Grecia" } },
  { code: "IE", name: { pl: "Irlandia", en: "Ireland", es: "Irlanda" } },
  { code: "NO", name: { pl: "Norwegia", en: "Norway", es: "Noruega" } },
  { code: "PT", name: { pl: "Portugalia", en: "Portugal", es: "Portugal" } },
  { code: "SE", name: { pl: "Szwecja", en: "Sweden", es: "Suecia" } },
];

export default function RegisterPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const lt = localTranslations[locale as keyof typeof localTranslations] || localTranslations.en;
  const router = useRouter();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+48");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("PL");
  const [taxId, setTaxId] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedPhoneCountry = countryCodes.find(c => c.code === phoneCode) || countryCodes[0];

  const passwordRequirements = [
    { met: password.length >= 8, text: lt.passwordMin8 },
    { met: /[A-Z]/.test(password), text: lt.passwordUppercase },
    { met: /[0-9]/.test(password), text: lt.passwordNumber },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError(lt.passwordsDoNotMatch);
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError(lt.mustAcceptTerms);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          firstName,
          lastName,
          email,
          phone: `${phoneCode}${phoneNumber}`,
          address,
          city,
          postalCode,
          country,
          taxId,
          company,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || lt.somethingWentWrong);
        setIsLoading(false);
        return;
      }

      // Auto login after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError(lt.somethingWentWrong);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-xl">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {lt.backToStore}
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">DP</span>
            </div>
            <span className="text-2xl font-semibold text-neutral-900">Drone-Partss</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
              {lt.title}
            </h1>
            <p className="text-neutral-500 mb-6">
              {lt.subtitle}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {lt.firstName} *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {lt.lastName} *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {lt.email} *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Phone with Country Code */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {lt.phone} *
              </label>
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPhoneDropdown(!showPhoneDropdown)}
                    className="flex items-center gap-2 px-3 py-3 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors min-w-[100px]"
                  >
                    <span className="text-xl">{selectedPhoneCountry.flag}</span>
                    <span className="text-sm font-medium">{selectedPhoneCountry.code}</span>
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  </button>

                  {showPhoneDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-neutral-200 rounded-xl shadow-lg z-50">
                      {countryCodes.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setPhoneCode(c.code);
                            setShowPhoneDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors ${
                            phoneCode === c.code ? "bg-neutral-100" : ""
                          }`}
                        >
                          <span className="text-xl">{c.flag}</span>
                          <span className="text-sm">{c.name}</span>
                          <span className="text-sm text-neutral-500 ml-auto">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phone Number Input */}
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="123 456 789"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {lt.address} *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ul. Przykladowa 123"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* City and Postal Code Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {lt.city} *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Warszawa"
                  required
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {lt.postalCode} *
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="00-001"
                  required
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {lt.country} *
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full px-4 py-3 h-[50px] bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name[locale as keyof typeof c.name] || c.name.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Company (optional) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {lt.companyOptional}
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Nazwa firmy"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Tax ID */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {lt.taxId}
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder={lt.taxIdPlaceholder}
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-200 my-6"></div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {lt.password} *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Requirements */}
              <div className="mt-3 space-y-2">
                {passwordRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      req.met ? "bg-green-500" : "bg-neutral-200"
                    }`}>
                      {req.met && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={req.met ? "text-green-600" : "text-neutral-500"}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {lt.confirmPassword} *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <label htmlFor="terms" className="text-sm text-neutral-600">
                {lt.acceptTerms}{" "}
                <Link href={`/${locale}/legal/terms`} className="text-neutral-900 hover:underline">
                  {lt.termsOfService}
                </Link>{" "}
                {lt.and}{" "}
                <Link href={`/${locale}/legal/privacy`} className="text-neutral-900 hover:underline">
                  {lt.privacyPolicy}
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {lt.creatingAccount}
                </>
              ) : (
                lt.createAccount
              )}
            </motion.button>
          </motion.form>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-8 text-neutral-600"
        >
          {lt.alreadyHaveAccount}{" "}
          <Link
            href={`/${locale}/login`}
            className="font-semibold text-neutral-900 hover:underline"
          >
            {lt.signIn}
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
