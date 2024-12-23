"use client";

import { FaRegUser } from "react-icons/fa6";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { useAuthStore } from "@/zustand/auth-store";
import { useChatStore } from "@/zustand/chat-store";
import { useFetch } from "@/hooks/use-fetch";
import { ChatsControllerResponse } from "@/types/api";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import ExitButton from "./exit-button";
import EditButton from "./edit-button";

export default function ChatRoom() {
  const {
    title,
    createdAt,
    participants,
    messages,
    setTitle,
    setCreatedAt,
    setCreatedBy,
    setParticipants,
    setMessages,
  } = useChatStore();
  const { accessToken, user } = useAuthStore();
  const [data, setData] = useState<ChatsControllerResponse | null>();
  const { fetchWithRetry } = useFetch<ChatsControllerResponse | null>();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { chatId } = useParams();
  const fetchData = async () => {
    const result = await fetchWithRetry(
      `${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${accessToken}`,
        },
      }
    );
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, [chatId]);

  useEffect(() => {
    console.log("chatRoom fetch test", data);
    const chatInfo = data?.chat;
    setTitle(chatInfo?.title || null);
    setParticipants(chatInfo?.participants || []);
    setMessages(chatInfo?.messages || []);
    setCreatedAt(chatInfo?.createdAt || null);
    setCreatedBy(chatInfo?.createdBy || null);
  }, [data]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="h-[calc(100vh-200px)] max-w-4xl mx-auto flex flex-col bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <ExitButton />
            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-xl font-bold">{title}</h1>
                {true && <EditButton />}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(
                  createdAt || new Date().toISOString()
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <FaRegUser className="w-5 h-5" />
            <span>{participants.length}</span>
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll"
        >
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.content}
              sender={message.sender.nickname || "탈퇴한 사용자"}
              isMine={message.sender.id === user?.id}
            />
          ))}
        </div>
        <ChatInput />
      </div>
    </>
  );
}
