"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Send, RefreshCcw, User, MessageSquare } from "lucide-react";
import { practiceDeck, questionFeedback, MatterType } from "@/lib/legalEngine";

type Message = {
  id: string;
  role: "judge" | "user" | "feedback" | "system";
  content: string;
};

export default function PracticeMode() {
  const [active, setActive] = useState(false);
  const [matter, setMatter] = useState<MatterType>("consumer");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  const startPractice = () => {
    const deck = practiceDeck(matter);
    setQuestions(deck);
    setQIndex(0);
    setActive(true);
    setMessages([
      {
        id: Date.now().toString(),
        role: "system",
        content:
          "Practice mode started. Answer as if you are in court: factual, short, and specific.",
      },
      { id: (Date.now() + 1).toString(), role: "judge", content: deck[0] },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || !active || isSubmitting) return;

    const userMsg = input.trim();
    setInput("");
    setIsSubmitting(true);

    const newMessages = [
      ...messages,
      { id: Date.now().toString(), role: "user" as const, content: userMsg },
    ];

    let feedbackStr = "";
    
    try {
      const response = await fetch("/api/v1/practice/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matter_type: matter, user_answer: userMsg }),
      });

      if (response.ok) {
        const json = await response.json();
        feedbackStr = json.data.feedback;
      } else if (response.status === 401) {
        console.warn("Unauthenticated: Falling back to local AI engine.");
        feedbackStr = questionFeedback(userMsg);
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      console.error(error);
      feedbackStr = questionFeedback(userMsg);
    }

    newMessages.push({
      id: (Date.now() + 1).toString(),
      role: "feedback" as const,
      content: feedbackStr,
    });

    const nextIndex = qIndex + 1;
    if (nextIndex < questions.length) {
      newMessages.push({
        id: (Date.now() + 2).toString(),
        role: "judge" as const,
        content: questions[nextIndex],
      });
      setQIndex(nextIndex);
    } else {
      newMessages.push({
        id: (Date.now() + 2).toString(),
        role: "system" as const,
        content:
          "Practice complete. Review the transcript and refine your answers for the actual hearing.",
      });
      setActive(false);
    }

    setMessages(newMessages);
    setIsSubmitting(false);
  };

  const resetPractice = () => {
    setActive(false);
    setMessages([]);
    setQuestions([]);
    setQIndex(0);
    setInput("");
  };

  return (
    <section id="practice-mode" className="py-24 bg-[#07111f] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#d4af37]/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Practice <span className="text-[#d4af37]">Simulator</span>
          </h2>
          <p className="text-[#b8c2cc] font-sans text-lg max-w-2xl mx-auto">
            Prepare for court hearings or legal discussions. Face AI-generated questions from a
            simulated judge and get instant feedback on your answers.
          </p>
        </div>

        <div className="glass-card overflow-hidden flex flex-col border border-white/10 h-[600px] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="bg-[#0d1b2a] p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={matter}
                onChange={(e) => setMatter(e.target.value as MatterType)}
                disabled={active}
                className="bg-[#07111f] border border-white/10 rounded px-3 py-1.5 text-white font-sans text-sm outline-none focus:border-[#d4af37] disabled:opacity-50"
              >
                <option value="consumer">Consumer Court</option>
                <option value="family">Family Court</option>
                <option value="property">Property Dispute</option>
                <option value="criminal">Criminal Case</option>
              </select>

              <div className="flex items-center gap-2 text-xs font-sans text-[#b8c2cc]">
                <span className="w-2 h-2 rounded-full bg-[#00d084] animate-pulse" />
                AI Judge Active
              </div>
            </div>

            <button
              onClick={active || messages.length > 0 ? resetPractice : startPractice}
              className="text-xs font-sans px-4 py-1.5 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              {active || messages.length > 0 ? (
                <>
                  <RefreshCcw className="w-3 h-3" /> Reset
                </>
              ) : (
                "Start Session"
              )}
            </button>
          </div>

          {/* Transcript Area */}
          <div
            ref={transcriptRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#07111f]/50 to-[#0d1b2a]/50 scroll-smooth"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <Scale className="w-16 h-16 text-[#d4af37] mb-4" />
                <p className="text-white font-sans">
                  Select a matter type and click Start Session.
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.role === "user"
                          ? "bg-[#d4af37]/10 border border-[#d4af37]/30 text-white rounded-br-none"
                          : msg.role === "judge"
                            ? "bg-[#0d1b2a] border border-white/10 text-white rounded-bl-none"
                            : msg.role === "system"
                              ? "bg-transparent border border-[#d4af37]/20 text-[#d4af37] w-full text-center text-sm font-semibold mx-auto"
                              : "bg-[#ff4d4d]/10 border border-[#ff4d4d]/30 text-[#ff4d4d] text-sm italic rounded-bl-none"
                      }`}
                    >
                      {msg.role !== "system" && (
                        <div className="flex items-center gap-2 mb-1.5 opacity-70">
                          {msg.role === "user" ? (
                            <User className="w-3 h-3" />
                          ) : msg.role === "judge" ? (
                            <Scale className="w-3 h-3" />
                          ) : (
                            <MessageSquare className="w-3 h-3" />
                          )}
                          <span className="text-xs uppercase font-bold tracking-wider">
                            {msg.role === "user"
                              ? "You"
                              : msg.role === "judge"
                                ? "AI Judge"
                                : "Feedback"}
                          </span>
                        </div>
                      )}
                      <p className="font-sans leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#0d1b2a] border-t border-white/10">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={!active}
                placeholder={active ? "Type your answer..." : "Start session to type..."}
                className="w-full bg-[#07111f] border border-white/10 rounded-full py-3 pl-4 pr-12 text-white font-sans focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none disabled:opacity-50 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!active || !input.trim() || isSubmitting}
                className="absolute right-2 p-2 rounded-full bg-[#d4af37] text-[#07111f] disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30 hover:scale-105 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {active && (
              <div className="flex justify-between items-center mt-3 px-2">
                <span className="text-xs text-[#b8c2cc] font-sans">
                  Question {qIndex + 1} of {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-1 rounded-full ${i <= qIndex ? "bg-[#d4af37]" : "bg-white/10"}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
