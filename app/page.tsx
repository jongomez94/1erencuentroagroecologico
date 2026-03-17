"use client";

import { useState } from "react";
import { supabase, EventRegistration } from "@/lib/supabaseClient";
import FormSection from "@/components/FormSection";
import CheckboxField from "@/components/CheckboxField";

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

export default function RegistrationPage() {
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

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.full_name?.trim()) next.full_name = "Por favor escribe tu nombre completo.";
    if (!form.phone?.trim()) next.phone = "Por favor escribe tu teléfono o WhatsApp.";
    if (!form.email?.trim()) next.email = "Por favor escribe tu correo electrónico.";
    if (form.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Por favor escribe un correo electrónico válido.";
    }
    if (!form.community?.trim()) next.community = "Por favor indica tu municipio o comunidad.";
    if (!form.consent_given) next.consent_given = "Debes aceptar el uso de tu información para poder registrarte.";
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
      const message = err instanceof Error ? err.message : "Error al enviar. Intenta de nuevo.";
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-pattern px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-md rounded-3xl bg-white/90 p-10 shadow-xl shadow-earth-200/40 ring-1 ring-earth-200/60 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf-100 text-leaf-600 shadow-inner">
            <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-leaf-800 sm:text-3xl">
            ¡Gracias por registrarte!
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-earth-700">
            Nos vemos en el 1er Encuentro Agroecológico Tomasino.
          </p>
        </div>
      </main>
    );
  }

  const inputBase =
    "mt-2 block w-full rounded-xl border border-earth-300 bg-white/90 px-4 py-3 text-earth-900 placeholder-earth-400 transition-colors focus:border-leaf-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-leaf-500/30";

  return (
    <main className="min-h-screen bg-pattern px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center sm:mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-leaf-900 sm:text-4xl">
            1er Encuentro Agroecológico Tomasino
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base leading-relaxed text-earth-700 sm:text-lg">
            Encuentro comunitario para compartir conocimientos sobre agroecología, compostaje, semillas y producción local.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/80 p-6 shadow-xl shadow-earth-200/30 ring-1 ring-earth-200/50 backdrop-blur-sm sm:p-10"
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
                aria-label={`Ir al paso ${i + 1}`}
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
              title="Información básica"
              description="Necesitamos estos datos para contactarte y organizar el encuentro."
            >
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-earth-800">
                  Nombre
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  className={inputBase}
                  placeholder="Ej. María García"
                />
                {errors.full_name && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.full_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-earth-800">
                  Teléfono / WhatsApp
                </label>
                <input
                  id="phone"
                  type="text"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputBase}
                  placeholder="Ej. 7000 1234"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-earth-800">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputBase}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="community" className="block text-sm font-medium text-earth-800">
                  Municipio o comunidad
                </label>
                <input
                  id="community"
                  type="text"
                  value={form.community}
                  onChange={(e) => update("community", e.target.value)}
                  className={inputBase}
                  placeholder="Ej. San Salvador, Santo Tomás"
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
              title="Participación en el evento"
              description="¿Cómo te gustaría participar? Puedes marcar más de una opción."
            >
              <CheckboxField
                id="is_visitor"
                label="Solo asistir como visitante"
                checked={form.is_visitor}
                onChange={(e) => update("is_visitor", e.target.checked)}
              />
              <CheckboxField
                id="is_producer"
                label="Soy productor/a agroecológico"
                checked={form.is_producer}
                onChange={(e) => update("is_producer", e.target.checked)}
              />
              <CheckboxField
                id="is_student"
                label="Soy estudiante"
                checked={form.is_student}
                onChange={(e) => update("is_student", e.target.checked)}
              />
              <CheckboxField
                id="works_in_org"
                label="Trabajo en organización o institución"
                checked={form.works_in_org}
                onChange={(e) => update("works_in_org", e.target.checked)}
              />
              <CheckboxField
                id="interested_in_agroecology"
                label="Tengo interés en aprender agroecología"
                checked={form.interested_in_agroecology}
                onChange={(e) => update("interested_in_agroecology", e.target.checked)}
              />
            </FormSection>
            )}

            {currentStep === 2 && (
            <FormSection
              step={3}
              title="Intereses"
              description="¿Qué te gustaría hacer en el encuentro? Marca lo que te interese."
            >
              <CheckboxField
                id="interest_compost"
                label="Aprender sobre compost"
                checked={form.interest_compost}
                onChange={(e) => update("interest_compost", e.target.checked)}
              />
              <CheckboxField
                id="interest_producers"
                label="Conocer productores locales"
                checked={form.interest_producers}
                onChange={(e) => update("interest_producers", e.target.checked)}
              />
              <CheckboxField
                id="interest_seeds"
                label="Intercambiar semillas"
                checked={form.interest_seeds}
                onChange={(e) => update("interest_seeds", e.target.checked)}
              />
              <CheckboxField
                id="interest_networking"
                label="Crear redes agroecológicas"
                checked={form.interest_networking}
                onChange={(e) => update("interest_networking", e.target.checked)}
              />
              <CheckboxField
                id="interest_future_events"
                label="Participar en futuros eventos"
                checked={form.interest_future_events}
                onChange={(e) => update("interest_future_events", e.target.checked)}
              />
            </FormSection>
            )}

            {currentStep === 3 && (
            <FormSection step={4} title="Consentimiento">
              <CheckboxField
                id="consent_given"
                label="Acepto que mi información sea usada para organizar este encuentro y futuros eventos agroecológicos."
                helperText="Requerido para completar el registro."
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
                onClick={() => goToStep(currentStep + 1)}
                disabled={isTransitioning}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-leaf-900/20 transition-all active:scale-[0.98] hover:bg-leaf-700 focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none sm:min-h-[52px] sm:flex-1 sm:py-4"
              >
                Siguiente
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
                {loading ? "Enviando..." : "Enviar registro"}
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
                Anterior
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
