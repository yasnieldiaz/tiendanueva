"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Particle Animations */}
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(10px); }
          50% { transform: translateY(-15px) translateX(-5px); }
          75% { transform: translateY(-40px) translateX(15px); }
        }
        @keyframes float-diagonal {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -25px) scale(1.2); }
          66% { transform: translate(-15px, -35px) scale(0.9); }
        }
        @keyframes float-wave {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-30px) rotate(270deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(25px, -15px); }
          40% { transform: translate(-10px, -30px); }
          60% { transform: translate(15px, -20px); }
          80% { transform: translate(-20px, -10px); }
        }
        .particle-1 { animation: float-up 6s ease-in-out infinite; }
        .particle-2 { animation: float-diagonal 7s ease-in-out infinite; }
        .particle-3 { animation: float-wave 5s ease-in-out infinite; }
        .particle-4 { animation: drift 8s ease-in-out infinite; }
        .particle-5 { animation: pulse-glow 4s ease-in-out infinite; }
        .orbit-particle { animation: orbit 12s linear infinite; }
      `}</style>

      {/* Animated Particles - Various movements */}
      <div className="absolute top-[10%] left-[8%] w-4 h-4 rounded-full bg-blue-400/50 particle-1" />
      <div className="absolute top-[15%] right-[12%] w-5 h-5 rounded-full bg-orange-400/50 particle-2" />
      <div className="absolute bottom-[25%] left-[15%] w-3 h-3 rounded-full bg-blue-300/40 particle-3" />
      <div className="absolute bottom-[35%] right-[8%] w-4 h-4 rounded-full bg-orange-300/50 particle-4" />
      <div className="absolute top-[45%] left-[5%] w-6 h-6 rounded-full bg-blue-400/30 particle-5" />
      <div className="absolute top-[60%] right-[6%] w-3 h-3 rounded-full bg-orange-400/40 particle-1" style={{ animationDelay: '-2s' }} />
      <div className="absolute top-[8%] left-[35%] w-3 h-3 rounded-full bg-gray-400/30 particle-2" style={{ animationDelay: '-1s' }} />
      <div className="absolute bottom-[12%] right-[30%] w-4 h-4 rounded-full bg-blue-300/40 particle-4" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-[30%] left-[3%] w-5 h-5 rounded-full bg-orange-300/30 particle-3" style={{ animationDelay: '-1.5s' }} />
      <div className="absolute top-[75%] right-[15%] w-3 h-3 rounded-full bg-blue-400/40 particle-1" style={{ animationDelay: '-4s' }} />
      <div className="absolute bottom-[8%] left-[40%] w-4 h-4 rounded-full bg-gray-300/30 particle-2" style={{ animationDelay: '-2.5s' }} />
      <div className="absolute top-[20%] right-[35%] w-3 h-3 rounded-full bg-orange-400/40 particle-4" style={{ animationDelay: '-0.5s' }} />

      {/* Orbiting particles around center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0">
        <div className="orbit-particle w-2 h-2 rounded-full bg-blue-500/60" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0" style={{ animationDelay: '-4s' }}>
        <div className="orbit-particle w-2 h-2 rounded-full bg-orange-500/60" style={{ animationDelay: '-6s', animationDuration: '15s' }} />
      </div>

      {/* Gradient orbs with pulse */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200/25 rounded-full particle-5" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-200/25 rounded-full particle-5" style={{ animationDuration: '8s', animationDelay: '-2s' }} />

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-md animate-[fadeIn_0.4s_ease-out]">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Card */}
        <div className="bg-white/95 rounded-3xl shadow-xl border border-neutral-100 p-8">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToStore")}
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">DP</span>
            </div>
            <span className="text-2xl font-bold text-neutral-900">Drone-Partss</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              {t("welcomeBack")}
            </h1>
            <p className="text-neutral-500 text-sm">
              {t("loginSubtitle")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
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
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  className="w-full pl-12 pr-12 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="text-sm text-neutral-500 hover:text-blue-600 transition-colors"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("signingIn")}
                </>
              ) : (
                t("signIn")
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400 uppercase">{t("noAccount")}</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Register Link */}
          <Link href={`/${locale}/register`} className="block">
            <button
              type="button"
              className="w-full py-4 bg-white border-2 border-neutral-200 text-neutral-900 font-semibold rounded-xl hover:border-neutral-300 hover:bg-neutral-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t("createAccount")}
            </button>
          </Link>
        </div>

        {/* Animated decorative rings */}
        <div className="absolute -top-6 -right-6 w-14 h-14 border-2 border-dashed border-blue-300/50 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none" />
        <div className="absolute -bottom-5 -left-5 w-10 h-10 border-2 border-dashed border-orange-300/50 rounded-full animate-[spin_15s_linear_infinite_reverse] pointer-events-none" />
      </div>
    </div>
  );
}
