import { useState } from "react";
import { ChatSession, Message } from "@/types/chat";

export const useChat = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "New Chat",
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
            ? content.trim().slice(0, 40) + (content.length > 40 ? "..." : "")
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

      // Try streaming first
      const response = await fetch("/api/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error("Streaming failed");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Hide loading, show empty message
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

      // Read stream with throttling for better readability
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";
      let lastUpdateTime = Date.now();
      const MIN_UPDATE_INTERVAL = 30; // ms between updates (adjust this!)

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

                // Throttle updates for smoother animation
                const now = Date.now();
                const timeSinceLastUpdate = now - lastUpdateTime;

                if (timeSinceLastUpdate >= MIN_UPDATE_INTERVAL) {
                  lastUpdateTime = now;

                  // Update message content
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
                  // Wait a bit before next update
                  await new Promise((resolve) =>
                    setTimeout(
                      resolve,
                      MIN_UPDATE_INTERVAL - timeSinceLastUpdate
                    )
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
                // Final update with all content
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

      // Fallback to regular API
      try {
        const apiMessages =
          updatedSessions
            .find((s) => s.id === activeChatId)
            ?.messages.map((m) => ({
              role: m.role,
              content: m.content,
            })) || [];

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

        // Add message with typing animation
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
        const chunkSize = 5;
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
        }, 20);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);

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
    if (chatSessions.length === 1) {
      return;
    }

    setChatSessions((prev) => prev.filter((session) => session.id !== chatId));

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
