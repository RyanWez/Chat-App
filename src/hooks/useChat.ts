import { useState, useEffect } from "react";
import { ChatSession, Message } from "@/types/chat";

interface UseChatProps {
  userId: string | null;
}

export const useChat = ({ userId }: UseChatProps) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const activeChat = chatSessions.find((chat) => chat.id === activeChatId);

  // Load chats from database on mount
  useEffect(() => {
    if (!userId) {
      setIsInitializing(false);
      return;
    }

    const initChats = async () => {
      try {
        const response = await fetch("/api/chats", {
          headers: {
            'x-user-id': userId
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to load chats: ${response.status}`);
        }
        
        const chats = await response.json();
        
        if (chats.length > 0) {
          // Convert MongoDB _id to id
          const formattedChats = chats.map((chat: { _id: string; lastUpdated: string; messages: Array<{ timestamp: string }> }) => ({
            ...chat,
            id: chat._id,
            lastUpdated: new Date(chat.lastUpdated),
            messages: chat.messages.map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          
          setChatSessions(formattedChats);
          setActiveChatId(formattedChats[0].id);
        } else {
          // Create initial chat if none exist
          await createNewChat();
        }
      } catch (error) {
        console.error("Error loading chats:", error);
        // Fallback: create new chat
        await createNewChat();
      } finally {
        setIsInitializing(false);
      }
    };
    
    initChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const saveChat = async (chat: ChatSession) => {
    if (!userId) return;

    try {
      if (chat._id) {
        // Update existing chat
        const response = await fetch(`/api/chats/${chat._id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "x-user-id": userId
          },
          body: JSON.stringify({
            title: chat.title,
            messages: chat.messages
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update chat: ${response.status}`);
        }
      } else {
        // Create new chat
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-user-id": userId
          },
          body: JSON.stringify({
            title: chat.title,
            messages: chat.messages,
            userId: userId
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create chat: ${response.status}`);
        }
        
        const savedChat = await response.json();
        // Update local state with MongoDB _id
        setChatSessions(prev => prev.map(s => 
          s.id === chat.id ? { ...s, _id: savedChat._id } : s
        ));
      }
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeChat || isLoading || !userId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // Check if this is the first message BEFORE adding it
    const isFirstMessage = activeChat.messages.length === 0;
    
    // Add user message and update title if first message
    const updatedSessions = chatSessions.map((session) => {
      if (session.id === activeChatId) {
        return {
          ...session,
          messages: [...session.messages, newMessage],
          title: isFirstMessage
            ? content.trim().slice(0, 40) + (content.length > 40 ? "..." : "")
            : session.title,
          lastUpdated: new Date(),
        };
      }
      return session;
    });

    setChatSessions(updatedSessions);
    
    // Save to database
    const updatedChat = updatedSessions.find(s => s.id === activeChatId);
    if (updatedChat) {
      await saveChat(updatedChat);
    }

    setIsLoading(true);
    const assistantMessageId = (Date.now() + 1).toString();

    try {
      const apiMessages = updatedSessions
        .find((s) => s.id === activeChatId)
        ?.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })) || [];

      const response = await fetch("/api/chat-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error("Streaming failed");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      setIsLoading(false);
      setStreamingMessageId(assistantMessageId);

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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";
      let lastUpdateTime = Date.now();
      const MIN_UPDATE_INTERVAL = 30;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            try {
              const parsed = JSON.parse(data);

              if (parsed.type === "chunk" && parsed.content) {
                accumulatedContent += parsed.content;

                const now = Date.now();
                const timeSinceLastUpdate = now - lastUpdateTime;

                if (timeSinceLastUpdate >= MIN_UPDATE_INTERVAL) {
                  lastUpdateTime = now;

                  setChatSessions((prev) =>
                    prev.map((session) => {
                      if (session.id === activeChatId) {
                        return {
                          ...session,
                          messages: session.messages.map((msg) =>
                            msg.id === assistantMessageId
                              ? { ...msg, content: accumulatedContent }
                              : msg
                          ),
                          lastUpdated: new Date(),
                        };
                      }
                      return session;
                    })
                  );
                } else {
                  await new Promise((resolve) =>
                    setTimeout(resolve, MIN_UPDATE_INTERVAL - timeSinceLastUpdate)
                  );
                  lastUpdateTime = Date.now();

                  setChatSessions((prev) =>
                    prev.map((session) => {
                      if (session.id === activeChatId) {
                        return {
                          ...session,
                          messages: session.messages.map((msg) =>
                            msg.id === assistantMessageId
                              ? { ...msg, content: accumulatedContent }
                              : msg
                          ),
                          lastUpdated: new Date(),
                        };
                      }
                      return session;
                    })
                  );
                }
              } else if (parsed.type === "done") {
                setChatSessions((prev) =>
                  prev.map((session) => {
                    if (session.id === activeChatId) {
                      return {
                        ...session,
                        messages: session.messages.map((msg) =>
                          msg.id === assistantMessageId
                            ? { ...msg, content: accumulatedContent }
                            : msg
                        ),
                        lastUpdated: new Date(),
                      };
                    }
                    return session;
                  })
                );
                
                // Save final message to database
                const finalChat = chatSessions.find(s => s.id === activeChatId);
                if (finalChat) {
                  const updatedChat = {
                    ...finalChat,
                    messages: [...finalChat.messages, {
                      id: assistantMessageId,
                      content: accumulatedContent,
                      role: "assistant" as const,
                      timestamp: new Date()
                    }]
                  };
                  await saveChat(updatedChat);
                }
                
                setStreamingMessageId(null);
                break;
              } else if (parsed.type === "error") {
                throw new Error(parsed.error || "Streaming error");
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      setStreamingMessageId(null);
    } catch (error) {
      console.error("Streaming error, falling back to regular API:", error);
      setIsLoading(false);
      setStreamingMessageId(null);

      // Fallback logic...
      try {
        const apiMessages = updatedSessions
          .find((s) => s.id === activeChatId)
          ?.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })) || [];

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response from AI");
        }

        const data = await response.json();

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

        const fullText = data.content;
        const chunkSize = 5;
        let currentIndex = 0;

        const typeInterval = setInterval(() => {
          currentIndex += chunkSize;
          const currentText = fullText.slice(0, Math.min(currentIndex, fullText.length));

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
            
            // Save to database
            const finalChat = chatSessions.find(s => s.id === activeChatId);
            if (finalChat) {
              const updatedChat = {
                ...finalChat,
                messages: [...finalChat.messages, {
                  id: assistantMessageId,
                  content: fullText,
                  role: "assistant" as const,
                  timestamp: new Date()
                }]
              };
              saveChat(updatedChat);
            }
          }
        }, 20);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);

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
    }
  };

  const createNewChat = async () => {
    if (!userId) return;

    const tempId = Date.now().toString();
    const newChat: ChatSession = {
      id: tempId,
      title: "New Chat",
      messages: [],
      lastUpdated: new Date(),
      createdAt: new Date()
    };

    setChatSessions((prev) => [newChat, ...prev]);
    setActiveChatId(tempId);

    // Save to database
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          ...newChat,
          userId: userId
        })
      });

      if (response.ok) {
        const savedChat = await response.json();
        setChatSessions(prev => prev.map(chat => 
          chat.id === tempId ? { ...chat, _id: savedChat._id, id: savedChat._id } : chat
        ));
        setActiveChatId(savedChat._id);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const deleteChat = async (chatId: string) => {
    if (chatSessions.length === 1 || !userId) {
      return;
    }

    const chatToDelete = chatSessions.find(s => s.id === chatId);
    
    // Delete from database
    if (chatToDelete?._id) {
      try {
        await fetch(`/api/chats/${chatToDelete._id}`, {
          method: "DELETE",
          headers: {
            "x-user-id": userId
          }
        });
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    }

    setChatSessions((prev) => prev.filter((session) => session.id !== chatId));

    if (chatId === activeChatId) {
      const remainingChats = chatSessions.filter((s) => s.id !== chatId);
      if (remainingChats.length > 0) {
        setActiveChatId(remainingChats[0].id);
      }
    }
  };

  const updateChatTitle = async (chatId: string, newTitle: string) => {
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === chatId ? { ...session, title: newTitle } : session
      )
    );

    // Save to database
    const chat = chatSessions.find(s => s.id === chatId);
    if (chat) {
      await saveChat({ ...chat, title: newTitle });
    }
  };

  return {
    chatSessions,
    activeChatId,
    activeChat,
    isLoading,
    streamingMessageId,
    isInitializing,
    setActiveChatId,
    sendMessage,
    createNewChat,
    deleteChat,
    updateChatTitle,
  };
};
