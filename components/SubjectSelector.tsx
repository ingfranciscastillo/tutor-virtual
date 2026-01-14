"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUBJECTS, LEVELS } from "@/lib/constants";

export function SubjectSelector() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const handleStart = () => {
    if (selectedSubject && selectedLevel) {
      router.push(`/subject/${selectedSubject}?level=${selectedLevel}`);
    }
  };

  return (
    <section id="subjectSelector" className="py-16 md:py-32">
      <div className="container mx-auto max-w-5xl px-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Comienza tu sesión de aprendizaje
            </CardTitle>
            <CardDescription className="text-primary">
              Selecciona la materia y tu nivel educativo para recibir
              explicaciones personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selector de Materia */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`p-4 rounded-lg transition-all hover:shadow-md ${
                      selectedSubject === subject.id
                        ? "border-slate-500 bg-secondary text-foreground"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <subject.icon className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm font-medium">{subject.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Nivel */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">
                Nivel Educativo
              </label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tu nivel" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      <div className="flex items-center space-x-2">
                        <level.icon className="h-4 w-4" />
                        <span>{level.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botón de Inicio */}
            <Button
              onClick={handleStart}
              disabled={!selectedSubject || !selectedLevel}
              className="w-full text-white py-3"
              size="lg"
            >
              Comenzar Sesión de Aprendizaje
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
