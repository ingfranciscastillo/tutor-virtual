import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { SUBJECTS } from "@/lib/constants";
import { z } from "zod";

const newChatSchema = z.object({
  subject: z.string().min(1),
  level: z.enum(["primaria", "secundaria", "universidad"]),
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = newChatSchema.parse(body);
    const { subject, level } = validatedData;

    // Obtener el nombre del subject
    const subjectObj = SUBJECTS.find((s) => s.id === subject);
    const subjectName = subjectObj?.name || subject;

    // Crear nuevo chat
    const [newChat] = await db
      .insert(chats)
      .values({
        userId: user.id,
        subject,
        level,
        title: `${subjectName} - ${level}`,
      })
      .returning();

    return NextResponse.json({
      chatId: newChat.id,
      success: true,
    });
  } catch (error) {
    console.error("Error creando nuevo chat:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

