// teste.ts

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "SUA_CHAVE_AQ..."
});

async function testar() {

  const resposta =
    await ai.models.generateContent({

      model: "gemini-2.5-flash",

      contents: "Olá"

    });

  console.log(resposta.text);

}

testar();