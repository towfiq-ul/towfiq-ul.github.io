import {useEffect, useRef, useState} from 'react';
import OpenAI from "openai";
import type {ChatCompletionMessageParam} from "openai/resources/chat/completions";
import ParsedContext from "./parse-context";
import styles from "./ai-chat.module.css";
import {CodeXml, MessageSquare, SendHorizontal, X} from "lucide-react";

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
    baseURL: import.meta.env.VITE_OPEN_AI_BASE_URL,
    dangerouslyAllowBrowser: true
});

export default function FloatingChat() {
    const [context, setContext] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
        {role: "assistant", content: "Hi! I'm Towfiqul's AI Assistant. How can I help you today?"}
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ParsedContext.then(text => {
            setContext(`You are an AI assistant for Towfiqul Islam. Use this context to answer: ${text}`)
        });

        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: ChatCompletionMessageParam = {role: "user", content: input};

        setMessages(prev => [...prev, userMsg]);
        setInput("");

        try {
            const completion = await client.chat.completions.create({
                model: import.meta.env.VITE_OPEN_AI_MODEL || "glm-4.7-flash",
                messages: [
                    {
                        role: "system",
                        content: `${context}`
                    },
                    ...messages,
                    userMsg
                ],
            });

            const aiResponse = completion.choices[0].message.content;

            if (aiResponse) {
                const aiMsg: ChatCompletionMessageParam = {
                    role: "assistant",
                    content: aiResponse
                };
                setMessages(prev => [...prev, aiMsg]);
            }
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I'm having trouble connecting. Please try again later."
            }]);
        }
    };

    return (
        <>
            <div className={styles.chatContainer}>
                {/* Chat Popup */}
                {isOpen && (
                    <div className={styles.chatPopup}>
                        <div className={styles.chatHeader}>
                            <div className={styles.chatHeaderContent}>
                                <div className={styles.avatar}>
                                    <CodeXml className={styles.avatarIcon}/>
                                </div>
                                <div className={styles.headerText}>
                                    <h3 className={styles.headerTitle}>Towfiqul's AI Assistant</h3>
                                    <p className={styles.headerSubtitle}></p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className={styles.closeButton}
                                aria-label="Close chat"
                            >
                                <X/>
                            </button>
                        </div>

                        <div ref={scrollRef} className={styles.chatBody}>
                            {messages.map((m, i) => (
                                <div key={i}
                                     className={`${styles.messageWrapper} ${m.role === 'user' ? styles.userAlign : styles.aiAlign}`}>
                                    <div className={styles.messageBubble}>
                                        <p className={styles.messageText}>
                                            {typeof m.content === 'string' ? m.content : '...'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.chatFooter}>
                            <div className={styles.inputWrapper}>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                    placeholder="Ask about Towfiqul..."
                                    className={styles.chatInput}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className={styles.innerSendButton}
                                    disabled={!input.trim()}
                                >
                                    <SendHorizontal size={18}/>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modern Floating Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`${styles.floatingButton} ${!isOpen ? styles.visible : ""}`}
                    data-open={isOpen}
                    aria-label="AI Assistant Chat"
                >
                    {!isOpen && <span className={styles.notificationBadge}>1</span>}

                    {isOpen ? (
                        <X className={styles.buttonIcon}/>
                    ) : (
                        <div className={styles.iconContainer}>
                            <MessageSquare className={styles.buttonIcon}/>
                        </div>
                    )}
                </button>
            </div>
        </>
    );
}