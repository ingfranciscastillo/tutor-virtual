import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChatBox } from "@/components/ChatBox";
import { HistoryList } from "@/components/HistoryList";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, Brain } from "lucide-react";
import Link from "next/link";
import { SUBJECTS } from "@/lib/constants";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

interface SubjectPageProps {
  params: {
    id: string;
  };
  searchParams: {
    level?: string;
    chat?: string;
  };
}

export default async function SubjectPage({
  params,
  searchParams,
}: SubjectPageProps) {
  const user = await currentUser();
  const param = await params;
  const searchParam = await searchParams;

  // Si no hay nivel, redirigir a la página principal
  if (!searchParam.level) {
    redirect("/");
  }

  const subject = SUBJECTS.find((s) => s.id === param.id);
  if (!subject) {
    redirect("/");
  }

  // Obtener chats del usuario
  let userChats: any[] = [];
  let currentChatId: string | null = null;

  if (user) {
    userChats = await db
      .select()
      .from(chats)
      .where(
        and(
          eq(chats.userId, user.id),
          eq(chats.subject, param.id),
          eq(chats.level, searchParam.level)
        )
      )
      .orderBy(desc(chats.createdAt));

    // Si hay un parámetro chat en la URL, usarlo
    if (searchParam.chat) {
      // Verificar que el chat pertenece al usuario
      const chatExists = userChats.find((chat) => chat.id === searchParam.chat);
      if (chatExists) {
        currentChatId = searchParam.chat;
      } else {
        // Si el chat no existe o no pertenece al usuario, usar el último chat
        currentChatId = userChats.length > 0 ? userChats[userChats.length - 1].id : null;
      }
    } else {
      // Si no hay parámetro chat, usar el último chat o crear uno nuevo
      if (userChats.length === 0) {
        const [newChat] = await db
          .insert(chats)
          .values({
            userId: user.id,
            subject: param.id,
            level: searchParam.level,
            title: `${subject.name} - ${searchParam.level}`,
          })
          .returning();

        currentChatId = newChat.id;
        // Actualizar la lista de chats
        userChats = [newChat];
      } else {
        currentChatId = userChats[userChats.length - 1].id;
      }
    }
  }

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="border-b bg-white/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </Link>

            <div className="flex items-center space-x-2">
              <subject.icon className="h-6 w-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">
                {subject.name} - {searchParam.level}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Brain className="h-6 w-6 text-indigo-600" />
            {user && <UserButton />}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar - Historial */}
          <div className="lg:col-span-1">
            <HistoryList
              chats={userChats}
              currentChatId={currentChatId}
              subject={param.id}
              level={searchParam.level}
            />
          </div>

          {/* Chat Principal */}
          <div className="lg:col-span-3">
            <ChatBox
              chatId={currentChatId}
              subject={param.id}
              level={searchParam.level}
              subjectName={subject.name}
              userId={user?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
