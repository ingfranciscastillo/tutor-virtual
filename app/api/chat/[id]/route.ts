import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { messages, chats } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    const chatId = params.id;

    // Verificar que el chat pertenece al usuario (si está autenticado)
    if (user) {
      const chat = await db
        .select()
        .from(chats)
        .where(and(eq(chats.id, chatId), eq(chats.userId, user.id)))
        .limit(1);

      if (chat.length === 0) {
        return NextResponse.json(
          { error: "Chat no encontrado" },
          { status: 404 }
        );
      }
    }

    // Obtener mensajes del chat
    const chatMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);

    return NextResponse.json({
      messages: chatMessages,
      success: true,
    });
  } catch (error) {
    console.error("Error obteniendo historial del chat:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
