import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { generateAIResponse } from "@/lib/ai";
import { db } from "@/lib/db";
import { messages, chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const askSchema = z.object({
  message: z.string().min(1).max(2000),
  subject: z.string().min(1),
  level: z.enum(["primaria", "secundaria", "universidad"]),
  chatId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const body = await req.json();

    // Validar datos de entrada
    const validatedData = askSchema.parse(body);
    const { message, subject, level, chatId } = validatedData;

    let finalChatId = chatId;

    // Si hay usuario y no hay chatId, crear uno nuevo
    if (user && !chatId) {
      const [newChat] = await db
        .insert(chats)
        .values({
          userId: user.id,
          subject,
          level,
          title: `${subject} - ${level} - ${new Date().toLocaleDateString()}`,
        })
        .returning();

      finalChatId = newChat.id;
    }

    // Guardar mensaje del usuario (si hay chatId)
    if (finalChatId) {
      await db.insert(messages).values({
        chatId: finalChatId,
        content: message,
        role: "user",
        userId: user?.id,
      });
    }

    // Obtener historial del chat para contexto
    let context: any[] = [];
    if (finalChatId) {
      context = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, finalChatId))
        .orderBy(messages.createdAt)
        .limit(10); // Últimos 10 mensajes para contexto
    }

    // Generar respuesta de IA
    const aiResponse = await generateAIResponse({
      message,
      subject,
      level,
      context: context.slice(-8), // Últimos 8 mensajes (sin incluir el actual)
    });

    // Guardar respuesta de IA
    if (finalChatId) {
      await db.insert(messages).values({
        chatId: finalChatId,
        content: aiResponse,
        role: "assistant",
      });

      // Actualizar título del chat si es el primer mensaje
      if (context.length === 0) {
        const shortTitle =
          message.slice(0, 50) + (message.length > 50 ? "..." : "");
        await db
          .update(chats)
          .set({ title: shortTitle })
          .where(eq(chats.id, finalChatId));
      }
    }

    return NextResponse.json({
      response: aiResponse,
      chatId: finalChatId,
      success: true,
    });
  } catch (error) {
    console.error("Error en /api/ask:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
