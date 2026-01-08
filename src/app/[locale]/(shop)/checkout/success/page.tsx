"use client";

import { Suspense, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, Truck, Mail, ArrowRight } from "lucide-react";

function SuccessContent() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  useEffect(() => {
    // Fetch order number from API
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.orderNumber) {
            setOrderNumber(data.orderNumber);
          }
        })
        .catch(() => {
          // Generate a fallback display order number
          setOrderNumber(Math.floor(Math.random() * 9000) + 1000);
        });
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-xl text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-neutral-900 mb-2"
        >
          {t("success")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-neutral-500 mb-8"
        >
          {t("successMessage")}
        </motion.p>

        {/* Order Number */}
        {orderNumber && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-neutral-50 rounded-2xl p-6 mb-8"
          >
            <p className="text-sm text-neutral-500 mb-1">{t("orderNumber")}</p>
            <p className="text-2xl font-bold text-neutral-900">#{orderNumber}</p>
          </motion.div>
        )}

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 mb-8"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">{t("orderConfirmed")}</p>
              <p className="text-sm text-neutral-500">{t("orderConfirmedDesc")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <p className="font-medium text-neutral-400">{t("processingOrder")}</p>
              <p className="text-sm text-neutral-400">{t("processingOrderDesc")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <p className="font-medium text-neutral-400">{t("shipping")}</p>
              <p className="text-sm text-neutral-400">{t("shippingDesc")}</p>
            </div>
          </div>
        </motion.div>

        {/* Email Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl mb-8"
        >
          <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-700 text-left">
            {t("emailNotice")}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <Link href={`/${locale}/products`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800"
            >
              {t("continueShopping")}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>

          <Link href={`/${locale}`}>
            <button className="w-full py-3 text-neutral-600 font-medium hover:text-neutral-900">
              {t("backToHome")}
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-xl text-center">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse" />
        <div className="h-8 bg-neutral-200 rounded-lg w-48 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-neutral-200 rounded-lg w-64 mx-auto animate-pulse" />
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
