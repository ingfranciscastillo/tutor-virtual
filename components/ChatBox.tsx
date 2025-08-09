"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "@/components/MessageBubble";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, FileText, Loader2 } from "lucide-react";
import { generatePDF } from "@/utils/pdf";
import { toast } from "sonner";

const messageSchema = z.object({
  message: z
    .string()
    .min(1, "Escribe una pregunta")
    .max(2000, "Máximo 2000 caracteres"),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface ChatBoxProps {
  chatId: string | null;
  subject: string;
  level: string;
  subjectName: string;
  userId?: string;
}

export function ChatBox({ chatId, subject, level, subjectName }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  // Cargar mensajes del chat
  useEffect(() => {
    if (currentChatId) {
      loadChatHistory(currentChatId);
    }
  }, [currentChatId]);

  // Auto-scroll al final
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const loadChatHistory = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };

  const onSubmit = async (data: MessageFormData) => {
    setIsLoading(true);

    // Agregar mensaje del usuario inmediatamente
    const userMessage: Message = {
      id: Date.now().toString(),
      content: data.message,
      role: "user",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    reset();

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: data.message,
          subject,
          level,
          chatId: currentChatId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Actualizar chatId si es nuevo
        if (result.chatId && !currentChatId) {
          setCurrentChatId(result.chatId);
        }

        // Agregar respuesta de IA
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: result.response,
          role: "assistant",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(result.error || "Error al procesar la pregunta");
      }
    } catch (error) {
      console.error("Error:", error);
      toast("No se pudo procesar tu pregunta. Intenta de nuevo.");
      // Remover el mensaje del usuario si hubo error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (messages.length === 0) {
      toast("No hay conversación para exportar");
      return;
    }

    try {
      await generatePDF({
        messages,
        subject: subjectName,
        level,
        date: new Date().toLocaleDateString("es-ES"),
      });

      toast("PDF descargado correctamente");
    } catch (error) {
      console.error("Error generando PDF:", error);
      toast("No se pudo generar el PDF");
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {subjectName} - {level}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={messages.length === 0}
            className="flex items-center space-x-1"
          >
            <FileText className="h-4 w-4" />
            <span>PDF</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 p-6 pt-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-lg font-medium mb-2">
                  ¡Hola! Soy tu tutor virtual de {subjectName}
                </div>
                <div className="text-sm">
                  Haz tu primera pregunta para comenzar. Adaptaré mis
                  explicaciones a tu nivel de {level}.
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <MessageBubble key={message.id || index} message={message} />
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Textarea
                {...register("message")}
                placeholder={`Haz tu pregunta sobre ${subjectName}...`}
                className="resize-none min-h-[60px]"
                disabled={isSubmitting || isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                  }
                }}
              />
              {errors.message && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting || isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
