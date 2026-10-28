import {useCallback, useEffect, useRef, useState, useSyncExternalStore} from "react";
import {ChatWidgetCore} from "chatling";
import type {ChatMessage} from "chatling";
import {ParsedMdContext} from "./parse-md-context";
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
const SERVICE_ERROR_MESSAGE = "The AI service is unavailable right now. Please try again later, or reach Towfiqul via the mail.sh tab.";
const RATE_LIMITED_MESSAGE = "Too many questions in a short time. Please wait a minute and try again.";

/**
 * Towfiqul's AI Assistant, headless. ChatWidgetCore (from `chatling`) owns
 * message history and send/loading orchestration; this hook supplies the
 * custom transport (system prompt assembled client-side, posted to the
 * Cloudflare Worker proxy) and the grounding context. The UI lives in the
 * terminal's agent prompt.
 */
export function useAssistant() {
    const [isConnected, setIsConnected] = useState<boolean>(globalThis.navigator?.onLine ?? true);
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    // Grounding context (RULESET + CV + website context + knowledge doc) loads
    // asynchronously after mount; kept in a ref so the transport closure
    // (created once, with the core) always reads the latest value.
    const contextRef = useRef("");

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
                    // A leading assistant message is display-only, never a real
                    // model turn — drop it so requests don't start system->assistant.
                    const conversationHistory = messages[0]?.role === "assistant"
                        ? messages.slice(1)
                        : messages;

                    try {
                        const res = await fetch(workerUrl, {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({
                                temperature: Number(import.meta.env.VITE_OPEN_AI_TEMPERATURE) || 1,
                                messages: [
                                    {role: "system", content: contextRef.current},
                                    ...conversationHistory,
                                ],
                            }),
                        });
                        const completion = await res.json().catch(() => null);
                        const aiResponse: string | undefined = completion?.choices?.[0]?.message?.content;

                        // The Worker relays upstream errors as JSON (e.g. a model
                        // that's no longer available) — log the real cause instead
                        // of crashing on a missing `choices`.
                        if (!res.ok || !aiResponse) {
                            const detail = completion?.error?.message ?? completion?.error ?? completion?.detail;
                            console.error(`AI proxy error (HTTP ${res.status}):`, detail ?? completion);
                            setIsConnected(true);
                            return res.status === 429 ? RATE_LIMITED_MESSAGE : SERVICE_ERROR_MESSAGE;
                        }

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

    // Load the grounding context once on mount. pdf.js is imported lazily so
    // it stays out of the initial bundle.
    useEffect(() => {
        coreRef.current?.start();
        coreRef.current?.dismissGreeting();

        const handleOnline = () => setIsConnected(true);
        const handleOffline = () => setIsConnected(false);
        globalThis.addEventListener?.("online", handleOnline);
        globalThis.addEventListener?.("offline", handleOffline);

        const loadAllContext = async () => {
            try {
                const {ParsePdfContext} = await import("./parse-pdf-context");
                const [rulesetContext, documentPdfContext, websiteContext, documentMdContext] = await Promise.all([
                    ParsedMdContext("/RULESET.md"),
                    ParsePdfContext("/Towfiqul_Islam_AI.pdf"),
                    ParsedMdContext("/WEBSITE_CONTEXT.md"),
                    ParsedMdContext("/Towfiqul_Islam.md")
                ]);

                contextRef.current = [
                    `SYSTEM RULES:\n${rulesetContext}`,
                    `Document Context:\n${documentPdfContext}`,
                    `Website Context:\n${websiteContext}`,
                    `AI Knowledge:\n${documentMdContext}`,
                ].join("\n\n");
            } catch (error) {
                console.error("Error initializing AI context:", error);
            }
        };

        loadAllContext().then();

        return () => {
            globalThis.removeEventListener?.("online", handleOnline);
            globalThis.removeEventListener?.("offline", handleOffline);
            coreRef.current?.destroy();
        };
    }, []);

    const send = useCallback(async (text: string): Promise<string | null> => {
        const core = coreRef.current!;
        if (!text.trim() || core.getState().isLoading) return null;
        await core.sendMessage(text);
        const last = core.getState().messages.at(-1);
        return last?.role === "assistant" ? last.content : null;
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
