"use client";

import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const setLang = (lng: "es" | "en") => {
    void i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  const isEs = i18n.language.startsWith("es");
  const isEn = i18n.language.startsWith("en");

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-white/40 bg-black/35 p-1 shadow-lg backdrop-blur-md sm:gap-1.5 sm:p-1.5"
      role="group"
      aria-label={t("lang.switchLabel")}
    >
      <button
        type="button"
        onClick={() => setLang("es")}
        aria-pressed={isEs}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors sm:px-4 sm:py-2 ${
          isEs ? "bg-leaf-500 text-white shadow-md" : "text-white/90 hover:bg-white/15"
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={isEn}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors sm:px-4 sm:py-2 ${
          isEn ? "bg-leaf-500 text-white shadow-md" : "text-white/90 hover:bg-white/15"
        }`}
      >
        EN
      </button>
    </div>
  );
}
