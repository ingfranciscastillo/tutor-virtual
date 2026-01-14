import FeaturesSection from "@/components/Features";
import FooterSection from "@/components/Footer";
import { HeroSection } from "@/components/Header";
import { ModeToggle } from "@/components/ModeToggle";
import { SubjectSelector } from "@/components/SubjectSelector";
import { Button } from "@/components/ui/button";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { GraduationCap } from "lucide-react";

export default async function HomePage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-accent" />
          <h1 className="text-2xl font-bold text-accent">EduAI</h1>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          {user ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button
                variant={"outline"}
                className="text-slate-900 dark:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </Button>
            </SignInButton>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <HeroSection />
        <FeaturesSection />
        <SubjectSelector />
      </main>
      <FooterSection />
    </div>
  );
}
