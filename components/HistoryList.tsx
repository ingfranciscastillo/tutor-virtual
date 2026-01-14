"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { History, MessageCircle, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  subject: string;
  level: string;
}

interface HistoryListProps {
  chats: Chat[];
  currentChatId: string | null;
  subject: string;
  level: string;
}

export function HistoryList({
  chats,
  currentChatId,
  subject,
  level,
}: HistoryListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleNewChat = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/chat/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, level }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirigir a la nueva conversación
        router.push(`/subject/${subject}?level=${level}&chat=${result.chatId}`);
        router.refresh();
      } else {
        throw new Error(result.error || "Error al crear el chat");
      }
    } catch (error) {
      console.error("Error creando nuevo chat:", error);
      toast("No se pudo crear la nueva conversación. Intenta de nuevo.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Historial</span>
          </CardTitle>

          <Button
            size="sm"
            variant="outline"
            onClick={handleNewChat}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-6 pb-6">
            {chats.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <div className="text-sm">Aún no tienes conversaciones</div>
                <div className="text-xs text-gray-400 mt-1">
                  Haz tu primera pregunta para comenzar
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => {
                  const isActive = chat.id === currentChatId;
                  const date = new Date(chat.createdAt).toLocaleDateString(
                    "es-ES",
                    {
                      day: "numeric",
                      month: "short",
                    }
                  );

                  return (
                    <Link
                      key={chat.id}
                      href={`/subject/${subject}?level=${level}&chat=${chat.id}`}
                      className={`block p-3 rounded-lg border transition-colors hover:bg-gray-50 ${
                        isActive
                          ? "border-indigo-200 bg-indigo-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div
                            className={`text-sm font-medium truncate ${
                              isActive ? "text-indigo-900" : "text-gray-900"
                            }`}
                            title={chat.title}
                          >
                            {chat.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {date}
                          </div>
                        </div>

                        {isActive && (
                          <div className="ml-2 shrink-0">
                            <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
