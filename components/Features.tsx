import { Book, Brain, GraduationCap, MessageCircle } from "lucide-react";

export const FeatureSection = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 flex-col items-start">
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
              Something new!
            </h2>
            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground dark:text-accent-foreground text-left">
              Managing a small business today is already tough.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
            <GraduationCap className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">Niveles Adaptados</h3>
              <p className="text-muted-foreground dark:text-accent-foreground max-w-xs text-base">
                Primaria, Secundaria y Universidad
              </p>
            </div>
          </div>
          <div className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-md aspect-square p-6 flex justify-between flex-col">
            <Book className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">Múltiples Materias</h3>
              <p className="text-muted-foreground dark:text-accent-foreground max-w-xs text-base">
                Matemáticas, Historia, Física, Química y más
              </p>
            </div>
          </div>

          <div className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-md aspect-square p-6 flex justify-between flex-col">
            <Brain className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">IA Pedagógica</h3>
              <p className="text-muted-foreground dark:text-accent-foreground max-w-xs text-base">
                Haz preguntas y recibe explicaciones detalladas en tiempo real.
              </p>
            </div>
          </div>
          <div className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
            <MessageCircle className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">
                Historial de aprendizaje
              </h3>
              <p className="text-muted-foreground dark:text-accent-foreground max-w-xs text-base">
                Guarda las conversaciones y revisa tu progreso en cualquier
                momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
