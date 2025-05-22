import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../Context/Context";

/*
  Ky komponent lejon userat me role të ndryshme (p.sh. employee, admin) të komunikojnë me njëri-tjetrin.
  Shto props: role (p.sh. "admin" ose "employee").
  Tabela duhet të ketë: id, chat_id, username, role, content, inserted_at
*/

function LiveChat({ chat_id = "default-room", username = "anonymous", role = "employee" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chat_id)
        .order("inserted_at", { ascending: true });
      if (!error) setMessages(data || []);
      setLoading(false);
    };
    fetchMessages();
  }, [chat_id]);

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chat_id}` },
        (payload) => {
          setMessages((msgs) => [...msgs, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chat_id]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    await supabase.from("messages").insert([
      {
        chat_id,
        username,
        role, // ruaj rolin e dërguesit
        content: input,
      }
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-blue-100 flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[200px]">
              <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <p className="text-center text-lg">Loading...</p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`mb-3 flex ${msg.username === username && msg.role === role ? "justify-end" : "justify-start"}`}
              >
                <div className={`px-4 py-2 rounded-2xl shadow text-sm max-w-[70%] 
                  ${msg.username === username && msg.role === role ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-900"}`}>
                  <span className="block font-semibold">{msg.username} <span className="text-xs text-blue-400">({msg.role})</span></span>
                  <span>{msg.content}</span>
                  <div className="text-xs text-blue-200 mt-1 text-right">{new Date(msg.inserted_at).toLocaleTimeString()}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex p-3 border-t bg-blue-50 rounded-b-xl">
          <input
            className="flex-1 border border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button
            className="ml-3 px-5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>      </div>

  );  
}

export default LiveChat;
