"use client";

import { useState } from "react";
import { supabase, EventRegistration } from "@/lib/supabaseClient";
import FormSection from "@/components/FormSection";
import CheckboxField from "@/components/CheckboxField";

type FormState = Omit<EventRegistration, "id" | "created_at"> & {
  interest_producers: boolean; // UI-only, folded into interest_networking on submit
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

export default function RegistrationPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key: keyof typeof form, value: string | boolean | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.full_name?.trim()) next.full_name = "Por favor escribe tu nombre completo.";
    if (!form.phone?.trim()) next.phone = "Por favor escribe tu teléfono o WhatsApp.";
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
      const { error } = await supabase.from("event_registrations").insert({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email?.trim() || null,
        community: form.community.trim(),
        is_producer: form.is_producer,
        is_student: form.is_student,
        is_visitor: form.is_visitor,
        works_in_org: form.works_in_org,
        interested_in_agroecology: form.interested_in_agroecology,
        wants_to_sell: form.wants_to_sell,
        products_to_sell: form.wants_to_sell && form.products_to_sell?.trim() ? form.products_to_sell.trim() : null,
        needs_table: form.needs_table,
        brings_table: form.brings_table,
        bringing_seeds: form.bringing_seeds,
        seed_types: form.bringing_seeds && form.seed_types?.trim() ? form.seed_types.trim() : null,
        interest_compost: form.interest_compost,
        interest_networking: form.interest_producers || form.interest_networking,
        interest_seeds: form.interest_seeds,
        interest_future_events: form.interest_future_events,
        consent_given: form.consent_given,
      });
      if (error) throw error;
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
      <main className="min-h-screen px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-lg rounded-2xl bg-earth-100/80 p-8 shadow-lg ring-1 ring-earth-200/60 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-100 text-leaf-600 mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-leaf-800 sm:text-2xl">
            ¡Gracias por registrarte!
          </h1>
          <p className="mt-3 text-earth-700">
            Nos vemos en el 1er Encuentro Agroecológico Tomasino.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-leaf-800 sm:text-3xl">
            1er Encuentro Agroecológico Tomasino
          </h1>
          <p className="mt-2 text-earth-700 text-sm sm:text-base max-w-xl mx-auto">
            Encuentro comunitario para compartir conocimientos sobre agroecología, compostaje, semillas y producción local.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-earth-100/80 p-6 sm:p-8 shadow-lg ring-1 ring-earth-200/60 space-y-8"
        >
          <FormSection
            title="1. Información básica"
            description="Necesitamos estos datos para contactarte y organizar el encuentro."
          >
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-earth-800">
                Nombre completo
              </label>
              <input
                id="full_name"
                type="text"
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-earth-300 bg-white px-3 py-2 text-earth-900 placeholder-earth-400 focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                placeholder="Ej. María García"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
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
                className="mt-1 block w-full rounded-lg border border-earth-300 bg-white px-3 py-2 text-earth-900 placeholder-earth-400 focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                placeholder="Ej. 300 123 4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-earth-800">
                Email <span className="text-earth-500">(opcional)</span>
              </label>
              <input
                id="email"
                type="email"
                value={form.email || ""}
                onChange={(e) => update("email", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-earth-300 bg-white px-3 py-2 text-earth-900 placeholder-earth-400 focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                placeholder="correo@ejemplo.com"
              />
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
                className="mt-1 block w-full rounded-lg border border-earth-300 bg-white px-3 py-2 text-earth-900 placeholder-earth-400 focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                placeholder="Ej. Ibagué, Coello, etc."
              />
              {errors.community && (
                <p className="mt-1 text-sm text-red-600">{errors.community}</p>
              )}
            </div>
          </FormSection>

          <FormSection
            title="2. Participación en el evento"
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

          <FormSection
            title="3. Mini mercado agroecológico"
            description="Si quieres vender productos en el encuentro, marca la opción y completa los datos."
          >
            <CheckboxField
              id="wants_to_sell"
              label="Quiero participar vendiendo productos"
              checked={form.wants_to_sell}
              onChange={(e) => update("wants_to_sell", e.target.checked)}
            />
            {form.wants_to_sell && (
              <div className="ml-7 space-y-3 border-l-2 border-leaf-200 pl-4">
                <div>
                  <label htmlFor="products_to_sell" className="block text-sm font-medium text-earth-800">
                    ¿Qué productos venderás?
                  </label>
                  <input
                    id="products_to_sell"
                    type="text"
                    value={form.products_to_sell || ""}
                    onChange={(e) => update("products_to_sell", e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-earth-300 bg-white px-3 py-2 text-earth-900 placeholder-earth-400 focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    placeholder="Ej. hortalizas, miel, conservas..."
                  />
                </div>
                <CheckboxField
                  id="needs_table"
                  label="¿Necesitas mesa?"
                  checked={form.needs_table}
                  onChange={(e) => update("needs_table", e.target.checked)}
                />
                <CheckboxField
                  id="brings_table"
                  label="¿Traerás tu propia mesa?"
                  checked={form.brings_table}
                  onChange={(e) => update("brings_table", e.target.checked)}
                />
              </div>
            )}
          </FormSection>

          <FormSection
            title="4. Intercambio de semillas"
            description="Trae semillas para compartir con la comunidad."
          >
            <CheckboxField
              id="bringing_seeds"
              label="Traeré semillas para intercambiar"
              checked={form.bringing_seeds}
              onChange={(e) => update("bringing_seeds", e.target.checked)}
            />
            {form.bringing_seeds && (
              <div className="ml-7">
                <label htmlFor="seed_types" className="block text-sm font-medium text-earth-800">
                  ¿Qué tipo de semillas traerás? <span className="text-earth-500">(opcional)</span>
                </label>
                <input
                  id="seed_types"
                  type="text"
                  value={form.seed_types || ""}
                  onChange={(e) => update("seed_types", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-earth-300 bg-white px-3 py-2 text-earth-900 placeholder-earth-400 focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                  placeholder="Ej. maíz, frijol, hortalizas..."
                />
              </div>
            )}
          </FormSection>

          <FormSection
            title="5. Intereses"
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

          <FormSection title="6. Consentimiento">
            <CheckboxField
              id="consent_given"
              label="Acepto que mi información sea usada para organizar este encuentro y futuros eventos agroecológicos."
              helperText="Requerido para completar el registro."
              checked={form.consent_given}
              onChange={(e) => update("consent_given", e.target.checked)}
            />
            {errors.consent_given && (
              <p className="mt-1 text-sm text-red-600">{errors.consent_given}</p>
            )}
          </FormSection>

          {errors.submit && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-leaf-600 px-4 py-3 font-medium text-white shadow-sm hover:bg-leaf-700 focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Enviando..." : "Enviar registro"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
