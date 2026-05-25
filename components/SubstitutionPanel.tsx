"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./SubstitutionPanel.module.css";

interface Message {
  role: "user" | "assistant";
  text: string;
  streaming?: boolean;
}

interface SubstitutionPanelProps {
  recipeName: string;
  ingredients: string | null;
}

export default function SubstitutionPanel({ recipeName, ingredients }: SubstitutionPanelProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    setInput("");
    setLoading(true);

    // Append user message
    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    // Append empty assistant message that we'll stream into
    setMessages((prev) => [...prev, { role: "assistant", text: "", streaming: true }]);

    try {
      const res = await fetch("/api/substitutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, recipeName, ingredients }),
      });

      if (!res.ok || !res.body) throw new Error(await res.text());

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        // Update the last (streaming) assistant message in place
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", text: accumulated, streaming: true };
          return next;
        });
      }

      // Mark streaming complete
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", text: accumulated, streaming: false };
        return next;
      });
    } catch (err: any) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
          streaming: false,
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.panel}>
      {/* Toggle header */}
      <button
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="substitution-body"
      >
        <span className={styles.toggleIcon} aria-hidden="true">✦</span>
        <span className={styles.toggleLabel}>Ask about substitutions</span>
        <span className={styles.toggleHint}>Powered by DeepSeek AI</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* Collapsible body */}
      <div
        id="substitution-body"
        className={`${styles.body} ${open ? styles.bodyOpen : ""}`}
        aria-hidden={!open}
      >
        {/* Message history */}
        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              <p>Ask anything about ingredient swaps — dietary needs, allergies, what you have in the cupboard.</p>
              <div className={styles.suggestions}>
                {[
                  "What can I use instead of butter?",
                  "Make this recipe vegan",
                  "I'm out of eggs — alternatives?",
                ].map((s) => (
                  <button
                    key={s}
                    className={styles.suggestion}
                    onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.message} ${msg.role === "user" ? styles.userMessage : styles.assistantMessage}`}
            >
              {msg.role === "assistant" && (
                <span className={styles.aiLabel} aria-label="AI">✦</span>
              )}
              <p className={styles.messageText}>
                {msg.text}
                {msg.streaming && <span className={styles.cursor} aria-hidden="true" />}
              </p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form className={styles.inputRow} onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. I'm lactose intolerant — what replaces the cream?"
            rows={2}
            disabled={loading}
            aria-label="Ask about substitutions"
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!input.trim() || loading}
            aria-label="Send"
          >
            {loading ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8L14 2L8 14L7 9L2 8Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </form>
        <p className={styles.disclaimer}>AI suggestions — always use your own judgement.</p>
      </div>
    </div>
  );
}
