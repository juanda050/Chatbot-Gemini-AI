// app/api/gemini-chat/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inisialisasi API key
const apiKey: any = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Konfigurasi model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(req: Request) {
  const { message } = await req.json();

  // Membuat chat session
  const chatSession = model.startChat({
    generationConfig,
    history: [
      { role: "user", parts: [{ text: message }] }, // Menerima input dari user
    ],
  });

  // Mengirim pesan ke model
  const result = await chatSession.sendMessage(message);
  const reply = result.response.text();

  // Mengembalikan balasan sebagai JSON
  return NextResponse.json({ reply });
}
