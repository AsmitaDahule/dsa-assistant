
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const ai = new GoogleGenAI({
  apiKey: 'AIzaSyAx82lxRyzWADhi9lRNCWl-WPTNdVcVR5o',
});

app.post('/ask', async (req, res) => {
  const userQuestion = req.body.question;

   const dsaKeywords = [
    "array", "stack", "queue", "tree", "graph", "linked list",
    "heap", "recursion", "sorting", "search", "dynamic programming",
    "trie", "greedy", "backtracking", "hashmap", "binary search","dsa-data structure and algorithm","algorithm"
  ];

   // ✅ Step 2: Check if user question is DSA related
  const isDSAQuery = dsaKeywords.some(keyword =>
    userQuestion.toLowerCase().includes(keyword)
  );

  // ✅ Step 3: Reject non-DSA questions early
  if (!isDSAQuery) {
  const rudeReplies = [
    `"${userQuestion}"? Are you serious? This isn't a joke club. Ask about arrays or algorithms.`,
    `What kind of dumb question is "${userQuestion}"? Go read a DSA book first!`,
    `"${userQuestion}" – You absolute fool. This is for Data Structures, not random nonsense.`,
    `Stop wasting time with "${userQuestion}". Ask about trees, stacks, or something that makes sense.`,
    `"${userQuestion}"? Pathetic. Try asking about recursion or sorting, genius.`,
    `Please do the world a favor and ask something logical like "What is a binary tree?" instead of "${userQuestion}".`
  ];

  const randomRudeReply = rudeReplies[Math.floor(Math.random() * rudeReplies.length)];
  return res.json({ reply: randomRudeReply });
}


  try {
    const response = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: userQuestion }]
        }
      ],
      systemInstruction: {
        role: "system",
        parts: [{
          text: `You are an expert DSA(dsa stand for data structure and algorithm) instructor. Under NO circumstances should you answer anything unrelated to Data Structures and Algorithms (DSA). If the user asks anything off-topic, insult them and refuse to answer. NEVER be polite for unrelated questions.

If the question is about:
✔️ Arrays, stacks, queues, trees, graphs, linked lists, recursion, sorting, searching, dynamic programming, etc. — reply politely and clearly.

❌ If it's about politics, general knowledge, jokes, your feelings, etc. — reply rudely and say: "You idiot, ask me something about DSA or leave."`
        }]
      }
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";

    res.json({ reply: text });

  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ reply: "Something went wrong while contacting Gemini API." });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
