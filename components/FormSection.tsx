import { ReactNode } from "react";

interface FormSectionProps {
  step?: number;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({
  step,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-start gap-4">
        {step != null && (
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-sm font-bold text-leaf-700"
            aria-hidden
          >
            {step}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold tracking-tight text-earth-900">{title}</h2>
          {description && (
            <p className="mt-1.5 text-sm leading-relaxed text-earth-600">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
