"use client";

import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const time = new Date(message.createdAt).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start space-x-2`}
      >
        {/* Avatar */}
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback className={isUser ? "bg-indigo-100" : "bg-green-100"}>
            {isUser ? (
              <User className="h-4 w-4 text-indigo-600" />
            ) : (
              <Bot className="h-4 w-4 text-green-600" />
            )}
          </AvatarFallback>
        </Avatar>

        {/* Message Content */}
        <div className={`${isUser ? "mr-2" : "ml-2"}`}>
          <div
            className={`rounded-lg px-4 py-2 ${
              isUser ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>

          {/* Timestamp */}
          <div
            className={`text-xs text-gray-500 mt-1 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {time}
          </div>
        </div>
      </div>
    </div>
  );
}
