import {useEffect, useRef, useState} from 'react';
import OpenAI from "openai";
import type {ChatCompletionMessageParam} from "openai/resources/chat/completions";
import styles from "./ai-chat.module.css";
import {CodeXml, MessageSquare, SendHorizontal, X} from "lucide-react";
import Markdown from "react-markdown";
import {ParsedMdContext} from "./parse-md-context";
import {ParsePdfContext} from "./parse-pdf-context";

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
    baseURL: import.meta.env.VITE_OPEN_AI_BASE_URL,
    dangerouslyAllowBrowser: true
});

export default function FloatingChat() {
    const [context, setContext] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
        {role: "assistant", content: "Hi! I'm Towfiqul's AI Assistant. How can I help you today?"}
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadAllContext = async () => {
            try {
                const [rulesetContext, documentPdfContext, websiteContext, documentMdContext] = await Promise.all([
                    ParsedMdContext("/RULESET.md"),
                    ParsePdfContext("/Towfiqul_Islam_AI.pdf"),
                    ParsedMdContext("/WEBSITE_CONTEXT.md"),
                    ParsedMdContext("/Towfiqul_Islam.md")
                ]);

                const basePrompt = `SYSTEM RULES:\n${rulesetContext}`;
                const pdfContext =`Document Context:\n${documentPdfContext}`;
                const webContext = `Website Context:\n${websiteContext}`;
                const mdContext = `AI Knowledge:\n${documentMdContext}`;
                const fullContext = `${basePrompt}\n\n${pdfContext}\n\n${webContext}\n\n${mdContext}`;

                setContext(fullContext);
            } catch (error) {
                console.error("Error initializing AI context:", error);
            }
        };

        loadAllContext().then();

        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg: ChatCompletionMessageParam = {role: "user", content: input};

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const completion = await client.chat.completions.create({
                model: import.meta.env.VITE_OPEN_AI_MODEL || "glm-4.5-flash",
                temperature: import.meta.env.VITE_OPEN_AI_TEMPERATURE || 1.0,
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
        } finally {
            setIsTyping(false);
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
                                        <div className={styles.messageText}>
                                            {typeof m.content === 'string' ? (
                                                <Markdown>
                                                    {m.content}
                                                </Markdown>
                                            ) : (
                                                '...'
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Thinking Indicator */}
                            {isTyping && (
                                <div className={`${styles.messageWrapper} ${styles.aiAlign}`}>
                                    <div className={`${styles.messageBubble} ${styles.typingBubble}`}>
                                        <div className={styles.typingIndicator}>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
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