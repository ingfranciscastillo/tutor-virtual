import {
  Calculator,
  Globe,
  Atom,
  TestTube,
  BookOpen,
  Code,
  Palette,
  Dna,
  GraduationCap,
  Users,
  Baby,
} from "lucide-react";

export const SUBJECTS = [
  {
    id: "matematicas",
    name: "Matemáticas",
    icon: Calculator,
    description: "Álgebra, geometría, cálculo y más",
  },
  {
    id: "historia",
    name: "Historia",
    icon: Globe,
    description: "Historia universal y regional",
  },
  {
    id: "fisica",
    name: "Física",
    icon: Atom,
    description: "Mecánica, termodinámica, óptica",
  },
  {
    id: "quimica",
    name: "Química",
    icon: TestTube,
    description: "Química general, orgánica, inorgánica",
  },
  {
    id: "lengua",
    name: "Lengua y Literatura",
    icon: BookOpen,
    description: "Gramática, literatura, redacción",
  },
  {
    id: "programacion",
    name: "Programación",
    icon: Code,
    description: "Algoritmos, lenguajes, desarrollo",
  },
  {
    id: "arte",
    name: "Arte",
    icon: Palette,
    description: "Historia del arte, técnicas, teoría",
  },
  {
    id: "biologia",
    name: "Biología",
    icon: Dna,
    description: "Biología celular, genética, ecología",
  },
];

export const LEVELS = [
  {
    id: "primaria",
    name: "Primaria",
    icon: Baby,
    description: "Educación básica (6-12 años)",
  },
  {
    id: "secundaria",
    name: "Secundaria",
    icon: Users,
    description: "Educación media (13-18 años)",
  },
  {
    id: "universidad",
    name: "Universidad",
    icon: GraduationCap,
    description: "Educación superior",
  },
];

export const AI_PROVIDERS = {
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
} as const;

export type AIProvider = (typeof AI_PROVIDERS)[keyof typeof AI_PROVIDERS];
