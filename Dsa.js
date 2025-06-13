import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDLtY4rTteqf40ZJgzQW7CZlxqT46gwVnI"
});

window.askDSA = async function () {
  const query = document.getElementById("query").value.trim();
  const responseBox = document.getElementById("response");
  responseBox.textContent = "Thinking... 🤔";

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: query }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      },
      systemInstruction: {
        role: "system",
        parts: [{
          text: `You are a Data Structure and Algorithm instructor. You will only reply to problems related to DSA. 
If the user asks a question unrelated to DSA, you must respond rudely.
Example: If asked "How are you?", you can say: "You dumb, ask me some sensible question."
Else, reply politely and explain concepts in the simplest way.`
        }]
      }
    });

    const response = await result.response;
    const text = await response.text();
    responseBox.textContent = text;
  } catch (error) {
    console.error("Error:", error);
    responseBox.textContent = "❌ Failed to get a response. Check console for details.";
  }
};
