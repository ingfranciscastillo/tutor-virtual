import { SubjectSelector } from "@/components/SubjectSelector";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Book, Brain, GraduationCap } from "lucide-react";

export default async function HomePage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Tutor Virtual</h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Iniciar Sesión
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Aprende cualquier materia con IA
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Selecciona tu materia, indica tu nivel educativo y recibe
            explicaciones personalizadas de tu tutor virtual
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Book className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Múltiples Materias</h3>
              <p className="text-gray-600">
                Matemáticas, Historia, Física, Química y más
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <GraduationCap className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Niveles Adaptados</h3>
              <p className="text-gray-600">
                Primaria, Secundaria y Universidad
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">IA Pedagógica</h3>
              <p className="text-gray-600">
                Explicaciones paso a paso y ejercicios personalizados
              </p>
            </div>
          </div>
        </div>

        {/* Subject Selector */}
        <div className="max-w-4xl mx-auto">
          <SubjectSelector />
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 text-gray-500">
          <p>
            {user
              ? `¡Hola ${user.firstName}!`
              : "Inicia sesión para guardar tu historial"}
          </p>
        </div>
      </main>
    </div>
  );
}
