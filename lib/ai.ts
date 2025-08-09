import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { AI_PROVIDERS, type AIProvider } from "./constants";
import { createPrompt } from "@/lib/prompts";

interface GenerateAIResponseParams {
  message: string;
  subject: string;
  level: string;
  context?: Array<{
    content: string;
    role: "user" | "assistant";
  }>;
}

export async function generateAIResponse({
  message,
  subject,
  level,
  context = [],
}: GenerateAIResponseParams): Promise<string> {
  const provider =
    (process.env.AI_PROVIDER as AIProvider) || AI_PROVIDERS.OPENAI;

  // Configurar el modelo según el proveedor
  let model;

  if (provider === AI_PROVIDERS.ANTHROPIC) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY no está configurada");
    }
    model = anthropic("claude-3-sonnet-20240229");
  } else {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY no está configurada");
    }
    model = openai("gpt-4o-mini");
  }

  try {
    // Crear el prompt completo
    const systemPrompt = createPrompt(subject, level);

    // Preparar los mensajes incluyendo el contexto
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...context.map((msg) => ({
        role: msg.role as const,
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    // Generar respuesta
    const { text } = await generateText({
      model,
      messages,
      temperature: 0.7,
      maxOutputTokens: 2000,
    });

    return text;
  } catch (error) {
    console.error("Error generando respuesta de IA:", error);

    // Retry logic (1 intento adicional)
    try {
      console.log("Reintentando llamada a IA...");

      const { text } = await generateText({
        model,
        messages: [
          { role: "system", content: createPrompt(subject, level) },
          { role: "user", content: message },
        ],
        temperature: 0.5,
        maxOutputTokens: 1000,
      });

      return text;
    } catch (retryError) {
      console.error("Error en retry de IA:", retryError);

      // Fallback response
      return generateFallbackResponse(subject, level);
    }
  }
}

function generateFallbackResponse(subject: string, level: string): string {
  const responses = {
    matematicas: {
      primaria:
        "Lo siento, no puedo procesar tu pregunta ahora. Te sugiero revisar los conceptos básicos de matemáticas y intentar de nuevo. ¿Podrías reformular tu pregunta de manera más simple?",
      secundaria:
        "Disculpa, hay un problema técnico. Para matemáticas de secundaria, te recomiendo descomponer el problema paso a paso. ¿Puedes ser más específico sobre qué tema necesitas ayuda?",
      universidad:
        "Lo siento por el inconveniente técnico. En matemáticas universitarias, es importante definir bien el problema. ¿Podrías proporcionar más contexto sobre el tema específico?",
    },
    historia: {
      primaria:
        "Disculpa el problema técnico. Para historia, te sugiero pensar en fechas, lugares y personajes importantes. ¿Sobre qué período histórico quieres aprender?",
      secundaria:
        "Lo siento por el inconveniente. En historia es útil analizar causas y consecuencias. ¿Puedes ser más específico sobre el tema histórico?",
      universidad:
        "Disculpa el error técnico. Para historia universitaria, considera las fuentes primarias y secundarias. ¿Qué aspecto histórico te interesa analizar?",
    },
  };

  const subjectResponses = responses[subject as keyof typeof responses];
  if (subjectResponses) {
    return (
      subjectResponses[level as keyof typeof subjectResponses] ||
      "Lo siento, hay un problema técnico temporal. Por favor, intenta reformular tu pregunta o intenta de nuevo en unos momentos."
    );
  }

  return `Disculpa, no puedo procesar tu pregunta de ${subject} para nivel ${level} en este momento. Por favor, intenta de nuevo o reformula tu pregunta.`;
}
