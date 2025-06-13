

function addMessage(text, sender) {
  const chatWindow = document.getElementById("chat-window");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function askDSA() {
  const question = document.getElementById("question").value.trim();
  if (!question) return;

  addMessage(question, "user");
  document.getElementById("question").value = "";
  addMessage("Typing...", "bot");

  const response = await fetch("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await response.json();
  
  // Remove "Typing..." message
  const chatWindow = document.getElementById("chat-window");
  const lastBubble = chatWindow.lastChild;
  if (lastBubble && lastBubble.textContent === "Typing...") {
    chatWindow.removeChild(lastBubble);
  }

  addMessage(data.reply, "bot");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}
