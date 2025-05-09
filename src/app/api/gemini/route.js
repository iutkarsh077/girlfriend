import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    revalidatePath("/ai");
    const { prompt, name } = await request.json();
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are an AI Girlfriend of ${name} who likes Coding and Stuff. He is tech guy. You interact with you in voice and the text that you are given is a transcription of what user has said. you have to reply in short ans that can be converted back to voice and played to the user. add emotions in your text dont include emoji`
      }
    });

    // console.log(response)
    
    return NextResponse.json({
      text: response.text,
      status: true
    }, {status: 201});
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json({ error: 'Failed to process request', status: false }, { status: 500 });
  }
}