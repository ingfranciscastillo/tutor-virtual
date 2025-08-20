import { PDFDocument, rgb } from "pdf-lib";

interface Message {
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface PDFGenerationParams {
  messages: Message[];
  subject: string;
  level: string;
  date: string;
}

export async function generatePDF({
  messages,
  subject,
  level,
  date,
}: PDFGenerationParams): Promise<void> {
  // Crear nuevo documento PDF
  const pdfDoc = await PDFDocument.create();

  // Configurar fuentes
  const fontBytes = await fetch("/fonts/NotoSans.tff").then((res) =>
    res.arrayBuffer()
  );
  const notoSans = await pdfDoc.embedFont(fontBytes);
  // Configurar colores
  const primaryColor = rgb(0.2, 0.2, 0.8); // Azul
  const userColor = rgb(0.1, 0.1, 0.1); // Negro
  const assistantColor = rgb(0.3, 0.3, 0.3); // Gris oscuro
  const lightGray = rgb(0.9, 0.9, 0.9);

  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  // Márgenes
  const margin = 50;
  const contentWidth = width - 2 * margin;
  let currentY = height - margin;

  // Título del documento
  page.drawText("Conversación - Tutor Virtual", {
    x: margin,
    y: currentY,
    size: 20,
    font: notoSans,
    color: primaryColor,
  });
  currentY -= 40;

  // Información de la sesión
  page.drawText(`Materia: ${subject}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: notoSans,
    color: userColor,
  });
  currentY -= 20;

  page.drawText(`Nivel: ${level}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: notoSans,
    color: userColor,
  });
  currentY -= 20;

  page.drawText(`Fecha: ${date}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: notoSans,
    color: userColor,
  });
  currentY -= 40;

  // Línea separadora
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: lightGray,
  });
  currentY -= 30;

  // Procesar mensajes
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const isUser = message.role === "user";

    // Verificar si necesitamos nueva página
    if (currentY < 150) {
      page = pdfDoc.addPage();
      currentY = height - margin;
    }

    // Encabezado del mensaje
    const senderText = isUser ? "Estudiante:" : "Tutor Virtual:";
    const senderColor = isUser ? primaryColor : rgb(0.2, 0.7, 0.2);

    page.drawText(senderText, {
      x: margin,
      y: currentY,
      size: 12,
      font: notoSans,
      color: senderColor,
    });
    currentY -= 25;

    // Contenido del mensaje
    const lines = wrapText(message.content, contentWidth - 20, notoSans, 10);

    for (const line of lines) {
      // Verificar si necesitamos nueva página
      if (currentY < 50) {
        page = pdfDoc.addPage();
        currentY = height - margin;
      }

      page.drawText(line, {
        x: margin + 15,
        y: currentY,
        size: 10,
        font: notoSans,
        color: isUser ? userColor : assistantColor,
      });
      currentY -= 15;
    }

    // Timestamp
    const timestamp = new Date(message.createdAt).toLocaleString("es-ES");
    page.drawText(`${timestamp}`, {
      x: margin + 15,
      y: currentY,
      size: 8,
      font: notoSans,
      color: rgb(0.6, 0.6, 0.6),
    });
    currentY -= 30;

    // Línea separadora entre mensajes
    if (i < messages.length - 1) {
      page.drawLine({
        start: { x: margin, y: currentY },
        end: { x: width - margin, y: currentY },
        thickness: 0.5,
        color: lightGray,
      });
      currentY -= 20;
    }
  }

  // Pie de página
  if (currentY > 100) {
    currentY = 50;
  } else {
    page = pdfDoc.addPage();
    currentY = 50;
  }

  page.drawText(
    "Generado por Tutor Virtual - Tutor inteligente para el aprendizaje",
    {
      x: margin,
      y: currentY,
      size: 8,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    }
  );

  // Generar y descargar PDF
  const pdfBytes = await pdfDoc.save();

  // Crear elemento de descarga
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `tutor-virtual-${subject}-${level}-${date.replace(
    /\//g,
    "-"
  )}.pdf`;
  link.click();

  // Limpiar
  URL.revokeObjectURL(url);
}

function wrapText(
  text: string,
  maxWidth: number,
  font: any,
  fontSize: number
): string[] {
  const paragraphs = text.split("\n"); // separa por saltos de línea
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);

    // Añade una línea vacía para respetar el salto de párrafo
    lines.push("");
  }

  return lines;
}
