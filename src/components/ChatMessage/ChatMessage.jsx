import { useState } from "react";
import { supabase } from "./supabaseClient";
import LiveChat from "../LiveChat/LiveChat";


function RealtimeChat() {
  const [username, setUsername] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md">
        <LiveChat chat_id="job123" username="Admin" role="admin"
          supabaseClient={supabase}
          table="messages"
          user={username}
          headerPlaceholder="Username"
          inputPlaceholder="Type a message..."
          onUserChange={setUsername}
        />
      </div>
    </div>
  );
}

export default RealtimeChat;