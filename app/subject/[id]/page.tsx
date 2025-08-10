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
import { eq, and } from "drizzle-orm";

interface SubjectPageProps {
  params: {
    id: string;
  };
  searchParams: {
    level?: string;
  };
}

export default async function SubjectPage({
  params,
  searchParams,
}: SubjectPageProps) {
  const user = await currentUser();
  const param = await params;

  // Si no hay nivel, redirigir a la página principal
  if (!searchParams.level) {
    redirect("/");
  }

  const subject = SUBJECTS.find((s) => s.id === param.id);
  if (!subject) {
    redirect("/");
  }

  // Obtener o crear chat
  let userChats: any[] = [];
  let currentChatId: string | null = null;

  if (user) {
    userChats = await db
      .select()
      .from(chats)
      .where(
        and(
          eq(chats.userId, user.id),
          eq(chats.subject, params.id),
          eq(chats.level, searchParams.level)
        )
      )
      .orderBy(chats.createdAt);

    // Crear chat si no existe
    if (userChats.length === 0) {
      const [newChat] = await db
        .insert(chats)
        .values({
          userId: user.id,
          subject: params.id,
          level: searchParams.level,
          title: `${subject.name} - ${searchParams.level}`,
        })
        .returning();

      currentChatId = newChat.id;
    } else {
      currentChatId = userChats[userChats.length - 1].id;
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
                {subject.name} - {searchParams.level}
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
              subject={params.id}
              level={searchParams.level}
            />
          </div>

          {/* Chat Principal */}
          <div className="lg:col-span-3">
            <ChatBox
              chatId={currentChatId}
              subject={params.id}
              level={searchParams.level}
              subjectName={subject.name}
              userId={user?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
