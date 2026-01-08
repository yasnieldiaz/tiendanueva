"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("invalidCredentials"));
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError(t("somethingWentWrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24">
        <div className="max-w-md w-full mx-auto">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToStore")}
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">DP</span>
            </div>
            <span className="text-2xl font-semibold text-neutral-900">DroneParts</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {t("welcomeBack")}
            </h1>
            <p className="text-neutral-500 mb-8">
              {t("loginSubtitle")}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-5"
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t("email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t("password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {t("forgotPassword")}
              </Link>
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
                  {t("signingIn")}
                </>
              ) : (
                t("signIn")
              )}
            </motion.button>
          </motion.form>

          {/* Register Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-8 text-neutral-600"
          >
            {t("noAccount")}{" "}
            <Link
              href={`/${locale}/register`}
              className="font-semibold text-neutral-900 hover:underline"
            >
              {t("createAccount")}
            </Link>
          </motion.p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-50 via-white to-orange-50 items-center justify-center p-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-orange-400/20 rounded-full blur-3xl" />
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-80 h-80 bg-white rounded-3xl flex items-center justify-center border border-neutral-200 shadow-2xl"
          >
            {/* Animated Drone SVG - Light Style */}
            <svg width="180" height="180" viewBox="0 0 200 200" className="drop-shadow-2xl">
              {/* Drone Body - White/Light Gray */}
              <ellipse cx="100" cy="110" rx="35" ry="15" fill="#E5E7EB" />
              <ellipse cx="100" cy="105" rx="30" ry="12" fill="#F3F4F6" />
              <rect x="85" y="95" width="30" height="20" rx="5" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1" />

              {/* Camera - Blue accent */}
              <circle cx="100" cy="120" r="8" fill="#1E40AF" />
              <circle cx="100" cy="120" r="5" fill="#3B82F6" />
              <circle cx="98" cy="118" r="2" fill="#BFDBFE" />

              {/* Arms - Light gray */}
              <line x1="70" y1="100" x2="30" y2="70" stroke="#D1D5DB" strokeWidth="6" strokeLinecap="round" />
              <line x1="130" y1="100" x2="170" y2="70" stroke="#D1D5DB" strokeWidth="6" strokeLinecap="round" />
              <line x1="70" y1="110" x2="30" y2="140" stroke="#D1D5DB" strokeWidth="6" strokeLinecap="round" />
              <line x1="130" y1="110" x2="170" y2="140" stroke="#D1D5DB" strokeWidth="6" strokeLinecap="round" />

              {/* Orange accent stripes on arms */}
              <line x1="55" y1="90" x2="45" y2="80" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
              <line x1="145" y1="90" x2="155" y2="80" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
              <line x1="55" y1="120" x2="45" y2="130" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
              <line x1="145" y1="120" x2="155" y2="130" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />

              {/* Motors - White with dark ring */}
              <circle cx="30" cy="70" r="10" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="2" />
              <circle cx="170" cy="70" r="10" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="2" />
              <circle cx="30" cy="140" r="10" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="2" />
              <circle cx="170" cy="140" r="10" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="2" />

              {/* Motor centers */}
              <circle cx="30" cy="70" r="4" fill="#6B7280" />
              <circle cx="170" cy="70" r="4" fill="#6B7280" />
              <circle cx="30" cy="140" r="4" fill="#6B7280" />
              <circle cx="170" cy="140" r="4" fill="#6B7280" />

              {/* Propellers with animation - Transparent/light */}
              <motion.ellipse
                cx="30" cy="70" rx="22" ry="5"
                fill="rgba(59, 130, 246, 0.5)"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "30px 70px" }}
              />
              <motion.ellipse
                cx="170" cy="70" rx="22" ry="5"
                fill="rgba(59, 130, 246, 0.5)"
                animate={{ rotate: -360 }}
                transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "170px 70px" }}
              />
              <motion.ellipse
                cx="30" cy="140" rx="22" ry="5"
                fill="rgba(249, 115, 22, 0.5)"
                animate={{ rotate: -360 }}
                transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "30px 140px" }}
              />
              <motion.ellipse
                cx="170" cy="140" rx="22" ry="5"
                fill="rgba(249, 115, 22, 0.5)"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "170px 140px" }}
              />

              {/* LED Lights - Brighter */}
              <motion.circle
                cx="85" cy="100"
                r="4"
                fill="#22C55E"
                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.circle
                cx="115" cy="100"
                r="4"
                fill="#EF4444"
                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              />

              {/* Shadow under drone */}
              <ellipse cx="100" cy="165" rx="50" ry="10" fill="#000" opacity="0.1" />
              <defs>
                <radialGradient id="glowGradient">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
            </svg>
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 border border-dashed border-blue-300/50 rounded-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
