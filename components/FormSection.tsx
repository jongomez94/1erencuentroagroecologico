import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-leaf-700">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-earth-600">{description}</p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
