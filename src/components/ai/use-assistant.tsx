import {useCallback, useEffect, useRef, useState, useSyncExternalStore} from "react";
import {ChatWidgetCore} from "chatling";
import type {ChatMessage} from "chatling";
import {
    ACTION_TAG_EMAIL_ME,
    ACTION_TAG_WHATSAPP_ME,
    TRIGGER_EMAIL_ME,
    TRIGGER_WHATSAPP_ME
} from "../../config/helper";

export const GREETING: ChatMessage = {
    role: "assistant",
    content: "Hi! I'm Towfiqul's AI Assistant. How can I help you today?"
};

export const YES_BUTTON_TEXT = "Yes, thanks!";
export const NO_BUTTON_TEXT = "No, thanks!";

const CONNECTION_ERROR_MESSAGE = "I'm having trouble connecting. Please try again later.";
const SERVICE_ERROR_MESSAGE = "The AI service is unavailable right now. Please try again later, or reach Towfiqul via `mail`.";
const RATE_LIMITED_MESSAGE = "Too many questions in a short time. Please wait a minute and try again.";

export interface AssistantReply {
    text: string;
    /** Portfolio documents the answer was grounded in (from the RAG Worker). */
    sources: string[];
}

/**
 * Towfiqul's AI Assistant, headless. ChatWidgetCore (from `chatling`) owns
 * message history and send/loading orchestration. Retrieval and grounding
 * happen server-side in the RAG Worker (workers/ai-proxy.js): the browser
 * only sends the conversation and gets back an answer plus its sources.
 */
export function useAssistant() {
    const [isConnected, setIsConnected] = useState<boolean>(globalThis.navigator?.onLine ?? true);
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    const lastSources = useRef<string[]>([]);

    const coreRef = useRef<ChatWidgetCore | null>(null);
    if (coreRef.current === null) {
        // Every page load starts fresh rather than restoring persisted history.
        try {
            globalThis.localStorage?.removeItem("chatling:messages");
        } catch {
            // ignore
        }

        coreRef.current = new ChatWidgetCore(
            {
                draggable: false,
                workerUrl: import.meta.env.VITE_AI_PROXY_URL,
                greetingMessage: "Hello! How can I help you today?",
            },
            {
                transport: async (messages, {workerUrl}) => {
                    // Only real user/assistant turns; a leading assistant
                    // message is display-only and the Worker rejects it.
                    const conversation = messages
                        .filter((m) => m.role === "user" || m.role === "assistant")
                        .map(({role, content}) => ({role, content}));
                    while (conversation[0]?.role === "assistant") conversation.shift();

                    lastSources.current = [];
                    try {
                        const res = await fetch(workerUrl, {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            // Model settings (temperature, tokens) are owned by the Worker.
                            body: JSON.stringify({messages: conversation}),
                        });
                        const completion = await res.json().catch(() => null);
                        const aiResponse: string | undefined = completion?.choices?.[0]?.message?.content;

                        // Log the Worker's real error instead of crashing on a missing `choices`.
                        if (!res.ok || !aiResponse) {
                            const detail = completion?.error?.message ?? completion?.detail ?? completion?.error;
                            console.error(`AI proxy error (HTTP ${res.status}):`, detail ?? completion);
                            setIsConnected(true);
                            return res.status === 429 ? RATE_LIMITED_MESSAGE : SERVICE_ERROR_MESSAGE;
                        }

                        if (aiResponse.includes(ACTION_TAG_EMAIL_ME)) {
                            setPendingAction(TRIGGER_EMAIL_ME);
                        } else if (aiResponse.includes(ACTION_TAG_WHATSAPP_ME)) {
                            setPendingAction(TRIGGER_WHATSAPP_ME);
                        }

                        lastSources.current = Array.isArray(completion?.sources) ? completion.sources : [];
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

    useEffect(() => {
        coreRef.current?.start();
        coreRef.current?.dismissGreeting();

        const handleOnline = () => setIsConnected(true);
        const handleOffline = () => setIsConnected(false);
        globalThis.addEventListener?.("online", handleOnline);
        globalThis.addEventListener?.("offline", handleOffline);

        return () => {
            globalThis.removeEventListener?.("online", handleOnline);
            globalThis.removeEventListener?.("offline", handleOffline);
            coreRef.current?.destroy();
        };
    }, []);

    const send = useCallback(async (text: string): Promise<AssistantReply | null> => {
        const core = coreRef.current!;
        if (!text.trim() || core.getState().isLoading) return null;
        await core.sendMessage(text);
        const last = core.getState().messages.at(-1);
        return last?.role === "assistant" ? {text: last.content, sources: lastSources.current} : null;
    }, []);

    const confirmAction = useCallback(async (confirmed: boolean) => {
        const action = pendingAction;
        setPendingAction(null);
        if (confirmed && action) {
            globalThis.dispatchEvent?.(new CustomEvent(action));
            return send(YES_BUTTON_TEXT);
        }
        return send(NO_BUTTON_TEXT);
    }, [pendingAction, send]);

    return {
        isLoading: chatState.isLoading,
        isConnected,
        pendingAction,
        send,
        confirmAction,
    };
}
