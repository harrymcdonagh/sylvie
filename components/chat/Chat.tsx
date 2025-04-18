"use client";

import { useRef, useEffect, useState } from "react";
import ChatTitle from "./ChatTitle";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import type { Message, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useChatContext } from "./ChatProvider";

const assistant: User = {
  id: "assistant",
  name: "Sylvie",
};

export const Chat = () => {
  const { data: session } = useSession();
  const { activeConversation, messages, setMessages } = useChatContext();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser: User = {
    id: session?.user.id || "",
    name: session?.user.name || "User",
    avatar: session?.user.image || "",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeConversation) return;

    const userMessage: Message = {
      _id: Date.now().toString(), //ui id
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    //@ts-ignore
    setMessages((prev) => [...prev, userMessage]);

    const { _id, ...uMessage } = userMessage;
    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ ...uMessage, conversationId: activeConversation }),
    });

    setIsTyping(true);

    setTimeout(async () => {
      const assistantMessage: Message = {
        _id: (Date.now() + 1).toString(), //ui id
        content: `I'm responding to your message: "${content}"`,
        sender: "assistant",
        timestamp: new Date().toISOString(),
        status: "sent",
      };
      //@ts-ignore
      setMessages((prev) => [...prev, assistantMessage]);
      const { _id, ...aMessage } = assistantMessage;
      await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({ ...aMessage, conversationId: activeConversation }),
      });

      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full w-[80%] rounded-xl shadow-lg overflow-hidden border bg-background text-foreground">
      <ChatTitle />
      <ChatWindow
        messages={messages}
        currentUser={currentUser}
        assistant={assistant}
        isTyping={isTyping}
      />
      <ChatInput onSendMessage={sendMessage} />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chat;
