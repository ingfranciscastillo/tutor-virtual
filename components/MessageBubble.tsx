"use client";

import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";

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
            {isUser ? (
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
            ) : (
              <div className="max-w-none break-words markdown-content">
                <ReactMarkdown
                  components={{
                    // Estilos para títulos
                    h1: ({ node, ...props }) => (
                      <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0 text-gray-900" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0 text-gray-900" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-base font-semibold mb-1 mt-2 first:mt-0 text-gray-900" {...props} />
                    ),
                    // Estilos para párrafos
                    p: ({ node, ...props }) => (
                      <p className="mb-2 last:mb-0 text-gray-900 leading-relaxed" {...props} />
                    ),
                    // Estilos para listas
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5 mb-2 space-y-1 text-gray-900" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-5 mb-2 space-y-1 text-gray-900" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="ml-2" {...props} />
                    ),
                    // Estilos para código
                    code: ({ node, className, ...props }: any) => {
                      const isInline = !className;
                      return isInline ? (
                        <code
                          className="bg-gray-200 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono"
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props} />
                      );
                    },
                    pre: ({ node, ...props }) => (
                      <pre
                        className="bg-gray-200 text-gray-900 p-3 rounded-lg overflow-x-auto mb-2 text-sm font-mono"
                        {...props}
                      />
                    ),
                    // Estilos para enlaces
                    a: ({ node, ...props }) => (
                      <a
                        className="text-blue-600 underline hover:text-blue-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    // Estilos para texto en negrita y cursiva
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-gray-900" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                    // Estilos para bloques de cita
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-gray-400 pl-4 italic my-2 text-gray-700"
                        {...props}
                      />
                    ),
                    // Estilos para tablas
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-2">
                        <table className="min-w-full border-collapse border border-gray-400" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-semibold text-gray-900" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border border-gray-400 px-3 py-2 text-gray-900" {...props} />
                    ),
                    // Estilos para separadores horizontales
                    hr: ({ node, ...props }) => (
                      <hr className="border-gray-300 my-3" {...props} />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
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
