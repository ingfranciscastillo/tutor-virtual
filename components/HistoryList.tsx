"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { History, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";

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
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Historial</span>
          </CardTitle>

          <Link href={`/subject/${subject}?level=${level}`}>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-300px)]">
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
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-sm font-medium truncate ${
                              isActive ? "text-indigo-900" : "text-gray-900"
                            }`}
                          >
                            {chat.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {date}
                          </div>
                        </div>

                        {isActive && (
                          <div className="ml-2">
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
