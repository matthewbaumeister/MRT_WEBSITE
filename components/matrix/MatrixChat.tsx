"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface MatrixChatProps {
  onToggleSidebar: () => void;
  chatId: string | null;
  onNewChat: () => void;
}

export default function MatrixChat({
  onToggleSidebar,
  chatId,
  onNewChat,
}: MatrixChatProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userMessage = { role: "user", content: input, files: uploadedFiles };
    setMessages([...messages, userMessage]);
    setInput("");
    setUploadedFiles([]);
    setIsLoading(true);

    // TODO: Call OpenAI API and add assistant response
    // For now, just simulate a response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: "I'm MATRIX, your AI assistant. I'm currently in development and will be able to help you with various tasks soon!" 
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <button
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              {/* MRT Logo */}
              <div className="mb-8">
                <Image
                  src="/favicon.png"
                  alt="Make Ready Technologies"
                  width={120}
                  height={120}
                  className="mx-auto"
                />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How can I help you today?
              </h1>
              <p className="text-gray-400 text-lg">
                {session?.user?.name && `Welcome back, ${session.user.name.split(' ')[0]}`}
              </p>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white"
                      : "bg-gray-800 text-gray-100"
                  } rounded-2xl px-4 py-3`}
                >
                  {message.files && message.files.length > 0 && (
                    <div className="mb-2 space-y-1">
                      {message.files.map((file: File, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-sm opacity-90"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              {/* Input Box */}
              <div className="flex items-end bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-primary-500 transition-colors">
                {/* Action Buttons - Left Side */}
                <div className="flex items-center space-x-1 p-2">
                  {/* Upload Button */}
                  <label
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                    title="Upload document"
                  >
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
                    />
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </label>

                  {/* Options Menu Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowOptions(!showOptions)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="Options"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                    </button>

                    {/* Options Dropdown */}
                    {showOptions && (
                      <div className="absolute bottom-full left-0 mb-2 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                        <div className="p-3 border-b border-gray-800">
                          <input
                            type="text"
                            placeholder="Search menu"
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div className="p-2">
                          {/* Extended Thinking */}
                          <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              <span className="text-sm text-gray-300">Extended thinking</span>
                            </div>
                            <div className="w-10 h-5 bg-primary-600 rounded-full relative">
                              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>

                          {/* Web Search */}
                          <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                              <span className="text-sm text-gray-300">Web search</span>
                            </div>
                            <div className="w-10 h-5 bg-primary-600 rounded-full relative">
                              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>

                          {/* Research */}
                          <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <span className="text-sm text-gray-300">Research</span>
                            </div>
                            <div className="w-10 h-5 bg-gray-700 rounded-full relative">
                              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reload/Refresh Button */}
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    title="Refresh"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>

                {/* Text Input */}
                <div className="flex-1 flex flex-col">
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-2 pt-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-lg text-sm"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-gray-300">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="text-gray-400 hover:text-white"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="How can I help you today?"
                    className="flex-1 bg-transparent text-white placeholder-gray-500 py-4 px-2 focus:outline-none"
                    disabled={isLoading}
                  />
                </div>

                {/* Model Selector & Submit - Right Side */}
                <div className="flex items-center space-x-2 p-2">
                  {/* Model Selector */}
                  <div className="relative group">
                    <button
                      type="button"
                      className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <span>GPT-4 Mini</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                      <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap border border-gray-700">
                        More models coming soon
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
                    className="p-2 bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                  >
                    {isLoading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 text-center mt-3">
            MATRIX can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}

