import {useCallback, useEffect, useRef, useState, useSyncExternalStore} from 'react';
import styles from "./ai-chat.module.css";
import {CodeXml, Maximize2, MessageSquare, Minimize2, SendHorizontal, X} from "lucide-react";
import Markdown from "react-markdown";
import {ChatWidgetCore} from "chatling";
import type {ChatMessage} from "chatling";
import {ParsedMdContext} from "./parse-md-context";
import {ParsePdfContext} from "./parse-pdf-context";

import {
    ACTION_TAG_EMAIL_ME,
    ACTION_TAG_WHATSAPP_ME,
    TRIGGER_EMAIL_ME,
    TRIGGER_WHATSAPP_ME
} from "../../config/helper";

interface AiChatProps {
    isChatOpen?: boolean;
    onClose?: () => void;
}

const GREETING: ChatMessage = {
    role: "assistant",
    content: "Hi! I'm Towfiqul's AI Assistant. How can I help you today?"
};

const CONNECTION_ERROR_MESSAGE = "I'm having trouble connecting. Please try again later.";

export function FloatingChat({isChatOpen = true, onClose}: Readonly<AiChatProps>) {
    const [isOpen, setIsOpen] = useState(isChatOpen);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState<boolean>(globalThis.navigator?.onLine ?? true);
    const YES_BUTTON_TEXT = "Yes, thanks!"
    const NO_BUTTON_TEXT = "No, thanks!"
    const scrollRef = useRef<HTMLDivElement>(null);
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    // Grounding context (RULESET + CV + website context + knowledge doc) loads
    // asynchronously after mount; kept in a ref rather than state so the
    // transport closure below (created once, at ChatWidgetCore construction
    // time) always reads the latest value without needing to be recreated.
    const contextRef = useRef("");

    // ChatWidgetCore (from the `chatling` package) owns message history, the
    // in-flight/loading flag, and send orchestration — everything else here
    // (open/closed state, full-screen, the confirm-action prompt, the whole
    // JSX/CSS) stays exactly as it was so the widget's look, position, and
    // behavior are unchanged. The custom transport below replicates the
    // previous fetch contract (system prompt assembled client-side, model +
    // temperature per request) so the existing Cloudflare Worker needs no
    // changes.
    const coreRef = useRef<ChatWidgetCore | null>(null);
    if (coreRef.current === null) {
        // Reset any previously persisted history so every page load starts
        // fresh with the greeting, matching prior (non-persisted) behavior.
        try {
            globalThis.localStorage?.removeItem("chatling:messages");
        } catch {
            // ignore
        }

        coreRef.current = new ChatWidgetCore(
            {
                initialMessages: [GREETING],
                draggable: false,
                workerUrl: import.meta.env.VITE_AI_PROXY_URL,
            },
            {
                transport: async (messages, {workerUrl}) => {
                    // The first stored message is the hardcoded UI greeting,
                    // display-only and never a real model turn, so it's
                    // dropped here — otherwise every request starts
                    // system->assistant, which some providers reject.
                    const conversationHistory = messages[0]?.role === "assistant"
                        ? messages.slice(1)
                        : messages;

                    try {
                        const res = await fetch(workerUrl, {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({
                                model: import.meta.env.VITE_OPEN_AI_MODEL,
                                temperature: Number(import.meta.env.VITE_OPEN_AI_TEMPERATURE) || 1,
                                messages: [
                                    {role: "system", content: contextRef.current},
                                    ...conversationHistory,
                                ],
                            }),
                        });
                        const completion = await res.json();
                        const aiResponse: string = completion.choices[0].message.content;

                        if (aiResponse.includes(ACTION_TAG_EMAIL_ME)) {
                            setPendingAction(TRIGGER_EMAIL_ME);
                        } else if (aiResponse.includes(ACTION_TAG_WHATSAPP_ME)) {
                            setPendingAction(TRIGGER_WHATSAPP_ME);
                        }

                        setIsConnected(true);

                        return aiResponse
                            .replace(ACTION_TAG_WHATSAPP_ME, "").trim()
                            .replace(ACTION_TAG_EMAIL_ME, "").trim();
                    } catch (error) {
                        console.error("AI Error:", error);
                        setIsConnected(false);
                        return CONNECTION_ERROR_MESSAGE;
                    }
                },
            }
        );
    }

    const subscribe = useCallback((onStoreChange: () => void) => {
        const core = coreRef.current;
        if (!core) return () => undefined;
        return core.subscribe(onStoreChange);
    }, []);
    const getSnapshot = useCallback(() => coreRef.current!.getState(), []);
    const chatState = useSyncExternalStore(subscribe, getSnapshot);
    const messages = chatState.messages;
    const isTyping = chatState.isLoading;

    useEffect(() => {
        setIsOpen(isChatOpen);
    }, [isChatOpen]);

    // Runs once on mount. Previously this reloaded + re-parsed the PDF/markdown
    // context (a network round trip plus a full pdf.js text extraction) on every
    // single chat message because `messages` was in the dependency array — that
    // was the main source of multi-second/minute lag per turn.
    useEffect(() => {
        coreRef.current?.start();

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

                contextRef.current = fullContext;
            } catch (error) {
                console.error("Error initializing AI context:", error);
            }
        };

        loadAllContext().then();

        return () => {
            globalThis.removeEventListener?.('online', handleOnline);
            globalThis.removeEventListener?.('offline', handleOffline);
            clearInterval(interval);
            coreRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

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

        setInput("");
        await coreRef.current!.sendMessage(textToSend);
    };

    return (
        <div className={`${styles.chatContainer} ${isFullScreen && isOpen ? styles.chatContainerElevated : ""}`}>
            {/* Chat Popup */}
            {isOpen && (
                <div className={`${styles.chatPopup} ${isFullScreen ? styles.fullScreen : ""}`}>
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
                        <div className={styles.headerActions}>
                            <button
                                onClick={() => setIsFullScreen(!isFullScreen)}
                                className={styles.closeButton}
                                aria-label={isFullScreen ? "Exit full screen" : "Full screen"}
                            >
                                {isFullScreen ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                            </button>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsFullScreen(false);
                                }}
                                className={styles.closeButton}
                                aria-label="Close chat"
                            >
                                <X onClick={() => globalThis.dispatchEvent?.(new CustomEvent(TRIGGER_WHATSAPP_ME))}/>
                            </button>
                        </div>
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
                className={`${styles.floatingButton} ${isOpen ? "" : styles.visible}`}
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
