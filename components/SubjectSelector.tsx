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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Comienza tu sesión de aprendizaje
        </CardTitle>
        <CardDescription>
          Selecciona la materia y tu nivel educativo para recibir explicaciones
          personalizadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selector de Materia */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Materia</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SUBJECTS.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedSubject === subject.id
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
          size="lg"
        >
          Comenzar Sesión de Aprendizaje
        </Button>

        {/* Info adicional */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>✨ Explicaciones paso a paso adaptadas a tu nivel</p>
          <p>📚 Ejemplos prácticos y ejercicios sugeridos</p>
          <p>💾 Historial guardado para revisar después</p>
        </div>
      </CardContent>
    </Card>
  );
}
