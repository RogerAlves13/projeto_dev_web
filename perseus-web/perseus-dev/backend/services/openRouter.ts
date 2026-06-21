import axios from "axios";

export async function perguntarIA(
  pergunta:string,
  contexto?:any
) {

  const contextoTexto = contexto
    ? `
    Contexto atual:

    ${JSON.stringify(
      contexto,
      null,
      2
    )}
    `
    : ''

  const resposta = await axios.post(

    "https://openrouter.ai/api/v1/chat/completions",

    {
      model: "deepseek/deepseek-chat",

      messages: [

        {
          role: "system",

          content:
            `
            Você é o assistente do PerseusJS.

            O PerseusJS é uma plataforma
            de mobilidade urbana.

            Utilize as informações do contexto
            sempre que possível.

            ${contextoTexto}

            Pergunta:

            ${pergunta}
            `
        },

        {
          role: "user",
          content: pergunta
        }

      ]
    },

    {
      headers: {

        Authorization:
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

        "Content-Type":
          "application/json"
      }
    }

  );

  return resposta
    .data
    .choices[0]
    .message
    .content;
}