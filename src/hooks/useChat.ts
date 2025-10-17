import { useState } from "react";
import { ChatSession, Message } from "@/types/chat";

export const useChat = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Welcome Chat",
      messages: [],
      lastUpdated: new Date(),
    },
  ]);
  const [activeChatId, setActiveChatId] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );

  const activeChat = chatSessions.find((chat) => chat.id === activeChatId);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeChat || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // Add user message and update title if first message
    const updatedSessions = chatSessions.map((session) => {
      if (session.id === activeChatId) {
        const isFirstMessage = session.messages.length === 0;
        return {
          ...session,
          messages: [...session.messages, newMessage],
          title: isFirstMessage
            ? content.trim().slice(0, 40) +
              (content.length > 40 ? "..." : "")
            : session.title,
          lastUpdated: new Date(),
        };
      }
      return session;
    });

    setChatSessions(updatedSessions);
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();

    try {
      // Prepare messages for API
      const apiMessages =
        updatedSessions
          .find((s) => s.id === activeChatId)
          ?.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })) || [];

      // Use regular API (not streaming)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      setIsLoading(false);

      // Add empty message first
      const emptyMessage: Message = {
        id: assistantMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
      };

      setChatSessions((prev) =>
        prev.map((session) => {
          if (session.id === activeChatId) {
            return {
              ...session,
              messages: [...session.messages, emptyMessage],
              lastUpdated: new Date(),
            };
          }
          return session;
        })
      );

      setStreamingMessageId(assistantMessageId);

      // Simulate typing effect
      const fullText = data.content;
      const chunkSize = 5; // characters per update
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        currentIndex += chunkSize;
        const currentText = fullText.slice(
          0,
          Math.min(currentIndex, fullText.length)
        );

        setChatSessions((prev) =>
          prev.map((session) => {
            if (session.id === activeChatId) {
              return {
                ...session,
                messages: session.messages.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: currentText }
                    : msg
                ),
                lastUpdated: new Date(),
              };
            }
            return session;
          })
        );

        if (currentIndex >= fullText.length) {
          clearInterval(typeInterval);
          setStreamingMessageId(null);
        }
      }, 20); // 20ms per chunk = smooth animation
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);

      // Show error message
      const errorMessage: Message = {
        id: assistantMessageId,
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };

      setChatSessions((prev) =>
        prev.map((session) => {
          if (session.id === activeChatId) {
            return {
              ...session,
              messages: [...session.messages, errorMessage],
              lastUpdated: new Date(),
            };
          }
          return session;
        })
      );
    }
  };

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      lastUpdated: new Date(),
    };

    setChatSessions((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const deleteChat = (chatId: string) => {
    // Don't delete if it's the only chat
    if (chatSessions.length === 1) {
      return;
    }

    setChatSessions((prev) => prev.filter((session) => session.id !== chatId));

    // If deleting active chat, switch to another
    if (chatId === activeChatId) {
      const remainingChats = chatSessions.filter((s) => s.id !== chatId);
      if (remainingChats.length > 0) {
        setActiveChatId(remainingChats[0].id);
      }
    }
  };

  const updateChatTitle = (chatId: string, newTitle: string) => {
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === chatId ? { ...session, title: newTitle } : session
      )
    );
  };

  return {
    chatSessions,
    activeChatId,
    activeChat,
    isLoading,
    streamingMessageId,
    setActiveChatId,
    sendMessage,
    createNewChat,
    deleteChat,
    updateChatTitle,
  };
};
