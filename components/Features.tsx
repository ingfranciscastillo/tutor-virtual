import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  GraduationCap,
  FileText,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import { ReactNode } from "react";

export default function FeaturesSection() {
  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl tracking-tight">
            Aprendizaje potenciado por{" "}
            <span className="text-primary font-bold">IA</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Una herramienta diseñada para cerrar brechas educativas con
            tecnología de vanguardia.
          </p>
        </div>

        <Card className="@min-4xl:max-w-full @min-4xl:grid-cols-3 @min-4xl:divide-x @min-4xl:divide-y-0 mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 *:text-center md:mt-16 bg-card">
          {/* Feature 1: Personalización Pedagógica */}
          <div className="group shadow-zinc-950/5 p-4">
            <CardHeader className="pb-3">
              <CardDecorator>
                <GraduationCap className="size-6 text-primary" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium text-xl">Nivel Adaptable</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                La IA ajusta su lenguaje y metodología según el nivel educativo
                del estudiante, desde primaria hasta universidad.
              </p>
            </CardContent>
          </div>

          {/* Feature 2: Exportación y Persistencia */}
          <div className="group shadow-zinc-950/5 p-4">
            <CardHeader className="pb-3">
              <CardDecorator>
                <FileText className="size-6 text-primary" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium text-xl">Material de Estudio</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Genera resúmenes y exporta tus sesiones de tutoría a PDF para
                estudiar fuera de línea en cualquier momento.
              </p>
            </CardContent>
          </div>

          {/* Feature 3: Tecnología Multimodelo */}
          <div className="group shadow-zinc-950/5 p-4">
            <CardHeader className="pb-3">
              <CardDecorator>
                <BrainCircuit className="size-6 text-primary" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium text-xl">Modelos Avanzados</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Integración con Groq AI a través del AI SDK de Vercel,
                ofreciendo respuestas rápidas y precisas con modelos de última
                generación.
              </p>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-50"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t shadow-sm">
      {children}
    </div>
  </div>
);
