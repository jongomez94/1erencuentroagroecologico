"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { supabase, EventRegistration } from "@/lib/supabaseClient";
import FormSection from "@/components/FormSection";
import CheckboxField from "@/components/CheckboxField";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type FormState = Omit<EventRegistration, "id" | "created_at"> & {
  interest_producers: boolean;
};

const INITIAL_FORM: FormState = {
  full_name: "",
  phone: "",
  email: "",
  community: "",
  is_producer: false,
  is_student: false,
  is_visitor: false,
  works_in_org: false,
  interested_in_agroecology: false,
  wants_to_sell: false,
  products_to_sell: null,
  needs_table: false,
  brings_table: false,
  bringing_seeds: false,
  seed_types: null,
  interest_compost: false,
  interest_producers: false,
  interest_networking: false,
  interest_seeds: false,
  interest_future_events: false,
  consent_given: false,
};

const TOTAL_STEPS = 4;

/** Cultivos de fondo (Unsplash — uso editorial). */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1920&q=80";

export default function RegistrationPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToStep = (nextStep: number) => {
    if (nextStep === currentStep) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setTimeout(() => setIsTransitioning(false), 40);
    }, 280);
  };

  const update = (key: keyof typeof form, value: string | boolean | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  /** Valida solo los campos de la fase 1 (información básica). Usado al hacer clic en Siguiente. */
  const validatePhase1 = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.full_name?.trim()) next.full_name = t("errors.phase1.full_name");
    if (!form.phone?.trim()) next.phone = t("errors.phase1.phone");
    if (!form.email?.trim()) next.email = t("errors.phase1.email");
    if (form.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = t("errors.phase1.emailInvalid");
    }
    if (!form.community?.trim()) next.community = t("errors.phase1.community");
    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.full_name?.trim()) next.full_name = t("errors.submit.full_name");
    if (!form.phone?.trim()) next.phone = t("errors.submit.phone");
    if (!form.email?.trim()) next.email = t("errors.submit.email");
    if (form.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = t("errors.submit.emailInvalid");
    }
    if (!form.community?.trim()) next.community = t("errors.submit.community");
    if (!form.consent_given) next.consent_given = t("errors.submit.consent_given");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;
    setLoading(true);
    setErrors({});
    try {
      const row = {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email?.trim() || null,
        community: form.community.trim(),
        is_producer: !!form.is_producer,
        is_student: !!form.is_student,
        is_visitor: !!form.is_visitor,
        works_in_org: !!form.works_in_org,
        interested_in_agroecology: !!form.interested_in_agroecology,
        wants_to_sell: false,
        products_to_sell: null,
        needs_table: false,
        brings_table: false,
        bringing_seeds: false,
        seed_types: null,
        interest_compost: !!form.interest_compost,
        interest_networking: !!(form.interest_producers || form.interest_networking),
        interest_seeds: !!form.interest_seeds,
        interest_future_events: !!form.interest_future_events,
        consent_given: !!form.consent_given,
      };

      const { error } = await supabase.from("event_registrations").insert(row);

      if (error) {
        const extra = [error.details, error.hint].filter(Boolean).join(" — ");
        throw new Error(extra ? `${error.message}: ${extra}` : error.message);
      }
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("errors.genericSubmit");
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "mt-2 block w-full rounded-xl border border-earth-300 bg-white/90 px-4 py-3 text-earth-900 placeholder-earth-400 transition-colors focus:border-leaf-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-leaf-500/30";

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-end p-4 sm:p-5">
        <div className="pointer-events-auto">
          <LanguageSwitcher />
        </div>
      </div>

      {success ? (
      <main className="min-h-screen bg-pattern px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white/95 px-8 pb-10 pt-0 text-center shadow-2xl shadow-leaf-900/10 ring-1 ring-earth-200/70 sm:px-10">
          <div className="-mx-8 h-1.5 bg-gradient-to-r from-leaf-700 via-leaf-500 to-leaf-600 sm:-mx-10" aria-hidden />
          <div className="mx-auto mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-leaf-100 text-leaf-600 shadow-inner">
            <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-leaf-800 sm:text-3xl">
            {t("success.title")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-earth-700">
            {t("success.body")}
          </p>
        </div>
      </main>
      ) : (
      <>
      <section
        className="relative isolate min-h-[min(52vh,28rem)] w-full overflow-hidden sm:min-h-[min(56vh,32rem)]"
        aria-label={t("hero.ariaLabel")}
      >
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="object-cover object-center scale-[1.08] blur-[3px] sm:blur-[5px]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-leaf-950/50 via-leaf-900/40 to-leaf-950/60"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-[min(52vh,28rem)] items-center justify-center px-5 py-14 sm:min-h-[min(56vh,32rem)] sm:py-16">
          <div className="max-w-3xl text-center">
            <h1 className="hero-title font-hero text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              {t("hero.title")}
            </h1>
            <p className="hero-subtitle mt-5 max-w-2xl text-pretty text-base font-medium leading-relaxed text-white/95 sm:mt-6 sm:text-lg md:text-xl">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <main className="border-t border-earth-200/70 bg-pattern px-4 pb-16 pt-10 sm:pb-24 sm:pt-14">
        <div className="mx-auto max-w-2xl">
          <header className="mb-8 text-center sm:mb-10">
            <p className="mx-auto max-w-xl text-pretty text-base leading-relaxed text-earth-700 sm:text-lg">
              {t("intro.body")}
            </p>
            <p className="mt-3 text-sm font-medium text-leaf-700">{t("intro.cta")}</p>
          </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-earth-200/60 bg-white/90 p-6 shadow-2xl shadow-leaf-900/[0.06] ring-1 ring-white/80 backdrop-blur-md sm:p-10"
        >
          {/* Indicador de pasos */}
          <div className="mb-8 flex items-center justify-center gap-2 sm:gap-3">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => !isTransitioning && goToStep(i)}
                disabled={isTransitioning}
                className={`h-2.5 w-2.5 rounded-full transition-all sm:h-3 sm:w-3 ${
                  i === currentStep ? "scale-125 bg-leaf-600" : "bg-earth-300/70 hover:bg-earth-300"
                }`}
                aria-label={t("aria.goToStep", { n: i + 1 })}
                aria-current={i === currentStep ? "step" : undefined}
              />
            ))}
          </div>

          <div
            className={`min-h-[280px] transition-opacity duration-300 ease-out sm:min-h-[320px] ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {currentStep === 0 && (
            <FormSection
              step={1}
              title={t("sections.basic.title")}
              description={t("sections.basic.description")}
            >
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-earth-800">
                  {t("fields.fullName")}
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  className={inputBase}
                  placeholder={t("placeholders.fullName")}
                />
                {errors.full_name && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.full_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-earth-800">
                  {t("fields.phone")}
                </label>
                <input
                  id="phone"
                  type="text"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputBase}
                  placeholder={t("placeholders.phone")}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-earth-800">
                  {t("fields.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputBase}
                  placeholder={t("placeholders.email")}
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="community" className="block text-sm font-medium text-earth-800">
                  {t("fields.community")}
                </label>
                <input
                  id="community"
                  type="text"
                  value={form.community}
                  onChange={(e) => update("community", e.target.value)}
                  className={inputBase}
                  placeholder={t("placeholders.community")}
                />
                {errors.community && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.community}</p>
                )}
              </div>
            </FormSection>
            )}

            {currentStep === 1 && (
            <FormSection
              step={2}
              title={t("sections.participation.title")}
              description={t("sections.participation.description")}
            >
              <CheckboxField
                id="is_visitor"
                label={t("checkboxes.visitor")}
                checked={form.is_visitor}
                onChange={(e) => update("is_visitor", e.target.checked)}
              />
              <CheckboxField
                id="is_producer"
                label={t("checkboxes.producer")}
                checked={form.is_producer}
                onChange={(e) => update("is_producer", e.target.checked)}
              />
              <CheckboxField
                id="is_student"
                label={t("checkboxes.student")}
                checked={form.is_student}
                onChange={(e) => update("is_student", e.target.checked)}
              />
              <CheckboxField
                id="works_in_org"
                label={t("checkboxes.worksInOrg")}
                checked={form.works_in_org}
                onChange={(e) => update("works_in_org", e.target.checked)}
              />
              <CheckboxField
                id="interested_in_agroecology"
                label={t("checkboxes.interestedAgroecology")}
                checked={form.interested_in_agroecology}
                onChange={(e) => update("interested_in_agroecology", e.target.checked)}
              />
            </FormSection>
            )}

            {currentStep === 2 && (
            <FormSection
              step={3}
              title={t("sections.interests.title")}
              description={t("sections.interests.description")}
            >
              <CheckboxField
                id="interest_compost"
                label={t("checkboxes.compost")}
                checked={form.interest_compost}
                onChange={(e) => update("interest_compost", e.target.checked)}
              />
              <CheckboxField
                id="interest_producers"
                label={t("checkboxes.producers")}
                checked={form.interest_producers}
                onChange={(e) => update("interest_producers", e.target.checked)}
              />
              <CheckboxField
                id="interest_seeds"
                label={t("checkboxes.seeds")}
                checked={form.interest_seeds}
                onChange={(e) => update("interest_seeds", e.target.checked)}
              />
              <CheckboxField
                id="interest_networking"
                label={t("checkboxes.networking")}
                checked={form.interest_networking}
                onChange={(e) => update("interest_networking", e.target.checked)}
              />
              <CheckboxField
                id="interest_future_events"
                label={t("checkboxes.futureEvents")}
                checked={form.interest_future_events}
                onChange={(e) => update("interest_future_events", e.target.checked)}
              />
            </FormSection>
            )}

            {currentStep === 3 && (
            <FormSection step={4} title={t("sections.consent.title")}>
              <CheckboxField
                id="consent_given"
                label={t("checkboxes.consent")}
                helperText={t("checkboxes.consentHelper")}
                checked={form.consent_given}
                onChange={(e) => update("consent_given", e.target.checked)}
              />
              {errors.consent_given && (
                <p className="mt-1.5 text-sm text-red-600">{errors.consent_given}</p>
              )}
            </FormSection>
            )}
          </div>

          {errors.submit && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200/60">
              {errors.submit}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 pt-2 sm:flex-row-reverse sm:gap-4">
            {currentStep < TOTAL_STEPS - 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 0 && !validatePhase1()) return;
                  goToStep(currentStep + 1);
                }}
                disabled={isTransitioning}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-leaf-900/20 transition-all active:scale-[0.98] hover:bg-leaf-700 focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none sm:min-h-[52px] sm:flex-1 sm:py-4"
              >
                {t("buttons.next")}
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-leaf-900/20 transition-all active:scale-[0.98] hover:bg-leaf-700 focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 sm:min-h-[52px] sm:flex-1 sm:py-4"
              >
                {loading ? t("buttons.submitting") : t("buttons.submit")}
              </button>
            )}
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => goToStep(currentStep - 1)}
                disabled={isTransitioning}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-earth-300 bg-white px-6 py-3.5 text-base font-semibold text-earth-700 transition-all active:scale-[0.98] hover:border-leaf-300 hover:bg-leaf-50 hover:text-leaf-800 focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none sm:min-h-[52px] sm:flex-1 sm:py-4"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                {t("buttons.back")}
              </button>
            )}
          </div>
        </form>
        </div>
      </main>
      </>
      )}
    </>
  );
}
