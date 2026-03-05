import {useEffect, useRef, useState} from 'react';
import OpenAI from "openai";
import type {ChatCompletionMessageParam} from "openai/resources/chat/completions";
import styles from "./ai-chat.module.css";
import {CodeXml, MessageSquare, SendHorizontal, X} from "lucide-react";
import Markdown from "react-markdown";
import {ParsedMdContext} from "./parse-md-context";
import {ParsePdfContext} from "./parse-pdf-context";
import {ACTION_TAG_EMAIL_ME, ACTION_TAG_WHATSAPP_ME, TRIGGER_EMAIL_ME, TRIGGER_WHATSAPP_ME} from "../../config/helper";

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
    baseURL: import.meta.env.VITE_OPEN_AI_BASE_URL,
    dangerouslyAllowBrowser: true
});

interface AiChatProps {
    isChatOpen?: boolean;
    onOpen?: () => void;
}

export function FloatingChat({isChatOpen = true, onOpen}: AiChatProps) {
    const [context, setContext] = useState("");
    const [isOpen, setIsOpen] = useState(isChatOpen);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isConnected, setIsConnected] = useState<boolean>(globalThis.navigator?.onLine ?? true);
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
        {role: "assistant", content: "Hi! I'm Towfiqul's AI Assistant. How can I help you today?"}
    ]);
    const YES_BUTTON_TEXT = "Yes, thanks!."
    const NO_BUTTON_TEXT = "No, thanks!"
    const scrollRef = useRef<HTMLDivElement>(null);
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    useEffect(() => {
        setIsOpen(isChatOpen);
        const handleOnline = () => setIsConnected(true);
        const handleOffline = () => setIsConnected(false);
        globalThis.addEventListener?.('online', handleOnline);
        globalThis.addEventListener?.('offline', handleOffline);
        const interval = setInterval(checkRealInternet, 30000);
        const loadAllContext = async () => {
            try {
                const [rulesetContext, documentPdfContext, websiteContext, documentMdContext] = await Promise.all([
                    ParsedMdContext("/RULESET.md"),
                    ParsePdfContext("/Towfiqul_Islam_AI.pdf"),
                    ParsedMdContext("/WEBSITE_CONTEXT.md"),
                    ParsedMdContext("/Towfiqul_Islam.md")
                ]);

                const basePrompt = `SYSTEM RULES:\n${rulesetContext}`;
                const pdfContext = `Document Context:\n${documentPdfContext}`;
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
        return () => {
            globalThis.removeEventListener?.('online', handleOnline);
            globalThis.removeEventListener?.('offline', handleOffline);
            clearInterval(interval);
        };
    }, [messages, isChatOpen]);

    const checkRealInternet = async () => {
        try {
            const response = await fetch('https://www.google.com/favicon.ico', {
                mode: 'no-cors',
                cache: 'no-store'
            });
            setIsConnected(response.ok || response.type === 'opaque');
        } catch {
            setIsConnected(false);
        }
    };

    const confirmAction = async (confirmed: boolean) => {
        setPendingAction(null);

        if (confirmed && pendingAction) {
            globalThis.dispatchEvent?.(new CustomEvent(pendingAction));
            await handleSendMessage(YES_BUTTON_TEXT);
        } else {
            await handleSendMessage(NO_BUTTON_TEXT);
        }
    };

    const handleSendMessage = async (overrideInput?: string) => {
        const textToSend = overrideInput || input;
        if (!textToSend.trim() || isTyping) return;

        const userMsg: ChatCompletionMessageParam = {role: "user", content: textToSend};

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const completion = await client.chat.completions.create({
                model: import.meta.env.VITE_OPEN_AI_MODEL || "glm-4.5-flash",
                temperature: Number(import.meta.env.VITE_OPEN_AI_TEMPERATURE) || 1,
                messages: [
                    {
                        role: "system",
                        content: context
                    },
                    ...messages,
                    userMsg
                ],
            });

            const aiResponse = completion.choices[0].message.content;

            if (aiResponse) {
                let ACTION_TAG = "";

                if (aiResponse.includes(ACTION_TAG_EMAIL_ME)) {
                    setPendingAction(TRIGGER_EMAIL_ME);
                } else if (aiResponse.includes(ACTION_TAG_WHATSAPP_ME)) {
                    setPendingAction(TRIGGER_WHATSAPP_ME);
                }

                const cleanedResponse = aiResponse
                    .replace(ACTION_TAG_WHATSAPP_ME, "").trim()
                    .replace(ACTION_TAG_EMAIL_ME, "").trim();

                const aiMsg: ChatCompletionMessageParam = {
                    role: "assistant",
                    content: cleanedResponse
                };
                setMessages(prev => [...prev, aiMsg]);
            }
            setIsConnected(true);
        } catch (error) {
            setIsConnected(false);
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
                                <h3 className={styles.headerTitle}>
                                    Towfiqul's AI Assistant<span
                                    className={`${styles.statusDot} ${isConnected ? styles.online : styles.offline}`}/>
                                </h3>
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

                        {pendingAction && (
                            <div className={styles.confirmationBox}>
                                <p></p>
                                <div className={styles.buttonGroup}>
                                    <button onClick={() => confirmAction(true)} className={styles.btnYes}>
                                        {YES_BUTTON_TEXT}
                                    </button>
                                    <button onClick={() => confirmAction(false)} className={styles.btnNo}>
                                        {NO_BUTTON_TEXT}
                                    </button>
                                </div>
                            </div>
                        )}

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
                                onClick={() => handleSendMessage()}
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
    );
}